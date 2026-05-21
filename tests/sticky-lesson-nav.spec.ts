import { test, expect } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});

const SAMPLE_LESSONS = [
  "/formations/debutant/lecon2",
  "/formations/intermediaire/lecon3",
  "/formations/macro/debutant/lecon3",
  "/strategies/smc/lecon2",
];

for (const url of SAMPLE_LESSONS) {
  test(`sticky nav — ${url}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => consoleErrors.push(String(err)));
    page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });

    // Skip onboarding pour ne pas masquer le test
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => window.localStorage.setItem("tradinglab_onboarding_v1", "done"));

    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    // 0 overflow
    const { docW, viewW } = await page.evaluate(() => ({
      docW: document.documentElement.scrollWidth,
      viewW: window.innerWidth,
    }));
    expect(docW - viewW).toBeLessThanOrEqual(4);

    // À l'arrivée (scroll = 0), la sticky nav doit être cachée (opacity-0)
    const stickyNav = page.locator("[aria-hidden]").filter({ has: page.locator("a[aria-label*='Retour']") }).first();
    // Note : le composant est dans le DOM mais opacity-0 + pointer-events-none au top
    await page.waitForTimeout(200);
    const initiallyHidden = await stickyNav.evaluate((el) => window.getComputedStyle(el).opacity === "0");
    expect(initiallyHidden, "sticky nav doit être cachée au scroll=0").toBe(true);

    // Scroll de 400px → la sticky doit apparaître
    await page.evaluate(() => window.scrollTo({ top: 400 }));
    await page.waitForTimeout(300);

    const visibleAfterScroll = await stickyNav.evaluate((el) => window.getComputedStyle(el).opacity === "1");
    expect(visibleAfterScroll, "sticky nav visible après scroll").toBe(true);

    // Vérifier que les 4 boutons sont là (les liens "Retour", "Précédente",
    // "Suivante", et le bouton "Haut de page" pour scrollToTop)
    await expect(page.getByRole("link",   { name: /Retour au/i      })).toBeVisible();
    await expect(page.getByRole("button", { name: /Haut de page/i   })).toBeVisible();

    // Scroll proche du bas (à 100px du bottom) → la sticky doit se cacher
    await page.evaluate(() => {
      const docH = document.documentElement.scrollHeight;
      window.scrollTo({ top: docH - window.innerHeight - 100 });
    });
    await page.waitForTimeout(300);
    const hiddenNearBottom = await stickyNav.evaluate((el) => window.getComputedStyle(el).opacity === "0");
    expect(hiddenNearBottom, "sticky nav cachée près du bas pour ne pas masquer le CTA").toBe(true);

    expect(consoleErrors, `Erreurs : ${consoleErrors.join("\n")}`).toHaveLength(0);
  });
}

test("sticky nav — desktop = caché (sm:hidden)", async ({ browser }) => {
  // Viewport desktop pour vérifier que la sticky nav est cachée
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.localStorage.setItem("tradinglab_onboarding_v1", "done"));
  await page.goto("/formations/debutant/lecon2", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  // Scroll pour activer la nav (sur mobile elle apparaitrait, sur desktop non)
  await page.evaluate(() => window.scrollTo({ top: 500 }));
  await page.waitForTimeout(300);

  // Le composant a la classe sm:hidden → display: none sur desktop
  const navBlock = page.locator("a[aria-label*='Retour']").first();
  const navVisible = await navBlock.isVisible();
  expect(navVisible, "sticky nav ne doit pas être visible sur desktop").toBe(false);

  await context.close();
});

test("screenshot — sticky nav active après scroll", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.localStorage.setItem("tradinglab_onboarding_v1", "done"));
  await page.goto("/formations/debutant/lecon2", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  await page.evaluate(() => window.scrollTo({ top: 500 }));
  await page.waitForTimeout(400);
  await page.screenshot({ path: "test-results/sticky-lesson-nav.png", fullPage: false });
});
