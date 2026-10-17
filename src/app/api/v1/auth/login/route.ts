import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Password login requires D1 user records. Use demo or provision for now.",
    },
    { status: 501 }
  );
}
