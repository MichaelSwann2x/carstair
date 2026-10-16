"use client";

import { useState } from "react";
import { getSession } from "@/lib/auth/store";
import { runAdSbMonitor, type AdSbFinding } from "@/lib/agents/ad-sb-monitor";
import { runClosedLoopVisual, type VisualDisposition } from "@/lib/agents/closed-loop-visual";
import {
  runExplainableAirworthiness,
  type AirworthinessExplanation,
} from "@/lib/agents/explainable-airworthiness";

type Panel =
  | { kind: "ad-sb"; results: AdSbFinding[] }
  | { kind: "visual"; result: VisualDisposition }
  | { kind: "explain"; result: AirworthinessExplanation }
  | null;

export default function AgentsPage() {
  const [panel, setPanel] = useState<Panel>(null);
  const [running, setRunning] = useState<string | null>(null);

  function runAdSb() {
    const s = getSession();
    if (!s) return;
    setRunning("ad-sb");
    setPanel({ kind: "ad-sb", results: runAdSbMonitor(s.tenant.id) });
    setRunning(null);
  }

  function runVisual() {
    setRunning("visual");
    setPanel({
      kind: "visual",
      result: runClosedLoopVisual({
        aircraftRegistration: "N123AB",
        location: "LH wing upper skin, STA 540",
        defectType: "Dent",
        measuredValue: 1.2,
        unit: "mm",
        srmLimit: 1.5,
        notes: "No crack visible",
      }),
    });
    setRunning(null);
  }

  function runExplain() {
    setRunning("explain");
    setPanel({
      kind: "explain",
      result: runExplainableAirworthiness({
        question: "Can this dent be accepted and the aircraft returned to service?",
        aircraftType: "B737-800",
        registration: "N123AB",
        findingSummary: "Skin dent 1.2 mm within SRM limit 1.5 mm",
        proposedAction: "Accept as is with recurrent inspection",
      }),
    });
    setRunning(null);
  }

  return (
    <div className="flex-1 flex min-h-0">
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-[var(--border)] px-6 py-3 bg-[var(--surface)]">
          <h1 className="font-medium">Agents</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            High-value agents. Airworthiness outputs always require human approval.
          </p>
        </header>
        <div className="p-6 grid gap-3 sm:grid-cols-3 animate-fade-up">
          {[
            { id: "ad-sb", title: "AD/SB Monitor", desc: "Applicability evaluation across the fleet register.", run: runAdSb },
            { id: "visual", title: "Closed-Loop Visual", desc: "Measurement → disposition language → task cards.", run: runVisual },
            { id: "explain", title: "Explainable Airworthiness", desc: "Regulatory path and precedents in audit-ready language.", run: runExplain },
          ].map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={a.run}
              disabled={running === a.id}
              className="castair-card p-4 text-left hover:border-[var(--foreground)]/20 transition-colors disabled:opacity-60"
            >
              <div className="font-medium mb-1">{a.title}</div>
              <div className="text-xs text-[var(--muted)] leading-relaxed">{a.desc}</div>
              <div className="text-xs mt-3 text-[var(--highlight)]">
                {running === a.id ? "Running…" : "Run agent →"}
              </div>
            </button>
          ))}
        </div>
      </div>

      <aside className="w-[380px] agent-panel shrink-0 overflow-y-auto hidden lg:block">
        <div className="px-4 py-3 border-b border-[var(--border)] sticky top-0 bg-[var(--surface-elevated)]">
          <div className="font-medium text-sm">Agent panel</div>
          <div className="text-xs text-[var(--muted)]">Evidence and recommendations</div>
        </div>
        <div className="p-4 space-y-4 text-sm">
          {!panel && (
            <p className="text-[var(--muted)] text-xs leading-relaxed">
              Run an agent to see structured results, evidence and required human gates here.
            </p>
          )}

          {panel?.kind === "ad-sb" && (
            <div className="space-y-3 animate-fade-up">
              {panel.results.length === 0 && (
                <p className="text-[var(--muted)] text-xs">No AD/SB records for this tenant.</p>
              )}
              {panel.results.map((r, i) => (
                <div key={i} className="castair-card p-3 space-y-1.5">
                  <div className="font-medium text-xs">
                    {r.record.number} · {r.aircraft.registration}
                  </div>
                  <div className="text-xs">
                    <span className="text-[var(--muted)]">Recommendation:</span>{" "}
                    <span className="font-medium">{r.recommendation}</span>
                    <span className="text-[var(--muted)]"> · {r.confidence}%</span>
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{r.rationale}</p>
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
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
