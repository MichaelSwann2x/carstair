"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { id: 1, title: "Open task card", detail: "Select aircraft and open the work instruction." },
  { id: 2, title: "Attach evidence", detail: "Photo and file attached to the finding." },
  { id: 3, title: "Inspector signs", detail: "Performer signature with hash recorded." },
  { id: 4, title: "Certifying review", detail: "Second signature. RII gate enforced." },
  { id: 5, title: "RTS package", detail: "One-click assembly of signed records." },
  { id: 6, title: "Audit entry", detail: "Immutable chain updated on the server." },
];

export function WorkflowDemo() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const t = setInterval(() => {
      setActive((i) => (i + 1) % STEPS.length);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
      {/* Progressive card */}
      <div className="relative aspect-[4/3] rounded-2xl border border-zinc-200 bg-[#f7f7f8] overflow-hidden shadow-sm">
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col">
          <div className="text-[10px] uppercase tracking-widest text-zinc-400 mb-4">
            Step {active + 1} of {STEPS.length}
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div
              key={active}
              className="workflow-card bg-white border border-zinc-200 rounded-xl p-5 shadow-sm"
            >
              <div className="text-xs text-zinc-400 mb-1 font-medium">Task · N123AB</div>
              <div className="text-lg font-semibold text-zinc-900 mb-2">{STEPS[active].title}</div>
              <p className="text-sm text-zinc-500 leading-relaxed">{STEPS[active].detail}</p>
              {active >= 2 && (
                <div className="mt-4 flex gap-2 flex-wrap">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
                    Performer ✓
                  </span>
                  {active >= 3 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-900 text-white">
                      Certifying ✓
                    </span>
                  )}
                  {active >= 4 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                      RTS ready
                    </span>
                  )}
                  {active >= 5 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 font-mono">
                      audit·sha256
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Progress dots */}
          <div className="flex gap-1.5 justify-center mt-4" role="tablist" aria-label="Workflow steps">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={s.title}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-6 bg-zinc-900" : "w-1.5 bg-zinc-300 hover:bg-zinc-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step list */}
      <ol className="space-y-1">
        {STEPS.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => setActive(i)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex gap-3 items-start ${
                i === active ? "bg-zinc-100" : "hover:bg-zinc-50"
              }`}
            >
              <span
                className={`text-xs font-mono mt-0.5 w-5 shrink-0 ${
                  i === active ? "text-zinc-900" : "text-zinc-400"
                }`}
              >
                {String(s.id).padStart(2, "0")}
              </span>
              <span>
                <span className={`block text-sm font-medium ${i === active ? "text-zinc-900" : "text-zinc-600"}`}>
                  {s.title}
                </span>
                <span className="block text-xs text-zinc-400 mt-0.5">{s.detail}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <style jsx>{`
        .workflow-card {
          animation: rise 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .workflow-card {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
