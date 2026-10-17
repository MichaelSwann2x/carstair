import { NextRequest, NextResponse } from "next/server";
import { store, uid } from "@/lib/server/store";
import { seedDemoTenant } from "@/lib/server/demo-seed";
import { mintSessionToken, roleLabel } from "@/lib/server/session-token";
import type { Role, Tenant, User } from "@/lib/server/types";
import { z } from "zod";

export const runtime = "edge";

const Body = z.object({
  role: z.enum(["inspector", "certifying_staff", "admin", "viewer"]).default("inspector"),
});

export async function POST(req: NextRequest) {
  try {
    const body = Body.parse(await req.json().catch(() => ({})));
    const role = body.role as Role;

    const tenantId = uid();
    const tenant: Tenant = {
      id: tenantId,
      name: "Demo MRO",
      slug: `demo-${tenantId.slice(0, 8)}`,
      isDemo: true,
      createdAt: new Date().toISOString(),
    };
    // Best-effort store (may not persist across isolates)
    try {
      store.createTenant("Demo MRO", true);
    } catch {
      /* ignore */
    }

    const user: User = {
      id: uid(),
      tenantId,
      email: `${role}@demo.castair.local`,
      name: roleLabel(role),
      role,
      createdAt: new Date().toISOString(),
    };

    seedDemoTenant(tenantId);
    const token = mintSessionToken(user, tenant);

    const res = NextResponse.json({
      token,
      user,
      tenant,
      demo: true,
    });
    res.cookies.set("castair_token", token, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      secure: true,
    });
    return res;
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Demo login failed" },
      { status: 500 }
    );
  }
}
