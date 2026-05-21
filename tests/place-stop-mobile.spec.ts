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

  const card = page.getByRole("link", { name: /Place ton Stop|Quel stop va survivre/ }).first();
  await expect(card).toBeVisible();
  await expect(card).toHaveAttribute("href", "/jeux/place-stop");

  await card.click();
  await page.waitForURL("**/jeux/place-stop", { timeout: 5000 });

  // V2 : écran difficulty picker en premier
  await expect(page.getByRole("button", { name: /Débutant/ })).toBeVisible({ timeout: 5000 });
});

test("V2 difficulty picker — les 3 niveaux sont proposés", async ({ page }) => {
  await page.goto("/jeux/place-stop", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  await expect(page.getByRole("button", { name: /Débutant/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Intermédiaire/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Avancé/ })).toBeVisible();
});

test("V2 gameplay — pick difficulty, choisir stop, reveal, suivant", async ({ page }) => {
  await page.goto("/jeux/place-stop", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  // Choisir Débutant
  await page.getByRole("button", { name: /Débutant/ }).click();

  // Round 1 : 3 cards A / B / C visibles
  await expect(page.getByRole("button", { name: /Stop A/i })).toBeVisible({ timeout: 5000 });
  await expect(page.getByRole("button", { name: /Stop B/i })).toBeVisible({ timeout: 5000 });
  await expect(page.getByRole("button", { name: /Stop C/i })).toBeVisible({ timeout: 5000 });

  // Cliquer B (souvent le logical) → reveal → feedback
  await page.getByRole("button", { name: /Stop B/i }).click();

  // Attendre le reveal complet et le bouton suivant
  const next = page.getByRole("button", { name: /Scénario suivant|Voir le bilan/ });
  await expect(next).toBeVisible({ timeout: 8000 });

  // Le feedback contient les 3 verdicts de stops + lesson
  await expect(page.getByText(/Leçon · Débutant/i)).toBeVisible();
  await expect(page.getByText(/Ton choix/i)).toBeVisible();

  // Suivant
  await next.click();
  await expect(page.getByRole("button", { name: /Stop A/i })).toBeVisible({ timeout: 5000 });
});

test("V2 gameplay avancé — 0 erreur console + reveal anim", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });

  await page.goto("/jeux/place-stop", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  await page.getByRole("button", { name: /Avancé/ }).click();
  await page.getByRole("button", { name: /Stop A/i }).click();
  await expect(page.getByRole("button", { name: /Scénario suivant|Voir le bilan/ })).toBeVisible({ timeout: 8000 });
  await expect(page.getByText(/Leçon · Avancé/i)).toBeVisible();

  expect(errors, `Erreurs console : ${errors.join("\n")}`).toHaveLength(0);
});

test("V2 screenshots — picker + round débutant + feedback", async ({ page }) => {
  await page.goto("/jeux/place-stop", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.screenshot({ path: "test-results/place-stop-v2-picker.png", fullPage: false });

  await page.getByRole("button", { name: /Débutant/ }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: "test-results/place-stop-v2-round-beginner.png", fullPage: false });

  await page.getByRole("button", { name: /Stop B/i }).click();
  await expect(page.getByRole("button", { name: /Scénario suivant|Voir le bilan/ })).toBeVisible({ timeout: 8000 });
  await page.screenshot({ path: "test-results/place-stop-v2-feedback.png", fullPage: false });
});
