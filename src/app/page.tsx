import Link from "next/link";
import Image from "next/image";
import { HeroSky } from "@/components/HeroSky";
import { WorkflowDemo } from "@/components/WorkflowDemo";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#fafafa] text-zinc-950">
      {/* Kimpton-like: full-bleed header, airy horizontal padding, quiet nav */}
      <header className="w-full">
        <div className="max-w-[1080px] mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="Castair" width={26} height={26} priority />
            <span className="text-[14px] font-medium tracking-tight">Castair</span>
          </div>
          <nav className="flex items-center gap-1 text-[13px]" aria-label="Primary">
            <Link href="/login" className="text-zinc-500 hover:text-zinc-900 px-3 py-1.5 transition-colors">
              Sign in
            </Link>
            <Link
              href="/login"
              className="ml-1 bg-[#0a1628] text-white px-3.5 py-1.5 rounded-full text-[13px] font-medium hover:bg-[#12263f] transition-colors"
            >
              Open product
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero: large top padding, short copy block, visual below — Kimpton proportions */}
      <section className="w-full">
        <div className="max-w-[1080px] mx-auto px-6 md:px-8 pt-20 md:pt-28 pb-8 md:pb-12">
          <div className="max-w-[520px] mb-12 md:mb-16">
            <h1 className="text-[2.75rem] md:text-[3.5rem] font-semibold tracking-[-0.03em] leading-[1.08] mb-5">
              Inspect. Sign. Release.
            </h1>
            <p className="text-[15px] md:text-base text-zinc-500 leading-relaxed mb-8 max-w-[420px]">
              Dual-control return-to-service for modern MROs.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/login?mode=demo"
                className="bg-[#0a1628] text-white px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#12263f] transition-colors"
              >
                Try isolated demo
              </Link>
              <Link
                href="/login?mode=provision"
                className="bg-white text-zinc-900 border border-zinc-200 px-4 py-2 rounded-full text-[13px] font-medium hover:border-zinc-300 transition-colors"
              >
                Provision organisation
              </Link>
            </div>
          </div>

          <HeroSky />
        </div>
      </section>

      {/* Workflow: generous vertical rhythm */}
      <section className="w-full border-t border-zinc-100 bg-white" aria-labelledby="workflow-heading">
        <div className="max-w-[1080px] mx-auto px-6 md:px-8 py-24 md:py-32">
          <div className="max-w-[400px] mb-14">
            <h2 id="workflow-heading" className="text-[1.75rem] md:text-[2rem] font-semibold tracking-tight mb-3">
              From task card to release
            </h2>
            <p className="text-[14px] text-zinc-500 leading-relaxed">
              Six steps. Human authority on every release.
            </p>
          </div>
          <WorkflowDemo />
        </div>
      </section>

      <footer className="w-full">
        <div className="max-w-[1080px] mx-auto px-6 md:px-8 py-14 text-[13px] text-zinc-400">
          Castair
        </div>
      </footer>
    </main>
  );
}
