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
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm card p-8 rise">
        <Link href="/" className="text-xs tracking-[0.16em] font-semibold">CARSTAIR</Link>
        <h1 className="text-2xl font-light mt-6">Log in</h1>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <div>
            <label className="text-[11px] text-zinc-500">Email or username</label>
            <input className="mt-1 w-full px-3 py-2.5 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-[11px] text-zinc-500">Password</label>
            <input type="password" className="mt-1 w-full px-3 py-2.5 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-primary w-full py-2.5">
            {loading ? "…" : "Log in"}
          </button>
        </form>
        <p className="text-xs text-zinc-600 mt-5 text-center">
          No account? <Link href="/signup" className="text-zinc-300">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
