export default function Ambient() {
  return (
    <div className="ambient" aria-hidden>
      <div
        className="ambient-orb"
        style={{
          width: 420,
          height: 420,
          left: "15%",
          top: "-5%",
          background: "rgba(180,180,200,0.15)",
        }}
      />
      <div
        className="ambient-orb"
        style={{
          width: 320,
          height: 320,
          right: "5%",
          bottom: "10%",
          background: "rgba(100,100,120,0.12)",
          animationDelay: "-8s",
        }}
      />
    </div>
  );
}
