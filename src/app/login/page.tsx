"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { demoLogin, createTenant, provisionUser, createSession } from "@/lib/auth/store";

export default function LoginPage() {
  const router = useRouter();
  const [org, setOrg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  function goDemo() {
    setBusy(true);
    demoLogin();
    router.push("/app");
  }

  function goProvision(e: React.FormEvent) {
    e.preventDefault();
    if (!org.trim() || !name.trim() || !email.trim()) return;
    setBusy(true);
    const tenant = createTenant(org.trim());
    const user = provisionUser(email.trim(), name.trim(), "admin", tenant);
    createSession(user, tenant);
    router.push("/app");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Image src="/logo.svg" alt="Castair" width={40} height={40} />
          </div>
          <div className="font-semibold text-xl tracking-tight mb-2">Castair</div>
          <p className="text-sm text-[var(--muted)]">
            Provision a tenant or jump into the offline demo.
          </p>
        </div>

        <div className="castair-card p-6 space-y-6">
          <button
            type="button"
            onClick={goDemo}
            disabled={busy}
            className="w-full bg-[var(--accent)] text-[var(--background)] py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Continue with demo tenant (offline)
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[var(--surface)] px-2 text-[var(--muted)]">or provision</span>
            </div>
          </div>

          <form onSubmit={goProvision} className="space-y-3">
            <input
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--highlight)]"
              placeholder="Organisation name"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
            />
            <input
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--highlight)]"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--highlight)]"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full border border-[var(--border)] py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--accent-soft)] transition-colors disabled:opacity-50"
            >
              Create tenant & enter
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
