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

// ES — lecciones cible 1, 5, 9 del módulo avance
const ES_LESSONS = [
  { url: "/es/formations/avance/lecon1", title: "Liquidity", bodyMarker: "Buy-side" },
  { url: "/es/formations/avance/lecon5", title: "OTE — Optimal Trade Entry", bodyMarker: "golden ratio" },
  { url: "/es/formations/avance/lecon9", title: "Backtesting — validar tu estrategia", bodyMarker: "Replay" },
];

for (const { url, title, bodyMarker } of ES_LESSONS) {
  test(`ES avance — ${url}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => consoleErrors.push(String(err)));
    page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });

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

    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await expect(page.getByRole("link", { name: "Cursos" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Marcar lección como completada/i })).toBeVisible();
    await expect(page.getByText(bodyMarker, { exact: false }).first()).toBeVisible();

    expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);

    const slug = url.split("/").pop();
    await page.screenshot({ path: `test-results/es-lecon-avance-${slug}.png`, fullPage: true });
  });
}

// FR non-régression
const FR_LESSONS = [
  { url: "/fr/formations/avance/lecon1", title: "Liquidité" },
  { url: "/fr/formations/avance/lecon5", title: "OTE — Optimal Trade Entry" },
  { url: "/fr/formations/avance/lecon9", title: "Backtesting — valider sa stratégie" },
];

for (const { url, title } of FR_LESSONS) {
  test(`FR avance — ${url} reste en FR`, async ({ page }) => {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBe("fr");
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await expect(page.getByRole("link", { name: "Formations" }).first()).toBeVisible();
  });
}
