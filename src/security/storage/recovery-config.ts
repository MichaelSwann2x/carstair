export interface BackdropDestination {
  id: string;
  type: "s3" | "sftp" | "https-put" | "email-encrypted" | "custom";
  endpoint: string;
  credentialsRef: string;
  pathPrefix?: string;
  enabled: boolean;
}

export interface UserRecoveryConfig {
  userId: string;
  /** Explicit tick-box — required before any automatic recovery export. */
  optInActive: boolean;
  destinations: BackdropDestination[];
  masterKeyFingerprint: string;
  lastExportAt?: string;
}

const g = globalThis as unknown as { __castair_recovery?: Map<string, UserRecoveryConfig> };
function table() {
  if (!g.__castair_recovery) g.__castair_recovery = new Map();
  return g.__castair_recovery;
}

export async function getUserRecoveryConfig(userId: string): Promise<UserRecoveryConfig | null> {
  return table().get(userId) ?? null;
}

export async function saveUserRecoveryConfig(cfg: UserRecoveryConfig): Promise<void> {
  table().set(cfg.userId, { ...cfg, destinations: [...cfg.destinations] });
}

export function defaultRecoveryConfig(userId: string): UserRecoveryConfig {
  return {
    userId,
    optInActive: false,
    destinations: [],
    masterKeyFingerprint: "",
  };
}
