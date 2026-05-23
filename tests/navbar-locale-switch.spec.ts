import { test, expect, type Page } from "@playwright/test";

const ROUTES = [
  "/fr",
  "/fr/formations",
  "/fr/formations/debutant/lecon1",
  "/fr/strategies",
  "/fr/jeux",
];

async function setupNoOverlay(page: Page) {
  await page.addInitScript(() => {
    try { window.localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch {}
  });
}

async function readLang(page: Page): Promise<string> {
  return page.evaluate(() => document.documentElement.lang);
}

test.describe("Navbar — language switcher FR ↔ ES", () => {
  for (const url of ROUTES) {
    test(`Desktop FR → ES preserves path : ${url}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      page.on("console", (m) => {
        if (m.type() === "error" && !m.text().includes("Failed to load resource")) {
          errors.push(m.text());
        }
      });

      await setupNoOverlay(page);
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
      expect(await readLang(page)).toBe("fr");

      // Click ES in switcher
      const esLink = page.locator('nav a[hrefLang="es"]').first();
      await expect(esLink).toBeVisible();
      await Promise.all([
        page.waitForURL((u) => u.pathname.startsWith("/es"), { timeout: 10_000 }),
        esLink.click(),
      ]);
      await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

      const expected = url.replace(/^\/fr/, "/es");
      expect(new URL(page.url()).pathname).toBe(expected);
      expect(await readLang(page)).toBe("es");

      // Active state : ES becomes white, FR becomes muted
      const esAfter = page.locator('nav a[hrefLang="es"]').first();
      const frAfter = page.locator('nav a[hrefLang="fr"]').first();
      await expect(esAfter).toHaveAttribute("aria-current", "true");
      await expect(frAfter).not.toHaveAttribute("aria-current", /.*/);

      // Switch back ES → FR
      await Promise.all([
        page.waitForURL((u) => u.pathname.startsWith("/fr"), { timeout: 10_000 }),
        frAfter.click(),
      ]);
      await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
      expect(new URL(page.url()).pathname).toBe(url);
      expect(await readLang(page)).toBe("fr");

      expect(errors, `Erreurs : ${errors.join("\n")}`).toHaveLength(0);
    });
  }

  test("Mobile : burger menu exposes language switcher", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await setupNoOverlay(page);
    await page.goto("/fr/formations", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    // Switcher déjà visible dans le top bar (right cluster) en mobile
    const esTop = page.locator('nav a[hrefLang="es"]').first();
    await expect(esTop).toBeVisible();

    // Open burger
    const burger = page.locator('nav button[aria-label]').first();
    await burger.click();

    // Both FR and ES links should now be present (top + mobile panel = 2 each)
    await expect(page.locator('nav a[hrefLang="es"]')).toHaveCount(2);
    await expect(page.locator('nav a[hrefLang="fr"]')).toHaveCount(2);

    // Click ES from mobile panel (the second one — inside burger)
    const esInPanel = page.locator('nav a[hrefLang="es"]').nth(1);
    await Promise.all([
      page.waitForURL((u) => u.pathname.startsWith("/es"), { timeout: 10_000 }),
      esInPanel.click(),
    ]);
    expect(new URL(page.url()).pathname).toBe("/es/formations");
    expect(await readLang(page)).toBe("es");
  });
});
