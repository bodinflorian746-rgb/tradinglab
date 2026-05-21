import { test, expect } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});

test("home — section 'Ta progression' refactorée", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("pageerror", (err) => consoleErrors.push(String(err)));
  page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  // Overflow check
  const { docW, viewW } = await page.evaluate(() => ({
    docW: document.documentElement.scrollWidth,
    viewW: window.innerWidth,
  }));
  expect(docW - viewW).toBeLessThanOrEqual(4);

  // Nouveau titre présent
  await expect(page.getByText("Une plateforme de progression trading")).toBeVisible();
  await expect(page.getByText("Ta progression").first()).toBeVisible();

  // Les 4 nouveaux titres de cards
  await expect(page.getByText("Construire des bases solides")).toBeVisible();
  await expect(page.getByText("Développer une vraie méthode")).toBeVisible();
  await expect(page.getByText("S'entraîner sur des situations réelles")).toBeVisible();
  await expect(page.getByText("Passer de la théorie à l'exécution")).toBeVisible();

  // Anciens textes catégorisants supprimés
  await expect(page.getByText(/Tu débutes complètement/)).not.toBeVisible();
  await expect(page.getByText(/Tu as 500€/)).not.toBeVisible();
  await expect(page.getByText(/30 min par jour/)).not.toBeVisible();
  await expect(page.getByText(/Tu as déjà perdu/)).not.toBeVisible();

  expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);
});

test("screenshot — section progression mobile", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  // Scroll jusqu'à la nouvelle section
  await page.getByText("Une plateforme de progression trading").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: "test-results/home-progression-section.png", fullPage: false });
});
