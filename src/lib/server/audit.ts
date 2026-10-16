import { store, uid } from "./store";
import type { User, AuditEntry } from "./types";

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function writeAudit(
  tenantId: string,
  actor: User,
  action: string,
  entityType: string,
  entityId: string,
  summary: string,
  payload: unknown
): Promise<AuditEntry> {
  const prevHash = store.lastAuditHash(tenantId);
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
    prevHash,
    createdAt,
  };
  store.appendAudit(entry);
  return entry;
}
