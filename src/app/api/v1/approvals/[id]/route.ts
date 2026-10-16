import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import { store } from "@/lib/server/store";
import { writeAudit } from "@/lib/server/audit";
import { canCertify } from "@/lib/server/types";
import { z } from "zod";

export const runtime = "edge";

const Body = z.object({ status: z.enum(["approved", "rejected"]) });

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = requireSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const item = store.getApproval(id);
  if (!item || item.tenantId !== session.tenant.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = Body.parse(await req.json());
  if (item.requiresCertifying && !canCertify(session.user.role)) {
    await writeAudit(
      session.tenant.id,
      session.user,
      "approval.denied_role",
      "approval",
      id,
      "Approval blocked — requires certifying staff",
      {}
    );
    return NextResponse.json({ error: "Requires certifying staff or admin" }, { status: 403 });
  }
  const next = {
    ...item,
    status: body.status,
    resolvedAt: new Date().toISOString(),
    resolvedBy: session.user.id,
  };
  store.putApproval(next);
  await writeAudit(
    session.tenant.id,
    session.user,
    body.status === "approved" ? "approval.approved" : "approval.rejected",
    "approval",
    id,
    `${body.status}: ${item.title}`,
    {}
  );
  return NextResponse.json({ data: next });
}
