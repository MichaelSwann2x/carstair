import { NextRequest, NextResponse } from "next/server";
import { TIER_LIMITS, parseTier } from "@/lib/credits";

const SAMPLE_MODELS: { id: string; name: string; category: string }[] = [
  { id: "net-gex", name: "Net Gamma Exposure", category: "Positioning" },
  { id: "call-resistance", name: "Call Resistance Levels", category: "Positioning" },
  { id: "put-support", name: "Put Support Levels", category: "Positioning" },
  { id: "hvl", name: "High Vol Level", category: "Volatility" },
  { id: "1d-em", name: "1-Day Expected Move", category: "Volatility" },
  { id: "vrp", name: "Volatility Risk Premium", category: "Volatility" },
  { id: "skew", name: "Volatility Skew", category: "Volatility" },
  { id: "term-structure", name: "IV Term Structure", category: "Volatility" },
  { id: "q-score", name: "Q-Score Momentum", category: "Momentum" },
  { id: "cta-flow", name: "CTA Positioning Proxy", category: "Flow" },
  { id: "oi-profile", name: "Open Interest Profile", category: "Positioning" },
  { id: "volume-profile", name: "Volume Profile Nodes", category: "Structure" },
  { id: "blind-spot", name: "Blind Spot Levels", category: "Cross-asset" },
  { id: "fx-gamma", name: "FX Options Gamma", category: "FX" },
  { id: "commodity-gex", name: "Commodity Futures GEX", category: "Commodities" },
];

const CATEGORIES = ["Positioning", "Volatility", "Momentum", "Flow", "Structure"];
while (SAMPLE_MODELS.length < 52) {
  const i = SAMPLE_MODELS.length;
  SAMPLE_MODELS.push({
    id: `model-${i}`,
    name: `Quantitative Model ${i}`,
    category: CATEGORIES[i % 5],
  });
}

export async function GET(req: NextRequest) {
  const tier = parseTier(req.nextUrl.searchParams.get("tier"));
  const limits = TIER_LIMITS[tier];
  const models = SAMPLE_MODELS.slice(0, limits.models).map((m) => ({
    ...m,
    delayed: true as const,
    status: "preview" as const,
  }));
  return NextResponse.json({ count: models.length, totalAvailable: 52, models, tier });
}
