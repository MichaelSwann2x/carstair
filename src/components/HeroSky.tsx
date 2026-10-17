"use client";

/** Navy pixel-art sky: clouds + planes (Kimpton restraint, aviation theme) */
export function HeroSky() {
  const W = 48;
  const H = 22;
  // Procedural soft pixel field
  const cells: { x: number; y: number; c: string }[] = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const n = (Math.sin(x * 0.4 + y * 0.7) + Math.cos(x * 0.2 - y * 0.3)) * 0.5;
      let c = "#0b1f3a";
      if (y < 8 && n > 0.3) c = "#1e3a5f";
      if (y < 6 && n > 0.55) c = "#2d4a6f";
      if (y < 5 && n > 0.75) c = "#3d5a80";
      // cloud bands
      if (y >= 4 && y <= 7 && ((x > 6 && x < 14) || (x > 22 && x < 32) || (x > 36 && x < 44))) {
        if ((x + y) % 3 !== 0) c = "#4a6fa5";
        if ((x + y) % 5 === 0) c = "#5c7fb5";
      }
      if (y >= 8 && y <= 10 && x > 16 && x < 26 && (x + y) % 2 === 0) c = "#3d5a80";
      cells.push({ x, y, c });
    }
  }

  // Pixel plane sprites (drawn as rects on top)
  const plane = (ox: number, oy: number, color: string) =>
    [
      [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1],
      [5, 0], [2, 0], [2, 2], [1, 1],
    ].map(([px, py], i) => (
      <rect key={`${ox}-${oy}-${i}`} x={(ox + px) * 12} y={(oy + py) * 12} width={12} height={12} fill={color} />
    ));

  return (
    <div
      className="relative w-full max-w-[920px] mx-auto aspect-[2.2/1] rounded-2xl overflow-hidden border border-[#1e3a5f]/40 shadow-[0_24px_80px_-24px_rgba(11,31,58,0.35)]"
      role="img"
      aria-label="Pixel illustration of aircraft among clouds"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${W * 12} ${H * 12}`}
        preserveAspectRatio="xMidYMid slice"
        shapeRendering="crispEdges"
        aria-hidden
      >
        {cells.map((p, i) => (
          <rect key={i} x={p.x * 12} y={p.y * 12} width={12} height={12} fill={p.c} />
        ))}
        <g className="plane-1">{plane(2, 12, "#e8eef5")}</g>
        <g className="plane-2">{plane(30, 15, "#c5d4e8")}</g>
        {/* ground band */}
        {Array.from({ length: W }).map((_, x) => (
          <rect key={`g${x}`} x={x * 12} y={(H - 2) * 12} width={12} height={24} fill="#071528" />
        ))}
      </svg>
    </div>
  );
}
