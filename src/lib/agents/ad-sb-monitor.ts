import type { AdSbRecord, Aircraft } from "../cmms/models";
import { repo } from "../cmms/repo";

export interface AdSbFinding {
  record: AdSbRecord;
  aircraft: Aircraft;
  recommendation: "embody" | "defer" | "not_applicable" | "review";
  rationale: string;
  confidence: number;
  evidence: string[];
  dueContext?: string;
}

export async function runAdSbMonitor(tenantId: string): Promise<AdSbFinding[]> {
  await repo.seedDemo(tenantId);
  const aircraft = await repo.listAircraft(tenantId);
  const records = await repo.listAdSb(tenantId);
  const results: AdSbFinding[] = [];

  for (const rec of records) {
    for (const ac of aircraft) {
      if (rec.aircraftIds.length && !rec.aircraftIds.includes(ac.id)) continue;

      const typeMatch =
        rec.applicability.toLowerCase().includes(ac.type.toLowerCase().slice(0, 4)) ||
        rec.applicability.toLowerCase().includes(ac.type.toLowerCase());

      let recommendation: AdSbFinding["recommendation"] = "review";
      let rationale = "Manual review required.";
      let confidence = 55;
      let dueContext: string | undefined;

      if (!typeMatch) {
        recommendation = "not_applicable";
        rationale = `Aircraft type ${ac.type} does not match applicability text.`;
        confidence = 80;
      } else if (rec.status === "embodied") {
        recommendation = "not_applicable";
        rationale = "Already marked embodied in the register.";
        confidence = 90;
      } else if (rec.type === "AD" && rec.status === "open") {
        recommendation = "embody";
        rationale = "Open Airworthiness Directive on applicable type — prioritise embodiment.";
        confidence = 85;
        if (rec.dueHours != null && ac.flightHours != null) {
          dueContext = `Due within ${rec.dueHours} FH (aircraft at ${ac.flightHours} FH)`;
        }
      } else if ((rec.type === "SB" || rec.type === "EO") && rec.status === "open") {
        recommendation = "review";
        rationale = `Open ${rec.type} — evaluate operational benefit and downtime.`;
        confidence = 70;
      }

      results.push({
        record: rec,
        aircraft: ac,
        recommendation,
        rationale,
        confidence,
        dueContext,
        evidence: [
          `${rec.type} ${rec.number}`,
          `Applicability: ${rec.applicability}`,
          `Aircraft: ${ac.registration} (${ac.type}) SN=${ac.serialNumber ?? "n/a"}`,
          `FH=${ac.flightHours ?? "n/a"} CY=${ac.cycles ?? "n/a"}`,
          `Status: ${rec.status}`,
        ],
      });
    }
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}
