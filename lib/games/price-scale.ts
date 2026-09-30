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

export const ASSET_SCALE: Record<Asset, AssetScale> = {
  "EUR/USD": { unit: 0.0012, lo: 1.05,  hi: 1.18,  decimals: 4, round: 0.01 },
  "XAU/USD": { unit: 6,      lo: 2300,  hi: 2900,  decimals: 2, round: 50 },
  "BTC/USD": { unit: 300,    lo: 58000, hi: 98000, decimals: 0, round: 1000 },
  "NASDAQ":  { unit: 25,     lo: 17000, hi: 21000, decimals: 1, round: 100 },
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

/** Prix formaté selon l'actif (EUR/USD 1.0843, XAU/USD 2384.15, BTC/USD 67432, NASDAQ 18234.5). */
export function formatPrice(asset: Asset | undefined, p: number): string {
  return p.toFixed(assetDecimals(asset));
}
