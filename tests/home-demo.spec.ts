import { test, expect, type Page } from "@playwright/test";

// Démo de la home (demande du PO, 2026-10-30) : trois manches courtes, une par jeu, puis le score
// (« 2/3 »), le nombre de scénarios et de leçons, et l'essai gratuit (visiteur). Sur téléphone, la
// carte tient dans l'écran à chaque étape. Aucun « ~6 min ».

async function setupNoOverlay(page: Page) {
  await page.addInitScript(() => {
    try { window.localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch {}
  });
}

async function cardFits(page: Page, h: number) {
  const box = await page.locator(".hv2-game").boundingBox();
  expect(box, "carte de la démo").not.toBeNull();
  expect(box!.height, "la carte tient dans l'écran").toBeLessThanOrEqual(h);
}

for (const [w, h] of [[390, 844], [1440, 900]] as const) {
  test.describe(`Démo de la home (${w} px)`, () => {
    // visiteur : l'essai gratuit
    test.use({ storageState: { cookies: [], origins: [] }, viewport: { width: w, height: h } });

    test("trois manches, score, scénarios et leçons, essai gratuit", async ({ page }) => {
      await setupNoOverlay(page);
      await page.goto("/fr", { waitUntil: "domcontentloaded" });
      const card = page.locator(".hv2-game");
      await expect(card).toBeVisible();
      await expect(card).not.toContainText(/~\s?\d+\s?min/);
      const games = ["BUY / SELL / NO TRADE", "Place ton Stop", "Trouve l'erreur"];
      for (let i = 0; i < 3; i++) {
        await expect(page.locator(`[data-demo-round="${i + 1}"]`)).toBeVisible();
        await expect(card).toContainText(games[i]);
        await expect(card).toContainText(`Manche ${i + 1}/3`);
        await card.scrollIntoViewIfNeeded();
        if (w === 390) await cardFits(page, h);
        await card.locator(".hv2-choices button").first().click();
        const next = card.getByRole("button", { name: i < 2 ? "Manche suivante" : "Voir mon score" });
        await expect(next).toBeVisible({ timeout: 20_000 });
        if (w === 390) await cardFits(page, h);
        await next.click();
      }
      const end = page.locator("[data-demo-end]");
      await expect(end).toBeVisible();
      await expect(end).toContainText(/[0-3]\/3/);
      await expect(end).toContainText(/\d+ scénarios dans les 4 jeux et \d+ leçons/);
      await expect(end.getByRole("link", { name: /Essayer 48h gratuitement/ })).toHaveAttribute("href", /\/signup\?from=trial/);
      if (w === 390) await cardFits(page, h);
      await end.getByRole("button", { name: "Rejouer" }).click();
      await expect(page.locator('[data-demo-round="1"]')).toBeVisible();
    });
  });
}
