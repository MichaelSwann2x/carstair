import { NextRequest, NextResponse } from "next/server";
import { generateGex, type AssetClass } from "@/lib/gex";
import { consumeCredit, parseTier } from "@/lib/credits";

const VALID_ASSET: AssetClass[] = ["index", "futures", "forex", "commodity"];

function parseAssetClass(value: unknown): AssetClass {
  if (typeof value === "string" && VALID_ASSET.includes(value as AssetClass)) {
    return value as AssetClass;
  }
  return "futures";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const symbol = String(body.symbol || "ES").toUpperCase().replace(/[^A-Z0-9]/g, "") || "ES";
    const assetClass = parseAssetClass(body.assetClass);
    const userId = String(body.userId || "anon");
    const tier = parseTier(body.tier);

    const credit = consumeCredit(userId, 1, tier);
    if (!credit.ok) {
      return NextResponse.json(
        { error: credit.message, remaining: credit.remaining },
        { status: 429 }
      );
    }

    const result = generateGex(symbol, assetClass);
    return NextResponse.json({ ...result, remainingCredits: credit.remaining });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
