import { test, expect } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});

const PAGES = [
  "/jeux",
  "/jeux/buy-sell-no-trade",
];

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

test("preuve visuelle — screenshot mobile de /jeux", async ({ page }) => {
  await page.goto("/jeux", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.screenshot({ path: "test-results/jeux-mobile.png", fullPage: false });
  // Card visible above the fold
  const card = page.getByRole("link", { name: /BUY.*SELL.*NO TRADE|Jouer maintenant/ }).first();
  await expect(card).toBeInViewport({ ratio: 0.5 });
});

test("navigation — clic sur 'Commencer' depuis /jeux ouvre le jeu", async ({ page }) => {
  await page.goto("/jeux", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  // La card "BUY / SELL / NO TRADE" doit être visible avec un bouton CTA
  const card = page.getByRole("link", { name: /BUY.*SELL.*NO TRADE|Jouer maintenant|Commencer/ }).first();
  await expect(card).toBeVisible();
  await expect(card).toHaveAttribute("href", "/jeux/buy-sell-no-trade");

  await card.click();
  await page.waitForURL("**/jeux/buy-sell-no-trade", { timeout: 5000 });

  // V2 : écran de sélection difficulté en premier
  await expect(page.getByRole("button", { name: /Débutant/ })).toBeVisible({ timeout: 5000 });
});

test("V2 difficulty picker — les 3 niveaux sont proposés", async ({ page }) => {
  await page.goto("/jeux/buy-sell-no-trade", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  await expect(page.getByRole("button", { name: /Débutant/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Intermédiaire/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Avancé/ })).toBeVisible();
});

test("V2 gameplay débutant — pick difficulty, decide, reveal, next", async ({ page }) => {
  await page.goto("/jeux/buy-sell-no-trade", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  // Choisir Débutant
  await page.getByRole("button", { name: /Débutant/ }).click();

  // Round 1 : 3 boutons de décision visibles
  await page.getByRole("button", { name: /^BUY$/ }).waitFor({ timeout: 5000 });
  await page.getByRole("button", { name: /^SELL$/ }).waitFor({ timeout: 5000 });
  await page.getByRole("button", { name: /^NO TRADE$/ }).waitFor({ timeout: 5000 });

  // Cliquer BUY → reveal animation → feedback
  await page.getByRole("button", { name: /^BUY$/ }).click();

  // Le bouton "Scénario suivant" apparaît après le reveal (animation ~2s)
  const next = page.getByRole("button", { name: /Scénario suivant|Voir le bilan/ });
  await expect(next).toBeVisible({ timeout: 8000 });

  // Le feedback contient les 3 rationales + lesson
  await expect(page.getByText(/bonne réponse|ton choix/i).first()).toBeVisible();
  await expect(page.getByText(/Leçon · Débutant/i)).toBeVisible();

  // Suivant
  await next.click();
  await expect(page.getByRole("button", { name: /^BUY$/ })).toBeVisible({ timeout: 5000 });
});

test("V2 gameplay avancé — 0 erreur console + reveal anim", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });

  await page.goto("/jeux/buy-sell-no-trade", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  await page.getByRole("button", { name: /Avancé/ }).click();
  await page.getByRole("button", { name: /^NO TRADE$/ }).click();
  await expect(page.getByRole("button", { name: /Scénario suivant|Voir le bilan/ })).toBeVisible({ timeout: 8000 });
  await expect(page.getByText(/Leçon · Avancé/i)).toBeVisible();

  expect(errors, `Erreurs console : ${errors.join("\n")}`).toHaveLength(0);
});

test("V2 screenshots — difficulty picker + round débutant", async ({ page }) => {
  await page.goto("/jeux/buy-sell-no-trade", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.screenshot({ path: "test-results/bsnt-v2-picker.png", fullPage: false });

  await page.getByRole("button", { name: /Débutant/ }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: "test-results/bsnt-v2-round-beginner.png", fullPage: false });

  await page.getByRole("button", { name: /^BUY$/ }).click();
  // attendre la fin du reveal (~2s pour 5 candles à 200ms)
  await expect(page.getByRole("button", { name: /Scénario suivant|Voir le bilan/ })).toBeVisible({ timeout: 8000 });
  await page.screenshot({ path: "test-results/bsnt-v2-feedback-beginner.png", fullPage: false });
});
