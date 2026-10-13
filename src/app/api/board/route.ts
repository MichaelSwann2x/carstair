import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { board, type BoardPost } from "@/lib/store";
import { uid } from "@/lib/utils";

export async function GET() {
  const posts = [...board].sort((a, b) => b.createdAt - a.createdAt).slice(0, 100);
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const kind = ["idea", "paper", "model", "chat"].includes(body.kind) ? body.kind : "chat";
  const title = String(body.title || "").slice(0, 160);
  const text = String(body.body || "").slice(0, 8000);
  if (!title || !text) {
    return NextResponse.json({ error: "Title and body required" }, { status: 400 });
  }
  const post: BoardPost = {
    id: uid(),
    userId: user.id,
    username: user.username,
    kind,
    title,
    body: text,
    createdAt: Date.now(),
  };
  board.unshift(post);
  if (board.length > 500) board.length = 500;
  return NextResponse.json({ post });
}
