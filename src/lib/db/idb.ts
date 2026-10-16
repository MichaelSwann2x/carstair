/** IndexedDB layer with schema versioning for Castair offline data */

const DB_NAME = "castair_v1";
const DB_VERSION = 2;

export type StoreName =
  | "aircraft"
  | "work_packages"
  | "task_cards"
  | "findings"
  | "ad_sb"
  | "components"
  | "mel_items"
  | "approvals"
  | "audit"
  | "attachments"
  | "qualifications"
  | "meta";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      const stores: StoreName[] = [
        "aircraft",
        "work_packages",
        "task_cards",
        "findings",
        "ad_sb",
        "components",
        "mel_items",
        "approvals",
        "audit",
        "attachments",
        "qualifications",
        "meta",
      ];
      for (const name of stores) {
        if (!db.objectStoreNames.contains(name)) {
          const store = db.createObjectStore(name, { keyPath: "id" });
          if (name !== "meta" && name !== "audit") {
            store.createIndex("tenantId", "tenantId", { unique: false });
          }
          if (name === "audit") {
            store.createIndex("tenantId", "tenantId", { unique: false });
            store.createIndex("createdAt", "createdAt", { unique: false });
          }
        }
      }
    };
  });
}

export async function idbGetAll<T>(store: StoreName, tenantId?: string): Promise<T[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const os = tx.objectStore(store);
    const req = tenantId && os.indexNames.contains("tenantId")
      ? os.index("tenantId").getAll(tenantId)
      : os.getAll();
    req.onsuccess = () => resolve((req.result as T[]) || []);
    req.onerror = () => reject(req.error);
  });
}

export async function idbPut<T extends { id: string }>(store: StoreName, value: T): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).put(value);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function idbDelete(store: StoreName, id: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function idbBulkPut<T extends { id: string }>(store: StoreName, values: T[]): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    const os = tx.objectStore(store);
    for (const v of values) os.put(v);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export function uid(): string {
  return crypto.randomUUID?.() ?? `id_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}
