import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { users } from "@/lib/store";

/** Link TradingView username (same pattern as Reddit connect — free widget + profile). */
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const username = String(body.username || "").trim().replace(/^@/, "").slice(0, 64);
  if (!username) {
    return NextResponse.json({ error: "TradingView username required" }, { status: 400 });
  }
  user.tradingViewUsername = username;
  user.tradingViewConnected = true;
  users.set(user.id, user);
  return NextResponse.json({
    connected: true,
    username,
    profileUrl: `https://www.tradingview.com/u/${encodeURIComponent(username)}/`,
  });
}

export async function DELETE() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  user.tradingViewConnected = false;
  user.tradingViewUsername = undefined;
  users.set(user.id, user);
  return NextResponse.json({ connected: false });
}
