import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/server/auth";
import {
  defaultRecoveryConfig,
  getUserRecoveryConfig,
  saveUserRecoveryConfig,
  type BackdropDestination,
} from "@/security/storage/recovery-config";
import { getQuotaState } from "@/security/storage/quota";
import { z } from "zod";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const session = requireSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;
  const cfg = (await getUserRecoveryConfig(userId)) ?? defaultRecoveryConfig(userId);
  const quota = await getQuotaState(userId);
  return NextResponse.json({ recovery: cfg, quota });
}

const Body = z.object({
  optInActive: z.boolean(),
  destinations: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum(["s3", "sftp", "https-put", "email-encrypted", "custom"]),
        endpoint: z.string(),
        credentialsRef: z.string(),
        pathPrefix: z.string().optional(),
        enabled: z.boolean(),
      })
    )
    .optional(),
  masterKeyFingerprint: z.string().optional(),
});

export async function PUT(req: NextRequest) {
  const session = requireSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = Body.parse(await req.json());
  const userId = session.user.id;
  const existing = (await getUserRecoveryConfig(userId)) ?? defaultRecoveryConfig(userId);
  const next = {
    ...existing,
    optInActive: body.optInActive,
    destinations: (body.destinations as BackdropDestination[] | undefined) ?? existing.destinations,
    masterKeyFingerprint: body.masterKeyFingerprint ?? existing.masterKeyFingerprint,
  };
  await saveUserRecoveryConfig(next);
  return NextResponse.json({ recovery: next });
}
