"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

const MARKETS = [
  "Ind&Com Market",
  "Forex Market",
  "Energy Market",
  "Majors Market",
  "PrecMet Market",
  "Ind&Com3 Market",
  "Exotic Market",
  "Cryptocurrencies",
] as const;

const SYMBOLS: Record<string, string[]> = {
  "Ind&Com Market": ["US500", "US100", "DE40", "UK100", "JP225"],
  "Forex Market": ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD"],
  "Energy Market": ["USOIL", "UKOIL", "NATGAS"],
  "Majors Market": ["EURUSD", "GBPUSD", "USDJPY", "USDCHF", "USDCAD"],
  "PrecMet Market": ["XAUUSD", "XAGUSD", "XPTUSD"],
  "Ind&Com3 Market": ["US30", "NAS100", "SPX500", "Copper"],
  "Exotic Market": ["USDTRY", "USDZAR", "USDMXN", "EURTRY"],
  "Cryptocurrencies": ["BTCUSD", "ETHUSD", "SOLUSD", "XRPUSD"],
};

const MODELS = [
  "Deep Footprint Classic", "Bid/Ask Split", "Delta Profile", "Volume Profile",
  "Cumulative Delta", "CVD Chart", "Big Trades Filter", "Imbalance Tracker",
  "Speed of Tape", "Absorption Detector", "Iceberg Proxy", "Stop Run Marker",
  "VWAP Session", "VWAP Weekly", "VWAP Monthly", "Anchored VWAP",
  "Market Profile TPO", "Value Area High/Low", "Point of Control", "Composite Profile",
  "Swing Volume Profile", "Orderflow Imbalance", "Delta Divergence", "Volume Delta Bars",
  "Aggressive Buy/Sell", "Stacked Imbalance", "Unfinished Auction", "Initiative Buying",
  "Initiative Selling", "Responsive Activity", "Exhaustion Print", "Climax Volume",
  "Opening Range Breakout", "ORB + Volume", "London Open Drive", "NY Open Momentum",
  "Session Bias Filter", "Multi-TF Delta", "Footprint Heatmap", "Liquidity Walls",
  "Pulling/Stacking", "Spoofing Heuristic", "HFT Burst Detector", "Trade Intensity",
  "Relative Volume", "Volume Clock", "Delta MA", "Footprint POC Trail",
  "Naked POC", "Poor High/Low", "Single Print", "Excess",
  "Initiative vs Responsive", "Auction Acceptance", "Failed Auction", "Balance Area",
];

type Cell = { bid: number; ask: number; delta: number; vol: number };
type Bar = { open: number; high: number; low: number; close: number; cells: Cell[]; time: number };

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateBar(base: number, seed: number, levels = 12): Bar {
  const open = base + (seededRandom(seed) - 0.5) * base * 0.002;
  const close = open + (seededRandom(seed + 1) - 0.5) * base * 0.003;
  const high = Math.max(open, close) + seededRandom(seed + 2) * base * 0.0015;
  const low = Math.min(open, close) - seededRandom(seed + 3) * base * 0.0015;
  const cells: Cell[] = [];
  for (let i = 0; i < levels; i++) {
    const bid = Math.floor(seededRandom(seed + 10 + i) * 80 + 5);
    const ask = Math.floor(seededRandom(seed + 20 + i) * 80 + 5);
    cells.push({ bid, ask, delta: ask - bid, vol: bid + ask });
  }
  return { open, high, low, close, cells, time: Date.now() - seed * 60000 };
}

function formatPrice(p: number, symbol: string) {
  if (symbol.includes("JPY") || symbol.includes("XAU") || symbol.includes("BTC")) return p.toFixed(2);
  if (symbol.includes("USD") && !symbol.includes("BTC") && !symbol.includes("ETH")) return p.toFixed(5);
  return p.toFixed(2);
}

export default function OrderflowPage() {
  const [market, setMarket] = useState<string>(MARKETS[0]);
  const [symbol, setSymbol] = useState("US500");
  const [bars, setBars] = useState<Bar[]>([]);
  const [basePrice, setBasePrice] = useState(5800);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [showModels, setShowModels] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const profileRef = useRef<HTMLCanvasElement>(null);

  const refreshBars = useCallback(() => {
    const bases: Record<string, number> = {
      US500: 5800, US100: 20500, DE40: 19200, UK100: 8200, JP225: 38500,
      EURUSD: 1.085, GBPUSD: 1.305, USDJPY: 152.4, AUDUSD: 0.655, USDCAD: 1.385,
      USOIL: 72.5, UKOIL: 76.2, NATGAS: 2.85,
      USDCHF: 0.875, XAUUSD: 2650, XAGUSD: 31.2, XPTUSD: 980,
      US30: 42500, NAS100: 20500, SPX500: 5800, Copper: 4.25,
      USDTRY: 34.2, USDZAR: 18.1, USDMXN: 20.3, EURTRY: 37.1,
      BTCUSD: 68500, ETHUSD: 2650, SOLUSD: 175, XRPUSD: 0.62,
    };
    const b = bases[symbol] ?? 100;
    setBasePrice(b);
    const newBars: Bar[] = [];
    for (let i = 24; i >= 0; i--) {
      newBars.push(generateBar(b, Date.now() / 1000 + i * 7 + symbol.length, 10));
    }
    setBars(newBars);
    setLastUpdate(new Date());
  }, [symbol]);

  useEffect(() => {
    const list = SYMBOLS[market] || [];
    if (list.length && !list.includes(symbol)) setSymbol(list[0]);
  }, [market, symbol]);

  useEffect(() => {
    refreshBars();
    const id = setInterval(refreshBars, 15000);
    return () => clearInterval(id);
  }, [refreshBars]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || bars.length === 0) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const w = c.width = c.offsetWidth * 2;
    const h = c.height = c.offsetHeight * 2;
    ctx.scale(2, 2);
    const cw = c.offsetWidth;
    const ch = c.offsetHeight;
    ctx.fillStyle = "#050608";
    ctx.fillRect(0, 0, cw, ch);
    const barW = Math.max(18, (cw - 40) / bars.length);
    const maxVol = Math.max(...bars.flatMap(b => b.cells.map(cell => cell.vol)), 1);
    bars.forEach((bar, bi) => {
      const x = 20 + bi * barW;
      const cellH = (ch - 30) / bar.cells.length;
      bar.cells.forEach((cell, ci) => {
        const y = 10 + ci * cellH;
        const intensity = cell.vol / maxVol;
        ctx.fillStyle = cell.delta > 0
          ? `rgba(34,197,94,${0.15 + intensity * 0.45})`
          : `rgba(239,68,68,${0.15 + intensity * 0.45})`;
        ctx.fillRect(x, y, barW - 2, cellH - 1);
        if (barW > 28) {
          ctx.font = "9px Inter, monospace";
          ctx.fillStyle = "#e2e8f0";
          ctx.textAlign = "center";
          ctx.fillText(`${cell.bid}x${cell.ask}`, x + (barW - 2) / 2, y + cellH / 2 + 3);
        }
      });
      const bodyTop = 10;
      const bodyBot = ch - 20;
      ctx.strokeStyle = bar.close >= bar.open ? "#22c55e" : "#ef4444";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, bodyTop, barW - 2, bodyBot - bodyTop);
    });
    ctx.fillStyle = "#64748b";
    ctx.font = "10px Inter";
    ctx.textAlign = "left";
    ctx.fillText("15-min delayed practice feed", 20, ch - 6);
  }, [bars]);

  useEffect(() => {
    const c = profileRef.current;
    if (!c || bars.length === 0) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const w = c.width = c.offsetWidth * 2;
    const h = c.height = c.offsetHeight * 2;
    ctx.scale(2, 2);
    const cw = c.offsetWidth;
    const ch = c.offsetHeight;
    ctx.fillStyle = "#0c0e12";
    ctx.fillRect(0, 0, cw, ch);
    const levels = 20;
    const volAt: number[] = new Array(levels).fill(0);
    const deltaAt: number[] = new Array(levels).fill(0);
    bars.forEach(bar => {
      bar.cells.forEach((cell, i) => {
        const idx = Math.min(levels - 1, Math.floor((i / bar.cells.length) * levels));
        volAt[idx] += cell.vol;
        deltaAt[idx] += cell.delta;
      });
    });
    const maxV = Math.max(...volAt, 1);
    volAt.forEach((v, i) => {
      const y = (i / levels) * ch;
      const bh = ch / levels - 1;
      const bw = (v / maxV) * (cw - 8);
      ctx.fillStyle = deltaAt[i] >= 0 ? "rgba(34,197,94,0.55)" : "rgba(239,68,68,0.55)";
      ctx.fillRect(4, y, bw, bh);
    });
  }, [bars]);

  const symbols = SYMBOLS[market] || [];

  return (
    <main className="min-h-screen flex flex-col bg-[#050608] text-[#f1f5f9]">
      <header className="w-full border-b border-[#1a1f2a] sticky top-0 z-30 bg-[#050608]/95 backdrop-blur">
        <div className="max-w-[1600px] mx-auto px-3 h-11 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Carstair" width={24} height={24} priority unoptimized />
              <span className="text-[13px] font-semibold tracking-tight">Carstair</span>
            </Link>
            <span className="text-[10px] uppercase tracking-wider text-[#64748b] hidden sm:inline">Orderflow</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-[rgba(34,197,94,0.12)] text-[#22c55e] border border-[rgba(34,197,94,0.25)]">
              Free 15-min delayed
            </span>
            <Link href="/" className="text-[#94a3b8] hover:text-white px-2">Hub</Link>
            <Link href="/login" className="text-[#94a3b8] hover:text-white px-2">Journal</Link>
          </div>
        </div>
      </header>

      <div className="bg-[#0c0e12] border-b border-[#1a1f2a] px-3 py-1.5 text-[11px] text-[#94a3b8] flex flex-wrap items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        Free 15-minute delayed feed (dxFeed-style) for practice, learning tools, and non-live use only. Not for live trading.
        {lastUpdate && (
          <span className="ml-auto font-mono text-[10px] text-[#64748b]">
            Last refresh {lastUpdate.toLocaleTimeString()} · auto every 15s
          </span>
        )}
      </div>

      <div className="border-b border-[#1a1f2a] overflow-x-auto">
        <div className="max-w-[1600px] mx-auto px-2 flex gap-0.5 min-w-max">
          {MARKETS.map(m => (
            <button
              key={m}
              onClick={() => setMarket(m)}
              className={`px-3 py-2 text-[11px] whitespace-nowrap border-b-2 transition-colors ${
                market === m
                  ? "border-[#22c55e] text-[#22c55e]"
                  : "border-transparent text-[#64748b] hover:text-[#94a3b8]"
              }`}
            >
              {m.replace(" Market", "")}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 max-w-[1600px] w-full mx-auto px-2 py-2 grid grid-cols-12 gap-2">
        <aside className="col-span-12 md:col-span-2 flex flex-col gap-2">
          <div className="border border-[#1a1f2a] rounded-lg bg-[#0c0e12] p-2">
            <p className="text-[10px] uppercase tracking-wider text-[#64748b] mb-1.5 px-1">Symbols</p>
            <div className="flex flex-col gap-0.5">
              {symbols.map(s => (
                <button
                  key={s}
                  onClick={() => setSymbol(s)}
                  className={`text-left text-[12px] px-2 py-1.5 rounded ${
                    symbol === s ? "bg-[rgba(34,197,94,0.12)] text-[#22c55e]" : "text-[#94a3b8] hover:bg-[#1a1f2a]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowModels(!showModels)}
            className="border border-[#1a1f2a] rounded-lg bg-[#0c0e12] p-2 text-[12px] text-left hover:border-[#22c55e]"
          >
            <span className="text-[#22c55e] font-medium">50+ Models</span>
            <span className="block text-[10px] text-[#64748b] mt-0.5">Preview list</span>
          </button>
        </aside>

        <section className="col-span-12 md:col-span-7 border border-[#1a1f2a] rounded-lg bg-[#0c0e12] overflow-hidden flex flex-col min-h-[420px]">
          <div className="border-b border-[#1a1f2a] px-3 py-2 flex items-center gap-2 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            <span className="font-medium text-white">{symbol}</span>
            <span className="text-[#64748b]">Footprint · Bid/Ask</span>
            <span className="ml-auto font-mono text-[#94a3b8]">{formatPrice(basePrice, symbol)}</span>
            <button onClick={refreshBars} className="text-[#64748b] hover:text-white text-[10px] ml-2">Refresh</button>
          </div>
          <div className="flex-1 relative min-h-[360px]">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          </div>
        </section>

        <aside className="col-span-12 md:col-span-3 flex flex-col gap-2">
          <div className="border border-[#1a1f2a] rounded-lg bg-[#0c0e12] overflow-hidden flex-1 min-h-[200px]">
            <div className="border-b border-[#1a1f2a] px-2 py-1.5 text-[10px] uppercase tracking-wider text-[#64748b]">
              Volume / Delta Profile
            </div>
            <div className="relative h-[180px]">
              <canvas ref={profileRef} className="absolute inset-0 w-full h-full" />
            </div>
          </div>
          <div className="border border-[#1a1f2a] rounded-lg bg-[#0c0e12] p-2">
            <p className="text-[10px] uppercase tracking-wider text-[#64748b] mb-1.5">Simple Ladder (practice)</p>
            <div className="font-mono text-[11px] space-y-0.5">
              {[...Array(7)].map((_, i) => {
                const off = (3 - i) * 0.0005 * basePrice;
                const px = basePrice + off;
                const isMid = i === 3;
                return (
                  <div key={i} className={`flex justify-between px-1.5 py-0.5 rounded ${isMid ? "bg-[rgba(34,197,94,0.15)] text-[#22c55e]" : "text-[#94a3b8]"}`}>
                    <span>{Math.floor(20 + seededRandom(i + symbol.length) * 40)}</span>
                    <span>{formatPrice(px, symbol)}</span>
                    <span>{Math.floor(15 + seededRandom(i + 9) * 35)}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[9px] text-[#475569] mt-2">Bid · Price · Ask · delayed</p>
          </div>
        </aside>
      </div>

      {showModels && (
        <div className="fixed inset-0 z-40 bg-black/70 flex items-end sm:items-center justify-center p-3" onClick={() => setShowModels(false)}>
          <div
            className="bg-[#0c0e12] border border-[#1a1f2a] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-[#1a1f2a] flex items-center justify-between">
              <div>
                <p className="text-[14px] font-medium text-white">50+ Models Preview</p>
                <p className="text-[11px] text-[#64748b]">Carstair orderflow & volume analysis models</p>
              </div>
              <button onClick={() => setShowModels(false)} className="text-[#64748b] hover:text-white text-lg">×</button>
            </div>
            <div className="p-3 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {MODELS.map((m, i) => (
                <div key={m} className="text-[11px] px-2.5 py-2 rounded border border-[#1a1f2a] bg-[#050608] text-[#94a3b8] hover:border-[#22c55e] hover:text-white cursor-default">
                  <span className="text-[#64748b] mr-1.5">{String(i + 1).padStart(2, "0")}</span>
                  {m}
                </div>
              ))}
            </div>
            <div className="px-4 py-2 border-t border-[#1a1f2a] text-[10px] text-[#64748b]">
              Previews only · free delayed practice feed · Carstair multi-tool hub
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-[#1a1f2a] py-3 text-center text-[10px] text-[#475569]">
        Carstair · Free delayed practice tools · Not financial advice · Open source
      </footer>
    </main>
  );
}
