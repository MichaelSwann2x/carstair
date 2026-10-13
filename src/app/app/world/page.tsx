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
    <div className="max-w-3xl">
      <h1 className="text-2xl font-light">World</h1>
      <p className="text-xs text-[#8a8a96] mt-1 mb-6">
        Connect Reddit for communities you already use — ideas, methods, experience.
      </p>
      {!data?.connected && (
        <div className="glass rounded-xl p-6">
          <p className="text-sm">Not connected</p>
          <p className="text-xs text-[#666] mt-2">
            Add REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET in Cloudflare env, create an app at reddit.com/prefs/apps, then connect.
          </p>
          <a href="/api/reddit/connect" className="inline-block mt-4 gloss-btn-primary text-xs px-4 py-2 rounded-lg">
            Connect Reddit
          </a>
        </div>
      )}
      {data?.connected && (
        <>
          <p className="text-xs text-[#8a8a96] mb-4">u/{data.username}</p>
          <h2 className="text-sm text-[#666] mb-2">Communities</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {(data.subs || []).map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noreferrer"
                className="text-[11px] glass px-3 py-1.5 rounded-lg hover:text-white">r/{s.name}</a>
            ))}
          </div>
          <h2 className="text-sm text-[#666] mb-2">Feed</h2>
          <div className="space-y-2">
            {(data.posts || []).map((p, i) => (
              <a key={i} href={p.url} target="_blank" rel="noreferrer"
                className="block glass rounded-xl p-3">
                <p className="text-sm">{p.title}</p>
                <p className="text-[11px] text-[#666] mt-1">r/{p.subreddit} · {p.score}</p>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
