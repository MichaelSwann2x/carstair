import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import { store, uid } from "@/lib/server/store";
import { writeAudit } from "@/lib/server/audit";
import { z } from "zod";
import type { Aircraft } from "@/lib/server/types";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const session = requireSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ data: store.listAircraft(session.tenant.id) });
}

const Create = z.object({
  registration: z.string().min(1),
  type: z.string().min(1),
  base: z.string().optional(),
  serialNumber: z.string().optional(),
  flightHours: z.number().optional(),
  cycles: z.number().optional(),
});

export async function POST(req: NextRequest) {
  const session = requireSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role === "viewer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = Create.parse(await req.json());
  const a: Aircraft = {
    id: uid(),
    tenantId: session.tenant.id,
    registration: body.registration.toUpperCase(),
    type: body.type,
    base: body.base,
    serialNumber: body.serialNumber,
    flightHours: body.flightHours,
    cycles: body.cycles,
    status: "line",
    updatedAt: new Date().toISOString(),
  };
  store.putAircraft(a);
  await writeAudit(
    session.tenant.id,
    session.user,
    "aircraft.create",
    "aircraft",
    a.id,
    `Added ${a.registration}`,
    a
  );
  return NextResponse.json({ data: a }, { status: 201 });
}
