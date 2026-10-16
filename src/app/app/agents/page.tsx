"use client";

import { useState } from "react";
import { getSession } from "@/lib/auth/store";
import { runAdSbMonitor, type AdSbFinding } from "@/lib/agents/ad-sb-monitor";
import { runClosedLoopVisual, type VisualDisposition } from "@/lib/agents/closed-loop-visual";
import {
  runExplainableAirworthiness,
  type AirworthinessExplanation,
} from "@/lib/agents/explainable-airworthiness";
import { pushApproval } from "@/lib/approvals/store";
import { useToast } from "@/lib/toast";
import { appendAudit } from "@/lib/audit/log";

type Panel =
  | { kind: "ad-sb"; results: AdSbFinding[] }
  | { kind: "visual"; result: VisualDisposition }
  | { kind: "explain"; result: AirworthinessExplanation }
  | null;

export default function AgentsPage() {
  const [panel, setPanel] = useState<Panel>(null);
  const [running, setRunning] = useState<string | null>(null);
  const [location, setLocation] = useState("LH wing upper skin, STA 540");
  const [defectType, setDefectType] = useState("Dent");
  const [measured, setMeasured] = useState("1.2");
  const [limit, setLimit] = useState("1.5");
  const [question, setQuestion] = useState(
    "Can this dent be accepted and the aircraft returned to service?"
  );
  const [finding, setFinding] = useState("Skin dent 1.2 mm within SRM limit 1.5 mm");
  const [action, setAction] = useState("Accept as is with recurrent inspection");
  const { toast } = useToast();

  async function runAdSb() {
    const s = getSession();
    if (!s) return;
    setRunning("ad-sb");
    const results = await runAdSbMonitor(s.tenant.id);
    setPanel({ kind: "ad-sb", results });
    setRunning(null);
    toast(`AD/SB monitor: ${results.length} result(s)`, "success");
  }

  function runVisual() {
    setRunning("visual");
    const result = runClosedLoopVisual({
      aircraftRegistration: "N123AB",
      location,
      defectType,
      measuredValue: parseFloat(measured) || undefined,
      unit: "mm",
      srmLimit: parseFloat(limit) || undefined,
    });
    setPanel({ kind: "visual", result });
    setRunning(null);
    toast("Visual disposition complete", "success");
  }

  function runExplain() {
    setRunning("explain");
    const result = runExplainableAirworthiness({
      question,
      aircraftType: "B737-800",
      registration: "N123AB",
      findingSummary: finding,
      proposedAction: action,
    });
    setPanel({ kind: "explain", result });
    setRunning(null);
    toast("Airworthiness path ready", "success");
  }

  async function sendToApprovals(title: string, summary: string, payload: unknown) {
    const s = getSession();
    if (!s) return;
    pushApproval(s.tenant.id, {
      title,
      summary,
      agentId: panel?.kind ?? "agent",
      payload,
      status: "pending",
      requiresCertifyingStaff: true,
    });
    await appendAudit(
      s.tenant.id,
      { id: s.user.id, name: s.user.name, role: s.user.role },
      "approval.escalated",
      "approval",
      title,
      summary,
      payload
    );
    toast("Sent to Approvals", "success");
  }

  return (
    <div className="flex-1 flex min-h-0">
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
          <h1 className="font-medium">Agents</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Evidence, confidence, provenance — escalate to dual-control approvals
          </p>
        </header>

        <div className="p-6 space-y-6 animate-fade-up">
          <div className="grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={runAdSb}
              disabled={running === "ad-sb"}
              className="castair-card p-4 text-left bg-white hover:border-zinc-400 transition-colors disabled:opacity-60"
              aria-busy={running === "ad-sb"}
            >
              <div className="font-medium mb-1">AD/SB/EO Monitor</div>
              <div className="text-xs text-[var(--muted)] leading-relaxed">
                Applicability vs type/SN · due vs hours/cycles
              </div>
              <div className="text-xs mt-3 font-medium text-zinc-700">
                {running === "ad-sb" ? "Running…" : "Run agent →"}
              </div>
            </button>

            <div className="castair-card p-4 space-y-2 bg-white">
              <div className="font-medium">Closed-Loop Visual</div>
              <label className="sr-only" htmlFor="loc">Location</label>
              <input id="loc" className="w-full border border-[var(--border)] rounded px-2 py-1 text-xs bg-white" value={location} onChange={(e) => setLocation(e.target.value)} />
              <div className="flex gap-2">
                <input className="flex-1 border border-[var(--border)] rounded px-2 py-1 text-xs bg-white" value={defectType} onChange={(e) => setDefectType(e.target.value)} aria-label="Defect type" />
                <input className="w-16 border border-[var(--border)] rounded px-2 py-1 text-xs bg-white" value={measured} onChange={(e) => setMeasured(e.target.value)} aria-label="Measured mm" />
                <input className="w-16 border border-[var(--border)] rounded px-2 py-1 text-xs bg-white" value={limit} onChange={(e) => setLimit(e.target.value)} aria-label="SRM limit" />
              </div>
              <button type="button" onClick={runVisual} disabled={running === "visual"} className="text-xs font-medium text-zinc-700">
                {running === "visual" ? "Running…" : "Run agent →"}
              </button>
            </div>

            <div className="castair-card p-4 space-y-2 bg-white">
              <div className="font-medium">Explainable Airworthiness</div>
              <textarea className="w-full border border-[var(--border)] rounded px-2 py-1 text-xs bg-white min-h-[52px]" value={question} onChange={(e) => setQuestion(e.target.value)} aria-label="Question" />
              <input className="w-full border border-[var(--border)] rounded px-2 py-1 text-xs bg-white" value={finding} onChange={(e) => setFinding(e.target.value)} aria-label="Finding" />
              <button type="button" onClick={runExplain} disabled={running === "explain"} className="text-xs font-medium text-zinc-700">
                {running === "explain" ? "Running…" : "Run agent →"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <aside className="w-[380px] agent-panel shrink-0 overflow-y-auto hidden lg:block bg-white" aria-label="Agent results">
        <div className="px-4 py-3 border-b border-[var(--border)] sticky top-0 bg-white">
          <div className="font-medium text-sm">Agent panel</div>
          <div className="text-xs text-[var(--muted)]">Evidence · confidence · escalate</div>
        </div>
        <div className="p-4 space-y-4 text-sm">
          {!panel && <p className="text-[var(--muted)] text-xs">Run an agent to see results.</p>}

          {panel?.kind === "ad-sb" &&
            panel.results.map((r, i) => (
              <div key={i} className="castair-card p-3 space-y-1.5 bg-[var(--background)]">
                <div className="font-medium text-xs">{r.record.number} · {r.aircraft.registration}</div>
                <div className="text-xs">
                  <span className="text-[var(--muted)]">Rec:</span> <span className="font-medium">{r.recommendation}</span>
                  <span className="text-[var(--muted)]"> · {r.confidence}%</span>
                </div>
                {r.dueContext && <p className="text-xs status-rts inline-block">{r.dueContext}</p>}
                <p className="text-xs text-[var(--muted)]">{r.rationale}</p>
                <ul className="text-[10px] text-[var(--muted)] space-y-0.5">
                  {r.evidence.map((e, j) => (
                    <li key={j}>· {e}</li>
                  ))}
                </ul>
                <button type="button" className="text-[11px] font-medium underline" onClick={() => sendToApprovals(`${r.record.number} on ${r.aircraft.registration}`, r.rationale, r)}>
                  Send to Approvals
                </button>
              </div>
            ))}

          {panel?.kind === "visual" && (
            <div className="space-y-3">
              <div className="castair-card p-3 space-y-2 bg-[var(--background)]">
                <div className="text-xs font-medium">Disposition: {panel.result.disposition}</div>
                <p className="text-xs text-[var(--muted)]">{panel.result.language}</p>
                <div className="text-xs text-[var(--warning)]">Requires human approval</div>
                <button type="button" className="text-[11px] font-medium underline" onClick={() => sendToApprovals(`Visual: ${panel.result.disposition}`, panel.result.language, panel.result)}>
                  Send to Approvals
                </button>
              </div>
            </div>
          )}

          {panel?.kind === "explain" && (
            <div className="space-y-3">
              <div className="castair-card p-3 bg-[var(--background)]">
                <p className="text-xs leading-relaxed">{panel.result.answer}</p>
              </div>
              <ul className="space-y-1">
                {panel.result.regulatoryPath.map((p, i) => (
                  <li key={i} className="text-xs text-[var(--muted)] pl-2 border-l border-[var(--border)]">{p}</li>
                ))}
              </ul>
              <button type="button" className="text-[11px] font-medium underline" onClick={() => sendToApprovals("Airworthiness reasoning", panel.result.answer.slice(0, 200), panel.result)}>
                Send to Approvals
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
