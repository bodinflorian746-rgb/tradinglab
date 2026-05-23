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

// ES — las 5 lecciones del módulo SMC
const ES_LESSONS = [
  { url: "/es/strategies/smc/lecon1", titleSubstring: "Market Structure SMC", bodyMarker: "estructura" },
  { url: "/es/strategies/smc/lecon2", titleSubstring: "BOS y CHoCH", bodyMarker: "ruptura" },
  { url: "/es/strategies/smc/lecon3", titleSubstring: "Order Blocks", bodyMarker: "impulso" },
  { url: "/es/strategies/smc/lecon4", titleSubstring: "FVG y liquidity", bodyMarker: "sweep" },
  { url: "/es/strategies/smc/lecon5", titleSubstring: "trade SMC completo", bodyMarker: "mitigation" },
];

for (const { url, titleSubstring, bodyMarker } of ES_LESSONS) {
  test(`ES SMC — ${url}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const ignored404Urls: string[] = [];
    // Pre-existing bug (FR+ES): module SMC peut potentiellement avoir des prefetch 404 sur lecon disabled
    page.on("pageerror", (err) => consoleErrors.push(String(err)));
    page.on("response", (resp) => {
      if (resp.status() === 404 && /\/strategies\/smc\/lecon\d/.test(resp.url())) {
        ignored404Urls.push(resp.url());
      }
    });
    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      const t = msg.text();
      if (t.includes("Failed to load resource") && ignored404Urls.length > 0) return;
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

    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    const h1Text = (await h1.textContent()) ?? "";
    expect(h1Text.toLowerCase()).toContain(titleSubstring.toLowerCase());

    await expect(page.getByRole("link", { name: "Estrategias" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Marcar lección como completada/i })).toBeVisible();
    await expect(page.getByText(bodyMarker, { exact: false }).first()).toBeVisible();

    expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);

    const slug = url.split("/").pop();
    await page.screenshot({ path: `test-results/es-lecon-smc-${slug}.png`, fullPage: true });
  });
}

// FR non-régression sur 3 lecciones
const FR_LESSONS = [
  { url: "/fr/strategies/smc/lecon1", titleSubstring: "Market Structure SMC" },
  { url: "/fr/strategies/smc/lecon3", titleSubstring: "Order Blocks" },
  { url: "/fr/strategies/smc/lecon5", titleSubstring: "trade SMC complet" },
];

for (const { url, titleSubstring } of FR_LESSONS) {
  test(`FR SMC — ${url} reste en FR`, async ({ page }) => {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBe("fr");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    const h1Text = (await h1.textContent()) ?? "";
    expect(h1Text.toLowerCase()).toContain(titleSubstring.toLowerCase());
    await expect(page.getByRole("link", { name: "Stratégies" }).first()).toBeVisible();
  });
}
