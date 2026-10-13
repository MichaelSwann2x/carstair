"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LineChart, Layers, BookOpen, Globe, MessagesSquare, User, LogOut, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/app", label: "Home", exact: true },
  { href: "/app/charts", label: "Charts", icon: LineChart },
  { href: "/app/models", label: "Models", icon: Layers },
  { href: "/app/papers", label: "Papers", icon: BookOpen },
  { href: "/app/world", label: "World", icon: Globe },
  { href: "/app/board", label: "Board", icon: MessagesSquare },
  { href: "/app/profile", label: "Profile", icon: User },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ username?: string; avatar?: string | null } | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setUser(d.user))
      .catch(() => router.replace("/login"));
  }, [router, pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <div className="min-h-screen flex bg-[#0c0c0e]">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-52 border-r border-[#2a2a32] bg-[#0f0f12] flex flex-col transition-transform lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-14 px-4 flex items-center justify-between border-b border-[#2a2a32]">
          <Link href="/app" className="text-xs font-semibold tracking-[0.12em]">CARSTAIR</Link>
          <button className="lg:hidden" onClick={() => setOpen(false)}><X className="w-4 h-4 text-[#8a8a96]" /></button>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-xs",
                  active ? "bg-[#1a1a1f] text-white border border-[#2a2a32]" : "text-[#8a8a96] hover:text-white"
                )}>
                {Icon && <Icon className="w-4 h-4" />}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-[#2a2a32]">
          <p className="text-[11px] text-[#666] truncate px-2">@{user?.username || "…"}</p>
          <button onClick={logout} className="mt-1 flex items-center gap-2 px-3 py-2 text-xs text-[#8a8a96] hover:text-white w-full">
            <LogOut className="w-3.5 h-3.5" /> Log out
          </button>
        </div>
      </aside>
      <div className="flex-1 lg:pl-52 min-h-screen">
        <header className="h-14 border-b border-[#2a2a32] flex items-center px-4 lg:hidden sticky top-0 bg-[#0c0c0e]/90 z-30">
          <button onClick={() => setOpen(true)}><Menu className="w-5 h-5 text-[#8a8a96]" /></button>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
