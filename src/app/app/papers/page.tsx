"use client";

import { useEffect, useState } from "react";
import { PAPERS, SSRN_HOME, ssrnUrl } from "@/lib/papers-catalog";
import { loadJSON, saveJSON } from "@/lib/client-store";

type Note = { id: string; paperId: string; title: string; notes: string };

export default function PapersPage() {
  const [userId, setUserId] = useState("");
  const [mine, setMine] = useState<Note[]>([]);
  const [active, setActive] = useState<(typeof PAPERS)[0] | null>(null);
  const [notes, setNotes] = useState("");
  const [view, setView] = useState<Note | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        const id = d.user?.id;
        if (!id) return;
        setUserId(id);
        setMine(loadJSON(id, "papers", []));
      })
      .catch(() => {});
  }, []);

  function saveNotes() {
    if (!active || !userId) return;
    const existing = mine.find((n) => n.paperId === active.id);
    let next: Note[];
    if (existing) {
      next = mine.map((n) =>
        n.paperId === active.id ? { ...n, notes, title: active.title } : n
      );
    } else {
      next = [
        {
          id: Math.random().toString(36).slice(2),
          paperId: active.id,
          title: active.title,
          notes,
        },
        ...mine,
      ];
    }
    setMine(next);
    saveJSON(userId, "papers", next);
  }

  return (
    <div className="flex gap-4">
      <aside className="w-52 shrink-0 card p-3 hidden md:block">
        <p className="text-[11px] text-zinc-500 mb-2 uppercase tracking-wide">Notes</p>
        {mine.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => {
              setView(n);
              setActive(null);
            }}
            className="block w-full text-left text-xs px-2 py-1.5 text-zinc-500 hover:text-zinc-200 truncate"
          >
            {n.title}
          </button>
        ))}
      </aside>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h1 className="text-2xl font-light">Papers</h1>
          <a href={SSRN_HOME} target="_blank" rel="noreferrer" className="text-xs text-zinc-500 hover:text-white">
            SSRN
          </a>
        </div>

        {view && (
          <div className="card p-4 mb-4">
            <p className="text-sm">{view.title}</p>
            <pre className="text-xs text-zinc-400 mt-3 whitespace-pre-wrap font-sans">{view.notes}</pre>
            <button type="button" className="btn btn-ghost text-xs mt-3" onClick={() => setView(null)}>Close</button>
          </div>
        )}

        {active && (
          <div className="card p-4 mb-4 space-y-3">
            <p className="text-sm">{active.title}</p>
            <a href={ssrnUrl(active.abstractId)} target="_blank" rel="noreferrer" className="text-xs text-zinc-400 hover:text-white">
              Open on SSRN
            </a>
            <textarea className="w-full px-3 py-2 text-sm min-h-[140px]" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <div className="flex gap-2">
              <button type="button" className="btn btn-primary" onClick={saveNotes}>Save</button>
              <button type="button" className="btn btn-ghost" onClick={() => setActive(null)}>Back</button>
            </div>
          </div>
        )}

        {!active && !view && (
          <div className="space-y-2">
            {PAPERS.map((p) => (
              <div key={p.id} className="card p-4 flex flex-wrap justify-between gap-3">
                <div>
                  <p className="text-sm">{p.title}</p>
                  <p className="text-xs text-zinc-600 mt-1">{p.authors} · {p.year}</p>
                </div>
                <div className="flex gap-2">
                  <a href={ssrnUrl(p.abstractId)} target="_blank" rel="noreferrer" className="btn btn-ghost text-xs">SSRN</a>
                  <button type="button" className="btn btn-primary text-xs" onClick={() => { setActive(p); setNotes(""); setView(null); }}>Notes</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
