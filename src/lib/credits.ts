export type Tier = "free" | "silver" | "gold" | "platinum" | "onyx";

export const TIER_LIMITS: Record<Tier, { dailyCredits: number; models: number; quinQueries: number; gexCalls: number }> = {
  free:     { dailyCredits: 3,   models: 5,   quinQueries: 2,  gexCalls: 2 },
  silver:   { dailyCredits: 25,  models: 15,  quinQueries: 15, gexCalls: 20 },
  gold:     { dailyCredits: 60,  models: 30,  quinQueries: 40, gexCalls: 50 },
  platinum: { dailyCredits: 150, models: 50,  quinQueries: 100, gexCalls: 120 },
  onyx:     { dailyCredits: 500, models: 50,  quinQueries: 300, gexCalls: 400 },
};

export const PRICING = {
  silver:   { price: 19,  name: "Silver" },
  gold:     { price: 37,  name: "Gold" },
  platinum: { price: 68,  name: "Platinum" },
  onyx:     { price: 170, name: "Onyx" },
} as const;

const usageStore = new Map<string, { credits: number; lastReset: string; tier: Tier }>();

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function getOrCreateUser(userId: string, tier: Tier = "free") {
  const key = `${userId}:${todayKey()}`;
  let record = usageStore.get(key);
  if (!record) {
    const limits = TIER_LIMITS[tier];
    record = { credits: limits.dailyCredits, lastReset: todayKey(), tier };
    usageStore.set(key, record);
  }
  return record;
}

export function consumeCredit(userId: string, amount = 1, tier: Tier = "free"): { ok: boolean; remaining: number; message?: string } {
  const user = getOrCreateUser(userId, tier);
  if (user.credits < amount) {
    return { ok: false, remaining: user.credits, message: "Daily credits exhausted. Upgrade or wait for daily reset." };
  }
  user.credits -= amount;
  return { ok: true, remaining: user.credits };
}

export function getRemaining(userId: string, tier: Tier = "free") {
  return getOrCreateUser(userId, tier).credits;
}
