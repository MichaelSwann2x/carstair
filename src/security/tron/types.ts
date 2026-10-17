export type AttackSignal = {
  type: "probe" | "mass-decrypt" | "binary-tamper" | "unauthorized-admin" | "anomaly-score";
  severity: "low" | "medium" | "high" | "critical";
  evidence: Record<string, unknown>;
  detectedAt: string;
};

export type CohortName = "recon" | "shield" | "lockdown" | "decoy" | "isolate" | "logistics";

export interface SoldierReport {
  soldierId: string;
  cohort: CohortName;
  success: boolean;
  detail?: string;
}

export interface BattleContext {
  signal: AttackSignal;
  userId?: string;
  sessionId?: string;
  requestMeta: Record<string, unknown>;
  actions: {
    rateLimit: (key: string, ms: number) => Promise<void>;
    temporaryLock: (target: string, seconds: number) => Promise<void>;
    emitDecoy: (response: unknown) => Promise<void>;
    deepenLog: (extra: Record<string, unknown>) => Promise<void>;
    isolateSession: (sessionId: string) => Promise<void>;
    triggerConsentedBackup: (userId: string, signal: AttackSignal) => Promise<void>;
    spawnExtraSoldiers: (cohort: CohortName, count: number) => Promise<void>;
  };
}
