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
            <Link href="/login" className="text-[#94a3b8] hover:text-white px-2.5 py-1">
              Log in
            </Link>
            <Link href="/login" className="btn-green px-3 py-1.5 rounded-md text-[12px]">
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      {/* Axiom-style terminal shell from first paint */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto px-2 md:px-3 py-2 md:py-3">
        <div className="grid grid-cols-12 gap-2 min-h-[calc(100vh-3.5rem)]">
          {/* Left rail */}
          <aside className="col-span-12 md:col-span-2 border border-[#1a1f2a] rounded-lg bg-[#0c0e12] p-2 hidden md:flex flex-col gap-1">
            <p className="text-[10px] uppercase tracking-wider text-[#64748b] px-1.5 mb-1">Desk</p>
            {["Dashboard", "Journal", "Analytics", "Prop / CFD", "Share", "MT5"].map((l, i) => (
              <div
                key={l}
                className={`text-[12px] px-2 py-1.5 rounded ${
                  i === 0 ? "bg-[rgba(34,197,94,0.12)] text-[#22c55e]" : "text-[#94a3b8]"
                }`}
              >
                {l}
              </div>
            ))}
            <p className="text-[10px] uppercase tracking-wider text-[#64748b] px-1.5 mt-3 mb-1">Accounts</p>
            {["MT5 · IC Markets", "Lucid 50K", "FTMO 100K"].map((a) => (
              <div key={a} className="text-[11px] px-2 py-1 text-[#64748b]">
                {a}
              </div>
            ))}
          </aside>

          {/* Centre: PnL + trades + mini TV */}
          <section className="col-span-12 md:col-span-7 border border-[#1a1f2a] rounded-lg bg-[#0c0e12] overflow-hidden flex flex-col">
            <div className="border-b border-[#1a1f2a] px-3 py-2 flex items-center gap-2 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span className="text-[#64748b]">EURUSD · London</span>
              <span className="ml-auto font-mono text-[#22c55e]">+$16,005</span>
            </div>
            <div className="p-3 flex-1 flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="border border-[#1a1f2a] rounded-md p-2.5">
                  <p className="text-[10px] text-[#64748b]">Total P&L</p>
                  <p className="text-lg font-semibold text-[#22c55e]">+$16,005</p>
                  <p className="text-[10px] text-[#64748b]">47W · 37L</p>
                </div>
                <div className="border border-[#1a1f2a] rounded-md p-2.5">
                  <p className="text-[10px] text-[#64748b]">Liquid Score</p>
                  <p className="text-lg font-semibold text-white">66</p>
                  <p className="text-[10px] text-[#64748b]">Win 56% · PF 1.8</p>
                </div>
                <div className="border border-[#1a1f2a] rounded-md p-2.5">
                  <p className="text-[10px] text-[#64748b]">Avg R</p>
                  <p className="text-lg font-semibold text-white">1.24</p>
                  <p className="text-[10px] text-[#64748b]">Discipline 72</p>
                </div>
              </div>

              {/* Mini TradingView */}
              <div className="border border-[#1a1f2a] rounded-md overflow-hidden h-[180px] md:h-[220px] bg-[#050608]">
                <iframe
                  title="TradingView EURUSD"
                  src="https://s.tradingview.com/widgetembed/?frameElementId=tv&symbol=FX%3AEURUSD&interval=15&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=050608&studies=[]&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=0&hideideas=1&hidevolume=0"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>

              <div className="space-y-1">
                {[
                  { pair: "EURUSD", side: "Long", pnl: "+$459", r: "1.48R", g: "A+" },
                  { pair: "GBPUSD", side: "Short", pnl: "-$120", r: "-0.6R", g: "C" },
                  { pair: "XAUUSD", side: "Long", pnl: "+$890", r: "2.1R", g: "A" },
                  { pair: "USDJPY", side: "Short", pnl: "+$610", r: "1.9R", g: "A+" },
                ].map((t) => (
                  <div
                    key={t.pair + t.side}
                    className="flex items-center justify-between text-[12px] py-1.5 px-2 rounded border border-[#1a1f2a] bg-[#050608]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{t.pair}</span>
                      <span className="text-[#64748b]">{t.side}</span>
                      <span className="text-[10px] px-1 rounded bg-[#1a1f2a] text-[#94a3b8]">{t.g}</span>
                    </div>
                    <div className="flex gap-3">
                      <span className={t.pnl.startsWith("+") ? "text-[#22c55e]" : "text-[#ef4444]"}>{t.pnl}</span>
                      <span className="text-[#64748b]">{t.r}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Right: share + Forex Factory */}
          <aside className="col-span-12 md:col-span-3 flex flex-col gap-2">
            <div className="border border-[#1a1f2a] rounded-lg bg-[#0c0e12] p-3 flex-1">
              <p className="text-[10px] uppercase tracking-wider text-[#64748b] mb-2">Share card</p>
              <div className="rounded-md border border-[#2a3140] bg-gradient-to-b from-[#0a1f12] to-[#050608] p-3 aspect-[9/14] max-h-[240px] flex flex-col justify-between">
                <div className="flex items-center gap-1.5">
                  <Image src="/logo.svg" alt="" width={16} height={16} unoptimized />
                  <span className="text-[10px] text-[#94a3b8]">Carstair</span>
                </div>
                <div>
                  <p className="text-[10px] text-[#64748b]">EURUSD Long</p>
                  <p className="text-xl font-semibold text-[#22c55e]">+$459</p>
                  <p className="text-[11px] text-[#94a3b8]">1.48R · A+</p>
                </div>
                <p className="text-[9px] text-[#475569]">photo · video · audio bg</p>
              </div>
              <p className="text-[10px] text-[#64748b] mt-2">story · square · landscape · download</p>
            </div>
            <div className="border border-[#1a1f2a] rounded-lg bg-[#0c0e12] p-2 h-[160px] overflow-hidden">
              <p className="text-[10px] uppercase tracking-wider text-[#64748b] px-1 mb-1">Forex Factory</p>
              <iframe
                title="Forex Factory calendar"
                src="https://www.forexfactory.com/calendar?day=today"
                className="w-full h-[130px] border-0 rounded opacity-90 scale-[0.85] origin-top-left"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </aside>
        </div>

        {/* Feature strip */}
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { t: "Journal", d: "Grades, setups, emotions, MT5 CSV" },
            { t: "Liquid Score", d: "Win rate, PF, R, discipline" },
            { t: "Prop desk", d: "Lucid, FTMO, FundingPips…" },
            { t: "Share", d: "PnL cards for TikTok / X / IG" },
          ].map((f) => (
            <div key={f.t} className="border border-[#1a1f2a] rounded-lg bg-[#0c0e12] p-3">
              <p className="text-[13px] font-medium text-white">{f.t}</p>
              <p className="text-[11px] text-[#64748b] mt-0.5">{f.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 mb-8 flex flex-wrap gap-2 items-center">
          <Link href="/login" className="btn-green px-4 py-2 rounded-md text-[13px]">
            Sign up
          </Link>
          <Link href="/login" className="border border-[#2a3140] text-[#94a3b8] px-4 py-2 rounded-md text-[13px] hover:border-[#22c55e] hover:text-white">
            Log in
          </Link>
          <span className="text-[11px] text-[#64748b]">CFD · Forex · MetaTrader 5</span>
        </div>
      </div>

      <footer className="border-t border-[#1a1f2a] py-4 text-center text-[11px] text-[#475569]">
        Carstair
      </footer>
    </main>
  );
}
