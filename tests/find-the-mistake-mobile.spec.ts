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

const PAGES = ["/jeux", "/jeux/find-the-mistake"];

for (const url of PAGES) {
  test(`mobile — ${url}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => consoleErrors.push(String(err)));
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    const response = await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    expect(response?.status(), `HTTP ${response?.status()}`).toBeLessThan(400);

    const { docW, viewW } = await page.evaluate(() => ({
      docW: document.documentElement.scrollWidth,
      viewW: window.innerWidth,
    }));
    const overflow = docW - viewW;
    console.log(`[${url}] viewport=${viewW} doc=${docW} overflow=${overflow}px`);
    expect(overflow, "Aucun overflow horizontal global > 4px").toBeLessThanOrEqual(4);

    expect(consoleErrors, `Erreurs console : ${consoleErrors.join("\n")}`).toHaveLength(0);
  });
}

test("navigation — depuis /jeux ouvre 'Trouve l'erreur'", async ({ page }) => {
  await page.goto("/jeux", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  const card = page.getByRole("link", { name: /Trouve l'erreur|Quelle est l'erreur/i }).first();
  await expect(card).toBeVisible();
  await expect(card).toHaveAttribute("href", "/jeux/find-the-mistake");

  await card.click();
  await page.waitForURL("**/jeux/find-the-mistake", { timeout: 5000 });
  await expect(page.getByRole("button", { name: /Débutant/ })).toBeVisible({ timeout: 5000 });
});

test("difficulty picker — 3 niveaux", async ({ page }) => {
  await page.goto("/jeux/find-the-mistake", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  await expect(page.getByRole("button", { name: /Débutant/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Intermédiaire/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Avancé/ })).toBeVisible();
});

test("gameplay débutant — pick difficulty, choisir, voir feedback, suivant", async ({ page }) => {
  await page.goto("/jeux/find-the-mistake", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  await page.getByRole("button", { name: /Débutant/ }).click();

  // 4 boutons de choix visibles (header dit "Quelle est l'erreur principale ?")
  const questionHeader = page.getByText(/Quelle est l'erreur principale/i);
  await expect(questionHeader).toBeVisible({ timeout: 5000 });

  // Cliquer le premier choix
  const choiceButtons = page.locator("button").filter({ hasText: /(Stop|Trade|Achat|Vente|Ratio|Levier|Spread|FOMO|Revenge|Range|Mitigation|Volatilité|Liquidité|Mauvais|Zone|Breakout)/ });
  await choiceButtons.first().click();

  // Le feedback doit apparaître (bouton Suivant ou bilan)
  const next = page.getByRole("button", { name: /Suivant|Voir le bilan/ });
  await expect(next).toBeVisible({ timeout: 5000 });

  // Lesson visible
  await expect(page.getByText(/Leçon · Débutant/i)).toBeVisible();

  // Suivant
  await next.click();
  await expect(questionHeader).toBeVisible({ timeout: 5000 });
});

test("gameplay avancé — 0 erreur console + lesson Avancé", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });

  await page.goto("/jeux/find-the-mistake", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  await page.getByRole("button", { name: /Avancé/ }).click();
  await expect(page.getByText(/Quelle est l'erreur/i)).toBeVisible({ timeout: 5000 });

  // Cliquer un choix
  const choiceButtons = page.locator("button").filter({ hasText: /(Stop|Trade|Achat|Vente|Ratio|Levier|Spread|FOMO|Revenge|Range|Mitigation|Volatilité|Liquidité|Mauvais|Zone|Breakout)/ });
  await choiceButtons.first().click();

  await expect(page.getByRole("button", { name: /Suivant|Voir le bilan/ })).toBeVisible({ timeout: 5000 });
  await expect(page.getByText(/Leçon · Avancé/i)).toBeVisible();

  expect(errors, `Erreurs console : ${errors.join("\n")}`).toHaveLength(0);
});

test("screenshots — picker + round + feedback", async ({ page }) => {
  await page.goto("/jeux/find-the-mistake", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.screenshot({ path: "test-results/ftm-picker.png", fullPage: false });

  await page.getByRole("button", { name: /Débutant/ }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: "test-results/ftm-round-beginner.png", fullPage: false });

  const choiceButtons = page.locator("button").filter({ hasText: /(Stop|Trade|Achat|Vente|Ratio|Levier|Spread|FOMO|Revenge|Range|Mitigation|Volatilité|Liquidité|Mauvais|Zone|Breakout)/ });
  await choiceButtons.first().click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: "test-results/ftm-feedback.png", fullPage: false });
});
