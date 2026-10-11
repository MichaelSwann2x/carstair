import { NextResponse } from "next/server";

/** Legacy GEX endpoint removed — use TradingView charts at /app/charts */
export async function POST() {
  return NextResponse.json(
    {
      error: "Synthetic GEX removed. Use /app/charts for live TradingView data.",
    },
    { status: 410 }
  );
}

export async function GET() {
  return NextResponse.json(
    { error: "Gone. Use /app/charts." },
    { status: 410 }
  );
}
