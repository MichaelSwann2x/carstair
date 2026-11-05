import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#050608] text-[#f1f5f9]">
      <header className="w-full border-b border-[#1a1f2a] sticky top-0 z-20 bg-[#050608]/95 backdrop-blur">
        <div className="max-w-[1400px] mx-auto px-3 md:px-4 h-11 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Carstair" width={26} height={26} priority unoptimized />
            <span className="text-[13px] font-semibold text-white tracking-tight">Carstair</span>
          </Link>
          <nav className="flex items-center gap-1 text-[12px]">
            <Link href="/program/starlink" className="text-[#FF6600] hover:text-white px-2.5 py-1">
              Starlink
            </Link>
            <Link href="/orderflow" className="text-[#22c55e] hover:text-white px-2.5 py-1">
              Orderflow
            </Link>
            <Link href="/login" className="text-[#94a3b8] hover:text-white px-2.5 py-1">
              Log in
            </Link>
            <Link href="/login" className="btn-green px-3 py-1.5 rounded-md text-[12px]">
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex-1 max-w-[1400px] w-full mx-auto px-3 md:px-4 py-8 md:py-12">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-wider text-[#22c55e] mb-2">Multi-tool platform</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight">
            Retail CFD orderflow + journal, free for practice
          </h1>
          <p className="mt-3 text-[14px] text-[#94a3b8] leading-relaxed">
            Footprint-style charts, volume and delta profiles, 50+ model previews, and a free 15-minute delayed feed for learning. Journal, prop desk, and MT5 tools live on the same hub.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/orderflow" className="btn-green px-4 py-2.5 rounded-md text-[13px]">
              Open Orderflow
            </Link>
            <Link href="/program/starlink" className="border border-[#FF6600] text-[#FF6600] px-4 py-2.5 rounded-md text-[13px] hover:bg-[#FF6600] hover:text-white">
              easyJet Starlink Tracker
            </Link>
            <Link href="/login" className="border border-[#2a3140] text-[#94a3b8] px-4 py-2.5 rounded-md text-[13px] hover:border-[#22c55e] hover:text-white">
              Journal & desk
            </Link>
          </div>
          <p className="mt-3 text-[11px] text-[#64748b]">
            Free delayed practice feed · Not for live trading · Open source
          </p>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { t: "Starlink", d: "easyJet pre-rollout tracker — zeroed, orange/white", href: "/program/starlink" },
            { t: "Orderflow", d: "Footprint, profiles, ladder, 8 market groups", href: "/orderflow" },
            { t: "50+ Models", d: "Delta, imbalance, VWAP, TPO, absorption previews", href: "/orderflow" },
            { t: "Journal", d: "Grades, setups, emotions, MT5 CSV, Liquid Score", href: "/login" },
          ].map((f) => (
            <Link key={f.t} href={f.href} className="border border-[#1a1f2a] rounded-lg bg-[#0c0e12] p-3 hover:border-[#22c55e] transition-colors">
              <p className="text-[13px] font-medium text-white">{f.t}</p>
              <p className="text-[11px] text-[#64748b] mt-0.5">{f.d}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 border border-[#1a1f2a] rounded-lg bg-[#0c0e12] p-4">
          <p className="text-[11px] uppercase tracking-wider text-[#64748b] mb-2">Markets</p>
          <p className="text-[12px] text-[#94a3b8]">
            Ind&Com · Forex · Energy · Majors · PrecMet · Ind&Com3 · Exotic · Cryptocurrencies
          </p>
        </div>
      </div>

      <footer className="border-t border-[#1a1f2a] py-4 text-center text-[11px] text-[#475569]">
        Carstair · Free delayed practice tools · Not financial advice
      </footer>
    </main>
  );
}
