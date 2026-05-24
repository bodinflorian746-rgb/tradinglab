import { test } from "@playwright/test";
import fs from "node:fs";

test("AUDIT — screenshot homepage FR (full page) from main HEAD", async ({ page }) => {
  await page.addInitScript(() => {
    try { window.localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch {}
  });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/fr", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  const outDir = "screenshots";
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const fullPath = `${outDir}/homepage-fr-desktop-fullpage.png`;
  const heroPath = `${outDir}/homepage-fr-desktop-hero.png`;
  await page.screenshot({ path: fullPath, fullPage: true });
  await page.screenshot({ path: heroPath, clip: { x: 0, y: 0, width: 1280, height: 900 } });
  console.log(`[saved] ${fullPath}`);
  console.log(`[saved] ${heroPath}`);
});

test("AUDIT — screenshot homepage FR (mobile)", async ({ page }) => {
  await page.addInitScript(() => {
    try { window.localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch {}
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/fr", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  const path = `screenshots/homepage-fr-mobile-fullpage.png`;
  await page.screenshot({ path, fullPage: true });
  console.log(`[saved] ${path}`);
});
