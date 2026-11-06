"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

const ORANGE = "#FF6600";
const ORANGE_DARK = "#E55A00";

const HUBS = [
  { code: "LTN", name: "Luton", percent: 0 },
  { code: "LGW", name: "Gatwick", percent: 0 },
  { code: "BRS", name: "Bristol", percent: 0 },
  { code: "MAN", name: "Manchester", percent: 0 },
  { code: "EDI", name: "Edinburgh", percent: 0 },
  { code: "GLA", name: "Glasgow", percent: 0 },
  { code: "NCL", name: "Newcastle", percent: 0 },
  { code: "BHX", name: "Birmingham", percent: 0 },
  { code: "SEN", name: "Southend", percent: 0 },
];

function Ring({ percent, size = 160, stroke = 12, label, sub }: { percent: number; size?: number; stroke?: number; label: string; sub?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E8E8E8" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={ORANGE}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-4xl font-semibold text-[#1a1a1a] tracking-tight">{percent}%</span>
        {sub && <span className="text-sm text-gray-500 mt-0.5">{sub}</span>}
      </div>
      <p className="sr-only">{label}</p>
    </div>
  );
}

export default function StarlinkTrackerPage() {
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  });
  const [flightNumber, setFlightNumber] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const dateOptions = useMemo(() => {
    const opts: string[] = [];
    const base = new Date();
    for (let i = 0; i < 4; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      opts.push(d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }));
    }
    return opts;
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const fn = flightNumber.trim().toUpperCase();
    if (!fn) {
      setResult(null);
      return;
    }
    setResult(`Flight ${fn}: Carstair Wi-Fi is not yet available. Installations have not started.`);
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#1a1a1a] font-sans antialiased">
      {/* Header — matches United dark bar */}
      <header
        className="text-white"
        style={{
          background: "linear-gradient(90deg, #1a1208 0%, #2d1a0a 40%, #1a1208 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 h-[64px] flex items-center gap-3">
          <Image src="/logo.svg" alt="Carstair" width={36} height={36} className="rounded-lg" />
          <span className="text-[20px] font-semibold tracking-tight">Carstair Wi-Fi Tracker</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 md:py-12">
        {/* Title block */}
        <section className="mb-8">
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-tight text-[#1a1a1a]">
            Is Carstair Wi-Fi on your flight?
          </h1>
          <p className="mt-2 text-[15px] text-gray-600">
            Check for Starlink availability on your flight up to three days before departure.
          </p>
        </section>

        {/* Search card */}
        <section className="mb-10 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-[17px] font-semibold mb-4">Search by flight number</h2>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-[13px] text-gray-600 mb-1.5">Date</label>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-gray-300 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
              >
                {dateOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-[13px] text-gray-600 mb-1.5">Flight number</label>
              <input
                type="text"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                placeholder="e.g. 2441"
                className="w-full h-11 px-3 rounded-lg border border-gray-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="h-11 px-6 rounded-full text-white text-[14px] font-semibold whitespace-nowrap transition-opacity hover:opacity-90"
              style={{ backgroundColor: ORANGE }}
            >
              Check for Starlink
            </button>
          </form>
          {result && (
            <div className="mt-4 p-3 rounded-lg text-[14px] bg-orange-50 border border-orange-100 text-gray-800">
              {result}
            </div>
          )}
        </section>

        {/* Installation progress */}
        <section className="mb-8">
          <h2 className="text-[22px] font-semibold mb-5">Starlink installation progress</h2>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Fleet completion ring */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
              <p className="text-[13px] text-gray-600 mb-4 leading-snug">
                On track to complete installations by end of 2028
              </p>
              <div className="relative flex justify-center flex-1 items-center py-2">
                <div className="relative" style={{ width: 160, height: 160 }}>
                  <svg width={160} height={160} className="-rotate-90">
                    <circle cx={80} cy={80} r={68} fill="none" stroke="#E8E8E8" strokeWidth={12} />
                    <circle
                      cx={80}
                      cy={80}
                      r={68}
                      fill="none"
                      stroke={ORANGE}
                      strokeWidth={12}
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 68}
                      strokeDashoffset={2 * Math.PI * 68}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[40px] font-semibold leading-none tracking-tight">0%</span>
                    <span className="text-[13px] text-gray-500 mt-1">Fleet completion</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-[13px] text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ORANGE }} />
                Starlink equipped
              </div>
            </div>

            {/* Total installations donut */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
              <p className="text-[13px] text-gray-600 mb-4">Total aircraft installations to date</p>
              <div className="relative flex justify-center flex-1 items-center py-2">
                <div className="relative" style={{ width: 160, height: 160 }}>
                  <svg width={160} height={160} className="-rotate-90">
                    <circle cx={80} cy={80} r={68} fill="none" stroke="#E8E8E8" strokeWidth={14} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[40px] font-semibold leading-none tracking-tight">0</span>
                    <span className="text-[13px] text-gray-500 mt-1">aircraft installed</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[12px] text-gray-600">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFB380]" /> Regional 0
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ORANGE }} /> Narrowbody 0
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#CC5200]" /> Widebody 0
                </span>
              </div>
            </div>

            {/* Daily flights + hubs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 text-[13px] text-gray-600 mb-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M2 16l8-3 3-8 3 8 8 3-8 3-3 8-3-8-8-3z" stroke={ORANGE} strokeWidth="1.5" fill="none" />
                    </svg>
                    Daily Starlink flights systemwide
                  </div>
                  <p className="text-[36px] font-semibold leading-none tracking-tight">0%</p>
                </div>
              </div>
              <p className="text-[12px] font-medium text-gray-700 mb-2">Percentage of flights with Starlink by Hub</p>
              <div className="space-y-2 flex-1 overflow-auto">
                {HUBS.map((h) => (
                  <div key={h.code} className="flex items-center gap-2 text-[12px]">
                    <span className="w-9 font-semibold text-gray-800">{h.code}</span>
                    <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.max(h.percent, 0)}%`, backgroundColor: ORANGE }}
                      />
                    </div>
                    <span className="w-8 text-right text-gray-600">{h.percent}%</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-3 leading-snug">
                Probability is calculated as Starlink departures / total departures from that hub.
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              className="px-5 py-2 rounded-full border border-gray-300 bg-white text-[14px] font-medium text-gray-700 hover:border-[#FF6600] hover:text-[#FF6600] transition-colors"
            >
              {showDetails ? "Hide details" : "Show more details"}
            </button>
          </div>

          {showDetails && (
            <div className="mt-6 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-[15px] font-semibold mb-3">Programme notes</h3>
              <ul className="text-[14px] text-gray-600 space-y-2 list-disc pl-5">
                <li>All figures are zeroed — installations have not started.</li>
                <li>Hubs tracked: Luton, Gatwick, Bristol, Manchester, Edinburgh, Glasgow, Newcastle, Birmingham, Southend.</li>
                <li>Search checks availability up to three days before departure.</li>
              </ul>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1208] text-white/70 text-[12px] py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-2">
          <p>Last updated: pre-rollout · All metrics zeroed</p>
          <p className="text-white/50">
            Carstair is an independent tracker and is not affiliated with any airline or SpaceX.
          </p>
          <div className="pt-2 flex items-center justify-center gap-2 text-white font-semibold tracking-wide">
            <Image src="/logo.svg" alt="" width={20} height={20} className="rounded" />
            CARSTAIR
          </div>
        </div>
      </footer>
    </div>
  );
}
