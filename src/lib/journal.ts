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
  notes: string;
  openedAt: string;
  closedAt: string;
  accountId: string;
};

export type Account = {
  id: string;
  name: string;
  broker: string;
  type: "live" | "prop";
  firm?: string;
  balance: number;
  equity: number;
  stage?: "eval" | "funded" | "blown";
};

const STORAGE_KEY = "carstair_trades_v2";
const ACCOUNTS_KEY = "carstair_accounts_v2";

export const DEFAULT_ACCOUNTS: Account[] = [
  { id: "a1", name: "IC Markets MT5", broker: "IC Markets", type: "live", balance: 0, equity: 0, stage: "funded" },
  { id: "a2", name: "Lucid 50K", broker: "Lucid Trading", type: "prop", firm: "Lucid", balance: 50000, equity: 50000, stage: "eval" },
  { id: "a3", name: "FTMO 100K", broker: "FTMO", type: "prop", firm: "FTMO", balance: 100000, equity: 100000, stage: "eval" },
];

export function loadTrades(): Trade[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Trade[];
  } catch {
    return [];
  }
}

export function saveTrades(trades: Trade[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
}

export function loadAccounts(): Account[] {
  if (typeof window === "undefined") return DEFAULT_ACCOUNTS;
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    return JSON.parse(raw) as Account[];
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

export function saveAccounts(accounts: Account[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
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

/** Last N calendar days → { date, pnl, count } */
export function lastNDays(trades: Trade[], n = 7) {
  const days: { date: string; pnl: number; count: number }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const list = trades.filter((t) => (t.closedAt || t.openedAt).slice(0, 10) === key);
    days.push({
      date: key,
      pnl: list.reduce((s, t) => s + t.pnl, 0),
      count: list.length,
    });
  }
  return days;
}

/** Month grid for P&L calendar */
export function monthGrid(trades: Trade[], year: number, month: number) {
  // month 0-11
  const first = new Date(year, month, 1);
  const startPad = (first.getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: { day: number | null; date: string | null; pnl: number; count: number }[] = [];
  for (let i = 0; i < startPad; i++) cells.push({ day: null, date: null, pnl: 0, count: 0 });
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const list = trades.filter((t) => (t.closedAt || t.openedAt).slice(0, 10) === date);
    cells.push({
      day,
      date,
      pnl: list.reduce((s, t) => s + t.pnl, 0),
      count: list.length,
    });
  }
  return cells;
}

export function equitySeries(trades: Trade[]) {
  const sorted = [...trades].sort(
    (a, b) => new Date(a.closedAt || a.openedAt).getTime() - new Date(b.closedAt || b.openedAt).getTime()
  );
  let cum = 0;
  return sorted.map((t) => {
    cum += t.pnl;
    return { t: t.closedAt || t.openedAt, v: cum };
  });
}

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
      notes: "",
      openedAt: iTime >= 0 ? parts[iTime] : new Date().toISOString(),
      closedAt: new Date().toISOString(),
      accountId: "a1",
    });
  }
  return out;
}

export const PROP_FIRMS = [
  { name: "Lucid Trading", type: "Futures", plans: ["Flex", "Pro", "Daily", "Direct"], note: "EOD drawdown" },
  { name: "FTMO", type: "CFD", plans: ["Challenge", "Verification", "Funded"], note: "2-step" },
  { name: "Funding Pips", type: "CFD", plans: ["1-Step", "2-Step"], note: "CFD majors" },
  { name: "The5ers", type: "CFD", plans: ["Hyper", "High Stakes"], note: "Bootcamp" },
  { name: "E8 Markets", type: "CFD", plans: ["E8 One", "E8 Track"], note: "Eval to funded" },
  { name: "Blue Guardian", type: "Futures/CFD", plans: ["Instant", "Standard"], note: "Instant options" },
  { name: "Topstep", type: "Futures", plans: ["Trading Combine"], note: "Futures eval" },
  { name: "Apex", type: "Futures", plans: ["PA", "Full"], note: "Futures" },
];

export const EMOTION_OPTS = ["patient", "disciplined", "calm", "focused", "rushed", "angry", "FOMO", "hesitant"];
