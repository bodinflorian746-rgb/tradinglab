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

// ─── Price action 2 — pin bar haussière sur support, XAU/USD H4 ─────────────
// Tendance haussière (creux 4 445 → 4 482 → 4 486, sommets 4 560 → 4 650) ;
// support 4 500 (mèches jusqu'à 4 482 / 4 486, clôtures au-dessus) ; pin bar :
// ouverture 4 512, plus bas 4 486, clôture 4 520 ; résistance 4 650 (TP).
const pinbarSetup = () => buildCandles(4470, [
  ...c(4458), { c: 4452, l: 4445 }, ...c(4466, 4487, 4509, 4530), { c: 4553, h: 4560 },
  ...c(4541, 4527, 4514), { c: 4505, l: 4482 }, ...c(4521, 4540, 4562, 4583, 4604, 4626), { c: 4641, h: 4650 },
  ...c(4630, 4617, 4601, 4588, 4572, 4557, 4541, 4528, 4512), { c: 4520, h: 4524, l: 4486 },
], { seed: 2201, decimals: 1, asset: "XAU/USD", session: "Londres", volatility: "normale", levels: [4500], pins: [4445, 4482, 4486, 4560, 4650] });

// ─── Price action 3 — engulfing haussier sur la zone Fibonacci, XAU/USD H4 ──
// Rebond 4 500 → 4 720, correction dans la zone 0.5 / 0.618 (4 610 / 4 584) ;
// 1re bougie : 4 615 → 4 600 ; 2e : 4 600 → 4 628 (haut 4 630, bas 4 595).
const engulfingSetup = () => buildCandles(4530, [
  ...c(4516), { c: 4507, l: 4500 }, ...c(4524, 4548, 4571, 4596, 4619, 4644, 4667, 4690), { c: 4708, h: 4720 },
  ...c(4697, 4683, 4671, 4662, 4648, 4636, 4627, 4615),
  { c: 4600, h: 4617, l: 4596 }, { c: 4628, h: 4630, l: 4595 },
], { seed: 2301, decimals: 1, asset: "XAU/USD", session: "Londres", volatility: "normale", pins: [4500, 4720, 4615] });

// Engulfings de principe (sans prix affichés) : haussier sur support, baissier sur résistance
const engulfBull = () => buildCandles(101.2, [
  ...c(100.6, 100.9, 99.8, 99.1, 98.2, 98.6, 97.5, 96.8, 96.1), { c: 95.6 },
  { c: 94.9, h: 95.8, l: 94.5 }, { c: 96.3, h: 96.5, l: 94.7 },
], { seed: 2311, decimals: 2, asset: "XAU/USD", levels: [94.5], pins: [94.5] });
const engulfBear = () => buildCandles(98.8, [
  ...c(99.4, 99.1, 100.2, 100.9, 101.8, 101.4, 102.5, 103.2, 103.9), { c: 104.4 },
  { c: 105.1, h: 105.5, l: 104.2 }, { c: 103.7, h: 105.3, l: 103.5 },
], { seed: 2312, decimals: 2, asset: "XAU/USD", levels: [105.5], pins: [105.5] });

// ─── Reversal 2 — ETE XAU/USD H1 (épaule gauche 4 620, tête 4 660, épaule ─────
// droite 4 625, creux 4 580 / 4 575, clôture de breakout 4 570)
const hsExecution = () => buildCandles(4545, [
  ...c(4556, 4568, 4583, 4597, 4609), { c: 4616, h: 4620 },
  ...c(4607, 4596), { c: 4584, l: 4580 },
  ...c(4597, 4612, 4628, 4643), { c: 4655, h: 4660 },
  ...c(4646, 4630, 4614, 4597), { c: 4581, l: 4575 },
  ...c(4592, 4606), { c: 4619, h: 4625 },
  ...c(4611, 4599, 4588), { c: 4570 },
], { seed: 2401, decimals: 1, asset: "XAU/USD", session: "Londres", volatility: "normale", levels: [4578], pins: [4620, 4580, 4660, 4575, 4625] });

Object.assign(SCENARIOS, {
  "pinbar-setup": pinbarSetup,
  "engulfing-setup": engulfingSetup,
  "engulfing-bull": engulfBull,
  "engulfing-bear": engulfBear,
  "hs-execution": hsExecution,
});

// ─── Lot 3 ───────────────────────────────────────────────────────────────────

/** Suite d'un scénario : bougies écrites qui ouvrent à la dernière clôture du préfixe. */
const extend = (prefix: Candle[], steps: Step[], seed: number, decimals: number, pins: number[] = [], levels: number[] = []) =>
  [...prefix, ...buildCandles(prefix[prefix.length - 1].c, steps, { seed, decimals, pins, levels })];

// Reversal 3 — divergence sans breakout (XAU/USD H1) : sommet 1 4 600 sur une montée
// franche, creux 4 570, sommet 2 4 640 (HH) sur une montée hachée (RSI plus bas),
// repli qui tient au-dessus de 4 570, nouveau HH 4 665.
const divergenceNoBreak = () => buildCandles(4500, [
  ...c(4506, 4503, 4511, 4508, 4515, 4512, 4519, 4515, 4522, 4518, 4525, 4521, 4528, 4524, 4531, 4528, 4535, 4532, 4540),
  ...c(4552, 4565, 4577, 4588), { c: 4597, h: 4600 },
  ...c(4589, 4581), { c: 4574, l: 4570 },
  ...c(4582, 4578, 4590, 4586, 4598, 4594, 4606, 4602, 4614, 4610, 4622, 4618), { c: 4633, h: 4640 },
  ...c(4626, 4614, 4603), { c: 4594, l: 4588 },
  ...c(4606, 4619, 4632, 4645), { c: 4658, h: 4665 },
], { seed: 3101, decimals: 1, asset: "XAU/USD", session: "Londres", volatility: "normale", levels: [4570], pins: [4600, 4570, 4640, 4588, 4665] });

// Support-résistance 3 — flip EUR/USD H4 : résistance 1.1850 touchée 3 fois, breakout
// clôturé à 1.1878, 4 bougies au-dessus, retour vers la zone ; puis 3 signaux de retest.
const flipPrefix = () => buildCandles(1.1790, [
  ...c(1.1801, 1.1814, 1.1826, 1.1838), { c: 1.1843, h: 1.1849 }, ...c(1.1830, 1.1818, 1.1812, 1.1824, 1.1836), { c: 1.1842, h: 1.1850 },
  ...c(1.1829, 1.1821, 1.1833), { c: 1.1844, h: 1.1849 }, { c: 1.1878 },
  ...c(1.1872, 1.1884, 1.1879, 1.1888), ...c(1.1877, 1.1868, 1.1860, 1.1856),
], { seed: 3201, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.1850, 1.1840], pins: [1.1849, 1.1850, 1.1878] });
const flipWith = (kind: "pin" | "engulfing" | "reaction") => {
  const p = flipPrefix();
  if (kind === "pin") return extend(p, [{ c: 1.1858, h: 1.1861, l: 1.1842 }], 3202, 5);
  if (kind === "engulfing") return extend(p, [{ c: 1.1849, h: 1.1857, l: 1.1846 }, { c: 1.1863, h: 1.1865, l: 1.1845 }], 3203, 5);
  return extend(p, [{ c: 1.1868, h: 1.1870, l: 1.1851 }, { c: 1.1881, h: 1.1884, l: 1.1866 }], 3204, 5);
};

// Support-résistance 4 — vrai vs faux breakout de la résistance 4 650$ (XAU/USD H1)
const breakoutPrefix = () => buildCandles(4590, [
  ...c(4602, 4615, 4628, 4639), { c: 4644, h: 4649 }, ...c(4633, 4621, 4615, 4627, 4638), { c: 4645, h: 4650 },
  ...c(4634, 4626, 4637), { c: 4643 },
], { seed: 3301, decimals: 1, asset: "XAU/USD", session: "New York", volatility: "normale", levels: [4650], pins: [4649, 4650] });
const breakoutWith = (real: boolean) => {
  const p = breakoutPrefix();
  return real
    ? extend(p, [{ c: 4680, h: 4684, l: 4641 }, { c: 4692 }, { c: 4688 }, { c: 4703 }, { c: 4711 }], 3302, 1, [4680], [4650])
    : extend(p, [{ c: 4620, h: 4685, l: 4617 }, { c: 4606 }, { c: 4598 }, { c: 4590 }], 3303, 1, [4685, 4620], [4650]);
};

// Trend-following 3 — pullback Fibonacci (XAU/USD H4) : HL 4 480, impulsion jusqu'au HH
// 4 660 (180$), repli jusqu'à 4 550 (≈ 0.618), pin bar haussière clôturée à 4 565.
const tf3Pullback = () => buildCandles(4510, [
  ...c(4523, 4515, 4507, 4498, 4490), { c: 4486, l: 4480 },
  ...c(4505, 4531, 4558, 4586, 4612, 4637), { c: 4652, h: 4660 },
  ...c(4644, 4630, 4618, 4603, 4590, 4577, 4566, 4561), { c: 4565, h: 4569, l: 4550 },
], { seed: 3401, decimals: 1, asset: "XAU/USD", session: "Londres", volatility: "normale", pins: [4480, 4660, 4550] });

// Multi-timeframe 4 — affiner le risque en M5 (EUR/USD) : montée dans la zone
// 1.1750-1.1760, trois mèches hautes (1.1764 / 1.1768 / 1.1770), creux local 1.1748
// cassé, retour à 1.1758 (entrée short).
const riskAffineM5 = () => buildCandles(1.1724, [
  ...c(1.1729, 1.1735, 1.1742, 1.1749),
  { c: 1.1753, h: 1.1764 }, { c: 1.1750, h: 1.1768, l: 1.1748 }, { c: 1.1754, h: 1.1770 },
  ...c(1.1741, 1.1734, 1.1729, 1.1738, 1.1747), { c: 1.1755, h: 1.1758 },
], { seed: 3501, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.1750, 1.1760], pins: [1.1764, 1.1768, 1.1770, 1.1748, 1.1758] });

Object.assign(SCENARIOS, {
  "divergence-no-break": divergenceNoBreak,
  "flip-pin": () => flipWith("pin"),
  "flip-engulfing": () => flipWith("engulfing"),
  "flip-reaction": () => flipWith("reaction"),
  "breakout-real": () => breakoutWith(true),
  "breakout-fake": () => breakoutWith(false),
  "tf3-pullback": tf3Pullback,
  "risk-affine-m5": riskAffineM5,
});
