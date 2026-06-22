// Mini-game "BUILD THE TRADE" — V2 (EN translation).
//
// Mirror of the FR module with user-facing strings translated.
// Logic, types, seeds and numeric values are re-exported from the original
// module.

import {
  type Asset, type Session, type Volatility, type Spread,
  type HtfBias, type MacroContext,
  type Candle, type ChartZone,
  type Difficulty,
  type TradeDirection,
  type EntryType,
  type StopType,
  type TpType,
  type ChartShape,
  type DifficultyLessons,
  type BuildTradeTemplate,
  type BuildTradeInstance,
  type BuildTradeChart,
  type ChoiceSet,
  type Outcome,
  type BuildTradeResult,
  ROUNDS_PER_SESSION,
  BUILD_TRADE_TEMPLATES as FR_TEMPLATES,
  generateBuildTradeScenarios as generateBuildTradeScenariosFr,
  buildBuildTradeChart as buildBuildTradeChartFr,
  evaluateTrade,
} from "./build-the-trade";

// ─── Reexports types / utils ─────────────────────────────────────────────────

export type {
  Asset, Session, Volatility, Spread, HtfBias, MacroContext,
  Candle, ChartZone,
  Difficulty,
  TradeDirection,
  EntryType,
  StopType,
  TpType,
  ChartShape,
  DifficultyLessons,
  BuildTradeTemplate,
  BuildTradeInstance,
  BuildTradeChart,
  ChoiceSet,
  Outcome,
  BuildTradeResult,
};

export { ROUNDS_PER_SESSION, evaluateTrade };

// ─── Translation table for zone labels (FR key → EN) ─────────────────────────

const ZONE_LABEL_EN: Record<string, string> = {
  "Swing low":          "Swing low",
  "Swing high":         "Swing high",
  "Résistance":         "Resistance",
  "Support":            "Support",
  "Résistance HTF":     "HTF resistance",
  "Support HTF":        "HTF support",
  "Résistance cassée":  "Broken resistance",
  "Support cassé":      "Broken support",
  "Plafond range":      "Range top",
  "Plancher range":     "Range bottom",
  "Wick fakeout":       "Fakeout wick",
  "Précédent low":      "Previous low",
  "Précédent high":     "Previous high",
  "Liquidité balayée":  "Liquidity swept",
  "FVG haussier":       "Bullish FVG",
  "Zone douteuse":      "Doubtful zone",
  "Niveau secondaire":  "Secondary level",
};

function translateZones(zones: ChartZone[]): ChartZone[] {
  return zones.map((z) => ({ ...z, label: ZONE_LABEL_EN[z.label] ?? z.label }));
}

// Wrapper around buildBuildTradeChart that translates the zone labels.
export function buildBuildTradeChart(template: BuildTradeTemplate, seed: number, vol: Volatility): BuildTradeChart {
  const chart = buildBuildTradeChartFr(template, seed, vol);
  return { ...chart, zones: translateZones(chart.zones) };
}

// ─── EN labels ────────────────────────────────────────────────────────────────

export const ENTRY_LABELS: Record<EntryType, string> = {
  aggressive:    "Aggressive",
  confirmation:  "Confirmation",
  deep_pullback: "Deep pullback",
};
export const STOP_LABELS: Record<StopType, string> = {
  tight:   "Tight",
  logical: "Logical",
  wide:    "Wide",
};
export const TP_LABELS: Record<TpType, string> = {
  fast:      "Fast",
  balanced:  "Balanced",
  ambitious: "Ambitious",
};

// ─── EN templates ───────────────────────────────────────────────────────────

export const BUILD_TRADE_TEMPLATES_EN: BuildTradeTemplate[] = [
  {
    id: "trend_continuation_bull",
    title: "Bullish trend continuation",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Clean uptrend. Price has just finished a pullback.",
    optimal: { entry: "deep_pullback", stop: "logical", tp: "ambitious" },
    optimalExplain: "Clear HTF trend = take the best price possible (deep pullback), stop behind the structure, aim wide in the direction of momentum.",
    lessons: {
      beginner:     "A setup in the direction of the HTF: you take the best price possible and aim wide. The market pays the patient.",
      intermediate: "The deep pullback optimizes the R/R. Combined with a stop behind the structure, it's the maximum edge.",
      advanced:     "HTF-aligned trend continuation = full-size setup, R/R 3:1+. Ambitious is justified because momentum is likely.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "trend_continuation_bear",
    title: "Bearish trend continuation",
    chartShape: "downtrend_pullback",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Clean downtrend. Price has just finished a bounce.",
    optimal: { entry: "deep_pullback", stop: "logical", tp: "ambitious" },
    optimalExplain: "Bearish HTF + dead bounce = entry at the best price, stop above the swing high, ambitious TP in the direction of momentum.",
    lessons: {
      beginner:     "Downtrend + dead bounce = SELL at the highest price possible, wide TP.",
      intermediate: "The deep bounce gives the optimal R/R. Stop above the structure to absorb the noise.",
      advanced:     "Symmetric setup of the trend continuation bull. R/R 3:1+ targeted.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "breakout_bull_clean",
    title: "Clean bullish breakout",
    chartShape: "breakout_up",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Price has just broken an HTF resistance with a strong candle.",
    optimal: { entry: "aggressive", stop: "logical", tp: "ambitious" },
    optimalExplain: "HTF-aligned breakout = immediate momentum. No time to wait for a deep pullback (which may never come). Aggressive entry, stop below the broken level, ambitious TP.",
    lessons: {
      beginner:     "On an HTF-aligned breakout, you don't dawdle. The market climbs without waiting for the latecomer.",
      intermediate: "Waiting for a deep pullback on a strong breakout = missing the move. Aggressive justified.",
      advanced:     "HTF breakout + strong candle = immediate signal. The pullback can be shallow or nonexistent.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "breakout_bear_clean",
    title: "Clean bearish breakout",
    chartShape: "breakout_down",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Price has just broken an HTF support with a strong candle.",
    optimal: { entry: "aggressive", stop: "logical", tp: "ambitious" },
    optimalExplain: "HTF-aligned breakdown = momentum on the sell side. Immediate entry, stop above the broken support.",
    lessons: {
      beginner:     "Support break + bearish HTF = SELL now, without waiting.",
      intermediate: "Stop just above the broken level (now resistance). Aggressive justified by the momentum.",
      advanced:     "Mirror setup of the breakout bull. Technical stop = top of the broken support + margin.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "bounce_support_clean",
    title: "Bounce off a major support",
    chartShape: "bounce_support",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Price has just bounced off an HTF support with a clear wick.",
    optimal: { entry: "confirmation", stop: "logical", tp: "balanced" },
    optimalExplain: "Tested support = wait for the bounce confirmation before entering. Stop below the support, balanced TP because the next resistance caps the run.",
    lessons: {
      beginner:     "On a support, you wait for the green confirmation candle. No blind entry.",
      intermediate: "The confirmation validates the zone. The balanced TP reflects the next resistance.",
      advanced:     "Bounce off an HTF support tested 2-3 times → confirmation preserves the edge. R/R 2-2.5:1 typical.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "rejection_resistance_clean",
    title: "Rejection off a major resistance",
    chartShape: "rejection_resistance",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Price has just rejected an HTF resistance with a wick.",
    optimal: { entry: "confirmation", stop: "logical", tp: "balanced" },
    optimalExplain: "Tested resistance = confirmation of the rejection before entry. Stop above the high, balanced TP (the next support).",
    lessons: {
      beginner:     "On resistance, you wait for the red confirmation candle. The rejection must assert itself.",
      intermediate: "Confirmation = visible rejection candle. Without it, the retest can continue.",
      advanced:     "Mirror pattern of the bounce support. Stop = high + ATR margin.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
  },
  {
    id: "range_top_short",
    title: "SELL at the range top",
    chartShape: "range_oscillation",
    direction: "SELL",
    htfBias: "range",
    macroContext: "normal",
    context: "Price reaches the top of a tight range. You're looking for the SELL.",
    optimal: { entry: "confirmation", stop: "logical", tp: "fast" },
    optimalExplain: "In a range, the edge is small: confirmation to validate the entry, fast TP because the run is capped by the range bottom.",
    lessons: {
      intermediate: "A range has an inherently limited R/R. An ambitious TP makes no sense; you aim for the range bottom.",
      advanced:     "Range = fade environment. Confirmation + fast TP = higher win rate, RR < 2.",
      beginner:     "At a range top, you sell small. No big TP because price moves inside a box.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "range_bottom_long",
    title: "BUY at the range bottom",
    chartShape: "range_oscillation",
    direction: "BUY",
    htfBias: "range",
    macroContext: "normal",
    context: "Price reaches the bottom of a tight range. You're looking for the BUY.",
    optimal: { entry: "confirmation", stop: "logical", tp: "fast" },
    optimalExplain: "Range = arbitrage between bottom and top. Confirmation + fast TP because the run is bounded.",
    lessons: {
      intermediate: "The BUY off the bottom aims for the top, no further. The fast TP sticks to the top.",
      advanced:     "Same principles as the SELL off the top: confirmation + tight TP to maximize the win %.",
      beginner:     "Range = you aim for the other side, nothing more. No ambition.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "fake_breakout_short",
    title: "Fake breakout: SELL after the trap",
    chartShape: "fakeout_above",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Price spiked above the resistance then closed back below. Classic trap.",
    optimal: { entry: "confirmation", stop: "logical", tp: "balanced" },
    optimalExplain: "After a fakeout, you wait for the confirmation (candle validating the return below resistance). Stop above the fakeout peak, balanced TP down to the next support.",
    lessons: {
      intermediate: "Fakeout = entry signal but with confirmation. Without confirmation, the retest can do a 2nd sweep.",
      advanced:     "Stop above the fakeout wick: that's the REAL invalidation. Not inside the trap zone.",
      beginner:     "After a visible trap, you wait for the follow-through. No FOMO.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "sweep_reversal_bull",
    title: "Liquidity sweep + reversal",
    chartShape: "sweep_low_reversal",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Price has just swept the liquidity below the previous low then closed back above.",
    optimal: { entry: "aggressive", stop: "logical", tp: "balanced" },
    optimalExplain: "Sweep = immediate reversal signal. Aggressive justified because the confirmation is already given by the sweep. Stop below the sweep low.",
    lessons: {
      intermediate: "Classic ICT pattern: the sweep IS the confirmation. Enter aggressively, stop below the sweep.",
      advanced:     "Aggressive justified by the pattern, not by impatience. Stop below the sweep low (the new invalidation).",
      beginner:     "A big wick that sweeps a low then climbs back = clear BUY signal.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "fvg_continuation_bull",
    title: "Reaction off a bullish FVG",
    chartShape: "fvg_continuation",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Price comes back to test a bullish FVG. The reaction is underway.",
    optimal: { entry: "confirmation", stop: "logical", tp: "ambitious" },
    optimalExplain: "FVG = institutional demand zone. Confirmation validates the reaction. Stop below the bottom of the FVG, ambitious TP because HTF aligned + fresh zone.",
    lessons: {
      intermediate: "The FVG acts as a demand zone on the retest. Confirmation preserves the edge without missing the move.",
      advanced:     "Bullish FVG + HTF aligned + first retest = A+ setup. R/R 3:1+ targeted.",
      beginner:     "The FVG = price magnet. Confirmation = green candle defending the zone.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "weak_breakout_setup",
    title: "Weak breakout: reduced edge",
    chartShape: "weak_breakout",
    direction: "BUY",
    htfBias: "range",
    macroContext: "normal",
    context: "Price has just broken above the resistance, but the candle is small and hesitant.",
    optimal: { entry: "confirmation", stop: "logical", tp: "fast" },
    optimalExplain: "Breakout without force = reduced edge. Confirmation mandatory before entering. Fast TP because the continuation is uncertain.",
    lessons: {
      intermediate: "Weak breakout = degraded trade. Confirmation + tight TP = adapting to the weak signal.",
      advanced:     "Stats on a weak breakout: ~35% continuation. An ambitious TP is mathematically losing.",
      beginner:     "If the breakout lacks body, you take it small and wait for confirmation.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "deep_pullback_risky",
    title: "Very deep pullback: breakdown risk",
    chartShape: "deep_pullback_risky",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "The pullback has become very deep. More than 60% of the prior impulse is retraced.",
    optimal: { entry: "confirmation", stop: "logical", tp: "balanced" },
    optimalExplain: "Deep pullback = structural breakdown risk. Confirmation preserves the edge. Aggressive would be chasing, deep_pullback would be FOMO on a doubtful zone.",
    lessons: {
      advanced:     "Pullback > 60% of the impulse = the pattern is tired. Confirmation mandatory + moderate TP.",
      intermediate: "The deeper the pullback, the more critical the confirmation becomes. Aggressive here = Russian roulette.",
      beginner:     "A pullback that's too deep can break the trend. You wait for the structure to re-confirm.",
    },
    difficulties: ["advanced"],
  },
  {
    id: "high_vol_setup",
    title: "Setup in high volatility",
    chartShape: "high_vol_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "High volatility. The candles are wide, the wicks deep.",
    optimal: { entry: "confirmation", stop: "wide", tp: "balanced" },
    optimalExplain: "High volatility = the noise is amplified. A standard stop gets swept. The 'wide stop' becomes the LOGICAL stop. Balanced TP because the potential move is also extended.",
    lessons: {
      advanced:     "ATR-adjusted stop. In high vol, the 'wide stop' isn't wide, it's just the adapted one.",
      intermediate: "The stop must adapt to the current volatility, not to a fixed standard.",
      beginner:     "When the market moves hard, the stop must breathe. Otherwise it pops for nothing.",
    },
    difficulties: ["intermediate", "advanced"],
  },
  {
    id: "counter_trend_local",
    title: "Local setup against the HTF: defensive",
    chartShape: "counter_trend_local",
    direction: "BUY",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Bearish HTF. A BUY setup appears locally (LTF), risky but tradable.",
    optimal: { entry: "confirmation", stop: "logical", tp: "fast" },
    optimalExplain: "Against the HTF = unfavorable odds. Confirmation mandatory + fast TP to secure what you can. No ambition against the major trend.",
    lessons: {
      advanced:     "Trading against the HTF = accepting 30-40% odds. The fast TP captures the edge before the reversal.",
      intermediate: "Counter-trend setup = defensive. Confirmation + fast exit minimize exposure.",
      beginner:     "If you trade against the trend, you take it small and exit fast. Never ambitious.",
    },
    difficulties: ["advanced"],
  },
];

// Canonical alias so the page can import BUILD_TRADE_TEMPLATES just like in FR.
export const BUILD_TRADE_TEMPLATES = BUILD_TRADE_TEMPLATES_EN;

// ─── generateBuildTradeScenarios EN ──────────────────────────────────────────
// Reuse FR logic but remap the text fields to the EN template by id.

export function generateBuildTradeScenarios(seed: number, difficulty: Difficulty): BuildTradeInstance[] {
  const frInstances = generateBuildTradeScenariosFr(seed, difficulty);
  return frInstances.map((inst) => {
    const enTpl = BUILD_TRADE_TEMPLATES_EN.find((t) => t.id === inst.id);
    if (!enTpl) return inst;
    return {
      ...enTpl,
      asset:      inst.asset,
      session:    inst.session,
      volatility: inst.volatility,
      spread:     inst.spread,
      seed:       inst.seed,
      difficulty: inst.difficulty,
    };
  });
}

// ─── EN verdicts ──────────────────────────────────────────────────────────────

export function setupVerdict(result: BuildTradeResult): { label: string; color: "emerald" | "amber" | "red" } {
  if (result.qualityMatch === 3 && result.outcome === "tp_hit") return { label: "Perfect setup",      color: "emerald" };
  if (result.qualityMatch >= 2  && result.outcome === "tp_hit") return { label: "Solid setup",        color: "emerald" };
  if (result.outcome === "tp_hit")                              return { label: "Winning trade",      color: "emerald" };
  if (result.outcome === "no_fill")                             return { label: "Trade not filled",   color: "amber"   };
  if (result.outcome === "open")                                return { label: "Trade open",         color: "amber"   };
  if (result.qualityMatch >= 2)                                 return { label: "Good plan, bad market", color: "amber" };
  return { label: "Failed setup", color: "red" };
}

export const DIFFICULTY_META: Record<Difficulty, { label: string; dotClass: string; textClass: string; description: string }> = {
  beginner: {
    label:       "Beginner",
    dotClass:    "bg-emerald-400",
    textClass:   "text-emerald-400",
    description: "Clear structure, relatively obvious choices, understand invalidation and RR.",
  },
  intermediate: {
    label:       "Intermediate",
    dotClass:    "bg-blue-400",
    textClass:   "text-blue-400",
    description: "Several plausible choices: safety vs return, confirmation vs RR.",
  },
  advanced: {
    label:       "Advanced",
    dotClass:    "bg-amber-400",
    textClass:   "text-amber-400",
    description: "Ambiguous context, no perfect setup. Choosing the least bad scenario.",
  },
};

export function sessionVerdict(score: number, perfectCount: number, total: number): string {
  if (perfectCount >= total - 1) return "Architect trader";
  if (score >= 500)              return "Solid build";
  if (score >= 200)              return "Decent plan";
  if (score >= 0)                return "Still to structure";
  return "Messy plan";
}

// Re-export FR for comparison if needed.
export { FR_TEMPLATES as BUILD_TRADE_TEMPLATES_FR };
