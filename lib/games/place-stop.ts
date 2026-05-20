// Mini-jeu n°2 : Place ton Stop.
// Mêmes briques que buy-sell-no-trade (shared.ts) — types de bougies, PRNG,
// pools de variation. Spécifique au jeu : templates de setups, génération
// de candles passées + futures, méta-données de zones de stop, scoring.

import {
  type Asset, type Session, type Volatility, type Spread,
  type HtfBias, type MacroContext,
  type Candle, type ChartZone,
  VOL_MULT, mulberry32, pick, clamp, candle,
} from "./shared";

export type { Asset, Session, Volatility, Spread, HtfBias, MacroContext };

// ─── Types ────────────────────────────────────────────────────────────────────

export type PlaceStopSetupKey =
  | "pullback_bull"
  | "pullback_bear"
  | "bounce_support"
  | "rejection_resistance"
  | "fake_breakout"
  | "liquidity_sweep"
  | "tight_range"
  | "vol_expansion"
  | "fvg_continuation"
  | "news_trap"
  | "double_top_sweep"
  | "clean_breakout";

export type StopVerdict = "perfect" | "good" | "wide" | "tight" | "liquidity";
export type TradeDirection = "BUY" | "SELL";

export interface PlaceStopTemplate {
  id:            PlaceStopSetupKey;
  title:         string;
  direction:     TradeDirection;
  htfBias:       HtfBias;
  macroContext:  MacroContext;
  context:       string;
  explanation:   string;
  tag:           string;
}

export interface PlaceStopInstance extends PlaceStopTemplate {
  asset:      Asset;
  session:    Session;
  volatility: Volatility;
  spread:     Spread;
  seed:       number;
}

export interface StopMeta {
  ideal:      { min: number; max: number };
  acceptable: { min: number; max: number };
  liquidity:  { min: number; max: number } | null;
  bounds:     { min: number; max: number };
  defaultStop: number;
}

export interface PlaceStopChart {
  pastCandles:   Candle[];
  futureCandles: Candle[];
  zones:         ChartZone[];
  domain:        { min: number; max: number };
  entry:         number;
  tp:            number | null;
  direction:     TradeDirection;
  stopMeta:      StopMeta;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

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
    context: "Tendance haussière en place, le prix corrige sur la zone de demande. Tu es entré au rebond.",
    explanation: "Le stop logique se place sous le swing low de la correction, avec une petite marge pour le bruit. Trop juste = bruit qui balaie. Pile sur le low = liquidité évidente.",
    tag: "structure",
  },
  {
    id: "pullback_bear",
    title: "Pullback en tendance baissière",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Tendance baissière en place, le prix rebondit sur une zone d'offre. Tu es entré court.",
    explanation: "Le stop va au-dessus du swing high de la correction, légèrement à l'écart pour absorber le bruit. Coller sur le high = stop hunt assuré.",
    tag: "structure",
  },
  {
    id: "bounce_support",
    title: "Rebond sur support majeur",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le prix vient de rebondir sur un support majeur testé plusieurs fois.",
    explanation: "Stop sous le support avec une marge réaliste. Pile au niveau du support = ramassage de liquidité. Trop loin = RR cassé.",
    tag: "lecture",
  },
  {
    id: "rejection_resistance",
    title: "Rejet sur résistance majeure",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Le prix vient de rejeter une résistance majeure avec mèches hautes.",
    explanation: "Stop au-dessus de la mèche la plus haute, avec une marge. Coller le niveau = stop saute, trop loin = RR atrocе.",
    tag: "lecture",
  },
  {
    id: "fake_breakout",
    title: "Faux breakout — short après rejet",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Le prix a piqué au-dessus de la résistance puis a refermé sous. Tu shortes le piège.",
    explanation: "Stop au-dessus du pic du fakeout, avec une marge — surtout pas DANS la zone du piège. Trop serré = re-test possible te sort.",
    tag: "piège",
  },
  {
    id: "liquidity_sweep",
    title: "Sweep de liquidité puis retournement",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le prix vient de balayer la liquidité sous le précédent low puis a fait demi-tour.",
    explanation: "Le sweep a déjà eu lieu — ton stop va SOUS le low du sweep, jamais dedans. C'est la zone que le marché vient de prendre.",
    tag: "piège",
  },
  {
    id: "tight_range",
    title: "Range serré — entrée bas de range",
    direction: "BUY",
    htfBias: "range",
    macroContext: "normal",
    context: "Le prix oscille dans un range serré. Tu achètes le plancher pour viser le plafond.",
    explanation: "Stop sous le plancher du range avec marge minimaliste — c'est un range, pas une tendance. RR doit rester serré.",
    tag: "structure",
  },
  {
    id: "vol_expansion",
    title: "Expansion de volatilité",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Les bougies s'agrandissent — la volatilité explose. Tu prends le momentum à la hausse.",
    explanation: "Volatilité élevée = stop wider obligatoire. Un stop standard se fait balayer par le bruit normal.",
    tag: "volatilité",
  },
  {
    id: "fvg_continuation",
    title: "FVG haussier en continuation",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Un FVG haussier laissé par l'impulsion. Le prix revient le tester et tu entres au rebond.",
    explanation: "Le stop va sous le bas du FVG. Dans le FVG = exposé à un re-test profond. Trop loin = RR ruiné.",
    tag: "lecture",
  },
  {
    id: "news_trap",
    title: "Piège de volatilité — news imminente",
    direction: "BUY",
    htfBias: "range",
    macroContext: "dangereux",
    context: "News macro dans quelques minutes. Tu décides quand même de prendre le trade — sois lucide sur le stop.",
    explanation: "Avant une news, la volatilité est imprévisible. Un stop ne peut pas être logique structurellement — il doit être très large ou tu ne devrais pas trader. La vraie discipline c'était de passer ton tour.",
    tag: "discipline",
  },
  {
    id: "double_top_sweep",
    title: "Double top + sweep",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Double top avec la 2e bougie qui balaie le 1er high. Le retournement est confirmé.",
    explanation: "Stop au-dessus de la mèche du sweep, jamais entre les deux highs (zone de liquidité prise par l'institutionnel).",
    tag: "piège",
  },
  {
    id: "clean_breakout",
    title: "Breakout propre + pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "La résistance vient d'être cassée nettement, puis le prix pullback sur l'ancienne résistance (devenue support).",
    explanation: "Stop sous le niveau cassé avec marge — c'est la nouvelle zone de demande. Au-dessus = stop trop serré, dans la zone = trop dangereux.",
    tag: "structure",
  },
];

// ─── Variations & instance ────────────────────────────────────────────────────

export function generatePlaceStopScenarios(seed: number): PlaceStopInstance[] {
  const rng = mulberry32(seed);
  const shuffled = [...PLACE_STOP_TEMPLATES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, ROUNDS_PER_SESSION).map((tmpl, i) => {
    // News scenario force "élevée" + spread élevé pour cohérence pédagogique
    const isNews = tmpl.id === "news_trap";
    return {
      ...tmpl,
      asset:      pick(ASSETS, rng),
      session:    pick(SESSIONS, rng),
      volatility: isNews ? "élevée" : pick(VOLATILITIES, rng),
      spread:     isNews ? "élevé"  : pick(SPREADS, rng),
      seed:       (seed + i * 9973) >>> 0,
    };
  });
}

// ─── Helpers de génération ────────────────────────────────────────────────────

interface RawScenario {
  past:      Candle[];
  fut:       Candle[];
  zones:     ChartZone[];
  entry:     number;
  tp:        number | null;
  direction: TradeDirection;
  meta:      StopMeta;
}

function finishScenario(raw: RawScenario): PlaceStopChart {
  const all = [...raw.past, ...raw.fut];
  const vals: number[] = [
    raw.entry,
    raw.meta.bounds.min,
    raw.meta.bounds.max,
  ];
  if (raw.tp !== null) vals.push(raw.tp);
  if (raw.meta.liquidity) vals.push(raw.meta.liquidity.min, raw.meta.liquidity.max);
  vals.push(raw.meta.ideal.min, raw.meta.ideal.max);
  for (const k of all) { vals.push(k.h, k.l); }
  for (const z of raw.zones) { vals.push(z.y1, z.y2); }

  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = (max - min) * 0.08 || 1;

  return {
    pastCandles:   raw.past,
    futureCandles: raw.fut,
    zones:         raw.zones,
    entry:         raw.entry,
    tp:            raw.tp,
    direction:     raw.direction,
    stopMeta:      raw.meta,
    domain:        { min: min - pad, max: max + pad },
  };
}

// ─── 12 générateurs de scénarios ─────────────────────────────────────────────

function scnPullbackBull(rng: () => number, m: number): PlaceStopChart {
  const past: Candle[] = [];
  const fut:  Candle[] = [];
  let p = 0.5 + rng() * 0.3;
  // Phase 1 : 8 candles uptrend
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o + (0.45 + rng() * 0.55) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.22) * m, (0.13 + rng() * 0.18) * m));
    p = c;
  }
  const peak = p;
  // Phase 2 : 4 candles pullback
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o - (0.22 + rng() * 0.35) * m;
    past.push(candle(o, c, (0.17 + rng() * 0.18) * m, (0.18 + rng() * 0.22) * m));
    p = c;
  }
  const swingLow = Math.min(...past.slice(-5).map(k => k.l));
  const entry = p;
  // Phase 3 : 6 future candles, dip puis reprise
  const dip = candle(p, p - 0.18 * m, (0.15 + rng() * 0.15) * m, (0.35 + rng() * 0.2) * m);
  fut.push(dip); p = dip.c;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.42 + rng() * 0.6) * m;
    fut.push(candle(o, c, (0.18 + rng() * 0.25) * m, (0.13 + rng() * 0.18) * m));
    p = c;
  }

  const idealCenter = swingLow - 0.55 * m;
  const meta: StopMeta = {
    ideal:      { min: idealCenter - 0.22 * m, max: idealCenter + 0.18 * m },
    acceptable: { min: idealCenter - 0.5 * m,  max: idealCenter + 0.4 * m  },
    liquidity:  { min: swingLow - 0.12 * m,    max: swingLow + 0.1 * m     },
    bounds:     { min: entry - 3.2 * m,        max: entry - 0.08 * m       },
    defaultStop: idealCenter,
  };

  return finishScenario({
    past, fut,
    zones: [
      { kind: "support", y1: swingLow - 0.04, y2: swingLow + 0.04, label: "Swing low" },
    ],
    entry,
    tp: entry + (peak - swingLow) * 1.5,
    direction: "BUY",
    meta,
  });
}

function scnPullbackBear(rng: () => number, m: number): PlaceStopChart {
  const past: Candle[] = [];
  const fut:  Candle[] = [];
  let p = 10 - rng() * 0.3;
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o - (0.45 + rng() * 0.55) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.18) * m, (0.18 + rng() * 0.22) * m));
    p = c;
  }
  const bottom = p;
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o + (0.22 + rng() * 0.35) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.22) * m, (0.17 + rng() * 0.18) * m));
    p = c;
  }
  const swingHigh = Math.max(...past.slice(-5).map(k => k.h));
  const entry = p;
  const bump = candle(p, p + 0.18 * m, (0.35 + rng() * 0.2) * m, (0.15 + rng() * 0.15) * m);
  fut.push(bump); p = bump.c;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.42 + rng() * 0.6) * m;
    fut.push(candle(o, c, (0.13 + rng() * 0.18) * m, (0.18 + rng() * 0.25) * m));
    p = c;
  }

  const idealCenter = swingHigh + 0.55 * m;
  const meta: StopMeta = {
    ideal:      { min: idealCenter - 0.18 * m, max: idealCenter + 0.22 * m },
    acceptable: { min: idealCenter - 0.4 * m,  max: idealCenter + 0.5 * m  },
    liquidity:  { min: swingHigh - 0.1 * m,    max: swingHigh + 0.12 * m   },
    bounds:     { min: entry + 0.08 * m,       max: entry + 3.2 * m        },
    defaultStop: idealCenter,
  };

  return finishScenario({
    past, fut,
    zones: [
      { kind: "resistance", y1: swingHigh - 0.04, y2: swingHigh + 0.04, label: "Swing high" },
    ],
    entry,
    tp: entry - (swingHigh - bottom) * 1.5,
    direction: "SELL",
    meta,
  });
}

function scnBounceSupport(rng: () => number, m: number): PlaceStopChart {
  const past: Candle[] = [];
  const fut:  Candle[] = [];
  const S = 1;
  let p = 5 + rng() * 0.5;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = clamp(o - (0.5 + rng() * 0.5) * m, S + 0.5, 6);
    past.push(candle(o, c, (0.15 + rng() * 0.18) * m, (0.18 + rng() * 0.25) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.2) * 0.5 * m, S + 0.3, S + 1.4);
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (1.0 + rng() * 0.4) * m));
    p = c;
  }
  const entry = p;
  const dip = candle(p, p - 0.1 * m, (0.15 + rng() * 0.15) * m, (0.4 + rng() * 0.2) * m);
  fut.push(dip); p = dip.c;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.55) * m;
    fut.push(candle(o, c, (0.18 + rng() * 0.25) * m, (0.13 + rng() * 0.18) * m));
    p = c;
  }

  const idealCenter = S - 0.5 * m;
  const meta: StopMeta = {
    ideal:      { min: idealCenter - 0.22 * m, max: idealCenter + 0.18 * m },
    acceptable: { min: idealCenter - 0.5 * m,  max: idealCenter + 0.42 * m },
    liquidity:  { min: S - 0.12 * m,           max: S + 0.1 * m            },
    bounds:     { min: entry - 3.0 * m,        max: entry - 0.08 * m       },
    defaultStop: idealCenter,
  };

  return finishScenario({
    past, fut,
    zones: [
      { kind: "support", y1: S - 0.1, y2: S + 0.1, label: "Support majeur" },
    ],
    entry,
    tp: entry + 3 * m,
    direction: "BUY",
    meta,
  });
}

function scnRejectionResistance(rng: () => number, m: number): PlaceStopChart {
  const past: Candle[] = [];
  const fut:  Candle[] = [];
  const R = 10;
  let p = 5 - rng() * 0.5;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = clamp(o + (0.5 + rng() * 0.5) * m, 4, R - 0.5);
    past.push(candle(o, c, (0.18 + rng() * 0.25) * m, (0.15 + rng() * 0.18) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.8) * 0.5 * m, R - 1.4, R - 0.3);
    past.push(candle(o, c, (1.0 + rng() * 0.4) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  const swingHigh = Math.max(...past.slice(-6).map(k => k.h));
  const entry = p;
  const bump = candle(p, p + 0.1 * m, (0.4 + rng() * 0.2) * m, (0.15 + rng() * 0.15) * m);
  fut.push(bump); p = bump.c;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.55) * m;
    fut.push(candle(o, c, (0.13 + rng() * 0.18) * m, (0.18 + rng() * 0.25) * m));
    p = c;
  }

  const idealCenter = swingHigh + 0.45 * m;
  const meta: StopMeta = {
    ideal:      { min: idealCenter - 0.18 * m, max: idealCenter + 0.22 * m },
    acceptable: { min: idealCenter - 0.4 * m,  max: idealCenter + 0.5 * m  },
    liquidity:  { min: R - 0.12 * m,           max: R + 0.1 * m            },
    bounds:     { min: entry + 0.08 * m,       max: entry + 3.0 * m        },
    defaultStop: idealCenter,
  };

  return finishScenario({
    past, fut,
    zones: [
      { kind: "resistance", y1: R - 0.1, y2: R + 0.1, label: "Résistance majeure" },
    ],
    entry,
    tp: entry - 3 * m,
    direction: "SELL",
    meta,
  });
}

function scnFakeBreakout(rng: () => number, m: number): PlaceStopChart {
  const past: Candle[] = [];
  const fut:  Candle[] = [];
  const R = 10;
  let p = 6 + rng() * 0.3;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = clamp(o + (0.3 + rng() * 0.4) * m, 5, R - 0.5);
    past.push(candle(o, c, (0.18 + rng() * 0.2) * m, (0.15 + rng() * 0.18) * m));
    p = c;
  }
  // Fakeout candle : énorme mèche haute, close en-dessous
  const fO = p;
  const fakeoutHigh = R + 1.4 * m + rng() * 0.4;
  const fC = R - 0.4 - rng() * 0.3;
  past.push({ o: fO, c: fC, h: fakeoutHigh, l: fO - 0.2 });
  p = fC;
  // 2 candles confirmant le retour sous la résistance
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o - (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.18) * m, (0.2 + rng() * 0.22) * m));
    p = c;
  }
  const entry = p;
  // Future : drop net
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.6) * m;
    fut.push(candle(o, c, (0.13 + rng() * 0.15) * m, (0.18 + rng() * 0.25) * m));
    p = c;
  }

  const idealCenter = fakeoutHigh + 0.3 * m;
  const meta: StopMeta = {
    ideal:      { min: idealCenter - 0.18 * m, max: idealCenter + 0.22 * m },
    acceptable: { min: idealCenter - 0.4 * m,  max: idealCenter + 0.5 * m  },
    liquidity:  { min: R + 0.1 * m,            max: fakeoutHigh + 0.05 * m },
    bounds:     { min: entry + 0.08 * m,       max: entry + 4.0 * m        },
    defaultStop: idealCenter,
  };

  return finishScenario({
    past, fut,
    zones: [
      { kind: "resistance",     y1: R - 0.1,             y2: R + 0.1,             label: "Résistance (piège)" },
      { kind: "liquidity_high", y1: R + 0.15 * m,         y2: fakeoutHigh,         label: "Liquidité prise"    },
    ],
    entry,
    tp: entry - 4 * m,
    direction: "SELL",
    meta,
  });
}

function scnLiquiditySweep(rng: () => number, m: number): PlaceStopChart {
  const past: Candle[] = [];
  const fut:  Candle[] = [];
  const S = 1;
  let p = 3 + rng() * 0.3;
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o - (0.2 + rng() * 0.35) * m, S + 0.4, 4);
    past.push(candle(o, c, (0.17 + rng() * 0.18) * m, (0.17 + rng() * 0.2) * m));
    p = c;
  }
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 0.5 * m, S + 0.5, S + 1.4);
    past.push(candle(o, c, (0.18 + rng() * 0.18) * m, (0.18 + rng() * 0.18) * m));
    p = c;
  }
  // Sweep candle : longue mèche basse, close au-dessus
  const sO = p;
  const sweepLow = S - 1.4 * m - rng() * 0.4;
  const sC = S + 0.4 + rng() * 0.3;
  past.push({ o: sO, c: sC, h: sO + 0.2, l: sweepLow });
  p = sC;
  // 2 candles confirmant
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.22) * m, (0.15 + rng() * 0.18) * m));
    p = c;
  }
  const entry = p;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.6) * m;
    fut.push(candle(o, c, (0.18 + rng() * 0.25) * m, (0.13 + rng() * 0.15) * m));
    p = c;
  }

  const idealCenter = sweepLow - 0.3 * m;
  const meta: StopMeta = {
    ideal:      { min: idealCenter - 0.22 * m, max: idealCenter + 0.18 * m },
    acceptable: { min: idealCenter - 0.5 * m,  max: idealCenter + 0.4 * m  },
    liquidity:  { min: sweepLow - 0.05 * m,    max: S - 0.1 * m            },
    bounds:     { min: entry - 4.0 * m,        max: entry - 0.08 * m       },
    defaultStop: idealCenter,
  };

  return finishScenario({
    past, fut,
    zones: [
      { kind: "support",        y1: S - 0.1,             y2: S + 0.1,             label: "Précédent low"     },
      { kind: "liquidity_low",  y1: sweepLow,            y2: S - 0.15 * m,        label: "Liquidité balayée" },
    ],
    entry,
    tp: entry + 4 * m,
    direction: "BUY",
    meta,
  });
}

function scnTightRange(rng: () => number, m: number): PlaceStopChart {
  const past: Candle[] = [];
  const fut:  Candle[] = [];
  const S = 2;
  const R = 6;
  const mid = (S + R) / 2;
  let p = mid + (rng() - 0.5);
  for (let i = 0; i < 14; i++) {
    const o = p;
    const pull = (mid - o) * 0.2;
    let c = o + pull + (rng() - 0.5) * 1.2 * m;
    c = clamp(c, S + 0.3, R - 0.3);
    past.push(candle(o, c, (0.2 + rng() * 0.25) * m, (0.2 + rng() * 0.25) * m));
    p = c;
  }
  // Entry au bas du range (BUY le plancher)
  const entry = S + 0.25;
  // Future : rebond vers le plafond
  let fp = entry;
  for (let i = 0; i < 6; i++) {
    const o = fp;
    const c = clamp(o + (0.3 + rng() * 0.4) * m, S + 0.4, R - 0.2);
    fut.push(candle(o, c, (0.18 + rng() * 0.18) * m, (0.18 + rng() * 0.18) * m));
    fp = c;
  }

  const idealCenter = S - 0.3 * m;
  const meta: StopMeta = {
    ideal:      { min: idealCenter - 0.15 * m, max: idealCenter + 0.15 * m },
    acceptable: { min: idealCenter - 0.35 * m, max: idealCenter + 0.35 * m },
    liquidity:  { min: S - 0.08 * m,           max: S + 0.08 * m           },
    bounds:     { min: entry - 2.5 * m,        max: entry - 0.05 * m       },
    defaultStop: idealCenter,
  };

  return finishScenario({
    past, fut,
    zones: [
      { kind: "resistance", y1: R - 0.1, y2: R + 0.1, label: "Plafond range"  },
      { kind: "support",    y1: S - 0.1, y2: S + 0.1, label: "Plancher range" },
    ],
    entry,
    tp: R - 0.3,
    direction: "BUY",
    meta,
  });
}

function scnVolExpansion(rng: () => number, m: number): PlaceStopChart {
  const past: Candle[] = [];
  const fut:  Candle[] = [];
  let p = 2 + rng() * 0.3;
  // Phase 1 : 8 bougies serrées
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o + (rng() - 0.45) * 0.4 * m;
    past.push(candle(o, c, (0.15 + rng() * 0.1) * m, (0.15 + rng() * 0.1) * m));
    p = c;
  }
  // Phase 2 : 4 bougies expansion (énormes)
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o + (0.7 + rng() * 0.9) * m * 1.8;
    past.push(candle(o, c, (0.4 + rng() * 0.4) * m * 1.5, (0.3 + rng() * 0.3) * m * 1.5));
    p = c;
  }
  const lastBody = past[past.length - 1];
  const entry = p;
  // Future : mouvement large et volatile mais haussier
  const volMult = 1.6;
  // Premier candle : dip large mais survie au-dessus du structural low
  const dip = candle(p, p - 0.7 * m, (0.3 + rng() * 0.3) * m * volMult, (0.7 + rng() * 0.4) * m * volMult);
  fut.push(dip); p = dip.c;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.5 + rng() * 0.7) * m * 1.2;
    fut.push(candle(o, c, (0.25 + rng() * 0.3) * m * volMult, (0.2 + rng() * 0.25) * m * volMult));
    p = c;
  }

  const structuralLow = lastBody.l;
  const idealCenter = structuralLow - 0.8 * m;
  const meta: StopMeta = {
    ideal:      { min: idealCenter - 0.35 * m, max: idealCenter + 0.25 * m },
    acceptable: { min: idealCenter - 0.7 * m,  max: idealCenter + 0.55 * m },
    liquidity:  null,
    bounds:     { min: entry - 4.5 * m,        max: entry - 0.05 * m       },
    defaultStop: structuralLow - 0.15 * m,  // défaut "normal" = trop serré pour la vol
  };

  return finishScenario({
    past, fut,
    zones: [],
    entry,
    tp: entry + 4 * m,
    direction: "BUY",
    meta,
  });
}

function scnFvgContinuation(rng: () => number, m: number): PlaceStopChart {
  const past: Candle[] = [];
  const fut:  Candle[] = [];
  let p = 2 + rng() * 0.3;
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = o + (rng() - 0.4) * 0.4 * m;
    past.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.18 + rng() * 0.15) * m));
    p = c;
  }
  const gapBottom = p + 0.15;
  const gO = p;
  const gC = p + (2.0 + rng() * 0.4) * m;
  past.push(candle(gO, gC, (0.25 + rng() * 0.2) * m, 0.1));
  p = gC;
  const gapTop = gO + 0.05;
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.2) * m, (0.13 + rng() * 0.15) * m));
    p = c;
  }
  const fvgMid = (gapBottom + gapTop) / 2;
  // Pullback dans le FVG
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o - (0.3 + rng() * 0.3) * m, fvgMid - 0.1, p + 0.2);
    past.push(candle(o, c, (0.13 + rng() * 0.15) * m, (0.18 + rng() * 0.2) * m));
    p = c;
  }
  const entry = p;
  // Future : rebond depuis le FVG
  const dip = candle(p, p - 0.15 * m, (0.15 + rng() * 0.15) * m, (0.3 + rng() * 0.2) * m);
  fut.push(dip); p = dip.c;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.55) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.25) * m, (0.13 + rng() * 0.15) * m));
    p = c;
  }

  const idealCenter = gapBottom - 0.4 * m;
  const meta: StopMeta = {
    ideal:      { min: idealCenter - 0.2 * m,  max: idealCenter + 0.18 * m },
    acceptable: { min: idealCenter - 0.45 * m, max: idealCenter + 0.4 * m  },
    liquidity:  { min: gapBottom - 0.05 * m,   max: (gapBottom + gapTop) / 2 + 0.05 * m },
    bounds:     { min: entry - 3.0 * m,        max: entry - 0.05 * m       },
    defaultStop: idealCenter,
  };

  return finishScenario({
    past, fut,
    zones: [
      { kind: "fvg", y1: gapBottom, y2: gapTop, label: "FVG haussier" },
    ],
    entry,
    tp: entry + 3.5 * m,
    direction: "BUY",
    meta,
  });
}

function scnNewsTrap(rng: () => number, m: number): PlaceStopChart {
  const past: Candle[] = [];
  const fut:  Candle[] = [];
  let p = 4 + rng() * 0.5;
  // Phase pré-news : 14 bougies de plus en plus serrées
  for (let i = 0; i < 14; i++) {
    const tight = 1 - i / 24;
    const o = p;
    const c = o + (rng() - 0.5) * 0.8 * tight * m;
    past.push(candle(o, c, (0.18 + rng() * 0.22) * tight * m, (0.18 + rng() * 0.22) * tight * m));
    p = c;
  }
  const entry = p;
  // Future : spike chaotique des deux côtés
  const spikeUp = candle(p, p + 0.6 * m, (1.4 + rng() * 0.5) * m, (0.15 + rng() * 0.15) * m);
  fut.push(spikeUp); p = spikeUp.c;
  const crash = candle(p, p - 2.6 * m, (0.2 + rng() * 0.2) * m, (0.6 + rng() * 0.3) * m);
  fut.push(crash); p = crash.c;
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o + (rng() - 0.3) * 1.2 * m;
    fut.push(candle(o, c, (0.5 + rng() * 0.3) * m, (0.5 + rng() * 0.3) * m));
    p = c;
  }

  // Ideal = très large car news. Mais même le très large peut sauter.
  const idealCenter = entry - 2.8 * m;
  const meta: StopMeta = {
    ideal:      { min: idealCenter - 0.5 * m, max: idealCenter + 0.4 * m },
    acceptable: { min: idealCenter - 1.0 * m, max: idealCenter + 0.7 * m },
    liquidity:  null,
    bounds:     { min: entry - 4.5 * m,       max: entry - 0.05 * m       },
    defaultStop: entry - 0.5 * m,  // défaut petit = pédagogique (presque sûr de sauter)
  };

  return finishScenario({
    past, fut,
    zones: [],
    entry,
    tp: null,
    direction: "BUY",
    meta,
  });
}

function scnDoubleTopSweep(rng: () => number, m: number): PlaceStopChart {
  const past: Candle[] = [];
  const fut:  Candle[] = [];
  const R = 9;
  let p = 4 + rng() * 0.4;
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (0.5 + rng() * 0.4) * m, 3, R - 0.3);
    past.push(candle(o, c, (0.18 + rng() * 0.18) * m, (0.13 + rng() * 0.15) * m));
    p = c;
  }
  // 1er top
  const top1 = R;
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o - (0.25 + rng() * 0.3) * m, R - 1.5, R - 0.4);
    past.push(candle(o, c, (0.18 + rng() * 0.2) * m, (0.18 + rng() * 0.2) * m));
    p = c;
  }
  // Rally vers le 2nd top + sweep
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (0.3 + rng() * 0.4) * m, p, R - 0.4);
    past.push(candle(o, c, (0.18 + rng() * 0.18) * m, (0.13 + rng() * 0.15) * m));
    p = c;
  }
  const sweepHigh = R + 0.5 * m + rng() * 0.3;
  const swO = p;
  const swC = R - 0.4 - rng() * 0.3;
  past.push({ o: swO, c: swC, h: sweepHigh, l: swO - 0.15 });
  p = swC;
  // 2 candles confirmant
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o - (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.15) * m, (0.18 + rng() * 0.2) * m));
    p = c;
  }
  const entry = p;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.55) * m;
    fut.push(candle(o, c, (0.13 + rng() * 0.15) * m, (0.18 + rng() * 0.22) * m));
    p = c;
  }

  const idealCenter = sweepHigh + 0.3 * m;
  const meta: StopMeta = {
    ideal:      { min: idealCenter - 0.18 * m, max: idealCenter + 0.22 * m },
    acceptable: { min: idealCenter - 0.4 * m,  max: idealCenter + 0.5 * m  },
    liquidity:  { min: top1 - 0.08 * m,        max: sweepHigh + 0.05 * m   },
    bounds:     { min: entry + 0.08 * m,       max: entry + 3.5 * m        },
    defaultStop: idealCenter,
  };

  return finishScenario({
    past, fut,
    zones: [
      { kind: "resistance",     y1: top1 - 0.1,             y2: top1 + 0.1,             label: "Double top"     },
      { kind: "liquidity_high", y1: top1 + 0.12 * m,         y2: sweepHigh,              label: "Liquidité sweep"},
    ],
    entry,
    tp: entry - 3.5 * m,
    direction: "SELL",
    meta,
  });
}

function scnCleanBreakout(rng: () => number, m: number): PlaceStopChart {
  const past: Candle[] = [];
  const fut:  Candle[] = [];
  const R = 5;
  let p = 2 + rng() * 0.3;
  // Consolidation sous résistance
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.45) * 0.6 * m, 1.5, R - 0.4);
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  // Breakout
  const bO = p;
  const bC = R + 1.3 * m + rng() * 0.4;
  past.push(candle(bO, bC, (0.3 + rng() * 0.2) * m, 0.15));
  p = bC;
  // Follow-through (2)
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.3 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.2) * m, (0.13 + rng() * 0.15) * m));
    p = c;
  }
  // Pullback sur l'ancienne résistance (devenue support)
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o - (0.25 + rng() * 0.3) * m, R - 0.1, p + 0.1);
    past.push(candle(o, c, (0.13 + rng() * 0.15) * m, (0.18 + rng() * 0.2) * m));
    p = c;
  }
  const entry = p;
  // Future : rebond depuis le nouveau support
  const dip = candle(p, p - 0.12 * m, (0.15 + rng() * 0.15) * m, (0.3 + rng() * 0.2) * m);
  fut.push(dip); p = dip.c;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.55) * m;
    fut.push(candle(o, c, (0.18 + rng() * 0.22) * m, (0.13 + rng() * 0.15) * m));
    p = c;
  }

  const idealCenter = R - 0.4 * m;
  const meta: StopMeta = {
    ideal:      { min: idealCenter - 0.22 * m, max: idealCenter + 0.18 * m },
    acceptable: { min: idealCenter - 0.5 * m,  max: idealCenter + 0.4 * m  },
    liquidity:  { min: R - 0.08 * m,           max: R + 0.08 * m           },
    bounds:     { min: entry - 3.0 * m,        max: entry - 0.05 * m       },
    defaultStop: idealCenter,
  };

  return finishScenario({
    past, fut,
    zones: [
      { kind: "support", y1: R - 0.1, y2: R + 0.1, label: "Ancienne résistance" },
    ],
    entry,
    tp: entry + 3.5 * m,
    direction: "BUY",
    meta,
  });
}

// ─── Build chart depuis un setup ──────────────────────────────────────────────

export function buildPlaceStopChart(
  setup: PlaceStopSetupKey,
  seed: number,
  volatility: Volatility = "normale",
): PlaceStopChart {
  const rng = mulberry32(seed);
  const m = VOL_MULT[volatility];
  switch (setup) {
    case "pullback_bull":         return scnPullbackBull(rng, m);
    case "pullback_bear":         return scnPullbackBear(rng, m);
    case "bounce_support":        return scnBounceSupport(rng, m);
    case "rejection_resistance":  return scnRejectionResistance(rng, m);
    case "fake_breakout":         return scnFakeBreakout(rng, m);
    case "liquidity_sweep":       return scnLiquiditySweep(rng, m);
    case "tight_range":           return scnTightRange(rng, m);
    case "vol_expansion":         return scnVolExpansion(rng, m);
    case "fvg_continuation":      return scnFvgContinuation(rng, m);
    case "news_trap":             return scnNewsTrap(rng, m);
    case "double_top_sweep":      return scnDoubleTopSweep(rng, m);
    case "clean_breakout":        return scnCleanBreakout(rng, m);
  }
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

export interface ScoreResult {
  verdict:     StopVerdict;
  points:      number;
  basePoints:  number;
  streakBonus: number;
  wasHit:      boolean;
  hitIndex:    number | null;
}

function isStopHit(stop: number, direction: TradeDirection, futureCandles: Candle[]): number | null {
  for (let i = 0; i < futureCandles.length; i++) {
    const k = futureCandles[i];
    if (direction === "BUY"  && k.l <= stop) return i;
    if (direction === "SELL" && k.h >= stop) return i;
  }
  return null;
}

function inRange(v: number, range: { min: number; max: number }): boolean {
  return v >= range.min && v <= range.max;
}

export function scoreStopPlacement(
  stop:           number,
  chart:          PlaceStopChart,
  currentStreak:  number,
): ScoreResult {
  const { stopMeta, direction, futureCandles } = chart;
  const hitIndex = isStopHit(stop, direction, futureCandles);
  const wasHit = hitIndex !== null;

  let verdict: StopVerdict;
  let basePoints: number;

  // 1) Liquidité évidente : la pire erreur
  if (stopMeta.liquidity && inRange(stop, stopMeta.liquidity)) {
    verdict = "liquidity";
    basePoints = -100;
  }
  // 2) Stop dans la zone idéale
  else if (inRange(stop, stopMeta.ideal)) {
    verdict = "perfect";
    basePoints = 120;
  }
  // 3) Stop dans la zone acceptable
  else if (inRange(stop, stopMeta.acceptable)) {
    verdict = "good";
    basePoints = 80;
  }
  // 4) Trop serré (hit) ou trop large (survit)
  else if (wasHit) {
    verdict = "tight";
    basePoints = -50;
  } else {
    verdict = "wide";
    basePoints = 40;
  }

  const streakBonus = basePoints > 0 && currentStreak >= 2 ? 30 : 0;
  return {
    verdict,
    basePoints,
    streakBonus,
    points: basePoints + streakBonus,
    wasHit,
    hitIndex,
  };
}

// ─── Helpers UI partagés ──────────────────────────────────────────────────────

export const VERDICT_META: Record<StopVerdict, { label: string; color: "emerald" | "red" | "amber" }> = {
  perfect:   { label: "Stop logique",    color: "emerald" },
  good:      { label: "Stop correct",    color: "emerald" },
  wide:      { label: "Stop trop large", color: "amber"   },
  tight:     { label: "Stop trop serré", color: "red"     },
  liquidity: { label: "Pleine liquidité",color: "red"     },
};

export function sessionVerdict(score: number, perfectCount: number, total: number): string {
  if (perfectCount >= total - 1) return "Stop sniper";
  if (score >= 700)              return "Bonne protection";
  if (score >= 300)              return "Lecture solide";
  if (score >= 0)                return "À polir";
  if (score >= -200)             return "Trop émotionnel";
  return "Tu donnes ton SL au marché";
}
