import type { AdSbRecord, Aircraft } from "../cmms/types";
import { localCmms } from "../cmms/local-store";

export interface AdSbFinding {
  record: AdSbRecord;
  aircraft: Aircraft;
  recommendation: "embody" | "defer" | "not_applicable" | "review";
  rationale: string;
  confidence: number;
  evidence: string[];
}

export function runAdSbMonitor(tenantId: string): AdSbFinding[] {
  const aircraft = localCmms.listAircraft(tenantId);
  const records = localCmms.listAdSb(tenantId);
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
      } else if (rec.type === "SB" && rec.status === "open") {
        recommendation = "review";
        rationale = "Open Service Bulletin — evaluate operational benefit and downtime.";
        confidence = 70;
      }

      results.push({
        record: rec,
        aircraft: ac,
        recommendation,
        rationale,
        confidence,
        evidence: [
          `AD/SB ${rec.number}`,
          `Applicability: ${rec.applicability}`,
          `Aircraft: ${ac.registration} (${ac.type})`,
          `Current status: ${rec.status}`,
        ],
      });
    }
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}
