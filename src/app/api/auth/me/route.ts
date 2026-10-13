import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar || null,
      provider: user.provider,
      tradingViewUsername: user.tradingViewUsername || null,
      redditUsername: user.redditUsername || null,
    },
  });
}
