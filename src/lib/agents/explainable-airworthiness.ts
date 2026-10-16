export interface AirworthinessQuery {
  question: string;
  aircraftType?: string;
  registration?: string;
  findingSummary?: string;
  proposedAction?: string;
}

export interface AirworthinessExplanation {
  answer: string;
  regulatoryPath: string[];
  precedents: string[];
  residualRisk: string;
  recommendedNextStep: string;
  confidence: number;
  requiresHumanApproval: boolean;
}

export function runExplainableAirworthiness(q: AirworthinessQuery): AirworthinessExplanation {
  const path: string[] = [
    "14 CFR Part 43 / EASA Part-145 — maintenance performance",
    "14 CFR 91.407 / corresponding EASA ops — return to service after maintenance",
    "Operator MEL / CDL if deferral is proposed",
  ];

  if (q.proposedAction?.toLowerCase().includes("defer")) {
    path.push("MEL category and repair interval must be identified and recorded");
  }
  if (
    q.findingSummary?.toLowerCase().includes("structure") ||
    q.findingSummary?.toLowerCase().includes("skin")
  ) {
    path.push("SRM (Structural Repair Manual) allowable damage limits");
    path.push("Damage tolerance / inspection programme impact assessment");
  }

  const precedents = [
    "Borderline skin dents within SRM limits historically accepted with recurrent inspection",
    "Open ADs on type must be shown embodied or dispositioned before RTS",
    "Dual inspection required for critical structural repairs under most approvals",
  ];

  const answer = [
    q.question,
    "",
    "Regulatory path is determined by the nature of the work and the aircraft's approval basis (FAA / EASA).",
    q.findingSummary
      ? `Given the finding summary (“${q.findingSummary}”), the controlling documents are the SRM / AMM for the type and the applicable AD/SB register.`
      : "Provide a concrete finding or proposed action for a tighter path.",
    q.proposedAction
      ? `Proposed action (“${q.proposedAction}”) must be supported by an approved data reference and recorded in the technical log / work package before any RTS signature.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    answer,
    regulatoryPath: path,
    precedents,
    residualRisk:
      "Final airworthiness judgment remains with the licensed certifying staff / RTS authority. This explanation does not constitute a release.",
    recommendedNextStep:
      "Attach the exact SRM/AMM/AD reference and obtain human RTS authority sign-off before release.",
    confidence: 75,
    requiresHumanApproval: true,
  };
}
