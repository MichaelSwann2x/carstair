"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  LineChart,
  Bot,
  Layers,
  CreditCard,
  LogOut,
  Menu,
  X,
  PanelRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/app", label: "Overview", icon: LayoutDashboard },
  { href: "/app/charts", label: "Charts", icon: LineChart },
  { href: "/app/nico", label: "Nico", icon: Bot },
  { href: "/app/models", label: "Models", icon: Layers },
  { href: "/app/billing", label: "Billing", icon: CreditCard },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ username?: string; name?: string; tier?: string } | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [sideOpen, setSideOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("carstair_session")) {
      router.replace("/login");
      return;
    }
    try {
      const u = JSON.parse(localStorage.getItem("carstair_user") || "{}");
      setUser(u);
      const tier = u.tier || "free";
      const uid = u.username || u.email || "anon";
      fetch(`/api/credits?userId=${encodeURIComponent(uid)}&tier=${tier}`)
        .then((r) => r.json())
        .then((d) => setCredits(d.remaining ?? 0))
        .catch(() => setCredits(0));
    } catch {
      router.replace("/login");
    }
  }, [router, pathname]);

  function logout() {
    localStorage.removeItem("carstair_session");
    router.push("/");
  }

  return (
    <div className="min-h-screen flex bg-[#0c0c0e]">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-56 border-r border-[#2a2a32] bg-[#0f0f12] flex flex-col transition-transform lg:translate-x-0",
          sideOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-[#2a2a32]">
          <Link href="/app" className="text-xs font-semibold tracking-[0.12em]">
            CARSTAIR
          </Link>
          <button className="lg:hidden" onClick={() => setSideOpen(false)}>
            <X className="w-4 h-4 text-[#8a8a96]" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active =
              item.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSideOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition",
                  active
                    ? "bg-[#1a1a1f] text-white border border-[#2a2a32]"
                    : "text-[#8a8a96] hover:text-white hover:bg-[#141417]"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-[#2a2a32]">
          <p className="text-[11px] text-[#666] truncate px-2">
            {user?.username || user?.name || "…"}
          </p>
          <button
            onClick={logout}
            className="mt-2 flex items-center gap-2 px-3 py-2 text-xs text-[#8a8a96] hover:text-white w-full rounded-lg hover:bg-[#141417]"
          >
            <LogOut className="w-3.5 h-3.5" /> Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:pl-56 min-h-screen flex flex-col">
        <header className="h-14 border-b border-[#2a2a32] flex items-center justify-between px-4 sticky top-0 bg-[#0c0c0e]/90 backdrop-blur z-30">
          <button className="lg:hidden" onClick={() => setSideOpen(true)}>
            <Menu className="w-5 h-5 text-[#8a8a96]" />
          </button>
          <div className="flex-1" />
          <button
            onClick={() => setCreditsOpen((v) => !v)}
            className="gloss-btn rounded-lg px-3 py-1.5 text-[11px] flex items-center gap-1.5"
            title="Credits panel"
          >
            <PanelRight className="w-3.5 h-3.5" />
            Account
          </button>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      {/* Credits side panel — not on main chrome */}
      {creditsOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setCreditsOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-72 z-50 glass border-l border-[#2a2a32] p-5 animate-fade">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Account</p>
              <button onClick={() => setCreditsOpen(false)}>
                <X className="w-4 h-4 text-[#8a8a96]" />
              </button>
            </div>
            <p className="text-xs text-[#666] mt-4">Plan</p>
            <p className="text-sm capitalize">{user?.tier || "free"}</p>
            <p className="text-xs text-[#666] mt-4">Nico credits remaining today</p>
            <p className="text-2xl font-light tabular-nums">
              {credits === null ? "—" : credits}
            </p>
            <Link
              href="/app/billing"
              className="mt-6 block text-center gloss-btn-primary rounded-lg py-2 text-xs"
              onClick={() => setCreditsOpen(false)}
            >
              Upgrade plan
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
