"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { getSession, clearSession } from "@/lib/auth/store";
import type { Session } from "@/lib/auth/types";
import { repo } from "@/lib/cmms/repo";
import { CommandPalette } from "@/components/CommandPalette";

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
  { href: "/app/connectors", label: "Connectors" },
  { href: "/app/exports", label: "Exports" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/login");
      setSession(null);
      return;
    }
    repo.seedDemo(s.tenant.id).then(() => setSession(s));
  }, [router]);

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

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--muted)] text-sm" role="status">
        <span className="skeleton h-4 w-32 inline-block" aria-hidden />
        <span className="sr-only">Loading session</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-sm">
        <p className="text-[var(--muted)]">No active session.</p>
        <Link href="/login" className="font-medium underline">
          Go to sign in
        </Link>
      </div>
    );
  }

  const navContent = (
    <>
      <div className="flex items-center gap-2 px-2 mb-1">
        <Image src="/logo.svg" alt="" width={22} height={22} />
        <span className="font-semibold tracking-tight text-black">Castair</span>
      </div>
      <div className="text-[11px] text-[var(--muted)] px-2 mb-4 truncate">{session.tenant.name}</div>
      <nav className="flex flex-col gap-0.5 flex-1" aria-label="App">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeDrawer}
              className={`px-2 py-1.5 rounded-md text-sm transition-colors ${
                active
                  ? "bg-[var(--accent-soft)] text-black font-medium"
                  : "text-[var(--muted)] hover:text-black hover:bg-[var(--accent-soft)]"
              }`}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[var(--border)] pt-3 mt-3 space-y-1">
        <div className="text-xs text-[var(--muted)] px-2 truncate">{session.user.name}</div>
        <div className="text-[10px] text-[var(--muted)] px-2 uppercase tracking-wide">{session.user.role}</div>
        <button
          type="button"
          onClick={() => setCompact((c) => !c)}
          className="text-xs text-[var(--muted)] hover:text-black px-2 block"
        >
          Density: {compact ? "compact" : "comfortable"}
        </button>
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="text-xs text-[var(--muted)] hover:text-black px-2 block"
        >
          Search (⌘K)
        </button>
        <button
          type="button"
          onClick={() => {
            clearSession();
            router.push("/login");
          }}
          className="text-xs text-[var(--muted)] hover:text-black px-2 pt-1"
        >
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-black">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 border-r border-[var(--border)] bg-white p-3 flex-col shrink-0">
        {navContent}
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            aria-label="Close menu"
            onClick={closeDrawer}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white p-3 flex flex-col shadow-lg">
            {navContent}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <div className="md:hidden border-b border-[var(--border)] bg-white px-3 py-2 flex items-center gap-2">
          <button
            type="button"
            className="text-sm font-medium px-2 py-1 rounded border border-[var(--border)]"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            Menu
          </button>
          <span className="font-semibold text-sm">Castair</span>
        </div>
        {children}
      </div>

      {paletteOpen && (
        <CommandPalette tenantId={session.tenant.id} onClose={() => setPaletteOpen(false)} />
      )}
    </div>
  );
}
