"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth/store";
import { repo } from "@/lib/cmms/repo";
import type { ComponentLife, Aircraft } from "@/lib/cmms/models";

export default function ComponentsPage() {
  const [rows, setRows] = useState<(ComponentLife & { reg?: string })[] | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) return;
    (async () => {
      await repo.seedDemo(s.tenant.id);
      const ac = await repo.listAircraft(s.tenant.id);
      const map = new Map(ac.map((a: Aircraft) => [a.id, a.registration]));
      const comps = await repo.listComponents(s.tenant.id);
      setRows(comps.map((c) => ({ ...c, reg: map.get(c.aircraftId) })));
    })();
  }, []);

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
        <h1 className="font-medium">Components</h1>
        <p className="text-xs text-[var(--muted)]">Life tracking · TSN / TSO / cycles / serialised</p>
      </header>
      <div className="p-6 animate-fade-up">
        <div className="castair-card overflow-hidden bg-white">
          {rows === null ? (
            <div className="p-6 skeleton h-16 w-full" />
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--muted)]">No components tracked.</div>
          ) : (
            <table className="castair-table">
              <thead>
                <tr>
                  <th scope="col">P/N</th>
                  <th scope="col">S/N</th>
                  <th scope="col">Description</th>
                  <th scope="col">Aircraft</th>
                  <th scope="col">TSN</th>
                  <th scope="col">TSO</th>
                  <th scope="col">Cycles</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td className="font-medium tabular-nums">{c.partNumber}</td>
                    <td className="tabular-nums">{c.serialNumber}</td>
                    <td>{c.description}</td>
                    <td>{c.reg}</td>
                    <td className="tabular-nums">{c.tsn}</td>
                    <td className="tabular-nums">{c.tso}</td>
                    <td className="tabular-nums">{c.cycles}</td>
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
