import { NextResponse } from "next/server";
export const runtime = "edge";
export async function POST() {
  return NextResponse.json({ error: "Use /login demo flow" }, { status: 410 });
}
