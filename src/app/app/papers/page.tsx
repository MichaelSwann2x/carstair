"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

type Paper = { id: string; title: string; authors: string; year: string; url: string };
type Note = { id: string; paperId: string; title: string; notes: string };

export default function PapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [mine, setMine] = useState<Note[]>([]);
  const [ssrnHome, setSsrnHome] = useState("https://www.ssrn.com/");
  const [active, setActive] = useState<Paper | null>(null);
  const [notes, setNotes] = useState("");
  const [viewNote, setViewNote] = useState<Note | null>(null);

  function load() {
    fetch("/api/papers").then((r) => r.json()).then((d) => {
      setPapers(d.papers || []);
      setMine(d.mine || []);
      if (d.ssrnHome) setSsrnHome(d.ssrnHome);
    });
  }
  useEffect(() => { load(); }, []);

  async function saveNotes() {
    if (!active) return;
    await fetch("/api/papers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paperId: active.id, title: active.title, notes }),
    });
    load();
  }

  return (
    <div className="flex gap-4 min-h-[70vh]">
      <aside className="w-56 shrink-0 glass rounded-xl p-3 hidden md:flex flex-col">
        <p className="text-[11px] uppercase tracking-wider text-[#666] mb-2">Your notes</p>
        <div className="overflow-y-auto space-y-1 flex-1">
          {mine.map((n) => (
            <button key={n.id} onClick={() => { setViewNote(n); setActive(null); }}
              className="w-full text-left text-xs px-2 py-1.5 rounded-lg text-[#8a8a96] hover:text-white truncate">{n.title}</button>
          ))}
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-light">Papers</h1>
          <a href={ssrnHome} target="_blank" rel="noreferrer" className="text-[11px] text-[#8a8a96] hover:text-white inline-flex items-center gap-1">
            SSRN <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-[11px] text-[#555] mt-1 mb-4">Links to SSRN abstracts. Full text stays on SSRN.</p>
        {viewNote && (
          <div className="glass rounded-xl p-4 mb-4">
            <p className="text-sm font-medium">{viewNote.title}</p>
            <pre className="text-xs text-[#aaa] mt-3 whitespace-pre-wrap font-sans">{viewNote.notes}</pre>
            <button onClick={() => setViewNote(null)} className="mt-3 text-xs gloss-btn px-3 py-1.5 rounded-lg">Close</button>
          </div>
        )}
        {active && (
          <div className="glass rounded-xl p-4 mb-4 space-y-3">
            <p className="text-sm font-medium">{active.title}</p>
            <a href={active.url} target="_blank" rel="noreferrer" className="text-xs text-[#8a8a96] hover:text-white inline-flex items-center gap-1">Open on SSRN <ExternalLink className="w-3 h-3" /></a>
            <textarea className="w-full px-3 py-2 text-sm min-h-[160px]" placeholder="Your notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={saveNotes} className="gloss-btn-primary text-xs px-3 py-1.5 rounded-lg">Save notes</button>
              <button onClick={() => setActive(null)} className="gloss-btn text-xs px-3 py-1.5 rounded-lg">Back</button>
            </div>
          </div>
        )}
        {!active && !viewNote && (
          <div className="grid gap-2">
            {papers.map((p) => (
              <div key={p.id} className="glass rounded-xl p-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{p.title}</p>
                  <p className="text-[11px] text-[#666] mt-1">{p.authors} · {p.year}</p>
                </div>
                <div className="flex gap-2">
                  <a href={p.url} target="_blank" rel="noreferrer" className="text-[11px] gloss-btn px-3 py-1.5 rounded-lg">SSRN</a>
                  <button onClick={() => { setActive(p); setNotes(""); setViewNote(null); }} className="text-[11px] gloss-btn-primary px-3 py-1.5 rounded-lg">Notes</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
