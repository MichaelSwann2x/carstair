import Link from "next/link";
import Image from "next/image";
import { HeroSky } from "@/components/HeroSky";
import { WorkflowDemo } from "@/components/WorkflowDemo";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#f7f7f8] text-black">
      <header className="border-b border-zinc-200/80 px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="Castair" width={28} height={28} priority />
          <span className="font-semibold tracking-tight text-lg">Castair</span>
        </div>
        <nav className="flex items-center gap-3 text-sm" aria-label="Primary">
          <Link
            href="/login"
            className="text-zinc-600 hover:text-black transition-colors px-2 py-1"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="bg-zinc-900 text-white px-3.5 py-1.5 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            Open product
          </Link>
        </nav>
      </header>

      <section className="relative px-6 pt-16 pb-8 md:pt-24 md:pb-12 max-w-6xl mx-auto w-full">
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.15] text-zinc-950 mb-4">
            Inspect. Sign. Release.
          </h1>
          <p className="text-zinc-500 text-base md:text-lg mb-8">
            Dual-control return-to-service for modern MROs.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/login?mode=demo"
              className="bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors"
            >
              Try isolated demo
            </Link>
            <Link
              href="/login?mode=provision"
              className="bg-white text-zinc-900 border border-zinc-200 px-5 py-2.5 rounded-full text-sm font-medium hover:border-zinc-300 transition-colors shadow-sm"
            >
              Provision organisation
            </Link>
          </div>
        </div>

        <div className="mt-12 md:mt-16 relative">
          <HeroSky />
        </div>
      </section>

      <section className="px-6 py-16 md:py-24 border-t border-zinc-200/80 bg-white" aria-labelledby="workflow-heading">
        <div className="max-w-5xl mx-auto">
          <h2 id="workflow-heading" className="text-2xl md:text-3xl font-semibold tracking-tight text-center mb-3">
            From task card to release
          </h2>
          <p className="text-center text-zinc-500 text-sm mb-12 max-w-md mx-auto">
            Six steps. Human authority on every release.
          </p>
          <WorkflowDemo />
        </div>
      </section>

      <footer className="border-t border-zinc-200 px-6 py-10 text-sm text-zinc-400 text-center bg-[#f7f7f8]">
        Castair
      </footer>
    </main>
  );
}
