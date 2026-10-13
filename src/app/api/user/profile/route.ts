import { NextRequest, NextResponse } from "next/server";
import { readSession, signSession, sessionCookie } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  const user = await readSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (body.username !== undefined) {
    const next = String(body.username).trim().toLowerCase();
    if (!/^[a-z0-9_]{3,24}$/.test(next)) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }
    user.username = next;
  }
  if (body.name !== undefined) user.name = String(body.name).slice(0, 80);
  if (body.avatar !== undefined) user.avatar = String(body.avatar).slice(0, 200_000);
  if (body.tradingViewUsername !== undefined) {
    user.tradingViewUsername = String(body.tradingViewUsername).trim().replace(/^@/, "").slice(0, 64);
    user.tradingViewConnected = !!user.tradingViewUsername;
  }

  const token = await signSession(user);
  const res = NextResponse.json({ user });
  res.cookies.set("cs_session", token, sessionCookie(token));
  return res;
}
