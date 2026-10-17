import { randomBytes } from "@noble/hashes/utils";
import { bytesToHex } from "@noble/hashes/utils";
import { encryptPackage } from "../crypto/envelope";
import type { UserRecoveryConfig, BackdropDestination } from "../storage/recovery-config";
import type { AttackSignal } from "../tron/types";

export interface RecoveryPackage {
  userId: string;
  packageId: string;
  encryptedManifest: Uint8Array;
  encryptedBlobs: { hash: string; ciphertext: Uint8Array }[];
  createdAt: string;
  signal: AttackSignal;
}

/**
 * NEVER runs without UserRecoveryConfig.optInActive === true.
 * Recovery packages are encrypted with the user's master-key material before leaving.
 */
export async function maybeExportOnAttack(
  userId: string,
  signal: AttackSignal,
  getUserConfig: (id: string) => Promise<UserRecoveryConfig | null>,
  getLiveData: (id: string) => Promise<{ manifest: unknown; blobs: Map<string, Uint8Array> }>,
  getMasterKey: (userId: string) => Promise<Uint8Array>,
  pushToDestination: (dest: BackdropDestination, pkg: RecoveryPackage) => Promise<void>,
  alertOwner: (userId: string, message: string, packageId: string) => Promise<void>
): Promise<void> {
  const config = await getUserConfig(userId);
  if (!config || !config.optInActive) {
    return;
  }
  if (signal.severity !== "high" && signal.severity !== "critical") {
    return;
  }

  const live = await getLiveData(userId);
  const masterKey = await getMasterKey(userId);
  const packageId = bytesToHex(randomBytes(16));
  const encrypted = await encryptPackage(live, masterKey);

  const pkg: RecoveryPackage = {
    userId,
    packageId,
    encryptedManifest: encrypted.manifest,
    encryptedBlobs: encrypted.blobs,
    createdAt: new Date().toISOString(),
    signal,
  };

  for (const dest of config.destinations.filter((d) => d.enabled)) {
    try {
      await pushToDestination(dest, pkg);
    } catch (err) {
      console.error(`Backdrop push failed for ${dest.id}`, err);
    }
  }

  await alertOwner(
    userId,
    `Attack signal (${signal.type}/${signal.severity}) detected. ` +
      `Encrypted recovery package ${packageId} pushed to your designated backdrop(s). ` +
      `Retrieve offline with your master key. One-time token (if issued) expires in 24 h.`,
    packageId
  );
}
