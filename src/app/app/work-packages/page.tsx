"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";

export default function WorkPackagesPage() {
  const [rows, setRows] = useState<{ title: string; status: string; type: string; openCards: number; aircraftId: string; reg?: string }[] | null>(null);

  useEffect(() => {
    api<{ workPackages: { title: string; status: string; type: string; openCards: number; aircraftId: string }[]; aircraft: { id: string; registration: string }[] }>("/api/v1/domain").then((res) => {
      if (!res.ok || !res.data) {
        setRows([]);
        return;
      }
      const map = new Map(res.data.aircraft.map((a) => [a.id, a.registration]));
      setRows(res.data.workPackages.map((w) => ({ ...w, reg: map.get(w.aircraftId) })));
    });
  }, []);

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
        <h1 className="font-medium">Work packages</h1>
        <p className="text-xs text-[var(--muted)]">Linked to aircraft and task cards</p>
      </header>
      <div className="p-6 animate-fade-up">
        <div className="castair-card overflow-hidden bg-white">
          {rows === null ? <div className="p-6 skeleton h-16 w-full" /> : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--muted)]">No work packages.</div>
          ) : (
            <table className="castair-table">
              <thead><tr><th scope="col">Title</th><th scope="col">Aircraft</th><th scope="col">Type</th><th scope="col">Status</th><th scope="col">Open cards</th></tr></thead>
              <tbody>
                {rows.map((wp, i) => (
                  <tr key={i}>
                    <td className="font-medium">{wp.title}</td>
                    <td>{wp.reg ?? "—"}</td>
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
