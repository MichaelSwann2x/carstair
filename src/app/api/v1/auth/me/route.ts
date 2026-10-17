import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const session = requireSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    user: session.user,
    tenant: session.tenant,
    demo: session.tenant.isDemo,
  });
}
