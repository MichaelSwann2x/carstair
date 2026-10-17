"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import { useToast } from "@/lib/toast";

type TaskCard = {
  id: string;
  title: string;
  description: string;
  status: string;
  riiRequired: boolean;
  signatures: { role: string; name: string; at: string; hash: string }[];
};

export default function TaskCardsPage() {
  const [rows, setRows] = useState<TaskCard[] | null>(null);
  const { toast } = useToast();

  async function load() {
    const res = await api<{ data: TaskCard[] }>("/api/v1/task-cards");
    if (res.ok && res.data) setRows(res.data.data);
    else setRows([]);
  }

  useEffect(() => {
    load();
  }, []);

  async function sign(id: string, kind: "performer" | "rii") {
    if (kind === "rii" && !window.confirm("Confirm RII / certifying signature? Audited and dual-control.")) return;
    if (kind === "performer" && !window.confirm("Confirm performer sign-off?")) return;
    const res = await api(`/api/v1/task-cards/${id}/sign`, {
      method: "POST",
      body: JSON.stringify({ kind }),
    });
    if (!res.ok) {
      toast(res.error || "Sign failed", "error");
      return;
    }
    toast(kind === "rii" ? "RII signature recorded" : "Performer signature recorded", "success");
    load();
  }

  async function attach(id: string, file: File) {
    const buf = await file.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    const dataBase64 = btoa(binary);
    const res = await api("/api/v1/evidence", {
      method: "POST",
      body: JSON.stringify({
        taskCardId: id,
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        dataBase64,
      }),
    });
    if (!res.ok) {
      toast(res.error || "Upload failed", "error");
      return;
    }
    toast(`Attached ${file.name}`, "success");
  }

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
        <h1 className="font-medium">Task cards</h1>
        <p className="text-xs text-[var(--muted)]">Evidence · dual signatures · server-enforced RII</p>
      </header>
      <div className="p-6 space-y-3 animate-fade-up">
        {rows === null && <div className="skeleton h-20 w-full" />}
        {rows?.length === 0 && <div className="castair-card p-8 text-center text-sm text-[var(--muted)] bg-white">No task cards.</div>}
        {rows?.map((tc) => (
          <div key={tc.id} className="castair-card p-4 bg-white space-y-2">
            <div className="flex justify-between gap-2">
              <div>
                <div className="font-medium text-sm">{tc.title}</div>
                <div className="text-xs text-[var(--muted)]">{tc.description}</div>
              </div>
              <span className={tc.status === "rii_pending" ? "status-rts text-xs h-fit" : "text-xs text-[var(--muted)]"}>
                {tc.status.replace("_", " ")}
              </span>
            </div>
            {tc.riiRequired && <p className="text-xs text-[var(--warning)]">RII required — only certifying staff may complete</p>}
            {tc.signatures.map((s, i) => (
              <div key={i} className="text-xs text-[var(--muted)]">{s.role}: {s.name} · {new Date(s.at).toLocaleString()} · {s.hash}</div>
            ))}
            <div className="flex flex-wrap gap-2 pt-1 items-center">
              <button type="button" className="text-xs px-2.5 py-1 rounded border border-[var(--border)]" onClick={() => sign(tc.id, "performer")}>
                Sign (performer)
              </button>
              {tc.riiRequired && (
                <button type="button" className="text-xs px-2.5 py-1 rounded bg-[var(--accent)] text-white" onClick={() => sign(tc.id, "rii")}>
                  RII sign (certifying)
                </button>
              )}
              <label className="text-xs px-2.5 py-1 rounded border border-[var(--border)] cursor-pointer">
                Attach evidence
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) attach(tc.id, f);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
