import Link from "next/link";
import Image from "next/image";
import { HeroSky } from "@/components/HeroSky";
import { WorkflowDemo } from "@/components/WorkflowDemo";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#fafafa] text-zinc-950">
      <header className="w-full border-b border-transparent">
        <div className="max-w-[1080px] mx-auto px-6 md:px-10 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg?v=3" alt="Castair" width={28} height={28} priority unoptimized />
            <span className="text-[14px] font-medium tracking-tight">Castair</span>
          </div>
          <nav className="flex items-center gap-1 text-[13px]" aria-label="Primary">
            <Link href="/login" className="text-zinc-500 hover:text-zinc-900 px-3 py-1.5">
              Sign in
            </Link>
            <Link
              href="/login"
              className="bg-[#0a1628] text-white px-3.5 py-1.5 rounded-full text-[13px] font-medium"
            >
              Open product
            </Link>
          </nav>
        </div>
      </header>

      <section className="w-full">
        <div className="max-w-[1080px] mx-auto px-6 md:px-10 pt-24 md:pt-32 pb-10">
          <div className="max-w-[480px] mb-14 md:mb-20">
            <h1 className="text-[2.75rem] md:text-[3.75rem] font-semibold tracking-[-0.035em] leading-[1.05] mb-5">
              Inspect. Sign.
              <br />
              Release.
            </h1>
            <p className="text-[15px] text-zinc-500 leading-relaxed mb-8 max-w-[380px]">
              Dual-control return-to-service for modern MROs.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/login?mode=demo"
                className="bg-[#0a1628] text-white px-4 py-2 rounded-full text-[13px] font-medium"
              >
                Try isolated demo
              </Link>
              <Link
                href="/login?mode=provision"
                className="bg-white text-zinc-900 border border-zinc-200 px-4 py-2 rounded-full text-[13px] font-medium"
              >
                Provision organisation
              </Link>
            </div>
          </div>
          <HeroSky />
        </div>
      </section>

      <section className="w-full border-t border-zinc-100 bg-white" aria-labelledby="workflow-heading">
        <div className="max-w-[1080px] mx-auto px-6 md:px-10 py-28 md:py-36">
          <div className="max-w-[360px] mb-16">
            <h2 id="workflow-heading" className="text-[1.75rem] font-semibold tracking-tight mb-3">
              From task card to release
            </h2>
            <p className="text-[14px] text-zinc-500">Six steps. Human authority on every release.</p>
          </div>
          <WorkflowDemo />
        </div>
      </section>

      <footer className="w-full">
        <div className="max-w-[1080px] mx-auto px-6 md:px-10 py-16 text-[13px] text-zinc-400">Castair</div>
      </footer>
    </main>
  );
}
