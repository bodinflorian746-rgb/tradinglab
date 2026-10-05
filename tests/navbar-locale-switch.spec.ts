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

      // Le sélecteur de langue est désormais compact ("FR ▾") : on l'ouvre
      // avant d'atteindre les liens hrefLang.
      await page.getByTestId("nav-lang-trigger").first().click();
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

      // Active state : rouvrir le menu (fermé après navigation) — ES actif, FR non.
      await page.getByTestId("nav-lang-trigger").first().click();
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

    // Déclencheur compact déjà visible dans le top bar en mobile
    await expect(page.getByTestId("nav-lang-trigger").first()).toBeVisible();

    // Open burger
    await page.getByTestId("nav-burger").click();

    // Le panneau mobile a sa propre instance du sélecteur (top + panneau = 2)
    await expect(page.getByTestId("nav-lang-trigger")).toHaveCount(2);

    // Ouvrir le sélecteur du panneau (le second) puis cliquer ES
    await page.getByTestId("nav-lang-trigger").nth(1).click();
    const esInPanel = page.locator('nav a[hrefLang="es"]').first();
    await Promise.all([
      page.waitForURL((u) => u.pathname.startsWith("/es"), { timeout: 10_000 }),
      esInPanel.click(),
    ]);
    expect(new URL(page.url()).pathname).toBe("/es/formations");
    expect(await readLang(page)).toBe("es");
  });
});
