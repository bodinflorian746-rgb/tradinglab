import { test, expect } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    try { window.localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch {}
  });
});

test("pricing — nouveau modèle (broker partenaire / accès direct 19€)", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("pageerror", (err) => consoleErrors.push(String(err)));
  page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });

  await page.goto("/pricing", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  // Overflow
  const { docW, viewW } = await page.evaluate(() => ({
    docW: document.documentElement.scrollWidth,
    viewW: window.innerWidth,
  }));
  expect(docW - viewW).toBeLessThanOrEqual(4);

  // Plus aucune trace de l'ancien tarif
  await expect(page.getByText("49€")).toHaveCount(0);
  await expect(page.getByText(/Commencer avec Premium/i)).toHaveCount(0);

  // Nouveaux textes présents
  await expect(page.getByText(/Accès gratuit via un partenaire broker TradeScaleX/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Via partenaire broker" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Accès direct" })).toBeVisible();
  await expect(page.getByText("0€").first()).toBeVisible();
  await expect(page.getByText("19€").first()).toBeVisible();
  await expect(page.getByText(/Accéder via un broker partenaire/i)).toBeVisible();
  await expect(page.getByText(/Commencer l'accès direct/i)).toBeVisible();

  expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);
});

test("screenshot — pricing mobile", async ({ page }) => {
  await page.goto("/pricing", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.screenshot({ path: "test-results/pricing-mobile.png", fullPage: true });
});
