// Place ton Stop — scénarios construits sur les scènes partagées (lib/games/scenes.ts).
// Chaque scénario : un seul niveau, ses notions (lib/games/notions.ts), son graphique avec trois stops
// justifiés (`build`, unités abstraites) et ses affirmations vérifiées (`claims`,
// scripts/audit-jeux/coherence-ps.ts). La place du bon stop varie d'un scénario à l'autre (le plus
// proche, celui du milieu ou le plus loin) : aucune recette « toujours le même stop » ne gagne.
// Justifications au format de scripts/audit-jeux/stops.ts (« sous le <niveau>, avec une marge »,
// « pile sous… », « dans le bruit normal », « derrière la vraie invalidation »).

import type { Candle, ChartZone } from "./shared";
import { candle, rangeLegs } from "./shared";
import type { NotionId } from "./notions";
import { bullSignal, drop, legTo, mirrorCandles, mirrorZones, provenResistance, rally, isHammer, isBullEngulfing, range, type Rng } from "./scenes";
import { supportScene, rangeScene, obScene, bullImpulse3Local } from "./bsnt-scenarios";

type Difficulty = "beginner" | "intermediate" | "advanced";
type StopType = "tight" | "logical" | "wide" | "liquidity";
export interface PsRaw {
  past: Candle[]; fut: Candle[]; zones: ChartZone[]; entry: number; tp: number | null; direction: "BUY" | "SELL";
  stops: { type: StopType; price: number; rationale: string }[];
}
interface PsChartLike { past: Candle[]; future: Candle[]; zones: ChartZone[]; entry: number; tp: number | null; direction: "BUY" | "SELL"; stops: { price: number; type: StopType; rationale: string }[] }
type Claim = (ch: PsChartLike) => string | null;
type Rank = "proche" | "milieu" | "loin";

export interface PsScenario {
  id: string; title: string; direction: "BUY" | "SELL"; htfBias: "bullish" | "bearish" | "range"; macroContext: "normal" | "dangereux";
  context: string; shortContext?: string; lessons: { beginner: string; intermediate: string; advanced: string };
  difficulties: readonly Difficulty[]; tag: string;
  notions: readonly NotionId[]; trap?: string; conflict?: string;
  /** Place du bon stop par distance à l'entrée */
  rank: Rank;
  build: (rng: Rng, m: number) => PsRaw; claims: Record<string, Claim>;
}

// ─── Aides ────────────────────────────────────────────────────────────────────

const AXIS = 10;
const mirrored = (b: PsScenario["build"]): PsScenario["build"] => (rng, m) => {
  const r = b(rng, m);
  return {
    past: mirrorCandles(r.past, AXIS), fut: mirrorCandles(r.fut, AXIS),
    entry: AXIS - r.entry, tp: r.tp === null ? null : AXIS - r.tp, direction: r.direction === "BUY" ? "SELL" : "BUY",
    // (un Order Block renversé est baissier : son tracé se lit de l'autre côté)
    ...{ zones: mirrorZones(r.zones, AXIS).map((z) => (z.label === "Order Block" ? { ...z, label: "Order Block baissier" } : z)) },
    stops: r.stops.map((s) => ({ ...s, price: AXIS - s.price, rationale: flipWords(s.rationale) })),
  };
};
/** Justification renversée (vente) : phrases complètes, du plus long au plus court */
const PHRASES: [string, string][] = [
  ["Pile sous le swing high cassé : le retest peut y plonger d'une mèche, alors que la structure n'est pas cassée.", "Pile au-dessus du swing low cassé : le retest peut y monter d'une mèche, alors que la structure n'est pas cassée."],
  ["Entre le swing high cassé et le swing low : un repli plus profond le touche sans que la structure soit cassée.", "Entre le swing low cassé et le swing high : un rebond plus ample le touche sans que la structure soit cassée."],
  ["Sous le swing low, avec une marge : c'est le dernier plus bas de la structure haussière ; tant qu'il tient, le BOS reste valable.", "Au-dessus du swing high, avec une marge : c'est le dernier plus haut de la structure baissière ; tant qu'il tient, le BOS reste valable."],
  ["Sous le plus bas précédent, avec une marge : sous le départ de la hausse (100 % du retracement), là où le scénario de pullback est faux.", "Au-dessus du plus haut précédent, avec une marge : au-dessus du départ de la baisse (100 % du retracement), là où le scénario de pullback est faux."],
  ["Pile sous le plus bas précédent : le départ de la hausse attire les stops, une mèche peut le balayer avant la reprise.", "Pile au-dessus du plus haut précédent : le départ de la baisse attire les stops, une mèche peut le balayer avant la reprise."],
  ["Juste sous la bougie d'entrée, dans le bruit normal : le retracement peut s'étendre un peu sans que la hausse soit annulée.", "Juste au-dessus de la bougie d'entrée, dans le bruit normal : le retracement peut s'étendre un peu sans que la baisse soit annulée."],
  ["Sous le support (l'ancienne résistance), avec une marge : au-delà de la mèche du retest, là où le changement de rôle aurait échoué.", "Au-dessus de la résistance (l'ancien support), avec une marge : au-delà de la mèche du retest, là où le changement de rôle aurait échoué."],
  ["Pile sous le support : le retest y descend souvent d'une mèche, et c'est là que dorment les stops des acheteurs du breakout.", "Pile au-dessus de la résistance : le retest y monte souvent d'une mèche, et c'est là que dorment les stops des vendeurs du breakout."],
  ["Sous le bas de l'Order Block, avec une marge : si le prix clôture sous l'OB, la zone est invalidée.", "Au-dessus du haut de l'Order Block, avec une marge : si le prix clôture au-dessus de l'OB, la zone est invalidée."],
  ["Au-dessus du FVG, dans le bruit normal : le prix peut entrer plus loin dans le déséquilibre sans l'invalider.", "Sous le FVG, dans le bruit normal : le prix peut entrer plus loin dans le déséquilibre sans l'invalider."],
  ["Sous le FVG, avec une marge : un FVG respecté tient ; s'il est traversé en clôture, la continuation est invalidée.", "Au-dessus du FVG, avec une marge : un FVG respecté tient ; s'il est traversé en clôture, la continuation est invalidée."],
  ["Très loin sous le FVG : il tient, mais le déséquilibre se lit dans sa zone, pas sous toute l'impulsion.", "Très loin au-dessus du FVG : il tient, mais le déséquilibre se lit dans sa zone, pas au-dessus de toute l'impulsion."],
  ["Plus bas que la pointe de la mèche du sweep, avec une marge", "Plus haut que la pointe de la mèche du sweep, avec une marge"],
  ["Juste sous la bougie d'entrée, dans le bruit normal : la zone OTE va jusqu'à 79 %, le prix peut y descendre encore.", "Juste au-dessus de la bougie d'entrée, dans le bruit normal : la zone OTE va jusqu'à 79 %, le prix peut y monter encore."],
  ["Sous le plus bas précédent, avec une marge : sous le départ de l'impulsion, là où l'OTE est invalidée.", "Au-dessus du plus haut précédent, avec une marge : au-dessus du départ de l'impulsion, là où l'OTE est invalidée."],
  ["Très loin sous le plus bas précédent : il tient, mais il ne protège pas mieux et efface l'avantage de l'entrée OTE.", "Très loin au-dessus du plus haut précédent : il tient, mais il ne protège pas mieux et efface l'avantage de l'entrée OTE."],
  ["Sous le support (l'ancienne résistance), avec une marge : si le prix repasse dessous, le changement de rôle a échoué.", "Au-dessus de la résistance (l'ancien support), avec une marge : si le prix repasse dessus, le changement de rôle a échoué."],
  ["Sous le départ du breakout, très loin : il tient, mais le changement de rôle se lit sur l'ancienne résistance, pas sous la tendance entière.", "Au-dessus du départ du breakout, très loin : il tient, mais le changement de rôle se lit sur l'ancien support, pas au-dessus de la tendance entière."],
  ["Plus bas que la pointe de la mèche du marteau, avec une marge", "Plus haut que la pointe de la mèche de l'étoile filante, avec une marge"],
  ["Plus bas que la mèche de la bougie rouge, avec une marge", "Plus haut que la mèche de la bougie verte, avec une marge"],
  ["Pile sous le support : la mèche du marteau est déjà descendue plus bas.", "Pile au-dessus de la résistance : la mèche de l'étoile filante est déjà montée plus haut."],
  ["Pile sous le support : la mèche de la bougie rouge de l'engulfing est déjà descendue plus bas.", "Pile au-dessus de la résistance : la mèche de la bougie verte de l'engulfing est déjà montée plus haut."],
  ["Pile sous le bas du range : c'est là que dorment les stops de tous ceux qui achètent la borne", "Pile au-dessus du haut du range : c'est là que dorment les stops de tous ceux qui vendent la borne"],
  ["Sous le bas du range, avec une marge", "Au-dessus du haut du range, avec une marge"],
  ["Très loin sous le support", "Très loin au-dessus de la résistance"],
  ["Sous le support, avec une marge : derrière la vraie invalidation. Si le prix passe là, le support a cédé.", "Au-dessus de la résistance, avec une marge : derrière la vraie invalidation. Si le prix passe là, la résistance a cédé."],
  ["Au-dessus du swing low, dans le bruit normal : le prix peut revenir vers le creux", "Sous le swing high, dans le bruit normal : le prix peut revenir vers le sommet"],
  ["Sous le swing low, avec une marge : c'est le dernier creux, le niveau qui invalide le scénario haussier.", "Au-dessus du swing high, avec une marge : c'est le dernier sommet, le niveau qui invalide le scénario baissier."],
  ["Sous le swing low, avec une marge : c'est le dernier plus bas de la structure haussière.", "Au-dessus du swing high, avec une marge : c'est le dernier plus haut de la structure baissière."],
  ["Beaucoup plus bas que le swing low", "Beaucoup plus haut que le swing high"],
  ["Sous le plus bas d'avant", "Au-dessus du plus haut d'avant"],
  ["Sous le départ de la tendance", "Au-dessus du départ de la tendance"],
  ["Juste sous l'entrée", "Juste au-dessus de l'entrée"],
  ["Juste sous la bougie d'entrée", "Juste au-dessus de la bougie d'entrée"],
];
const flipWords = (t: string) => { let out = t; for (const [a, b] of PHRASES) out = out.split(a).join(b); return out; };

const one = (text: string) => ({ beginner: text, intermediate: text, advanced: text });
const last = <T,>(a: T[]) => a[a.length - 1];
const lo = (z: ChartZone) => Math.min(z.y1, z.y2);
const hi = (z: ChartZone) => Math.max(z.y1, z.y2);
const mr = (cs: Candle[]) => { const s = cs.map(range).sort((a, b) => a - b); return s[s.length >> 1] || 1; };
const band = (m: number) => ({ lo: -0.13 * m, hi: 0.13 * m });
const supportZone = (m: number, label = "Support"): ChartZone => ({ kind: "support", y1: -0.13 * m, y2: 0.13 * m, label });
const pivotLow = (v: number, label: string, at?: number): ChartZone => ({ kind: "support", y1: v - 0.03, y2: v - 0.01, label, ...(at !== undefined ? { at } : {}) });
const flip = (k: Candle): Candle => ({ o: -k.o, c: -k.c, h: -k.l, l: -k.h });
const asBull = (ch: PsChartLike): PsChartLike => ch.direction === "SELL"
  ? { ...ch, past: ch.past.map(flip), future: ch.future.map(flip), zones: mirrorZones(ch.zones, 0), entry: -ch.entry, tp: ch.tp === null ? null : -ch.tp, direction: "BUY", stops: ch.stops.map((s) => ({ ...s, price: -s.price })) }
  : ch;
const correctStop = (ch: PsChartLike) => ch.stops.find((s) => s.type === (ch.stops.some((x) => x.type === "logical") ? "logical" : "wide"));
/** Le bon stop est à la place prévue (par distance à l'entrée) */
export const rankIs = (rank: Rank): Claim => (ch) => {
  const g = correctStop(ch); if (!g) return "aucun bon stop";
  const byDist = [...ch.stops].sort((a, b) => Math.abs(a.price - ch.entry) - Math.abs(b.price - ch.entry));
  const i = byDist.indexOf(g);
  return i === { proche: 0, milieu: 1, loin: 2 }[rank] ? null : `le bon stop est ${["le plus proche", "celui du milieu", "le plus loin"][i]} (attendu : ${rank})`;
};

// Justifications
const T_NOISE = "✗ Juste sous l'entrée, dans le bruit normal : la moindre mèche le touche avant que l'idée soit fausse.";
const L_SUPPORT = "✓ Sous le support, avec une marge : derrière la vraie invalidation. Si le prix passe là, le support a cédé.";
const W_FAR = "≈ Très loin sous le support : il tient, mais il ne protège pas mieux que le stop logique. La perte possible grossit et le R/R se dégrade.";
const W_X2 = "≈ Deux fois plus loin que le niveau ne l'exige : il tient, mais si l'idée est fausse, la perte double sans protéger mieux.";
const W_X3 = "≈ Trois fois plus loin : il tient, mais un stop aussi large transforme une petite perte possible en grosse perte.";

// ─── Constructions (sens haussier) ──────────────────────────────────────────

/** Marteau sur un support : mèche dans la zone (« zone ») ou qui la traverse (« perce ») */
function hammerOnSupport(rng: Rng, m: number, pierce: boolean) {
  const b = band(m);
  const s = supportScene(rng, m);
  const sig = pierce
    ? (() => { const out: Candle[] = []; let p = s.p; const t = b.hi + (0.55 + rng() * 0.1) * m; out.push(candle(p, t, 0.05 * m, 0.04 * m)); p = t; const c = p - (0.07 + rng() * 0.04) * m; out.push({ o: p, c, h: p + 0.02 * m, l: b.lo - (0.38 + rng() * 0.1) * m }); return { candles: out, p: c, low: out[1].l }; })()
    : bullSignal(rng, m, s.p, b.lo, b.hi, "marteau", rng() < 0.7 ? "rouge" : "verte");
  return { past: [...s.past, ...sig.candles], entry: sig.p, low: sig.low, b };
}
/** Engulfing haussier sur un support, mèche de la bougie rouge à travers la zone (« perce ») ou dedans */
function engulfOnSupport(rng: Rng, m: number, pierce: boolean) {
  const b = band(m);
  const s = supportScene(rng, m);
  const sig = bullSignal(rng, m, s.p, b.lo, b.hi, "engulfing");
  const past = [...s.past, ...sig.candles];
  if (pierce) past[past.length - 2] = { ...past[past.length - 2], l: b.lo - (0.38 + rng() * 0.1) * m };
  const low = Math.min(past[past.length - 2].l, past[past.length - 1].l);
  return { past, entry: sig.p, low, b };
}
/** Tendance haussière, repli au-dessus du dernier creux, reprise : le dernier creux est le swing low */
export function swingSetup(rng: Rng, m: number) {
  const past: Candle[] = [];
  let p = 0;
  for (let leg = 0; leg < 2; leg++) {
    const up = legTo(rng, m, p, p + (1.7 + rng() * 0.3) * m, { retrace: 0.2 }); past.push(...up.candles); p = up.p;
    // repli en 3 bougies au moins : le creux reste le plus bas de ses voisines
    const dn = legTo(rng, m, p, p - (0.9 + rng() * 0.2) * m, { retrace: 0, step: [0.28, 0.4] }); past.push(...dn.candles); p = dn.p;
  }
  const at = past.length - 1;
  const sl = Math.min(past[at].l, past[at].c - 0.02 * m);
  past[at] = { ...past[at], l: sl };
  // aucune mèche des bougies d'avant ne descend au niveau du creux : il reste le plus bas du repli
  for (let i = Math.max(0, at - 3); i < at; i++) {
    const k = past[i];
    past[i] = { ...k, l: Math.max(k.l, Math.min(Math.min(k.o, k.c), sl + 0.3 * m)) };
  }
  // (bougie de reprise sans mèche basse : la pointe du swing low reste celle du creux)
  const c1 = candle(p, p + (0.3 + rng() * 0.1) * m, 0.05 * m, 0); past.push(c1); p = c1.c;
  const c2 = candle(p, p + (0.25 + rng() * 0.1) * m, 0.05 * m, 0.04 * m); past.push(c2); p = c2.c;
  return { past, entry: p, sl, at };
}

const tpFor = (entry: number, stop: number, r = 2.6) => entry + r * (entry - stop);
/** Futur : si des stops ✗ existent, une première bougie va au-delà d'eux sans toucher le bon stop, puis reprise
 *  (le jeu montre les stops ✗ balayés, le bon stop qui survit) */
export function sweepFuture(rng: Rng, m: number, raw: PsRaw): PsRaw {
  const buy = raw.direction === "BUY";
  const bad = raw.stops.filter((x) => x.rationale.startsWith("✗")).map((x) => x.price);
  const goods = raw.stops.filter((x) => x.type === "logical").map((x) => x.price);
  if (!bad.length || !goods.length) return raw;
  const good = buy ? Math.max(...goods) : Math.min(...goods);
  const worst = buy ? Math.min(...bad) : Math.max(...bad);
  const dip = worst - (0.25 + rng() * 0.2) * (worst - good);
  const c = raw.entry + (buy ? 1 : -1) * (0.05 + rng() * 0.08) * m;
  const k: Candle = buy ? { o: raw.entry, c, h: c + (0.04 + rng() * 0.04) * m, l: dip } : { o: raw.entry, c, l: c - (0.04 + rng() * 0.04) * m, h: dip };
  // (reprise courte : l'échelle du verdict reste lisible en 390, la zone garde sa place pour son nom)
  const rest = buy ? rally(rng, m, c, 3).candles : drop(rng, m, c, 3).candles;
  return { ...raw, fut: [k, ...rest] };
}

const deb = {
  marteauMilieu: (rng: Rng, m: number): PsRaw => {
    const h = hammerOnSupport(rng, m, false);
    const logical = Math.min(h.low, h.b.lo) - (0.2 + rng() * 0.08) * m;
    const tight = h.b.hi + (h.entry - h.b.hi) * (0.35 + rng() * 0.15);
    const wide = logical - (1.5 + rng() * 0.3) * m;
    return { past: h.past, fut: rally(rng, m, h.entry, 5).candles, zones: [supportZone(m)], entry: h.entry, tp: tpFor(h.entry, logical), direction: "BUY",
      stops: [{ type: "tight", price: tight, rationale: T_NOISE }, { type: "logical", price: logical, rationale: L_SUPPORT }, { type: "wide", price: wide, rationale: W_FAR }] };
  },
  marteauLoin: (rng: Rng, m: number): PsRaw => {
    const h = hammerOnSupport(rng, m, true);
    const logical = h.low - (0.2 + rng() * 0.08) * m;
    const tight = h.b.hi + (h.entry - h.b.hi) * (0.35 + rng() * 0.15);
    const liq = h.b.lo - (0.08 + rng() * 0.04) * m;
    const f1 = drop(rng, m, h.entry, 1); const f2 = rally(rng, m, f1.p, 4);
    return { past: h.past, fut: [...f1.candles, ...f2.candles], zones: [supportZone(m)], entry: h.entry, tp: tpFor(h.entry, logical, 2.2), direction: "BUY",
      stops: [
        { type: "tight", price: tight, rationale: T_NOISE },
        { type: "liquidity", price: liq, rationale: "✗ Pile sous le support : la mèche du marteau est déjà descendue plus bas. Ce stop serait touché par la même mèche." },
        { type: "logical", price: logical, rationale: "✓ Plus bas que la pointe de la mèche du marteau, avec une marge : derrière la vraie invalidation. C'est le plus loin des trois, et pourtant le seul au bon endroit." },
      ] };
  },
  marteauProche: (rng: Rng, m: number): PsRaw => {
    const h = hammerOnSupport(rng, m, false);
    const logical = Math.min(h.low, h.b.lo) - (0.2 + rng() * 0.08) * m;
    const d = h.entry - logical;
    return { past: h.past, fut: rally(rng, m, h.entry, 5).candles, zones: [supportZone(m)], entry: h.entry, tp: tpFor(h.entry, logical), direction: "BUY",
      stops: [{ type: "logical", price: logical, rationale: L_SUPPORT }, { type: "wide", price: h.entry - 2 * d, rationale: W_X2 }, { type: "wide", price: h.entry - 3 * d, rationale: W_X3 }] };
  },
  engulfLoin: (rng: Rng, m: number): PsRaw => {
    const h = engulfOnSupport(rng, m, true);
    const logical = h.low - (0.2 + rng() * 0.08) * m;
    const tight = h.b.hi + (h.entry - h.b.hi) * (0.3 + rng() * 0.15);
    const liq = h.b.lo - (0.08 + rng() * 0.04) * m;
    return { past: h.past, fut: rally(rng, m, h.entry, 5).candles, zones: [supportZone(m)], entry: h.entry, tp: tpFor(h.entry, logical, 2.2), direction: "BUY",
      stops: [
        { type: "tight", price: tight, rationale: T_NOISE },
        { type: "liquidity", price: liq, rationale: "✗ Pile sous le support : la mèche de la bougie rouge de l'engulfing est déjà descendue plus bas. Ce stop ne protège pas l'idée." },
        { type: "logical", price: logical, rationale: "✓ Plus bas que la mèche de la bougie rouge, avec une marge : derrière la vraie invalidation de l'engulfing. Le plus loin des trois, mais le seul logique." },
      ] };
  },
  engulfProche: (rng: Rng, m: number): PsRaw => {
    const h = engulfOnSupport(rng, m, false);
    const logical = Math.min(h.low, h.b.lo) - (0.2 + rng() * 0.08) * m;
    const d = h.entry - logical;
    return { past: h.past, fut: rally(rng, m, h.entry, 5).candles, zones: [supportZone(m)], entry: h.entry, tp: tpFor(h.entry, logical), direction: "BUY",
      stops: [{ type: "logical", price: logical, rationale: L_SUPPORT }, { type: "wide", price: h.entry - 2 * d, rationale: W_X2 }, { type: "wide", price: h.entry - 3 * d, rationale: W_X3 }] };
  },
  swingMilieu: (rng: Rng, m: number): PsRaw => {
    const s = swingSetup(rng, m);
    const logical = s.sl - (0.18 + rng() * 0.08) * m;
    const tight = s.sl + (s.entry - s.sl) * (0.4 + rng() * 0.15);
    const wide = logical - (1.5 + rng() * 0.3) * m;
    return { past: s.past, fut: rally(rng, m, s.entry, 5).candles, zones: [pivotLow(s.sl, "Swing low", s.at)], entry: s.entry, tp: tpFor(s.entry, logical), direction: "BUY",
      stops: [
        { type: "tight", price: tight, rationale: "✗ Au-dessus du swing low, dans le bruit normal : le prix peut revenir vers le creux sans que l'idée soit fausse." },
        { type: "logical", price: logical, rationale: "✓ Sous le swing low, avec une marge : c'est le dernier creux, le niveau qui invalide le scénario haussier." },
        { type: "wide", price: wide, rationale: "≈ Beaucoup plus bas que le swing low : il tient, mais la perte possible grossit sans raison et le R/R se dégrade." },
      ] };
  },
  swingProche: (rng: Rng, m: number): PsRaw => {
    const s = swingSetup(rng, m);
    const logical = s.sl - (0.18 + rng() * 0.08) * m;
    const d = s.entry - logical;
    return { past: s.past, fut: rally(rng, m, s.entry, 5).candles, zones: [pivotLow(s.sl, "Swing low", s.at)], entry: s.entry, tp: tpFor(s.entry, logical), direction: "BUY",
      stops: [
        { type: "logical", price: logical, rationale: "✓ Sous le swing low, avec une marge : c'est le dernier creux, le niveau qui invalide le scénario haussier." },
        { type: "wide", price: s.entry - 2 * d, rationale: W_X2 }, { type: "wide", price: s.entry - 3 * d, rationale: W_X3 },
      ] };
  },
};

// ─── Constructions Intermédiaire (sens haussier) ────────────────────────────

/** Résistance cassée, retest par au-dessus, reprise : stop sous l'ancienne résistance */
function retestSetup(rng: Rng, m: number) {
  const R = 0, b = band(m);
  const t = provenResistance(rng, m, b.lo, b.hi);
  const a = legTo(rng, m, t.p, R - 0.4 * m, { retrace: 0.3 });
  const past = [...t.candles, ...a.candles];
  let p = a.p;
  const c0 = R + (0.5 + rng() * 0.1) * m; past.push({ o: p, c: c0, h: c0 + 0.06 * m, l: p - 0.04 * m }); p = c0;
  const up = rally(rng, m, p, 2); past.push(...up.candles); p = up.p;
  const back = legTo(rng, m, p, b.hi + (0.2 + rng() * 0.08) * m, { retrace: 0 }); past.push(...back.candles); p = back.p;
  const g = candle(p, p + (0.3 + rng() * 0.1) * m, 0.05 * m, 0.04 * m); past.push(g); p = g.c;
  return { past, entry: p, b, breakLow: c0 - 0.5 * m };
}
const inter = {
  retest: (rng: Rng, m: number): PsRaw => {
    const s = retestSetup(rng, m);
    const logical = s.b.lo - (0.28 + rng() * 0.08) * m;
    const tight = s.b.hi + (s.entry - s.b.hi) * (0.5 + rng() * 0.15);
    const wide = logical - (1.4 + rng() * 0.3) * m;
    return { past: s.past, fut: rally(rng, m, s.entry, 5).candles, zones: [supportZone(m)], entry: s.entry, tp: tpFor(s.entry, logical), direction: "BUY",
      stops: [
        { type: "tight", price: tight, rationale: T_NOISE },
        { type: "logical", price: logical, rationale: "✓ Sous le support (l'ancienne résistance), avec une marge : si le prix repasse dessous, le changement de rôle a échoué." },
        { type: "wide", price: wide, rationale: "≈ Sous le départ du breakout, très loin : il tient, mais le changement de rôle se lit sur l'ancienne résistance, pas sous la tendance entière. Le R/R s'écroule." },
      ] };
  },
  retestLoin: (rng: Rng, m: number): PsRaw => {
    const s = retestSetup(rng, m);
    const floor = Math.min(s.b.lo, ...s.past.slice(-4).map((k) => k.l));
    const liq = floor - (0.12 + rng() * 0.04) * m;
    const logical = liq - (0.3 + rng() * 0.08) * m;
    const tight = s.b.hi + (s.entry - s.b.hi) * (0.35 + rng() * 0.15);
    return { past: s.past, fut: rally(rng, m, s.entry, 5).candles, zones: [supportZone(m)], entry: s.entry, tp: tpFor(s.entry, logical), direction: "BUY",
      stops: [
        { type: "tight", price: tight, rationale: T_NOISE },
        { type: "liquidity", price: liq, rationale: "✗ Pile sous le support : le retest y descend souvent d'une mèche, et c'est là que dorment les stops des acheteurs du breakout." },
        { type: "logical", price: logical, rationale: "✓ Sous le support (l'ancienne résistance), avec une marge : au-delà de la mèche du retest, là où le changement de rôle aurait échoué." },
      ] };
  },
  retestProche: (rng: Rng, m: number): PsRaw => {
    const s = retestSetup(rng, m);
    const logical = s.b.lo - (0.2 + rng() * 0.08) * m;
    const d = s.entry - logical;
    return { past: s.past, fut: rally(rng, m, s.entry, 5).candles, zones: [supportZone(m)], entry: s.entry, tp: tpFor(s.entry, logical), direction: "BUY",
      stops: [
        { type: "logical", price: logical, rationale: "✓ Sous le support (l'ancienne résistance), avec une marge : si le prix repasse dessous, le changement de rôle a échoué." },
        { type: "wide", price: s.entry - 2 * d, rationale: W_X2 }, { type: "wide", price: s.entry - 3 * d, rationale: W_X3 },
      ] };
  },
  rangeBas: (rng: Rng, m: number): PsRaw => {
    const R = (4.6 + rng() * 0.5) * m, b = band(m);
    const s = rangeScene(rng, m, R, 4);
    const sig = bullSignal(rng, m, s.p, b.lo, b.hi, "marteau", rng() < 0.7 ? "rouge" : "verte");
    const past = [...s.past, ...sig.candles], entry = sig.p;
    // sous toutes les pointes qui dessinent le bas du range (le tracé se cale sur elles)
    const floor = Math.min(sig.low, b.lo, ...past.map((k) => k.l));
    const liq = floor - (0.3 + rng() * 0.05) * m;
    const logical = liq - (0.35 + rng() * 0.1) * m;
    const tight = b.hi + (entry - b.hi) * (0.35 + rng() * 0.15);
    return { past, fut: rally(rng, m, entry, 5, R - 0.3 * m).candles, zones: [{ kind: "support", y1: b.lo, y2: b.hi, label: "Bas du range" }, { kind: "resistance", y1: R - 0.13 * m, y2: R + 0.13 * m, label: "Haut du range" }],
      entry, tp: R - 0.3 * m, direction: "BUY",
      stops: [
        { type: "tight", price: tight, rationale: T_NOISE },
        { type: "liquidity", price: liq, rationale: "✗ Pile sous le bas du range : c'est là que dorment les stops de tous ceux qui achètent la borne, une simple mèche les déclenche." },
        { type: "logical", price: logical, rationale: "✓ Sous le bas du range, avec une marge : au-delà de la borne et de la mèche qui la teste, là où le range serait vraiment cassé." },
      ] };
  },
  fauxBreakoutBas: (rng: Rng, m: number): PsRaw => {
    const R = (4.6 + rng() * 0.5) * m, b = band(m);
    const s = rangeScene(rng, m, R, 6);
    const past = [...s.past];
    let p = s.p;
    // clôture sous la pointe la plus basse du range (le tracé de la borne se cale sur elle)
    const cA = Math.min(b.lo, ...past.map((k) => k.l)) - (0.55 + rng() * 0.08) * m; const tipA = cA - (0.35 + rng() * 0.1) * m;
    past.push({ o: p, c: cA, h: p + 0.04 * m, l: tipA }); p = cA;
    const cB = b.hi + (0.3 + rng() * 0.1) * m; past.push({ o: p, c: cB, h: cB + 0.05 * m, l: p - 0.03 * m }); p = cB;
    const logical = tipA - (0.2 + rng() * 0.08) * m;
    // dans la mèche du faux breakout (entre son corps et sa pointe)
    const tight = cA - (cA - tipA) * (0.35 + rng() * 0.15);
    const wide = logical - (1.4 + rng() * 0.3) * m;
    return { past, fut: rally(rng, m, p, 5, R - 0.3 * m).candles,
      zones: [{ kind: "support", y1: b.lo, y2: b.hi, label: "Bas du range", trigger: true }, { kind: "resistance", y1: R - 0.13 * m, y2: R + 0.13 * m, label: "Haut du range" }, { kind: "liquidity_low", y1: tipA, y2: cA - 0.03 * m, label: "Mèche du faux breakout" }],
      entry: p, tp: R - 0.3 * m, direction: "BUY",
      stops: [
        { type: "tight", price: tight, rationale: "✗ Dans la mèche du faux breakout, sous le bas du range : le prix y est déjà allé, il peut y retourner sans invalider le setup." },
        { type: "logical", price: logical, rationale: "✓ Sous la mèche du faux breakout, avec une marge : si le prix repasse sous la pointe du piège, le faux breakout n'en était pas un." },
        { type: "wide", price: wide, rationale: "≈ Très loin sous la mèche du faux breakout : il tient, mais la protection n'est pas meilleure et le R/R s'effondre." },
      ] };
  },
  /** BOS : le prix casse le swing high, revient le tester par au-dessus et repart ; le bon stop est sous le
   *  swing low (le plus loin), pas sous le swing high cassé ni entre les deux */
  structureBreak: (rng: Rng, m: number): PsRaw => {
    const past: Candle[] = [];
    let p = 0;
    const up1 = legTo(rng, m, p, (1.6 + rng() * 0.3) * m, { retrace: 0.2 }); past.push(...up1.candles); p = up1.p;
    const atH = past.length - 1;
    const H1 = p + (0.05 + rng() * 0.03) * m; past[atH] = { ...past[atH], h: H1 };
    const dn = legTo(rng, m, p, H1 - (1.05 + rng() * 0.2) * m, { retrace: 0, step: [0.28, 0.4] });
    // (le repli part sous le sommet : aucune mèche ne dépasse le swing high)
    past.push(...dn.candles.map((k) => ({ ...k, h: Math.max(k.o, k.c, Math.min(k.h, H1 - 0.03 * m)) }))); p = dn.p;
    const at = past.length - 1;
    const SL = Math.min(past[at].l, past[at].c - 0.02 * m); past[at] = { ...past[at], l: SL };
    for (let i = Math.max(atH + 1, at - 3); i < at; i++) { const k = past[i]; past[i] = { ...k, l: Math.max(k.l, Math.min(Math.min(k.o, k.c), SL + 0.3 * m)) }; }
    const c1 = candle(p, p + (0.3 + rng() * 0.1) * m, 0.05 * m, 0); past.push(c1); p = c1.c;
    const up2 = legTo(rng, m, p, H1 + (0.95 + rng() * 0.2) * m, { retrace: 0, step: [0.5, 0.8] }); past.push(...up2.candles); p = up2.p;
    // retour sur le swing high cassé, par au-dessus (la mèche vient au contact sans clôturer dessous)
    const back = legTo(rng, m, p, H1 + (0.24 + rng() * 0.06) * m, { retrace: 0 }); past.push(...back.candles); p = back.p;
    const kb = past[past.length - 1]; past[past.length - 1] = { ...kb, l: Math.min(kb.l, H1 + (0.02 + rng() * 0.04) * m) };
    const g = candle(p, p + (0.3 + rng() * 0.08) * m, 0.05 * m, 0.03 * m); past.push(g);
    const entry = g.c;
    const logical = SL - (0.2 + rng() * 0.08) * m;
    const near = H1 - (0.08 + rng() * 0.04) * m;
    const mid = SL + (H1 - SL) * (0.35 + rng() * 0.15);
    return { past, fut: rally(rng, m, entry, 5).candles,
      zones: [pivotLow(SL, "Swing low", at), { kind: "resistance", y1: H1 + 0.01, y2: H1 + 0.03, label: "Swing high", at: atH }],
      entry, tp: tpFor(entry, logical), direction: "BUY",
      stops: [
        { type: "tight", price: near, rationale: "✗ Pile sous le swing high cassé : le retest peut y plonger d'une mèche, alors que la structure n'est pas cassée." },
        { type: "liquidity", price: mid, rationale: "✗ Entre le swing high cassé et le swing low : un repli plus profond le touche sans que la structure soit cassée." },
        { type: "logical", price: logical, rationale: "✓ Sous le swing low, avec une marge : c'est le dernier plus bas de la structure haussière ; tant qu'il tient, le BOS reste valable." },
      ] };
  },
  structureBos: (rng: Rng, m: number): PsRaw => {
    const s = swingSetup(rng, m);
    const logical = s.sl - (0.18 + rng() * 0.08) * m;
    const d = s.entry - logical;
    return { past: s.past, fut: rally(rng, m, s.entry, 5).candles, zones: [pivotLow(s.sl, "Swing low", s.at)], entry: s.entry, tp: tpFor(s.entry, logical), direction: "BUY",
      stops: [
        { type: "logical", price: logical, rationale: "✓ Sous le swing low, avec une marge : c'est le dernier plus bas de la structure haussière. Tant qu'il tient, la tendance tient." },
        { type: "wide", price: s.entry - 2 * d, rationale: "≈ Sous le plus bas d'avant : il tient, mais il protège une structure déjà dépassée. La perte possible double, le R/R se dégrade." },
        { type: "wide", price: s.entry - 3 * d, rationale: "≈ Sous le départ de la tendance : il tient, mais aussi loin, le stop ne dit plus rien de la structure actuelle." },
      ] };
  },
  fibo: (rng: Rng, m: number): PsRaw => {
    const base = legTo(rng, m, 0.8 * m, 0, { retrace: 0 });
    const up = legTo(rng, m, base.p, base.p + (3.6 + rng() * 0.4) * m, { retrace: 0.15 });
    const A = Math.min(...base.candles.map((k) => k.l), ...up.candles.map((k) => k.l));
    const B = Math.max(...up.candles.map((k) => k.h));
    const target = B - (0.55 + rng() * 0.04) * (B - A);
    const dn = legTo(rng, m, up.p, target, { retrace: 0 });
    const g = candle(dn.p, dn.p + (0.25 + rng() * 0.1) * m, 0.05 * m, 0.04 * m);
    const past = [...base.candles, ...up.candles, ...dn.candles, g];
    const entry = g.c;
    const logical = A - (0.2 + rng() * 0.08) * m;
    const liq = A - (0.1 + rng() * 0.03) * m;
    const tight = entry - (0.35 + rng() * 0.1) * m;
    return { past, fut: rally(rng, m, entry, 5).candles, zones: [pivotLow(A, "Plus bas précédent")], entry, tp: B - 0.1 * m, direction: "BUY",
      stops: [
        { type: "tight", price: tight, rationale: "✗ Juste sous la bougie d'entrée, dans le bruit normal : le retracement peut s'étendre un peu sans que la hausse soit annulée." },
        { type: "liquidity", price: liq, rationale: "✗ Pile sous le plus bas précédent : le départ de la hausse attire les stops, une mèche peut le balayer avant la reprise." },
        { type: "logical", price: logical, rationale: "✓ Sous le plus bas précédent, avec une marge : sous le départ de la hausse (100 % du retracement), là où le scénario de pullback est faux." },
      ] };
  },
};

// ─── Constructions Avancé (sens haussier) ───────────────────────────────────

const adv: Record<"obProche" | "fvgMilieu" | "sweepProche" | "sweepMilieu" | "oteMilieu", (rng: Rng, m: number) => PsRaw> = {
  obProche: (rng: Rng, m: number): PsRaw => {
    const s = obScene(rng, m);
    const sig = bullSignal(rng, m, s.p, s.ob.lo, s.zone.y2, "marteau");
    const past = [...s.past, ...sig.candles], entry = sig.p;
    const logical = Math.min(s.zone.y1, sig.low) - (0.2 + rng() * 0.08) * m;
    const d = entry - logical;
    return { past, fut: rally(rng, m, entry, 5).candles, zones: [s.zone], entry, tp: tpFor(entry, logical), direction: "BUY",
      stops: [
        { type: "logical", price: logical, rationale: "✓ Sous le bas de l'Order Block, avec une marge : si le prix clôture sous l'OB, la zone est invalidée." },
        { type: "wide", price: entry - 2 * d, rationale: W_X2 }, { type: "wide", price: entry - 3 * d, rationale: W_X3 },
      ] };
  },
  fvgMilieu: (rng: Rng, m: number): PsRaw => {
    const d0 = legTo(rng, m, 1.6 * m, 0, { retrace: 0.3 });
    const past = [...d0.candles];
    let p = d0.p;
    const imp = bullImpulse3Local(rng, m, p); past.push(...imp.candles); p = imp.p;
    const fvg = { lo: imp.candles[0].h, hi: imp.candles[2].l };
    const more = rally(rng, m, p, 2); past.push(...more.candles); p = more.p;
    const back = legTo(rng, m, p, fvg.hi + (0.35 + rng() * 0.1) * m, { retrace: 0.3 }); past.push(...back.candles); p = back.p;
    const sig = bullSignal(rng, m, p, fvg.lo + 0.3 * (fvg.hi - fvg.lo), fvg.hi, "marteau"); past.push(...sig.candles);
    const entry = sig.p;
    const logical = fvg.lo - (0.2 + rng() * 0.08) * m;
    const tight = fvg.hi + (entry - fvg.hi) * (0.4 + rng() * 0.15);
    const wide = logical - (1.4 + rng() * 0.3) * m;
    return { past, fut: rally(rng, m, entry, 5).candles, zones: [{ kind: "fvg", y1: fvg.lo, y2: fvg.hi, label: "FVG haussier" }], entry, tp: tpFor(entry, logical), direction: "BUY",
      stops: [
        { type: "tight", price: tight, rationale: "✗ Au-dessus du FVG, dans le bruit normal : le prix peut entrer plus loin dans le déséquilibre sans l'invalider." },
        { type: "logical", price: logical, rationale: "✓ Sous le FVG, avec une marge : un FVG respecté tient ; s'il est traversé en clôture, la continuation est invalidée." },
        { type: "wide", price: wide, rationale: "≈ Très loin sous le FVG : il tient, mais le déséquilibre se lit dans sa zone, pas sous toute l'impulsion. Le R/R s'écroule." },
      ] };
  },
  sweepProche: (rng: Rng, m: number): PsRaw => {
    const L = 0;
    const d1 = legTo(rng, m, 2.4 * m, L + 0.3 * m, { retrace: 0.3 });
    const past = [...d1.candles];
    let p = d1.p;
    past.push({ o: p, c: L + 0.4 * m, h: p + 0.06 * m, l: L }); p = L + 0.4 * m;
    const up = legTo(rng, m, p, L + (1.6 + rng() * 0.2) * m, { retrace: 0.2 }); past.push(...up.candles); p = up.p;
    const dn = legTo(rng, m, p, L + 0.75 * m, { retrace: 0.2 }); past.push(...dn.candles); p = dn.p;
    const c = L + (0.4 + rng() * 0.08) * m, tip = L - (1.4 + rng() * 0.2) * m;
    past.push({ o: p, c, h: p + 0.04 * m, l: tip }); p = c;
    const logical = tip - (0.2 + rng() * 0.08) * m;
    const d = p - logical;
    return { past, fut: rally(rng, m, p, 5).candles,
      zones: [{ kind: "support", y1: L - 0.03, y2: L - 0.01, label: "Plus bas précédent" }, { kind: "liquidity_low", y1: tip, y2: L - 0.05 * m, label: "Liquidité balayée" }],
      entry: p, tp: tpFor(p, logical), direction: "BUY",
      stops: [
        { type: "logical", price: logical, rationale: "✓ Plus bas que la pointe de la mèche du sweep, avec une marge : derrière la vraie invalidation. Si le prix y revient, le sweep n'en était pas un." },
        { type: "wide", price: p - 2 * d, rationale: W_X2 }, { type: "wide", price: p - 3 * d, rationale: W_X3 },
      ] };
  },
  sweepMilieu: (rng: Rng, m: number): PsRaw => {
    const r = adv.sweepProche(rng, m);
    const logical = r.stops[0].price;
    const tip = Math.min(...r.past.slice(-1).map((k) => k.l));
    const tight = tip + (r.entry - tip) * (0.3 + rng() * 0.15);
    const wide = logical - (1.4 + rng() * 0.3) * m;
    return { ...r, stops: [
      { type: "tight", price: tight, rationale: "✗ Dans la mèche du sweep, au-dessus de sa pointe : le prix peut y revenir sans invalider le retournement." },
      r.stops[0],
      { type: "wide", price: wide, rationale: "≈ Très loin sous la mèche du sweep : il tient, mais il ne protège pas mieux et efface l'avantage d'une entrée sur sweep." },
    ] };
  },
  oteMilieu: (rng: Rng, m: number): PsRaw => {
    const base = legTo(rng, m, 0.8 * m, 0, { retrace: 0 });
    const up = legTo(rng, m, base.p, base.p + (3.6 + rng() * 0.4) * m, { retrace: 0.15 });
    const A = Math.min(...base.candles.map((k) => k.l), ...up.candles.map((k) => k.l));
    const B = Math.max(...up.candles.map((k) => k.h));
    // repli en deux temps : un swing high plus bas en UT inférieure, puis la zone OTE
    const d1 = legTo(rng, m, up.p, B - (0.36 + rng() * 0.04) * (B - A), { retrace: 0 });
    // (rebond en 3 bougies au moins : le swing high plus bas domine ses voisines)
    const b1 = legTo(rng, m, d1.p, d1.p + (0.13 + rng() * 0.03) * (B - A), { retrace: 0, step: [0.14, 0.2] });
    const lhAt = base.candles.length + up.candles.length + d1.candles.length + b1.candles.length - 1;
    const d2r = legTo(rng, m, b1.p, B - (0.68 + rng() * 0.04) * (B - A), { retrace: 0 });
    const LH = Math.max(...b1.candles.map((k) => k.h));
    // (le repli repart sous le swing high : aucune mèche voisine ne le dépasse)
    const d2 = { ...d2r, candles: d2r.candles.map((k) => ({ ...k, h: Math.max(k.o, k.c, Math.min(k.h, LH - 0.05 * m)) })) };
    const dn = { candles: [...d1.candles, ...b1.candles, ...d2.candles], p: d2.p };
    const g = candle(dn.p, dn.p + (0.25 + rng() * 0.1) * m, 0.05 * m, 0.04 * m);
    const past = [...base.candles, ...up.candles, ...dn.candles, g];
    const entry = g.c;
    const logical = A - (0.25 + rng() * 0.08) * m;
    const tight = entry - (0.35 + rng() * 0.1) * m;
    const wide = logical - (1.4 + rng() * 0.3) * m;
    return { past, fut: rally(rng, m, entry, 5).candles, zones: [pivotLow(A, "Plus bas précédent"), { kind: "resistance", y1: LH + 0.01, y2: LH + 0.03, label: "Swing high", at: lhAt }], entry, tp: B - 0.1 * m, direction: "BUY",
      stops: [
        { type: "tight", price: tight, rationale: "✗ Juste sous la bougie d'entrée, dans le bruit normal : la zone OTE va jusqu'à 79 %, le prix peut y descendre encore." },
        { type: "logical", price: logical, rationale: "✓ Sous le plus bas précédent, avec une marge : sous le départ de l'impulsion, là où l'OTE est invalidée." },
        { type: "wide", price: wide, rationale: "≈ Très loin sous le plus bas précédent : il tient, mais il ne protège pas mieux et efface l'avantage de l'entrée OTE." },
      ] };
  },
};

// ─── Affirmations ─────────────────────────────────────────────────────────────

/** BOS : une clôture au-dessus du swing high, puis un retour au contact par au-dessus, sans clôture dessous */
const bosRetest: Claim = (c) => {
  const ch = asBull(c), z = ch.zones.find((x) => x.label === "Swing high"), s = ch.zones.find((x) => x.label === "Swing low");
  if (!z || !s) return "swing high / swing low absents";
  if (!(lo(s) < lo(z))) return "le swing low n'est pas sous le swing high";
  const i = ch.past.findIndex((k, j) => j > (s.at ?? 0) && k.c > hi(z));
  if (i < 0) return "pas de clôture au-dessus du swing high (BOS)";
  const after = ch.past.slice(i + 1), t = mr(ch.past);
  if (after.some((k) => k.c < lo(z))) return "clôture sous le swing high cassé après le BOS";
  return Math.min(...after.map((k) => k.l)) <= hi(z) + 0.3 * t ? null : "pas de retour sur le swing high cassé";
};
const hammerOnZone: Claim = (c) => { const ch = asBull(c); const z = ch.zones.find((x) => /^(Support|Bas du range)$/.test(x.label)); const k = last(ch.past); if (!z) return "pas de support"; return isHammer(k) && k.l <= hi(z) + 0.25 * mr(ch.past) ? null : "pas de marteau sur le niveau"; };
const hammerPierces: Claim = (c) => { const ch = asBull(c); const z = ch.zones.find((x) => x.label === "Support"); const k = last(ch.past); if (!z) return "pas de support"; return isHammer(k) && k.l < lo(z) - 0.25 * mr(ch.past) && Math.min(k.o, k.c) > hi(z) ? null : "pas de marteau dont la mèche traverse le support"; };
const engulfOnZone = (pierce: boolean): Claim => (c) => { const ch = asBull(c); const z = ch.zones.find((x) => x.label === "Support"); const [a, b] = ch.past.slice(-2); if (!z) return "pas de support"; if (!isBullEngulfing(a, b)) return "pas d'engulfing haussier"; return pierce ? (a.l < lo(z) - 0.25 * mr(ch.past) ? null : "la mèche de la bougie rouge ne traverse pas le support") : (a.l <= hi(z) + 0.25 * mr(ch.past) ? null : "l'engulfing ne touche pas le support"); };
const swingThenResume: Claim = (c) => { const ch = asBull(c); const z = ch.zones.find((x) => x.label === "Swing low"); if (!z) return "pas de swing low"; const ks = ch.past.slice(-2); return ks.every((k) => k.c > k.o) && last(ch.past).c > hi(z) ? null : "pas de reprise au-dessus du swing low"; };
const retestHolds: Claim = (c) => { const ch = asBull(c); const z = ch.zones.find((x) => /support/i.test(x.label)); if (!z) return "pas d'ancienne résistance"; const i = ch.past.findIndex((k) => k.c > hi(z)); return i > 0 && ch.past.slice(i).every((k) => k.c > lo(z)) && last(ch.past).c > hi(z) ? null : "le retest ne tient pas au-dessus de l'ancienne résistance"; };
const fakeoutBack: Claim = (c) => { const ch = asBull(c); const z = ch.zones.find((x) => x.label === "Bas du range"); const [a, b] = ch.past.slice(-2); if (!z) return "pas de bas du range"; return a.c < lo(z) && b.c > hi(z) ? null : "pas de clôture sous la borne puis réintégration"; };
const hammerInOb: Claim = (c) => { const ch = asBull(c); const z = ch.zones.find((x) => /Order Block/.test(x.label)); const k = last(ch.past); if (!z) return "pas d'OB"; return isHammer(k) && k.l <= hi(z) + 0.25 * mr(ch.past) && Math.min(k.o, k.c) > lo(z) ? null : "pas de marteau dont la mèche entre dans l'OB"; };
const hammerInFvg: Claim = (c) => { const ch = asBull(c); const z = ch.zones.find((x) => x.kind === "fvg"); const k = last(ch.past); if (!z) return "pas de FVG"; return isHammer(k) && k.l <= hi(z) + 0.25 * mr(ch.past) && k.c > lo(z) ? null : "pas de marteau dans le FVG"; };
const sweepBack: Claim = (c) => { const ch = asBull(c); const z = ch.zones.find((x) => x.label === "Plus bas précédent"); const k = last(ch.past); if (!z) return "pas de plus bas précédent"; return k.l < lo(z) - 0.25 * mr(ch.past) && k.c > hi(z) ? null : "pas de sweep (mèche sous le plus bas, clôture au-dessus)"; };
const retraceOte: Claim = (c) => { const ch = asBull(c); const B = Math.max(...ch.past.map((k) => k.c)); const z = ch.zones.find((x) => x.label === "Plus bas précédent"); if (!z) return "pas de plus bas précédent"; const lowPb = Math.min(...ch.past.slice(-4).map((k) => k.c)); const r = (B - lowPb) / (B - lo(z)); return r >= 0.58 && r <= 0.82 ? null : `retracement ${(100 * r).toFixed(0)} % (zone OTE attendue, 62 à 79 % à quelques points près)`; };
const retraceNear618: Claim = (c) => { const ch = asBull(c); const B = Math.max(...ch.past.map((k) => k.c)); const z = ch.zones.find((x) => x.label === "Plus bas précédent"); if (!z) return "pas de plus bas précédent"; const lowPb = Math.min(...ch.past.slice(-4).map((k) => k.c)); const r = (B - lowPb) / (B - lo(z)); return r >= 0.48 && r <= 0.72 ? null : `retracement ${(100 * r).toFixed(0)} % (attendu 48 à 72 %)`; };

// ─── Scénarios ────────────────────────────────────────────────────────────────

const DEB = { difficulties: ["beginner"] as const, macroContext: "normal" as const, htfBias: "range" as const };
const INT = { difficulties: ["intermediate"] as const, macroContext: "normal" as const };
const ADV = { difficulties: ["advanced"] as const, macroContext: "normal" as const };
const LS = "Un stop se place là où ton idée devient fausse, avec une marge : sous le support ou sous le dernier swing low en achat (au-dessus en vente). Trop près, il reste dans le bruit ; trop loin, il dégrade le R/R (leçon Débutant 5).";

export const PS_NEW: PsScenario[] = [
  // ── Débutant ──
  { ...DEB, id: "deb_stop_marteau", title: "Stop après un marteau sur support", direction: "BUY", tag: "structure", rank: "milieu",
    notions: ["stop_loss", "support_resistance"], context: "Tu achètes après un marteau posé sur un support touché deux fois. Où placer ton stop ?", shortContext: "BUY sur marteau, support.",
    lessons: one(LS), build: deb.marteauMilieu, claims: { "marteau sur le support": hammerOnZone, "bon stop : celui du milieu": rankIs("milieu") } },
  { ...DEB, id: "deb_stop_etoile", title: "Stop après une étoile filante sous résistance", direction: "SELL", tag: "structure", rank: "milieu",
    notions: ["stop_loss", "support_resistance"], context: "Tu vends après une étoile filante posée sous une résistance touchée deux fois. Où placer ton stop ?", shortContext: "SELL sur étoile filante, résistance.",
    lessons: one(LS), build: mirrored(deb.marteauMilieu), claims: { "étoile filante sous la résistance": hammerOnZone, "bon stop : celui du milieu": rankIs("milieu") } },
  { ...DEB, id: "deb_stop_meche_longue", title: "Marteau à longue mèche sous le support", direction: "BUY", tag: "structure", rank: "loin",
    notions: ["stop_loss", "support_resistance"], context: "Tu achètes un marteau sur un support touché deux fois. Sa mèche est descendue nettement sous la zone avant que le prix remonte. Où placer ton stop ?", shortContext: "Marteau dont la mèche traverse le support.",
    lessons: one("Le stop protège l'idée, pas l'entrée : si la mèche du signal est déjà descendue plus bas, le stop va sous cette mèche, même s'il est plus loin (leçon Débutant 5)."), build: deb.marteauLoin,
    claims: { "marteau dont la mèche traverse le support": hammerPierces, "bon stop : le plus loin": rankIs("loin") } },
  { ...DEB, id: "deb_stop_meche_longue_vente", title: "Étoile filante à longue mèche au-dessus de la résistance", direction: "SELL", tag: "structure", rank: "loin",
    notions: ["stop_loss", "support_resistance"], context: "Tu vends une étoile filante sous une résistance touchée deux fois. Sa mèche est montée nettement au-dessus de la zone avant que le prix redescende. Où placer ton stop ?", shortContext: "Étoile filante dont la mèche traverse la résistance.",
    lessons: one("Le stop protège l'idée, pas l'entrée : si la mèche du signal est déjà montée plus haut, le stop va au-dessus de cette mèche, même s'il est plus loin (leçon Débutant 5)."), build: mirrored(deb.marteauLoin),
    claims: { "étoile filante dont la mèche traverse la résistance": hammerPierces, "bon stop : le plus loin": rankIs("loin") } },
  { ...DEB, id: "deb_stop_trop_large", title: "Trois stops, deux trop larges", direction: "BUY", tag: "structure", rank: "proche",
    notions: ["stop_loss", "support_resistance"], context: "Tu achètes un marteau posé sur un support touché deux fois. Deux des stops proposés sont bien plus loin que le support. Lequel choisir ?", shortContext: "Marteau sur support : stop juste sous la zone ?",
    lessons: one("Un stop plus large n'est pas plus « sûr » : derrière la vraie invalidation, la distance en plus ne protège rien, elle ne fait que grossir la perte possible (leçons Débutant 5 et 6)."), build: deb.marteauProche,
    claims: { "marteau sur le support": hammerOnZone, "bon stop : le plus proche": rankIs("proche") } },
  { ...DEB, id: "deb_stop_trop_large_vente", title: "Trois stops, deux trop larges (vente)", direction: "SELL", tag: "structure", rank: "proche",
    notions: ["stop_loss", "support_resistance"], context: "Tu vends une étoile filante posée sous une résistance touchée deux fois. Deux des stops proposés sont bien plus loin que la résistance. Lequel choisir ?", shortContext: "Étoile filante sous résistance : stop juste au-dessus ?",
    lessons: one("Un stop plus large n'est pas plus « sûr » : derrière la vraie invalidation, la distance en plus ne protège rien, elle ne fait que grossir la perte possible (leçons Débutant 5 et 6)."), build: mirrored(deb.marteauProche),
    claims: { "étoile filante sous la résistance": hammerOnZone, "bon stop : le plus proche": rankIs("proche") } },
  { ...DEB, id: "deb_stop_engulfing", title: "Stop sous la mèche d'un engulfing", direction: "BUY", tag: "structure", rank: "loin",
    notions: ["stop_loss", "support_resistance"], context: "Tu achètes après un engulfing haussier sur un support. La bougie rouge de l'engulfing est descendue nettement sous la zone. Où placer ton stop ?", shortContext: "Engulfing haussier, mèche sous le support.",
    lessons: one("Le signal d'entrée inclut ses deux bougies : le stop se place sous la mèche la plus basse de l'engulfing, avec une marge (leçons Débutant 3 et 5)."), build: deb.engulfLoin,
    claims: { "engulfing dont la bougie rouge traverse le support": engulfOnZone(true), "bon stop : le plus loin": rankIs("loin") } },
  { ...DEB, id: "deb_stop_engulfing_vente", title: "Stop au-dessus d'un engulfing baissier", direction: "SELL", tag: "structure", rank: "proche",
    notions: ["stop_loss", "support_resistance"], context: "Tu vends après un engulfing baissier sous une résistance touchée deux fois. Deux des stops proposés sont bien plus loin que la résistance. Où placer ton stop ?", shortContext: "Engulfing baissier sous résistance.",
    lessons: one("Le stop se place juste au-dessus de la résistance et de l'engulfing, avec une marge. Plus haut, il ne protège pas mieux, il grossit la perte possible (leçons Débutant 3 et 5)."), build: mirrored(deb.engulfProche),
    claims: { "engulfing baissier sous la résistance": engulfOnZone(false), "bon stop : le plus proche": rankIs("proche") } },
  { ...DEB, id: "deb_stop_swing_low", title: "Stop sous le dernier swing low", direction: "BUY", tag: "structure", rank: "milieu",
    notions: ["stop_loss", "tendance"], context: "Les creux montent : le prix vient de rebondir au-dessus du dernier swing low et repart. Tu achètes. Où placer ton stop ?", shortContext: "BUY après rebond au-dessus du swing low.",
    lessons: one("Repère le dernier swing low avant ton achat : le stop va juste en dessous, avec une marge. C'est le niveau qui invalide le scénario haussier (leçon Débutant 5)."), build: deb.swingMilieu,
    claims: { "reprise au-dessus du swing low": swingThenResume, "bon stop : celui du milieu": rankIs("milieu") } },
  { ...DEB, id: "deb_stop_swing_high", title: "Stop au-dessus du dernier swing high", direction: "SELL", tag: "structure", rank: "milieu",
    notions: ["stop_loss", "tendance"], context: "Les sommets descendent : le prix vient de rejeter sous le dernier swing high et repart à la baisse. Tu vends. Où placer ton stop ?", shortContext: "SELL après rejet sous le swing high.",
    lessons: one("Repère le dernier swing high avant ta vente : le stop va juste au-dessus, avec une marge. C'est le niveau qui invalide le scénario baissier (leçon Débutant 5)."), build: mirrored(deb.swingMilieu),
    claims: { "reprise sous le swing high": swingThenResume, "bon stop : celui du milieu": rankIs("milieu") } },
  { ...DEB, id: "deb_stop_swing_proche", title: "Stop serré, mais au bon endroit", direction: "BUY", tag: "structure", rank: "proche",
    notions: ["stop_loss", "tendance"], context: "Les creux montent : tu achètes la reprise au-dessus du dernier swing low. Deux stops sont bien plus bas que ce creux. Lequel choisir ?", shortContext: "Reprise au-dessus du swing low.",
    lessons: one("Le bon stop n'est pas le plus lointain : c'est celui qui se place juste derrière le niveau qui invalide l'idée, ici le dernier swing low (leçon Débutant 5)."), build: deb.swingProche,
    claims: { "reprise au-dessus du swing low": swingThenResume, "bon stop : le plus proche": rankIs("proche") } },
  { ...DEB, id: "deb_stop_swing_proche_vente", title: "Stop serré au-dessus du swing high", direction: "SELL", tag: "structure", rank: "proche",
    notions: ["stop_loss", "tendance"], context: "Les sommets descendent : tu vends la reprise sous le dernier swing high. Deux stops sont bien plus haut que ce sommet. Lequel choisir ?", shortContext: "Reprise sous le swing high.",
    lessons: one("Le bon stop n'est pas le plus lointain : c'est celui qui se place juste derrière le niveau qui invalide l'idée, ici le dernier swing high (leçon Débutant 5)."), build: mirrored(deb.swingProche),
    claims: { "reprise sous le swing high": swingThenResume, "bon stop : le plus proche": rankIs("proche") } },
  // ── Intermédiaire ──
  { ...INT, id: "int_stop_retest", title: "Stop après le retest d'une résistance cassée", direction: "BUY", htfBias: "bullish", tag: "structure", rank: "proche",
    notions: ["changement_role", "breakout", "stop_loss"], trap: "Les stops bien plus bas paraissent plus « sûrs », mais le changement de rôle se lit sur l'ancienne résistance.",
    context: "Le prix a cassé une résistance, l'a retestée par au-dessus, et repart. Tu achètes. Où placer ton stop ?", shortContext: "BUY après retest de l'ancienne résistance.",
    lessons: one("Après un breakout, l'ancienne résistance devient support : le stop se place juste sous elle, avec une marge. Plus bas, il ne protège pas mieux et dégrade le R/R (leçon Intermédiaire 3)."), build: inter.retestProche,
    claims: { "retest tenu au-dessus de l'ancienne résistance": retestHolds, "bon stop : le plus proche": rankIs("proche") } },
  { ...INT, id: "int_stop_retest_vente", title: "Stop après le retest d'un support cassé", direction: "SELL", htfBias: "bearish", tag: "structure", rank: "proche",
    notions: ["changement_role", "breakout", "stop_loss"], trap: "Les stops bien plus haut paraissent plus « sûrs », mais le changement de rôle se lit sur l'ancien support.",
    context: "Le prix a cassé un support, l'a retesté par en dessous, et repart à la baisse. Tu vends. Où placer ton stop ?", shortContext: "SELL après retest de l'ancien support.",
    lessons: one("Après un breakout baissier, l'ancien support devient résistance : le stop se place juste au-dessus, avec une marge. S'il est touché, le changement de rôle a échoué (leçon Intermédiaire 3)."), build: mirrored(inter.retestProche),
    claims: { "retest tenu sous l'ancien support": retestHolds, "bon stop : le plus proche": rankIs("proche") } },
  { ...INT, id: "int_stop_bas_range", title: "Stop au bas du range", direction: "BUY", htfBias: "range", tag: "liquidité", rank: "loin",
    notions: ["range", "zones_cles", "stop_loss"], trap: "Le stop « pile sous le bas du range » paraît logique, mais c'est là que tous les stops dorment.",
    context: "Tu achètes un marteau au bas d'un range touché deux fois. Où placer ton stop ?", shortContext: "BUY au bas du range.",
    lessons: one("Une borne de range est connue de tous : les stops s'accumulent juste derrière. Le stop se place au-delà de la borne et de sa mèche, avec une marge (leçons Intermédiaire 1 et 2)."), build: inter.rangeBas,
    claims: { "marteau au bas du range": hammerOnZone, "bon stop : le plus loin": rankIs("loin") } },
  { ...INT, id: "int_stop_haut_range", title: "Stop au haut du range", direction: "SELL", htfBias: "range", tag: "liquidité", rank: "loin",
    notions: ["range", "zones_cles", "stop_loss"], trap: "Le stop « pile au-dessus du haut du range » paraît logique, mais c'est là que tous les stops dorment.",
    context: "Tu vends une étoile filante au haut d'un range touché deux fois. Où placer ton stop ?", shortContext: "SELL au haut du range.",
    lessons: one("Une borne de range est connue de tous : les stops s'accumulent juste derrière. Le stop se place au-delà de la borne et de sa mèche, avec une marge (leçons Intermédiaire 1 et 2)."), build: mirrored(inter.rangeBas),
    claims: { "étoile filante au haut du range": hammerOnZone, "bon stop : le plus loin": rankIs("loin") } },
  { ...INT, id: "int_stop_faux_breakout_bas", title: "Stop après un faux breakout sous le range", direction: "BUY", htfBias: "range", tag: "piège", rank: "milieu",
    notions: ["faux_breakout", "range", "stop_loss"], trap: "Le stop juste sous le bas du range paraît suffisant, mais il est dans la mèche du faux breakout.",
    context: "Une bougie a clôturé sous le bas du range, puis la suivante l'a réintégré. Tu achètes ce faux breakout. Où placer ton stop ?", shortContext: "BUY après faux breakout sous le range.",
    lessons: one("Sur un faux breakout, la pointe de la mèche marque l'invalidation : le stop se place sous elle, avec une marge, pas dans la mèche (leçon Intermédiaire 6)."), build: inter.fauxBreakoutBas,
    claims: { "clôture sous le range, puis réintégration": fakeoutBack, "bon stop : celui du milieu": rankIs("milieu") } },
  { ...INT, id: "int_stop_structure", title: "Stop après un BOS et son retest", direction: "BUY", htfBias: "bullish", tag: "structure", rank: "loin",
    notions: ["structure", "changement_role", "stop_loss"], trap: "Le stop pile sous le swing high cassé paraît logique, puisqu'il a changé de rôle, mais la structure n'est invalidée que sous le swing low.",
    context: "La structure haussière vient de faire un BOS : le prix a cassé le swing high, l'a retesté par au-dessus et repart. Tu achètes. Où placer ton stop ?", shortContext: "BUY après BOS et retest.",
    lessons: one("Après un BOS, c'est le dernier plus bas de la structure qui la tient : le stop se place sous le swing low, avec une marge. Le swing high cassé n'est qu'un premier appui (leçon Intermédiaire 1)."), build: inter.structureBreak,
    claims: { "BOS puis retest du swing high cassé": bosRetest, "bon stop : le plus loin": rankIs("loin") } },
  { ...INT, id: "int_stop_structure_vente", title: "Stop après un BOS baissier et son retest", direction: "SELL", htfBias: "bearish", tag: "structure", rank: "loin",
    notions: ["structure", "changement_role", "stop_loss"], trap: "Le stop pile au-dessus du swing low cassé paraît logique, puisqu'il a changé de rôle, mais la structure n'est invalidée qu'au-dessus du swing high.",
    context: "La structure baissière vient de faire un BOS : le prix a cassé le swing low, l'a retesté par en dessous et repart à la baisse. Tu vends. Où placer ton stop ?", shortContext: "SELL après BOS et retest.",
    lessons: one("Après un BOS baissier, c'est le dernier plus haut de la structure qui la tient : le stop se place au-dessus du swing high, avec une marge. Le swing low cassé n'est qu'une première résistance (leçon Intermédiaire 1)."), build: mirrored(inter.structureBreak),
    claims: { "BOS puis retest du swing high cassé": bosRetest, "bon stop : le plus loin": rankIs("loin") } },
  { ...INT, id: "int_stop_fibonacci", title: "Stop d'un pullback à 61,8 % (vente)", direction: "SELL", htfBias: "bearish", tag: "structure", rank: "loin",
    notions: ["fibonacci", "pullback", "stop_loss"], trap: "Le stop serré au-dessus de la bougie d'entrée améliore le R/R affiché, mais il reste dans le bruit du retracement.",
    context: "Après une forte baisse, le prix remonte d'environ 60 % puis repart à la baisse. Tu vends. Où placer ton stop ?", shortContext: "SELL à 61,8 % du retracement.",
    lessons: one("Un pullback à 61,8 % reste valable tant que le départ de la baisse tient : le stop se place au-dessus de ce plus haut, avec une marge (leçon Intermédiaire 9)."), build: mirrored(inter.fibo),
    claims: { "rebond de 48 à 72 % de la baisse": retraceNear618, "bon stop : le plus loin": rankIs("loin") } },
  // ── Avancé ──
  { ...ADV, id: "adv_stop_ob", title: "Stop d'un achat dans un Order Block", direction: "BUY", htfBias: "bullish", tag: "structure", rank: "proche",
    notions: ["order_block", "entree_precision", "stop_loss"], conflict: "Les stops très larges paraissent prudents, mais l'invalidation d'un Order Block est simple : une clôture sous son bas.",
    context: "Le prix revient dans un Order Block haussier et y imprime un marteau. Tu achètes. Où placer ton stop ?", shortContext: "BUY sur marteau dans l'OB.",
    lessons: one("Un Order Block se trade avec un stop juste sous son bas, avec une marge : c'est ce qui rend l'entrée de précision intéressante (leçons Avancé 3 et 7)."), build: adv.obProche,
    claims: { "marteau dont la mèche entre dans l'OB": hammerInOb, "bon stop : le plus proche": rankIs("proche") } },
  { ...ADV, id: "adv_stop_ob_vente", title: "Stop d'une vente dans un Order Block", direction: "SELL", htfBias: "bearish", tag: "structure", rank: "proche",
    notions: ["order_block", "entree_precision", "stop_loss"], conflict: "Les stops très larges paraissent prudents, mais l'invalidation d'un Order Block est simple : une clôture au-dessus de son haut.",
    context: "Le prix revient dans un Order Block baissier et y imprime une étoile filante. Tu vends. Où placer ton stop ?", shortContext: "SELL sur étoile filante dans l'OB.",
    lessons: one("Un Order Block se trade avec un stop juste au-dessus de son haut, avec une marge : c'est ce qui rend l'entrée de précision intéressante (leçons Avancé 3 et 7)."), build: mirrored(adv.obProche),
    claims: { "étoile filante dont la mèche entre dans l'OB": hammerInOb, "bon stop : le plus proche": rankIs("proche") } },
  { ...ADV, id: "adv_stop_fvg", title: "Stop d'un achat sur un FVG respecté", direction: "BUY", htfBias: "bullish", tag: "structure", rank: "milieu",
    notions: ["fvg", "stop_loss"], conflict: "Le stop collé à l'entrée améliore le R/R, mais le prix peut entrer plus loin dans le FVG sans l'invalider.",
    context: "Le prix revient dans un FVG haussier et y imprime un marteau. Tu achètes. Où placer ton stop ?", shortContext: "BUY sur FVG respecté.",
    lessons: one("Un FVG respecté se défend sur toute sa hauteur : le stop se place sous la zone, avec une marge, ni dedans, ni sous toute l'impulsion (leçon Avancé 2)."), build: adv.fvgMilieu,
    claims: { "marteau dans le FVG": hammerInFvg, "bon stop : celui du milieu": rankIs("milieu") } },
  { ...ADV, id: "adv_stop_fvg_vente", title: "Stop d'une vente sur un FVG respecté", direction: "SELL", htfBias: "bearish", tag: "structure", rank: "milieu",
    notions: ["fvg", "stop_loss"], conflict: "Le stop collé à l'entrée améliore le R/R, mais le prix peut entrer plus loin dans le FVG sans l'invalider.",
    context: "Le prix remonte dans un FVG baissier et y imprime une étoile filante. Tu vends. Où placer ton stop ?", shortContext: "SELL sur FVG respecté.",
    lessons: one("Un FVG respecté se défend sur toute sa hauteur : le stop se place au-dessus de la zone, avec une marge, ni dedans, ni au-dessus de toute l'impulsion (leçon Avancé 2)."), build: mirrored(adv.fvgMilieu),
    claims: { "étoile filante dans le FVG": hammerInFvg, "bon stop : celui du milieu": rankIs("milieu") } },
  { ...ADV, id: "adv_stop_sweep", title: "Stop après un sweep du plus bas", direction: "BUY", htfBias: "bullish", tag: "liquidité", rank: "milieu",
    notions: ["sweep", "liquidite", "stop_loss"], conflict: "Un stop dans la mèche du sweep améliore le R/R affiché, mais la pointe du sweep marque l'invalidation : il va sous elle.",
    context: "Une bougie vient de balayer le plus bas précédent avec une très longue mèche, puis a clôturé au-dessus. Tu achètes. Où placer ton stop ?", shortContext: "BUY après sweep du plus bas.",
    lessons: one("Après un sweep, la pointe de la mèche marque l'invalidation : le stop se place juste derrière, avec une marge. Dans la mèche, il est balayé ; beaucoup plus loin, il ne protège rien de plus (leçon Avancé 1)."), build: adv.sweepMilieu,
    claims: { "mèche sous le plus bas, clôture au-dessus": sweepBack, "bon stop : celui du milieu": rankIs("milieu") } },
  { ...ADV, id: "adv_stop_sweep_vente", title: "Stop après un sweep du plus haut", direction: "SELL", htfBias: "bearish", tag: "liquidité", rank: "proche",
    notions: ["sweep", "liquidite", "stop_loss"], conflict: "Après une mèche aussi longue, un stop très large rassure ; l'invalidation est pourtant la pointe du sweep.",
    context: "Une bougie vient de balayer le plus haut précédent avec une très longue mèche, puis a clôturé en dessous. Tu vends. Où placer ton stop ?", shortContext: "SELL après sweep du plus haut.",
    lessons: one("Après un sweep, la pointe de la mèche marque l'invalidation : le stop se place juste derrière, avec une marge. Plus loin, il ne protège rien de plus (leçon Avancé 1)."), build: mirrored(adv.sweepProche),
    claims: { "mèche au-dessus du plus haut, clôture en dessous": sweepBack, "bon stop : le plus proche": rankIs("proche") } },
  { ...ADV, id: "adv_stop_ote", title: "Stop d'une entrée OTE", direction: "BUY", htfBias: "bullish", tag: "structure", rank: "milieu",
    notions: ["ote", "fibonacci", "stop_loss"], conflict: "Le stop serré sous la bougie d'entrée améliore le R/R, mais la zone OTE s'étend jusqu'à 79 % : il serait balayé.",
    context: "Après une forte impulsion haussière, le prix corrige : en UT inférieure, il fait même un swing high plus bas, puis descend dans la zone OTE et repart. Tu achètes. Où placer ton stop ?", shortContext: "BUY dans la zone OTE.",
    lessons: one("Une entrée OTE se protège sous le départ de l'impulsion, avec une marge : la zone 62 à 79 % peut être entièrement visitée avant la reprise (leçon Avancé 5)."), build: adv.oteMilieu,
    claims: { "repli dans la zone OTE": retraceOte, "bon stop : celui du milieu": rankIs("milieu") } },
  { ...ADV, id: "adv_stop_ote_vente", title: "Stop d'une vente OTE", direction: "SELL", htfBias: "bearish", tag: "structure", rank: "milieu",
    notions: ["ote", "fibonacci", "stop_loss"], conflict: "Le stop serré au-dessus de la bougie d'entrée améliore le R/R, mais la zone OTE s'étend jusqu'à 79 % : il serait balayé.",
    context: "Après une forte impulsion baissière, le prix remonte : en UT inférieure, il fait même un swing low plus haut, puis monte dans la zone OTE et repart à la baisse. Tu vends. Où placer ton stop ?", shortContext: "SELL dans la zone OTE.",
    lessons: one("Une entrée OTE se protège au-dessus du départ de l'impulsion, avec une marge : la zone 62 à 79 % peut être entièrement visitée avant la reprise (leçon Avancé 5)."), build: mirrored(adv.oteMilieu),
    claims: { "rebond dans la zone OTE": retraceOte, "bon stop : celui du milieu": rankIs("milieu") } },
];
