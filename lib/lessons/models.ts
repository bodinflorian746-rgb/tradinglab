// Modèles des schémas de leçons : ce que chaque schéma montre (pivots, zones,
// niveaux, entrées, R/R) calculé à partir des prix. Partagés par les schémas
// (rendu) et par l'audit (scripts/audit-lecons/data.ts), qui vérifie qu'ils
// redonnent les chiffres du texte des leçons.

import { aggregate, crossing, fibLevel, lastOpposite, lineAt, orderBlock, pivotAt, pivots, tradeMath, type Candle } from "./chart-analysis";
import { CONFLUENCE_LINES, type ConfluenceVariant } from "./line-data";
import CANDLES from "./generated/candles.json";

export const PIP = 0.0001;

// ─── Confluence (Trading Intermédiaire 5, Support-résistance 2) ─────────────

export function confluenceModel(variant: ConfluenceVariant) {
  const line = [...CONFLUENCE_LINES[variant]];
  const piv = pivots(line, 2);
  const lows = piv.filter((q) => q.side === "l");
  const highs = piv.filter((q) => q.side === "h");
  const A = lows[0];                                     // départ de l'impulsion
  const B = highs[highs.length - 1];                     // sommet de l'impulsion
  const [L1, L2] = lows.filter((q) => q.index > A.index && q.index < B.index).slice(-2);
  const fib = fibLevel(A.price, B.price, 0.618);
  const support = Math.max(L1.price, L2.price);          // niveau des deux rebonds
  const round = Math.round(support * 100) / 100;         // chiffre rond le plus proche (1.1800)
  const levels = variant === "structure" ? [support, L2.price, fib] : [support, round, fib];
  const zone = { y1: Math.min(...levels) - 2 * PIP, y2: Math.max(...levels) + 2 * PIP };
  return { line, piv, A, B, L1, L2, fib, support, round, zone };
}

// ─── Entrées de précision (Trading Avancé 7) ────────────────────────────────

export const PRECISION_MARGIN = 3 * PIP;                 // « 2 à 5 pips » sous le niveau

export function precisionModel() {
  const H1 = CANDLES["precision-entry-h1"] as Candle[];
  const M15 = CANDLES["precision-entry-m15"] as Candle[];
  const h1All = [...H1, ...aggregate(M15, 4)];
  // Impulsion haussière : 1re bougie verte après le plus bas ; l'OB est la dernière rouge avant elle
  const lowI = H1.reduce((b, k, i) => (k.l < H1[b].l ? i : b), 0);
  const impulse = H1.findIndex((k, i) => i >= lowI && k.c > k.o);
  const obI = lastOpposite(H1, impulse, "bull");
  const ob = orderBlock(H1, obI);
  const prior = pivotAt(H1, 2, "h");                     // sommet cassé par le BOS
  const bosI = H1.findIndex((k, i) => i > obI && k.c > prior.price);
  const top = pivotAt(h1All, 15, "h");                   // objectif : sommet de l'impulsion
  // Entrée imprécise : 1re bougie M15 qui touche le haut de la zone ; SL sous toute la zone
  const touchI = M15.findIndex((k) => k.l <= ob.y2);
  const loose = { entry: ob.y2, sl: ob.y1 - PRECISION_MARGIN, tp: top.price };
  // Entrée de précision : pin bar haussière dans la zone ; entrée à sa clôture, SL sous sa mèche
  const pinI = M15.findIndex((k) => k.c > k.o && Math.min(k.o, k.c) - k.l >= 2 * (k.c - k.o) && k.l >= ob.y1 && k.l <= ob.y2);
  const pin = M15[pinI];
  const sharp = { entry: pin.c, sl: pin.l - PRECISION_MARGIN, tp: top.price };
  return {
    H1, M15, h1All, obI, ob, prior, bosI, top, touchI, pinI, pin, loose, sharp,
    looseRR: tradeMath(loose.entry, loose.sl, loose.tp).rr, sharpRR: tradeMath(sharp.entry, sharp.sl, sharp.tp).rr,
  };
}

// ─── ETE, ligne de cou inclinée (Reversal 2) ────────────────────────────────

export function headShouldersModel(line: number[]) {
  const piv = pivots(line, 2);
  const head = piv.filter((q) => q.side === "h").reduce((a, b) => (b.price > a.price ? b : a));
  const ls = piv.filter((q) => q.side === "h" && q.index < head.index).at(-1)!;
  const rs = piv.filter((q) => q.side === "h" && q.index > head.index)[0];
  const t1 = piv.filter((q) => q.side === "l" && q.index > ls.index && q.index < head.index).at(-1)!;
  const t2 = piv.filter((q) => q.side === "l" && q.index > head.index && q.index < rs.index)[0];
  const neck = (i: number) => lineAt(t1.index, t1.price, t2.index, t2.price, i);
  // Méthode standard : hauteur tête → ligne de cou à la verticale de la tête, reportée sous le point de breakout
  const height = head.price - neck(head.index);
  const bo = crossing(line, neck, rs.index, "down")!;
  return { piv, head, ls, rs, t1, t2, neck, height, bo, tp: bo.price - height };
}
