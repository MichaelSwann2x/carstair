import { NextRequest, NextResponse } from "next/server";
import { hashPassword, signSession, sessionCookie } from "@/lib/auth";
import { users, type UserRecord } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const login = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const hash = await hashPassword(password);

  let found: UserRecord | null = null;
  for (const u of users.values()) {
    if (u.email === login || u.username === login) {
      found = u;
      break;
    }
  }

  // Fallback: accept login when Worker memory is empty by re-issuing session from credentials hash match stored in cookie register is impossible;
  // so if no server user, return clear error to sign up again OR use client-held credentials path.
  if (!found) {
    // Allow soft recovery: if password provided, create ephemeral session from login string only when FORCE not set
    return NextResponse.json(
      { error: "Account not found on this instance. Sign up again (data is per-deploy memory until KV is added)." },
      { status: 401 }
    );
  }
  if (found.passwordHash !== hash) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signSession({
    id: found.id,
    email: found.email,
    username: found.username,
    name: found.name,
    phone: found.phone,
    avatar: found.avatar,
    tradingViewUsername: found.tradingViewUsername,
    tradingViewConnected: found.tradingViewConnected,
    redditUsername: found.redditUsername,
  });
  const res = NextResponse.json({
    user: {
      id: found.id,
      email: found.email,
      username: found.username,
      name: found.name,
      avatar: found.avatar || null,
    },
  });
  res.cookies.set("cs_session", token, sessionCookie(token));
  return res;
}
