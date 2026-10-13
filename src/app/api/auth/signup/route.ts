import { NextRequest, NextResponse } from "next/server";
import { hashPassword, signSession } from "@/lib/auth";
import { users, usernames, type UserRecord } from "@/lib/store";
import { uid } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body.email || "").trim().toLowerCase();
  const username = String(body.username || "").trim().toLowerCase();
  const password = String(body.password || "");
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();

  if (!email || !username || !password) {
    return NextResponse.json({ error: "Email, username and password required" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password min 8 characters" }, { status: 400 });
  }
  if (!/^[a-z0-9_]{3,24}$/.test(username)) {
    return NextResponse.json({ error: "Username: 3–24 chars, a-z, 0-9, underscore" }, { status: 400 });
  }
  if (usernames.has(username)) {
    return NextResponse.json({ error: "Username taken" }, { status: 409 });
  }
  for (const u of users.values()) {
    if (u.email === email) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
  }

  const id = uid();
  const user: UserRecord = {
    id,
    email,
    username,
    passwordHash: await hashPassword(password),
    name,
    phone,
    provider: "email",
    createdAt: Date.now(),
  };
  users.set(id, user);
  usernames.set(username, id);

  const token = await signSession(id);
  const res = NextResponse.json({
    user: { id, email, username, name, avatar: null, provider: "email" },
  });
  res.cookies.set("cs_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
