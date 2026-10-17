"use client";

import { useEffect, useState } from "react";
import { loadOutbox, saveOutbox, type OutboxOp } from "@/lib/offline/outbox";
import { api } from "@/lib/api/client";
import { useToast } from "@/lib/toast";

export function OfflineConflicts() {
  const [conflicts, setConflicts] = useState<OutboxOp[]>([]);
  const { toast } = useToast();

  function refresh() {
    setConflicts(loadOutbox().filter((o) => !o.conflictSafe));
  }

  useEffect(() => {
    refresh();
    window.addEventListener("castair-outbox", refresh);
    return () => window.removeEventListener("castair-outbox", refresh);
  }, []);

  if (conflicts.length === 0) return null;

  async function apply(op: OutboxOp) {
    const res = await api(op.path, {
      method: op.method,
      body: op.body ? JSON.stringify(op.body) : undefined,
    });
    if (!res.ok) {
      toast(res.error || "Sync failed", "error");
      return;
    }
    saveOutbox(loadOutbox().filter((o) => o.id !== op.id));
    toast("Conflict resolved — applied to server", "success");
    refresh();
  }

  function discard(op: OutboxOp) {
    saveOutbox(loadOutbox().filter((o) => o.id !== op.id));
    toast("Local change discarded", "info");
    refresh();
  }

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3" role="region" aria-label="Sync conflicts">
      <div className="text-xs font-medium text-amber-950 mb-2">
        {conflicts.length} offline change(s) need review (signatures / findings are never auto-merged)
      </div>
      <ul className="space-y-2">
        {conflicts.map((op) => (
          <li key={op.id} className="flex flex-wrap items-center gap-2 text-xs text-amber-900">
            <span className="font-mono">{op.method} {op.path}</span>
            <span className="text-amber-700">{op.entityType}</span>
            <button type="button" className="px-2 py-0.5 rounded bg-zinc-900 text-white" onClick={() => apply(op)}>
              Apply server write
            </button>
            <button type="button" className="px-2 py-0.5 rounded border border-amber-300" onClick={() => discard(op)}>
              Discard local
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
