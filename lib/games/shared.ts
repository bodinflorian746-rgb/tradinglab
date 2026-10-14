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
  /** Libellé court (graphique étroit, téléphone), même idée que le libellé */
  short?: string;
  /** Changement de rôle prouvé (ancienne résistance → support, ou l'inverse) : touches et cassure */
  flip?: RoleChange;
  /** Extrême nommé (swing, HL…) : indice de la bougie du passé qui clôture au swing ; le tracé se
   *  pose sur la pointe de sa mèche ou de celle de la suivante */
  at?: number;
}

/** Changement de rôle d'un niveau : touches (indices des bougies) du côté de l'ancien rôle, puis cassure. */
export interface RoleChange {
  /** Rôle d'avant la cassure */
  was: "support" | "resistance";
  touches: number[];
  /** Bougie de la cassure (première clôture de l'autre côté) */
  breakAt: number;
}

/**
 * Support touché seulement par en dessous (ancienne résistance cassée vers le haut) ou résistance
 * touchée seulement par au-dessus (ancien support cassé vers le bas) : le niveau tient son rôle d'un
 * changement de rôle. Touches et cassures : même définition que la preuve des supports / résistances
 * (scripts/audit-lecons/sr-proof.mjs) — le prix arrive d'un côté, vient au contact, repart du même
 * côté ; s'il ressort de l'autre côté, c'est une cassure.
 */
export function roleChange(cs: Candle[], z: Pick<ChartZone, "kind" | "y1" | "y2" | "label">): RoleChange | null {
  // Seulement un niveau NOMMÉ support / résistance (les zones nommées autrement — swing low, HL H4,
  // plus bas précédent — ne prétendent pas à ce rôle)
  const sup = /^(support|soporte)/i.test(z.label);
  const res = /^(r[ée]sistance|resistencia)/i.test(z.label);
  if (!sup && !res) return null;
  const lo = Math.min(z.y1, z.y2), hi = Math.max(z.y1, z.y2);
  const ranges = cs.map((k) => k.h - k.l).sort((a, b) => a - b);
  const tol = 0.25 * (ranges[Math.floor(ranges.length / 2)] || 0);
  let last: "above" | "below" | null = null, group: number[] = [];
  const touches = { above: [] as number[], below: [] as number[] };
  let breakAt = -1, brokeTo: "above" | "below" | null = null;
  cs.forEach((k, i) => {
    const above = k.l > hi + tol, below = k.h < lo - tol;
    if (above || below) {
      const side = above ? "above" : "below";
      if (group.length && last === side) {
        // bougie du contact la plus proche du niveau
        touches[side].push(group.reduce((a, j) => (side === "below" ? (cs[j].h > cs[a].h ? j : a) : (cs[j].l < cs[a].l ? j : a))));
      } else if (last && last !== side && breakAt < 0) {
        const cand = [...group, i];
        breakAt = cand.find((j) => (side === "above" ? cs[j].c > hi : cs[j].c < lo)) ?? i;
        brokeTo = side;
      }
      group = []; last = side;
    } else if (last) group.push(i);
  });
  // Mèches très longues (tolérance large) : le prix peut clôturer de l'autre côté sans jamais en
  // sortir franchement. Une clôture au-delà de la zone après la dernière touche est la cassure.
  if (brokeTo === null) {
    const side = touches.below.length && !touches.above.length ? "below" : touches.above.length && !touches.below.length ? "above" : null;
    if (side) {
      const after = Math.max(...touches[side]);
      const j = cs.findIndex((k, i) => i > after && (side === "below" ? k.c > hi : k.c < lo));
      if (j >= 0) { breakAt = j; brokeTo = side === "below" ? "above" : "below"; }
    }
  }
  if (sup && touches.below.length > 0 && touches.above.length === 0 && brokeTo === "above") return { was: "resistance", touches: touches.below, breakAt };
  if (res && touches.above.length > 0 && touches.below.length === 0 && brokeTo === "below") return { was: "support", touches: touches.above, breakAt };
  return null;
}

/** Libellés du changement de rôle (FR ; les modules EN / ES les traduisent) */
export const ROLE_CHANGE_LABELS = {
  support: { label: "Ancienne résistance → support", short: "Résistance → support" },
  resistance: { label: "Ancien support → résistance", short: "Support → résistance" },
} as const;

/** Zones du passé : un support / une résistance prouvé par changement de rôle le dit (libellé) et
 *  porte ses touches et sa cassure (repères discrets sur le graphique). */
export function withRoleChanges<T extends { past: Candle[]; zones: ChartZone[] }>(ch: T): T {
  return {
    ...ch,
    zones: ch.zones.map((z) => {
      const f = roleChange(ch.past, z);
      if (!f) return z;
      const L = ROLE_CHANGE_LABELS[f.was === "resistance" ? "support" : "resistance"];
      return { ...z, label: L.label, short: L.short, flip: f };
    }),
  };
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
 * Impulsion haussière en 3 bougies franches (corps pleins, mèches courtes) qui laisse un FVG
 * proportionné aux bougies voisines : le vide entre la mèche haute de la 1re et la mèche basse
 * de la 3e (≈ un demi-pas m), et non toute la hauteur d'une bougie géante. Ajoute les 3 bougies
 * à `past` ; rend les bornes du FVG et la dernière clôture.
 */
export function bullImpulse3(rng: () => number, m: number, p: number, past: Candle[]): { fvgLow: number; fvgHigh: number; p: number } {
  const a = candle(p, p + (0.5 + rng() * 0.2) * m, 0.06 * m, (0.1 + rng() * 0.08) * m);
  const b = candle(a.c, a.c + (0.6 + rng() * 0.15) * m, 0.05 * m, 0.05 * m);
  const c = candle(b.c, b.c + (0.45 + rng() * 0.2) * m, (0.1 + rng() * 0.08) * m, 0.06 * m);
  past.push(a, b, c);
  return { fvgLow: a.h, fvgHigh: c.l, p: c.c };
}

/**
 * Preuve d'un support ou d'une résistance (règle PO : un niveau n'existe que si le
 * graphique le montre). `n` touches de la bande [lo, hi] : depuis le côté `from`
 * (« below » : sous une résistance ; « above » : au-dessus d'un support), le prix vient
 * au contact (mèche dans la bande, clôture qui s'en écarte : bougie de rejet), puis
 * repart nettement du même côté. Le prix de départ p doit être éloigné du niveau
 * (au moins 1,5 m) ; le prix renvoyé l'est aussi.
 */
/**
 * « Plus bas précédent » d'un sweep haussier, posé sur le niveau L : le creux de la 1re bougie
 * de la consolidation (les 3 dernières du passé), dont le prix repart nettement avant que la
 * mèche du sweep vienne le balayer. Jamais la bougie juste avant la mèche, et aucune bougie
 * d'avant ne descend plus bas.
 */
export function markPrevLow(past: Candle[], L: number, m: number): void {
  const n = past.length, t = n - 3;
  past.forEach((k, i) => {
    if (i === t) return;
    const lift = i > t ? L + 0.45 * m : L + 0.08;
    k.l = Math.max(k.l, Math.min(lift, Math.min(k.o, k.c)));
  });
  past[t].l = Math.min(past[t].l, L + 0.02);
}

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
