import Link from "next/link";
import { ArrowRight, BarChart3, Bot, Layers, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[#2a2a32] bg-[#0c0c0e]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-[0.12em] text-sm">
            CARSTAIR
          </Link>
          <nav className="flex items-center gap-6 text-xs text-[#8a8a96]">
            <Link href="/pricing" className="hover:text-white transition">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-white transition">
              Log in
            </Link>
            <Link
              href="/signup"
              className="gloss-btn-primary px-3.5 py-1.5 rounded-md text-xs"
            >
              Create account
            </Link>
          </nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-5 pt-20 pb-24">
        <p className="text-[11px] tracking-[0.2em] uppercase text-[#8a8a96] mb-5">
          Futures · Forex · Commodities
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.1] max-w-3xl">
          Trade intelligence
          <br />
          <span className="text-[#c4c4d0]">without the noise.</span>
        </h1>
        <p className="mt-6 text-[#8a8a96] text-base max-w-xl leading-relaxed">
          Live charts via TradingView. Nico — an AI built for strategy work on
          FX, futures and commodities, plus EA and indicator scaffolding for
          MT5, TradingView and Tradovate. Clear tiers. No request-access gate.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="gloss-btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm"
          >
            Get started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/pricing"
            className="gloss-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm"
          >
            View plans
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: BarChart3,
              title: "Real charts",
              body: "TradingView free widgets — not synthetic GEX tables.",
            },
            {
              icon: Bot,
              title: "Nico",
              body: "Strategy design, pair logic, EA & Pine scaffolds focused on your markets.",
            },
            {
              icon: Layers,
              title: "Tiered workspace",
              body: "Silver to Onyx unlock depth, code export and daily Nico capacity.",
            },
          ].map((f) => (
            <div key={f.title} className="glass glass-hover rounded-xl p-5">
              <f.icon className="w-5 h-5 text-[#8a8a96] mb-3" />
              <p className="text-sm font-medium">{f.title}</p>
              <p className="text-xs text-[#8a8a96] mt-2 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[#2a2a32] bg-[#0f0f12]">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="w-4 h-4 text-[#8a8a96] mt-0.5" />
            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-[#8a8a96]">
                Philosophy
              </p>
              <h2 className="text-2xl font-light mt-2">Simple. Forward. Human.</h2>
              <p className="text-sm text-[#8a8a96] mt-3 max-w-2xl leading-relaxed">
                CARSTAIR is built for people who trade indices, FX, commodities
                and futures. We keep free limited on purpose so paid systems
                stay honest. Educational tools — not financial advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-[#2a2a32]">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <p className="text-xs tracking-[0.15em] uppercase text-[#8a8a96] mb-2">
            Contact
          </p>
          <h2 className="text-2xl font-light mb-3">We care about your experience.</h2>
          <p className="text-sm text-[#8a8a96] max-w-xl mb-6 leading-relaxed">
            Product, partnerships and account questions go to the COO.
          </p>
          <div className="glass rounded-xl p-5 max-w-sm">
            <p className="text-[11px] uppercase tracking-wider text-[#666]">
              Chief Operating Officer
            </p>
            <p className="text-base font-medium mt-1">Michael Manyewe</p>
            <a
              href="mailto:michaelmanyewe18@gmail.com"
              className="text-sm text-[#aaa] hover:text-white mt-2 inline-block"
            >
              michaelmanyewe18@gmail.com
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#2a2a32] py-8">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row justify-between gap-3 text-xs text-[#555]">
          <p>© 2026 CARSTAIR</p>
          <p>Educational only. Not financial advice.</p>
        </div>
      </footer>
    </div>
  );
}
