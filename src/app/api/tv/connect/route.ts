import { NextRequest, NextResponse } from "next/server";
import { readSession, signSession, sessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await readSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const username = String(body.username || "").trim().replace(/^@/, "").slice(0, 64);
  if (!username) return NextResponse.json({ error: "Username required" }, { status: 400 });
  user.tradingViewUsername = username;
  user.tradingViewConnected = true;
  const token = await signSession(user);
  const res = NextResponse.json({
    connected: true,
    username,
    profileUrl: `https://www.tradingview.com/u/${encodeURIComponent(username)}/`,
  });
  res.cookies.set("cs_session", token, sessionCookie(token));
  return res;
}

export async function DELETE() {
  const user = await readSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  user.tradingViewConnected = false;
  user.tradingViewUsername = undefined;
  const token = await signSession(user);
  const res = NextResponse.json({ connected: false });
  res.cookies.set("cs_session", token, sessionCookie(token));
  return res;
}
