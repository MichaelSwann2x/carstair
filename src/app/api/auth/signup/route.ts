import { NextResponse } from "next/server";
export const runtime = "edge";
export async function POST() {
  return NextResponse.json({ error: "Removed — use /api/v1/auth/provision" }, { status: 410 });
}
