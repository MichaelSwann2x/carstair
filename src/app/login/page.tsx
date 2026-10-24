"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { setToken } from "@/lib/api/client";

function LoginInner() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [mode, setMode] = useState<"signup" | "login">("signup");

  function enter(provider: string) {
    setBusy(true);
    setErr(null);
    const token = `carstair_${provider}_${Date.now()}`;
    setToken(token);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "carstair_user",
        JSON.stringify({
          email: email || `${provider}@carstair.app`,
          name: name || (provider === "google" ? "Google user" : email.split("@")[0]),
          provider,
        })
      );
    }
    setBusy(false);
    router.push("/app");
  }

  function onGoogle() {
    enter("google");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setErr("Email required");
      return;
    }
    if (mode === "signup" && !name.trim()) {
      setErr("Name required");
      return;
    }
    enter(mode === "signup" ? "email-signup" : "email-login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#050608]">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Image src="/logo.svg" alt="Carstair" width={48} height={48} unoptimized />
          </div>
          <h1 className="font-semibold text-lg tracking-tight text-white">Carstair</h1>
          <p className="text-xs text-[#64748b] mt-1">CFD & Forex journal</p>
        </div>

        <div className="journal-card p-5 space-y-4">
          <button
            type="button"
            disabled={busy}
            onClick={onGoogle}
            className="w-full flex items-center justify-center gap-2 border border-[#2a3140] bg-[#0c0e12] text-white py-2.5 rounded-lg text-sm font-medium hover:border-[#22c55e] disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
              <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.348 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" />
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
            </svg>
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1a1f2a]" />
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="bg-[#0c0e12] px-2 text-[#64748b]">or email</span>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            {mode === "signup" && (
              <div>
                <label htmlFor="name" className="text-[11px] text-[#64748b] block mb-1">
                  Name
                </label>
                <input
                  id="name"
                  className="w-full border border-[#2a3140] rounded-lg px-3 py-2 text-sm bg-[#050608] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="text-[11px] text-[#64748b] block mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full border border-[#2a3140] rounded-lg px-3 py-2 text-sm bg-[#050608] text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-[11px] text-[#64748b] block mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full border border-[#2a3140] rounded-lg px-3 py-2 text-sm bg-[#050608] text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {err && (
              <p className="text-xs text-[#ef4444]" role="alert">
                {err}
              </p>
            )}
            <button type="submit" disabled={busy} className="w-full btn-green py-2.5 rounded-lg text-sm disabled:opacity-50">
              {mode === "signup" ? "Sign up" : "Log in"}
            </button>
          </form>

          <button
            type="button"
            className="w-full text-[11px] text-[#64748b] hover:text-[#94a3b8]"
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
          >
            {mode === "signup" ? "Already have an account? Log in" : "Need an account? Sign up"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-[#64748b]">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}
