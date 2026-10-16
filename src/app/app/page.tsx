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

  useEffect(() => {
    const s = getSession();
    if (!s) return;
    localCmms.seedDemo(s.tenant.id);
    setRows(localCmms.listAircraft(s.tenant.id));
  }, []);

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 flex items-center justify-between bg-[var(--surface)]">
        <h1 className="font-medium">Aircraft</h1>
        <span className="text-xs text-[var(--muted)]">Castair native · offline</span>
      </header>
      <div className="p-6 animate-fade-up">
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
                    No aircraft yet. Demo data seeds on first load.
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
