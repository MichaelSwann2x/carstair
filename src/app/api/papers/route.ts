import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { PAPERS, SSRN_HOME, ssrnUrl } from "@/lib/papers-catalog";
import { getUserPapers, setUserPapers, type UserPaperNote } from "@/lib/store";
import { uid } from "@/lib/utils";

export async function GET() {
  const user = await getSessionUser();
  const mine = user ? getUserPapers(user.id) : [];
  return NextResponse.json({
    papers: PAPERS.map((p) => ({ ...p, url: ssrnUrl(p.abstractId) })),
    ssrnHome: SSRN_HOME,
    mine,
  });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const paperId = String(body.paperId || "");
  const title = String(body.title || "Notes").slice(0, 200);
  const notes = String(body.notes || "").slice(0, 30_000);
  const list = getUserPapers(user.id);
  const existing = list.findIndex((n) => n.paperId === paperId && n.userId === user.id);
  if (existing >= 0) {
    list[existing].notes = notes;
    list[existing].title = title;
    list[existing].updatedAt = Date.now();
    setUserPapers(user.id, list);
    return NextResponse.json({ note: list[existing] });
  }
  const note: UserPaperNote = {
    id: uid(),
    userId: user.id,
    paperId,
    title,
    notes,
    updatedAt: Date.now(),
  };
  list.unshift(note);
  setUserPapers(user.id, list);
  return NextResponse.json({ note });
}
