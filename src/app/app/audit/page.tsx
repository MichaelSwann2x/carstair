"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";

type Entry = {
  createdAt: string;
  actorName: string;
  actorRole: string;
  action: string;
  summary: string;
  payloadHash: string;
};

export default function AuditPage() {
  const [rows, setRows] = useState<Entry[] | null>(null);

  useEffect(() => {
    api<{ audit: Entry[] }>("/api/v1/domain").then((res) => {
      if (res.ok && res.data) setRows(res.data.audit);
      else setRows([]);
    });
  }, []);

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
        <h1 className="font-medium">Audit log</h1>
        <p className="text-xs text-[var(--muted)]">Append-only · SHA-256 chain · server-written</p>
      </header>
      <div className="p-6 animate-fade-up">
        <div className="castair-card overflow-hidden bg-white">
          {rows === null ? <div className="p-6 skeleton h-16 w-full" /> : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--muted)]">No audit entries yet.</div>
          ) : (
            <table className="castair-table">
              <thead><tr><th scope="col">When</th><th scope="col">Actor</th><th scope="col">Action</th><th scope="col">Summary</th><th scope="col">Hash</th></tr></thead>
              <tbody>
                {rows.map((e, i) => (
                  <tr key={i}>
                    <td className="text-xs tabular-nums whitespace-nowrap">{new Date(e.createdAt).toLocaleString()}</td>
                    <td className="text-xs">{e.actorName}<br /><span className="text-[var(--muted)]">{e.actorRole}</span></td>
                    <td className="text-xs font-medium">{e.action}</td>
                    <td className="text-xs">{e.summary}</td>
                    <td className="text-[10px] font-mono text-[var(--muted)]">{e.payloadHash.slice(0, 12)}…</td>
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
