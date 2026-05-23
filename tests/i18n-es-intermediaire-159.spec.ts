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

// ES — lecciones cible 1, 5, 9 del módulo intermediaire
const ES_LESSONS = [
  { url: "/es/formations/intermediaire/lecon1", title: "Estructura de mercado — BOS y CHoCH", bodyMarker: "tendencia" },
  { url: "/es/formations/intermediaire/lecon5", title: "Confluencias y probabilidad", bodyMarker: "confluencia" },
  { url: "/es/formations/intermediaire/lecon9", title: "Fibonacci — retrocesos y confluencias", bodyMarker: "golden ratio" },
];

for (const { url, title, bodyMarker } of ES_LESSONS) {
  test(`ES intermediaire — ${url}`, async ({ page }) => {
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
    // Breadcrumb chrome ES
    await expect(page.getByRole("link", { name: "Cursos" }).first()).toBeVisible();
    // Bouton chrome ES
    await expect(page.getByRole("button", { name: /Marcar lección como completada/i })).toBeVisible();
    // Body ES
    await expect(page.getByText(bodyMarker, { exact: false }).first()).toBeVisible();

    expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);

    const slug = url.split("/").pop();
    await page.screenshot({ path: `test-results/es-lecon-intermediaire-${slug}.png`, fullPage: true });
  });
}

// FR non-régression
const FR_LESSONS = [
  { url: "/fr/formations/intermediaire/lecon1", title: "Structure de marché — BOS & CHoCH" },
  { url: "/fr/formations/intermediaire/lecon5", title: "Confluences et probabilité" },
  { url: "/fr/formations/intermediaire/lecon9", title: "Fibonacci — retracements et confluences" },
];

for (const { url, title } of FR_LESSONS) {
  test(`FR intermediaire — ${url} reste en FR`, async ({ page }) => {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBe("fr");
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await expect(page.getByRole("link", { name: "Formations" }).first()).toBeVisible();
  });
}
