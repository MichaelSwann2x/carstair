/**
 * Online source-of-truth store.
 * In-memory on the edge for deployability without D1 binding;
 * swap implementations to D1 using schema/d1.sql when bound.
 */
import type {
  Tenant,
  User,
  Aircraft,
  TaskCard,
  WorkPackage,
  MelItem,
  ComponentLife,
  AdSbRecord,
  Approval,
  AuditEntry,
} from "./types";

type DB = {
  tenants: Map<string, Tenant>;
  users: Map<string, User>;
  sessions: Map<string, { userId: string; tenantId: string; expiresAt: number }>;
  aircraft: Map<string, Aircraft>;
  workPackages: Map<string, WorkPackage>;
  taskCards: Map<string, TaskCard>;
  mel: Map<string, MelItem>;
  components: Map<string, ComponentLife>;
  adSb: Map<string, AdSbRecord>;
  approvals: Map<string, Approval>;
  audit: AuditEntry[];
  demoSeeded: Set<string>;
};

const g = globalThis as unknown as { __castair_db?: DB };

function db(): DB {
  if (!g.__castair_db) {
    g.__castair_db = {
      tenants: new Map(),
      users: new Map(),
      sessions: new Map(),
      aircraft: new Map(),
      workPackages: new Map(),
      taskCards: new Map(),
      mel: new Map(),
      components: new Map(),
      adSb: new Map(),
      approvals: new Map(),
      audit: [],
      demoSeeded: new Set(),
    };
  }
  return g.__castair_db;
}

export function uid(): string {
  return crypto.randomUUID?.() ?? `id_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export const store = {
  createTenant(name: string, isDemo = false): Tenant {
    const t: Tenant = {
      id: uid(),
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + (isDemo ? `-demo-${Date.now()}` : ""),
      isDemo,
      createdAt: new Date().toISOString(),
    };
    db().tenants.set(t.id, t);
    return t;
  },
  getTenant(id: string) {
    return db().tenants.get(id);
  },
  createUser(input: Omit<User, "id" | "createdAt">): User {
    const u: User = { ...input, id: uid(), createdAt: new Date().toISOString() };
    db().users.set(u.id, u);
    return u;
  },
  getUser(id: string) {
    return db().users.get(id);
  },
  createSession(userId: string, tenantId: string): string {
    const token = `cst_${uid().replace(/-/g, "")}`;
    db().sessions.set(token, {
      userId,
      tenantId,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });
    return token;
  },
  getSession(token: string) {
    const s = db().sessions.get(token);
    if (!s || s.expiresAt < Date.now()) {
      if (s) db().sessions.delete(token);
      return null;
    }
    const user = db().users.get(s.userId);
    const tenant = db().tenants.get(s.tenantId);
    if (!user || !tenant) return null;
    return { user, tenant, token };
  },
  listAircraft(tenantId: string) {
    return [...db().aircraft.values()].filter((a) => a.tenantId === tenantId);
  },
  putAircraft(a: Aircraft) {
    db().aircraft.set(a.id, a);
  },
  listWorkPackages(tenantId: string) {
    return [...db().workPackages.values()].filter((w) => w.tenantId === tenantId);
  },
  putWorkPackage(w: WorkPackage) {
    db().workPackages.set(w.id, w);
  },
  listTaskCards(tenantId: string) {
    return [...db().taskCards.values()].filter((t) => t.tenantId === tenantId);
  },
  getTaskCard(id: string) {
    return db().taskCards.get(id);
  },
  putTaskCard(t: TaskCard) {
    db().taskCards.set(t.id, t);
  },
  listMel(tenantId: string) {
    return [...db().mel.values()].filter((m) => m.tenantId === tenantId);
  },
  listComponents(tenantId: string) {
    return [...db().components.values()].filter((c) => c.tenantId === tenantId);
  },
  listAdSb(tenantId: string) {
    return [...db().adSb.values()].filter((d) => d.tenantId === tenantId);
  },
  listApprovals(tenantId: string) {
    return [...db().approvals.values()]
      .filter((a) => a.tenantId === tenantId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },
  putApproval(a: Approval) {
    db().approvals.set(a.id, a);
  },
  getApproval(id: string) {
    return db().approvals.get(id);
  },
  listAudit(tenantId: string) {
    return db().audit.filter((e) => e.tenantId === tenantId).slice().reverse();
  },
  appendAudit(entry: AuditEntry) {
    db().audit.push(entry);
  },
  lastAuditHash(tenantId: string): string {
    const list = db().audit.filter((e) => e.tenantId === tenantId);
    return list.length ? list[list.length - 1].payloadHash : "genesis";
  },
  isDemoSeeded(tenantId: string) {
    return db().demoSeeded.has(tenantId);
  },
  markDemoSeeded(tenantId: string) {
    db().demoSeeded.add(tenantId);
  },
  putAdSb(r: AdSbRecord) {
    db().adSb.set(r.id, r);
  },
  putMel(m: MelItem) {
    db().mel.set(m.id, m);
  },
  putComponent(c: ComponentLife) {
    db().components.set(c.id, c);
  },
};
