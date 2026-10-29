import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

test.use({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});

// Captures des 3 graphiques des leçons Avancé 4, 8 et 9 (leçons premium : session requise,
// cf. PLAYWRIGHT_STORAGE_STATE). Chaque graphique est repéré par son attribut data-lesson-chart.
const TARGETS: { url: string; name: string; chart: string }[] = [
  { url: "/formations/avance/lecon4", name: "killzones", chart: "KillzonesDiagram" },
  { url: "/formations/avance/lecon8", name: "journal", chart: "TradingJournalDiagram" },
  { url: "/formations/avance/lecon9", name: "backtest", chart: "BacktestMetricsDiagram" },
];

test("element screenshots", async ({ page }) => {
  const dir = path.join(process.cwd(), "screenshots");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const t of TARGETS) {
    await page.goto(t.url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});

    const chart = page.locator(`[data-lesson-chart="${t.chart}"]`);
    await expect(chart, `${t.chart} absent de ${t.url}`).toBeVisible();
    await chart.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    // Sur téléphone, le graphique tient en entier dans la largeur de l'écran
    const box = await chart.boundingBox();
    expect(box && box.x >= 0 && box.x + box.width <= 390 + 1, `${t.chart} dépasse de l'écran`).toBe(true);
    await chart.screenshot({ path: path.join(dir, `${t.name}-element.png`) });
    console.log(`[saved] ${t.name}-element.png`);
  }
});
