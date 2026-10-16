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

type Panel =
  | { kind: "ad-sb"; results: AdSbFinding[] }
  | { kind: "visual"; result: VisualDisposition }
  | { kind: "explain"; result: AirworthinessExplanation }
  | null;

export default function AgentsPage() {
  const [panel, setPanel] = useState<Panel>(null);
  const [running, setRunning] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Visual form
  const [location, setLocation] = useState("LH wing upper skin, STA 540");
  const [defectType, setDefectType] = useState("Dent");
  const [measured, setMeasured] = useState("1.2");
  const [limit, setLimit] = useState("1.5");

  // Explain form
  const [question, setQuestion] = useState(
    "Can this dent be accepted and the aircraft returned to service?"
  );
  const [finding, setFinding] = useState("Skin dent 1.2 mm within SRM limit 1.5 mm");
  const [action, setAction] = useState("Accept as is with recurrent inspection");

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function runAdSb() {
    const s = getSession();
    if (!s) return;
    setRunning("ad-sb");
    const results = runAdSbMonitor(s.tenant.id);
    setPanel({ kind: "ad-sb", results });
    setRunning(null);
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
  }

  function sendToApprovals(title: string, summary: string, payload: unknown) {
    const s = getSession();
    if (!s) return;
    pushApproval(s.tenant.id, {
      title,
      summary,
      agentId: panel?.kind ?? "agent",
      payload,
      status: "pending",
    });
    flash("Sent to Approvals queue");
  }

  return (
    <div className="flex-1 flex min-h-0">
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <header className="border-b border-[var(--border)] px-6 py-3 bg-[var(--surface)] flex items-center justify-between">
          <div>
            <h1 className="font-medium">Agents</h1>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Run agents, review evidence, escalate airworthiness items to Approvals.
            </p>
          </div>
          {toast && <span className="text-xs text-[var(--success)]">{toast}</span>}
        </header>

        <div className="p-6 space-y-6 animate-fade-up">
          <div className="grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={runAdSb}
              disabled={running === "ad-sb"}
              className="castair-card p-4 text-left hover:border-[var(--foreground)]/20 transition-colors disabled:opacity-60"
            >
              <div className="font-medium mb-1">AD/SB Monitor</div>
              <div className="text-xs text-[var(--muted)] leading-relaxed">
                Applicability evaluation across the fleet register.
              </div>
              <div className="text-xs mt-3 text-[var(--highlight)]">
                {running === "ad-sb" ? "Running…" : "Run agent →"}
              </div>
            </button>

            <div className="castair-card p-4 space-y-2">
              <div className="font-medium">Closed-Loop Visual</div>
              <input
                className="w-full border border-[var(--border)] rounded px-2 py-1 text-xs bg-transparent"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
              />
              <div className="flex gap-2">
                <input
                  className="flex-1 border border-[var(--border)] rounded px-2 py-1 text-xs bg-transparent"
                  value={defectType}
                  onChange={(e) => setDefectType(e.target.value)}
                  placeholder="Defect"
                />
                <input
                  className="w-16 border border-[var(--border)] rounded px-2 py-1 text-xs bg-transparent"
                  value={measured}
                  onChange={(e) => setMeasured(e.target.value)}
                  placeholder="mm"
                />
                <input
                  className="w-16 border border-[var(--border)] rounded px-2 py-1 text-xs bg-transparent"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  placeholder="limit"
                />
              </div>
              <button
                type="button"
                onClick={runVisual}
                disabled={running === "visual"}
                className="text-xs text-[var(--highlight)] font-medium"
              >
                {running === "visual" ? "Running…" : "Run agent →"}
              </button>
            </div>

            <div className="castair-card p-4 space-y-2">
              <div className="font-medium">Explainable Airworthiness</div>
              <textarea
                className="w-full border border-[var(--border)] rounded px-2 py-1 text-xs bg-transparent min-h-[52px]"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <input
                className="w-full border border-[var(--border)] rounded px-2 py-1 text-xs bg-transparent"
                value={finding}
                onChange={(e) => setFinding(e.target.value)}
                placeholder="Finding summary"
              />
              <button
                type="button"
                onClick={runExplain}
                disabled={running === "explain"}
                className="text-xs text-[var(--highlight)] font-medium"
              >
                {running === "explain" ? "Running…" : "Run agent →"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <aside className="w-[380px] agent-panel shrink-0 overflow-y-auto hidden lg:block">
        <div className="px-4 py-3 border-b border-[var(--border)] sticky top-0 bg-[var(--surface-elevated)]">
          <div className="font-medium text-sm">Agent panel</div>
          <div className="text-xs text-[var(--muted)]">Evidence · recommendations · escalate</div>
        </div>
        <div className="p-4 space-y-4 text-sm">
          {!panel && (
            <p className="text-[var(--muted)] text-xs leading-relaxed">
              Run an agent. Results and “Send to Approvals” appear here.
            </p>
          )}

          {panel?.kind === "ad-sb" && (
            <div className="space-y-3 animate-fade-up">
              {panel.results.length === 0 && (
                <p className="text-[var(--muted)] text-xs">No AD/SB records. Use demo tenant or add aircraft first.</p>
              )}
              {panel.results.map((r, i) => (
                <div key={i} className="castair-card p-3 space-y-1.5">
                  <div className="font-medium text-xs">
                    {r.record.number} · {r.aircraft.registration}
                  </div>
                  <div className="text-xs">
                    <span className="text-[var(--muted)]">Rec:</span>{" "}
                    <span className="font-medium">{r.recommendation}</span>
                    <span className="text-[var(--muted)]"> · {r.confidence}%</span>
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{r.rationale}</p>
                  <button
                    type="button"
                    className="text-[11px] text-[var(--highlight)] font-medium"
                    onClick={() =>
                      sendToApprovals(
                        `${r.record.number} on ${r.aircraft.registration}`,
                        r.rationale,
                        r
                      )
                    }
                  >
                    Send to Approvals
                  </button>
                </div>
              ))}
            </div>
          )}

          {panel?.kind === "visual" && (
            <div className="space-y-3 animate-fade-up">
              <div className="castair-card p-3 space-y-2">
                <div className="text-xs font-medium">Disposition: {panel.result.disposition}</div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">{panel.result.language}</p>
                <div className="text-xs text-[var(--warning)]">Requires human approval</div>
                <button
                  type="button"
                  className="text-[11px] text-[var(--highlight)] font-medium"
                  onClick={() =>
                    sendToApprovals(
                      `Visual: ${panel.result.disposition}`,
                      panel.result.language,
                      panel.result
                    )
                  }
                >
                  Send to Approvals
                </button>
              </div>
              {panel.result.taskCards.map((tc, i) => (
                <div key={i} className="castair-card p-3">
                  <div className="text-xs font-medium">{tc.title}</div>
                  <div className="text-xs text-[var(--muted)] mt-1">{tc.description}</div>
                </div>
              ))}
            </div>
          )}

          {panel?.kind === "explain" && (
            <div className="space-y-3 animate-fade-up">
              <div className="castair-card p-3">
                <p className="text-xs leading-relaxed">{panel.result.answer}</p>
              </div>
              <div>
                <div className="text-xs font-medium mb-1.5">Regulatory path</div>
                <ul className="space-y-1">
                  {panel.result.regulatoryPath.map((p, i) => (
                    <li key={i} className="text-xs text-[var(--muted)] pl-2 border-l border-[var(--border)]">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-xs text-[var(--warning)] leading-relaxed">{panel.result.residualRisk}</div>
              <button
                type="button"
                className="text-[11px] text-[var(--highlight)] font-medium"
                onClick={() =>
                  sendToApprovals("Airworthiness reasoning", panel.result.answer.slice(0, 200), panel.result)
                }
              >
                Send to Approvals
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
