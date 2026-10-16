"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";

export default function ComponentsPage() {
  const [rows, setRows] = useState<{ partNumber: string; serialNumber: string; description: string; tsn: number; tso: number; cycles: number; reg?: string }[] | null>(null);

  useEffect(() => {
    api<{ components: { partNumber: string; serialNumber: string; description: string; tsn: number; tso: number; cycles: number; aircraftId: string }[]; aircraft: { id: string; registration: string }[] }>("/api/v1/domain").then((res) => {
      if (!res.ok || !res.data) {
        setRows([]);
        return;
      }
      const map = new Map(res.data.aircraft.map((a) => [a.id, a.registration]));
      setRows(res.data.components.map((c) => ({ ...c, reg: map.get(c.aircraftId) })));
    });
  }, []);

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
        <h1 className="font-medium">Components</h1>
        <p className="text-xs text-[var(--muted)]">TSN / TSO / cycles / serialised</p>
      </header>
      <div className="p-6 animate-fade-up">
        <div className="castair-card overflow-hidden bg-white">
          {rows === null ? <div className="p-6 skeleton h-16 w-full" /> : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--muted)]">No components.</div>
          ) : (
            <table className="castair-table">
              <thead><tr><th scope="col">P/N</th><th scope="col">S/N</th><th scope="col">Description</th><th scope="col">Aircraft</th><th scope="col">TSN</th><th scope="col">TSO</th><th scope="col">Cycles</th></tr></thead>
              <tbody>
                {rows.map((c, i) => (
                  <tr key={i}>
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
