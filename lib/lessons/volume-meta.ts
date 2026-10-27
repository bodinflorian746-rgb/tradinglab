// Constantes des scénarios de volumes (Trading Avancé 10 à 12) utilisées par les schémas, sans la
// bibliothèque de formes des bougies (lib/lessons/scenarios-volume.ts les construit).

import type { VCandle } from "./volume";

/** Volume Profile : rangées du range EUR/USD (5 pips) */
export const VP_ROW = 0.0005;
/** Exemple pratique EUR/USD : rangées (2 pips), plage du profil (consolidation), sommet local M15, plan */
export const VPT_ROW = 0.0002;
export const VPT_PROFILE: [number, number] = [21, 27];
export const VPT_LOCAL_HIGH = 7;
export const VPT_TRADE = { entry: 1.0855, sl: 1.0835, tp: 1.0895 };
/** LVN NASDAQ : rangées (10 points), plage du profil (avant la cassure), cassure de 27 100 */
export const LVN_ROW = 10;
export const LVN_PROFILE: [number, number] = [0, 21];
export const LVN_BREAK = 22;
/** VWAP NASDAQ : plan (entrée sur la cassure du sommet local de la correction) */
export const VWN_TRADE = { entry: 27155, sl: 27125, tp: 27215 };
/** VWAP or : plan (vente sur la cassure du creux local) */
export const VWX_TRADE = { entry: 3897, sl: 3907, tp: 3877 };
/** VWAP ancré : bougie de la publication, retour sur le VWAP ancré */
export const AVW_ANCHOR = 10;
export const AVW_TOUCH = 19;

/** Bougies d'une unité de temps supérieure (n bougies par bougie), volumes additionnés */
export function aggregateV(cs: VCandle[], n: number): VCandle[] {
  const out: VCandle[] = [];
  for (let i = 0; i < cs.length; i += n) {
    const g = cs.slice(i, i + n);
    out.push({ o: g[0].o, c: g[g.length - 1].c, h: Math.max(...g.map((k) => k.h)), l: Math.min(...g.map((k) => k.l)), v: g.reduce((s, k) => s + k.v, 0) });
  }
  return out;
}
