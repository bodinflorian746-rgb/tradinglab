// ─── Types ────────────────────────────────────────────────────────────────────

export type GameChoice = "BUY" | "SELL" | "NO_TRADE";

export type SetupKey =
  | "breakout_bullish_clean"
  | "breakout_bearish_clean"
  | "false_breakout_bullish"
  | "false_breakout_bearish"
  | "pullback_bullish_trend"
  | "pullback_bearish_trend"
  | "rejection_resistance"
  | "bounce_support"
  | "liquidity_sweep_reversal"
  | "fvg_reaction"
  | "trade_before_news"
  | "range_no_opp";

export type Asset = "XAU/USD" | "EUR/USD" | "NASDAQ";
export type Session = "Asie" | "Londres" | "New York";
export type Volatility = "faible" | "normale" | "élevée";
export type Spread = "faible" | "élevé";
export type HtfBias = "bullish" | "bearish" | "range";
export type MacroContext = "normal" | "dangereux";
export type Metric = "discipline" | "lecture" | "piege";

export interface ScenarioTemplate {
  id:            SetupKey;
  title:         string;
  correctAnswer: GameChoice;
  htfBias:       HtfBias;
  macroContext:  MacroContext;
  metric:        Metric;
  context:       string;
  explanation:   string;
  tags:          string[];
}

export interface ScenarioInstance extends ScenarioTemplate {
  asset:      Asset;
  session:    Session;
  volatility: Volatility;
  spread:     Spread;
  seed:       number;
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

// ─── Templates ────────────────────────────────────────────────────────────────

export const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  {
    id: "breakout_bullish_clean",
    title: "Cassure haussière nette",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "La résistance vient d'être cassée avec une bougie de force et un follow-through visible.",
    explanation: "Breakout propre, HTF aligné, follow-through clair — le contexte est en faveur des acheteurs. BUY est la décision disciplinée.",
    tags: ["lecture", "breakout", "alignement HTF"],
  },
  {
    id: "breakout_bearish_clean",
    title: "Cassure baissière nette",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "lecture",
    context: "Le support vient de céder avec une bougie de force suivie d'un follow-through clair.",
    explanation: "Breakdown propre, HTF aligné, momentum côté vendeur — SELL est la suite logique.",
    tags: ["lecture", "breakout", "alignement HTF"],
  },
  {
    id: "false_breakout_bullish",
    title: "Faux breakout haussier",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "piege",
    context: "Le prix a piqué au-dessus de la résistance puis refermé en dessous — la liquidité a été prise.",
    explanation: "C'est un fakeout classique. Les acheteurs au-dessus de la résistance sont piégés, le prix repart à la baisse. SELL après confirmation.",
    tags: ["piège", "fakeout", "liquidité"],
  },
  {
    id: "false_breakout_bearish",
    title: "Faux breakout baissier",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "piege",
    context: "Le prix a piqué sous le support puis refermé au-dessus — les vendeurs sont piégés.",
    explanation: "Fakeout baissier. La liquidité sous le support a été ramassée par les institutionnels, le prix repart au nord. BUY après confirmation.",
    tags: ["piège", "fakeout", "liquidité"],
  },
  {
    id: "pullback_bullish_trend",
    title: "Pullback en tendance haussière",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "Tendance haussière en place, le prix corrige vers une zone de demande et montre des signes de reprise.",
    explanation: "Pullback sain dans une tendance haussière, le prix réagit à la zone — BUY dans le sens du HTF.",
    tags: ["lecture", "pullback", "trend"],
  },
  {
    id: "pullback_bearish_trend",
    title: "Pullback en tendance baissière",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "lecture",
    context: "Tendance baissière en place, le prix rebondit vers une zone d'offre et commence à recaler.",
    explanation: "Pullback sain dans une tendance baissière, le prix réagit à la zone — SELL dans le sens du HTF.",
    tags: ["lecture", "pullback", "trend"],
  },
  {
    id: "rejection_resistance",
    title: "Rejet sur résistance",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "lecture",
    context: "Le prix teste une résistance majeure et imprime plusieurs bougies à mèches hautes.",
    explanation: "Rejet net sur résistance avec mèches hautes répétées — les vendeurs défendent la zone. SELL est la lecture juste.",
    tags: ["lecture", "rejet", "résistance"],
  },
  {
    id: "bounce_support",
    title: "Rebond sur support",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "Le prix teste un support majeur et imprime plusieurs bougies à mèches basses.",
    explanation: "Rebond net sur support avec mèches basses répétées — les acheteurs défendent la zone. BUY est la lecture juste.",
    tags: ["lecture", "support", "rebond"],
  },
  {
    id: "liquidity_sweep_reversal",
    title: "Sweep de liquidité puis retournement",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "piege",
    context: "Le prix vient de balayer la liquidité sous le précédent low, puis a fait demi-tour avec force.",
    explanation: "Sweep classique : la liquidité courte est ramassée, puis l'institutionnel pousse au nord. C'est un setup de retournement haussier — BUY.",
    tags: ["piège", "liquidité", "sweep"],
  },
  {
    id: "fvg_reaction",
    title: "Réaction sur FVG haussier",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "Un FVG haussier laissé après l'impulsion. Le prix revient le tester et réagit.",
    explanation: "Le FVG agit comme zone de demande. Le prix le retest et imprime une réaction claire — BUY au rebond.",
    tags: ["lecture", "FVG", "imbalance"],
  },
  {
    id: "trade_before_news",
    title: "News à risque imminente",
    correctAnswer: "NO_TRADE",
    htfBias: "range",
    macroContext: "dangereux",
    metric: "discipline",
    context: "Une news macro majeure est attendue dans moins de 30 minutes. Le carnet est nerveux.",
    explanation: "Trader juste avant une news majeure = jouer à la loterie. Le spread s'élargit, la volatilité explose, les stops sautent. NO TRADE est la seule décision pro.",
    tags: ["discipline", "macro", "news"],
  },
  {
    id: "range_no_opp",
    title: "Range sans opportunité",
    correctAnswer: "NO_TRADE",
    htfBias: "range",
    macroContext: "normal",
    metric: "discipline",
    context: "Le prix oscille au milieu d'un range, sans test de zone ni signal clair.",
    explanation: "Pas d'edge ici : prix au milieu du range, aucun catalyseur, aucun signal. Forcer une entrée = donner son argent au marché. NO TRADE.",
    tags: ["discipline", "range", "patience"],
  },
];

// ─── Variations ───────────────────────────────────────────────────────────────

const ASSETS: readonly Asset[] = ["XAU/USD", "EUR/USD", "NASDAQ"];
const SESSIONS: readonly Session[] = ["Asie", "Londres", "New York"];
const VOLATILITIES: readonly Volatility[] = ["faible", "normale", "élevée"];
const SPREADS: readonly Spread[] = ["faible", "élevé"];

const VOL_MULT: Record<Volatility, number> = { "faible": 0.75, "normale": 1.0, "élevée": 1.35 };

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

function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function generateScenarios(seed: number): ScenarioInstance[] {
  const rng = mulberry32(seed);
  const shuffled = [...SCENARIO_TEMPLATES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.map((tmpl, i) => ({
    ...tmpl,
    asset:      pick(ASSETS, rng),
    session:    pick(SESSIONS, rng),
    volatility: pick(VOLATILITIES, rng),
    spread:     pick(SPREADS, rng),
    seed:       (seed + i * 9973) >>> 0,
  }));
}

// ─── Chart generators ─────────────────────────────────────────────────────────

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function candle(o: number, c: number, wU: number, wD: number): Candle {
  return { o, c, h: Math.max(o, c) + wU, l: Math.min(o, c) - wD };
}

function finishChart(candles: Candle[], zones: ChartZone[]): ChartData {
  const vals: number[] = [];
  for (const k of candles) { vals.push(k.h, k.l); }
  for (const z of zones)  { vals.push(z.y1, z.y2); }
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = (max - min) * 0.08 || 1;
  return { candles, zones, domain: { min: min - pad, max: max + pad } };
}

function genBreakoutBull(rng: () => number, m: number): ChartData {
  const candles: Candle[] = [];
  const R = 10;
  let p = 3 + rng() * 0.5;
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (0.5 + rng() * 0.8) * m, 2, R - 1);
    candles.push(candle(o, c, (0.2 + rng() * 0.3) * m, (0.2 + rng() * 0.3) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 1.2 * m, R - 1.6, R - 0.3);
    candles.push(candle(o, c, (0.3 + rng() * 0.3) * m, (0.3 + rng() * 0.3) * m));
    p = c;
  }
  const bO = p;
  const bC = R + (2 + rng() * 1.2) * m;
  candles.push(candle(bO, bC, (0.4 + rng() * 0.3) * m, 0.25));
  p = bC;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.7) * m;
    candles.push(candle(o, c, (0.2 + rng() * 0.3) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  return finishChart(candles, [
    { kind: "resistance", y1: R - 0.15, y2: R + 0.15, label: "Résistance cassée" },
  ]);
}

function genBreakoutBear(rng: () => number, m: number): ChartData {
  const candles: Candle[] = [];
  const S = 0;
  let p = 7 - rng() * 0.5;
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o - (0.5 + rng() * 0.8) * m, S + 1, 8);
    candles.push(candle(o, c, (0.2 + rng() * 0.3) * m, (0.2 + rng() * 0.3) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 1.2 * m, S + 0.3, S + 1.6);
    candles.push(candle(o, c, (0.3 + rng() * 0.3) * m, (0.3 + rng() * 0.3) * m));
    p = c;
  }
  const bO = p;
  const bC = S - (2 + rng() * 1.2) * m;
  candles.push(candle(bO, bC, 0.25, (0.4 + rng() * 0.3) * m));
  p = bC;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.7) * m;
    candles.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.2 + rng() * 0.3) * m));
    p = c;
  }
  return finishChart(candles, [
    { kind: "support", y1: S - 0.15, y2: S + 0.15, label: "Support cassé" },
  ]);
}

function genFalseBreakoutBull(rng: () => number, m: number): ChartData {
  const candles: Candle[] = [];
  const R = 10;
  let p = 5 + rng() * 0.5;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = clamp(o + (0.4 + rng() * 0.6) * m, 3.5, R - 0.5);
    candles.push(candle(o, c, (0.25 + rng() * 0.3) * m, (0.25 + rng() * 0.3) * m));
    p = c;
  }
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.45) * 1.0 * m, R - 1.4, R - 0.3);
    candles.push(candle(o, c, (0.3 + rng() * 0.3) * m, (0.3 + rng() * 0.3) * m));
    p = c;
  }
  const wO = p;
  const wC = R - 0.5 - rng() * 0.4;
  candles.push(candle(wO, wC, (1.5 + rng() * 0.6) * m, 0.25));
  p = wC;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.35 + rng() * 0.8) * m;
    candles.push(candle(o, c, (0.2 + rng() * 0.25) * m, (0.25 + rng() * 0.4) * m));
    p = c;
  }
  return finishChart(candles, [
    { kind: "resistance", y1: R - 0.15, y2: R + 0.15, label: "Résistance (piège)" },
    { kind: "liquidity_high", y1: R + 0.5, y2: R + 1.6, label: "Liquidité prise" },
  ]);
}

function genFalseBreakoutBear(rng: () => number, m: number): ChartData {
  const candles: Candle[] = [];
  const S = 0;
  let p = 5 - rng() * 0.5;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = clamp(o - (0.4 + rng() * 0.6) * m, S + 0.5, 6);
    candles.push(candle(o, c, (0.25 + rng() * 0.3) * m, (0.25 + rng() * 0.3) * m));
    p = c;
  }
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.55) * 1.0 * m, S + 0.3, S + 1.4);
    candles.push(candle(o, c, (0.3 + rng() * 0.3) * m, (0.3 + rng() * 0.3) * m));
    p = c;
  }
  const wO = p;
  const wC = S + 0.5 + rng() * 0.4;
  candles.push(candle(wO, wC, 0.25, (1.5 + rng() * 0.6) * m));
  p = wC;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.35 + rng() * 0.8) * m;
    candles.push(candle(o, c, (0.25 + rng() * 0.4) * m, (0.2 + rng() * 0.25) * m));
    p = c;
  }
  return finishChart(candles, [
    { kind: "support", y1: S - 0.15, y2: S + 0.15, label: "Support (piège)" },
    { kind: "liquidity_low", y1: S - 1.6, y2: S - 0.5, label: "Liquidité prise" },
  ]);
}

function genPullbackBull(rng: () => number, m: number): ChartData {
  const candles: Candle[] = [];
  let p = 1 + rng() * 0.5;
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o + (0.5 + rng() * 0.7) * m;
    candles.push(candle(o, c, (0.2 + rng() * 0.3) * m, (0.15 + rng() * 0.2) * m));
    p = c;
  }
  const peak = p;
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o - (0.2 + rng() * 0.5) * m;
    candles.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.2 + rng() * 0.25) * m));
    p = c;
  }
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.35 + rng() * 0.5) * m;
    candles.push(candle(o, c, (0.2 + rng() * 0.25) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  const demandLow = p - 0.6 * m;
  const demandHigh = p + 0.2 * m;
  return finishChart(candles, [
    { kind: "support", y1: demandLow, y2: demandHigh, label: "Zone de demande" },
    { kind: "liquidity_high", y1: peak - 0.15, y2: peak + 0.15, label: "Sommet de tendance" },
  ]);
}

function genPullbackBear(rng: () => number, m: number): ChartData {
  const candles: Candle[] = [];
  let p = 9 - rng() * 0.5;
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o - (0.5 + rng() * 0.7) * m;
    candles.push(candle(o, c, (0.15 + rng() * 0.2) * m, (0.2 + rng() * 0.3) * m));
    p = c;
  }
  const bottom = p;
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o + (0.2 + rng() * 0.5) * m;
    candles.push(candle(o, c, (0.2 + rng() * 0.25) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o - (0.35 + rng() * 0.5) * m;
    candles.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.2 + rng() * 0.25) * m));
    p = c;
  }
  const offerLow = p - 0.2 * m;
  const offerHigh = p + 0.6 * m;
  return finishChart(candles, [
    { kind: "resistance", y1: offerLow, y2: offerHigh, label: "Zone d'offre" },
    { kind: "liquidity_low", y1: bottom - 0.15, y2: bottom + 0.15, label: "Bas de tendance" },
  ]);
}

function genRejectionResistance(rng: () => number, m: number): ChartData {
  const candles: Candle[] = [];
  const R = 10;
  let p = 4 + rng() * 0.5;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = clamp(o + (0.5 + rng() * 0.7) * m, 3, R - 0.3);
    candles.push(candle(o, c, (0.2 + rng() * 0.3) * m, (0.15 + rng() * 0.2) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.7) * 0.8 * m, R - 1.5, R - 0.4);
    candles.push(candle(o, c, (1.2 + rng() * 0.5) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.6) * m;
    candles.push(candle(o, c, (0.2 + rng() * 0.25) * m, (0.2 + rng() * 0.3) * m));
    p = c;
  }
  return finishChart(candles, [
    { kind: "resistance", y1: R - 0.2, y2: R + 0.2, label: "Résistance majeure" },
  ]);
}

function genBounceSupport(rng: () => number, m: number): ChartData {
  const candles: Candle[] = [];
  const S = 0;
  let p = 6 - rng() * 0.5;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = clamp(o - (0.5 + rng() * 0.7) * m, S + 0.3, 7);
    candles.push(candle(o, c, (0.15 + rng() * 0.2) * m, (0.2 + rng() * 0.3) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.3) * 0.8 * m, S + 0.4, S + 1.5);
    candles.push(candle(o, c, (0.2 + rng() * 0.2) * m, (1.2 + rng() * 0.5) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.6) * m;
    candles.push(candle(o, c, (0.2 + rng() * 0.3) * m, (0.2 + rng() * 0.25) * m));
    p = c;
  }
  return finishChart(candles, [
    { kind: "support", y1: S - 0.2, y2: S + 0.2, label: "Support majeur" },
  ]);
}

function genLiquiditySweepReversal(rng: () => number, m: number): ChartData {
  const candles: Candle[] = [];
  const L = 1;
  let p = 4 + rng() * 0.4;
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o - (0.3 + rng() * 0.6) * m, L + 0.4, 4.5);
    candles.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.2 + rng() * 0.3) * m));
    p = c;
  }
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 0.8 * m, L + 0.5, L + 1.6);
    candles.push(candle(o, c, (0.25 + rng() * 0.25) * m, (0.25 + rng() * 0.25) * m));
    p = c;
  }
  const sO = p;
  const sC = L + 0.4 + rng() * 0.3;
  candles.push(candle(sO, sC, 0.2, (1.4 + rng() * 0.5) * m));
  p = sC;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = o + (0.5 + rng() * 0.8) * m;
    candles.push(candle(o, c, (0.2 + rng() * 0.3) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  return finishChart(candles, [
    { kind: "support", y1: L - 0.15, y2: L + 0.15, label: "Précédent low" },
    { kind: "liquidity_low", y1: L - 1.5, y2: L - 0.3, label: "Liquidité balayée" },
  ]);
}

function genFvgReaction(rng: () => number, m: number): ChartData {
  const candles: Candle[] = [];
  let p = 2 + rng() * 0.4;
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o + (rng() - 0.5) * 0.5 * m;
    candles.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  const gapBottom = p + 0.3;
  const gO = p;
  const gC = p + (2.4 + rng() * 0.4) * m;
  candles.push(candle(gO, gC, (0.3 + rng() * 0.2) * m, 0.15));
  p = gC;
  const gapTop = gO + 0.05;
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.3 + rng() * 0.4) * m;
    candles.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  const fvgMid = (gapBottom + gapTop) / 2;
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o - (0.3 + rng() * 0.5) * m, fvgMid, p + 0.3);
    candles.push(candle(o, c, (0.15 + rng() * 0.2) * m, (0.2 + rng() * 0.25) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o + (0.45 + rng() * 0.6) * m;
    candles.push(candle(o, c, (0.2 + rng() * 0.3) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  return finishChart(candles, [
    { kind: "fvg", y1: gapBottom, y2: gapTop, label: "FVG haussier" },
  ]);
}

function genTradeBeforeNews(rng: () => number, m: number): ChartData {
  const candles: Candle[] = [];
  let p = 4 + rng() * 0.6;
  for (let i = 0; i < 14; i++) {
    const o = p;
    const tightness = 1 - i / 24;
    const drift = (rng() - 0.5) * 1.0 * tightness * m;
    const c = o + drift;
    candles.push(candle(o, c, (0.2 + rng() * 0.25) * tightness * m, (0.2 + rng() * 0.25) * tightness * m));
    p = c;
  }
  return finishChart(candles, []);
}

function genRangeNoOpp(rng: () => number, m: number): ChartData {
  const candles: Candle[] = [];
  const S = 1;
  const R = 6;
  const mid = (S + R) / 2;
  let p = mid + (rng() - 0.5);
  for (let i = 0; i < 14; i++) {
    const o = p;
    const pull = (mid - o) * 0.25;
    const drift = pull + (rng() - 0.5) * 1.6 * m;
    let c = o + drift;
    c = clamp(c, S + 0.4, R - 0.4);
    candles.push(candle(o, c, (0.25 + rng() * 0.3) * m, (0.25 + rng() * 0.3) * m));
    p = c;
  }
  return finishChart(candles, [
    { kind: "resistance", y1: R - 0.15, y2: R + 0.15, label: "Plafond du range" },
    { kind: "support", y1: S - 0.15, y2: S + 0.15, label: "Plancher du range" },
  ]);
}

export function buildChart(setup: SetupKey, seed: number, volatility: Volatility = "normale"): ChartData {
  const rng = mulberry32(seed);
  const m = VOL_MULT[volatility];
  switch (setup) {
    case "breakout_bullish_clean":     return genBreakoutBull(rng, m);
    case "breakout_bearish_clean":     return genBreakoutBear(rng, m);
    case "false_breakout_bullish":     return genFalseBreakoutBull(rng, m);
    case "false_breakout_bearish":     return genFalseBreakoutBear(rng, m);
    case "pullback_bullish_trend":     return genPullbackBull(rng, m);
    case "pullback_bearish_trend":     return genPullbackBear(rng, m);
    case "rejection_resistance":       return genRejectionResistance(rng, m);
    case "bounce_support":             return genBounceSupport(rng, m);
    case "liquidity_sweep_reversal":   return genLiquiditySweepReversal(rng, m);
    case "fvg_reaction":               return genFvgReaction(rng, m);
    case "trade_before_news":          return genTradeBeforeNews(rng, m);
    case "range_no_opp":               return genRangeNoOpp(rng, m);
  }
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

export interface ScoreResult {
  correct:      boolean;
  points:       number;
  streakBonus:  number;
}

export function scoreChoice(choice: GameChoice, correct: GameChoice, currentStreak: number): ScoreResult {
  if (choice === correct) {
    const base = correct === "NO_TRADE" ? 120 : 100;
    const streakBonus = currentStreak >= 2 ? 30 : 0;
    return { correct: true, points: base + streakBonus, streakBonus };
  }
  if (correct === "NO_TRADE") {
    return { correct: false, points: -100, streakBonus: 0 };
  }
  return { correct: false, points: -50, streakBonus: 0 };
}
