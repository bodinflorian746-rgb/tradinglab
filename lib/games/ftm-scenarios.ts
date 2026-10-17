// Trouve l'erreur — scénarios construits sur les scènes partagées (lib/games/scenes.ts).
// Chaque scénario : un seul niveau, ses notions (lib/games/notions.ts), son graphique avec ses lignes
// (`build`, unités abstraites) et ses affirmations vérifiées sur le graphique (`claims`,
// scripts/audit-jeux/coherence-ftm.ts). Les leurres restent dans les notions du niveau.

import type { Candle, ChartZone } from "./shared";
import { candle, rangeLegs } from "./shared";
import type { NotionId } from "./notions";
export { MISTAKE_NOTION } from "./notions";
import { chop, drop, legTo, mirrorCandles, mirrorZones, provenResistance, provenSupport, rally, isHammer, range, type Rng } from "./scenes";
import { supportScene, rebound, hammerNowhere, rangeScene, obScene } from "./bsnt-scenarios";

type Difficulty = "beginner" | "intermediate" | "advanced";
type Category = "technique" | "psychologique" | "execution" | "rr" | "timing" | "liquidite" | "discipline";
type Shape = "uptrend_pullback" | "downtrend_pullback" | "approach_resistance" | "approach_support" | "range_oscillation" | "fast_rally" | "fast_dump" | "weak_breakout" | "calm_before_news" | "sweep_low_done" | "fvg_deep_pullback" | "high_vol_pullback";
export interface FtmRaw { past: Candle[]; future: Candle[]; zones: ChartZone[]; entry?: number; stop?: number; tp?: number }
interface ChartLike { past: Candle[]; future: Candle[]; zones: ChartZone[]; entry?: number; stop?: number; tp?: number }
type Claim = (ch: ChartLike) => string | null;

export interface FtmScenario {
  id: string; title: string; category: Category; chartShape: Shape;
  direction: "BUY" | "SELL" | null; htfBias: "bullish" | "bearish" | "range"; macroContext: "normal" | "dangereux";
  context: string; correctMistake: string; decoyMistakes: readonly [string, string, string];
  explanation: string; lessons: { beginner: string; intermediate: string; advanced: string };
  difficulties: readonly Difficulty[]; extraInfo?: string;
  metaOverride?: { session?: "Asie" | "Londres" | "New York" | "Overlap" | "Heures mortes"; spread?: "faible" | "élevé"; volatility?: "faible" | "normale" | "élevée" };
  notions: readonly NotionId[]; trap?: string; conflict?: string;
  build?: (rng: Rng, m: number) => FtmRaw; claims: Record<string, Claim>;
  showLines?: "buy_with_liquidity_stop";
}

// ─── Aides ────────────────────────────────────────────────────────────────────

const AXIS = 10;
const mirrored = (b: NonNullable<FtmScenario["build"]>): NonNullable<FtmScenario["build"]> => (rng, m) => {
  const r = b(rng, m);
  const f = (x?: number) => (x === undefined ? undefined : AXIS - x);
  return { past: mirrorCandles(r.past, AXIS), future: mirrorCandles(r.future, AXIS), zones: mirrorZones(r.zones, AXIS), entry: f(r.entry), stop: f(r.stop), tp: f(r.tp) };
};
const one = (text: string) => ({ beginner: text, intermediate: text, advanced: text });
const last = <T,>(a: T[]) => a[a.length - 1];
const lo = (z: ChartZone) => Math.min(z.y1, z.y2);
const hi = (z: ChartZone) => Math.max(z.y1, z.y2);
const mr = (cs: Candle[]) => { const s = cs.map(range).sort((a, b) => a - b); return s[s.length >> 1] || 1; };
const band = (m: number) => ({ lo: -0.13 * m, hi: 0.13 * m });
const zone = (kind: ChartZone["kind"], c: number, m: number, label: string): ChartZone => ({ kind, y1: c - 0.13 * m, y2: c + 0.13 * m, label });
/** Extrême nommé (plus bas / haut précédent, swing) : trait posé juste au-delà de la pointe (le tracé le recale
 *  sur elle ; posé dans la mèche, la passe de réalisme la prenait pour une mèche structurelle et l'allongeait) */
const pivot = (side: "bas" | "haut", v: number, label: string, at?: number): ChartZone =>
  side === "bas" ? { kind: "support", y1: v - 0.03, y2: v - 0.01, label, ...(at !== undefined ? { at } : {}) }
                 : { kind: "liquidity_high", y1: v + 0.01, y2: v + 0.03, label, ...(at !== undefined ? { at } : {}) };
const byLabel = (ch: ChartLike, re: RegExp) => ch.zones.find((z) => re.test(z.label));
const flip = (k: Candle): Candle => ({ o: -k.o, c: -k.c, h: -k.l, l: -k.h });
const asBull = (ch: ChartLike, sell: boolean): ChartLike => sell
  ? { past: ch.past.map(flip), future: ch.future.map(flip), zones: mirrorZones(ch.zones, 0), entry: ch.entry === undefined ? undefined : -ch.entry, stop: ch.stop === undefined ? undefined : -ch.stop, tp: ch.tp === undefined ? undefined : -ch.tp }
  : ch;

/** Tendance haussière (plus hauts et plus bas croissants), fin au sommet */
function uptrend(rng: Rng, m: number, p0 = 0): { past: Candle[]; p: number; lows: number[]; lowAt: number[] } {
  const past: Candle[] = []; const lows: number[] = []; const lowAt: number[] = [];
  let p = p0;
  for (let leg = 0; leg < 3; leg++) {
    const up = legTo(rng, m, p, p + (1.6 + rng() * 0.4) * m, { retrace: 0.2 });
    past.push(...up.candles); p = up.p;
    if (leg < 2) { const dn = legTo(rng, m, p, p - (0.9 + rng() * 0.2) * m, { retrace: 0 }); past.push(...dn.candles); p = dn.p; lows.push(p); lowAt.push(past.length - 1); }
  }
  return { past, p, lows, lowAt };
}

// ─── Constructions Débutant (sens haussier) ─────────────────────────────────

const buyRebound = (rng: Rng, m: number) => { const b = band(m); const s = supportScene(rng, m); const r = rebound(rng, m, s.p, b); return { past: [...s.past, ...r.candles], p: r.p, b }; };

const bNoStop: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const s = buyRebound(rng, m);
  return { past: s.past, future: drop(rng, m, s.p, 5).candles, zones: [zone("support", 0, m, "Support")], entry: s.p };
};
const bTpBeyond: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const b = band(m), R = (3.4 + rng() * 0.3) * m;
  const legs = rangeLegs(rng, 0.8 * m, 0, R, 7, 3, m, false, 0.25 * m, 0.1 * m);
  const r = rebound(rng, m, legs.p, b);
  const f1 = rally(rng, m, r.p, 3, R - 0.15 * m), f2 = drop(rng, m, f1.p, 2);
  return {
    past: [...legs.candles, ...r.candles], future: [...f1.candles, ...f2.candles],
    zones: [zone("support", 0, m, "Support"), zone("resistance", R, m, "Résistance")],
    entry: r.p, stop: b.lo - 0.25 * m, tp: R + (0.9 + rng() * 0.3) * m,
  };
};
const bBuyUnderRes: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const R = 0;
  const t = provenResistance(rng, m, R - 0.13 * m, R + 0.13 * m);
  const a = legTo(rng, m, t.p, R - (0.42 + rng() * 0.12) * m, { retrace: 0.3 });
  return { past: [...t.candles, ...a.candles], future: drop(rng, m, a.p, 4).candles, zones: [zone("resistance", R, m, "Résistance")], entry: a.p };
};
const bStopMoved: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const s = buyRebound(rng, m);
  const back = legTo(rng, m, s.p, s.b.hi + (0.15 + rng() * 0.08) * m, { retrace: 0 });
  return { past: [...s.past, ...back.candles], future: drop(rng, m, back.p, 4).candles, zones: [zone("support", 0, m, "Support")], stop: s.b.lo - (2.0 + rng() * 0.3) * m };
};
const bOvertrading: NonNullable<FtmScenario["build"]> = (rng, m) => {
  // le prix tourne autour d'un même prix, sans s'en écarter (aucun niveau, aucune tendance)
  const past: Candle[] = [];
  let p = 0;
  for (let i = 0; i < 15; i++) { const c = Math.max(-0.5 * m, Math.min(0.5 * m, p * 0.4 + (rng() - 0.5) * 0.6 * m)); past.push(candle(p, c, (0.08 + rng() * 0.12) * m, (0.08 + rng() * 0.12) * m)); p = c; }
  // dernière bougie : retour au prix d'il y a douze bougies (aucun déplacement net)
  { const c = past[past.length - 11].o + (rng() - 0.5) * 0.06 * m + (Math.abs(past[past.length - 11].o - p) < 0.02 * m ? 0.04 * m : 0); past.push(candle(p, c, (0.08 + rng() * 0.1) * m, (0.08 + rng() * 0.1) * m)); p = c; }
  return { past, future: chop(rng, m, p, 5).candles, zones: [], entry: p };
};
const bLossNotCut: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const b = band(m);
  const t = provenSupport(rng, m, b.lo, b.hi);
  const a = legTo(rng, m, t.p, b.hi + 0.5 * m);
  const past = [...t.candles, ...a.candles];
  let p = a.p;
  const c1 = b.lo - (0.4 + rng() * 0.1) * m;
  past.push({ o: p, c: c1, h: p + 0.04 * m, l: c1 - 0.06 * m }); p = c1;
  const d = drop(rng, m, p, 3); past.push(...d.candles); p = d.p;
  return { past, future: drop(rng, m, p, 3).candles, zones: [zone("support", 0, m, "Support")] };
};
const bSizeAfterWins: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const s = buyRebound(rng, m);
  const stop = s.b.lo - 0.15 * m;
  return { past: s.past, future: rally(rng, m, s.p, 5).candles, zones: [zone("support", 0, m, "Support")], entry: s.p, stop, tp: s.p + 2.5 * (s.p - stop) };
};
const bPatternNowhere: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const r = hammerNowhere(rng, m, "beginner");
  return { ...r, entry: last(r.past).c, stop: last(r.past).l - 0.12 * m };
};

// ─── Constructions Intermédiaire (sens haussier) ────────────────────────────

/** Tendance haussière puis repli local (vente contre la tendance) */
const iSellPullback: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const u = uptrend(rng, m);
  const top = Math.max(...u.past.map((k) => k.h));
  const dn = legTo(rng, m, u.p, u.p - (1.4 + rng() * 0.15) * m, { retrace: 0, step: [0.4, 0.5] });
  return { past: [...u.past, ...dn.candles], future: rally(rng, m, dn.p, 4).candles, zones: [pivot("haut", top, "Plus haut précédent")], entry: dn.p };
};
/** Mèche au-dessus de la résistance, clôture revenue dessous : achat de ce « breakout » */
const iFakeoutBought: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const R = 0;
  const t = provenResistance(rng, m, R - 0.13 * m, R + 0.13 * m);
  const a = legTo(rng, m, t.p, R - 0.45 * m, { retrace: 0.3 });
  const o = a.p, c = R - (0.2 + rng() * 0.08) * m;
  const k: Candle = { o, c, h: R + (0.6 + rng() * 0.2) * m, l: o - 0.04 * m };
  return { past: [...t.candles, ...a.candles, k], future: drop(rng, m, c, 4).candles, zones: [zone("resistance", R, m, "Résistance")], entry: c };
};
/** Tendance haussière, puis clôture sous le dernier plus bas (CHoCH), petit rebond, achat */
const iStructureIgnored: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const u = uptrend(rng, m);
  const hl = last(u.lows);
  const past = [...u.past];
  let p = u.p;
  const dn = legTo(rng, m, p, hl - (2.0 + rng() * 0.1) * m, { retrace: 0 }); past.push(...dn.candles); p = dn.p;
  const up = legTo(rng, m, p, hl - (1.1 + rng() * 0.05) * m, { retrace: 0 }); past.push(...up.candles); p = up.p;
  // (le dernier plus bas désigné : la bougie qui clôture au creux, pour le tracé)
  return { past, future: drop(rng, m, p, 4).candles, zones: [pivot("bas", Math.min(u.past[last(u.lowAt)].l, u.past[last(u.lowAt) + 1].l), "Plus bas précédent", last(u.lowAt))], entry: p };
};
/** Résistance cassée, pullback qui clôture sous elle : achat sous le niveau cassé */
const iBrokenLevelBought: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const R = 0;
  const t = provenResistance(rng, m, R - 0.13 * m, R + 0.13 * m);
  const a = legTo(rng, m, t.p, R + (1.8 + rng() * 0.3) * m, { retrace: 0.2 });
  const back = legTo(rng, m, a.p, R + 0.35 * m, { retrace: 0 });
  const past = [...t.candles, ...a.candles, ...back.candles];
  let p = back.p;
  const c = R - (0.35 + rng() * 0.1) * m;
  past.push({ o: p, c, h: p + 0.04 * m, l: c - 0.05 * m }); p = c;
  return { past, future: drop(rng, m, p, 4).candles, zones: [zone("support", R, m, "Support")], entry: p };
};
/** Rebond sur un support, stop posé dans la zone */
const iStopInsideZone: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const s = buyRebound(rng, m);
  const stop = s.b.hi - 0.02 * m;
  const d = drop(rng, m, s.p, 2), r = rally(rng, m, d.p, 3);
  return { past: s.past, future: [...d.candles, ...r.candles], zones: [zone("support", 0, m, "Support")], entry: s.p, stop, tp: s.p + 2.2 * (s.p - stop) };
};
/** Résistance cassée, quatre bougies plus loin : achat loin du niveau */
const iBreakoutChased: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const R = 0;
  const t = provenResistance(rng, m, R - 0.13 * m, R + 0.13 * m);
  const a = legTo(rng, m, t.p, R - 0.4 * m, { retrace: 0.3 });
  const past = [...t.candles, ...a.candles];
  let p = a.p;
  const c0 = R + (0.4 + rng() * 0.1) * m;
  past.push({ o: p, c: c0, h: c0 + 0.06 * m, l: p - 0.04 * m }); p = c0;
  const r = rally(rng, m, p, 6); past.push(...r.candles); p = r.p;
  return { past, future: drop(rng, m, p, 4).candles, zones: [zone("resistance", R, m, "Résistance cassée")], entry: p, stop: R - 0.3 * m };
};
/** Hausse de A à B, repli d'environ 25 % seulement : achat haut dans le retracement */
const iFibMisread: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const base = chop(rng, m, 0, 3, -0.03);
  const A = Math.min(...base.candles.map((k) => k.l));
  const up = legTo(rng, m, base.p, base.p + (3.6 + rng() * 0.4) * m, { retrace: 0.15 });
  const B = Math.max(...up.candles.map((k) => k.h));
  const target = B - (0.22 + rng() * 0.06) * (B - A);
  const dn = legTo(rng, m, up.p, target, { retrace: 0 });
  return {
    past: [...base.candles, ...up.candles, ...dn.candles], future: [...drop(rng, m, dn.p, 3).candles],
    zones: [pivot("haut", B, "Plus haut précédent")], entry: dn.p, stop: A - 0.2 * m,
  };
};
/** Rebond sur un support, TP posé au-delà d'une résistance de l'UT supérieure */
const iTpBeyondHtf: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const r = bTpBeyond(rng, m);
  return { ...r, zones: [r.zones[0], { ...r.zones[1], label: "Résistance UT supérieure" }] };
};
/** Range : achat au haut du range, sans clôture au-delà */
const iRangeTopBought: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const R = (4.6 + rng() * 0.5) * m;
  const s = rangeScene(rng, m, R, 4);
  const up = legTo(rng, m, s.p, R - (0.4 + rng() * 0.1) * m, { retrace: 0.2 });
  return {
    past: [...s.past, ...up.candles], future: drop(rng, m, up.p, 4).candles,
    zones: [{ kind: "support", y1: -0.13 * m, y2: 0.13 * m, label: "Bas du range" }, { kind: "resistance", y1: R - 0.13 * m, y2: R + 0.13 * m, label: "Haut du range" }],
    entry: up.p,
  };
};
/** Achat sur un plus bas touché une seule fois, sans autre argument */
const iWeakLevel: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const L = 0;
  const d1 = legTo(rng, m, 2.6 * m, L + 0.3 * m, { retrace: 0.3 });
  const past = [...d1.candles];
  let p = d1.p;
  past.push({ o: p, c: L + 0.35 * m, h: p + 0.08 * m, l: L }); p = L + 0.35 * m;
  const up = legTo(rng, m, p, L + (1.9 + rng() * 0.3) * m, { retrace: 0.2 }); past.push(...up.candles); p = up.p;
  const dn = legTo(rng, m, p, L + (0.3 + rng() * 0.1) * m, { retrace: 0.2 }); past.push(...dn.candles); p = dn.p;
  return { past, future: drop(rng, m, p, 4).candles, zones: [pivot("bas", L, "Plus bas précédent")], entry: p };
};

// ─── Constructions Avancé (sens haussier) ───────────────────────────────────

const aDeadOb: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const s = obScene(rng, m);
  const past = [...s.past];
  let p = s.p;
  const c = s.zone.y1 - (0.4 + rng() * 0.1) * m;
  past.push({ o: p, c, h: p + 0.04 * m, l: c - 0.06 * m }); p = c;
  const d = drop(rng, m, p, 1); past.push(...d.candles); p = d.p;
  const up = legTo(rng, m, p, s.zone.y1 - (0.05 + rng() * 0.05) * m, { retrace: 0 }); past.push(...up.candles); p = up.p;
  return { past, future: drop(rng, m, p, 4).candles, zones: [s.zone], entry: p };
};
const aDeadSession: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const c = chop(rng, m, 0, 12, 0);
  const top = Math.max(...c.candles.map((k) => k.h));
  const o = c.p, cc = top + (0.75 + rng() * 0.1) * m;
  const k: Candle = { o, c: cc, h: cc + 0.05 * m, l: o - 0.04 * m };
  const fc = chop(rng, m, cc, 2, -0.05);
  return { past: [...c.candles, k], future: [...fc.candles, ...drop(rng, m, fc.p, 3).candles], zones: [], entry: cc };
};
const aOteMiss: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const base = chop(rng, m, 0, 3, -0.03);
  const A = Math.min(...base.candles.map((k) => k.l));
  const up = legTo(rng, m, base.p, base.p + (3.6 + rng() * 0.4) * m, { retrace: 0.15 });
  const B = Math.max(...up.candles.map((k) => k.h));
  const dn = legTo(rng, m, up.p, B - (0.34 + rng() * 0.06) * (B - A), { retrace: 0 });
  return {
    past: [...base.candles, ...up.candles, ...dn.candles], future: (() => { const d = drop(rng, m, dn.p, 3); return [...d.candles, ...rally(rng, m, d.p, 2).candles]; })(),
    zones: [pivot("haut", B, "Plus haut précédent"), pivot("bas", A, "Plus bas précédent")],
    entry: dn.p, stop: A - 0.25 * m,
  };
};
const aFakeSweep: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const L = 0;
  const d1 = legTo(rng, m, 2.4 * m, L + 0.3 * m, { retrace: 0.3 });
  const past = [...d1.candles];
  let p = d1.p;
  past.push({ o: p, c: L + 0.4 * m, h: p + 0.06 * m, l: L }); p = L + 0.4 * m;
  const up = legTo(rng, m, p, L + (1.6 + rng() * 0.2) * m, { retrace: 0.2 }); past.push(...up.candles); p = up.p;
  const dn = legTo(rng, m, p, L + 0.4 * m, { retrace: 0.2 }); past.push(...dn.candles); p = dn.p;
  const c1 = L - (0.35 + rng() * 0.1) * m; past.push({ o: p, c: c1, h: p + 0.04 * m, l: c1 - 0.15 * m }); p = c1;
  const c2 = p - (0.25 + rng() * 0.1) * m; past.push({ o: p, c: c2, h: p + 0.05 * m, l: c2 - 0.06 * m }); p = c2;
  return { past, future: drop(rng, m, p, 4).candles, zones: [pivot("bas", L, "Plus bas précédent")], entry: p };
};
/** Sweep du plus haut (mèche au-dessus, clôture revenue dessous) : achat du « breakout » (sens baissier construit puis renversé) */
const aSweepLowSold: NonNullable<FtmScenario["build"]> = (rng, m) => {
  const L = 0;
  const d1 = legTo(rng, m, 2.4 * m, L + 0.3 * m, { retrace: 0.3 });
  const past = [...d1.candles];
  let p = d1.p;
  past.push({ o: p, c: L + 0.4 * m, h: p + 0.06 * m, l: L }); p = L + 0.4 * m;
  const up = legTo(rng, m, p, L + (1.6 + rng() * 0.2) * m, { retrace: 0.2 }); past.push(...up.candles); p = up.p;
  const dn = legTo(rng, m, p, L + 0.75 * m, { retrace: 0.2 }); past.push(...dn.candles); p = dn.p;
  const c = L + (0.35 + rng() * 0.08) * m;
  past.push({ o: p, c, h: p + 0.04 * m, l: L - (1.0 + rng() * 0.2) * m }); p = c;
  return { past, future: rally(rng, m, p, 4).candles, zones: [pivot("bas", L, "Plus bas précédent"), { kind: "liquidity_low", y1: L - 0.6 * m, y2: L - 0.05 * m, label: "Liquidité balayée" }], entry: p };
};

// ─── Affirmations ─────────────────────────────────────────────────────────────

const entryAbove = (re: RegExp, sell = false): Claim => (c) => { const ch = asBull(c, sell); const z = byLabel(ch, re); return z && ch.entry !== undefined && ch.entry > hi(z) ? null : "l'entrée n'est pas au-dessus du niveau"; };
const tpBeyond = (re: RegExp): Claim => (ch) => { const z = byLabel(ch, re); return z && ch.tp !== undefined && ch.tp > hi(z) + 0.3 * mr(ch.past) ? null : "le TP n'est pas au-delà de la résistance"; };
const underRes = (sell: boolean): Claim => (c) => {
  const ch = asBull(c, sell); const z = byLabel(ch, /^Résistance$/); if (!z || ch.entry === undefined) return "pas de résistance ou d'entrée";
  if (!(ch.entry < lo(z))) return "l'entrée n'est pas sous la résistance";
  return lo(z) - ch.entry <= 1.2 * mr(ch.past) ? null : "l'entrée n'est pas « juste sous » la résistance";
};
const stopFarBelow: Claim = (ch) => { const z = byLabel(ch, /^Support$/); if (!z || ch.stop === undefined) return "pas de stop"; const t = mr(ch.past); if (ch.stop > lo(z) - 1.2 * t) return "le stop n'est pas loin sous le support (déplacé)"; return last(ch.past).c - hi(z) <= 0.8 * t ? null : "le prix n'est pas revenu près du support"; };
const noZoneChop: Claim = (ch) => { if (ch.zones.length) return "un niveau est tracé"; const ks = ch.past.slice(-12); const amp = Math.max(...ks.map((k) => k.h)) - Math.min(...ks.map((k) => k.l)); return Math.abs(last(ks).c - ks[0].o) <= 0.5 * amp ? null : "le marché a une direction (déplacement net > la moitié de l'amplitude)"; };
const closesBelowSupport: Claim = (ch) => { const z = byLabel(ch, /^Support$/); return z && ch.past.slice(-4).every((k) => k.c < lo(z)) ? null : "les 4 dernières clôtures ne sont pas sous le support"; };
const rrAtLeast = (x: number): Claim => (ch) => { if (ch.entry === undefined || ch.stop === undefined || ch.tp === undefined) return "plan incomplet"; const rr = Math.abs(ch.tp - ch.entry) / Math.abs(ch.entry - ch.stop); return rr >= x ? null : `R/R ${rr.toFixed(2)} (au moins ${x})`; };
const stopUnder = (re: RegExp): Claim => (ch) => { const z = byLabel(ch, re); return z && ch.stop !== undefined && ch.stop < lo(z) ? null : "le stop n'est pas sous le niveau"; };
const hammerNoZone: Claim = (ch) => (ch.zones.length ? "un niveau est tracé" : isHammer(last(ch.past)) ? null : "la dernière bougie n'est pas un marteau");
const trendThenPullback = (sell: boolean): Claim => (c) => { const ch = asBull(c, sell); const ks = ch.past; const first = ks.slice(0, ks.length - 3); if (!(last(first).c > first[0].o)) return "pas de tendance haussière avant le repli"; const t = ks.slice(-3); return t.every((k) => k.c < k.o) ? null : "les 3 dernières bougies ne forment pas un repli"; };
const wickAboveCloseBelow: Claim = (ch) => { const z = byLabel(ch, /^Résistance$/); const k = last(ch.past); if (!z) return "pas de résistance"; return k.h > hi(z) + 0.3 * mr(ch.past) && k.c < hi(z) ? null : "pas de mèche au-dessus avec clôture revenue dessous"; };
const chochThenBounce: Claim = (ch) => { const z = byLabel(ch, /^Plus bas précédent$/); if (!z) return "pas de plus bas précédent"; const i = ch.past.findIndex((k, j) => j > (z.at ?? 4) && k.c < lo(z)); if (i < 0) return "aucune clôture sous le dernier plus bas"; const after = ch.past.slice(i); return last(ch.past).c > Math.min(...after.map((k) => k.c)) && last(ch.past).c < hi(z) + 0.5 * mr(ch.past) ? null : "pas de petit rebond après la clôture sous le niveau (ou rebond au-dessus)"; };
const lastCloseBelow = (re: RegExp): Claim => (ch) => { const z = byLabel(ch, re) ?? ch.zones.find((x) => x.kind === "support"); return z && last(ch.past).c < lo(z) ? null : "la dernière clôture n'est pas sous le niveau"; };
const stopInsideOrAbove: Claim = (ch) => { const z = byLabel(ch, /^Support$/); return z && ch.stop !== undefined && ch.stop >= lo(z) && ch.stop < (ch.entry ?? Infinity) ? null : "le stop n'est pas dans la zone"; };
const farFromBrokenLevel: Claim = (ch) => { const z = byLabel(ch, /^Résistance cassée$/); if (!z || ch.entry === undefined) return "pas de résistance cassée"; const t = mr(ch.past); if (ch.entry - hi(z) < 1.6 * t) return "l'entrée n'est pas loin du niveau cassé (moins de 1,6 bougie)"; const i = ch.past.findIndex((k) => k.c > hi(z)); return ch.past.slice(i + 1).every((k) => k.l > hi(z) - 0.1 * t) ? null : "le prix est déjà revenu retester le niveau"; };
const retraceBetween = (a: number, b: number): Claim => (ch) => { const B = Math.max(...ch.past.map((k) => k.h)); const A = Math.min(...ch.past.map((k) => k.l)); const r = (B - last(ch.past).c) / (B - A); return r >= a && r <= b ? null : `retracement ${(100 * r).toFixed(0)} % (attendu entre ${100 * a} et ${100 * b} %)`; };
const nearTopOfRange: Claim = (ch) => { const r = byLabel(ch, /^Haut du range$/), s = byLabel(ch, /^Bas du range$/); if (!r || !s) return "range attendu"; const e = last(ch.past).c; return (e - hi(s)) / (lo(r) - hi(s)) >= 0.7 && e < lo(r) ? null : "l'entrée n'est pas dans le haut du range, sous sa borne"; };
const singleTouch: Claim = (ch) => { const z = byLabel(ch, /^Plus bas précédent$/); if (!z) return "pas de plus bas précédent"; return ch.entry !== undefined && ch.entry - hi(z) <= 1.0 * mr(ch.past) ? null : "l'entrée n'est pas près du plus bas"; };
const obBrokenThenBack: Claim = (ch) => { const z = byLabel(ch, /Order Block/); if (!z) return "pas d'OB"; const i = ch.past.findIndex((k, j) => j > 5 && k.c < lo(z)); if (i < 0 || i > ch.past.length - 2) return "aucune clôture sous l'OB avant l'entrée"; return last(ch.past).c <= hi(z) ? null : "l'entrée est au-dessus de l'OB"; };
const smallBreakout: Claim = (ch) => { const k = last(ch.past); const prev = ch.past.slice(0, -1); return k.c > Math.max(...prev.map((x) => x.c)) + 0.1 * mr(ch.past) ? null : "la dernière bougie ne clôture pas au-dessus du petit range"; };
const closesBelowPrevLow: Claim = (ch) => { const z = byLabel(ch, /^Plus bas précédent$/); return z && ch.past.slice(-2).every((k) => k.c < lo(z)) ? null : "les 2 dernières clôtures ne sont pas sous le plus bas"; };
const stopJustBelowSwing: Claim = (ch) => { const z = byLabel(ch, /^Swing low$/); if (!z || ch.stop === undefined) return "pas de swing low ou de stop"; return ch.stop < lo(z) && lo(z) - ch.stop <= 0.5 * mr(ch.past) ? null : "le stop n'est pas « juste sous » le swing low (à plus d'une demi-bougie)"; };
const sweepLowBack: Claim = (ch) => { const z = byLabel(ch, /^Plus bas précédent$/); const k = last(ch.past); return z && k.l < lo(z) - 0.25 * mr(ch.past) && k.c > hi(z) ? null : "pas de sweep (mèche sous le plus bas, clôture au-dessus)"; };

// ─── Scénarios ────────────────────────────────────────────────────────────────

const DEB = { difficulties: ["beginner"] as const, macroContext: "normal" as const, htfBias: "range" as const };
const INT = { difficulties: ["intermediate"] as const, macroContext: "normal" as const };
const ADV = { difficulties: ["advanced"] as const };

export const FTM_NEW: FtmScenario[] = [
  // ── Débutant ──
  {
    ...DEB, id: "deb_sans_stop", title: "Achat sans stop loss", category: "discipline", chartShape: "approach_support", direction: "BUY",
    notions: ["sans_stop", "support_resistance"],
    context: "Tu achètes le rebond sur ce support, touché deux fois. Tu ne poses pas de stop loss : tu préfères surveiller le trade.",
    correctMistake: "no_stop", decoyMistakes: ["fomo_after_pump", "sell_in_support", "revenge_trade"],
    explanation: "Le setup peut fonctionner, mais sans stop loss, la perte n'a pas de limite : si le support cède, rien ne coupe le trade. C'est la première des erreurs qui détruisent les comptes.",
    lessons: one("Stop loss obligatoire sur chaque trade, sans exception. « Je surveille le trade » ne protège ni d'une news, ni d'une connexion perdue (leçon Débutant 9)."),
    build: bNoStop, claims: { "entrée au-dessus du support, aucun stop": (ch) => (ch.stop !== undefined ? "un stop est posé" : entryAbove(/^Support$/)(ch)) },
  },
  {
    ...DEB, id: "deb_tp_derriere_resistance", title: "Take profit au-delà de la résistance", category: "rr", chartShape: "range_oscillation", direction: "BUY",
    notions: ["take_profit", "support_resistance"],
    context: "Tu achètes le rebond sur un support touché deux fois, avec un stop sous le support. Ton take profit est posé au-dessus de la résistance, elle aussi touchée deux fois.",
    correctMistake: "tp_beyond_level", decoyMistakes: ["no_stop", "fomo_after_pump", "sell_in_support"],
    explanation: "L'entrée et le stop sont logiques, mais le take profit est derrière une résistance qui a déjà repoussé le prix deux fois : il a peu de chances d'être touché.",
    lessons: one("Place le take profit juste AVANT la prochaine résistance (en achat) : c'est là que les vendeurs risquent de revenir (leçon Débutant 6)."),
    build: bTpBeyond, claims: { "TP au-delà de la résistance": tpBeyond(/^Résistance$/), "entrée au-dessus du support": entryAbove(/^Support$/) },
  },
  {
    ...DEB, id: "deb_achat_sous_resistance", title: "Achat juste sous une résistance", category: "technique", chartShape: "approach_resistance", direction: "BUY",
    notions: ["take_profit", "support_resistance"],
    context: "Tu achètes juste sous une résistance qui a déjà repoussé le prix deux fois.",
    correctMistake: "buy_in_resistance", decoyMistakes: ["no_stop", "revenge_trade", "oversized_position"],
    explanation: "Acheter juste sous une résistance, c'est entrer là où les vendeurs reviennent souvent : il n'y a presque pas de place pour un take profit avant le niveau.",
    lessons: one("En achat, la place disponible va jusqu'à la prochaine résistance. Juste en dessous, le take profit n'a plus d'espace (leçon Débutant 6)."),
    build: bBuyUnderRes, claims: { "entrée juste sous la résistance": underRes(false) },
  },
  {
    ...DEB, id: "deb_vente_sur_support", title: "Vente juste au-dessus d'un support", category: "technique", chartShape: "approach_support", direction: "SELL",
    notions: ["take_profit", "support_resistance"],
    context: "Tu vends juste au-dessus d'un support qui a déjà fait rebondir le prix deux fois.",
    correctMistake: "sell_in_support", decoyMistakes: ["no_stop", "fomo_after_pump", "oversized_position"],
    explanation: "Vendre juste au-dessus d'un support, c'est entrer là où les acheteurs reviennent souvent : il n'y a presque pas de place pour un take profit avant le niveau.",
    lessons: one("En vente, la place disponible va jusqu'au prochain support. Juste au-dessus, le take profit n'a plus d'espace (leçon Débutant 6)."),
    build: mirrored(bBuyUnderRes), claims: { "entrée juste au-dessus du support": underRes(true) },
  },
  {
    ...DEB, id: "deb_stop_deplace", title: "Stop descendu en cours de trade", category: "discipline", chartShape: "approach_support", direction: "BUY",
    notions: ["plan_non_respecte", "support_resistance"],
    context: "Tu as acheté le rebond sur ce support, stop sous la zone. Le prix revient vers ton stop : tu viens de le descendre beaucoup plus bas pour « laisser respirer » le trade.",
    correctMistake: "stop_moved", decoyMistakes: ["fomo_after_pump", "tp_beyond_level", "sell_in_support"],
    explanation: "Le stop marquait l'endroit où l'idée de trade devenait fausse. Le descendre quand le prix s'en approche augmente la perte possible sans rendre l'idée plus juste.",
    lessons: one("Déplacer son stop pour éviter d'être touché, c'est ne pas respecter son plan. On le rapproche pour protéger un gain, pas pour repousser une perte (leçon Débutant 9)."),
    build: bStopMoved, claims: { "stop loin sous le support, prix revenu près de lui": stopFarBelow },
  },
  {
    ...DEB, id: "deb_surtrading", title: "Un trade de plus, par ennui", category: "psychologique", chartShape: "range_oscillation", direction: "BUY",
    notions: ["surtrading", "bougie"],
    context: "C'est ton 7e trade de la journée. Le marché tourne en rond, sans niveau ni signal : tu entres quand même, pour ne pas rester inactif.",
    extraInfo: "7e trade de la journée",
    correctMistake: "overtrading", decoyMistakes: ["tp_beyond_level", "sell_in_support", "stop_too_tight"],
    explanation: "Aucun signal ne justifie ce trade : c'est l'ennui qui décide. Chaque trade en trop paie un spread et ajoute un risque sans avantage.",
    lessons: one("Sur-trader, c'est ouvrir des trades parce qu'on s'ennuie. Plus de trades, c'est plus de spreads payés et un compte qui fond lentement (leçon Débutant 9)."),
    build: bOvertrading, claims: { "aucun niveau, marché sans direction": noZoneChop },
  },
  {
    ...DEB, id: "deb_perte_non_coupee", title: "Perte gardée en espérant un retour", category: "psychologique", chartShape: "approach_support", direction: "BUY",
    notions: ["ancrage", "support_resistance"],
    context: "Tu as acheté sur ce support. Il a cédé il y a quatre bougies, mais tu gardes la position en espérant que le prix revienne.",
    correctMistake: "loss_not_cut", decoyMistakes: ["fomo_after_pump", "tp_beyond_level", "overtrading"],
    explanation: "Le support qui justifiait l'achat est cassé : l'idée de trade est invalidée. Garder la position en espérant un retour, c'est laisser la perte grandir.",
    lessons: one("L'ancrage pousse à refuser de couper un trade perdant. Quand le niveau qui justifiait l'entrée casse, la perte se coupe, elle ne s'espère pas (leçon Débutant 9)."),
    build: bLossNotCut, claims: { "support cassé, clôtures sous lui": closesBelowSupport },
  },
  {
    ...DEB, id: "deb_taille_apres_gains", title: "Taille multipliée après cinq gains", category: "psychologique", chartShape: "approach_support", direction: "BUY",
    notions: ["overconfidence", "support_resistance"],
    context: "Après cinq trades gagnants d'affilée, tu prends ce rebond sur un support avec une taille cinq fois plus grosse que d'habitude. Stop et take profit sont bien placés.",
    extraInfo: "Taille × 5 après 5 gains",
    correctMistake: "size_after_wins", decoyMistakes: ["no_stop", "tp_beyond_level", "sell_in_support"],
    explanation: "Le plan est propre (stop sous le support, R/R correct), mais la taille a été multipliée par cinq sur un sentiment d'invincibilité : un seul trade perdant peut effacer toute la série.",
    lessons: one("L'excès de confiance pousse à grossir après une série gagnante. La taille se décide par le risque du plan, pas par l'humeur (leçon Débutant 9)."),
    build: bSizeAfterWins, claims: { "plan propre : stop sous le support, R/R d'au moins 2": (ch) => stopUnder(/^Support$/)(ch) ?? rrAtLeast(2)(ch) },
  },
  {
    ...DEB, id: "deb_marteau_nulle_part", title: "Achat d'un marteau isolé", category: "technique", chartShape: "fast_dump", direction: "BUY",
    notions: ["pattern_sans_niveau", "bougie"],
    context: "Après une longue baisse, tu achètes ce marteau, posé sur un plus bas tout neuf, loin de tout support.",
    correctMistake: "pattern_without_level", decoyMistakes: ["no_stop", "tp_beyond_level", "sell_in_support"],
    explanation: "Un marteau ne compte que sur un niveau clé. Ici, aucun support n'appuie le signal : la bougie seule ne suffit pas à justifier l'achat.",
    lessons: one("Entrer uniquement parce qu'une bougie ressemble à un marteau, sans niveau important, est une erreur de lecture classique (leçon Débutant 3)."),
    build: bPatternNowhere, claims: { "marteau sans niveau": hammerNoZone },
  },
  // ── Intermédiaire ──
  {
    ...INT, id: "int_vente_contre_tendance", title: "SELL dans une tendance haussière de l'UT supérieure", category: "technique", chartShape: "uptrend_pullback", direction: "SELL", htfBias: "bullish",
    notions: ["multi_ut", "pullback", "tendance"],
    trap: "Les trois bougies rouges du repli ressemblent à un retournement, dans une tendance haussière de l'UT supérieure.",
    context: "UT supérieure clairement haussière. Tu vends ce repli local, après trois bougies rouges.",
    correctMistake: "trade_against_htf", decoyMistakes: ["range_middle", "no_confirmation", "fomo_after_pump"],
    explanation: "Dans une tendance haussière, les replis offrent plutôt des achats que des ventes. Vendre un simple repli contre l'UT supérieure, c'est jouer contre l'avantage.",
    lessons: one("Un repli local n'efface pas la tendance de l'UT supérieure : il est plus souvent une occasion d'achat qu'un retournement (leçons Intermédiaire 4 et 7)."),
    build: iSellPullback, claims: { "tendance haussière puis repli de 3 bougies": trendThenPullback(false) },
  },
  {
    ...INT, id: "int_faux_breakout_achete", title: "Achat d'une mèche au-dessus de la résistance", category: "technique", chartShape: "weak_breakout", direction: "BUY", htfBias: "range",
    notions: ["faux_breakout", "zones_cles", "bougie"],
    trap: "La mèche passe nettement au-dessus de la résistance, mais la bougie clôture en dessous.",
    context: "La dernière bougie a percé au-dessus d'une résistance touchée deux fois, puis a refermé en dessous. Tu achètes à la clôture, en pensant au breakout.",
    correctMistake: "fakeout_bought", decoyMistakes: ["trade_against_htf", "range_middle", "oversized_position"],
    explanation: "Un breakout se valide par une clôture au-delà du niveau. Ici, la bougie a refermé sous la résistance : c'est le profil d'un faux breakout, pas d'un vrai breakout.",
    lessons: one("La mèche ne fait pas le breakout, la clôture si. Une bougie qui perce puis referme sous la résistance piège les acheteurs (leçon Intermédiaire 6)."),
    build: iFakeoutBought, claims: { "mèche au-dessus de la résistance, clôture dessous": wickAboveCloseBelow },
  },
  {
    ...INT, id: "int_structure_ignoree", title: "Achat après un changement de structure", category: "technique", chartShape: "uptrend_pullback", direction: "BUY", htfBias: "bullish",
    notions: ["structure", "multi_ut", "tendance"],
    trap: "L'UT supérieure reste haussière, mais sur ce graphique la dernière baisse a clôturé sous le dernier plus bas.",
    context: "Le prix montait par plus hauts et plus bas croissants. La dernière baisse a clôturé sous le dernier plus bas, puis le prix rebondit un peu. Tu achètes ce rebond.",
    correctMistake: "structure_ignored", decoyMistakes: ["range_middle", "trade_against_htf", "fomo_after_pump"],
    explanation: "La clôture sous le dernier plus bas casse la structure haussière (CHoCH). Acheter le petit rebond qui suit, c'est ignorer ce changement de structure.",
    lessons: one("Une tendance haussière tient tant que les plus bas montent. Une clôture sous le dernier plus bas (CHoCH) change la lecture : on n'achète plus les rebonds sans nouvelle structure (leçon Intermédiaire 1)."),
    build: iStructureIgnored, claims: { "clôture sous le dernier plus bas, puis rebond sous lui": chochThenBounce },
  },
  {
    ...INT, id: "int_niveau_casse_achete", title: "Achat sous un niveau cassé", category: "technique", chartShape: "uptrend_pullback", direction: "BUY", htfBias: "bullish",
    notions: ["changement_role", "pullback", "support_resistance"],
    trap: "Le prix revient sur l'ancienne résistance, l'endroit idéal du pullback, mais il clôture dessous.",
    context: "Après avoir cassé une résistance, le prix revient la tester par au-dessus. La dernière bougie clôture sous ce niveau. Tu achètes quand même.",
    correctMistake: "broken_level_bought", decoyMistakes: ["range_middle", "fomo_after_pump", "oversized_position"],
    explanation: "L'ancienne résistance devait servir de support au retest. La clôture dessous montre qu'elle ne joue pas ce rôle : l'achat n'a plus d'appui.",
    lessons: one("Un retest se valide quand le prix tient au-dessus de l'ancienne résistance. Une clôture dessous invalide le changement de rôle (leçon Intermédiaire 3)."),
    build: iBrokenLevelBought, claims: { "dernière clôture sous le niveau retesté": lastCloseBelow(/^Support$/) },
  },
  {
    ...INT, id: "int_stop_dans_zone", title: "Stop posé dans le support", category: "technique", chartShape: "approach_support", direction: "BUY", htfBias: "bullish",
    notions: ["zones_cles", "stop_loss", "support_resistance"],
    trap: "Le stop est sous l'entrée et le R/R affiché paraît excellent, mais le stop est dans la zone du support, pas au-delà.",
    context: "Tu achètes le rebond sur un support touché deux fois. Ton stop est posé dans la zone du support, et ton take profit vise plus de deux fois le risque.",
    correctMistake: "stop_inside_zone", decoyMistakes: ["trade_against_htf", "fomo_after_pump", "range_middle"],
    explanation: "Une zone de support est touchée et parfois traversée de quelques points avant de tenir. Un stop posé dedans sera souvent touché par une simple mèche, même si le support tient.",
    lessons: one("Un stop se place au-delà de la zone, avec une marge, pas à l'intérieur : la zone entière fait partie du niveau (leçons Intermédiaire 2 et Débutant 5)."),
    build: iStopInsideZone, claims: { "stop dans la zone du support": stopInsideOrAbove },
  },
  {
    ...INT, id: "int_breakout_poursuivi", title: "Breakout acheté quatre bougies trop tard", category: "timing", chartShape: "weak_breakout", direction: "BUY", htfBias: "bullish",
    notions: ["breakout", "changement_role", "rr"],
    trap: "Le breakout est réel et confirmé, mais le prix est déjà loin du niveau cassé.",
    context: "Le prix a cassé une résistance il y a quatre bougies, sans revenir la tester. Tu achètes maintenant, avec un stop sous la résistance cassée.",
    correctMistake: "breakout_chased", decoyMistakes: ["fakeout_bought", "range_middle", "trade_against_htf"],
    explanation: "Le breakout est valable, mais acheter loin du niveau oblige à un stop très éloigné (sous la résistance cassée) : le risque grossit, le gain restant diminue.",
    lessons: one("Après un breakout, l'entrée la plus propre est souvent le retest du niveau cassé. Courir après le prix dégrade le R/R (leçons Intermédiaire 3 et 6)."),
    build: iBreakoutChased, claims: { "entrée loin du niveau cassé, sans retest": farFromBrokenLevel },
  },
  {
    ...INT, id: "int_retracement_trop_court", title: "Achat après un repli de 25 % seulement", category: "timing", chartShape: "uptrend_pullback", direction: "BUY", htfBias: "bullish",
    notions: ["fibonacci", "pullback", "tendance"],
    trap: "La tendance est haussière et le repli rassure, mais il n'a corrigé qu'environ un quart de la hausse.",
    context: "Après une forte hausse, le prix ne corrige qu'environ 25 % du mouvement. Tu achètes déjà, stop sous le départ de la hausse.",
    correctMistake: "fib_misread", decoyMistakes: ["range_middle", "fakeout_bought", "oversized_position"],
    explanation: "La zone de retracement la plus suivie se situe entre 50 et 61,8 % de la hausse. Acheter à 25 %, avec un stop sous le départ, donne un stop très large pour un gain limité.",
    lessons: one("Un pullback s'achète de préférence dans la zone 50 à 61,8 % du retracement : plus haut, le stop logique est trop loin (leçon Intermédiaire 9)."),
    build: iFibMisread, claims: { "repli de 18 à 32 % de la hausse": retraceBetween(0.18, 0.32) },
  },
  {
    ...INT, id: "int_tp_au_dela_ut_sup", title: "TP au-delà d'une résistance de l'UT supérieure", category: "rr", chartShape: "range_oscillation", direction: "BUY", htfBias: "bullish",
    notions: ["multi_ut", "take_profit", "support_resistance"],
    trap: "L'entrée sur le support et le stop sont logiques ; c'est l'objectif qui ignore la résistance de l'UT supérieure.",
    context: "Tu achètes le rebond sur un support, stop sous la zone. Ton take profit est posé au-delà d'une résistance de l'UT supérieure, touchée deux fois.",
    correctMistake: "ignored_zone", decoyMistakes: ["trade_against_htf", "range_middle", "fakeout_bought"],
    explanation: "La résistance de l'UT supérieure a déjà repoussé le prix deux fois : un take profit posé derrière elle a peu de chances d'être touché.",
    lessons: one("Les zones de l'UT supérieure arrêtent souvent les mouvements de l'UT inférieure : l'objectif se place avant elles (leçons Intermédiaire 7 et Débutant 6)."),
    build: iTpBeyondHtf, claims: { "TP au-delà de la résistance de l'UT supérieure": tpBeyond(/^Résistance UT supérieure$/) },
  },
  {
    ...INT, id: "int_achat_haut_range", title: "Achat au haut du range", category: "technique", chartShape: "range_oscillation", direction: "BUY", htfBias: "range",
    notions: ["range", "breakout", "zones_cles"],
    trap: "Le prix monte avec force vers le haut du range : on anticipe un breakout qui n'a pas eu lieu.",
    context: "Le prix monte vers le haut d'un range, touché deux fois. Tu achètes juste sous la borne, en anticipant une sortie par le haut.",
    correctMistake: "range_top_bought", decoyMistakes: ["trade_against_htf", "fakeout_bought", "stop_too_tight"],
    explanation: "Dans un range, le haut est l'endroit où l'on vend, pas où l'on achète. Anticiper le breakout avant une clôture au-dessus, c'est parier contre la borne.",
    lessons: one("Dans un range, on achète près du bas, on vend près du haut. Un achat au haut ne se défend qu'après un breakout confirmé par une clôture (leçons Intermédiaire 1 et 6)."),
    build: iRangeTopBought, claims: { "entrée dans le haut du range, sous la borne": nearTopOfRange },
  },
  {
    ...INT, id: "int_niveau_non_prouve", title: "Achat sur un plus bas touché une fois", category: "technique", chartShape: "approach_support", direction: "BUY", htfBias: "range",
    notions: ["zones_cles", "confluence"],
    trap: "Le prix revient sur un plus bas visible, qui ressemble à un support.",
    context: "Le prix revient sur le plus bas précédent, touché une seule fois. Tu achètes là, sans autre argument.",
    correctMistake: "weak_level", decoyMistakes: ["trade_against_htf", "fakeout_bought", "breakout_chased"],
    explanation: "Un plus bas touché une seule fois n'est pas encore un support prouvé, et aucun autre argument ne s'y ajoute : l'achat repose sur un niveau fragile.",
    lessons: one("Un niveau se prouve par plusieurs touches et gagne en force avec des confluences. Un plus bas touché une fois, seul, est un argument faible (leçons Intermédiaire 2 et 5)."),
    build: iWeakLevel, claims: { "entrée près d'un plus bas touché une fois": singleTouch },
  },
  // ── Avancé ──
  {
    ...ADV, id: "adv_ob_invalide", title: "Achat dans un Order Block déjà cassé", category: "technique", chartShape: "fvg_deep_pullback", direction: "BUY", htfBias: "bullish", macroContext: "normal",
    notions: ["order_block", "entree_precision"],
    conflict: "Le prix revient dans l'Order Block par en dessous : la zone paraît attirante, mais une clôture l'a déjà invalidée.",
    context: "Le prix a clôturé sous l'Order Block qui avait lancé l'impulsion, puis il remonte vers lui. Tu achètes en pensant que la zone va tenir.",
    correctMistake: "dead_ob_bought", decoyMistakes: ["sweep_ignored", "mitigation_misread", "volatility_ignored"],
    explanation: "Un Order Block n'est valable que tant que le prix ne clôture pas au-delà. Une fois cassé, revenir dedans par en dessous en fait plutôt une résistance.",
    lessons: one("Une clôture au-delà de l'Order Block l'invalide. Le retour vers lui par l'autre côté n'est plus un achat (leçons Avancé 3 et 7)."),
    build: aDeadOb, claims: { "clôture sous l'OB, puis entrée sous ou dans l'OB": obBrokenThenBack },
  },
  {
    ...ADV, id: "adv_session_ignoree", title: "Breakout acheté en heures creuses", category: "timing", chartShape: "range_oscillation", direction: "BUY", htfBias: "range", macroContext: "normal",
    metaOverride: { session: "Heures mortes" },
    notions: ["killzones", "breakout"],
    conflict: "La bougie sort bien du petit range, mais en heures creuses, sans volume : la plupart de ces sorties sont reprises à l'ouverture d'une vraie session.",
    context: "En heures creuses, la dernière bougie sort d'un petit range. Tu achètes ce breakout tout de suite.",
    correctMistake: "dead_session_breakout", decoyMistakes: ["sweep_ignored", "mitigation_misread", "stop_in_liquidity"],
    explanation: "En heures creuses, peu d'acteurs sont présents : une petite sortie de range manque souvent de suivi et se fait reprendre quand Londres ou New York ouvrent.",
    lessons: one("Les mouvements qui comptent naissent surtout dans les killzones (Londres, New York). En heures creuses, un breakout se méfie (leçon Avancé 4)."),
    build: aDeadSession, claims: { "dernière bougie au-dessus du petit range": smallBreakout },
  },
  {
    ...ADV, id: "adv_hors_ote", title: "Achat au-dessus de la zone OTE", category: "timing", chartShape: "uptrend_pullback", direction: "BUY", htfBias: "bullish", macroContext: "normal",
    notions: ["ote", "fibonacci", "pullback"],
    conflict: "La tendance et l'UT supérieure plaident pour l'achat, mais le repli n'a pas atteint la zone OTE (62 à 79 % du mouvement).",
    context: "Après une forte impulsion haussière, le prix corrige d'environ un tiers. Tu achètes maintenant, stop sous le départ de l'impulsion.",
    correctMistake: "ote_ignored", decoyMistakes: ["sweep_ignored", "dead_ob_bought", "volatility_ignored"],
    explanation: "L'OTE se situe entre 62 et 79 % du retracement. Acheter à un tiers, stop sous le départ, donne un stop très large et un R/R faible.",
    lessons: one("L'Optimal Trade Entry se prend dans la zone 62 à 79 % du retracement de l'impulsion : c'est là que le R/R devient intéressant (leçon Avancé 5)."),
    build: aOteMiss, claims: { "repli de 28 à 45 % de l'impulsion": retraceBetween(0.28, 0.45) },
  },
  {
    ...ADV, id: "adv_sweep_mal_lu", title: "« Sweep » acheté alors que la clôture reste dessous", category: "liquidite", chartShape: "sweep_low_done", direction: "BUY", htfBias: "bearish", macroContext: "normal",
    notions: ["sweep", "liquidite", "breakout"],
    conflict: "Mèche contre clôture : le prix passe sous le plus bas précédent comme un sweep, mais deux clôtures restent dessous.",
    context: "Le prix passe sous le plus bas précédent et deux bougies clôturent dessous. Tu achètes en pensant à un sweep de liquidité.",
    correctMistake: "fake_sweep_bought", decoyMistakes: ["mitigation_misread", "stop_in_liquidity", "volatility_ignored"],
    explanation: "Un sweep se lit à la clôture revenue au-dessus du niveau. Ici, deux clôtures restent dessous : c'est une continuation baissière, pas un sweep.",
    lessons: one("Après une prise de liquidité, la clôture décide : revenue au-dessus, sweep possible ; restée dessous, continuation (leçon Avancé 1)."),
    build: aFakeSweep, claims: { "deux clôtures sous le plus bas précédent": closesBelowPrevLow },
  },
  {
    ...ADV, id: "adv_stop_liquidite_achat", title: "Stop juste sous le swing low", category: "liquidite", chartShape: "uptrend_pullback", direction: "BUY", htfBias: "bullish", macroContext: "normal",
    notions: ["chasse_aux_stops", "liquidite", "stop_loss"],
    conflict: "Le stop est bien du bon côté du swing low, mais collé à lui : exactement là où dort la liquidité que le marché vient souvent chercher.",
    context: "Tu achètes ce rebond dans une tendance haussière, stop juste sous le swing low, sans marge.",
    correctMistake: "stop_in_liquidity", decoyMistakes: ["sweep_ignored", "mitigation_misread", "dead_ob_bought"],
    explanation: "Les stops des acheteurs s'accumulent juste sous les swing lows évidents. Un stop collé au niveau se fait souvent prendre par une mèche avant la vraie hausse.",
    lessons: one("La chasse aux stops vise les niveaux évidents. Un stop se place au-delà, avec une marge mesurée en bougies, pas collé au swing low (leçon Avancé 6)."),
    showLines: "buy_with_liquidity_stop", claims: { "stop collé sous le swing low": stopJustBelowSwing },
  },
  {
    ...ADV, id: "adv_vente_apres_sweep", title: "Vente juste après un sweep", category: "liquidite", chartShape: "sweep_low_done", direction: "SELL", htfBias: "bullish", macroContext: "normal",
    notions: ["sweep", "liquidite", "multi_ut"],
    conflict: "La mèche sous le plus bas ressemble à un breakout baissier ; la clôture revenue au-dessus et l'UT supérieure haussière disent l'inverse.",
    context: "UT supérieure haussière. Une bougie vient de passer sous le plus bas précédent avec une longue mèche, puis a clôturé au-dessus. Tu vends en pensant à un breakout.",
    correctMistake: "sweep_ignored", decoyMistakes: ["mitigation_misread", "dead_ob_bought", "volatility_ignored"],
    explanation: "La mèche a pris les stops sous le plus bas, puis le prix est revenu au-dessus : c'est un sweep, souvent suivi d'un retournement à la hausse. Vendre ici, c'est vendre là où les vendeurs viennent d'être piégés.",
    lessons: one("Un sweep prend la liquidité puis revient : la clôture au-dessus du niveau balayé, dans le sens de l'UT supérieure, plaide pour le retournement (leçon Avancé 1)."),
    build: aSweepLowSold, claims: { "mèche sous le plus bas, clôture au-dessus": sweepLowBack },
  },
];
