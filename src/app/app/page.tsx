"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from "react";
import {
  Trade,
  loadTrades,
  saveTrades,
  loadAccounts,
  computeLiquidScore,
  parseMt5Csv,
  PROP_FIRMS,
  SAMPLE_TRADES,
} from "@/lib/journal";

function JournalApp() {
  const params = useSearchParams();
  const tab = params.get("tab") || "dashboard";
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selected, setSelected] = useState<Trade | null>(null);
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<"story" | "square" | "landscape">("story");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const csvRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTrades(loadTrades());
  }, []);

  const score = useMemo(() => computeLiquidScore(trades), [trades]);
  const totalPnl = useMemo(() => trades.reduce((s, t) => s + t.pnl, 0), [trades]);
  const accounts = useMemo(() => loadAccounts(), []);

  const persist = useCallback((next: Trade[]) => {
    setTrades(next);
    saveTrades(next);
  }, []);

  function onCsv(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const imported = parseMt5Csv(text);
      if (imported.length === 0) {
        alert("No trades parsed. Expect CSV with Symbol, Type, Volume, Profit columns.");
        return;
      }
      persist([...imported, ...trades]);
      alert(`Imported ${imported.length} trades from MT5 report.`);
    };
    reader.readAsText(f);
  }

  function onBg(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBgFile(f);
    if (bgUrl) URL.revokeObjectURL(bgUrl);
    setBgUrl(URL.createObjectURL(f));
  }

  async function drawCard() {
    const t = selected || trades[0];
    if (!t || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const w = format === "story" ? 1080 : format === "square" ? 1080 : 1920;
    const h = format === "story" ? 1920 : format === "square" ? 1080 : 1080;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    if (bgUrl && bgFile?.type.startsWith("image/")) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej();
        img.src = bgUrl;
      });
      const scale = Math.max(w / img.width, h / img.height);
      const sw = img.width * scale;
      const sh = img.height * scale;
      ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh);
      ctx.fillStyle = "rgba(10,11,15,0.55)";
      ctx.fillRect(0, 0, w, h);
    } else {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#0c4a6e");
      g.addColorStop(1, "#0a0b0f");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    // Logo text
    ctx.fillStyle = "#94a3b8";
    ctx.font = `${Math.round(w * 0.028)}px Inter, sans-serif`;
    ctx.fillText("Carstair", w * 0.08, h * 0.08);

    // Symbol + side
    ctx.fillStyle = "#e2e8f0";
    ctx.font = `600 ${Math.round(w * 0.045)}px Inter, sans-serif`;
    ctx.fillText(`${t.symbol}  ${t.side}`, w * 0.08, h * 0.42);

    // PnL
    ctx.fillStyle = t.pnl >= 0 ? "#22c55e" : "#f87171";
    ctx.font = `700 ${Math.round(w * 0.09)}px Inter, sans-serif`;
    ctx.fillText(`${t.pnl >= 0 ? "+" : ""}$${t.pnl.toLocaleString()}`, w * 0.08, h * 0.52);

    // R + grade
    ctx.fillStyle = "#94a3b8";
    ctx.font = `${Math.round(w * 0.032)}px Inter, sans-serif`;
    ctx.fillText(`${t.rMultiple}R  ·  ${t.grade}  ·  ${t.setup}`, w * 0.08, h * 0.58);

    // Footer
    ctx.fillStyle = "#64748b";
    ctx.font = `${Math.round(w * 0.022)}px Inter, sans-serif`;
    ctx.fillText("carstair.com", w * 0.08, h * 0.92);
  }

  useEffect(() => {
    if (tab === "share") drawCard();
  }, [tab, selected, bgUrl, format, trades]);

  function downloadCard() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawCard().then(() => {
      const a = document.createElement("a");
      a.download = `carstair-pnl-${selected?.symbol || "card"}-${format}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    });
  }

  return (
    <>
      <header className="border-b border-[#1e293b] px-4 md:px-6 py-3 flex items-center justify-between bg-[#0f1219]">
        <div>
          <h1 className="font-medium text-white text-sm md:text-base capitalize">{tab === "dashboard" ? "Dashboard" : tab}</h1>
          <p className="text-[11px] text-[#64748b]">Forex · CFD · MT5</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className={totalPnl >= 0 ? "pnl-pos font-semibold" : "pnl-neg font-semibold"}>
            {totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString()}
          </span>
          <span className="text-[#64748b] text-xs">Score {score.score}</span>
        </div>
      </header>

      <div className="p-4 md:p-6 space-y-4 animate-fade-up max-w-[1200px]">
        {/* Mobile tab strip */}
        <div className="flex gap-1 overflow-x-auto md:hidden text-xs pb-1">
          {["dashboard", "journal", "analytics", "prop", "share", "mt5"].map((t) => (
            <a
              key={t}
              href={`/app?tab=${t === "dashboard" ? "" : t}`}
              className={`px-2.5 py-1 rounded shrink-0 ${
                (tab === "dashboard" && t === "dashboard") || tab === t
                  ? "bg-[#0ea5e915] text-[#22d3ee]"
                  : "text-[#64748b] border border-[#1e293b]"
              }`}
            >
              {t}
            </a>
          ))}
        </div>

        {(tab === "dashboard" || !tab) && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="journal-card p-4">
                <p className="text-[11px] text-[#64748b]">Total P&L</p>
                <p className={`text-2xl font-semibold ${totalPnl >= 0 ? "pnl-pos" : "pnl-neg"}`}>
                  {totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString()}
                </p>
                <p className="text-xs text-[#64748b] mt-1">
                  {trades.filter((t) => t.pnl > 0).length}W / {trades.filter((t) => t.pnl <= 0).length}L
                </p>
              </div>
              <div className="journal-card p-4">
                <p className="text-[11px] text-[#64748b]">Liquid Score</p>
                <p className="text-2xl font-semibold text-white">{score.score}</p>
                <p className="text-xs text-[#64748b] mt-1">Win {score.winRate}% · PF {score.profitFactor}</p>
              </div>
              <div className="journal-card p-4">
                <p className="text-[11px] text-[#64748b]">Avg R</p>
                <p className="text-2xl font-semibold text-white">{score.avgR}</p>
                <p className="text-xs text-[#64748b] mt-1">Discipline {score.discipline}</p>
              </div>
              <div className="journal-card p-4">
                <p className="text-[11px] text-[#64748b]">Accounts</p>
                <p className="text-2xl font-semibold text-white">{accounts.length}</p>
                <p className="text-xs text-[#64748b] mt-1">{accounts.map((a) => a.name.split(" ")[0]).join(" · ")}</p>
              </div>
            </div>
            <div className="journal-card overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#1e293b] text-xs text-[#64748b]">Recent trades</div>
              <div className="divide-y divide-[#1e293b]">
                {trades.slice(0, 8).map((t) => (
                  <div key={t.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{t.symbol}</span>
                      <span className="text-[#64748b]">{t.side}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e293b] text-[#94a3b8]">{t.grade}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={t.pnl >= 0 ? "pnl-pos" : "pnl-neg"}>
                        {t.pnl >= 0 ? "+" : ""}${t.pnl}
                      </span>
                      <span className="text-[#64748b] text-xs">{t.rMultiple}R</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "journal" && (
          <div className="journal-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[#1e293b] flex justify-between items-center">
              <span className="text-xs text-[#64748b]">{trades.length} trades</span>
              <button
                type="button"
                className="text-xs text-[#0ea5e9]"
                onClick={() => persist(SAMPLE_TRADES)}
              >
                Reset sample
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#64748b] border-b border-[#1e293b]">
                    <th className="px-3 py-2 font-medium">Symbol</th>
                    <th className="px-3 py-2 font-medium">Side</th>
                    <th className="px-3 py-2 font-medium">PnL</th>
                    <th className="px-3 py-2 font-medium">R</th>
                    <th className="px-3 py-2 font-medium">Grade</th>
                    <th className="px-3 py-2 font-medium">Setup</th>
                    <th className="px-3 py-2 font-medium">Session</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-[#1e293b] hover:bg-[#12151c] cursor-pointer"
                      onClick={() => setSelected(t)}
                    >
                      <td className="px-3 py-2 text-white font-medium">{t.symbol}</td>
                      <td className="px-3 py-2 text-[#94a3b8]">{t.side}</td>
                      <td className={`px-3 py-2 ${t.pnl >= 0 ? "pnl-pos" : "pnl-neg"}`}>
                        {t.pnl >= 0 ? "+" : ""}${t.pnl}
                      </td>
                      <td className="px-3 py-2 text-[#94a3b8]">{t.rMultiple}</td>
                      <td className="px-3 py-2">{t.grade}</td>
                      <td className="px-3 py-2 text-[#94a3b8]">{t.setup}</td>
                      <td className="px-3 py-2 text-[#64748b]">{t.session}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "analytics" && (
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="journal-card p-4">
              <p className="text-xs text-[#64748b] mb-3">By session</p>
              {["Asia", "London", "New York", "Overlap"].map((s) => {
                const list = trades.filter((t) => t.session === s);
                const pnl = list.reduce((a, t) => a + t.pnl, 0);
                return (
                  <div key={s} className="flex justify-between text-sm py-1.5 border-b border-[#1e293b]">
                    <span>{s}</span>
                    <span className={pnl >= 0 ? "pnl-pos" : "pnl-neg"}>
                      {pnl >= 0 ? "+" : ""}${pnl} · {list.length} trades
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="journal-card p-4">
              <p className="text-xs text-[#64748b] mb-3">Liquid Score breakdown</p>
              {[
                ["Win rate", `${score.winRate}%`],
                ["Profit factor", String(score.profitFactor)],
                ["Avg R", String(score.avgR)],
                ["Consistency", String(score.consistency)],
                ["Discipline", String(score.discipline)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm py-1.5 border-b border-[#1e293b]">
                  <span className="text-[#94a3b8]">{k}</span>
                  <span className="text-white">{v}</span>
                </div>
              ))}
            </div>
            <div className="journal-card p-4 sm:col-span-2">
              <p className="text-xs text-[#64748b] mb-3">By symbol</p>
              {Array.from(new Set(trades.map((t) => t.symbol))).map((sym) => {
                const list = trades.filter((t) => t.symbol === sym);
                const pnl = list.reduce((a, t) => a + t.pnl, 0);
                return (
                  <div key={sym} className="flex justify-between text-sm py-1.5 border-b border-[#1e293b]">
                    <span className="text-white">{sym}</span>
                    <span className={pnl >= 0 ? "pnl-pos" : "pnl-neg"}>
                      {pnl >= 0 ? "+" : ""}${pnl} · {list.length}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "prop" && (
          <div className="space-y-3">
            <div className="journal-card p-4">
              <p className="text-xs text-[#64748b] mb-3">Your accounts</p>
              {accounts.map((a) => (
                <div key={a.id} className="flex justify-between items-center py-2 border-b border-[#1e293b] text-sm">
                  <div>
                    <p className="text-white font-medium">{a.name}</p>
                    <p className="text-[11px] text-[#64748b]">
                      {a.type} {a.firm ? `· ${a.firm}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white">${a.equity.toLocaleString()}</p>
                    <p className="text-[11px] text-[#64748b]">bal ${a.balance.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="journal-card p-4">
              <p className="text-xs text-[#64748b] mb-3">Prop / CFD firms tracked</p>
              {PROP_FIRMS.map((f) => (
                <div key={f.name} className="py-2 border-b border-[#1e293b] text-sm">
                  <div className="flex justify-between">
                    <span className="text-white font-medium">{f.name}</span>
                    <span className="text-[#64748b] text-xs">{f.type}</span>
                  </div>
                  <p className="text-[12px] text-[#94a3b8]">{f.plans.join(" · ")}</p>
                  <p className="text-[11px] text-[#64748b]">{f.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "share" && (
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="journal-card p-4 space-y-3">
                <p className="text-xs text-[#64748b]">Select trade</p>
                <select
                  className="w-full bg-[#0a0b0f] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white"
                  value={selected?.id || trades[0]?.id || ""}
                  onChange={(e) => setSelected(trades.find((t) => t.id === e.target.value) || null)}
                >
                  {trades.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.symbol} {t.side} {t.pnl >= 0 ? "+" : ""}${t.pnl}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-[#64748b]">Background (photo / image)</p>
                <input ref={fileRef} type="file" accept="image/*,video/*,audio/*" onChange={onBg} className="text-xs text-[#94a3b8]" />
                <p className="text-[11px] text-[#64748b]">
                  Video/audio attach for future video export; image used for PNG card now.
                </p>
                <div className="flex gap-2">
                  {(["story", "square", "landscape"] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFormat(f)}
                      className={`px-3 py-1.5 rounded text-xs ${
                        format === f ? "bg-[#0ea5e9] text-[#0a0b0f]" : "border border-[#334155] text-[#94a3b8]"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={downloadCard}
                  className="w-full bg-[#0ea5e9] text-[#0a0b0f] py-2.5 rounded-lg text-sm font-medium"
                >
                  Download PNG
                </button>
              </div>
            </div>
            <div className="journal-card p-4 flex justify-center">
              <canvas
                ref={canvasRef}
                className="max-w-full rounded-lg border border-[#1e293b]"
                style={{ maxHeight: 480 }}
              />
            </div>
          </div>
        )}

        {tab === "mt5" && (
          <div className="journal-card p-6 space-y-4 max-w-lg">
            <h2 className="text-white font-medium">MetaTrader 5</h2>
            <p className="text-sm text-[#94a3b8]">
              Import deals from an MT5 report or CSV export. Columns recognised: Symbol, Type/Direction, Volume, Profit/PnL, Time.
            </p>
            <input ref={csvRef} type="file" accept=".csv,.txt,.tsv" onChange={onCsv} className="text-sm text-[#94a3b8]" />
            <div className="border border-[#1e293b] rounded-lg p-4 space-y-2">
              <p className="text-xs text-[#64748b]">Live connection (next step)</p>
              <input
                placeholder="Broker / server name"
                className="w-full bg-[#0a0b0f] border border-[#334155] rounded px-3 py-2 text-sm text-white"
              />
              <input
                placeholder="Login / account number"
                className="w-full bg-[#0a0b0f] border border-[#334155] rounded px-3 py-2 text-sm text-white"
              />
              <input
                type="password"
                placeholder="Investor password (read-only)"
                className="w-full bg-[#0a0b0f] border border-[#334155] rounded px-3 py-2 text-sm text-white"
              />
              <button
                type="button"
                className="w-full border border-[#334155] text-[#94a3b8] py-2 rounded text-sm"
                onClick={() => alert("Live MT5 bridge requires a server-side connector and your broker API. CSV import is ready now.")}
              >
                Connect (stub — use CSV today)
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-[#64748b]">Loading…</div>}>
      <JournalApp />
    </Suspense>
  );
}
