"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<{ username: string; name?: string; email: string; avatar?: string | null } | null>(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [tv, setTv] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      setUser(d.user);
      setUsername(d.user?.username || "");
      setName(d.user?.name || "");
      setTv(d.user?.tradingViewUsername || "");
    });
  }, []);

  async function save() {
    setMsg("");
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, name, tradingViewUsername: tv }),
    });
    const data = await res.json();
    if (!res.ok) { setMsg(data.error || "Failed"); return; }
    setUser(data.user);
    setMsg("Saved");
  }

  function onAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 400000) { setMsg("Image max ~400KB"); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: String(reader.result || "") }),
      });
      const data = await res.json();
      if (res.ok) { setUser(data.user); setMsg("Avatar updated"); }
    };
    reader.readAsDataURL(file);
  }

  if (!user) return <p className="text-sm text-[#8a8a96]">Loading…</p>;

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-light">Profile</h1>
      <div className="mt-6 glass rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#1a1a1f] overflow-hidden border border-[#2a2a32]">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-[#555]">?</div>
            )}
          </div>
          <label className="text-xs gloss-btn px-3 py-1.5 rounded-lg cursor-pointer">
            Change photo
            <input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
          </label>
        </div>
        <div>
          <label className="text-[11px] text-[#8a8a96]">Email</label>
          <p className="text-sm">{user.email}</p>
        </div>
        <div>
          <label className="text-[11px] text-[#8a8a96]">Username</label>
          <input className="mt-1 w-full px-3 py-2 text-sm" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label className="text-[11px] text-[#8a8a96]">Display name</label>
          <input className="mt-1 w-full px-3 py-2 text-sm" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-[11px] text-[#8a8a96]">TradingView username</label>
          <input className="mt-1 w-full px-3 py-2 text-sm" value={tv} onChange={(e) => setTv(e.target.value)} />
        </div>
        {msg && <p className="text-xs text-[#8a8a96]">{msg}</p>}
        <button onClick={save} className="gloss-btn-primary text-xs px-4 py-2 rounded-lg">Save</button>
      </div>
    </div>
  );
}
