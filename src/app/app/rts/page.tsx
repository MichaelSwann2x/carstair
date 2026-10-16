"use client";

import { useEffect, useState } from "react";
import { getSession, canApproveRTS } from "@/lib/auth/store";
import { repo } from "@/lib/cmms/repo";
import type { Aircraft, TaskCard, MelItem, AdSbRecord } from "@/lib/cmms/models";
import { useToast } from "@/lib/toast";
import { appendAudit } from "@/lib/audit/log";

export default function RtsPage() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [selected, setSelected] = useState("");
  const [packageText, setPackageText] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const s = getSession();
    if (!s) return;
    (async () => {
      await repo.seedDemo(s.tenant.id);
      setAircraft(await repo.listAircraft(s.tenant.id));
    })();
  }, []);

  async function generate() {
    const s = getSession();
    if (!s || !selected) return;
    const ac = aircraft.find((a) => a.id === selected);
    if (!ac) return;
    const [cards, mel, ads] = await Promise.all([
      repo.listTaskCards(s.tenant.id),
      repo.listMel(s.tenant.id),
      repo.listAdSb(s.tenant.id),
    ]);
    const acCards = cards.filter((c: TaskCard) => c.aircraftId === ac.id);
    const acMel = mel.filter((m: MelItem) => m.aircraftId === ac.id && m.status === "open");
    const acAds = ads.filter((d: AdSbRecord) => d.aircraftIds.includes(ac.id));

    const lines = [
      "CASTAIR — RETURN TO SERVICE PACKAGE",
      `Generated: ${new Date().toISOString()}`,
      `Aircraft: ${ac.registration} (${ac.type})`,
      `Hours: ${ac.flightHours ?? "n/a"} · Cycles: ${ac.cycles ?? "n/a"}`,
      "",
      "TASK CARDS",
      ...acCards.map(
        (c) =>
          `- ${c.title} [${c.status}] RII=${c.riiRequired} sigs=${c.signatures.length}`
      ),
      "",
      "OPEN MEL / DEFERRED",
      ...(acMel.length ? acMel.map((m) => `- ${m.melReference}: ${m.title} (Cat ${m.category})`) : ["- None"]),
      "",
      "AD / SB STATUS",
      ...acAds.map((d) => `- ${d.number}: ${d.status} — ${d.title}`),
      "",
      "CERTIFICATION",
      "This package does not constitute a release. Certifying staff must review and sign.",
      `Prepared by: ${s.user.name} (${s.user.role})`,
    ];
    setPackageText(lines.join("\n"));
    await appendAudit(
      s.tenant.id,
      { id: s.user.id, name: s.user.name, role: s.user.role },
      "rts.package_generated",
      "aircraft",
      ac.id,
      `RTS package generated for ${ac.registration}`,
      { registration: ac.registration }
    );
    toast("RTS package generated", "success");
  }

  async function release() {
    const s = getSession();
    if (!s || !selected) return;
    if (!canApproveRTS(s.user.role)) {
      toast("Only certifying staff / admin can release RTS", "warning");
      return;
    }
    if (!window.confirm("Confirm return-to-service release? This is dual-control and audited.")) return;
    const ac = aircraft.find((a) => a.id === selected);
    if (!ac) return;
    const next = { ...ac, status: "line" as const, updatedAt: new Date().toISOString() };
    await repo.putAircraft(next);
    await appendAudit(
      s.tenant.id,
      { id: s.user.id, name: s.user.name, role: s.user.role },
      "rts.release",
      "aircraft",
      ac.id,
      `RTS released for ${ac.registration}`,
      { registration: ac.registration }
    );
    toast(`RTS released for ${ac.registration}`, "success");
    setAircraft(await repo.listAircraft(s.tenant.id));
  }

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
        <h1 className="font-medium">RTS package</h1>
        <p className="text-xs text-[var(--muted)]">One-click package · dual-control release · never auto-signs</p>
      </header>
      <div className="p-6 space-y-4 animate-fade-up max-w-3xl">
        <div className="castair-card p-4 bg-white space-y-3">
          <label htmlFor="ac" className="text-xs text-[var(--muted)] block">Aircraft</label>
          <select
            id="ac"
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-white"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Select…</option>
            {aircraft.map((a) => (
              <option key={a.id} value={a.id}>
                {a.registration} — {a.status}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button type="button" onClick={generate} className="text-sm px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white font-medium">
              Generate package
            </button>
            <button type="button" onClick={release} className="text-sm px-3 py-1.5 rounded-lg border border-[var(--border)] font-medium">
              Release RTS (certifying)
            </button>
          </div>
        </div>
        {packageText && (
          <pre className="castair-card p-4 bg-white text-xs whitespace-pre-wrap font-mono text-black overflow-auto max-h-[480px]">
            {packageText}
          </pre>
        )}
      </div>
    </>
  );
}
