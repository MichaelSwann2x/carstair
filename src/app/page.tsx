import Link from "next/link";
import Image from "next/image";
import { HeroSky } from "@/components/HeroSky";
import { WorkflowDemo } from "@/components/WorkflowDemo";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#fafafa] text-zinc-950">
      <header className="px-6 md:px-10 py-5 flex items-center justify-between max-w-[1120px] mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="Castair" width={28} height={28} priority />
          <span className="font-semibold tracking-tight text-[15px]">Castair</span>
        </div>
        <nav className="flex items-center gap-2 text-sm" aria-label="Primary">
          <Link href="/login" className="text-zinc-500 hover:text-zinc-900 px-3 py-1.5 transition-colors">
            Sign in
          </Link>
          <Link
            href="/login"
            className="bg-[#0b1f3a] text-white px-4 py-1.5 rounded-full text-[13px] font-medium hover:bg-[#122a4a] transition-colors"
          >
            Open product
          </Link>
        </nav>
      </header>

      <section className="px-6 md:px-10 pt-16 md:pt-24 pb-10 max-w-[1120px] mx-auto w-full">
        <div className="max-w-[540px] mx-auto text-center mb-14 md:mb-16">
          <h1 className="text-[2.5rem] md:text-[3.25rem] font-semibold tracking-tight leading-[1.1] mb-4">
            Inspect. Sign. Release.
          </h1>
          <p className="text-zinc-500 text-[15px] md:text-base mb-8 leading-relaxed">
            Dual-control return-to-service for modern MROs.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/login?mode=demo"
              className="bg-[#0b1f3a] text-white px-5 py-2.5 rounded-full text-[13px] font-medium hover:bg-[#122a4a] transition-colors"
            >
              Try isolated demo
            </Link>
            <Link
              href="/login?mode=provision"
              className="bg-white text-zinc-900 border border-zinc-200 px-5 py-2.5 rounded-full text-[13px] font-medium hover:border-zinc-300 transition-colors"
            >
              Provision organisation
            </Link>
          </div>
        </div>

        <HeroSky />
      </section>

      <section className="px-6 md:px-10 py-20 md:py-28 border-t border-zinc-100 bg-white" aria-labelledby="workflow-heading">
        <div className="max-w-[960px] mx-auto">
          <h2 id="workflow-heading" className="text-2xl md:text-[1.75rem] font-semibold tracking-tight text-center mb-2">
            From task card to release
          </h2>
          <p className="text-center text-zinc-500 text-sm mb-14">
            Six steps. Human authority on every release.
          </p>
          <WorkflowDemo />
        </div>
      </section>

      <footer className="px-6 py-12 text-[13px] text-zinc-400 text-center">Castair</footer>
    </main>
  );
}
