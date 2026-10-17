import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import { store, uid } from "@/lib/server/store";
import { writeAudit } from "@/lib/server/audit";
import { z } from "zod";

export const runtime = "edge";

/** Evidence metadata + base64 payload when R2 not bound; swap to R2 put when env.EVIDENCE available */
const evidenceStore = (globalThis as unknown as { __ev?: Map<string, { meta: unknown; data: string }> }).__ev ??
  ((globalThis as unknown as { __ev: Map<string, { meta: unknown; data: string }> }).__ev = new Map());

const Body = z.object({
  taskCardId: z.string(),
  filename: z.string(),
  contentType: z.string().default("application/octet-stream"),
  dataBase64: z.string().max(2_000_000),
});

export async function POST(req: NextRequest) {
  const session = requireSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role === "viewer") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = Body.parse(await req.json());
  const card = store.getTaskCard(body.taskCardId);
  if (!card || card.tenantId !== session.tenant.id) {
    return NextResponse.json({ error: "Task card not found" }, { status: 404 });
  }

  const id = uid();
  const meta = {
    id,
    tenantId: session.tenant.id,
    taskCardId: body.taskCardId,
    filename: body.filename,
    contentType: body.contentType,
    uploadedBy: session.user.id,
    createdAt: new Date().toISOString(),
  };
  evidenceStore.set(id, { meta, data: body.dataBase64 });
  await writeAudit(
    session.tenant.id,
    session.user,
    "evidence.attach",
    "task_card",
    body.taskCardId,
    `Attached ${body.filename}`,
    { evidenceId: id, filename: body.filename }
  );
  return NextResponse.json({ data: meta }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = requireSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const taskCardId = req.nextUrl.searchParams.get("taskCardId");
  const items = [...evidenceStore.values()]
    .map((v) => v.meta as { tenantId: string; taskCardId: string })
    .filter((m) => m.tenantId === session.tenant.id && (!taskCardId || m.taskCardId === taskCardId));
  return NextResponse.json({ data: items });
}
