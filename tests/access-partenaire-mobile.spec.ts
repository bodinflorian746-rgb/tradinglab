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

test("pricing — lien discret 'J'ai déjà un code d'accès' vers /access", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("pageerror", (err) => consoleErrors.push(String(err)));
  page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });

  await page.goto("/pricing", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  const { docW, viewW } = await page.evaluate(() => ({
    docW: document.documentElement.scrollWidth,
    viewW: window.innerWidth,
  }));
  expect(docW - viewW).toBeLessThanOrEqual(4);

  const link = page.getByRole("link", { name: /J'ai déjà un code d'accès/i });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", "/access");

  await link.click();
  await page.waitForURL("**/access", { timeout: 5000 });
  await expect(page.getByRole("heading", { name: "Accès partenaire" })).toBeVisible();

  expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);
});

test("/access — UI partenaire complète + saisie code", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("pageerror", (err) => consoleErrors.push(String(err)));
  page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });

  await page.goto("/access", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  const { docW, viewW } = await page.evaluate(() => ({
    docW: document.documentElement.scrollWidth,
    viewW: window.innerWidth,
  }));
  expect(docW - viewW).toBeLessThanOrEqual(4);

  await expect(page.getByRole("heading", { name: "Accès partenaire" })).toBeVisible();
  await expect(
    page.getByText(/Entre le code fourni dans ton groupe privé pour débloquer ton accès TradeScaleX/i),
  ).toBeVisible();

  const input = page.getByLabel(/Code d'accès/i);
  await expect(input).toBeVisible();
  await input.fill("ABCD-1234");
  await expect(input).toHaveValue("ABCD-1234");

  const btn = page.getByRole("button", { name: /Valider mon accès/i });
  await expect(btn).toBeVisible();
  await btn.click();

  await expect(
    page.getByText(/La validation automatique sera disponible au lancement/i),
  ).toBeVisible();

  expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);
});

test("screenshots — pricing + /access mobile", async ({ page }) => {
  await page.goto("/pricing", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.screenshot({ path: "test-results/pricing-with-access-link.png", fullPage: true });

  await page.goto("/access", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.screenshot({ path: "test-results/access-page-mobile.png", fullPage: true });
});
