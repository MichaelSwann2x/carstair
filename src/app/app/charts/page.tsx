"use client";

import { useEffect, useRef, useState } from "react";

const SYMBOLS = [
  { id: "CME_MINI:ES1!", label: "ES Futures" },
  { id: "CME_MINI:NQ1!", label: "NQ Futures" },
  { id: "TVC:DXY", label: "DXY" },
  { id: "FX:EURUSD", label: "EURUSD" },
  { id: "FX:GBPUSD", label: "GBPUSD" },
  { id: "FX:USDJPY", label: "USDJPY" },
  { id: "TVC:GOLD", label: "Gold" },
  { id: "TVC:SILVER", label: "Silver" },
  { id: "NYMEX:CL1!", label: "Crude Oil" },
  { id: "CME:6E1!", label: "Euro FX Fut" },
];

export default function ChartsPage() {
  const container = useRef<HTMLDivElement>(null);
  const [symbol, setSymbol] = useState(SYMBOLS[0].id);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      // @ts-expect-error TradingView global
      if (typeof TradingView === "undefined") return;
      // @ts-expect-error TradingView widget
      new TradingView.widget({
        container_id: "tv_chart",
        symbol,
        interval: "60",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#0c0c0e",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        details: true,
        hotlist: false,
        calendar: false,
        width: "100%",
        height: 560,
      });
    };
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [symbol]);

  return (
    <div className="animate-fade">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-light">Charts</h1>
          <p className="text-xs text-[#8a8a96] mt-1">
            Live TradingView free widget — real market data, not synthetic levels.
          </p>
        </div>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg"
        >
          {SYMBOLS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="glass rounded-xl overflow-hidden p-1">
        <div id="tv_chart" ref={container} className="w-full min-h-[560px]" />
      </div>
    </div>
  );
}
