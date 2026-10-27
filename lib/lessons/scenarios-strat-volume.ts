// Scénario en bougies de la stratégie Volume Profile + VWAP (4 leçons) : un seul trade EUR/USD suivi
// d'une leçon à l'autre (H1 puis M15), la vente sur l'or (leçon 2) et l'absorption sur le contrat
// future (leçon 3). Prix écrits d'après le texte, volumes (`v`) et deltas (`d`) écrits à la main : le
// profil, la Value Area, la LVN, les VWAP et le CVD qu'affichent les schémas en sont calculés
// (lib/lessons/volume.ts) et l'audit vérifie qu'ils redonnent les chiffres du texte
// (scripts/audit-lecons/data-strat-volume.ts).

import { buildCandles, type Step } from "./chart-build";
import type { Candle } from "./chart-analysis";
import type { VCandle } from "./volume";
import { VSV_FUT_BASIS, VSV_FUT_FROM, VSV_M15 } from "./strat-volume-meta";

const pinAll = (s: Step[]) => s.flatMap((k) => [k.c, k.h, k.l].filter((x): x is number => x !== undefined));

function withVol(cs: Candle[], v: number[], d?: number[]): VCandle[] {
  if (v.length !== cs.length || (d && d.length !== cs.length)) throw new Error(`volumes : ${v.length} pour ${cs.length} bougies`);
  return cs.map((k, i) => ({ ...k, v: v[i], ...(d ? { d: d[i] } : {}) }));
}

/** Bougie écrite en pips au-dessus de 1.0800 : clôture, plus haut, plus bas */
const eu = (cl: number, h: number, l: number): Step => ({ c: Number((1.08 + cl / 1e4).toFixed(5)), h: Number((1.08 + h / 1e4).toFixed(5)), l: Number((1.08 + l / 1e4).toFixed(5)) });
const EU = { decimals: 5, asset: "EUR/USD" as const, session: "Londres" as const, volatility: "normale" as const };

// ─── EUR/USD H1 : la structure et le profil (leçons 1 et 4) ─────────────────
// Creux 1.0800, sommet 1.0860 rejeté deux fois, creux 1.0830, cassure de 1.0860, consolidation entre
// l'ancienne résistance et 1.0890, deux retours sur 1.0860 (POC 1.0860, Value Area 1.0845 – 1.0890),
// montée rapide (LVN 1.0895 – 1.0905), sommet 1.0910 touché deux fois, correction : le prix évolue
// autour de 1.0890.
export const VSV_H1_STEPS: Step[] = [
  eu(14, 18, 10), eu(8, 15, 6), eu(3, 9, 0),                                                         // creux 1.0800 (2)
  eu(14, 15, 2), eu(32, 34, 13), eu(46, 48, 31),
  eu(56, 60, 45),                                                                                     // 1er rejet de 1.0860 (6)
  eu(50, 57, 48), eu(55, 56, 47),
  eu(57, 60, 52),                                                                                     // 2e rejet (9)
  eu(43, 58, 42),
  eu(33, 43, 30),                                                                                     // creux 1.0830 (11)
  eu(41, 42, 32), eu(47, 48, 40),
  eu(52, 54, 44), eu(48, 54, 44), eu(54, 56, 47), eu(50, 56, 44), eu(57, 58, 49),                     // base sous la résistance
  eu(67, 68, 56),                                                                                     // breakout de 1.0860 (19)
  eu(63, 69, 59), eu(59, 65, 56),                                                                     // 1er retour sur 1.0860 (21)
  eu(60, 62, 58), eu(67, 69, 59), eu(72, 74, 65), eu(70, 75, 68), eu(76, 78, 69), eu(74, 79, 72), eu(81, 83, 73),
  eu(86, 88, 79), eu(81, 87, 79), eu(77, 83, 75), eu(79, 81, 74), eu(72, 80, 70), eu(66, 73, 64),
  eu(60, 67, 57),                                                                                     // 2e retour (35)
  eu(61, 62, 58), eu(68, 70, 59), eu(73, 75, 66), eu(71, 76, 69), eu(78, 80, 70), eu(83, 84, 76), eu(88, 90, 81),
  eu(91, 95, 86), eu(88, 95, 85),
  eu(107, 108, 86),                                                                                   // montée rapide (45)
  eu(109, 110, 105), eu(107, 109, 105), eu(106, 109, 106),                                            // 1er sommet 1.0910 (46), fin du profil (48)
  eu(102, 106, 100),                                                                                  // repli
  eu(104, 110, 101),                                                                                  // 2e sommet 1.0910 (50)
  eu(99, 105, 98), eu(93, 100, 91), eu(88, 95, 86),                                                 // correction
];
export const VSV_H1_V = [
  2000, 1900, 2300,
  2400, 2500, 2300,
  2600,
  2100, 2000,
  2500,
  2300,
  5100,
  6000, 6000,
  1150, 1250, 5300, 1750, 3650,
  4500,
  1650, 1300,
  2600, 1400, 3050, 2100, 1600, 2100, 3700,
  1550, 2450, 1900, 1750, 1450, 2050,
  1700,
  2850, 1850, 1350, 1450, 1450, 2200, 2950,
  5150, 4350,
  2300,
  2650, 1200, 4400,
  1500,
  1900,
  1800, 2000, 2200,
];
const h1 = () => withVol(buildCandles(1.0816, VSV_H1_STEPS, { seed: 20101, ...EU, levels: [1.086], pins: pinAll(VSV_H1_STEPS) }), VSV_H1_V);

// ─── EUR/USD M15 : la séance du retour dans la zone (leçons 2 à 4) ──────────
// Fin de la séance précédente (correction), ouverture de la séance (VWAP), retour dans la zone : 1.0860
// atteint, creux 1.0845, sommet local 1.0870, légère correction, clôture au-dessus de 1.0870 (entrée
// 1.0872 refusée : R/R 1:1,1). Second retour : creux 1.0848, sommet local 1.0856, clôture au-dessus
// (entrée 1.0858, R/R 1:3).
export const VSV_M15_STEPS: Step[] = [
  eu(85, 89, 84), eu(82, 86, 81), eu(79, 83, 78), eu(77, 80, 75), eu(74, 78, 73), eu(72, 75, 71),     // fin de la séance précédente
  eu(70, 73, 68), eu(71, 72, 67), eu(68, 72, 67), eu(70, 71, 66), eu(69, 71, 67), eu(68, 70, 66),     // ouverture de la séance (6)
  eu(64, 68, 63), eu(59, 65, 56), eu(61, 62, 56), eu(62, 64, 59),                                     // retour dans la zone (12 à 14)
  eu(52, 62, 50), eu(48, 53, 45),                                                                     // creux 1.0845 (17)
  eu(55, 56, 47), eu(62, 63, 54), eu(68, 70, 61),                                                     // sommet local 1.0870 (20)
  eu(65, 69, 63), eu(64, 67, 62),
  eu(72, 73, 63),                                                                                     // clôture au-dessus de 1.0870 (23)
  eu(69, 74, 68), eu(63, 70, 62), eu(55, 64, 54), eu(51, 55, 50),                                     // second retour
  eu(49, 53, 48),                                                                                     // creux 1.0848 (28)
  eu(54, 56, 50),                                                                                     // sommet local 1.0856 (29)
  eu(52, 55, 51), eu(53, 55, 51),
  eu(58, 59, 52),                                                                                     // clôture au-dessus de 1.0856 : entrée 1.0858 (32)
];
export const VSV_M15_V = [
  900, 850, 800, 800, 750, 700,
  450, 400, 420, 380, 400, 450,
  1500, 4500, 4800, 2600,
  2400, 2800,
  2200, 2000, 2100,
  1600, 1500,
  2400,
  1800, 1900, 2000, 2100,
  2300,
  1900,
  1500, 1400,
  2200,
];
/** Issues du trade retenu : A, le stop 1.0842 ; B, l'objectif 1.0906 */
export const VSV_OUTCOMES: Record<"a" | "b", { steps: Step[]; v: number[] }> = {
  a: { steps: [eu(55, 60, 54), eu(50, 56, 49), eu(47, 51, 46), eu(43, 48, 41)], v: [1900, 2100, 2300, 2500] },
  b: {
    steps: [eu(63, 64, 57), eu(70, 71, 62), eu(76, 77, 69), eu(83, 84, 75), eu(89, 91, 82), eu(96, 97, 88), eu(102, 103, 95), eu(105, 107, 101)],
    v: [2400, 2600, 2300, 2200, 2400, 2100, 2000, 2200],
  },
};
const m15 = () => withVol(buildCandles(h1().at(-1)!.c, VSV_M15_STEPS, { seed: 20102, ...EU, levels: [1.0845, 1.087], pins: pinAll(VSV_M15_STEPS) }), VSV_M15_V);
const outcome = (k: "a" | "b") => () => {
  const base = m15();
  const o = VSV_OUTCOMES[k];
  const after = buildCandles(base[base.length - 1].c, o.steps, { seed: k === "a" ? 20103 : 20104, ...EU, pins: pinAll(o.steps) });
  return [...base, ...withVol(after, o.v)];
};

// ─── Contrat future EUR/USD M15 : absorption et divergence du CVD (leçon 3) ──
// Même séance, de l'ouverture à la confirmation, environ 40 pips au-dessus du comptant. Au contact de la
// zone, fortes ventes agressives (delta très négatif) sans nouvelle baisse : absorption possible ; le
// creux suivant, plus bas, se fait avec moins de ventes : le CVD fait un creux plus haut (divergence).
export const VSV_FUT_V = [1800, 1600, 1700, 1500, 1600, 1700, 4200, 9000, 9500, 5200, 4800, 5000, 4600, 4400, 4500, 3600, 3400, 5200];
export const VSV_FUT_D = [100, -80, -150, 120, -60, -90, -900, -1700, -1900, 900, -400, -300, 900, 1100, 1000, -300, -200, 1300];
const fut = () => {
  const r = (x: number) => Number((x + VSV_FUT_BASIS).toFixed(5));
  const cs = m15().slice(VSV_FUT_FROM, VSV_M15.confirm + 1).map((k) => ({ o: r(k.o), h: r(k.h), l: r(k.l), c: r(k.c) }));
  return withVol(cs, VSV_FUT_V, VSV_FUT_D);
};

// ─── XAU/USD H1 : vente dans une tendance baissière (leçon 2) ───────────────
// Sommets et creux descendants depuis l'ouverture de la séance, consolidation sous 3 900 $ (deux
// rejets, volume concentré vers 3 898 $), impulsion baissière (creux 3 854 $), rebond vers 3 900 $,
// où passe le VWAP de séance (3 899 $).
export const VSX_STEPS: Step[] = [
  { c: 3952, h: 3958, l: 3946 }, { c: 3944, h: 3954, l: 3941 }, { c: 3947, h: 3950, l: 3940 }, { c: 3936, h: 3949, l: 3933 },
  { c: 3928, h: 3938, l: 3925 }, { c: 3931, h: 3934, l: 3924 }, { c: 3920, h: 3932, l: 3917 }, { c: 3910, h: 3922, l: 3906 },
  { c: 3897, h: 3912, l: 3895 }, { c: 3898, h: 3899, l: 3897 },
  { c: 3896, h: 3900, l: 3895 },                                                                     // 1er rejet de 3 900 $ (10)
  { c: 3894, h: 3896, l: 3892 }, { c: 3893, h: 3895, l: 3891 }, { c: 3897, h: 3898, l: 3892 },
  { c: 3895, h: 3900, l: 3894 },                                                                     // 2e rejet (14)
  { c: 3893, h: 3896, l: 3891 },
  { c: 3876, h: 3895, l: 3873 }, { c: 3862, h: 3880, l: 3858 }, { c: 3858, h: 3866, l: 3854 },       // impulsion baissière, creux 3 854 $ (18)
  { c: 3866, h: 3868, l: 3856 }, { c: 3875, h: 3877, l: 3863 }, { c: 3884, h: 3886, l: 3873 }, { c: 3892, h: 3894, l: 3882 },
  { c: 3898, h: 3900, l: 3890 },                                                                     // rebond sur 3 900 $ (23)
];
export const VSX_V = [
  3100, 2800, 2900, 2100, 3300, 2900, 1800, 4100,
  2800, 6000, 3400, 4400, 2700, 6000, 4500, 6000,
  4500, 4200, 6000,
  2400, 3100, 2400, 2500, 2400,
];
const xau = () => withVol(buildCandles(3955, VSX_STEPS, { seed: 20105, decimals: 0, asset: "XAU/USD", session: "Londres", volatility: "normale", levels: [3900], pins: pinAll(VSX_STEPS) }), VSX_V);

export const STRAT_VOLUME_SCENARIOS: Record<string, () => Candle[]> = {
  "vsv-h1": h1,
  "vsv-m15": m15,
  "vsv-m15-a": outcome("a"),
  "vsv-m15-b": outcome("b"),
  "vsv-fut": fut,
  "vsv-xau": xau,
};
