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

test("pricing — lien discret 'J'ai déjà un code d'accès' vers /activer-code", async ({ page }) => {
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
  await expect(link).toHaveAttribute("href", "/activer-code");

  await link.click();
  await page.waitForURL("**/activer-code", { timeout: 5000 });
  await expect(page.getByRole("heading", { name: /Activer ton code/i })).toBeVisible();

  expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);
});

test("/access — redirection vers /activer-code", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("pageerror", (err) => consoleErrors.push(String(err)));
  page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });

  await page.goto("/access", { waitUntil: "domcontentloaded" });
  await page.waitForURL("**/activer-code", { timeout: 5000 });

  const { docW, viewW } = await page.evaluate(() => ({
    docW: document.documentElement.scrollWidth,
    viewW: window.innerWidth,
  }));
  expect(docW - viewW).toBeLessThanOrEqual(4);

  await expect(page.getByRole("heading", { name: /Activer ton code/i })).toBeVisible();

  expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);
});

test("screenshots — pricing + activer-code mobile", async ({ page }) => {
  await page.goto("/pricing", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.screenshot({ path: "test-results/pricing-with-activer-code-link.png", fullPage: true });

  await page.goto("/activer-code", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.screenshot({ path: "test-results/activer-code-page-mobile.png", fullPage: true });
});
