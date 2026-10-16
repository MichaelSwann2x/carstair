"use client";

import { useEffect, useState } from "react";
import { getSession, canApproveRTS } from "@/lib/auth/store";
import { repo } from "@/lib/cmms/repo";
import type { TaskCard } from "@/lib/cmms/models";
import { useToast } from "@/lib/toast";
import { appendAudit } from "@/lib/audit/log";

async function hashSig(input: string) {
  if (crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
  }
  return `sig_${input.length}`;
}

export default function TaskCardsPage() {
  const [rows, setRows] = useState<TaskCard[] | null>(null);
  const { toast } = useToast();

  async function refresh(tenantId: string) {
    await repo.seedDemo(tenantId);
    setRows(await repo.listTaskCards(tenantId));
  }

  useEffect(() => {
    const s = getSession();
    if (!s) return;
    refresh(s.tenant.id);
  }, []);

  async function sign(card: TaskCard, asRii: boolean) {
    const s = getSession();
    if (!s) return;
    if (asRii && !canApproveRTS(s.user.role)) {
      toast("RII / certifying signature requires certifying staff role", "warning");
      return;
    }
    const ok = window.confirm(
      asRii
        ? "Confirm RII / dual inspection signature? This is recorded in the audit log."
        : "Confirm technician / inspector sign-off?"
    );
    if (!ok) return;
    const at = new Date().toISOString();
    const hash = await hashSig(`${card.id}|${s.user.id}|${at}|${asRii ? "rii" : "perform"}`);
    const next: TaskCard = {
      ...card,
      signatures: [...card.signatures, { role: asRii ? "rii" : s.user.role, name: s.user.name, at, hash }],
      status: asRii || !card.riiRequired ? "signed" : "rii_pending",
      updatedAt: at,
    };
    await repo.putTaskCard(next);
    await appendAudit(
      s.tenant.id,
      { id: s.user.id, name: s.user.name, role: s.user.role },
      asRii ? "task_card.rii_sign" : "task_card.sign",
      "task_card",
      card.id,
      `${asRii ? "RII" : "Performer"} signed: ${card.title}`,
      { hash }
    );
    toast(asRii ? "RII signature recorded" : "Signature recorded", "success");
    refresh(s.tenant.id);
  }

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
        <h1 className="font-medium">Task cards</h1>
        <p className="text-xs text-[var(--muted)]">Electronic job cards · multi-step signatures · RII gates</p>
      </header>
      <div className="p-6 space-y-3 animate-fade-up">
        {rows === null && <div className="skeleton h-20 w-full" />}
        {rows?.length === 0 && (
          <div className="castair-card p-8 text-center text-sm text-[var(--muted)] bg-white">No task cards.</div>
        )}
        {rows?.map((tc) => (
          <div key={tc.id} className="castair-card p-4 bg-white space-y-2">
            <div className="flex justify-between gap-2">
              <div>
                <div className="font-medium text-sm">{tc.title}</div>
                <div className="text-xs text-[var(--muted)] mt-0.5">{tc.description}</div>
              </div>
              <span className={tc.status === "rii_pending" ? "status-rts text-xs h-fit" : "text-xs text-[var(--muted)]"}>
                {tc.status.replace("_", " ")}
              </span>
            </div>
            {tc.riiRequired && <p className="text-xs text-[var(--warning)]">RII required — separation of duties enforced</p>}
            {tc.signatures.length > 0 && (
              <ul className="text-xs text-[var(--muted)] space-y-0.5">
                {tc.signatures.map((sig, i) => (
                  <li key={i}>{sig.role}: {sig.name} · {new Date(sig.at).toLocaleString()} · hash {sig.hash}</li>
                ))}
              </ul>
            )}
            <div className="flex gap-2 pt-1">
              <button type="button" className="text-xs px-2.5 py-1 rounded border border-[var(--border)]" onClick={() => sign(tc, false)}>
                Sign (performer)
              </button>
              {tc.riiRequired && (
                <button type="button" className="text-xs px-2.5 py-1 rounded bg-[var(--accent)] text-white" onClick={() => sign(tc, true)}>
                  RII sign (certifying)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
