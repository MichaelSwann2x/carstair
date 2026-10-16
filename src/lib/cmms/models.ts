export interface Aircraft {
  id: string;
  tenantId: string;
  registration: string;
  type: string;
  serialNumber?: string;
  status: "line" | "in_check" | "rts_pending" | "grounded" | "stored";
  nextDue?: string;
  operator?: string;
  base?: string;
  flightHours?: number;
  cycles?: number;
  updatedAt: string;
}

export interface WorkPackage {
  id: string;
  tenantId: string;
  aircraftId: string;
  title: string;
  type: "line" | "a_check" | "c_check" | "heavy" | "mod" | "other";
  status: "planned" | "open" | "in_progress" | "review" | "closed";
  findingsCount: number;
  openCards: number;
  updatedAt: string;
}

export interface TaskCard {
  id: string;
  tenantId: string;
  aircraftId: string;
  workPackageId?: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "rii_pending" | "signed" | "closed";
  riiRequired: boolean;
  signatures: { role: string; name: string; at: string; hash: string }[];
  updatedAt: string;
}

export interface Finding {
  id: string;
  tenantId: string;
  aircraftId: string;
  workPackageId?: string;
  title: string;
  description: string;
  severity: "minor" | "major" | "critical";
  status: "open" | "deferred" | "closed" | "rejected";
  ataChapter?: string;
  reportedBy: string;
  reportedAt: string;
}

export interface AdSbRecord {
  id: string;
  tenantId: string;
  number: string;
  title: string;
  type: "AD" | "SB" | "EO" | "SL";
  applicability: string;
  status: "open" | "embodied" | "n_a" | "deferred";
  dueHours?: number;
  dueCycles?: number;
  aircraftIds: string[];
  effectiveDate?: string;
  source?: string;
}

export interface ComponentLife {
  id: string;
  tenantId: string;
  aircraftId: string;
  partNumber: string;
  serialNumber: string;
  description: string;
  tsn: number;
  tso: number;
  cycles: number;
  position?: string;
  updatedAt: string;
}

export interface MelItem {
  id: string;
  tenantId: string;
  aircraftId: string;
  melReference: string;
  title: string;
  category: "A" | "B" | "C" | "D";
  deferralLimit: string;
  openedAt: string;
  dueAt?: string;
  status: "open" | "cleared";
}
