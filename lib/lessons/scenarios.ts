// Scénarios en bougies des schémas de leçons : prix écrits d'après le texte de
// chaque leçon, bougies construites par buildCandles (continuité, réalisme).
// Résultat figé dans lib/lessons/generated/candles.json par
// `npx vite-node -c vitest.config.ts scripts/lessons/gen-charts.ts`.

import { buildCandles, type Step } from "./chart-build";
import type { Candle } from "./chart-analysis";

const c = (...closes: number[]): Step[] => closes.map((x) => ({ c: x }));

// ─── Trading Avancé 7 — Entrées de précision (EUR/USD) ─────────────────────
// H1 : sommet 1.0889, baisse jusqu'à la dernière bougie rouge (Order Block,
// corps 1.0832 → 1.0795), impulsion haussière qui casse 1.0889 (BOS), sommet
// 1.0904, retour vers l'OB. Les deux dernières heures sont détaillées en M15 :
// toucher du haut de la zone, enfoncement, pin bar haussière (plus bas 1.0806,
// clôture 1.0823), reprise.

export const PE_SWING_HIGH = 1.0889;
export const PE_TOP = 1.0904;

function precisionH1(): Candle[] {
  return buildCandles(1.0868, [
    ...c(1.0876),
    { c: 1.0884, h: PE_SWING_HIGH },
    ...c(1.0877, 1.0868, 1.0871, 1.0859, 1.0850, 1.0843, 1.0832),
    { c: 1.0795, l: 1.0791 },                       // Order Block (dernière rouge)
    ...c(1.0820, 1.0849, 1.0874, 1.0896),           // impulsion, BOS au-dessus de 1.0889
    { c: 1.0899, h: PE_TOP },
    ...c(1.0887, 1.0871, 1.0856, 1.0841),           // retour vers l'OB
  ], {
    seed: 7101, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale",
    pins: [1.0832, 1.0795, PE_SWING_HIGH, PE_TOP],
  });
}

function precisionM15(open: number): Candle[] {
  return buildCandles(open, [
    ...c(1.0836),
    { c: 1.0830, l: 1.0828 },                        // 1er toucher du haut de la zone
    ...c(1.0824, 1.0821, 1.0818),
    { c: 1.0823, l: 1.0806, h: 1.0825 },             // pin bar haussière dans la zone
    ...c(1.0831, 1.0840),
  ], {
    seed: 7115, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale",
    pins: [1.0832, 1.0795, 1.0806, 1.0823],
  });
}

// ─── Macro Débutant 3 — Consensus vs réel (EUR/USD M1, NFP) ─────────────────
// 6 minutes calmes avant la publication, la minute de la publication, 3 après.
// Surprise positive (NFP 350k / 200k) : dollar ↑ → EUR/USD ↓ ; surprise
// négative (100k / 200k) : dollar ↓ → EUR/USD ↑ ; réel = consensus : pas de surprise.

const NFP_PRE = c(1.0851, 1.0849, 1.0852, 1.0850, 1.0851, 1.0850);
// floor : niveau sous (ou au-dessus de) toutes les clôtures d'après, pour qu'elles restent près de leur prix
const nfp = (seed: number, spike: Step, after: number[], pin: number, floor: number) =>
  buildCandles(1.0850, [...NFP_PRE, spike, ...c(...after)], {
    seed, decimals: 5, asset: "EUR/USD", session: "New York", volatility: "élevée", preNews: true, pins: [pin], levels: [floor], split: NFP_PRE.length,
  });

export const SCENARIOS: Record<string, () => Candle[]> = {
  "precision-entry-h1": precisionH1,
  "precision-entry-m15": () => precisionM15(precisionH1().at(-1)!.c),
  "nfp-egal": () => nfp(3301, { c: 1.0856 }, [1.0853, 1.0855, 1.0852], 1.0856, 1.0858),
  "nfp-positif": () => nfp(3302, { c: 1.0780, h: 1.0853, l: 1.0772 }, [1.0786, 1.0779, 1.0783], 1.0780, 1.0776),
  "nfp-negatif": () => nfp(3303, { c: 1.0920, h: 1.0928, l: 1.0848 }, [1.0913, 1.0919, 1.0915], 1.0920, 1.0924),
};
