import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--background)] text-black">
      <header className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="Castair logo" width={28} height={28} priority />
          <span className="font-semibold tracking-tight text-lg text-black">Castair</span>
        </div>
        <nav className="flex items-center gap-4 text-sm" aria-label="Primary">
          <Link href="/login" className="text-[var(--muted)] hover:text-black transition-colors">
            Sign in
          </Link>
          <Link
            href="/login"
            className="bg-[var(--accent)] text-white px-3.5 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Open product
          </Link>
        </nav>
      </header>

      <section className="flex-1 px-6 py-20 md:py-28 max-w-5xl mx-auto w-full animate-fade-up">
        <p className="text-xs text-[var(--muted)] mb-4 tracking-widest uppercase">
          Aircraft Quality Control · Return-to-Service · Aviation Safety
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.12] mb-6 max-w-3xl text-black">
          The inspector platform engineered for airworthiness.
        </h1>
        <p className="text-[var(--muted)] text-lg mb-10 max-w-2xl leading-relaxed">
          Offline-capable CMMS, AD/SB applicability, electronic job cards, dual-control
          approvals, and one-click RTS packages — with human authority on every release.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/login"
            className="bg-[var(--accent)] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Enter Castair
          </Link>
        </div>

        <div className="mt-20 grid sm:grid-cols-3 gap-4">
          {[
            {
              title: "Native CMMS",
              body: "Aircraft, task cards, components, MEL — works offline with IndexedDB.",
            },
            {
              title: "Agentic inspection",
              body: "AD/SB applicability, visual disposition, and audit-ready airworthiness paths.",
            },
            {
              title: "Separation of duties",
              body: "Inspectors propose. Certifying staff release. Immutable audit on every step.",
            },
          ].map((c) => (
            <div key={c.title} className="castair-card p-5 bg-white">
              <div className="font-medium mb-2 text-black">{c.title}</div>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--border)] px-6 py-8 text-sm text-[var(--muted)] text-center">
        Sandboxed · Offline-capable · Human-in-the-loop by design
      </footer>
    </main>
  );
}
