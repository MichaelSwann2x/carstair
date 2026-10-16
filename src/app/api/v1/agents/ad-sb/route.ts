import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import { store } from "@/lib/server/store";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const session = requireSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const aircraft = store.listAircraft(session.tenant.id);
  const records = store.listAdSb(session.tenant.id);
  const results = [];
  for (const rec of records) {
    for (const ac of aircraft) {
      if (rec.aircraftIds.length && !rec.aircraftIds.includes(ac.id)) continue;
      const typeMatch =
        rec.applicability.toLowerCase().includes(ac.type.toLowerCase().slice(0, 4)) ||
        rec.applicability.toLowerCase().includes(ac.type.toLowerCase());
      let recommendation = "review";
      let rationale = "Manual review required.";
      let confidence = 55;
      if (!typeMatch) {
        recommendation = "not_applicable";
        rationale = `Type ${ac.type} does not match applicability.`;
        confidence = 80;
      } else if (rec.status === "embodied") {
        recommendation = "not_applicable";
        rationale = "Already embodied.";
        confidence = 90;
      } else if (rec.type === "AD" && rec.status === "open") {
        recommendation = "embody";
        rationale = "Open AD on applicable type.";
        confidence = 85;
      }
      results.push({
        record: rec,
        aircraft: ac,
        recommendation,
        rationale,
        confidence,
        simulated: session.tenant.isDemo,
        evidence: [
          `${rec.type} ${rec.number}`,
          `Applicability: ${rec.applicability}`,
          `${ac.registration} FH=${ac.flightHours} CY=${ac.cycles}`,
        ],
        dueContext:
          rec.dueHours != null && ac.flightHours != null
            ? `Due within ${rec.dueHours} FH (at ${ac.flightHours} FH)`
            : undefined,
      });
    }
  }
  return NextResponse.json({
    data: results.sort((a, b) => b.confidence - a.confidence),
    simulated: session.tenant.isDemo,
  });
}
