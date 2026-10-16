import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/server/store";
import { seedDemoTenant } from "@/lib/server/demo-seed";
import { writeAudit } from "@/lib/server/audit";
import type { Role } from "@/lib/server/types";
import { z } from "zod";

export const runtime = "edge";

const Body = z.object({
  role: z.enum(["inspector", "certifying_staff", "admin", "viewer"]).default("inspector"),
});

export async function POST(req: NextRequest) {
  const body = Body.parse(await req.json().catch(() => ({})));
  const role = body.role as Role;
  const tenant = store.createTenant("Demo MRO", true);
  const labels: Record<Role, string> = {
    inspector: "Demo Inspector",
    certifying_staff: "Demo Certifying Staff",
    admin: "Demo Admin",
    viewer: "Demo Viewer",
  };
  const user = store.createUser({
    tenantId: tenant.id,
    email: `${role}@demo.castair.local`,
    name: labels[role],
    role,
  });
  seedDemoTenant(tenant.id);
  const token = store.createSession(user.id, tenant.id);
  await writeAudit(tenant.id, user, "auth.demo_login", "tenant", tenant.id, `Demo login as ${role}`, {
    role,
  });
  const res = NextResponse.json({ token, user, tenant, demo: true });
  res.cookies.set("castair_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
