// Plan de trade d'un schéma de leçon : niveaux entrée / SL / TP et puces risque,
// gain, R/R calculés (jamais écrits à la main). Les attributs data-* de la puce
// R/R permettent à l'audit de recalculer le ratio.

import { fmtPrice, fmtRR, pips, tradeMath } from "@/lib/lessons/chart-analysis";
import type { LCChip, LCLevel } from "./LessonChart";

export interface TradeSpec {
  entry: number;
  sl: number;
  tp: number;
  /** "$" : or, indices (écarts en $) ; sinon forex (écarts en pips) */
  unit?: "$" | "pips";
  decimals?: number;
  /** Libellés (défaut : « Entrée », « SL », « TP ») */
  names?: { entry?: string; sl?: string; tp?: string };
  /** Contrainte du texte sur le R/R (audit) : « >2 », « <2 »… */
  expect?: string;
  /** Début des lignes (indice de la bougie d'entrée) */
  from?: number;
  /** TP hors cadre : étiquette « TP … ↑/↓ » au bord */
  tpOffscale?: boolean;
}

export const usd = (x: number) => fmtPrice(Math.round(x), 0, "$");

export function priceText(x: number, s: Pick<TradeSpec, "unit" | "decimals">) {
  return s.unit === "$" ? fmtPrice(x, s.decimals ?? 0, "$") : fmtPrice(x, s.decimals ?? 4);
}

export function distText(a: number, b: number, s: Pick<TradeSpec, "unit">) {
  return s.unit === "$" ? usd(Math.abs(a - b)) : `${pips(a, b, 0.0001)} pips`;
}

export function tradeSetup(s: TradeSpec): { levels: LCLevel[]; chips: LCChip[]; offscale: { key: string; price: number; label: string; tone: "bull" }[]; rr: number } {
  const m = tradeMath(s.entry, s.sl, s.tp);
  const n = { entry: "Entrée", sl: "SL", tp: "TP", ...s.names };
  const p = (x: number) => priceText(x, s);
  const levels: LCLevel[] = [
    { key: "entry", price: s.entry, from: s.from, label: `${n.entry} ${p(s.entry)}`, short: n.entry, tone: "entry" },
    { key: "sl", price: s.sl, from: s.from, label: `${n.sl} ${p(s.sl)}`, short: n.sl, tone: "bear", dashed: true },
  ];
  const offscale: { key: string; price: number; label: string; tone: "bull" }[] = [];
  if (s.tpOffscale) offscale.push({ key: "tp", price: s.tp, label: `${n.tp} ${p(s.tp)} ${s.tp > s.entry ? "↑" : "↓"}`, tone: "bull" });
  else levels.push({ key: "tp", price: s.tp, from: s.from, label: `${n.tp} ${p(s.tp)}`, short: n.tp, tone: "bull", dashed: true });
  const chips: LCChip[] = [
    { label: `Risque ${distText(s.entry, s.sl, s)}`, tone: "bear" },
    { label: `Gain visé ${distText(s.tp, s.entry, s)}`, tone: "bull" },
    { label: `R/R ${fmtRR(m.rr)}`, tone: "entry", data: { rr: fmtRR(m.rr), entry: s.entry, sl: s.sl, tp: s.tp, ...(s.expect ? { expect: s.expect } : {}) } },
  ];
  return { levels, chips, offscale, rr: m.rr };
}

/** Prix en dollars au format des leçons débutant : « 78 000 $ » (espace avant $). */
export const usdSp = (x: number) => `${fmtPrice(Math.round(x), 0, "$").replace("$", "")} $`;
