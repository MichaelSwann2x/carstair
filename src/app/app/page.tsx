"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth/store";
import { repo } from "@/lib/cmms/repo";
import type { Aircraft } from "@/lib/cmms/models";
import { uid } from "@/lib/db/idb";
import { useToast } from "@/lib/toast";
import { appendAudit } from "@/lib/audit/log";

export default function AircraftPage() {
  const [rows, setRows] = useState<Aircraft[] | null>(null);
  const [reg, setReg] = useState("");
  const [type, setType] = useState("");
  const [base, setBase] = useState("");
  const { toast } = useToast();

  async function refresh(tenantId: string) {
    await repo.seedDemo(tenantId);
    setRows(await repo.listAircraft(tenantId));
  }

  useEffect(() => {
    const s = getSession();
    if (!s) return;
    refresh(s.tenant.id);
  }, []);

  async function addAircraft(e: React.FormEvent) {
    e.preventDefault();
    const s = getSession();
    if (!s || !reg.trim() || !type.trim()) return;
    const a: Aircraft = {
      id: uid(),
      tenantId: s.tenant.id,
      registration: reg.trim().toUpperCase(),
      type: type.trim(),
      base: base.trim() || undefined,
      status: "line",
      updatedAt: new Date().toISOString(),
    };
    await repo.putAircraft(a);
    await appendAudit(
      s.tenant.id,
      { id: s.user.id, name: s.user.name, role: s.user.role },
      "aircraft.create",
      "aircraft",
      a.id,
      `Added ${a.registration}`,
      a
    );
    setReg("");
    setType("");
    setBase("");
    toast("Aircraft added", "success");
    refresh(s.tenant.id);
  }

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
        <h1 className="font-medium text-black">Aircraft</h1>
        <p className="text-xs text-[var(--muted)]">Fleet register · hours/cycles · critical status</p>
      </header>
      <div className="p-6 space-y-4 animate-fade-up">
        <form onSubmit={addAircraft} className="castair-card p-4 flex flex-wrap gap-2 items-end bg-white" aria-label="Add aircraft">
          <div>
            <label htmlFor="reg" className="text-xs text-[var(--muted)] block mb-1">Registration</label>
            <input id="reg" className="border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm bg-white text-black w-32" value={reg} onChange={(e) => setReg(e.target.value)} />
          </div>
          <div>
            <label htmlFor="type" className="text-xs text-[var(--muted)] block mb-1">Type</label>
            <input id="type" className="border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm bg-white text-black w-36" value={type} onChange={(e) => setType(e.target.value)} />
          </div>
          <div>
            <label htmlFor="base" className="text-xs text-[var(--muted)] block mb-1">Base</label>
            <input id="base" className="border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm bg-white text-black w-24" value={base} onChange={(e) => setBase(e.target.value)} />
          </div>
          <button type="submit" className="bg-[var(--accent)] text-white px-3 py-1.5 rounded-lg text-sm font-medium">Add aircraft</button>
        </form>

        <div className="castair-card overflow-hidden bg-white">
          {rows === null ? (
            <div className="p-6 space-y-2" aria-busy="true">
              <div className="skeleton h-4 w-full" /><div className="skeleton h-4 w-5/6" /><div className="skeleton h-4 w-4/6" />
            </div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--muted)]">No aircraft yet. Add one or use the demo tenant.</div>
          ) : (
            <table className="castair-table">
              <thead>
                <tr>
                  <th scope="col">Registration</th>
                  <th scope="col">Type</th>
                  <th scope="col">Status</th>
                  <th scope="col">Hours</th>
                  <th scope="col">Cycles</th>
                  <th scope="col">Base</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id}>
                    <td className="font-medium tabular-nums">{a.registration}</td>
                    <td>{a.type}</td>
                    <td>
                      <span className={a.status === "rts_pending" ? "status-rts" : a.status === "grounded" ? "status-critical" : a.status === "in_check" ? "status-open" : "text-[var(--muted)]"}>
                        {a.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="tabular-nums">{a.flightHours ?? "—"}</td>
                    <td className="tabular-nums">{a.cycles ?? "—"}</td>
                    <td className="text-[var(--muted)]">{a.base ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
