import Link from "next/link";
import { ArrowRight, BookOpen, LineChart, Layers, MessagesSquare, Globe } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[#2a2a32] sticky top-0 bg-[#0c0c0e]/90 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-[0.14em]">CARSTAIR</span>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/login" className="text-[#8a8a96] hover:text-white">Log in</Link>
            <Link href="/signup" className="gloss-btn-primary px-3 py-1.5 rounded-md">Sign up</Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-5 pt-20 pb-16">
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight max-w-2xl leading-tight">
          Charts. Models. Papers.
          <br />
          <span className="text-[#c4c4d0]">World chat & board.</span>
        </h1>
        <p className="mt-5 text-[#8a8a96] max-w-xl text-sm leading-relaxed">
          A workspace for futures, FX and commodities research — your models and paper notes stay in your account. No subscriptions. No AI chatbot product.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/signup" className="gloss-btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm">
            Create account <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/login" className="gloss-btn px-5 py-2.5 rounded-md text-sm">Log in</Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { icon: LineChart, t: "Charts", d: "TradingView with your symbols" },
            { icon: Layers, t: "Models", d: "Categories + your saved work" },
            { icon: BookOpen, t: "Papers", d: "SSRN-linked research library" },
            { icon: Globe, t: "World", d: "Your Reddit communities" },
            { icon: MessagesSquare, t: "Board", d: "Ideas, papers, models, chat" },
          ].map((x) => (
            <div key={x.t} className="glass rounded-xl p-4">
              <x.icon className="w-4 h-4 text-[#8a8a96] mb-2" />
              <p className="text-sm font-medium">{x.t}</p>
              <p className="text-[11px] text-[#666] mt-1">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#2a2a32] py-8">
        <div className="max-w-6xl mx-auto px-5 text-xs text-[#555] flex justify-between gap-4 flex-wrap">
          <p>© 2026 CARSTAIR · Educational use</p>
          <p>COO Michael Manyewe · michaelmanyewe18@gmail.com</p>
        </div>
      </footer>
    </div>
  );
}
