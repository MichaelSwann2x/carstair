/** Browser-side sandbox keyed by userId — survives Worker cold starts. */

function key(userId: string, ns: string) {
  return `cs:${userId}:${ns}`;
}

export function loadJSON<T>(userId: string, ns: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key(userId, ns));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON(userId: string, ns: string, data: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key(userId, ns), JSON.stringify(data));
}
