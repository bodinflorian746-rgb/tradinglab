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
export { withAssetPrices } from "./build-the-trade";

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
    optimalExplain: "Here, the HTF trend is clear: looking for the best price (deep pullback) makes sense, with a stop behind the structure and a wide target in the direction of momentum.",
    lessons: {
      beginner:     "On a setup in the direction of the HTF, looking for the best price and aiming wide is a logical option. Here, patience can pay.",
      intermediate: "The deep pullback often improves the R/R. Combined with a stop behind the structure, it offers the best edge here.",
      advanced:     "A trend continuation aligned with the HTF can offer a high-probability setup, with an R/R of 3:1 or more. Size is decided by your risk management plan; an ambitious TP is justified here by the likely momentum.",
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
    optimalExplain: "Here, with a bearish HTF and a fading bounce, an entry at the best price makes sense, with a stop above the swing high and an ambitious TP in the direction of momentum.",
    lessons: {
      beginner:     "Downtrend and fading bounce: a SELL stays in line with the scenario, if it fits your plan, at the best price possible with a wide TP.",
      intermediate: "Here, the deep bounce often gives the best R/R. A stop above the structure helps absorb the noise.",
      advanced:     "It mirrors the bullish trend continuation. An R/R of 3:1 or more remains a logical target here.",
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
    optimalExplain: "Here, the breakout aligned with the HTF can signal immediate momentum. Waiting for a deep pullback risks missing the move. An aggressive entry, a stop below the broken level and an ambitious TP form a logical option.",
    lessons: {
      beginner:     "On an HTF-aligned breakout, the entry window is often short: the market doesn't wait for the latecomer. It's on you to judge, per your plan, whether you get in.",
      intermediate: "On a strong breakout, waiting for a deep pullback can mean missing the move. In this case, an aggressive entry makes sense.",
      advanced:     "An HTF breakout with a strong candle brings strong confirmation. The pullback can be shallow, or absent: weigh it against your plan.",
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
    optimalExplain: "Here, the break aligned with the HTF can signal selling momentum. A quick entry with a stop above the broken support is a logical option.",
    lessons: {
      beginner:     "Support break with a bearish HTF: a SELL stays in line with the scenario, if it fits your trading plan.",
      intermediate: "A stop just above the broken level (now resistance) is a logical option. Here, momentum can justify an aggressive entry.",
      advanced:     "It mirrors the bullish breakout. A technical stop above the broken support, with a margin, makes sense.",
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
    optimalExplain: "On a tested support, waiting for the bounce to confirm before entering makes sense. A stop below the support and a balanced TP are logical here, since the next resistance caps the run.",
    lessons: {
      beginner:     "On a support, waiting for the green confirmation candle is often safer than a blind entry.",
      intermediate: "The confirmation can validate the zone. Here, the balanced TP accounts for the next resistance.",
      advanced:     "On an HTF support tested 2 or 3 times, confirmation helps preserve the edge. An R/R around 2 to 2.5:1 is common in this case.",
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
    optimalExplain: "On a tested resistance, waiting for the rejection to confirm before entering makes sense. A stop above the high and a balanced TP (the next support) are logical here.",
    lessons: {
      beginner:     "On a resistance, waiting for the red confirmation candle is a cautious option. The rejection is more convincing once it asserts itself.",
      intermediate: "Here, the confirmation takes the form of a visible rejection candle. Without it, the retest can extend.",
      advanced:     "It mirrors the bounce off support. A stop above the high, with an ATR margin, is a logical option.",
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
    optimalExplain: "In a range, the edge stays limited: a confirmation helps validate the entry, and a fast TP makes sense, since the range bottom caps the run.",
    lessons: {
      intermediate: "A range often offers a limited R/R. Here, an ambitious TP makes little sense; aiming for the range bottom is more logical.",
      advanced:     "A range rather suits counter-moves. A confirmation and a fast TP often raise the win rate, with an R/R that stays below 2.",
      beginner:     "At a range top, a modest target is often more realistic: price moves inside a box.",
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
    optimalExplain: "Here, the range plays out between bottom and top. A confirmation and a fast TP make sense, since the run is limited.",
    lessons: {
      intermediate: "A BUY at the bottom rather aims for the top, not beyond. Here, the fast TP sits near the top.",
      advanced:     "Same principles as the SELL at the top: a confirmation and a tight TP often help raise the win rate.",
      beginner:     "In a range, aiming for the other edge is often enough. Here, a modest target makes sense.",
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
    optimalExplain: "After a fakeout, waiting for confirmation (a candle validating the return below resistance) makes sense. A stop above the fakeout peak and a balanced TP down to the next support are logical here.",
    lessons: {
      intermediate: "A fakeout can offer an entry signal, preferably with confirmation. Without it, the retest can cause a 2nd sweep.",
      advanced:     "A stop above the fakeout wick matches the real invalidation here, rather than one inside the trap zone.",
      beginner:     "After a visible trap, waiting for the follow-through is often wiser than acting out of FOMO.",
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
    optimalExplain: "Here, the sweep can signal a reversal. In this specific case, an aggressive entry makes sense, because the sweep already serves as a first confirmation. A stop below the sweep low is a logical option.",
    lessons: {
      intermediate: "Classic ICT pattern: here, the sweep is a strong argument for an entry, to confirm against your plan. A stop below the sweep is a logical option.",
      advanced:     "Here, an aggressive entry is justified by the pattern, not by impatience. A stop below the sweep low (the new invalidation) is a logical option.",
      beginner:     "A big wick that sweeps a low then climbs back can bring strong confirmation for a BUY.",
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
    optimalExplain: "Here, the FVG can act as a demand zone, and the confirmation validates the reaction. A stop below the bottom of the FVG and an ambitious TP make sense, since the HTF is aligned and the zone still intact.",
    lessons: {
      intermediate: "The FVG often acts as a demand zone on the retest. Here, the confirmation preserves the edge without missing the move.",
      advanced:     "Bullish FVG, aligned HTF and first retest: a top-quality setup. An R/R of 3:1 or more is logical here.",
      beginner:     "The FVG often draws price in. Here, the confirmation takes the form of a green candle defending the zone.",
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
    optimalExplain: "Here, the break lacks strength, and the edge is reduced. Waiting for confirmation before entering makes sense, with a fast TP since the continuation remains uncertain.",
    lessons: {
      intermediate: "A weak break degrades the trade. A confirmation and a tight TP help adapt to a weak signal here.",
      advanced:     "A weak break continues much less often than a clean one. In this case, an ambitious TP has little chance of being hit.",
      beginner:     "If the break lacks body, aiming small and waiting for confirmation is a logical option.",
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
    optimalExplain: "Here, the deep pullback can announce a structural break. Confirmation preserves the edge: an aggressive entry would mean chasing price, and a deep pullback entry would mean betting on a doubtful zone.",
    lessons: {
      advanced:     "A pullback of more than 60% of the impulse can signal a tired pattern. Here, a confirmation and a moderate TP are a logical option.",
      intermediate: "The deeper the pullback, the more confirmation matters. Here, an aggressive entry would be very risky.",
      beginner:     "A pullback that's too deep can break the trend. Waiting for the structure to re-confirm is a logical option here.",
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
    optimalExplain: "In high volatility, noise is amplified and a standard stop is likely to be swept. Here, the 'wide stop' becomes the LOGICAL stop. A balanced TP makes sense, since the potential move is also larger.",
    lessons: {
      advanced:     "An ATR-adjusted stop is a logical option. In high volatility, the 'wide stop' isn't excessive: it's simply adapted.",
      intermediate: "The stop works better when it adapts to current volatility rather than to a fixed distance.",
      beginner:     "When the market moves hard, the stop needs room. Otherwise, it may get hit for nothing.",
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
    optimalExplain: "Against the HTF, the odds are often unfavorable. Here, a confirmation and a fast TP help secure what can be secured; aiming far against the major trend is hard to defend.",
    lessons: {
      advanced:     "Trading against the HTF often means accepting unfavorable odds. Here, the fast TP captures the edge before a possible reversal.",
      intermediate: "A counter-trend setup rather calls for a defensive approach. A confirmation and a quick exit limit exposure here.",
      beginner:     "If you trade against the trend, aiming small and exiting fast is often the most cautious option.",
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
  // 0 ou 1 critère sur 3 : trade gagnant, mais le plan reste faible (ambre)
  if (result.outcome === "tp_hit")                              return { label: "Winner, but weak plan", color: "amber" };
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
