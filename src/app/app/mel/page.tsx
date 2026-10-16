"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth/store";
import { repo } from "@/lib/cmms/repo";
import type { MelItem, Aircraft } from "@/lib/cmms/models";

export default function MelPage() {
  const [rows, setRows] = useState<(MelItem & { reg?: string })[] | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) return;
    (async () => {
      await repo.seedDemo(s.tenant.id);
      const ac = await repo.listAircraft(s.tenant.id);
      const map = new Map(ac.map((a: Aircraft) => [a.id, a.registration]));
      const mel = await repo.listMel(s.tenant.id);
      setRows(mel.map((m) => ({ ...m, reg: map.get(m.aircraftId) })));
    })();
  }, []);

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
        <h1 className="font-medium">MEL / Deferred defects</h1>
        <p className="text-xs text-[var(--muted)]">Open deferrals with category and limits</p>
      </header>
      <div className="p-6 animate-fade-up">
        <div className="castair-card overflow-hidden bg-white">
          {rows === null ? (
            <div className="p-6 skeleton h-16 w-full" />
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--muted)]">No open MEL items.</div>
          ) : (
            <table className="castair-table">
              <thead>
                <tr>
                  <th scope="col">Reference</th>
                  <th scope="col">Aircraft</th>
                  <th scope="col">Title</th>
                  <th scope="col">Cat</th>
                  <th scope="col">Limit</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.id}>
                    <td className="font-medium">{m.melReference}</td>
                    <td>{m.reg}</td>
                    <td>{m.title}</td>
                    <td>{m.category}</td>
                    <td className="text-[var(--muted)]">{m.deferralLimit}</td>
                    <td><span className={m.status === "open" ? "status-open" : ""}>{m.status}</span></td>
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
