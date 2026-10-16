"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth/store";
import { localCmms } from "@/lib/cmms/local-store";
import type { WorkPackage, Aircraft } from "@/lib/cmms/types";

export default function WorkPackagesPage() {
  const [rows, setRows] = useState<(WorkPackage & { reg?: string })[]>([]);

  useEffect(() => {
    const s = getSession();
    if (!s) return;
    const acMap = new Map(
      localCmms.listAircraft(s.tenant.id).map((a: Aircraft) => [a.id, a.registration])
    );
    setRows(
      localCmms.listWorkPackages(s.tenant.id).map((wp) => ({
        ...wp,
        reg: acMap.get(wp.aircraftId),
      }))
    );
  }, []);

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 flex items-center justify-between bg-[var(--surface)]">
        <h1 className="font-medium">Work packages</h1>
      </header>
      <div className="p-6 animate-fade-up">
        <div className="castair-card overflow-hidden">
          <table className="castair-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Aircraft</th>
                <th>Type</th>
                <th>Status</th>
                <th>Findings</th>
                <th>Open cards</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((wp) => (
                <tr key={wp.id}>
                  <td className="font-medium">{wp.title}</td>
                  <td className="tabular-nums">{wp.reg ?? "—"}</td>
                  <td className="text-[var(--muted)]">{wp.type}</td>
                  <td>{wp.status}</td>
                  <td className="tabular-nums">{wp.findingsCount}</td>
                  <td className="tabular-nums">{wp.openCards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
