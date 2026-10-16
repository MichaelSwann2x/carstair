import { test, expect } from "@playwright/test";

test("demo inspector cannot RII; certifying staff can; RTS and audit", async ({ page, request }) => {
  // Inspector demo
  const insp = await request.post("/api/v1/auth/demo", {
    data: { role: "inspector" },
  });
  expect(insp.ok()).toBeTruthy();
  const inspBody = await insp.json();
  const cards = await request.get("/api/v1/task-cards", {
    headers: { Authorization: `Bearer ${inspBody.token}` },
  });
  const cardList = (await cards.json()).data as { id: string; riiRequired: boolean }[];
  const riiCard = cardList.find((c) => c.riiRequired);
  expect(riiCard).toBeTruthy();

  const denied = await request.post(`/api/v1/task-cards/${riiCard!.id}/sign`, {
    headers: { Authorization: `Bearer ${inspBody.token}` },
    data: { kind: "rii" },
  });
  expect(denied.status()).toBe(403);

  // Certifying staff on same demo would be a new tenant in memory — sign performer then use certifying on new session
  const cert = await request.post("/api/v1/auth/demo", {
    data: { role: "certifying_staff" },
  });
  const certBody = await cert.json();
  const certCards = await request.get("/api/v1/task-cards", {
    headers: { Authorization: `Bearer ${certBody.token}` },
  });
  const certList = (await certCards.json()).data as { id: string; riiRequired: boolean; aircraftId: string }[];
  const tc = certList.find((c) => c.riiRequired)!;

  await request.post(`/api/v1/task-cards/${tc.id}/sign`, {
    headers: { Authorization: `Bearer ${certBody.token}` },
    data: { kind: "performer" },
  });
  const rii = await request.post(`/api/v1/task-cards/${tc.id}/sign`, {
    headers: { Authorization: `Bearer ${certBody.token}` },
    data: { kind: "rii" },
  });
  expect(rii.ok()).toBeTruthy();

  const domain = await request.get("/api/v1/domain", {
    headers: { Authorization: `Bearer ${certBody.token}` },
  });
  const domainBody = await domain.json();
  const aircraftId = domainBody.aircraft[0].id;

  const pkg = await request.post("/api/v1/rts", {
    headers: { Authorization: `Bearer ${certBody.token}` },
    data: { aircraftId, action: "generate" },
  });
  expect(pkg.ok()).toBeTruthy();
  const pkgBody = await pkg.json();
  expect(pkgBody.packageText).toContain("RETURN TO SERVICE");

  const audit = domainBody.audit as { action: string }[];
  // regenerate domain after package
  const domain2 = await request.get("/api/v1/domain", {
    headers: { Authorization: `Bearer ${certBody.token}` },
  });
  const audit2 = (await domain2.json()).audit as { action: string }[];
  expect(audit2.some((a) => a.action === "rts.package_generated" || a.action === "task_card.rii_sign")).toBeTruthy();

  // UI smoke
  await page.goto("/login");
  await page.getByRole("button", { name: "Certifying staff" }).click();
  await expect(page.getByRole("heading", { name: "Aircraft" })).toBeVisible({ timeout: 15000 });
});
