import { store, uid } from "./store";
import type { Aircraft, TaskCard, WorkPackage, AdSbRecord, MelItem, ComponentLife } from "./types";

export function seedDemoTenant(tenantId: string) {
  if (store.isDemoSeeded(tenantId)) return;
  const now = new Date().toISOString();

  const a1: Aircraft = {
    id: uid(),
    tenantId,
    registration: "N123AB",
    type: "B737-800",
    serialNumber: "MSN-34421",
    status: "in_check",
    base: "KDFW",
    flightHours: 42150,
    cycles: 28900,
    operator: "Demo Air",
    nextDue: "2026-10-22",
    updatedAt: now,
  };
  const a2: Aircraft = {
    id: uid(),
    tenantId,
    registration: "G-EUUY",
    type: "A320neo",
    status: "line",
    base: "EGLL",
    flightHours: 18200,
    cycles: 12100,
    operator: "Demo Air",
    nextDue: "2026-10-18",
    updatedAt: now,
  };
  const a3: Aircraft = {
    id: uid(),
    tenantId,
    registration: "VH-XZC",
    type: "B787-9",
    status: "rts_pending",
    base: "YSSY",
    flightHours: 9600,
    cycles: 2100,
    operator: "Demo Air",
    nextDue: "2026-10-17",
    updatedAt: now,
  };
  store.putAircraft(a1);
  store.putAircraft(a2);
  store.putAircraft(a3);

  store.putWorkPackage({
    id: uid(),
    tenantId,
    aircraftId: a1.id,
    title: "C-Check package",
    type: "c_check",
    status: "in_progress",
    openCards: 2,
    findingsCount: 1,
    updatedAt: now,
  } satisfies WorkPackage);

  store.putTaskCard({
    id: uid(),
    tenantId,
    aircraftId: a1.id,
    title: "Inspect LH wing upper skin STA 540",
    description: "Detailed visual and measure dent depth vs SRM limits.",
    status: "rii_pending",
    riiRequired: true,
    signatures: [],
    updatedAt: now,
  } satisfies TaskCard);

  store.putTaskCard({
    id: uid(),
    tenantId,
    aircraftId: a3.id,
    title: "Post-maintenance dual inspection",
    description: "Final RII before RTS.",
    status: "open",
    riiRequired: true,
    signatures: [],
    updatedAt: now,
  } satisfies TaskCard);

  store.putAdSb({
    id: uid(),
    tenantId,
    number: "AD 2024-12-05",
    title: "Fuselage skin inspection — selected 737NG",
    type: "AD",
    applicability: "B737-800",
    status: "open",
    dueHours: 500,
    aircraftIds: [a1.id],
    source: "FAA",
    effectiveDate: "2024-12-15",
  } satisfies AdSbRecord);

  store.putAdSb({
    id: uid(),
    tenantId,
    number: "SB 737-53A1234",
    title: "Frame reinforcement modification",
    type: "SB",
    applicability: "B737-800",
    status: "open",
    aircraftIds: [a1.id],
    source: "OEM",
  } satisfies AdSbRecord);

  store.putMel({
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

  store.putComponent({
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

  store.markDemoSeeded(tenantId);
}
