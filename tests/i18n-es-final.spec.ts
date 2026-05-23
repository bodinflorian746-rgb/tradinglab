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

const ES_LESSONS = [
  { url: "/es/formations/debutant/lecon1" },
  { url: "/es/formations/macro/debutant/lecon1" },
  { url: "/es/formations/macro/intermediaire/lecon1" },
  { url: "/es/formations/macro/avance/lecon1" },
  { url: "/es/formations/macro/debutant/lecon6" },
  { url: "/es/formations/macro/intermediaire/lecon6" },
];

for (const { url } of ES_LESSONS) {
  test(`ES final — ${url}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const ignored404 = new Set<string>();
    page.on("pageerror", (err) => consoleErrors.push(String(err)));
    page.on("response", (resp) => {
      if (resp.status() === 404) ignored404.add(resp.url());
    });
    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      const t = msg.text();
      if (t.includes("Failed to load resource") && ignored404.size > 0) return;
      consoleErrors.push(t);
    });

    const response = await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    expect(response?.status()).toBeLessThan(400);

    const { docW, viewW, lang } = await page.evaluate(() => ({
      docW: document.documentElement.scrollWidth,
      viewW: window.innerWidth,
      lang: document.documentElement.lang,
    }));
    const overflow = docW - viewW;
    console.log(`[${url}] lang=${lang} overflow=${overflow}px`);
    expect(lang).toBe("es");
    expect(overflow).toBeLessThanOrEqual(4);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);
  });
}

const ES_GAMES = [
  { url: "/es/jeux" },
  { url: "/es/jeux/buy-sell-no-trade" },
  { url: "/es/jeux/build-the-trade" },
  { url: "/es/jeux/find-the-mistake" },
  { url: "/es/jeux/place-stop" },
];

for (const { url } of ES_GAMES) {
  test(`ES games — ${url}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => consoleErrors.push(String(err)));
    page.on("console", (msg) => {
      if (msg.type() === "error" && !msg.text().includes("Failed to load resource")) {
        consoleErrors.push(msg.text());
      }
    });

    const response = await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    expect(response?.status()).toBeLessThan(400);

    const { docW, viewW, lang } = await page.evaluate(() => ({
      docW: document.documentElement.scrollWidth,
      viewW: window.innerWidth,
      lang: document.documentElement.lang,
    }));
    const overflow = docW - viewW;
    console.log(`[${url}] lang=${lang} overflow=${overflow}px`);
    expect(lang).toBe("es");
    expect(overflow).toBeLessThanOrEqual(4);

    expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);
  });
}

// FR non-régression
const FR_LESSONS = [
  { url: "/fr/formations/debutant/lecon1" },
  { url: "/fr/formations/macro/intermediaire/lecon5" },
  { url: "/fr/jeux/buy-sell-no-trade" },
];

for (const { url } of FR_LESSONS) {
  test(`FR non-régression — ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBe("fr");
  });
}
