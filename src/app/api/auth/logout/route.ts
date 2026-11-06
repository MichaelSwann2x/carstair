import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Removed — use /api/v1/auth/logout" }, { status: 410 });
}
