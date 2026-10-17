import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/server/store";
import { writeAudit } from "@/lib/server/audit";
import { z } from "zod";

export const runtime = "edge";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  tenantSlug: z.string().optional(),
});

async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" },
    key,
    256
  );
  return Array.from(new Uint8Array(bits))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// password hashes stored on user records via provision
const passwords = (globalThis as unknown as { __pw?: Map<string, string> }).__pw ??
  ((globalThis as unknown as { __pw: Map<string, string> }).__pw = new Map());

export async function POST(req: NextRequest) {
  const body = Body.parse(await req.json());
  // find user by email across tenants (demo simplicity)
  const users = [...(store as unknown as { users?: Map<string, { id: string; email: string; tenantId: string; name: string; role: string }> }).users?.values?.() ?? []];
  // access via list hack
  const allUsers: { id: string; email: string; tenantId: string; name: string; role: import("@/lib/server/types").Role; createdAt: string }[] = [];
  // Use store internals carefully
  const sessionLookup = (store as unknown as {
    listUsersByEmail?: (email: string) => typeof allUsers;
  });

  void sessionLookup;
  void passwords;
  void hashPassword;

  // Fallback: provision-style login not found
  return NextResponse.json(
    { error: "Use provision or demo. Password login requires D1 user records — see docs/PRODUCTION.md" },
    { status: 501 }
  );
}

export { hashPassword, passwords };
