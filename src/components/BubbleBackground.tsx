"use client";

export default function BubbleBackground() {
  const bubbles = [
    { size: 280, left: "8%", top: "12%", dur: "18s", delay: "0s" },
    { size: 160, left: "72%", top: "8%", dur: "22s", delay: "2s" },
    { size: 220, left: "55%", top: "55%", dur: "26s", delay: "1s" },
    { size: 120, left: "18%", top: "65%", dur: "20s", delay: "3s" },
    { size: 90, left: "85%", top: "70%", dur: "16s", delay: "0.5s" },
    { size: 200, left: "40%", top: "25%", dur: "24s", delay: "4s" },
  ];

  return (
    <div className="bubble-bg" aria-hidden>
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="bubble"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            top: b.top,
            animationDuration: b.dur,
            animationDelay: b.delay,
          }}
        />
      ))}
    </div>
  );
}
