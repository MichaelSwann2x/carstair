import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex } from "@noble/hashes/utils";
import { checkAndReserve, releaseBytes } from "./quota";

export function contentHash(data: Uint8Array): string {
  return bytesToHex(sha256(data));
}

export interface BlobStore {
  put(userId: string, hash: string, data: Uint8Array): Promise<void>;
  get(userId: string, hash: string): Promise<Uint8Array | null>;
  exists(userId: string, hash: string): Promise<boolean>;
  delete(userId: string, hash: string): Promise<void>;
  list(userId: string): Promise<{ hash: string; size: number }[]>;
}

const g = globalThis as unknown as {
  __castair_blobs?: Map<string, Uint8Array>;
};
function blobs() {
  if (!g.__castair_blobs) g.__castair_blobs = new Map();
  return g.__castair_blobs;
}
function key(userId: string, hash: string) {
  return `${userId}:${hash}`;
}

/** Content-addressed store with hard quota. Swap for D1/R2 persistence later. */
export const memoryBlobStore: BlobStore = {
  async put(userId, hash, data) {
    const k = key(userId, hash);
    if (blobs().has(k)) return;
    const ok = await checkAndReserve(userId, data.byteLength);
    if (!ok) {
      throw new Error("QUOTA_EXCEEDED");
    }
    blobs().set(k, data);
  },
  async get(userId, hash) {
    return blobs().get(key(userId, hash)) ?? null;
  },
  async exists(userId, hash) {
    return blobs().has(key(userId, hash));
  },
  async delete(userId, hash) {
    const k = key(userId, hash);
    const existing = blobs().get(k);
    if (!existing) return;
    await releaseBytes(userId, existing.byteLength);
    blobs().delete(k);
  },
  async list(userId) {
    const prefix = `${userId}:`;
    const out: { hash: string; size: number }[] = [];
    for (const [k, v] of blobs()) {
      if (k.startsWith(prefix)) {
        out.push({ hash: k.slice(prefix.length), size: v.byteLength });
      }
    }
    return out;
  },
};

export async function putUserBlob(userId: string, data: Uint8Array): Promise<string> {
  const hash = contentHash(data);
  await memoryBlobStore.put(userId, hash, data);
  return hash;
}
