"use client";

import { useState } from "react";

const ORANGE = "#FF6600";
const WHITE = "#FFFFFF";
const DARK = "#1a1a1a";
const GRAY = "#58595B";
const LIGHT_GRAY = "#f5f5f5";

// Zeroed pre-rollout data for easyJet
const FLEET = {
  totalEligible: 277,
  installed: 0,
  percent: 0,
  breakdown: [
    { type: "A320", count: 0, total: 180 },
    { type: "A320neo", count: 0, total: 75 },
    { type: "A321neo", count: 0, total: 22 },
  ],
  excluded: { type: "A319", note: "Excluded from programme; planned retirement by 2029" },
  dailyFlightsPercent: 0,
  hubs: [
    { code: "LGW", name: "London Gatwick", percent: 0 },
    { code: "LTN", name: "London Luton", percent: 0 },
    { code: "MAN", name: "Manchester", percent: 0 },
    { code: "AMS", name: "Amsterdam", percent: 0 },
    { code: "BCN", name: "Barcelona", percent: 0 },
    { code: "GVA", name: "Geneva", percent: 0 },
    { code: "MXP", name: "Milan Malpensa", percent: 0 },
  ],
  timeline: {
    announce: "26 October 2026",
    start: "First half of 2027",
    complete: "Early 2028",
  },
};

export default function StarlinkTrackerPage() {
  const [flightNumber, setFlightNumber] = useState("");
  const [searchResult, setSearchResult] = useState<null | { hasStarlink: boolean; message: string }>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const fn = flightNumber.trim().toUpperCase();
    if (!fn) {
      setSearchResult(null);
      return;
    }
    // Pre-rollout: nothing is equipped
    setSearchResult({
      hasStarlink: false,
      message: `Flight ${fn}: Starlink is not yet available. Installations begin first half of 2027.`,
    });
  }

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-sans antialiased">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: ORANGE }}
            >
              C
            </div>
            <div>
              <span className="font-semibold text-[15px] tracking-tight">Carstair</span>
              <span className="text-[12px] text-gray-500 ml-2">easyJet Starlink Tracker</span>
            </div>
          </div>
          <nav className="text-[13px] text-gray-600">
            <a href="/" className="hover:text-[#FF6600]">
              Home
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Hero */}
        <section className="mb-10">
          <p className="text-[12px] uppercase tracking-wider font-medium mb-2" style={{ color: ORANGE }}>
            Official pre-rollout tracker
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1a1a1a] leading-tight">
            Is Starlink Wi-Fi on your easyJet flight?
          </h1>
          <p className="mt-3 text-[15px] text-gray-600 max-w-2xl leading-relaxed">
            Check for Starlink availability on your flight. Installations have not started. Programme begins first half of 2027 and is expected to complete by early 2028 across the A320, A320neo and A321neo fleet.
          </p>
        </section>

        {/* Search */}
        <section className="mb-12 p-5 rounded-xl border border-gray-200 bg-[#fafafa]">
          <h2 className="text-[15px] font-semibold mb-3">Search by flight number</h2>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              placeholder="e.g. EZY1234 or U21234"
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
              aria-label="Flight number"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-white text-[14px] font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: ORANGE }}
            >
              Check for Starlink
            </button>
          </form>
          {searchResult && (
            <div
              className="mt-4 p-3 rounded-lg text-[14px]"
              style={{
                backgroundColor: searchResult.hasStarlink ? "#ecfdf5" : "#fff7ed",
                border: `1px solid ${searchResult.hasStarlink ? "#a7f3d0" : "#fed7aa"}`,
              }}
            >
              {searchResult.message}
            </div>
          )}
        </section>

        {/* Installation progress */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-1">Starlink installation progress</h2>
          <p className="text-[14px] text-gray-600 mb-6">
            On track to begin installations in first half of 2027 · Target complete early 2028
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {/* Percent card */}
            <div className="rounded-xl border border-gray-200 p-5 bg-white">
              <p className="text-[12px] uppercase tracking-wider text-gray-500 mb-1">Fleet completion</p>
              <p className="text-4xl font-semibold tracking-tight" style={{ color: ORANGE }}>
                {FLEET.percent}%
              </p>
              <p className="text-[13px] text-gray-600 mt-1">Starlink equipped</p>
              <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${FLEET.percent}%`, backgroundColor: ORANGE }}
                />
              </div>
            </div>

            {/* Total installed */}
            <div className="rounded-xl border border-gray-200 p-5 bg-white">
              <p className="text-[12px] uppercase tracking-wider text-gray-500 mb-1">Total aircraft installations to date</p>
              <p className="text-4xl font-semibold tracking-tight">{FLEET.installed}</p>
              <p className="text-[13px] text-gray-600 mt-1">aircraft installed</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
                {FLEET.breakdown.map((b) => (
                  <span key={b.type} className="px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    {b.type} {b.count}
                  </span>
                ))}
              </div>
            </div>

            {/* Daily flights */}
            <div className="rounded-xl border border-gray-200 p-5 bg-white">
              <p className="text-[12px] uppercase tracking-wider text-gray-500 mb-1">Daily Starlink flights systemwide</p>
              <p className="text-4xl font-semibold tracking-tight">{FLEET.dailyFlightsPercent}%</p>
              <p className="text-[13px] text-gray-600 mt-1">of departures</p>
            </div>
          </div>

          {/* Breakdown table */}
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Aircraft type</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-700">Installed</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-700">In scope</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-700">Progress</th>
                </tr>
              </thead>
              <tbody>
                {FLEET.breakdown.map((b) => (
                  <tr key={b.type} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 font-medium">{b.type}</td>
                    <td className="px-4 py-3 text-right">{b.count}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{b.total}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden inline-block">
                          <span
                            className="block h-full rounded-full"
                            style={{ width: `${b.total ? (b.count / b.total) * 100 : 0}%`, backgroundColor: ORANGE }}
                          />
                        </span>
                        <span className="text-gray-500 text-[12px] w-8 text-right">
                          {b.total ? Math.round((b.count / b.total) * 100) : 0}%
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 bg-orange-50 text-[13px] text-gray-700 border-t border-orange-100">
              <strong>{FLEET.excluded.type}</strong> — {FLEET.excluded.note}
            </div>
          </div>
        </section>

        {/* Hub breakdown */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-1">Percentage of flights with Starlink by base</h2>
          <p className="text-[13px] text-gray-500 mb-5">
            Probability calculated as Starlink departures / total departures from that base. Currently zero across the network.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FLEET.hubs.map((h) => (
              <div
                key={h.code}
                className="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 bg-white"
              >
                <div>
                  <span className="font-semibold text-[15px]">{h.code}</span>
                  <span className="text-[12px] text-gray-500 ml-2">{h.name}</span>
                </div>
                <span className="text-[18px] font-semibold" style={{ color: ORANGE }}>
                  {h.percent}%
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-12 rounded-xl border border-gray-200 p-5 bg-[#fafafa]">
          <h2 className="text-[15px] font-semibold mb-4">Programme timeline</h2>
          <ol className="space-y-3 text-[14px]">
            <li className="flex gap-3">
              <span className="w-2 h-2 mt-1.5 rounded-full shrink-0" style={{ backgroundColor: ORANGE }} />
              <div>
                <span className="font-medium">{FLEET.timeline.announce}</span>
                <span className="text-gray-600"> — Programme announced</span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-2 h-2 mt-1.5 rounded-full shrink-0 bg-gray-300" />
              <div>
                <span className="font-medium">{FLEET.timeline.start}</span>
                <span className="text-gray-600"> — First aircraft installations begin</span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-2 h-2 mt-1.5 rounded-full shrink-0 bg-gray-300" />
              <div>
                <span className="font-medium">{FLEET.timeline.complete}</span>
                <span className="text-gray-600"> — Rollout across A320 / A320neo / A321neo expected complete</span>
              </div>
            </li>
          </ol>
        </section>

        {/* Footer note */}
        <p className="text-[12px] text-gray-500 leading-relaxed">
          Data is static and zeroed pending start of the installation programme. Carstair is not affiliated with easyJet or SpaceX. Figures for eligible fleet drawn from public reports around the October 2026 announcement (approx. 277 aircraft in scope). Check back as the rollout begins for live updates.
        </p>
      </main>

      <footer className="border-t border-gray-200 py-6 text-center text-[12px] text-gray-500">
        Carstair · easyJet Starlink Tracker · Orange & white pre-rollout view
      </footer>
    </div>
  );
}
