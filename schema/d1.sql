-- Castair D1 / SQLite schema (online source of truth)
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  is_demo INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('inspector','certifying_staff','admin','viewer')),
  password_hash TEXT,
  created_at TEXT NOT NULL,
  UNIQUE(tenant_id, email)
);

CREATE TABLE IF NOT EXISTS aircraft (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  registration TEXT NOT NULL,
  type TEXT NOT NULL,
  serial_number TEXT,
  status TEXT NOT NULL,
  base TEXT,
  flight_hours REAL,
  cycles INTEGER,
  operator TEXT,
  next_due TEXT,
  updated_at TEXT NOT NULL,
  UNIQUE(tenant_id, registration)
);

CREATE TABLE IF NOT EXISTS work_packages (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  aircraft_id TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  open_cards INTEGER DEFAULT 0,
  findings_count INTEGER DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS task_cards (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  aircraft_id TEXT NOT NULL,
  work_package_id TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  rii_required INTEGER NOT NULL DEFAULT 0,
  signatures_json TEXT NOT NULL DEFAULT '[]',
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS findings (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  aircraft_id TEXT NOT NULL,
  work_package_id TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL,
  status TEXT NOT NULL,
  reported_by TEXT NOT NULL,
  reported_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ad_sb (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  applicability TEXT NOT NULL,
  status TEXT NOT NULL,
  due_hours REAL,
  due_cycles INTEGER,
  aircraft_ids_json TEXT NOT NULL DEFAULT '[]',
  source TEXT,
  effective_date TEXT
);

CREATE TABLE IF NOT EXISTS components (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  aircraft_id TEXT NOT NULL,
  part_number TEXT NOT NULL,
  serial_number TEXT NOT NULL,
  description TEXT NOT NULL,
  tsn REAL NOT NULL,
  tso REAL NOT NULL,
  cycles INTEGER NOT NULL,
  position TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mel_items (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  aircraft_id TEXT NOT NULL,
  mel_reference TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  deferral_limit TEXT NOT NULL,
  opened_at TEXT NOT NULL,
  due_at TEXT,
  status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS approvals (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  agent_id TEXT,
  payload_json TEXT,
  status TEXT NOT NULL,
  requires_certifying INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  resolved_at TEXT,
  resolved_by TEXT
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  summary TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  prev_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_tenant ON audit_log(tenant_id, created_at);
CREATE INDEX IF NOT EXISTS idx_aircraft_tenant ON aircraft(tenant_id);
CREATE INDEX IF NOT EXISTS idx_task_cards_tenant ON task_cards(tenant_id);
