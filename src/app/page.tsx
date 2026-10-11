"use client";

import { useState, useEffect } from "react";
import { Cpu, Server, Shield, BarChart3, MessageSquare, Layers, ArrowRight } from "lucide-react";

const USER_ID =
  "carstair-user-" +
  (typeof window !== "undefined"
    ? localStorage.getItem("cs_uid") || Math.random().toString(36).slice(2)
    : "ssr");

export default function Home() {
  const [credits, setCredits] = useState(3);
  const [symbol, setSymbol] = useState("ES");
  const [assetClass, setAssetClass] = useState("futures");
  const [gex, setGex] = useState<{
    summary: string;
    levels?: { strike: number; gex: number; type: string; strength: string }[];
    remainingCredits?: number;
  } | null>(null);
  const [quinQuery, setQuinQuery] = useState("");
  const [quinAnswer, setQuinAnswer] = useState("");
  const [models, setModels] = useState<{ id: string; name: string; category: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("cs_uid")) {
      localStorage.setItem("cs_uid", USER_ID);
    }
    fetch(`/api/credits?userId=${USER_ID}&tier=free`)
      .then((r) => r.json())
      .then((d) => setCredits(d.remaining ?? 3))
      .catch(() => {});
    fetch(`/api/models?tier=free`)
      .then((r) => r.json())
      .then((d) => setModels(d.models || []))
      .catch(() => {});
  }, []);

  async function runGex() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/gex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, assetClass, userId: USER_ID, tier: "free" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Credits exhausted");
        setCredits(data.remaining ?? 0);
      } else {
        setGex(data);
        setCredits(data.remainingCredits ?? credits);
      }
    } catch {
      setError("Request failed");
    }
    setLoading(false);
  }

  async function askQuin() {
    if (!quinQuery.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/quin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: quinQuery, userId: USER_ID, tier: "free" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Credits exhausted");
        setCredits(data.remaining ?? 0);
      } else {
        setQuinAnswer(data.answer || "");
        setCredits(data.remainingCredits ?? credits);
      }
    } catch {
      setError("Request failed");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-server">
      <header className="border-b border-[#1f1f1f] bg-[#0a0a0a]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-tight text-sm">CARSTAIR</span>
            <span className="text-[#555] text-xs hidden sm:inline">| INTELLIGENCE INFRASTRUCTURE</span>
          </div>
          <nav className="flex items-center gap-5 text-xs text-[#888]">
            <a href="#models" className="hover:text-white">Models</a>
            <a href="#gex" className="hover:text-white">GEX / IV</a>
            <a href="#quin" className="hover:text-white">QUIN</a>
            <a href="#pricing" className="hover:text-white">Access</a>
            <a href="#contact" className="hover:text-white">Contact</a>
            <span className="text-[#666] text-[11px] tabular-nums">Credits: {credits}</span>
            <a href="#pricing" className="px-3 py-1.5 rounded border border-[#333] text-white text-xs hover:bg-white hover:text-black">Request Access</a>
          </nav>
        </div>
      </header>

      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.12] max-w-3xl">
          We build the systems that<br />
          <span className="font-normal">make intelligence possible.</span>
        </h1>
        <p className="mt-6 text-[#888] text-base max-w-xl leading-relaxed">
          Closed research for indices, FX, commodities and futures. Delayed quant previews. Limited QUIN. Realistic GEX &amp; IV walls you can run on any contract.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#gex" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded hover:bg-[#ddd]">
            Try GEX tool <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#pricing" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#333] text-sm rounded hover:border-[#555]">View tiers</a>
        </div>
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-[#1f1f1f] pt-12">
          <div className="flex gap-4">
            <Cpu className="w-5 h-5 text-[#666] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Fundamental research</p>
              <p className="text-xs text-[#666] mt-1">AI systems tuned for futures &amp; macro.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Server className="w-5 h-5 text-[#666] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Advanced compute infrastructure</p>
              <p className="text-xs text-[#666] mt-1">Built for scale and control. Delayed models first.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Shield className="w-5 h-5 text-[#666] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Private by design</p>
              <p className="text-xs text-[#666] mt-1">Secure by default. Aligned to long-term advantage.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#1f1f1f] bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs tracking-widest text-[#555] uppercase mb-4">Organization</p>
          <h2 className="text-2xl font-light max-w-2xl">Simple. Forward-thinking. Human.</h2>
          <p className="mt-4 text-[#888] text-sm max-w-2xl leading-relaxed">
            CARSTAIR exists so traders who work indices, FX, commodities and futures can access clear positioning context without noise. Free tier is deliberately limited so paid systems stay focused and honest.
          </p>
        </div>
      </section>

      <section id="models" className="border-t border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-[#666]" />
            <p className="text-xs tracking-widest text-[#555] uppercase">50+ Models Preview</p>
          </div>
          <h2 className="text-2xl font-light mb-2">Delayed quantitative models</h2>
          <p className="text-sm text-[#666] mb-8">Free tier shows a sample. All data is delayed / educational.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {models.slice(0, 9).map((m) => (
              <div key={m.id} className="glass rounded-lg p-4">
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-[11px] text-[#666] mt-1">{m.category} · delayed preview</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gex" className="border-t border-[#1f1f1f] bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-[#666]" />
            <p className="text-xs tracking-widest text-[#555] uppercase">GEX &amp; IV Walls</p>
          </div>
          <h2 className="text-2xl font-light mb-2">Run levels on any contract</h2>
          <p className="text-sm text-[#666] mb-8">Synthetic educational GEX / IV walls. Costs 1 credit.</p>
          <div className="flex flex-wrap gap-3 mb-6">
            <input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} placeholder="ES, NQ, CL, EURUSD..." className="bg-[#111] border border-[#2a2a2a] rounded px-3 py-2 text-sm w-40 focus:outline-none focus:border-[#444]" />
            <select value={assetClass} onChange={(e) => setAssetClass(e.target.value)} className="bg-[#111] border border-[#2a2a2a] rounded px-3 py-2 text-sm focus:outline-none">
              <option value="futures">Futures</option>
              <option value="index">Index</option>
              <option value="forex">Forex</option>
              <option value="commodity">Commodity</option>
            </select>
            <button onClick={runGex} disabled={loading || credits < 1} className="px-4 py-2 bg-white text-black text-sm font-medium rounded disabled:opacity-40 hover:bg-[#ddd]">{loading ? "Running..." : "Generate levels"}</button>
          </div>
          {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
          {gex && (
            <div className="glass rounded-xl p-6 space-y-4 animate-fade">
              <p className="text-sm text-[#aaa]">{gex.summary}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="text-[#666] border-b border-[#222]"><th className="text-left py-2 pr-4">Strike</th><th className="text-left py-2 pr-4">GEX</th><th className="text-left py-2 pr-4">Type</th><th className="text-left py-2">Strength</th></tr></thead>
                  <tbody>{gex.levels?.map((l, i) => (<tr key={i} className="border-b border-[#1a1a1a]"><td className="py-1.5 pr-4 tabular-nums">{l.strike}</td><td className="py-1.5 pr-4 tabular-nums">{l.gex}</td><td className="py-1.5 pr-4">{l.type}</td><td className="py-1.5">{l.strength}</td></tr>))}</tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="quin" className="border-t border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-[#666]" />
            <p className="text-xs tracking-widest text-[#555] uppercase">QUIN AI Assistant</p>
          </div>
          <h2 className="text-2xl font-light mb-2">Limited queries</h2>
          <p className="text-sm text-[#666] mb-8">Free tier restricted. Educational framing only.</p>
          <div className="flex gap-3 mb-4">
            <input value={quinQuery} onChange={(e) => setQuinQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && askQuin()} placeholder="Ask about GEX, ES, NQ, CL, FX..." className="flex-1 bg-[#111] border border-[#2a2a2a] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#444]" />
            <button onClick={askQuin} disabled={loading || credits < 1} className="px-4 py-2 bg-white text-black text-sm font-medium rounded disabled:opacity-40">Ask</button>
          </div>
          {quinAnswer && <div className="glass rounded-lg p-4 text-sm text-[#ccc] leading-relaxed animate-fade">{quinAnswer}</div>}
        </div>
      </section>

      <section id="pricing" className="border-t border-[#1f1f1f] bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs tracking-widest text-[#555] uppercase mb-2">Access</p>
          <h2 className="text-2xl font-light mb-10">Four tiers. Clear limits.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[{ name: "Silver", price: 19, credits: 25 }, { name: "Gold", price: 37, credits: 60 }, { name: "Platinum", price: 68, credits: 150 }, { name: "Onyx", price: 170, credits: 500 }].map((p) => (
              <div key={p.name} className="glass rounded-xl p-5 flex flex-col">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-2xl font-light mt-2">${p.price}<span className="text-xs text-[#666]">/mo</span></p>
                <p className="text-xs text-[#666] mt-2">{p.credits} credits / day</p>
                <button className="mt-4 w-full py-2 text-xs border border-[#333] rounded hover:bg-white hover:text-black">Subscribe (Stripe)</button>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#555] mt-6">Free: 3 credits/day. Stripe ready once keys are added.</p>
        </div>
      </section>

      <section id="contact" className="border-t border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs tracking-widest text-[#555] uppercase mb-2">Contact</p>
          <h2 className="text-2xl font-light mb-4">We care about your experience with us.</h2>
          <p className="text-sm text-[#888] max-w-2xl leading-relaxed mb-8">
            If something is unclear, broken, or could be better, reach out. Your feedback shapes how we build. The COO is the point of contact for product experience, partnerships, and account questions.
          </p>
          <div className="glass rounded-xl p-6 max-w-md">
            <p className="text-xs text-[#666] uppercase tracking-wider mb-1">Chief Operating Officer</p>
            <p className="text-base font-medium">Michael Manyewe</p>
            <a href="mailto:michaelmanyewe18@gmail.com" className="text-sm text-[#aaa] hover:text-white mt-2 inline-block">
              michaelmanyewe18@gmail.com
            </a>
            <p className="text-xs text-[#555] mt-4 leading-relaxed">
              Prefer email. We read every message and aim to respond within one business day.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#1f1f1f] py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between gap-4 text-xs text-[#555]">
          <p>© 2026 CARSTAIR. Intelligence infrastructure for futures &amp; macro.</p>
          <p>Educational tools only. Not financial advice. Delayed data.</p>
        </div>
      </footer>
    </div>
  );
}
