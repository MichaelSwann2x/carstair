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

export default function ChartsPage() {
  const [symbol, setSymbol] = useState(SYMBOLS[0].id);
  const [tvUser, setTvUser] = useState("");
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setTvUser(d.user?.tradingViewUsername || ""))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!box.current) return;
    box.current.innerHTML = "";
    const holder = document.createElement("div");
    holder.id = "tv_chart_host";
    holder.style.height = "620px";
    box.current.appendChild(holder);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      // @ts-expect-error TradingView global
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
        height: 620,
        studies: ["STD;SMA", "STD;Volume"],
      });
    };
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [symbol]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-light">Charts</h1>
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
          {tvUser && (
            <a
              href={`https://www.tradingview.com/u/${encodeURIComponent(tvUser)}/`}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-[#8a8a96] hover:text-white"
            >
              TV @{tvUser}
            </a>
          )}
        </div>
      </div>
      <div className="glass rounded-xl overflow-hidden">
        <div ref={box} className="w-full min-h-[620px]" />
      </div>
      <p className="text-[11px] text-[#555] mt-3">
        Set your TradingView username in Profile to link your public profile. Private custom indicators require TradingView&apos;s desktop/web app while logged in — the embed uses the public charting widget.
      </p>
    </div>
  );
}
