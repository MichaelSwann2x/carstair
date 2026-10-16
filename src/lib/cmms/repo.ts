import { idbGetAll, idbPut, idbBulkPut, uid } from "../db/idb";
import type {
  Aircraft,
  WorkPackage,
  TaskCard,
  AdSbRecord,
  ComponentLife,
  MelItem,
  Finding,
} from "./models";

export const repo = {
  async listAircraft(tenantId: string) {
    return idbGetAll<Aircraft>("aircraft", tenantId);
  },
  async putAircraft(a: Aircraft) {
    await idbPut("aircraft", a);
  },
  async listWorkPackages(tenantId: string) {
    return idbGetAll<WorkPackage>("work_packages", tenantId);
  },
  async putWorkPackage(wp: WorkPackage) {
    await idbPut("work_packages", wp);
  },
  async listTaskCards(tenantId: string) {
    return idbGetAll<TaskCard>("task_cards", tenantId);
  },
  async putTaskCard(tc: TaskCard) {
    await idbPut("task_cards", tc);
  },
  async listAdSb(tenantId: string) {
    return idbGetAll<AdSbRecord>("ad_sb", tenantId);
  },
  async listComponents(tenantId: string) {
    return idbGetAll<ComponentLife>("components", tenantId);
  },
  async listMel(tenantId: string) {
    return idbGetAll<MelItem>("mel_items", tenantId);
  },
  async listFindings(tenantId: string) {
    return idbGetAll<Finding>("findings", tenantId);
  },
  async seedDemo(tenantId: string) {
    const existing = await this.listAircraft(tenantId);
    if (existing.length > 0) return;

    const now = new Date().toISOString();
    const a1: Aircraft = {
      id: uid(),
      tenantId,
      registration: "N123AB",
      type: "B737-800",
      serialNumber: "MSN-34421",
      status: "in_check",
      nextDue: "2026-10-22",
      operator: "Demo Air",
      base: "KDFW",
      flightHours: 42150,
      cycles: 28900,
      updatedAt: now,
    };
    const a2: Aircraft = {
      id: uid(),
      tenantId,
      registration: "G-EUUY",
      type: "A320neo",
      status: "line",
      nextDue: "2026-10-18",
      operator: "Demo Air",
      base: "EGLL",
      flightHours: 18200,
      cycles: 12100,
      updatedAt: now,
    };
    const a3: Aircraft = {
      id: uid(),
      tenantId,
      registration: "VH-XZC",
      type: "B787-9",
      status: "rts_pending",
      nextDue: "2026-10-17",
      operator: "Demo Air",
      base: "YSSY",
      flightHours: 9600,
      cycles: 2100,
      updatedAt: now,
    };
    await idbBulkPut("aircraft", [a1, a2, a3]);

    await idbPut("work_packages", {
      id: uid(),
      tenantId,
      aircraftId: a1.id,
      title: "C-Check package",
      type: "c_check",
      status: "in_progress",
      findingsCount: 4,
      openCards: 12,
      updatedAt: now,
    } satisfies WorkPackage);

    await idbPut("task_cards", {
      id: uid(),
      tenantId,
      aircraftId: a1.id,
      title: "Inspect LH wing upper skin STA 540",
      description: "Detailed visual and measure dent depth vs SRM.",
      status: "rii_pending",
      riiRequired: true,
      signatures: [],
      updatedAt: now,
    } satisfies TaskCard);

    await idbBulkPut("ad_sb", [
      {
        id: uid(),
        tenantId,
        number: "AD 2024-12-05",
        title: "Fuselage skin inspection — selected 737NG",
        type: "AD",
        applicability: "B737-800",
        status: "open",
        dueHours: 500,
        aircraftIds: [a1.id],
        effectiveDate: "2024-12-15",
        source: "FAA",
      },
      {
        id: uid(),
        tenantId,
        number: "SB 737-53A1234",
        title: "Frame reinforcement modification",
        type: "SB",
        applicability: "B737-800",
        status: "open",
        aircraftIds: [a1.id],
        source: "OEM",
      },
    ] satisfies AdSbRecord[]);

    await idbPut("components", {
      id: uid(),
      tenantId,
      aircraftId: a1.id,
      partNumber: "65C38101-23",
      serialNumber: "SN-99281",
      description: "Main landing gear actuator",
      tsn: 12400,
      tso: 2100,
      cycles: 8900,
      position: "LH MLG",
      updatedAt: now,
    } satisfies ComponentLife);

    await idbPut("mel_items", {
      id: uid(),
      tenantId,
      aircraftId: a2.id,
      melReference: "MEL 33-11-01",
      title: "Cabin reading light inop",
      category: "C",
      deferralLimit: "10 days",
      openedAt: now,
      status: "open",
    } satisfies MelItem);
  },
};
