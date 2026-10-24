"use client";

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
} from "@/lib/journal";

function JournalApp() {
  const params = useSearchParams();
  const tab = params.get("tab") || "dashboard";
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selected, setSelected] = useState<Trade | null>(null);
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<"story" | "square" | "landscape">("story");
  const [form, setForm] = useState({
    symbol: "EURUSD",
    side: "Long" as "Long" | "Short",
    pnl: "",
    rMultiple: "",
    grade: "A" as Trade["grade"],
    setup: "",
    session: "London" as Trade["session"],
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  function addTrade(e: React.FormEvent) {
    e.preventDefault();
    const pnl = parseFloat(form.pnl) || 0;
    const r = parseFloat(form.rMultiple) || 0;
    const t: Trade = {
      id: `t-${Date.now()}`,
      symbol: form.symbol.toUpperCase() || "EURUSD",
      side: form.side,
      entry: 0,
      exit: 0,
      size: 1,
      pnl,
      rMultiple: r,
      grade: form.grade,
      setup: form.setup || "Manual",
      session: form.session,
      emotions: [],
      openedAt: new Date().toISOString(),
      closedAt: new Date().toISOString(),
      accountId: "a1",
    };
    persist([t, ...trades]);
    setForm({ ...form, pnl: "", rMultiple: "", setup: "" });
  }

  function deleteTrade(id: string) {
    persist(trades.filter((t) => t.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  function onCsv(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imported = parseMt5Csv(String(reader.result || ""));
      if (imported.length === 0) {
        alert("No trades parsed. Need columns: Symbol, Type, Volume, Profit.");
        return;
      }
      persist([...imported, ...trades]);
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

    if (bgUrl && bgFile?.type.startsWith("image/")) {
      const img = new window.Image();
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej();
        img.src = bgUrl;
      });
      const scale = Math.max(w / img.width, h / img.height);
      const sw = img.width * scale;
      const sh = img.height * scale;
      ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh);
      ctx.fillStyle = "rgba(5,6,8,0.6)";
      ctx.fillRect(0, 0, w, h);
    } else {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#0a1f12");
      g.addColorStop(1, "#050608");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.fillStyle = "#94a3b8";
    ctx.font = `${Math.round(w * 0.028)}px Inter, sans-serif`;
    ctx.fillText("Carstair", w * 0.08, h * 0.08);

    ctx.fillStyle = "#f1f5f9";
    ctx.font = `600 ${Math.round(w * 0.045)}px Inter, sans-serif`;
    ctx.fillText(`${t.symbol}  ${t.side}`, w * 0.08, h * 0.42);

    ctx.fillStyle = t.pnl >= 0 ? "#22c55e" : "#ef4444";
    ctx.font = `700 ${Math.round(w * 0.09)}px Inter, sans-serif`;
    ctx.fillText(`${t.pnl >= 0 ? "+" : ""}$${t.pnl.toLocaleString()}`, w * 0.08, h * 0.52);

    ctx.fillStyle = "#94a3b8";
    ctx.font = `${Math.round(w * 0.032)}px Inter, sans-serif`;
    ctx.fillText(`${t.rMultiple}R  ·  ${t.grade}  ·  ${t.setup}`, w * 0.08, h * 0.58);

    ctx.fillStyle = "#64748b";
    ctx.font = `${Math.round(w * 0.022)}px Inter, sans-serif`;
    ctx.fillText("carstair.com", w * 0.08, h * 0.92);
  }

  useEffect(() => {
    if (tab === "share") void drawCard();
  }, [tab, selected, bgUrl, format, trades]);

  function downloadCard() {
    void drawCard().then(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const a = document.createElement("a");
      a.download = `carstair-pnl-${selected?.symbol || trades[0]?.symbol || "card"}-${format}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    });
  }

  const greenActive = "bg-[rgba(34,197,94,0.12)] text-[#22c55e]";

  return (
    <>
      <header className="border-b border-[#1a1f2a] px-4 md:px-6 py-3 flex items-center justify-between bg-[#0c0e12]">
        <div>
          <h1 className="font-medium text-white text-sm capitalize">{tab === "dashboard" ? "Dashboard" : tab}</h1>
          <p className="text-[11px] text-[#64748b]">CFD · Forex · MT5</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className={totalPnl >= 0 ? "text-[#22c55e] font-semibold" : "text-[#ef4444] font-semibold"}>
            {totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString()}
          </span>
          <span className="text-[#64748b] text-xs">Score {score.score}</span>
        </div>
      </header>

      <div className="p-4 md:p-6 space-y-4 max-w-[1200px]">
        <div className="flex gap-1 overflow-x-auto md:hidden text-xs pb-1">
          {["dashboard", "journal", "analytics", "prop", "share", "mt5"].map((t) => (
            <a
              key={t}
              href={`/app?tab=${t === "dashboard" ? "" : t}`}
              className={`px-2.5 py-1 rounded shrink-0 ${
                (tab === "dashboard" && t === "dashboard") || tab === t ? greenActive : "text-[#64748b] border border-[#1a1f2a]"
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
                <p className={`text-2xl font-semibold ${totalPnl >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
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
              <div className="px-4 py-2.5 border-b border-[#1a1f2a] text-xs text-[#64748b]">Recent trades</div>
              <div className="divide-y divide-[#1a1f2a]">
                {trades.slice(0, 10).map((t) => (
                  <div key={t.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{t.symbol}</span>
                      <span className="text-[#64748b]">{t.side}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1a1f2a] text-[#94a3b8]">{t.grade}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={t.pnl >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}>
                        {t.pnl >= 0 ? "+" : ""}${t.pnl}
                      </span>
                      <span className="text-[#64748b] text-xs">{t.rMultiple}R</span>
                    </div>
                  </div>
                ))}
                {trades.length === 0 && (
                  <p className="px-4 py-6 text-sm text-[#64748b]">No trades yet. Add one in Journal or import MT5 CSV.</p>
                )}
              </div>
            </div>
          </>
        )}

        {tab === "journal" && (
          <div className="space-y-3">
            <form onSubmit={addTrade} className="journal-card p-4 grid sm:grid-cols-3 md:grid-cols-6 gap-2 items-end">
              <div>
                <label className="text-[10px] text-[#64748b]">Symbol</label>
                <input
                  className="w-full bg-[#050608] border border-[#2a3140] rounded px-2 py-1.5 text-sm text-white"
                  value={form.symbol}
                  onChange={(e) => setForm({ ...form, symbol: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] text-[#64748b]">Side</label>
                <select
                  className="w-full bg-[#050608] border border-[#2a3140] rounded px-2 py-1.5 text-sm text-white"
                  value={form.side}
                  onChange={(e) => setForm({ ...form, side: e.target.value as "Long" | "Short" })}
                >
                  <option>Long</option>
                  <option>Short</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-[#64748b]">PnL $</label>
                <input
                  type="number"
                  step="any"
                  className="w-full bg-[#050608] border border-[#2a3140] rounded px-2 py-1.5 text-sm text-white"
                  value={form.pnl}
                  onChange={(e) => setForm({ ...form, pnl: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-[#64748b]">R</label>
                <input
                  type="number"
                  step="any"
                  className="w-full bg-[#050608] border border-[#2a3140] rounded px-2 py-1.5 text-sm text-white"
                  value={form.rMultiple}
                  onChange={(e) => setForm({ ...form, rMultiple: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] text-[#64748b]">Grade</label>
                <select
                  className="w-full bg-[#050608] border border-[#2a3140] rounded px-2 py-1.5 text-sm text-white"
                  value={form.grade}
                  onChange={(e) => setForm({ ...form, grade: e.target.value as Trade["grade"] })}
                >
                  {(["A+", "A", "B", "C", "D"] as const).map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-green py-1.5 rounded text-sm">
                Add trade
              </button>
              <div className="sm:col-span-2">
                <label className="text-[10px] text-[#64748b]">Setup</label>
                <input
                  className="w-full bg-[#050608] border border-[#2a3140] rounded px-2 py-1.5 text-sm text-white"
                  value={form.setup}
                  onChange={(e) => setForm({ ...form, setup: e.target.value })}
                  placeholder="e.g. London open break"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#64748b]">Session</label>
                <select
                  className="w-full bg-[#050608] border border-[#2a3140] rounded px-2 py-1.5 text-sm text-white"
                  value={form.session}
                  onChange={(e) => setForm({ ...form, session: e.target.value as Trade["session"] })}
                >
                  {(["Asia", "London", "New York", "Overlap"] as const).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </form>

            <div className="journal-card overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#1a1f2a] text-xs text-[#64748b]">{trades.length} trades</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[#64748b] border-b border-[#1a1f2a]">
                      <th className="px-3 py-2 font-medium">Symbol</th>
                      <th className="px-3 py-2 font-medium">Side</th>
                      <th className="px-3 py-2 font-medium">PnL</th>
                      <th className="px-3 py-2 font-medium">R</th>
                      <th className="px-3 py-2 font-medium">Grade</th>
                      <th className="px-3 py-2 font-medium">Setup</th>
                      <th className="px-3 py-2 font-medium">Session</th>
                      <th className="px-3 py-2 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((t) => (
                      <tr key={t.id} className="border-b border-[#1a1f2a] hover:bg-[#12151c]">
                        <td className="px-3 py-2 text-white font-medium">{t.symbol}</td>
                        <td className="px-3 py-2 text-[#94a3b8]">{t.side}</td>
                        <td className={`px-3 py-2 ${t.pnl >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                          {t.pnl >= 0 ? "+" : ""}${t.pnl}
                        </td>
                        <td className="px-3 py-2 text-[#94a3b8]">{t.rMultiple}</td>
                        <td className="px-3 py-2">{t.grade}</td>
                        <td className="px-3 py-2 text-[#94a3b8]">{t.setup}</td>
                        <td className="px-3 py-2 text-[#64748b]">{t.session}</td>
                        <td className="px-3 py-2">
                          <button type="button" className="text-[11px] text-[#ef4444]" onClick={() => deleteTrade(t.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                  <div key={s} className="flex justify-between text-sm py-1.5 border-b border-[#1a1f2a]">
                    <span>{s}</span>
                    <span className={pnl >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}>
                      {pnl >= 0 ? "+" : ""}${pnl} · {list.length}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="journal-card p-4">
              <p className="text-xs text-[#64748b] mb-3">Liquid Score</p>
              {[
                ["Win rate", `${score.winRate}%`],
                ["Profit factor", String(score.profitFactor)],
                ["Avg R", String(score.avgR)],
                ["Consistency", String(score.consistency)],
                ["Discipline", String(score.discipline)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm py-1.5 border-b border-[#1a1f2a]">
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
                  <div key={sym} className="flex justify-between text-sm py-1.5 border-b border-[#1a1f2a]">
                    <span className="text-white">{sym}</span>
                    <span className={pnl >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}>
                      {pnl >= 0 ? "+" : ""}${pnl} · {list.length}
                    </span>
                  </div>
                );
              })}
              {trades.length === 0 && <p className="text-sm text-[#64748b]">Add trades to see analytics.</p>}
            </div>
          </div>
        )}

        {tab === "prop" && (
          <div className="space-y-3">
            <div className="journal-card p-4">
              <p className="text-xs text-[#64748b] mb-3">Accounts</p>
              {accounts.map((a) => (
                <div key={a.id} className="flex justify-between items-center py-2 border-b border-[#1a1f2a] text-sm">
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
              <p className="text-xs text-[#64748b] mb-3">Prop / CFD firms</p>
              {PROP_FIRMS.map((f) => (
                <div key={f.name} className="py-2 border-b border-[#1a1f2a] text-sm">
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
            <div className="journal-card p-4 space-y-3">
              <p className="text-xs text-[#64748b]">Trade</p>
              <select
                className="w-full bg-[#050608] border border-[#2a3140] rounded-lg px-3 py-2 text-sm text-white"
                value={selected?.id || trades[0]?.id || ""}
                onChange={(e) => setSelected(trades.find((t) => t.id === e.target.value) || null)}
              >
                {trades.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.symbol} {t.side} {t.pnl >= 0 ? "+" : ""}${t.pnl}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#64748b]">Background image</p>
              <input type="file" accept="image/*" onChange={onBg} className="text-xs text-[#94a3b8]" />
              <div className="flex gap-2">
                {(["story", "square", "landscape"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormat(f)}
                    className={`px-3 py-1.5 rounded text-xs ${
                      format === f ? "btn-green" : "border border-[#2a3140] text-[#94a3b8]"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button type="button" onClick={downloadCard} className="w-full btn-green py-2.5 rounded-lg text-sm" disabled={trades.length === 0}>
                Download PNG
              </button>
            </div>
            <div className="journal-card p-4 flex justify-center">
              <canvas ref={canvasRef} className="max-w-full rounded-lg border border-[#1a1f2a]" style={{ maxHeight: 480 }} />
            </div>
          </div>
        )}

        {tab === "mt5" && (
          <div className="journal-card p-6 space-y-4 max-w-lg">
            <h2 className="text-white font-medium">MetaTrader 5 import</h2>
            <p className="text-sm text-[#94a3b8]">
              Upload an MT5 report or CSV. Columns: Symbol, Type/Direction, Volume, Profit/PnL.
            </p>
            <input type="file" accept=".csv,.txt,.tsv" onChange={onCsv} className="text-sm text-[#94a3b8]" />
            <p className="text-xs text-[#64748b]">Imported trades save to your journal immediately and update Liquid Score.</p>
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
