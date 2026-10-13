"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }
    router.push("/app");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md glass rounded-2xl p-7">
        <Link href="/" className="text-xs tracking-[0.14em] font-semibold">CARSTAIR</Link>
        <h1 className="text-2xl font-light mt-5">Log in</h1>
        <a href="/api/auth/google" className="mt-5 w-full gloss-btn rounded-lg py-2.5 text-sm flex items-center justify-center">
          Continue with Google
        </a>
        <div className="flex items-center gap-3 my-4">
          <div className="h-px flex-1 bg-[#2a2a32]" />
          <span className="text-[11px] text-[#555]">or</span>
          <div className="h-px flex-1 bg-[#2a2a32]" />
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-[11px] text-[#8a8a96]">Email or username</label>
            <input className="mt-1 w-full px-3 py-2 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-[11px] text-[#8a8a96]">Password</label>
            <input type="password" className="mt-1 w-full px-3 py-2 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="w-full gloss-btn-primary rounded-lg py-2.5 text-sm">
            {loading ? "…" : "Log in"}
          </button>
        </form>
        <p className="text-xs text-[#666] mt-4 text-center">
          New? <Link href="/signup" className="text-[#aaa] hover:text-white">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
