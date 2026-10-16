"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth/store";
import { listAudit, type AuditEntry } from "@/lib/audit/log";

export default function AuditPage() {
  const [rows, setRows] = useState<AuditEntry[] | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) return;
    listAudit(s.tenant.id).then(setRows);
  }, []);

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
        <h1 className="font-medium">Audit log</h1>
        <p className="text-xs text-[var(--muted)]">Immutable chain · SHA-256 payload hash · airworthiness actions</p>
      </header>
      <div className="p-6 animate-fade-up">
        <div className="castair-card overflow-hidden bg-white">
          {rows === null ? (
            <div className="p-6 skeleton h-16 w-full" />
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--muted)]">
              No audit entries yet. Sign task cards, generate RTS packages, or add aircraft.
            </div>
          ) : (
            <table className="castair-table">
              <thead>
                <tr>
                  <th scope="col">When</th>
                  <th scope="col">Actor</th>
                  <th scope="col">Action</th>
                  <th scope="col">Summary</th>
                  <th scope="col">Hash</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <tr key={e.id}>
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
