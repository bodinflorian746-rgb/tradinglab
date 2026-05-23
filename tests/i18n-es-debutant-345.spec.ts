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

// Tests des 3 nouvelles leçons LessonTemplate traduites via dispatcher.
const ES_LESSONS_345 = [
  { url: "/es/formations/debutant/lecon3", title: "Leer un gráfico de velas",       diagramText: "Vela verde" },
  { url: "/es/formations/debutant/lecon4", title: "Spread, Bid y Ask",              diagramText: "Movimiento suficiente" },
  { url: "/es/formations/debutant/lecon5", title: "El Stop Loss",                   diagramText: "Variación arriesgada" },
];

for (const { url, title, diagramText } of ES_LESSONS_345) {
  test(`ES leçon débutant LessonTemplate — ${url}`, async ({ page }) => {
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
    // Breadcrumb LessonPage chrome = "Cursos" (depuis common ES)
    await expect(page.getByRole("link", { name: "Cursos" }).first()).toBeVisible();
    // Bouton "Marcar lección como completada" (chrome ES)
    await expect(page.getByRole("button", { name: /Marcar lección como completada/i })).toBeVisible();
    // Diagramme inline en ES (texte spécifique à chaque page)
    await expect(page.getByText(diagramText).first()).toBeVisible();

    expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);

    const slug = url.split("/").pop();
    await page.screenshot({ path: `test-results/es-lecon-debutant-${slug}.png`, fullPage: true });
  });
}

// Non-régression FR pour chacune.
const FR_LESSONS_345 = [
  { url: "/fr/formations/debutant/lecon3", title: "Lire un graphique en bougies" },
  { url: "/fr/formations/debutant/lecon4", title: "Spread, Bid et Ask" },
  { url: "/fr/formations/debutant/lecon5", title: "Le Stop Loss" },
];

for (const { url, title } of FR_LESSONS_345) {
  test(`FR leçon débutant — ${url} reste en FR`, async ({ page }) => {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBe("fr");
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await expect(page.getByRole("link", { name: "Formations" }).first()).toBeVisible();
  });
}
