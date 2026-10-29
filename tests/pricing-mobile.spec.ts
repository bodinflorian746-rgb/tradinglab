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

// Modèle actuel : une seule carte, 48h d'essai puis accès via un dépôt chez le
// broker partenaire. Plus d'abonnement (ni 49 € ni accès direct à 19 €).
test("pricing — accès via le broker partenaire, sans abonnement", async ({ page }) => {
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

  // Plus aucune trace des anciens tarifs ni de l'abonnement
  await expect(page.getByText(/49\s?€|19\s?€/)).toHaveCount(0);
  await expect(page.getByText(/Commencer avec Premium|Accès direct|abonnement/i)).toHaveCount(0);

  // Une seule carte : essai 48h puis broker partenaire (le formulaire d'essai n'est pas soumis)
  await expect(page.getByRole("heading", { level: 1, name: "Choisis ton accès" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Via broker partenaire" })).toBeVisible();
  await expect(page.getByRole("button", { name: "48h d'essai gratuit" })).toBeVisible();
  await expect(page.getByText("Dépôt minimum : 200 €")).toBeVisible();
  await expect(page.getByRole("button", { name: /Accéder via le broker partenaire/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /J'ai déjà un code d'accès/i })).toBeVisible();

  expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);
});

test("screenshot — pricing mobile", async ({ page }) => {
  await page.goto("/pricing", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.screenshot({ path: "test-results/pricing-mobile.png", fullPage: true });
});
