"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Signup failed");
      return;
    }
    router.push("/app");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm card p-8 rise">
        <Link href="/" className="text-xs tracking-[0.16em] font-semibold">CARSTAIR</Link>
        <h1 className="text-2xl font-light mt-6">Sign up</h1>
        <form onSubmit={submit} className="mt-6 space-y-3">
          {(
            [
              ["name", "Name", "text"],
              ["email", "Email", "email"],
              ["phone", "Phone", "tel"],
              ["username", "Username", "text"],
              ["password", "Password", "password"],
            ] as const
          ).map(([k, label, type]) => (
            <div key={k}>
              <label className="text-[11px] text-zinc-500">{label}</label>
              <input
                type={type}
                className="mt-1 w-full px-3 py-2.5 text-sm"
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                required={k === "email" || k === "username" || k === "password"}
              />
            </div>
          ))}
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-primary w-full py-2.5">
            {loading ? "…" : "Create account"}
          </button>
        </form>
        <p className="text-xs text-zinc-600 mt-5 text-center">
          Have an account? <Link href="/login" className="text-zinc-300">Log in</Link>
        </p>
      </div>
    </div>
  );
}
