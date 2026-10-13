import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { MODEL_CATEGORIES, SEED_MODELS } from "@/lib/models-catalog";
import { getUserModels, setUserModels, type UserModel } from "@/lib/store";
import { uid } from "@/lib/utils";

export async function GET() {
  const user = await getSessionUser();
  const mine = user ? getUserModels(user.id) : [];
  return NextResponse.json({
    categories: MODEL_CATEGORIES,
    catalog: SEED_MODELS,
    mine,
  });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const title = String(body.title || "Untitled").slice(0, 120);
  const category = String(body.category || "technical");
  const text = String(body.body || "").slice(0, 20_000);
  const baseModelId = body.baseModelId ? String(body.baseModelId) : undefined;
  const list = getUserModels(user.id);
  const m: UserModel = {
    id: uid(),
    userId: user.id,
    title,
    category,
    body: text,
    baseModelId,
    updatedAt: Date.now(),
  };
  list.unshift(m);
  setUserModels(user.id, list);
  return NextResponse.json({ model: m });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const id = String(body.id || "");
  const list = getUserModels(user.id);
  const idx = list.findIndex((m) => m.id === id && m.userId === user.id);
  if (idx < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (body.title !== undefined) list[idx].title = String(body.title).slice(0, 120);
  if (body.body !== undefined) list[idx].body = String(body.body).slice(0, 20_000);
  if (body.category !== undefined) list[idx].category = String(body.category);
  list[idx].updatedAt = Date.now();
  setUserModels(user.id, list);
  return NextResponse.json({ model: list[idx] });
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const list = getUserModels(user.id).filter((m) => m.id !== id);
  setUserModels(user.id, list);
  return NextResponse.json({ ok: true });
}
