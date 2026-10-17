import { NextRequest, NextResponse } from "next/server";
import { uid } from "@/lib/server/store";
import { mintSessionToken } from "@/lib/server/session-token";
import type { Tenant, User } from "@/lib/server/types";
import { z } from "zod";

export const runtime = "edge";

const Body = z.object({
  org: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["inspector", "certifying_staff", "admin", "viewer"]).default("admin"),
});

export async function POST(req: NextRequest) {
  try {
    const body = Body.parse(await req.json());
    const tenantId = uid();
    const tenant: Tenant = {
      id: tenantId,
      name: body.org,
      slug: body.org.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "org",
      isDemo: false,
      createdAt: new Date().toISOString(),
    };
    const user: User = {
      id: uid(),
      tenantId,
      email: body.email,
      name: body.name,
      role: body.role,
      createdAt: new Date().toISOString(),
    };
    const token = mintSessionToken(user, tenant);
    const res = NextResponse.json({ token, user, tenant, demo: false });
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
      { error: e instanceof Error ? e.message : "Provision failed" },
      { status: 400 }
    );
  }
}
