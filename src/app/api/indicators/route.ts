import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { BUILTIN_STUDIES } from "@/lib/indicators";
import { getUserIndicators, setUserIndicators, type UserIndicator } from "@/lib/store";
import { uid } from "@/lib/utils";

export async function GET() {
  const user = await getSessionUser();
  const mine = user ? getUserIndicators(user.id) : [];
  return NextResponse.json({ builtin: BUILTIN_STUDIES, mine });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const name = String(body.name || "My indicator").slice(0, 80);
  const studyId = String(body.studyId || "custom").slice(0, 80);
  const script = body.script != null ? String(body.script).slice(0, 50_000) : undefined;
  const list = getUserIndicators(user.id);
  const ind: UserIndicator = {
    id: uid(),
    userId: user.id,
    name,
    studyId,
    script,
    updatedAt: Date.now(),
  };
  list.unshift(ind);
  setUserIndicators(user.id, list);
  return NextResponse.json({ indicator: ind });
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  setUserIndicators(
    user.id,
    getUserIndicators(user.id).filter((i) => i.id !== id)
  );
  return NextResponse.json({ ok: true });
}
