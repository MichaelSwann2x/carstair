import { z } from "zod";

export const RoleSchema = z.enum(["inspector", "certifying_staff", "admin", "viewer"]);
export type Role = z.infer<typeof RoleSchema>;

export const UserSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: RoleSchema,
  createdAt: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export const TenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  isDemo: z.boolean(),
  createdAt: z.string(),
});
export type Tenant = z.infer<typeof TenantSchema>;

export type AircraftStatus = "line" | "in_check" | "rts_pending" | "grounded" | "stored";

export interface Aircraft {
  id: string;
  tenantId: string;
  registration: string;
  type: string;
  serialNumber?: string;
  status: AircraftStatus;
  base?: string;
  flightHours?: number;
  cycles?: number;
  operator?: string;
  nextDue?: string;
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
  signatures: { role: string; name: string; userId: string; at: string; hash: string }[];
  updatedAt: string;
}

export interface WorkPackage {
  id: string;
  tenantId: string;
  aircraftId: string;
  title: string;
  type: string;
  status: string;
  openCards: number;
  findingsCount: number;
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
  source?: string;
  effectiveDate?: string;
}

export interface Approval {
  id: string;
  tenantId: string;
  title: string;
  summary: string;
  agentId?: string;
  payload?: unknown;
  status: "pending" | "approved" | "rejected";
  requiresCertifying: boolean;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface AuditEntry {
  id: string;
  tenantId: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
  payloadHash: string;
  prevHash: string;
  createdAt: string;
}

export function canCertify(role: Role): boolean {
  return role === "certifying_staff" || role === "admin";
}
