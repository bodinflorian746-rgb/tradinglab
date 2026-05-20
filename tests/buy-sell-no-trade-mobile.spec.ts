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

  // Page du jeu chargée : 3 boutons de décision visibles
  await expect(page.getByRole("button", { name: /^BUY$/ })).toBeVisible({ timeout: 5000 });
});

test("gameplay — choisir BUY puis avancer", async ({ page }) => {
  await page.goto("/jeux/buy-sell-no-trade", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  // Attendre que le 1er scenario s'affiche (3 boutons visibles)
  await page.getByRole("button", { name: /BUY/ }).waitFor({ timeout: 5000 });
  await page.getByRole("button", { name: /SELL/ }).waitFor({ timeout: 5000 });
  await page.getByRole("button", { name: /NO TRADE/ }).waitFor({ timeout: 5000 });

  // Clic sur BUY -> feedback doit apparaître
  await page.getByRole("button", { name: /^BUY$/ }).click();

  // Le bouton "Scénario suivant" ou "Voir le bilan" doit apparaître
  const next = page.getByRole("button", { name: /Scénario suivant|Voir le bilan/ });
  await expect(next).toBeVisible({ timeout: 5000 });

  // Avancer
  await next.click();

  // Après le suivant : soit nouveaux boutons BUY/SELL/NO TRADE (round 2), soit page de bilan
  const nextRoundButton = page.getByRole("button", { name: /^BUY$/ });
  await expect(nextRoundButton).toBeVisible({ timeout: 5000 });
});
