"use client";

import { useEffect, useState } from "react";

type Cat = { id: string; name: string; what: string; use: string; example: string };
type Seed = { id: string; category: string; title: string; summary: string };
type Mine = { id: string; title: string; category: string; body: string };

export default function ModelsPage() {
  const [categories, setCategories] = useState<Cat[]>([]);
  const [catalog, setCatalog] = useState<Seed[]>([]);
  const [mine, setMine] = useState<Mine[]>([]);
  const [selected, setSelected] = useState<Mine | null>(null);
  const [filter, setFilter] = useState("all");
  const [draft, setDraft] = useState({ title: "", category: "technical", body: "" });

  function load() {
    fetch("/api/models")
      .then((r) => r.json())
      .then((d) => {
        setCategories(d.categories || []);
        setCatalog(d.catalog || []);
        setMine(d.mine || []);
      });
  }

  useEffect(() => { load(); }, []);

  async function saveNew(base?: Seed) {
    const res = await fetch("/api/models", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: base ? `My: ${base.title}` : draft.title || "Untitled model",
        category: base?.category || draft.category,
        body: base ? `${base.summary}\n\n--- Your improvements ---\n` : draft.body,
        baseModelId: base?.id,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      load();
      setSelected(data.model);
      setDraft({ title: "", category: "technical", body: "" });
    }
  }

  async function saveEdit() {
    if (!selected) return;
    await fetch("/api/models", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected),
    });
    load();
  }

  const filtered = filter === "all" ? catalog : catalog.filter((c) => c.category === filter);

  return (
    <div className="flex gap-4 min-h-[70vh]">
      <aside className="w-56 shrink-0 glass rounded-xl p-3 hidden md:flex flex-col">
        <p className="text-[11px] uppercase tracking-wider text-[#666] mb-2">Your models</p>
        <div className="flex-1 overflow-y-auto space-y-1">
          {mine.length === 0 && <p className="text-[11px] text-[#555]">Save or fork a model here.</p>}
          {mine.map((m) => (
            <button key={m.id} onClick={() => setSelected(m)}
              className={`w-full text-left text-xs px-2 py-1.5 rounded-lg truncate ${
                selected?.id === m.id ? "bg-[#1a1a1f] text-white" : "text-[#8a8a96] hover:text-white"
              }`}>{m.title}</button>
          ))}
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-light">Models</h1>
        {selected ? (
          <div className="mt-4 glass rounded-xl p-4 space-y-3">
            <input className="w-full px-3 py-2 text-sm" value={selected.title}
              onChange={(e) => setSelected({ ...selected, title: e.target.value })} />
            <textarea className="w-full px-3 py-2 text-sm min-h-[220px]" value={selected.body}
              onChange={(e) => setSelected({ ...selected, body: e.target.value })} />
            <div className="flex gap-2">
              <button onClick={saveEdit} className="gloss-btn-primary px-4 py-2 rounded-lg text-xs">Save</button>
              <button onClick={() => setSelected(null)} className="gloss-btn px-4 py-2 rounded-lg text-xs">Back</button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => setFilter("all")} className={`text-[11px] px-2 py-1 rounded ${filter === "all" ? "bg-[#1a1a1f]" : "text-[#8a8a96]"}`}>All</button>
              {categories.map((c) => (
                <button key={c.id} onClick={() => setFilter(c.id)}
                  className={`text-[11px] px-2 py-1 rounded ${filter === c.id ? "bg-[#1a1a1f]" : "text-[#8a8a96]"}`}>{c.name.split(" /")[0]}</button>
              ))}
            </div>
            <div className="mt-4 grid gap-3">
              {categories.filter((c) => filter === "all" || c.id === filter).map((c) => (
                <div key={c.id} className="glass rounded-xl p-4">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-[11px] text-[#8a8a96] mt-1">{c.what}</p>
                  <p className="text-[11px] text-[#666] mt-1">Typical: {c.use}</p>
                  <p className="text-[11px] text-[#666]">Example: {c.example}</p>
                </div>
              ))}
            </div>
            <h2 className="text-sm text-[#8a8a96] mt-8 mb-3">Starter models</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {filtered.map((m) => (
                <div key={m.id} className="glass rounded-xl p-4">
                  <p className="text-sm font-medium">{m.title}</p>
                  <p className="text-[11px] text-[#8a8a96] mt-1">{m.summary}</p>
                  <button onClick={() => saveNew(m)} className="mt-3 text-[11px] gloss-btn px-3 py-1.5 rounded-lg">Fork to my models</button>
                </div>
              ))}
            </div>
            <div className="mt-8 glass rounded-xl p-4">
              <p className="text-sm font-medium mb-3">Create model</p>
              <input placeholder="Title" className="w-full px-3 py-2 text-sm mb-2" value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
              <select className="w-full px-3 py-2 text-sm mb-2" value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <textarea placeholder="Rules, parameters, notes…" className="w-full px-3 py-2 text-sm min-h-[120px] mb-2"
                value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
              <button onClick={() => saveNew()} className="gloss-btn-primary px-4 py-2 rounded-lg text-xs">Save to my models</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
