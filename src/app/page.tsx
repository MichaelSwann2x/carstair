import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between bg-[var(--surface)]">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="Castair" width={28} height={28} priority />
          <span className="font-semibold tracking-tight text-lg">Castair</span>
        </div>
        <nav className="flex gap-6 text-sm text-[var(--muted)]">
          <Link href="/login" className="hover:text-[var(--foreground)] transition-colors">
            Sign in
          </Link>
          <Link href="/app" className="hover:text-[var(--foreground)] transition-colors">
            Product
          </Link>
        </nav>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center max-w-3xl mx-auto animate-fade-up">
        <p className="text-xs text-[var(--muted)] mb-4 tracking-widest uppercase">
          Aircraft Quality Control · RTS · Aviation Safety
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.15] mb-6">
          The inspector platform engineered for airworthiness.
        </h1>
        <p className="text-[var(--muted)] text-lg mb-10 max-w-xl leading-relaxed">
          Offline-first Castair CMMS or connect Trax and AMOS. Agentic AD/SB,
          closed-loop visual and explainable airworthiness — human authority on
          every return-to-service.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/login"
            className="bg-[var(--accent)] text-[var(--background)] px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Enter Castair
          </Link>
          <Link
            href="https://github.com/MichaelSwann2x/carstair"
            className="border border-[var(--border)] px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--accent-soft)] transition-colors"
          >
            Source
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] px-6 py-8 text-sm text-[var(--muted)] text-center">
        Sandboxed · Encrypted · Offline-capable · Human-in-the-loop by design
      </footer>
    </main>
  );
}
