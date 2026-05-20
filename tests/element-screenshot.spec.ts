import { test } from "@playwright/test";
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

// Take element-level screenshots of the 3 problem charts, on their lesson pages
const TARGETS: { url: string; name: string; titleSelector: string }[] = [
  { url: "/formations/avance/lecon4", name: "killzones", titleSelector: "text=Une journée type" },
  { url: "/formations/avance/lecon8", name: "journal", titleSelector: "text=Win rate" },
  { url: "/formations/avance/lecon9", name: "backtest", titleSelector: "text=Win rate" },
];

test("element screenshots", async ({ page }) => {
  const dir = path.join(process.cwd(), "screenshots");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const t of TARGETS) {
    await page.goto(t.url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});

    // Find the chart container — first div with bg-zinc-950 + rounded-xl
    const chart = page.locator('div.bg-zinc-950.border.border-zinc-800.rounded-xl').first();
    await chart.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await chart.screenshot({ path: path.join(dir, `${t.name}-element.png`) });
    console.log(`[saved] ${t.name}-element.png`);
  }
});
