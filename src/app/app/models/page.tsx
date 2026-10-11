"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

type Model = { id: string; name: string; category: string; minTier: string };

const TIER_RANK: Record<string, number> = {
  free: 0,
  silver: 1,
  gold: 2,
  platinum: 3,
  onyx: 4,
};

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [tier, setTier] = useState("free");

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("carstair_user") || "{}");
      setTier(u.tier || "free");
    } catch {}
    fetch("/api/models")
      .then((r) => r.json())
      .then((d) => setModels(d.models || []))
      .catch(() => {});
  }, []);

  const rank = TIER_RANK[tier] ?? 0;

  return (
    <div className="animate-fade max-w-4xl">
      <h1 className="text-2xl font-light">Models</h1>
      <p className="text-xs text-[#8a8a96] mt-1 mb-8">
        Catalogue of quantitative approaches. Higher tiers unlock more packs.
        Not shown on the marketing homepage.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {models.map((m) => {
          const locked = (TIER_RANK[m.minTier] ?? 0) > rank;
          return (
            <div
              key={m.id}
              className={`glass rounded-xl p-4 ${
                locked ? "opacity-60" : "glass-hover"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium">{m.name}</p>
                {locked && <Lock className="w-3.5 h-3.5 text-[#666] shrink-0" />}
              </div>
              <p className="text-[11px] text-[#666] mt-1">
                {m.category} · from {m.minTier}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
