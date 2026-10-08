// Pages couvertes par le filet visuel (FR), en 390×844 et 1440×900.
// Stabilisation : animations CSS amenées à leur état final (durée nulle, une
// itération, y compris les animations infinies), transitions coupées,
// Math.random et l'horloge fixés, pastille Next.js masquée, carrousel d'avis masqué,
// chargement différé déclenché par un défilement complet avant la capture.
import { test, expect, type Page } from "@playwright/test";

const PAGES: { name: string; url: string; mask?: string[] }[] = [
  { name: "home", url: "/fr", mask: [".ts-carousel-wrapper"] },
  { name: "pricing", url: "/fr/pricing" },
  { name: "broker", url: "/fr/broker" },
  { name: "hub-trading", url: "/fr/formations" },
  { name: "lecon-debutant-1", url: "/fr/formations/debutant/lecon1" },
  // Leçons dont les schémas passent sur LessonChart (lot 1) ou dont un schéma a été corrigé
  { name: "lecon-debutant-2", url: "/fr/formations/debutant/lecon2" },
  { name: "lecon-debutant-3", url: "/fr/formations/debutant/lecon3" },
  { name: "lecon-intermediaire-5", url: "/fr/formations/intermediaire/lecon5" },
  { name: "lecon-avance-7", url: "/fr/formations/avance/lecon7" },
  { name: "lecon-avance-9", url: "/fr/formations/avance/lecon9" },
  { name: "lecon-macro-debutant-3", url: "/fr/formations/macro/debutant/lecon3" },
  { name: "lecon-macro-avance-4", url: "/fr/formations/macro/avance/lecon4" },
  { name: "lecon-strategie-price-action-1", url: "/fr/strategies/price-action/lecon1" },
  { name: "lecon-strategie-sr-2", url: "/fr/strategies/support-resistance/lecon2" },
  { name: "lecon-strategie-sr-4", url: "/fr/strategies/support-resistance/lecon4" },
  { name: "lecon-strategie-smc-2", url: "/fr/strategies/smc/lecon2" },
  { name: "lecon-strategie-smc-5", url: "/fr/strategies/smc/lecon5" },
  { name: "lecon-strategie-reversal-2", url: "/fr/strategies/reversal/lecon2" },
  { name: "lecon-strategie-reversal-4", url: "/fr/strategies/reversal/lecon4" },
  // Toutes les leçons migrées (LessonChart / LessonSchema, coque v2), sprint L2
  { name: "lecon-avance-1", url: "/fr/formations/avance/lecon1" },
  { name: "lecon-avance-2", url: "/fr/formations/avance/lecon2" },
  { name: "lecon-avance-3", url: "/fr/formations/avance/lecon3" },
  { name: "lecon-avance-4", url: "/fr/formations/avance/lecon4" },
  { name: "lecon-avance-5", url: "/fr/formations/avance/lecon5" },
  { name: "lecon-avance-6", url: "/fr/formations/avance/lecon6" },
  { name: "lecon-avance-8", url: "/fr/formations/avance/lecon8" },
  { name: "lecon-debutant-10", url: "/fr/formations/debutant/lecon10" },
  { name: "lecon-debutant-4", url: "/fr/formations/debutant/lecon4" },
  { name: "lecon-debutant-5", url: "/fr/formations/debutant/lecon5" },
  { name: "lecon-debutant-6", url: "/fr/formations/debutant/lecon6" },
  { name: "lecon-debutant-7", url: "/fr/formations/debutant/lecon7" },
  { name: "lecon-debutant-8", url: "/fr/formations/debutant/lecon8" },
  { name: "lecon-debutant-9", url: "/fr/formations/debutant/lecon9" },
  { name: "lecon-intermediaire-1", url: "/fr/formations/intermediaire/lecon1" },
  { name: "lecon-intermediaire-2", url: "/fr/formations/intermediaire/lecon2" },
  { name: "lecon-intermediaire-3", url: "/fr/formations/intermediaire/lecon3" },
  { name: "lecon-intermediaire-4", url: "/fr/formations/intermediaire/lecon4" },
  { name: "lecon-intermediaire-6", url: "/fr/formations/intermediaire/lecon6" },
  { name: "lecon-intermediaire-7", url: "/fr/formations/intermediaire/lecon7" },
  { name: "lecon-intermediaire-8", url: "/fr/formations/intermediaire/lecon8" },
  { name: "lecon-intermediaire-9", url: "/fr/formations/intermediaire/lecon9" },
  { name: "lecon-macro-avance-1", url: "/fr/formations/macro/avance/lecon1" },
  { name: "lecon-macro-avance-2", url: "/fr/formations/macro/avance/lecon2" },
  { name: "lecon-macro-avance-3", url: "/fr/formations/macro/avance/lecon3" },
  { name: "lecon-macro-debutant-1", url: "/fr/formations/macro/debutant/lecon1" },
  { name: "lecon-macro-debutant-2", url: "/fr/formations/macro/debutant/lecon2" },
  { name: "lecon-macro-debutant-4", url: "/fr/formations/macro/debutant/lecon4" },
  { name: "lecon-macro-debutant-5", url: "/fr/formations/macro/debutant/lecon5" },
  { name: "lecon-macro-debutant-6", url: "/fr/formations/macro/debutant/lecon6" },
  { name: "lecon-macro-intermediaire-1", url: "/fr/formations/macro/intermediaire/lecon1" },
  { name: "lecon-macro-intermediaire-2", url: "/fr/formations/macro/intermediaire/lecon2" },
  { name: "lecon-macro-intermediaire-3", url: "/fr/formations/macro/intermediaire/lecon3" },
  { name: "lecon-macro-intermediaire-4", url: "/fr/formations/macro/intermediaire/lecon4" },
  { name: "lecon-macro-intermediaire-5", url: "/fr/formations/macro/intermediaire/lecon5" },
  { name: "lecon-macro-intermediaire-6", url: "/fr/formations/macro/intermediaire/lecon6" },
  { name: "lecon-strategie-ict-1", url: "/fr/strategies/ict/lecon1" },
  { name: "lecon-strategie-ict-2", url: "/fr/strategies/ict/lecon2" },
  { name: "lecon-strategie-ict-3", url: "/fr/strategies/ict/lecon3" },
  { name: "lecon-strategie-ict-4", url: "/fr/strategies/ict/lecon4" },
  { name: "lecon-strategie-ict-5", url: "/fr/strategies/ict/lecon5" },
  { name: "lecon-strategie-macro-trading-1", url: "/fr/strategies/macro-trading/lecon1" },
  { name: "lecon-strategie-macro-trading-2", url: "/fr/strategies/macro-trading/lecon2" },
  { name: "lecon-strategie-macro-trading-3", url: "/fr/strategies/macro-trading/lecon3" },
  { name: "lecon-strategie-macro-trading-4", url: "/fr/strategies/macro-trading/lecon4" },
  { name: "lecon-strategie-multi-timeframe-1", url: "/fr/strategies/multi-timeframe/lecon1" },
  { name: "lecon-strategie-multi-timeframe-2", url: "/fr/strategies/multi-timeframe/lecon2" },
  { name: "lecon-strategie-multi-timeframe-3", url: "/fr/strategies/multi-timeframe/lecon3" },
  { name: "lecon-strategie-multi-timeframe-4", url: "/fr/strategies/multi-timeframe/lecon4" },
  { name: "lecon-strategie-multi-timeframe-5", url: "/fr/strategies/multi-timeframe/lecon5" },
  { name: "lecon-strategie-price-action-2", url: "/fr/strategies/price-action/lecon2" },
  { name: "lecon-strategie-price-action-3", url: "/fr/strategies/price-action/lecon3" },
  { name: "lecon-strategie-price-action-4", url: "/fr/strategies/price-action/lecon4" },
  { name: "lecon-strategie-reversal-1", url: "/fr/strategies/reversal/lecon1" },
  { name: "lecon-strategie-reversal-3", url: "/fr/strategies/reversal/lecon3" },
  { name: "lecon-strategie-smc-1", url: "/fr/strategies/smc/lecon1" },
  { name: "lecon-strategie-smc-3", url: "/fr/strategies/smc/lecon3" },
  { name: "lecon-strategie-smc-4", url: "/fr/strategies/smc/lecon4" },
  { name: "lecon-strategie-sr-1", url: "/fr/strategies/support-resistance/lecon1" },
  { name: "lecon-strategie-sr-3", url: "/fr/strategies/support-resistance/lecon3" },
  { name: "lecon-strategie-trend-following-1", url: "/fr/strategies/trend-following/lecon1" },
  { name: "lecon-strategie-trend-following-2", url: "/fr/strategies/trend-following/lecon2" },
  { name: "lecon-strategie-trend-following-3", url: "/fr/strategies/trend-following/lecon3" },
  { name: "lecon-strategie-trend-following-4", url: "/fr/strategies/trend-following/lecon4" },
  { name: "hub-jeux", url: "/fr/jeux" },
  { name: "jeu-buy-sell-no-trade", url: "/fr/jeux/buy-sell-no-trade" },
  { name: "jeu-find-the-mistake", url: "/fr/jeux/find-the-mistake" },
  { name: "jeu-place-stop", url: "/fr/jeux/place-stop" },
  { name: "jeu-build-the-trade", url: "/fr/jeux/build-the-trade" },
];

const FREEZE_CSS = `
  *, *::before, *::after { transition: none !important; caret-color: transparent !important; scroll-behavior: auto !important;
    animation-duration: 0s !important; animation-delay: 0s !important; animation-iteration-count: 1 !important; }
  nextjs-portal, [data-nextjs-toast], [data-next-badge-root] { display: none !important; }
`;

async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  // Défilement complet : déclenche les images et blocs chargés à l'apparition
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= h; y += 600) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  // serveur de dev : le réseau n'est jamais tout à fait au repos (rechargement à chaud)
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.waitForTimeout(600);
}

for (const p of PAGES) {
  test(p.name, async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-06-15T10:00:00+02:00"));
    await page.addInitScript(() => {
      try { localStorage.setItem("tradinglab_onboarding_v1", "done"); } catch { /* stockage indisponible */ }
      // Math.random déterministe (mulberry32, graine fixe)
      let a = 0x2f6b9e1d;
      Math.random = () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    });
    await page.goto(p.url, { waitUntil: "load" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    await page.addStyleTag({ content: FREEZE_CSS });
    await settle(page);
    await expect(page).toHaveScreenshot(`${p.name}.png`, {
      fullPage: true,
      mask: (p.mask ?? []).map((s) => page.locator(s)),
    });
  });
}
