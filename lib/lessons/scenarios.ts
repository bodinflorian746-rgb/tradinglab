// Scénarios en bougies des schémas de leçons : prix écrits d'après le texte de
// chaque leçon, bougies construites par buildCandles (continuité, réalisme).
// Résultat figé dans lib/lessons/generated/candles.json par
// `npx vite-node -c vitest.config.ts scripts/lessons/gen-charts.ts`.

import { buildCandles, type Step } from "./chart-build";
import type { Candle } from "./chart-analysis";
import { RETRACE_DECISION } from "./scenarios-meta";
import { mulberry32 } from "@/lib/games/shared";

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
  return buildCandles(1.0861, [
    { c: 1.0868, h: 1.0871, l: 1.0858 },
    ...c(1.0876),
    { c: 1.0884, h: PE_SWING_HIGH },
    ...c(1.0877, 1.0868, 1.0871, 1.0859, 1.0850, 1.0843, 1.0832),
    { c: 1.0795, l: 1.0791 },                       // Order Block (dernière rouge)
    ...c(1.0820, 1.0849, 1.0874, 1.0896),           // impulsion, BOS au-dessus de 1.0889
    { c: 1.0899, h: PE_TOP },
    ...c(1.0887, 1.0871, 1.0856, 1.0841),           // retour vers l'OB
  ], {
    seed: 7101, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale",
    pins: [1.0868, 1.0871, 1.0858, 1.0832, 1.0795, PE_SWING_HIGH, PE_TOP],
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
/** Tous les prix écrits d'une série (bougies entièrement imposées) */
const pinAll = (st: Step[]) => st.flatMap((x) => [x.c, x.h, x.l].filter((v): v is number => v !== undefined));
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

// ─── Lot 4 ───────────────────────────────────────────────────────────────────

// SMC 2 / SMC 5 — séquence de retournement haussier (EUR/USD H4), bougies entièrement écrites :
// tendance baissière (sommet 1.1880, LH 1.1850, LL 1.1745, LH 1.1820, LL 1.1720), CHoCH = clôture
// au-dessus du dernier LH 1.1820 (sommet 1.1840), nouvelle structure : HL 1.1750 cinq bougies après
// le CHoCH, BOS = clôture au-dessus de 1.1840, puis mitigation : retour sur l'ex-LH 1.1820 devenu
// support, bougie de rejet haussière (mèche 1.1822).
const CHOCH_SEQ: Step[] = [
  { c: 1.1861, h: 1.1864, l: 1.1849 }, { c: 1.1872, h: 1.1875, l: 1.1858 }, { c: 1.1876, h: 1.1880, l: 1.1869 },
  { c: 1.1851, h: 1.1878, l: 1.1848 }, { c: 1.1826, h: 1.1853, l: 1.1822 }, { c: 1.1797, h: 1.1828, l: 1.1790 },
  { c: 1.1812, h: 1.1816, l: 1.1794 }, { c: 1.1828, h: 1.1832, l: 1.1808 }, { c: 1.1843, h: 1.1850, l: 1.1825 },
  { c: 1.1820, h: 1.1846, l: 1.1816 }, { c: 1.1793, h: 1.1823, l: 1.1789 }, { c: 1.1766, h: 1.1796, l: 1.1762 }, { c: 1.1751, h: 1.1769, l: 1.1745 },
  { c: 1.1771, h: 1.1774, l: 1.1748 }, { c: 1.1792, h: 1.1796, l: 1.1768 }, { c: 1.1811, h: 1.1820, l: 1.1789 },
  { c: 1.1788, h: 1.1815, l: 1.1784 }, { c: 1.1762, h: 1.1791, l: 1.1758 }, { c: 1.1727, h: 1.1765, l: 1.1720 },
  { c: 1.1752, h: 1.1756, l: 1.1723 }, { c: 1.1784, h: 1.1788, l: 1.1749 }, { c: 1.1829, h: 1.1833, l: 1.1781 },
  { c: 1.1834, h: 1.1840, l: 1.1824 }, { c: 1.1822, h: 1.1838, l: 1.1818 }, { c: 1.1803, h: 1.1825, l: 1.1799 }, { c: 1.1781, h: 1.1806, l: 1.1777 }, { c: 1.1758, h: 1.1784, l: 1.1750 },
  { c: 1.1784, h: 1.1788, l: 1.1754 }, { c: 1.1812, h: 1.1816, l: 1.1780 }, { c: 1.1852, h: 1.1856, l: 1.1808 },
  { c: 1.1866, h: 1.1870, l: 1.1848 }, { c: 1.1850, h: 1.1868, l: 1.1846 }, { c: 1.1834, h: 1.1853, l: 1.1830 }, { c: 1.1843, h: 1.1846, l: 1.1822 },
  { c: 1.1862, h: 1.1866, l: 1.1840 },
];
const chochSequence = () => buildCandles(1.1852, CHOCH_SEQ, { seed: 4101, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.1820, 1.1840], pins: pinAll(CHOCH_SEQ) });

// Débutant 9 — FOMO : hausse verticale, achat au sommet, retournement (prix sans unité)
const biasFomo = () => buildCandles(100, [
  ...c(100.4, 100.2, 100.7, 101.0, 101.8, 102.9, 104.3, 105.8), { c: 107.1, h: 107.6 },
  ...c(105.9, 104.6, 103.8, 102.9),
], { seed: 4201, decimals: 2, pins: [107.6] });
// Débutant 9 — ancrage : achat 100, SL prévu 99 (1R), SL déplacé, sortie à 95 (−5R)
const biasAnchor = () => buildCandles(99.6, [
  { c: 100 }, ...c(100.3, 99.7, 99.2, 98.8, 98.3, 98.6, 97.9, 97.4, 96.8, 97.1, 96.3, 95.7), { c: 95.0 },
], { seed: 4202, decimals: 2, levels: [99, 97.5], pins: [100, 95] });

// Intermédiaire 4 — repli vers le HL en tendance haussière (EUR/USD H1). Point de
// décision au milieu du repli (1.0876) ; suite unique : repli jusqu'à la zone du HL
// (ancien sommet 1.0860), pin bar (bas 1.0852, clôture 1.0864), nouveau HH 1.0928.
const retracement = () => buildCandles(1.0806, [
  ...c(1.0812), { c: 1.0804, l: 1.0800 }, ...c(1.0817, 1.0833, 1.0848), { c: 1.0855, h: 1.0860 },
  ...c(1.0846), { c: 1.0835, l: 1.0830 }, ...c(1.0849, 1.0866, 1.0884), { c: 1.0894, h: 1.0900 },
  ...c(1.0888), { c: 1.0876 },
  ...c(1.0862), { c: 1.0864, h: 1.0866, l: 1.0852 }, ...c(1.0880, 1.0897, 1.0912), { c: 1.0921, h: 1.0928 },
], { seed: 4301, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.0860, 1.0870], pins: [1.0800, 1.0860, 1.0830, 1.0900, 1.0876, 1.0862, 1.0852, 1.0864, 1.0928], split: RETRACE_DECISION + 1 });

Object.assign(SCENARIOS, {
  "choch-sequence": chochSequence,
  "bias-fomo": biasFomo,
  "bias-anchor": biasAnchor,
  "retracement": retracement,
});

// ─── Lot 5 ───────────────────────────────────────────────────────────────────

// ICT 2 — FVG qualifié (EUR/USD H1) : résistance 1.1780, equal highs, sweep à 1.1792
// (bas de la bougie 1.1770), bougie baissière d'impulsion, bougie suivante : haut
// 1.1758 → FVG bearish 1.1758-1.1770 ; repli ensuite.
const pdQualified = () => buildCandles(1.1742, [
  ...c(1.1751, 1.1763, 1.1771), { c: 1.1775, h: 1.1780 }, ...c(1.1766, 1.1757, 1.1764, 1.1772), { c: 1.1774, h: 1.1779 },
  ...c(1.1768, 1.1773), { c: 1.1774, h: 1.1792, l: 1.1770 },
  { c: 1.1752, h: 1.1775, l: 1.1749 }, { c: 1.1747, h: 1.1758, l: 1.1744 },
  ...c(1.1739, 1.1733, 1.1741, 1.1748),
], { seed: 5101, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.1780], pins: [1.1780, 1.1779, 1.1792, 1.1770, 1.1758] });
// ICT 2 — FVG hors contexte : petit gap laissé en milieu de range (1.1716-1.1722), traversé ensuite
const pdRange = () => buildCandles(1.1722, [
  ...c(1.1731, 1.1738, 1.1729, 1.1719, 1.1708, 1.1714, 1.1726, 1.1735), { c: 1.1727, l: 1.1722 },
  { c: 1.1711, h: 1.1728, l: 1.1709 }, { c: 1.1708, h: 1.1716, l: 1.1703 },
  ...c(1.1714, 1.1725, 1.1733, 1.1728, 1.1719, 1.1710, 1.1717),
], { seed: 5102, decimals: 5, asset: "EUR/USD", session: "Asie", volatility: "faible", levels: [1.1740, 1.1700], pins: [1.1722, 1.1716] });

// ICT 2 — confluence à 1.1780 : support H1 tenu puis cassé par une impulsion qui laisse
// un FVG bearish 1.1772-1.1784 ; plus tard, retour sur la zone, sweep à 1.1795, rejet.
const pdConfluence = () => buildCandles(1.1812, [
  ...c(1.1800, 1.1788), { c: 1.1786, l: 1.1781 }, ...c(1.1796, 1.1806, 1.1797), { c: 1.1789, l: 1.1780 }, ...c(1.1798, 1.1803),
  { c: 1.1791, l: 1.1784 }, { c: 1.1760, h: 1.1792, l: 1.1757 }, { c: 1.1754, h: 1.1772, l: 1.1750 },
  ...c(1.1746, 1.1738, 1.1743, 1.1752, 1.1761, 1.1770), { c: 1.1776, h: 1.1795 }, ...c(1.1762, 1.1749),
], { seed: 5201, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.1780], pins: [1.1781, 1.1780, 1.1784, 1.1772, 1.1795] });

// Macro-trading 1 — essoufflement après FOMC (XAU/USD M15) : impulsion 4 640 → 4 705,
// trois mèches hautes de 6-8$ sans clôture au-dessus de 4 705, correction vers 4 670.
const fomcExhaustion = () => buildCandles(4636, [
  ...c(4639, 4637, 4641, 4638), { c: 4640 },
  ...c(4662, 4681, 4694), { c: 4703, h: 4705 },
  { c: 4698, h: 4710 }, { c: 4702, h: 4709 }, { c: 4697, h: 4708 },
  ...c(4689, 4681, 4674), { c: 4670 },
], { seed: 5301, decimals: 1, asset: "XAU/USD", session: "New York", volatility: "élevée", levels: [4705], pins: [4705, 4710, 4709, 4708, 4640, 4670] });

Object.assign(SCENARIOS, {
  "pd-qualified": pdQualified,
  "pd-range": pdRange,
  "pd-confluence": pdConfluence,
  "fomc-exhaustion": fomcExhaustion,
});

// ─── Lot 6 ───────────────────────────────────────────────────────────────────

/** Impose la bougie i (corps et mèches relatifs à son ouverture), en gardant la continuité avec la suivante. */
const setCandle = (cs: Candle[], i: number, body: number, wu: number, wd: number, decimals: number): Candle[] => {
  const r = (x: number) => Number(x.toFixed(decimals));
  const out = cs.map((k) => ({ ...k }));
  const k = out[i];
  k.c = r(k.o + body);
  k.h = r(Math.max(k.o, k.c) + wu);
  k.l = r(Math.min(k.o, k.c) - wd);
  const nx = out[i + 1];
  if (nx) { nx.o = k.c; nx.h = Math.max(nx.h, nx.o, nx.c); nx.l = Math.min(nx.l, nx.o, nx.c); }
  return out;
};
/** La « même bougie » de Price action 1 : petit corps vert, mèche haute */
export const SAME_CANDLE = { body: 0.4, wu: 0.6, wd: 0.15 };
const sameIn = (cs: Candle[], i: number) => setCandle(cs, i, SAME_CANDLE.body, SAME_CANDLE.wu, SAME_CANDLE.wd, 2);

const ctxTop = () => sameIn(buildCandles(100, [
  ...c(100.3, 100.1, 100.6, 100.4, 101.4, 102.5, 103.6, 104.6, 105.7), { c: 106.1 },
], { seed: 6101, decimals: 2 }), 9);
const ctxDrop = () => sameIn(buildCandles(107.2, [
  ...c(107.5, 107.1, 106.2, 105.3, 104.4), { c: 104.8 }, ...c(103.7, 102.9, 101.9, 101.2),
], { seed: 6102, decimals: 2 }), 5);
const ctxRange = () => sameIn(buildCandles(103.8, [
  ...c(104.4, 104.9, 104.2, 103.6, 103.2, 103.9), { c: 104.3 }, ...c(103.7, 104.5, 104.0),
], { seed: 6103, decimals: 2, levels: [103.0, 105.2] }), 6);

// Price action 2 — la pin bar a besoin d'un niveau (XAU/USD H4, range 4 500-4 650) :
// pin bar baissière au plus haut (4 650), pin bar au milieu (ignorée, le prix
// continue), pin bar haussière au plus bas (4 500).
const pinLocation = () => buildCandles(4560, [
  ...c(4572, 4589, 4604, 4618, 4637), { c: 4632, h: 4650, l: 4629 },
  ...c(4620, 4607, 4594, 4583), { c: 4578, h: 4580, l: 4562 },
  ...c(4566, 4551, 4537, 4524, 4512), { c: 4515, h: 4517, l: 4500 },
  ...c(4528, 4541, 4553),
], { seed: 6201, decimals: 1, asset: "XAU/USD", session: "Londres", volatility: "normale", levels: [4500, 4650], pins: [4650, 4629, 4637, 4500, 4517, 4562, 4580, 4632, 4515, 4578] });

// Stratégie MTF 3 — zone qui raconte une histoire (EUR/USD H1) : support 1.1760 tenu,
// puis cassé par une impulsion qui laisse un FVG bearish 1.1750-1.1760 ; remontée
// actuelle vers la zone.
const zoneHistoire = () => buildCandles(1.1792, [
  ...c(1.1781, 1.1770), { c: 1.1766, l: 1.1761 }, ...c(1.1775, 1.1786, 1.1779), { c: 1.1768, l: 1.1760 },
  { c: 1.1742, h: 1.1769, l: 1.1738 }, { c: 1.1737, h: 1.1750, l: 1.1731 },
  ...c(1.1726, 1.1718, 1.1722, 1.1731, 1.1739), { c: 1.1745 },
], { seed: 6301, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.1760, 1.1750], pins: [1.1761, 1.1760, 1.1750] });

// Macro-trading 4 — signal bearish M15 contre le régime (XAU/USD) : H4 en HH / HL vers
// 4 740 ; la dernière bougie H4 = 16 bougies M15 (bougie de rejet baissière à 4 701, breakout du creux
// mineur 4 683, plus bas 4 664, reprise) ; puis la hausse continue.
const regimeM15 = (open: number) => buildCandles(open, [
  ...c(4689, 4694), { c: 4691, h: 4701 }, ...c(4690), { c: 4687, l: 4683 }, ...c(4690), { c: 4679 },
  ...c(4673), { c: 4668, l: 4664 }, ...c(4674, 4681, 4687, 4692, 4696, 4699), { c: 4703 },
], { seed: 6401, decimals: 1, asset: "XAU/USD", session: "Londres", volatility: "normale", levels: [4683], pins: [4694, 4691, 4701, 4683, 4664] });
const regimeH4 = () => buildCandles(4540, [
  ...c(4552), { c: 4566, h: 4572 }, ...c(4561), { c: 4556, l: 4552 },
  ...c(4568, 4579, 4592, 4606, 4622), { c: 4634, h: 4640 }, ...c(4627, 4615), { c: 4606, l: 4600 },
  ...c(4618, 4633, 4648, 4663, 4677), { c: 4684, h: 4706 },
], { seed: 6402, decimals: 1, asset: "XAU/USD", session: "Londres", volatility: "normale", pins: [4572, 4552, 4640, 4600, 4706] });

Object.assign(SCENARIOS, {
  "ctx-top": ctxTop,
  "ctx-drop": ctxDrop,
  "ctx-range": ctxRange,
  "pin-location": pinLocation,
  "zone-histoire": zoneHistoire,
  "regime-h4": regimeH4,
  "regime-m15": () => regimeM15(regimeH4().at(-1)!.c),
});

// ─── Lot 7 ───────────────────────────────────────────────────────────────────

// Price action 2 — la pin bar échoue : rebond avorté, breakout du support 4 500, SL 4 470 touché
const pinbarFailure = () => extend(pinbarSetup(), [
  { c: 4527 }, { c: 4518 }, { c: 4507 }, { c: 4493, l: 4489 }, { c: 4476, l: 4466 }, { c: 4461 },
], 7101, 1, [4466], [4500, 4470]);

// Price action 4 — setup multi-UT EUR/USD : Daily HH 1.1840 / HL 1.1720, zone H4
// 1.1750-1.1770 (3 touches), pin bar M15 (bas 1.1762, clôture 1.1778)
const mtfDaily = () => buildCandles(1.1570, [
  ...c(1.1584, 1.1602, 1.1621, 1.1643, 1.1662), { c: 1.1674, h: 1.1680 }, ...c(1.1661, 1.1648), { c: 1.1631, l: 1.1625 },
  ...c(1.1650, 1.1676, 1.1701, 1.1727), { c: 1.1752, h: 1.1760 }, ...c(1.1741), { c: 1.1726, l: 1.1720 },
  ...c(1.1748, 1.1773, 1.1799, 1.1821), { c: 1.1834, h: 1.1840 }, ...c(1.1818, 1.1797), { c: 1.1778, l: 1.1762 },
], { seed: 7201, decimals: 5, asset: "EUR/USD", volatility: "normale", levels: [1.1619, 1.1714, 1.1846], pins: [1.1680, 1.1625, 1.1760, 1.1720, 1.1840, 1.1762] });
const mtfH4 = () => buildCandles(1.1790, [
  ...c(1.1778, 1.1766), { c: 1.1760, l: 1.1752 }, ...c(1.1774, 1.1790, 1.1805, 1.1797, 1.1782, 1.1771), { c: 1.1764, l: 1.1755 },
  ...c(1.1776, 1.1795, 1.1813, 1.1828), { c: 1.1835, h: 1.1840 }, ...c(1.1820, 1.1804, 1.1789), { c: 1.1774 }, { c: 1.1778, l: 1.1762 },
], { seed: 7202, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.1750, 1.1770], pins: [1.1752, 1.1755, 1.1840, 1.1762] });
const mtfM15 = () => buildCandles(1.1796, [
  ...c(1.1791, 1.1788, 1.1784, 1.1786, 1.1781, 1.1777, 1.1779, 1.1775, 1.1772), { c: 1.1774 },
  { c: 1.1778, h: 1.1780, l: 1.1762 },
], { seed: 7203, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.1770], pins: [1.1762, 1.1774] });

// SMC 1 / Intermédiaire 1 — structure haussière (HH / HL) et baissière (LH / LL), EUR/USD H4, swings ≥ 50 pips
const structureBull = () => buildCandles(1.1612, [
  ...c(1.1606), { c: 1.1604, l: 1.1600 }, ...c(1.1622, 1.1645, 1.1666), { c: 1.1674, h: 1.1680 }, ...c(1.1660, 1.1643), { c: 1.1636, l: 1.1630 },
  ...c(1.1655, 1.1683, 1.1705), { c: 1.1714, h: 1.1720 }, ...c(1.1697, 1.1678), { c: 1.1671, l: 1.1665 },
  ...c(1.1694, 1.1725, 1.1752), { c: 1.1763, h: 1.1770 }, ...c(1.1745, 1.1726), { c: 1.1718, l: 1.1712 },
  ...c(1.1742, 1.1771, 1.1796), { c: 1.1804, h: 1.1810 }, ...c(1.1792),
], { seed: 7301, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", pins: [1.1600, 1.1680, 1.1630, 1.1720, 1.1665, 1.1770, 1.1712, 1.1810] });
const structureBear = () => buildCandles(1.1798, [
  ...c(1.1804), { c: 1.1806, h: 1.1810 }, ...c(1.1788, 1.1765, 1.1744), { c: 1.1736, l: 1.1730 }, ...c(1.1750, 1.1767), { c: 1.1774, h: 1.1780 },
  ...c(1.1755, 1.1727, 1.1705), { c: 1.1696, l: 1.1690 }, ...c(1.1713, 1.1732), { c: 1.1739, h: 1.1745 },
  ...c(1.1716, 1.1685, 1.1658), { c: 1.1646, l: 1.1640 }, ...c(1.1664, 1.1685), { c: 1.1694, h: 1.1700 },
  ...c(1.1672, 1.1641, 1.1616), { c: 1.1606, l: 1.1600 }, ...c(1.1618),
], { seed: 7302, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.1813, 1.1784, 1.1749, 1.1704], pins: [1.1810, 1.1730, 1.1780, 1.1690, 1.1745, 1.1640, 1.1700, 1.1600] });

// SMC 1 — structure externe baissière (Daily XAU/USD : LH 4 740 / 4 700, LL 4 620 / 4 540)
// et structure interne haussière du dernier pullback (H1 : 4 540 → 4 640, HL / HH)
const externalDaily = () => buildCandles(4760, [
  ...c(4771), { c: 4774, h: 4780 }, ...c(4752, 4723, 4697), { c: 4688, l: 4680 }, ...c(4703, 4722), { c: 4733, h: 4740 },
  ...c(4708, 4675, 4644), { c: 4628, l: 4620 }, ...c(4646, 4671), { c: 4692, h: 4700 },
  ...c(4661, 4622, 4584, 4556), { c: 4548, l: 4540 }, ...c(4569, 4596, 4618), { c: 4632, h: 4640 },
], { seed: 7401, decimals: 1, asset: "XAU/USD", volatility: "normale", levels: [4744, 4704, 4676, 4616], pins: [4780, 4680, 4740, 4620, 4700, 4540, 4640] });
const internalH1 = () => buildCandles(4552, [
  ...c(4546), { c: 4544, l: 4540 }, ...c(4556, 4571, 4583), { c: 4586, h: 4590 }, ...c(4578), { c: 4569, l: 4565 },
  ...c(4581, 4597, 4609), { c: 4611, h: 4615 }, ...c(4602), { c: 4594, l: 4590 }, ...c(4607, 4622, 4634), { c: 4636, h: 4640 },
], { seed: 7402, decimals: 1, asset: "XAU/USD", session: "Londres", volatility: "normale", levels: [4562, 4587], pins: [4540, 4590, 4565, 4615, 4640] });

// SMC 1 — accumulation (range 1.1760-1.1800 après une baisse), manipulation (sweep sous
// le range à 1.1742, retour dedans), expansion haussière (HH / HL au-dessus du range)
const smcPhases = () => buildCandles(1.1905, [
  ...c(1.1889, 1.1868, 1.1846, 1.1822, 1.1797, 1.1774), { c: 1.1766, l: 1.1760 },
  ...c(1.1781, 1.1794), { c: 1.1792, h: 1.1800 }, ...c(1.1779), { c: 1.1767, l: 1.1761 }, ...c(1.1778, 1.1790), { c: 1.1791, h: 1.1799 }, ...c(1.1776),
  { c: 1.1768, l: 1.1742 },
  ...c(1.1785, 1.1806, 1.1828), { c: 1.1840, h: 1.1846 }, ...c(1.1829), { c: 1.1821, l: 1.1815 }, ...c(1.1842, 1.1863), { c: 1.1874, h: 1.1880 },
], { seed: 7501, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.1760, 1.1800], pins: [1.1760, 1.1800, 1.1761, 1.1799, 1.1742, 1.1846, 1.1815, 1.1880] });

Object.assign(SCENARIOS, {
  "pinbar-failure": pinbarFailure,
  "mtf-daily": mtfDaily,
  "mtf-h4": mtfH4,
  "mtf-m15": mtfM15,
  "structure-bull": structureBull,
  "structure-bear": structureBear,
  "external-daily": externalDaily,
  "internal-h1": internalH1,
  "smc-phases": smcPhases,
});

// ─── Lot 8 ───────────────────────────────────────────────────────────────────

// SMC 2 / TF 4 — même structure haussière (HL 1.1700, HH 1.1780, HL 1.1750, HH 1.1820),
// puis breakout opposé : au-dessus du HH 1.1820 (BOS) ou sous le HL 1.1750 (CHoCH)
const bosChochPrefix = () => buildCandles(1.1718, [
  { c: 1.1722, h: 1.1726, l: 1.1714 },
  ...c(1.1712), { c: 1.1706, l: 1.1700 }, ...c(1.1721, 1.1742, 1.1761), { c: 1.1773, h: 1.1780 },
  ...c(1.1768), { c: 1.1756, l: 1.1750 }, ...c(1.1771, 1.1792, 1.1808), { c: 1.1814, h: 1.1820 }, ...c(1.1806, 1.1793),
], { seed: 8101, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.1746, 1.1824, 1.1696], pins: [1.1722, 1.1726, 1.1714, 1.1700, 1.1780, 1.1750, 1.1820] });
const bosChochWith = (bos: boolean) => extend(bosChochPrefix(), bos
  ? [{ c: 1.1809 }, { c: 1.1831, h: 1.1835 }, { c: 1.1845 }, { c: 1.1839 }]
  : [{ c: 1.1772 }, { c: 1.1741, l: 1.1737 }, { c: 1.1733 }, { c: 1.1740 }], bos ? 8102 : 8103, 5, [], [1.1820, 1.1750]);

// SMC 3 / Avancé 3 — Order Block haussier EUR/USD H4, bougies entièrement écrites : hausse jusqu'au
// sommet 1.1780 (vrai swing, bougies plus basses de chaque côté), repli de 5 bougies jusqu'à la
// dernière bougie rouge (corps 1.1752 → 1.1745, mèche 1.1738), impulsion de 3 bougies à grands
// corps (22, 24 et 16 pips, plus de 2 fois la moyenne des 10 précédentes, mèches courtes) qui
// clôture au-dessus de 1.1780 (BOS) et marque le HH 1.1810.
const SMC_OB_PRE: Step[] = [
  { c: 1.1731, h: 1.1734, l: 1.1719 }, { c: 1.1740, h: 1.1744, l: 1.1728 }, { c: 1.1752, h: 1.1756, l: 1.1737 },
  { c: 1.1764, h: 1.1769, l: 1.1749 }, { c: 1.1773, h: 1.1780, l: 1.1760 },
  { c: 1.1768, h: 1.1776, l: 1.1763 }, { c: 1.1761, h: 1.1771, l: 1.1757 }, { c: 1.1764, h: 1.1767, l: 1.1755 },
  { c: 1.1757, h: 1.1766, l: 1.1753 }, { c: 1.1752, h: 1.1760, l: 1.1748 },
  { c: 1.1745, h: 1.1755, l: 1.1738 },
  { c: 1.1767, h: 1.1770, l: 1.1743 }, { c: 1.1791, h: 1.1794, l: 1.1765 }, { c: 1.1807, h: 1.1810, l: 1.1789 },
];
// OB frais : retour dans le corps (mèche 1.1748), bougie de rejet haussière, reprise.
const SMC_OB: Step[] = [
  ...SMC_OB_PRE,
  { c: 1.1801, h: 1.1809, l: 1.1797 }, { c: 1.1790, h: 1.1803, l: 1.1786 }, { c: 1.1779, h: 1.1792, l: 1.1775 },
  { c: 1.1768, h: 1.1781, l: 1.1764 }, { c: 1.1758, h: 1.1771, l: 1.1755 },
  { c: 1.1766, h: 1.1769, l: 1.1748 }, { c: 1.1779, h: 1.1782, l: 1.1763 }, { c: 1.1792, h: 1.1795, l: 1.1776 },
];
const smcOB = () => buildCandles(1.1722, SMC_OB, { seed: 8201, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.1752, 1.1745, 1.1780], pins: pinAll(SMC_OB) });

// SMC 3 / SMC 5 — mitigation après CHoCH baissier (EUR/USD H1) : HL 1.1720 / HH 1.1780,
// breakout du HL (CHoCH), creux 1.1690, retour sur l'ex-HL 1.1720 devenu résistance,
// bougie de rejet baissière (mèche 1.1724, clôture 1.1706 = entrée short), baisse.
const mitigation = () => buildCandles(1.1708, [
  { c: 1.1712, h: 1.1716, l: 1.1705 },
  ...c(1.1703), { c: 1.1698, l: 1.1694 }, ...c(1.1724, 1.1738), { c: 1.1746, h: 1.1752 }, ...c(1.1737), { c: 1.1726, l: 1.1720 }, ...c(1.1741, 1.1758, 1.1771), { c: 1.1774, h: 1.1780 },
  ...c(1.1762, 1.1745, 1.1729), { c: 1.1709 }, ...c(1.1698), { c: 1.1695, l: 1.1690 },
  ...c(1.1702, 1.1711), { c: 1.1706, h: 1.1724, l: 1.1704 }, ...c(1.1691, 1.1676, 1.1662),
], { seed: 8301, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.1720, 1.1726], pins: [1.1712, 1.1716, 1.1705, 1.1694, 1.1752, 1.1720, 1.1780, 1.1690, 1.1724, 1.1706, 1.1704] });

// SMC 5 bloc 5 — confirmer et exécuter (EUR/USD H4, plan chiffré du bloc 6) : remontée jusqu'aux
// equal highs 1.1780 (BSL) après un HL 1.1713, creux mineur 1.1755 (HL), sweep (mèche 1.1792, clôture 1.1772), displacement
// baissier de 3 bougies (corps 14, 22, 22 pips, sans mèche) qui clôture sous 1.1755 (CHoCH) et laisse
// le FVG 1.1758-1.1770 ; retour dans le FVG (entrée limite 1.1765), rejet, baisse jusqu'à la SSL 1.1690.
const SMC5_EXEC: Step[] = [
  { c: 1.1719, h: 1.1722, l: 1.1709 }, { c: 1.1727, h: 1.1730, l: 1.1716 }, { c: 1.1722, h: 1.1729, l: 1.1719 }, { c: 1.1717, h: 1.1724, l: 1.1713 },
  { c: 1.1728, h: 1.1731, l: 1.1715 }, { c: 1.1740, h: 1.1743, l: 1.1726 }, { c: 1.1752, h: 1.1755, l: 1.1738 }, { c: 1.1762, h: 1.1765, l: 1.1749 }, { c: 1.1774, h: 1.1780, l: 1.1759 },
  { c: 1.1767, h: 1.1776, l: 1.1763 }, { c: 1.1760, h: 1.1769, l: 1.1757 }, { c: 1.1758, h: 1.1763, l: 1.1755 },
  { c: 1.1766, h: 1.1769, l: 1.1757 }, { c: 1.1774, h: 1.1780, l: 1.1763 },
  { c: 1.1772, h: 1.1792, l: 1.1770 },
  { c: 1.1758, h: 1.1773, l: 1.1757 }, { c: 1.1736, h: 1.1758, l: 1.1734 }, { c: 1.1714, h: 1.1737, l: 1.1712 },
  { c: 1.1708, h: 1.1716, l: 1.1703 }, { c: 1.1712, h: 1.1715, l: 1.1704 }, { c: 1.1726, h: 1.1729, l: 1.1710 }, { c: 1.1741, h: 1.1744, l: 1.1724 },
  { c: 1.1752, h: 1.1755, l: 1.1739 }, { c: 1.1749, h: 1.1767, l: 1.1748 },
  { c: 1.1731, h: 1.1752, l: 1.1729 }, { c: 1.1716, h: 1.1733, l: 1.1713 }, { c: 1.1703, h: 1.1719, l: 1.1699 }, { c: 1.1694, h: 1.1706, l: 1.1688 },
];

// Trend-following 1 — identifier une tendance (EUR/USD H4) : HL 1.1680, HH 1.1760,
// HL 1.1720, HH 1.1820 (amplitude 140 pips)
const trendSteps = () => buildCandles(1.1662, [
  ...c(1.1651), { c: 1.1646, l: 1.1640 }, ...c(1.1662, 1.1687, 1.1711), { c: 1.1724, h: 1.1730 }, ...c(1.1712, 1.1697), { c: 1.1686, l: 1.1680 },
  ...c(1.1702, 1.1726, 1.1745), { c: 1.1754, h: 1.1760 }, ...c(1.1741), { c: 1.1727, l: 1.1720 },
  ...c(1.1743, 1.1770, 1.1797), { c: 1.1813, h: 1.1820 }, ...c(1.1804, 1.1796),
], { seed: 8401, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.1676, 1.1716, 1.1824], pins: [1.1640, 1.1730, 1.1680, 1.1760, 1.1720, 1.1820] });

Object.assign(SCENARIOS, {
  "bos-case": () => bosChochWith(true),
  "choch-case": () => bosChochWith(false),
  "smc-ob": smcOB,
  "mitigation": mitigation,
  "smc5-exec": () => buildCandles(1.1712, SMC5_EXEC, { seed: 8302, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.1780, 1.1755], pins: pinAll(SMC5_EXEC) }),
  "trend-steps": trendSteps,
});

// ─── Lot 9 ───────────────────────────────────────────────────────────────────

/**
 * Tendance oscillante écrite par formule : milieu qui monte de `slope` par bougie,
 * oscillation de ±amp sur une période de `period` bougies (creux aux indices
 * phase, phase + period…), petit bruit seedé. Les creux et sommets sont figés.
 */
const wave = (n: number, start: number, slope: number, amp: number, period: number, phase: number, seed: number, decimals: number) => {
  const rng = mulberry32(seed);
  const r = (x: number) => Number(x.toFixed(decimals));
  const steps: Step[] = [];
  const pins: number[] = [];
  const guards: number[] = [];
  for (let i = 0; i < n; i++) {
    const mid = start + slope * i;
    const t = (((i - phase) % period) + period) % period;
    const v = mid - amp * Math.cos((2 * Math.PI * t) / period) + (t === 0 || t === period / 2 ? 0 : (rng() - 0.5) * amp * 0.15);
    if (t === 0) { const l = r(v - amp * 0.15); steps.push({ c: r(v + amp * 0.06), l }); pins.push(l); guards.push(r(l + amp * 0.06)); }
    else if (t === period / 2) { const h = r(v + amp * 0.15); steps.push({ c: r(v - amp * 0.06), h }); pins.push(h); guards.push(r(h - amp * 0.06)); }
    else steps.push({ c: r(v) });
  }
  return { steps, pins, guards };
};

// Trend-following 2 — tendance haussière EUR/USD H4 : creux (HL) alignés tous les 12
// bougies, MM50 proche de la trendline ; 3 HL visibles sur la fenêtre affichée.

const tfTrend = () => { const w = wave(88, 1.1640, 0.00012, 0.0040, 12, 52, 9101, 5); return buildCandles(1.1600, w.steps, { seed: 9101, decimals: 5, asset: "EUR/USD", volatility: "normale", pins: w.pins, levels: w.guards }); };
// … puis breakout sous la trendline, ignoré si on prolonge la ligne
const tfTrendBreak = () => extend(tfTrend(), [{ c: 1.1760 }, { c: 1.1738 }, { c: 1.1715, l: 1.1709 }, { c: 1.1694 }, { c: 1.1680 }, { c: 1.1688 }], 9102, 5);
// … pente irréaliste : impulsion verticale puis retour rapide
const tfSteep = () => buildCandles(1.1700, [
  ...c(1.1704, 1.1699, 1.1708, 1.1703), { c: 1.1711, l: 1.1698 }, ...c(1.1736, 1.1768), { c: 1.1781, l: 1.1752 }, ...c(1.1818, 1.1856, 1.1889),
  ...c(1.1861, 1.1828, 1.1796, 1.1771),
], { seed: 9103, decimals: 5, asset: "EUR/USD", volatility: "élevée", pins: [1.1698, 1.1752] });

// Trend-following 2 — les 3 MM : alignement haussier, baissier, range (260 bougies pour la MM200)
const maSeries = (seed: number, slope: number, amp: number) => {
  const rng = mulberry32(seed);
  const steps: Step[] = [];
  for (let i = 0; i < 260; i++) {
    // tendance + vagues régulières + petit bruit : l'ordre des MM suit la tendance
    const x = 1.1700 + slope * i + amp * Math.sin(i / 5) + (rng() - 0.5) * amp * 0.4;
    steps.push({ c: Number(x.toFixed(5)) });
  }
  return buildCandles(1.1700, steps, { seed, decimals: 5, asset: "EUR/USD", volatility: "normale" });
};

// Trend-following 3 / Avancé 5 — OTE (XAU/USD H1) : sommet 4 600, HL 4 480, impulsion qui
// casse 4 600 (BOS) jusqu'à 4 660, repli régulier dans l'OTE (bas 4 530), bougie de rejet (clôture
// 4 545). Bougies entièrement écrites : aucun rebond parasite dans le repli.
const OTE: Step[] = [
  { c: 4574, h: 4578, l: 4557 }, { c: 4588, h: 4591, l: 4572 }, { c: 4593, h: 4600, l: 4585 },
  { c: 4580, h: 4596, l: 4577 }, { c: 4558, h: 4583, l: 4555 }, { c: 4534, h: 4561, l: 4531 }, { c: 4510, h: 4537, l: 4507 },
  { c: 4493, h: 4513, l: 4489 }, { c: 4487, h: 4497, l: 4480 },
  { c: 4506, h: 4509, l: 4484 }, { c: 4533, h: 4536, l: 4503 }, { c: 4561, h: 4564, l: 4530 }, { c: 4589, h: 4592, l: 4558 },
  { c: 4598, h: 4603, l: 4586 }, { c: 4614, h: 4617, l: 4595 }, { c: 4636, h: 4640, l: 4611 }, { c: 4652, h: 4660, l: 4633 },
  { c: 4643, h: 4655, l: 4639 }, { c: 4622, h: 4646, l: 4618 }, { c: 4600, h: 4625, l: 4596 }, { c: 4578, h: 4603, l: 4574 },
  { c: 4556, h: 4581, l: 4552 }, { c: 4541, h: 4559, l: 4537 }, { c: 4545, h: 4549, l: 4530 },
];
const ote = () => buildCandles(4560, OTE, { seed: 9201, decimals: 1, asset: "XAU/USD", session: "Londres", volatility: "normale", levels: [4518.5, 4548.8], pins: pinAll(OTE) });

// Trend-following 3 — projection des cibles : le pullback du plan (entrée 4 565) puis
// la hausse jusqu'à l'extension 1.618 du repli (4 728)
const fibTp = () => extend(tf3Pullback(), [
  { c: 4579 }, { c: 4603 }, { c: 4628 }, { c: 4651 }, { c: 4668 }, { c: 4683 }, { c: 4694, h: 4698 }, { c: 4686 }, { c: 4705 }, { c: 4721, h: 4731 },
], 9301, 1, [4731], [4660, 4690, 4728]);

Object.assign(SCENARIOS, {
  "tf-trend": tfTrend,
  "tf-trend-break": tfTrendBreak,
  "tf-steep": tfSteep,
  "ma-bull": () => maSeries(9401, 0.00012, 0.0020),
  "ma-bear": () => maSeries(9402, -0.00012, 0.0020),
  "ma-range": () => maSeries(9403, 0, 0.0022),
  "ote": ote,
  "fib-tp": fibTp,
});

// ─── Lot 10b ─────────────────────────────────────────────────────────────────
// Débutant 5 — où placer son SL (Bitcoin H1) : creux 77 200, rebond, retour sur le
// support 78 000, rebond = achat ; SL 77 000 sous le dernier swing low.
const slChart = () => buildCandles(78900, [
  ...c(78700, 78450, 78200, 77800), { c: 77450, l: 77200 }, ...c(77750, 78150, 78600, 78900), { c: 78750, h: 79050 },
  ...c(78550, 78300), { c: 78100, l: 78000 }, { c: 78450, l: 78020 },
], { seed: 10101, decimals: 0, asset: "BTC/USD", session: "New York", volatility: "normale", levels: [78000, 77200], pins: [77200, 78000, 79050] });
Object.assign(SCENARIOS, { "sl-chart": slChart });

// ─── Lot 11 ──────────────────────────────────────────────────────────────────
// Intermédiaire 3 — support de type demande : descente lente, base (3 bougies),
// départ impulsif haussier, retour sur la zone ; résistance de type offre : l'inverse.
const sdSupport = () => buildCandles(1.0904, [
  ...c(1.0897, 1.0891, 1.0884, 1.0878, 1.0871, 1.0863, 1.0855, 1.0846, 1.0838, 1.0830),
  { c: 1.0824, l: 1.0816 }, { c: 1.0827, l: 1.0818 }, { c: 1.0822, l: 1.0815 },
  { c: 1.0851, h: 1.0853, l: 1.0821 }, { c: 1.0879, h: 1.0882, l: 1.0850 },
  ...c(1.0874, 1.0868, 1.0861, 1.0853, 1.0844, 1.0836), { c: 1.0838, l: 1.0829 },
], { seed: 11101, decimals: 5, asset: "EUR/USD", volatility: "normale", levels: [1.0828, 1.0814], pins: [1.0816, 1.0818, 1.0815, 1.0829] });
const sdResistance = () => buildCandles(1.0901, [
  ...c(1.0907, 1.0913, 1.0920, 1.0926, 1.0933, 1.0941, 1.0949, 1.0958, 1.0966, 1.0974),
  { c: 1.0980, h: 1.0988 }, { c: 1.0977, h: 1.0986 }, { c: 1.0982, h: 1.0989 },
  { c: 1.0953, h: 1.0983, l: 1.0951 }, { c: 1.0925, h: 1.0954, l: 1.0922 },
  ...c(1.0930, 1.0936, 1.0943, 1.0951, 1.0960, 1.0968), { c: 1.0966, h: 1.0975 },
], { seed: 11102, decimals: 5, asset: "EUR/USD", volatility: "normale", levels: [1.0976, 1.0990], pins: [1.0988, 1.0986, 1.0989, 1.0975] });
Object.assign(SCENARIOS, { "sd-support": sdSupport, "sd-resistance": sdResistance });

// ─── Lot 12 ──────────────────────────────────────────────────────────────────
// Avancé 6 — chasse aux stops (EUR/USD H1) : support 1.0800 touché 2 fois (equal lows),
// mèche à 1.0786 puis clôture à 1.0808 (au-dessus du support), hausse ensuite.
const stopHunt = () => buildCandles(1.0838, [
  ...c(1.0829, 1.0818, 1.0809), { c: 1.0806, l: 1.0801 }, ...c(1.0817, 1.0828, 1.0822, 1.0812), { c: 1.0805, l: 1.0800 }, ...c(1.0813, 1.0807),
  { c: 1.0808, h: 1.0811, l: 1.0786 },
  ...c(1.0821, 1.0834, 1.0829, 1.0843), { c: 1.0852 },
], { seed: 12101, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.0800], pins: [1.0801, 1.0800, 1.0786, 1.0808] });
// Macro Débutant 1 — réaction d'EUR/USD au CPI de 14h30 (M1) : calme, puis −40 pips
const cpiReaction = () => buildCandles(1.0850, [
  ...c(1.0851, 1.0849, 1.0852, 1.0850, 1.0851, 1.0850), { c: 1.0810, h: 1.0853, l: 1.0804 }, ...c(1.0814, 1.0806, 1.0809),
], { seed: 12201, decimals: 5, asset: "EUR/USD", session: "New York", volatility: "élevée", preNews: true, pins: [1.0810], levels: [1.0820], split: 6 });
Object.assign(SCENARIOS, { "stop-hunt": stopHunt, "cpi-reaction": cpiReaction });

// ─── Lot 14 ──────────────────────────────────────────────────────────────────
// Macro Avancé 1 — un FOMC sur EUR/USD M5 (19h45 → 21h40, heure de Paris) : calme,
// 20h00 décision = impulsion haussière violente, hésitation, 20h30 Powell = retournement
// (plonge, remonte, replonge), après 21h00 la baisse s'installe.
const fomcTimeline = () => buildCandles(1.1850, [
  { c: 1.1852, h: 1.1855, l: 1.1847 }, { c: 1.1849, h: 1.1854, l: 1.1846 }, { c: 1.1851, h: 1.1853, l: 1.1845 },
  { c: 1.1950, h: 1.1968, l: 1.1846 }, { c: 1.1962, h: 1.1985 },
  ...c(1.1938, 1.1960, 1.1932, 1.1948),
  { c: 1.1862, h: 1.1958 }, { c: 1.1908 }, ...c(1.1835, 1.1800, 1.1838, 1.1785),
  ...c(1.1752, 1.1738, 1.1756, 1.1722, 1.1698, 1.1712), { c: 1.1668, l: 1.1660 }, ...c(1.1680, 1.1672),
], { seed: 14101, decimals: 5, asset: "EUR/USD", session: "New York", volatility: "normale", preNews: true, split: 3, pins: [1.1855, 1.1854, 1.1853, 1.1847, 1.1846, 1.1845, 1.1968, 1.1985, 1.1660], levels: [1.1985, 1.1660] });
Object.assign(SCENARIOS, { "fomc-timeline": fomcTimeline });

// ─── Lot 15 ──────────────────────────────────────────────────────────────────
// ICT 1 et ICT 5 — EUR/USD H1 : baisse, deux equal highs à 1.1780, repli à 1.1745
// (« prix actuel » d'ICT 5, ICT_PREP_CUT), puis 3e poussée : mèche à 1.1792 (stops pris)
// et chute violente vers 1.1720.
const ictEqh = () => buildCandles(1.1815, [
  ...c(1.1806, 1.1794, 1.1781, 1.1769, 1.1757), { c: 1.1746, l: 1.1742 },
  ...c(1.1753, 1.1764, 1.1772), { c: 1.1777, h: 1.1780 },
  ...c(1.1769, 1.1760), { c: 1.1753, l: 1.1750 }, ...c(1.1758, 1.1767, 1.1773), { c: 1.1776, h: 1.1780 },
  ...c(1.1768, 1.1757), { c: 1.1745, l: 1.1741 },
  ...c(1.1756, 1.1766, 1.1773), { c: 1.1774, h: 1.1792 },
  { c: 1.1748, h: 1.1776 }, ...c(1.1739, 1.1731), { c: 1.1724, l: 1.1720 }, ...c(1.1727),
], { seed: 15101, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.1780, 1.1792, 1.1720], pins: [1.1742, 1.1780, 1.1750, 1.1741, 1.1792, 1.1720] });
// ICT 1 — faux breakout XAU/USD M15 : résistance 4 680 testée 3 fois, bougie de breakout
// jusqu'à 4 695, réintégration sous 4 680 quelques bougies plus tard, chute vers 4 650.
const falseBreakoutXau = () => buildCandles(4652, [
  ...c(4660, 4668), { c: 4676, h: 4680 }, ...c(4669, 4662, 4671), { c: 4677, h: 4680 }, ...c(4668, 4664, 4672), { c: 4678, h: 4680 },
  { c: 4689, h: 4695, l: 4676 }, { c: 4686, h: 4691 }, { c: 4684, l: 4681 },
  { c: 4673, h: 4685 }, ...c(4663, 4656), { c: 4653, l: 4650 },
], { seed: 15201, decimals: 0, asset: "XAU/USD", session: "Londres", volatility: "normale", levels: [4680, 4695, 4650], pins: [4680, 4695, 4681, 4650] });
// ICT 1 — réaction après sweep (EUR/USD M15) : equal highs 1.1780, dernier creux local
// 1.1762, sweep à 1.1792 refermé sous 1.1780, puis bougie impulsive de 35 pts qui casse
// 1.1762 (entrée 1.1758, SL 1.1795, TP 1.1695).
const ictSweepM15 = () => buildCandles(1.1755, [
  ...c(1.1761, 1.1768, 1.1774), { c: 1.1777, h: 1.1780 }, ...c(1.1772, 1.1767), { c: 1.1769, l: 1.1765 },
  ...c(1.1773), { c: 1.1776, h: 1.1780 }, ...c(1.1771, 1.1766), { c: 1.1764, l: 1.1762 }, ...c(1.1767, 1.1771),
  { c: 1.1776, h: 1.1792, l: 1.1769 }, { c: 1.1741, h: 1.1777 },
  ...c(1.1735, 1.1738, 1.1727, 1.1722),
], { seed: 15301, decimals: 5, asset: "EUR/USD", session: "New York", volatility: "normale", levels: [1.1780, 1.1762, 1.1792], pins: [1.1780, 1.1765, 1.1762, 1.1792, 1.1769, 1.1777] });
// ICT 2 — mitigation d'un FVG baissier (XAU/USD H1) : impulsion depuis 4 690, FVG 4 655-4 665,
// prix jusqu'à 4 620, remontée progressive jusqu'à 4 660 (dans le FVG), bougie baissière
// impulsive de rejet, puis 4 610.
// Structure du FVG : largestFvg à i=3 (grande bougie baissière) : cs[2].l=4665 (borne
// haute), cs[4].h=4655 (borne basse) → y1=4655, y2=4665 (taille 10). cs[3].h=4673 >
// cs[1].l=4668 → pas de FVG à i=2. Creux 4620 (cs[5]). Retour dans la zone à cs[10]-cs[11].
// Post-rejet graduel : aucun gap voisin ne dépasse 10.
const fvgMitigationXau = () => buildCandles(4690, [
  { c: 4681, h: 4690, l: 4675 },                // [0]
  { c: 4674, h: 4682, l: 4668 },                // [1]
  { c: 4672, h: 4675, l: 4665 },                // [2] l=4665 (borne haute du FVG)
  { c: 4628, h: 4673, l: 4624 },                // [3] grande bougie impulsive
  { c: 4624, h: 4655, l: 4620 },                // [4] h=4655 (borne basse du FVG), l=4620 (creux)
  ...c(4631, 4637, 4644, 4650), { c: 4655 }, { c: 4657, h: 4660 },
  { c: 4642, h: 4659 }, { c: 4638 }, { c: 4633 }, ...c(4629, 4624), { c: 4617, l: 4610 },
], { seed: 15401, decimals: 0, asset: "XAU/USD", session: "Londres", volatility: "normale", levels: [4665, 4655, 4660, 4620, 4610], pins: [4690, 4668, 4665, 4673, 4624, 4655, 4620, 4657, 4660, 4659, 4642, 4610] });
// ICT 2 — FVG haussier 1.0840-1.0860 (EUR/USD) : creux 1.0828, impulsion, sommet 1.0896,
// retour vers la zone ; puis 3 cas : A rebond à 1.0860 → 1.0920 ; B mèche à 1.0842,
// clôture 1.0855, reprise ; C traversée sans réaction, clôture 1.0825 sous le creux 1.0828.
const FVG_PREFIX: Step[] = [
  ...c(1.0846, 1.0840, 1.0834), { c: 1.0831, l: 1.0828 }, { c: 1.0836, h: 1.0840 }, { c: 1.0868 }, { c: 1.0874, l: 1.0860 },
  ...c(1.0881, 1.0889), { c: 1.0893, h: 1.0896 }, ...c(1.0885, 1.0876, 1.0868),
];
const FVG_OPTS = { decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale" } as const;
const fvgPrefix = () => buildCandles(1.0850, FVG_PREFIX, { ...FVG_OPTS, seed: 15501, levels: [1.0840, 1.0860], pins: [1.0828, 1.0840, 1.0860, 1.0896] });
// chaque cas = le même début + sa suite (clôtures clés figées)
const fvgCase = (steps: Step[], pins: number[], seed: number) => () => {
  const p = fvgPrefix();
  return [...p, ...buildCandles(p[p.length - 1].c, steps, { ...FVG_OPTS, seed, pins })];
};
const fvgCaseA = fvgCase([{ c: 1.0866, l: 1.0860 }, { c: 1.0885 }, ...c(1.0896, 1.0908), { c: 1.0918, h: 1.0920 }], [1.0860, 1.0866, 1.0885, 1.0920], 15502);
const fvgCaseB = fvgCase([{ c: 1.0861 }, { c: 1.0855, l: 1.0842 }, { c: 1.0866, l: 1.0852 }, ...c(1.0878, 1.0887)], [1.0861, 1.0842, 1.0852, 1.0855], 15503);
const fvgCaseC = fvgCase([...c(1.0857, 1.0846, 1.0834), { c: 1.0825 }, ...c(1.0819)], [1.0857, 1.0846, 1.0834, 1.0825], 15504);
Object.assign(SCENARIOS, {
  "ict-eqh": ictEqh, "false-breakout-xau": falseBreakoutXau, "ict-sweep-m15": ictSweepM15,
  "fvg-mitigation-xau": fvgMitigationXau, "fvg-case-a": fvgCaseA, "fvg-case-b": fvgCaseB, "fvg-case-c": fvgCaseC,
});

// ─── Lot 16 ──────────────────────────────────────────────────────────────────
// ICT 3 — KillzonesTimeline (EUR/USD M15 compact) : 7 bougies calmes Asia (range
// 1.1710-1.1725) → 7 bougies London (sweep 1.1702, impulsion haussière à 1.1750)
// → 5 bougies NY (continuation + expansion). Séparations à 7 et 14.
const killzonesKz = () => buildCandles(1.1718, [
  { c: 1.1720, h: 1.1724, l: 1.1715 }, { c: 1.1716, h: 1.1721, l: 1.1713 },
  { c: 1.1720, h: 1.1723, l: 1.1714 }, { c: 1.1718, h: 1.1722, l: 1.1712 },
  { c: 1.1722, h: 1.1725, l: 1.1716 }, { c: 1.1719, h: 1.1724, l: 1.1714 }, { c: 1.1720, h: 1.1724, l: 1.1715 },
  { c: 1.1712, h: 1.1721, l: 1.1700 },
  { c: 1.1724, h: 1.1726, l: 1.1711 }, { c: 1.1738 }, { c: 1.1745 }, { c: 1.1748, h: 1.1750 }, ...c(1.1742, 1.1746),
  { c: 1.1758 }, { c: 1.1766 }, { c: 1.1770, h: 1.1774 }, ...c(1.1765, 1.1768),
], { seed: 16101, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", split: 7, preNews: true,
  levels: [1.1725, 1.1710, 1.1702, 1.1750, 1.1774], pins: [1.1725, 1.1710, 1.1712, 1.1721, 1.1700, 1.1711, 1.1750, 1.1774] });
// ICT 3 — AsiaRangeSweep (EUR/USD M15) : range Asia 1.1710-1.1725 (7 bougies calmes),
// bougie de sweep sous 1.1710 jusqu'à 1.1702 qui clôture dans le range (1.1712), impulsion haussière
// de 3 bougies (10, 14 et 14 pips) jusqu'à 1.1750.
const ASIA_SWEEP: Step[] = [
  { c: 1.1720, h: 1.1724, l: 1.1715 }, { c: 1.1716, h: 1.1721, l: 1.1712 },
  { c: 1.1720, h: 1.1723, l: 1.1714 }, { c: 1.1718, h: 1.1722, l: 1.1712 },
  { c: 1.1722, h: 1.1725, l: 1.1716 }, { c: 1.1719, h: 1.1724, l: 1.1714 }, { c: 1.1720, h: 1.1724, l: 1.1715 },
  { c: 1.1712, h: 1.1720, l: 1.1702 }, { c: 1.1722, h: 1.1723, l: 1.1711 },
  { c: 1.1736, h: 1.1737, l: 1.1721 }, { c: 1.1750, h: 1.1750, l: 1.1735 }, { c: 1.1746, h: 1.1750, l: 1.1744 },
];
const asiaRangeSweep = () => buildCandles(1.1718, ASIA_SWEEP, { seed: 16201, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", split: 7,
  levels: [1.1725, 1.1710, 1.1702, 1.1750], pins: pinAll(ASIA_SWEEP) });
// ICT 3 — NYOpenExpansion (XAU/USD M15) : consolidation ~4 640 (5 bougies calmes), à
// l'ouverture NY bougie explosive haussière de 28 $ (4 640 → mèche de sweep à 4 668), puis
// cascade rouge jusqu'à 4 610 : 58 $ d'amplitude dans la première heure (4 bougies).
const nyExpansion = () => buildCandles(4638, [
  { c: 4640, h: 4643, l: 4636 }, { c: 4638, h: 4641, l: 4636 }, { c: 4641, h: 4644, l: 4637 },
  { c: 4639, h: 4643, l: 4636 }, { c: 4640, h: 4644, l: 4637 },
  { c: 4664, h: 4668, l: 4640 }, { c: 4642, h: 4666 }, { c: 4622, h: 4644 }, { c: 4614, h: 4625, l: 4610 },
  { c: 4619, l: 4612 }, { c: 4616, h: 4622, l: 4613 },
], { seed: 16301, decimals: 0, asset: "XAU/USD", session: "New York", volatility: "élevée", split: 5,
  levels: [4668, 4610], pins: [4640, 4644, 4636, 4664, 4668, 4666, 4642, 4644, 4622, 4625, 4614, 4610, 4612, 4613, 4619, 4616] });
// ICT 3 — TimingComparison : même résistance H1 1.1780 testée deux fois (M15).
// Asia (03h UTC) : bougie de rejet de 4 pips (mèche 1.1776 → 1.1780), puis 2 h de latéralisation.
// London Open : sweep à 1.1792, puis cascade baissière de 35 pips en 4 bougies (1.1757).
const timingAsia = () => buildCandles(1.1768, [
  ...c(1.1772, 1.1776), { c: 1.1775, h: 1.1780, l: 1.1773 },
  { c: 1.1773 }, { c: 1.1775 }, { c: 1.1772 }, { c: 1.1774 }, { c: 1.1772 }, { c: 1.1775 }, { c: 1.1773 }, { c: 1.1774 },
], { seed: 16401, decimals: 5, asset: "EUR/USD", session: "Asie", volatility: "faible",
  levels: [1.1780, 1.1777], pins: [1.1776, 1.1780, 1.1775, 1.1773] });
const timingLondon = () => buildCandles(1.1768, [
  ...c(1.1772, 1.1776), { c: 1.1777, h: 1.1792, l: 1.1774 }, { c: 1.1768 }, { c: 1.1764 }, { c: 1.1760 }, { c: 1.1759, l: 1.1757 },
  ...c(1.1762, 1.1760),
], { seed: 16402, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale",
  levels: [1.1780, 1.1757], pins: [1.1777, 1.1792, 1.1774, 1.1768, 1.1764, 1.1760, 1.1759, 1.1757] });
// ICT 4 et ICT 5 — un displacement EUR/USD M15 complet (une seule séquence pour les deux leçons),
// bougies entièrement écrites : calme sous les equal highs 1.1780 (corps de 3 à 4 pips), sweep à
// 1.1792 refermé à 1.1777, puis 3 bougies baissières sans mèche haute aux corps de 9, 10 et 10 pips
// (ils ne rétrécissent pas) jusqu'à 1.1748 en 45 minutes ; deux FVG bearish (1.1768-1.1777 et
// 1.1758-1.1768) ; remontée progressive dans le FVG haut, bougie de rejet (mèche 1.1784, clôture
// 1.1774 dans le FVG), bougie baissière impulsive qui casse son bas : short 1.1774.
const DISP_EUR: Step[] = [
  { c: 1.1774, h: 1.1776, l: 1.1769 }, { c: 1.1777, h: 1.1780, l: 1.1773 }, { c: 1.1773, h: 1.1778, l: 1.1771 },
  { c: 1.1776, h: 1.1777, l: 1.1772 }, { c: 1.1779, h: 1.1780, l: 1.1775 },
  { c: 1.1777, h: 1.1792, l: 1.1777 },
  { c: 1.1768, h: 1.1777, l: 1.1768 }, { c: 1.1758, h: 1.1768, l: 1.1757 }, { c: 1.1748, h: 1.1758, l: 1.1748 },
  { c: 1.1752, h: 1.1757, l: 1.1748 }, { c: 1.1755, h: 1.1757, l: 1.1750 }, { c: 1.1753, h: 1.1757, l: 1.1751 }, { c: 1.1758, h: 1.1760, l: 1.1752 },
  { c: 1.1757, h: 1.1760, l: 1.1755 }, { c: 1.1763, h: 1.1765, l: 1.1756 }, { c: 1.1767, h: 1.1769, l: 1.1762 }, { c: 1.1771, h: 1.1773, l: 1.1766 },
  { c: 1.1776, h: 1.1777, l: 1.1770 },
  { c: 1.1774, h: 1.1784, l: 1.1774 }, { c: 1.1758, h: 1.1775, l: 1.1757 }, { c: 1.1751, h: 1.1759, l: 1.1749 }, { c: 1.1744, h: 1.1752, l: 1.1742 },
];
const dispEur = () => buildCandles(1.1770, DISP_EUR, { seed: 16501, decimals: 5, asset: "EUR/USD", session: "New York", volatility: "normale",
  levels: [1.1780, 1.1792, 1.1748, 1.1777], pins: pinAll(DISP_EUR) });
// ICT 4 bloc 2 — XAU/USD M15 : 3 h d'équilibre autour de 4 650 $ (12 bougies plates, sommet
// 4 657), à 14h UTC une bougie sweep le sommet jusqu'à 4 668 $, puis 5 bougies baissières à
// grands corps (8, 8, 9, 9 et 10 $, sans mèche haute) jusqu'à 4 608 $.
const dispControlXau = () => buildCandles(4650, [
  { c: 4652, h: 4655, l: 4648 }, { c: 4649, h: 4653, l: 4646 }, { c: 4651, h: 4654, l: 4647 }, { c: 4647, h: 4652, l: 4645 },
  { c: 4650, h: 4653, l: 4646 }, { c: 4654, h: 4657, l: 4649 }, { c: 4649, h: 4655, l: 4647 }, { c: 4651, h: 4654, l: 4647 },
  { c: 4648, h: 4652, l: 4644 }, { c: 4652, h: 4655, l: 4647 }, { c: 4650, h: 4654, l: 4647 }, { c: 4651, h: 4654, l: 4648 },
  { c: 4652, h: 4668, l: 4649 },
  { c: 4644, h: 4652, l: 4643 }, { c: 4636, h: 4644, l: 4635 }, { c: 4627, h: 4636, l: 4626 }, { c: 4618, h: 4627, l: 4617 }, { c: 4608, h: 4618, l: 4608 },
], { seed: 17101, decimals: 0, asset: "XAU/USD", session: "New York", volatility: "normale", split: 12, preNews: true,
  levels: [4657, 4668, 4608], pins: [4655, 4648, 4653, 4646, 4654, 4647, 4652, 4645, 4657, 4649, 4644, 4668, 4643, 4636, 4635, 4627, 4626, 4618, 4617, 4608] });
// ICT 4 bloc 4 — volatilité ≠ displacement (EUR/USD M15).
// vol-spike : calme, bougie haussière isolée de 18 pips (news mineure), la suivante referme tout.
const volSpike = () => buildCandles(1.0838, [
  { c: 1.0840, h: 1.0842, l: 1.0836 }, { c: 1.0837, h: 1.0841, l: 1.0835 }, { c: 1.0840, h: 1.0842, l: 1.0836 },
  { c: 1.0858, h: 1.0860, l: 1.0839 }, { c: 1.0839, h: 1.0859, l: 1.0837 },
  { c: 1.0841, h: 1.0843, l: 1.0837 }, { c: 1.0838, h: 1.0842, l: 1.0836 }, { c: 1.0840, h: 1.0842, l: 1.0837 },
], { seed: 17201, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "faible",
  pins: [1.0840, 1.0858, 1.0860, 1.0839, 1.0859, 1.0837, 1.0836, 1.0842] });
// disp-seq : creux local 1.0844, puis 4 bougies baissières de 10-12 pips qui cassent ce creux et enchaînent.
const dispSeq = () => buildCandles(1.0850, [
  { c: 1.0853, h: 1.0855, l: 1.0849 }, { c: 1.0849, h: 1.0854, l: 1.0847 }, { c: 1.0852, h: 1.0854, l: 1.0848 },
  { c: 1.0847, h: 1.0853, l: 1.0844 }, { c: 1.0850, h: 1.0852, l: 1.0846 }, { c: 1.0853, h: 1.0855, l: 1.0849 },
  { c: 1.0842, h: 1.0853, l: 1.0841 }, { c: 1.0831, h: 1.0842, l: 1.0830 }, { c: 1.0820, h: 1.0831, l: 1.0819 }, { c: 1.0809, h: 1.0820, l: 1.0807 },
], { seed: 17202, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", split: 6,
  levels: [1.0844], pins: [1.0844, 1.0855, 1.0853, 1.0842, 1.0841, 1.0831, 1.0830, 1.0820, 1.0819, 1.0809, 1.0807] });
// ICT 5 bloc 4 — XAU/USD M15 : range Asia 4 642-4 655, à l'ouverture de London mèche de sweep
// au-dessus de 4 655 (4 659), puis displacement baissier de 38 $ (4 651 → 4 613, corps de 8, 9, 10 et
// 11 $, sans mèche haute) qui laisse un FVG.
const ictTimingBear = () => buildCandles(4648, [
  { c: 4652, h: 4655, l: 4646 }, { c: 4648, h: 4654, l: 4644 }, { c: 4651, h: 4653, l: 4645 },
  { c: 4646, h: 4652, l: 4642 }, { c: 4650, h: 4655, l: 4645 }, { c: 4649, h: 4653, l: 4646 },
  { c: 4651, h: 4659, l: 4648 },
  { c: 4643, h: 4651, l: 4642 }, { c: 4634, h: 4643, l: 4633 }, { c: 4624, h: 4634, l: 4623 }, { c: 4613, h: 4624, l: 4611 },
], { seed: 17301, decimals: 0, asset: "XAU/USD", session: "Londres", volatility: "normale", split: 6, preNews: true,
  levels: [4655, 4642, 4659], pins: [4655, 4646, 4644, 4642, 4659, 4648, 4651, 4643, 4634, 4633, 4624, 4623, 4613, 4611] });
Object.assign(SCENARIOS, {
  "killzones-kz": killzonesKz, "asia-range-sweep": asiaRangeSweep, "ny-expansion": nyExpansion,
  "timing-asia": timingAsia, "timing-london": timingLondon,
  "disp-eur": dispEur, "disp-control-xau": dispControlXau, "vol-spike": volSpike, "disp-seq": dispSeq,
  "ict-timing-bear": ictTimingBear,
});

// ─── Lot 18 ──────────────────────────────────────────────────────────────────
// Macro-trading 1 — FOMC sur XAU/USD M15 : compression autour de 4 660 $ (sous la résistance
// H4 4 680), première impulsion baissière 4 660 → 4 590 $ (70 $) en une bougie, stabilisation
// autour de 4 595 $ (mèches basses), retour vers 4 638 $ une heure après le creux.
// Le fade : entrée 4 600 $ (bougie de reprise), SL 4 578 $, objectif 4 638 $.
const fomcExcess = () => buildCandles(4659, [
  { c: 4662, h: 4667, l: 4656 }, { c: 4658, h: 4664, l: 4654 }, { c: 4661, h: 4666, l: 4655 }, { c: 4657, h: 4663, l: 4653 }, { c: 4660, h: 4665, l: 4655 },
  { c: 4596, h: 4661, l: 4590 },
  { c: 4597, h: 4599, l: 4591 }, { c: 4596, h: 4600, l: 4591 },
  { c: 4618, h: 4620, l: 4596 }, { c: 4635, h: 4638, l: 4616 },
], { seed: 18101, decimals: 0, asset: "XAU/USD", session: "New York", volatility: "élevée", split: 5, preNews: true,
  levels: [4590, 4638], pins: [4667, 4656, 4664, 4654, 4666, 4655, 4663, 4653, 4665, 4660, 4661, 4596, 4590, 4597, 4599, 4591, 4600, 4618, 4620, 4616, 4635, 4638] });
// Macro-trading 2 — NFP sur XAU/USD M15 : compression 4 630-4 650 $ (prix 4 640), impulsion
// headline jusqu'à 4 575 $ (65 $) qui casse le support 4 600, quatre bougies de stabilisation
// (mèches basses de 6 à 8 $, clôtures entre 4 580 et 4 585), puis trois suites :
// A remontée vers 4 625 $ dans l'heure, B reprise franche vers 4 630 $, C breakout au-dessus
// de 4 620 $ et accélération jusqu'à 4 665 $ (au-delà du niveau pré-NFP).
const NFP_PREFIX: Step[] = [
  { c: 4642, h: 4648, l: 4636 }, { c: 4637, h: 4645, l: 4632 }, { c: 4644, h: 4650, l: 4635 }, { c: 4639, h: 4646, l: 4630 }, { c: 4640, h: 4645, l: 4634 },
  { c: 4582, h: 4641, l: 4575 },
  { c: 4584, h: 4587, l: 4576 }, { c: 4581, h: 4586, l: 4575 }, { c: 4585, h: 4587, l: 4575 }, { c: 4583, h: 4587, l: 4575 },
];
const NFP_PINS = [4648, 4636, 4645, 4632, 4650, 4635, 4646, 4630, 4634, 4640, 4641, 4582, 4575, 4584, 4587, 4576, 4581, 4586, 4585, 4583];
const NFP_OPTS = { decimals: 0, asset: "XAU/USD", session: "New York", volatility: "élevée" } as const;
const nfpPrefix = () => buildCandles(4641, NFP_PREFIX, { ...NFP_OPTS, seed: 18201, split: 5, preNews: true, levels: [4575], pins: NFP_PINS });
const nfpCase = (steps: Step[], pins: number[], seed: number) => () => {
  const p = nfpPrefix();
  return [...p, ...buildCandles(p[p.length - 1].c, steps, { ...NFP_OPTS, seed, levels: [4575], pins })];
};
const nfpHeadline = nfpCase([{ c: 4594, l: 4582 }, { c: 4603, l: 4591 }, { c: 4613, l: 4600 }, { c: 4622, h: 4625, l: 4610 }], [4582, 4594, 4591, 4603, 4600, 4613, 4610, 4622, 4625], 18202);
const nfpStab = nfpCase([{ c: 4600, l: 4582 }, { c: 4611, l: 4597 }, { c: 4621, l: 4608 }, { c: 4628, h: 4630, l: 4618 }], [4582, 4600, 4597, 4611, 4608, 4621, 4618, 4628, 4630], 18203);
const nfpReversal = nfpCase([{ c: 4597, l: 4582 }, { c: 4609, l: 4595 }, { c: 4628, h: 4630, l: 4606 }, { c: 4643, l: 4625 }, { c: 4655, l: 4640 }, { c: 4662, h: 4665, l: 4651 }],
  [4582, 4597, 4595, 4609, 4606, 4628, 4630, 4643, 4625, 4655, 4640, 4662, 4665, 4651], 18204);
Object.assign(SCENARIOS, {
  "fomc-excess": fomcExcess, "nfp-headline": nfpHeadline, "nfp-stab": nfpStab, "nfp-reversal": nfpReversal,
});

// ─── Lot 19 ──────────────────────────────────────────────────────────────────
// Macro-trading 3 — RiskoffSignals (XAU/USD H4, une semaine) : de 4 585 $ à 4 705 $ en
// structure haussière, trois jambes : sommets 4 628 / 4 662 / 4 705, HL 4 608 et 4 640.
const riskoffDaily = () => buildCandles(4590, [
  { c: 4588, l: 4585 }, ...c(4596, 4604, 4613, 4621), { c: 4626, h: 4628 }, { c: 4619, h: 4624 }, ...c(4612), { c: 4611, l: 4608 },
  ...c(4620, 4631, 4642, 4653), { c: 4659, h: 4662 }, ...c(4652, 4645), { c: 4643, l: 4640 },
  ...c(4652, 4664, 4677, 4690), { c: 4702, h: 4705 },
], { seed: 19101, decimals: 0, asset: "XAU/USD", session: "Londres", volatility: "normale",
  levels: [4585, 4705], pins: [4588, 4585, 4626, 4628, 4619, 4624, 4612, 4611, 4608, 4659, 4662, 4645, 4643, 4640, 4702, 4705] });
// Macro-trading 3 — RiskoffTrend (XAU/USD H4) : impulsion 4 610 → 4 690 avec un palier à
// 4 655 (sommet), pullback contrôlé jusqu'à 4 655 (ancien sommet devenu support, HL),
// stabilisation, bougie de reprise (entrée 4 660), impulsion jusqu'à 4 730.
const riskoffTrend = () => buildCandles(4600, [
  ...c(4605), { c: 4612, l: 4608 }, { c: 4624, l: 4610 }, { c: 4637, l: 4621 }, { c: 4648, l: 4634 }, { c: 4652, h: 4655 }, ...c(4647), { c: 4645, l: 4642 },
  { c: 4657, l: 4644 }, ...c(4669, 4680), { c: 4685, h: 4690 }, { c: 4679, h: 4687 }, ...c(4667), { c: 4657, l: 4655 }, { c: 4660, h: 4662, l: 4656 },
  ...c(4675, 4690, 4704, 4718), { c: 4728, h: 4730 },
], { seed: 19201, decimals: 0, asset: "XAU/USD", session: "New York", volatility: "normale",
  levels: [4655, 4690, 4730], pins: [4608, 4610, 4621, 4624, 4634, 4637, 4648, 4655, 4642, 4644, 4657, 4669, 4680, 4685, 4690, 4679, 4687, 4667, 4656, 4660, 4662, 4730] });
// Macro-trading 3 — RiskoffExhaustion (XAU/USD H4) : forte tendance depuis 4 590 $, puis trois
// sommets qui faiblissent (4 735, 4 720, 4 705 $) et des corrections de plus en plus profondes
// (25, 40, 65 $ : creux 4 710, 4 680, 4 640). Chaque bougie est écrite (o = clôture précédente).
const EXHAUST: Step[] = [
  { c: 4605, h: 4607, l: 4588 }, { c: 4622, h: 4624, l: 4603 }, { c: 4640, h: 4642, l: 4620 }, { c: 4650, h: 4653, l: 4638 },
  { c: 4638, h: 4651, l: 4635 }, { c: 4645, h: 4647, l: 4636 }, { c: 4662, h: 4664, l: 4643 }, { c: 4685, h: 4687, l: 4660 },
  { c: 4712, h: 4714, l: 4683 }, { c: 4732, h: 4735, l: 4711 },
  { c: 4718, h: 4733, l: 4716 }, { c: 4713, h: 4719, l: 4710 }, { c: 4716, h: 4718, l: 4711 }, { c: 4719, h: 4720, l: 4714 },
  { c: 4705, h: 4719, l: 4703 }, { c: 4692, h: 4707, l: 4690 }, { c: 4684, h: 4694, l: 4680 }, { c: 4694, h: 4696, l: 4682 }, { c: 4703, h: 4705, l: 4692 },
  { c: 4688, h: 4704, l: 4686 }, { c: 4668, h: 4690, l: 4666 }, { c: 4652, h: 4670, l: 4650 }, { c: 4645, h: 4655, l: 4640 },
];
const riskoffExhaust = () => buildCandles(4590, EXHAUST, { seed: 19301, decimals: 0, asset: "XAU/USD", session: "New York", volatility: "normale",
  levels: [4735, 4710, 4720, 4680, 4705, 4640], pins: pinAll(EXHAUST) });
// Macro-trading 4 — MacroFilterCalendar (XAU/USD M5, 12h55 → 13h55 UTC) : prix sous la
// résistance 4 665, structure baissière, setup short à 13h25 ; CPI à 13h30 : bougie jusqu'à
// 4 710 $ (au-dessus du SL d'un short), puis chute jusqu'à 4 610 $ : 100 $ d'amplitude.
const macroFilterNews = () => buildCandles(4655, [
  { c: 4658, h: 4661, l: 4653 }, { c: 4662, h: 4665, l: 4656 }, { c: 4657, h: 4663, l: 4655 }, { c: 4654, h: 4659, l: 4651 },
  { c: 4656, h: 4660, l: 4652 }, { c: 4653, h: 4658, l: 4650 }, { c: 4652, h: 4656, l: 4649 },
  { c: 4688, h: 4710, l: 4648 }, { c: 4662, h: 4692 }, { c: 4640, h: 4664 }, { c: 4622, h: 4643 }, { c: 4613, h: 4626, l: 4610 },
], { seed: 19401, decimals: 0, asset: "XAU/USD", session: "New York", volatility: "élevée", split: 7, preNews: true,
  levels: [4665, 4710, 4610], pins: [4661, 4653, 4665, 4656, 4663, 4655, 4659, 4651, 4660, 4652, 4658, 4650, 4649, 4688, 4710, 4648, 4662, 4692, 4640, 4664, 4622, 4643, 4613, 4626, 4610] });
Object.assign(SCENARIOS, {
  "riskoff-daily": riskoffDaily, "riskoff-trend-h4": riskoffTrend,
  "riskoff-exhaust-h4": riskoffExhaust, "macro-filter-news": macroFilterNews,
});

// ─── Lot 20 ──────────────────────────────────────────────────────────────────
const EU = { decimals: 5, asset: "EUR/USD", volatility: "normale" } as const;
// Multi-UT 1 bloc 2 — le piège du graphique unique : Daily EUR/USD en LH/LL, résistance 1.1820
// (dernier LH) ; M15 : niveau local 1.1760 touché deux fois, breakout, sommet 1.1775, rechute à 1.1700.
const stfDaily = () => buildCandles(1.1925, [
  { c: 1.1918, l: 1.1912 }, ...c(1.1932, 1.1946), { c: 1.1955, h: 1.1962 }, ...c(1.1940, 1.1918, 1.1896, 1.1872), { c: 1.1850, l: 1.1842 },
  ...c(1.1862, 1.1878, 1.1893), { c: 1.1900, h: 1.1905 }, ...c(1.1885, 1.1862, 1.1838, 1.1810, 1.1786), { c: 1.1768, l: 1.1760 },
  ...c(1.1779, 1.1795, 1.1810), { c: 1.1812, h: 1.1820 }, ...c(1.1798, 1.1776), { c: 1.1752 },
], { ...EU, seed: 20101, session: "Londres", levels: [1.1820], pins: [1.1912, 1.1962, 1.1842, 1.1905, 1.1760, 1.1820, 1.1752] });
const stfM15 = () => buildCandles(1.1738, [
  ...c(1.1745, 1.1752), { c: 1.1757, h: 1.1760 }, { c: 1.1750, h: 1.1758 }, ...c(1.1746), { c: 1.1755, h: 1.1757 }, { c: 1.1758, h: 1.1760 },
  { c: 1.1767, h: 1.1769 }, { c: 1.1771, h: 1.1775 }, { c: 1.1764, h: 1.1772 }, ...c(1.1752, 1.1740, 1.1728, 1.1716), { c: 1.1705, l: 1.1700 },
], { ...EU, seed: 20102, session: "Londres", levels: [1.1760, 1.1775, 1.1700], pins: [1.1757, 1.1760, 1.1758, 1.1755, 1.1767, 1.1769, 1.1771, 1.1775, 1.1772, 1.1700] });
// Multi-UT 1 bloc 3 (process, étape 1) — H4 EUR/USD en LH/LL : ancien support 1.1778 cassé,
// LH 1.1820, LL 1.1740, LH sur la résistance 1.1780, prix actuel 1.1725.
const htfBearH4 = () => buildCandles(1.1830, [
  ...c(1.1838), { c: 1.1845, h: 1.1850 }, ...c(1.1832, 1.1815, 1.1798), { c: 1.1785, l: 1.1778 }, ...c(1.1795, 1.1808), { c: 1.1815, h: 1.1820 },
  ...c(1.1800, 1.1782, 1.1764), { c: 1.1748, l: 1.1740 }, ...c(1.1756, 1.1768), { c: 1.1774, h: 1.1780 }, ...c(1.1762, 1.1744), { c: 1.1725 },
], { ...EU, seed: 20201, session: "Londres", levels: [1.1780], pins: [1.1850, 1.1778, 1.1820, 1.1740, 1.1774, 1.1780, 1.1725] });
// Multi-UT 1 bloc 4 (process, étape 2) — H1 : zone 1.1765-1.1780 = ancien support (deux appuis),
// support cassé, premier rejet au retest, baisse vers 1.1725, puis retour du prix dans la zone.
const interZoneH1 = () => buildCandles(1.1800, [
  ...c(1.1792), { c: 1.1784, l: 1.1770 }, ...c(1.1790, 1.1796, 1.1786), { c: 1.1778, l: 1.1768 }, ...c(1.1785, 1.1774),
  { c: 1.1752, h: 1.1776 }, ...c(1.1748, 1.1760), { c: 1.1772, h: 1.1777 }, { c: 1.1755, h: 1.1778 }, ...c(1.1742, 1.1733), { c: 1.1728, l: 1.1725 },
  ...c(1.1738, 1.1750, 1.1761), { c: 1.1768, h: 1.1770 },
], { ...EU, seed: 20301, session: "Londres", levels: [1.1765, 1.1780], pins: [1.1770, 1.1768, 1.1752, 1.1776, 1.1772, 1.1777, 1.1755, 1.1778, 1.1725, 1.1768, 1.1770] });
// Multi-UT 1 bloc 5 (process, étape 3) — M5 dans la zone H1 : petite structure haussière (HL),
// sommet local 1.1774, sweep jusqu'à 1.1778, puis bougie de displacement qui casse le dernier HL
// (CHoCH baissier) : entrée short après le breakout local.
const LTF_M5: Step[] = [
  { c: 1.1762, h: 1.1763, l: 1.1757 }, { c: 1.1766, h: 1.1767, l: 1.1761 }, { c: 1.1770, h: 1.1772, l: 1.1765 }, { c: 1.1766, h: 1.1771, l: 1.1764 },
  { c: 1.1770, h: 1.1771, l: 1.1765 }, { c: 1.1773, h: 1.1774, l: 1.1769 }, { c: 1.1768, h: 1.1773, l: 1.1765 }, { c: 1.1772, h: 1.1773, l: 1.1767 },
  { c: 1.1771, h: 1.1778, l: 1.1769 }, { c: 1.1768, h: 1.1772, l: 1.1766 }, { c: 1.1757, h: 1.1769, l: 1.1756 }, { c: 1.1753, h: 1.1758, l: 1.1751 },
  { c: 1.1749, h: 1.1754, l: 1.1747 },
];
const ltfExecM5 = () => buildCandles(1.1758, LTF_M5, { ...EU, seed: 20401, session: "New York", levels: [1.1765, 1.1778], pins: pinAll(LTF_M5) });
// Multi-UT 2 bloc 1 — contre la tendance : Daily en LH/LL, résistance Daily/H4 1.1760 (dernier LH),
// prix 1.1715 ; M15 : niveau local 1.1740, breakout, sommet 1.1752, rejet jusqu'à 1.1685.
const ctDaily = () => buildCandles(1.1850, [
  ...c(1.1858), { c: 1.1866, h: 1.1870 }, ...c(1.1850, 1.1828, 1.1806), { c: 1.1787, l: 1.1780 }, ...c(1.1797, 1.1812), { c: 1.1825, h: 1.1830 },
  ...c(1.1808, 1.1784, 1.1760, 1.1734), { c: 1.1710, l: 1.1700 }, ...c(1.1722, 1.1738), { c: 1.1752, h: 1.1760 }, ...c(1.1735), { c: 1.1715 },
], { ...EU, seed: 20501, session: "Londres", levels: [1.1760], pins: [1.1870, 1.1780, 1.1830, 1.1700, 1.1752, 1.1760, 1.1715] });
const ctM15 = () => buildCandles(1.1712, [
  ...c(1.1720, 1.1728), { c: 1.1736, h: 1.1740 }, ...c(1.1730, 1.1725), { c: 1.1734 }, { c: 1.1737, h: 1.1740 },
  { c: 1.1746, h: 1.1748 }, { c: 1.1749, h: 1.1752 }, { c: 1.1741, h: 1.1750 }, ...c(1.1728, 1.1715, 1.1703, 1.1694), { c: 1.1689, l: 1.1685 },
], { ...EU, seed: 20502, session: "Londres", levels: [1.1740, 1.1752, 1.1685], pins: [1.1736, 1.1740, 1.1737, 1.1746, 1.1748, 1.1749, 1.1752, 1.1750, 1.1685] });
Object.assign(SCENARIOS, {
  "stf-daily": stfDaily, "stf-m15": stfM15, "htf-bear-h4": htfBearH4, "inter-zone-h1": interZoneH1,
  "ltf-exec-m5": ltfExecM5, "ct-daily": ctDaily, "ct-m15": ctM15,
});

// ─── Lot 21 ──────────────────────────────────────────────────────────────────
// Bougies entièrement écrites (o = clôture précédente), structures exactes.
const authored = (open: number, st: Step[], seed: number, decimals: number, asset: "EUR/USD" | "XAU/USD", levels: number[] = []) =>
  () => buildCandles(open, st, { seed, decimals, asset, session: "Londres", volatility: "normale", levels, pins: pinAll(st) });
// Multi-UT 2 bloc 2 — XAU/USD H4 : chutes agressives de 35 à 40 $, corrections lentes,
// rejets systématiques sous 4 680 $.
const DIR_DOM: Step[] = [
  { c: 4676, h: 4679, l: 4669 }, { c: 4656, h: 4677, l: 4653 }, { c: 4638, h: 4657, l: 4635 },
  { c: 4643, h: 4645, l: 4636 }, { c: 4647, h: 4649, l: 4642 }, { c: 4652, h: 4654, l: 4646 }, { c: 4656, h: 4666, l: 4650 },
  { c: 4637, h: 4657, l: 4634 }, { c: 4619, h: 4639, l: 4616 },
  { c: 4623, h: 4625, l: 4617 }, { c: 4627, h: 4629, l: 4621 }, { c: 4632, h: 4634, l: 4626 }, { c: 4635, h: 4645, l: 4630 },
  { c: 4616, h: 4636, l: 4613 }, { c: 4600, h: 4618, l: 4597 }, { c: 4604, h: 4606, l: 4598 },
];
// Multi-UT 2 bloc 3 et plan — EUR/USD H4 : zone de résistance 1.1750-1.1760 (résistance
// Daily/H4 1.1760), rejets répétés sous la résistance, prix actuel 1.1715.
const HTF_FILTER: Step[] = [
  { c: 1.1792, h: 1.1804, l: 1.1788 }, { c: 1.1778, h: 1.1795, l: 1.1775 }, { c: 1.1762, h: 1.1780, l: 1.1758 }, { c: 1.1744, h: 1.1764, l: 1.1740 },
  { c: 1.1752, h: 1.1755, l: 1.1742 }, { c: 1.1749, h: 1.1759, l: 1.1745 }, { c: 1.1753, h: 1.1755, l: 1.1747 }, { c: 1.1746, h: 1.1760, l: 1.1743 },
  { c: 1.1736, h: 1.1748, l: 1.1733 }, { c: 1.1728, h: 1.1738, l: 1.1724 }, { c: 1.1741, h: 1.1743, l: 1.1726 }, { c: 1.1738, h: 1.1758, l: 1.1736 },
  { c: 1.1731, h: 1.1746, l: 1.1728 }, { c: 1.1722, h: 1.1733, l: 1.1719 }, { c: 1.1715, h: 1.1725, l: 1.1712 },
];
// Multi-UT 3 bloc 2 — XAU/USD H1 : impulsion baissière brutale depuis 4 680 $, FVG 4 648-4 660 $,
// remontée progressive, mèche qui traverse partiellement le FVG, rejet fort vers le bas.
const RETOUR_DESEQ: Step[] = [
  { c: 4679, h: 4680, l: 4673 }, { c: 4664, h: 4680, l: 4660 }, { c: 4632, h: 4664, l: 4628 }, { c: 4622, h: 4648, l: 4618 },
  { c: 4626, h: 4629, l: 4619 }, { c: 4630, h: 4633, l: 4624 }, { c: 4634, h: 4637, l: 4628 }, { c: 4639, h: 4642, l: 4632 },
  { c: 4643, h: 4646, l: 4637 }, { c: 4647, h: 4647, l: 4641 }, { c: 4651, h: 4655, l: 4645 },
  { c: 4636, h: 4657, l: 4634 }, { c: 4625, h: 4637, l: 4622 }, { c: 4616, h: 4627, l: 4613 },
];
// Multi-UT 3 bloc 3 et Multi-UT 5 bloc 3 (fusion ScenarioZone + H1ZonePreparation) — EUR/USD H1 :
// support 1.1760, chute qui le casse et laisse un FVG 1.1750-1.1760, puis remontée progressive
// avec des bougies haussières de plus en plus courtes et des corrections de plus en plus longues,
// jusqu'au bas de la zone.
const ZONE_PREP: Step[] = [
  { c: 1.1768, h: 1.1774, l: 1.1762 }, { c: 1.1765, h: 1.1770, l: 1.1761 }, { c: 1.1769, h: 1.1772, l: 1.1762 }, { c: 1.1763, h: 1.1770, l: 1.1760 },
  { c: 1.1738, h: 1.1763, l: 1.1735 }, { c: 1.1728, h: 1.1750, l: 1.1724 }, { c: 1.1720, h: 1.1730, l: 1.1716 },
  // remontée : corps haussiers 11, 9, 7, 6, 5, 4 pips ; corrections de plus en plus longues : 3 pips (1 bougie),
  // 5 pips (2 bougies), 6 pips (2 bougies)
  { c: 1.1731, h: 1.1733, l: 1.1718 }, { c: 1.1728, h: 1.1732, l: 1.1726 },
  { c: 1.1737, h: 1.1739, l: 1.1727 }, { c: 1.1735, h: 1.1738, l: 1.1733 }, { c: 1.1732, h: 1.1736, l: 1.1730 },
  { c: 1.1739, h: 1.1741, l: 1.1731 }, { c: 1.1736, h: 1.1740, l: 1.1734 }, { c: 1.1733, h: 1.1737, l: 1.1731 },
  { c: 1.1739, h: 1.1741, l: 1.1732 }, { c: 1.1744, h: 1.1746, l: 1.1738 }, { c: 1.1748, h: 1.1751, l: 1.1743 },
];
// Multi-UT 4 bloc 1 et Multi-UT 5 bloc 4 (fusion ConfirmationM5 + M15Validation) — EUR/USD :
// arrivée dans la zone 1.1750-1.1760, trois mèches hautes (1.1764, 1.1767, 1.1770) sans clôture
// au-dessus de la zone, creux local 1.1748 entre les rejets, trois bougies baissières qui le cassent
// vers 1.1745, retour du prix à 1.1758 (entrée short), SL 1.1772, TP 1.1695.
const LTF_CONFIRM: Step[] = [
  { c: 1.1742, h: 1.1744, l: 1.1737 }, { c: 1.1747, h: 1.1749, l: 1.1740 }, { c: 1.1752, h: 1.1754, l: 1.1745 },
  { c: 1.1755, h: 1.1764, l: 1.1750 }, { c: 1.1752, h: 1.1767, l: 1.1748 }, { c: 1.1754, h: 1.1770, l: 1.1750 },
  { c: 1.1751, h: 1.1756, l: 1.1749 }, { c: 1.1747, h: 1.1752, l: 1.1746 }, { c: 1.1745, h: 1.1748, l: 1.1743 },
  { c: 1.1752, h: 1.1753, l: 1.1744 }, { c: 1.1757, h: 1.1759, l: 1.1751 },
  { c: 1.1746, h: 1.1758, l: 1.1744 }, { c: 1.1737, h: 1.1747, l: 1.1735 }, { c: 1.1729, h: 1.1738, l: 1.1726 },
];
Object.assign(SCENARIOS, {
  "dir-dom-xau": authored(4672, DIR_DOM, 21101, 0, "XAU/USD", [4680]),
  "htf-filter-h4": authored(1.1800, HTF_FILTER, 21201, 5, "EUR/USD", [1.1760]),
  "retour-deseq-xau": authored(4676, RETOUR_DESEQ, 21301, 0, "XAU/USD", [4648, 4660]),
  "zone-prep-h1": authored(1.1772, ZONE_PREP, 21401, 5, "EUR/USD", [1.1750, 1.1760]),
  "ltf-confirm": authored(1.1738, LTF_CONFIRM, 21501, 5, "EUR/USD", [1.1748, 1.1760, 1.1772]),
});

// ─── Lot 22 ──────────────────────────────────────────────────────────────────
// Price action 1 bloc 2 — les 4 types de bougies, chacun dans un court contexte (XAU/USD H1) :
// marubozu dans une impulsion, pin bar sur un creux, doji au sommet, engulfing haussier.
const PA_TYPES: Record<string, Step[]> = {
  marubozu: [{ c: 4604, h: 4607, l: 4598 }, { c: 4601, h: 4606, l: 4597 }, { c: 4605, h: 4608, l: 4599 }, { c: 4603, h: 4607, l: 4600 }, { c: 4628, h: 4628, l: 4603 }, { c: 4632, h: 4635, l: 4626 }],
  pinbar: [{ c: 4596, h: 4602, l: 4593 }, { c: 4590, h: 4598, l: 4587 }, { c: 4584, h: 4592, l: 4581 }, { c: 4588, h: 4589, l: 4566 }, { c: 4595, h: 4597, l: 4586 }, { c: 4600, h: 4603, l: 4593 }],
  doji: [{ c: 4606, h: 4608, l: 4598 }, { c: 4614, h: 4616, l: 4605 }, { c: 4622, h: 4624, l: 4612 }, { c: 4623, h: 4632, l: 4614 }, { c: 4616, h: 4625, l: 4613 }, { c: 4610, h: 4618, l: 4607 }],
  engulfing: [{ c: 4596, h: 4602, l: 4593 }, { c: 4590, h: 4598, l: 4587 }, { c: 4585, h: 4592, l: 4582 }, { c: 4580, h: 4587, l: 4577 }, { c: 4597, h: 4599, l: 4578 }, { c: 4602, h: 4605, l: 4595 }],
};
const paTypes = Object.fromEntries(Object.entries(PA_TYPES).map(([k, st], n) => [`pa-type-${k}`, authored(k === "pinbar" || k === "engulfing" ? 4600 : 4600, st, 22100 + n, 0, "XAU/USD")]));
// Price action 2 bloc 1 — valider une pin bar : même descente vers le support 4 500 $ (XAU/USD H4),
// puis 4 bougies candidates, chacune ne ratant qu'un critère du texte (la 1re les remplit tous) ;
// la 4e est une pin bar parfaite en milieu de range, loin de tout niveau.
const PIN_CTX: Step[] = [{ c: 4552, h: 4560, l: 4548 }, { c: 4541, h: 4554, l: 4537 }, { c: 4533, h: 4544, l: 4529 }, { c: 4524, h: 4535, l: 4520 }, { c: 4516, h: 4527, l: 4512 }];
const PIN_RANGE: Step[] = [{ c: 4592, h: 4598, l: 4584 }, { c: 4583, h: 4594, l: 4580 }, { c: 4590, h: 4596, l: 4581 }, { c: 4584, h: 4593, l: 4580 }, { c: 4586, h: 4592, l: 4579 }];
const PIN_CASES: Record<string, [Step[], number, Step]> = {
  valide: [PIN_CTX, 4560, { c: 4522, h: 4524, l: 4496 }],
  ratio: [PIN_CTX, 4560, { c: 4528, h: 4530, l: 4500 }],
  cloture: [PIN_CTX, 4560, { c: 4512, h: 4536, l: 4494 }],
  niveau: [PIN_RANGE, 4588, { c: 4592, h: 4594, l: 4566 }],
};
const pinCases = Object.fromEntries(Object.entries(PIN_CASES).map(([k, [ctx, open, last]], n) => [`pin-case-${k}`, authored(open, [...ctx, last], 22200 + n, 0, "XAU/USD")]));
// Price action 3 bloc 2 — valider un engulfing : mêmes 20 bougies de contexte vers le support,
// puis une paire rouge + verte ; seule la 1re respecte les 4 critères du texte.
const ENG_CTX: Step[] = [
  { c: 4596, h: 4602, l: 4592 }, { c: 4599, h: 4603, l: 4593 }, { c: 4593, h: 4601, l: 4590 }, { c: 4590, h: 4596, l: 4586 }, { c: 4594, h: 4597, l: 4588 },
  { c: 4588, h: 4596, l: 4585 }, { c: 4584, h: 4590, l: 4580 }, { c: 4587, h: 4590, l: 4581 }, { c: 4581, h: 4589, l: 4578 }, { c: 4577, h: 4583, l: 4573 },
  { c: 4580, h: 4583, l: 4574 }, { c: 4574, h: 4582, l: 4571 }, { c: 4570, h: 4576, l: 4566 }, { c: 4573, h: 4576, l: 4567 }, { c: 4567, h: 4575, l: 4564 },
  { c: 4563, h: 4569, l: 4559 }, { c: 4566, h: 4569, l: 4560 }, { c: 4560, h: 4568, l: 4557 }, { c: 4556, h: 4562, l: 4552 }, { c: 4554, h: 4558, l: 4550 },
];
const ENG_CASES: Record<string, Step[]> = {
  valide: [{ c: 4546, h: 4555, l: 4542 }, { c: 4562, h: 4564, l: 4540 }],
  partiel: [{ c: 4542, h: 4555, l: 4538 }, { c: 4549, h: 4551, l: 4537 }],
  contraste: [{ c: 4534, h: 4556, l: 4531 }, { c: 4555, h: 4557, l: 4532 }],
  amplitude: [{ c: 4552, h: 4555, l: 4551 }, { c: 4556, h: 4557, l: 4551 }],
};
const engCases = Object.fromEntries(Object.entries(ENG_CASES).map(([k, pair], n) => [`eng-case-${k}`, authored(4600, [...ENG_CTX, ...pair], 22300 + n, 0, "XAU/USD")]));
// Multi-UT 4 bloc 3 — une zone peut échouer (XAU/USD M5) : support H1 attendu à 4 545 $ (bande
// 4 540-4 550), le prix arrive et traverse la bande sans mèche basse de rejet, continuation nette.
const ZONE_FAIL: Step[] = [
  { c: 4578, h: 4582, l: 4575 }, { c: 4572, h: 4579, l: 4570 }, { c: 4566, h: 4573, l: 4565 }, { c: 4560, h: 4567, l: 4559 }, { c: 4554, h: 4561, l: 4553 },
  { c: 4547, h: 4555, l: 4546 }, { c: 4539, h: 4548, l: 4538 }, { c: 4531, h: 4540, l: 4530 }, { c: 4524, h: 4532, l: 4523 }, { c: 4517, h: 4525, l: 4516 }, { c: 4512, h: 4518, l: 4510 },
];
// Multi-UT 5 bloc 2 — le Daily donne la direction (EUR/USD) : sommet 1.1905, puis trois LH
// consécutifs 1.1860 (résistance), 1.1830 et 1.1780, impulsions baissières franches entre chaque
// correction, LL 1.1760 puis 1.1695 (dernier LL, objectif du plan), prix ~1.1745.
// Bougies complètes à partir des clôtures : mèches courtes régulières (w), extrêmes imposés gardés.
const bars = (open: number, st: (number | Step)[], w: number, decimals: number): Step[] => {
  let o = open;
  const r = (x: number) => Number(x.toFixed(decimals));
  return st.map((x) => {
    const k = typeof x === "number" ? { c: x } : x;
    const top = Math.max(o, k.c), bot = Math.min(o, k.c);
    const out = { c: k.c, h: k.h ?? r(top + w), l: k.l ?? r(bot - w) };
    o = k.c;
    return out;
  });
};
const DAILY_CTX = bars(1.1878, [
  1.1888, { c: 1.1898, h: 1.1905 }, 1.1880, 1.1852, 1.1826, { c: 1.1806, l: 1.1800 }, 1.1822, 1.1840, { c: 1.1854, h: 1.1860 },
  1.1832, 1.1804, 1.1778, { c: 1.1766, l: 1.1760 }, 1.1782, 1.1806, { c: 1.1822, h: 1.1830 },
  1.1796, 1.1762, 1.1728, { c: 1.1704, l: 1.1695 }, 1.1722, 1.1748, 1.1768, { c: 1.1774, h: 1.1780 }, 1.1758, 1.1745,
], 0.0005, 5);
Object.assign(SCENARIOS, paTypes, pinCases, engCases, {
  "zone-fail-xau": authored(4583, ZONE_FAIL, 22401, 0, "XAU/USD", [4540, 4550]),
  "daily-ctx": authored(1.1878, DAILY_CTX, 22501, 5, "EUR/USD", [1.1860, 1.1695]),
});

// ─── Lot 23 ──────────────────────────────────────────────────────────────────
// Intermédiaire 7 — la même paire, trois unités de temps (EUR/USD) : Daily en escalier depuis
// 3 semaines (HH / HL, dernier HL 1.0850, HH 1.0960) ; H4 : recul jusqu'à 1.0850 (dernier HL) ;
// M15 : pin bar haussière au contact de la zone.
const L7_DAILY = bars(1.0700, [
  1.0718, 1.0742, 1.0768, { c: 1.0792, h: 1.0800 }, 1.0778, { c: 1.0766, l: 1.0760 }, { c: 1.0790, l: 1.0764 }, 1.0822, 1.0856, { c: 1.0892, h: 1.0900, l: 1.0853 },
  1.0878, { c: 1.0858, l: 1.0850 }, { c: 1.0884, l: 1.0855 }, 1.0918, { c: 1.0952, h: 1.0960 }, 1.0932, 1.0906,
], 0.0006, 5);
const L7_H4 = bars(1.0958, [
  { c: 1.0950, h: 1.0960 }, 1.0938, 1.0930, 1.0941, 1.0924, 1.0910, 1.0918, 1.0901, 1.0889, 1.0894, 1.0878, 1.0866, 1.0872, 1.0859, { c: 1.0857, l: 1.0850 },
], 0.0005, 5);
const L7_M15 = bars(1.0872, [
  1.0869, 1.0865, 1.0867, 1.0862, 1.0859, 1.0861, 1.0856, { c: 1.0857, l: 1.0852 }, { c: 1.0861, h: 1.0862, l: 1.0848 }, 1.0866, 1.0871,
], 0.0002, 5);
// Price action 3 bloc 3 — engulfing isolé en pleine impulsion (XAU/USD H4) : aucun niveau, simple bruit.
const ENG_ISOLATED = bars(4560, [4568, 4579, 4591, 4602, { c: 4598, h: 4606 }, { c: 4612, l: 4596 }, 4624, 4636, 4647, 4659], 3, 0);
Object.assign(SCENARIOS, {
  "l7-daily": authored(1.0700, L7_DAILY, 23101, 5, "EUR/USD", [1.0850]),
  "l7-h4": authored(1.0958, L7_H4, 23102, 5, "EUR/USD", [1.0850]),
  "l7-m15": authored(1.0872, L7_M15, 23103, 5, "EUR/USD", [1.0850]),
  "eng-isolated": authored(4560, ENG_ISOLATED, 23201, 0, "XAU/USD"),
});

// ─── Lot 24 ──────────────────────────────────────────────────────────────────
// Reversal 1 — double top EUR/USD H1 (exemple et plan du texte) : tendance haussière HH / HL,
// sommet 1.1880, ligne de cou 1.1800, 2e sommet 1.1895, clôture sous la ligne de cou à 1.1795.
const DT_EUR = bars(1.1730, [
  1.1746, { c: 1.1740, l: 1.1735 }, 1.1758, 1.1775, { c: 1.1768, l: 1.1762 }, 1.1790, 1.1812, 1.1836, 1.1858, { c: 1.1872, h: 1.1880 },
  1.1858, 1.1836, 1.1816, { c: 1.1806, l: 1.1800 }, 1.1824, 1.1848, 1.1870, { c: 1.1886, h: 1.1895 }, 1.1866, 1.1846, { c: 1.1826, l: 1.1822 }, { c: 1.1830, h: 1.1832 }, 1.1812, { c: 1.1795, h: 1.1814 },
], 0.0004, 5);
// Les autres cas de la grille de validation : même fin de pattern, un seul critère manquant.
const DT_RANGE = bars(1.1840, [
  1.1822, 1.1840, { c: 1.1852, h: 1.1856 }, 1.1836, { c: 1.1818, l: 1.1812 }, 1.1834, { c: 1.1848, h: 1.1851 }, 1.1832, { c: 1.1818, l: 1.1814 }, 1.1838, 1.1858, { c: 1.1872, h: 1.1880 },
  1.1858, 1.1836, 1.1816, { c: 1.1806, l: 1.1800 }, 1.1824, 1.1848, 1.1870, { c: 1.1886, h: 1.1895 }, 1.1868, 1.1842, 1.1820, 1.1808, { c: 1.1795, h: 1.1812 },
], 0.0004, 5);
const DT_GAP = bars(1.1730, [
  1.1746, { c: 1.1740, l: 1.1735 }, 1.1758, 1.1775, { c: 1.1768, l: 1.1762 }, 1.1790, 1.1812, 1.1836, 1.1858, { c: 1.1872, h: 1.1880 },
  1.1858, 1.1836, 1.1816, { c: 1.1806, l: 1.1800 }, 1.1830, 1.1860, 1.1890, { c: 1.1912, h: 1.1925 }, 1.1890, 1.1858, 1.1828, 1.1810, { c: 1.1795, h: 1.1814 },
], 0.0004, 5);
const DT_WICK = bars(1.1730, [
  1.1746, { c: 1.1740, l: 1.1735 }, 1.1758, 1.1775, { c: 1.1768, l: 1.1762 }, 1.1790, 1.1812, 1.1836, 1.1858, { c: 1.1872, h: 1.1880 },
  1.1858, 1.1836, 1.1816, { c: 1.1806, l: 1.1800 }, 1.1824, 1.1848, 1.1870, { c: 1.1886, h: 1.1895 }, 1.1868, 1.1842, 1.1820, 1.1808, { c: 1.1806, h: 1.1812, l: 1.1788 },
], 0.0004, 5);
// Reversal 1 — double bottom XAU/USD H1 : baisse depuis 2 jours, support 4 480, ligne de cou 4 520,
// 2e creux 4 478 rejeté, clôture au-dessus de 4 520.
const DB_XAU = bars(4572, [
  4562, 4550, { c: 4555, h: 4560 }, 4540, 4524, 4507, 4494, { c: 4486, l: 4480 }, 4498, 4510, { c: 4516, h: 4520 },
  4506, 4494, { c: 4486, l: 4478 }, 4498, 4510, { c: 4527, l: 4508 },
], 3, 0);
// Reversal 2 — ETE inversé XAU/USD H1 : épaule gauche 4 470, sommet 4 510, tête 4 430, sommet 4 515,
// épaule droite 4 475, clôture au-dessus de 4 515.
const IHS_XAU = bars(4530, [
  4520, 4506, 4492, { c: 4476, l: 4470 }, 4488, { c: 4504, h: 4510 }, 4486, 4466, 4448, { c: 4438, l: 4430 }, 4456, 4478, 4498, { c: 4510, h: 4515 },
  4500, 4488, { c: 4480, l: 4475 }, 4492, 4505, { c: 4522, l: 4503 },
], 3, 0);
// Reversal 3 — divergence baissière XAU/USD H1 (exemple du texte) : sommet 4 600 (RSI 75), creux
// 4 570, nouveau sommet 4 640 (HH, RSI 68). Montées en marches (+15 / −5 puis +12 / −5) réglées
// pour que le RSI 14 calculé sur les clôtures vaille 75 puis 68.
const rsiDivCloses = () => {
  const cl: number[] = []; let x = 4450;
  for (;;) { const up = x + 15; if (up >= 4600) { cl.push(4600); break; } cl.push(up); x = up - 5; cl.push(x); }
  cl.push(4590, 4578, 4570); x = 4570;
  for (;;) { const up = x + 12; if (up >= 4640) { cl.push(4640); break; } cl.push(up); x = up - 5; cl.push(x); }
  cl.push(4632, 4626);
  return cl;
};
// Sommets : clôture 2 $ sous l'extrême (mèche jusqu'à 4 600 / 4 640), creux : clôture 4 572, mèche
// 4 570 ; les bougies voisines restent strictement sous les sommets et au-dessus du creux.
const RSI_DIV = (() => {
  const cl0 = rsiDivCloses();
  const t1 = cl0.indexOf(4600), t2 = cl0.indexOf(4640), b = cl0.indexOf(4570, t1);
  const cl = cl0.map((v, i) => (i === t1 || i === t2 ? v - 2 : i === b ? 4572 : v));
  const st = bars(4450, cl.map((v, i): number | Step => (i === t1 ? { c: v, h: 4600 } : i === t2 ? { c: v, h: 4640 } : i === b ? { c: v, l: 4570 } : v)), 3, 0);
  let o = 4450;
  return st.map((k, i) => {
    const out = { ...k }, top = Math.max(o, k.c), bot = Math.min(o, k.c);
    for (const [t, hi] of [[t1, 4600], [t2, 4640]]) if (i !== t && Math.abs(i - t) <= 3) out.h = Math.max(top, Math.min(out.h!, hi - 1));
    if (i !== b && Math.abs(i - b) <= 3) out.l = Math.min(bot, Math.max(out.l!, 4571));
    o = k.c;
    return out;
  });
})();
Object.assign(SCENARIOS, {
  "dt-eur": authored(1.1730, DT_EUR, 24101, 5, "EUR/USD", [1.1800]),
  "dt-range": authored(1.1840, DT_RANGE, 24102, 5, "EUR/USD", [1.1800]),
  "dt-gap": authored(1.1730, DT_GAP, 24103, 5, "EUR/USD", [1.1800]),
  "dt-wick": authored(1.1730, DT_WICK, 24104, 5, "EUR/USD", [1.1800]),
  "db-xau": authored(4572, DB_XAU, 24105, 0, "XAU/USD", [4520]),
  "ihs-xau": authored(4530, IHS_XAU, 24201, 0, "XAU/USD"),
  "rsi-div": authored(4450, RSI_DIV, 24301, 0, "XAU/USD"),
});

// ─── Lot 25 ──────────────────────────────────────────────────────────────────
// Reversal 4 cas 1 — le double top EUR/USD H1 (short 1.1795) s'invalide : baisse à 1.1780 en deux
// bougies, puis bougie haussière large qui les englobe et re-clôture à 1.1810, au-dessus de la ligne de cou.
const INV_EUR = [...DT_EUR, { c: 1.1788, h: 1.1796, l: 1.1784 }, { c: 1.1782, h: 1.1790, l: 1.1780 }, { c: 1.1810, h: 1.1812, l: 1.1781 }];
// Intermédiaire 1 / SMC 2 / Trend-following 4 — structure haussière EUR/USD H4 : HL 1.0880, HH 1.0950 ;
// BOS : repli (HL 1.0905) puis clôture au-dessus de 1.0950 (+17 pips) sans réintégration ;
// CHoCH : depuis 1.0950, chute qui clôture sous le dernier HL 1.0880.
const STRUCT_EUR: (number | Step)[] = [
  1.0812, 1.0826, { c: 1.0838, h: 1.0845 }, 1.0832, { c: 1.0824, l: 1.0820 }, { c: 1.0838, l: 1.0823 }, 1.0858, 1.0884, { c: 1.0902, h: 1.0910, l: 1.0882 },
  { c: 1.0898, h: 1.0907 }, { c: 1.0886, l: 1.0880 }, { c: 1.0898, l: 1.0883 }, 1.0916, 1.0934, { c: 1.0944, h: 1.0950 },
];
const BOS_EUR = bars(1.0800, [...STRUCT_EUR, { c: 1.0938, h: 1.0947 }, 1.0922, { c: 1.0910, l: 1.0905 }, { c: 1.0924, l: 1.0908 }, 1.0940, { c: 1.0967, l: 1.0938 }, 1.0975, 1.0984, 1.0977, 1.0991], 0.0004, 5);
const CHOCH_EUR = bars(1.0800, [...STRUCT_EUR, { c: 1.0936, h: 1.0947 }, 1.0918, 1.0900, { c: 1.0872, h: 1.0902 }, 1.0864, { c: 1.0874, l: 1.0861 }], 0.0004, 5);
Object.assign(SCENARIOS, {
  "inv-eur": authored(1.1730, INV_EUR, 25101, 5, "EUR/USD", [1.1800]),
  "bos-eur": authored(1.0800, BOS_EUR, 25201, 5, "EUR/USD", [1.0950]),
  "choch-eur": authored(1.0800, CHOCH_EUR, 25202, 5, "EUR/USD", [1.0880]),
});

// ─── Lot 26 ──────────────────────────────────────────────────────────────────
// SMC 2 / Trend-following 4 — faux BOS : même structure EUR/USD H4 (HH 1.0950), la mèche perce
// 1.0950 mais la bougie clôture en dessous, puis le prix réintègre et baisse (prise de liquidité).
const BOS_FAKE = bars(1.0800, [...STRUCT_EUR, { c: 1.0938, h: 1.0947 }, 1.0926, { c: 1.0918, l: 1.0912 }, { c: 1.0930, l: 1.0915 }, 1.0944,
  { c: 1.0946, h: 1.0962, l: 1.0940 }, { c: 1.0928, h: 1.0948 }, 1.0915, 1.0904], 0.0004, 5);
// SMC 3 — OB mitigé : même OB haussier (mêmes bougies jusqu'au HH 1.1810), puis le prix retraverse
// tout le corps (clôture 1.1736 sous 1.1745) : ordres consommés.
const OB_MITIGATED: Step[] = [
  ...SMC_OB_PRE,
  { c: 1.1801, h: 1.1809, l: 1.1797 }, { c: 1.1788, h: 1.1803, l: 1.1785 }, { c: 1.1774, h: 1.1791, l: 1.1771 },
  { c: 1.1760, h: 1.1777, l: 1.1757 }, { c: 1.1749, h: 1.1763, l: 1.1746 }, { c: 1.1736, h: 1.1752, l: 1.1732 },
  { c: 1.1742, h: 1.1746, l: 1.1731 }, { c: 1.1737, h: 1.1745, l: 1.1733 },
];
// SMC 4 / Avancé 1 — pools de liquidité (EUR/USD H1) : range avec equal highs 1.0900 et equal
// lows 1.0840 ; stops des vendeurs au-dessus (BSL), des acheteurs en dessous (SSL).
const LIQ_POOLS = bars(1.0862, [
  1.0874, 1.0888, { c: 1.0896, h: 1.0900 }, 1.0884, 1.0868, 1.0852, { c: 1.0846, l: 1.0840 }, 1.0858, 1.0874, 1.0887, { c: 1.0894, h: 1.0900 },
  1.0882, 1.0866, 1.0853, { c: 1.0845, l: 1.0840 }, 1.0856, 1.0866,
], 0.0003, 5);
Object.assign(SCENARIOS, {
  "bos-fake": authored(1.0800, BOS_FAKE, 26101, 5, "EUR/USD", [1.0950]),
  "ob-mitigated": authored(1.1722, OB_MITIGATED, 26201, 5, "EUR/USD", [1.1745]),
  "liq-pools": authored(1.0862, LIQ_POOLS, 26301, 5, "EUR/USD", [1.0900, 1.0840]),
});

// ─── Lot 27 ──────────────────────────────────────────────────────────────────
// SMC 4 / SMC 5 — EUR/USD H4 : accumulation 1.1700-1.1750, equal highs 1.1760, bougie qui perce
// 1.1760 (mèche 1.1765) et clôture à 1.1745 sans mèche basse, impulsion baissière (corps 27 pips,
// plus de 2 fois la moyenne des 10 précédentes), FVG
// 1.1735-1.1745, retour dans le FVG (entrée 1.1745), puis la SSL sous 1.1700.
const SMC4_SWEEP = bars(1.1705, [
  1.1712, 1.1728, 1.1742, { c: 1.1748, h: 1.1760 }, 1.1734, 1.1718, { c: 1.1708, l: 1.1702 }, 1.1722, 1.1737, { c: 1.1746, h: 1.1760 },
  1.1733, 1.1724, 1.1738, 1.1749,
  { c: 1.1745, h: 1.1765, l: 1.1745 }, { c: 1.1718, h: 1.1745, l: 1.1716 }, { c: 1.1712, h: 1.1735, l: 1.1708 },
  1.1718, 1.1728, { c: 1.1736, h: 1.1745 }, 1.1720, 1.1708, { c: 1.1702, l: 1.1698 },
], 0.0004, 5);
// Avancé 2 / SMC 4 — FVG haussier et baissier génériques : B1, B2 (impulsion), B3, gap entre la
// mèche de B1 et celle de B3, retour du prix dans la zone puis reprise.
const FVG_BULL = bars(1.0800, [1.0794, 1.0801, { c: 1.0812, h: 1.0816 }, { c: 1.0846, l: 1.0810, h: 1.0848 }, { c: 1.0852, l: 1.0828 }, 1.0856, 1.0846, 1.0836, { c: 1.0830, l: 1.0824 }, 1.0842, 1.0858], 0.0003, 5);
const FVG_BEAR = bars(1.0860, [1.0866, 1.0859, { c: 1.0848, l: 1.0844 }, { c: 1.0814, h: 1.0850, l: 1.0812 }, { c: 1.0808, h: 1.0832 }, 1.0804, 1.0814, 1.0824, { c: 1.0830, h: 1.0836 }, 1.0818, 1.0802], 0.0003, 5);
// Support / résistance 1 — niveau fort (4 touches franches, rebonds de 35-45 $) vs niveau faible
// (2 touches molles, rebonds de 8-10 $), support 4 500 $ (XAU/USD H4).
const SR_STRONG = bars(4560, [
  4544, 4528, 4514, { c: 4506, l: 4500 }, 4520, 4536, { c: 4545, h: 4548 }, 4530, 4515, { c: 4507, l: 4501 }, 4523, 4540, { c: 4546, h: 4549 },
  4532, 4516, { c: 4508, l: 4500 }, 4524, { c: 4541, h: 4544 }, 4527, { c: 4513, l: 4511 }, { c: 4506, l: 4501 }, 4521, 4538,
], 3, 0);
const SR_WEAK = bars(4560, [4548, 4535, 4522, { c: 4512, l: 4511 }, { c: 4506, h: 4512, l: 4502 }, { c: 4511, l: 4505 }, { c: 4512, h: 4513, l: 4511 }, { c: 4505, h: 4512, l: 4503 }, { c: 4510, h: 4511, l: 4504 }, { c: 4507, h: 4512, l: 4505 }, 4496, 4486], 3, 0);
// Support / résistance 1 — zone ou ligne : trois creux 1.1685 / 1.1688 / 1.1690 avec mèches ;
// tracés une fois en ligne fine (1.1690), une fois en zone 1.1680-1.1695 (EUR/USD H4).
const ZONE_LINE = bars(1.1735, [
  1.1722, 1.1708, 1.1696, { c: 1.1694, l: 1.1685 }, 1.1706, 1.1718, { c: 1.1724, h: 1.1728 }, 1.1712, 1.1700, { c: 1.1697, l: 1.1688 },
  1.1709, 1.1721, { c: 1.1727, h: 1.1730 }, 1.1714, 1.1701, { c: 1.1698, l: 1.1690 }, 1.1711, 1.1724,
], 0.0003, 5);
Object.assign(SCENARIOS, {
  "smc4-sweep": authored(1.1705, SMC4_SWEEP, 27101, 5, "EUR/USD", [1.1760]),
  "fvg-bull": authored(1.0800, FVG_BULL, 27201, 5, "EUR/USD"),
  "fvg-bear": authored(1.0860, FVG_BEAR, 27202, 5, "EUR/USD"),
  "sr-strong": authored(4560, SR_STRONG, 27301, 0, "XAU/USD", [4500]),
  "sr-weak": authored(4560, SR_WEAK, 27302, 0, "XAU/USD", [4500]),
  "zone-line": authored(1.1735, ZONE_LINE, 27401, 5, "EUR/USD"),
});

// ─── Lot 28 ──────────────────────────────────────────────────────────────────
// Support / résistance 3 — flip raté (EUR/USD H4) : résistance 1.1850 touchée 3 fois, breakout
// clôturé à 1.1872, retest acheté à 1.1858, puis retour sous 1.1850 en 3 bougies : flip invalidé,
// le SL 1.1830 (de l'autre côté de la zone) borne la perte.
const FLIP_FAIL = bars(1.1790, [
  1.1806, 1.1822, 1.1838, { c: 1.1846, h: 1.1850 }, 1.1832, 1.1818, 1.1830, 1.1841, { c: 1.1845, h: 1.1850 }, 1.1834, 1.1826, 1.1838, { c: 1.1846, h: 1.1850 },
  1.1856, { c: 1.1872, l: 1.1852 }, 1.1866, { c: 1.1858, h: 1.1867, l: 1.1852 }, 1.1849, { c: 1.1838, h: 1.1852 }, { c: 1.1826, l: 1.1822 },
], 0.0003, 5);
// Intermédiaire 6 — fake breakouts EUR/USD H1 : résistance 1.0950, mèche jusqu'à 1.0965 et clôture
// sous 1.0950 (acheteurs piégés) ; support 1.0850, mèche jusqu'à 1.0840 et clôture au-dessus (vendeurs piégés).
const FAKE_UP = bars(1.0905, [1.0916, 1.0928, { c: 1.0943, h: 1.0948 }, 1.0934, 1.0926, 1.0938, { c: 1.0946, h: 1.0949 }, { c: 1.0944, h: 1.0965, l: 1.0940 }, 1.0928, 1.0914, 1.0902], 0.0003, 5);
const FAKE_DOWN = bars(1.0895, [1.0884, 1.0872, { c: 1.0857, l: 1.0852 }, 1.0866, 1.0874, 1.0862, { c: 1.0854, l: 1.0851 }, { c: 1.0856, h: 1.0860, l: 1.0840 }, 1.0872, 1.0886, 1.0898], 0.0003, 5);
// Support / résistance 4 (plan) — XAU/USD H1 : résistance 4 650 touchée 3 fois, bougie 1 mèche 4 680
// et clôture 4 655 (corps 5 $), bougie 2 clôture 4 640 : short 4 640, SL 4 685, TP 4 540.
const FAKE_SR4 = bars(4598, [
  4610, 4624, 4638, { c: 4645, h: 4650 }, 4632, 4620, 4614, 4626, 4639, { c: 4646, h: 4650 }, 4634, 4625, 4636, { c: 4644, h: 4650 },
  { c: 4650, h: 4652, l: 4641 }, { c: 4655, h: 4680, l: 4648 }, { c: 4640, h: 4657, l: 4637 }, 4626, 4612, 4598,
], 3, 0);
// Support / résistance 4 bloc 3 — chasse aux stops (XAU/USD H1) : résistance 4 720, cluster de stops
// 4 720-4 745, mèche jusqu'à 4 740 qui déclenche les stops, clôture sous 4 720, continuation baissière.
const HUNT_SR4 = bars(4668, [
  4680, 4694, 4708, { c: 4715, h: 4720 }, 4702, 4690, 4699, 4710, { c: 4716, h: 4720 }, 4703, 4696, 4706, 4714,
  { c: 4712, h: 4740, l: 4708 }, { c: 4694, h: 4713 }, 4680, 4668, 4659,
], 3, 0);
Object.assign(SCENARIOS, {
  "flip-fail": authored(1.1790, FLIP_FAIL, 28101, 5, "EUR/USD", [1.1850]),
  "fake-up-eur": authored(1.0905, FAKE_UP, 28201, 5, "EUR/USD", [1.0950]),
  "fake-down-eur": authored(1.0895, FAKE_DOWN, 28202, 5, "EUR/USD", [1.0850]),
  "fake-sr4": authored(4598, FAKE_SR4, 28203, 0, "XAU/USD", [4650]),
  "hunt-sr4": authored(4668, HUNT_SR4, 28301, 0, "XAU/USD", [4720]),
});

// ─── Lot 29 ──────────────────────────────────────────────────────────────────
// Intermédiaire 4 / Trend-following 1 — les 3 états (EUR/USD H4) : haussière (creux 1.1665, HL 1.1700
// et 1.1730, HH 1.1780 et 1.1810, comme le plan de TF 1), baissière (miroir), range 1.1700-1.1780.
const TREND_UP = bars(1.1690, [
  1.1676, { c: 1.1670, l: 1.1665 }, { c: 1.1690, l: 1.1668 }, 1.1712, 1.1734, { c: 1.1745, h: 1.1750 }, { c: 1.1728, h: 1.1747 }, 1.1712, { c: 1.1706, l: 1.1700 },
  { c: 1.1722, l: 1.1703 }, 1.1746, 1.1765, { c: 1.1775, h: 1.1780 }, { c: 1.1760, h: 1.1777 }, 1.1744, { c: 1.1736, l: 1.1730 }, { c: 1.1752, l: 1.1733 }, 1.1776, 1.1796, { c: 1.1806, h: 1.1810 }, { c: 1.1797, h: 1.1807 },
], 0.0003, 5);
const TREND_DOWN = bars(1.1800, [
  1.1814, { c: 1.1820, h: 1.1825 }, { c: 1.1800, h: 1.1822 }, 1.1778, 1.1756, { c: 1.1745, l: 1.1740 }, { c: 1.1762, l: 1.1743 }, 1.1778, { c: 1.1784, h: 1.1790 },
  { c: 1.1768, h: 1.1787 }, 1.1744, 1.1725, { c: 1.1715, l: 1.1710 }, { c: 1.1730, l: 1.1713 }, 1.1746, { c: 1.1754, h: 1.1760 }, { c: 1.1738, h: 1.1757 }, 1.1714, 1.1694, { c: 1.1684, l: 1.1680 }, { c: 1.1693, l: 1.1683 },
], 0.0003, 5);
const TREND_RANGE = bars(1.1740, [
  1.1752, 1.1766, { c: 1.1774, h: 1.1780 }, 1.1760, 1.1742, 1.1724, { c: 1.1706, l: 1.1700 }, 1.1720, 1.1738, 1.1756, { c: 1.1772, h: 1.1779 }, 1.1758, 1.1740, 1.1718, { c: 1.1707, l: 1.1701 }, 1.1724, 1.1744, 1.1762,
], 0.0003, 5);
// Trend-following 1 bloc 3 — force de tendance : swings d'environ 50, 100 et 200 pips (EUR/USD H4).
const strength = (amp: number) => {
  const st: (number | Step)[] = []; let x = 1.1700;
  for (let k = 0; k < 4; k++) {
    const up = amp / 10000, dn = up * 0.45;
    st.push(Number((x + up * 0.35).toFixed(5)), Number((x + up * 0.7).toFixed(5)), { c: Number((x + up).toFixed(5)), h: Number((x + up + 0.0002).toFixed(5)) });
    st.push(Number((x + up - dn * 0.5).toFixed(5)), { c: Number((x + up - dn).toFixed(5)), l: Number((x + up - dn - 0.0002).toFixed(5)) });
    x = x + up - dn;
  }
  return bars(1.1700, st, 0.0003, 5);
};
const STR_WEAK = strength(50), STR_MID = strength(100), STR_STRONG = strength(200);
// Intermédiaire 9 — Fibonacci sur EUR/USD : impulsion 1.0800 → 1.0980 (pause vers 1.0870 pendant la
// montée = support historique), retracement jusqu'à 1.0870 (61,8 % = 1.0869).
const FIB_INT9 = bars(1.0815, [
  { c: 1.0806, l: 1.0800 }, { c: 1.0826, l: 1.0803 }, 1.0848, 1.0864, { c: 1.0872, h: 1.0876 }, 1.0864, { c: 1.0868, l: 1.0860 }, 1.0886, 1.0908, 1.0931, 1.0955, { c: 1.0972, h: 1.0980 },
  { c: 1.0962, h: 1.0977 }, 1.0946, 1.0928, 1.0910, 1.0894, 1.0881, { c: 1.0874, l: 1.0870 }, { c: 1.0877, l: 1.0871 },
], 0.0003, 5);
// Trend-following 3 bloc 3 — confluence (XAU/USD H4) : support de l'UT supérieure 4 470-4 485,
// impulsion 4 480 → 4 660 avec une bougie baissière (OB 4 532-4 541) au milieu de l'OTE, chute qui
// laisse un FVG baissier au-dessus, retour dans l'OTE sur l'OB, rejet ; cible : le FVG. Avant le creux,
// un vrai sommet 4 558 : l'impulsion qui suit l'OB le casse en clôture (l'OB précède un breakout de structure).
const PB_CONF = bars(4530, [
  { c: 4538, h: 4541, l: 4527 }, { c: 4548, h: 4551, l: 4536 }, { c: 4553, h: 4558, l: 4545 },
  { c: 4532, h: 4555, l: 4529 }, { c: 4515, h: 4534, l: 4512 }, { c: 4500, h: 4517, l: 4497 },
  4492, { c: 4486, l: 4480 }, { c: 4504, l: 4483 }, 4522, { c: 4541, h: 4544 }, { c: 4532, h: 4543, l: 4529 }, { c: 4562, l: 4531 }, 4588, 4612, 4636, { c: 4652, h: 4660 },
  { c: 4646, h: 4657 }, { c: 4634, h: 4648, l: 4630 }, { c: 4598, h: 4634, l: 4596 }, { c: 4588, h: 4612, l: 4584 }, 4576, 4560, { c: 4546, l: 4538 }, { c: 4552, h: 4555, l: 4536 }, 4570,
], 3, 0);
Object.assign(SCENARIOS, {
  "trend-up": authored(1.1690, TREND_UP, 29101, 5, "EUR/USD"),
  "trend-down": authored(1.1800, TREND_DOWN, 29102, 5, "EUR/USD"),
  "trend-range": authored(1.1740, TREND_RANGE, 29103, 5, "EUR/USD", [1.1700, 1.1780]),
  "str-weak": authored(1.1700, STR_WEAK, 29201, 5, "EUR/USD"),
  "str-mid": authored(1.1700, STR_MID, 29202, 5, "EUR/USD"),
  "str-strong": authored(1.1700, STR_STRONG, 29203, 5, "EUR/USD"),
  "fib-int9": authored(1.0815, FIB_INT9, 29301, 5, "EUR/USD"),
  "pb-conf": authored(4530, PB_CONF, 29401, 0, "XAU/USD"),
});
