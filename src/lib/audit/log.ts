/** Immutable audit trail for airworthiness-touching actions */

import { idbGetAll, idbPut, uid } from "../db/idb";

export interface AuditEntry {
  id: string;
  tenantId: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
  payloadHash: string;
  createdAt: string;
  prevHash: string;
}

async function sha256(text: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // fallback non-crypto hash for environments without subtle
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (Math.imul(31, h) + text.charCodeAt(i)) | 0;
  return `fallback_${(h >>> 0).toString(16)}`;
}

export async function appendAudit(
  tenantId: string,
  actor: { id: string; name: string; role: string },
  action: string,
  entityType: string,
  entityId: string,
  summary: string,
  payload: unknown
): Promise<AuditEntry> {
  const existing = await idbGetAll<AuditEntry>("audit", tenantId);
  const sorted = existing.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
  const prevHash = sorted.length ? sorted[sorted.length - 1].payloadHash : "genesis";
  const createdAt = new Date().toISOString();
  const payloadHash = await sha256(
    JSON.stringify({ action, entityType, entityId, summary, payload, prevHash, createdAt })
  );
  const entry: AuditEntry = {
    id: uid(),
    tenantId,
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action,
    entityType,
    entityId,
    summary,
    payloadHash,
    createdAt,
    prevHash,
  };
  await idbPut("audit", entry);
  return entry;
}

export async function listAudit(tenantId: string): Promise<AuditEntry[]> {
  const all = await idbGetAll<AuditEntry>("audit", tenantId);
  return all.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
