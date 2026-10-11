import { NextRequest, NextResponse } from "next/server";
import { consumeCredit, parseTier } from "@/lib/credits";

const RESPONSES: Record<string, string> = {
  default:
    "CARSTAIR QUIN (limited). I help frame questions around gamma, expected moves and session structure for indices, futures, FX and commodities. Credits are limited on free.",
  gex: "Gamma exposure estimates where dealer hedging may create support or resistance. Positive GEX tends to dampen; negative can amplify. Use the GEX tool for delayed educational levels.",
  es: "ES often reacts near large OI strikes and prior session extremes. Combine delayed GEX walls with volume profile for context. Not a trade recommendation.",
  nq: "NQ is momentum-sensitive. Watch call walls above and put walls below the overnight midpoint. Volatility expands around releases.",
  cl: "Crude reacts to inventory and geopolitics. IV walls around round numbers are common educational references.",
  fx: "FX gamma effects are clearest around large options expiries. Focus on nearest 0.5–1% strikes from spot for educational walls.",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = String(body.query || "").toLowerCase();
    const userId = String(body.userId || "anon");
    const tier = parseTier(body.tier);

    const credit = consumeCredit(userId, 1, tier);
    if (!credit.ok) {
      return NextResponse.json(
        { error: credit.message, remaining: credit.remaining },
        { status: 429 }
      );
    }

    let answer = RESPONSES.default;
    if (query.includes("gex") || query.includes("gamma")) answer = RESPONSES.gex;
    else if (query.includes("es") || query.includes("spx")) answer = RESPONSES.es;
    else if (query.includes("nq") || query.includes("ndx")) answer = RESPONSES.nq;
    else if (query.includes("cl") || query.includes("oil") || query.includes("crude"))
      answer = RESPONSES.cl;
    else if (
      query.includes("eur") ||
      query.includes("gbp") ||
      query.includes("jpy") ||
      query.includes("fx") ||
      query.includes("forex")
    )
      answer = RESPONSES.fx;

    return NextResponse.json({
      answer,
      remainingCredits: credit.remaining,
      limited: true,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
