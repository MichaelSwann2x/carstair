"use client";

import { useEffect, useRef, useState } from "react";

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

const STUDIES = [
  { id: "STD;SMA", name: "SMA" },
  { id: "STD;EMA", name: "EMA" },
  { id: "STD;RSI", name: "RSI" },
  { id: "STD;MACD", name: "MACD" },
  { id: "STD;BB", name: "Bollinger" },
  { id: "STD;Volume", name: "Volume" },
  { id: "STD;VWAP", name: "VWAP" },
  { id: "STD;ATR", name: "ATR" },
];

export default function ChartsPage() {
  const [symbol, setSymbol] = useState(SYMBOLS[0].id);
  const [studies, setStudies] = useState<string[]>(["STD;Volume"]);
  const [tvUser, setTvUser] = useState("");
  const [tvInput, setTvInput] = useState("");
  const [showTv, setShowTv] = useState(false);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.tradingViewUsername) {
          setTvUser(d.user.tradingViewUsername);
          setTvInput(d.user.tradingViewUsername);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!host.current) return;
    host.current.innerHTML = "";

    const container = document.createElement("div");
    container.className = "tradingview-widget-container";
    container.style.height = "640px";
    container.style.width = "100%";

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widget.style.height = "100%";
    widget.style.width = "100%";
    container.appendChild(widget);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: "60",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "#0a0a0b",
      gridColor: "rgba(255,255,255,0.04)",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      save_image: false,
      calendar: false,
      support_host: "https://www.tradingview.com",
      studies: studies,
    });

    container.appendChild(script);
    host.current.appendChild(container);
  }, [symbol, studies]);

  function toggle(id: string) {
    setStudies((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  async function connectTv(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/tv/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: tvInput }),
    });
    if (res.ok) {
      const d = await res.json();
      setTvUser(d.username);
      setShowTv(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h1 className="text-2xl font-light tracking-tight">Charts</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <select className="px-3 py-2 text-sm" value={symbol} onChange={(e) => setSymbol(e.target.value)}>
            {SYMBOLS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          {tvUser ? (
            <a
              href={`https://www.tradingview.com/u/${encodeURIComponent(tvUser)}/`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost text-xs"
            >
              @{tvUser}
            </a>
          ) : (
            <button type="button" className="btn btn-primary text-xs" onClick={() => setShowTv(true)}>
              Connect TradingView
            </button>
          )}
        </div>
      </div>

      {showTv && (
        <form onSubmit={connectTv} className="card p-4 mb-4 max-w-sm space-y-3">
          <input
            className="w-full px-3 py-2 text-sm"
            placeholder="TradingView username"
            value={tvInput}
            onChange={(e) => setTvInput(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">Connect</button>
            <button type="button" className="btn btn-ghost" onClick={() => setShowTv(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 card overflow-hidden min-h-[640px]">
          <div ref={host} className="w-full h-[640px]" />
        </div>
        <aside className="w-full lg:w-52 card p-4 h-fit">
          <p className="text-[11px] text-zinc-500 mb-3 tracking-wide uppercase">Indicators</p>
          <div className="space-y-1">
            {STUDIES.map((s) => (
              <label key={s.id} className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={studies.includes(s.id)}
                  onChange={() => toggle(s.id)}
                />
                {s.name}
              </label>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
