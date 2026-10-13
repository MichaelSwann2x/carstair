import { NextRequest, NextResponse } from "next/server";
import { hashPassword, signSession, sessionCookie } from "@/lib/auth";
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
    return NextResponse.json({ error: "Username: 3–24 chars, a-z 0-9 _" }, { status: 400 });
  }

  const id = uid();
  const passwordHash = await hashPassword(password);
  const user: UserRecord = {
    id,
    email,
    username,
    passwordHash,
    name,
    phone,
    provider: "email",
    createdAt: Date.now(),
  };
  users.set(id, user);
  usernames.set(username, id);

  const token = await signSession({
    id,
    email,
    username,
    name,
    phone,
  });
  const res = NextResponse.json({
    user: { id, email, username, name, avatar: null },
  });
  res.cookies.set("cs_session", token, sessionCookie(token));
  return res;
}
