"use client";

/**
 * Navy pixel-art sky — Kimpton-style soft focal visual.
 * Crisp pixel grid, planes + clouds, deep navy palette.
 */
export function HeroSky() {
  const COLS = 64;
  const ROWS = 28;
  const px = 10;

  const sky = (x: number, y: number) => {
    // base depth gradient
    if (y > ROWS - 3) return "#060d18";
    if (y > ROWS - 5) return "#0a1628";
    const wave = Math.sin(x * 0.35 + y * 0.55) + Math.cos(x * 0.18 - y * 0.25);
    if (y < 10 && wave > 0.9) return "#3d5a80";
    if (y < 9 && wave > 0.55) return "#2a4a6e";
    if (y < 11 && wave > 0.25) return "#1e3a5f";
    if (y < 14) return "#12263f";
    return "#0b1f3a";
  };

  // Cloud stamps (pixel blobs)
  const cloudCells = new Map<string, string>();
  const stampCloud = (cx: number, cy: number, w: number, h: number) => {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const nx = dx / w - 0.5;
        const ny = dy / h - 0.5;
        if (nx * nx * 3 + ny * ny * 5 < 0.55) {
          const key = `${cx + dx},${cy + dy}`;
          const edge = nx * nx * 3 + ny * ny * 5 > 0.35;
          cloudCells.set(key, edge ? "#2a4a6e" : "#4a6fa5");
          if (!edge && (dx + dy) % 4 === 0) cloudCells.set(key, "#5c7fb5");
        }
      }
    }
  };
  stampCloud(6, 4, 14, 6);
  stampCloud(24, 3, 16, 7);
  stampCloud(44, 5, 14, 6);
  stampCloud(18, 9, 10, 4);

  // Plane pixels relative origin
  const planePixels = [
    [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
    [6, 0], [3, 0], [3, 2], [1, 1],
  ];

  const cells: { x: number; y: number; c: string }[] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const key = `${x},${y}`;
      cells.push({ x, y, c: cloudCells.get(key) ?? sky(x, y) });
    }
  }

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border border-[#1e3a5f]/30"
      style={{ aspectRatio: "2.4 / 1" }}
      role="img"
      aria-label="Navy pixel art of aircraft flying through clouds"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${COLS * px} ${ROWS * px}`}
        preserveAspectRatio="xMidYMid slice"
        shapeRendering="crispEdges"
        aria-hidden
      >
        {cells.map((p, i) => (
          <rect key={i} x={p.x * px} y={p.y * px} width={px} height={px} fill={p.c} />
        ))}
        {/* planes */}
        <g className="plane-1">
          {planePixels.map(([dx, dy], i) => (
            <rect
              key={`p1-${i}`}
              x={(4 + dx) * px}
              y={(14 + dy) * px}
              width={px}
              height={px}
              fill={i === 0 ? "#94a3b8" : "#e8eef5"}
            />
          ))}
        </g>
        <g className="plane-2">
          {planePixels.map(([dx, dy], i) => (
            <rect
              key={`p2-${i}`}
              x={(38 + dx) * px}
              y={(17 + dy) * px}
              width={px}
              height={px}
              fill={i === 0 ? "#64748b" : "#c5d4e8"}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
