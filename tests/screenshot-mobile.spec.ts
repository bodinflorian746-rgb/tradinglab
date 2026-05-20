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

const TARGETS: { url: string; name: string }[] = [
  { url: "/formations/avance/lecon4", name: "killzones" },
  { url: "/formations/avance/lecon8", name: "journal" },
  { url: "/formations/avance/lecon9", name: "backtest" },
];

test("screenshot 3 advanced lessons mobile", async ({ page }) => {
  const dir = path.join(process.cwd(), "screenshots");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const t of TARGETS) {
    await page.goto(t.url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
    await page.screenshot({ path: path.join(dir, `${t.name}-mobile.png`), fullPage: true });
    console.log(`[saved] ${t.name}-mobile.png`);
  }
});
