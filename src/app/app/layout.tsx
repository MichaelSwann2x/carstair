"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession, clearSession } from "@/lib/auth/store";
import type { Session } from "@/lib/auth/types";
import { localCmms } from "@/lib/cmms/local-store";

const nav = [
  { href: "/app", label: "Aircraft" },
  { href: "/app/work-packages", label: "Work packages" },
  { href: "/app/agents", label: "Agents" },
  { href: "/app/connectors", label: "Connectors" },
  { href: "/app/approvals", label: "Approvals" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/login");
      setSession(null);
      return;
    }
    localCmms.seedDemo(s.tenant.id);
    setSession(s);
  }, [router]);

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--muted)] text-sm">
        Loading…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-sm">
        <p className="text-[var(--muted)]">No active session.</p>
        <Link href="/login" className="text-[var(--highlight)] font-medium hover:underline">
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      <aside className="w-52 border-r border-[var(--border)] bg-[var(--surface)] p-3 flex flex-col shrink-0">
        <div className="flex items-center gap-2 px-2 mb-1">
          <Image src="/logo.svg" alt="" width={22} height={22} />
          <span className="font-semibold tracking-tight">Castair</span>
        </div>
        <div className="text-[11px] text-[var(--muted)] px-2 mb-5 truncate">{session.tenant.name}</div>
        <nav className="flex flex-col gap-0.5 flex-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2 py-1.5 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-[var(--accent-soft)] text-[var(--foreground)] font-medium"
                    : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent-soft)]"
                }`}
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
            onClick={() => {
              clearSession();
              router.push("/login");
            }}
            className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] px-2 pt-1"
          >
            Sign out
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">{children}</div>
    </div>
  );
}
