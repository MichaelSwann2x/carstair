/** Hard per-user real byte quota. Reject any write that would exceed it. */

export interface QuotaState {
  userId: string;
  usedBytes: number;
  limitBytes: number;
}

/** Default: client-primary design — 2 GiB server-side index/blob ceiling per user.
 * Raise toward 85 GiB only when durable object storage is provisioned. */
export const DEFAULT_LIMIT_BYTES = 2 * 1024 * 1024 * 1024;

const g = globalThis as unknown as { __castair_quota?: Map<string, QuotaState> };
function table() {
  if (!g.__castair_quota) g.__castair_quota = new Map();
  return g.__castair_quota;
}

export async function getQuotaState(userId: string): Promise<QuotaState> {
  const t = table();
  let s = t.get(userId);
  if (!s) {
    s = { userId, usedBytes: 0, limitBytes: DEFAULT_LIMIT_BYTES };
    t.set(userId, s);
  }
  return { ...s };
}

export async function saveQuotaState(state: QuotaState): Promise<void> {
  table().set(state.userId, { ...state });
}

export async function checkAndReserve(
  userId: string,
  additionalBytes: number,
  getState: (id: string) => Promise<QuotaState> = getQuotaState,
  saveState: (state: QuotaState) => Promise<void> = saveQuotaState
): Promise<boolean> {
  if (additionalBytes < 0) return false;
  const state = await getState(userId);
  if (state.usedBytes + additionalBytes > state.limitBytes) {
    return false;
  }
  state.usedBytes += additionalBytes;
  await saveState(state);
  return true;
}

export async function releaseBytes(
  userId: string,
  bytes: number,
  getState: (id: string) => Promise<QuotaState> = getQuotaState,
  saveState: (state: QuotaState) => Promise<void> = saveQuotaState
): Promise<void> {
  const state = await getState(userId);
  state.usedBytes = Math.max(0, state.usedBytes - bytes);
  await saveState(state);
}
