"use client";

import { TIERS } from "@/lib/tiers";
import { Check, Lock } from "lucide-react";

export default function BillingPage() {
  function setTier(id: string) {
    try {
      const u = JSON.parse(localStorage.getItem("carstair_user") || "{}");
      u.tier = id;
      localStorage.setItem("carstair_user", JSON.stringify(u));
      alert(`Plan set to ${id} (demo — connect Stripe for live billing).`);
      window.location.reload();
    } catch {}
  }

  return (
    <div className="animate-fade">
      <h1 className="text-2xl font-light">Billing</h1>
      <p className="text-xs text-[#8a8a96] mt-1 mb-8">
        Choose a plan. Stripe checkout plugs in with your keys.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TIERS.filter((t) => t.id !== "free").map((t) => (
          <div key={t.id} className="glass rounded-xl p-5 flex flex-col">
            <p className="text-sm font-medium">{t.name}</p>
            <p className="text-2xl font-light mt-1">
              ${t.price}
              <span className="text-xs text-[#666]">/mo</span>
            </p>
            <p className="text-[11px] text-[#666] mt-1">
              {t.dailyCredits} credits / day
            </p>
            <ul className="mt-3 space-y-1.5 flex-1">
              {t.features.slice(0, 5).map((f) => (
                <li key={f} className="flex gap-2 text-[11px] text-[#aaa]">
                  <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  {f}
                </li>
              ))}
              {t.locked.slice(0, 2).map((f) => (
                <li key={f} className="flex gap-2 text-[11px] text-[#555]">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setTier(t.id)}
              className="mt-4 gloss-btn-primary rounded-lg py-2 text-xs"
            >
              Select {t.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
