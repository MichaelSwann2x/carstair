"use client";

import { useState, useRef, useEffect } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function NicoPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "I'm Nico — focused on FX, futures and commodities. Ask for strategy ideas, session logic, risk frames, or scaffolds for MT5 EAs, TradingView Pine, or Tradovate-style bots. Educational only.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: q }]);
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("carstair_user") || "{}");
      const res = await fetch("/api/nico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          userId: user.username || user.email || "anon",
          tier: user.tier || "free",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: data.error || "Credits exhausted for today. Upgrade in Billing.",
          },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.answer },
        ]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Request failed. Try again." },
      ]);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-3xl animate-fade">
      <div className="mb-4">
        <h1 className="text-2xl font-light">Nico</h1>
        <p className="text-xs text-[#8a8a96] mt-1">
          Strategy, pairs, risk, and code scaffolds for MT5 / TradingView /
          Tradovate. Credits live in the Account panel.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-xl px-4 py-3 text-sm leading-relaxed max-w-[95%] ${
              m.role === "user"
                ? "ml-auto bg-[#1a1a1f] border border-[#2a2a32]"
                : "glass"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="text-xs text-[#666] px-2">Nico is thinking…</div>
        )}
        <div ref={bottom} />
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="e.g. London session breakout for EURUSD, or MT5 trailing EA outline…"
          className="flex-1 px-3 py-2.5 text-sm rounded-lg"
          disabled={loading}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="gloss-btn-primary px-4 rounded-lg text-sm disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
}
