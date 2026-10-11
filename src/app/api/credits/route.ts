import { NextRequest, NextResponse } from "next/server";
import { getRemaining, parseTier } from "@/lib/credits";
import { TIERS } from "@/lib/tiers";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") || "anon";
  const tier = parseTier(req.nextUrl.searchParams.get("tier"));
  const remaining = getRemaining(userId, tier);
  const dailyLimit = TIERS.find((t) => t.id === tier)?.dailyCredits ?? 5;
  return NextResponse.json({ remaining, dailyLimit, tier });
}
