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
  "/strategies/price-action/lecon1",
  "/strategies/price-action/lecon2",
  "/strategies/price-action/lecon3",
  "/strategies/price-action/lecon4",
  "/strategies/support-resistance/lecon1",
  "/strategies/support-resistance/lecon2",
  "/strategies/support-resistance/lecon3",
  "/strategies/support-resistance/lecon4",
  "/strategies/trend-following/lecon1",
  "/strategies/trend-following/lecon2",
  "/strategies/trend-following/lecon3",
  "/strategies/trend-following/lecon4",
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
