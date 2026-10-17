"use client";

export function HeroSky() {
  return (
    <div
      className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border border-zinc-200/60 bg-gradient-to-b from-[#e8eef5] via-[#f0f4f8] to-[#f7f7f8] shadow-[0_20px_60px_-20px_rgba(15,23,42,0.12)]"
      role="img"
      aria-label="Soft illustration of aircraft among clouds"
    >
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 540" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <radialGradient id="g1" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#c5d4e8" stopOpacity="0" />
          </radialGradient>
          <filter id="soft">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        <ellipse className="cloud-a" cx="200" cy="120" rx="140" ry="50" fill="url(#g1)" filter="url(#soft)" />
        <ellipse className="cloud-b" cx="480" cy="90" rx="160" ry="55" fill="url(#g1)" filter="url(#soft)" />
        <ellipse className="cloud-c" cx="820" cy="130" rx="180" ry="60" fill="url(#g1)" filter="url(#soft)" />
        <ellipse className="cloud-a" cx="1000" cy="100" rx="120" ry="45" fill="url(#g1)" filter="url(#soft)" />
        <ellipse className="cloud-b" cx="350" cy="200" rx="100" ry="40" fill="url(#g1)" filter="url(#soft)" opacity="0.7" />
        <ellipse className="cloud-c" cx="700" cy="220" rx="130" ry="42" fill="url(#g1)" filter="url(#soft)" opacity="0.65" />
        {Array.from({ length: 80 }).map((_, i) => {
          const x = (i * 97) % 1200;
          const y = 40 + ((i * 53) % 200);
          const r = 0.8 + (i % 3) * 0.4;
          return <circle key={i} cx={x} cy={y} r={r} fill="#94a3b8" opacity={0.15 + (i % 5) * 0.05} />;
        })}
        <g className="plane-1">
          <path d="M80 280 L160 268 L280 272 L300 265 L310 272 L290 278 L200 282 L160 295 L145 282 Z" fill="#3f3f46" opacity="0.55" />
        </g>
        <g className="plane-2">
          <path d="M900 320 L980 308 L1080 314 L1105 306 L1115 314 L1090 320 L1000 324 L960 338 L945 324 Z" fill="#52525b" opacity="0.4" />
        </g>
        <path d="M0 420 Q300 400 600 415 T1200 405 L1200 540 L0 540 Z" fill="#e4e4e7" opacity="0.5" />
      </svg>
    </div>
  );
}
