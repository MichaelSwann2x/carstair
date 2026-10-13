import Link from "next/link";

export default function AppHome() {
  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-light">Home</h1>
      <div className="mt-8 grid grid-cols-2 gap-2">
        {[
          ["/app/charts", "Charts"],
          ["/app/models", "Models"],
          ["/app/papers", "Papers"],
          ["/app/world", "World"],
          ["/app/board", "Board"],
          ["/app/profile", "Profile"],
        ].map(([href, label]) => (
          <Link key={href} href={href} className="card p-4 text-sm hover:bg-white/[0.04] transition-colors">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
