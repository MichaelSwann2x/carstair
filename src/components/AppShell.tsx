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
    <div className="min-h-screen flex">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-52 border-r border-white/5 bg-[#0c0c10]/85 backdrop-blur-xl flex flex-col transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-14 px-4 flex items-center justify-between border-b border-white/5">
          <Link href="/app" className="text-xs font-semibold tracking-[0.14em]">
            CARSTAIR
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X className="w-4 h-4 text-[#8b8b99]" />
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs transition-all duration-200",
                  active
                    ? "bg-white/8 text-white border border-white/10 shadow-[0_0_24px_rgba(120,130,200,0.08)]"
                    : "text-[#8b8b99] hover:text-white hover:bg-white/5"
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/5">
          <p className="text-[11px] text-[#666] truncate px-2">@{user?.username || "…"}</p>
          <button
            onClick={logout}
            className="mt-1 flex items-center gap-2 px-3 py-2 text-xs text-[#8b8b99] hover:text-white w-full rounded-lg hover:bg-white/5 transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Log out
          </button>
        </div>
      </aside>
      <div className="flex-1 lg:pl-52 min-h-screen">
        <header className="h-14 border-b border-white/5 flex items-center px-4 lg:hidden sticky top-0 bg-[#08080a]/80 backdrop-blur-xl z-30">
          <button onClick={() => setOpen(true)}>
            <Menu className="w-5 h-5 text-[#8b8b99]" />
          </button>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
