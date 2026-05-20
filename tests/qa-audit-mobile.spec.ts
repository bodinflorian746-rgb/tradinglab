import { test, expect } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});

// Échantillon représentatif : entrées + une page profonde par module
const PAGES = [
  { url: "/", name: "homepage" },
  { url: "/formations", name: "formations-index" },
  { url: "/formations/macro", name: "macro-index" },
  { url: "/strategies", name: "strategies-index" },
  { url: "/pricing", name: "pricing" },
  // Pages profondes 1 par niveau
  { url: "/formations/debutant/lecon1", name: "debutant-l1-gamified" },
  { url: "/formations/intermediaire/lecon7", name: "intermediaire-multitf" },
  { url: "/formations/avance/lecon8", name: "avance-journal" },
  { url: "/formations/macro/debutant/lecon4", name: "macro-deb-inflation" },
  { url: "/formations/macro/avance/lecon3", name: "macro-av-us10y" },
  { url: "/strategies/price-action/lecon2", name: "strat-deb-pinbar" },
  { url: "/strategies/smc/lecon1", name: "strat-int-smc" },
  { url: "/strategies/ict/lecon3", name: "strat-av-killzones" },
  { url: "/strategies/macro-trading/lecon4", name: "strat-av-macrofilter" },
];

for (const { url, name } of PAGES) {
  test(`[QA] ${name} — ${url}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];
    page.on("pageerror", (err) => consoleErrors.push(`PageError: ${err.message}`));
    page.on("console", (msg) => {
      const text = msg.text();
      if (msg.type() === "error") consoleErrors.push(text);
      else if (msg.type() === "warning") consoleWarnings.push(text);
    });

    const response = await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    // 1. HTTP status
    expect(response?.status(), `HTTP status ${response?.status()} for ${url}`).toBeLessThan(400);

    // 2. Overflow horizontal global
    const { docW, viewW, bodyW } = await page.evaluate(() => ({
      docW: document.documentElement.scrollWidth,
      viewW: window.innerWidth,
      bodyW: document.body.scrollWidth,
    }));
    const overflow = Math.max(docW, bodyW) - viewW;
    console.log(`[${url}] viewport=${viewW} doc=${docW} body=${bodyW} overflow=${overflow}px`);
    expect(overflow, `Overflow horizontal ${overflow}px sur ${url}`).toBeLessThanOrEqual(4);

    // 3. Page a un titre H1 ou H2 (sanity)
    const headingsCount = await page.locator("h1, h2").count();
    expect(headingsCount, `Aucun heading sur ${url}`).toBeGreaterThan(0);

    // 4. Burger menu mobile cliquable
    const burger = page.locator('button[aria-label*="menu"]');
    if (await burger.count() > 0) {
      await expect(burger.first()).toBeVisible();
    }

    // 5. Aucune erreur console
    expect(consoleErrors, `Erreurs console : ${consoleErrors.join("\n")}`).toHaveLength(0);

    // 6. Warnings reportés (pas bloquant)
    if (consoleWarnings.length > 0) {
      console.log(`[WARN ${url}]`, consoleWarnings.slice(0, 3));
    }
  });
}

// Test interaction : burger menu mobile s'ouvre + ferme
test("[QA] burger menu mobile fonctionnel", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const burger = page.locator('button[aria-label*="menu"]').first();
  await expect(burger).toBeVisible();

  // Ouverture
  await burger.click();
  await expect(page.locator('a[href="/formations"]').last()).toBeVisible();

  // Fermeture par clic sur lien
  // (puis re-ouverture pour test fermeture par toggle)
  await burger.click();
  // Vérifier qu'au moins l'un des liens du panneau est masqué (display:none) ou parent invisible
  // (Le panneau disparaît via state isOpen, donc les liens du panneau ne sont plus dans le DOM)
  const panelLinks = await page.locator('div.md\\:hidden a[href="/formations"]').count();
  expect(panelLinks, "Le panneau mobile devrait être fermé").toBe(0);
});

// Test navigation entre lecons (prev/next)
test("[QA] navigation prev/next entre lecons debutant", async ({ page }) => {
  await page.goto("/formations/debutant/lecon4", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});

  // Lien Leçon précédente
  const prevLink = page.locator('a[href="/formations/debutant/lecon3"]').first();
  await expect(prevLink, "Lien Leçon 3 manquant depuis lecon4").toBeVisible();

  // Lien Leçon suivante
  const nextLink = page.locator('a[href="/formations/debutant/lecon5"]').first();
  await expect(nextLink, "Lien Leçon 5 manquant depuis lecon4").toBeVisible();
});
