import Link from "next/link";

export default function AppHome() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-light">Workspace</h1>
      <p className="text-sm text-[#8a8a96] mt-2">Charts · Models · Papers · World · Board</p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          ["/app/charts", "Charts"],
          ["/app/models", "Models"],
          ["/app/papers", "Papers"],
          ["/app/world", "World chat"],
          ["/app/board", "Board"],
          ["/app/profile", "Profile"],
        ].map(([href, label]) => (
          <Link key={href} href={href} className="glass rounded-xl p-4 text-sm hover:border-[#3a3a45] border border-transparent">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
