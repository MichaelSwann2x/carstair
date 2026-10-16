import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between bg-[var(--surface)] sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="Castair" width={28} height={28} priority />
          <span className="font-semibold tracking-tight text-lg">Castair</span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/login" className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            Sign in
          </Link>
          <Link
            href="/login"
            className="bg-[var(--accent)] text-[var(--background)] px-3.5 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Open product
          </Link>
        </nav>
      </header>

      <section className="flex-1 px-6 py-20 md:py-28 max-w-5xl mx-auto w-full animate-fade-up">
        <p className="text-xs text-[var(--muted)] mb-4 tracking-widest uppercase">
          Aircraft Quality Control · Return-to-Service · Aviation Safety
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.12] mb-6 max-w-3xl">
          The inspector platform engineered for airworthiness.
        </h1>
        <p className="text-[var(--muted)] text-lg mb-10 max-w-2xl leading-relaxed">
          Offline-first Castair CMMS, or connect Trax and AMOS. Run AD/SB monitoring,
          closed-loop visual disposition, and explainable airworthiness — with human
          authority on every RTS decision.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/login"
            className="bg-[var(--accent)] text-[var(--background)] px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Enter Castair
          </Link>
          <a
            href="https://github.com/MichaelSwann2x/carstair"
            className="border border-[var(--border)] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--accent-soft)] transition-colors"
          >
            Source
          </a>
        </div>

        <div className="mt-20 grid sm:grid-cols-3 gap-4">
          {[
            {
              title: "Native CMMS",
              body: "Aircraft, work packages, AD/SB register — offline in the browser, no internet required.",
            },
            {
              title: "Agentic inspection",
              body: "AD/SB applicability, visual disposition language, and audit-ready airworthiness paths.",
            },
            {
              title: "Human-in-the-loop",
              body: "RTS and airworthiness outputs never auto-sign. Approvals stay with certifying staff.",
            },
          ].map((c) => (
            <div key={c.title} className="castair-card p-5">
              <div className="font-medium mb-2">{c.title}</div>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--border)] px-6 py-8 text-sm text-[var(--muted)] text-center">
        Sandboxed · Encrypted · Offline-capable · Human-in-the-loop by design
      </footer>
    </main>
  );
}
