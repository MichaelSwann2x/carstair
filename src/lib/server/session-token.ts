import type { Role, Tenant, User } from "./types";

/** Stateless session — survives edge isolate restarts (no in-memory session map). */
export type SessionPayload = {
  v: 1;
  user: User;
  tenant: Tenant;
  exp: number;
};

function b64urlEncode(data: string): string {
  const bytes = new TextEncoder().encode(data);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): string {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function mintSessionToken(user: User, tenant: Tenant, days = 7): string {
  const payload: SessionPayload = {
    v: 1,
    user,
    tenant,
    exp: Date.now() + days * 24 * 60 * 60 * 1000,
  };
  return `cst1.${b64urlEncode(JSON.stringify(payload))}`;
}

export function parseSessionToken(token: string | null | undefined): SessionPayload | null {
  if (!token || !token.startsWith("cst1.")) return null;
  try {
    const json = b64urlDecode(token.slice(5));
    const payload = JSON.parse(json) as SessionPayload;
    if (payload.v !== 1 || !payload.user || !payload.tenant) return null;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function roleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    inspector: "Demo Inspector",
    certifying_staff: "Demo Certifying Staff",
    admin: "Demo Admin",
    viewer: "Demo Viewer",
  };
  return labels[role] ?? role;
}
