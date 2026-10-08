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

// ─── Lot 4 ───────────────────────────────────────────────────────────────────

// SMC 2 / SMC 5 — séquence de retournement haussier (EUR/USD H4) : tendance baissière
// (LH 1.1850, 1.1820), CHoCH = clôture au-dessus du dernier LH 1.1820 (sommet 1.1840),
// nouvelle structure : HL 1.1750, BOS = clôture au-dessus de 1.1840.
const chochSequence = () => buildCandles(1.1860, [
  ...c(1.1868), { c: 1.1874, h: 1.1880 }, ...c(1.1860, 1.1842, 1.1825, 1.1809), { c: 1.1797, l: 1.1790 },
  ...c(1.1808, 1.1822, 1.1836), { c: 1.1842, h: 1.1850 }, ...c(1.1829, 1.1811, 1.1794, 1.1776, 1.1759), { c: 1.1751, l: 1.1745 },
  ...c(1.1762, 1.1779, 1.1797), { c: 1.1811, h: 1.1820 }, ...c(1.1801, 1.1784, 1.1765, 1.1741), { c: 1.1727, l: 1.1720 },
  ...c(1.1748, 1.1781), { c: 1.1828 }, { c: 1.1834, h: 1.1840 },
  ...c(1.1818, 1.1797, 1.1772), { c: 1.1758, l: 1.1750 },
  ...c(1.1779, 1.1806, 1.1831), { c: 1.1852 }, ...c(1.1866),
], { seed: 4101, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.1820, 1.1840], pins: [1.1880, 1.1790, 1.1850, 1.1745, 1.1820, 1.1720, 1.1840, 1.1750] });

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
// 4 740 ; la dernière bougie H4 = 16 bougies M15 (rejet à 4 701, breakout du creux
// mineur 4 683, plus bas 4 664, reprise) ; puis la hausse continue.
const regimeM15 = (open: number) => buildCandles(open, [
  ...c(4689, 4694), { c: 4695, h: 4701 }, ...c(4690), { c: 4687, l: 4683 }, ...c(4690), { c: 4679 },
  ...c(4673), { c: 4668, l: 4664 }, ...c(4674, 4681, 4687, 4692, 4696, 4699), { c: 4703 },
], { seed: 6401, decimals: 1, asset: "XAU/USD", session: "Londres", volatility: "normale", levels: [4683], pins: [4701, 4683, 4664] });
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
const bosChochPrefix = () => buildCandles(1.1722, [
  ...c(1.1712), { c: 1.1706, l: 1.1700 }, ...c(1.1721, 1.1742, 1.1761), { c: 1.1773, h: 1.1780 },
  ...c(1.1768), { c: 1.1756, l: 1.1750 }, ...c(1.1771, 1.1792, 1.1808), { c: 1.1814, h: 1.1820 }, ...c(1.1806, 1.1793),
], { seed: 8101, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.1746, 1.1824, 1.1696], pins: [1.1700, 1.1780, 1.1750, 1.1820] });
const bosChochWith = (bos: boolean) => extend(bosChochPrefix(), bos
  ? [{ c: 1.1809 }, { c: 1.1831, h: 1.1835 }, { c: 1.1845 }, { c: 1.1839 }]
  : [{ c: 1.1772 }, { c: 1.1741, l: 1.1737 }, { c: 1.1733 }, { c: 1.1740 }], bos ? 8102 : 8103, 5, [], [1.1820, 1.1750]);

// SMC 3 — Order Block haussier EUR/USD H1 : dernière bougie rouge avant l'impulsion
// (corps 1.1752 → 1.1745, mèche 1.1738), BOS au-dessus de 1.1780, HH 1.1810, retour
// dans l'OB (mèche 1.1748), rejet et reprise.
const smcOB = () => buildCandles(1.1790, [
  ...c(1.1784), { c: 1.1777, h: 1.1780 }, ...c(1.1772, 1.1764, 1.1757), { c: 1.1752 },
  { c: 1.1745, h: 1.1754, l: 1.1738 },
  ...c(1.1763, 1.1779), { c: 1.1791 }, ...c(1.1802), { c: 1.1806, h: 1.1810 },
  ...c(1.1797, 1.1786, 1.1774, 1.1763), { c: 1.1757, l: 1.1748 }, ...c(1.1768, 1.1782),
], { seed: 8201, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.1752, 1.1745, 1.1780], pins: [1.1752, 1.1745, 1.1738, 1.1810, 1.1748] });

// SMC 3 / SMC 5 — mitigation après CHoCH baissier (EUR/USD H1) : HL 1.1720 / HH 1.1780,
// breakout du HL (CHoCH), creux 1.1690, retour sur l'ex-HL 1.1720 devenu résistance,
// rejet (entrée short 1.1718), baisse.
const mitigation = () => buildCandles(1.1712, [
  ...c(1.1703), { c: 1.1698, l: 1.1694 }, ...c(1.1724, 1.1738), { c: 1.1746, h: 1.1752 }, ...c(1.1737), { c: 1.1726, l: 1.1720 }, ...c(1.1741, 1.1758, 1.1771), { c: 1.1774, h: 1.1780 },
  ...c(1.1762, 1.1745, 1.1729), { c: 1.1709 }, ...c(1.1698), { c: 1.1695, l: 1.1690 },
  ...c(1.1702, 1.1711), { c: 1.1718, h: 1.1724 }, ...c(1.1704, 1.1688, 1.1673),
], { seed: 8301, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.1720, 1.1726], pins: [1.1694, 1.1752, 1.1720, 1.1780, 1.1690, 1.1724, 1.1718] });

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
// casse 4 600 (BOS) jusqu'à 4 660, repli dans l'OTE (bas 4 530), bougie de rejet (clôture 4 545)
const ote = () => buildCandles(4560, [
  ...c(4574, 4588), { c: 4593, h: 4600 }, ...c(4580, 4558, 4534, 4510, 4493), { c: 4487, l: 4480 },
  ...c(4506, 4533, 4561, 4589), { c: 4614 }, ...c(4636), { c: 4652, h: 4660 },
  ...c(4643, 4622, 4600, 4578, 4556, 4541), { c: 4545, h: 4549, l: 4530 },
], { seed: 9201, decimals: 1, asset: "XAU/USD", session: "Londres", volatility: "normale", levels: [4518.5, 4548.8], pins: [4600, 4480, 4660, 4530, 4541] });

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
// haute), cs[4].h=4652 (borne basse) → y1=4652, y2=4665 (taille 13). cs[3].h=4673 >
// cs[1].l=4668 → pas de FVG à i=2. Creux 4620 (cs[5]). Retour dans la zone à cs[10]-cs[11].
// Post-rejet graduel : aucun gap voisin ne dépasse 13.
const fvgMitigationXau = () => buildCandles(4690, [
  { c: 4681, h: 4690, l: 4675 },                // [0]
  { c: 4674, h: 4682, l: 4668 },                // [1]
  { c: 4672, h: 4675, l: 4665 },                // [2] l=4665 (borne haute du FVG)
  { c: 4628, h: 4673, l: 4624 },                // [3] grande bougie impulsive
  { c: 4624, h: 4652, l: 4620 },                // [4] h=4652 (borne basse du FVG), l=4620 (creux)
  ...c(4631, 4637, 4644, 4650), { c: 4655 }, { c: 4660, h: 4663 },
  { c: 4652, h: 4660 }, { c: 4644 }, { c: 4638 }, ...c(4633, 4627), { c: 4617, l: 4610 },
], { seed: 15401, decimals: 0, asset: "XAU/USD", session: "Londres", volatility: "normale", levels: [4665, 4652, 4660, 4620, 4610], pins: [4690, 4668, 4665, 4673, 4624, 4652, 4620, 4663, 4660, 4610] });
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
  { c: 1.1702, h: 1.1716, l: 1.1700 },
  { c: 1.1724, h: 1.1726, l: 1.1703 }, { c: 1.1738 }, { c: 1.1745 }, { c: 1.1748, h: 1.1750 }, ...c(1.1742, 1.1746),
  { c: 1.1758 }, { c: 1.1766 }, { c: 1.1770, h: 1.1774 }, ...c(1.1765, 1.1768),
], { seed: 16101, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", split: 7, preNews: true,
  levels: [1.1725, 1.1710, 1.1702, 1.1750, 1.1774], pins: [1.1725, 1.1710, 1.1712, 1.1700, 1.1702, 1.1750, 1.1774] });
// ICT 3 — AsiaRangeSweep (EUR/USD M15) : range Asia 1.1710-1.1725 (7 bougies calmes),
// bougie de sweep sous 1.1710 jusqu'à 1.1702, réintégration, impulsion haussière à 1.1750.
const asiaRangeSweep = () => buildCandles(1.1718, [
  { c: 1.1720, h: 1.1724, l: 1.1715 }, { c: 1.1716, h: 1.1721, l: 1.1712 },
  { c: 1.1720, h: 1.1723, l: 1.1714 }, { c: 1.1718, h: 1.1722, l: 1.1712 },
  { c: 1.1722, h: 1.1725, l: 1.1716 }, { c: 1.1719, h: 1.1724, l: 1.1714 }, { c: 1.1720, h: 1.1724, l: 1.1715 },
  { c: 1.1706, h: 1.1716, l: 1.1702 }, { c: 1.1718, h: 1.1720, l: 1.1703 },
  { c: 1.1736 }, { c: 1.1742 }, { c: 1.1747, h: 1.1750 },
], { seed: 16201, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", split: 7,
  levels: [1.1725, 1.1710, 1.1702, 1.1750], pins: [1.1725, 1.1715, 1.1710, 1.1712, 1.1702, 1.1750] });
// ICT 3 — NYOpenExpansion (XAU/USD M15) : consolidation ~4 640 (5 bougies calmes),
// bougie explosive haussière à 4 668, mèche de sweep, cascade baissière à 4 610.
const nyExpansion = () => buildCandles(4638, [
  { c: 4640, h: 4643, l: 4636 }, { c: 4638, h: 4641, l: 4636 }, { c: 4641, h: 4644, l: 4637 },
  { c: 4639, h: 4643, l: 4636 }, { c: 4641, h: 4644, l: 4637 },
  { c: 4668, h: 4671, l: 4640 }, { c: 4658, h: 4669, l: 4654 },
  { c: 4640, h: 4659 }, { c: 4630, h: 4641 }, { c: 4622 }, { c: 4615, l: 4610 },
], { seed: 16301, decimals: 0, asset: "XAU/USD", session: "New York", volatility: "élevée", split: 5,
  levels: [4640, 4668, 4610], pins: [4640, 4644, 4636, 4668, 4671, 4610] });
// ICT 3 — TimingComparison panneaux Asia et London : même résistance 1.1780 testée deux fois.
// Asia (01h-04h UTC) : rejet mou de 4 pips, puis latéralisation 2 h.
// London Open (07h-10h UTC) : sweep à 1.1792, cascade de 35 pips.
const timingAsia = () => buildCandles(1.1770, [
  ...c(1.1774, 1.1778), { c: 1.1778, h: 1.1780 }, { c: 1.1776, h: 1.1780 },
  ...c(1.1774, 1.1776, 1.1773, 1.1775, 1.1773, 1.1775, 1.1772, 1.1774),
], { seed: 16401, decimals: 5, asset: "EUR/USD", session: "Asie", volatility: "faible",
  levels: [1.1780], pins: [1.1780] });
const timingLondon = () => buildCandles(1.1770, [
  ...c(1.1774, 1.1778), { c: 1.1780, h: 1.1792 }, { c: 1.1762 }, { c: 1.1755 }, { c: 1.1750 }, ...c(1.1745, 1.1742),
], { seed: 16402, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale",
  levels: [1.1780, 1.1792, 1.1745], pins: [1.1780, 1.1792, 1.1745] });
// ICT 4 — DisplacementImpulse (EUR/USD M15) : 2 bougies calmes, sweep à 1.1792 refermé
// sous 1.1780, puis 4 bougies baissières (displacement) ; prix jusqu'à 1.1748, FVGs laissés.
const dispImpulse = () => buildCandles(1.1776, [
  { c: 1.1780, h: 1.1782, l: 1.1776 }, { c: 1.1778, h: 1.1780, l: 1.1775 },
  { c: 1.1778, h: 1.1792, l: 1.1774 },  // sweep : mèche à 1.1792, corps reste sous 1.1780
  { c: 1.1769 }, { c: 1.1760 }, { c: 1.1752 }, { c: 1.1748, l: 1.1745 },
], { seed: 16501, decimals: 5, asset: "EUR/USD", session: "New York", volatility: "normale", split: 3,
  levels: [1.1780, 1.1792, 1.1748], pins: [1.1782, 1.1780, 1.1775, 1.1792, 1.1774, 1.1745] });
Object.assign(SCENARIOS, {
  "killzones-kz": killzonesKz, "asia-range-sweep": asiaRangeSweep, "ny-expansion": nyExpansion,
  "timing-asia": timingAsia, "timing-london": timingLondon, "disp-impulse": dispImpulse,
});
