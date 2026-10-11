export type AssetClass = "index" | "futures" | "forex" | "commodity";

export interface GexLevel {
  strike: number;
  gex: number;
  type: "call_wall" | "put_wall" | "flip" | "hvl" | "support" | "resistance";
  strength: "strong" | "moderate" | "weak";
}

export interface GexResult {
  symbol: string;
  assetClass: AssetClass;
  spot: number;
  levels: GexLevel[];
  ivWalls: { strike: number; iv: number; side: "call" | "put" }[];
  summary: string;
  delayed: true;
  generatedAt: string;
}

const BASE_SPOTS: Record<string, number> = {
  ES: 5800, NQ: 20500, RTY: 2200, YM: 42000,
  SPX: 5800, NDX: 20500, RUT: 2200, DJI: 42000,
  CL: 78.5, GC: 2650, SI: 31.2, NG: 2.85,
  EURUSD: 1.085, GBPUSD: 1.305, USDJPY: 149.5, AUDUSD: 0.665,
  "6E": 1.085, "6B": 1.305,
};

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function generateGex(symbol: string, assetClass: AssetClass = "futures"): GexResult {
  const sym = symbol.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const spot = BASE_SPOTS[sym] ?? 100 + (hash(sym) % 5000) / 10;
  const seed = hash(sym + new Date().toISOString().slice(0, 10));
  const levels: GexLevel[] = [];
  const step = assetClass === "forex" ? 0.0025 : assetClass === "commodity" ? 0.5 : 25;
  const range = assetClass === "forex" ? 0.03 : assetClass === "commodity" ? 8 : 400;

  for (let i = -6; i <= 6; i++) {
    if (i === 0) continue;
    const strike = Math.round((spot + i * step * 4) / step) * step;
    const dist = Math.abs(strike - spot);
    const gex = Math.round((seed % 1000 + 200) * (1 - dist / range) * (i > 0 ? 1 : -1));
    let type: GexLevel["type"] = i > 0 ? "call_wall" : "put_wall";
    if (Math.abs(i) === 1) type = "flip";
    if (Math.abs(i) === 2) type = "hvl";
    levels.push({
      strike,
      gex,
      type,
      strength: Math.abs(gex) > 600 ? "strong" : Math.abs(gex) > 300 ? "moderate" : "weak",
    });
  }
  levels.sort((a, b) => a.strike - b.strike);

  const ivWalls = levels
    .filter((l) => l.type === "call_wall" || l.type === "put_wall")
    .slice(0, 6)
    .map((l) => ({
      strike: l.strike,
      iv: 12 + (hash(String(l.strike)) % 40) / 2,
      side: (l.type === "call_wall" ? "call" : "put") as "call" | "put",
    }));

  const nearestCall = levels.find((l) => l.type === "call_wall" && l.strike > spot);
  const nearestPut = [...levels].reverse().find((l) => l.type === "put_wall" && l.strike < spot);

  return {
    symbol: sym,
    assetClass,
    spot,
    levels,
    ivWalls,
    summary: `Delayed GEX for ${sym}: Spot ~${spot.toFixed(assetClass === "forex" ? 4 : 2)}. Nearest call wall ${nearestCall?.strike ?? "n/a"}, put wall ${nearestPut?.strike ?? "n/a"}. Synthetic educational levels for futures / indices / FX / commodities.`,
    delayed: true,
    generatedAt: new Date().toISOString(),
  };
}
