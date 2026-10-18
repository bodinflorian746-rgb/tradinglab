// Build the Trade — scénarios construits sur les scènes partagées (lib/games/scenes.ts).
// Chaque scénario : un seul niveau, ses notions (lib/games/notions.ts), son plan (trois entrées,
// trois stops, trois TP) et une suite qui donne raison au plan optimal (`build`, unités
// abstraites), et ses affirmations vérifiées (`claims`, scripts/audit-jeux/coherence-btt.ts).
// Les stops se lisent par leur place (proche, médian, éloigné) : le bon stop est celui qui se
// trouve derrière l'invalidation, à une place qui varie d'un scénario à l'autre. Même chose pour
// l'entrée et le TP : aucune recette « toujours le même choix » ne gagne.

import type { Candle, ChartZone } from "./shared";
import { candle, levelTouches, naturalFuture } from "./shared";
import type { NotionId } from "./notions";
import { bullSignal, legTo, mirrorCandles, mirrorZones, provenResistance, rally, range, isHammer, isBullEngulfing, isDoji, type Rng } from "./scenes";
import { rangeScene, obScene, bullImpulse3Local } from "./bsnt-scenarios";
import { swingSetup } from "./ps-scenarios";

type Difficulty = "beginner" | "intermediate" | "advanced";
type Entry = "aggressive" | "confirmation" | "deep_pullback";
type Stop = "tight" | "logical" | "wide";
type Tp = "fast" | "balanced" | "ambitious";
export interface BttOptimal { entry: Entry; stop: Stop; tp: Tp }

/** Graphique construit, avant prix d'actif et passe de réalisme */
export interface BttRaw {
  past: Candle[]; future: Candle[]; zones: ChartZone[];
  entries: Record<Entry, number>; stops: Record<Stop, number>; tps: Record<Tp, number>;
  /** Niveaux invisibles que la passe de réalisme ne laisse pas franchir aux mèches du passé */
  guards?: number[];
}
/** Graphique tel que le jeu le montre (affirmations) */
export interface BttChartLike {
  past: Candle[]; future: Candle[]; zones: ChartZone[]; direction: "BUY" | "SELL";
  entries: Record<Entry, number>; stops: Record<Stop, number>; tps: Record<Tp, number>; currentPrice: number;
}
export type BttClaim = (ch: BttChartLike) => string | null;

export interface BttScenario {
  id: string; title: string; direction: "BUY" | "SELL"; htfBias: "bullish" | "bearish" | "range"; macroContext: "normal";
  context: string; optimal: BttOptimal; optimalExplain: string;
  lessons: { beginner: string; intermediate: string; advanced: string };
  difficulties: readonly Difficulty[];
  notions: readonly NotionId[]; trap?: string; conflict?: string;
  build: (rng: Rng, m: number) => BttRaw;
  claims: Record<string, BttClaim>;
}

// ─── Aides ────────────────────────────────────────────────────────────────────

const AXIS = 10;
const CONF = 0.45;   // entrée confirmation : au-delà du prix actuel, après une bougie de confirmation
const last = <T,>(a: T[]) => a[a.length - 1];
const lo = (z: ChartZone) => Math.min(z.y1, z.y2);
const hi = (z: ChartZone) => Math.max(z.y1, z.y2);
const mr = (cs: Candle[]) => { const s = cs.map(range).sort((a, b) => a - b); return s[s.length >> 1] || 1; };
const one = (text: string) => ({ beginner: text, intermediate: text, advanced: text });
const band = (m: number) => ({ lo: -0.13 * m, hi: 0.13 * m });
const pivotHigh = (v: number, label = "Plus haut précédent"): ChartZone => ({ kind: "resistance", y1: v + 0.01, y2: v + 0.03, label });
const pivotLow = (v: number, label: string, at?: number): ChartZone => ({ kind: "support", y1: v - 0.03, y2: v - 0.01, label, ...(at !== undefined ? { at } : {}) });
/** Jambe qui finit exactement au prix voulu (la partie suivante du graphique en part) */
function legExact(rng: Rng, m: number, from: number, to: number, o?: Parameters<typeof legTo>[4]) {
  const r = legTo(rng, m, from, to, o);
  const cs = [...r.candles];
  if (!cs.length) cs.push(candle(from, to, 0.03 * m, 0.03 * m));
  const k = cs[cs.length - 1];
  cs[cs.length - 1] = { ...k, c: to, h: Math.max(k.h, k.o, to), l: Math.min(k.l, k.o, to) };
  return { candles: cs, p: to };
}
const mapPrices = <K extends string>(r: Record<K, number>, f: (v: number) => number) =>
  Object.fromEntries(Object.entries(r).map(([k, v]) => [k, f(v as number)])) as Record<K, number>;

/** Variante de sens : même graphique, renversé (un Order Block renversé est baissier) */
const mirrored = (b: BttScenario["build"]): BttScenario["build"] => (rng, m) => {
  const r = b(rng, m);
  const f = (v: number) => AXIS - v;
  return {
    past: mirrorCandles(r.past, AXIS), future: mirrorCandles(r.future, AXIS),
    zones: mirrorZones(r.zones, AXIS).map((z) => (z.label === "Order Block" ? { ...z, label: "Order Block baissier" } : z)),
    entries: mapPrices(r.entries, f), stops: mapPrices(r.stops, f), tps: mapPrices(r.tps, f),
    ...(r.guards ? { guards: r.guards.map(f) } : {}),
  };
};

/** Scène (sens haussier) : passé, zones, pullback profond, stops du plus proche au plus éloigné,
 *  niveau opposé éventuel (le TP optimal se place juste avant) */
interface Scene { past: Candle[]; zones: ChartZone[]; deep: number; stops: [number, number, number]; level?: number; tpGap?: number; guards?: number[] }
/** Écart entre le TP optimal et le niveau opposé (bougie médiane abstraite) */
const GAP = 0.2;

const STOP_AT: Record<Stop, number> = { tight: 0, logical: 1, wide: 2 };
const entryOf = (o: BttOptimal, E0: number, deep: number, m: number) => (o.entry === "aggressive" ? E0 : o.entry === "confirmation" ? E0 + CONF * m : deep);
/** R/R du TP optimal, par catégorie */
const K: Record<Tp, [number, number]> = { fast: [1.65, 1.9], balanced: [2.35, 2.75], ambitious: [3.6, 4.2] };
/** Niveau opposé à k × R de l'entrée optimale (R : risque du plan optimal) */
function levelFor(rng: Rng, m: number, o: BttOptimal, E0: number, deep: number, stops: [number, number, number]) {
  const E = entryOf(o, E0, deep, m), R = E - stops[STOP_AT[o.stop]];
  const [a, b] = K[o.tp];
  const room = o.tp === "fast" ? 0 : o.tp === "balanced" ? 0.35 * R : 0.7 * R;   // TP plus courts entre l'entrée confirmation et lui
  return Math.max(E + (a + rng() * (b - a)) * R, E0 + (CONF + 0.15) * m + room) + GAP * m;
}

/** TP : juste avant le niveau opposé pour le TP optimal quand il y en a un, sinon en multiples du risque */
function tpsFor(rng: Rng, m: number, o: BttOptimal, E: number, R: number, conf: number, level?: number, gap = GAP): Record<Tp, number> {
  const at = (k: number) => E + k * R;
  let fast: number, bal: number, amb: number;
  if (level !== undefined && o.tp === "fast") { fast = level - gap * m; bal = Math.max(at(2.3), fast + 0.5 * R); amb = Math.max(at(3.5), bal + 0.7 * R); }
  else if (level !== undefined && o.tp === "balanced") { bal = level - gap * m; fast = Math.min(at(1.3), E + 0.55 * (bal - E)); amb = Math.max(at(3.5), bal + 0.8 * R); }
  else if (level !== undefined) { amb = level - gap * m; fast = at(1.2); bal = at(2.2); }
  else { fast = at(1.2); bal = at(2.2); amb = at(3.6 + rng() * 0.6); }
  // au-delà de toutes les entrées, dans l'ordre rapide < équilibré < ambitieux
  fast = Math.max(fast, conf + 0.15 * m);
  bal = Math.max(bal, fast + 0.3 * R);
  amb = Math.min(at(5), Math.max(amb, bal + 0.3 * R));
  return { fast, balanced: bal, ambitious: amb };
}

/** Suite (15 bougies) qui donne raison au plan optimal : retour au pullback profond seulement s'il
 *  est attendu (en balayant les stops trop proches), montée jusqu'au TP optimal, puis le niveau
 *  opposé tient (TP rapide ou équilibré) ou le prix continue (TP ambitieux) */
function futureFor(rng: Rng, m: number, s: Scene, o: BttOptimal, tps: Record<Tp, number>): Candle[] {
  const out: Candle[] = [];
  let p = last(s.past).c;
  const push = (k: Candle) => { out.push(k); p = k.c; };
  const idx = STOP_AT[o.stop], keep = s.stops[idx];
  const T = tps[o.tp];
  if (o.entry === "deep_pullback") {
    const swept = idx > 0 ? s.stops[idx - 1] : undefined;
    let low = swept !== undefined ? swept - (0.25 + rng() * 0.2) * (swept - keep) : Math.max(keep + 0.12 * m, s.deep - (0.05 + rng() * 0.05) * m);
    low = Math.min(low, s.deep - 0.03 * m);
    const stop1 = s.deep + (0.12 + rng() * 0.08) * m;
    while (p - stop1 > 0.6 * m) push(candle(p, p - (0.35 + rng() * 0.2) * m, (0.03 + rng() * 0.05) * m, (0.03 + rng() * 0.04) * m));
    if (p - stop1 > 0.02 * m) push(candle(p, stop1, (0.03 + rng() * 0.04) * m, 0.02 * m));
    // rejet : la mèche va chercher le plus bas prévu, la clôture repart au-dessus du pullback
    const c = Math.max(p, s.deep) + (0.2 + rng() * 0.12) * m;
    push({ o: p, c, h: c + (0.03 + rng() * 0.04) * m, l: low });
  }
  // plus bas permis pendant la montée : jamais le bon stop, jamais le pullback profond s'il n'est pas attendu
  const floor = o.entry === "deep_pullback" ? keep + 0.15 * m : s.deep + 0.22 * m;
  // le niveau opposé tient (TP juste avant lui) ; sans niveau, un TP ambitieux laisse la hausse continuer
  const holds = o.tp !== "ambitious" || s.level !== undefined;
  const reach = !holds ? T + (0.08 + rng() * 0.06) * m : T - (0.12 + rng() * 0.08) * m;
  const n = Math.max(2, Math.min(15 - out.length - 3, Math.ceil((reach - p) / (0.45 * m))));
  // (corps de tailles variées, une petite bougie contraire au milieu d'une longue montée : pas d'escalier)
  let since = 0;
  for (let i = 0; i < n; i++) {
    const step = (reach - p) / (n - i);
    const pause = i < n - 1 && since >= 3;
    since = pause ? 0 : since + 1;
    const c = i === n - 1 ? reach : pause ? Math.max(floor + 0.05 * m, p - (0.08 + rng() * 0.12) * m) : p + step * (0.55 + rng() * 0.9);
    const h = i === n - 1 && holds ? T + 0.06 * m : c + (0.05 + rng() * 0.16) * m;
    push({ o: p, c, h: Math.max(h, c, p), l: Math.min(p, c, Math.max(floor, Math.min(p, c) - (0.18 + rng() * 0.4) * m)) });
  }
  // ensuite : le niveau tient (le prix s'en écarte sans atteindre le TP suivant) ou la hausse continue
  const after = out.length;
  while (out.length < 15) {
    const base = Math.max(floor, T - 0.45 * (T - last(s.past).c));
    // (le niveau tient : le prix oscille sous lui, sans bougie plate collée au plancher)
    let c = !holds ? p + (out.length === after || rng() < 0.35 ? -(0.06 + rng() * 0.1) : 0.1 + rng() * 0.25) * m : p + (rng() < 0.45 ? 0.04 + rng() * 0.1 : -(0.06 + rng() * 0.18)) * m;
    if (holds) { c = Math.min(T - 0.15 * m, Math.max(base + 0.05 * m, c)); if (Math.abs(c - p) < 0.03 * m) c = p + (p - base > 0.2 * m ? -1 : 1) * (0.05 + rng() * 0.05) * m; }
    const top = !holds ? Infinity : T - 0.05 * m;
    push({ o: p, c, h: Math.min(Math.max(p, c) + (0.05 + rng() * 0.16) * m, Math.max(top, p, c)), l: Math.min(p, c, Math.max(base, Math.min(p, c) - (0.12 + rng() * 0.28) * m)) });
  }
  // (après le TP seulement : la suite ne monte pas en escalier, sans toucher au trajet du plan)
  // (après le TP seulement : le trajet du plan n'est jamais décalé ; la montée fait déjà une pause toutes les 4 bougies)
  return naturalFuture(out, rng, m, after, 6);
}

function assemble(rng: Rng, m: number, s: Scene, o: BttOptimal): BttRaw {
  const E0 = last(s.past).c;
  const entries = { aggressive: E0, confirmation: E0 + CONF * m, deep_pullback: s.deep };
  const stops = { tight: s.stops[0], logical: s.stops[1], wide: s.stops[2] };
  const E = entries[o.entry], R = E - stops[o.stop];
  const tps = tpsFor(rng, m, o, E, R, entries.confirmation, s.level, s.tpGap);
  return { past: s.past, future: futureFor(rng, m, s, o, tps), zones: s.zones, entries, stops, tps, ...(s.guards ? { guards: s.guards } : {}) };
}
const plan = (o: BttOptimal, scene: (rng: Rng, m: number, o: BttOptimal) => Scene): BttScenario["build"] => (rng, m) => assemble(rng, m, scene(rng, m, o), o);

// ─── Scènes (sens haussier) ─────────────────────────────────────────────────

type StopsFor = (f: { E0: number; low: number; deep: number; lo: number; hi: number }, rng: Rng, m: number) => [number, number, number];
/** Stop logique au plus proche, puis deux et trois fois plus loin */
const nearX = (logical: (f: Parameters<StopsFor>[0], rng: Rng, m: number) => number, from: "E0" | "deep"): StopsFor => (f, rng, m) => {
  const s = logical(f, rng, m), d = f[from] - s;
  return [s, s - d, s - 2 * d];
};
const underZone = (f: Parameters<StopsFor>[0], rng: Rng, m: number) => Math.min(f.low, f.lo) - (0.2 + rng() * 0.08) * m;

/** Signal sur un support touché deux fois ; le plus haut précédent (dernière réaction) est placé
 *  à la distance que le TP optimal demande */
function onSupport(kind: "marteau" | "engulfing" | "doji", stopsFor: StopsFor, opt: { pierce?: boolean; extend?: number; deepAt?: number; force?: boolean } = {}) {
  return (rng: Rng, m: number, o: BttOptimal): Scene => {
    const b = band(m);
    const pA = b.hi + (0.9 + rng() * 0.25) * m;   // fin de l'approche
    const sig = bullSignal(rng, m, pA, b.lo, b.hi, kind, kind === "marteau" ? (rng() < 0.7 ? "rouge" : "verte") : undefined);
    const right = [...sig.candles];
    if (opt.pierce) {
      const j = kind === "engulfing" ? right.length - 2 : right.length - 1;
      const k = right[j];
      right[j] = { ...k, l: b.lo - (kind === "doji" ? 0.5 + rng() * 0.1 : 0.38 + rng() * 0.1) * m, ...(kind === "doji" ? { h: Math.max(k.o, k.c) + (0.45 + rng() * 0.08) * m } : {}) };
    }
    const low = Math.min(...right.slice(kind === "engulfing" ? -2 : -1).map((k) => k.l));
    let p = sig.p;
    // le prix s'éloigne de la zone : bougies vertes franches
    for (let i = 0; i < (opt.extend ?? 0); i++) { const c = p + (0.55 + rng() * 0.25) * m; right.push(candle(p, c, (0.06 + rng() * 0.1) * m, (0.05 + rng() * 0.08) * m)); p = c; }
    // bougie de displacement : grand corps vert qui éloigne le prix de la zone
    if (opt.force) { const c = p + (0.92 + rng() * 0.1) * m; right.push({ o: p, c, h: c + 0.04 * m, l: p - 0.03 * m }); p = c; }
    const deep = b.hi + (opt.deepAt ?? 0.1 + rng() * 0.05) * m;
    const stops = stopsFor({ E0: p, low, deep, lo: b.lo, hi: b.hi }, rng, m);
    const level = levelFor(rng, m, o, p, deep, stops);
    // départ assez haut : le prix arrive d'au-dessus du support avant la première touche
    const t = levelTouches(rng, b.hi + Math.min(2.3 * m, level - b.hi - 0.6 * m), b.lo, b.hi, "above", m, 2, level - b.hi);
    const a = legExact(rng, m, t.p, pA);
    return { past: [...t.candles, ...a.candles, ...right], zones: [{ kind: "support", y1: b.lo, y2: b.hi, label: "Support" }, pivotHigh(level)], deep, stops, level,
      // (les bougies qui arrivent d'au-dessus du support n'y descendent pas d'une mèche ajoutée : les touches restent lisibles)
      guards: [b.hi + 0.3 * m] };
  };
}
/** Stops d'un signal dont la mèche traverse le support : dans la zone, pile sous elle, sous la pointe */
const pierceStops: StopsFor = (f, rng, m) => [f.lo + (0.4 + rng() * 0.2) * (f.hi - f.lo), f.lo - (0.08 + rng() * 0.04) * m, f.low - (0.2 + rng() * 0.08) * m];

/** Tendance haussière, repli au-dessus du dernier creux, reprise ; plus haut précédent tracé */
const swingTrend = (rng: Rng, m: number): Scene => {
  const s = swingSetup(rng, m);
  const near = s.sl - (0.18 + rng() * 0.08) * m, d = s.entry - near;
  const HH = Math.max(...s.past.map((k) => k.h));
  return { past: s.past, zones: [pivotLow(s.sl, "Swing low", s.at), pivotHigh(HH)], deep: s.sl + 0.25 * m, stops: [near, near - d, near - 2 * d] };
};

/** Résistance cassée par une bougie franche, prix déjà parti : le retest n'a pas encore eu lieu */
const breakoutAway = (rng: Rng, m: number): Scene => {
  const b = band(m);
  const t = provenResistance(rng, m, b.lo, b.hi);
  const a = legTo(rng, m, t.p, b.lo - 0.4 * m, { retrace: 0.3 });
  const past = [...t.candles, ...a.candles];
  let p = a.p;
  const c0 = b.hi + (0.55 + rng() * 0.1) * m; past.push({ o: p, c: c0, h: c0 + 0.05 * m, l: p - 0.04 * m }); p = c0;
  const up = rally(rng, m, p, 1); past.push(...up.candles);
  const deep = b.hi + (0.04 + rng() * 0.04) * m, near = b.lo - (0.2 + rng() * 0.08) * m, d = deep - near;
  return { past, zones: [{ kind: "resistance", y1: b.lo, y2: b.hi, label: "Résistance cassée" }], deep, stops: [near, near - d, near - 2 * d] };
};

/** Impulsion A → B, retracement en cours (≈ 40 %) : le 61,8 % est encore en dessous */
const fiboPending = (rng: Rng, m: number): Scene => {
  const base = legTo(rng, m, 0.8 * m, 0, { retrace: 0 });
  const up = legTo(rng, m, base.p, base.p + (3.6 + rng() * 0.4) * m, { retrace: 0.15 });
  const A = Math.min(...base.candles.map((k) => k.l), ...up.candles.map((k) => k.l));
  const B = Math.max(...up.candles.map((k) => k.h));
  const dn = legTo(rng, m, up.p, B - (0.36 + rng() * 0.06) * (B - A), { retrace: 0 });
  const past = [...base.candles, ...up.candles, ...dn.candles];
  const deep = B - 0.618 * (B - A);
  return { past, zones: [pivotLow(A, "Plus bas précédent"), pivotHigh(B)], deep, stops: [deep - (0.35 + rng() * 0.1) * m, A - (0.08 + rng() * 0.04) * m, A - (0.25 + rng() * 0.08) * m] };
};

/** Structure haussière : plus bas (swing low), plus haut précédent, repli en cours vers le swing low */
const structurePullback = (rng: Rng, m: number, o: BttOptimal): Scene => {
  const past: Candle[] = [];
  let p = 0;
  const up1 = legTo(rng, m, p, p + (1.7 + rng() * 0.3) * m, { retrace: 0.2 }); past.push(...up1.candles); p = up1.p;
  const dn1 = legTo(rng, m, p, p - (0.9 + rng() * 0.2) * m, { retrace: 0, step: [0.28, 0.4] }); past.push(...dn1.candles); p = dn1.p;
  const at = past.length - 1;
  const SL = Math.min(past[at].l, p - 0.02 * m); past[at] = { ...past[at], l: SL };
  const deep = SL + (0.42 + rng() * 0.06) * m, near = SL - (0.28 + rng() * 0.06) * m, d = deep - near;
  const stops: [number, number, number] = [near, near - d, near - 2 * d];
  const HH = levelFor(rng, m, o, deep, deep, stops);
  const up2 = legTo(rng, m, p, HH - 0.06 * m, { retrace: 0.2 }); past.push(...up2.candles); p = up2.p;
  past[past.length - 1] = { ...past[past.length - 1], h: HH };
  const E0 = deep + (0.32 + rng() * 0.08) * m;
  const dn2 = legTo(rng, m, p, E0, { retrace: 0, step: [0.3, 0.45] }); past.push(...dn2.candles);
  return { past, zones: [pivotLow(SL, "Swing low", at), pivotHigh(HH)], deep, stops, level: HH };
};

/** Range, clôture sous le bas du range puis réintégration (faux breakout bas) */
const rangeFakeout = (rng: Rng, m: number): Scene => {
  const R = (5.3 + rng() * 0.5) * m, b = band(m);
  const s = rangeScene(rng, m, R, 6);
  const past = [...s.past];
  let p = s.p;
  const cA = Math.min(b.lo, ...past.map((k) => k.l)) - (0.55 + rng() * 0.08) * m, tipA = cA - (0.35 + rng() * 0.1) * m;
  past.push({ o: p, c: cA, h: p + 0.04 * m, l: tipA }); p = cA;
  const cB = b.hi + (0.3 + rng() * 0.1) * m; past.push({ o: p, c: cB, h: cB + 0.05 * m, l: p - 0.03 * m });
  return {
    past,
    zones: [{ kind: "support", y1: b.lo, y2: b.hi, label: "Bas du range", trigger: true }, { kind: "resistance", y1: R - 0.13 * m, y2: R + 0.13 * m, label: "Haut du range" },
      { kind: "liquidity_low", y1: tipA, y2: cA - 0.03 * m, label: "Mèche du faux breakout" }],
    deep: (b.lo + b.hi) / 2, stops: [b.lo - (0.1 + rng() * 0.04) * m, cA - (cA - tipA) * (0.35 + rng() * 0.15), tipA - (0.2 + rng() * 0.08) * m], level: R - 0.13 * m, tpGap: 0.45,
  };
};

/** Résistance cassée, montée jusqu'au plus haut précédent, retour sur l'ancienne résistance, signal */
function onRetest(kind: "marteau" | "engulfing", stopsFor: StopsFor, pierce = false) {
  return (rng: Rng, m: number, o: BttOptimal): Scene => {
    const b = band(m);
    const pB = b.hi + (0.2 + rng() * 0.08) * m;
    const sig = bullSignal(rng, m, pB, b.lo, b.hi, kind, kind === "marteau" ? (rng() < 0.7 ? "rouge" : "verte") : undefined);
    const right = [...sig.candles];
    if (pierce) { const j = kind === "engulfing" ? right.length - 2 : right.length - 1; right[j] = { ...right[j], l: b.lo - (0.38 + rng() * 0.1) * m }; }
    const low = Math.min(...right.slice(kind === "engulfing" ? -2 : -1).map((k) => k.l));
    const deep = b.hi + (0.1 + rng() * 0.04) * m;
    const stops = stopsFor({ E0: sig.p, low, deep, lo: b.lo, hi: b.hi }, rng, m);
    const L = levelFor(rng, m, o, sig.p, deep, stops);
    // résistance touchée deux fois
    const t = levelTouches(rng, b.lo - (2.4 + rng() * 0.3) * m, b.lo, b.hi, "below", m, 2, 1.9 * m);
    const a = legTo(rng, m, t.p, b.lo - 0.4 * m, { retrace: 0.1, step: [0.6, 0.95] });
    const left = [...t.candles, ...a.candles];
    let p = a.p;
    const c0 = b.hi + (0.5 + rng() * 0.1) * m; left.push({ o: p, c: c0, h: c0 + 0.05 * m, l: p - 0.04 * m }); p = c0;
    const up = legTo(rng, m, p, L - 0.08 * m, { retrace: 0.1, step: [0.6, 0.95] }); left.push(...up.candles); p = up.p;
    left[left.length - 1] = { ...left[left.length - 1], h: L };
    const back = legExact(rng, m, p, pB, { retrace: 0, step: [0.6, 0.95] });
    return { past: [...left, ...back.candles, ...right], zones: [{ kind: "support", y1: b.lo, y2: b.hi, label: "Ancienne résistance → support", short: "Résistance → support" }, pivotHigh(L)], deep, stops, level: L,
      // (les bougies qui viennent au contact par en dessous, puis par au-dessus, n'y entrent pas d'une mèche ajoutée)
      guards: [b.lo - 0.45 * m, b.hi + 0.45 * m] };
  };
}

/** Marteau dans un Order Block ; plus haut précédent (sommet de l'impulsion) tracé */
const obHammer = (rng: Rng, m: number): Scene => {
  const s = obScene(rng, m);
  const sig = bullSignal(rng, m, s.p, s.ob.lo, s.zone.y2, "marteau");
  const past = [...s.past, ...sig.candles], E0 = sig.p;
  const near = Math.min(s.zone.y1, sig.low) - (0.2 + rng() * 0.08) * m, d = E0 - near;
  const top = Math.max(...s.past.map((k) => k.h));
  return { past, zones: [s.zone, pivotHigh(top)], deep: s.zone.y2 + (0.08 + rng() * 0.05) * m, stops: [near, near - d, near - 2 * d] };
};

/** Plus bas précédent balayé par une mèche, clôture nettement revenue au-dessus (ou juste au-dessus) */
function sweepLow(strong: boolean) {
  return (rng: Rng, m: number, o: BttOptimal): Scene => {
    const L0 = 0;
    const tip = L0 - (strong ? 0.5 + rng() * 0.1 : 0.7 + rng() * 0.1) * m;
    const E0 = L0 + (strong ? 0.96 + rng() * 0.08 : 0.3 + rng() * 0.06) * m;
    const deep = L0 + (strong ? 0.01 + rng() * 0.02 : 0.05 + rng() * 0.03) * m;
    const stops: [number, number, number] = strong
      ? [L0 - (0.08 + rng() * 0.04) * m, tip + (L0 - tip) * (0.3 + rng() * 0.15), tip - (0.2 + rng() * 0.06) * m]
      : [L0 - (0.1 + rng() * 0.04) * m, tip - (0.2 + rng() * 0.06) * m, tip - (1.3 + rng() * 0.2) * m];
    const L = levelFor(rng, m, o, E0, deep, stops);
    const d1 = legTo(rng, m, L - (0.3 + rng() * 0.2) * m, L0 + 0.3 * m, { retrace: 0.15, step: [0.6, 0.95] });
    const past = [...d1.candles];
    let p = d1.p;
    past.push({ o: p, c: L0 + 0.4 * m, h: p + 0.05 * m, l: L0 }); p = L0 + 0.4 * m;
    const up = legTo(rng, m, p, L - 0.07 * m, { retrace: 0.1, step: [0.6, 0.95] }); past.push(...up.candles); p = up.p;
    past[past.length - 1] = { ...past[past.length - 1], h: L };
    const dn = legExact(rng, m, p, L0 + (strong ? 0.45 + rng() * 0.04 : 0.6) * m, { retrace: 0.1, step: [0.55, 0.9] });
    // (la jambe ne descend pas au plus bas précédent : le creux d'avant reste le plus bas, puis la mèche le balaie)
    past.push(...dn.candles.map((k) => ({ ...k, l: Math.min(Math.min(k.o, k.c), Math.max(k.l, L0 + 0.28 * m)) }))); p = dn.p;
    // la bougie du sweep : forte (grand corps vert) ou hésitante (petit corps, clôture juste au-dessus)
    const o0 = strong ? p : E0 + (rng() < 0.5 ? 1 : -1) * (0.04 + rng() * 0.03) * m;
    if (!strong) { past.push(candle(p, o0, 0.04 * m, 0.03 * m)); p = o0; }
    past.push({ o: p, c: E0, h: Math.max(p, E0) + (strong ? 0.04 : 0.1) * m, l: tip });
    return {
      past, deep, stops, level: L, guards: [L0 + 0.18 * m],
      // (la liquidité balayée en premier : c'est elle que le graphique nomme, le plus bas précédent passe en légende)
      zones: [{ kind: "liquidity_low", y1: tip, y2: L0 - 0.05 * m, label: "Liquidité balayée" }, pivotLow(L0, "Plus bas précédent"), pivotHigh(L)],
    };
  };
}

/** Impulsion A → B, repli rapide en cours (≈ 50 %) : la zone OTE (62 à 79 %) est encore en dessous */
const otePending = (rng: Rng, m: number): Scene => {
  const base = legTo(rng, m, 0.8 * m, 0, { retrace: 0 });
  const up = legTo(rng, m, base.p, base.p + (3.6 + rng() * 0.4) * m, { retrace: 0.15 });
  const A = Math.min(...base.candles.map((k) => k.l), ...up.candles.map((k) => k.l));
  const B = Math.max(...up.candles.map((k) => k.h));
  const dn = legTo(rng, m, up.p, B - (0.46 + rng() * 0.05) * (B - A), { retrace: 0, step: [0.5, 0.75] });
  const deep = B - (0.69 + rng() * 0.03) * (B - A), near = A - (0.22 + rng() * 0.08) * m, d = deep - near;
  return { past: [...base.candles, ...up.candles, ...dn.candles], zones: [pivotLow(A, "Plus bas précédent"), pivotHigh(B)], deep, stops: [near, near - d, near - 2 * d] };
};

/** FVG haussier sous le prix, plus haut précédent au-dessus : retour dans le FVG attendu */
const fvgPending = (rng: Rng, m: number, o: BttOptimal): Scene => {
  const d0 = legTo(rng, m, 1.6 * m, 0, { retrace: 0.3 });
  const past = [...d0.candles];
  let p = d0.p;
  const imp = bullImpulse3Local(rng, m, p); past.push(...imp.candles); p = imp.p;
  const fvg = { lo: imp.candles[0].h, hi: imp.candles[2].l };
  const deep = fvg.lo + (0.5 + rng() * 0.1) * (fvg.hi - fvg.lo);
  const stops: [number, number, number] = [fvg.lo + (0.15 + rng() * 0.1) * (fvg.hi - fvg.lo), fvg.lo - (0.08 + rng() * 0.04) * m, imp.candles[0].l - (0.15 + rng() * 0.06) * m];
  const L = levelFor(rng, m, o, deep, deep, stops);
  const up = legTo(rng, m, p, L - 0.07 * m, { retrace: 0.2 }); past.push(...up.candles); p = up.p;
  past[past.length - 1] = { ...past[past.length - 1], h: L };
  const back = legTo(rng, m, p, fvg.hi + (0.5 + rng() * 0.15) * m, { retrace: 0.2 }); past.push(...back.candles);
  return { past, zones: [{ kind: "fvg", y1: fvg.lo, y2: fvg.hi, label: "FVG haussier" }, pivotHigh(L)], deep, stops, level: L };
};

// ─── Affirmations (lues dans le sens haussier) ──────────────────────────────

const flip = (k: Candle): Candle => ({ o: -k.o, c: -k.c, h: -k.l, l: -k.h });
const neg = <K extends string>(r: Record<K, number>) => mapPrices(r, (v) => -v);
export const asBull = (ch: BttChartLike): BttChartLike => ch.direction === "SELL"
  ? { ...ch, past: ch.past.map(flip), future: ch.future.map(flip), zones: mirrorZones(ch.zones, 0), direction: "BUY", entries: neg(ch.entries), stops: neg(ch.stops), tps: neg(ch.tps), currentPrice: -ch.currentPrice }
  : ch;
const zoneNamed = (ch: BttChartLike, re: RegExp) => ch.zones.find((z) => re.test(z.label));

const hammerOn = (re: RegExp, pierce: boolean): BttClaim => (c) => {
  const ch = asBull(c), z = zoneNamed(ch, re), k = last(ch.past), t = 0.25 * mr(ch.past);
  if (!z) return "zone absente";
  if (!isHammer(k)) return "la dernière bougie n'est pas un marteau";
  return pierce ? (k.l < lo(z) - t && Math.min(k.o, k.c) > hi(z) ? null : "la mèche du marteau ne traverse pas la zone") : (k.l <= hi(z) + t ? null : "le marteau ne touche pas la zone");
};
const engulfOn = (re: RegExp, pierce: boolean, back = 0): BttClaim => (c) => {
  const ch = asBull(c), z = zoneNamed(ch, re), t = 0.25 * mr(ch.past);
  const [a, b] = ch.past.slice(-2 - back, ch.past.length - back);
  if (!z) return "zone absente";
  if (!isBullEngulfing(a, b)) return "pas d'engulfing haussier";
  return pierce ? (a.l < lo(z) - t ? null : "la mèche de la bougie rouge ne traverse pas la zone") : (a.l <= hi(z) + t ? null : "l'engulfing ne touche pas la zone");
};
const dojiOn = (pierce: boolean): BttClaim => (c) => {
  const ch = asBull(c), z = zoneNamed(ch, /^Support$/), k = last(ch.past), t = 0.25 * mr(ch.past);
  if (!z) return "pas de support";
  if (!isDoji(k)) return "la dernière bougie n'est pas un doji";
  return pierce ? (k.l < lo(z) - t && Math.min(k.o, k.c) > hi(z) ? null : "la mèche du doji ne traverse pas le support") : (k.l <= hi(z) + t ? null : "le doji ne touche pas le support");
};
/** Le prix s'est déjà éloigné du niveau d'au moins `away` bougies médianes (entrée au marché tardive) */
const awayFrom = (re: RegExp, away: number): BttClaim => (c) => {
  const ch = asBull(c), z = zoneNamed(ch, re);
  if (!z) return "zone absente";
  return ch.currentPrice - hi(z) >= away * mr(ch.past) ? null : `prix à ${((ch.currentPrice - hi(z)) / mr(ch.past)).toFixed(2)} bougie médiane du niveau (≥ ${away} attendu)`;
};
/** Le TP optimal est juste avant le niveau opposé (moins d'une bougie médiane), qui tient dans la suite */
export const tpBeforeLevel = (tp: Tp, re = /^(Plus haut précédent|Haut du range)$/): BttClaim => (c) => {
  const ch = asBull(c), z = zoneNamed(ch, re);
  if (!z) return "niveau opposé absent";
  const gap = lo(z) - ch.tps[tp], t = mr(ch.past);
  if (gap <= 0 || gap > t) return `TP à ${(gap / t).toFixed(2)} bougie médiane du niveau (juste avant attendu)`;
  return Math.max(...ch.future.map((k) => k.h)) < hi(z) + 0.3 * t ? null : "la suite dépasse nettement le niveau opposé";
};
const sweepBack = (strong: boolean): BttClaim => (c) => {
  const ch = asBull(c), z = zoneNamed(ch, /^Plus bas précédent$/), k = last(ch.past), t = mr(ch.past);
  if (!z) return "pas de plus bas précédent";
  if (!(k.l < lo(z) - 0.25 * t && k.c > hi(z))) return "pas de mèche sous le plus bas précédent avec clôture au-dessus";
  const r = k.h - k.l, strongK = k.c - k.o >= 0.25 * r && k.h - k.c <= 0.15 * r, weakK = Math.abs(k.c - k.o) <= 0.15 * r;
  return strong ? (strongK ? null : "la bougie du sweep n'a pas de vrai corps vert") : (weakK ? null : "la bougie du sweep clôture avec force (pas d'hésitation)");
};
const fakeoutBack: BttClaim = (c) => {
  const ch = asBull(c), z = zoneNamed(ch, /^Bas du range$/); const [a, b] = ch.past.slice(-2);
  if (!z) return "pas de bas du range";
  return a.c < lo(z) && b.c > hi(z) ? null : "pas de clôture sous la borne puis réintégration";
};
/** Repli en cours : clôture actuelle à une part de l'impulsion (du plus bas précédent au plus haut précédent) */
const retraceNow = (min: number, max: number): BttClaim => (c) => {
  const ch = asBull(c), A = zoneNamed(ch, /^Plus bas précédent$/), B = zoneNamed(ch, /^Plus haut précédent$/);
  if (!A || !B) return "plus bas / plus haut précédent absents";
  const r = (lo(B) - ch.currentPrice) / (lo(B) - hi(A));
  return r >= min && r <= max ? null : `repli de ${(100 * r).toFixed(0)} % (attendu ${100 * min} à ${100 * max} %)`;
};
const deepAtRetrace = (min: number, max: number): BttClaim => (c) => {
  const ch = asBull(c), A = zoneNamed(ch, /^Plus bas précédent$/), B = zoneNamed(ch, /^Plus haut précédent$/);
  if (!A || !B) return "plus bas / plus haut précédent absents";
  const r = (lo(B) - ch.entries.deep_pullback) / (lo(B) - hi(A));
  return r >= min && r <= max ? null : `pullback profond à ${(100 * r).toFixed(0)} % du mouvement (attendu ${100 * min} à ${100 * max} %)`;
};
const retestPending: BttClaim = (c) => {
  const ch = asBull(c), z = zoneNamed(ch, /^Résistance cassée$/);
  if (!z) return "pas de résistance cassée";
  const i = ch.past.findIndex((k) => k.c > hi(z));
  if (i < 0) return "pas de breakout";
  if (ch.past.slice(i + 1).some((k) => k.l <= hi(z) + 0.1 * mr(ch.past))) return "le retest a déjà eu lieu";
  return ch.future.some((k) => k.l <= hi(z) + 0.2 * mr(ch.past)) ? null : "la suite ne revient pas tester l'ancienne résistance";
};
const fvgHoldsOnClose: BttClaim = (c) => {
  const ch = asBull(c), z = ch.zones.find((x) => x.kind === "fvg");
  if (!z) return "pas de FVG";
  if (!ch.future.some((k) => k.l < lo(z))) return "aucune mèche sous le FVG dans la suite";
  return ch.future.every((k) => k.c > lo(z)) ? null : "une clôture sous le FVG dans la suite (FVG cassé)";
};
const structureUp: BttClaim = (c) => {
  const ch = asBull(c), s = zoneNamed(ch, /^Swing low$/), h = zoneNamed(ch, /^Plus haut précédent$/);
  if (!s || !h) return "swing low / plus haut précédent absents";
  const first = Math.min(...ch.past.slice(0, 3).map((k) => k.l));
  if (!(lo(s) > first)) return "le swing low n'est pas un plus bas plus haut";
  return ch.currentPrice > hi(s) && ch.currentPrice < lo(h) ? null : "le prix n'est pas entre le swing low et le plus haut précédent";
};
const inOb: BttClaim = (c) => {
  const ch = asBull(c), z = zoneNamed(ch, /^Order Block/), k = last(ch.past);
  if (!z) return "pas d'OB";
  return isHammer(k) && k.l <= hi(z) + 0.25 * mr(ch.past) && Math.min(k.o, k.c) > lo(z) ? null : "pas de marteau dont la mèche entre dans l'OB";
};
const forceAway: BttClaim = (c) => {
  const ch = asBull(c), k = last(ch.past), bodies = ch.past.slice(0, -1).map((x) => Math.abs(x.c - x.o)).sort((a, b) => a - b);
  return k.c > k.o && k.c - k.o >= 1.6 * bodies[bodies.length >> 1] ? null : "la dernière bougie n'est pas une bougie de displacement";
};

// ─── Scénarios ────────────────────────────────────────────────────────────────

const DEB = { difficulties: ["beginner"] as const, macroContext: "normal" as const };
const INT = { difficulties: ["intermediate"] as const, macroContext: "normal" as const };
const ADV = { difficulties: ["advanced"] as const, macroContext: "normal" as const };
const O = (entry: Entry, stop: Stop, tp: Tp): BttOptimal => ({ entry, stop, tp });

const meche = O("aggressive", "wide", "fast"), engulf = O("aggressive", "tight", "balanced"), dojiPierce = O("confirmation", "wide", "fast");
const extended = O("deep_pullback", "tight", "ambitious"), retest = O("deep_pullback", "tight", "ambitious"), fibo = O("deep_pullback", "wide", "ambitious");
const structure = O("deep_pullback", "tight", "fast"), fakeout = O("aggressive", "wide", "balanced");
const ob = O("aggressive", "tight", "ambitious"), sweep = O("aggressive", "wide", "fast"), ote = O("deep_pullback", "tight", "ambitious"), fvg = O("deep_pullback", "wide", "fast");

export const BTT_NEW: BttScenario[] = [
  // ─── Débutant : une notion, un graphique propre ────────────────────────────
  { ...DEB, id: "deb_btt_meche_longue", title: "Marteau à longue mèche sur un support", direction: "BUY", htfBias: "bullish", notions: ["meches", "support_resistance"],
    context: "Un marteau vient de clôturer sur un support touché deux fois. Sa mèche est descendue nettement sous la zone. Plus haut, le plus haut précédent n'est pas loin.",
    optimal: meche,
    optimalExplain: "Entrée agressive : le marteau a clôturé, le rejet est fait. Stop éloigné : sous la pointe de la mèche, avec une marge ; les deux autres sont dans la zone que la mèche a déjà traversée. TP rapide : juste avant le plus haut précédent, où le prix risque de buter.",
    lessons: one("Une longue mèche montre jusqu'où les vendeurs ont poussé avant d'être rejetés : le stop se place au-delà de sa pointe, pas dans la zone qu'elle a déjà traversée (leçon Débutant 3)."),
    build: plan(meche, onSupport("marteau", pierceStops, { pierce: true })),
    claims: { "marteau dont la mèche traverse le support": hammerOn(/^Support$/, true), "TP rapide juste avant le plus haut précédent": tpBeforeLevel("fast") } },
  { ...DEB, id: "deb_btt_meche_longue_vente", title: "Étoile filante à longue mèche sous une résistance", direction: "SELL", htfBias: "bearish", notions: ["meches", "support_resistance"],
    context: "Une étoile filante vient de clôturer sous une résistance touchée deux fois. Sa mèche est montée nettement au-dessus de la zone. Plus bas, le plus bas précédent n'est pas loin.",
    optimal: meche,
    optimalExplain: "Entrée agressive : l'étoile filante a clôturé, le rejet est fait. Stop éloigné : au-dessus de la pointe de la mèche, avec une marge ; les deux autres sont dans la zone que la mèche a déjà traversée. TP rapide : juste avant le plus bas précédent, où le prix risque de rebondir.",
    lessons: one("Une longue mèche montre jusqu'où les acheteurs ont poussé avant d'être rejetés : le stop se place au-delà de sa pointe, pas dans la zone qu'elle a déjà traversée (leçon Débutant 3)."),
    build: mirrored(plan(meche, onSupport("marteau", pierceStops, { pierce: true }))),
    claims: { "marteau dont la mèche traverse le support": hammerOn(/^Support$/, true), "TP rapide juste avant le plus haut précédent": tpBeforeLevel("fast") } },
  { ...DEB, id: "deb_btt_engulfing", title: "Engulfing haussier sur un support", direction: "BUY", htfBias: "bullish", notions: ["engulfing", "support_resistance"],
    context: "Sur un support touché deux fois, une bougie verte vient d'avaler entièrement la bougie rouge d'avant. Le plus haut précédent est assez loin au-dessus.",
    optimal: engulf,
    optimalExplain: "Entrée agressive : l'engulfing a clôturé, les acheteurs ont repris la main. Stop proche : juste sous le support, avec une marge, c'est là que l'idée devient fausse ; les deux autres sont bien plus bas sans protéger mieux. TP équilibré : juste avant le plus haut précédent, à un peu plus de deux fois le risque.",
    lessons: one("Un engulfing haussier sur un support montre que les acheteurs ont repris la main : le stop se place sous le support, pas plus loin. Plus loin, la perte possible grossit sans raison (leçon Débutant 3)."),
    build: plan(engulf, onSupport("engulfing", nearX(underZone, "E0"))),
    claims: { "engulfing haussier sur le support": engulfOn(/^Support$/, false), "TP équilibré juste avant le plus haut précédent": tpBeforeLevel("balanced") } },
  { ...DEB, id: "deb_btt_engulfing_vente", title: "Engulfing baissier sous une résistance", direction: "SELL", htfBias: "bearish", notions: ["engulfing", "support_resistance"],
    context: "Sous une résistance touchée deux fois, une bougie rouge vient d'avaler entièrement la bougie verte d'avant. Le plus bas précédent est assez loin en dessous.",
    optimal: engulf,
    optimalExplain: "Entrée agressive : l'engulfing a clôturé, les vendeurs ont repris la main. Stop proche : juste au-dessus de la résistance, avec une marge ; les deux autres sont bien plus haut sans protéger mieux. TP équilibré : juste avant le plus bas précédent, à un peu plus de deux fois le risque.",
    lessons: one("Un engulfing baissier sous une résistance montre que les vendeurs ont repris la main : le stop se place au-dessus de la résistance, pas plus loin (leçon Débutant 3)."),
    build: mirrored(plan(engulf, onSupport("engulfing", nearX(underZone, "E0")))),
    claims: { "engulfing haussier sur le support": engulfOn(/^Support$/, false), "TP équilibré juste avant le plus haut précédent": tpBeforeLevel("balanced") } },
  { ...DEB, id: "deb_btt_swing", title: "Reprise au-dessus du dernier swing low", direction: "BUY", htfBias: "bullish", notions: ["stop_loss", "tendance"],
    context: "Les creux montent : le prix vient de repartir au-dessus du dernier swing low, juste sous le plus haut précédent.",
    optimal: O("aggressive", "tight", "ambitious"),
    optimalExplain: "Entrée agressive : la reprise est déjà là, au plus près du swing low. Stop proche : sous le swing low, avec une marge ; les deux autres sont bien plus bas sans raison. TP ambitieux : dans une tendance haussière, le plus haut précédent est souvent dépassé, et le stop serré laisse un R/R large.",
    lessons: one("Dans une tendance haussière, le dernier swing low porte l'idée : le stop se place juste dessous. Un stop bien placé et proche permet de viser loin sans prendre plus de risque (leçon Débutant 5)."),
    build: plan(O("aggressive", "tight", "ambitious"), (rng, m) => swingTrend(rng, m)),
    claims: { "reprise au-dessus du swing low": (c) => { const ch = asBull(c), z = zoneNamed(ch, /^Swing low$/); return z && ch.past.slice(-2).every((k) => k.c > k.o) && ch.currentPrice > hi(z) ? null : "pas de reprise au-dessus du swing low"; } } },
  { ...DEB, id: "deb_btt_doji_meche", title: "Doji à longue mèche sur un support", direction: "BUY", htfBias: "bullish", notions: ["doji", "support_resistance"],
    context: "Sur un support touché deux fois, la dernière bougie est un doji : corps presque nul, longue mèche basse qui a traversé la zone. Le plus haut précédent n'est pas loin.",
    optimal: dojiPierce,
    optimalExplain: "Entrée confirmation : un doji dit « indécision », pas « achat » ; on attend qu'une bougie verte le confirme. Stop éloigné : sous la pointe de la mèche du doji, avec une marge. TP rapide : juste avant le plus haut précédent.",
    lessons: one("Un doji montre l'indécision : seule la bougie suivante dit qui l'emporte. Sur un support, on attend la confirmation, et le stop va sous la mèche la plus basse (leçon Débutant 3)."),
    build: plan(dojiPierce, onSupport("doji", pierceStops, { pierce: true })),
    claims: { "doji dont la mèche traverse le support": dojiOn(true), "TP rapide juste avant le plus haut précédent": tpBeforeLevel("fast") } },
  { ...DEB, id: "deb_btt_doji_meche_vente", title: "Doji à longue mèche sous une résistance", direction: "SELL", htfBias: "bearish", notions: ["doji", "support_resistance"],
    context: "Sous une résistance touchée deux fois, la dernière bougie est un doji : corps presque nul, longue mèche haute qui a traversé la zone. Le plus bas précédent n'est pas loin.",
    optimal: dojiPierce,
    optimalExplain: "Entrée confirmation : un doji dit « indécision », pas « vente » ; on attend qu'une bougie rouge le confirme. Stop éloigné : au-dessus de la pointe de la mèche du doji, avec une marge. TP rapide : juste avant le plus bas précédent.",
    lessons: one("Un doji montre l'indécision : seule la bougie suivante dit qui l'emporte. Sous une résistance, on attend la confirmation, et le stop va au-dessus de la mèche la plus haute (leçon Débutant 3)."),
    build: mirrored(plan(dojiPierce, onSupport("doji", pierceStops, { pierce: true }))),
    claims: { "doji dont la mèche traverse le support": dojiOn(true), "TP rapide juste avant le plus haut précédent": tpBeforeLevel("fast") } },
  { ...DEB, id: "deb_btt_rebond_loin", title: "Rebond déjà loin du support", direction: "BUY", htfBias: "bullish", notions: ["rr", "support_resistance"],
    context: "Un marteau a rebondi sur un support touché deux fois, et une bougie verte a suivi : le prix s'est déjà éloigné de la zone. Le plus haut précédent est loin au-dessus.",
    optimal: extended,
    optimalExplain: "Entrée pullback profond : au prix actuel, le stop logique est loin et le R/R fond ; un ordre au retour vers le support garde un stop court. Stop proche : sous le support, avec une marge. TP ambitieux : juste avant le plus haut précédent, à près de quatre fois le risque depuis le support.",
    lessons: one("Le même trade peut avoir un bon ou un mauvais R/R selon le prix d'entrée : acheter près du support, avec un stop juste dessous, rapporte bien plus par unité de risque que d'acheter loin (leçon Débutant 6)."),
    build: plan(extended, onSupport("marteau", nearX(underZone, "deep"), { extend: 1 })),
    claims: { "prix déjà éloigné du support": awayFrom(/^Support$/, 0.7), "TP ambitieux juste avant le plus haut précédent": tpBeforeLevel("ambitious") } },
  { ...DEB, id: "deb_btt_rebond_loin_vente", title: "Rejet déjà loin de la résistance", direction: "SELL", htfBias: "bearish", notions: ["rr", "support_resistance"],
    context: "Une étoile filante a rejeté une résistance touchée deux fois, et une bougie rouge a suivi : le prix s'est déjà éloigné de la zone. Le plus bas précédent est loin en dessous.",
    optimal: extended,
    optimalExplain: "Entrée pullback profond : au prix actuel, le stop logique est loin et le R/R fond ; un ordre au retour vers la résistance garde un stop court. Stop proche : au-dessus de la résistance, avec une marge. TP ambitieux : juste avant le plus bas précédent, à près de quatre fois le risque depuis la résistance.",
    lessons: one("Le même trade peut avoir un bon ou un mauvais R/R selon le prix d'entrée : vendre près de la résistance, avec un stop juste au-dessus, rapporte bien plus par unité de risque que de vendre loin (leçon Débutant 6)."),
    build: mirrored(plan(extended, onSupport("marteau", nearX(underZone, "deep"), { extend: 1 }))),
    claims: { "prix déjà éloigné du support": awayFrom(/^Support$/, 0.7), "TP ambitieux juste avant le plus haut précédent": tpBeforeLevel("ambitious") } },
  { ...DEB, id: "deb_btt_rr_trop_faible", title: "Au prix actuel, le R/R ne suffit pas", direction: "BUY", htfBias: "bullish", notions: ["rr", "support_resistance"],
    context: "Sur un support touché deux fois, un engulfing haussier vient de clôturer ; la mèche de sa bougie rouge a traversé la zone. Le plus haut précédent est proche.",
    optimal: O("deep_pullback", "wide", "fast"),
    optimalExplain: "Entrée pullback profond : avec le stop sous la mèche de la bougie rouge, acheter maintenant donne un R/R sous 1 jusqu'au plus haut précédent ; au retour vers le support, il dépasse 1,5. Stop éloigné : sous la pointe de cette mèche, avec une marge. TP rapide : juste avant le plus haut précédent.",
    lessons: one("Avant d'entrer, on mesure le R/R : distance jusqu'à l'objectif divisée par la distance jusqu'au stop. S'il est trop faible au prix actuel, on attend un meilleur prix, ou on passe (leçon Débutant 6)."),
    build: plan(O("deep_pullback", "wide", "fast"), onSupport("engulfing", pierceStops, { pierce: true })),
    claims: { "engulfing dont la bougie rouge traverse le support": engulfOn(/^Support$/, true), "TP rapide juste avant le plus haut précédent": tpBeforeLevel("fast"),
      "R/R au prix actuel < 1,5": (c) => { const ch = asBull(c); const rr = (ch.tps.fast - ch.entries.aggressive) / (ch.entries.aggressive - ch.stops.wide); return rr < 1.5 ? null : `R/R au prix actuel ${rr.toFixed(2)}`; } } },
  { ...DEB, id: "deb_btt_doji_zone", title: "Doji posé sur un support", direction: "BUY", htfBias: "bullish", notions: ["doji", "support_resistance"],
    context: "Le prix touche un support déjà défendu deux fois ; la dernière bougie est un doji dont la mèche basse reste dans la zone. Le plus haut précédent est à bonne distance.",
    optimal: O("confirmation", "logical", "balanced"),
    optimalExplain: "Entrée confirmation : le doji montre l'hésitation, la bougie suivante doit confirmer le rebond. Stop médian : sous le support, avec une marge ; le proche reste dans la zone, là où le prix peut encore aller, et l'éloigné ne protège pas mieux. TP équilibré : juste avant le plus haut précédent.",
    lessons: one("Un doji sur un support n'est pas encore un signal : il dit seulement qu'il peut se passer quelque chose. On attend la bougie qui tranche, puis le stop se place sous la zone, pas dedans (leçon Débutant 3)."),
    build: plan(O("confirmation", "logical", "balanced"), onSupport("doji", (f, rng, m) => { const s = underZone(f, rng, m); return [f.lo + (0.45 + rng() * 0.2) * (f.hi - f.lo), s, s - (1.3 + rng() * 0.2) * m]; })),
    claims: { "doji sur le support": dojiOn(false), "TP équilibré juste avant le plus haut précédent": tpBeforeLevel("balanced") } },

  // ─── Intermédiaire : deux notions, un piège à écarter ──────────────────────
  { ...INT, id: "int_btt_retest_attendu", title: "Breakout parti, retest à attendre", direction: "BUY", htfBias: "bullish", notions: ["breakout", "changement_role"],
    trap: "Acheter tout de suite paraît éviter de rater le mouvement, mais le prix est loin du niveau cassé : le stop logique est loin et le R/R faible.",
    context: "Une résistance touchée deux fois vient d'être cassée par une bougie franche, et le prix a continué. Il n'est pas encore revenu tester la résistance cassée.",
    optimal: retest,
    optimalExplain: "Entrée pullback profond : après un breakout, le prix revient souvent tester le niveau cassé, devenu support ; l'ordre s'y place. Stop proche : sous la résistance cassée, avec une marge, là où le changement de rôle échouerait. TP ambitieux : au-dessus, plus aucun niveau ne bloque.",
    lessons: one("Après un breakout, l'ancienne résistance devient support : l'entrée au retest donne un stop court juste sous elle, et un R/R large dans le sens du breakout (leçon Intermédiaire 3)."),
    build: plan(retest, (rng, m) => breakoutAway(rng, m)),
    claims: { "retest pas encore fait, puis fait dans la suite": retestPending } },
  { ...INT, id: "int_btt_retest_attendu_vente", title: "Breakout baissier parti, retest à attendre", direction: "SELL", htfBias: "bearish", notions: ["breakout", "changement_role"],
    trap: "Vendre tout de suite paraît éviter de rater le mouvement, mais le prix est loin du niveau cassé : le stop logique est loin et le R/R faible.",
    context: "Un support touché deux fois vient d'être cassé par une bougie franche, et le prix a continué. Il n'est pas encore revenu tester le support cassé.",
    optimal: retest,
    optimalExplain: "Entrée pullback profond : après un breakout, le prix revient souvent tester le niveau cassé, devenu résistance ; l'ordre s'y place. Stop proche : au-dessus du support cassé, avec une marge. TP ambitieux : en dessous, plus aucun niveau ne bloque.",
    lessons: one("Après un breakout baissier, l'ancien support devient résistance : l'entrée au retest donne un stop court juste au-dessus, et un R/R large dans le sens du breakout (leçon Intermédiaire 3)."),
    build: mirrored(plan(retest, (rng, m) => breakoutAway(rng, m))),
    claims: { "retest pas encore fait, puis fait dans la suite": retestPending } },
  { ...INT, id: "int_btt_fibo_attendu", title: "Retracement en cours vers 61,8 %", direction: "BUY", htfBias: "bullish", notions: ["fibonacci", "pullback"],
    trap: "Le TP rapide sous le plus haut précédent paraît prudent, mais avec un stop sous le plus bas précédent, il rapporte à peine plus que le risque.",
    context: "Après une forte hausse, le prix corrige et n'a retracé qu'environ 40 % du mouvement. Le 61,8 % est plus bas, au-dessus du plus bas précédent.",
    optimal: fibo,
    optimalExplain: "Entrée pullback profond : l'ordre attend le 61,8 % au lieu d'acheter le milieu du repli. Stop éloigné : sous le plus bas précédent, avec une marge ; pile dessous, une mèche peut le balayer, et le proche est dans le bruit du repli. TP ambitieux : le plus haut précédent rapporterait trop peu pour ce risque, la tendance vise plus loin.",
    lessons: one("Un pullback à 61,8 % reste valable tant que le départ de la hausse tient : le stop va sous ce plus bas, avec une marge. Avec un stop aussi large, seul un objectif au-delà du plus haut précédent paie le risque (leçon Intermédiaire 9)."),
    build: plan(fibo, (rng, m) => fiboPending(rng, m)),
    claims: { "repli actuel de 30 à 50 %": retraceNow(0.3, 0.5), "pullback profond au 61,8 %": deepAtRetrace(0.6, 0.64) } },
  { ...INT, id: "int_btt_fibo_attendu_vente", title: "Rebond en cours vers 61,8 %", direction: "SELL", htfBias: "bearish", notions: ["fibonacci", "pullback"],
    trap: "Le TP rapide au-dessus du plus bas précédent paraît prudent, mais avec un stop au-dessus du plus haut précédent, il rapporte à peine plus que le risque.",
    context: "Après une forte baisse, le prix rebondit et n'a retracé qu'environ 40 % du mouvement. Le 61,8 % est plus haut, sous le plus haut précédent.",
    optimal: fibo,
    optimalExplain: "Entrée pullback profond : l'ordre attend le 61,8 % au lieu de vendre le milieu du rebond. Stop éloigné : au-dessus du plus haut précédent, avec une marge ; pile au-dessus, une mèche peut le balayer. TP ambitieux : le plus bas précédent rapporterait trop peu pour ce risque, la tendance vise plus loin.",
    lessons: one("Un pullback à 61,8 % reste valable tant que le départ de la baisse tient : le stop va au-dessus de ce plus haut, avec une marge. Avec un stop aussi large, seul un objectif au-delà du plus bas précédent paie le risque (leçon Intermédiaire 9)."),
    build: mirrored(plan(fibo, (rng, m) => fiboPending(rng, m))),
    claims: { "repli actuel de 30 à 50 %": retraceNow(0.3, 0.5), "pullback profond au 61,8 %": deepAtRetrace(0.6, 0.64) } },
  { ...INT, id: "int_btt_structure", title: "Repli vers le dernier swing low", direction: "BUY", htfBias: "bullish", notions: ["structure", "pullback"],
    trap: "Le TP ambitieux est tentant en tendance, mais le plus haut précédent est proche : le prix y bute souvent avant d'aller plus loin.",
    context: "La structure est haussière : un swing low plus haut, puis le plus haut précédent. Le prix se replie et descend vers le swing low.",
    optimal: structure,
    optimalExplain: "Entrée pullback profond : l'ordre attend le prix près du swing low, au lieu d'acheter le milieu du repli. Stop proche : sous le swing low, avec une marge, là où la structure casserait. TP rapide : juste avant le plus haut précédent, premier obstacle.",
    lessons: one("Dans une structure haussière, le dernier plus bas porte la tendance : on achète près de lui, stop juste dessous, et on vise d'abord le plus haut précédent (leçon Intermédiaire 1)."),
    build: plan(structure, structurePullback),
    claims: { "structure haussière, prix entre le swing low et le plus haut précédent": structureUp, "TP rapide juste avant le plus haut précédent": tpBeforeLevel("fast") } },
  { ...INT, id: "int_btt_structure_vente", title: "Rebond vers le dernier swing high", direction: "SELL", htfBias: "bearish", notions: ["structure", "pullback"],
    trap: "Le TP ambitieux est tentant en tendance, mais le plus bas précédent est proche : le prix y rebondit souvent avant d'aller plus loin.",
    context: "La structure est baissière : un swing high plus bas, puis le plus bas précédent. Le prix rebondit et remonte vers le swing high.",
    optimal: structure,
    optimalExplain: "Entrée pullback profond : l'ordre attend le prix près du swing high, au lieu de vendre le milieu du rebond. Stop proche : au-dessus du swing high, avec une marge. TP rapide : juste avant le plus bas précédent, premier obstacle.",
    lessons: one("Dans une structure baissière, le dernier plus haut porte la tendance : on vend près de lui, stop juste au-dessus, et on vise d'abord le plus bas précédent (leçon Intermédiaire 1)."),
    build: mirrored(plan(structure, structurePullback)),
    claims: { "structure haussière, prix entre le swing low et le plus haut précédent": structureUp, "TP rapide juste avant le plus haut précédent": tpBeforeLevel("fast") } },
  { ...INT, id: "int_btt_faux_breakout_range", title: "Faux breakout sous le bas du range", direction: "BUY", htfBias: "range", notions: ["range", "faux_breakout"],
    trap: "Le stop « pile sous le bas du range » paraît logique, mais le prix y est déjà passé : seule la pointe de la mèche marque l'invalidation.",
    context: "Une bougie a clôturé sous le bas du range, puis la suivante a réintégré le range avec force.",
    optimal: fakeout,
    optimalExplain: "Entrée agressive : la réintégration est faite, le piège a fonctionné. Stop éloigné : sous la mèche du faux breakout, avec une marge ; les deux autres sont là où le prix vient de passer. TP équilibré : juste avant le haut du range, l'autre borne.",
    lessons: one("Un faux breakout piège les vendeurs sous la borne : quand le prix réintègre le range, il repart souvent vers l'autre borne. Le stop se place sous la pointe du piège (leçon Intermédiaire 6)."),
    build: plan(fakeout, (rng, m) => rangeFakeout(rng, m)),
    claims: { "clôture sous le range, puis réintégration": fakeoutBack, "TP équilibré juste avant le haut du range": tpBeforeLevel("balanced") } },
  { ...INT, id: "int_btt_faux_breakout_range_vente", title: "Faux breakout au-dessus du haut du range", direction: "SELL", htfBias: "range", notions: ["range", "faux_breakout"],
    trap: "Le stop « pile au-dessus du haut du range » paraît logique, mais le prix y est déjà passé : seule la pointe de la mèche marque l'invalidation.",
    context: "Une bougie a clôturé au-dessus du haut du range, puis la suivante a réintégré le range avec force.",
    optimal: fakeout,
    optimalExplain: "Entrée agressive : la réintégration est faite, le piège a fonctionné. Stop éloigné : au-dessus de la mèche du faux breakout, avec une marge. TP équilibré : juste avant le bas du range, l'autre borne.",
    lessons: one("Un faux breakout piège les acheteurs au-dessus de la borne : quand le prix réintègre le range, il repart souvent vers l'autre borne. Le stop se place au-dessus de la pointe du piège (leçon Intermédiaire 6)."),
    build: mirrored(plan(fakeout, (rng, m) => rangeFakeout(rng, m))),
    claims: { "clôture sous le range, puis réintégration": fakeoutBack, "TP équilibré juste avant le haut du range": tpBeforeLevel("balanced") } },
  { ...INT, id: "int_btt_engulfing_retest", title: "Engulfing au retest de l'ancienne résistance", direction: "BUY", htfBias: "bullish", notions: ["changement_role", "engulfing"],
    trap: "Les stops bien plus bas paraissent plus « sûrs », mais l'invalidation se lit sous l'ancienne résistance devenue support.",
    context: "Une résistance a été cassée, le prix est monté jusqu'au plus haut précédent puis revenu sur elle. Un engulfing haussier vient de s'y former.",
    optimal: engulf,
    optimalExplain: "Entrée agressive : l'engulfing confirme le retest, le changement de rôle tient. Stop proche : sous l'ancienne résistance devenue support, avec une marge. TP équilibré : juste avant le plus haut précédent.",
    lessons: one("Au retest, l'ancienne résistance devenue support doit tenir : un signal d'achat dessus suffit, et le stop se place sous elle, pas plus loin (leçon Intermédiaire 3)."),
    build: plan(engulf, onRetest("engulfing", nearX(underZone, "E0"))),
    claims: { "engulfing haussier au retest": engulfOn(/^Ancienne résistance → support$/, false), "TP équilibré juste avant le plus haut précédent": tpBeforeLevel("balanced") } },
  { ...INT, id: "int_btt_marteau_retest", title: "Marteau à longue mèche au retest", direction: "BUY", htfBias: "bullish", notions: ["changement_role", "meches"],
    trap: "Le stop « pile sous l'ancienne résistance » paraît logique, mais la mèche du marteau est descendue plus bas : il serait déjà touché.",
    context: "Une résistance a été cassée, puis le prix est revenu sur elle. Un marteau vient de clôturer dessus ; sa mèche est descendue nettement sous la zone.",
    optimal: fakeout,
    optimalExplain: "Entrée agressive : le marteau a clôturé au-dessus du niveau, le retest tient. Stop éloigné : sous la pointe de la mèche, avec une marge ; les deux autres sont dans la zone que la mèche a traversée. TP équilibré : juste avant le plus haut précédent.",
    lessons: one("Au retest, une mèche peut plonger sous l'ancienne résistance sans casser le changement de rôle : c'est la clôture qui compte, et le stop va sous la pointe de la mèche (leçon Intermédiaire 3)."),
    build: plan(fakeout, onRetest("marteau", pierceStops, true)),
    claims: { "marteau dont la mèche traverse l'ancienne résistance": hammerOn(/^Ancienne résistance → support$/, true), "TP équilibré juste avant le plus haut précédent": tpBeforeLevel("balanced") } },

  // ─── Avancé : conflit à trancher ────────────────────────────────────────────
  { ...ADV, id: "adv_btt_order_block", title: "Marteau dans un Order Block", direction: "BUY", htfBias: "bullish", notions: ["order_block", "liquidite"],
    conflict: "Le prix vient de perdre une partie de l'impulsion : la lecture locale paraît baissière, mais l'Order Block d'origine tient et la liquidité est au-dessus.",
    context: "Le prix revient dans l'Order Block qui a lancé l'impulsion. Un marteau vient de clôturer, sa mèche dans la zone.",
    optimal: ob,
    optimalExplain: "Entrée agressive : le marteau montre que l'OB est défendu. Stop proche : sous le bas de l'Order Block, avec une marge, là où la zone est invalidée. TP ambitieux : au-delà du plus haut précédent, où dorment les stops des vendeurs.",
    lessons: one("Un Order Block défendu au retour est une entrée de précision : stop juste sous la zone, et objectif sur la liquidité au-delà du plus haut précédent (leçon Avancé 3)."),
    build: plan(ob, (rng, m) => obHammer(rng, m)),
    claims: { "marteau dans l'OB": inOb } },
  { ...ADV, id: "adv_btt_order_block_vente", title: "Étoile filante dans un Order Block baissier", direction: "SELL", htfBias: "bearish", notions: ["order_block", "liquidite"],
    conflict: "Le prix vient de reprendre une partie de la baisse : la lecture locale paraît haussière, mais l'Order Block d'origine tient et la liquidité est en dessous.",
    context: "Le prix revient dans l'Order Block baissier qui a lancé la baisse. Une étoile filante vient de clôturer, sa mèche dans la zone.",
    optimal: ob,
    optimalExplain: "Entrée agressive : l'étoile filante montre que l'OB est défendu. Stop proche : au-dessus du haut de l'Order Block, avec une marge. TP ambitieux : au-delà du plus bas précédent, où dorment les stops des acheteurs.",
    lessons: one("Un Order Block défendu au retour est une entrée de précision : stop juste au-dessus de la zone, et objectif sur la liquidité au-delà du plus bas précédent (leçon Avancé 3)."),
    build: mirrored(plan(ob, (rng, m) => obHammer(rng, m))),
    claims: { "marteau dans l'OB": inOb } },
  { ...ADV, id: "adv_btt_sweep", title: "Sweep du plus bas précédent, reprise franche", direction: "BUY", htfBias: "bullish", notions: ["sweep", "chasse_aux_stops"],
    conflict: "La mèche sous le plus bas précédent ressemble à un breakout baissier ; la grande bougie verte qui clôture au-dessus dit le contraire.",
    context: "Le prix vient de passer sous le plus bas précédent d'une mèche, puis une grande bougie verte a clôturé nettement au-dessus. Le plus haut précédent est la première résistance.",
    optimal: sweep,
    optimalExplain: "Entrée agressive : la clôture franche au-dessus du plus bas précédent confirme le sweep. Stop éloigné : sous la pointe de la mèche, avec une marge ; pile sous le plus bas précédent ou dans la mèche, il serait dans la zone de chasse aux stops. TP rapide : juste avant le plus haut précédent.",
    lessons: one("Un sweep va chercher les stops sous un plus bas évident puis repart : l'invalidation est la pointe de la mèche, et l'objectif le premier niveau opposé (leçon Avancé 1)."),
    build: plan(sweep, sweepLow(true)),
    claims: { "sweep avec clôture franche au-dessus": sweepBack(true), "TP rapide juste avant le plus haut précédent": tpBeforeLevel("fast") } },
  { ...ADV, id: "adv_btt_sweep_vente", title: "Sweep du plus haut précédent, rejet franc", direction: "SELL", htfBias: "bearish", notions: ["sweep", "chasse_aux_stops"],
    conflict: "La mèche au-dessus du plus haut précédent ressemble à un breakout haussier ; la grande bougie rouge qui clôture en dessous dit le contraire.",
    context: "Le prix vient de passer au-dessus du plus haut précédent d'une mèche, puis une grande bougie rouge a clôturé nettement en dessous. Le plus bas précédent est le premier support.",
    optimal: sweep,
    optimalExplain: "Entrée agressive : la clôture franche sous le plus haut précédent confirme le sweep. Stop éloigné : au-dessus de la pointe de la mèche, avec une marge. TP rapide : juste avant le plus bas précédent.",
    lessons: one("Un sweep va chercher les stops au-dessus d'un plus haut évident puis repart : l'invalidation est la pointe de la mèche, et l'objectif le premier niveau opposé (leçon Avancé 1)."),
    build: mirrored(plan(sweep, sweepLow(true))),
    claims: { "sweep avec clôture franche au-dessus": sweepBack(true), "TP rapide juste avant le plus haut précédent": tpBeforeLevel("fast") } },
  { ...ADV, id: "adv_btt_ote", title: "Repli rapide, zone OTE plus bas", direction: "BUY", htfBias: "bullish", notions: ["ote", "multi_ut"],
    conflict: "En UT inférieure, le repli rapide ressemble à un retournement ; l'UT supérieure reste haussière, et l'OTE achète justement ce repli.",
    context: "Après une forte impulsion, le prix se replie vite et a retracé environ la moitié du mouvement. La zone OTE (62 à 79 %) est plus bas, au-dessus du plus bas précédent.",
    optimal: ote,
    optimalExplain: "Entrée pullback profond : l'ordre attend la zone OTE, vers 70 %. Stop proche : sous le plus bas précédent, avec une marge, là où l'OTE est invalidée. TP ambitieux : au-delà du plus haut précédent, dans le sens de l'UT supérieure.",
    lessons: one("L'OTE place l'entrée entre 62 et 79 % du retracement, avec le stop sous le départ de l'impulsion : le risque est court, l'objectif au-delà du plus haut précédent (leçon Avancé 5)."),
    build: plan(ote, (rng, m) => otePending(rng, m)),
    claims: { "repli actuel de 40 à 58 %": retraceNow(0.4, 0.58), "pullback profond dans la zone OTE": deepAtRetrace(0.62, 0.79) } },
  { ...ADV, id: "adv_btt_ote_vente", title: "Rebond rapide, zone OTE plus haut", direction: "SELL", htfBias: "bearish", notions: ["ote", "multi_ut"],
    conflict: "En UT inférieure, le rebond rapide ressemble à un retournement ; l'UT supérieure reste baissière, et l'OTE vend justement ce rebond.",
    context: "Après une forte baisse, le prix rebondit vite et a retracé environ la moitié du mouvement. La zone OTE (62 à 79 %) est plus haut, sous le plus haut précédent.",
    optimal: ote,
    optimalExplain: "Entrée pullback profond : l'ordre attend la zone OTE, vers 70 %. Stop proche : au-dessus du plus haut précédent, avec une marge. TP ambitieux : au-delà du plus bas précédent, dans le sens de l'UT supérieure.",
    lessons: one("L'OTE place l'entrée entre 62 et 79 % du retracement, avec le stop au-dessus du départ de la baisse : le risque est court, l'objectif au-delà du plus bas précédent (leçon Avancé 5)."),
    build: mirrored(plan(ote, (rng, m) => otePending(rng, m))),
    claims: { "repli actuel de 40 à 58 %": retraceNow(0.4, 0.58), "pullback profond dans la zone OTE": deepAtRetrace(0.62, 0.79) } },
  { ...ADV, id: "adv_btt_fvg", title: "Retour attendu dans un FVG haussier", direction: "BUY", htfBias: "bullish", notions: ["fvg", "entree_precision"],
    conflict: "Une mèche qui traverse le FVG donne l'impression qu'il est cassé ; seule une clôture dessous l'invaliderait.",
    context: "Une impulsion a laissé un FVG haussier, puis le prix a atteint le plus haut précédent. Il redescend vers le FVG.",
    optimal: fvg,
    optimalExplain: "Entrée pullback profond : l'ordre attend le milieu du FVG. Stop éloigné : sous la bougie qui a créé le FVG, avec une marge ; dans le FVG ou pile dessous, une mèche peut le toucher sans invalider la zone. TP rapide : juste avant le plus haut précédent.",
    lessons: one("Un FVG est une zone, pas une ligne : le prix peut la traverser d'une mèche. Le stop va sous la bougie d'origine du FVG, et l'entrée au milieu de la zone garde un R/R correct (leçon Avancé 2)."),
    build: plan(fvg, fvgPending),
    claims: { "FVG touché d'une mèche, jamais cassé en clôture": fvgHoldsOnClose, "TP rapide juste avant le plus haut précédent": tpBeforeLevel("fast") } },
  { ...ADV, id: "adv_btt_fvg_vente", title: "Retour attendu dans un FVG baissier", direction: "SELL", htfBias: "bearish", notions: ["fvg", "entree_precision"],
    conflict: "Une mèche qui traverse le FVG donne l'impression qu'il est cassé ; seule une clôture au-dessus l'invaliderait.",
    context: "Une baisse a laissé un FVG baissier, puis le prix a atteint le plus bas précédent. Il remonte vers le FVG.",
    optimal: fvg,
    optimalExplain: "Entrée pullback profond : l'ordre attend le milieu du FVG. Stop éloigné : au-dessus de la bougie qui a créé le FVG, avec une marge. TP rapide : juste avant le plus bas précédent.",
    lessons: one("Un FVG est une zone, pas une ligne : le prix peut la traverser d'une mèche. Le stop va au-dessus de la bougie d'origine du FVG, et l'entrée au milieu de la zone garde un R/R correct (leçon Avancé 2)."),
    build: mirrored(plan(fvg, fvgPending)),
    claims: { "FVG touché d'une mèche, jamais cassé en clôture": fvgHoldsOnClose, "TP rapide juste avant le plus haut précédent": tpBeforeLevel("fast") } },
  { ...ADV, id: "adv_btt_bougie_force", title: "Bougie de displacement loin du support", direction: "BUY", htfBias: "bullish", notions: ["entree_precision", "volatilite"],
    conflict: "La bougie de displacement donne envie d'acheter tout de suite ; mais elle a étiré le prix loin du support, et au marché le stop logique est loin.",
    context: "Le prix a touché un support défendu deux fois, puis une grande bougie verte l'a envoyé loin au-dessus de la zone. Le plus haut précédent est plus haut.",
    optimal: O("deep_pullback", "tight", "balanced"),
    optimalExplain: "Entrée pullback profond : après une bougie aussi ample, le prix revient souvent vers la zone ; l'ordre y attend. Stop proche : sous le support, avec une marge. TP équilibré : juste avant le plus haut précédent.",
    lessons: one("Une entrée de précision attend le retour au niveau plutôt que de courir après une bougie de displacement : le stop reste court, le R/R reste bon (leçon Avancé 7)."),
    build: plan(O("deep_pullback", "tight", "balanced"), (rng, m, o) => onSupport("marteau", nearX(underZone, "deep"), { deepAt: 0.3 + rng() * 0.06, force: true })(rng, m, o)),
    claims: { "bougie de displacement en dernière bougie": forceAway, "prix déjà éloigné du support": awayFrom(/^Support$/, 1), "TP équilibré juste avant le plus haut précédent": tpBeforeLevel("balanced") } },
  { ...ADV, id: "adv_btt_sweep_hesitant", title: "Sweep sans clôture franche", direction: "BUY", htfBias: "bullish", notions: ["chasse_aux_stops", "liquidite"],
    conflict: "La mèche sous le plus bas précédent peut être un sweep ou le début d'un vrai breakout : la petite clôture juste au-dessus n'a pas encore tranché.",
    context: "Le prix vient de passer sous le plus bas précédent d'une mèche, mais la bougie clôture juste au-dessus, avec un petit corps. Le plus haut précédent est plus haut.",
    optimal: O("confirmation", "logical", "balanced"),
    optimalExplain: "Entrée confirmation : la clôture ne prouve rien encore ; une bougie qui repart au-dessus confirmerait le sweep. Stop médian : sous la pointe de la mèche, avec une marge ; pile sous le plus bas précédent, il est dans la zone déjà balayée, et l'éloigné ne protège pas mieux. TP équilibré : juste avant le plus haut précédent.",
    lessons: one("Une mèche sous un plus bas évident n'est un sweep que si le prix repart : sans clôture franche, on attend la confirmation, et le stop va sous la pointe de la mèche (leçon Avancé 6)."),
    build: plan(O("confirmation", "logical", "balanced"), sweepLow(false)),
    claims: { "mèche sous le plus bas précédent, clôture sans force": sweepBack(false), "TP équilibré juste avant le plus haut précédent": tpBeforeLevel("balanced") } },
];
