import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { users, type UserRecord } from "./store";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "carstair-dev-secret-change-me-in-prod-32chars"
);

export async function signSession(userId: string) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);
}

export async function verifySession(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<UserRecord | null> {
  const jar = await cookies();
  const token = jar.get("cs_session")?.value;
  if (!token) return null;
  const id = await verifySession(token);
  if (!id) return null;
  return users.get(id) || null;
}

export async function hashPassword(pw: string) {
  const data = new TextEncoder().encode(pw + (process.env.AUTH_SECRET || "salt"));
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
