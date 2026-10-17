// BUY / SELL / NO TRADE — scénarios construits sur les scènes partagées (lib/games/scenes.ts).
// Chaque scénario : un seul niveau de jeu, ses notions (lib/games/notions.ts), son graphique
// (`build`, unités abstraites) et ses affirmations vérifiées sur le graphique (`claims`,
// scripts/audit-jeux/coherence-bsnt.ts). Les variantes de vente sont les miroirs exacts des
// variantes d'achat, avec leurs propres textes.

import type { Candle, ChartZone } from "./shared";
import { candle, rangeLegs } from "./shared";
import type { NotionId } from "./notions";
import {
  bullSignal, chop, drop, legTo, mirrorCandles, mirrorZones, provenResistance, provenSupport, rally,
  body, range, upperWick, lowerWick, isHammer, isShootingStar, isDoji, isBullEngulfing, isBearEngulfing,
  type Rng,
} from "./scenes";

type Difficulty = "beginner" | "intermediate" | "advanced";
type GameChoice = "BUY" | "SELL" | "NO_TRADE";
export interface Raw { past: Candle[]; future: Candle[]; zones: ChartZone[] }
interface ChartLike { past: Candle[]; future: Candle[]; zones: ChartZone[] }
type Claim = (ch: ChartLike) => string | null;

export interface NewScenario {
  id:            string;
  title:         string;
  correctAnswer: GameChoice;
  htfBias:       "bullish" | "bearish" | "range";
  macroContext:  "normal" | "dangereux";
  metric:        "discipline" | "lecture" | "piege";
  context:       string;
  shortContext?: string;
  rationales:    { BUY: string; SELL: string; NO_TRADE: string };
  lessons:       { beginner: string; intermediate: string; advanced: string };
  difficulties:  readonly Difficulty[];
  tags:          string[];
  notions:       readonly NotionId[];
  trap?:         string;
  conflict?:     string;
  build:         (rng: Rng, m: number, d: Difficulty) => Raw;
  claims:        Record<string, Claim>;
}

// ─── Aides ────────────────────────────────────────────────────────────────────

const AXIS = 10;
/** Variante de sens : même graphique, renversé */
const mirrored = (b: NewScenario["build"]): NewScenario["build"] => (rng, m, d) => {
  const r = b(rng, m, d);
  return { past: mirrorCandles(r.past, AXIS), future: mirrorCandles(r.future, AXIS), zones: mirrorZones(r.zones, AXIS) };
};
const one = (text: string) => ({ beginner: text, intermediate: text, advanced: text });
const last = <T,>(a: T[]) => a[a.length - 1];
const lo = (z: ChartZone) => Math.min(z.y1, z.y2);
const hi = (z: ChartZone) => Math.max(z.y1, z.y2);
const mr = (cs: Candle[]) => { const s = cs.map(range).sort((a, b) => a - b); return s[s.length >> 1] || 1; };
const zoneOf = (ch: ChartLike, kind: ChartZone["kind"]) => ch.zones.find((z) => z.kind === kind);
const band = (m: number) => ({ lo: -0.13 * m, hi: 0.13 * m });
const supportZone = (m: number, label = "Support"): ChartZone => ({ kind: "support", y1: -0.13 * m, y2: 0.13 * m, label });

// Affirmations communes (sens haussier ; `sell` lit le graphique renversé)
const flip = (k: Candle): Candle => ({ o: -k.o, c: -k.c, h: -k.l, l: -k.h });
const asBull = (ch: ChartLike, sell: boolean): ChartLike => sell
  ? { past: ch.past.map(flip), future: ch.future.map(flip), zones: mirrorZones(ch.zones, 0) }
  : ch;
const goesUp: Claim = (ch) => (last(ch.future).c > last(ch.past).c ? null : "la suite ne monte pas");
const goesDown: Claim = (ch) => (last(ch.future).c < last(ch.past).c ? null : "la suite ne baisse pas");
/** La pointe basse `l` est dans la zone (à un quart de bougie médiane près) */
const inZone = (l: number, z: ChartZone, t: number) => l >= lo(z) - t && l <= hi(z) + t;

// ─── Scènes Débutant (sens haussier) ─────────────────────────────────────────

/** Support prouvé (deux touches), puis le prix redescend vers lui */
export function supportScene(rng: Rng, m: number): { past: Candle[]; p: number } {
  const b = band(m);
  const t = provenSupport(rng, m, b.lo, b.hi);
  const a = legTo(rng, m, t.p, b.hi + (0.9 + rng() * 0.25) * m);
  return { past: [...t.candles, ...a.candles], p: a.p };
}

function patternOnSupport(kind: "marteau" | "engulfing" | "doji" | "doji_confirme" | "double_meche", outcome: "up" | "fade"): NewScenario["build"] {
  return (rng, m) => {
    const b = band(m);
    const s = supportScene(rng, m);
    const color = kind === "marteau" ? (rng() < 0.8 ? "rouge" : "verte") : kind === "double_meche" ? "rouge" : undefined;
    const sig = bullSignal(rng, m, s.p, b.lo, b.hi, kind, color);
    const past = [...s.past, ...sig.candles];
    const future = outcome === "up"
      ? rally(rng, m, sig.p, 5).candles
      : (() => { const c = chop(rng, m, sig.p, 2, -0.05); const d = drop(rng, m, c.p, 3); return [...c.candles, ...d.candles]; })();
    return { past, future, zones: [supportZone(m)] };
  };
}

/** Marteau à un plus bas tout neuf, après une longue baisse, sans aucun niveau autour */
export const hammerNowhere: NewScenario["build"] = (rng, m) => {
  const base = chop(rng, m, 0, 3, 0.02);
  const leg = legTo(rng, m, base.p, base.p - (3.8 + rng() * 0.8) * m, { retrace: 0.3 });
  const p = leg.p;
  const sig = bullSignal(rng, m, p, p - 0.62 * m, p - 0.5 * m, "marteau", rng() < 0.7 ? "rouge" : "verte");
  const past = [...base.candles, ...leg.candles, ...sig.candles];
  return { past, future: drop(rng, m, sig.p, 4).candles, zones: [] };
};

/** Le prix rebondit sur un support : bougie verte depuis la zone, puis une petite bougie rouge */
export function rebound(rng: Rng, m: number, p: number, b: { lo: number; hi: number }): { candles: Candle[]; p: number } {
  const out: Candle[] = [];
  const tip = b.lo + (b.hi - b.lo) * (0.3 + rng() * 0.4);
  const o1 = p, c1 = o1 - (0.25 + rng() * 0.1) * m;
  out.push({ o: o1, c: c1, h: o1 + (0.04 + rng() * 0.05) * m, l: Math.min(tip, c1 - 0.02 * m) });
  const c2 = Math.max(c1, b.hi) + (0.5 + rng() * 0.1) * m;
  out.push({ o: c1, c: c2, h: c2 + (0.04 + rng() * 0.06) * m, l: c1 - (0.02 + rng() * 0.03) * m });
  const c3 = c2 - (0.06 + rng() * 0.05) * m;
  out.push({ o: c2, c: c3, h: c2 + (0.03 + rng() * 0.04) * m, l: c3 - (0.03 + rng() * 0.04) * m });
  return { candles: out, p: c3 };
}

/** Rebond sur un support, résistance loin au-dessus (de la place) */
const roomFar: NewScenario["build"] = (rng, m) => {
  const b = band(m);
  const R = (5.4 + rng() * 0.8) * m;
  const r = provenResistance(rng, m, R - 0.13 * m, R + 0.13 * m, R - (2.5 + rng() * 0.4) * m);
  const s = provenSupport(rng, m, b.lo, b.hi, r.p);
  const a = legTo(rng, m, s.p, b.hi + (0.6 + rng() * 0.2) * m);
  const rb = rebound(rng, m, a.p, b);
  return {
    past: [...r.candles, ...s.candles, ...a.candles, ...rb.candles],
    future: rally(rng, m, rb.p, 5, R - 0.2 * m).candles,
    zones: [supportZone(m), { kind: "resistance", y1: R - 0.13 * m, y2: R + 0.13 * m, label: "Résistance" }],
  };
};

/** Le rebond a déjà eu lieu : le prix approche de la résistance, le stop logique reste sous le support */
const roomNear: NewScenario["build"] = (rng, m) => {
  const R = (3.4 + rng() * 0.3) * m;
  // départ près du support, 1re jambe vers le bas : chaque touche est suivie d'un retour
  const legs = rangeLegs(rng, 0.8 * m, 0, R, 5, 3, m, false, 0.25 * m, 0.1 * m);
  const up = legTo(rng, m, legs.p, (2.2 + rng() * 0.3) * m, { retrace: 0 });
  const f1 = rally(rng, m, up.p, 2, R - 0.15 * m);
  const f2 = drop(rng, m, f1.p, 3);
  return {
    past: [...legs.candles, ...up.candles],
    future: [...f1.candles, ...f2.candles],
    zones: [supportZone(m), { kind: "resistance", y1: R - 0.13 * m, y2: R + 0.13 * m, label: "Résistance" }],
  };
};
const reboundDone: Claim = (ch) => {
  const s = zoneOf(ch, "support"), r = zoneOf(ch, "resistance"); if (!s || !r) return "support et résistance attendus";
  const e = last(ch.past).c, t = mr(ch.past);
  if ((e - hi(s)) / (lo(r) - hi(s)) < 0.55) return "le prix n'a pas encore fait plus de la moitié du chemin vers la résistance";
  return Math.max(...ch.past.slice(-3).map((k) => k.h)) < lo(r) - 0.25 * t ? null : "le prix touche déjà la résistance";
};

/** Hausse verticale sans pause : 5 grandes bougies vertes */
const fomoRally: NewScenario["build"] = (rng, m) => {
  // base calme assez longue : la bougie médiane reste celle de la base, la hausse ressort
  const base = chop(rng, m, 0, 8, 0.01);
  const past = [...base.candles];
  let p = base.p;
  for (let i = 0; i < 5; i++) {
    const c = p + (0.85 + rng() * 0.45) * m;
    past.push(candle(p, c, (0.06 + rng() * 0.12) * m, (0.03 + rng() * 0.07) * m));
    p = c;
  }
  const d = drop(rng, m, p, 4);
  return { past, future: d.candles, zones: [] };
};

/** Hausse, puis bougie verte à très longue mèche haute */
const greenLongUpperWick: NewScenario["build"] = (rng, m) => {
  const base = chop(rng, m, 0, 3);
  const leg = legTo(rng, m, base.p, base.p + (2.8 + rng() * 0.6) * m, { retrace: 0.25 });
  const o = leg.p, c = o + (0.1 + rng() * 0.06) * m;
  const k: Candle = { o, c, h: c + (0.55 + rng() * 0.2) * m, l: o - (0.02 + rng() * 0.03) * m };
  const ch = chop(rng, m, c, 2, -0.04);
  const d = drop(rng, m, ch.p, 2);
  return { past: [...base.candles, ...leg.candles, k], future: [...ch.candles, ...d.candles], zones: [] };
};

// ─── Affirmations Débutant ───────────────────────────────────────────────────

const hammerOnSupport = (sell: boolean): Claim => (c) => {
  const ch = asBull(c, sell); const z = zoneOf(ch, "support"); const k = last(ch.past);
  if (!z) return "pas de support";
  if (!(sell ? isShootingStar(last(c.past)) : isHammer(k))) return sell ? "la dernière bougie n'est pas une étoile filante" : "la dernière bougie n'est pas un marteau";
  if (!inZone(k.l, z, 0.25 * mr(ch.past))) return "la mèche ne touche pas la zone";
  return Math.min(k.o, k.c) > hi(z) ? null : "le corps n'est pas au-dessus de la zone";
};
const engulfOnSupport = (sell: boolean): Claim => (c) => {
  const ch = asBull(c, sell); const z = zoneOf(ch, "support"); const [a, b] = c.past.slice(-2);
  if (!z) return "pas de support";
  if (!(sell ? isBearEngulfing(a, b) : isBullEngulfing(a, b))) return "les deux dernières bougies ne forment pas un engulfing";
  const l = Math.min(...ch.past.slice(-2).map((k) => k.l));
  return inZone(l, z, 0.25 * mr(ch.past)) ? null : "l'engulfing ne touche pas la zone";
};
const dojiConfirmed = (sell: boolean): Claim => (c) => {
  const ch = asBull(c, sell); const z = zoneOf(ch, "support"); const [d, k] = ch.past.slice(-2);
  if (!z) return "pas de support";
  if (!isDoji(d)) return "l'avant-dernière bougie n'est pas un doji";
  if (!inZone(d.l, z, 0.25 * mr(ch.past))) return "le doji ne touche pas la zone";
  return k.c > k.o && k.c > d.h ? null : "la bougie de confirmation ne clôture pas au-delà du doji";
};
const dojiAlone: Claim = (ch) => {
  const z = zoneOf(ch, "support"); const d = last(ch.past);
  if (!z) return "pas de support";
  if (!isDoji(d)) return "la dernière bougie n'est pas un doji";
  return inZone(d.l, z, 0.25 * mr(ch.past)) ? null : "le doji ne touche pas la zone";
};
const doubleWick = (sell: boolean): Claim => (c) => {
  const ch = asBull(c, sell); const z = zoneOf(ch, "support"); const ks = ch.past.slice(-2);
  if (!z) return "pas de support";
  for (const k of ks) {
    if (lowerWick(k) < 1.5 * body(k)) return "une des deux bougies n'a pas de longue mèche";
    if (!inZone(k.l, z, 0.25 * mr(ch.past))) return "une des deux mèches ne touche pas la zone";
    if (Math.min(k.o, k.c) <= hi(z)) return "un corps clôture dans la zone";
  }
  return null;
};
/** R/R d'un achat au dernier cours, stop sous le support, objectif sous la résistance */
const rrToResistance = (ch: ChartLike): number | null => {
  const s = zoneOf(ch, "support"), r = zoneOf(ch, "resistance"); if (!s || !r) return null;
  const e = last(ch.past).c, t = mr(ch.past);
  return (lo(r) - 0.1 * t - e) / (e - (lo(s) - 0.1 * t));
};
const roomOk = (sell: boolean): Claim => (c) => { const rr = rrToResistance(asBull(c, sell)); return rr !== null && rr >= 2.5 ? null : `R/R jusqu'au niveau opposé ${rr?.toFixed(2)} (au moins 2,5)`; };
const noRoom: Claim = (ch) => { const rr = rrToResistance(ch); return rr !== null && rr <= 1.5 ? null : `R/R jusqu'à la résistance ${rr?.toFixed(2)} (au plus 1,5)`; };
const nowhere = (sell: boolean): Claim => (c) => {
  const ch = asBull(c, sell); const k = last(ch.past);
  if (ch.zones.length) return "un niveau est tracé";
  if (!(sell ? isShootingStar(last(c.past)) : isHammer(k))) return "pas de marteau / d'étoile filante en dernière bougie";
  const prev = ch.past.slice(0, -1);
  return k.l < Math.min(...prev.map((x) => x.l)) ? null : "le marteau n'est pas sur un plus bas tout neuf";
};
const verticalRally: Claim = (ch) => {
  const ks = ch.past.slice(-5); const t = mr(ch.past);
  if (!ks.every((k) => k.c > k.o)) return "les 5 dernières bougies ne sont pas toutes vertes";
  return last(ks).c - ks[0].o >= 3 * t ? null : "la hausse n'est pas verticale (moins de 3 bougies médianes)";
};
const longUpperWickGreen: Claim = (ch) => {
  const k = last(ch.past);
  if (!(k.c > k.o)) return "la dernière bougie n'est pas verte";
  if (upperWick(k) < 3 * body(k)) return "la mèche haute n'est pas très longue";
  return k.c > ch.past[ch.past.length - 6].c ? null : "pas de hausse avant la bougie";
};
const noZone: Claim = (ch) => (ch.zones.length ? "un niveau est tracé" : null);

// ─── Textes communs ───────────────────────────────────────────────────────────

const L3 = "(leçon Débutant 3)";
const BASE: Pick<NewScenario, "macroContext" | "difficulties"> = { macroContext: "normal", difficulties: ["beginner"] };

// ─── Débutant ─────────────────────────────────────────────────────────────────

export const BSNT_BEGINNER: NewScenario[] = [
  {
    ...BASE, id: "deb_marteau_support", title: "Marteau sur un support", correctAnswer: "BUY", htfBias: "range", metric: "lecture",
    notions: ["marteau", "support_resistance", "bougie"],
    context: "Le prix redescend sur un support déjà touché deux fois. La dernière bougie est un marteau : petit corps en haut, longue mèche basse plantée dans la zone.",
    rationales: {
      BUY: "✓ Ici, le marteau apparaît sur un niveau clé : les vendeurs ont poussé le prix dans le support, puis les acheteurs l'ont ramené en haut de la bougie. Un BUY, avec un stop sous la mèche, est la lecture logique.",
      SELL: "✗ Vendre sur un support où les acheteurs viennent de repousser la baisse revient à aller contre le signal de la bougie. Peu importe sa couleur : la longue mèche basse dit l'inverse.",
      NO_TRADE: "≈ Attendre une bougie de plus se comprend. Mais ici, un marteau sur un support déjà défendu deux fois forme déjà un signal clair.",
    },
    lessons: one(`Un marteau compte quand il apparaît sur un niveau clé, comme ici sur un support. Sa couleur importe peu : c'est la longue mèche basse qui montre que les acheteurs ont défendu ${L3}.`),
    tags: ["marteau", "support"], build: patternOnSupport("marteau", "up"),
    claims: { "marteau posé sur le support": hammerOnSupport(false), "la suite monte": goesUp },
  },
  {
    ...BASE, id: "deb_etoile_resistance", title: "Étoile filante sous une résistance", correctAnswer: "SELL", htfBias: "range", metric: "lecture",
    notions: ["etoile_filante", "support_resistance", "bougie"],
    context: "Le prix remonte sur une résistance déjà touchée deux fois. La dernière bougie est une étoile filante : petit corps en bas, longue mèche haute plantée dans la zone.",
    rationales: {
      BUY: "✗ Acheter sous une résistance où les vendeurs viennent de repousser la hausse revient à aller contre le signal de la bougie. Peu importe sa couleur : la longue mèche haute dit l'inverse.",
      SELL: "✓ Ici, l'étoile filante apparaît sur un niveau clé : les acheteurs ont poussé le prix dans la résistance, puis les vendeurs l'ont ramené en bas de la bougie. Un SELL, avec un stop au-dessus de la mèche, est la lecture logique.",
      NO_TRADE: "≈ Attendre une bougie de plus se comprend. Mais ici, une étoile filante sous une résistance déjà défendue deux fois forme déjà un signal clair.",
    },
    lessons: one(`Une étoile filante compte quand elle apparaît sur un niveau clé, comme ici sous une résistance. Sa couleur importe peu : c'est la longue mèche haute qui montre que les vendeurs ont rejeté ${L3}.`),
    tags: ["étoile filante", "résistance"], build: mirrored(patternOnSupport("marteau", "up")),
    claims: { "étoile filante posée sous la résistance": hammerOnSupport(true), "la suite baisse": goesDown },
  },
  {
    ...BASE, id: "deb_engulfing_support", title: "Engulfing haussier sur un support", correctAnswer: "BUY", htfBias: "range", metric: "lecture",
    notions: ["engulfing", "support_resistance", "bougie"],
    context: "Le prix revient sur un support déjà touché deux fois. Une bougie rouge plonge dans la zone, puis une grande bougie verte avale tout son corps : un engulfing haussier.",
    rationales: {
      BUY: "✓ Ici, l'engulfing haussier se forme sur le support : la bougie verte efface toute la baisse de la rouge. Les acheteurs ont repris la main sur un niveau clé, un BUY avec un stop sous le support se défend.",
      SELL: "✗ La bougie rouge a plongé dans le support, mais la verte l'a entièrement effacée. Vendre maintenant revient à suivre une baisse déjà rejetée.",
      NO_TRADE: "≈ Rester prudent n'est pas faux, mais ici le pattern et le niveau vont dans le même sens : c'est le cas d'école de la leçon 3.",
    },
    lessons: one(`Un engulfing haussier montre que les acheteurs ont pris le contrôle de façon décisive. Sur un support, comme ici, il prend toute sa valeur ${L3}.`),
    tags: ["engulfing", "support"], build: patternOnSupport("engulfing", "up"),
    claims: { "engulfing haussier sur le support": engulfOnSupport(false), "la suite monte": goesUp },
  },
  {
    ...BASE, id: "deb_engulfing_resistance", title: "Engulfing baissier sous une résistance", correctAnswer: "SELL", htfBias: "range", metric: "lecture",
    notions: ["engulfing", "support_resistance", "bougie"],
    context: "Le prix remonte sur une résistance déjà touchée deux fois. Une bougie verte perce dans la zone, puis une grande bougie rouge avale tout son corps : un engulfing baissier.",
    rationales: {
      BUY: "✗ La bougie verte a percé dans la résistance, mais la rouge l'a entièrement effacée. Acheter maintenant revient à suivre une hausse déjà rejetée.",
      SELL: "✓ Ici, l'engulfing baissier se forme sous la résistance : la bougie rouge efface toute la hausse de la verte. Les vendeurs ont repris la main sur un niveau clé, un SELL avec un stop au-dessus de la résistance se défend.",
      NO_TRADE: "≈ Rester prudent n'est pas faux, mais ici le pattern et le niveau vont dans le même sens : c'est le cas d'école de la leçon 3.",
    },
    lessons: one(`Un engulfing baissier montre que les vendeurs ont pris le contrôle de façon décisive. Sous une résistance, comme ici, il prend toute sa valeur ${L3}.`),
    tags: ["engulfing", "résistance"], build: mirrored(patternOnSupport("engulfing", "up")),
    claims: { "engulfing baissier sous la résistance": engulfOnSupport(true), "la suite baisse": goesDown },
  },
  {
    ...BASE, id: "deb_doji_confirme_support", title: "Doji confirmé sur un support", correctAnswer: "BUY", htfBias: "range", metric: "lecture",
    notions: ["doji", "support_resistance", "bougie"],
    context: "Sur un support déjà touché deux fois, un doji marque l'hésitation. La bougie suivante, verte, clôture au-dessus du plus haut du doji.",
    rationales: {
      BUY: "✓ Le doji seul ne disait rien : ni les acheteurs ni les vendeurs ne gagnaient. La bougie verte qui clôture au-dessus de son plus haut tranche en faveur des acheteurs, sur un support. Un BUY se défend.",
      SELL: "✗ L'indécision du doji vient d'être tranchée à la hausse, sur un support. Vendre revient à ignorer la bougie qui confirme.",
      NO_TRADE: "≈ Sans la bougie verte, attendre aurait été la bonne décision. Ici, la confirmation est là.",
    },
    lessons: one(`Un doji, c'est l'indécision. Il ne devient un signal qu'avec la bougie suivante : ici, une clôture au-dessus de son plus haut, sur un support ${L3}.`),
    tags: ["doji", "support"], build: patternOnSupport("doji_confirme", "up"),
    claims: { "doji sur le support, puis clôture au-dessus de son plus haut": dojiConfirmed(false), "la suite monte": goesUp },
  },
  {
    ...BASE, id: "deb_doji_confirme_resistance", title: "Doji confirmé sous une résistance", correctAnswer: "SELL", htfBias: "range", metric: "lecture",
    notions: ["doji", "support_resistance", "bougie"],
    context: "Sous une résistance déjà touchée deux fois, un doji marque l'hésitation. La bougie suivante, rouge, clôture sous le plus bas du doji.",
    rationales: {
      BUY: "✗ L'indécision du doji vient d'être tranchée à la baisse, sous une résistance. Acheter revient à ignorer la bougie qui confirme.",
      SELL: "✓ Le doji seul ne disait rien : ni les acheteurs ni les vendeurs ne gagnaient. La bougie rouge qui clôture sous son plus bas tranche en faveur des vendeurs, sous une résistance. Un SELL se défend.",
      NO_TRADE: "≈ Sans la bougie rouge, attendre aurait été la bonne décision. Ici, la confirmation est là.",
    },
    lessons: one(`Un doji, c'est l'indécision. Il ne devient un signal qu'avec la bougie suivante : ici, une clôture sous son plus bas, sous une résistance ${L3}.`),
    tags: ["doji", "résistance"], build: mirrored(patternOnSupport("doji_confirme", "up")),
    claims: { "doji sous la résistance, puis clôture sous son plus bas": dojiConfirmed(true), "la suite baisse": goesDown },
  },
  {
    ...BASE, id: "deb_meches_basses_support", title: "Deux mèches basses sur un support", correctAnswer: "BUY", htfBias: "range", metric: "lecture",
    notions: ["meches", "support_resistance", "bougie"],
    context: "Le prix teste un support déjà touché deux fois. Les deux dernières bougies plongent chacune dans la zone avec une longue mèche basse, puis referment au-dessus. La dernière est rouge.",
    rationales: {
      BUY: "✓ Deux fois de suite, les vendeurs ont poussé le prix dans le support, et deux fois les acheteurs l'ont ramené au-dessus. La couleur rouge de la dernière bougie trompe : ce sont les mèches qui racontent le combat. Un BUY avec un stop sous les mèches se défend.",
      SELL: "✗ Vendre parce que la dernière bougie est rouge, c'est lire la couleur au lieu des mèches. Ici, chaque tentative de baisse a été repoussée.",
      NO_TRADE: "≈ La prudence se comprend, mais deux rejets de suite sur un support déjà défendu forment un signal lisible.",
    },
    lessons: one(`Une mèche basse, c'est une tentative de baisse repoussée par les acheteurs. Une bougie rouge ne veut pas dire « vendre maintenant » : ici, deux mèches de suite défendent le support ${L3}.`),
    tags: ["mèches", "support"], build: patternOnSupport("double_meche", "up"),
    claims: { "deux longues mèches basses dans le support": doubleWick(false), "la suite monte": goesUp },
  },
  {
    ...BASE, id: "deb_meches_hautes_resistance", title: "Deux mèches hautes sous une résistance", correctAnswer: "SELL", htfBias: "range", metric: "lecture",
    notions: ["meches", "support_resistance", "bougie"],
    context: "Le prix teste une résistance déjà touchée deux fois. Les deux dernières bougies percent chacune dans la zone avec une longue mèche haute, puis referment en dessous. La dernière est verte.",
    rationales: {
      BUY: "✗ Acheter parce que la dernière bougie est verte, c'est lire la couleur au lieu des mèches. Ici, chaque tentative de hausse a été repoussée.",
      SELL: "✓ Deux fois de suite, les acheteurs ont poussé le prix dans la résistance, et deux fois les vendeurs l'ont ramené en dessous. La couleur verte de la dernière bougie trompe : ce sont les mèches qui racontent le combat. Un SELL avec un stop au-dessus des mèches se défend.",
      NO_TRADE: "≈ La prudence se comprend, mais deux rejets de suite sous une résistance déjà défendue forment un signal lisible.",
    },
    lessons: one(`Une mèche haute, c'est une tentative de hausse repoussée par les vendeurs. Une bougie verte ne veut pas dire « acheter maintenant » : ici, deux mèches de suite défendent la résistance ${L3}.`),
    tags: ["mèches", "résistance"], build: mirrored(patternOnSupport("double_meche", "up")),
    claims: { "deux longues mèches hautes dans la résistance": doubleWick(true), "la suite baisse": goesDown },
  },
  {
    ...BASE, id: "deb_place_jusqu_resistance", title: "De la place jusqu'à la résistance", correctAnswer: "BUY", htfBias: "range", metric: "lecture",
    notions: ["take_profit", "support_resistance"],
    context: "Le prix vient de rebondir sur un support déjà touché deux fois. Tu veux acheter ce rebond. La prochaine résistance est loin au-dessus : il y a de la place pour un take profit.",
    rationales: {
      BUY: "✓ Le take profit se place avant la prochaine résistance. Ici, elle est loin : le gain visé vaut plusieurs fois le risque jusqu'au stop sous le support. Un BUY se défend.",
      SELL: "✗ Vendre juste au-dessus d'un support qui vient de faire rebondir le prix, c'est viser une baisse que le niveau a déjà refusée.",
      NO_TRADE: "✗ Ici, le plan est complet : un support pour le stop, une résistance lointaine pour le take profit. S'abstenir laisse passer un trade bien construit.",
    },
    lessons: one("Place le take profit juste avant la prochaine résistance. Quand elle est loin, comme ici, le gain possible dépasse largement le risque (leçon Débutant 6)."),
    tags: ["take profit", "R/R"], build: roomFar,
    claims: { "R/R jusqu'à la résistance d'au moins 2,5": roomOk(false), "la suite monte": goesUp },
  },
  {
    ...BASE, id: "deb_place_jusqu_support", title: "De la place jusqu'au support", correctAnswer: "SELL", htfBias: "range", metric: "lecture",
    notions: ["take_profit", "support_resistance"],
    context: "Le prix vient de rejeter une résistance déjà touchée deux fois. Tu veux vendre ce rejet. Le prochain support est loin en dessous : il y a de la place pour un take profit.",
    rationales: {
      BUY: "✗ Acheter juste sous une résistance qui vient de repousser le prix, c'est viser une hausse que le niveau a déjà refusée.",
      SELL: "✓ Le take profit se place avant le prochain support. Ici, il est loin : le gain visé vaut plusieurs fois le risque jusqu'au stop au-dessus de la résistance. Un SELL se défend.",
      NO_TRADE: "✗ Ici, le plan est complet : une résistance pour le stop, un support lointain pour le take profit. S'abstenir laisse passer un trade bien construit.",
    },
    lessons: one("En vente, place le take profit juste avant le prochain support. Quand il est loin, comme ici, le gain possible dépasse largement le risque (leçon Débutant 6)."),
    tags: ["take profit", "R/R"], build: mirrored(roomFar),
    claims: { "R/R jusqu'au support d'au moins 2,5": roomOk(true), "la suite baisse": goesDown },
  },
  {
    ...BASE, id: "deb_pas_de_place", title: "Le rebond est déjà fait", correctAnswer: "NO_TRADE", htfBias: "range", metric: "discipline",
    notions: ["take_profit", "support_resistance"],
    context: "Le prix a déjà rebondi nettement sur un support touché deux fois et approche d'une résistance, elle aussi touchée deux fois. Tu veux acheter maintenant, avec un stop sous le support.",
    rationales: {
      BUY: "✗ Le rebond est réel, mais il est déjà fait. Le take profit doit se placer avant la résistance, tout près, alors que le stop logique reste sous le support, loin : le risque dépasse le gain visé.",
      SELL: "✗ Vendre avant que le prix touche la résistance, sans aucun rejet, c'est anticiper un signal qui n'existe pas encore.",
      NO_TRADE: "✓ Ici, l'entrée arrive trop tard : entre le stop sous le support et le take profit sous la résistance, le gain possible ne compense pas le risque. Passer son tour est la décision logique.",
    },
    lessons: one("Avant d'entrer, compare la distance jusqu'au take profit (avant la prochaine résistance) et la distance jusqu'au stop. Quand le rebond est déjà fait, le gain restant ne vaut souvent plus le risque (leçon Débutant 6)."),
    tags: ["take profit", "R/R"], build: roomNear,
    claims: { "rebond déjà fait, résistance pas encore touchée": reboundDone, "R/R jusqu'à la résistance d'au plus 1,5": noRoom },
  },
  {
    ...BASE, id: "deb_marteau_nulle_part", title: "Marteau au milieu de nulle part", correctAnswer: "NO_TRADE", htfBias: "range", metric: "piege",
    notions: ["pattern_sans_niveau", "bougie"],
    context: "Après une longue baisse, la dernière bougie est un marteau. Aucun support n'est visible à ce prix : le marteau apparaît sur un plus bas tout neuf.",
    rationales: {
      BUY: "✗ Acheter uniquement parce que la bougie ressemble à un marteau, sans niveau clé, est l'erreur décrite en leçon 3. Ici, rien n'indique que les acheteurs vont tenir.",
      SELL: "≈ La baisse peut continuer, mais vendre juste après une mèche de rejet, très loin du départ, revient à vendre tard.",
      NO_TRADE: "✓ Un marteau au milieu de nulle part ne signifie pas grand-chose. Sans niveau pour l'appuyer, attendre est la décision logique.",
    },
    lessons: one(`Un pattern ne vaut que là où il apparaît. Sans support, sans niveau clé, un marteau isolé n'est pas un signal d'achat ${L3}.`),
    tags: ["marteau", "piège"], build: hammerNowhere,
    claims: { "marteau sur un plus bas tout neuf, sans niveau": nowhere(false) },
  },
  {
    ...BASE, id: "deb_etoile_nulle_part", title: "Étoile filante au milieu de nulle part", correctAnswer: "NO_TRADE", htfBias: "range", metric: "piege",
    notions: ["pattern_sans_niveau", "bougie"],
    context: "Après une longue hausse, la dernière bougie est une étoile filante. Aucune résistance n'est visible à ce prix : l'étoile filante apparaît sur un plus haut tout neuf.",
    rationales: {
      BUY: "≈ La hausse peut continuer, mais acheter juste après une mèche de rejet, très loin du départ, revient à acheter tard.",
      SELL: "✗ Vendre uniquement parce que la bougie ressemble à une étoile filante, sans niveau clé, est l'erreur décrite en leçon 3. Ici, rien n'indique que les vendeurs vont tenir.",
      NO_TRADE: "✓ Une étoile filante au milieu de nulle part ne signifie pas grand-chose. Sans niveau pour l'appuyer, attendre est la décision logique.",
    },
    lessons: one(`Un pattern ne vaut que là où il apparaît. Sans résistance, sans niveau clé, une étoile filante isolée n'est pas un signal de vente ${L3}.`),
    tags: ["étoile filante", "piège"], build: mirrored(hammerNowhere),
    claims: { "étoile filante sur un plus haut tout neuf, sans niveau": nowhere(true) },
  },
  {
    ...BASE, id: "deb_doji_seul_support", title: "Doji seul sur un support", correctAnswer: "NO_TRADE", htfBias: "range", metric: "discipline",
    notions: ["doji", "support_resistance", "bougie"],
    context: "Le prix touche un support déjà défendu deux fois, mais la dernière bougie est un doji : corps quasi nul, mèches des deux côtés.",
    rationales: {
      BUY: "≈ Le support plaide pour l'achat, mais le doji ne confirme rien : il montre seulement l'hésitation. Acheter maintenant, c'est entrer trop tôt.",
      SELL: "✗ Vendre sur un support déjà défendu, sur une simple bougie d'hésitation, n'a pas d'argument.",
      NO_TRADE: "✓ Le doji dit l'indécision totale : ni les acheteurs ni les vendeurs ne gagnent. Attendre la bougie suivante pour voir qui tranche est la décision logique.",
    },
    lessons: one(`Un doji n'est pas un signal à lui seul : c'est la bougie suivante qui dit qui l'emporte ${L3}.`),
    tags: ["doji", "support"], build: patternOnSupport("doji", "fade"),
    claims: { "doji posé sur le support": dojiAlone },
  },
  {
    ...BASE, id: "deb_fomo_hausse", title: "Hausse verticale", correctAnswer: "NO_TRADE", htfBias: "range", metric: "discipline",
    notions: ["fomo", "bougie"],
    context: "Le prix vient de monter très vite : cinq grandes bougies vertes d'affilée, sans pause. Tu as envie d'acheter avant de rater la suite.",
    rationales: {
      BUY: "✗ C'est le FOMO décrit en leçon 9 : acheter en urgence après une forte hausse, souvent au sommet, juste avant que le prix respire. Ici, aucun niveau ne permet de placer un stop raisonnable.",
      SELL: "✗ Vendre contre cinq bougies vertes, sans niveau ni signal de rejet, revient à parier sur un retournement que rien ne montre encore.",
      NO_TRADE: "✓ Le mouvement est déjà fait. Sans niveau d'entrée ni stop logique, ne pas courir après le prix est la décision la plus saine.",
    },
    lessons: one("Le FOMO pousse à acheter en urgence, après la hausse. Le bon trade se prépare avant le mouvement, pas pendant (leçon Débutant 9)."),
    tags: ["FOMO", "discipline"], build: fomoRally,
    claims: { "cinq bougies vertes, hausse verticale": verticalRally, "aucun niveau tracé": noZone },
  },
  {
    ...BASE, id: "deb_verte_meche_haute", title: "Bougie verte, longue mèche haute", correctAnswer: "NO_TRADE", htfBias: "range", metric: "piege",
    notions: ["meches", "bougie"],
    context: "Après une hausse, la dernière bougie est verte, mais sa mèche haute est très longue : le prix est monté nettement, puis a été repoussé presque jusqu'à son ouverture.",
    rationales: {
      BUY: "✗ La bougie est verte, mais sa longue mèche haute montre que les vendeurs ont repoussé la hausse. Ce n'est pas un signal haussier fort.",
      SELL: "≈ La mèche montre un rejet, mais sans résistance pour l'appuyer, vendre sur une seule bougie reste un pari.",
      NO_TRADE: "✓ La couleur dit « acheteurs », la mèche dit « vendeurs ». Quand une bougie se contredit et qu'aucun niveau n'aide à trancher, attendre est la décision logique.",
    },
    lessons: one(`Ne lis pas seulement la couleur : une bougie verte avec une très longue mèche haute n'est pas forcément un signal haussier fort ${L3}.`),
    tags: ["mèches", "piège"], build: greenLongUpperWick,
    claims: { "bougie verte à très longue mèche haute, après une hausse": longUpperWickGreen, "aucun niveau tracé": noZone },
  },
];

// ─── Scènes Intermédiaire et Avancé (sens haussier) ─────────────────────────

/** Range prouvé (bornes touchées au moins deux fois), fin au bas du range */
export function rangeScene(rng: Rng, m: number, R: number, legs: number): { past: Candle[]; p: number } {
  const r = rangeLegs(rng, R * (0.45 + rng() * 0.1), 0, R, legs, 3, m, true, 0.3 * m, 0.1 * m);
  return { past: r.candles, p: r.p };
}
const rangeZones = (m: number, R: number, low = "Bas du range", trigger = false): ChartZone[] => [
  { kind: "support", y1: -0.13 * m, y2: 0.13 * m, label: low, ...(trigger ? { trigger: true as const } : {}) },
  { kind: "resistance", y1: R - 0.13 * m, y2: R + 0.13 * m, label: "Haut du range" },
];

/** Bas du range, puis marteau (corps rouge le plus souvent : la couleur ne fait pas le signal) */
const rangeLowHammer: NewScenario["build"] = (rng, m) => {
  const R = (4.6 + rng() * 0.6) * m, b = band(m);
  const s = rangeScene(rng, m, R, 4);
  const sig = bullSignal(rng, m, s.p, b.lo, b.hi, "marteau", rng() < 0.8 ? "rouge" : "verte");
  return { past: [...s.past, ...sig.candles], future: rally(rng, m, sig.p, 5, R - 0.4 * m).candles, zones: rangeZones(m, R) };
};

/** Faux breakout sous le bas du range : clôture dessous, puis la bougie suivante réintègre le range */
const rangeLowFakeout: NewScenario["build"] = (rng, m) => {
  const R = (4.6 + rng() * 0.6) * m, b = band(m);
  const s = rangeScene(rng, m, R, 6);
  let p = s.p;
  const past = [...s.past];
  const cA = b.lo - (0.5 + rng() * 0.15) * m;
  past.push({ o: p, c: cA, h: p + (0.04 + rng() * 0.05) * m, l: cA - (0.1 + rng() * 0.1) * m });
  p = cA;
  const cB = b.hi + (0.3 + rng() * 0.12) * m;
  past.push({ o: p, c: cB, h: cB + (0.04 + rng() * 0.06) * m, l: p - (0.03 + rng() * 0.04) * m });
  return { past, future: rally(rng, m, cB, 5, R - 0.4 * m).candles, zones: rangeZones(m, R, "Bas du range", true) };
};

/** Pullback dont la dernière bougie clôture sous l'ancienne résistance devenue support */
// (construit sur trendRetest, dans buy-sell-no-trade.ts)

/** Plus bas précédent balayé, mais la bougie clôture dessous : continuation (sens haussier : plus haut cassé) */
const sweepContinuation: NewScenario["build"] = (rng, m) => {
  // sens haussier lu à l'envers : construit en baisse directement, puis renversé pour l'achat ;
  // ici le scénario est une VENTE, construit en sens baissier : on le bâtit haussier et on le renverse
  const H = 0;
  const base = legTo(rng, m, H - (2.2 + rng() * 0.4) * m, H - 0.9 * m, { retrace: 0.3 });
  const past = [...base.candles];
  // le plus haut précédent : une pointe à H, puis repli
  let p = base.p;
  past.push(candle(p, H - 0.35 * m, (0.35 - 0.0) * m, (0.06 + rng() * 0.06) * m));
  past[past.length - 1].h = H;
  p = H - 0.35 * m;
  const back = legTo(rng, m, p, H - (1.4 + rng() * 0.3) * m, { retrace: 0 });
  past.push(...back.candles); p = back.p;
  const up = legTo(rng, m, p, H - 0.45 * m, { retrace: 0.3 });
  past.push(...up.candles); p = up.p;
  // cassure : la bougie dépasse le plus haut et CLÔTURE au-dessus (pas de réintégration)
  const c1 = H + (0.3 + rng() * 0.15) * m;
  past.push({ o: p, c: c1, h: c1 + (0.08 + rng() * 0.08) * m, l: p - (0.04 + rng() * 0.04) * m });
  p = c1;
  const c2 = p + (0.3 + rng() * 0.15) * m;
  past.push({ o: p, c: c2, h: c2 + (0.05 + rng() * 0.06) * m, l: p - (0.08 + rng() * 0.05) * m });
  return {
    past, future: rally(rng, m, c2, 5).candles,
    zones: [{ kind: "resistance", y1: H - 0.13 * m, y2: H + 0.13 * m, label: "Plus haut précédent" }],
  };
};

/** Equal lows au bas d'un range, balayés par une mèche, clôture revenue au-dessus */
const equalLowsSweep: NewScenario["build"] = (rng, m) => {
  const R = (4.4 + rng() * 0.5) * m, b = band(m);
  const s = rangeScene(rng, m, R, 4);
  let p = s.p;
  const past = [...s.past];
  // petit rebond : la dernière touche forme un vrai creux (le second des equal lows), puis le sweep
  const up1 = candle(p, p + (0.3 + rng() * 0.1) * m, (0.05 + rng() * 0.05) * m, (0.03 + rng() * 0.03) * m);
  past.push(up1); p = up1.c;
  const o = p, c = b.hi + (0.4 + rng() * 0.15) * m;
  past.push({ o, c, h: Math.max(o, c) + (0.05 + rng() * 0.05) * m, l: b.lo - (1.3 + rng() * 0.25) * m });
  p = c;
  return {
    past, future: rally(rng, m, p, 5, R - 0.4 * m).candles,
    zones: [...rangeZones(m, R, "Equal lows", true), { kind: "liquidity_low", y1: b.lo - 0.8 * m, y2: b.lo - 0.05 * m, label: "Liquidité balayée" }],
  };
};

/** Range : sweep profond du bas, clôture revenue dedans, mais le haut du range est proche (R/R insuffisant) */
const sweepNoRoom: NewScenario["build"] = (rng, m) => {
  const R = (2.4 + rng() * 0.2) * m, b = band(m);
  const s = rangeScene(rng, m, R, 6);
  let p = s.p;
  const past = [...s.past];
  const o = p, c = b.hi + (0.2 + rng() * 0.1) * m;
  past.push({ o, c, h: Math.max(o, c) + (0.04 + rng() * 0.04) * m, l: b.lo - (1.7 + rng() * 0.3) * m });
  p = c;
  const f1 = rally(rng, m, p, 2, R - 0.2 * m), f2 = drop(rng, m, f1.p, 3);
  return { past, future: [...f1.candles, ...f2.candles], zones: rangeZones(m, R, "Bas du range", true) };
};

/** Impulsion haussière depuis un Order Block (dernière bougie rouge, nette, avant une grande bougie d'impulsion), puis retour */
export function obScene(rng: Rng, m: number): { past: Candle[]; p: number; ob: { lo: number; hi: number }; zone: ChartZone } {
  const d = legTo(rng, m, 2.2 * m, 0.9 * m, { retrace: 0.3 });
  const past = [...d.candles];
  let p = d.p;
  const oO = p, oC = p - (0.65 + rng() * 0.15) * m;
  const obk = candle(oO, oC, (0.1 + rng() * 0.08) * m, (0.12 + rng() * 0.1) * m);
  past.push(obk);
  p = oC;
  const top = p + (2.7 + rng() * 0.4) * m;
  past.push(candle(p, top, (0.15 + rng() * 0.1) * m, (0.1 + rng() * 0.06) * m));
  p = top;
  const more = rally(rng, m, p, 2);
  past.push(...more.candles); p = more.p;
  const back = legTo(rng, m, p, obk.h + (0.6 + rng() * 0.15) * m, { retrace: 0.3 });
  past.push(...back.candles); p = back.p;
  return { past, p, ob: { lo: oC, hi: oO }, zone: { kind: "support", y1: obk.l, y2: obk.h, label: "Order Block" } };
}
export function bullImpulse3Local(rng: Rng, m: number, p: number): { candles: Candle[]; p: number } {
  const a = candle(p, p + (0.55 + rng() * 0.2) * m, 0.06 * m, (0.05 + rng() * 0.04) * m);
  const b = candle(a.c, a.c + (0.7 + rng() * 0.2) * m, 0.05 * m, 0.04 * m);
  const c = candle(b.c, b.c + (0.5 + rng() * 0.2) * m, (0.08 + rng() * 0.06) * m, 0.05 * m);
  return { candles: [a, b, c], p: c.c };
}

/** Retour dans l'Order Block : marteau dont la mèche entre dans l'OB */
const obHolds: NewScenario["build"] = (rng, m) => {
  const s = obScene(rng, m);
  const sig = bullSignal(rng, m, s.p, s.ob.lo, s.zone.y2, "marteau");
  return { past: [...s.past, ...sig.candles], future: rally(rng, m, sig.p, 5).candles, zones: [s.zone] };
};
/** Retour dans l'Order Block : grande bougie rouge qui clôture sous l'OB (sens haussier : OB baissier lâché à la hausse) */
const obFails: NewScenario["build"] = (rng, m) => {
  const s = obScene(rng, m);
  const past = [...s.past];
  let p = s.p;
  const c = s.zone.y1 - (0.3 + rng() * 0.15) * m;
  past.push({ o: p, c, h: p + (0.04 + rng() * 0.04) * m, l: c - (0.05 + rng() * 0.06) * m });
  p = c;
  return { past, future: drop(rng, m, p, 5).candles, zones: [s.zone] };
};

/** FVG haussier, puis le prix revient et clôture sous le FVG */
const fvgBroken: NewScenario["build"] = (rng, m) => {
  const d = legTo(rng, m, 1.6 * m, 0, { retrace: 0.3 });
  const past = [...d.candles];
  let p = d.p;
  const imp = bullImpulse3Local(rng, m, p);
  past.push(...imp.candles); p = imp.p;
  const [a, , c3] = imp.candles;
  const fvg = { lo: a.h, hi: c3.l };
  const more = rally(rng, m, p, 2);
  past.push(...more.candles); p = more.p;
  const back = legTo(rng, m, p, fvg.hi + (0.35 + rng() * 0.15) * m, { retrace: 0.3 });
  past.push(...back.candles); p = back.p;
  const cc = fvg.lo - (0.25 + rng() * 0.12) * m;
  past.push({ o: p, c: cc, h: p + (0.04 + rng() * 0.04) * m, l: cc - (0.05 + rng() * 0.05) * m });
  p = cc;
  return { past, future: drop(rng, m, p, 4).candles, zones: [{ kind: "fvg", y1: fvg.lo, y2: fvg.hi, label: "FVG haussier" }] };
};

// ─── Affirmations Intermédiaire et Avancé ───────────────────────────────────

const atRangeBottom = (sell: boolean): Claim => (c) => {
  const ch = asBull(c, sell); const s = zoneOf(ch, "support"), r = zoneOf(ch, "resistance");
  if (!s || !r) return "range attendu (deux bornes)";
  const e = last(ch.past).c;
  return (e - hi(s)) / (lo(r) - hi(s)) <= 0.33 ? null : "la dernière clôture n'est pas dans le tiers bas du range";
};
const fakeoutBack = (sell: boolean): Claim => (c) => {
  const ch = asBull(c, sell); const s = zoneOf(ch, "support"); const [a, b] = ch.past.slice(-2);
  if (!s) return "pas de borne basse";
  if (!(a.c < lo(s))) return "l'avant-dernière bougie ne clôture pas sous la borne";
  return b.c > hi(s) ? null : "la dernière bougie ne réintègre pas le range";
};
const closesBeyond = (sell: boolean): Claim => (c) => {
  // vente : le plus bas précédent (renversé : plus haut) est franchi ET les deux dernières clôtures restent au-delà
  const ch = asBull(c, sell); const z = zoneOf(ch, "resistance"); const [a, b] = ch.past.slice(-2);
  if (!z) return "pas de plus haut précédent";
  if (!(a.h > hi(z) && a.c > hi(z))) return "la bougie de franchissement ne clôture pas au-delà du niveau";
  return b.c > a.c ? null : "la bougie suivante ne poursuit pas";
};
const wickSweepBack = (sell: boolean): Claim => (c) => {
  const ch = asBull(c, sell); const s = zoneOf(ch, "support"); const k = last(ch.past);
  if (!s) return "pas d'equal lows / highs";
  // (la bande des equal lows couvre déjà la liquidité juste dessous : la mèche va au-delà)
  if (!(k.l < lo(s) - 0.1 * mr(ch.past))) return "la mèche ne balaie pas au-delà des equal lows / highs";
  return k.c > hi(s) ? null : "la clôture ne revient pas au-dessus";
};
const rrRangeBelow = (max: number): Claim => (ch) => {
  const s = zoneOf(ch, "support"), r = zoneOf(ch, "resistance"); if (!s || !r) return "range attendu";
  const k = last(ch.past), e = k.c, t = mr(ch.past);
  const rr = (lo(r) - 0.1 * t - e) / (e - (k.l - 0.1 * t));
  return rr <= max ? null : `R/R ${rr.toFixed(2)} avec le stop sous la mèche (au plus ${max})`;
};
const obReturn = (holds: boolean): Claim => (ch) => {
  const z = ch.zones.find((x) => x.label === "Order Block"); const k = last(ch.past);
  if (!z) return "pas d'Order Block";
  if (holds) return isHammer(k) && inZone(k.l, z, 0.25 * mr(ch.past)) && Math.min(k.o, k.c) > hi(z) ? null : "pas de marteau dont la mèche entre dans l'OB";
  return k.c < lo(z) - 0.1 * mr(ch.past) && body(k) >= 0.5 * range(k) ? null : "pas de clôture franche sous l'OB";
};
const fvgClosedBelow: Claim = (ch) => {
  const z = zoneOf(ch, "fvg"); const k = last(ch.past);
  if (!z) return "pas de FVG";
  return k.c < lo(z) ? null : "la dernière bougie ne clôture pas sous le FVG";
};

// ─── Intermédiaire ────────────────────────────────────────────────────────────

const INT: Pick<NewScenario, "macroContext" | "difficulties"> = { macroContext: "normal", difficulties: ["intermediate"] };
const ADV: Pick<NewScenario, "macroContext" | "difficulties"> = { macroContext: "normal", difficulties: ["advanced"] };

export const BSNT_INTERMEDIATE: NewScenario[] = [
  {
    ...INT, id: "int_range_bas_marteau", title: "Marteau au bas du range", correctAnswer: "BUY", htfBias: "range", metric: "lecture",
    notions: ["range", "marteau", "support_resistance"],
    trap: "La dernière bougie est souvent rouge et plonge dans le bas du range : on croit à un breakout baissier, alors que sa longue mèche basse montre le rejet.",
    context: "L'UT supérieure est en range. Le prix revient au bas du range, touché deux fois déjà. La dernière bougie est un marteau : petit corps en haut, longue mèche basse plantée dans la zone.",
    shortContext: "Marteau au bas du range.",
    rationales: {
      BUY: "✓ Le bas du range a déjà tenu deux fois, et le marteau montre que les acheteurs ont repoussé la baisse sur cette borne. Un BUY, stop sous la mèche, objectif vers le haut du range, se défend.",
      SELL: "✗ La bougie a plongé dans la zone, mais elle referme en haut de son amplitude : la baisse a été rejetée. Vendre au bas d'un range, sur un rejet, revient à vendre au pire endroit.",
      NO_TRADE: "≈ La prudence se comprend dans un range, mais ici la borne et le signal de bougie vont dans le même sens : c'est l'endroit où le range se joue.",
    },
    lessons: one("Dans un range, on achète près du bas et on vend près du haut, pas au milieu. Un signal de bougie sur la borne, comme ce marteau, donne le déclencheur ; sa couleur importe peu (leçons Intermédiaire 1 et Débutant 3)."),
    tags: ["range", "marteau"], build: rangeLowHammer,
    claims: { "marteau sur le bas du range": hammerOnSupport(false), "prix dans le tiers bas du range": atRangeBottom(false), "la suite monte": goesUp },
  },
  {
    ...INT, id: "int_range_haut_etoile", title: "Étoile filante au haut du range", correctAnswer: "SELL", htfBias: "range", metric: "lecture",
    notions: ["range", "etoile_filante", "support_resistance"],
    trap: "La dernière bougie est souvent verte et perce dans le haut du range : on croit à un breakout haussier, alors que sa longue mèche haute montre le rejet.",
    context: "L'UT supérieure est en range. Le prix revient au haut du range, touché deux fois déjà. La dernière bougie est une étoile filante : petit corps en bas, longue mèche haute plantée dans la zone.",
    shortContext: "Étoile filante au haut du range.",
    rationales: {
      BUY: "✗ La bougie a percé dans la zone, mais elle referme en bas de son amplitude : la hausse a été rejetée. Acheter au haut d'un range, sur un rejet, revient à acheter au pire endroit.",
      SELL: "✓ Le haut du range a déjà tenu deux fois, et l'étoile filante montre que les vendeurs ont repoussé la hausse sur cette borne. Un SELL, stop au-dessus de la mèche, objectif vers le bas du range, se défend.",
      NO_TRADE: "≈ La prudence se comprend dans un range, mais ici la borne et le signal de bougie vont dans le même sens : c'est l'endroit où le range se joue.",
    },
    lessons: one("Dans un range, on vend près du haut et on achète près du bas, pas au milieu. Un signal de bougie sur la borne, comme cette étoile filante, donne le déclencheur ; sa couleur importe peu (leçons Intermédiaire 1 et Débutant 3)."),
    tags: ["range", "étoile filante"], build: mirrored(rangeLowHammer),
    claims: { "étoile filante sous le haut du range": hammerOnSupport(true), "prix dans le tiers haut du range": atRangeBottom(true), "la suite baisse": goesDown },
  },
  {
    ...INT, id: "int_faux_breakout_bas_range", title: "Faux breakout sous le range", correctAnswer: "BUY", htfBias: "range", metric: "piege",
    notions: ["faux_breakout", "range", "support_resistance"],
    trap: "La clôture sous le bas du range ressemble à un breakout baissier : la bougie suivante la reprend.",
    context: "L'UT supérieure est en range. Une bougie vient de clôturer sous le bas du range, puis la suivante a réintégré le range en clôturant au-dessus de la borne.",
    shortContext: "Clôture sous le range, puis réintégration.",
    rationales: {
      BUY: "✓ La sortie sous le bas du range n'a duré qu'une bougie : la clôture revenue au-dessus de la borne piège les vendeurs du breakout. Un BUY, stop sous la mèche du faux breakout, objectif vers le haut du range, se défend.",
      SELL: "✗ Vendre le breakout maintenant, c'est le vendre après la réintégration : les vendeurs qui y croyaient sont déjà piégés.",
      NO_TRADE: "≈ Attendre une bougie de plus se comprend, mais la réintégration nette du range est déjà le signal décrit en leçon 6.",
    },
    lessons: one("Un breakout se confirme par une clôture au-delà du niveau qui tient. Une clôture qui revient dans le range dès la bougie suivante signe souvent un faux breakout (leçon Intermédiaire 6)."),
    tags: ["faux breakout", "range"], build: rangeLowFakeout,
    claims: { "clôture sous la borne, puis réintégration": fakeoutBack(false), "la suite monte": goesUp },
  },
  {
    ...INT, id: "int_faux_breakout_haut_range", title: "Faux breakout au-dessus du range", correctAnswer: "SELL", htfBias: "range", metric: "piege",
    notions: ["faux_breakout", "range", "support_resistance"],
    trap: "La clôture au-dessus du haut du range ressemble à un breakout haussier : la bougie suivante la reprend.",
    context: "L'UT supérieure est en range. Une bougie vient de clôturer au-dessus du haut du range, puis la suivante a réintégré le range en clôturant sous la borne.",
    shortContext: "Clôture au-dessus du range, puis réintégration.",
    rationales: {
      BUY: "✗ Acheter le breakout maintenant, c'est l'acheter après la réintégration : les acheteurs qui y croyaient sont déjà piégés.",
      SELL: "✓ La sortie au-dessus du haut du range n'a duré qu'une bougie : la clôture revenue sous la borne piège les acheteurs du breakout. Un SELL, stop au-dessus de la mèche du faux breakout, objectif vers le bas du range, se défend.",
      NO_TRADE: "≈ Attendre une bougie de plus se comprend, mais la réintégration nette du range est déjà le signal décrit en leçon 6.",
    },
    lessons: one("Un breakout se confirme par une clôture au-delà du niveau qui tient. Une clôture qui revient dans le range dès la bougie suivante signe souvent un faux breakout (leçon Intermédiaire 6)."),
    tags: ["faux breakout", "range"], build: mirrored(rangeLowFakeout),
    claims: { "clôture au-dessus de la borne, puis réintégration": fakeoutBack(true), "la suite baisse": goesDown },
  },
];

// ─── Avancé ───────────────────────────────────────────────────────────────────

export const BSNT_ADVANCED: NewScenario[] = [
  {
    ...ADV, id: "adv_sweep_continuation", title: "Plus bas balayé… et cassé", correctAnswer: "SELL", htfBias: "range", metric: "piege",
    notions: ["sweep", "liquidite", "breakout"],
    conflict: "Mèche contre clôture : passer sous le plus bas précédent ressemble à un sweep haussier, mais la bougie clôture dessous et la suivante poursuit : c'est une continuation.",
    context: "Le prix passe sous le plus bas précédent. Cette fois, la bougie clôture nettement dessous, et la suivante poursuit la baisse.",
    shortContext: "Plus bas précédent franchi en clôture.",
    rationales: {
      BUY: "✗ Ce n'est pas un sweep : un sweep se lit à la mèche qui revient au-dessus du niveau. Ici, deux clôtures restent dessous. Acheter revient à attendre un retournement que le graphique ne montre pas.",
      SELL: "✓ La liquidité sous le plus bas a été prise, mais le prix n'est pas revenu : les clôtures sous le niveau en font une continuation. Un SELL, stop au-dessus du plus bas cassé, se défend.",
      NO_TRADE: "≈ La prudence se comprend après une prise de liquidité, mais deux clôtures sous le niveau tranchent déjà la question.",
    },
    lessons: one("Après une prise de liquidité, regarde la clôture : revenue au-dessus du niveau, c'est un sweep (retournement possible) ; restée dessous, c'est une continuation (leçon Avancé 1)."),
    tags: ["sweep", "continuation"], build: mirrored(sweepContinuation),
    claims: { "plus bas franchi en clôture, puis poursuite": closesBeyond(true), "la suite baisse": goesDown },
  },
  {
    ...ADV, id: "adv_sweep_equal_lows", title: "Equal lows balayés", correctAnswer: "BUY", htfBias: "range", metric: "piege",
    notions: ["sweep", "liquidite", "range"],
    conflict: "Mèche contre clôture : la mèche passe sous les equal lows (la liquidité des stops), mais la bougie clôture au-dessus du niveau.",
    context: "L'UT supérieure est en range. En bas, deux creux presque égaux forment des equal lows. Une bougie vient de passer nettement dessous avec une longue mèche, puis a clôturé au-dessus.",
    shortContext: "Sweep des equal lows, clôture revenue au-dessus.",
    rationales: {
      BUY: "✓ Les stops placés sous les equal lows ont été déclenchés, puis le prix est revenu au-dessus en clôture : c'est un sweep de liquidité, souvent suivi d'un retournement. Un BUY, stop sous la mèche, objectif vers le haut du range, se défend.",
      SELL: "✗ Vendre la mèche sous les equal lows, c'est vendre là où les vendeurs viennent d'être piégés : la clôture est revenue au-dessus.",
      NO_TRADE: "≈ Attendre une confirmation se comprend, mais la clôture au-dessus des equal lows est déjà le signal décrit en leçon 1.",
    },
    lessons: one("Des equal lows attirent les stops : un sweep les déclenche, puis la clôture revient au-dessus. C'est la mèche qui balaie, la clôture qui décide (leçon Avancé 1)."),
    tags: ["sweep", "equal lows"], build: equalLowsSweep,
    claims: { "mèche sous les equal lows, clôture au-dessus": wickSweepBack(false), "la suite monte": goesUp },
  },
  {
    ...ADV, id: "adv_sweep_equal_highs", title: "Equal highs balayés", correctAnswer: "SELL", htfBias: "range", metric: "piege",
    notions: ["sweep", "liquidite", "range"],
    conflict: "Mèche contre clôture : la mèche passe au-dessus des equal highs (la liquidité des stops), mais la bougie clôture sous le niveau.",
    context: "L'UT supérieure est en range. En haut, deux sommets presque égaux forment des equal highs. Une bougie vient de passer nettement au-dessus avec une longue mèche, puis a clôturé en dessous.",
    shortContext: "Sweep des equal highs, clôture revenue dessous.",
    rationales: {
      BUY: "✗ Acheter la mèche au-dessus des equal highs, c'est acheter là où les acheteurs viennent d'être piégés : la clôture est revenue en dessous.",
      SELL: "✓ Les stops placés au-dessus des equal highs ont été déclenchés, puis le prix est revenu dessous en clôture : c'est un sweep de liquidité, souvent suivi d'un retournement. Un SELL, stop au-dessus de la mèche, objectif vers le bas du range, se défend.",
      NO_TRADE: "≈ Attendre une confirmation se comprend, mais la clôture sous les equal highs est déjà le signal décrit en leçon 1.",
    },
    lessons: one("Des equal highs attirent les stops : un sweep les déclenche, puis la clôture revient dessous. C'est la mèche qui balaie, la clôture qui décide (leçon Avancé 1)."),
    tags: ["sweep", "equal highs"], build: mirrored(equalLowsSweep),
    claims: { "mèche au-dessus des equal highs, clôture en dessous": wickSweepBack(true), "la suite baisse": goesDown },
  },
  {
    ...ADV, id: "adv_sweep_sans_place", title: "Sweep valide, R/R insuffisant", correctAnswer: "NO_TRADE", htfBias: "bullish", metric: "discipline",
    notions: ["sweep", "rr", "range"],
    conflict: "Un sweep valide (mèche sous le bas du range, clôture revenue dedans) contre un R/R insuffisant : le stop sous la mèche est loin, le haut du range est proche.",
    context: "UT supérieure haussière. Une bougie vient de balayer le bas d'un range étroit avec une très longue mèche, puis a clôturé à l'intérieur. Le haut du range est tout proche.",
    shortContext: "Sweep du bas d'un range étroit.",
    rationales: {
      BUY: "✗ Le sweep est réel, mais le stop logique se place sous la mèche, très loin, et l'objectif naturel est le haut du range, tout proche. Le gain visé ne couvre même pas le risque.",
      SELL: "✗ Vendre après une mèche de rejet, sur une UT supérieure haussière, va contre les deux signaux du graphique.",
      NO_TRADE: "✓ Un bon signal ne suffit pas : avec un stop sous la mèche et un objectif au haut du range, le R/R est inférieur à 1. Passer son tour est la décision logique.",
    },
    lessons: one("Un setup se juge aussi à son R/R : un sweep parfait, avec un stop forcément loin et un objectif tout proche, ne vaut pas le risque (leçons Avancé 1 et Débutant 6)."),
    tags: ["sweep", "R/R"], build: sweepNoRoom,
    claims: { "mèche sous le bas du range, clôture dedans": (ch) => { const s = zoneOf(ch, "support"); const k = last(ch.past); return s && k.l < lo(s) - 0.25 * mr(ch.past) && k.c > hi(s) ? null : "pas de sweep du bas du range"; }, "R/R jusqu'au haut du range d'au plus 1": rrRangeBelow(1) },
  },
  {
    ...ADV, id: "adv_ob_tient", title: "L'Order Block tient", correctAnswer: "BUY", htfBias: "range", metric: "lecture",
    notions: ["order_block", "entree_precision", "marteau"],
    conflict: "Le retour profond dans l'Order Block ressemble à l'effacement de l'impulsion ; la mèche de rejet dans la zone, clôture au-dessus, dit que les acheteurs le défendent.",
    context: "Une impulsion haussière est partie d'un Order Block (la dernière bougie rouge avant le départ). Le prix y revient : la dernière bougie est un marteau dont la mèche entre dans l'OB, clôture au-dessus.",
    shortContext: "Marteau dans l'Order Block.",
    rationales: {
      BUY: "✓ L'Order Block marque où les acheteurs ont lancé l'impulsion. Le marteau dont la mèche entre dans la zone, clôture au-dessus, montre qu'ils le défendent encore : c'est l'entrée de précision de la leçon 7, stop sous l'OB.",
      SELL: "✗ Le retour dans la zone est profond, mais la clôture au-dessus de l'OB et la longue mèche basse disent l'inverse d'une sortie de la zone.",
      NO_TRADE: "≈ Attendre se comprend, mais la réaction dans l'OB est exactement le déclencheur que l'on attend sur cette zone.",
    },
    lessons: one("Un Order Block se trade au retour, sur une réaction de bougie dans la zone : la clôture au-dessus de l'OB valide, une clôture dessous invalide (leçons Avancé 3 et 7)."),
    tags: ["order block", "rejet"], build: obHolds,
    claims: { "marteau dont la mèche entre dans l'OB": obReturn(true), "la suite monte": goesUp },
  },
  {
    ...ADV, id: "adv_ob_lache", title: "L'Order Block lâche", correctAnswer: "SELL", htfBias: "bearish", metric: "lecture",
    notions: ["order_block", "multi_ut", "breakout"],
    conflict: "Un Order Block haussier sur l'UT inférieure contre une UT supérieure baissière : la clôture franche sous l'OB tranche en faveur de l'UT supérieure.",
    context: "UT supérieure baissière. Sur l'UT inférieure, une impulsion haussière est partie d'un Order Block. Le prix y revient, et la dernière bougie, grande et rouge, clôture nettement sous l'OB.",
    shortContext: "Clôture franche sous l'Order Block.",
    rationales: {
      BUY: "✗ Acheter le retour dans l'OB aurait été logique avant la clôture. Ici, la bougie a clôturé franchement dessous : la zone n'est plus défendue.",
      SELL: "✓ L'OB haussier vient d'être cassé en clôture, dans le sens de l'UT supérieure baissière : les acheteurs de la zone sont piégés. Un SELL, stop au-dessus de l'OB, se défend.",
      NO_TRADE: "≈ La prudence se comprend, mais une clôture franche sous l'OB, alignée avec l'UT supérieure, est un signal net.",
    },
    lessons: one("Un Order Block n'est valable que tant que le prix ne clôture pas au-delà. Cassé en clôture, dans le sens de l'UT supérieure, il devient un argument dans l'autre sens (leçons Avancé 3 et Intermédiaire 7)."),
    tags: ["order block", "invalidation"], build: obFails,
    claims: { "clôture franche sous l'OB": obReturn(false), "la suite baisse": goesDown },
  },
  {
    ...ADV, id: "adv_fvg_casse", title: "FVG cassé", correctAnswer: "NO_TRADE", htfBias: "bullish", metric: "piege",
    notions: ["fvg", "multi_ut"],
    conflict: "UT supérieure haussière et FVG haussier, mais le prix vient de clôturer sous le FVG : la zone qui devait tenir a lâché.",
    context: "UT supérieure haussière. Un FVG haussier a été laissé par l'impulsion. Le prix est revenu dedans, et la dernière bougie clôture sous le FVG.",
    shortContext: "Clôture sous le FVG haussier.",
    rationales: {
      BUY: "✗ Acheter dans un FVG se défend tant qu'il tient. Ici, la clôture sous la zone montre que les acheteurs ne l'ont pas défendu : le signal d'achat a disparu.",
      SELL: "≈ La clôture sous le FVG est un signal baissier local, mais vendre contre une UT supérieure haussière, sans autre argument, reste un pari.",
      NO_TRADE: "✓ Le FVG ne tient plus, et l'UT supérieure reste haussière : aucun des deux camps n'offre un trade propre. Attendre est la décision logique.",
    },
    lessons: one("Un FVG respecté peut lancer la continuation ; un FVG cassé en clôture n'est plus un support. Avec une UT supérieure dans l'autre sens, mieux vaut attendre (leçons Avancé 2 et Intermédiaire 7)."),
    tags: ["FVG", "invalidation"], build: fvgBroken,
    claims: { "clôture sous le FVG": fvgClosedBelow },
  },
];

export const BSNT_NEW: NewScenario[] = [...BSNT_BEGINNER, ...BSNT_INTERMEDIATE, ...BSNT_ADVANCED];
