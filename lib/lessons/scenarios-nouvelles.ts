// Scénarios en bougies des leçons Débutant 11 (types d'ordres), Intermédiaire 10 à 12 (figures chartistes,
// ATR, volatilité), Avancé 13 à 15 (Wyckoff, ICT/SMC) et des stratégies Opening Range Breakout et Wyckoff
// appliqué. Prix écrits d'après le texte de chaque leçon (NASDAQ décalé de +7 000 points), bougies
// construites par buildCandles (continuité, réalisme) ; les extrêmes qui portent un chiffre du texte sont
// épinglés. Les séries de l'ATR sont écrites avec leur amplitude (True Range = haut − bas, l'ouverture
// étant la clôture précédente) : l'ATR affiché en est recalculé (lib/lessons/chart-analysis.ts) et l'audit
// vérifie chaque chiffre du texte sur ces données (scripts/audit-lecons/data-nouvelles.ts).

import { buildCandles, type Step } from "./chart-build";
import type { Candle } from "./chart-analysis";
import { mulberry32, type Asset, type Session, type Volatility } from "@/lib/games/shared";
import { NEWS_PRE } from "./nouvelles-meta";

const c = (...closes: number[]): Step[] => closes.map((x) => ({ c: x }));
const pinAll = (s: Step[]) => s.flatMap((k) => [k.c, k.h, k.l].filter((x): x is number => x !== undefined));
type Ctx = { asset: Asset; session: Session; volatility: Volatility; decimals: number };
const EU: Ctx = { asset: "EUR/USD", session: "Londres", volatility: "normale", decimals: 5 };
const GU: Ctx = { asset: "EUR/USD", session: "Londres", volatility: "normale", decimals: 5 };
const XAU: Ctx = { asset: "XAU/USD", session: "Londres", volatility: "normale", decimals: 0 };
const NQ: Ctx = { asset: "NASDAQ", session: "New York", volatility: "normale", decimals: 0 };
/** Bougies : clôtures et extrêmes écrits épinglés, les autres mèches viennent de la passe de réalisme */
const build = (open: number, steps: Step[], seed: number, ctx: Ctx, levels: number[] = []) =>
  buildCandles(open, steps, { seed, ...ctx, levels, pins: pinAll(steps) });

/**
 * Bougies à amplitude imposée (séries de l'ATR) : chaque pas donne la clôture et l'amplitude haut − bas ;
 * les mèches se partagent l'excédent sur le corps (part haute tirée de la graine), sauf extrême imposé.
 */
interface RStep { c: number; r: number; h?: number; l?: number }
function ranged(open: number, steps: RStep[], seed: number, ctx: Ctx): Candle[] {
  const rng = mulberry32(seed);
  let o = open;
  const out: Step[] = steps.map((s) => {
    const top = Math.max(o, s.c), bot = Math.min(o, s.c);
    const extra = Math.max(0, s.r - (top - bot));
    const up = s.h !== undefined ? s.h - top : s.l !== undefined ? extra - (bot - s.l) : extra * (0.25 + 0.5 * rng());
    const h = Math.max(top, s.h ?? top + up), l = Math.min(bot, s.l ?? bot - (extra - up));
    o = s.c;
    const r = (x: number) => Number(x.toFixed(ctx.decimals));
    return { c: s.c, h: r(h), l: r(l) };
  });
  return buildCandles(open, out, { seed, ...ctx, pins: pinAll(out), pinTolerance: 0.4 * 10 ** -ctx.decimals });
}

// ─── Débutant 11 : les ordres en attente ────────────────────────────────────
// Buy Limit sur l'or : support 3 900 $ touché deux fois, prix actuel 3 920 $, ordre exécuté au retour.
const buyLimitGold = () => build(3936, [
  ...c(3929, 3918, 3906), { c: 3903, l: 3900 }, ...c(3912, 3922), { c: 3928, h: 3931 }, ...c(3919, 3908), { c: 3904, l: 3901 },
  ...c(3913, 3920),                                                     // prix actuel 3 920 $ (11)
  ...c(3914, 3907), { c: 3903, l: 3900 },                               // ordre exécuté (14)
  ...c(3912, 3921, 3929),
], 11101, XAU, [3900]);
// Sell Limit sur le NASDAQ : résistance 27 200 touchée deux fois, prix actuel 27 100, ordre exécuté au retour.
const sellLimitNq = () => build(27150, [
  ...c(27166, 27184), { c: 27194, h: 27200 }, ...c(27176, 27158, 27142, 27160, 27181), { c: 27192, h: 27199 },
  ...c(27170, 27140, 27118, 27100),                                     // prix actuel 27 100 (12)
  ...c(27122, 27150, 27176), { c: 27193, h: 27200 },                    // ordre exécuté (16)
  ...c(27172, 27150),
], 11102, NQ, [27200]);
// Buy Stop sur le NASDAQ : résistance 27 180, prix actuel 27 100, ordre à 27 185 déclenché au breakout.
const buyStopNq = () => build(27120, [
  ...c(27138, 27160), { c: 27172, h: 27180 }, ...c(27155, 27136, 27150, 27168), { c: 27174, h: 27179 },
  ...c(27150, 27128, 27100),                                            // prix actuel 27 100 (10)
  ...c(27122, 27148, 27170), { c: 27196, h: 27200 },                    // déclenché à 27 185 (14)
  ...c(27215, 27230),
], 11103, NQ, [27180]);
// Sell Stop sur EUR/USD : support 1.0820 touché deux fois, prix actuel 1.0850, ordre à 1.0818 déclenché.
const sellStopEu = () => build(1.0838, [
  { c: 1.083 }, { c: 1.0823, l: 1.082 }, ...c(1.0834, 1.0846, 1.0838, 1.0827), { c: 1.0824, l: 1.0821 },
  ...c(1.0836, 1.0845, 1.085),                                          // prix actuel 1.0850 (9)
  ...c(1.0841, 1.083), { c: 1.0812, l: 1.0808 },                        // déclenché à 1.0818 (12)
  ...c(1.0801, 1.0795),
], 11104, EU, [1.082]);

// Stop Loss et Take Profit : résistance 1.0895 (deux rejets), support 1.0833 – 1.0838, entrée 1.0850.
const sltp = () => build(1.0872, [
  { c: 1.0881 }, { c: 1.0891, h: 1.0895 }, ...c(1.0878, 1.0869, 1.088), { c: 1.089, h: 1.0894 },
  ...c(1.0876, 1.0862, 1.085), { c: 1.084, l: 1.0836 }, ...c(1.0849), { c: 1.0858, h: 1.0861 }, ...c(1.0847),
  { c: 1.0838, l: 1.0833 },                                             // creux 1.0833 (13)
  ...c(1.0844), { c: 1.085, l: 1.0843 },                                // entrée 1.0850 (15)
], 11105, EU, [1.0895]);

// Buy Limit complet : résistance H1 1.0905 (deux rejets), creux 1.0800, ancienne résistance 1.0850 touchée
// deux fois puis cassée, dernier creux 1.0830 ; le prix est à 1.0870 quand l'ordre est posé.
const BL_PAST: Step[] = [
  ...c(1.0874, 1.0882), { c: 1.0893 }, { c: 1.0901, h: 1.0905 }, ...c(1.0889, 1.088, 1.0892), { c: 1.0899, h: 1.0904 },
  ...c(1.0884, 1.0866, 1.0846, 1.0826, 1.0808), { c: 1.0804, l: 1.08 },
  ...c(1.0818, 1.0833), { c: 1.0846, h: 1.085, l: 1.0832 }, { c: 1.0837, h: 1.0846 }, { c: 1.0832, l: 1.083 },       // creux 1.0830 (18)
  { c: 1.0841, l: 1.0834 }, { c: 1.0846, h: 1.0849 }, { c: 1.084, h: 1.0846, l: 1.0838 },
  { c: 1.0855, l: 1.0839 }, ...c(1.0866, 1.0878, 1.087),                                                // prix actuel 1.0870 (25)
];
const blPast = () => build(1.0884, BL_PAST, 11106, EU, [1.085, 1.0905]);
const blOutcome = (k: "a" | "b") => () => {
  const past = blPast();
  const steps: Step[] = k === "a"
    ? [...c(1.0861), { c: 1.0852, l: 1.085 }, ...c(1.0864, 1.0876, 1.0889), { c: 1.0898, h: 1.0901 }]
    : [...c(1.0879, 1.0888, 1.0884, 1.0894, 1.0897)];
  return [...past, ...build(past[past.length - 1].c, steps, k === "a" ? 11107 : 11108, EU, [1.085, 1.0905])];
};

// ─── Intermédiaire 10 : figures chartistes ──────────────────────────────────
// Drapeau haussier sur le NASDAQ : mât 27 000 → 27 200, canal descendant (sommets 27 180 puis 27 170,
// creux 27 140, 27 130, 27 120), clôture au-dessus du drapeau.
const bullFlag = () => build(26985, [
  ...c(26992, 27000), { c: 27004, l: 26994 },                           // pied du mât : clôture 27 000 (1)
  ...c(27032, 27068, 27104, 27142, 27178), { c: 27195, h: 27200 },      // sommet du mât (8)
  { c: 27176 }, { c: 27150, l: 27140 }, { c: 27172, h: 27180 }, { c: 27146 }, { c: 27136, l: 27130 },
  { c: 27160, h: 27170 }, { c: 27138 }, { c: 27126, l: 27120 },         // dernier creux du drapeau (16)
  { c: 27150, h: 27154 }, { c: 27168 },                                 // clôture au-dessus du drapeau (18)
  ...c(27192, 27214),
], 11201, { ...NQ, session: "Overlap" });

// Triangles sur EUR/USD H1 : ascendant (sommets 1.0900, creux 1.0840, 1.0860, 1.0880, clôture au-dessus),
// descendant (support 1.0800, sommets descendants), symétrique (sommets descendants, creux ascendants).
const triAsc = () => build(1.085, [
  ...c(1.0866, 1.0884), { c: 1.0895, h: 1.09 }, ...c(1.0878, 1.0858), { c: 1.0846, l: 1.084 },
  ...c(1.0862, 1.0881), { c: 1.0894, h: 1.0899 }, ...c(1.088), { c: 1.0866, l: 1.086 },
  { c: 1.0884 }, { c: 1.0892, l: 1.0882 }, { c: 1.0896, h: 1.09, l: 1.0886 }, { c: 1.0885, h: 1.0893, l: 1.088 }, { c: 1.0893, h: 1.0895, l: 1.0883 },
  { c: 1.0912, l: 1.0886 }, ...c(1.0921),
], 11202, EU, [1.09]);
const triDesc = () => build(1.0842, [
  ...c(1.0852, 1.0864), { c: 1.0866, h: 1.087 }, ...c(1.0848, 1.0828), { c: 1.0806, l: 1.08 },
  ...c(1.0822, 1.084), { c: 1.0846, h: 1.085 }, ...c(1.083, 1.0812), { c: 1.0805, l: 1.0801 },
  ...c(1.0816), { c: 1.0826, h: 1.083 }, ...c(1.0814), { c: 1.0806, l: 1.0803 },
  { c: 1.079 }, ...c(1.0778),
], 11203, EU, [1.08]);
const triSym = () => build(1.083, [
  ...c(1.0852, 1.0872), { c: 1.0876, h: 1.088 }, { c: 1.0856, h: 1.0877 }, ...c(1.0832), { c: 1.0808, l: 1.08 },
  ...c(1.0826, 1.0848), { c: 1.086, h: 1.0865 }, { c: 1.0844, h: 1.0862 }, { c: 1.0826, l: 1.0815 },
  ...c(1.0838), { c: 1.0848, h: 1.0852 }, { c: 1.0838, h: 1.0849 }, { c: 1.0832, l: 1.0828 },
  ...c(1.0844), { c: 1.0862 }, ...c(1.0874),
], 11204, EU);

// Double sommet sur l'or (H1) : support 3 888 $ (deux touches), sommets 3 950 $ et 3 948 $, ligne de cou
// 3 920 $, sommet local 3 930 $, clôture 3 918 $ sous la ligne de cou ; puis retest jusqu'à 3 923 $.
export const DT_STEPS: Step[] = [
  { c: 3895 }, { c: 3891, l: 3888 }, ...c(3899, 3906, 3897), { c: 3892, l: 3889 },
  ...c(3903, 3914, 3926, 3937), { c: 3946, h: 3950 },                  // 1er sommet (10)
  ...c(3939, 3930), { c: 3923, l: 3920 },                               // ligne de cou (13)
  ...c(3929, 3937), { c: 3944, h: 3948 },                               // 2e sommet (16)
  { c: 3936, h: 3946 }, { c: 3926, h: 3937 }, { c: 3922, h: 3927, l: 3921 }, { c: 3924, h: 3926, l: 3921 },
  { c: 3928, h: 3930 },                                                 // sommet local 3 930 $ (21)
  { c: 3925, h: 3928 }, { c: 3918, h: 3926, l: 3915 },                  // clôture sous la ligne de cou (23)
];
const DT_RETEST: Step[] = [
  { c: 3912, h: 3919, l: 3909 }, { c: 3916, h: 3919, l: 3911 }, { c: 3913, h: 3923, l: 3912 },  // retest (26)
  ...c(3905, 3898),
];
const doubleTop = () => build(3902, DT_STEPS, 11205, XAU, [3920]);
const doubleTopRetest = () => { const p = doubleTop(); return [...p, ...build(p[p.length - 1].c, DT_RETEST, 11206, XAU, [3920])]; };

// ─── Intermédiaire 11 : ATR ─────────────────────────────────────────────────
// Lecture : NASDAQ M15, amplitude d'environ 35 points (ATR 35), puis expansion (ATR 55).
const atrReading = () => {
  const s: RStep[] = [];
  const rng = mulberry32(11301);
  let p = 27150;
  for (let i = 0; i < 26; i++) { p += Math.round((rng() - 0.5) * 18); s.push({ c: p, r: 33 + Math.round(rng() * 4) }); }
  for (let i = 0; i < 14; i++) { p += 22 + Math.round(rng() * 10); s.push({ c: p, r: 72 + Math.round(rng() * 8) }); }
  return ranged(27150, s, 11302, { ...NQ, session: "New York" });
};
// Stop : NASDAQ M15, creux 27 090, entrée 27 150, ATR 35 au moment de l'entrée.
const atrStop = () => {
  const path = [27218, 27206, 27214, 27198, 27188, 27195, 27180, 27170, 27176, 27162, 27154, 27160, 27146, 27138, 27144,
    27130, 27122, 27128, 27116, 27120, 27112, 27118, 27108, 27112, 27106];
  const s: RStep[] = path.map((x, i) => ({ c: x, r: [34, 36, 35, 37, 33, 35, 36, 34, 35, 37, 33, 36, 35, 34, 36, 35, 33, 37, 35, 34, 36, 35, 34, 36, 35][i], ...(i >= 22 ? { l: [27095, 27097, 27094][i - 22] } : {}) }));
  s.push({ c: 27104, r: 35, l: 27090 });                                 // creux 27 090 (25)
  s.push({ c: 27120, r: 35, l: 27100 }, { c: 27136, r: 36, l: 27112 }, { c: 27150, r: 35 });  // entrée 27 150 (28)
  return ranged(27210, s, 11303, NQ);
};
// Or M15 : résistance 3 948 $ (deux rejets), support 3 900 $ (deux touches), reprise, entrée 3 912 $, ATR 8.
const atrGold = () => {
  const r = [8, 7, 9, 8, 8, 9, 7, 8, 8, 9, 7, 8, 9, 8, 7, 8, 9, 8, 7, 8, 9, 8, 8, 7, 9, 8, 8, 9, 7, 8, 8, 9, 8, 8];
  const s: RStep[] = [
    { c: 3928 }, { c: 3934 }, { c: 3940 }, { c: 3945, h: 3948 }, { c: 3939 }, { c: 3933 }, { c: 3938 }, { c: 3944, h: 3947 },
    { c: 3937 }, { c: 3930 }, { c: 3924 }, { c: 3918 }, { c: 3912 }, { c: 3906 }, { c: 3903, l: 3900 },
    { c: 3908 }, { c: 3914 }, { c: 3918 }, { c: 3912 }, { c: 3907 }, { c: 3904, l: 3901 },
    { c: 3906 }, { c: 3909 }, { c: 3907 }, { c: 3912 },                 // entrée 3 912 $ (24)
  ].map((x, i) => ({ ...x, r: r[i] }));
  return ranged(3922, s, 11304, XAU);
};
// EUR/USD D1 : amplitude d'environ 70 pips (ATR 70 hier) ; aujourd'hui, plus bas 1.0830, prix 1.0895 (65 pips).
const atrDaily = () => {
  const path = [1.0862, 1.0838, 1.0871, 1.0849, 1.0886, 1.0858, 1.0832, 1.0866, 1.0897, 1.0874, 1.0841, 1.0859, 1.0885, 1.0861,
    1.0828, 1.0846, 1.0873, 1.0851, 1.085];
  const rr = [68, 74, 70, 66, 72, 71, 69, 73, 67, 70, 72, 68, 71, 69, 70, 72, 69, 71, 70];
  const s: RStep[] = path.map((x, i) => ({ c: x, r: rr[i] / 1e4 }));
  s.push({ c: 1.0895, r: 0.0065, l: 1.083 });                           // aujourd'hui : 1.0830 → 1.0895 (19)
  return ranged(1.0855, s, 11305, { ...EU, session: "Overlap" });
};

// ─── Intermédiaire 12 : volatilité ──────────────────────────────────────────
// Quatre environnements (EUR/USD H1, sans niveau) : tendance calme, tendance agitée, range calme, marché agité.
const regime = (kind: "calm" | "wild" | "range" | "chop") => {
  const rng = mulberry32({ calm: 11401, wild: 11402, range: 11403, chop: 11404 }[kind]);
  let p = 1.084;
  const closes: number[] = [];
  for (let i = 0; i < 24; i++) {
    // même pente pour les deux tendances (environ 3 pips par bougie) : seule l'amplitude des allers-retours change
    if (kind === "calm") p += 0.0003 + (i % 4 === 3 ? -0.0006 : 0.0001) + (rng() - 0.5) * 0.0001;
    if (kind === "wild") p += 0.0003 + (i % 3 === 2 ? -0.0016 : 0.0008) + (rng() - 0.5) * 0.0006;
    if (kind === "range") p = 1.084 + 0.0009 * Math.sin(i * 0.8) + (rng() - 0.5) * 0.0003;
    if (kind === "chop") p = 1.084 + 0.0028 * Math.sin(i * 1.7) * (0.6 + rng() * 0.6);
    closes.push(Number(p.toFixed(5)));
  }
  return buildCandles(1.084, c(...closes), { seed: 11405, ...EU, volatility: kind === "calm" || kind === "range" ? "faible" : "élevée" });
};
// Contraction puis expansion sur le NASDAQ M15 : range 27 100 – 27 140, puis breakout à l'ouverture américaine.
const contraction = () => {
  const s: RStep[] = [
    { c: 27128, r: 13 }, { c: 27134, r: 11, h: 27140 }, { c: 27126, r: 12 }, { c: 27118, r: 11 }, { c: 27108, r: 12 },
    { c: 27104, r: 10, l: 27100 }, { c: 27112, r: 11 }, { c: 27122, r: 12 }, { c: 27130, r: 11 }, { c: 27136, r: 10, h: 27140 },
    { c: 27126, r: 12 }, { c: 27116, r: 11 }, { c: 27106, r: 12 }, { c: 27103, r: 10, l: 27101 }, { c: 27114, r: 11 },
    { c: 27124, r: 12 }, { c: 27132, r: 11 },                           // fin de la contraction (16)
    { c: 27168, r: 44 }, { c: 27186, r: 38 }, { c: 27174, r: 36 }, { c: 27206, r: 46 }, { c: 27234, r: 40 },
    { c: 27222, r: 38 }, { c: 27254, r: 44 }, { c: 27262, r: 36 },
  ];
  return ranged(27120, s, 11406, { ...NQ, session: "New York" });
};
// News sur EUR/USD M5 : calme vers 1.0850, publication, plus haut 1.0880, plus bas 1.0830, stabilisation.
const newsSpike = () => buildCandles(1.085, [
  ...c(1.0851, 1.0849, 1.0852, 1.085, 1.0851, 1.0849, 1.0851, 1.085),
  { c: 1.0872, h: 1.088, l: 1.0848 }, { c: 1.0846, h: 1.0874, l: 1.0838 }, { c: 1.0834, l: 1.083 },
  ...c(1.0841, 1.0838, 1.0843, 1.084),
], { seed: 11407, decimals: 5, asset: "EUR/USD", session: "New York", volatility: "élevée", preNews: true, split: NEWS_PRE, pins: [1.088, 1.083, 1.0838, 1.0848] });
// Journées A et B sur l'or (M15) : support 3 900 $, résistance 3 940 $, entrée 3 912 $ ; ATR 5 puis ATR 15.
const volDay = (k: "a" | "b") => () => {
  const A = k === "a";
  const s: RStep[] = A ? [
    { c: 3906, r: 5 }, { c: 3902, r: 5, l: 3900 }, { c: 3907, r: 5 }, { c: 3912, r: 5 }, { c: 3917, r: 5 }, { c: 3922, r: 6 }, { c: 3926, r: 5 },
    { c: 3926, r: 5 }, { c: 3931, r: 5 }, { c: 3936, r: 6 }, { c: 3937, r: 5, h: 3940 }, { c: 3933, r: 5 }, { c: 3929, r: 4 },
    { c: 3933, r: 5 }, { c: 3936, r: 5, h: 3939 }, { c: 3931, r: 5 }, { c: 3926, r: 6 }, { c: 3921, r: 5 }, { c: 3916, r: 5 },
    { c: 3911, r: 5 }, { c: 3906, r: 5 }, { c: 3902, r: 5, l: 3900 }, { c: 3907, r: 5 }, { c: 3912, r: 5 }, { c: 3915, r: 5 },
    { c: 3910, r: 5 }, { c: 3906, r: 4, l: 3904 }, { c: 3909, r: 5 }, { c: 3912, r: 5 },          // entrée 3 912 $ (29)
  ] : [
    { c: 3910, r: 14 }, { c: 3903, r: 14, l: 3900 }, { c: 3914, r: 13 }, { c: 3922, r: 14 },
    { c: 3924, r: 14 }, { c: 3933, r: 14 }, { c: 3929, r: 15, h: 3940 }, { c: 3914, r: 14 }, { c: 3925, r: 14 },
    { c: 3932, r: 14, h: 3939 }, { c: 3917, r: 15 }, { c: 3906, r: 14 }, { c: 3916, r: 14 }, { c: 3903, r: 14, l: 3900 },
    { c: 3919, r: 15 }, { c: 3929, r: 14 }, { c: 3905, r: 14 }, { c: 3897, r: 15, l: 3885 }, { c: 3902, r: 14 },
    { c: 3912, r: 14 },                                                 // entrée 3 912 $ (19)
  ];
  return ranged(A ? 3910 : 3915, s, A ? 11408 : 11409, XAU);
};

// ─── Avancé 13 : Wyckoff ────────────────────────────────────────────────────
// Accumulation type (EUR/USD H4) : PS, SC 1.0800, AR 1.0880, ST, phase B, Spring 1.0790, SOS, LPS.
export const ACC_STEPS: Step[] = [
  ...c(1.0938, 1.0922, 1.0904), { c: 1.0886, l: 1.0878 }, { c: 1.0893 },  // PS (3)
  ...c(1.0876, 1.0852), { c: 1.0812, l: 1.08 },                         // SC (7)
  ...c(1.0834, 1.0858), { c: 1.0872, h: 1.088 },                        // AR (10)
  ...c(1.0856, 1.0832), { c: 1.0818, l: 1.0809 },                       // ST (13)
  ...c(1.0838, 1.0858), { c: 1.0868, h: 1.0876 }, ...c(1.0846, 1.0826), { c: 1.0814, l: 1.0807 },   // phase B (16, 19)
  ...c(1.0832, 1.0848), { c: 1.0836 }, { c: 1.0815, l: 1.079 },         // Spring (23)
  ...c(1.0838, 1.0862), { c: 1.0894 },                                  // SOS (26)
  { c: 1.0898, h: 1.0902, l: 1.0886 }, ...c(1.0887), { c: 1.0879, l: 1.0872 },   // LPS (29)
  { c: 1.0892, l: 1.0876 }, ...c(1.091, 1.0928),
];
const accumulation = () => build(1.095, ACC_STEPS, 11501, { ...EU, session: "Overlap" }, [1.08, 1.088]);
// Distribution type : la même séquence renversée autour de 1.0875 (PSY, BC, AR, ST, UTAD, SOW, LPSY).
const MIRROR = 2 * 1.0875;
const flipStep = (s: Step): Step => ({ c: Number((MIRROR - s.c).toFixed(5)), ...(s.l !== undefined ? { h: Number((MIRROR - s.l).toFixed(5)) } : {}), ...(s.h !== undefined ? { l: Number((MIRROR - s.h).toFixed(5)) } : {}) });
const distribution = () => build(Number((MIRROR - 1.095).toFixed(5)), ACC_STEPS.map(flipStep), 11502, { ...EU, session: "Overlap" }, [Number((MIRROR - 1.08).toFixed(5)), Number((MIRROR - 1.088).toFixed(5))]);
// Accumulation sur le NASDAQ (H1) : 27 300 → 27 000, creux 26 980, rebond 27 180, retour 27 020, Spring 26 960,
// sommet local 27 100 dépassé (SOS), correction 27 070 (LPS).
const wyckoffNq = () => build(27320, [
  ...c(27300, 27262, 27228, 27190, 27150, 27110, 27060, 27012), { c: 26996, l: 26980 },           // SC (8)
  ...c(27030, 27080, 27130), { c: 27168, h: 27180 },                    // AR (12)
  ...c(27140, 27100, 27060), { c: 27030, l: 27020 },                    // ST (16)
  { c: 27064, l: 27026 }, ...c(27110, 27150), { c: 27166, h: 27174 },   // test de la résistance (20)
  ...c(27136, 27096, 27052), { c: 27008, l: 26996 }, { c: 27004, l: 26960 },   // Spring (25)
  ...c(27040, 27076), { c: 27092, h: 27100 },                           // sommet local 27 100 (28)
  { c: 27080, h: 27096 }, ...c(27066, 27088), { c: 27118 },             // SOS (32)
  ...c(27136, 27110), { c: 27084, l: 27070 },                           // LPS (35)
  ...c(27104, 27130, 27160),
], 11503, NQ, [26980, 27100]);

// ─── Avancé 14 : zones ICT/SMC (EUR/USD H1) ─────────────────────────────────
// Breaker : OB haussier 1.0850 – 1.0860 (8), impulsion qui casse 1.0880 et prend la liquidité (12),
// retour sous l'OB et cassure de structure (16), retest de la zone et rejet (19).
const breaker = () => build(1.082, [
  ...c(1.0832, 1.0846, 1.0862, 1.0874), { c: 1.0876, h: 1.088 },        // sommet précédent 1.0880 (4)
  ...c(1.0868, 1.0866), { c: 1.086, l: 1.0857 }, { c: 1.085, h: 1.0861, l: 1.0846 },   // OB (8)
  { c: 1.0866, l: 1.0849 }, ...c(1.0876, 1.0886), { c: 1.0888, h: 1.0892 },             // liquidité prise (12)
  ...c(1.0878, 1.0862, 1.0847, 1.0836),                                 // cassure de structure (16)
  ...c(1.0842), { c: 1.0852, h: 1.0858 }, { c: 1.0844, h: 1.0856 },     // rejet (19)
  ...c(1.083, 1.0818),
], 11601, EU, [1.0846]);
// Mitigation Block : sommet 1.0880, creux structurel 1.0840, lower high 1.0872 sans prise de liquidité (8),
// cassure du creux (11), retour dans la zone et rejet (15).
const mitigation = () => build(1.0846, [
  ...c(1.0858, 1.087), { c: 1.0876, h: 1.088 }, ...c(1.0864, 1.0852), { c: 1.0844, l: 1.084 },   // creux structurel (5)
  ...c(1.0852, 1.086), { c: 1.0866, h: 1.0872 },                        // lower high (8)
  { c: 1.0852, h: 1.0866 }, ...c(1.0842, 1.0832),                       // cassure du creux (11)
  ...c(1.0838, 1.085), { c: 1.0858, h: 1.0864 }, { c: 1.0848, h: 1.0862 },   // rejet (15)
  ...c(1.0834, 1.0822),
], 11602, EU, [1.084]);
// IFVG : FVG haussier 1.0850 – 1.0860 (bougies 2 à 4), clôture sous le FVG (10), retour et rejet (15).
const ifvg = () => build(1.082, [
  ...c(1.0828, 1.0836), { c: 1.0845, h: 1.085 }, { c: 1.0872, l: 1.0844, h: 1.0874 }, { c: 1.0878, l: 1.086 },
  ...c(1.0884), { c: 1.089, h: 1.0894 }, ...c(1.088, 1.087), { c: 1.0862, l: 1.0861 },
  { c: 1.0846 },                                                        // clôture sous le FVG (10)
  ...c(1.0838), { c: 1.0832, l: 1.0828 }, ...c(1.0844), { c: 1.0852, h: 1.0858 }, { c: 1.0842, h: 1.0856 },   // rejet (15)
  ...c(1.0828, 1.0816),
], 11603, EU, [1.085]);
// CE : FVG haussier 1.0840 – 1.0860, milieu 1.0850 ; le prix revient sur le CE (9) et repart.
const ce = () => build(1.0815, [
  ...c(1.0822, 1.083), { c: 1.0836, h: 1.084 }, { c: 1.0866, l: 1.0834, h: 1.0868 }, { c: 1.0874, l: 1.086 },
  ...c(1.0882), { c: 1.0886, h: 1.089 }, ...c(1.0874, 1.0862), { c: 1.0854, l: 1.085 },   // retour sur le CE (9)
  ...c(1.0866, 1.0878, 1.0892),
], 11604, EU);
// BPR : FVG haussier 1.0840 – 1.0860, puis FVG baissier 1.0850 – 1.0870 ; chevauchement 1.0850 – 1.0860.
const bpr = () => build(1.0815, [
  ...c(1.0824, 1.0832), { c: 1.0836, h: 1.084 }, { c: 1.0866, l: 1.0834, h: 1.0868 }, { c: 1.0874, l: 1.086 },
  ...c(1.0882), { c: 1.0886, h: 1.0892 }, { c: 1.0878, l: 1.087 }, { c: 1.0846, h: 1.0876 }, { c: 1.0838, h: 1.085 },
  ...c(1.083, 1.0838, 1.0846), { c: 1.0854, h: 1.0858 }, ...c(1.0846),
], 11605, EU);
// Premium et Discount : range 1.0800 – 1.0900 (deux touches de chaque borne), milieu 1.0850.
const premium = () => build(1.084, [
  ...c(1.0858, 1.0878), { c: 1.0894, h: 1.09 }, ...c(1.0874, 1.085, 1.0826), { c: 1.0806, l: 1.08 },
  ...c(1.0828, 1.0854, 1.088), { c: 1.0893, h: 1.0899 }, ...c(1.087, 1.0842, 1.0818), { c: 1.0805, l: 1.0801 },
  ...c(1.0826, 1.0848, 1.0866, 1.088),
], 11606, EU);

// ─── Avancé 15 : liquidité et timing ────────────────────────────────────────
// Inducement sur l'or (M15) : support majeur 3 890 – 3 900 $, support intermédiaire 3 910 $ (deux touches),
// passage sous 3 910 $ (22), réaction sur le support majeur (23).
const inducement = () => build(3893, [
  ...c(3902, 3918), { c: 3930, l: 3917 }, { c: 3921, l: 3916 }, ...c(3902), { c: 3896, l: 3892 },   // support majeur (5)
  ...c(3908, 3920, 3931), { c: 3940, h: 3944 }, ...c(3930, 3920), { c: 3913, l: 3910 },   // support intermédiaire (12)
  { c: 3922, l: 3913 }, ...c(3934), { c: 3942, h: 3946 }, ...c(3932, 3920), { c: 3914, l: 3911 },   // 2e touche (18)
  { c: 3924, l: 3913 }, ...c(3931, 3920), { c: 3906, l: 3903 },          // stops déclenchés (22)
  { c: 3897, l: 3891 },                                                 // réaction sur le support majeur (23)
  ...c(3905, 3918, 3930, 3942),
], 11701, XAU, [3910]);
// Divergence SMT (H1) : EUR/USD fait un sommet plus haut (1.0880 puis 1.0893), GBP/USD un sommet plus bas.
const smtEu = () => build(1.084, [
  ...c(1.0848, 1.0858, 1.0868), { c: 1.0876, h: 1.088 }, ...c(1.0866, 1.0856), { c: 1.085, l: 1.0846 },
  ...c(1.086, 1.0872, 1.0884), { c: 1.0889, h: 1.0893 }, ...c(1.0878, 1.0864, 1.0852),
], 11702, EU);
const smtGu = () => build(1.333, [
  ...c(1.334, 1.3352, 1.3364), { c: 1.3374, h: 1.338 }, ...c(1.3362, 1.335), { c: 1.3344, l: 1.3338 },
  ...c(1.3352, 1.3362, 1.3368), { c: 1.3369, h: 1.3373 }, ...c(1.3358, 1.3344, 1.333),
], 11703, GU);
// Judas swing sur GBP/USD (M15) : range asiatique 1.3320 – 1.3345, sweep du sommet à l'ouverture de Londres
// (1.3356, clôture revenue dans le range), puis baisse.
const judas = () => build(1.333, [
  { c: 1.3336 }, { c: 1.3341, h: 1.3345 }, ...c(1.3334, 1.3326), { c: 1.3323, l: 1.332 }, ...c(1.333, 1.3337),
  { c: 1.334, h: 1.3344 }, ...c(1.3332, 1.3325), { c: 1.3324, l: 1.3321 }, ...c(1.3331, 1.3338),     // fin de l'Asie (12)
  { c: 1.3343, h: 1.3356 },                                             // sweep à l'ouverture de Londres (13)
  ...c(1.3334, 1.3318, 1.3302, 1.329),
], 11704, { ...GU, session: "Asie" }, [1.3345]);
// Turtle soup sur EUR/USD (H1) : plus haut de la veille 1.0900, mèche à 1.0910, clôture 1.0895, baisse.
const turtle = () => build(1.085, [
  ...c(1.0862, 1.0876, 1.0888), { c: 1.0894, h: 1.09 },                 // plus haut de la veille (3)
  ...c(1.0884, 1.087), { c: 1.0862, l: 1.0858 }, ...c(1.0872, 1.0884, 1.0892),
  { c: 1.0895, h: 1.091 },                                              // turtle soup (10)
  ...c(1.0884, 1.0872, 1.0864, 1.0855),
], 11705, EU, [1.09]);
// Gap d'ouverture sur le NASDAQ (H1) : clôture de référence 27 000, ouverture suivante 27 050, retour vers le milieu.
const gapWeek = () => {
  const fri = build(26960, c(26972, 26985, 26978, 26992, 27004, 26996, 27000), 11706, NQ, [27000]);
  const mon = build(27050, [...c(27062, 27048, 27036, 27030), { c: 27030, l: 27024 }, ...c(27040, 27058)], 11707, NQ, [27050]);
  return [...fri, ...mon];
};
// Exemple combiné sur EUR/USD (H1) : range 1.0800 – 1.0900, sweep à 1.0910, cassure de la structure locale,
// FVG baissier 1.0880 – 1.0890 (CE 1.0885), retour dans le FVG et confirmation (entrée 1.0883).
const combined = () => build(1.083, [
  ...c(1.0844, 1.0858, 1.0872, 1.0884), { c: 1.0894, h: 1.09 },          // haut du range (4)
  ...c(1.0882, 1.0868, 1.0852, 1.0838, 1.0822), { c: 1.0808, l: 1.08 },  // bas du range (10)
  ...c(1.0822, 1.0836, 1.0828), { c: 1.0814, l: 1.0802 },               // 2e touche du bas (14)
  ...c(1.0828, 1.0842, 1.0856, 1.0868, 1.0882), { c: 1.0893, h: 1.0899 },   // 2e touche du haut (20)
  ...c(1.0884), { c: 1.0876, l: 1.0872 },                               // creux local (22)
  { c: 1.0888, l: 1.0874 }, { c: 1.0897, h: 1.091 },                    // sweep à 1.0910 (24)
  { c: 1.0893, l: 1.089, h: 1.0899 }, { c: 1.0861, h: 1.0893 }, { c: 1.0856, h: 1.088 },   // FVG baissier (25 – 27)
  ...c(1.0868), { c: 1.0887, h: 1.0889 }, { c: 1.0883, h: 1.0889, l: 1.0879 },              // entrée 1.0883 (30)
], 11708, EU, [1.09]);

// ─── Stratégie Opening Range Breakout (NASDAQ M5, séance de New York) ────────
// Opening Range 27 080 – 27 150 (9 h 30 – 9 h 45), mèche à 27 155 (4), clôture 27 165 (7, plus haut 27 170),
// retest et creux 27 145 (9), sommet 27 170 cassé : entrée 27 172 (11).
export const ORB_OR: Step[] = [{ c: 27138, h: 27150, l: 27104 }, { c: 27092, h: 27142, l: 27080 }, { c: 27118, h: 27126, l: 27088 }];
const orbMain = () => build(27110, [
  ...ORB_OR, ...c(27132), { c: 27146, h: 27155 }, ...c(27136), { c: 27148, h: 27149 }, { c: 27165, h: 27170, l: 27147 },
  { c: 27160 }, { c: 27150, l: 27145 }, { c: 27158 }, { c: 27172 },
], 11801, NQ, [27150]);
const orbBear = () => build(27110, [...ORB_OR, ...c(27098, 27086), { c: 27065, l: 27060 }, ...c(27050, 27042)], 11802, NQ, [27080]);
const orbNoRetest = () => build(27110, [...ORB_OR, ...c(27140, 27168, 27190, 27212, 27236, 27252), { c: 27258, h: 27260 }], 11803, NQ, [27150]);
const orbFake = () => build(27110, [...ORB_OR, ...c(27140), { c: 27160, h: 27164 }, { c: 27152, l: 27148 }, ...c(27120, 27108)], 11804, NQ, [27150]);
// Contexte H1 : structure haussière (creux 26 900, 27 020, 27 060), résistance 27 250 rejetée deux fois.
const orbH1 = () => build(26960, [
  ...c(26950, 26930), { c: 26908, l: 26900 }, { c: 26946, l: 26904 }, ...c(26998, 27052, 27098), { c: 27132, h: 27140 },
  ...c(27104, 27064), { c: 27032, l: 27020 }, ...c(27076, 27138, 27196), { c: 27238, h: 27250 },
  ...c(27206, 27160, 27118), { c: 27080, l: 27060 }, ...c(27124, 27182), { c: 27236, h: 27248 },
  ...c(27196, 27150, 27112),
], 11805, NQ, [27250]);

// ─── Stratégie Wyckoff appliqué ─────────────────────────────────────────────
// Or H1 : baisse jusqu'à 3 880 $ (SC), rebond 3 960 $ (AR), retour 3 890 $ (ST), 3 940 $, Spring 3 865 $,
// sommet local 3 925 $ dépassé (SOS), LPS 3 905 $.
export const WA_RANGE_END = 18;
const WA_STEPS: Step[] = [
  ...c(3978, 3962, 3946, 3930, 3912, 3894), { c: 3884, l: 3880 },        // SC (6)
  { c: 3904, l: 3883 }, ...c(3926, 3946), { c: 3955, h: 3960 },         // AR (10)
  ...c(3938, 3918, 3898), { c: 3893, l: 3890 },                         // ST (14)
  { c: 3906, l: 3905 }, ...c(3922), { c: 3934, h: 3940 }, { c: 3926, h: 3935 },   // 2e touche de la résistance (17)
];
const waGold = () => build(3990, [
  ...WA_STEPS,
  ...c(3912, 3896), { c: 3884, l: 3865 },                               // Spring (21)
  ...c(3898, 3910), { c: 3920, h: 3925 }, { c: 3913, h: 3922 }, ...c(3906, 3918), { c: 3930 },   // sommet local (24), SOS (28)
  ...c(3926, 3914), { c: 3907, l: 3905 },                               // LPS (31)
  { c: 3913, l: 3908 }, ...c(3918),
], 11901, XAU, [3880, 3925]);
const waFailed = () => build(3990, [...WA_STEPS, ...c(3912), { c: 3896, l: 3892 }, { c: 3884, l: 3881 }, { c: 3870, l: 3866 }, ...c(3856, 3842)], 11902, XAU, [3880]);
// Or M15 : LPS 3 905 $, sommet local 3 912 $ cassé (entrée 3 914 $), puis sommet 3 920 $ cassé (entrée 3 922 $).
const waM15 = () => build(3930, [
  ...c(3926, 3921, 3916, 3910), { c: 3907, l: 3905 },                   // LPS (4)
  { c: 3910 }, { c: 3911, h: 3912 }, { c: 3909, h: 3911 }, { c: 3908, l: 3906 },   // sommet local 3 912 $ (6)
  { c: 3914 },                                                          // entrée 3 914 $ (9)
  ...c(3917), { c: 3919, h: 3920 }, { c: 3916, h: 3919 }, { c: 3915 },   // sommet 3 920 $ (11)
  { c: 3922 },                                                          // entrée tardive 3 922 $ (14)
], 11903, { ...XAU, session: "Londres" }, [3912, 3920]);
// NASDAQ H1 : hausse, BC 27 300, AR 27 100, ST 27 296, retour 27 104, support local 27 180, UTAD 27 340,
// SOW sous 27 180, LPSY 27 230, entrée 27 205.
const waNq = () => build(26980, [
  ...c(27020, 27064, 27110, 27160, 27210, 27256), { c: 27288, h: 27300 },   // BC (6)
  { c: 27250, h: 27292 }, ...c(27196, 27140), { c: 27112, l: 27100 },   // AR (10)
  ...c(27150, 27200, 27250), { c: 27286, h: 27296 },                    // ST (14)
  ...c(27240, 27180, 27130), { c: 27108, l: 27104 },                    // 2e touche du support (18)
  ...c(27190), { c: 27220, l: 27188 }, { c: 27204, l: 27196 }, { c: 27188, l: 27180 },   // support local 27 180 (22)
  { c: 27214, l: 27186 }, ...c(27256, 27288), { c: 27286, h: 27340 },   // UTAD (26)
  ...c(27244, 27200, 27166),                                            // SOW (29)
  ...c(27150, 27178, 27212), { c: 27220, h: 27230 },                    // LPSY (33)
  { c: 27205, h: 27226 },                                               // entrée 27 205 (34)
  ...c(27196, 27186),
], 11904, NQ, [27180, 27300]);

export const NOUVELLES_SCENARIOS: Record<string, () => Candle[]> = {
  "ord-buy-limit": buyLimitGold, "ord-sell-limit": sellLimitNq, "ord-buy-stop": buyStopNq, "ord-sell-stop": sellStopEu,
  "ord-sltp": sltp, "ord-bl-past": blPast, "ord-bl-a": blOutcome("a"), "ord-bl-b": blOutcome("b"),
  "fig-flag": bullFlag, "fig-tri-asc": triAsc, "fig-tri-desc": triDesc, "fig-tri-sym": triSym,
  "fig-dt": doubleTop, "fig-dt-retest": doubleTopRetest,
  "atr-reading": atrReading, "atr-stop": atrStop, "atr-gold": atrGold, "atr-daily": atrDaily,
  "vol-calm": () => regime("calm"), "vol-wild": () => regime("wild"), "vol-range": () => regime("range"), "vol-chop": () => regime("chop"),
  "vol-contraction": contraction, "vol-news": newsSpike, "vol-day-a": volDay("a"), "vol-day-b": volDay("b"),
  "wy-acc": accumulation, "wy-dist": distribution, "wy-nq": wyckoffNq,
  "ict-breaker": breaker, "ict-mitigation": mitigation, "ict-ifvg": ifvg, "ict-ce": ce, "ict-bpr": bpr, "ict-premium": premium,
  "ict-inducement": inducement, "ict-smt-eu": smtEu, "ict-smt-gu": smtGu, "ict-judas": judas, "ict-turtle": turtle,
  "ict-gap": gapWeek, "ict-combined": combined,
  "orb-main": orbMain, "orb-bear": orbBear, "orb-no-retest": orbNoRetest, "orb-fake": orbFake, "orb-h1": orbH1,
  "wa-gold": waGold, "wa-failed": waFailed, "wa-m15": waM15, "wa-nq": waNq,
};
