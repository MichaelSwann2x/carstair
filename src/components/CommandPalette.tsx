"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { repo } from "@/lib/cmms/repo";

export function CommandPalette({
  tenantId,
  onClose,
}: {
  tenantId: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [items, setItems] = useState<{ label: string; href: string; meta?: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [ac, wp, ads] = await Promise.all([
        repo.listAircraft(tenantId),
        repo.listWorkPackages(tenantId),
        repo.listAdSb(tenantId),
      ]);
      if (cancelled) return;
      const rows = [
        ...ac.map((a) => ({
          label: a.registration,
          href: "/app",
          meta: `${a.type} · ${a.status}`,
        })),
        ...wp.map((w) => ({
          label: w.title,
          href: "/app/work-packages",
          meta: w.status,
        })),
        ...ads.map((d) => ({
          label: d.number,
          href: "/app/agents",
          meta: d.title,
        })),
        { label: "Task cards", href: "/app/task-cards" },
        { label: "MEL / Deferred", href: "/app/mel" },
        { label: "Approvals", href: "/app/approvals" },
        { label: "RTS package", href: "/app/rts" },
        { label: "Audit log", href: "/app/audit" },
        { label: "Exports", href: "/app/exports" },
      ];
      setItems(rows);
    })();
    return () => {
      cancelled = true;
    };
  }, [tenantId]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items.slice(0, 12);
    return items.filter(
      (i) => i.label.toLowerCase().includes(s) || (i.meta && i.meta.toLowerCase().includes(s))
    ).slice(0, 12);
  }, [q, items]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4" role="dialog" aria-modal="true" aria-label="Command palette">
      <button type="button" className="absolute inset-0 bg-black/30" aria-label="Close" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white border border-[var(--border)] rounded-xl shadow-lg overflow-hidden">
        <label htmlFor="cmd-search" className="sr-only">
          Search aircraft, work packages, AD/SB
        </label>
        <input
          id="cmd-search"
          autoFocus
          className="w-full px-4 py-3 text-sm border-b border-[var(--border)] outline-none text-black"
          placeholder="Search aircraft, packages, AD/SB…"
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
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-sm text-[var(--muted)]">No matches</li>
          )}
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
                <span className="font-medium text-black">{item.label}</span>
                {item.meta && <span className="text-[var(--muted)] text-xs truncate">{item.meta}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
