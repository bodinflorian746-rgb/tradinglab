// Langues désactivées (i18n/config.ts, ACTIVE_LOCALES ; décision PO du 2026-10-07 :
// français uniquement) :
//  - /<langue>/... redirige en permanent vers la même page en FR, y compris avec
//    une préférence de langue enregistrée (cookie) ;
//  - le sitemap et les hreflang ne listent que les langues actives ;
//  - pas de sélecteur de langue s'il ne reste qu'une langue.
import { test, expect } from "@playwright/test";
import { ACTIVE_LOCALES, DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE } from "../i18n/config";

const INACTIVE = LOCALES.filter((l) => !ACTIVE_LOCALES.includes(l));
const PATHS = ["", "/jeux", "/pricing", "/formations/debutant/lecon1", "/strategies/smc/lecon2", "/formations/macro/debutant/lecon1"];

test.describe("Langues désactivées", () => {
  test.skip(INACTIVE.length === 0, "aucune langue désactivée");

  for (const lang of INACTIVE) for (const p of PATHS) {
    test(`/${lang}${p} → /${DEFAULT_LOCALE}${p} (permanent)`, async ({ request }) => {
      const r = await request.get(`/${lang}${p}?ref=test`, { maxRedirects: 0 });
      expect([301, 308]).toContain(r.status());
      const loc = new URL(r.headers()["location"], "http://x");
      expect(loc.pathname).toBe(`/${DEFAULT_LOCALE}${p}`);
      expect(loc.search).toBe("?ref=test");
    });
  }

  for (const lang of INACTIVE) {
    test(`préférence ${lang} enregistrée : / et /jeux vont en ${DEFAULT_LOCALE}`, async ({ request }) => {
      for (const p of ["/", "/jeux"]) {
        const r = await request.get(p, { maxRedirects: 0, headers: { Cookie: `${LOCALE_COOKIE}=${lang}`, "Accept-Language": `${lang},${lang}-XX;q=0.9` } });
        expect(r.status()).toBeGreaterThanOrEqual(300);
        expect(new URL(r.headers()["location"], "http://x").pathname).toBe(p === "/" ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${p}`);
      }
    });
  }

  test("sitemap et hreflang : langues actives seulement", async ({ request }) => {
    const sm = await request.get("/sitemap.xml", { maxRedirects: 0 });
    expect(sm.status()).toBe(200);
    const xml = await sm.text();
    expect(xml).toContain(`/${DEFAULT_LOCALE}/jeux</loc>`);
    for (const lang of INACTIVE) {
      expect(xml).not.toMatch(new RegExp(`/${lang}(/|<)`));
      expect(xml).not.toContain(`hreflang="${lang}"`);
    }
    const html = await (await request.get(`/${DEFAULT_LOCALE}/jeux`)).text();
    for (const lang of INACTIVE) expect(html).not.toMatch(new RegExp(`hrefLang="${lang}"`, "i"));
  });

  test("pas de sélecteur de langue (desktop et menu mobile)", async ({ page }) => {
    test.skip(ACTIVE_LOCALES.length > 1, "plusieurs langues actives");
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(`/${DEFAULT_LOCALE}/jeux`);
    await expect(page.getByTestId("nav-lang-trigger")).toHaveCount(0);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${DEFAULT_LOCALE}`);
    const burger = page.locator("nav button[aria-expanded]").last();
    if (await burger.isVisible()) await burger.click();
    await expect(page.getByTestId("nav-lang-trigger")).toHaveCount(0);
    expect(errors).toEqual([]);
  });
});
