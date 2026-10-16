"use client";

import { useState } from "react";
import { api } from "@/lib/api/client";
import { useToast } from "@/lib/toast";

type AdResult = {
  record: { number: string; type: string };
  aircraft: { registration: string };
  recommendation: string;
  rationale: string;
  confidence: number;
  evidence: string[];
  dueContext?: string;
  simulated?: boolean;
};

export default function AgentsPage() {
  const [results, setResults] = useState<AdResult[] | null>(null);
  const [running, setRunning] = useState(false);
  const [simulated, setSimulated] = useState(false);
  const { toast } = useToast();

  async function runAdSb() {
    setRunning(true);
    const res = await api<{ data: AdResult[]; simulated?: boolean }>("/api/v1/agents/ad-sb", { method: "POST", body: "{}" });
    setRunning(false);
    if (!res.ok || !res.data) {
      toast(res.error || "Agent failed", "error");
      return;
    }
    setResults(res.data.data);
    setSimulated(!!res.data.simulated);
    toast(`AD/SB: ${res.data.data.length} result(s)`, "success");
  }

  async function sendApproval(r: AdResult) {
    const res = await api("/api/v1/approvals", {
      method: "POST",
      body: JSON.stringify({
        title: `${r.record.number} on ${r.aircraft.registration}`,
        summary: r.rationale,
        agentId: "ad-sb",
        payload: r,
        requiresCertifying: true,
      }),
    });
    if (!res.ok) {
      toast(res.error || "Failed", "error");
      return;
    }
    toast("Sent to Approvals", "success");
  }

  return (
    <div className="flex-1 flex min-h-0">
      <div className="flex-1 overflow-auto">
        <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
          <h1 className="font-medium">Agents</h1>
          <p className="text-xs text-[var(--muted)]">Server-side applicability · simulated only in Demo · Send to Approvals is real</p>
        </header>
        <div className="p-6 space-y-4 animate-fade-up">
          <button
            type="button"
            disabled={running}
            onClick={runAdSb}
            className="castair-card p-4 text-left bg-white max-w-sm hover:border-zinc-400 disabled:opacity-60"
            aria-busy={running}
          >
            <div className="font-medium mb-1">AD/SB/EO Monitor</div>
            <div className="text-xs text-[var(--muted)]">Type/serial match · due vs hours/cycles · confidence + evidence</div>
            <div className="text-xs mt-3 font-medium">{running ? "Running…" : "Run agent →"}</div>
          </button>
          {simulated && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded px-3 py-2 max-w-lg" role="status">
              Results labelled simulated — this session is Demo mode.
            </p>
          )}
        </div>
      </div>
      <aside className="w-[380px] border-l border-[var(--border)] bg-white overflow-y-auto hidden lg:block" aria-label="Results">
        <div className="px-4 py-3 border-b border-[var(--border)] sticky top-0 bg-white">
          <div className="font-medium text-sm">Agent panel</div>
        </div>
        <div className="p-4 space-y-3">
          {results === null && <p className="text-xs text-[var(--muted)]">Run an agent.</p>}
          {results?.length === 0 && <p className="text-xs text-[var(--muted)]">No matches.</p>}
          {results?.map((r, i) => (
            <div key={i} className="castair-card p-3 space-y-1 bg-[var(--background)]">
              <div className="text-xs font-medium">{r.record.number} · {r.aircraft.registration}</div>
              <div className="text-xs">{r.recommendation} · {r.confidence}%</div>
              {r.dueContext && <p className="text-xs status-rts inline-block">{r.dueContext}</p>}
              <p className="text-xs text-[var(--muted)]">{r.rationale}</p>
              <ul className="text-[10px] text-[var(--muted)]">{r.evidence.map((e, j) => <li key={j}>· {e}</li>)}</ul>
              <button type="button" className="text-[11px] underline font-medium" onClick={() => sendApproval(r)}>
                Send to Approvals
              </button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
