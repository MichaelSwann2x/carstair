"use client";

import { useEffect, useState } from "react";
import { getSession, canApproveRTS } from "@/lib/auth/store";
import { listApprovals, setApprovalStatus, type ApprovalItem } from "@/lib/approvals/store";
import { useToast } from "@/lib/toast";
import { appendAudit } from "@/lib/audit/log";

export default function ApprovalsPage() {
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const { toast } = useToast();

  function refresh(tid: string) {
    setItems(listApprovals(tid));
  }

  useEffect(() => {
    const s = getSession();
    if (!s) return;
    setTenantId(s.tenant.id);
    refresh(s.tenant.id);
  }, []);

  async function act(id: string, status: "approved" | "rejected") {
    const s = getSession();
    if (!s || !tenantId) return;
    const item = items.find((x) => x.id === id);
    if (item?.requiresCertifyingStaff && !canApproveRTS(s.user.role)) {
      toast("This item requires certifying staff or admin", "warning");
      return;
    }
    if (status === "approved" && !window.confirm("Confirm approval? Recorded in audit log.")) return;
    setApprovalStatus(tenantId, id, status);
    await appendAudit(
      tenantId,
      { id: s.user.id, name: s.user.name, role: s.user.role },
      status === "approved" ? "approval.approved" : "approval.rejected",
      "approval",
      id,
      `${status}: ${item?.title ?? id}`,
      { status }
    );
    toast(status === "approved" ? "Approved" : "Rejected", "success");
    refresh(tenantId);
  }

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
        <h1 className="font-medium">Approvals</h1>
        <p className="text-xs text-[var(--muted)] mt-0.5">
          Dual-control queue · inspectors escalate · certifying staff release
        </p>
      </header>
      <div className="p-6 space-y-3 animate-fade-up">
        {items.length === 0 && (
          <div className="castair-card p-8 text-center text-sm text-[var(--muted)] bg-white">
            No items. Run an agent and use <strong>Send to Approvals</strong>.
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="castair-card p-4 space-y-2 bg-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium text-sm">{item.title}</div>
                <div className="text-[10px] text-[var(--muted)] uppercase tracking-wide mt-0.5">
                  {item.agentId} · {item.status}
                  {item.requiresCertifyingStaff ? " · certifying required" : ""}
                </div>
              </div>
              {item.status === "pending" && (
                <div className="flex gap-2 shrink-0">
                  <button type="button" onClick={() => act(item.id, "approved")} className="text-xs px-2.5 py-1 rounded-md bg-[var(--accent)] text-white font-medium">
                    Approve
                  </button>
                  <button type="button" onClick={() => act(item.id, "rejected")} className="text-xs px-2.5 py-1 rounded-md border border-[var(--border)]">
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
