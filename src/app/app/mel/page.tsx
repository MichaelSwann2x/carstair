"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";

export default function MelPage() {
  const [rows, setRows] = useState<{ melReference: string; title: string; category: string; deferralLimit: string; status: string; reg?: string }[] | null>(null);

  useEffect(() => {
    api<{ mel: { melReference: string; title: string; category: string; deferralLimit: string; status: string; aircraftId: string }[]; aircraft: { id: string; registration: string }[] }>("/api/v1/domain").then((res) => {
      if (!res.ok || !res.data) {
        setRows([]);
        return;
      }
      const map = new Map(res.data.aircraft.map((a) => [a.id, a.registration]));
      setRows(res.data.mel.map((m) => ({ ...m, reg: map.get(m.aircraftId) })));
    });
  }, []);

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
        <h1 className="font-medium">MEL / Deferred defects</h1>
        <p className="text-xs text-[var(--muted)]">Open deferrals with category and limits</p>
      </header>
      <div className="p-6 animate-fade-up">
        <div className="castair-card overflow-hidden bg-white">
          {rows === null ? <div className="p-6 skeleton h-16 w-full" /> : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--muted)]">No open MEL items.</div>
          ) : (
            <table className="castair-table">
              <thead><tr><th scope="col">Reference</th><th scope="col">Aircraft</th><th scope="col">Title</th><th scope="col">Cat</th><th scope="col">Limit</th><th scope="col">Status</th></tr></thead>
              <tbody>
                {rows.map((m, i) => (
                  <tr key={i}>
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
