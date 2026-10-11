import { NextResponse } from "next/server";

/** Legacy QUIN endpoint — use /api/nico */
export async function POST() {
  return NextResponse.json(
    {
      error: "QUIN renamed to Nico. POST /api/nico instead.",
    },
    { status: 410 }
  );
}

export async function GET() {
  return NextResponse.json(
    { error: "Gone. Use POST /api/nico." },
    { status: 410 }
  );
}
