import { NextRequest, NextResponse } from "next/server";
import { signSession } from "@/lib/auth";
import { users, usernames, type UserRecord } from "@/lib/store";
import { uid } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!code || !clientId || !clientSecret) {
    return NextResponse.redirect(`${appUrl}/login?error=google_config`);
  }

  const redirectUri = `${appUrl}/api/auth/google/callback`;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) {
    return NextResponse.redirect(`${appUrl}/login?error=google_token`);
  }
  const tokens = await tokenRes.json();
  const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!profileRes.ok) {
    return NextResponse.redirect(`${appUrl}/login?error=google_profile`);
  }
  const profile = await profileRes.json();
  const email = String(profile.email || "").toLowerCase();
  const googleId = String(profile.id || "");

  let user: UserRecord | undefined;
  for (const u of users.values()) {
    if (u.googleId === googleId || u.email === email) {
      user = u;
      break;
    }
  }

  if (!user) {
    let base = (email.split("@")[0] || "user").replace(/[^a-z0-9_]/gi, "").toLowerCase().slice(0, 16);
    if (!base) base = "user";
    let username = base;
    let n = 0;
    while (usernames.has(username)) {
      n += 1;
      username = `${base}${n}`;
    }
    const id = uid();
    user = {
      id,
      email,
      username,
      name: profile.name || "",
      avatar: profile.picture || "",
      provider: "google",
      googleId,
      createdAt: Date.now(),
    };
    users.set(id, user);
    usernames.set(username, id);
  } else {
    user.googleId = googleId;
    user.provider = user.provider === "email" ? user.provider : "google";
    if (profile.picture && !user.avatar) user.avatar = profile.picture;
    users.set(user.id, user);
  }

  const token = await signSession(user.id);
  const res = NextResponse.redirect(`${appUrl}/app`);
  res.cookies.set("cs_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
