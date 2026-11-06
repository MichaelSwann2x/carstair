import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "Removed — use /api/v1/auth/me" }, { status: 410 });
}
