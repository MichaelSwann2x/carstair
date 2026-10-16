"use client";

import { useState } from "react";
import { api } from "@/lib/api/client";
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

  async function exportCsv() {
    setBusy(true);
    const res = await api<{ mel: { id: string; aircraftId: string; title: string; status: string; melReference: string; category: string }[] }>("/api/v1/domain");
    setBusy(false);
    if (!res.ok || !res.data) {
      toast(res.error || "Failed", "error");
      return;
    }
    const header = "type,id,aircraftId,title,status,detail\n";
    const lines = res.data.mel.map(
      (m) => `mel,${m.id},${m.aircraftId},"${m.title}",${m.status},"${m.melReference} Cat ${m.category}"`
    );
    download(`castair-export-${Date.now()}.csv`, header + lines.join("\n"), "text/csv");
    toast("CSV downloaded", "success");
  }

  async function exportCompliance() {
    setBusy(true);
    const res = await api<{
      aircraft: { registration: string; type: string; status: string; flightHours?: number; cycles?: number }[];
      adSb: { number: string; type: string; status: string; title: string }[];
      audit: { createdAt: string; action: string; summary: string; payloadHash: string }[];
      tenant: { name: string; isDemo: boolean };
    }>("/api/v1/domain");
    setBusy(false);
    if (!res.ok || !res.data) {
      toast(res.error || "Failed", "error");
      return;
    }
    const d = res.data;
    const text = [
      "CASTAIR COMPLIANCE EXPORT",
      `Tenant: ${d.tenant.name}${d.tenant.isDemo ? " [DEMO]" : ""}`,
      `Generated: ${new Date().toISOString()}`,
      "",
      "AIRCRAFT",
      ...d.aircraft.map((a) => `${a.registration},${a.type},${a.status},FH=${a.flightHours},CY=${a.cycles}`),
      "",
      "AD/SB",
      ...d.adSb.map((x) => `${x.number},${x.type},${x.status},${x.title}`),
      "",
      "AUDIT",
      ...d.audit.slice(0, 50).map((e) => `${e.createdAt},${e.action},${e.summary},${e.payloadHash.slice(0, 12)}`),
    ].join("\n");
    download(`castair-compliance-${Date.now()}.txt`, text, "text/plain");
    toast("Compliance package downloaded", "success");
  }

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
        <h1 className="font-medium">Exports</h1>
        <p className="text-xs text-[var(--muted)]">CSV and compliance packages from live server data</p>
      </header>
      <div className="p-6 grid sm:grid-cols-2 gap-4 max-w-3xl animate-fade-up">
        <button type="button" disabled={busy} onClick={exportCsv} className="castair-card p-5 text-left bg-white hover:border-zinc-400">
          <div className="font-medium mb-1">MEL / findings CSV</div>
          <p className="text-xs text-[var(--muted)]">Download deferred defects as CSV.</p>
        </button>
        <button type="button" disabled={busy} onClick={exportCompliance} className="castair-card p-5 text-left bg-white hover:border-zinc-400">
          <div className="font-medium mb-1">Compliance package</div>
          <p className="text-xs text-[var(--muted)]">Aircraft, AD/SB, audit chain.</p>
        </button>
      </div>
    </>
  );
}
