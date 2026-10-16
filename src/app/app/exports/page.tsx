"use client";

import { useState } from "react";
import { getSession } from "@/lib/auth/store";
import { repo } from "@/lib/cmms/repo";
import { listAudit } from "@/lib/audit/log";
import { useToast } from "@/lib/toast";

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportsPage() {
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  async function exportFindingsCsv() {
    const s = getSession();
    if (!s) return;
    setBusy(true);
    const findings = await repo.listFindings(s.tenant.id);
    const mel = await repo.listMel(s.tenant.id);
    const header = "type,id,aircraftId,title,status,detail\n";
    const lines = [
      ...findings.map((f) => `finding,${f.id},${f.aircraftId},"${f.title}",${f.status},"${f.description}"`),
      ...mel.map((m) => `mel,${m.id},${m.aircraftId},"${m.title}",${m.status},"${m.melReference} Cat ${m.category}"`),
    ];
    download(`castair-findings-${Date.now()}.csv`, header + lines.join("\n"), "text/csv");
    toast("CSV downloaded", "success");
    setBusy(false);
  }

  async function exportCompliance() {
    const s = getSession();
    if (!s) return;
    setBusy(true);
    const [ac, ads, audit] = await Promise.all([
      repo.listAircraft(s.tenant.id),
      repo.listAdSb(s.tenant.id),
      listAudit(s.tenant.id),
    ]);
    const text = [
      "CASTAIR COMPLIANCE EXPORT",
      `Tenant: ${s.tenant.name}`,
      `Generated: ${new Date().toISOString()}`,
      "",
      "AIRCRAFT",
      ...ac.map((a) => `${a.registration},${a.type},${a.status},FH=${a.flightHours},CY=${a.cycles}`),
      "",
      "AD/SB",
      ...ads.map((d) => `${d.number},${d.type},${d.status},${d.title}`),
      "",
      "AUDIT (latest 50)",
      ...audit.slice(0, 50).map((e) => `${e.createdAt},${e.action},${e.summary},${e.payloadHash.slice(0, 12)}`),
    ].join("\n");
    download(`castair-compliance-${Date.now()}.txt`, text, "text/plain");
    toast("Compliance package downloaded", "success");
    setBusy(false);
  }

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
        <h1 className="font-medium">Exports</h1>
        <p className="text-xs text-[var(--muted)]">CSV findings · compliance packages · audit-ready</p>
      </header>
      <div className="p-6 grid sm:grid-cols-2 gap-4 animate-fade-up max-w-3xl">
        <button
          type="button"
          disabled={busy}
          onClick={exportFindingsCsv}
          className="castair-card p-5 text-left bg-white hover:border-zinc-400 transition-colors"
        >
          <div className="font-medium mb-1">Findings / MEL CSV</div>
          <p className="text-xs text-[var(--muted)]">Export open findings and deferred defects as CSV.</p>
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={exportCompliance}
          className="castair-card p-5 text-left bg-white hover:border-zinc-400 transition-colors"
        >
          <div className="font-medium mb-1">Compliance package</div>
          <p className="text-xs text-[var(--muted)]">Aircraft register, AD/SB status, and recent audit chain.</p>
        </button>
      </div>
    </>
  );
}
