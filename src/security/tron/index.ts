import { createGeneral } from "./army";
import { maybeExportOnAttack } from "../recovery/consent-gated-export";
import type { AttackSignal, BattleContext } from "./types";

const general = createGeneral();

export type AttackContext = {
  userId?: string;
  sessionId?: string;
  meta: Record<string, unknown>;
  actions: Partial<BattleContext["actions"]> & Record<string, unknown>;
  getUserConfig: Parameters<typeof maybeExportOnAttack>[2];
  getLiveData: Parameters<typeof maybeExportOnAttack>[3];
  getMasterKey: Parameters<typeof maybeExportOnAttack>[4];
  pushToDestination: Parameters<typeof maybeExportOnAttack>[5];
  alertOwner: Parameters<typeof maybeExportOnAttack>[6];
};

/** Visible entry point — no hidden processes. */
export async function onAttackSignal(signal: AttackSignal, ctx: AttackContext) {
  const battleCtx: BattleContext = {
    signal,
    userId: ctx.userId,
    sessionId: ctx.sessionId,
    requestMeta: ctx.meta,
    actions: {
      rateLimit: async (key, ms) => {
        if (typeof ctx.actions.rateLimit === "function") await ctx.actions.rateLimit(key, ms);
      },
      temporaryLock: async (target, seconds) => {
        if (typeof ctx.actions.temporaryLock === "function") await ctx.actions.temporaryLock(target, seconds);
      },
      emitDecoy: async (response) => {
        if (typeof ctx.actions.emitDecoy === "function") await ctx.actions.emitDecoy(response);
      },
      deepenLog: async (extra) => {
        console.info("[TRON]", JSON.stringify({ signal, ...extra }));
        if (typeof ctx.actions.deepenLog === "function") await ctx.actions.deepenLog(extra);
      },
      isolateSession: async (sessionId) => {
        if (typeof ctx.actions.isolateSession === "function") await ctx.actions.isolateSession(sessionId);
      },
      triggerConsentedBackup: async (userId, sig) => {
        await maybeExportOnAttack(
          userId,
          sig,
          ctx.getUserConfig,
          ctx.getLiveData,
          ctx.getMasterKey,
          ctx.pushToDestination,
          ctx.alertOwner
        );
      },
      spawnExtraSoldiers: async (cohort, count) => {
        const captain = general.captains.get(cohort);
        if (captain) await captain.activate(battleCtx, count);
      },
    },
  };

  await general.command(signal, battleCtx);
}

export { createGeneral };
