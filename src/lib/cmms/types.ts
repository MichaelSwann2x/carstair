import { z } from "zod";

export const AircraftSchema = z.object({
  id: z.string(),
  registration: z.string(),
  type: z.string(),
  serialNumber: z.string().optional(),
  status: z.enum(["line", "in_check", "rts_pending", "grounded", "stored"]),
  nextDue: z.string().optional(),
  operator: z.string().optional(),
  base: z.string().optional(),
  updatedAt: z.string(),
});
export type Aircraft = z.infer<typeof AircraftSchema>;

export const WorkPackageSchema = z.object({
  id: z.string(),
  aircraftId: z.string(),
  title: z.string(),
  type: z.enum(["line", "a_check", "c_check", "heavy", "mod", "other"]),
  status: z.enum(["planned", "open", "in_progress", "review", "closed"]),
  plannedStart: z.string().optional(),
  plannedEnd: z.string().optional(),
  findingsCount: z.number().default(0),
  openCards: z.number().default(0),
  updatedAt: z.string(),
});
export type WorkPackage = z.infer<typeof WorkPackageSchema>;

export const AdSbRecordSchema = z.object({
  id: z.string(),
  number: z.string(),
  title: z.string(),
  type: z.enum(["AD", "SB", "SL"]),
  effectiveDate: z.string().optional(),
  applicability: z.string(),
  status: z.enum(["open", "embodied", "n_a", "deferred"]),
  source: z.string().optional(),
  aircraftIds: z.array(z.string()).default([]),
});
export type AdSbRecord = z.infer<typeof AdSbRecordSchema>;
