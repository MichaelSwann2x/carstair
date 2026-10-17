/** Offline outbox — never silent LWW for signatures/findings */

export type OutboxOp = {
  id: string;
  method: string;
  path: string;
  body?: unknown;
  createdAt: string;
  entityType: string;
  conflictSafe: boolean; // false for signatures/findings — require UI review
};

const KEY = "castair_outbox_v1";
const CACHE_KEY = "castair_cache_domain_v1";

export function loadOutbox(): OutboxOp[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveOutbox(ops: OutboxOp[]) {
  localStorage.setItem(KEY, JSON.stringify(ops));
}

export function enqueueOutbox(op: Omit<OutboxOp, "id" | "createdAt">) {
  const ops = loadOutbox();
  ops.push({
    ...op,
    id: crypto.randomUUID?.() ?? `op_${Date.now()}`,
    createdAt: new Date().toISOString(),
  });
  saveOutbox(ops);
}

export function cacheDomain(data: unknown) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
}

export function loadCachedDomain<T>(): T | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw).data as T;
  } catch {
    return null;
  }
}

export async function flushOutbox(
  send: (op: OutboxOp) => Promise<{ ok: boolean; conflict?: boolean; error?: string }>
): Promise<{ applied: number; conflicts: OutboxOp[] }> {
  const ops = loadOutbox();
  const remaining: OutboxOp[] = [];
  const conflicts: OutboxOp[] = [];
  let applied = 0;
  for (const op of ops) {
    if (!op.conflictSafe) {
      conflicts.push(op);
      remaining.push(op);
      continue;
    }
    const res = await send(op);
    if (res.ok) applied++;
    else remaining.push(op);
  }
  saveOutbox(remaining);
  return { applied, conflicts };
}
