"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [items, setItems] = useState<{ label: string; href: string; meta?: string }[]>([]);

  useEffect(() => {
    api<{
      aircraft: { registration: string; type: string; status: string }[];
      workPackages: { title: string; status: string }[];
      taskCards: { title: string; status: string }[];
      adSb: { number: string; title: string }[];
      approvals: { title: string; status: string }[];
    }>("/api/v1/domain").then((res) => {
      if (!res.ok || !res.data) return;
      const d = res.data;
      setItems([
        ...d.aircraft.map((a) => ({ label: a.registration, href: "/app", meta: `${a.type} · ${a.status}` })),
        ...d.workPackages.map((w) => ({ label: w.title, href: "/app/work-packages", meta: w.status })),
        ...d.taskCards.map((t) => ({ label: t.title, href: "/app/task-cards", meta: t.status })),
        ...d.adSb.map((x) => ({ label: x.number, href: "/app/agents", meta: x.title })),
        ...d.approvals.map((a) => ({ label: a.title, href: "/app/approvals", meta: a.status })),
        { label: "RTS package", href: "/app/rts" },
        { label: "Audit log", href: "/app/audit" },
        { label: "Exports", href: "/app/exports" },
      ]);
    });
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items.slice(0, 12);
    return items.filter((i) => i.label.toLowerCase().includes(s) || i.meta?.toLowerCase().includes(s)).slice(0, 12);
  }, [q, items]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4" role="dialog" aria-modal="true" aria-label="Search">
      <button type="button" className="absolute inset-0 bg-black/30" aria-label="Close" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white border border-[var(--border)] rounded-xl shadow-lg overflow-hidden">
        <label htmlFor="cmd" className="sr-only">Search</label>
        <input
          id="cmd"
          autoFocus
          className="w-full px-4 py-3 text-sm border-b border-[var(--border)] outline-none"
          placeholder="Search aircraft, task cards, approvals, AD/SB…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "Enter" && filtered[0]) {
              router.push(filtered[0].href);
              onClose();
            }
          }}
        />
        <ul className="max-h-72 overflow-y-auto py-1" role="listbox">
          {filtered.length === 0 && <li className="px-4 py-3 text-sm text-[var(--muted)]">No matches</li>}
          {filtered.map((item, i) => (
            <li key={i} role="option">
              <button
                type="button"
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--accent-soft)] flex justify-between gap-2"
                onClick={() => {
                  router.push(item.href);
                  onClose();
                }}
              >
                <span className="font-medium">{item.label}</span>
                {item.meta && <span className="text-xs text-[var(--muted)] truncate">{item.meta}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
