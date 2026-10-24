"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken, setToken } from "@/lib/api/client";

const nav = [
  { href: "/app", label: "Dashboard" },
  { href: "/app?tab=journal", label: "Journal" },
  { href: "/app?tab=analytics", label: "Analytics" },
  { href: "/app?tab=prop", label: "Prop / CFD" },
  { href: "/app?tab=share", label: "Share cards" },
  { href: "/app?tab=mt5", label: "MT5" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const u = localStorage.getItem("carstair_user");
      setUser(u ? JSON.parse(u) : { name: "Trader", email: "" });
    } catch {
      setUser({ name: "Trader" });
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-[#64748b] bg-[#050608]">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#050608] text-[#f1f5f9]">
      <aside className="hidden md:flex w-48 border-r border-[#1a1f2a] bg-[#0c0e12] p-3 flex-col shrink-0">
        <Link href="/" className="flex items-center gap-2 px-2 mb-4">
          <Image src="/logo.svg" alt="" width={24} height={24} unoptimized />
          <span className="font-semibold tracking-tight text-white text-sm">Carstair</span>
        </Link>
        <nav className="flex flex-col gap-0.5 flex-1" aria-label="Journal">
          {nav.map((item) => {
            const active =
              item.href === "/app"
                ? pathname === "/app" &&
                  !(typeof window !== "undefined" && new URLSearchParams(window.location.search).get("tab"))
                : false;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2 py-1.5 rounded-md text-sm ${
                  active
                    ? "bg-[rgba(34,197,94,0.12)] text-[#22c55e] font-medium"
                    : "text-[#94a3b8] hover:bg-[#12151c] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-[#1a1f2a] pt-3 text-xs text-[#64748b]">
          <div className="px-2 truncate text-[#f1f5f9]">{user?.name || "Trader"}</div>
          <div className="px-2 truncate">{user?.email}</div>
          <button
            type="button"
            className="px-2 mt-2 block hover:text-white"
            onClick={() => {
              setToken(null);
              localStorage.removeItem("carstair_user");
              router.push("/login");
            }}
          >
            Sign out
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">{children}</div>
    </div>
  );
}
