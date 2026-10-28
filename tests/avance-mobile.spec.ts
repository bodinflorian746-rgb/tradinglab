import { test, expect } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});

const PAGES = [
  "/formations/avance/lecon1",
  "/formations/avance/lecon2",
  "/formations/avance/lecon3",
  "/formations/avance/lecon4",
  "/formations/avance/lecon5",
  "/formations/avance/lecon6",
  "/formations/avance/lecon7",
  "/formations/avance/lecon8",
  "/formations/avance/lecon9",
  "/formations/avance/lecon10",
  "/formations/avance/lecon11",
  "/formations/avance/lecon12",
  "/formations/avance/lecon13",
  "/formations/avance/lecon14",
  "/formations/avance/lecon15",
];

// Quiz en plusieurs questions (Avancé 10 à 12) : chaque question se valide, le score s'affiche à la fin
test("quiz en 4 questions — /formations/avance/lecon10", async ({ page }) => {
  await page.goto("/formations/avance/lecon10", { waitUntil: "domcontentloaded" });
  const quiz = page.locator("[data-quiz-series]");
  await expect(quiz).toHaveAttribute("data-quiz-series", "4");
  for (let q = 0; q < 4; q++) {
    await expect(quiz.getByText(`Question ${q + 1} sur 4`)).toBeVisible();
    // première option de la question encore ouverte, puis validation
    await quiz.locator("button:not([disabled])").filter({ hasNotText: /Valider|Choisis/ }).first().click();
    await quiz.getByRole("button", { name: "Valider ma réponse" }).first().click();
  }
  await expect(quiz.getByText(/bonnes réponses sur 4/)).toBeVisible();
});

for (const url of PAGES) {
  test(`mobile readability — ${url}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => consoleErrors.push(String(err)));
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    const { docW, viewW } = await page.evaluate(() => ({
      docW: document.documentElement.scrollWidth,
      viewW: window.innerWidth,
    }));
    const overflow = docW - viewW;
    console.log(`[${url}] viewport=${viewW} doc=${docW} overflow=${overflow}px`);
    expect(overflow, "Aucun overflow horizontal global > 4px").toBeLessThanOrEqual(4);

    expect(consoleErrors, `Erreurs console : ${consoleErrors.join("\n")}`).toHaveLength(0);
  });
}
