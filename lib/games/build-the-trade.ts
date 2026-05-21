// Mini-jeu #4 : "BUILD THE TRADE"
//
// Le joueur construit un setup complet en 3 étapes :
//   1. Entrée (agressive / confirmation / pullback profond)
//   2. Stop loss (serré / logique / large)
//   3. Take profit (rapide / équilibré / ambitieux)
// Puis le marché révèle les futures candles, et le moteur évalue le trade.

import {
  type Asset, type Session, type Volatility, type Spread,
  type HtfBias, type MacroContext,
  type Candle, type ChartZone,
  VOL_MULT, mulberry32, pick, clamp, candle,
} from "./shared";

export type { Asset, Session, Volatility, Spread, HtfBias, MacroContext, Candle, ChartZone };

// ─── Types ────────────────────────────────────────────────────────────────────

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type TradeDirection = "BUY" | "SELL";

export type EntryType = "aggressive" | "confirmation" | "deep_pullback";
export type StopType  = "tight" | "logical" | "wide";
export type TpType    = "fast" | "balanced" | "ambitious";

export const ENTRY_LABELS: Record<EntryType, string> = {
  aggressive:    "Agressive",
  confirmation:  "Confirmation",
  deep_pullback: "Pullback profond",
};
export const STOP_LABELS: Record<StopType, string> = {
  tight:   "Serré",
  logical: "Logique",
  wide:    "Large",
};
export const TP_LABELS: Record<TpType, string> = {
  fast:      "Rapide",
  balanced:  "Équilibré",
  ambitious: "Ambitieux",
};

export type ChartShape =
  | "uptrend_pullback"
  | "downtrend_pullback"
  | "breakout_up"
  | "breakout_down"
  | "bounce_support"
  | "rejection_resistance"
  | "range_oscillation"
  | "fakeout_above"
  | "sweep_low_reversal"
  | "fvg_continuation"
  | "deep_pullback_risky"
  | "high_vol_pullback"
  | "weak_breakout"
  | "counter_trend_local";

export interface DifficultyLessons {
  beginner:     string;
  intermediate: string;
  advanced:     string;
}

export interface BuildTradeTemplate {
  id:             string;
  title:          string;
  chartShape:     ChartShape;
  direction:      TradeDirection;
  htfBias:        HtfBias;
  macroContext:   MacroContext;
  context:        string;
  optimal:        { entry: EntryType; stop: StopType; tp: TpType };
  optimalExplain: string;
  lessons:        DifficultyLessons;
  difficulties:   readonly Difficulty[];
}

export interface BuildTradeInstance extends BuildTradeTemplate {
  asset:      Asset;
  session:    Session;
  volatility: Volatility;
  spread:     Spread;
  seed:       number;
  difficulty: Difficulty;
}

export interface BuildTradeChart {
  past:      Candle[];
  future:    Candle[];
  zones:     ChartZone[];
  domain:    { min: number; max: number };
  direction: TradeDirection;
  // 3 options par catégorie. Pour l'entrée :
  //   - aggressive   = au prix actuel (entry market)
  //   - confirmation = au-dessus (BUY) ou en dessous (SELL) du current (après une bougie de confirmation)
  //   - deep_pullback = un retour plus profond avant l'entry
  entries: Record<EntryType, number>;
  stops:   Record<StopType,  number>;
  tps:     Record<TpType,    number>;
  // Prix actuel = dernier close du past (pour l'entry market)
  currentPrice: number;
}

export const ROUNDS_PER_SESSION = 8;

const ASSETS:       readonly Asset[]      = ["EUR/USD", "XAU/USD", "BTC/USD", "NASDAQ"];
const SESSIONS:     readonly Session[]    = ["Londres", "New York", "Overlap", "Heures mortes"];
const VOLATILITIES: readonly Volatility[] = ["faible", "normale", "élevée"];
const SPREADS:      readonly Spread[]     = ["faible", "élevé"];

// ─── Templates (15) ───────────────────────────────────────────────────────────

export const BUILD_TRADE_TEMPLATES: BuildTradeTemplate[] = [
  {
    id: "trend_continuation_bull",
    title: "Continuation de tendance haussière",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Tendance haussière nette. Le prix vient de finir un pullback.",
    optimal: { entry: "deep_pullback", stop: "logical", tp: "ambitious" },
    optimalExplain: "Tendance HTF claire = prendre le meilleur prix possible (pullback profond), stop derrière la structure, viser large dans le sens du momentum.",
    lessons: {
      beginner:     "Un setup dans le sens du HTF, on prend le meilleur prix possible et on vise large. Le marché paie les patients.",
      intermediate: "Le pullback profond optimise le R/R. Combiné à un stop derrière la structure, c'est l'edge maximal.",
      advanced:     "Trend continuation alignée HTF = setup à taille pleine, R/R 3:1+. Ambitieux justifié car momentum probable.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "trend_continuation_bear",
    title: "Continuation de tendance baissière",
    chartShape: "downtrend_pullback",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Tendance baissière nette. Le prix vient de finir un rebond.",
    optimal: { entry: "deep_pullback", stop: "logical", tp: "ambitious" },
    optimalExplain: "HTF baissier + rebond mort = entrée au meilleur prix, stop au-dessus du swing high, TP ambitieux dans le sens du momentum.",
    lessons: {
      beginner:     "Tendance baissière + rebond mort = SELL au prix le plus haut possible, large TP.",
      intermediate: "Le rebond profond donne le R/R optimal. Stop au-dessus de la structure pour absorber le bruit.",
      advanced:     "Setup symétrique du trend continuation bull. R/R 3:1+ visé.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "breakout_bull_clean",
    title: "Cassure haussière nette",
    chartShape: "breakout_up",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le prix vient de casser une résistance HTF avec une bougie de force.",
    optimal: { entry: "aggressive", stop: "logical", tp: "ambitious" },
    optimalExplain: "Breakout HTF aligné = momentum immédiat. Pas de temps pour attendre un pullback profond (qui peut ne jamais venir). Entry agressive, stop sous le niveau cassé, TP ambitieux.",
    lessons: {
      beginner:     "Sur un breakout aligné HTF, on ne traîne pas. Le marché monte sans attendre le retardataire.",
      intermediate: "Attendre un pullback profond sur un breakout fort = manquer le mouvement. Aggressive justifié.",
      advanced:     "Breakout HTF + bougie de force = signal immédiat. Le pullback peut être superficiel ou inexistant.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "breakout_bear_clean",
    title: "Cassure baissière nette",
    chartShape: "breakout_down",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Le prix vient de casser un support HTF avec une bougie de force.",
    optimal: { entry: "aggressive", stop: "logical", tp: "ambitious" },
    optimalExplain: "Breakdown HTF aligné = momentum côté vendeur. Entrée immédiate, stop au-dessus du support cassé.",
    lessons: {
      beginner:     "Cassure du support + HTF baissier = SELL maintenant, sans attendre.",
      intermediate: "Stop juste au-dessus du niveau cassé (devenu résistance). Aggressive justifiée par le momentum.",
      advanced:     "Setup miroir du breakout bull. Stop technique = top du support cassé + marge.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "bounce_support_clean",
    title: "Rebond sur support majeur",
    chartShape: "bounce_support",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le prix vient de rebondir sur un support HTF avec une mèche claire.",
    optimal: { entry: "confirmation", stop: "logical", tp: "balanced" },
    optimalExplain: "Support testé = on attend la confirmation du rebond avant d'entrer. Stop sous le support, TP équilibré car la résistance suivante limite la course.",
    lessons: {
      beginner:     "Sur un support, on attend la bougie verte de confirmation. Pas d'entrée à l'aveugle.",
      intermediate: "La confirmation valide la zone. Le TP équilibré reflète la prochaine résistance.",
      advanced:     "Rebond sur support HTF testé 2-3 fois → confirmation préserve l'edge. R/R 2-2.5:1 typique.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "rejection_resistance_clean",
    title: "Rejet sur résistance majeure",
    chartShape: "rejection_resistance",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Le prix vient de rejeter une résistance HTF avec une mèche.",
    optimal: { entry: "confirmation", stop: "logical", tp: "balanced" },
    optimalExplain: "Résistance testée = confirmation du rejet avant entry. Stop au-dessus du high, TP équilibré (le support suivant).",
    lessons: {
      beginner:     "Sur résistance, on attend la bougie rouge de confirmation. Le rejet doit s'imposer.",
      intermediate: "Confirmation = bougie de rejet visible. Sans elle, le retest peut continuer.",
      advanced:     "Pattern miroir du bounce support. Stop = high + marge ATR.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "range_top_short",
    title: "SELL au plafond du range",
    chartShape: "range_oscillation",
    direction: "SELL",
    htfBias: "range",
    macroContext: "normal",
    context: "Le prix arrive au plafond d'un range serré. Tu cherches le SELL.",
    optimal: { entry: "confirmation", stop: "logical", tp: "fast" },
    optimalExplain: "Dans un range, l'edge est petit — confirmation pour valider l'entrée, TP rapide car la course est limitée par la borne basse du range.",
    lessons: {
      intermediate: "Un range a un R/R intrinsèquement limité. Le TP ambitieux n'a pas de sens — on vise le plancher du range.",
      advanced:     "Range = environnement de fade. Confirmation + TP rapide = pourcentage de win plus haut, RR < 2.",
      beginner:     "Au plafond d'un range, on vend petit. Pas de gros TP car le prix bouge dans une boîte.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "range_bottom_long",
    title: "BUY au plancher du range",
    chartShape: "range_oscillation",
    direction: "BUY",
    htfBias: "range",
    macroContext: "normal",
    context: "Le prix arrive au plancher d'un range serré. Tu cherches le BUY.",
    optimal: { entry: "confirmation", stop: "logical", tp: "fast" },
    optimalExplain: "Range = arbitrage entre plancher et plafond. Confirmation + TP rapide car la course est bornée.",
    lessons: {
      intermediate: "Le BUY du plancher vise le plafond, pas plus. Le TP rapide colle au plafond.",
      advanced:     "Mêmes principes que le SELL du plafond — confirmation + TP serré pour maximiser le % de win.",
      beginner:     "Range = on vise l'autre côté, sans plus. Pas d'ambition.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "fake_breakout_short",
    title: "Faux breakout — SELL après le piège",
    chartShape: "fakeout_above",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Le prix a piqué au-dessus de la résistance puis refermé en dessous. Piège classique.",
    optimal: { entry: "confirmation", stop: "logical", tp: "balanced" },
    optimalExplain: "Après un fakeout, on attend la confirmation (bougie qui valide le retour sous résistance). Stop au-dessus du pic du fakeout, TP équilibré jusqu'au prochain support.",
    lessons: {
      intermediate: "Fakeout = signal d'entrée mais avec confirmation. Sans confirm, le retest peut faire un 2e sweep.",
      advanced:     "Stop au-dessus du wick du fakeout — c'est la VRAIE invalidation. Pas dans la zone du piège.",
      beginner:     "Après un piège visible, on attend la suite. Pas de FOMO.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "sweep_reversal_bull",
    title: "Sweep de liquidité + retournement",
    chartShape: "sweep_low_reversal",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le prix vient de balayer la liquidité sous le précédent low puis a refermé au-dessus.",
    optimal: { entry: "aggressive", stop: "logical", tp: "balanced" },
    optimalExplain: "Sweep = signal de retournement immédiat. Aggressive justifié car la confirmation est déjà donnée par le sweep. Stop sous le low du sweep.",
    lessons: {
      intermediate: "Pattern ICT classique : le sweep EST la confirmation. Entrer agressivement, stop sous le sweep.",
      advanced:     "Aggressive justifiée par le pattern, pas par l'impatience. Stop sous le low du sweep (la nouvelle invalidation).",
      beginner:     "Une grosse mèche qui balaie un low puis remonte = signal de BUY clair.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "fvg_continuation_bull",
    title: "Réaction sur FVG haussier",
    chartShape: "fvg_continuation",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le prix revient tester un FVG haussier. La réaction est en cours.",
    optimal: { entry: "confirmation", stop: "logical", tp: "ambitious" },
    optimalExplain: "FVG = zone de demande institutionnelle. Confirmation valide la réaction. Stop sous le bas du FVG, TP ambitieux car HTF aligné + zone fresh.",
    lessons: {
      intermediate: "Le FVG agit comme zone de demande au retest. Confirmation préserve l'edge sans rater le move.",
      advanced:     "FVG haussier + HTF aligné + premier retest = setup A+. R/R 3:1+ visé.",
      beginner:     "Le FVG = aimant à prix. Confirmation = bougie verte qui défend la zone.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "weak_breakout_setup",
    title: "Cassure faible — édge réduit",
    chartShape: "weak_breakout",
    direction: "BUY",
    htfBias: "range",
    macroContext: "normal",
    context: "Le prix vient de casser au-dessus de la résistance, mais la bougie est petite et hésitante.",
    optimal: { entry: "confirmation", stop: "logical", tp: "fast" },
    optimalExplain: "Cassure sans force = edge réduit. Confirmation obligatoire avant d'entrer. TP rapide car la continuation est incertaine.",
    lessons: {
      intermediate: "Cassure faible = trade dégradé. Confirmation + TP serré = adaptation au signal faible.",
      advanced:     "Statistique d'une cassure faible : ~35% de continuation. Le TP ambitieux est mathématiquement perdant.",
      beginner:     "Si la cassure manque de body, on prend petit et on attend confirmation.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "deep_pullback_risky",
    title: "Pullback très profond — risque de breakdown",
    chartShape: "deep_pullback_risky",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Le pullback est devenu très profond. Plus de 60% de l'impulsion précédente est retracée.",
    optimal: { entry: "confirmation", stop: "logical", tp: "balanced" },
    optimalExplain: "Pullback profond = risque de breakdown structurel. La confirmation préserve l'edge. Aggressive serait du chasing, deep_pullback serait FOMO sur une zone douteuse.",
    lessons: {
      advanced:     "Pullback > 60% de l'impulsion = le pattern est fatigué. Confirmation obligatoire + TP modéré.",
      intermediate: "Plus le pullback est profond, plus la confirmation devient critique. Aggressive ici = roulette russe.",
      beginner:     "Un pullback trop profond peut casser la tendance. On attend que la structure se reconfirme.",
    },
    difficulties: ["advanced"],
  },
  {
    id: "high_vol_setup",
    title: "Setup en volatilité élevée",
    chartShape: "high_vol_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Volatilité élevée. Les bougies sont larges, les wicks profondes.",
    optimal: { entry: "confirmation", stop: "wide", tp: "balanced" },
    optimalExplain: "Volatilité élevée = le bruit est amplifié. Stop standard se fait balayer. Le 'wide stop' devient le stop LOGIQUE. TP équilibré car le mouvement potentiel est aussi étendu.",
    lessons: {
      advanced:     "Stop ATR-ajusté. En vol élevée, le 'wide stop' n'est pas large — il est juste adapté.",
      intermediate: "Le stop doit s'adapter à la volatilité du moment, pas à un standard fixe.",
      beginner:     "Quand le marché bouge fort, le stop doit respirer. Sinon il saute pour rien.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "counter_trend_local",
    title: "Setup local contre HTF — défensif",
    chartShape: "counter_trend_local",
    direction: "BUY",
    htfBias: "bearish",
    macroContext: "normal",
    context: "HTF baissier. Un setup BUY apparaît localement (LTF) — risqué mais tradable.",
    optimal: { entry: "confirmation", stop: "logical", tp: "fast" },
    optimalExplain: "Contre HTF = proba défavorable. Confirmation obligatoire + TP rapide pour sécuriser ce qu'on peut. Pas d'ambition contre la tendance majeure.",
    lessons: {
      advanced:     "Trader contre HTF = accepter une proba 30-40%. Le TP rapide capture l'edge avant le reversal.",
      intermediate: "Setup contre tendance = défensif. Confirmation + sortie rapide minimisent l'exposition.",
      beginner:     "Si tu trades contre la tendance, tu prends petit et tu sors vite. Jamais ambitieux.",
    },
    difficulties: ["advanced"],
  },
];

// ─── Generate scenarios ───────────────────────────────────────────────────────

export function generateBuildTradeScenarios(seed: number, difficulty: Difficulty): BuildTradeInstance[] {
  const rng = mulberry32(seed);
  const pool = BUILD_TRADE_TEMPLATES.filter((t) => t.difficulties.includes(difficulty));
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const out: BuildTradeInstance[] = [];
  let lastId: string | null = null;
  for (let i = 0; i < ROUNDS_PER_SESSION; i++) {
    let cand = shuffled[i % shuffled.length];
    if (cand.id === lastId && shuffled.length > 1) {
      cand = shuffled[(i + 1) % shuffled.length];
    }
    out.push({
      ...cand,
      asset:      pick(ASSETS, rng),
      session:    pick(SESSIONS, rng),
      volatility: cand.chartShape === "high_vol_pullback" ? "élevée" : pick(VOLATILITIES, rng),
      spread:     pick(SPREADS, rng),
      seed:       (seed + i * 9973) >>> 0,
      difficulty,
    });
    lastId = cand.id;
  }
  return out;
}

// ─── Chart generators ────────────────────────────────────────────────────────

interface ShapeOutput {
  past: Candle[];
  future: Candle[];
  zones: ChartZone[];
  ref: { swingLow: number; swingHigh: number; entryRef: number };
}

function finalize(past: Candle[], future: Candle[], zones: ChartZone[], extras: number[]): { domain: { min: number; max: number } } {
  const all = [...past, ...future];
  const vals: number[] = [...extras];
  for (const k of all) { vals.push(k.h, k.l); }
  for (const z of zones) { vals.push(z.y1, z.y2); }
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = (max - min) * 0.08 || 1;
  return { domain: { min: min - pad, max: max + pad } };
}

// 1. Uptrend + pullback (BUY)
function shapeUptrendPullback(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
  let p = 1 + rng() * 0.3;
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.5) * m;
    past.push(candle(o, c, (0.18 + rng() * 0.2) * m, (0.13 + rng() * 0.15) * m));
    p = c;
  }
  const swingHigh = Math.max(...past.map((k) => k.h));
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o - (0.25 + rng() * 0.35) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  const swingLow = Math.min(...past.slice(-5).map((k) => k.l));
  const entryRef = p;
  // Future : dip vers swingLow (touche deep_pullback) puis rallye qui touche balanced + ambitious
  const fut: Candle[] = [];
  // 1er future : dip qui descend juste au-dessus du swingLow (= deep_pullback level)
  const dipLow = swingLow + 0.05 * m;
  fut.push({ o: p, c: swingLow + 0.4 * m, h: p + 0.1 * m, l: dipLow });
  p = swingLow + 0.4 * m;
  // 2e : bougie verte de confirmation (= confirmation level)
  fut.push(candle(p, p + 0.5 * m, (0.2 + rng() * 0.15) * m, 0.1));
  p += 0.5 * m;
  // Rallye qui touche balanced TP puis ambitious
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.5 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.1 + rng() * 0.1) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "support", y1: swingLow - 0.04, y2: swingLow + 0.04, label: "Swing low" },
  ], ref: { swingLow, swingHigh, entryRef } };
}

// 2. Downtrend + pullback (SELL)
function shapeDowntrendPullback(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
  let p = 10 - rng() * 0.3;
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.5) * m;
    past.push(candle(o, c, (0.13 + rng() * 0.15) * m, (0.18 + rng() * 0.2) * m));
    p = c;
  }
  const swingLow = Math.min(...past.map((k) => k.l));
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o + (0.25 + rng() * 0.35) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  const swingHigh = Math.max(...past.slice(-5).map((k) => k.h));
  const entryRef = p;
  const fut: Candle[] = [];
  const bumpHigh = swingHigh - 0.05 * m;
  fut.push({ o: p, c: swingHigh - 0.4 * m, h: bumpHigh, l: p - 0.1 * m });
  p = swingHigh - 0.4 * m;
  fut.push(candle(p, p - 0.5 * m, 0.1, (0.2 + rng() * 0.15) * m));
  p -= 0.5 * m;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.5 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.1 + rng() * 0.1) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "resistance", y1: swingHigh - 0.04, y2: swingHigh + 0.04, label: "Swing high" },
  ], ref: { swingLow, swingHigh, entryRef } };
}

// 3. Breakout up
function shapeBreakoutUp(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
  const R = 10;
  let p = 5 + rng() * 0.4;
  // approach
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (0.4 + rng() * 0.4) * m, 4, R - 1);
    past.push(candle(o, c, (0.18 + rng() * 0.18) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  // consol
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 0.8 * m, R - 1.3, R - 0.3);
    past.push(candle(o, c, (0.25 + rng() * 0.2) * m, (0.25 + rng() * 0.2) * m));
    p = c;
  }
  // breakout candle
  past.push(candle(p, R + (1.0 + rng() * 0.4) * m, (0.3 + rng() * 0.2) * m, 0.15));
  p = past[past.length - 1].c;
  const entryRef = p;
  // Future : pullback léger (touche confirmation), pas de deep_pullback, puis rallye
  const fut: Candle[] = [];
  fut.push(candle(p, p - 0.2 * m, 0.1, (0.2 + rng() * 0.15) * m));
  p -= 0.2 * m;
  // Rallye
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = o + (0.5 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.1 + rng() * 0.1) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "resistance", y1: R - 0.1, y2: R + 0.1, label: "Résistance cassée" },
  ], ref: { swingLow: R - 0.5, swingHigh: R + 1, entryRef } };
}

// 4. Breakout down (mirror)
function shapeBreakoutDown(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
  const S = 1;
  let p = 6 - rng() * 0.4;
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o - (0.4 + rng() * 0.4) * m, S + 1, 7);
    past.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.18 + rng() * 0.18) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 0.8 * m, S + 0.3, S + 1.3);
    past.push(candle(o, c, (0.25 + rng() * 0.2) * m, (0.25 + rng() * 0.2) * m));
    p = c;
  }
  past.push(candle(p, S - (1.0 + rng() * 0.4) * m, 0.15, (0.3 + rng() * 0.2) * m));
  p = past[past.length - 1].c;
  const entryRef = p;
  const fut: Candle[] = [];
  fut.push(candle(p, p + 0.2 * m, (0.2 + rng() * 0.15) * m, 0.1));
  p += 0.2 * m;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = o - (0.5 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.1 + rng() * 0.1) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "support", y1: S - 0.1, y2: S + 0.1, label: "Support cassé" },
  ], ref: { swingLow: S - 1, swingHigh: S + 0.5, entryRef } };
}

// 5. Bounce on support (BUY)
function shapeBounceSupport(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
  const S = 1;
  let p = 5 + rng() * 0.4;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = clamp(o - (0.5 + rng() * 0.5) * m, S + 0.4, 6);
    past.push(candle(o, c, (0.15 + rng() * 0.18) * m, (0.18 + rng() * 0.25) * m));
    p = c;
  }
  // 3 bougies testant support avec mèches
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.3) * 0.6 * m, S + 0.4, S + 1.3);
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.7 + rng() * 0.3) * m));
    p = c;
  }
  const entryRef = p;
  const fut: Candle[] = [];
  // 1 dip vers le support (deep_pullback fillable)
  fut.push({ o: p, c: S + 0.5 * m, h: p + 0.1 * m, l: S + 0.05 * m });
  p = S + 0.5 * m;
  // Confirmation candle (green)
  fut.push(candle(p, p + 0.4 * m, (0.2 + rng() * 0.15) * m, 0.1));
  p += 0.4 * m;
  // Rallye
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.35) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.1 + rng() * 0.1) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "support", y1: S - 0.1, y2: S + 0.1, label: "Support HTF" },
  ], ref: { swingLow: S, swingHigh: entryRef + 4 * m, entryRef } };
}

// 6. Rejection on resistance (SELL)
function shapeRejectionResistance(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
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
  const entryRef = p;
  const fut: Candle[] = [];
  fut.push({ o: p, c: R - 0.5 * m, h: R - 0.05 * m, l: p - 0.1 * m });
  p = R - 0.5 * m;
  fut.push(candle(p, p - 0.4 * m, 0.1, (0.2 + rng() * 0.15) * m));
  p -= 0.4 * m;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.35) * m;
    fut.push(candle(o, c, (0.1 + rng() * 0.1) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "resistance", y1: R - 0.1, y2: R + 0.1, label: "Résistance HTF" },
  ], ref: { swingLow: entryRef - 4 * m, swingHigh: R, entryRef } };
}

// 7. Range oscillation
function shapeRangeOscillation(rng: () => number, m: number, direction: TradeDirection): ShapeOutput {
  const past: Candle[] = [];
  const S = 2;
  const R = 6;
  const mid = (S + R) / 2;
  let p = mid + (rng() - 0.5);
  // 12 candles d'oscillation
  for (let i = 0; i < 12; i++) {
    const o = p;
    const drift = (mid - o) * 0.25 + (rng() - 0.5) * 1.2 * m;
    const c = clamp(o + drift, S + 0.4, R - 0.4);
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  // 2 candles approchant la borne ciblée
  for (let i = 0; i < 2; i++) {
    const o = p;
    let c: number;
    if (direction === "SELL") {
      c = clamp(o + (0.3 + rng() * 0.3) * m, S + 0.4, R - 0.3);
    } else {
      c = clamp(o - (0.3 + rng() * 0.3) * m, S + 0.3, R - 0.4);
    }
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  const entryRef = p;
  const fut: Candle[] = [];
  // Future : oscillation jusqu'à l'autre borne
  if (direction === "SELL") {
    // 1 bump test résistance puis drop vers support
    fut.push({ o: p, c: R - 0.5 * m, h: R - 0.05 * m, l: p - 0.1 * m });
    p = R - 0.5 * m;
    fut.push(candle(p, p - 0.5 * m, 0.1, (0.2 + rng() * 0.15) * m));
    p -= 0.5 * m;
    for (let i = 0; i < 5; i++) {
      const o = p;
      const c = clamp(o - (0.4 + rng() * 0.3) * m, S + 0.4, R);
      fut.push(candle(o, c, (0.1 + rng() * 0.1) * m, (0.2 + rng() * 0.2) * m));
      p = c;
    }
  } else {
    fut.push({ o: p, c: S + 0.5 * m, h: p + 0.1 * m, l: S + 0.05 * m });
    p = S + 0.5 * m;
    fut.push(candle(p, p + 0.5 * m, (0.2 + rng() * 0.15) * m, 0.1));
    p += 0.5 * m;
    for (let i = 0; i < 5; i++) {
      const o = p;
      const c = clamp(o + (0.4 + rng() * 0.3) * m, S, R - 0.4);
      fut.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.1 + rng() * 0.1) * m));
      p = c;
    }
  }
  return { past, future: fut, zones: [
    { kind: "resistance", y1: R - 0.15, y2: R + 0.15, label: "Plafond range" },
    { kind: "support",    y1: S - 0.15, y2: S + 0.15, label: "Plancher range" },
  ], ref: { swingLow: S, swingHigh: R, entryRef } };
}

// 8. Fakeout above (SELL after trap)
function shapeFakeoutAbove(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
  const R = 10;
  let p = 6 + rng() * 0.3;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = clamp(o + (0.3 + rng() * 0.4) * m, 5, R - 0.5);
    past.push(candle(o, c, (0.18 + rng() * 0.2) * m, (0.15 + rng() * 0.18) * m));
    p = c;
  }
  // Fakeout candle
  const fakeoutHigh = R + 1.2 * m + rng() * 0.3;
  past.push({ o: p, c: R - 0.5 - rng() * 0.2, h: fakeoutHigh, l: p - 0.15 });
  p = past[past.length - 1].c;
  // 2 candles confirmant
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o - (0.25 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.18) * m, (0.2 + rng() * 0.22) * m));
    p = c;
  }
  const entryRef = p;
  const fut: Candle[] = [];
  // Future : 1 bump léger qui retest R sans atteindre fakeoutHigh, puis drop
  fut.push({ o: p, c: R - 0.6 * m, h: R - 0.05 * m, l: p - 0.15 });
  p = R - 0.6 * m;
  fut.push(candle(p, p - 0.4 * m, 0.1, (0.2 + rng() * 0.15) * m));
  p -= 0.4 * m;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o - (0.5 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.1 + rng() * 0.1) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "resistance",     y1: R - 0.1, y2: R + 0.1, label: "Résistance" },
    { kind: "liquidity_high", y1: R + 0.15, y2: fakeoutHigh, label: "Wick fakeout" },
  ], ref: { swingLow: entryRef - 4 * m, swingHigh: fakeoutHigh, entryRef } };
}

// 9. Sweep low + reversal (BUY)
function shapeSweepLowReversal(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
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
    const c = clamp(o + (rng() - 0.5) * 0.5 * m, L + 0.5, L + 1.5);
    past.push(candle(o, c, (0.2 + rng() * 0.18) * m, (0.2 + rng() * 0.18) * m));
    p = c;
  }
  // Sweep candle
  const sweepLow = L - 1.2 * m - rng() * 0.3;
  past.push({ o: p, c: L + 0.4 + rng() * 0.2, h: p + 0.15, l: sweepLow });
  p = past[past.length - 1].c;
  // 1 confirmation
  past.push(candle(p, p + (0.3 + rng() * 0.3) * m, (0.2 + rng() * 0.18) * m, 0.1));
  p = past[past.length - 1].c;
  const entryRef = p;
  const fut: Candle[] = [];
  // Future : continuation haussière
  for (let i = 0; i < 7; i++) {
    const o = p;
    const c = o + (0.4 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.1 + rng() * 0.1) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "support",       y1: L - 0.1,    y2: L + 0.1,    label: "Précédent low"     },
    { kind: "liquidity_low", y1: sweepLow,   y2: L - 0.15,   label: "Liquidité balayée" },
  ], ref: { swingLow: sweepLow, swingHigh: entryRef + 4 * m, entryRef } };
}

// 10. FVG continuation (BUY)
function shapeFvgContinuation(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
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
  // Pullback dans le FVG
  const target = (fvgLow + fvgHigh) / 2;
  for (let i = 0; i < 3; i++) {
    const o = p;
    const c = Math.max(target, o - (0.3 + rng() * 0.3) * m);
    past.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.18 + rng() * 0.18) * m));
    p = c;
  }
  // 1 candle de réaction
  past.push(candle(p, p + 0.25 * m, (0.2 + rng() * 0.15) * m, 0.1));
  p = past[past.length - 1].c;
  const entryRef = p;
  const fut: Candle[] = [];
  // Dip léger qui touche fvgLow puis rallye
  fut.push({ o: p, c: target + 0.1 * m, h: p + 0.1 * m, l: fvgLow + 0.1 * m });
  p = target + 0.1 * m;
  fut.push(candle(p, p + 0.4 * m, (0.2 + rng() * 0.15) * m, 0.1));
  p += 0.4 * m;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.5 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.1 + rng() * 0.1) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "fvg", y1: fvgLow, y2: fvgHigh, label: "FVG haussier" },
  ], ref: { swingLow: fvgLow, swingHigh: entryRef + 4 * m, entryRef } };
}

// 11. Deep pullback risky (BUY context but pullback too deep)
function shapeDeepPullbackRisky(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
  let p = 1 + rng() * 0.3;
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o + (0.5 + rng() * 0.5) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.13 + rng() * 0.15) * m));
    p = c;
  }
  const peak = p;
  // Pullback profond — 6 bougies rouges, retracement ~65%
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.45) * m;
    past.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.2 + rng() * 0.25) * m));
    p = c;
  }
  const swingLow = Math.min(...past.slice(-7).map((k) => k.l));
  const entryRef = p;
  const fut: Candle[] = [];
  // Future : 1 candle indécise puis recovery (mais initiale faible)
  fut.push(candle(p, p + 0.15 * m, (0.2 + rng() * 0.15) * m, (0.15 + rng() * 0.15) * m));
  p += 0.15 * m;
  fut.push(candle(p, p + 0.3 * m, (0.2 + rng() * 0.15) * m, 0.12));
  p += 0.3 * m;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = o + (0.35 + rng() * 0.4) * m;
    fut.push(candle(o, c, (0.2 + rng() * 0.2) * m, (0.13 + rng() * 0.12) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "support",        y1: swingLow - 0.04,    y2: swingLow + 0.04,    label: "Zone douteuse" },
    { kind: "liquidity_high", y1: peak - 0.05,         y2: peak + 0.05,        label: "Précédent high" },
  ], ref: { swingLow, swingHigh: peak, entryRef } };
}

// 12. High volatility pullback
function shapeHighVolPullback(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
  const effM = m * 1.6;
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
  const entryRef = p;
  const fut: Candle[] = [];
  // Dip large (vol élevée) qui balaie le swingLow par 0.3 (= sweep tight)
  // mais reste au-dessus du logical (wide pour ce template)
  fut.push({
    o: p,
    c: swingLow + 0.6 * effM,
    h: p + (0.3 + rng() * 0.2) * effM,
    l: swingLow - 0.3 * effM,
  });
  p = swingLow + 0.6 * effM;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = o + (0.5 + rng() * 0.4) * effM;
    fut.push(candle(o, c, (0.3 + rng() * 0.2) * effM, (0.15 + rng() * 0.15) * effM));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "support", y1: swingLow - 0.05, y2: swingLow + 0.05, label: "Swing low" },
  ], ref: { swingLow, swingHigh: entryRef + 4 * effM, entryRef } };
}

// 13. Weak breakout
function shapeWeakBreakout(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
  const R = 10;
  let p = 6 + rng() * 0.3;
  for (let i = 0; i < 5; i++) {
    const o = p;
    const c = clamp(o + (0.3 + rng() * 0.4) * m, 5, R - 0.5);
    past.push(candle(o, c, (0.2 + rng() * 0.18) * m, (0.2 + rng() * 0.18) * m));
    p = c;
  }
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = clamp(o + (rng() - 0.5) * 0.5 * m, R - 1.1, R - 0.3);
    past.push(candle(o, c, (0.22 + rng() * 0.18) * m, (0.22 + rng() * 0.18) * m));
    p = c;
  }
  // Weak breakout candle
  past.push(candle(p, R + 0.15 + rng() * 0.2, (0.3 + rng() * 0.2) * m, 0.15));
  p = past[past.length - 1].c;
  const entryRef = p;
  const fut: Candle[] = [];
  // Future : rallye modéré (fast TP atteint, balanced parfois, ambitious rarement)
  fut.push(candle(p, p - 0.15 * m, 0.1, (0.2 + rng() * 0.15) * m));
  p -= 0.15 * m;
  for (let i = 0; i < 6; i++) {
    const o = p;
    const c = o + (0.25 + rng() * 0.3) * m;  // momentum mou
    fut.push(candle(o, c, (0.15 + rng() * 0.15) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "resistance", y1: R - 0.1, y2: R + 0.1, label: "Résistance" },
  ], ref: { swingLow: R - 0.5, swingHigh: R + 0.5, entryRef } };
}

// 14. Counter-trend local (BUY against HTF bearish)
function shapeCounterTrendLocal(rng: () => number, m: number): ShapeOutput {
  const past: Candle[] = [];
  let p = 8 + rng() * 0.3;
  // Downtrend HTF
  for (let i = 0; i < 8; i++) {
    const o = p;
    const c = o - (0.4 + rng() * 0.4) * m;
    past.push(candle(o, c, (0.12 + rng() * 0.15) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  const minorLevel = p;
  // 4 candles rebond local
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o + (0.25 + rng() * 0.3) * m;
    past.push(candle(o, c, (0.2 + rng() * 0.18) * m, (0.15 + rng() * 0.15) * m));
    p = c;
  }
  const entryRef = p;
  const fut: Candle[] = [];
  // Future : rebond modéré puis échec (continuation baissière)
  fut.push(candle(p, p - 0.15 * m, 0.1, (0.2 + rng() * 0.15) * m));
  p -= 0.15 * m;
  for (let i = 0; i < 2; i++) {
    const o = p;
    const c = o + (0.25 + rng() * 0.25) * m;  // petit rebond
    fut.push(candle(o, c, (0.18 + rng() * 0.15) * m, (0.13 + rng() * 0.13) * m));
    p = c;
  }
  // Puis échec
  for (let i = 0; i < 4; i++) {
    const o = p;
    const c = o - (0.35 + rng() * 0.35) * m;
    fut.push(candle(o, c, (0.13 + rng() * 0.13) * m, (0.2 + rng() * 0.2) * m));
    p = c;
  }
  return { past, future: fut, zones: [
    { kind: "support", y1: minorLevel - 0.08, y2: minorLevel + 0.08, label: "Niveau secondaire" },
  ], ref: { swingLow: minorLevel - 0.5, swingHigh: entryRef + 1.5 * m, entryRef } };
}

// ─── Dispatch + entries/stops/tps ────────────────────────────────────────────

export function buildBuildTradeChart(template: BuildTradeTemplate, seed: number, vol: Volatility): BuildTradeChart {
  const rng = mulberry32(seed);
  const m = VOL_MULT[vol];
  let shape: ShapeOutput;
  switch (template.chartShape) {
    case "uptrend_pullback":     shape = shapeUptrendPullback(rng, m); break;
    case "downtrend_pullback":   shape = shapeDowntrendPullback(rng, m); break;
    case "breakout_up":          shape = shapeBreakoutUp(rng, m); break;
    case "breakout_down":        shape = shapeBreakoutDown(rng, m); break;
    case "bounce_support":       shape = shapeBounceSupport(rng, m); break;
    case "rejection_resistance": shape = shapeRejectionResistance(rng, m); break;
    case "range_oscillation":    shape = shapeRangeOscillation(rng, m, template.direction); break;
    case "fakeout_above":        shape = shapeFakeoutAbove(rng, m); break;
    case "sweep_low_reversal":   shape = shapeSweepLowReversal(rng, m); break;
    case "fvg_continuation":     shape = shapeFvgContinuation(rng, m); break;
    case "deep_pullback_risky":  shape = shapeDeepPullbackRisky(rng, m); break;
    case "high_vol_pullback":    shape = shapeHighVolPullback(rng, m); break;
    case "weak_breakout":        shape = shapeWeakBreakout(rng, m); break;
    case "counter_trend_local":  shape = shapeCounterTrendLocal(rng, m); break;
  }
  const { swingLow, swingHigh, entryRef } = shape.ref;
  const direction = template.direction;
  const effM = template.chartShape === "high_vol_pullback" ? m * 1.6 : m;
  // Calcul des 3 entries
  const entries = direction === "BUY"
    ? {
        aggressive:    entryRef,
        confirmation:  entryRef + 0.5 * effM,
        deep_pullback: Math.max(swingLow + 0.1 * effM, entryRef - 0.7 * effM),
      }
    : {
        aggressive:    entryRef,
        confirmation:  entryRef - 0.5 * effM,
        deep_pullback: Math.min(swingHigh - 0.1 * effM, entryRef + 0.7 * effM),
      };
  // Stops (depuis le swing logique)
  const stops = direction === "BUY"
    ? {
        tight:   swingLow + 0.1 * effM,
        logical: swingLow - 0.4 * effM,
        wide:    swingLow - 1.2 * effM,
      }
    : {
        tight:   swingHigh - 0.1 * effM,
        logical: swingHigh + 0.4 * effM,
        wide:    swingHigh + 1.2 * effM,
      };
  // TPs (depuis entry, multiples de risque)
  // On utilise l'entry "confirmation" comme référence pour le risque
  const ref = direction === "BUY" ? entries.confirmation : entries.confirmation;
  const refRisk = Math.abs(ref - stops.logical);
  const tps = direction === "BUY"
    ? {
        fast:      ref + refRisk * 1.0,
        balanced:  ref + refRisk * 2.2,
        ambitious: ref + refRisk * 3.8,
      }
    : {
        fast:      ref - refRisk * 1.0,
        balanced:  ref - refRisk * 2.2,
        ambitious: ref - refRisk * 3.8,
      };
  const { domain } = finalize(shape.past, shape.future, shape.zones, [
    ...Object.values(entries), ...Object.values(stops), ...Object.values(tps),
  ]);
  return {
    past:    shape.past,
    future:  shape.future,
    zones:   shape.zones,
    domain,
    direction,
    entries,
    stops,
    tps,
    currentPrice: entryRef,
  };
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

export interface ChoiceSet {
  entry: EntryType;
  stop:  StopType;
  tp:    TpType;
}

export type Outcome = "tp_hit" | "sl_hit" | "no_fill" | "open";

export interface BuildTradeResult {
  outcome:      Outcome;
  entryFilled:  boolean;
  entryIdx:     number | null;
  slHit:        boolean;
  slIdx:        number | null;
  tpHit:        boolean;
  tpIdx:        number | null;
  rr:           number;       // R/R réalisé (0 si pas de hit)
  maxDrawdown:  number;       // drawdown max absolu après entry
  // Score breakdown
  qualityMatch:  number;      // 0-3 (combien correspondent à optimal)
  qualityPoints: number;
  outcomePoints: number;
  points:        number;      // total
  streakBonus:   number;
}

function findEntryFillIndex(entry: number, direction: TradeDirection, future: Candle[]): number | null {
  for (let i = 0; i < future.length; i++) {
    const k = future[i];
    // BUY entry fills si low <= entry (price came down to entry)
    // SELL entry fills si high >= entry
    if (direction === "BUY"  && k.l <= entry && k.h >= entry) return i;
    if (direction === "SELL" && k.h >= entry && k.l <= entry) return i;
  }
  return null;
}

function findStopHitIndex(stop: number, direction: TradeDirection, future: Candle[], startIdx: number): number | null {
  for (let i = startIdx; i < future.length; i++) {
    const k = future[i];
    if (direction === "BUY"  && k.l <= stop) return i;
    if (direction === "SELL" && k.h >= stop) return i;
  }
  return null;
}

function findTpHitIndex(tp: number, direction: TradeDirection, future: Candle[], startIdx: number): number | null {
  for (let i = startIdx; i < future.length; i++) {
    const k = future[i];
    if (direction === "BUY"  && k.h >= tp) return i;
    if (direction === "SELL" && k.l <= tp) return i;
  }
  return null;
}

function maxDrawdownAfterEntry(entry: number, direction: TradeDirection, future: Candle[], startIdx: number, endIdx: number): number {
  let worst = entry;
  for (let i = startIdx; i <= endIdx && i < future.length; i++) {
    const k = future[i];
    if (direction === "BUY")  worst = Math.min(worst, k.l);
    if (direction === "SELL") worst = Math.max(worst, k.h);
  }
  return Math.abs(entry - worst);
}

export function evaluateTrade(
  picks:    ChoiceSet,
  chart:    BuildTradeChart,
  optimal:  ChoiceSet,
  currentStreak: number,
): BuildTradeResult {
  const entry = chart.entries[picks.entry];
  const stop  = chart.stops[picks.stop];
  const tp    = chart.tps[picks.tp];
  const direction = chart.direction;
  const future = chart.future;

  // Entry fill
  let entryIdx = findEntryFillIndex(entry, direction, future);
  // Pour aggressive, l'entry est à entryRef = dernier close du past = touché immédiatement
  // → on considère que la position s'ouvre dès la 1re bougie future
  if (picks.entry === "aggressive") entryIdx = 0;
  const entryFilled = entryIdx !== null;

  let outcome: Outcome = "no_fill";
  let slIdx: number | null = null;
  let tpIdx: number | null = null;
  let slHit = false;
  let tpHit = false;
  let rr = 0;
  let drawdown = 0;

  if (entryFilled) {
    slIdx = findStopHitIndex(stop, direction, future, entryIdx!);
    tpIdx = findTpHitIndex(tp, direction, future, entryIdx!);
    // Lequel arrive en premier ?
    if (tpIdx !== null && (slIdx === null || tpIdx < slIdx)) {
      tpHit = true;
      outcome = "tp_hit";
      rr = Math.abs(tp - entry) / Math.max(0.001, Math.abs(entry - stop));
      drawdown = maxDrawdownAfterEntry(entry, direction, future, entryIdx!, tpIdx);
    } else if (slIdx !== null) {
      slHit = true;
      outcome = "sl_hit";
      drawdown = maxDrawdownAfterEntry(entry, direction, future, entryIdx!, slIdx);
    } else {
      outcome = "open";
      drawdown = maxDrawdownAfterEntry(entry, direction, future, entryIdx!, future.length - 1);
    }
  }

  // Score
  let qualityMatch = 0;
  if (picks.entry === optimal.entry) qualityMatch++;
  if (picks.stop  === optimal.stop)  qualityMatch++;
  if (picks.tp    === optimal.tp)    qualityMatch++;
  const qualityPoints = qualityMatch === 3 ? 60 : qualityMatch === 2 ? 30 : qualityMatch === 1 ? 0 : -20;

  let outcomePoints = 0;
  if (outcome === "tp_hit") {
    outcomePoints = 30 + Math.max(0, Math.round((rr - 1) * 20));
  } else if (outcome === "sl_hit") {
    outcomePoints = -30;
  } else if (outcome === "open") {
    outcomePoints = 5;
  } else {
    // no_fill
    outcomePoints = 10;
  }

  const basePoints = qualityPoints + outcomePoints;
  const streakBonus = qualityMatch === 3 && outcome === "tp_hit" && currentStreak >= 2 ? 30 : 0;

  return {
    outcome,
    entryFilled,
    entryIdx,
    slHit,
    slIdx,
    tpHit,
    tpIdx,
    rr,
    maxDrawdown:  drawdown,
    qualityMatch,
    qualityPoints,
    outcomePoints,
    points:       basePoints + streakBonus,
    streakBonus,
  };
}

// ─── Verdicts ────────────────────────────────────────────────────────────────

export function setupVerdict(result: BuildTradeResult): { label: string; color: "emerald" | "amber" | "red" } {
  if (result.qualityMatch === 3 && result.outcome === "tp_hit") return { label: "Setup parfait",     color: "emerald" };
  if (result.qualityMatch >= 2  && result.outcome === "tp_hit") return { label: "Setup solide",      color: "emerald" };
  if (result.outcome === "tp_hit")                              return { label: "Trade gagnant",     color: "emerald" };
  if (result.outcome === "no_fill")                             return { label: "Trade non rempli",  color: "amber"   };
  if (result.outcome === "open")                                return { label: "Trade en cours",    color: "amber"   };
  if (result.qualityMatch >= 2)                                 return { label: "Bon plan, mauvais marché", color: "amber" };
  return { label: "Setup raté", color: "red" };
}

export const DIFFICULTY_META: Record<Difficulty, { label: string; dotClass: string; textClass: string; description: string }> = {
  beginner: {
    label:       "Débutant",
    dotClass:    "bg-emerald-400",
    textClass:   "text-emerald-400",
    description: "Structure claire, choix relativement évidents — comprends invalidation et RR.",
  },
  intermediate: {
    label:       "Intermédiaire",
    dotClass:    "bg-blue-400",
    textClass:   "text-blue-400",
    description: "Plusieurs choix plausibles : sécurité vs rendement, confirmation vs RR.",
  },
  advanced: {
    label:       "Avancé",
    dotClass:    "bg-amber-400",
    textClass:   "text-amber-400",
    description: "Contexte ambigu, aucun setup parfait. Choix du moins mauvais scénario.",
  },
};

export function sessionVerdict(score: number, perfectCount: number, total: number): string {
  if (perfectCount >= total - 1) return "Trader architecte";
  if (score >= 500)              return "Construction solide";
  if (score >= 200)              return "Plan correct";
  if (score >= 0)                return "Encore à structurer";
  return "Plan désordonné";
}
