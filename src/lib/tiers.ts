export type TierId = "free" | "silver" | "gold" | "platinum" | "onyx";

export const TIERS = [
  {
    id: "free" as const,
    name: "Free",
    price: 0,
    dailyCredits: 5,
    features: [
      "TradingView charts (free widget)",
      "5 Nico messages / day",
      "Browse model catalogue",
      "Basic strategy notes",
    ],
    locked: [
      "Code generation (EA / Pine / bots)",
      "Full model run history",
      "Priority Nico context",
      "Multi-pair workspace",
    ],
  },
  {
    id: "silver" as const,
    name: "Silver",
    price: 19,
    dailyCredits: 40,
    features: [
      "Everything in Free",
      "40 Nico messages / day",
      "Strategy drafts for FX / futures / commodities",
      "TradingView multi-symbol watchlist",
      "Export notes",
    ],
    locked: ["MT5 EA code export", "Pine Script full scripts", "Onyx model packs"],
  },
  {
    id: "gold" as const,
    name: "Gold",
    price: 37,
    dailyCredits: 100,
    features: [
      "Everything in Silver",
      "100 Nico messages / day",
      "Pine Script indicator drafts",
      "MT5 signal logic outlines",
      "Strategy version history",
    ],
    locked: ["Full EA source packages", "Tradovate bot scaffolds"],
  },
  {
    id: "platinum" as const,
    name: "Platinum",
    price: 68,
    dailyCredits: 250,
    features: [
      "Everything in Gold",
      "250 Nico messages / day",
      "MT5 EA + indicator scaffolds",
      "TradingView strategy templates",
      "Multi-pair strategy boards",
    ],
    locked: ["Onyx private model packs", "Priority support queue"],
  },
  {
    id: "onyx" as const,
    name: "Onyx",
    price: 170,
    dailyCredits: 800,
    features: [
      "Everything in Platinum",
      "800 Nico messages / day",
      "Full EA / Pine / Tradovate scaffolds",
      "Priority Nico depth",
      "All model packs unlocked",
      "Direct COO escalation path",
    ],
    locked: [] as string[],
  },
];

export function parseTier(t: string | null | undefined): TierId {
  const v = (t || "free").toLowerCase();
  if (v === "silver" || v === "gold" || v === "platinum" || v === "onyx") return v;
  return "free";
}
