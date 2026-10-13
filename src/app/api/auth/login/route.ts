import { NextRequest, NextResponse } from "next/server";
import { hashPassword, signSession } from "@/lib/auth";
import { users } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const login = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const hash = await hashPassword(password);

  let found = null as ReturnType<typeof users.get>;
  for (const u of users.values()) {
    if (u.email === login || u.username === login) {
      found = u;
      break;
    }
  }
  if (!found || found.passwordHash !== hash) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signSession(found.id);
  const res = NextResponse.json({
    user: {
      id: found.id,
      email: found.email,
      username: found.username,
      name: found.name,
      avatar: found.avatar || null,
      provider: found.provider,
    },
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
