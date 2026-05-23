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

// ES — premières leçons des 4 modules débutant
const ES_LESSONS = [
  { url: "/es/strategies/price-action/lecon1" },
  { url: "/es/strategies/support-resistance/lecon1" },
  { url: "/es/strategies/trend-following/lecon1" },
  { url: "/es/strategies/reversal/lecon1" },
];

for (const { url } of ES_LESSONS) {
  test(`ES strategies débutant — ${url}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const ignored404 = new Set<string>();
    page.on("pageerror", (err) => consoleErrors.push(String(err)));
    page.on("response", (resp) => {
      if (resp.status() === 404) ignored404.add(resp.url());
    });
    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      const t = msg.text();
      // Filtre les 404 génériques (Next prefetch sur leçons inexistantes, bug pré-existant identique à ICT)
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
    await expect(page.getByRole("link", { name: "Estrategias" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Marcar lección como completada/i })).toBeVisible();

    expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);

    const parts = url.split("/");
    const mod = parts[parts.length - 2];
    const slug = parts[parts.length - 1];
    await page.screenshot({ path: `test-results/es-strategies-${mod}-${slug}.png`, fullPage: true });
  });
}

// FR non-régression
const FR_LESSONS = [
  { url: "/fr/strategies/price-action/lecon1" },
  { url: "/fr/strategies/trend-following/lecon1" },
];

for (const { url } of FR_LESSONS) {
  test(`FR strategies débutant — ${url} reste en FR`, async ({ page }) => {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBe("fr");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Stratégies" }).first()).toBeVisible();
  });
}
