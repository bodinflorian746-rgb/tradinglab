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

// Pages testées : les 5 leçons débutant qui passent par DebutantLessonView.
// Pour chacune : overflow 0, lang=es, zéro erreur console, contenu ES présent.
const ES_LESSONS = [
  { url: "/es/formations/debutant/lecon2", title: "Comprar / Vender — Long y Short" },
  { url: "/es/formations/debutant/lecon6", title: "El Take Profit" },
  { url: "/es/formations/debutant/lecon7", title: "El Break Even" },
  { url: "/es/formations/debutant/lecon8", title: "Risk management — el money management" },
  { url: "/es/formations/debutant/lecon9", title: "Los errores del principiante" },
];

for (const { url, title } of ES_LESSONS) {
  test(`ES leçon débutant — ${url}`, async ({ page }) => {
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
    expect(overflow, "no overflow > 4px sur ES").toBeLessThanOrEqual(4);

    // Vérifier que le titre ES (h1) est présent — exact pour éviter strict
    // mode violation quand un h2 partage le même mot-clé.
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();

    // Vérifier le breadcrumb "Cursos" (chrome LessonPage en ES)
    await expect(page.getByRole("link", { name: "Cursos" }).first()).toBeVisible();

    // Vérifier le bouton "Marcar lección como completada"
    await expect(page.getByRole("button", { name: /Marcar lección como completada/i })).toBeVisible();

    // Vérifier le séparateur "Repaso" (traduit)
    await expect(page.getByText("Repaso").first()).toBeVisible();

    expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);

    const slug = url.split("/").pop();
    await page.screenshot({ path: `test-results/es-lecon-debutant-${slug}.png`, fullPage: true });
  });
}

test("ES leçon débutant 7 — diagramme Break Even traduit", async ({ page }) => {
  await page.goto("/es/formations/debutant/lecon7", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await expect(page.getByText(/Cómo activar el Break Even/i)).toBeVisible();
  await expect(page.getByText(/Mueves el SL de 75 000/i)).toBeVisible();
});

test("ES leçon débutant 8 — diagramme grille de risque traduit", async ({ page }) => {
  await page.goto("/es/formations/debutant/lecon8", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  // Header du diagramme (capture caption uppercase tracking-widest).
  await expect(page.getByText(/Grilla de riesgo — ideal y tope/i)).toBeVisible();
  await expect(page.getByText(/Zona llena = ideal/i)).toBeVisible();
});

test("ES leçon débutant 9 — diagramme biais traduit", async ({ page }) => {
  await page.goto("/es/formations/debutant/lecon9", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await expect(page.getByText(/Los 4 sesgos que destruyen las cuentas/i)).toBeVisible();
});

test("FR leçon débutant 2 — reste en FR (non-régression)", async ({ page }) => {
  await page.goto("/fr/formations/debutant/lecon2", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  const lang = await page.evaluate(() => document.documentElement.lang);
  expect(lang).toBe("fr");
  await expect(page.getByRole("heading", { name: "Acheter / Vendre — Long et Short" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Formations" }).first()).toBeVisible();
});
