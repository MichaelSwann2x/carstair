"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, setToken } from "@/lib/api/client";

type Role = "inspector" | "certifying_staff" | "admin" | "viewer";

export default function LoginPage() {
  const router = useRouter();
  const [org, setOrg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("admin");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function goDemo(r: Role) {
    setBusy(true);
    setErr(null);
    const res = await api<{ token: string }>("/api/v1/auth/demo", {
      method: "POST",
      body: JSON.stringify({ role: r }),
    });
    setBusy(false);
    if (!res.ok || !res.data?.token) {
      setErr(res.error || "Demo login failed");
      return;
    }
    setToken(res.data.token);
    router.push("/app");
  }

  async function goProvision(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await api<{ token: string }>("/api/v1/auth/provision", {
      method: "POST",
      body: JSON.stringify({ org, name, email, role }),
    });
    setBusy(false);
    if (!res.ok || !res.data?.token) {
      setErr(res.error || "Provision failed");
      return;
    }
    setToken(res.data.token);
    router.push("/app");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[var(--background)]">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Image src="/logo.svg" alt="Castair logo" width={40} height={40} />
          </div>
          <h1 className="font-semibold text-xl tracking-tight mb-2 text-black">Castair</h1>
          <p className="text-sm text-[var(--muted)]">Online-first aircraft QC & RTS. Demo is isolated sample data.</p>
        </div>

        <div className="castair-card p-6 space-y-6 bg-white">
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900" role="note">
            <strong>Demo mode</strong> uses isolated sample data and does not write to real tenants.
          </div>

          <div className="space-y-2">
            <p className="text-xs text-[var(--muted)] font-medium">Enter demo as</p>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" disabled={busy} onClick={() => goDemo("inspector")} className="border border-[var(--border)] py-2 rounded-lg text-sm font-medium hover:bg-[var(--accent-soft)] disabled:opacity-50">
                Inspector
              </button>
              <button type="button" disabled={busy} onClick={() => goDemo("certifying_staff")} className="border border-[var(--border)] py-2 rounded-lg text-sm font-medium hover:bg-[var(--accent-soft)] disabled:opacity-50">
                Certifying staff
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border)]" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-[var(--muted)]">or provision live tenant</span></div>
          </div>

          <form onSubmit={goProvision} className="space-y-3" aria-label="Provision organisation">
            <div>
              <label htmlFor="org" className="text-xs text-[var(--muted)] block mb-1">Organisation</label>
              <input id="org" required className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-white" value={org} onChange={(e) => setOrg(e.target.value)} />
            </div>
            <div>
              <label htmlFor="name" className="text-xs text-[var(--muted)] block mb-1">Name</label>
              <input id="name" required className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-white" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="email" className="text-xs text-[var(--muted)] block mb-1">Email</label>
              <input id="email" type="email" required className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-white" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="role" className="text-xs text-[var(--muted)] block mb-1">Role</label>
              <select id="role" className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-white" value={role} onChange={(e) => setRole(e.target.value as Role)}>
                <option value="admin">Admin</option>
                <option value="inspector">Inspector</option>
                <option value="certifying_staff">Certifying staff</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            {err && <p className="text-xs text-[var(--danger)]" role="alert">{err}</p>}
            <button type="submit" disabled={busy} className="w-full bg-[var(--accent)] text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50">
              Create tenant & enter
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
