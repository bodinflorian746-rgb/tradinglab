// Construction des bougies des schémas de leçons à partir de prix : l'auteur
// écrit les clôtures (et, au besoin, les extrêmes d'une bougie clé) ; chaque
// bougie ouvre à la clôture précédente ; la passe de réalisme des jeux
// (lib/games/candle-realism.ts, bibliothèque de formes réelles) donne les
// proportions des corps et des mèches.
// Utilisé hors du site : scripts/lessons/gen-charts.ts écrit le résultat dans
// lib/lessons/generated/candles.json (les schémas n'embarquent pas la
// bibliothèque de formes) ; l'audit vérifie que ce fichier est à jour.

import { mulberry32, type Asset, type Session, type Volatility } from "@/lib/games/shared";
import { realizeCandles } from "@/lib/games/candle-realism";
import type { Candle } from "./chart-analysis";

/** Bougie écrite par l'auteur : clôture, extrêmes imposés facultatifs. */
export interface Step { c: number; h?: number; l?: number }

export interface BuildOptions {
  seed: number;
  /** Décimales du prix (arrondi final : continuité exacte) */
  decimals: number;
  /** Niveaux clés : chaque clôture et chaque mèche reste du même côté */
  levels?: number[];
  /** Prix figés à ± tolérance près (bornes d'une zone, extrême d'un pivot) */
  pins?: number[];
  pinTolerance?: number;
  asset?: Asset;
  session?: Session;
  volatility?: Volatility;
  preNews?: boolean;
  /** Indice de la 1re bougie « après » (ex. publication d'une news) : extrêmes du calme et de la suite traités à part */
  split?: number;
}

const median = (a: number[]) => {
  const s = [...a].sort((x, y) => x - y);
  return s.length ? s[Math.floor(s.length / 2)] : 0;
};

export function buildCandles(open: number, steps: Step[], opts: BuildOptions): Candle[] {
  const rng = mulberry32(opts.seed);
  const bodies = steps.map((s, i) => Math.abs(s.c - (i ? steps[i - 1].c : open))).filter((b) => b > 0);
  const med = median(bodies) || 10 ** -opts.decimals;
  let o = open;
  const raw: Candle[] = steps.map((s) => {
    const top = Math.max(o, s.c), bot = Math.min(o, s.c);
    const h = s.h ?? top + med * (0.1 + 0.4 * rng());
    const l = s.l ?? bot - med * (0.1 + 0.4 * rng());
    const k = { o, h: Math.max(h, top), l: Math.min(l, bot), c: s.c };
    o = s.c;
    return k;
  });
  const tol = opts.pinTolerance ?? 0.4 * 10 ** -opts.decimals;
  const levels = [...(opts.levels ?? []), ...(opts.pins ?? []).flatMap((p) => [p - tol, p + tol])];
  const split = opts.split ?? raw.length;
  const res = realizeCandles(raw.slice(0, split), raw.slice(split), levels, opts.seed, {
    asset: opts.asset, session: opts.session, volatility: opts.volatility, preNews: opts.preNews,
  });
  const real = [...res.past, ...res.future];
  // Mèches plafonnées par une borne (niveau clé, extrême figé) : plusieurs
  // bougies voisines finissaient au même prix, de faux « equal highs / lows ».
  // Une mèche non imposée par l'auteur collée à un niveau ou à l'extrême d'une
  // voisine est raccourcie (elle ne peut que s'éloigner des niveaux).
  const pip = 10 ** -(opts.decimals - 1);
  const near = (x: number, side: "h" | "l", i: number) =>
    levels.some((K) => Math.abs(x - K) < 0.6 * pip)
    || real.some((k, j) => j !== i && Math.abs(j - i) <= 3 && Math.abs(k[side] - x) < 0.3 * pip);
  real.forEach((k, i) => {
    const top = Math.max(k.o, k.c), bot = Math.min(k.o, k.c);
    if (steps[i].h === undefined && k.h > top && near(k.h, "h", i)) k.h = top + (k.h - top) * (0.45 + 0.25 * rng());
    if (steps[i].l === undefined && k.l < bot && near(k.l, "l", i)) k.l = bot - (bot - k.l) * (0.45 + 0.25 * rng());
  });
  // Arrondi au pas du prix, ouverture = clôture précédente arrondie
  const r = (p: number) => Number(p.toFixed(opts.decimals));
  const out: Candle[] = [];
  for (const k of real) {
    const ko = out.length ? out[out.length - 1].c : r(k.o);
    let kc = r(k.c);
    // l'arrondi ne doit pas créer de clôture égale à l'ouverture : un tick dans le sens de la bougie
    if (kc === ko) kc = r(ko + (k.c >= k.o ? 1 : -1) * 10 ** -opts.decimals);
    out.push({ o: ko, c: kc, h: Math.max(r(k.h), ko, kc), l: Math.min(r(k.l), ko, kc) });
  }
  return out;
}
