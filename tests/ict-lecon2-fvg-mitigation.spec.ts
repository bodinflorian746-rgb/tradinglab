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

test("ICT lecon2 — nouvelle section FVG : rebond / mitigation profonde / invalidation", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("pageerror", (err) => consoleErrors.push(String(err)));
  page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });

  await page.goto("/strategies/ict/lecon2", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  // 0 overflow
  const { docW, viewW } = await page.evaluate(() => ({
    docW: document.documentElement.scrollWidth,
    viewW: window.innerWidth,
  }));
  expect(docW - viewW).toBeLessThanOrEqual(4);

  // Section présente
  await expect(page.getByText(/Rebond, mitigation profonde ou invalidation/i)).toBeVisible();
  await expect(page.getByText(/FVG haussier — 3 retours possibles/i)).toBeVisible();

  // Les 3 mini-scenarios sont visibles (labels A / B / C avec titres)
  await expect(page.getByText("Rebond immédiat").first()).toBeVisible();
  await expect(page.getByText("Mitigation profonde + réaction").first()).toBeVisible();
  await expect(page.getByText("Invalidation réelle").first()).toBeVisible();

  // Les 4 catégories text-only sont présentes
  await expect(page.getByText("1. Rebond immédiat")).toBeVisible();
  await expect(page.getByText("2. Mitigation partielle")).toBeVisible();
  await expect(page.getByText("3. Mitigation profonde")).toBeVisible();
  await expect(page.getByText("4. Invalidation réelle")).toBeVisible();

  // Règle à retenir
  await expect(page.getByText(/FVG rempli SANS réaction \+ structure cassée/i)).toBeVisible();

  // Exemple concret EUR/USD
  await expect(page.getByText(/FVG haussier entre 1\.0840 et 1\.0860/i)).toBeVisible();

  expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);
});

test("screenshot — nouvelle section FVG sur mobile", async ({ page }) => {
  await page.goto("/strategies/ict/lecon2", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  // Scroll jusqu'à la nouvelle section
  await page.getByText(/Rebond, mitigation profonde ou invalidation/i).scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: "test-results/ict-lecon2-mitigation-scenarios.png", fullPage: false });
});
