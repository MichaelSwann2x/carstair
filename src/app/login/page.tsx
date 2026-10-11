"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const raw = localStorage.getItem("carstair_user");
    if (!raw) {
      setError("No account found. Create one first.");
      return;
    }
    const user = JSON.parse(raw);
    if (
      (user.email === email || user.username === email) &&
      (user.password === password || user.provider === "google")
    ) {
      localStorage.setItem("carstair_session", "1");
      router.push("/app");
      return;
    }
    setError("Invalid email/username or password.");
  }

  function googleStub() {
    if (!localStorage.getItem("carstair_user")) {
      localStorage.setItem(
        "carstair_user",
        JSON.stringify({
          name: "Google User",
          email: "user@gmail.com",
          username: "google_user",
          tier: "free",
          provider: "google",
          createdAt: Date.now(),
        })
      );
    }
    localStorage.setItem("carstair_session", "1");
    router.push("/app");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md glass rounded-2xl p-7 animate-fade">
        <Link href="/" className="text-xs tracking-[0.15em] font-semibold">
          CARSTAIR
        </Link>
        <h1 className="text-2xl font-light mt-6">Log in</h1>
        <p className="text-xs text-[#8a8a96] mt-2">Welcome back.</p>

        <button
          type="button"
          onClick={googleStub}
          className="mt-6 w-full gloss-btn rounded-lg py-2.5 text-sm"
        >
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-[#2a2a32]" />
          <span className="text-[11px] text-[#555]">or</span>
          <div className="h-px flex-1 bg-[#2a2a32]" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-[11px] text-[#8a8a96]">Email or username</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-sm rounded-lg"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-[11px] text-[#8a8a96]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-sm rounded-lg"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            className="w-full gloss-btn-primary rounded-lg py-2.5 text-sm mt-2"
          >
            Log in
          </button>
        </form>

        <p className="text-xs text-[#666] mt-5 text-center">
          New here?{" "}
          <Link href="/signup" className="text-[#aaa] hover:text-white">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
