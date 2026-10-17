"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { api, setToken, getToken } from "@/lib/api/client";
import { CommandPalette } from "@/components/CommandPalette";
import { OfflineConflicts } from "@/components/OfflineConflicts";

const nav = [
  { href: "/app", label: "Aircraft" },
  { href: "/app/work-packages", label: "Work packages" },
  { href: "/app/task-cards", label: "Task cards" },
  { href: "/app/mel", label: "MEL / Deferred" },
  { href: "/app/components", label: "Components" },
  { href: "/app/agents", label: "Agents" },
  { href: "/app/approvals", label: "Approvals" },
  { href: "/app/rts", label: "RTS package" },
  { href: "/app/audit", label: "Audit log" },
  { href: "/app/exports", label: "Exports" },
  { href: "/app/security", label: "Security" },
];

type Me = {
  user: { id: string; name: string; role: string; email: string };
  tenant: { id: string; name: string; isDemo: boolean };
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  const [online, setOnline] = useState(true);
  const [forceOffline, setForceOffline] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      setMe(null);
      return;
    }
    api<Me>("/api/v1/auth/me").then((res) => {
      if (!res.ok || !res.data) {
        setToken(null);
        router.replace("/login");
        setMe(null);
        return;
      }
      setMe(res.data);
    });
  }, [router]);

  useEffect(() => {
    function sync() {
      setOnline(navigator.onLine && !forceOffline);
    }
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, [forceOffline]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("density-compact", compact);
  }, [compact]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  if (me === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-[var(--muted)]" role="status">
        <span className="skeleton h-4 w-28" />
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link href="/login" className="underline text-sm">
          Sign in
        </Link>
      </div>
    );
  }

  const navContent = (
    <>
      <div className="flex items-center gap-2 px-2 mb-1">
        <Image src="/logo.svg?v=bird" alt="" width={22} height={22} unoptimized />
        <span className="font-semibold tracking-tight">Carstair</span>
      </div>
      <div className="text-[11px] text-[var(--muted)] px-2 truncate">{me.tenant.name}</div>
      {me.tenant.isDemo && (
        <div className="mx-2 mt-1 mb-3 text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 inline-block">
          Sample
        </div>
      )}
      <nav className="flex flex-col gap-0.5 flex-1" aria-label="App">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeDrawer}
              className={`px-2 py-1.5 rounded-md text-sm ${
                active
                  ? "bg-[var(--accent-soft)] font-medium text-[#0B1F3A]"
                  : "text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[#0B1F3A]"
              }`}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[var(--border)] pt-3 mt-3 space-y-1 text-xs text-[var(--muted)]">
        <div className="px-2 truncate text-[#0B1F3A]">{me.user.name}</div>
        <div className="px-2 uppercase tracking-wide">{me.user.role.replace("_", " ")}</div>
        <button type="button" className="px-2 block hover:text-[#0B1F3A]" onClick={() => setCompact((c) => !c)}>
          Density: {compact ? "compact" : "comfortable"}
        </button>
        <button type="button" className="px-2 block hover:text-[#0B1F3A]" onClick={() => setForceOffline((v) => !v)}>
          {forceOffline ? "Work offline: on" : "Work offline: off"}
        </button>
        <button type="button" className="px-2 block hover:text-[#0B1F3A]" onClick={() => setPaletteOpen(true)}>
          Search (⌘K)
        </button>
        <button
          type="button"
          className="px-2 block hover:text-[#0B1F3A] pt-1"
          onClick={async () => {
            await api("/api/v1/auth/logout", { method: "POST" });
            setToken(null);
            router.push("/login");
          }}
        >
          {me.tenant.isDemo ? "Leave sample / Sign in" : "Sign out"}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[#0B1F3A]">
      <aside className="hidden md:flex w-52 border-r border-[var(--border)] bg-white p-3 flex-col shrink-0">{navContent}</aside>
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0 bg-black/30" aria-label="Close" onClick={closeDrawer} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white p-3 flex flex-col shadow-lg">{navContent}</aside>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {!online && (
          <div className="bg-amber-100 text-amber-950 text-xs px-4 py-2 border-b border-amber-200" role="status">
            No connection — cached data only. Findings and signatures queue until you are back online.
          </div>
        )}
        <OfflineConflicts />
        <div className="md:hidden border-b border-[var(--border)] bg-white px-3 py-2 flex items-center gap-2">
          <button
            type="button"
            className="text-sm px-2 py-1 rounded border border-[var(--border)]"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            Menu
          </button>
          <span className="font-semibold text-sm">Carstair</span>
          {me.tenant.isDemo && <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 rounded">SAMPLE</span>}
        </div>
        {children}
      </div>
      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
    </div>
  );
}
