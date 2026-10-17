const TOKEN_KEY = "castair_api_token";

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    document.cookie = `castair_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = "castair_token=; path=/; max-age=0";
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export async function api<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(path, { ...init, headers, credentials: "include" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: (json as { error?: string }).error || res.statusText,
      };
    }
    return { ok: true, status: res.status, data: json as T };
  } catch {
    return { ok: false, status: 0, error: "offline" };
  }
}
