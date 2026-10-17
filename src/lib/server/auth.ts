import { NextRequest } from "next/server";
import { parseSessionToken } from "./session-token";
import { ensureDemoSeeded } from "./demo-seed";
import type { Role } from "./types";

export function getBearer(req: NextRequest): string | null {
  const h = req.headers.get("authorization");
  if (h?.startsWith("Bearer ")) return h.slice(7).trim();
  const cookie = req.cookies.get("castair_token")?.value;
  return cookie ?? null;
}

export function requireSession(req: NextRequest) {
  const token = getBearer(req);
  const payload = parseSessionToken(token);
  if (!payload) return null;
  // Re-seed demo data in this isolate if needed (stateless token carries tenant id)
  if (payload.tenant.isDemo) {
    ensureDemoSeeded(payload.tenant.id);
  }
  return {
    user: payload.user,
    tenant: payload.tenant,
    token: token!,
  };
}

export function requireRole(
  session: NonNullable<ReturnType<typeof requireSession>>,
  roles: Role[]
) {
  if (!session) return false;
  return roles.includes(session.user.role);
}
