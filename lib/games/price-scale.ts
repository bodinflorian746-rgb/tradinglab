// Échelle de prix réaliste par actif. Les générateurs travaillent dans une
// échelle abstraite (≈ 0,5 unité par corps de bougie) ; la conversion est une
// fonction affine appliquée au dernier moment : distances relatives, touches,
// ordres et R/R sont conservés.

import { mulberry32, type Asset, type Candle, type ChartZone } from "./shared";

export interface AssetScale {
  /** Valeur d'une unité abstraite dans l'actif (≈ corps d'une bougie M15 × 2). */
  unit:     number;
  /** Plage réaliste du prix d'ancrage. */
  lo:       number;
  hi:       number;
  decimals: number;
  /** Pas d'un « chiffre rond » (big figure, niveau psychologique). */
  round:    number;
}

// Calées sur 12 mois de données M15 (sept. 2025 – août 2026) : plage = prix de
// clôture entre les centiles 5 et 95 ; unité = amplitude M15 médiane réelle /
// amplitude médiane des bougies générées (≈ 1 unité abstraite).
export const ASSET_SCALE: Record<Asset, AssetScale> = {
  "EUR/USD": { unit: 0.0005, lo: 1.14,  hi: 1.18,   decimals: 5, round: 0.01 },
  "XAU/USD": { unit: 8,      lo: 3670,  hi: 5150,   decimals: 2, round: 50 },
  "BTC/USD": { unit: 210,    lo: 62500, hi: 115600, decimals: 0, round: 1000 },
  "NASDAQ":  { unit: 31,     lo: 24000, hi: 30100,  decimals: 1, round: 100 },
};

/** Prix d'ancrage tiré de la graine du round (arrondi au pas de cotation, ou chiffre rond). */
export function anchorPrice(asset: Asset, seed: number, round = false): number {
  const s = ASSET_SCALE[asset];
  const u = mulberry32((seed ^ 0x27D4EB2D) >>> 0)();
  const raw = s.lo + u * (s.hi - s.lo);
  const step = round ? s.round : Math.pow(10, -s.decimals);
  return Number((Math.round(raw / step) * step).toFixed(s.decimals));
}

export type PriceMap = (p: number) => number;

/** p ↦ anchorReal + (p − anchorAbs) × unit */
export function linearPriceMap(anchorAbs: number, anchorReal: number, unit: number): PriceMap {
  return (p) => anchorReal + (p - anchorAbs) * unit;
}

export function assetPriceMap(asset: Asset, seed: number, anchorAbs: number, opts: { round?: boolean; unit?: number } = {}): PriceMap {
  return linearPriceMap(anchorAbs, anchorPrice(asset, seed, opts.round), opts.unit ?? ASSET_SCALE[asset].unit);
}

export const mapCandle = (f: PriceMap) => (k: Candle): Candle => ({ o: f(k.o), h: f(k.h), l: f(k.l), c: f(k.c) });
export const mapZone = (f: PriceMap) => (z: ChartZone): ChartZone => ({ ...z, y1: f(z.y1), y2: f(z.y2) });
export const mapDomain = (f: PriceMap, d: { min: number; max: number }) => ({ min: f(d.min), max: f(d.max) });

export function assetDecimals(asset: Asset | undefined): number {
  return asset ? ASSET_SCALE[asset].decimals : 2;
}

/** Prix formaté selon l'actif (EUR/USD 1.16432, XAU/USD 4384.15, BTC/USD 97432, NASDAQ 27234.5). */
export function formatPrice(asset: Asset | undefined, p: number): string {
  return p.toFixed(assetDecimals(asset));
}
