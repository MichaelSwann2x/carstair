export interface VisualInput {
  aircraftRegistration: string;
  location: string;
  defectType: string;
  measuredValue?: number;
  unit?: string;
  srmLimit?: number;
  notes?: string;
  imageRefs?: string[];
}

export interface VisualDisposition {
  disposition: "accept_as_is" | "repair" | "replace" | "defer" | "further_inspection";
  language: string;
  taskCards: { title: string; description: string; priority: "routine" | "urgent" }[];
  confidence: number;
  evidence: string[];
  requiresHumanApproval: true;
}

export function runClosedLoopVisual(input: VisualInput): VisualDisposition {
  const evidence: string[] = [
    `Location: ${input.location}`,
    `Defect: ${input.defectType}`,
  ];
  if (input.measuredValue != null && input.srmLimit != null) {
    evidence.push(
      `Measured: ${input.measuredValue} ${input.unit ?? ""} vs SRM limit ${input.srmLimit}`
    );
  }

  let disposition: VisualDisposition["disposition"] = "further_inspection";
  let language = "Further inspection required prior to disposition.";
  let confidence = 60;
  const taskCards: VisualDisposition["taskCards"] = [];

  if (
    input.measuredValue != null &&
    input.srmLimit != null &&
    input.measuredValue <= input.srmLimit
  ) {
    disposition = "accept_as_is";
    language = `Defect at ${input.location} measured within SRM allowable limits (${input.measuredValue} ≤ ${input.srmLimit} ${input.unit ?? ""}). Accept as is. Monitor at next scheduled inspection.`;
    confidence = 82;
    taskCards.push({
      title: "Record accept-as-is disposition",
      description: language,
      priority: "routine",
    });
  } else if (
    input.measuredValue != null &&
    input.srmLimit != null &&
    input.measuredValue > input.srmLimit
  ) {
    disposition = "repair";
    language = `Defect at ${input.location} exceeds SRM limit (${input.measuredValue} > ${input.srmLimit}). Repair or replacement required before return to service.`;
    confidence = 88;
    taskCards.push(
      {
        title: "Raise repair task card",
        description: language,
        priority: "urgent",
      },
      {
        title: "Post-repair inspection",
        description: "Perform dual inspection after repair embodiment.",
        priority: "urgent",
      }
    );
  } else {
    taskCards.push({
      title: "Detailed visual / NDT follow-up",
      description: `Obtain dimensional data and SRM reference for ${input.defectType} at ${input.location}.`,
      priority: "urgent",
    });
  }

  return {
    disposition,
    language,
    taskCards,
    confidence,
    evidence,
    requiresHumanApproval: true,
  };
}
