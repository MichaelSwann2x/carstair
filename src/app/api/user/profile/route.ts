import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { users, usernames } from "@/lib/store";

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (body.username !== undefined) {
    const next = String(body.username).trim().toLowerCase();
    if (!/^[a-z0-9_]{3,24}$/.test(next)) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }
    if (next !== user.username && usernames.has(next)) {
      return NextResponse.json({ error: "Username taken" }, { status: 409 });
    }
    usernames.delete(user.username);
    usernames.set(next, user.id);
    user.username = next;
  }
  if (body.name !== undefined) user.name = String(body.name).slice(0, 80);
  if (body.avatar !== undefined) user.avatar = String(body.avatar).slice(0, 500_000);
  if (body.tradingViewUsername !== undefined) {
    user.tradingViewUsername = String(body.tradingViewUsername).trim().slice(0, 64);
  }
  users.set(user.id, user);
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      avatar: user.avatar || null,
      tradingViewUsername: user.tradingViewUsername || null,
    },
  });
}
