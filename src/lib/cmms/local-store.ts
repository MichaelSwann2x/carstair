import type { Aircraft, WorkPackage, AdSbRecord } from "./types";

const KEY = (tenantId: string, entity: string) => `carstair_${tenantId}_${entity}`;

function load<T>(tenantId: string, entity: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY(tenantId, entity)) || "[]") as T[];
  } catch {
    return [];
  }
}

function save<T>(tenantId: string, entity: string, data: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY(tenantId, entity), JSON.stringify(data));
}

function id(): string {
  return crypto.randomUUID?.() ?? `id_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export const localCmms = {
  listAircraft(tenantId: string): Aircraft[] {
    return load<Aircraft>(tenantId, "aircraft");
  },
  upsertAircraft(
    tenantId: string,
    a: Partial<Aircraft> & { registration: string; type: string }
  ): Aircraft {
    const list = load<Aircraft>(tenantId, "aircraft");
    const existing = list.find((x) => x.registration === a.registration);
    const now = new Date().toISOString();
    if (existing) {
      Object.assign(existing, a, { updatedAt: now });
      save(tenantId, "aircraft", list);
      return existing;
    }
    const row: Aircraft = {
      id: id(),
      registration: a.registration,
      type: a.type,
      serialNumber: a.serialNumber,
      status: a.status ?? "line",
      nextDue: a.nextDue,
      operator: a.operator,
      base: a.base,
      updatedAt: now,
    };
    list.push(row);
    save(tenantId, "aircraft", list);
    return row;
  },
  listWorkPackages(tenantId: string): WorkPackage[] {
    return load<WorkPackage>(tenantId, "work_packages");
  },
  upsertWorkPackage(
    tenantId: string,
    wp: Partial<WorkPackage> & { aircraftId: string; title: string }
  ): WorkPackage {
    const list = load<WorkPackage>(tenantId, "work_packages");
    const now = new Date().toISOString();
    if (wp.id) {
      const existing = list.find((x) => x.id === wp.id);
      if (existing) {
        Object.assign(existing, wp, { updatedAt: now });
        save(tenantId, "work_packages", list);
        return existing;
      }
    }
    const row: WorkPackage = {
      id: id(),
      aircraftId: wp.aircraftId,
      title: wp.title,
      type: wp.type ?? "line",
      status: wp.status ?? "planned",
      plannedStart: wp.plannedStart,
      plannedEnd: wp.plannedEnd,
      findingsCount: wp.findingsCount ?? 0,
      openCards: wp.openCards ?? 0,
      updatedAt: now,
    };
    list.push(row);
    save(tenantId, "work_packages", list);
    return row;
  },
  listAdSb(tenantId: string): AdSbRecord[] {
    return load<AdSbRecord>(tenantId, "ad_sb");
  },
  seedDemo(tenantId: string): void {
    if (this.listAircraft(tenantId).length > 0) return;
    const a1 = this.upsertAircraft(tenantId, {
      registration: "N123AB",
      type: "B737-800",
      status: "in_check",
      nextDue: "2026-10-22",
      operator: "Demo Air",
      base: "KDFW",
    });
    const a2 = this.upsertAircraft(tenantId, {
      registration: "G-EUUY",
      type: "A320neo",
      status: "line",
      nextDue: "2026-10-18",
      operator: "Demo Air",
      base: "EGLL",
    });
    this.upsertAircraft(tenantId, {
      registration: "VH-XZC",
      type: "B787-9",
      status: "rts_pending",
      nextDue: "2026-10-17",
      operator: "Demo Air",
      base: "YSSY",
    });
    this.upsertWorkPackage(tenantId, {
      aircraftId: a1.id,
      title: "C-Check package",
      type: "c_check",
      status: "in_progress",
      findingsCount: 4,
      openCards: 12,
    });
    this.upsertWorkPackage(tenantId, {
      aircraftId: a2.id,
      title: "Line defect rectification",
      type: "line",
      status: "open",
      findingsCount: 1,
      openCards: 2,
    });
    const ads = load<AdSbRecord>(tenantId, "ad_sb");
    if (ads.length === 0) {
      ads.push(
        {
          id: id(),
          number: "AD 2024-12-05",
          title: "Fuselage skin inspection — selected 737NG",
          type: "AD",
          effectiveDate: "2024-12-15",
          applicability: "B737-800 MSN in range",
          status: "open",
          source: "FAA",
          aircraftIds: [a1.id],
        },
        {
          id: id(),
          number: "SB 737-53A1234",
          title: "Frame reinforcement modification",
          type: "SB",
          applicability: "B737-800",
          status: "open",
          source: "OEM",
          aircraftIds: [a1.id],
        }
      );
      save(tenantId, "ad_sb", ads);
    }
  },
};
