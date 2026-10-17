import type { AttackSignal, BattleContext, CohortName, SoldierReport } from "./types";

export type Rank = "general" | "captain" | "soldier";

export interface Soldier {
  id: string;
  cohort: CohortName;
  rank: "soldier";
  run: (ctx: BattleContext) => Promise<SoldierReport>;
}

export interface Captain {
  cohort: CohortName;
  rank: "captain";
  soldiers: Soldier[];
  maxSoldiers: number;
  activate: (ctx: BattleContext, count?: number) => Promise<SoldierReport[]>;
}

export interface General {
  rank: "general";
  captains: Map<CohortName, Captain>;
  command: (signal: AttackSignal, ctx: BattleContext) => Promise<void>;
}

function makeReconSoldier(id: string): Soldier {
  return {
    id,
    cohort: "recon",
    rank: "soldier",
    async run(ctx) {
      await ctx.actions.deepenLog({
        phase: "recon",
        ip: ctx.requestMeta.ip,
        ua: ctx.requestMeta.ua,
        signal: ctx.signal.type,
      });
      return { soldierId: id, cohort: "recon", success: true };
    },
  };
}

function makeShieldSoldier(id: string): Soldier {
  return {
    id,
    cohort: "shield",
    rank: "soldier",
    async run(ctx) {
      const key = (ctx.requestMeta.ip as string) || ctx.sessionId || "unknown";
      await ctx.actions.rateLimit(key, 45_000);
      return { soldierId: id, cohort: "shield", success: true };
    },
  };
}

function makeLockdownSoldier(id: string): Soldier {
  return {
    id,
    cohort: "lockdown",
    rank: "soldier",
    async run(ctx) {
      if (ctx.signal.severity === "critical" || ctx.signal.severity === "high") {
        await ctx.actions.temporaryLock(ctx.userId || "global", 300);
      }
      return { soldierId: id, cohort: "lockdown", success: true };
    },
  };
}

function makeDecoySoldier(id: string): Soldier {
  return {
    id,
    cohort: "decoy",
    rank: "soldier",
    async run(ctx) {
      await ctx.actions.emitDecoy({ status: "ok", data: "cached-placeholder", ts: Date.now() });
      return { soldierId: id, cohort: "decoy", success: true };
    },
  };
}

function makeIsolateSoldier(id: string): Soldier {
  return {
    id,
    cohort: "isolate",
    rank: "soldier",
    async run(ctx) {
      if (ctx.sessionId) await ctx.actions.isolateSession(ctx.sessionId);
      return { soldierId: id, cohort: "isolate", success: true };
    },
  };
}

function makeLogisticsSoldier(id: string): Soldier {
  return {
    id,
    cohort: "logistics",
    rank: "soldier",
    async run(ctx) {
      if (ctx.userId) {
        await ctx.actions.triggerConsentedBackup(ctx.userId, ctx.signal);
      }
      return { soldierId: id, cohort: "logistics", success: true };
    },
  };
}

function makeCaptain(cohort: CohortName, max = 8): Captain {
  const factories: Record<CohortName, (id: string) => Soldier> = {
    recon: makeReconSoldier,
    shield: makeShieldSoldier,
    lockdown: makeLockdownSoldier,
    decoy: makeDecoySoldier,
    isolate: makeIsolateSoldier,
    logistics: makeLogisticsSoldier,
  };

  const soldiers: Soldier[] = [];
  for (let i = 0; i < 2; i++) {
    soldiers.push(factories[cohort](`${cohort}-s${i}`));
  }

  return {
    cohort,
    rank: "captain",
    soldiers,
    maxSoldiers: max,
    async activate(ctx, count = 1) {
      while (this.soldiers.length < Math.min(this.maxSoldiers, this.soldiers.length + count)) {
        const id = `${cohort}-s${this.soldiers.length}`;
        this.soldiers.push(factories[cohort](id));
      }
      const toRun = this.soldiers.slice(0, count);
      return Promise.all(toRun.map((s) => s.run(ctx)));
    },
  };
}

export function createGeneral(): General {
  const captains = new Map<CohortName, Captain>();
  (["recon", "shield", "lockdown", "decoy", "isolate", "logistics"] as CohortName[]).forEach((c) => {
    captains.set(c, makeCaptain(c));
  });

  return {
    rank: "general",
    captains,
    async command(signal, ctx) {
      const tasks: Promise<SoldierReport[]>[] = [];
      tasks.push(captains.get("recon")!.activate(ctx, 2));

      if (signal.type === "probe" || signal.severity === "medium") {
        tasks.push(captains.get("shield")!.activate(ctx, 3));
        tasks.push(captains.get("decoy")!.activate(ctx, 2));
      }

      if (signal.severity === "high" || signal.severity === "critical") {
        tasks.push(captains.get("lockdown")!.activate(ctx, 2));
        tasks.push(captains.get("isolate")!.activate(ctx, 2));
        tasks.push(captains.get("logistics")!.activate(ctx, 1));
      }

      await Promise.allSettled(tasks);

      if (signal.severity === "critical") {
        await ctx.actions.spawnExtraSoldiers("shield", 4);
        await ctx.actions.spawnExtraSoldiers("lockdown", 2);
      }
    },
  };
}
