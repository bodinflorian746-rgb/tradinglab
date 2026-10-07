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
