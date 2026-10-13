"use client";

import { useEffect, useState } from "react";
import { loadJSON, saveJSON } from "@/lib/client-store";

type Post = { id: string; username: string; kind: string; title: string; body: string };

export default function BoardPage() {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState({ kind: "chat", title: "", body: "" });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        setUserId(d.user?.id || "");
        setUsername(d.user?.username || "");
        setPosts(loadJSON("global", "board", []));
      })
      .catch(() => {});
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const post: Post = {
      id: Math.random().toString(36).slice(2),
      username: username || "user",
      kind: form.kind,
      title: form.title,
      body: form.body,
    };
    const next = [post, ...posts].slice(0, 200);
    setPosts(next);
    saveJSON("global", "board", next);
    fetch("/api/board", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).catch(() => {});
    setForm({ kind: "chat", title: "", body: "" });
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-light mb-6">Board</h1>
      <form onSubmit={submit} className="card p-4 space-y-2 mb-6">
        <select className="w-full px-3 py-2 text-sm" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
          <option value="idea">Idea</option>
          <option value="paper">Paper</option>
          <option value="model">Model</option>
          <option value="chat">Chat</option>
        </select>
        <input className="w-full px-3 py-2 text-sm" placeholder="Title" required value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="w-full px-3 py-2 text-sm min-h-[90px]" required value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <button type="submit" className="btn btn-primary">Post</button>
      </form>
      <div className="space-y-3">
        {posts.map((p) => (
          <article key={p.id} className="card p-4">
            <p className="text-[11px] text-zinc-600">{p.kind} · @{p.username}</p>
            <p className="text-sm mt-1">{p.title}</p>
            <p className="text-xs text-zinc-400 mt-2 whitespace-pre-wrap">{p.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
