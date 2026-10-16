import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "castair",
    time: new Date().toISOString(),
  });
}
