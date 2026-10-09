// Moteur partagé pour tous les mini-jeux TradeScaleX.
// Contient les types de base, le PRNG seedé, les pools de variation,
// et les helpers de construction de bougies / domaine de chart.

// ─── Types communs ────────────────────────────────────────────────────────────

export type Asset        = "EUR/USD" | "XAU/USD" | "BTC/USD" | "NASDAQ";
export type Session      = "Asie" | "Londres" | "New York" | "Overlap" | "Heures mortes";
export type Volatility   = "faible" | "normale" | "élevée";
export type Spread       = "faible" | "élevé";
export type HtfBias      = "bullish" | "bearish" | "range";
export type MacroContext = "normal" | "dangereux";

/** Libellé affiché d'une session (les valeurs internes restent en français). */
const SESSION_LABELS: Record<"fr" | "en" | "es", Record<Session, string>> = {
  fr: { Asie: "Asie", Londres: "Londres", "New York": "New York", Overlap: "Overlap", "Heures mortes": "Heures mortes" },
  en: { Asie: "Asia", Londres: "London", "New York": "New York", Overlap: "Overlap", "Heures mortes": "Off-hours" },
  es: { Asie: "Asia", Londres: "Londres", "New York": "Nueva York", Overlap: "Overlap", "Heures mortes": "Horas muertas" },
};
export function sessionLabel(session: Session, locale: string | undefined): string {
  return SESSION_LABELS[locale === "en" || locale === "es" ? locale : "fr"][session];
}

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

/**
 * Preuve d'un support ou d'une résistance (règle PO : un niveau n'existe que si le
 * graphique le montre). `n` touches de la bande [lo, hi] : depuis le côté `from`
 * (« below » : sous une résistance ; « above » : au-dessus d'un support), le prix vient
 * au contact (mèche dans la bande, clôture qui s'en écarte : bougie de rejet), puis
 * repart nettement du même côté. Le prix de départ p doit être éloigné du niveau
 * (au moins 1,5 m) ; le prix renvoyé l'est aussi.
 */
export function levelTouches(
  rng: () => number, p: number, lo: number, hi: number, from: "below" | "above", m: number, n = 2,
): { candles: Candle[]; p: number } {
  const dir = from === "below" ? 1 : -1;             // sens vers le niveau
  const edge = from === "below" ? lo : hi;           // bord de la bande côté prix
  const dist = (x: number) => dir * (edge - x);      // distance au bord (> 0 : du bon côté)
  const at = (d: number) => edge - dir * d;          // prix à la distance d du bord
  const out: Candle[] = [];
  // wNear : mèche côté niveau ; wFar : mèche opposée
  const push = (c: number, wNear: number, wFar: number) => {
    out.push(dir > 0 ? candle(p, c, wNear, wFar) : candle(p, c, wFar, wNear));
    p = c;
  };
  const small = () => (0.08 + rng() * 0.08) * m;
  // mèche opposée au niveau : libre (proportions réelles), sans effet sur les touches
  const far = () => (0.15 + rng() * 0.3) * m;
  for (let t = 0; t < n; t++) {
    // Approche, mèches courtes qui restent hors de la bande
    const a0 = (0.3 + rng() * 0.2) * m;
    while (dist(p) > a0 + 0.9 * m) {
      push(at(dist(p) - (0.45 + rng() * 0.3) * m), small(), far());
      // petit repli intercalé (une fois sur deux) : une approche n'est pas d'un seul bloc
      if (dist(p) > a0 + 0.9 * m && rng() < 0.5) push(at(dist(p) + (0.05 + rng() * 0.1) * m), small(), far());
    }
    push(at(a0 + (0.08 + rng() * 0.08) * m), Math.min(small(), 0.4 * a0), far());
    // Hésitation à l'approche : petit corps, mèches des deux côtés (hors de la bande)
    push(at(a0), Math.min((0.1 + rng() * 0.1) * m, 0.5 * a0), (0.15 + rng() * 0.2) * m);
    // Contact : mèche dans la bande, clôture qui s'en écarte
    const tip = edge + dir * (0.25 + rng() * 0.5) * (hi - lo);
    push(at(a0 + (0.25 + rng() * 0.25) * m), dir * (tip - p), far());
    // Réaction : deux bougies qui s'éloignent nettement, séparées par un petit repli (couleur
    // opposée, comme sur un vrai graphique : la jambe n'est pas d'un seul bloc)
    push(at(dist(p) + (0.6 + rng() * 0.4) * m), small(), far());
    push(at(dist(p) - (0.06 + rng() * 0.1) * m), small(), far());
    push(at(dist(p) + (0.7 + rng() * 0.4) * m), small(), far());
  }
  return { candles: out, p };
}

/**
 * Garde-fous de la passe de réalisme autour des supports et résistances : une bougie
 * éloignée du niveau dans le scénario le reste (sa mèche ne vient pas le frôler), pour
 * que les touches et les réactions qui le prouvent restent lisibles. Un garde-fou n'est
 * posé que du côté d'où le niveau est touché dans le scénario (le prix en vient, le
 * contacte et y repart) : la passe garde ailleurs ses mèches réelles.
 */
export function srGuards(zones: ChartZone[], m: number, past: Candle[]): number[] {
  const g = 0.8 * m;
  return zones
    .filter((z) => z.kind === "support" || z.kind === "resistance")
    .flatMap((z) => {
      const lo = Math.min(z.y1, z.y2), hi = Math.max(z.y1, z.y2);
      const sides = new Set<"above" | "below">();
      let last: "above" | "below" | null = null, contact = false;
      for (const k of past) {
        const side = k.l > hi + g ? "above" : k.h < lo - g ? "below" : null;
        if (side) { if (contact && last === side) sides.add(side); contact = false; last = side; }
        else if (last && k.l <= hi + 0.3 * m && k.h >= lo - 0.3 * m) contact = true;
      }
      return [...(sides.has("below") ? [lo - g] : []), ...(sides.has("above") ? [hi + g] : [])];
    });
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
