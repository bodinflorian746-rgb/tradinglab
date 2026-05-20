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
  "/formations/macro/debutant/lecon1",
  "/formations/macro/debutant/lecon2",
  "/formations/macro/debutant/lecon3",
  "/formations/macro/debutant/lecon4",
  "/formations/macro/debutant/lecon5",
  "/formations/macro/debutant/lecon6",
  "/formations/macro/intermediaire/lecon1",
  "/formations/macro/intermediaire/lecon2",
  "/formations/macro/intermediaire/lecon3",
  "/formations/macro/intermediaire/lecon4",
  "/formations/macro/intermediaire/lecon5",
  "/formations/macro/intermediaire/lecon6",
  "/formations/macro/avance/lecon1",
  "/formations/macro/avance/lecon2",
  "/formations/macro/avance/lecon3",
  "/formations/macro/avance/lecon4",
];

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
