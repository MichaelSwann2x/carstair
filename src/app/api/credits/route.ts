import { NextRequest, NextResponse } from "next/server";
import { getRemaining, TIER_LIMITS } from "@/lib/credits";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") || "anon";
  const tier = (req.nextUrl.searchParams.get("tier") || "free") as any;
  const remaining = getRemaining(userId, tier);
  const limits = TIER_LIMITS[tier] || TIER_LIMITS.free;
  return NextResponse.json({ remaining, dailyLimit: limits.dailyCredits, tier });
}
