import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/server/store";
import { writeAudit } from "@/lib/server/audit";
import { z } from "zod";

export const runtime = "edge";

const Body = z.object({
  org: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["inspector", "certifying_staff", "admin", "viewer"]).default("admin"),
});

export async function POST(req: NextRequest) {
  const body = Body.parse(await req.json());
  const tenant = store.createTenant(body.org, false);
  const user = store.createUser({
    tenantId: tenant.id,
    email: body.email,
    name: body.name,
    role: body.role,
  });
  const token = store.createSession(user.id, tenant.id);
  await writeAudit(tenant.id, user, "auth.provision", "tenant", tenant.id, `Provisioned ${tenant.name}`, {});
  const res = NextResponse.json({ token, user, tenant, demo: false });
  res.cookies.set("castair_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
