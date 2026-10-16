import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import { store, uid } from "@/lib/server/store";
import { writeAudit } from "@/lib/server/audit";
import { z } from "zod";
import type { TaskCard } from "@/lib/server/types";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const session = requireSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ data: store.listTaskCards(session.tenant.id) });
}

const Create = z.object({
  aircraftId: z.string(),
  title: z.string().min(1),
  description: z.string().default(""),
  riiRequired: z.boolean().default(false),
  workPackageId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = requireSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role === "viewer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = Create.parse(await req.json());
  const tc: TaskCard = {
    id: uid(),
    tenantId: session.tenant.id,
    aircraftId: body.aircraftId,
    workPackageId: body.workPackageId,
    title: body.title,
    description: body.description,
    status: body.riiRequired ? "open" : "open",
    riiRequired: body.riiRequired,
    signatures: [],
    updatedAt: new Date().toISOString(),
  };
  store.putTaskCard(tc);
  await writeAudit(
    session.tenant.id,
    session.user,
    "task_card.create",
    "task_card",
    tc.id,
    `Created task card: ${tc.title}`,
    tc
  );
  return NextResponse.json({ data: tc }, { status: 201 });
}
