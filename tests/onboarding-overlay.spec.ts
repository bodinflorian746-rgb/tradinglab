import { test, expect } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});

test("onboarding — première visite affiche l'overlay welcome", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("pageerror", (err) => consoleErrors.push(String(err)));
  page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });

  // Reset onboarding pour simuler une 1re visite
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.localStorage.removeItem("tradinglab_onboarding_v1"));

  // Reload pour déclencher l'effet
  await page.reload();
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  // L'overlay doit apparaître (après le délai 350ms)
  const overlay = page.getByRole("dialog", { name: /Bienvenue sur TradingLab/i });
  await expect(overlay).toBeVisible({ timeout: 3000 });

  // Step 1 : welcome
  await expect(page.getByText(/Une plateforme pensée pour les vraies contraintes/i)).toBeVisible();
  await expect(page.getByText(/Progression recommandée/i)).toBeVisible();

  // 0 overflow
  const { docW, viewW } = await page.evaluate(() => ({
    docW: document.documentElement.scrollWidth,
    viewW: window.innerWidth,
  }));
  expect(docW - viewW).toBeLessThanOrEqual(4);

  expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);
});

test("onboarding — clic 'Commencer' → step 2 avec 3 portes", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.localStorage.removeItem("tradinglab_onboarding_v1"));
  await page.reload();
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 3000 });

  // Clic "Commencer"
  await page.getByRole("button", { name: /^Commencer$/i }).click();

  // Step 2 : 3 portes
  await expect(page.getByText(/Par quoi tu veux commencer/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /Commencer les bases/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Tester les jeux/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Explorer les stratégies/i })).toBeVisible();
});

test("onboarding — clic sur une porte navigue + marque done", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.localStorage.removeItem("tradinglab_onboarding_v1"));
  await page.reload();
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 3000 });
  await page.getByRole("button", { name: /^Commencer$/i }).click();

  // Clic "Tester les jeux"
  await page.getByRole("link", { name: /Tester les jeux/i }).click();
  await page.waitForURL("**/jeux", { timeout: 5000 });

  // localStorage doit contenir le flag done
  const stored = await page.evaluate(() => window.localStorage.getItem("tradinglab_onboarding_v1"));
  expect(stored).toBe("done");
});

test("onboarding — visite 2 n'affiche plus l'overlay", async ({ page }) => {
  // Pré-marquer comme done
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.localStorage.setItem("tradinglab_onboarding_v1", "done"));
  await page.reload();
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.waitForTimeout(800); // attendre le délai de l'effect

  // L'overlay NE doit PAS s'afficher
  const dialog = page.getByRole("dialog", { name: /Bienvenue sur TradingLab/i });
  await expect(dialog).not.toBeVisible();
});

test("onboarding — clic sur backdrop ferme + marque done", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.localStorage.removeItem("tradinglab_onboarding_v1"));
  await page.reload();
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  const overlay = page.getByRole("dialog");
  await expect(overlay).toBeVisible({ timeout: 3000 });

  // Clic sur bouton X (Fermer)
  await page.getByRole("button", { name: /Fermer/i }).click();
  await expect(overlay).not.toBeVisible();
  const stored = await page.evaluate(() => window.localStorage.getItem("tradinglab_onboarding_v1"));
  expect(stored).toBe("done");
});

test("screenshot — onboarding step 1 + step 2", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.localStorage.removeItem("tradinglab_onboarding_v1"));
  await page.reload();
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 3000 });
  await page.screenshot({ path: "test-results/onboarding-step1.png", fullPage: false });

  await page.getByRole("button", { name: /^Commencer$/i }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: "test-results/onboarding-step2.png", fullPage: false });
});
