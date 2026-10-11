import { NextResponse } from "next/server";

const MODELS = [
  { id: "m1", name: "Session breakout (FX)", category: "Forex", minTier: "free" },
  { id: "m2", name: "RTH opening range (ES/NQ)", category: "Futures", minTier: "free" },
  { id: "m3", name: "DXY correlation filter", category: "Macro", minTier: "silver" },
  { id: "m4", name: "Gold mean-revert band", category: "Commodities", minTier: "silver" },
  { id: "m5", name: "Oil inventory week frame", category: "Commodities", minTier: "gold" },
  { id: "m6", name: "Multi-pair risk budget", category: "Risk", minTier: "gold" },
  { id: "m7", name: "London–NY handoff", category: "Forex", minTier: "platinum" },
  { id: "m8", name: "Term-structure tilt", category: "Futures", minTier: "platinum" },
  { id: "m9", name: "Onyx regime pack", category: "Research", minTier: "onyx" },
  { id: "m10", name: "Cross-asset stress map", category: "Research", minTier: "onyx" },
];

export async function GET() {
  return NextResponse.json({ models: MODELS });
}
