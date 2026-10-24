"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { setToken } from "@/lib/api/client";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get("mode");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState(mode === "provision" || mode === "signup");

  function enterJournal(label: string) {
    setBusy(true);
    setErr(null);
    // Client-side session for journal (demo / Google / email)
    const token = `journal_${label}_${Date.now()}`;
    setToken(token);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "carstair_user",
        JSON.stringify({ email: email || `${label}@carstair.demo`, name: name || label, provider: label })
      );
    }
    setBusy(false);
    router.push("/app");
  }

  function onGoogle() {
    // Real Google OAuth would hit /api/auth/google; current route is a stub.
    // Demo path: treat as Google login so the flow works end-to-end for deploy.
    enterJournal("google");
  }

  function onEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setErr("Email required");
      return;
    }
    enterJournal(isSignup ? "email-signup" : "email-login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#0a0b0f]">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Image src="/logo.svg" alt="Carstair" width={44} height={44} unoptimized />
          </div>
          <h1 className="font-semibold text-xl tracking-tight mb-2 text-white">Carstair</h1>
          <p className="text-sm text-[#94a3b8]">
            Forex & CFD journal · MT5 · shareable PnL cards
          </p>
        </div>

        <div className="journal-card p-6 space-y-5">
          <button
            type="button"
            disabled={busy}
            onClick={onGoogle}
            className="w-full flex items-center justify-center gap-2 border border-[#334155] bg-[#12151c] text-white py-2.5 rounded-lg text-sm font-medium hover:border-[#0ea5e9] disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
              />
              <path
                fill="#FBBC05"
                d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.348 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"
              />
              <path
                fill="#EA4335"
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1e293b]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0f1219] px-2 text-[#64748b]">or email</span>
            </div>
          </div>

          <form onSubmit={onEmail} className="space-y-3">
            {isSignup && (
              <div>
                <label htmlFor="name" className="text-xs text-[#64748b] block mb-1">
                  Name
                </label>
                <input
                  id="name"
                  className="w-full border border-[#334155] rounded-lg px-3 py-2 text-sm bg-[#0a0b0f] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="text-xs text-[#64748b] block mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full border border-[#334155] rounded-lg px-3 py-2 text-sm bg-[#0a0b0f] text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            {err && (
              <p className="text-xs text-[#f87171]" role="alert">
                {err}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-[#0ea5e9] text-[#0a0b0f] py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {isSignup ? "Create account & enter" : "Log in"}
            </button>
          </form>

          <button
            type="button"
            className="w-full text-xs text-[#64748b] hover:text-[#94a3b8]"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Already have an account? Log in" : "Need an account? Sign up"}
          </button>

          <div className="border-t border-[#1e293b] pt-4">
            <button
              type="button"
              disabled={busy}
              onClick={() => enterJournal("demo")}
              className="w-full border border-[#1e293b] text-[#94a3b8] py-2 rounded-lg text-sm hover:border-[#334155] disabled:opacity-50"
            >
              Open sample journal (no account)
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-[#64748b]">
          Loading…
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
