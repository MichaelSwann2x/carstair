import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--background)] text-black">
      <header className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="Castair logo" width={28} height={28} priority />
          <span className="font-semibold tracking-tight text-lg">Castair</span>
        </div>
        <nav className="flex items-center gap-4 text-sm" aria-label="Primary">
          <Link href="/login" className="text-[var(--muted)] hover:text-black">Sign in</Link>
          <Link href="/login" className="bg-[var(--accent)] text-white px-3.5 py-1.5 rounded-lg font-medium">Open product</Link>
        </nav>
      </header>

      <section className="flex-1 px-6 py-16 md:py-24 max-w-5xl mx-auto w-full animate-fade-up">
        <p className="text-xs text-[var(--muted)] mb-4 tracking-widest uppercase">
          Aircraft Quality Control · Return-to-Service · Dual-control
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.12] mb-6 max-w-3xl">
          Online-first inspection. Dual-control release. Offline only when you need it.
        </h1>
        <p className="text-[var(--muted)] text-lg mb-8 max-w-2xl leading-relaxed">
          Server is the source of truth. Certifying staff — not agents — release aircraft.
          Immutable audit on every airworthiness action. Offline is a limited fallback with an outbox, not the base model.
        </p>
        <div className="flex flex-wrap gap-3 mb-14">
          <Link href="/login" className="bg-[var(--accent)] text-white px-5 py-2.5 rounded-lg text-sm font-medium">
            Try isolated demo
          </Link>
          <Link href="/login" className="border border-[var(--border)] px-5 py-2.5 rounded-lg text-sm font-medium bg-white">
            Provision organisation
          </Link>
        </div>

        {/* Product demo video placement
            Drop a 25–40s MP4/WebM at /public/demo.mp4 showing:
            open task card → attach evidence → dual sign → RTS package → audit entry.
            Uncomment the video element when the file is present. */}
        <div className="castair-card overflow-hidden bg-white mb-14 aspect-video flex items-center justify-center border border-[var(--border)]">
          <div className="text-center px-6">
            <p className="text-sm font-medium mb-1">Product walkthrough (25–40s)</p>
            <p className="text-xs text-[var(--muted)] max-w-md">
              Place <code className="text-[11px]">public/demo.mp4</code> then enable the video tag in
              <code className="text-[11px]"> src/app/page.tsx</code>. Flow: task card → dual sign → RTS → audit.
            </p>
            {/*
            <video className="w-full h-full object-cover" controls playsInline poster="/demo-poster.jpg">
              <source src="/demo.mp4" type="video/mp4" />
            </video>
            */}
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { t: "Online-first", b: "APIs and roles on the server. Dual-control signatures enforced server-side." },
            { t: "Dual-control RTS", b: "Inspectors propose. Certifying staff release. Agents never auto-sign." },
            { t: "Offline fallback", b: "Cache + outbox when disconnected. Conflict UI for findings and signatures." },
          ].map((c) => (
            <div key={c.t} className="castair-card p-5 bg-white">
              <div className="font-medium mb-2">{c.t}</div>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--border)] px-6 py-8 text-sm text-[var(--muted)] text-center">
        Human-in-the-loop · Append-only audit · Demo is isolated
      </footer>
    </main>
  );
}
