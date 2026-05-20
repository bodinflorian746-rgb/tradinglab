import { test, expect } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});

const PAGES = ["/jeux", "/jeux/place-stop"];

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

test("navigation — depuis /jeux le bouton 'Place ton Stop' ouvre le jeu", async ({ page }) => {
  await page.goto("/jeux", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  const card = page.getByRole("link", { name: /Place ton Stop|Jouer maintenant.*Stop/ }).first();
  await expect(card).toBeVisible();
  await expect(card).toHaveAttribute("href", "/jeux/place-stop");

  await card.click();
  await page.waitForURL("**/jeux/place-stop", { timeout: 5000 });

  await expect(page.getByRole("button", { name: /Valider le stop/ })).toBeVisible({ timeout: 5000 });
});

test("preuve visuelle — screenshot mobile /jeux/place-stop", async ({ page }) => {
  await page.goto("/jeux/place-stop", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.screenshot({ path: "test-results/place-stop-mobile.png", fullPage: false });
  // Bouton Valider doit être présent (la card scenario remplit le 1er écran ;
  // le user scroll naturellement aux contrôles).
  await expect(page.getByRole("button", { name: /Valider le stop/ })).toBeVisible();
});

test("gameplay — ajuster stop, valider, reveal, scénario suivant", async ({ page }) => {
  await page.goto("/jeux/place-stop", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  // Ajuster le stop (clic sur Plus bas + Plus haut, exact pour éviter le match avec "vite")
  const finerDown = page.getByRole("button", { name: "Plus bas", exact: true });
  await finerDown.click();
  await finerDown.click();

  // Valider
  await page.getByRole("button", { name: /Valider le stop/ }).click();

  // Attendre fin de l'animation reveal + feedback (~2.5s max)
  await expect(page.getByRole("button", { name: /Scénario suivant|Voir le bilan/ })).toBeVisible({ timeout: 8000 });

  // Avancer
  await page.getByRole("button", { name: /Scénario suivant|Voir le bilan/ }).click();

  // Soit nouveau Valider visible (round 2), soit bilan
  const next = page.getByRole("button", { name: /Valider le stop|Rejouer/ });
  await expect(next).toBeVisible({ timeout: 5000 });
});

test("place-stop : 0 erreur console pendant un round complet", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });

  await page.goto("/jeux/place-stop", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  await page.getByRole("button", { name: /Valider le stop/ }).click();
  await expect(page.getByRole("button", { name: /Scénario suivant|Voir le bilan/ })).toBeVisible({ timeout: 8000 });

  expect(errors, `Erreurs : ${errors.join("\n")}`).toHaveLength(0);
});
