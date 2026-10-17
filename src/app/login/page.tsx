"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { api, setToken } from "@/lib/api/client";

type Role = "inspector" | "certifying_staff" | "admin" | "viewer";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get("mode");
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
      setErr(res.error || "Could not open sample hangar");
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
      setErr(res.error || "Could not create organisation");
      return;
    }
    setToken(res.data.token);
    router.push("/app");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#F4F5F7]">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Image src="/logo.svg?v=bird" alt="Carstair" width={40} height={40} unoptimized />
          </div>
          <h1 className="font-semibold text-xl tracking-tight mb-2 text-[#0B1F3A]">Carstair</h1>
          <p className="text-sm text-[#6B7C93]">
            {mode === "provision"
              ? "Open an organisation and start your fleet board."
              : "Sample hangar data, or your own organisation."}
          </p>
        </div>

        <div className="castair-card p-6 space-y-6 bg-white">
          {mode !== "provision" && (
            <>
              <div
                className="rounded-lg border border-[#E2E6EC] bg-[#FAFBFC] px-3 py-2 text-xs text-[#6B7C93]"
                role="note"
              >
                Sample hangar uses practice data only. It does not touch live aircraft records.
              </div>
              <div className="space-y-2">
                <p className="text-xs text-[#6B7C93] font-medium">Enter sample hangar as</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => goDemo("inspector")}
                    className="border border-[#E2E6EC] py-2 rounded-lg text-sm font-medium hover:bg-[#EEF1F5] disabled:opacity-50"
                  >
                    Inspector
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => goDemo("certifying_staff")}
                    className="border border-[#E2E6EC] py-2 rounded-lg text-sm font-medium hover:bg-[#EEF1F5] disabled:opacity-50"
                  >
                    Certifying staff
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E2E6EC]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-[#6B7C93]">or set up organisation</span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={goProvision} className="space-y-3" aria-label="Organisation setup">
            <div>
              <label htmlFor="org" className="text-xs text-[#6B7C93] block mb-1">
                Organisation
              </label>
              <input
                id="org"
                required
                className="w-full border border-[#E2E6EC] rounded-lg px-3 py-2 text-sm bg-white"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="name" className="text-xs text-[#6B7C93] block mb-1">
                Name
              </label>
              <input
                id="name"
                required
                className="w-full border border-[#E2E6EC] rounded-lg px-3 py-2 text-sm bg-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="text-xs text-[#6B7C93] block mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full border border-[#E2E6EC] rounded-lg px-3 py-2 text-sm bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="role" className="text-xs text-[#6B7C93] block mb-1">
                Role
              </label>
              <select
                id="role"
                className="w-full border border-[#E2E6EC] rounded-lg px-3 py-2 text-sm bg-white"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
              >
                <option value="admin">Admin</option>
                <option value="inspector">Inspector</option>
                <option value="certifying_staff">Certifying staff</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            {err && (
              <p className="text-xs text-[#b91c1c]" role="alert">
                {err}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-[#0B1F3A] text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              Create organisation & enter
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-[#6B7C93]">
          Loading…
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
