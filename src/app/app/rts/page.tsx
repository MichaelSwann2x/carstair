"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import { useToast } from "@/lib/toast";
import { textToPdf } from "@/lib/pdf/simple";

export default function RtsPage() {
  const [aircraft, setAircraft] = useState<{ id: string; registration: string; status: string }[]>([]);
  const [selected, setSelected] = useState("");
  const [text, setText] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    api<{ aircraft: { id: string; registration: string; status: string }[] }>("/api/v1/domain").then((res) => {
      if (res.ok && res.data) setAircraft(res.data.aircraft);
    });
  }, []);

  async function generate() {
    if (!selected) return;
    const res = await api<{ packageText: string }>("/api/v1/rts", {
      method: "POST",
      body: JSON.stringify({ aircraftId: selected, action: "generate" }),
    });
    if (!res.ok || !res.data) {
      toast(res.error || "Failed", "error");
      return;
    }
    setText(res.data.packageText);
    toast("RTS package generated", "success");
  }

  function downloadPdf() {
    if (!text) return;
    const lines = text.split("\n");
    const blob = textToPdf("Castair RTS Package", lines);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `castair-rts-${Date.now()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    toast("PDF downloaded", "success");
  }

  async function release() {
    if (!selected) return;
    if (!window.confirm("Confirm RTS release? Certifying staff only. Audited.")) return;
    const res = await api("/api/v1/rts", {
      method: "POST",
      body: JSON.stringify({ aircraftId: selected, action: "release" }),
    });
    if (!res.ok) {
      toast(res.error || "Release denied", "error");
      return;
    }
    toast("RTS released", "success");
  }

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
        <h1 className="font-medium">RTS package</h1>
        <p className="text-xs text-[var(--muted)]">Generate · PDF · certifying-only release</p>
      </header>
      <div className="p-6 space-y-4 max-w-3xl animate-fade-up">
        <div className="castair-card p-4 bg-white space-y-3">
          <label htmlFor="ac" className="text-xs text-[var(--muted)] block">Aircraft</label>
          <select id="ac" className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm" value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value="">Select…</option>
            {aircraft.map((a) => (
              <option key={a.id} value={a.id}>{a.registration} — {a.status}</option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={generate} className="text-sm px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white font-medium">Generate</button>
            <button type="button" onClick={downloadPdf} disabled={!text} className="text-sm px-3 py-1.5 rounded-lg border border-[var(--border)] font-medium disabled:opacity-40">Download PDF</button>
            <button type="button" onClick={release} className="text-sm px-3 py-1.5 rounded-lg border border-[var(--border)] font-medium">Release RTS</button>
          </div>
        </div>
        {text && <pre className="castair-card p-4 bg-white text-xs whitespace-pre-wrap font-mono max-h-[480px] overflow-auto">{text}</pre>}
      </div>
    </>
  );
}
