import Link from "next/link";
import { ArrowRight, BookOpen, LineChart, Layers, MessagesSquare, Globe } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <header className="border-b border-white/5 sticky top-0 bg-[#08080a]/70 backdrop-blur-xl z-50">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-[0.14em]">CARSTAIR</span>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/login" className="text-[#8b8b99] hover:text-white transition">Log in</Link>
            <Link href="/signup" className="gloss-btn-primary px-3.5 py-1.5 rounded-lg">Sign up</Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-5 pt-24 pb-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight max-w-2xl leading-[1.1] animate-fade">
          Charts. Models. Papers.
          <br />
          <span className="text-[#c8c8d8]">World & board.</span>
        </h1>
        <p className="mt-6 text-[#8b8b99] max-w-xl text-sm leading-relaxed animate-fade-delay-1">
          Connect TradingView and Reddit. Build models, annotate SSRN research, post on the board.
        </p>
        <div className="mt-10 flex gap-3 animate-fade-delay-2">
          <Link href="/signup" className="gloss-btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm">
            Create account <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/login" className="gloss-btn px-5 py-2.5 rounded-xl text-sm">Log in</Link>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { icon: LineChart, t: "Charts", d: "TV free charts + indicators" },
            { icon: Layers, t: "Models", d: "Categories + your library" },
            { icon: BookOpen, t: "Papers", d: "SSRN-linked research" },
            { icon: Globe, t: "World", d: "Your Reddit communities" },
            { icon: MessagesSquare, t: "Board", d: "Ideas and discussion" },
          ].map((x, i) => (
            <div
              key={x.t}
              className={`glass bubble-card rounded-2xl p-5 animate-fade-delay-${Math.min(i + 1, 3)}`}
            >
              <x.icon className="w-4 h-4 text-[#8b8b99] mb-3" />
              <p className="text-sm font-medium">{x.t}</p>
              <p className="text-[11px] text-[#666] mt-1.5">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-5 text-xs text-[#555] flex justify-between gap-4 flex-wrap">
          <p>© 2026 CARSTAIR</p>
          <p>michaelmanyewe18@gmail.com</p>
        </div>
      </footer>
    </div>
  );
}
