"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<{
    username: string;
    name?: string;
    email: string;
    avatar?: string;
    tradingViewUsername?: string;
  } | null>(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [tv, setTv] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        setUser(d.user);
        setUsername(d.user?.username || "");
        setName(d.user?.name || "");
        setTv(d.user?.tradingViewUsername || "");
      });
  }, []);

  async function save() {
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, name, tradingViewUsername: tv }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "Failed");
      return;
    }
    setUser(data.user);
    setMsg("Saved");
  }

  function onAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || file.size > 300000) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: String(reader.result) }),
      });
      const data = await res.json();
      if (res.ok) setUser(data.user);
    };
    reader.readAsDataURL(file);
  }

  if (!user) return null;

  return (
    <div className="max-w-sm">
      <h1 className="text-2xl font-light mb-6">Profile</h1>
      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-white/5 border border-white/10">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : null}
          </div>
          <label className="btn btn-ghost text-xs cursor-pointer">
            Photo
            <input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
          </label>
        </div>
        <div>
          <p className="text-[11px] text-zinc-500">Email</p>
          <p className="text-sm">{user.email}</p>
        </div>
        <div>
          <label className="text-[11px] text-zinc-500">Username</label>
          <input className="mt-1 w-full px-3 py-2 text-sm" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label className="text-[11px] text-zinc-500">Name</label>
          <input className="mt-1 w-full px-3 py-2 text-sm" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-[11px] text-zinc-500">TradingView</label>
          <input className="mt-1 w-full px-3 py-2 text-sm" value={tv} onChange={(e) => setTv(e.target.value)} />
        </div>
        {msg && <p className="text-xs text-zinc-500">{msg}</p>}
        <button type="button" className="btn btn-primary" onClick={save}>Save</button>
      </div>
    </div>
  );
}
