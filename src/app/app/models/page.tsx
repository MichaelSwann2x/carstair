"use client";

import { useEffect, useState } from "react";
import { MODEL_CATEGORIES, SEED_MODELS } from "@/lib/models-catalog";
import { loadJSON, saveJSON } from "@/lib/client-store";

type Mine = { id: string; title: string; category: string; body: string };

export default function ModelsPage() {
  const [userId, setUserId] = useState("");
  const [mine, setMine] = useState<Mine[]>([]);
  const [selected, setSelected] = useState<Mine | null>(null);
  const [filter, setFilter] = useState("all");
  const [draft, setDraft] = useState({ title: "", category: "technical", body: "" });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        const id = d.user?.id;
        if (!id) return;
        setUserId(id);
        setMine(loadJSON(id, "models", []));
      })
      .catch(() => {});
  }, []);

  function persist(next: Mine[]) {
    setMine(next);
    if (userId) saveJSON(userId, "models", next);
  }

  function fork(seed: (typeof SEED_MODELS)[0]) {
    const m: Mine = {
      id: Math.random().toString(36).slice(2),
      title: seed.title,
      category: seed.category,
      body: seed.summary + "\n\n",
    };
    const next = [m, ...mine];
    persist(next);
    setSelected(m);
  }

  function create() {
    const m: Mine = {
      id: Math.random().toString(36).slice(2),
      title: draft.title || "Untitled",
      category: draft.category,
      body: draft.body,
    };
    persist([m, ...mine]);
    setSelected(m);
    setDraft({ title: "", category: "technical", body: "" });
  }

  function saveSelected() {
    if (!selected) return;
    persist(mine.map((m) => (m.id === selected.id ? selected : m)));
  }

  const seeds =
    filter === "all" ? SEED_MODELS : SEED_MODELS.filter((s) => s.category === filter);

  return (
    <div className="flex gap-4 min-h-[60vh]">
      <aside className="w-52 shrink-0 card p-3 hidden md:block">
        <p className="text-[11px] text-zinc-500 mb-2 uppercase tracking-wide">Yours</p>
        {mine.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setSelected(m)}
            className={`block w-full text-left text-xs px-2 py-1.5 rounded truncate ${
              selected?.id === m.id ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-200"
            }`}
          >
            {m.title}
          </button>
        ))}
      </aside>

      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-light">Models</h1>

        {selected ? (
          <div className="mt-4 card p-4 space-y-3">
            <input
              className="w-full px-3 py-2 text-sm"
              value={selected.title}
              onChange={(e) => setSelected({ ...selected, title: e.target.value })}
            />
            <textarea
              className="w-full px-3 py-2 text-sm min-h-[200px]"
              value={selected.body}
              onChange={(e) => setSelected({ ...selected, body: e.target.value })}
            />
            <div className="flex gap-2">
              <button type="button" className="btn btn-primary" onClick={saveSelected}>Save</button>
              <button type="button" className="btn btn-ghost" onClick={() => setSelected(null)}>Back</button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => setFilter("all")} className={`text-xs px-2 py-1 rounded ${filter === "all" ? "bg-white/10" : "text-zinc-500"}`}>All</button>
              {MODEL_CATEGORIES.map((c) => (
                <button key={c.id} type="button" onClick={() => setFilter(c.id)}
                  className={`text-xs px-2 py-1 rounded ${filter === c.id ? "bg-white/10" : "text-zinc-500"}`}>
                  {c.name.split(" /")[0]}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-2">
              {MODEL_CATEGORIES.filter((c) => filter === "all" || c.id === filter).map((c) => (
                <div key={c.id} className="card p-4">
                  <p className="text-sm">{c.name}</p>
                  <p className="text-xs text-zinc-500 mt-1">{c.what}</p>
                  <p className="text-xs text-zinc-600 mt-1">{c.example}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-2">
              {seeds.map((s) => (
                <div key={s.id} className="card p-4">
                  <p className="text-sm">{s.title}</p>
                  <p className="text-xs text-zinc-500 mt-1">{s.summary}</p>
                  <button type="button" className="btn btn-ghost text-xs mt-3" onClick={() => fork(s)}>Fork</button>
                </div>
              ))}
            </div>

            <div className="mt-6 card p-4 space-y-2">
              <input className="w-full px-3 py-2 text-sm" placeholder="Title" value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
              <select className="w-full px-3 py-2 text-sm" value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
                {MODEL_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <textarea className="w-full px-3 py-2 text-sm min-h-[100px]" placeholder="Rules"
                value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
              <button type="button" className="btn btn-primary" onClick={create}>Save</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
