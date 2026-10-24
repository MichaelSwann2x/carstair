"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from "react";
import {
  Trade,
  Account,
  loadTrades,
  saveTrades,
  loadAccounts,
  saveAccounts,
  computeLiquidScore,
  parseMt5Csv,
  lastNDays,
  monthGrid,
  equitySeries,
  PROP_FIRMS,
  EMOTION_OPTS,
} from "@/lib/journal";

function Terminal() {
  const params = useSearchParams();
  const tab = params.get("tab") || "dashboard";
  const [trades, setTrades] = useState<Trade[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selected, setSelected] = useState<Trade | null>(null);
  const [sessionFilter, setSessionFilter] = useState<string>("All");
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"story" | "square" | "landscape">("story");
  const [tvSymbol, setTvSymbol] = useState("FX:EURUSD");
  const now = new Date();
  const [calY, setCalY] = useState(now.getFullYear());
  const [calM, setCalM] = useState(now.getMonth());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [form, setForm] = useState({
    symbol: "EURUSD",
    side: "Long" as "Long" | "Short",
    entry: "",
    exit: "",
    size: "1",
    pnl: "",
    rMultiple: "",
    grade: "A" as Trade["grade"],
    setup: "",
    session: "London" as Trade["session"],
    notes: "",
    emotions: [] as string[],
  });

  useEffect(() => {
    setTrades(loadTrades());
    setAccounts(loadAccounts());
  }, []);

  const persist = useCallback((next: Trade[]) => {
    setTrades(next);
    saveTrades(next);
  }, []);

  const persistAcc = useCallback((next: Account[]) => {
    setAccounts(next);
    saveAccounts(next);
  }, []);

  const filtered = useMemo(
    () => (sessionFilter === "All" ? trades : trades.filter((t) => t.session === sessionFilter)),
    [trades, sessionFilter]
  );
  const score = useMemo(() => computeLiquidScore(filtered), [filtered]);
  const totalPnl = useMemo(() => filtered.reduce((s, t) => s + t.pnl, 0), [filtered]);
  const week = useMemo(() => lastNDays(trades, 7), [trades]);
  const grid = useMemo(() => monthGrid(trades, calY, calM), [trades, calY, calM]);
  const equity = useMemo(() => equitySeries(trades), [trades]);

  function addTrade(e: React.FormEvent) {
    e.preventDefault();
    const pnl = parseFloat(form.pnl) || 0;
    const r = parseFloat(form.rMultiple) || 0;
    const t: Trade = {
      id: `t-${Date.now()}`,
      symbol: form.symbol.toUpperCase() || "EURUSD",
      side: form.side,
      entry: parseFloat(form.entry) || 0,
      exit: parseFloat(form.exit) || 0,
      size: parseFloat(form.size) || 1,
      pnl,
      rMultiple: r,
      grade: form.grade,
      setup: form.setup || "Manual",
      session: form.session,
      emotions: form.emotions,
      notes: form.notes,
      openedAt: new Date().toISOString(),
      closedAt: new Date().toISOString(),
      accountId: accounts[0]?.id || "a1",
    };
    persist([t, ...trades]);
    setForm({ ...form, pnl: "", rMultiple: "", setup: "", notes: "", entry: "", exit: "" });
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
      if (!imported.length) {
        alert("No trades parsed. Need Symbol, Type, Volume, Profit columns.");
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
    const h = format === "story" ? 1920 : 1080;
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
      ctx.drawImage(img, (w - img.width * scale) / 2, (h - img.height * scale) / 2, img.width * scale, img.height * scale);
      ctx.fillStyle = "rgba(5,6,8,0.55)";
      ctx.fillRect(0, 0, w, h);
    } else {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#0a1f12");
      g.addColorStop(1, "#050608");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.fillStyle = "#94a3b8";
    ctx.font = `${Math.round(w * 0.028)}px Inter,sans-serif`;
    ctx.fillText("Carstair", w * 0.08, h * 0.08);
    ctx.fillStyle = "#f1f5f9";
    ctx.font = `600 ${Math.round(w * 0.045)}px Inter,sans-serif`;
    ctx.fillText(`${t.symbol}  ${t.side}`, w * 0.08, h * 0.42);
    ctx.fillStyle = t.pnl >= 0 ? "#22c55e" : "#ef4444";
    ctx.font = `700 ${Math.round(w * 0.09)}px Inter,sans-serif`;
    ctx.fillText(`${t.pnl >= 0 ? "+" : ""}$${t.pnl.toLocaleString()}`, w * 0.08, h * 0.52);
    ctx.fillStyle = "#94a3b8";
    ctx.font = `${Math.round(w * 0.032)}px Inter,sans-serif`;
    ctx.fillText(`${t.rMultiple}R · ${t.grade} · ${t.setup}`, w * 0.08, h * 0.58);
    ctx.fillStyle = "#64748b";
    ctx.font = `${Math.round(w * 0.022)}px Inter,sans-serif`;
    ctx.fillText("carstair.com", w * 0.08, h * 0.92);
  }

  useEffect(() => {
    if (tab === "share") void drawCard();
  }, [tab, selected, bgUrl, format, trades]);

  function downloadCard() {
    void drawCard().then(() => {
      const c = canvasRef.current;
      if (!c) return;
      const a = document.createElement("a");
      a.download = `carstair-${selected?.symbol || "pnl"}-${format}.png`;
      a.href = c.toDataURL("image/png");
      a.click();
    });
  }

  function toggleEmotion(em: string) {
    setForm((f) => ({
      ...f,
      emotions: f.emotions.includes(em) ? f.emotions.filter((x) => x !== em) : [...f.emotions, em],
    }));
  }

  // Equity SVG path
  const eqPath = useMemo(() => {
    if (equity.length < 2) return "";
    const min = Math.min(...equity.map((p) => p.v), 0);
    const max = Math.max(...equity.map((p) => p.v), 1);
    const w = 400;
    const h = 80;
    return equity
      .map((p, i) => {
        const x = (i / (equity.length - 1)) * w;
        const y = h - ((p.v - min) / (max - min || 1)) * h;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [equity]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] min-h-full">
      <div className="p-3 md:p-4 space-y-3 border-r border-[#1a1f2a]">
        {/* Mobile tabs */}
        <div className="flex gap-1 overflow-x-auto sm:hidden text-[11px]">
          {["dashboard", "journal", "analytics", "prop", "share", "mt5"].map((t) => (
            <a
              key={t}
              href={t === "dashboard" ? "/app" : `/app?tab=${t}`}
              className={`px-2 py-1 rounded shrink-0 ${
                (tab === "dashboard" && t === "dashboard") || tab === t
                  ? "bg-[rgba(34,197,94,0.12)] text-[#22c55e]"
                  : "border border-[#1a1f2a] text-[#64748b]"
              }`}
            >
              {t}
            </a>
          ))}
        </div>

        {/* DASHBOARD */}
        {(tab === "dashboard" || tab === "") && (
          <>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {["All", "Asia", "London", "New York", "Overlap"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSessionFilter(s)}
                  className={`px-2 py-1 rounded ${
                    sessionFilter === s ? "bg-[rgba(34,197,94,0.15)] text-[#22c55e]" : "text-[#64748b] border border-[#1a1f2a]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="journal-card p-3">
                <p className="text-[10px] text-[#64748b]">Total P&L</p>
                <p className={`text-xl font-semibold ${totalPnl >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                  {totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString()}
                </p>
                <p className="text-[10px] text-[#64748b]">
                  {filtered.filter((t) => t.pnl > 0).length}W / {filtered.filter((t) => t.pnl <= 0).length}L
                </p>
              </div>
              <div className="journal-card p-3">
                <p className="text-[10px] text-[#64748b]">Liquid Score</p>
                <p className="text-xl font-semibold text-white">{score.score}</p>
                <p className="text-[10px] text-[#64748b]">Win {score.winRate}% · PF {score.profitFactor}</p>
              </div>
              <div className="journal-card p-3">
                <p className="text-[10px] text-[#64748b]">Avg R</p>
                <p className="text-xl font-semibold text-white">{score.avgR}</p>
                <p className="text-[10px] text-[#64748b]">Discipline {score.discipline}</p>
              </div>
              <div className="journal-card p-3">
                <p className="text-[10px] text-[#64748b]">Trades</p>
                <p className="text-xl font-semibold text-white">{filtered.length}</p>
                <p className="text-[10px] text-[#64748b]">Consistency {score.consistency}</p>
              </div>
            </div>
            <div className="journal-card p-3">
              <p className="text-[10px] text-[#64748b] mb-2">Last 7 days</p>
              <div className="flex items-end gap-1 h-16">
                {week.map((d) => {
                  const max = Math.max(...week.map((x) => Math.abs(x.pnl)), 1);
                  const h = Math.max(4, (Math.abs(d.pnl) / max) * 56);
                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5" title={`${d.date}: $${d.pnl}`}>
                      <div
                        className={`w-full rounded-sm ${d.pnl >= 0 ? "bg-[#22c55e]" : "bg-[#ef4444]"}`}
                        style={{ height: h }}
                      />
                      <span className="text-[9px] text-[#64748b]">{d.date.slice(8)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="journal-card overflow-hidden">
              <div className="px-3 py-2 border-b border-[#1a1f2a] text-[10px] text-[#64748b]">Recent</div>
              {filtered.slice(0, 12).map((t) => (
                <div key={t.id} className="flex justify-between px-3 py-2 text-[12px] border-b border-[#1a1f2a]">
                  <span>
                    <span className="text-white font-medium">{t.symbol}</span>{" "}
                    <span className="text-[#64748b]">{t.side}</span>{" "}
                    <span className="text-[10px] text-[#94a3b8]">{t.grade}</span>
                  </span>
                  <span className={t.pnl >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}>
                    {t.pnl >= 0 ? "+" : ""}${t.pnl}
                  </span>
                </div>
              ))}
              {!filtered.length && <p className="px-3 py-6 text-[12px] text-[#64748b]">No trades. Open Journal or MT5.</p>}
            </div>
          </>
        )}

        {/* JOURNAL */}
        {tab === "journal" && (
          <div className="space-y-3">
            <form onSubmit={addTrade} className="journal-card p-3 space-y-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <input className="bg-[#050608] border border-[#2a3140] rounded px-2 py-1.5 text-[12px] text-white" placeholder="Symbol" value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} />
                <select className="bg-[#050608] border border-[#2a3140] rounded px-2 py-1.5 text-[12px] text-white" value={form.side} onChange={(e) => setForm({ ...form, side: e.target.value as "Long" | "Short" })}>
                  <option>Long</option>
                  <option>Short</option>
                </select>
                <input className="bg-[#050608] border border-[#2a3140] rounded px-2 py-1.5 text-[12px] text-white" placeholder="Entry" value={form.entry} onChange={(e) => setForm({ ...form, entry: e.target.value })} />
                <input className="bg-[#050608] border border-[#2a3140] rounded px-2 py-1.5 text-[12px] text-white" placeholder="Exit" value={form.exit} onChange={(e) => setForm({ ...form, exit: e.target.value })} />
                <input className="bg-[#050608] border border-[#2a3140] rounded px-2 py-1.5 text-[12px] text-white" placeholder="Lots" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
                <input required type="number" step="any" className="bg-[#050608] border border-[#2a3140] rounded px-2 py-1.5 text-[12px] text-white" placeholder="PnL $" value={form.pnl} onChange={(e) => setForm({ ...form, pnl: e.target.value })} />
                <input type="number" step="any" className="bg-[#050608] border border-[#2a3140] rounded px-2 py-1.5 text-[12px] text-white" placeholder="R" value={form.rMultiple} onChange={(e) => setForm({ ...form, rMultiple: e.target.value })} />
                <select className="bg-[#050608] border border-[#2a3140] rounded px-2 py-1.5 text-[12px] text-white" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value as Trade["grade"] })}>
                  {(["A+", "A", "B", "C", "D"] as const).map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
                <input className="bg-[#050608] border border-[#2a3140] rounded px-2 py-1.5 text-[12px] text-white md:col-span-2" placeholder="Setup" value={form.setup} onChange={(e) => setForm({ ...form, setup: e.target.value })} />
                <select className="bg-[#050608] border border-[#2a3140] rounded px-2 py-1.5 text-[12px] text-white" value={form.session} onChange={(e) => setForm({ ...form, session: e.target.value as Trade["session"] })}>
                  {(["Asia", "London", "New York", "Overlap"] as const).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <button type="submit" className="btn-green rounded text-[12px] py-1.5">
                  Add trade
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {EMOTION_OPTS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => toggleEmotion(em)}
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      form.emotions.includes(em) ? "bg-[rgba(34,197,94,0.2)] text-[#22c55e]" : "text-[#64748b] border border-[#1a1f2a]"
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
              <input className="w-full bg-[#050608] border border-[#2a3140] rounded px-2 py-1.5 text-[12px] text-white" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </form>
            <div className="journal-card overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="text-[#64748b] border-b border-[#1a1f2a] text-left">
                    <th className="px-2 py-2">Symbol</th>
                    <th className="px-2 py-2">Side</th>
                    <th className="px-2 py-2">PnL</th>
                    <th className="px-2 py-2">R</th>
                    <th className="px-2 py-2">Grade</th>
                    <th className="px-2 py-2">Setup</th>
                    <th className="px-2 py-2">Session</th>
                    <th className="px-2 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t) => (
                    <tr key={t.id} className="border-b border-[#1a1f2a] hover:bg-[#0c0e12] cursor-pointer" onClick={() => setSelected(t)}>
                      <td className="px-2 py-2 text-white font-medium">{t.symbol}</td>
                      <td className="px-2 py-2 text-[#94a3b8]">{t.side}</td>
                      <td className={`px-2 py-2 ${t.pnl >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>{t.pnl >= 0 ? "+" : ""}${t.pnl}</td>
                      <td className="px-2 py-2 text-[#94a3b8]">{t.rMultiple}</td>
                      <td className="px-2 py-2">{t.grade}</td>
                      <td className="px-2 py-2 text-[#94a3b8]">{t.setup}</td>
                      <td className="px-2 py-2 text-[#64748b]">{t.session}</td>
                      <td className="px-2 py-2">
                        <button type="button" className="text-[#ef4444] text-[11px]" onClick={(e) => { e.stopPropagation(); deleteTrade(t.id); }}>
                          Del
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!trades.length && <p className="p-4 text-[12px] text-[#64748b]">Empty. Add a trade or import CSV.</p>}
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {tab === "analytics" && (
          <div className="space-y-3">
            <div className="journal-card p-3">
              <p className="text-[10px] text-[#64748b] mb-2">Equity</p>
              {equity.length > 1 ? (
                <svg viewBox="0 0 400 80" className="w-full h-20">
                  <path d={eqPath} fill="none" stroke="#22c55e" strokeWidth="2" />
                </svg>
              ) : (
                <p className="text-[12px] text-[#64748b]">Need 2+ trades</p>
              )}
            </div>
            <div className="journal-card p-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] text-[#64748b]">P&L calendar</p>
                <div className="flex gap-1 text-[11px]">
                  <button type="button" className="text-[#94a3b8]" onClick={() => { if (calM === 0) { setCalM(11); setCalY(calY - 1); } else setCalM(calM - 1); }}>‹</button>
                  <span className="text-white">{calY}-{String(calM + 1).padStart(2, "0")}</span>
                  <button type="button" className="text-[#94a3b8]" onClick={() => { if (calM === 11) { setCalM(0); setCalY(calY + 1); } else setCalM(calM + 1); }}>›</button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-0.5 text-[10px] text-center text-[#64748b] mb-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {grid.map((c, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded flex flex-col items-center justify-center text-[10px] ${
                      !c.day
                        ? ""
                        : c.count === 0
                          ? "bg-[#0c0e12] text-[#475569]"
                          : c.pnl >= 0
                            ? "bg-[rgba(34,197,94,0.25)] text-[#22c55e]"
                            : "bg-[rgba(239,68,68,0.25)] text-[#ef4444]"
                    }`}
                    title={c.date ? `${c.date}: $${c.pnl}` : ""}
                  >
                    {c.day}
                    {c.count > 0 && <span className="text-[8px]">{c.pnl >= 0 ? "+" : ""}{Math.round(c.pnl)}</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              <div className="journal-card p-3">
                <p className="text-[10px] text-[#64748b] mb-2">By session</p>
                {["Asia", "London", "New York", "Overlap"].map((s) => {
                  const list = trades.filter((t) => t.session === s);
                  const pnl = list.reduce((a, t) => a + t.pnl, 0);
                  return (
                    <div key={s} className="flex justify-between text-[12px] py-1 border-b border-[#1a1f2a]">
                      <span>{s}</span>
                      <span className={pnl >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}>
                        {pnl >= 0 ? "+" : ""}${pnl} · {list.length}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="journal-card p-3">
                <p className="text-[10px] text-[#64748b] mb-2">By setup</p>
                {Array.from(new Set(trades.map((t) => t.setup))).map((s) => {
                  const list = trades.filter((t) => t.setup === s);
                  const pnl = list.reduce((a, t) => a + t.pnl, 0);
                  return (
                    <div key={s} className="flex justify-between text-[12px] py-1 border-b border-[#1a1f2a]">
                      <span className="truncate max-w-[50%]">{s}</span>
                      <span className={pnl >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}>
                        {pnl >= 0 ? "+" : ""}${pnl}
                      </span>
                    </div>
                  );
                })}
                {!trades.length && <p className="text-[12px] text-[#64748b]">No data</p>}
              </div>
            </div>
          </div>
        )}

        {/* PROP */}
        {tab === "prop" && (
          <div className="space-y-3">
            <div className="journal-card p-3">
              <p className="text-[10px] text-[#64748b] mb-2">Accounts</p>
              {accounts.map((a) => (
                <div key={a.id} className="flex justify-between py-2 border-b border-[#1a1f2a] text-[12px]">
                  <div>
                    <p className="text-white font-medium">{a.name}</p>
                    <p className="text-[10px] text-[#64748b]">
                      {a.type} {a.firm ? `· ${a.firm}` : ""} · {a.stage || "—"}
                    </p>
                  </div>
                  <p className="text-white">${a.equity.toLocaleString()}</p>
                </div>
              ))}
              <button
                type="button"
                className="mt-2 text-[11px] text-[#22c55e]"
                onClick={() => {
                  const name = prompt("Account name");
                  if (!name) return;
                  persistAcc([
                    ...accounts,
                    {
                      id: `a-${Date.now()}`,
                      name,
                      broker: "Manual",
                      type: "prop",
                      balance: 0,
                      equity: 0,
                      stage: "eval",
                    },
                  ]);
                }}
              >
                + Add account
              </button>
            </div>
            <div className="journal-card p-3">
              <p className="text-[10px] text-[#64748b] mb-2">Firms</p>
              {PROP_FIRMS.map((f) => (
                <div key={f.name} className="py-2 border-b border-[#1a1f2a] text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-white">{f.name}</span>
                    <span className="text-[#64748b] text-[10px]">{f.type}</span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8]">{f.plans.join(" · ")}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SHARE */}
        {tab === "share" && (
          <div className="grid md:grid-cols-2 gap-3">
            <div className="journal-card p-3 space-y-2">
              <select
                className="w-full bg-[#050608] border border-[#2a3140] rounded px-2 py-1.5 text-[12px] text-white"
                value={selected?.id || trades[0]?.id || ""}
                onChange={(e) => setSelected(trades.find((t) => t.id === e.target.value) || null)}
              >
                {trades.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.symbol} {t.side} {t.pnl >= 0 ? "+" : ""}${t.pnl}
                  </option>
                ))}
              </select>
              <input type="file" accept="image/*" onChange={onBg} className="text-[11px] text-[#94a3b8]" />
              <div className="flex gap-1">
                {(["story", "square", "landscape"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormat(f)}
                    className={`px-2 py-1 rounded text-[11px] ${format === f ? "btn-green" : "border border-[#2a3140] text-[#94a3b8]"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button type="button" disabled={!trades.length} onClick={downloadCard} className="w-full btn-green py-2 rounded text-[12px] disabled:opacity-40">
                Download PNG
              </button>
            </div>
            <div className="journal-card p-3 flex justify-center">
              <canvas ref={canvasRef} className="max-w-full rounded border border-[#1a1f2a]" style={{ maxHeight: 420 }} />
            </div>
          </div>
        )}

        {/* MT5 */}
        {tab === "mt5" && (
          <div className="journal-card p-4 max-w-md space-y-3">
            <h2 className="text-white text-[13px] font-medium">MT5 CSV import</h2>
            <p className="text-[12px] text-[#94a3b8]">Export deals from MT5. Columns: Symbol, Type, Volume, Profit.</p>
            <input type="file" accept=".csv,.txt,.tsv" onChange={onCsv} className="text-[12px] text-[#94a3b8]" />
          </div>
        )}
      </div>

      {/* Right rail */}
      <aside className="hidden lg:flex flex-col gap-2 p-2 bg-[#0c0e12]">
        <div className="border border-[#1a1f2a] rounded overflow-hidden h-[200px]">
          <div className="flex items-center gap-1 px-2 py-1 border-b border-[#1a1f2a] text-[10px]">
            <span className="text-[#64748b]">TV</span>
            <input
              className="bg-transparent text-white text-[10px] flex-1 outline-none"
              value={tvSymbol}
              onChange={(e) => setTvSymbol(e.target.value)}
            />
          </div>
          <iframe
            title="TV"
            src={`https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(tvSymbol)}&interval=15&hidesidetoolbar=1&theme=dark&style=1&timezone=Etc%2FUTC`}
            className="w-full h-[170px] border-0"
          />
        </div>
        <div className="border border-[#1a1f2a] rounded p-2 text-[10px] text-[#94a3b8]">
          <p className="text-[#64748b] mb-1">Score</p>
          <p className="text-white text-lg font-semibold">{score.score}</p>
          <p>Win {score.winRate}% · PF {score.profitFactor} · R {score.avgR}</p>
        </div>
        <div className="border border-[#1a1f2a] rounded p-2 text-[10px]">
          <p className="text-[#64748b] mb-1">Forex Factory</p>
          <a href="https://www.forexfactory.com/calendar" target="_blank" rel="noreferrer" className="text-[#22c55e]">
            Open calendar ↗
          </a>
        </div>
      </aside>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-[#64748b]">Loading…</div>}>
      <Terminal />
    </Suspense>
  );
}
