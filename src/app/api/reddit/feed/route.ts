import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.redditAccessToken) {
    return NextResponse.json({ connected: false, posts: [] });
  }
  try {
    const res = await fetch("https://oauth.reddit.com/subreddits/mine/subscriber?limit=25",
      {
        headers: {
          Authorization: `Bearer ${user.redditAccessToken}`,
          "User-Agent": "carstair/3.0 by carstair",
        },
      }
    );
    if (!res.ok) {
      return NextResponse.json({ connected: true, posts: [], error: "Reddit API error" });
    }
    const data = await res.json();
    const subs = (data.data?.children || []).map((c: { data: { display_name: string; url: string; public_description: string } }) => ({
      name: c.data.display_name,
      url: `https://reddit.com${c.data.url}`,
      description: c.data.public_description || "",
    }));

    const feedRes = await fetch("https://oauth.reddit.com/subreddits/mine/subscriber/hot?limit=30",
      {
        headers: {
          Authorization: `Bearer ${user.redditAccessToken}`,
          "User-Agent": "carstair/3.0 by carstair",
        },
      }
    );
    let posts: { title: string; subreddit: string; url: string; score: number }[] = [];
    if (feedRes.ok) {
      const feed = await feedRes.json();
      posts = (feed.data?.children || []).map((c: { data: { title: string; subreddit: string; permalink: string; score: number } }) => ({
        title: c.data.title,
        subreddit: c.data.subreddit,
        url: `https://reddit.com${c.data.permalink}`,
        score: c.data.score,
      }));
    }

    return NextResponse.json({
      connected: true,
      username: user.redditUsername,
      subs,
      posts,
    });
  } catch {
    return NextResponse.json({ connected: true, posts: [], error: "Failed to load" });
  }
}
