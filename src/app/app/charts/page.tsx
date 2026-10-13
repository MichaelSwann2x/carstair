"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SYMBOLS = [
  { id: "CME_MINI:ES1!", label: "ES" },
  { id: "CME_MINI:NQ1!", label: "NQ" },
  { id: "FX:EURUSD", label: "EURUSD" },
  { id: "FX:GBPUSD", label: "GBPUSD" },
  { id: "FX:USDJPY", label: "USDJPY" },
  { id: "TVC:GOLD", label: "Gold" },
  { id: "TVC:SILVER", label: "Silver" },
  { id: "NYMEX:CL1!", label: "CL" },
  { id: "TVC:DXY", label: "DXY" },
];

type Builtin = { id: string; name: string };
type Mine = { id: string; name: string; studyId: string; script?: string };

export default function ChartsPage() {
  const [symbol, setSymbol] = useState(SYMBOLS[0].id);
  const [tvUser, setTvUser] = useState("");
  const [connected, setConnected] = useState(false);
  const [connectInput, setConnectInput] = useState("");
  const [builtin, setBuiltin] = useState<Builtin[]>([]);
  const [mine, setMine] = useState<Mine[]>([]);
  const [activeStudies, setActiveStudies] = useState<string[]>(["STD;Volume"]);
  const [customName, setCustomName] = useState("");
  const [customScript, setCustomScript] = useState("");
  const [showConnect, setShowConnect] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const loadMe = useCallback(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        const u = d.user?.tradingViewUsername || "";
        setTvUser(u);
        setConnected(!!d.user?.tradingViewConnected || !!u);
        setConnectInput(u);
      })
      .catch(() => {});
  }, []);

  const loadIndicators = useCallback(() => {
    fetch("/api/indicators")
      .then((r) => r.json())
      .then((d) => {
        setBuiltin(d.builtin || []);
        setMine(d.mine || []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadMe();
    loadIndicators();
  }, [loadMe, loadIndicators]);

  useEffect(() => {
    if (!box.current) return;
    box.current.innerHTML = "";
    const holder = document.createElement("div");
    holder.id = "tv_chart_host";
    holder.style.height = "640px";
    box.current.appendChild(holder);

    const studies = activeStudies.filter((s) => s.startsWith("STD;"));

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      // @ts-expect-error TradingView
      if (typeof TradingView === "undefined") return;
      // @ts-expect-error widget
      new TradingView.widget({
        container_id: "tv_chart_host",
        symbol,
        interval: "60",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#0c0c0e",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        allow_symbol_change: true,
        details: false,
        hotlist: false,
        calendar: false,
        withdateranges: true,
        width: "100%",
        height: 640,
        studies: studies.length ? studies : undefined,
      });
    };
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [symbol, activeStudies]);

  async function connectTv(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/tv/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: connectInput }),
    });
    const data = await res.json();
    if (res.ok) {
      setConnected(true);
      setTvUser(data.username);
      setShowConnect(false);
    }
  }

  function toggleStudy(id: string) {
    setActiveStudies((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function saveCustom(e: React.FormEvent) {
    e.preventDefault();
    if (!customName.trim()) return;
    await fetch("/api/indicators", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: customName,
        studyId: "custom",
        script: customScript,
      }),
    });
    setCustomName("");
    setCustomScript("");
    loadIndicators();
  }

  return (
    <div className="animate-fade page-wrap">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h1 className="text-2xl font-light tracking-tight">Charts</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="px-3 py-2 text-sm"
          >
            {SYMBOLS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          {connected && tvUser ? (
            <a
              href={`https://www.tradingview.com/u/${encodeURIComponent(tvUser)}/`}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] glass px-3 py-2 rounded-lg hover:text-white"
            >
              TV @{tvUser}
            </a>
          ) : (
            <button
              onClick={() => setShowConnect(true)}
              className="gloss-btn-primary text-xs px-3 py-2 rounded-lg"
            >
              Connect TradingView
            </button>
          )}
        </div>
      </div>

      {showConnect && (
        <form
          onSubmit={connectTv}
          className="glass bubble-card rounded-2xl p-5 mb-5 max-w-md animate-fade"
        >
          <p className="text-sm font-medium">Connect TradingView</p>
          <p className="text-[11px] text-[#8b8b99] mt-1 mb-3">
            Same idea as Reddit — sign in with your TV username so CARSTAIR knows your account.
          </p>
          <input
            className="w-full px-3 py-2 text-sm mb-3"
            placeholder="TradingView username"
            value={connectInput}
            onChange={(e) => setConnectInput(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="gloss-btn-primary text-xs px-4 py-2 rounded-lg">
              Connect
            </button>
            <button type="button" onClick={() => setShowConnect(false)} className="gloss-btn text-xs px-4 py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <div className="glass glass-static bubble-card rounded-2xl overflow-hidden">
            <div ref={box} className="w-full min-h-[640px]" />
          </div>
        </div>

        <aside className="w-full lg:w-64 shrink-0 space-y-4">
          <div className="glass bubble-card rounded-2xl p-4 animate-fade-delay-1">
            <p className="text-[11px] uppercase tracking-wider text-[#666] mb-3">Indicators</p>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {builtin.map((b) => (
                <label key={b.id} className="flex items-center gap-2 text-xs text-[#aaa] cursor-pointer hover:text-white py-1">
                  <input
                    type="checkbox"
                    checked={activeStudies.includes(b.id)}
                    onChange={() => toggleStudy(b.id)}
                    className="rounded"
                  />
                  {b.name}
                </label>
              ))}
            </div>
          </div>

          <div className="glass bubble-card rounded-2xl p-4 animate-fade-delay-2">
            <p className="text-[11px] uppercase tracking-wider text-[#666] mb-3">Your indicators</p>
            {mine.length === 0 && (
              <p className="text-[11px] text-[#555]">Save a custom script below.</p>
            )}
            <ul className="space-y-1 mb-3">
              {mine.map((m) => (
                <li key={m.id} className="text-xs text-[#aaa] truncate">{m.name}</li>
              ))}
            </ul>
            <form onSubmit={saveCustom} className="space-y-2">
              <input
                className="w-full px-2 py-1.5 text-xs"
                placeholder="Name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
              <textarea
                className="w-full px-2 py-1.5 text-xs min-h-[80px] font-mono"
                placeholder="Pine or notes for your indicator…"
                value={customScript}
                onChange={(e) => setCustomScript(e.target.value)}
              />
              <button type="submit" className="gloss-btn-primary text-[11px] px-3 py-1.5 rounded-lg w-full">
                Save indicator
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
