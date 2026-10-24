"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getToken, setToken } from "@/lib/api/client";

const NAV = [
  { tab: "", label: "Dashboard" },
  { tab: "journal", label: "Journal" },
  { tab: "analytics", label: "Analytics" },
  { tab: "prop", label: "Prop / CFD" },
  { tab: "share", label: "Share" },
  { tab: "mt5", label: "MT5" },
];

function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useSearchParams();
  const tab = params.get("tab") || "";
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    try {
      const u = localStorage.getItem("carstair_user");
      setUser(u ? JSON.parse(u) : { name: "Trader" });
    } catch {
      setUser({ name: "Trader" });
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050608] text-[#64748b] text-sm">
        Loading terminal…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050608] text-[#f1f5f9]">
      <header className="h-10 border-b border-[#1a1f2a] flex items-center px-3 gap-3 shrink-0 bg-[#0c0e12]">
        <Link href="/" className="flex items-center gap-1.5 shrink-0">
          <Image src="/logo.svg" alt="" width={20} height={20} unoptimized />
          <span className="text-[12px] font-semibold text-white">Carstair</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-0.5 text-[11px] ml-2">
          {NAV.map((n) => {
            const active = tab === n.tab;
            return (
              <Link
                key={n.label}
                href={n.tab ? `/app?tab=${n.tab}` : "/app"}
                className={`px-2 py-1 rounded ${
                  active ? "bg-[rgba(34,197,94,0.15)] text-[#22c55e]" : "text-[#94a3b8] hover:text-white"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2 text-[11px] text-[#64748b]">
          <span className="truncate max-w-[120px] text-[#e2e8f0]">{user?.name}</span>
          <button
            type="button"
            className="hover:text-white"
            onClick={() => {
              setToken(null);
              localStorage.removeItem("carstair_user");
              router.push("/login");
            }}
          >
            Out
          </button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        <aside className="hidden md:flex w-40 border-r border-[#1a1f2a] bg-[#0c0e12] p-2 flex-col gap-0.5 shrink-0">
          {NAV.map((n) => {
            const active = tab === n.tab;
            return (
              <Link
                key={n.label}
                href={n.tab ? `/app?tab=${n.tab}` : "/app"}
                className={`px-2 py-1.5 rounded text-[12px] ${
                  active ? "bg-[rgba(34,197,94,0.12)] text-[#22c55e]" : "text-[#94a3b8] hover:bg-[#12151c]"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </aside>
        <main className="flex-1 min-w-0 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050608]" />}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}
