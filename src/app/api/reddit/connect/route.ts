import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  if (!clientId) {
    return NextResponse.json(
      {
        error:
          "Reddit OAuth not configured. Set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET.",
        setup: "https://www.reddit.com/prefs/apps",
      },
      { status: 503 }
    );
  }
  const redirectUri = `${appUrl}/api/reddit/callback`;
  const state = Math.random().toString(36).slice(2);
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    state,
    redirect_uri: redirectUri,
    duration: "temporary",
    scope: "identity read mysubreddits",
  });
  return NextResponse.redirect(`https://www.reddit.com/api/v1/authorize?${params}`);
}
