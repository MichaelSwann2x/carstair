import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import { store, uid } from "@/lib/server/store";
import { writeAudit } from "@/lib/server/audit";
import { z } from "zod";
import type { Approval } from "@/lib/server/types";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const session = requireSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ data: store.listApprovals(session.tenant.id) });
}

const Create = z.object({
  title: z.string(),
  summary: z.string(),
  agentId: z.string().optional(),
  payload: z.unknown().optional(),
  requiresCertifying: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  const session = requireSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = Create.parse(await req.json());
  const a: Approval = {
    id: uid(),
    tenantId: session.tenant.id,
    title: body.title,
    summary: body.summary,
    agentId: body.agentId,
    payload: body.payload,
    status: "pending",
    requiresCertifying: body.requiresCertifying,
    createdAt: new Date().toISOString(),
  };
  store.putApproval(a);
  await writeAudit(
    session.tenant.id,
    session.user,
    "approval.created",
    "approval",
    a.id,
    a.title,
    a
  );
  return NextResponse.json({ data: a }, { status: 201 });
}
