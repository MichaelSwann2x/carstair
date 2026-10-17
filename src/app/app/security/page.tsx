"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import { useToast } from "@/lib/toast";

type Recovery = {
  optInActive: boolean;
  destinations: { id: string; type: string; endpoint: string; enabled: boolean }[];
};

type Quota = { usedBytes: number; limitBytes: number };

export default function SecurityPage() {
  const [recovery, setRecovery] = useState<Recovery | null>(null);
  const [quota, setQuota] = useState<Quota | null>(null);
  const [endpoint, setEndpoint] = useState("");
  const { toast } = useToast();

  async function load() {
    const res = await api<{ recovery: Recovery; quota: Quota }>("/api/v1/security/recovery");
    if (res.ok && res.data) {
      setRecovery(res.data.recovery);
      setQuota(res.data.quota);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveOptIn(optInActive: boolean) {
    const destinations = recovery?.destinations ?? [];
    if (optInActive && endpoint.trim()) {
      destinations.push({
        id: `dest_${Date.now()}`,
        type: "https-put",
        endpoint: endpoint.trim(),
        enabled: true,
      });
    }
    const res = await api("/api/v1/security/recovery", {
      method: "PUT",
      body: JSON.stringify({ optInActive, destinations }),
    });
    if (!res.ok) {
      toast(res.error || "Save failed", "error");
      return;
    }
    toast(optInActive ? "Recovery opt-in saved" : "Automatic recovery disabled", "success");
    load();
  }

  const usedMb = quota ? (quota.usedBytes / (1024 * 1024)).toFixed(2) : "—";
  const limitMb = quota ? (quota.limitBytes / (1024 * 1024)).toFixed(0) : "—";

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
        <h1 className="font-medium">Security & recovery</h1>
        <p className="text-xs text-[var(--muted)]">TRON defence · consent-gated backup · hard quota</p>
      </header>
      <div className="p-6 space-y-6 max-w-2xl animate-fade-up">
        <div className="castair-card p-5 bg-white space-y-2">
          <div className="font-medium text-sm">Storage quota</div>
          <p className="text-xs text-[var(--muted)]">
            Used {usedMb} MB / {limitMb} MB (hard limit — writes over quota are rejected)
          </p>
        </div>

        <div className="castair-card p-5 bg-white space-y-4">
          <div className="font-medium text-sm">TRON</div>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Hierarchical defence (General → Captains → Soldiers). Logic is open in{" "}
            <code className="text-[11px]">src/security/tron/</code>. No hidden processes.
          </p>
          <ul className="text-xs text-[var(--muted)] list-disc pl-4 space-y-1">
            <li>Cohorts: recon, shield, lockdown, decoy, isolate, logistics</li>
            <li>On high/critical signals, logistics may trigger recovery only if you opt in</li>
          </ul>
        </div>

        <div className="castair-card p-5 bg-white space-y-4">
          <div className="font-medium text-sm">Consent-gated recovery</div>
          <label className="flex gap-3 items-start text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mt-1"
              checked={!!recovery?.optInActive}
              onChange={(e) => saveOptIn(e.target.checked)}
            />
            <span className="text-xs leading-relaxed text-zinc-700">
              If my account is under active attack or probing, automatically push an encrypted recovery
              copy to my designated backdrop destination(s). I understand this only happens when I
              have enabled it.
            </span>
          </label>
          <div>
            <label htmlFor="backdrop" className="text-xs text-[var(--muted)] block mb-1">
              Backdrop HTTPS endpoint (optional)
            </label>
            <input
              id="backdrop"
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
              placeholder="https://backup.example.com/castair"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
            />
          </div>
          {recovery?.destinations?.length ? (
            <ul className="text-xs text-[var(--muted)] space-y-1">
              {recovery.destinations.map((d) => (
                <li key={d.id}>
                  {d.type} · {d.endpoint} {d.enabled ? "(on)" : "(off)"}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </>
  );
}
