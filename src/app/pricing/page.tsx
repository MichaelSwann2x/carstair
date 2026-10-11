import Link from "next/link";
import { TIERS } from "@/lib/tiers";
import { Check, Lock } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[#2a2a32] bg-[#0c0c0e]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-[0.12em] text-sm">
            CARSTAIR
          </Link>
          <div className="flex gap-4 text-xs">
            <Link href="/login" className="text-[#8a8a96] hover:text-white">
              Log in
            </Link>
            <Link href="/signup" className="gloss-btn-primary px-3 py-1.5 rounded-md">
              Create account
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 py-16">
        <p className="text-xs tracking-[0.15em] uppercase text-[#8a8a96]">Access</p>
        <h1 className="text-3xl font-light mt-2">Plans with real limits</h1>
        <p className="text-sm text-[#8a8a96] mt-3 max-w-xl">
          Each tier unlocks more Nico capacity, deeper strategy tools and code
          scaffolds. Free stays useful but capped.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {TIERS.map((t) => (
            <div
              key={t.id}
              className={`glass rounded-xl p-5 flex flex-col ${
                t.id === "gold" ? "ring-1 ring-[#d4af37]/40" : ""
              }`}
            >
              <p className="text-sm font-medium">{t.name}</p>
              <p className="text-2xl font-light mt-2">
                {t.price === 0 ? "$0" : `$${t.price}`}
                {t.price > 0 && (
                  <span className="text-xs text-[#666]">/mo</span>
                )}
              </p>
              <p className="text-[11px] text-[#666] mt-1">
                {t.dailyCredits} Nico credits / day
              </p>
              <ul className="mt-4 space-y-2 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2 text-[11px] text-[#aaa]">
                    <Check className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
                {t.locked.map((f) => (
                  <li key={f} className="flex gap-2 text-[11px] text-[#555]">
                    <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`mt-5 text-center text-xs py-2 rounded-lg ${
                  t.id === "free"
                    ? "gloss-btn"
                    : "gloss-btn-primary"
                }`}
              >
                {t.price === 0 ? "Start free" : "Subscribe"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
