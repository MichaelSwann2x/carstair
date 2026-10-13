import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "carstair-dev-secret-change-me-in-prod-32chars"
);

export type SessionUser = {
  id: string;
  email: string;
  username: string;
  name?: string;
  phone?: string;
  avatar?: string;
  tradingViewUsername?: string;
  tradingViewConnected?: boolean;
  redditUsername?: string;
};

export async function signSession(user: SessionUser) {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    username: user.username,
    name: user.name || "",
    phone: user.phone || "",
    avatar: user.avatar || "",
    tradingViewUsername: user.tradingViewUsername || "",
    tradingViewConnected: !!user.tradingViewConnected,
    redditUsername: user.redditUsername || "",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);
}

export async function readSession(): Promise<SessionUser | null> {
  try {
    const jar = await cookies();
    const token = jar.get("cs_session")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET);
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    return {
      id: payload.sub,
      email: String(payload.email),
      username: String(payload.username || "user"),
      name: String(payload.name || "") || undefined,
      phone: String(payload.phone || "") || undefined,
      avatar: String(payload.avatar || "") || undefined,
      tradingViewUsername: String(payload.tradingViewUsername || "") || undefined,
      tradingViewConnected: !!payload.tradingViewConnected,
      redditUsername: String(payload.redditUsername || "") || undefined,
    };
  } catch {
    return null;
  }
}

export async function hashPassword(pw: string) {
  const data = new TextEncoder().encode(pw + (process.env.AUTH_SECRET || "salt"));
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function sessionCookie(token: string) {
  return {
    httpOnly: true as const,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
}
