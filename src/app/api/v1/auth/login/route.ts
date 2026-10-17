import { NextResponse } from "next/server";

export const runtime = "edge";

/** Password login lands after D1 user rows + AUTH_SECRET are wired. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Password login requires D1 user records. Use demo or provision for now.",
    },
    { status: 501 }
  );
}
