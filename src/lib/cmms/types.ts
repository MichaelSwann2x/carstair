export type AircraftStatus = "line" | "in_check" | "rts_pending" | "grounded" | "stored";

export interface Aircraft {
  id: string;
  registration: string;
  type: string;
  serialNumber?: string;
  status: AircraftStatus;
  nextDue?: string;
  operator?: string;
  base?: string;
  updatedAt: string;
}

export interface WorkPackage {
  id: string;
  aircraftId: string;
  title: string;
  type: "line" | "a_check" | "c_check" | "heavy" | "mod" | "other";
  status: "planned" | "open" | "in_progress" | "review" | "closed";
  plannedStart?: string;
  plannedEnd?: string;
  findingsCount: number;
  openCards: number;
  updatedAt: string;
}

export interface AdSbRecord {
  id: string;
  number: string;
  title: string;
  type: "AD" | "SB" | "SL";
  effectiveDate?: string;
  applicability: string;
  status: "open" | "embodied" | "n_a" | "deferred";
  source?: string;
  aircraftIds: string[];
}
