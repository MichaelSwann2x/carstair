import { test, expect } from "@playwright/test";

test("role enforcement: inspector denied RII", async ({ request }) => {
  const insp = await request.post("/api/v1/auth/demo", { data: { role: "inspector" } });
  expect(insp.ok()).toBeTruthy();
  const { token } = await insp.json();
  const cards = await request.get("/api/v1/task-cards", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const list = (await cards.json()).data as { id: string; riiRequired: boolean }[];
  const riiCard = list.find((c) => c.riiRequired);
  expect(riiCard).toBeTruthy();
  const denied = await request.post(`/api/v1/task-cards/${riiCard!.id}/sign`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { kind: "rii" },
  });
  expect(denied.status()).toBe(403);
});

test("certifying dual-sign → RTS package → audit", async ({ request }) => {
  const cert = await request.post("/api/v1/auth/demo", { data: { role: "certifying_staff" } });
  const { token } = await cert.json();
  const headers = { Authorization: `Bearer ${token}` };

  const cardsRes = await request.get("/api/v1/task-cards", { headers });
  const cards = (await cardsRes.json()).data as { id: string; riiRequired: boolean }[];
  const tc = cards.find((c) => c.riiRequired)!;

  expect((await request.post(`/api/v1/task-cards/${tc.id}/sign`, { headers, data: { kind: "performer" } })).ok()).toBeTruthy();
  expect((await request.post(`/api/v1/task-cards/${tc.id}/sign`, { headers, data: { kind: "rii" } })).ok()).toBeTruthy();

  const domain = await (await request.get("/api/v1/domain", { headers })).json();
  const aircraftId = domain.aircraft[0].id;

  const pkg = await request.post("/api/v1/rts", {
    headers,
    data: { aircraftId, action: "generate" },
  });
  expect(pkg.ok()).toBeTruthy();
  expect((await pkg.json()).packageText).toContain("RETURN TO SERVICE");

  const domain2 = await (await request.get("/api/v1/domain", { headers })).json();
  const actions = (domain2.audit as { action: string }[]).map((a) => a.action);
  expect(actions.some((a) => a === "rts.package_generated" || a === "task_card.rii_sign")).toBeTruthy();
});

test("UI: certifying demo reaches aircraft", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Certifying staff" }).click();
  await expect(page.getByRole("heading", { name: "Aircraft" })).toBeVisible({ timeout: 15000 });
});

test("landing has hero and workflow, no demo.mp4 copy", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Inspect. Sign. Release." })).toBeVisible();
  await expect(page.getByText("From task card to release")).toBeVisible();
  await expect(page.getByText("demo.mp4")).toHaveCount(0);
});
