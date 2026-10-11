import { NextRequest, NextResponse } from "next/server";
import { generateGex, type AssetClass } from "@/lib/gex";
import { consumeCredit } from "@/lib/credits";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const symbol = String(body.symbol || "ES").toUpperCase();
    const assetClass = (body.assetClass || "futures") as AssetClass;
    const userId = String(body.userId || "anon");
    const tier = (body.tier || "free") as any;
    const credit = consumeCredit(userId, 1, tier);
    if (!credit.ok) {
      return NextResponse.json({ error: credit.message, remaining: credit.remaining }, { status: 429 });
    }
    const result = generateGex(symbol, assetClass);
    return NextResponse.json({ ...result, remainingCredits: credit.remaining });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
