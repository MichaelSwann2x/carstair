export interface ApprovalItem {
  id: string;
  title: string;
  summary: string;
  agentId: string;
  payload: unknown;
  status: "pending" | "approved" | "rejected";
  requiresCertifyingStaff?: boolean;
  createdAt: string;
}

const KEY = (tenantId: string) => `castair_${tenantId}_approvals_v2`;

function load(tenantId: string): ApprovalItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY(tenantId)) || "[]");
  } catch {
    return [];
  }
}

function save(tenantId: string, items: ApprovalItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY(tenantId), JSON.stringify(items));
}

export function listApprovals(tenantId: string): ApprovalItem[] {
  return load(tenantId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function pushApproval(
  tenantId: string,
  item: Omit<ApprovalItem, "id" | "createdAt">
): ApprovalItem {
  const row: ApprovalItem = {
    ...item,
    id: crypto.randomUUID?.() ?? `ap_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const list = load(tenantId);
  list.push(row);
  save(tenantId, list);
  return row;
}

export function setApprovalStatus(
  tenantId: string,
  id: string,
  status: "approved" | "rejected"
): void {
  const list = load(tenantId);
  const row = list.find((x) => x.id === id);
  if (row) {
    row.status = status;
    save(tenantId, list);
  }
}
