import { z } from "zod";

export const RoleSchema = z.enum([
  "inspector",
  "rts_authority",
  "camo_engineer",
  "admin",
  "viewer",
]);
export type Role = z.infer<typeof RoleSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: RoleSchema,
  tenantId: z.string().uuid(),
  createdAt: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export const TenantSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  encryptionKeyId: z.string(),
  plan: z.enum(["demo", "standard", "enterprise"]).default("demo"),
  createdAt: z.string(),
  offlineMode: z.boolean().default(true),
});
export type Tenant = z.infer<typeof TenantSchema>;

export interface Session {
  user: User;
  tenant: Tenant;
  token: string;
  expiresAt: string;
}
