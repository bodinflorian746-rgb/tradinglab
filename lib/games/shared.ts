// Moteur partagé pour tous les mini-jeux TradingLab.
// Contient les types de base, le PRNG seedé, les pools de variation,
// et les helpers de construction de bougies / domaine de chart.

// ─── Types communs ────────────────────────────────────────────────────────────

export type Asset        = "EUR/USD" | "XAU/USD" | "BTC/USD" | "NASDAQ";
export type Session      = "Asie" | "Londres" | "New York" | "Overlap" | "Heures mortes";
export type Volatility   = "faible" | "normale" | "élevée";
export type Spread       = "faible" | "élevé";
export type HtfBias      = "bullish" | "bearish" | "range";
export type MacroContext = "normal" | "dangereux";

export interface Candle { o: number; h: number; l: number; c: number }

export type ZoneKind = "support" | "resistance" | "fvg" | "liquidity_low" | "liquidity_high";

export interface ChartZone {
  kind:  ZoneKind;
  y1:    number;
  y2:    number;
  label: string;
}

export interface ChartData {
  candles: Candle[];
  zones:   ChartZone[];
  domain:  { min: number; max: number };
}

// ─── Constantes ───────────────────────────────────────────────────────────────

export const VOL_MULT: Record<Volatility, number> = {
  "faible":  0.75,
  "normale": 1.0,
  "élevée":  1.35,
};

// ─── PRNG seedé (mulberry32) ──────────────────────────────────────────────────

export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function shuffle<T>(arr: T[], rng: () => number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ─── Helpers de bougies ───────────────────────────────────────────────────────

export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function candle(o: number, c: number, wU: number, wD: number): Candle {
  return { o, c, h: Math.max(o, c) + wU, l: Math.min(o, c) - wD };
}

export function chartDomain(
  candles: Candle[],
  zones:   ChartZone[],
  extras:  number[] = [],
  pad = 0.08,
): { min: number; max: number } {
  const vals: number[] = [];
  for (const k of candles) { vals.push(k.h, k.l); }
  for (const z of zones)   { vals.push(z.y1, z.y2); }
  for (const e of extras)  { vals.push(e); }
  if (vals.length === 0) return { min: 0, max: 1 };
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const padding = (max - min) * pad || 1;
  return { min: min - padding, max: max + padding };
}
