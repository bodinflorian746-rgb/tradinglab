import { test, expect, type Page } from "@playwright/test";

async function setupNoOverlay(page: Page) {
  await page.addInitScript(() => {
    try { window.localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch {}
  });
}

test.describe("Homepage — polish visuel (FR + ES, desktop + mobile)", () => {
  for (const url of ["/fr", "/es"]) {
    test(`Desktop ${url} — no overflow, no console errors, hero visible`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      page.on("console", (m) => {
        if (m.type() === "error" && !m.text().includes("Failed to load resource")) {
          errors.push(m.text());
        }
      });

      await setupNoOverlay(page);
      await page.setViewportSize({ width: 1280, height: 800 });
      const resp = await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
      expect(resp?.status()).toBeLessThan(400);

      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(4);

      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      expect(errors, `Erreurs : ${errors.join("\n")}`).toHaveLength(0);
    });

    test(`Mobile ${url} — no overflow, navbar + hero visible`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      page.on("console", (m) => {
        if (m.type() === "error" && !m.text().includes("Failed to load resource")) {
          errors.push(m.text());
        }
      });

      await setupNoOverlay(page);
      await page.setViewportSize({ width: 390, height: 844 });
      const resp = await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
      expect(resp?.status()).toBeLessThan(400);

      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(4);

      // Navbar + LangSwitcher toujours présent
      await expect(page.locator('nav a[hrefLang]').first()).toBeVisible();
      // H1 du hero
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      expect(errors, `Erreurs : ${errors.join("\n")}`).toHaveLength(0);
    });
  }
});
