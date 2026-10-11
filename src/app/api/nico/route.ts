import { NextRequest, NextResponse } from "next/server";
import { consume, parseTier } from "@/lib/credits";

function nicoReply(query: string, tier: string): string {
  const q = query.toLowerCase();
  const codeOk = ["gold", "platinum", "onyx"].includes(tier);
  const eaOk = ["platinum", "onyx"].includes(tier);

  if (q.includes("pine") || q.includes("tradingview") || q.includes("indicator")) {
    if (!codeOk) {
      return (
        "Pine / indicator scaffolding unlocks from Gold. On your plan I can outline logic only:\n\n" +
        "• Define the signal (e.g. session high break + ATR filter)\n" +
        "• Confirm HTF bias before entry\n" +
        "• Risk: fixed % or R-multiple stop\n\nUpgrade to Gold+ for structured Pine drafts."
      );
    }
    return (
      "TradingView Pine outline (educational):\n\n" +
      "```pine\n//@version=5\nindicator(\"CARSTAIR Session Break\", overlay=true)\nsessionHigh = request.security(syminfo.tickerid, \"60\", high)\natr = ta.atr(14)\nlongCond = ta.crossover(close, sessionHigh) and close > open\nplotshape(longCond, style=shape.triangleup, color=color.teal)\n```\n\n" +
      "Next: add your session window, filter with DXY or correlated future, and backtest on the chart. Not live signals."
    );
  }

  if (q.includes("mt5") || q.includes("ea") || q.includes("expert")) {
    if (!eaOk) {
      return (
        "Full MT5 EA scaffolds open on Platinum and Onyx. On your tier:\n\n" +
        "1) Separate signal vs execution modules\n" +
        "2) Symbol-normalise lots for FX vs futures\n" +
        "3) Hard daily loss halt\n\nI can still help design the rules — upgrade for MQL5 structure."
      );
    }
    return (
      "MT5 EA scaffold notes (educational):\n\n" +
      "• OnTick: only evaluate on new bar if bar-based\n" +
      "• Inputs: RiskPercent, MaxSpread, Magic\n" +
      "• Check SymbolInfoInteger for trade mode\n" +
      "• Use OrderSend with deviation and filling mode for your broker\n" +
      "• Log every reject reason\n\n" +
      "For futures vs FX, normalise volume via tick value / contract size. Test on demo first."
    );
  }

  if (q.includes("eur") || q.includes("gbp") || q.includes("jpy") || q.includes("fx") || q.includes("forex")) {
    return (
      "FX frame (educational):\n\n" +
      "1) Session: London open / NY overlap for EUR & GBP liquidity\n" +
      "2) Bias: prior day high/low + DXY direction\n" +
      "3) Entry: break-retest or failure of session extreme\n" +
      "4) Risk: 0.25–0.5% if discretionary; define invalidation before size\n\n" +
      "Pair this with the Charts tab (TradingView free widget) for the actual tape — I don't invent levels."
    );
  }

  if (q.includes("es") || q.includes("nq") || q.includes("future") || q.includes("gold") || q.includes("oil") || q.includes("cl")) {
    return (
      "Futures / commodities frame (educational):\n\n" +
      "• Respect RTH vs overnight liquidity (ES/NQ)\n" +
      "• Gold: watch real yields / DXY correlation regime\n" +
      "• Oil: inventory days and USD; avoid guessing headlines\n" +
      "• Size off stop distance in ticks, not gut\n\n" +
      "Use Charts for live structure. Ask me to turn a rule into a checklist or code scaffold if your tier allows."
    );
  }

  if (q.includes("strategy") || q.includes("system") || q.includes("backtest")) {
    return (
      "Strategy build checklist:\n\n" +
      "1) Market + timeframe + session\n" +
      "2) Edge hypothesis in one sentence\n" +
      "3) Entry, stop, target or trail — explicit\n" +
      "4) Filters that reduce trades, not add lag\n" +
      "5) Daily loss stop and max trades\n" +
      "6) Journal: screenshot + reason + R\n\n" +
      "Tell me the pair and style (breakout, mean-revert, news-avoid) and I'll tighten the rules."
    );
  }

  return (
    "I focus on FX, futures and commodities: session logic, risk frames, strategy editing, and code scaffolds (Pine / MT5 / bot outlines by tier).\n\n" +
    `You asked: "${query.slice(0, 200)}"\n\n` +
    "Give me: instrument, timeframe, and whether you want rules, risk, or code — and I'll go specific. Educational only, not advice."
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = String(body.query || "").trim();
    const userId = String(body.userId || "anon");
    const tier = parseTier(body.tier);
    if (!query) {
      return NextResponse.json({ error: "Empty query" }, { status: 400 });
    }
    const { ok, remaining } = consume(userId, tier, 1);
    if (!ok) {
      return NextResponse.json(
        { error: "Daily Nico credits used. Upgrade in Billing or wait until reset.", remaining },
        { status: 429 }
      );
    }
    const answer = nicoReply(query, tier);
    return NextResponse.json({ answer, remainingCredits: remaining, tier });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
