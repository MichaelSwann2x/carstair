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
      <div className="w-full max-w-md glass rounded-2xl p-7">
        <Link href="/" className="text-xs tracking-[0.14em] font-semibold">CARSTAIR</Link>
        <h1 className="text-2xl font-light mt-5">Sign up</h1>
        <a
          href="/api/auth/google"
          className="mt-5 w-full gloss-btn rounded-lg py-2.5 text-sm flex items-center justify-center"
        >
          Continue with Google
        </a>
        <div className="flex items-center gap-3 my-4">
          <div className="h-px flex-1 bg-[#2a2a32]" />
          <span className="text-[11px] text-[#555]">or</span>
          <div className="h-px flex-1 bg-[#2a2a32]" />
        </div>
        <form onSubmit={submit} className="space-y-3">
          {(
            [
              ["name", "Full name", "text"],
              ["email", "Email", "email"],
              ["phone", "Phone (optional)", "tel"],
              ["username", "Username", "text"],
              ["password", "Password", "password"],
            ] as const
          ).map(([k, label, type]) => (
            <div key={k}>
              <label className="text-[11px] text-[#8a8a96]">{label}</label>
              <input
                type={type}
                className="mt-1 w-full px-3 py-2 text-sm"
                value={(form as Record<string, string>)[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                required={k !== "phone" && k !== "name"}
              />
            </div>
          ))}
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="w-full gloss-btn-primary rounded-lg py-2.5 text-sm">
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>
        <p className="text-xs text-[#666] mt-4 text-center">
          Have an account? <Link href="/login" className="text-[#aaa] hover:text-white">Log in</Link>
        </p>
      </div>
    </div>
  );
}
