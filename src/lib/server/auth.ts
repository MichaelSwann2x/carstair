import { NextRequest } from "next/server";
import { store } from "./store";
import type { Role } from "./types";

export function getBearer(req: NextRequest): string | null {
  const h = req.headers.get("authorization");
  if (h?.startsWith("Bearer ")) return h.slice(7);
  const cookie = req.cookies.get("castair_token")?.value;
  return cookie ?? null;
}

export function requireSession(req: NextRequest) {
  const token = getBearer(req);
  if (!token) return null;
  return store.getSession(token);
}

export function requireRole(session: NonNullable<ReturnType<typeof requireSession>>, roles: Role[]) {
  if (!session) return false;
  return roles.includes(session.user.role);
}
