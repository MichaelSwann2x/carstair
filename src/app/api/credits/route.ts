import { NextRequest, NextResponse } from "next/server";
import { getRemaining, TIER_LIMITS, parseTier } from "@/lib/credits";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") || "anon";
  const tier = parseTier(req.nextUrl.searchParams.get("tier"));
  const remaining = getRemaining(userId, tier);
  const limits = TIER_LIMITS[tier];
  return NextResponse.json({ remaining, dailyLimit: limits.dailyCredits, tier });
}
