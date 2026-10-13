"use client";

import { useEffect, useState } from "react";

type Post = { id: string; username: string; kind: string; title: string; body: string };

export default function BoardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState({ kind: "chat", title: "", body: "" });

  function load() {
    fetch("/api/board").then((r) => r.json()).then((d) => setPosts(d.posts || []));
  }
  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/board", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ kind: "chat", title: "", body: "" });
      load();
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-light">Board</h1>
      <p className="text-xs text-[#8a8a96] mt-1 mb-6">Ideas, papers, models, general chat.</p>
      <form onSubmit={submit} className="glass rounded-xl p-4 space-y-2 mb-6">
        <select className="w-full px-3 py-2 text-sm" value={form.kind}
          onChange={(e) => setForm({ ...form, kind: e.target.value })}>
          <option value="idea">Idea</option>
          <option value="paper">Paper</option>
          <option value="model">Model</option>
          <option value="chat">Chat</option>
        </select>
        <input className="w-full px-3 py-2 text-sm" placeholder="Title" required
          value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="w-full px-3 py-2 text-sm min-h-[100px]" placeholder="Write…" required
          value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <button type="submit" className="gloss-btn-primary text-xs px-4 py-2 rounded-lg">Post</button>
      </form>
      <div className="space-y-3">
        {posts.map((p) => (
          <article key={p.id} className="glass rounded-xl p-4">
            <div className="flex gap-2 text-[11px] text-[#666]">
              <span className="uppercase">{p.kind}</span><span>·</span><span>@{p.username}</span>
            </div>
            <h2 className="text-sm font-medium mt-1">{p.title}</h2>
            <p className="text-xs text-[#aaa] mt-2 whitespace-pre-wrap">{p.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
