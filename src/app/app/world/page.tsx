"use client";

import { useEffect, useState } from "react";

export default function WorldPage() {
  const [data, setData] = useState<{
    connected?: boolean;
    username?: string;
    subs?: { name: string; url: string }[];
    posts?: { title: string; subreddit: string; url: string; score: number }[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/reddit/feed")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ connected: false }));
  }, []);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-light mb-6">World</h1>

      {!data?.connected && (
        <div className="card p-6">
          <a href="/api/reddit/connect" className="btn btn-primary">Connect Reddit</a>
        </div>
      )}

      {data?.connected && (
        <>
          <p className="text-xs text-zinc-500 mb-4">u/{data.username}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {(data.subs || []).map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="btn btn-ghost text-xs">
                r/{s.name}
              </a>
            ))}
          </div>
          <div className="space-y-2">
            {(data.posts || []).map((p, i) => (
              <a key={i} href={p.url} target="_blank" rel="noreferrer" className="block card p-3 hover:bg-white/[0.04]">
                <p className="text-sm">{p.title}</p>
                <p className="text-[11px] text-zinc-600 mt-1">r/{p.subreddit}</p>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
