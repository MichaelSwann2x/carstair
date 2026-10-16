"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth/store";
import { localCmms } from "@/lib/cmms/local-store";
import type { Aircraft } from "@/lib/cmms/types";

const statusLabel: Record<Aircraft["status"], string> = {
  line: "Line",
  in_check: "In check",
  rts_pending: "RTS pending",
  grounded: "Grounded",
  stored: "Stored",
};

export default function AircraftPage() {
  const [rows, setRows] = useState<Aircraft[]>([]);
  const [reg, setReg] = useState("");
  const [type, setType] = useState("");
  const [base, setBase] = useState("");

  function refresh(tenantId: string) {
    localCmms.seedDemo(tenantId);
    setRows(localCmms.listAircraft(tenantId));
  }

  useEffect(() => {
    const s = getSession();
    if (!s) return;
    refresh(s.tenant.id);
  }, []);

  function addAircraft(e: React.FormEvent) {
    e.preventDefault();
    const s = getSession();
    if (!s || !reg.trim() || !type.trim()) return;
    localCmms.upsertAircraft(s.tenant.id, {
      registration: reg.trim().toUpperCase(),
      type: type.trim(),
      base: base.trim() || undefined,
      status: "line",
    });
    setReg("");
    setType("");
    setBase("");
    refresh(s.tenant.id);
  }

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 flex items-center justify-between bg-[var(--surface)]">
        <div>
          <h1 className="font-medium">Aircraft</h1>
          <p className="text-xs text-[var(--muted)]">Fleet register · Castair native · offline</p>
        </div>
      </header>
      <div className="p-6 space-y-4 animate-fade-up">
        <form onSubmit={addAircraft} className="castair-card p-4 flex flex-wrap gap-2 items-end">
          <div>
            <label className="text-xs text-[var(--muted)] block mb-1">Registration</label>
            <input
              className="border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm bg-transparent w-32"
              value={reg}
              onChange={(e) => setReg(e.target.value)}
              placeholder="N123AB"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--muted)] block mb-1">Type</label>
            <input
              className="border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm bg-transparent w-36"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="B737-800"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--muted)] block mb-1">Base</label>
            <input
              className="border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm bg-transparent w-24"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              placeholder="KDFW"
            />
          </div>
          <button
            type="submit"
            className="bg-[var(--accent)] text-[var(--background)] px-3 py-1.5 rounded-lg text-sm font-medium"
          >
            Add aircraft
          </button>
        </form>

        <div className="castair-card overflow-hidden">
          <table className="castair-table">
            <thead>
              <tr>
                <th>Registration</th>
                <th>Type</th>
                <th>Status</th>
                <th>Base</th>
                <th>Next due</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td className="font-medium tabular-nums">{a.registration}</td>
                  <td>{a.type}</td>
                  <td>
                    <span
                      className={
                        a.status === "rts_pending"
                          ? "text-[var(--warning)]"
                          : a.status === "grounded"
                          ? "text-[var(--danger)]"
                          : "text-[var(--muted)]"
                      }
                    >
                      {statusLabel[a.status]}
                    </span>
                  </td>
                  <td className="text-[var(--muted)]">{a.base ?? "—"}</td>
                  <td className="tabular-nums">{a.nextDue ?? "—"}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-[var(--muted)] text-center py-8">
                    No aircraft. Add one above or use demo login to seed data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
