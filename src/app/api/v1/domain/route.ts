import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import { store } from "@/lib/server/store";

export const runtime = "edge";

/** Bundle domain lists for app shell hydration */
export async function GET(req: NextRequest) {
  const session = requireSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tid = session.tenant.id;
  return NextResponse.json({
    aircraft: store.listAircraft(tid),
    workPackages: store.listWorkPackages(tid),
    taskCards: store.listTaskCards(tid),
    mel: store.listMel(tid),
    components: store.listComponents(tid),
    adSb: store.listAdSb(tid),
    approvals: store.listApprovals(tid),
    audit: store.listAudit(tid).slice(0, 100),
    tenant: session.tenant,
    user: session.user,
  });
}
