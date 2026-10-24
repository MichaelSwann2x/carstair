export type Trade = {
  id: string;
  symbol: string;
  side: "Long" | "Short";
  entry: number;
  exit: number;
  size: number;
  pnl: number;
  rMultiple: number;
  grade: "A+" | "A" | "B" | "C" | "D";
  setup: string;
  session: "Asia" | "London" | "New York" | "Overlap";
  emotions: string[];
  openedAt: string;
  closedAt: string;
  accountId: string;
};

export type Account = {
  id: string;
  name: string;
  broker: string;
  type: "live" | "demo" | "prop";
  firm?: string;
  balance: number;
  equity: number;
};

const STORAGE_KEY = "carstair_trades_v1";
const ACCOUNTS_KEY = "carstair_accounts_v1";

export const SAMPLE_TRADES: Trade[] = [
  {
    id: "t1",
    symbol: "EURUSD",
    side: "Long",
    entry: 1.0852,
    exit: 1.0891,
    size: 1.0,
    pnl: 390,
    rMultiple: 1.48,
    grade: "A+",
    setup: "London open break",
    session: "London",
    emotions: ["patient", "disciplined"],
    openedAt: "2026-10-22T08:15:00Z",
    closedAt: "2026-10-22T09:42:00Z",
    accountId: "a1",
  },
  {
    id: "t2",
    symbol: "GBPUSD",
    side: "Short",
    entry: 1.3045,
    exit: 1.3078,
    size: 0.5,
    pnl: -165,
    rMultiple: -0.6,
    grade: "C",
    setup: "Revenge entry",
    session: "London",
    emotions: ["angry", "rushed"],
    openedAt: "2026-10-22T10:01:00Z",
    closedAt: "2026-10-22T10:18:00Z",
    accountId: "a1",
  },
  {
    id: "t3",
    symbol: "XAUUSD",
    side: "Long",
    entry: 2650.4,
    exit: 2668.2,
    size: 0.2,
    pnl: 356,
    rMultiple: 2.1,
    grade: "A",
    setup: "NY session continuation",
    session: "New York",
    emotions: ["calm", "focused"],
    openedAt: "2026-10-23T14:30:00Z",
    closedAt: "2026-10-23T16:05:00Z",
    accountId: "a2",
  },
  {
    id: "t4",
    symbol: "USDJPY",
    side: "Short",
    entry: 149.82,
    exit: 149.21,
    size: 1.5,
    pnl: 610,
    rMultiple: 1.9,
    grade: "A+",
    setup: "Asia range fade",
    session: "Asia",
    emotions: ["patient"],
    openedAt: "2026-10-24T01:20:00Z",
    closedAt: "2026-10-24T03:45:00Z",
    accountId: "a1",
  },
  {
    id: "t5",
    symbol: "EURUSD",
    side: "Short",
    entry: 1.087,
    exit: 1.0845,
    size: 0.8,
    pnl: 200,
    rMultiple: 1.1,
    grade: "B",
    setup: "News reaction",
    session: "Overlap",
    emotions: ["focused"],
    openedAt: "2026-10-24T12:00:00Z",
    closedAt: "2026-10-24T13:10:00Z",
    accountId: "a2",
  },
];

export const SAMPLE_ACCOUNTS: Account[] = [
  { id: "a1", name: "IC Markets MT5", broker: "IC Markets", type: "live", balance: 12450, equity: 12840 },
  { id: "a2", name: "Lucid 50K", broker: "Lucid Trading", type: "prop", firm: "Lucid", balance: 51200, equity: 51840 },
  { id: "a3", name: "FTMO 100K", broker: "FTMO", type: "prop", firm: "FTMO", balance: 100000, equity: 99820 },
];

export function loadTrades(): Trade[] {
  if (typeof window === "undefined") return SAMPLE_TRADES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_TRADES));
      return SAMPLE_TRADES;
    }
    return JSON.parse(raw) as Trade[];
  } catch {
    return SAMPLE_TRADES;
  }
}

export function saveTrades(trades: Trade[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
}

export function loadAccounts(): Account[] {
  if (typeof window === "undefined") return SAMPLE_ACCOUNTS;
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(SAMPLE_ACCOUNTS));
      return SAMPLE_ACCOUNTS;
    }
    return JSON.parse(raw) as Account[];
  } catch {
    return SAMPLE_ACCOUNTS;
  }
}

export function computeLiquidScore(trades: Trade[]) {
  if (trades.length === 0) {
    return { score: 0, winRate: 0, profitFactor: 0, avgR: 0, consistency: 0, discipline: 0 };
  }
  const wins = trades.filter((t) => t.pnl > 0);
  const losses = trades.filter((t) => t.pnl <= 0);
  const winRate = (wins.length / trades.length) * 100;
  const grossWin = wins.reduce((s, t) => s + t.pnl, 0);
  const grossLoss = Math.abs(losses.reduce((s, t) => s + t.pnl, 0)) || 1;
  const profitFactor = grossWin / grossLoss;
  const avgR = trades.reduce((s, t) => s + t.rMultiple, 0) / trades.length;
  const grades = trades.map((t) => (t.grade === "A+" || t.grade === "A" ? 1 : t.grade === "B" ? 0.6 : 0.2));
  const discipline = (grades.reduce((a, b) => a + b, 0) / grades.length) * 100;
  const consistency = Math.min(100, winRate * 0.7 + Math.min(profitFactor, 3) * 10);
  const score = Math.round(
    winRate * 0.25 + Math.min(profitFactor, 3) * 15 + Math.max(0, avgR) * 12 + discipline * 0.25 + consistency * 0.2
  );
  return {
    score: Math.min(100, Math.max(0, score)),
    winRate: Math.round(winRate),
    profitFactor: Math.round(profitFactor * 100) / 100,
    avgR: Math.round(avgR * 100) / 100,
    consistency: Math.round(consistency),
    discipline: Math.round(discipline),
  };
}

/** Minimal MT5 report / CSV parser (Deal,Symbol,Type,Volume,Price,Profit,...) */
export function parseMt5Csv(text: string): Trade[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const header = lines[0].toLowerCase();
  const cols = header.split(/[,;\t]/).map((c) => c.trim());
  const idx = (names: string[]) => cols.findIndex((c) => names.some((n) => c.includes(n)));
  const iSym = idx(["symbol", "instrument"]);
  const iType = idx(["type", "direction", "side"]);
  const iVol = idx(["volume", "lots", "size"]);
  const iPrice = idx(["price", "open", "entry"]);
  const iProfit = idx(["profit", "pnl", "pl"]);
  const iTime = idx(["time", "date", "close"]);
  const out: Trade[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(/[,;\t]/).map((p) => p.trim().replace(/^"|"$/g, ""));
    if (parts.length < 3) continue;
    const symbol = iSym >= 0 ? parts[iSym] : parts[0];
    const rawSide = (iType >= 0 ? parts[iType] : "buy").toLowerCase();
    const side: "Long" | "Short" = rawSide.includes("sell") || rawSide.includes("short") ? "Short" : "Long";
    const size = parseFloat(iVol >= 0 ? parts[iVol] : "0.1") || 0.1;
    const entry = parseFloat(iPrice >= 0 ? parts[iPrice] : "0") || 0;
    const pnl = parseFloat(iProfit >= 0 ? parts[iProfit] : "0") || 0;
    const rMultiple = size > 0 ? Math.round((pnl / (size * 100)) * 100) / 100 : 0;
    const grade: Trade["grade"] =
      rMultiple >= 1.5 ? "A+" : rMultiple >= 1 ? "A" : rMultiple >= 0.5 ? "B" : rMultiple >= 0 ? "C" : "D";
    out.push({
      id: `mt5-${Date.now()}-${i}`,
      symbol: symbol || "UNKNOWN",
      side,
      entry,
      exit: entry,
      size,
      pnl,
      rMultiple,
      grade,
      setup: "MT5 import",
      session: "London",
      emotions: [],
      openedAt: iTime >= 0 ? parts[iTime] : new Date().toISOString(),
      closedAt: new Date().toISOString(),
      accountId: "a1",
    });
  }
  return out;
}

export const PROP_FIRMS = [
  { name: "Lucid Trading", type: "Futures", plans: ["Flex", "Pro", "Daily", "Direct"], note: "EOD drawdown, 90/10" },
  { name: "FTMO", type: "CFD", plans: ["Challenge", "Verification", "FTMO Account"], note: "2-step, trailing" },
  { name: "Funding Pips", type: "CFD", plans: ["1-Step", "2-Step"], note: "CFD forex majors" },
  { name: "The5ers", type: "CFD", plans: ["Hyper", "High Stakes"], note: "Bootcamp + funded" },
  { name: "E8 Markets", type: "CFD", plans: ["E8 One", "E8 Track"], note: "Evaluation to funded" },
  { name: "Blue Guardian", type: "Futures/CFD", plans: ["Instant", "Standard"], note: "Instant options" },
];
