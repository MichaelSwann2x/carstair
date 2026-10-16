"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth/store";
import {
  listApprovals,
  setApprovalStatus,
  type ApprovalItem,
} from "@/lib/approvals/store";

export default function ApprovalsPage() {
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);

  function refresh(tid: string) {
    setItems(listApprovals(tid));
  }

  useEffect(() => {
    const s = getSession();
    if (!s) return;
    setTenantId(s.tenant.id);
    refresh(s.tenant.id);
  }, []);

  function act(id: string, status: "approved" | "rejected") {
    if (!tenantId) return;
    setApprovalStatus(tenantId, id, status);
    refresh(tenantId);
  }

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-[var(--surface)]">
        <h1 className="font-medium">Approvals</h1>
        <p className="text-xs text-[var(--muted)] mt-0.5">
          Human-in-the-loop queue. Agent outputs that touch airworthiness land here.
        </p>
      </header>
      <div className="p-6 space-y-3 animate-fade-up">
        {items.length === 0 && (
          <div className="castair-card p-8 text-center text-sm text-[var(--muted)]">
            No items yet. Run an agent and click <strong>Send to Approvals</strong> in the agent panel.
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="castair-card p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium text-sm">{item.title}</div>
                <div className="text-[10px] text-[var(--muted)] uppercase tracking-wide mt-0.5">
                  {item.agentId} · {item.status}
                </div>
              </div>
              {item.status === "pending" && (
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => act(item.id, "approved")}
                    className="text-xs px-2.5 py-1 rounded-md bg-[var(--accent)] text-[var(--background)] font-medium"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => act(item.id, "rejected")}
                    className="text-xs px-2.5 py-1 rounded-md border border-[var(--border)]"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">{item.summary}</p>
          </div>
        ))}
      </div>
    </>
  );
}
