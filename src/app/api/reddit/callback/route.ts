import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { users } from "@/lib/store";

export async function GET(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const code = req.nextUrl.searchParams.get("code");
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const user = await getSessionUser();
  if (!user || !code || !clientId || !clientSecret) {
    return NextResponse.redirect(`${appUrl}/app/world?error=reddit`);
  }

  const basic = btoa(`${clientId}:${clientSecret}`);
  const tokenRes = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${appUrl}/api/reddit/callback`,
    }),
  });
  if (!tokenRes.ok) {
    return NextResponse.redirect(`${appUrl}/app/world?error=reddit_token`);
  }
  const tokens = await tokenRes.json();
  const meRes = await fetch("https://oauth.reddit.com/api/v1/me", {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
      "User-Agent": "carstair/3.0 by carstair",
    },
  });
  const me = meRes.ok ? await meRes.json() : {};
  user.redditAccessToken = tokens.access_token;
  user.redditUsername = me.name || "reddit_user";
  users.set(user.id, user);
  return NextResponse.redirect(`${appUrl}/app/world?connected=1`);
}
