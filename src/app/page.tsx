import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-[0.18em]">CARSTAIR</span>
          <div className="flex gap-3">
            <Link href="/login" className="btn btn-ghost">Log in</Link>
            <Link href="/signup" className="btn btn-primary">Sign up</Link>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-5 pt-28 pb-24">
        <h1 className="text-5xl sm:text-6xl font-light tracking-tight leading-[1.08] max-w-xl rise">
          Charts. Models.
          <br />
          Papers. World.
        </h1>
        <p className="mt-6 text-zinc-500 max-w-md text-[15px] leading-relaxed rise" style={{ animationDelay: "0.05s" }}>
          Research workspace for markets. Connect TradingView and Reddit. Your data stays in your account.
        </p>
        <div className="mt-10 flex gap-3 rise" style={{ animationDelay: "0.1s" }}>
          <Link href="/signup" className="btn btn-primary px-5 py-2.5">Get started</Link>
          <Link href="/login" className="btn btn-ghost px-5 py-2.5">Log in</Link>
        </div>

        <div className="mt-24 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {["Charts", "Models", "Papers", "World", "Board"].map((t) => (
            <div key={t} className="card p-4">
              <p className="text-sm text-zinc-300">{t}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
