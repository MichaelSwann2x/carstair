"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import { useToast } from "@/lib/toast";

type Aircraft = {
  id: string;
  registration: string;
  type: string;
  status: string;
  base?: string;
  flightHours?: number;
  cycles?: number;
};

export default function AircraftPage() {
  const [rows, setRows] = useState<Aircraft[] | null>(null);
  const [reg, setReg] = useState("");
  const [type, setType] = useState("");
  const [base, setBase] = useState("");
  const { toast } = useToast();

  async function load() {
    const res = await api<{ data: Aircraft[] }>("/api/v1/aircraft");
    if (res.ok && res.data) setRows(res.data.data);
    else setRows([]);
  }

  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const res = await api("/api/v1/aircraft", {
      method: "POST",
      body: JSON.stringify({ registration: reg, type, base }),
    });
    if (!res.ok) {
      toast(res.error || "Failed", "error");
      return;
    }
    setReg("");
    setType("");
    setBase("");
    toast("Aircraft added", "success");
    load();
  }

  return (
    <>
      <header className="border-b border-[var(--border)] px-6 py-3 bg-white">
        <h1 className="font-medium">Aircraft</h1>
        <p className="text-xs text-[var(--muted)]">Online source of truth · critical status</p>
      </header>
      <div className="p-6 space-y-4 animate-fade-up">
        <form onSubmit={add} className="castair-card p-4 flex flex-wrap gap-2 items-end bg-white" aria-label="Add aircraft">
          <div>
            <label htmlFor="reg" className="text-xs text-[var(--muted)] block mb-1">Registration</label>
            <input id="reg" required className="border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm w-32" value={reg} onChange={(e) => setReg(e.target.value)} />
          </div>
          <div>
            <label htmlFor="type" className="text-xs text-[var(--muted)] block mb-1">Type</label>
            <input id="type" required className="border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm w-36" value={type} onChange={(e) => setType(e.target.value)} />
          </div>
          <div>
            <label htmlFor="base" className="text-xs text-[var(--muted)] block mb-1">Base</label>
            <input id="base" className="border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm w-24" value={base} onChange={(e) => setBase(e.target.value)} />
          </div>
          <button type="submit" className="bg-[var(--accent)] text-white px-3 py-1.5 rounded-lg text-sm font-medium">Add</button>
        </form>
        <div className="castair-card overflow-hidden bg-white">
          {rows === null ? (
            <div className="p-6 skeleton h-16 w-full" aria-busy="true" />
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--muted)]">No aircraft.</div>
          ) : (
            <table className="castair-table">
              <thead>
                <tr>
                  <th scope="col">Registration</th>
                  <th scope="col">Type</th>
                  <th scope="col">Status</th>
                  <th scope="col">Hours</th>
                  <th scope="col">Cycles</th>
                  <th scope="col">Base</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id}>
                    <td className="font-medium tabular-nums">{a.registration}</td>
                    <td>{a.type}</td>
                    <td>
                      <span className={a.status === "rts_pending" ? "status-rts" : a.status === "grounded" ? "status-critical" : a.status === "in_check" ? "status-open" : "text-[var(--muted)]"}>
                        {a.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="tabular-nums">{a.flightHours ?? "—"}</td>
                    <td className="tabular-nums">{a.cycles ?? "—"}</td>
                    <td className="text-[var(--muted)]">{a.base ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
