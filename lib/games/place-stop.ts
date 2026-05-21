// Mini-jeu V2 : "QUEL STOP VA SURVIVRE ?"
//
// Le joueur voit un graphique avec :
// - une entrée déjà placée
// - 3 stop loss proposés (A / B / C, ordonnés visuellement top→bottom)
//
// Il choisit le stop le plus logique selon la structure, la volatilité,
// le bruit du marché et le RR.
//
// Après le choix, les bougies futures se révèlent et démontrent le verdict :
//   - tight     → généralement balayé par le 1er noise / sweep
//   - logical   → survit ET le trade va dans le bon sens
//   - wide      → survit mais le RR est tué (capital mal utilisé)
//   - liquidity → placé pile dans une zone évidente de liquidité = piège

import {
  type Asset, type Session, type Volatility, type Spread,
  type HtfBias, type MacroContext,
  type Candle, type ChartZone,
  VOL_MULT, mulberry32, pick, clamp, candle,
} from "./shared";

export type { Asset, Session, Volatility, Spread, HtfBias, MacroContext };
export type { Candle, ChartZone };

// ─── Types ────────────────────────────────────────────────────────────────────

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type TradeDirection = "BUY" | "SELL";

export type PlaceStopSetupKey =
  | "pullback_bull"
  | "pullback_bear"
  | "bounce_support"
  | "rejection_resistance"
  | "fakeout_above_resistance"
  | "sweep_low_reversal"
  | "fvg_continuation"
  | "high_vol_pullback";

export type StopType = "tight" | "logical" | "wide" | "liquidity";
export type StopId = "A" | "B" | "C";

export interface StopOption {
  id:        StopId;
  price:     number;
  type:      StopType;
  rationale: string;
}

export interface DifficultyLessons {
  beginner:     string;
  intermediate: string;
  advanced:     string;
}

export interface PlaceStopTemplate {
  id:            PlaceStopSetupKey;
  title:         string;
  direction:     TradeDirection;
  htfBias:       HtfBias;
  macroContext:  MacroContext;
  context:       string;
  shortContext?: string;
  lessons:       DifficultyLessons;
  difficulties:  readonly Difficulty[];
  tag:           string;
}

export interface PlaceStopInstance extends PlaceStopTemplate {
  asset:      Asset;
  session:    Session;
  volatility: Volatility;
  spread:     Spread;
  seed:       number;
  difficulty: Difficulty;
}

export interface PlaceStopChart {
  past:      Candle[];
  future:    Candle[];
  zones:     ChartZone[];
  domain:    { min: number; max: number };
  entry:     number;
  tp:        number | null;
  direction: TradeDirection;
  stops:     StopOption[];   // 3 stops, ordonnés visuellement top→bottom (A en haut)
}

export const ROUNDS_PER_SESSION = 10;

const ASSETS:        readonly Asset[]      = ["EUR/USD", "XAU/USD", "BTC/USD", "NASDAQ"];
const SESSIONS:      readonly Session[]    = ["Londres", "New York", "Overlap", "Heures mortes"];
const VOLATILITIES:  readonly Volatility[] = ["faible", "normale", "élevée"];
const SPREADS:       readonly Spread[]     = ["faible", "élevé"];

// ─── Templates ────────────────────────────────────────────────────────────────

export const PLACE_STOP_TEMPLATES: PlaceStopTemplate[] = [
  {
    id: "pullback_bull",
    title: "Pullback en tendance haussière",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Tendance haussière, le prix corrige sur la zone de demande. Tu es entré au rebond.",
    shortContext: "Pullback BUY dans un uptrend.",
    lessons: {
      beginner:     "Le stop logique se place DERRIÈRE le swing low avec une marge — jamais dedans (bruit), jamais trop loin (RR ruiné).",
      intermediate: "Le bruit du pullback va souvent retester le low avant la continuation. La marge derrière le low protège contre ce sweep classique.",
      advanced:     "Le stop logique respecte 3 contraintes : derrière le low, hors du bruit ATR, et préserve un RR >= 2. C'est le seul qui satisfait les 3.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "structure",
  },
  {
    id: "pullback_bear",
    title: "Pullback en tendance baissière",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Tendance baissière, le prix rebondit sur une zone d'offre. Tu es entré court.",
    shortContext: "Pullback SELL dans un downtrend.",
    lessons: {
      beginner:     "Le stop logique se place AU-DESSUS du swing high avec marge — jamais en dessous, jamais trop loin.",
      intermediate: "Le rebond peut retester son high avant de retomber. Coller le high = stop hunt assuré.",
      advanced:     "Stop = couvre la mèche du high + marge ATR. Un stop pile au niveau est piégé, un stop trop loin tue le RR.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "structure",
  },
  {
    id: "bounce_support",
    title: "Rebond sur support majeur",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le prix vient de rebondir sur un support majeur HTF.",
    shortContext: "BUY sur support HTF.",
    lessons: {
      beginner:     "Stop sous le support avec marge réaliste. Pile sur le support = ramassage de liquidité institutionnelle.",
      intermediate: "Le support HTF attire souvent un test profond avant la vraie réaction. La marge protège ce stop hunt.",
      advanced:     "Distance optimale = 1.0 à 1.5x ATR sous le niveau. Plus court = noise, plus loin = capital mort.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "lecture",
  },
  {
    id: "rejection_resistance",
    title: "Rejet sur résistance majeure",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Le prix vient de rejeter une résistance majeure HTF avec mèches.",
    shortContext: "SELL sur résistance HTF.",
    lessons: {
      beginner:     "Stop au-dessus de la mèche la plus haute, avec marge. Coller le niveau = stop hunt assuré.",
      intermediate: "Les retests de résistance HTF sont souvent piégeux. Marge derrière la mèche = obligatoire.",
      advanced:     "La mèche du rejet + 1 ATR = zone propre. Coller la mèche = exposé au 2e test, trop loin = RR cassé.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "lecture",
  },
  {
    id: "fakeout_above_resistance",
    title: "Faux breakout — short après rejet",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Le prix a piqué au-dessus de la résistance puis a refermé sous. Tu shortes le piège.",
    shortContext: "SELL après fakeout.",
    lessons: {
      intermediate: "Stop au-dessus du PIC du fakeout (jamais à l'intérieur). Le pic est l'invalidation réelle du piège.",
      advanced:     "Stop AU-DESSUS du wick high + ATR margin. Coller le high = retest du fakeout te dégage. Dans le piège = -100.",
      beginner:     "Le stop doit couvrir la mèche du faux breakout. Tout stop placé dans la zone du piège = perdu.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "piège",
  },
  {
    id: "sweep_low_reversal",
    title: "Sweep de liquidité puis retournement",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le prix vient de balayer la liquidité sous le précédent low puis a fait demi-tour.",
    shortContext: "BUY après sweep low.",
    lessons: {
      intermediate: "Stop sous le LOW du sweep, jamais dans la zone qui vient d'être prise. Le sweep est la nouvelle invalidation.",
      advanced:     "Stop = sous la mèche du sweep + marge. Pile sur le sweep low = retest probable, dans la zone liquidité = piège total.",
      beginner:     "Le marché vient de piquer une zone — ton stop doit être SOUS cette zone, pas dedans.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "piège",
  },
  {
    id: "fvg_continuation",
    title: "Réaction sur FVG haussier",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Un FVG haussier laissé après l'impulsion. Le prix le retest et commence à réagir.",
    shortContext: "BUY au retest du FVG.",
    lessons: {
      intermediate: "Stop sous le BAS du FVG. Dans le FVG = exposé à un re-test profond, trop loin = RR fragile.",
      advanced:     "Le FVG est la zone d'invalidation. Stop = bas du FVG - 1 ATR. Plus serré que ça = noise, plus loin = capital mort.",
      beginner:     "Le FVG est ta zone d'achat. Le stop va SOUS la zone, pas dedans.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "lecture",
  },
  {
    id: "high_vol_pullback",
    title: "Pullback en volatilité élevée",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Pullback dans un marché à volatilité élevée. Les bougies sont larges, les wicks profondes.",
    shortContext: "BUY pullback, vol élevée.",
    lessons: {
      advanced:     "En vol élevée, le stop 'normal' devient trop serré. La marge doit être doublée — ce qui ressemble à un wide stop est en fait le LOGIQUE ici.",
      intermediate: "La volatilité élargit le bruit normal. Un stop 'standard' est probablement trop serré.",
      beginner:     "Plus le marché bouge fort, plus ton stop doit être large pour respirer.",
    },
    difficulties: ["advanced"],
    tag: "volatilité",
  },
];

// ─── Variations ───────────────────────────────────────────────────────────────

export function generatePlaceStopScenarios(seed: number, difficulty: Difficulty = "intermediate"): PlaceStopInstance[] {
  const rng = mulberry32(seed);
  const pool = PLACE_STOP_TEMPLATES.filter((t) => t.difficulties.includes(difficulty));
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const out: PlaceStopInstance[] = [];
  let lastId: PlaceStopSetupKey | null = null;
  for (let i = 0; i < ROUNDS_PER_SESSION; i++) {
    let candidate = shuffled[i % shuffled.length];
    if (candidate.id === lastId && shuffled.length > 1) {
      candidate = shuffled[(i + 1) % shuffled.length];
    }
    const isHighVol = candidate.id === "high_vol_pullback";
    out.push({
      ...candidate,
      asset:      pick(ASSETS, rng),
      session:    pick(SESSIONS, rng),
      volatility: isHighVol ? "élevée" : pick(VOLATILITIES, rng),
      spread:     pick(SPREADS, rng),
      seed:       (seed + i * 9973) >>> 0,
      difficulty,
    });
    lastId = candidate.id;
  }
  return out;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface RawScenario {
  past:      Candle[];
  fut:       Candle[];
  zones:     ChartZone[];
  entry:     number;
  tp:        number | null;
  direction: TradeDirection;
  // Stops par TYPE (avant mapping vers A/B/C)
  tight:     { price: number; rationale: string };
  logical:   { price: number; rationale: string };
  wide:      { price: number; rationale: string };
}

function finalize(raw: RawScenario): PlaceStopChart {
  // Mapping A/B/C par ordre VISUEL top→bottom (prix décroissant).
  // Pour BUY (stops sous entry) : A = stop le plus haut = tight ; C = wide.
  // Pour SELL (stops au-dessus) : A = wide (plus haut) ; C = tight.
  const sorted = [
    { price: raw.tight.price,   type: "tight"   as StopType, rationale: raw.tight.rationale   },
    { price: raw.logical.price, type: "logical" as StopType, rationale: raw.logical.rationale },
    { price: raw.wide.price,    type: "wide"    as StopType, rationale: raw.wide.rationale    },
  ].sort((a, b) => b.price - a.price); // top→bottom (price desc)

  const stops: StopOption[] = sorted.map((s, i) => ({
    id:        (["A", "B", "C"] as StopId[])[i],
    price:     s.price,
    type:      s.type,
    rationale: s.rationale,
  }));

  // Domain
  const all = [...raw.past, ...raw.fut];
  const vals: number[] = [raw.entry, raw.tp ?? raw.entry, ...stops.map((s) => s.price)];
  for (const k of all) { vals.push(k.h, k.l); }
  for (const z of raw.zones) { vals.push(z.y1, z.y2); }
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = (max - min) * 0.08 || 1;

  return {
    past: raw.past,
    future: raw.fut,
    zones: raw.zones,
    entry: raw.entry,
    tp: raw.tp,
    direction: raw.direction,
    stops,
    domain: { min: min - pad, max: max + pad },
  };
}

// ─── Difficulty knobs sur les distances des stops (depuis l'entry) ───────────
// Convention : distances POSITIVES depuis entry. Pour un BUY, le stop est à
// entry - distance ; pour un SELL, à entry + distance.
//
// Contraintes :
//   - tight < logical < wide (toujours)
//   - logical-tight > 0.5 et wide-logical > 0.8 → garantit que le dip/bump
//     du future peut balayer tight sans toucher logical/wide
//   - Avec TP à entry ± 3.5*m, on vise :
//     - RR_logical (= 3.5/logical) >= 2.5
//     - RR_wide (= 3.5/wide) <= 1.7 → wide >= 2.06
function spread(difficulty: Difficulty): { tight: number; logical: number; wide: number } {
  if (difficulty === "beginner")     return { tight: 0.4, logical: 1.2, wide: 3.0 };
  if (difficulty === "intermediate") return { tight: 0.3, logical: 1.0, wide: 2.6 };
  /* advanced */                     return { tight: 0.2, logical: 0.85, wide: 2.3 };
}

// Construit un candle avec low et high explicites (utilisé pour les dips/bumps
// du future où on veut contrôler précisément l'amplitude).
function explicitCandle(o: number, c: number, h: number, l: number): Candle {
  return { o, c, h, l };
}

// ─── Rationales communs ──────────────────────────────────────────────────────
// Réutilisables — chaque scenario les personnalise légèrement.
const TIGHT_RATIONALE = "✗ Trop serré — placé dans le bruit normal du marché. La 1re mèche de retest va le balayer avant que le trade aboutisse. C'est l'erreur retail classique.";
const LOGICAL_RATIONALE = "✓ Placement logique — derrière la vraie invalidation, avec une marge anti-bruit. Survit aux retests, capture la cassure structurelle si elle arrive.";
const WIDE_RATIONALE = "≈ Survit, mais détruit le RR. Distance trop grande = capital mal utilisé, ratio risque/rendement souvent < 1.";

// ─── 8 générateurs ────────────────────────────────────────────────────────────

// Helper : construit le future "sweep + recovery" pour un BUY.
// Le 1er candle du future est un dip qui sweep tight (au-dessous du niveau
// tight) sans toucher logical. Les bougies suivantes rallient.
function buildBuyFuture(rng: () => number, m: number, entry: number, sp: ReturnType<typeof spread>, fut: Candle[]): number {
  const dipLow = entry - sp.tight * m - 0.1 * m;  // sweep tight, ne touche pas logical
  let p = entry;
  const dipClose = entry - sp.tight * m + 0.15 * m;  // close au-dessus du tight
  fut.push(explicitCandle(p, dipClose, p + (0.1 + rng() * 0.1) * m, dipLow));
  p = dipClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.45 + rng() * 0.55) * m;
    const wU = (0.18 + rng() * 0.18) * m;
    const wD = (0.13 + rng() * 0.13) * m;
    fut.push(explicitCandle(o, c, Math.max(o, c) + wU, Math.min(o, c) - wD));
    p = c;
  }
  return p;
}

// Symétrique pour SELL.
function buildSellFuture(rng: () => number, m: number, entry: number, sp: ReturnType<typeof spread>, fut: Candle[]): number {
  const bumpHigh = entry + sp.tight * m + 0.1 * m;
  const bumpClose = entry + sp.tight * m - 0.15 * m;
  let p = entry;
  fut.push(explicitCandle(p, bumpClose, bumpHigh, p - (0.1 + rng() * 0.1) * m));
  p = bumpClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.45 + rng() * 0.55) * m;
    const wU = (0.13 + rng() * 0.13) * m;
    const wD = (0.18 + rng() * 0.18) * m;
    fut.push(explicitCandle(o, c, Math.max(o, c) + wU, Math.min(o, c) - wD));
    p = c;
  }
  return p;
}

function scnPullbackBull(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 1 + rng() * 0.3;
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.5) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.2) * m, (0.13 + rng() * 0.15) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o - (0.25 + rng() * 0.35) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  const swingLow = Math.min(...past.slice(-5).map((k) => k.l));
  const entry = p;
  const sp = spread(d);
  buildBuyFuture(rng, m, entry, sp, fut);
  return finalize({
    past, fut,
    zones: [{ kind: "support", y1: swingLow - 0.04, y2: swingLow + 0.04, label: "Swing low" }],
    entry,
    tp: entry + 3.5 * m,
    direction: "BUY",
    tight:   { price: entry - sp.tight * m,   rationale: TIGHT_RATIONALE },
    logical: { price: entry - sp.logical * m, rationale: LOGICAL_RATIONALE },
    wide:    { price: entry - sp.wide * m,    rationale: WIDE_RATIONALE },
  });
}

function scnPullbackBear(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 10 - rng() * 0.3;
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.5) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.15) * m, (0.18 + rng() * 0.2) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o + (0.25 + rng() * 0.35) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  const swingHigh = Math.max(...past.slice(-5).map((k) => k.h));
  const entry = p;
  const sp = spread(d);
  buildSellFuture(rng, m, entry, sp, fut);
  return finalize({
    past, fut,
    zones: [{ kind: "resistance", y1: swingHigh - 0.04, y2: swingHigh + 0.04, label: "Swing high" }],
    entry,
    tp: entry - 3.5 * m,
    direction: "SELL",
    tight:   { price: entry + sp.tight * m,   rationale: TIGHT_RATIONALE },
    logical: { price: entry + sp.logical * m, rationale: LOGICAL_RATIONALE },
    wide:    { price: entry + sp.wide * m,    rationale: WIDE_RATIONALE },
  });
}

function scnBounceSupport(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const S = 1;
  let p = 5 + rng() * 0.4;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = clamp(o - (0.5 + rng() * 0.5) * m, S + 0.4, 6);
    past.push(candle(o, c, (0.15 + rng() * 0.18) * m, (0.18 + rng() * 0.25) * m));
    p = c;
  }
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.3) * 0.6 * m, S + 0.4, S + 1.3);
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.7 + rng() * 0.3) * m));
    p = c;
  }
  const entry = p;
  const sp = spread(d);
  buildBuyFuture(rng, m, entry, sp, fut);
  return finalize({
    past, fut,
    zones: [{ kind: "support", y1: S - 0.1, y2: S + 0.1, label: "Support HTF" }],
    entry,
    tp: entry + 3.5 * m,
    direction: "BUY",
    tight:   { price: entry - sp.tight * m,   rationale: TIGHT_RATIONALE },
    logical: { price: entry - sp.logical * m, rationale: LOGICAL_RATIONALE },
    wide:    { price: entry - sp.wide * m,    rationale: WIDE_RATIONALE },
  });
}

function scnRejectionResistance(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const R = 10;
  let p = 5 - rng() * 0.4;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = clamp(o + (0.5 + rng() * 0.5) * m, 4, R - 0.4);
    past.push(candle(o, c, (0.18 + rng() * 0.25) * m, (0.15 + rng() * 0.18) * m));
    p = c;
  }
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.7) * 0.6 * m, R - 1.3, R - 0.4);
    past.push(candle(o, c, (0.7 + rng() * 0.3) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  const entry = p;
  const sp = spread(d);
  buildSellFuture(rng, m, entry, sp, fut);
  return finalize({
    past, fut,
    zones: [{ kind: "resistance", y1: R - 0.1, y2: R + 0.1, label: "Résistance HTF" }],
    entry,
    tp: entry - 3.5 * m,
    direction: "SELL",
    tight:   { price: entry + sp.tight * m,   rationale: TIGHT_RATIONALE },
    logical: { price: entry + sp.logical * m, rationale: LOGICAL_RATIONALE },
    wide:    { price: entry + sp.wide * m,    rationale: WIDE_RATIONALE },
  });
}

function scnFakeoutAboveResistance(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  // Pour ce scénario, la structure du piège (fakeout au-dessus de R) impose
  // des positions spécifiques :
  //   - tight = DANS le wick du fakeout (entre R et fakeoutHigh)
  //   - logical = juste au-dessus du fakeoutHigh
  //   - wide = bien au-dessus de fakeoutHigh
  // On dimensionne pour que future = drop confirmant le piège (mais 1er
  // candle du futur fait un petit retest pour balayer tight uniquement).
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const R = 10;
  let p = 6 + rng() * 0.3;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = clamp(o + (0.3 + rng() * 0.4) * m, 5, R - 0.5);
    past.push(candle(o, c, (0.18 + rng() * 0.2) * m, (0.15 + rng() * 0.18) * m));
    p = c;
  }
  // Fakeout (la zone du piège = wick au-dessus de R)
  const fakeoutHigh = R + 1.4 * m + rng() * 0.4;
  past.push({ o: p, c: R - 0.4 - rng() * 0.3, h: fakeoutHigh, l: p - 0.2 });
  p = past[past.length - 1].c;
  // 2 candles confirmant
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o - (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.18) * m, (0.2 + rng() * 0.22) * m));
    p = c;
  }
  const entry = p;
  // Positions des stops (distances depuis entry, en respectant le piège)
  const tightPrice   = R + (fakeoutHigh - R) * 0.4;   // DANS la zone du piège
  const logicalPrice = fakeoutHigh + 0.4 * m;         // au-dessus du wick
  const widePrice    = fakeoutHigh + 2.0 * m;         // bien au-dessus
  // Future : 1er candle = retest qui rebondit dans la zone tight (sweep tight)
  // sans dépasser logical, puis drop violent.
  const retestHigh = tightPrice + 0.15 * m;
  fut.push(explicitCandle(p, R - 0.5 * m, retestHigh, p - 0.2 * m));
  p = R - 0.5 * m;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.6) * m;
    fut.push(candle(o, c, (0.13 + rng() * 0.15) * m, (0.18 + rng() * 0.25) * m));
    p = c;
  }
  void d;
  return finalize({
    past, fut,
    zones: [
      { kind: "resistance",     y1: R - 0.1,            y2: R + 0.1,            label: "Résistance" },
      { kind: "liquidity_high", y1: R + 0.15,           y2: fakeoutHigh,        label: "Wick fakeout" },
    ],
    entry,
    // TP étendu pour garantir RR_logical >= 2 sur ce setup où la structure
    // pousse logical loin de l'entry.
    tp: entry - Math.max(3.5 * m, Math.abs(entry - logicalPrice) * 2.2),
    direction: "SELL",
    tight:   { price: tightPrice,   rationale: "✗ Stop dans la zone du piège — pile dans la zone que les institutionnels viennent d'utiliser pour ramasser la liquidité. Le 2e test va te balayer." },
    logical: { price: logicalPrice, rationale: "✓ Au-dessus du pic du fakeout, avec marge. C'est la VRAIE invalidation du piège — si le prix repasse là, le scénario est cassé." },
    wide:    { price: widePrice,    rationale: WIDE_RATIONALE },
  });
}

function scnSweepLowReversal(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  // tight = DANS la zone du sweep (entre sweepLow et L)
  // logical = sous la mèche du sweep + marge
  // wide = bien plus bas
  // future : 1er candle retest qui dip dans la zone sweep (sweep tight) sans
  //   atteindre logical, puis rallye.
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const L = 1;
  let p = 4 + rng() * 0.3;
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o - (0.3 + rng() * 0.4) * m, L + 0.5, 4.5);
    past.push(candle(o, c, (0.18 + rng() * 0.18) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 0.6 * m, L + 0.5, L + 1.5);
    past.push(candle(o, c, (0.22 + rng() * 0.2) * m, (0.22 + rng() * 0.2) * m));
    p = c;
  }
  const sweepLow = L - 1.2 * m - rng() * 0.3;
  past.push({ o: p, c: L + 0.4 + rng() * 0.3, h: p + 0.2, l: sweepLow });
  p = past[past.length - 1].c;
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  const entry = p;
  const tightPrice   = L - (L - sweepLow) * 0.4;
  const logicalPrice = sweepLow - 0.4 * m;
  const widePrice    = sweepLow - 1.8 * m;
  // Future : retest qui dip dans la zone du sweep (touch tight) sans
  //   atteindre logical, puis rallye
  const retestLow = tightPrice - 0.15 * m;
  fut.push(explicitCandle(p, L + 0.5 * m, p + 0.2 * m, retestLow));
  p = L + 0.5 * m;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.55) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.22) * m, (0.13 + rng() * 0.15) * m));
    p = c;
  }
  void d;
  return finalize({
    past, fut,
    zones: [
      { kind: "support",       y1: L - 0.1,        y2: L + 0.1,        label: "Précédent low"     },
      { kind: "liquidity_low", y1: sweepLow,       y2: L - 0.15,       label: "Liquidité balayée" },
    ],
    entry,
    tp: entry + Math.max(3.5 * m, Math.abs(entry - logicalPrice) * 2.2),
    direction: "BUY",
    tight:   { price: tightPrice,   rationale: "✗ Stop DANS la zone du sweep — exactement là où les institutionnels viennent de ramasser la liquidité. Le retest va te chercher." },
    logical: { price: logicalPrice, rationale: "✓ Sous la mèche du sweep, avec marge. Le low du sweep est la nouvelle invalidation — protégé contre un 2e ramassage." },
    wide:    { price: widePrice,    rationale: WIDE_RATIONALE },
  });
}

function scnFvgContinuation(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  // tight = DANS le FVG (zone exposée à mitigation profonde)
  // logical = sous le bas du FVG
  // wide = bien plus bas
  // future : 1er candle dip qui traverse partiellement le FVG (touch tight)
  //   sans aller en dessous, puis rallye.
  const past: Candle[] = [];
  const fut: Candle[] = [];
  let p = 2 + rng() * 0.3;
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o + (rng() - 0.4) * 0.4 * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  const baseHigh = Math.max(...past.slice(-3).map((k) => k.h));
  past.push(candle(p, p + (2.0 + rng() * 0.3) * m, (0.3 + rng() * 0.2) * m, 0.12));
  p = past[past.length - 1].c;
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.25 + rng() * 0.25) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.1) * m));
    p = c;
  }
  const fvgLow = baseHigh;
  const fvgHigh = past[past.length - 2].l;
  // Pullback dans le FVG (mitigation partielle)
  const target = (fvgLow + fvgHigh) / 2;
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = Math.max(target, o - (0.3 + rng() * 0.3) * m);
    past.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.18 + rng() * 0.18) * m));
    p = c;
  }
  // Réaction visible
  past.push(candle(p, p + 0.2 * m, (0.2 + rng() * 0.15) * m, (0.15 + rng() * 0.15) * m));
  p = past[past.length - 1].c;
  const entry = p;
  const tightPrice   = fvgLow + (fvgHigh - fvgLow) * 0.3;
  const logicalPrice = fvgLow - 0.4 * m;
  const widePrice    = fvgLow - 2.0 * m;
  // Future : dip qui descend juste dans la zone tight (touch tight, pas logical)
  const dipLow = tightPrice - 0.1 * m;
  fut.push(explicitCandle(p, fvgLow + 0.2 * m, p + (0.1 + rng() * 0.1) * m, dipLow));
  p = fvgLow + 0.2 * m;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.5) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.22) * m, (0.13 + rng() * 0.15) * m));
    p = c;
  }
  void d;
  return finalize({
    past, fut,
    zones: [{ kind: "fvg", y1: fvgLow, y2: fvgHigh, label: "FVG haussier" }],
    entry,
    tp: entry + Math.max(3.5 * m, Math.abs(entry - logicalPrice) * 2.2),
    direction: "BUY",
    tight:   { price: tightPrice,   rationale: "✗ Stop DANS le FVG — la zone est précisément celle où le marché peut retourner pour finir sa mitigation. Tu seras pris dans la profondeur de la zone." },
    logical: { price: logicalPrice, rationale: "✓ Sous le bas du FVG avec marge. Le FVG entièrement traversé = invalidation propre. C'est le placement structurel correct." },
    wide:    { price: widePrice,    rationale: WIDE_RATIONALE },
  });
}

function scnHighVolPullback(rng: () => number, m: number, d: Difficulty): PlaceStopChart {
  // Vol élevée : tous les écarts sont multipliés par volMult. Le tight devient
  // particulièrement trompeur (taille "normale" mais dans le bruit amplifié).
  const past: Candle[] = [];
  const fut: Candle[] = [];
  const volMult = 1.6;
  const effM = m * volMult;
  let p = 1 + rng() * 0.3;
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o + (0.5 + rng() * 0.6) * effM;
    past.push(candle(o, c, (0.4 + rng() * 0.3) * effM, (0.3 + rng() * 0.25) * effM));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.5) * effM;
    past.push(candle(o, c, (0.3 + rng() * 0.25) * effM, (0.4 + rng() * 0.3) * effM));
    p = c;
  }
  const swingLow = Math.min(...past.slice(-5).map((k) => k.l));
  const entry = p;
  // En vol élevée, le tight "normal" (~0.5m) est dans le bruit, le logical
  // doit être doublé (~1.5m), le wide encore plus loin.
  const tightDist   = 0.5 * effM;
  const logicalDist = 1.5 * effM;
  const wideDist    = 3.5 * effM;
  const tightPrice   = entry - tightDist;
  const logicalPrice = entry - logicalDist;
  const widePrice    = entry - wideDist;
  // Future : dip large (vol élevée) qui sweep tight sans toucher logical
  const dipLow = tightPrice - 0.15 * effM;
  const dipClose = entry - tightDist * 0.6;
  fut.push(explicitCandle(p, dipClose, p + (0.2 + rng() * 0.15) * effM, dipLow));
  p = dipClose;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.5) * effM;
    fut.push(candle(o, c, (0.3 + rng() * 0.25) * effM, (0.2 + rng() * 0.2) * effM));
    p = c;
  }
  void d;
  return finalize({
    past, fut,
    zones: [{ kind: "support", y1: swingLow - 0.05, y2: swingLow + 0.05, label: "Swing low" }],
    entry,
    tp: entry + 3.5 * effM,  // TP élargi aussi (proportionnel à la vol)
    direction: "BUY",
    tight:   { price: tightPrice,   rationale: "✗ Stop 'standard' — qui serait OK en vol normale, mais en vol élevée ce niveau est dans le bruit. La 1re bougie de retest, large à cause de la vol, va te balayer." },
    logical: { price: logicalPrice, rationale: "✓ Stop élargi à la volatilité du marché. Ce qui ressemble à un 'wide stop' en vol normale est en fait le LOGIQUE ici — il survit au noise amplifié sans tuer le RR (TP également plus loin)." },
    wide:    { price: widePrice,    rationale: "≈ Survie garantie, mais même avec un TP étendu en vol élevée, le RR descend sous 1.5. Capital mal utilisé." },
  });
}

// ─── Build chart ──────────────────────────────────────────────────────────────

export function buildPlaceStopChart(
  setup: PlaceStopSetupKey,
  seed: number,
  volatility: Volatility,
  difficulty: Difficulty,
): PlaceStopChart {
  const rng = mulberry32(seed);
  const m = VOL_MULT[volatility];
  switch (setup) {
    case "pullback_bull":             return scnPullbackBull(rng, m, difficulty);
    case "pullback_bear":             return scnPullbackBear(rng, m, difficulty);
    case "bounce_support":            return scnBounceSupport(rng, m, difficulty);
    case "rejection_resistance":      return scnRejectionResistance(rng, m, difficulty);
    case "fakeout_above_resistance":  return scnFakeoutAboveResistance(rng, m, difficulty);
    case "sweep_low_reversal":        return scnSweepLowReversal(rng, m, difficulty);
    case "fvg_continuation":          return scnFvgContinuation(rng, m, difficulty);
    case "high_vol_pullback":         return scnHighVolPullback(rng, m, difficulty);
  }
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

export interface ScoreResult {
  points:      number;
  streakBonus: number;
  type:        StopType;
  correct:     boolean;
  // Stop hit during reveal (par id de stop)
  hitMap:      Record<StopId, number | null>;  // null si survécu, sinon index de la candle
}

function isHit(stop: number, direction: TradeDirection, future: Candle[]): number | null {
  for (let i = 0; i < future.length; i++) {
    const k = future[i];
    if (direction === "BUY"  && k.l <= stop) return i;
    if (direction === "SELL" && k.h >= stop) return i;
  }
  return null;
}

export function computeHits(chart: PlaceStopChart): Record<StopId, number | null> {
  const out: Record<StopId, number | null> = { A: null, B: null, C: null };
  for (const s of chart.stops) {
    out[s.id] = isHit(s.price, chart.direction, chart.future);
  }
  return out;
}

export function scoreStopChoice(chosenId: StopId, chart: PlaceStopChart, currentStreak: number): ScoreResult {
  const chosen = chart.stops.find((s) => s.id === chosenId)!;
  const hitMap = computeHits(chart);
  let points = 0;
  let streakBonus = 0;
  switch (chosen.type) {
    case "logical":   points = 100; if (currentStreak >= 2) streakBonus = 30; break;
    case "wide":      points = 30; break;
    case "tight":     points = -50; break;
    case "liquidity": points = -100; break;
  }
  return {
    points: points + streakBonus,
    streakBonus,
    type: chosen.type,
    correct: chosen.type === "logical",
    hitMap,
  };
}

// ─── Verdicts ─────────────────────────────────────────────────────────────────

export const STOP_TYPE_META: Record<StopType, { label: string; color: "emerald" | "amber" | "red" }> = {
  logical:   { label: "Stop logique",     color: "emerald" },
  wide:      { label: "Stop trop large",  color: "amber"   },
  tight:     { label: "Stop trop serré",  color: "red"     },
  liquidity: { label: "Stop en liquidité", color: "red"    },
};

export const DIFFICULTY_META: Record<Difficulty, { label: string; dotClass: string; textClass: string; description: string }> = {
  beginner: {
    label:       "Débutant",
    dotClass:    "bg-emerald-400",
    textClass:   "text-emerald-400",
    description: "Structure claire, stop logique évident, sweep très visible.",
  },
  intermediate: {
    label:       "Intermédiaire",
    dotClass:    "bg-blue-400",
    textClass:   "text-blue-400",
    description: "Volatilité plus sale, plusieurs stops plausibles, tight stop tentant.",
  },
  advanced: {
    label:       "Avancé",
    dotClass:    "bg-amber-400",
    textClass:   "text-amber-400",
    description: "Marché ambigu, sweep partiel, arbitrage survie / invalidation / RR.",
  },
};

export function sessionVerdict(score: number, logicalCount: number, total: number): string {
  if (logicalCount >= total - 1) return "Stop sniper";
  if (score >= 700)              return "Bonne protection";
  if (score >= 300)              return "Lecture solide";
  if (score >= 0)                return "À polir";
  if (score >= -200)             return "Trop émotionnel";
  return "Tu donnes ton SL au marché";
}
