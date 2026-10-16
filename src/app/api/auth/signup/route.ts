import { NextResponse } from "next/server";
export const runtime = "edge";
export async function POST() {
  return NextResponse.json({ error: "Use /login provision flow" }, { status: 410 });
}
