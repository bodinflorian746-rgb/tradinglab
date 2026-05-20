import { test } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});

test("debug overflow /strategies (scrollWidth based)", async ({ page }) => {
  await page.goto("/strategies", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});

  const report = await page.evaluate(() => {
    // Chercher les éléments dont scrollWidth > 390 (contenu intrinsèque trop large)
    const all = Array.from(document.querySelectorAll<HTMLElement>("*"));
    const wide: { tag: string; cls: string; scrollW: number; clientW: number; text: string }[] = [];
    for (const el of all) {
      if (el.scrollWidth > 390 && el.tagName !== "HTML" && el.tagName !== "BODY") {
        wide.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || "").toString().slice(0, 80),
          scrollW: el.scrollWidth,
          clientW: el.clientWidth,
          text: (el.textContent || "").slice(0, 40).trim().replace(/\s+/g, " "),
        });
      }
    }
    wide.sort((a, b) => b.scrollW - a.scrollW);
    return {
      viewW: window.innerWidth,
      docW: document.documentElement.scrollWidth,
      wide: wide.slice(0, 25),
    };
  });

  console.log(`VIEWPORT=${report.viewW}  DOC=${report.docW}`);
  console.log("=== ÉLÉMENTS scrollWidth > 390 ===");
  for (const w of report.wide) {
    console.log(`sw=${w.scrollW} cw=${w.clientW} <${w.tag}> | "${w.text}" | ${w.cls}`);
  }
});
