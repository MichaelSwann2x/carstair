"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth/store";
import { repo } from "@/lib/cmms/repo";
import type { WorkPackage, Aircraft } from "@/lib/cmms/models";

export default function WorkPackagesPage() {
  const [rows, setRows] = useState<(WorkPackage & { reg?: string })[] | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) return;
    (async () => {
      await repo.seedDemo(s.tenant.id);
      const ac = await repo.listAircraft(s.tenant.id);
      const map = new Map(ac.map((a: Aircraft) => [a.id, a.registration]));
      const wps = await repo.listWorkPackages(s.tenant.id);
      setRows(wps.map((wp) => ({ ...wp, reg: map.get(wp.aircraftId) })));
    })();
  }, []);

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
        <h1 className="font-medium">Work packages</h1>
        <p className="text-xs text-[var(--muted)]">Heavy check and line packages</p>
      </header>
      <div className="p-6 animate-fade-up">
        <div className="castair-card overflow-hidden bg-white">
          {rows === null ? (
            <div className="p-6"><div className="skeleton h-4 w-full mb-2" /><div className="skeleton h-4 w-2/3" /></div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--muted)]">No work packages.</div>
          ) : (
            <table className="castair-table">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Aircraft</th>
                  <th scope="col">Type</th>
                  <th scope="col">Status</th>
                  <th scope="col">Open cards</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((wp) => (
                  <tr key={wp.id}>
                    <td className="font-medium">{wp.title}</td>
                    <td className="tabular-nums">{wp.reg ?? "—"}</td>
                    <td className="text-[var(--muted)]">{wp.type}</td>
                    <td><span className={wp.status === "in_progress" ? "status-open" : ""}>{wp.status}</span></td>
                    <td className="tabular-nums">{wp.openCards}</td>
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
