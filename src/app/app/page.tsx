"use client";

import Link from "next/link";
import { LineChart, Bot, Layers } from "lucide-react";

export default function AppHome() {
  return (
    <div className="max-w-4xl animate-fade">
      <h1 className="text-2xl font-light">Overview</h1>
      <p className="text-sm text-[#8a8a96] mt-2">
        Jump into live charts or talk to Nico about FX, futures and commodities
        strategy.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            href: "/app/charts",
            icon: LineChart,
            title: "Charts",
            body: "TradingView free charts for any pair you trade.",
          },
          {
            href: "/app/nico",
            icon: Bot,
            title: "Nico",
            body: "Strategy, EA and indicator help focused on your markets.",
          },
          {
            href: "/app/models",
            icon: Layers,
            title: "Models",
            body: "Catalogue of quant approaches — unlock more with higher tiers.",
          },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="glass glass-hover rounded-xl p-5 block"
          >
            <c.icon className="w-5 h-5 text-[#8a8a96] mb-3" />
            <p className="text-sm font-medium">{c.title}</p>
            <p className="text-xs text-[#8a8a96] mt-2 leading-relaxed">{c.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
