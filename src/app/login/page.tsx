"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { demoLogin, createTenant, provisionUser, createSession } from "@/lib/auth/store";
import type { Role } from "@/lib/auth/types";

export default function LoginPage() {
  const router = useRouter();
  const [org, setOrg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("inspector");
  const [busy, setBusy] = useState(false);

  function goDemo(r: Role = "inspector") {
    setBusy(true);
    demoLogin(r);
    router.push("/app");
  }

  function goProvision(e: React.FormEvent) {
    e.preventDefault();
    if (!org.trim() || !name.trim() || !email.trim()) return;
    setBusy(true);
    const tenant = createTenant(org.trim());
    const user = provisionUser(email.trim(), name.trim(), role, tenant);
    createSession(user, tenant);
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
          <p className="text-sm text-[var(--muted)]">
            Provision a tenant or open the offline demo.
          </p>
        </div>

        <div className="castair-card p-6 space-y-6 bg-white">
          <div className="space-y-2">
            <p className="text-xs text-[var(--muted)] font-medium">Demo roles</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => goDemo("inspector")}
                disabled={busy}
                className="border border-[var(--border)] py-2 rounded-lg text-sm font-medium text-black hover:bg-[var(--accent-soft)] disabled:opacity-50"
              >
                Inspector
              </button>
              <button
                type="button"
                onClick={() => goDemo("rts_authority")}
                disabled={busy}
                className="border border-[var(--border)] py-2 rounded-lg text-sm font-medium text-black hover:bg-[var(--accent-soft)] disabled:opacity-50"
              >
                Certifying staff
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-[var(--muted)]">or provision</span>
            </div>
          </div>

          <form onSubmit={goProvision} className="space-y-3" aria-label="Provision organisation">
            <div>
              <label htmlFor="org" className="text-xs text-[var(--muted)] block mb-1">
                Organisation
              </label>
              <input
                id="org"
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-white text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                autoComplete="organization"
              />
            </div>
            <div>
              <label htmlFor="name" className="text-xs text-[var(--muted)] block mb-1">
                Your name
              </label>
              <input
                id="name"
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-white text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-xs text-[var(--muted)] block mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-white text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="role" className="text-xs text-[var(--muted)] block mb-1">
                Role
              </label>
              <select
                id="role"
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-white text-black"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
              >
                <option value="inspector">Inspector</option>
                <option value="rts_authority">Certifying staff (RTS)</option>
                <option value="camo_engineer">CAMO engineer</option>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-[var(--accent)] text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              Create tenant & enter
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
