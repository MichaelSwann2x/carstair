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
  const [user, setUser] = useState<{ username?: string } | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then(async (r) => {
        if (!r.ok) throw new Error("no session");
        return r.json();
      })
      .then((d) => {
        if (!cancelled) {
          setUser(d.user);
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) router.replace("/login");
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-zinc-500">
        Loading
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-52 border-r border-white/[0.06] bg-[#0a0a0b]/90 backdrop-blur-md flex flex-col transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-14 px-4 flex items-center justify-between border-b border-white/[0.06]">
          <Link href="/app" className="text-xs font-semibold tracking-[0.16em]">
            CARSTAIR
          </Link>
          <button type="button" className="lg:hidden" onClick={() => setOpen(false)}>
            <X className="w-4 h-4 text-zinc-500" />
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
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors",
                  active
                    ? "bg-white/[0.06] text-white"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]"
                )}
              >
                {Icon && <Icon className="w-4 h-4 opacity-70" />}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/[0.06]">
          <p className="text-[11px] text-zinc-600 truncate px-2">@{user?.username}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-1 flex items-center gap-2 px-3 py-2 text-[13px] text-zinc-500 hover:text-white w-full rounded-lg"
          >
            <LogOut className="w-3.5 h-3.5" /> Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:pl-52 min-h-screen">
        <header className="h-12 border-b border-white/[0.06] flex items-center px-4 lg:hidden sticky top-0 bg-[#0a0a0b]/90 backdrop-blur z-30">
          <button type="button" onClick={() => setOpen(true)}>
            <Menu className="w-5 h-5 text-zinc-500" />
          </button>
        </header>
        <main className="p-5 md:p-8 rise">{children}</main>
      </div>
    </div>
  );
}
