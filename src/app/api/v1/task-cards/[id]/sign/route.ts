import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import { store } from "@/lib/server/store";
import { writeAudit } from "@/lib/server/audit";
import { canCertify } from "@/lib/server/types";
import { z } from "zod";

export const runtime = "edge";

const Body = z.object({
  kind: z.enum(["performer", "rii"]),
});

async function sigHash(parts: string[]) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(parts.join("|")));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 24);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = requireSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const card = store.getTaskCard(id);
  if (!card || card.tenantId !== session.tenant.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = Body.parse(await req.json());

  if (body.kind === "rii") {
    if (!canCertify(session.user.role)) {
      await writeAudit(
        session.tenant.id,
        session.user,
        "task_card.rii_sign_denied",
        "task_card",
        id,
        "RII signature blocked — role not certifying staff",
        { role: session.user.role }
      );
      return NextResponse.json(
        { error: "Only certifying staff or admin may apply RII / release signature" },
        { status: 403 }
      );
    }
  }

  const at = new Date().toISOString();
  const hash = await sigHash([id, session.user.id, at, body.kind]);
  const signatures = [
    ...card.signatures,
    {
      role: body.kind === "rii" ? "rii" : session.user.role,
      name: session.user.name,
      userId: session.user.id,
      at,
      hash,
    },
  ];
  let status = card.status;
  if (body.kind === "performer") {
    status = card.riiRequired ? "rii_pending" : "signed";
  } else {
    status = "signed";
  }
  const next = { ...card, signatures, status, updatedAt: at };
  store.putTaskCard(next);
  await writeAudit(
    session.tenant.id,
    session.user,
    body.kind === "rii" ? "task_card.rii_sign" : "task_card.performer_sign",
    "task_card",
    id,
    `${body.kind} signed: ${card.title}`,
    { hash, status }
  );
  return NextResponse.json({ data: next });
}
