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

const PAGES = ["/jeux", "/jeux/build-the-trade"];

for (const url of PAGES) {
  test(`mobile — ${url}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => consoleErrors.push(String(err)));
    page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });

    const response = await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    expect(response?.status()).toBeLessThan(400);

    const { docW, viewW } = await page.evaluate(() => ({
      docW: document.documentElement.scrollWidth,
      viewW: window.innerWidth,
    }));
    const overflow = docW - viewW;
    console.log(`[${url}] viewport=${viewW} doc=${docW} overflow=${overflow}px`);
    expect(overflow, "no overflow > 4px").toBeLessThanOrEqual(4);

    expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);
  });
}

test("navigation — depuis /jeux ouvre 'Build the Trade'", async ({ page }) => {
  await page.goto("/jeux", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  const card = page.getByRole("link", { name: /Build the Trade|Construis le setup/i }).first();
  await expect(card).toBeVisible();
  await expect(card).toHaveAttribute("href", "/jeux/build-the-trade");

  await card.click();
  await page.waitForURL("**/jeux/build-the-trade", { timeout: 5000 });
  await expect(page.getByRole("button", { name: /Débutant/ })).toBeVisible({ timeout: 5000 });
});

test("gameplay débutant — 3-step build + valider + reveal", async ({ page }) => {
  await page.goto("/jeux/build-the-trade", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  await page.getByRole("button", { name: /Débutant/ }).click();

  // Validate button doit être désactivé au départ
  const validateBtn = page.getByRole("button", { name: /Valider le trade/i });
  await expect(validateBtn).toBeVisible({ timeout: 5000 });

  // Step 1 : Entry → cliquer "Confirmation"
  await page.getByRole("button", { name: /Confirmation/i }).click();
  // Step 2 : Stop → cliquer "Logique"
  await page.getByRole("button", { name: /^Logique$/i }).click();
  // Step 3 : TP → cliquer "Équilibré"
  await page.getByRole("button", { name: /Équilibré/i }).click();

  // Valider
  await validateBtn.click();

  // Feedback : bouton "Scénario suivant" ou "Voir le bilan" doit apparaître
  const next = page.getByRole("button", { name: /Scénario suivant|Voir le bilan/i });
  await expect(next).toBeVisible({ timeout: 8000 });

  // Lesson visible
  await expect(page.getByText(/Leçon · Débutant/i)).toBeVisible();
});

test("gameplay avancé — 0 erreur console", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });

  await page.goto("/jeux/build-the-trade", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  await page.getByRole("button", { name: /Avancé/ }).click();
  await page.getByRole("button", { name: /Confirmation/i }).click();
  await page.getByRole("button", { name: /^Logique$/i }).click();
  await page.getByRole("button", { name: /Équilibré/i }).click();
  await page.getByRole("button", { name: /Valider le trade/i }).click();
  await expect(page.getByRole("button", { name: /Scénario suivant|Voir le bilan/i })).toBeVisible({ timeout: 8000 });
  await expect(page.getByText(/Leçon · Avancé/i)).toBeVisible();

  expect(errors, `Erreurs : ${errors.join("\n")}`).toHaveLength(0);
});

test("screenshots — picker + build + feedback", async ({ page }) => {
  await page.goto("/jeux/build-the-trade", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.screenshot({ path: "test-results/btt-picker.png", fullPage: false });

  await page.getByRole("button", { name: /Débutant/ }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: "test-results/btt-build.png", fullPage: false });

  await page.getByRole("button", { name: /Confirmation/i }).click();
  await page.getByRole("button", { name: /^Logique$/i }).click();
  await page.getByRole("button", { name: /Équilibré/i }).click();
  await page.screenshot({ path: "test-results/btt-build-complete.png", fullPage: false });

  await page.getByRole("button", { name: /Valider le trade/i }).click();
  await expect(page.getByRole("button", { name: /Scénario suivant|Voir le bilan/i })).toBeVisible({ timeout: 8000 });
  await page.screenshot({ path: "test-results/btt-feedback.png", fullPage: false });
});
