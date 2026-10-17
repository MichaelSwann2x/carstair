import { onAttackSignal } from "../tron";
import type { AttackSignal } from "../tron/types";
import { getUserRecoveryConfig } from "../storage/recovery-config";
import { memoryBlobStore } from "../storage/content-addressed";

/** Thin adapter — wire WAF / auth / integrity monitors here. */
export async function handleSecuritySignal(
  signal: AttackSignal,
  opts: { userId?: string; sessionId?: string; meta?: Record<string, unknown> }
) {
  await onAttackSignal(signal, {
    userId: opts.userId,
    sessionId: opts.sessionId,
    meta: opts.meta ?? {},
    actions: {},
    getUserConfig: getUserRecoveryConfig,
    getLiveData: async (userId) => {
      const list = await memoryBlobStore.list(userId);
      const blobs = new Map<string, Uint8Array>();
      for (const item of list) {
        const data = await memoryBlobStore.get(userId, item.hash);
        if (data) blobs.set(item.hash, data);
      }
      return { manifest: { blobs: list }, blobs };
    },
    getMasterKey: async () => {
      // Ephemeral placeholder — real auth layer supplies master key material; never log.
      const k = new Uint8Array(32);
      crypto.getRandomValues(k);
      return k;
    },
    pushToDestination: async (dest, pkg) => {
      console.info("[TRON logistics] would push package", pkg.packageId, "to", dest.type, dest.endpoint);
    },
    alertOwner: async (userId, message, packageId) => {
      console.info("[TRON alert]", { userId, packageId, message });
    },
  });
}
