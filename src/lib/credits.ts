import { parseTier, type TierId, TIERS } from "./tiers";

type Bucket = { day: string; used: number };
const store = new Map<string, Bucket>();

function today() {
  return new Date().toISOString().slice(0, 10);
}

function limitFor(tier: TierId) {
  return TIERS.find((t) => t.id === tier)?.dailyCredits ?? 5;
}

export function getRemaining(userId: string, tier: TierId): number {
  const key = `${userId}:${tier}`;
  const b = store.get(key);
  const lim = limitFor(tier);
  if (!b || b.day !== today()) return lim;
  return Math.max(0, lim - b.used);
}

export function consume(userId: string, tier: TierId, cost = 1): { ok: boolean; remaining: number } {
  const key = `${userId}:${tier}`;
  const lim = limitFor(tier);
  let b = store.get(key);
  if (!b || b.day !== today()) b = { day: today(), used: 0 };
  if (b.used + cost > lim) {
    store.set(key, b);
    return { ok: false, remaining: Math.max(0, lim - b.used) };
  }
  b.used += cost;
  store.set(key, b);
  return { ok: true, remaining: lim - b.used };
}

export { parseTier, type TierId };
