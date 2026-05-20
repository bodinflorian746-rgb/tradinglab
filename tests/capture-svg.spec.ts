import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const SVG_TARGETS = [
  "ZoneHistoireDiagram",
  "RetourDesequilibreDiagram",
  "ScenarioZoneDiagram",
  "ConfirmationM5Diagram",
  "RiskAffineDiagram",
  "ZoneEchecDiagram",
];

test("Capture L3 multi-timeframe SVG components", async ({ page }) => {
  await page.goto("/preview-svg", { waitUntil: "networkidle" });

  const screenshotsDir = path.join(process.cwd(), "screenshots");
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  for (const name of SVG_TARGETS) {
    const locator = page.locator(`[data-testid="${name}"]`);
    await expect(locator).toBeVisible();
    await locator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await locator.screenshot({
      path: path.join(screenshotsDir, `${name}.png`),
    });
  }
});
