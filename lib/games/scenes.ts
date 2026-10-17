// Scènes de graphique réutilisables par les mini-jeux (unités abstraites, sens haussier).
// Le sens baissier d'une scène s'obtient par miroir (prix, zones, libellés) : une variante de sens
// garde exactement la même structure, avec ses propres textes.
//
// Conventions : `m` = multiplicateur de volatilité (VOL_MULT), toutes les tailles en `m` (bougies),
// jamais en hauteur de cadre. Un support est une bande [lo, hi].

import { candle, levelTouches, type Candle, type ChartZone, type ZoneKind } from "./shared";

export type Rng = () => number;

// ─── Miroir ──────────────────────────────────────────────────────────────────

const PAIRS: [string, string][] = [
  ["Support", "Résistance"], ["Support cassé", "Résistance cassée"], ["Support UT supérieure", "Résistance UT supérieure"],
  ["Bas du range", "Haut du range"], ["Plus bas précédent", "Plus haut précédent"], ["Swing low", "Swing high"],
  ["Swing low 1", "Swing high 1"], ["Swing low 2", "Swing high 2"], ["Swing low 3", "Swing high 3"],
  ["Swing low évident", "Swing high évident"], ["Liquidité en-dessous", "Liquidité au-dessus"], ["Sweep bas", "Sweep haut"],
  ["FVG haussier", "FVG baissier"], ["Equal lows", "Equal highs"], ["PDL", "PDH"],
  ["Ancienne résistance → support", "Ancien support → résistance"], ["Résistance → support", "Support → résistance"],
  ["Haut de la session asiatique", "Bas de la session asiatique"], ["Swing low H1", "Swing high H1"], ["HL H4", "LH H4"],
];
const MIRROR = new Map<string, string>(PAIRS.flatMap(([a, b]) => [[a, b], [b, a]] as [string, string][]));
/** Libellé de la zone miroir (un libellé sans sens, « Order Block », « Chiffre rond », reste tel quel) */
export const mirrorLabel = (l: string): string => MIRROR.get(l) ?? l;

const KIND: Record<ZoneKind, ZoneKind> = { support: "resistance", resistance: "support", fvg: "fvg", liquidity_low: "liquidity_high", liquidity_high: "liquidity_low" };

export const mirrorCandles = (cs: Candle[], A: number): Candle[] => cs.map((k) => ({ o: A - k.o, c: A - k.c, h: A - k.l, l: A - k.h }));
export const mirrorZones = (zs: ChartZone[], A: number): ChartZone[] => zs.map((z) => ({
  ...z, kind: KIND[z.kind], y1: A - z.y2, y2: A - z.y1, label: mirrorLabel(z.label), ...(z.short ? { short: mirrorLabel(z.short) } : {}),
}));
/** Axe qui garde les prix dans la même plage (utile aux graphiques à prix positifs) */
export const mirrorAxis = (cs: Candle[]): number => Math.min(...cs.map((k) => k.l)) + Math.max(...cs.map((k) => k.h));

// ─── Jambes et bougies ───────────────────────────────────────────────────────

/** Jambe vers une cible : pas de 0,45 à 0,75 bougie, petit repli une fois sur trois, mèches réelles */
export function legTo(rng: Rng, m: number, p: number, target: number, o: { step?: [number, number]; retrace?: number } = {}): { candles: Candle[]; p: number } {
  const [s0, s1] = o.step ?? [0.45, 0.75];
  const retrace = o.retrace ?? 0.33;
  const out: Candle[] = [];
  const dir = Math.sign(target - p) || 1;
  const w = () => (0.08 + rng() * 0.17) * m;
  let guard = 0;
  while (Math.abs(target - p) > s1 * m && guard++ < 40) {
    const c = p + dir * (s0 + rng() * (s1 - s0)) * m;
    out.push(candle(p, c, w(), w()));
    p = c;
    if (rng() < retrace && Math.abs(target - p) > s1 * m) {
      const r = p - dir * (0.08 + rng() * 0.14) * m;
      out.push(candle(p, r, w() * 0.8, w() * 0.8));
      p = r;
    }
  }
  if (Math.abs(target - p) > 0.02 * m) { out.push(candle(p, target, w(), w())); p = target; }
  return { candles: out, p };
}

/** Support prouvé par deux touches (le prix vient d'au-dessus) ; fin au sommet de la dernière réaction */
export function provenSupport(rng: Rng, m: number, lo: number, hi: number, start?: number): { candles: Candle[]; p: number } {
  return levelTouches(rng, start ?? hi + (2.4 + rng() * 0.5) * m, lo, hi, "above", m);
}
/** Résistance prouvée par deux touches (le prix vient d'en dessous) */
export function provenResistance(rng: Rng, m: number, lo: number, hi: number, start?: number): { candles: Candle[]; p: number } {
  return levelTouches(rng, start ?? lo - (2.4 + rng() * 0.5) * m, lo, hi, "below", m);
}

export type BullSignal = "marteau" | "engulfing" | "doji" | "doji_confirme" | "double_meche";

/**
 * Signal haussier posé sur la bande [lo, hi] (le prix arrive d'au-dessus, vers hi + 0,5 bougie) :
 * marteau (petit corps en haut, mèche basse ≥ 2,5 × le corps, pointe dans la zone), engulfing
 * haussier (bougie rouge dont la mèche touche la zone, puis verte qui avale son corps), doji
 * (corps quasi nul, mèches des deux côtés), doji confirmé (doji puis bougie verte qui clôture
 * au-dessus de son plus haut), double mèche (deux mèches basses de suite dans la zone).
 * Renvoie aussi l'indice (dans `candles`) de la bougie signal et le plus bas du signal.
 */
export function bullSignal(rng: Rng, m: number, p: number, lo: number, hi: number, kind: BullSignal, color: "verte" | "rouge" = rng() < 0.6 ? "rouge" : "verte"): { candles: Candle[]; p: number; at: number; low: number } {
  const out: Candle[] = [];
  const tip = () => lo + (hi - lo) * (0.25 + rng() * 0.5);
  const push = (k: Candle) => { out.push(k); p = k.c; };
  const reach = (target: number) => { if (Math.abs(p - target) > 0.04 * m) push(candle(p, target, (0.05 + rng() * 0.08) * m, (0.04 + rng() * 0.05) * m)); };
  switch (kind) {
    case "marteau": {
      reach(hi + (0.5 + rng() * 0.15) * m);
      const b = (0.07 + rng() * 0.05) * m;
      const o = p, c = color === "verte" ? o + b : o - b;
      push({ o, c, h: Math.max(o, c) + (0.01 + rng() * 0.025) * m, l: tip() });
      break;
    }
    case "engulfing": {
      reach(hi + (0.5 + rng() * 0.12) * m);
      const o1 = p, c1 = o1 - (0.28 + rng() * 0.1) * m;
      push({ o: o1, c: c1, h: o1 + (0.03 + rng() * 0.05) * m, l: tip() });
      const c2 = o1 + (0.12 + rng() * 0.12) * m;
      push({ o: c1, c: c2, h: c2 + (0.03 + rng() * 0.06) * m, l: c1 - (0.02 + rng() * 0.04) * m });
      break;
    }
    case "doji":
    case "doji_confirme": {
      reach(hi + (0.28 + rng() * 0.08) * m);
      const o = p, c = o + (rng() < 0.5 ? 1 : -1) * (0.006 + rng() * 0.012) * m;
      push({ o, c, h: Math.max(o, c) + (0.2 + rng() * 0.1) * m, l: tip() });
      if (kind === "doji_confirme") {
        const d = out[out.length - 1];
        const c2 = d.h + (0.08 + rng() * 0.1) * m;
        push({ o: p, c: c2, h: c2 + (0.03 + rng() * 0.05) * m, l: p - (0.02 + rng() * 0.04) * m });
        return { candles: out, p, at: out.length - 2, low: d.l };
      }
      break;
    }
    case "double_meche": {
      reach(hi + (0.45 + rng() * 0.1) * m);
      const o1 = p, c1 = o1 - (0.06 + rng() * 0.05) * m;
      push({ o: o1, c: c1, h: o1 + (0.03 + rng() * 0.04) * m, l: tip() });
      // seconde mèche : bougie verte, ou rouge (la couleur ne fait pas le signal, la mèche si)
      const c2 = color === "verte" ? c1 + (0.08 + rng() * 0.06) * m : c1 - (0.04 + rng() * 0.03) * m;
      push({ o: c1, c: c2, h: Math.max(c1, c2) + (0.02 + rng() * 0.04) * m, l: tip() });
      return { candles: out, p, at: out.length - 1, low: Math.min(out[out.length - 1].l, out[out.length - 2].l) };
    }
  }
  const at = out.length - 1;
  return { candles: out, p, at, low: Math.min(...out.slice(kind === "engulfing" ? -2 : -1).map((k) => k.l)) };
}

/** Suite haussière (n bougies) puis, au besoin, rejet sous un plafond */
export function rally(rng: Rng, m: number, p: number, n: number, cap?: number): { candles: Candle[]; p: number } {
  const out: Candle[] = [];
  for (let i = 0; i < n; i++) {
    let c = p + (0.35 + rng() * 0.45) * m;
    if (cap !== undefined && c > cap) c = cap - (0.05 + rng() * 0.1) * m;
    out.push(candle(p, c, (0.08 + rng() * 0.15) * m, (0.06 + rng() * 0.12) * m));
    p = c;
  }
  return { candles: out, p };
}
/** Suite baissière (n bougies) */
export function drop(rng: Rng, m: number, p: number, n: number): { candles: Candle[]; p: number } {
  const out: Candle[] = [];
  for (let i = 0; i < n; i++) {
    const c = p - (0.35 + rng() * 0.45) * m;
    out.push(candle(p, c, (0.06 + rng() * 0.12) * m, (0.08 + rng() * 0.15) * m));
    p = c;
  }
  return { candles: out, p };
}
/** Hésitation : petites bougies autour du prix, sans direction */
export function chop(rng: Rng, m: number, p: number, n: number, drift = 0): { candles: Candle[]; p: number } {
  const out: Candle[] = [];
  for (let i = 0; i < n; i++) {
    const c = p + ((rng() - 0.5) * 0.3 + drift) * m;
    out.push(candle(p, c, (0.08 + rng() * 0.12) * m, (0.08 + rng() * 0.12) * m));
    p = c;
  }
  return { candles: out, p };
}

/** Géométrie des signaux (contrôles d'audit) */
export const body = (k: Candle) => Math.abs(k.c - k.o);
export const range = (k: Candle) => k.h - k.l;
export const lowerWick = (k: Candle) => Math.min(k.o, k.c) - k.l;
export const upperWick = (k: Candle) => k.h - Math.max(k.o, k.c);
export const isHammer = (k: Candle) => lowerWick(k) >= 2 * body(k) && upperWick(k) <= Math.max(body(k), 0.15 * range(k));
export const isShootingStar = (k: Candle) => upperWick(k) >= 2 * body(k) && lowerWick(k) <= Math.max(body(k), 0.15 * range(k));
export const isDoji = (k: Candle) => body(k) <= 0.1 * range(k) && upperWick(k) > 0.25 * range(k) && lowerWick(k) > 0.25 * range(k);
export const isBullEngulfing = (a: Candle, b: Candle) => a.c < a.o && b.c > b.o && b.o <= a.c + 1e-9 && b.c > a.o;
export const isBearEngulfing = (a: Candle, b: Candle) => a.c > a.o && b.c < b.o && b.o >= a.c - 1e-9 && b.c < a.o;
