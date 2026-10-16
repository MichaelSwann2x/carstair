"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth/store";
import {
  CONNECTORS,
  listConnectorConfigs,
  saveConnectorConfig,
  type ConnectorConfig,
  type ConnectorId,
} from "@/lib/connectors/types";

export default function ConnectorsPage() {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [configs, setConfigs] = useState<ConnectorConfig[]>([]);
  const [active, setActive] = useState<ConnectorId | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) return;
    setTenantId(s.tenant.id);
    setConfigs(listConnectorConfigs(s.tenant.id));
  }, []);

  function isConnected(id: ConnectorId) {
    return configs.some((c) => c.connectorId === id && c.enabled);
  }

  function connectNative() {
    if (!tenantId) return;
    saveConnectorConfig({ connectorId: "castair_native", tenantId, credentials: {}, enabled: true });
    setConfigs(listConnectorConfigs(tenantId));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function submitExternal(e: React.FormEvent) {
    e.preventDefault();
    if (!tenantId || !active) return;
    saveConnectorConfig({ connectorId: active, tenantId, credentials: form, enabled: true });
    setConfigs(listConnectorConfigs(tenantId));
    setActive(null);
    setForm({});
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 flex items-center justify-between bg-[var(--surface)]">
        <div>
          <h1 className="font-medium">Connectors</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Use Castair native (offline) or connect your existing CMMS/ERP.
          </p>
        </div>
        {saved && <span className="text-xs text-[var(--success)]">Saved</span>}
      </header>
      <div className="p-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 animate-fade-up">
        {CONNECTORS.map((c) => (
          <div key={c.id} className="castair-card p-4 flex flex-col">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="font-medium text-sm">{c.name}</div>
              <span className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{c.status}</span>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed flex-1">{c.description}</p>
            <div className="mt-3 flex items-center gap-2">
              {c.offlineCapable && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-soft)] text-[var(--muted)]">
                  Offline
                </span>
              )}
              {isConnected(c.id) && <span className="text-[10px] text-[var(--success)]">Connected</span>}
            </div>
            <div className="mt-3">
              {c.id === "castair_native" ? (
                <button type="button" onClick={connectNative} className="text-xs font-medium text-[var(--highlight)] hover:underline">
                  {isConnected(c.id) ? "Active" : "Use native CMMS"}
                </button>
              ) : c.status === "available" || c.status === "beta" ? (
                <button
                  type="button"
                  onClick={() => {
                    setActive(c.id);
                    setForm({});
                  }}
                  className="text-xs font-medium text-[var(--highlight)] hover:underline"
                >
                  {isConnected(c.id) ? "Reconfigure" : "Connect"}
                </button>
              ) : (
                <span className="text-xs text-[var(--muted)]">Coming soon</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form onSubmit={submitExternal} className="castair-card p-6 w-full max-w-md space-y-4 animate-fade-up">
            <div className="font-medium">Connect {CONNECTORS.find((x) => x.id === active)?.name}</div>
            {CONNECTORS.find((x) => x.id === active)?.fields.map((f) => (
              <div key={f.key}>
                <label className="text-xs text-[var(--muted)] block mb-1">{f.label}</label>
                <input
                  type={f.type === "password" ? "password" : "text"}
                  required={f.required}
                  className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--highlight)]"
                  value={form[f.key] || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                />
              </div>
            ))}
            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => setActive(null)} className="text-sm px-3 py-1.5 text-[var(--muted)]">
                Cancel
              </button>
              <button type="submit" className="text-sm px-4 py-1.5 rounded-lg bg-[var(--accent)] text-[var(--background)] font-medium">
                Save connection
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
