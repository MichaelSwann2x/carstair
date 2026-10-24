import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0a0b0f] text-[#e2e8f0]">
      {/* Top bar — Axiom density */}
      <header className="w-full border-b border-[#1e293b]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="Carstair" width={28} height={28} priority unoptimized />
            <span className="text-[14px] font-semibold tracking-tight text-white">Carstair</span>
            <span className="text-[11px] text-[#64748b] hidden sm:inline">Forex · CFD · MT5</span>
          </Link>
          <nav className="flex items-center gap-1 text-[13px]" aria-label="Primary">
            <Link href="/login" className="text-[#94a3b8] hover:text-white px-3 py-1.5 transition-colors">
              Sign in
            </Link>
            <Link
              href="/login"
              className="bg-[#0ea5e9] text-[#0a0b0f] px-3.5 py-1.5 rounded-md text-[13px] font-medium hover:bg-[#38bdf8] transition-colors"
            >
              Open journal
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="w-full">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 pt-16 md:pt-24 pb-12 md:pb-16">
          <p className="text-[12px] uppercase tracking-widest text-[#22d3ee] mb-4">Stop being the liquidity</p>
          <h1 className="text-[2.25rem] sm:text-[3rem] md:text-[3.5rem] font-semibold tracking-[-0.03em] leading-[1.1] max-w-[18ch] mb-5 text-white">
            Forex & CFD journal built for MetaTrader 5.
          </h1>
          <p className="text-[15px] text-[#94a3b8] leading-relaxed max-w-[36rem] mb-8">
            Log every trade, grade the setup, share downloadable PnL cards with custom photo, video or audio backgrounds.
            Dense terminal layout. Lucid-dark colours. One click from journal to TikTok / X / Instagram.
          </p>
          <div className="flex flex-wrap gap-2.5 mb-14">
            <Link
              href="/login?mode=demo"
              className="bg-[#0ea5e9] text-[#0a0b0f] px-4 py-2 rounded-md text-[13px] font-medium hover:bg-[#38bdf8] transition-colors"
            >
              Open sample journal
            </Link>
            <Link
              href="/login"
              className="bg-[#1e293b] text-white border border-[#334155] px-4 py-2 rounded-md text-[13px] font-medium hover:border-[#475569] transition-colors"
            >
              Connect MT5
            </Link>
          </div>

          {/* Dense product stage — Axiom style */}
          <div className="rounded-xl border border-[#1e293b] bg-[#0f1219] overflow-hidden shadow-[0_0_80px_-20px_rgba(14,165,233,0.25)]">
            <div className="border-b border-[#1e293b] px-4 py-2.5 flex items-center gap-3 bg-[#0a0b0f]">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <span className="text-[12px] text-[#64748b]">Live session · EURUSD · London</span>
              <span className="ml-auto text-[12px] font-mono text-[#22d3ee]">+$1,842.50</span>
            </div>
            <div className="grid md:grid-cols-[200px_1fr_220px] min-h-[300px]">
              {/* Left rail */}
              <aside className="border-r border-[#1e293b] p-3 hidden md:block">
                <p className="text-[10px] uppercase tracking-wider text-[#64748b] mb-2">Accounts</p>
                {["MT5 · IC Markets", "Prop · Lucid 50K", "Demo · Pepperstone"].map((r, i) => (
                  <div
                    key={r}
                    className={`text-[12px] px-2 py-1.5 rounded mb-0.5 ${
                      i === 0 ? "bg-[#0ea5e9]/15 text-[#22d3ee]" : "text-[#64748b]"
                    }`}
                  >
                    {r}
                  </div>
                ))}
                <p className="text-[10px] uppercase tracking-wider text-[#64748b] mt-4 mb-2">Sessions</p>
                {["Asia", "London", "New York"].map((s) => (
                  <div key={s} className="text-[12px] px-2 py-1 text-[#94a3b8]">{s}</div>
                ))}
              </aside>

              {/* Centre — PnL + trades */}
              <div className="p-4 md:p-5 border-r border-[#1e293b]">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-[11px] text-[#64748b]">Total P&L</p>
                    <p className="text-[1.75rem] font-semibold text-[#22c55e] tracking-tight">+$16,005</p>
                    <p className="text-[12px] text-[#64748b]">47 wins · 37 losses</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-[#64748b]">Liquid Score</p>
                    <p className="text-[1.5rem] font-semibold text-white">66</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { pair: "EURUSD", side: "Long", pnl: "+$459", r: "1.48R", grade: "A+" },
                    { pair: "GBPUSD", side: "Short", pnl: "-$120", r: "-0.6R", grade: "C" },
                    { pair: "XAUUSD", side: "Long", pnl: "+$890", r: "2.1R", grade: "A" },
                  ].map((t) => (
                    <div
                      key={t.pair + t.side}
                      className="flex items-center justify-between text-[12px] py-2 px-2.5 rounded bg-[#12151c] border border-[#1e293b]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{t.pair}</span>
                        <span className="text-[#64748b]">{t.side}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e293b] text-[#94a3b8]">{t.grade}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={t.pnl.startsWith("+") ? "text-[#22c55e]" : "text-[#f87171]"}>{t.pnl}</span>
                        <span className="text-[#64748b]">{t.r}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — share card preview */}
              <div className="p-4 hidden md:block">
                <p className="text-[10px] uppercase tracking-wider text-[#64748b] mb-2">Share card</p>
                <div className="rounded-lg border border-[#334155] bg-gradient-to-br from-[#0c4a6e]/40 to-[#0a0b0f] p-4 aspect-[9/16] max-h-[260px] flex flex-col justify-between">
                  <div className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="" width={18} height={18} unoptimized />
                    <span className="text-[11px] text-[#94a3b8]">Carstair</span>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#64748b]">EURUSD Long</p>
                    <p className="text-[1.5rem] font-semibold text-[#22c55e]">+$459</p>
                    <p className="text-[12px] text-[#94a3b8]">1.48R · A+</p>
                  </div>
                  <p className="text-[10px] text-[#475569]">Custom background · photo / video / audio</p>
                </div>
                <p className="text-[11px] text-[#64748b] mt-2">Download · story · square · landscape</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="w-full border-t border-[#1e293b]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-16 md:py-20">
          <h2 className="text-[1.5rem] md:text-[1.75rem] font-semibold text-white tracking-tight mb-3 max-w-[22ch]">
            Five screens that run the session.
          </h2>
          <p className="text-[14px] text-[#94a3b8] max-w-[32rem] mb-10">
            Dashboard, journal, analytics, prop/CFD desk, and the share engine. Built for forex and CFD first.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { t: "Dashboard", d: "Total P&L, Liquid Score, session calendar, news that still matters." },
              { t: "Journal", d: "Every trade on real candles. Grade, setup, emotions, MT5 import." },
              { t: "Analytics", d: "Win rate by session and setup. Pattern detectors. What your mistakes cost." },
              { t: "Prop & CFD desk", d: "Lucid, FTMO, FundingPips and more. Evals, funded, payouts in one view." },
              { t: "Share engine", d: "PnL cards and short videos. Attach photo, video, audio or a link. Download ready for TikTok / X / IG." },
              { t: "MT5 bridge", d: "CSV and report import today. Live account connection path for your own broker API." },
            ].map((item) => (
              <div key={item.t} className="border border-[#1e293b] rounded-lg p-4 bg-[#0f1219]">
                <h3 className="text-[14px] font-medium text-white mb-1.5">{item.t}</h3>
                <p className="text-[13px] text-[#94a3b8] leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Share highlight */}
      <section className="w-full border-t border-[#1e293b] bg-[#0f1219]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-16 md:py-20">
          <h2 className="text-[1.5rem] md:text-[1.75rem] font-semibold text-white tracking-tight mb-3 max-w-[20ch]">
            PnL cards that actually get posted.
          </h2>
          <p className="text-[14px] text-[#94a3b8] max-w-[36rem] mb-8">
            Same share flow Axiom traders use. Pick any closed trade, drop a background (image, video, audio, or a public link),
            choose story / square / landscape, and download. No watermark on the free plan.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/login?mode=demo"
              className="bg-[#0ea5e9] text-[#0a0b0f] px-4 py-2 rounded-md text-[13px] font-medium"
            >
              Generate a sample card
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full border-t border-[#1e293b]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-16 md:py-20">
          <h2 className="text-[1.5rem] md:text-[1.75rem] font-semibold text-white tracking-tight mb-3 max-w-[18ch]">
            Your journal. Your MT5. Your posts.
          </h2>
          <p className="text-[14px] text-[#94a3b8] max-w-[30rem] mb-8">
            Free forever for logging and cards. Connect your MetaTrader 5 account and stop losing the lesson.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/login?mode=demo"
              className="bg-[#0ea5e9] text-[#0a0b0f] px-4 py-2 rounded-md text-[13px] font-medium"
            >
              Open sample journal
            </Link>
            <Link
              href="/login"
              className="bg-[#1e293b] text-white border border-[#334155] px-4 py-2 rounded-md text-[13px] font-medium"
            >
              Sign up free
            </Link>
          </div>
        </div>
      </section>

      <footer className="w-full border-t border-[#1e293b]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8 text-[12px] text-[#64748b] flex items-center justify-between">
          <span>Carstair · Forex & CFD journal</span>
          <span>Eye of Sauron mark · Lucid-dark · Axiom layout</span>
        </div>
      </footer>
    </main>
  );
}
