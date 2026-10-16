import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import { store } from "@/lib/server/store";
import { writeAudit } from "@/lib/server/audit";
import { canCertify } from "@/lib/server/types";
import { z } from "zod";

export const runtime = "edge";

const Body = z.object({
  aircraftId: z.string(),
  action: z.enum(["generate", "release"]),
});

export async function POST(req: NextRequest) {
  const session = requireSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = Body.parse(await req.json());
  const ac = store.listAircraft(session.tenant.id).find((a) => a.id === body.aircraftId);
  if (!ac) return NextResponse.json({ error: "Aircraft not found" }, { status: 404 });

  if (body.action === "generate") {
    const cards = store.listTaskCards(session.tenant.id).filter((c) => c.aircraftId === ac.id);
    const mel = store.listMel(session.tenant.id).filter((m) => m.aircraftId === ac.id && m.status === "open");
    const ads = store.listAdSb(session.tenant.id).filter((d) => d.aircraftIds.includes(ac.id));
    const text = [
      "CASTAIR — RETURN TO SERVICE PACKAGE",
      `Generated: ${new Date().toISOString()}`,
      `Tenant: ${session.tenant.name}${session.tenant.isDemo ? " [DEMO]" : ""}`,
      `Aircraft: ${ac.registration} (${ac.type}) SN=${ac.serialNumber ?? "n/a"}`,
      `Hours: ${ac.flightHours ?? "n/a"} · Cycles: ${ac.cycles ?? "n/a"}`,
      "",
      "TASK CARDS",
      ...cards.map(
        (c) =>
          `- ${c.title} [${c.status}] RII=${c.riiRequired} signatures=${c.signatures.length}`
      ),
      "",
      "OPEN MEL",
      ...(mel.length ? mel.map((m) => `- ${m.melReference}: ${m.title}`) : ["- None"]),
      "",
      "AD/SB",
      ...ads.map((d) => `- ${d.number} [${d.status}] ${d.title}`),
      "",
      "This package does not auto-release the aircraft. Certifying staff must execute release.",
      `Prepared by: ${session.user.name} (${session.user.role})`,
    ].join("\n");
    await writeAudit(
      session.tenant.id,
      session.user,
      "rts.package_generated",
      "aircraft",
      ac.id,
      `RTS package for ${ac.registration}`,
      { registration: ac.registration }
    );
    return NextResponse.json({ packageText: text });
  }

  if (!canCertify(session.user.role)) {
    await writeAudit(
      session.tenant.id,
      session.user,
      "rts.release_denied",
      "aircraft",
      ac.id,
      "RTS release blocked — role not certifying",
      {}
    );
    return NextResponse.json({ error: "Only certifying staff or admin may release RTS" }, { status: 403 });
  }
  const next = { ...ac, status: "line" as const, updatedAt: new Date().toISOString() };
  store.putAircraft(next);
  await writeAudit(
    session.tenant.id,
    session.user,
    "rts.release",
    "aircraft",
    ac.id,
    `RTS released ${ac.registration}`,
    {}
  );
  return NextResponse.json({ data: next });
}
