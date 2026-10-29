// Scénarios en bougies des leçons Volume Profile, VWAP et Order Flow (Trading Avancé 10 à 12) :
// prix écrits d'après le texte de chaque leçon, bougies construites par buildCandles, puis volume
// (`v`) et, pour l'Order Flow, delta (`d`) de chaque bougie. Les volumes sont écrits à la main : le
// profil, la Value Area, les VWAP et le CVD qu'affichent les schémas en sont calculés
// (lib/lessons/volume.ts) et l'audit vérifie qu'ils redonnent les chiffres du texte
// (scripts/audit-lecons/data-volume.ts).
// NASDAQ : niveaux du texte décalés de +7 000 points (20 000 → 27 000), plage réaliste des jeux.

import { buildCandles, type Step } from "./chart-build";
import type { Candle } from "./chart-analysis";
import type { VCandle } from "./volume";
import { AVW_ANCHOR } from "./volume-meta";

export { AVW_ANCHOR, AVW_TOUCH, LVN_BREAK, LVN_PROFILE, LVN_ROW, VP_ROW, VPT_PROFILE, VPT_ROW, VPT_TRADE, VWN_TRADE, VWX_SUPPORT, VWX_TRADE, aggregateV } from "./volume-meta";

const c = (...closes: number[]): Step[] => closes.map((x) => ({ c: x }));
const pinAll = (s: Step[]) => s.flatMap((k) => [k.c, k.h, k.l].filter((x): x is number => x !== undefined));

/** Bougies et volumes (même longueur) ; delta facultatif */
function withVol(cs: Candle[], v: number[], d?: number[]): VCandle[] {
  if (v.length !== cs.length || (d && d.length !== cs.length)) throw new Error(`volumes : ${v.length} pour ${cs.length} bougies`);
  return cs.map((k, i) => ({ ...k, v: v[i], ...(d ? { d: d[i] } : {}) }));
}


// ─── Volume Profile — le profil d'un range EUR/USD H1 (1.0800 à 1.0900) ──────
// Activité concentrée autour de 1.0850 (POC), Value Area 1.0835 – 1.0865, concentration secondaire
// vers 1.0820, zone traversée vite entre 1.0870 et 1.0885 (LVN), courte visite du haut du range.
/** Bougie écrite en pips au-dessus de 1.0800 : clôture, plus haut, plus bas */
const eu = (cl: number, h: number, l: number): Step => ({ c: Number((1.08 + cl / 1e4).toFixed(5)), h: Number((1.08 + h / 1e4).toFixed(5)), l: Number((1.08 + l / 1e4).toFixed(5)) });
export const VP_RANGE: Step[] = [
  eu(52, 56, 44), eu(41, 53, 38), eu(49, 51, 36), eu(60, 62, 47), eu(53, 63, 50), eu(43, 55, 40), eu(36, 45, 33),
  eu(27, 37, 25), eu(21, 30, 18), eu(17, 23, 14), eu(22, 24, 16), eu(18, 23, 15), eu(23, 25, 17), eu(36, 37, 21), // concentration secondaire vers 1.0820
  eu(48, 49, 35), eu(44, 52, 41), eu(55, 57, 42), eu(63, 66, 53), eu(58, 65, 55), eu(66, 67, 56),
  eu(79, 80, 64), eu(92, 93, 78), eu(95, 98, 89), eu(90, 96, 88), eu(78, 91, 77), eu(64, 79, 63),            // visite du haut du range
  eu(57, 66, 55), eu(49, 59, 46), eu(55, 58, 45), eu(47, 57, 44), eu(52, 54, 39), eu(40, 53, 37), eu(33, 42, 31),
  eu(12, 34, 3), eu(24, 25, 10), eu(37, 38, 22), eu(46, 48, 35), eu(51, 53, 44),
];
export const VP_RANGE_V = [
  2450, 2150, 800, 1450, 2600, 3200, 3050,
  3750, 1100, 1300, 1700, 1900, 1950, 1850,
  5000, 2800, 2600, 5000, 3650, 2800,
  1050, 1100, 1150, 2050, 1400, 1200,
  2550, 2750, 2950, 2950, 1450, 3500, 3300,
  1750, 2800, 4750, 2150, 2250,
];
const vpRangeCandles = () => buildCandles(1.0846, VP_RANGE, { seed: 10101, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", pins: pinAll(VP_RANGE) });

// Sortie de la Value Area par le haut : rejet (retour dans la zone de valeur) ou acceptation (retest
// de la VAH par-dessus, puis continuation)
export const VA_EXIT: Record<"rejet" | "acceptation", { steps: Step[]; v: number[] }> = {
  rejet: {
    steps: [eu(58, 59, 50), eu(64, 66, 57), eu(72, 76, 63), eu(61, 73, 60), eu(55, 62, 53), eu(49, 57, 47), eu(45, 51, 43), eu(50, 52, 44)],
    v: [2300, 2600, 3000, 2900, 2500, 2400, 2200, 2100],
  },
  acceptation: {
    steps: [eu(58, 59, 50), eu(64, 66, 57), eu(73, 76, 63), eu(70, 74, 66), eu(77, 78, 68), eu(84, 85, 76), eu(91, 92, 83), eu(88, 93, 86)],
    v: [2300, 2600, 3200, 2400, 2800, 3000, 3100, 2500],
  },
};
const vaExit = (k: keyof typeof VA_EXIT) => () => {
  const base = withVol(vpRangeCandles(), VP_RANGE_V);
  const e = VA_EXIT[k];
  const after = buildCandles(base[base.length - 1].c, e.steps, { seed: k === "rejet" ? 10111 : 10112, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", pins: pinAll(e.steps) });
  return [...base, ...withVol(after, e.v)];
};

// ─── Volume Profile — exemple pratique EUR/USD (H1, entrée M15) ─────────────
// H1 : résistance 1.0900 (deux touches), baisse, tendance haussière (creux 1.0811, HL 1.0828), résistance
// 1.0850 touchée deux fois puis cassée, consolidation juste au-dessus (POC 1.0852), impulsion jusqu'à
// 1.0888, correction vers 1.0850. Les trois dernières heures sont détaillées en M15 : creux technique
// 1.0841, sommet local 1.0854, cassure à 1.0855 (entrée), SL 1.0835, TP 1.0895 (avant la résistance 1.0900).
export const VPT_H1: Step[] = [
  eu(77, 78, 67), eu(86, 87, 75), eu(91, 100, 85), eu(82, 92, 80), eu(87, 89, 81), eu(90, 101, 86),  // résistance 1.0900 (2 et 5)
  eu(79, 91, 78), eu(64, 80, 62), eu(50, 65, 49), eu(36, 52, 34), eu(24, 37, 23), eu(17, 26, 11),   // baisse, creux 1.0811 (11)
  eu(26, 27, 15), eu(38, 39, 25), eu(46, 51, 37), eu(38, 47, 36), eu(32, 39, 28), eu(41, 42, 31), eu(47, 50, 40), eu(43, 48, 41), // résistance 1.0850 (14 et 18)
  eu(59, 60, 42),                                                                                    // cassure de 1.0850 (20)
  eu(54, 58, 50), eu(51, 55, 49), eu(53, 54, 50), eu(50, 54, 49), eu(53, 55, 49), eu(51, 54, 50), eu(55, 56, 50), // consolidation (21 à 27)
  eu(66, 67, 52), eu(78, 80, 65), eu(84, 88, 77),                                                    // impulsion, sommet 1.0888
  eu(77, 85, 76), eu(69, 78, 68), eu(61, 70, 60),                                                    // correction
];
export const VPT_H1_V = [
  2100, 2300, 2600, 2000, 2100, 2500, 2200, 2400, 2600, 2500, 2300, 2400,
  2200, 2300, 2500, 2000, 2100, 2200, 2400, 2000,
  3100,
  2900, 3200, 3600, 3400, 3000, 2900, 2600,
  2800, 2600, 2500,
  2000, 1900, 1800,
];
export const VPT_M15: Step[] = [
  eu(58, 62, 56), eu(56, 59, 55), eu(59, 60, 55), eu(54, 59, 53), eu(50, 57, 49),
  eu(46, 50, 41),                                                        // creux technique 1.0841 (5)
  eu(49, 50, 44), eu(53, 54, 48),                                        // sommet local 1.0854 (7)
  eu(50, 53, 48), eu(48, 51, 46), eu(52, 53, 47),
  eu(58, 60, 50),                                                        // cassure du sommet local : entrée 1.0855 (11)
];
export const VPT_M15_V = [700, 650, 600, 750, 800, 1100, 900, 700, 650, 600, 700, 1000];
const vptH1 = () => withVol(buildCandles(1.0868, VPT_H1, { seed: 10201, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", levels: [1.0850], pins: [...pinAll(VPT_H1), 1.09, 1.0901] }), VPT_H1_V);
const vptM15 = () => withVol(buildCandles(vptH1().at(-1)!.c, VPT_M15, { seed: 10202, decimals: 5, asset: "EUR/USD", session: "Londres", volatility: "normale", pins: pinAll(VPT_M15) }), VPT_M15_V);

// ─── Volume Profile — LVN et objectif (NASDAQ M15) ──────────────────────────
// Le marché a longtemps échangé vers 27 200 (HVN), est descendu vite entre 27 180 et 27 120 (LVN), a
// construit une résistance à 27 100 (deux touches), puis la casse : la LVN est traversée vite jusqu'à l'HVN.
export const LVN_STEPS: Step[] = [
  ...c(27198, 27210, 27196, 27204, 27192, 27207, 27199, 27191),
  ...c(27150), { c: 27112, l: 27109 }, { c: 27114, h: 27118, l: 27109 }, { c: 27110, h: 27117, l: 27108 },   // descente rapide, courte pause
  { c: 27071, h: 27111, l: 27066 }, { c: 27093, h: 27100, l: 27069 }, ...c(27078, 27058), { c: 27046, l: 27040 }, ...c(27061, 27079),
  { c: 27094, h: 27101 }, ...c(27084), { c: 27088, h: 27092, l: 27077 },                                  // résistance 27 100 (13 et 19)
  { c: 27118, h: 27120, l: 27086 },                                                                       // cassure de 27 100 (22)
  { c: 27112, l: 27102 }, ...c(27141, 27176), { c: 27198, h: 27204 }, ...c(27201),
];
export const LVN_V = [
  2800, 2700, 3900, 2300, 1500, 2900, 1900, 2700,
  2800, 3900, 3200, 2100,
  4700, 7000, 3400, 2100, 4200, 3200, 4700, 5500, 2900, 4100,
  5000, 4900, 4100, 5300, 3500, 3900,
];

const lvnCandles = () => withVol(buildCandles(27205, LVN_STEPS, { seed: 10301, decimals: 0, asset: "NASDAQ", session: "New York", volatility: "normale", levels: [27100], pins: pinAll(LVN_STEPS) }), LVN_V);

// ─── VWAP — plan sur le NASDAQ (M15, depuis l'ouverture de la séance) ───────
// Creux 27 000, sommet 27 140, creux 27 080, sommet 27 140 (résistance), cassure, sommet 27 230,
// correction vers l'ancienne résistance 27 140, où se trouve le VWAP de séance ; creux local 27 133,
// sommet local de la correction 27 153, cassure : entrée 27 155, SL 27 125, TP 27 215 (sous le sommet).
export const VWN_STEPS: Step[] = [
  ...c(27008), { c: 27004, l: 27000 }, ...c(27031, 27058, 27089, 27112), { c: 27134, h: 27140 },          // creux 27 000, sommet 27 140 (indice 6)
  ...c(27118, 27101), { c: 27086, l: 27080 }, ...c(27102, 27121), { c: 27133, h: 27139 },                 // creux 27 080 (9), 2e touche (12)
  ...c(27158, 27179, 27201, 27217), { c: 27224, h: 27230 },                                               // cassure, sommet 27 230 (17)
  { c: 27205, h: 27226 }, ...c(27182, 27160), { c: 27148, l: 27142 }, { c: 27151, h: 27153 }, { c: 27144, h: 27151 }, // correction, sommet local (22)
  { c: 27140, l: 27133 },                                                                                 // creux local (24)
  ...c(27149), { c: 27158, h: 27160 },                                                                    // cassure : entrée 27 155 (26)
];
export const VWN_V = [
  9800, 4600, 4000, 6300, 6200, 7700, 8900,
  7200, 5800, 5600, 4600, 5300, 8000,
  10000, 8900, 9400, 12000, 11900,
  12000, 12000, 5700, 4000, 6200, 7000, 5600,
  6500, 7900,
];

const vwapNas = () => withVol(buildCandles(27020, VWN_STEPS, { seed: 10401, decimals: 0, asset: "NASDAQ", session: "New York", volatility: "normale", levels: [27140], pins: pinAll(VWN_STEPS) }), VWN_V);

// ─── VWAP — or (XAU/USD M15, scénario baissier) ─────────────────────────────
// Support 3 900 touché deux fois par-dessus, cassé par une forte impulsion baissière, support 3 875
// (deux touches), remontée vers 3 900 (VWAP de séance), échec sous 3 902, cassure du creux local : entrée 3 897,
// SL 3 907, TP 3 877 (avant le support 3 875).
export const VWX_STEPS: Step[] = [
  ...c(3931, 3924, 3916), { c: 3905, l: 3900 }, ...c(3913), { c: 3918, h: 3921 }, ...c(3909), { c: 3903, l: 3899 }, ...c(3910, 3906),
  ...c(3893, 3884), { c: 3879, l: 3875 }, ...c(3886, 3883), { c: 3880, l: 3875 },                       // impulsion, support 3 875
  ...c(3888, 3895), { c: 3900, h: 3902 }, { c: 3899, h: 3901, l: 3898 },                                // retour sur 3 900 (18), creux local (19)
  { c: 3893, h: 3900, l: 3891 },                                                                        // cassure du creux local : entrée 3 897 (20)
];
export const VWX_V = [
  3200, 2900, 2800, 3000, 2600, 2500, 2700, 2900, 2400, 2300,
  4600, 6000, 3900, 3100, 2800, 3000,
  2600, 2500, 2700, 2400, 3400,
];

const vwapXau = () => withVol(buildCandles(3935, VWX_STEPS, { seed: 10501, decimals: 0, asset: "XAU/USD", session: "Londres", volatility: "normale", levels: [3900], pins: pinAll(VWX_STEPS) }), VWX_V);

// ─── VWAP ancré — or après une publication (XAU/USD M15) ────────────────────
// Séance calme, publication (indice 10) : impulsion haussière, puis correction quelques heures plus
// tard vers le VWAP ancré au début de l'impulsion.
export const AVW_STEPS: Step[] = [
  ...c(3884, 3881, 3886, 3883, 3879, 3884, 3887, 3882, 3885, 3884),
  ...c(3905, 3922, 3934), { c: 3941, h: 3946 }, ...c(3937, 3943, 3938, 3933, 3929), { c: 3927, l: 3924 }, ...c(3932, 3936),   // retour sur le VWAP ancré (19)
];

export const AVW_V = [
  1800, 1600, 1700, 1500, 1600, 1700, 1500, 1600, 1500, 1700,
  6800, 6200, 5400, 4800, 3600, 3400, 3000, 2800, 2600, 2700, 2500, 2400,
];
const avwXau = () => withVol(buildCandles(3882, AVW_STEPS, { seed: 10601, decimals: 0, asset: "XAU/USD", session: "New York", volatility: "normale", pins: pinAll(AVW_STEPS), split: AVW_ANCHOR }), AVW_V);

// ─── Order Flow — absorption et divergence CVD (NASDAQ future H1) ───────────
// Progression vers la résistance 27 100 (1er sommet), repli, nouvelle poussée : léger dépassement
// (27 104) avec un delta fortement positif mais presque sans progression (absorption possible),
// pendant que le CVD fait un sommet plus bas (divergence).
export const OF_STEPS: Step[] = [
  ...c(26912, 26935, 26958, 26990, 27030, 27064), { c: 27088, h: 27100 },   // 1er sommet (6)
  ...c(27061), { c: 27040, l: 27033 }, ...c(27058, 27079, 27094),
  { c: 27099, h: 27104 },                                                // nouveau sommet, absorption possible (12)
  { c: 27097, h: 27102 }, { c: 27086, h: 27096 }, { c: 27080, h: 27089 },
];
export const OF_V = [21000, 23000, 24000, 26000, 28000, 29000, 31000, 27000, 26000, 22000, 23000, 24000, 30000, 25000, 22000, 20000];
export const OF_D = [600, 800, 900, 1100, 1300, 1200, 700, -1800, -1500, 500, 400, 300, 1600, -200, -400, 100];
const ofAbs = () => withVol(buildCandles(26900, OF_STEPS, { seed: 10701, decimals: 0, asset: "NASDAQ", session: "New York", volatility: "normale", levels: [27100], pins: pinAll(OF_STEPS) }), OF_V, OF_D);

export const VOLUME_SCENARIOS: Record<string, () => Candle[]> = {
  "vp-range": () => withVol(vpRangeCandles(), VP_RANGE_V),
  "va-rejet": vaExit("rejet"),
  "va-acceptation": vaExit("acceptation"),
  "vpt-h1": vptH1,
  "vpt-m15": vptM15,
  "vp-lvn": lvnCandles,
  "vwap-nas": vwapNas,
  "vwap-xau": vwapXau,
  "avwap-xau": avwXau,
  "of-absorption": ofAbs,
};
