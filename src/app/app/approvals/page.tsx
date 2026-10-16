"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import { useToast } from "@/lib/toast";

type Approval = {
  id: string;
  title: string;
  summary: string;
  status: string;
  agentId?: string;
  requiresCertifying: boolean;
};

export default function ApprovalsPage() {
  const [items, setItems] = useState<Approval[] | null>(null);
  const { toast } = useToast();

  async function load() {
    const res = await api<{ data: Approval[] }>("/api/v1/approvals");
    if (res.ok && res.data) setItems(res.data.data);
    else setItems([]);
  }

  useEffect(() => {
    load();
  }, []);

  async function act(id: string, status: "approved" | "rejected") {
    if (status === "approved" && !window.confirm("Confirm approval? Audited.")) return;
    const res = await api(`/api/v1/approvals/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast(res.error || "Failed", "error");
      return;
    }
    toast(status === "approved" ? "Approved" : "Rejected", "success");
    load();
  }

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
        <h1 className="font-medium">Approvals</h1>
        <p className="text-xs text-[var(--muted)]">Server-enforced dual-control · certifying staff for release items</p>
      </header>
      <div className="p-6 space-y-3 animate-fade-up">
        {items === null && <div className="skeleton h-16 w-full" />}
        {items?.length === 0 && (
          <div className="castair-card p-8 text-center text-sm text-[var(--muted)] bg-white">
            No items. Run Agents → Send to Approvals.
          </div>
        )}
        {items?.map((item) => (
          <div key={item.id} className="castair-card p-4 bg-white space-y-2">
            <div className="flex justify-between gap-3">
              <div>
                <div className="font-medium text-sm">{item.title}</div>
                <div className="text-[10px] text-[var(--muted)] uppercase tracking-wide">
                  {item.agentId} · {item.status}
                  {item.requiresCertifying ? " · certifying required" : ""}
                </div>
              </div>
              {item.status === "pending" && (
                <div className="flex gap-2">
                  <button type="button" className="text-xs px-2.5 py-1 rounded bg-[var(--accent)] text-white" onClick={() => act(item.id, "approved")}>
                    Approve
                  </button>
                  <button type="button" className="text-xs px-2.5 py-1 rounded border border-[var(--border)]" onClick={() => act(item.id, "rejected")}>
                    Reject
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-[var(--muted)]">{item.summary}</p>
          </div>
        ))}
      </div>
    </>
  );
}
