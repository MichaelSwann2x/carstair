import type { Session, Tenant, User, Role } from "./types";

const STORAGE_KEY = "carstair_session_v1";
const TENANTS_KEY = "carstair_tenants_v1";

function uid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function createTenant(name: string, slug?: string): Tenant {
  const id = uid();
  const tenant: Tenant = {
    id,
    name,
    slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    encryptionKeyId: `key_${id.slice(0, 8)}`,
    plan: "demo",
    createdAt: new Date().toISOString(),
    offlineMode: true,
  };
  if (typeof window !== "undefined") {
    const existing = JSON.parse(localStorage.getItem(TENANTS_KEY) || "[]") as Tenant[];
    existing.push(tenant);
    localStorage.setItem(TENANTS_KEY, JSON.stringify(existing));
  }
  return tenant;
}

export function provisionUser(email: string, name: string, role: Role, tenant: Tenant): User {
  return {
    id: uid(),
    email,
    name,
    role,
    tenantId: tenant.id,
    createdAt: new Date().toISOString(),
  };
}

export function createSession(user: User, tenant: Tenant): Session {
  const session: Session = {
    user,
    tenant,
    token: `cst_${uid().replace(/-/g, "")}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
  return session;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as Session;
    if (new Date(s.expiresAt) < new Date()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
}

export function demoLogin(): Session {
  const tenant = createTenant("Demo MRO", "demo-mro");
  const user = provisionUser("inspector@demo-mro.carstair.local", "Demo Inspector", "inspector", tenant);
  return createSession(user, tenant);
}
