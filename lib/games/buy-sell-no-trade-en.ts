// BUY / SELL / NO TRADE mini-game — V2 (EN translation).
//
// Mirror of the FR module with user-facing strings translated.
// Logic, types, seeds and numeric values are re-exported from the
// original module.

import {
  type Difficulty,
  type GameChoice,
  type SetupKey,
  type Metric,
  type ScenarioTemplate,
  type ScenarioInstance,
  type ChoiceRationales,
  type DifficultyLessons,
  type BuySellChart,
  type ScoreResult,
  ROUNDS_PER_SESSION,
  SCENARIO_TEMPLATES as FR_TEMPLATES,
  buildChart as buildChartFr,
  generateScenarios as generateScenariosFr,
  scoreChoice,
  mulberry32,
} from "./buy-sell-no-trade";
import type { ChartZone } from "./shared";

// Re-exports of types / utilities
export type {
  Difficulty,
  GameChoice,
  SetupKey,
  Metric,
  ScenarioTemplate,
  ScenarioInstance,
  ChoiceRationales,
  DifficultyLessons,
  BuySellChart,
  ScoreResult,
};
export type {
  Asset,
  Session,
  Volatility,
  Spread,
  HtfBias,
  MacroContext,
  Candle,
  ChartZone,
  ZoneKind,
} from "./buy-sell-no-trade";

export { ROUNDS_PER_SESSION, scoreChoice, mulberry32 };

// ─── Translation table for zone labels ───────────────────────────────────────

const ZONE_LABEL_EN: Record<string, string> = {
  "Résistance":           "Resistance",
  "Support":              "Support",
  "Résistance HTF":       "HTF Resistance",
  "Support HTF":          "HTF Support",
  "Zone de demande":      "Demand zone",
  "Zone d'offre":         "Supply zone",
  "Précédent low":        "Previous low",
  "Précédent high":       "Previous high",
  "Liquidité au-dessus":  "Liquidity above",
  "Liquidité en-dessous": "Liquidity below",
  "Liquidité balayée":    "Swept liquidity",
  "FVG haussier":         "Bullish FVG",
  "Plafond range":        "Range ceiling",
  "Plancher range":       "Range floor",
  "Sweep haut":           "Sweep high",
  "Sweep bas":            "Sweep low",
  "Niveau secondaire":    "Secondary level",
};

function translateZones(zones: ChartZone[]): ChartZone[] {
  return zones.map((z) => ({ ...z, label: ZONE_LABEL_EN[z.label] ?? z.label }));
}

// buildChart wrapper that translates zone labels.
export function buildChart(
  setup: SetupKey,
  seed: number,
  volatility: ScenarioInstance["volatility"] = "normale",
  difficulty: Difficulty = "intermediate",
): BuySellChart {
  const chart = buildChartFr(setup, seed, volatility, difficulty);
  return { ...chart, zones: translateZones(chart.zones) };
}

// ─── EN Templates ─────────────────────────────────────────────────────────────

export const SCENARIO_TEMPLATES_EN: ScenarioTemplate[] = [
  {
    id: "breakout_bullish_clean",
    title: "Clean bullish breakout",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "Price consolidates under a major resistance and just broke through it with a strong candle.",
    rationales: {
      BUY: "✓ The HTF is bullish and the breakout is aligned. Resistance was just cleared with a strong candle — this is the textbook continuation scenario. BUY is the logical read of the market.",
      SELL: "✗ Selling into a bullish breakout on a bullish HTF = putting yourself against the trend with no reversal signal. This is a textbook emotional trade.",
      NO_TRADE: "✗ The setup is complete: breakout, HTF aligned, macro context with no danger. Passing here means missing the edge, not discipline.",
    },
    lessons: {
      beginner:     "Simple rule: a breakout in the direction of the HTF, with no macro danger, is a trade. No more complicated than that.",
      intermediate: "When the HTF, structure and context all align, the edge is statistical. Not trading this config = leaving money on the table.",
      advanced:     "Clean alignment setups like this one are rare. When they show up, full size, no doubt.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["reading", "breakout", "HTF alignment"],
  },
  {
    id: "breakout_bearish_clean",
    title: "Clean bearish breakout",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "lecture",
    context: "Price consolidates above a major support and just broke through it with a strong candle.",
    rationales: {
      BUY: "✗ Buying a support break on a bearish HTF = fighting the market. No reversal signal, just a bearish acceleration.",
      SELL: "✓ Clean breakdown in the direction of the bearish HTF, momentum on the seller side. SELL is the right read.",
      NO_TRADE: "✗ HTF aligned + clean break + no news: the config is complete. Passing here isn't caution.",
    },
    lessons: {
      beginner:     "The mirror of the bullish breakout: bearish HTF + broken support = SELL.",
      intermediate: "Continuation stat after a clean HTF-aligned break: ~65-70%. Take the trade.",
      advanced:     "If the breakout is too obvious, watch out for the retest. But on an aligned HTF and clear structure, full size, stop above the broken support.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["reading", "breakout", "HTF alignment"],
  },
  {
    id: "false_breakout_bullish",
    title: "Suspicious bullish breakout",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "piege",
    context: "Price just broke above a resistance, but the HTF stays bearish. The breakout looks suspicious.",
    rationales: {
      BUY: "✗ You follow the breakout without looking at the HTF. A bullish break on a bearish HTF has a 60-70% chance of being a liquidity trap. That's how retail gets caught.",
      SELL: "✓ Bearish HTF + counter-trend breakout = fakeout setup. The liquidity above the resistance is the fuel for institutional shorts. SELL after the trap.",
      NO_TRADE: "≈ Not a disaster (you dodge the trap), but the bearish HTF + counter-trend signal give a clear edge on the SELL side. A confirmed trader takes it.",
    },
    lessons: {
      beginner:     "Golden rule: a breakout AGAINST the HTF is almost always a trap. If bearish HTF + bullish breakout → stay out or look for the SELL.",
      intermediate: "The classic trap. Institutions create the break to suck in the liquidity of short stops above the resistance, then push in the direction of the HTF.",
      advanced:     "You don't have the wick rejection confirmation here, you decide BEFORE. If the HTF + macro allow it, anticipating the fakeout is a major edge. Otherwise NO TRADE.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["trap", "fakeout", "liquidity"],
  },
  {
    id: "false_breakout_bearish",
    title: "Suspicious bearish breakout",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "piege",
    context: "Price just broke below a support, but the HTF stays bullish. The breakout looks trapped.",
    rationales: {
      BUY: "✓ Bullish HTF + counter-trend bearish breakout = classic trap. The liquidity under the support is collected to set up the bullish move. BUY the return.",
      SELL: "✗ Selling a break against the HTF means joining the trapped retail. Statistically, these fakeouts return in the direction of the HTF in 60-70% of cases.",
      NO_TRADE: "≈ You avoid the loss but miss the opportunity. Fading the fakeout is an institutional edge.",
    },
    lessons: {
      beginner:     "A break AGAINST the HTF = suspicious trap. Never sell a bearish break in a bullish market.",
      intermediate: "Stop hunt on supports = bullish reversal signal if the HTF is aligned. The market just reloaded fuel to push north.",
      advanced:     "Decide BEFORE price returns above the support. If HTF + structure are aligned, BUY. If in doubt, NO TRADE.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["trap", "fakeout", "liquidity"],
  },
  {
    id: "pullback_bullish_trend",
    title: "Pullback in a bullish trend",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "Established bullish trend, price corrects toward a visible demand zone.",
    rationales: {
      BUY: "✓ A pullback within a trend = a chance to buy at a better price. You join the trend instead of chasing it. RR optimized.",
      SELL: "✗ Selling in an uptrend is rowing against the current. Pullbacks are buying opportunities, not selling ones.",
      NO_TRADE: "≈ Conservative, but the config is clean. Discipline is about TAKING the good trades, not dodging them all.",
    },
    lessons: {
      beginner:     "A trend is bought on the dips. Not the other way around. It's the most profitable trade in the market.",
      intermediate: "A pullback in the direction of the HTF, on a visible demand zone, is statistically one of the best setups available.",
      advanced:     "Pullback depth ≠ invalidation. As long as the HTF holds and structure isn't broken, the pullback is an opportunity.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["reading", "pullback", "trend"],
  },
  {
    id: "pullback_bearish_trend",
    title: "Pullback in a bearish trend",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "lecture",
    context: "Established bearish trend, price bounces toward a supply zone.",
    rationales: {
      BUY: "✗ Buying the bounce in a downtrend = trying to pick the bottom. Statistically a loser.",
      SELL: "✓ The bounce brings price onto a visible supply zone. Sell in the direction of the bearish HTF at the best price.",
      NO_TRADE: "≈ Not wrong, but the HTF and the zone are aligned. Discipline is filtering trades, not dodging them all.",
    },
    lessons: {
      beginner:     "Bearish trend → look for bounces to sell. You don't buy hoping it'll go back up.",
      intermediate: "Pullback onto a supply zone in a downtrend = high-probability setup. Not taking it leaves the edge on the table.",
      advanced:     "If the supply zone is cleanly retested and the HTF is intact, the SELL is statistical. If structure breaks during the pullback, NO TRADE.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["reading", "pullback", "trend"],
  },
  {
    id: "rejection_resistance",
    title: "Test of a major resistance",
    correctAnswer: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "lecture",
    context: "Price just reached a major resistance after a rally. The zone has already rejected several times.",
    rationales: {
      BUY: "✗ Buying under a major resistance on a bearish HTF means hoping that THE level that rejects every time won't reject this time.",
      SELL: "✓ Zone defended by sellers + bearish HTF = reversal setup. SELL with stop above the zone.",
      NO_TRADE: "≈ If you wait for extra confirmation, ok. But HTF + zone aligned is usually enough.",
    },
    lessons: {
      beginner:     "Major resistance + bearish HTF → SELL on the next test. The market gives you two reasons to go the same way.",
      intermediate: "HTF zones hold more than LTF zones. Rejection stat on a major HTF resistance: 55-65% on the first test.",
      advanced:     "If the zone has already been tested 3+ times, watch out for the break (each test weakens the level). At 1-2 tests in the direction of the HTF, full size.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["reading", "rejection", "resistance"],
  },
  {
    id: "bounce_support",
    title: "Test of a major support",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "Price just reached a major support after a correction. The zone has already held several times.",
    rationales: {
      BUY: "✓ Major support + bullish HTF = buying zone. Buyers defend the level, the context is aligned. BUY with stop below the zone.",
      SELL: "✗ Selling under a defended major support on a bullish HTF means positioning against the edge. Avoid.",
      NO_TRADE: "≈ Not wrong to wait for confirmation, but the HTF + zone usually give the signal.",
    },
    lessons: {
      beginner:     "Major support + bullish HTF → BUY. Symmetric to the resistance rejection.",
      intermediate: "HTF zones hold more often than they break (on the first test). It's the asymmetry that creates the edge.",
      advanced:     "Trade HTF supports tested 1-2 times max. Beyond that, the level weakens and the break-and-retest becomes the likely scenario.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["reading", "support", "bounce"],
  },
  {
    id: "liquidity_sweep_reversal",
    title: "Liquidity sweep",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "piege",
    context: "Price just swept the liquidity below the previous low with a large wick, then closed back above.",
    rationales: {
      BUY: "✓ The sweep took the liquidity of the trapped shorts. Now the institutional has its fuel to push higher. BUY the reversal.",
      SELL: "✗ Selling AFTER the sweep means selling exactly where the institutional buys. You join the trapped retail.",
      NO_TRADE: "≈ If you don't have post-sweep confirmation, NO TRADE is defensive. But the wick + close above the level = a valid signal.",
    },
    lessons: {
      beginner:     "A large wick that sweeps a zone then reverses = likely reversal. Don't sell the low, buy it.",
      intermediate: "Classic ICT pattern: liquidity grab before HTF continuation. The sweep is the entry trigger.",
      advanced:     "Wait for the post-sweep confirmation (close above the broken level + bullish structure). Without confirmation, anticipating = increased risk.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["trap", "liquidity", "sweep"],
  },
  {
    id: "fvg_reaction",
    title: "Bullish FVG retested",
    correctAnswer: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "A bullish FVG left after the impulse. Price comes back to test it for the first time.",
    rationales: {
      BUY: "✓ Bullish FVG + aligned HTF + first retest = institutional demand zone. Classic ICT setup.",
      SELL: "✗ Selling a non-invalidated bullish FVG means positioning against the zone institutions protect.",
      NO_TRADE: "≈ If you doubt the mitigation, waiting for the reaction is valid. But aligned HTF + fresh zone = edge.",
    },
    lessons: {
      beginner:     "The FVG acts as a price magnet, then as a demand zone on the retest. If HTF aligned → BUY.",
      intermediate: "A fully filled zone isn't necessarily invalidated. The reaction on the retest is the real signal. If there's a reaction + aligned HTF → BUY.",
      advanced:     "Distinguish: partial mitigation (fresh zone) → high-probability BUY. Deep mitigation (>75%) + lost reaction → NO TRADE or reversal.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["reading", "FVG", "imbalance"],
  },
  {
    id: "trade_before_news",
    title: "Imminent macro news",
    correctAnswer: "NO_TRADE",
    htfBias: "range",
    macroContext: "dangereux",
    metric: "discipline",
    context: "A major macro news event (NFP / FOMC / CPI) is expected in less than 30 minutes. The order book is jittery.",
    rationales: {
      BUY: "✗ Trading 30 min before an NFP = throwing your edge in the trash. Spread x3-x5, massive slippage, your stop blows regardless of direction. No setup saves you.",
      SELL: "✗ Same problem: direction doesn't matter, it's the VOLATILITY and the SPREAD that destroy you. Your TP is valid but your stop will be blown out.",
      NO_TRADE: "✓ Pro decision. No trade = no loss. The news passes, the market regains its structure, you come back in 1h on a readable chart.",
    },
    lessons: {
      beginner:     "Absolute rule: no trades in the 30 min before AND 15 min after a major news event. No exceptions.",
      intermediate: "The spread can triple, your SL jumps on bid-ask, and the setup's stat no longer applies to an illiquid market. Waiting is the trade.",
      advanced:     "Even if you have a view on the news outcome, execution volatility is your enemy. If you MUST trade, that's position size /3 and stop x2. Otherwise NO TRADE.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["discipline", "macro", "news"],
  },
  {
    id: "range_no_opp",
    title: "Range with no signal",
    correctAnswer: "NO_TRADE",
    htfBias: "range",
    macroContext: "normal",
    metric: "discipline",
    context: "Price oscillates in the middle of a range, with no zone test or visible catalyst.",
    rationales: {
      BUY: "✗ Buying in the middle of a range = no edge. No support tested, no signal, no catalyst. You take the risk without the reason.",
      SELL: "✗ Same on the short side: no resistance tested, no signal. Pure gambling.",
      NO_TRADE: "✓ The market tells you 'nothing to see here'. The good trades will come at the range edges or on the break. Patience.",
    },
    lessons: {
      beginner:     "If you can't explain in 1 sentence why the trade exists, it doesn't exist. NO TRADE.",
      intermediate: "Trading the middle of a range = asking for 1R of risk for 0.3R of reward. The range is traded at its edges.",
      advanced:     "Discipline > activity. A pro trader will take 2-5 trades a week. Not trading is also a full decision.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tags: ["discipline", "range", "patience"],
  },
  // ─── V3 — realistic mental-trap setups ──────────────────────────────────────
  {
    id: "weak_breakout",
    title: "Breakout with no conviction",
    correctAnswer: "NO_TRADE",
    htfBias: "range",
    macroContext: "normal",
    metric: "discipline",
    context: "Price just broke above the resistance, but the strong candle cruelly lacks a body.",
    shortContext: "Bullish break, very weak body.",
    rationales: {
      BUY: "✗ You're chasing a weak break. Without a clean momentum candle, the continuation stat drops to ~35%. Poor expected R/R.",
      SELL: "✗ Selling a bullish break with no reversal signal = premature. You have neither a reversal candle nor a bearish structure.",
      NO_TRADE: "✓ A breakout must assert itself to be tradable. Without a strong candle, you wait for either a clean retest or a clear follow-through. Patience.",
    },
    lessons: {
      beginner:     "A big candle that breaks a zone = signal. A small candle that barely breaks = not a signal.",
      intermediate: "The market doesn't owe you a clean signal on every break. If conviction is missing, you're not obligated to go.",
      advanced:     "A breakout with no body is often liquidity bait. Institutions create these weak breakouts to trap impatient retail. NO TRADE, then observe.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["discipline", "breakout", "momentum"],
  },
  {
    id: "fvg_overmitigated",
    title: "FVG almost invalidated",
    correctAnswer: "NO_TRADE",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "lecture",
    context: "The bullish FVG has been mitigated over 85%+ of its height. The reaction is slow, buyers no longer defend the zone.",
    shortContext: "FVG mitigated 85%+, no reaction.",
    rationales: {
      BUY: "✗ You're praying for the bounce. A deep mitigation with no reaction = dead FVG. Institutional buyers no longer defend the zone.",
      SELL: "✗ Premature: no confirmed structural break yet. You're shorting hope, not a signal.",
      NO_TRADE: "✓ Insufficient edge. Wait for either a clear rejection of the FVG's bottom (confirmed BUY), or a structural break (confirmed SELL).",
    },
    lessons: {
      beginner:     "If a zone is slow to react, it loses its edge. Better to wait for the next one.",
      intermediate: "A deeply mitigated zone statistically loses its edge. If the reaction doesn't come within 2-3 candles, the zone is cooked.",
      advanced:     "FVG mitigated 80%+ with no reaction = hunt the bearish break for a SELL. But without the break → NO TRADE.",
    },
    difficulties: ["advanced"],
    tags: ["reading", "FVG", "mitigation"],
  },
  {
    id: "counter_trend_bounce",
    title: "Local bounce against the HTF",
    correctAnswer: "NO_TRADE",
    htfBias: "bearish",
    macroContext: "normal",
    metric: "discipline",
    context: "Clear bearish HTF. Price bounces locally on a secondary level, but the trend stays against you.",
    shortContext: "Local bounce in an HTF downtrend.",
    rationales: {
      BUY: "✗ Trading against the HTF trend by betting on a secondary level = playing at 30-40% probability. The stat is against you before you even click.",
      SELL: "✗ Not the right moment: the local bounce hasn't shown signs of exhaustion. If you short here, 2-3 green candles can stop you out before the resumption.",
      NO_TRADE: "✓ Valid local setup BUT against the HTF = no edge. Wait for the bounce to exhaust AND a clear HTF zone to short.",
    },
    lessons: {
      beginner:     "Bearish HTF = you look for the SELLs, never the BUYs against the trend.",
      intermediate: "A local setup never erases the HTF trend. If the HTF says no, you don't say yes, even if the local zone holds.",
      advanced:     "Bounces in a downtrend are SHORT opportunities, not BUYs. But you have to wait for the timing — here too early, no rejection wick on an HTF resistance.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["discipline", "HTF", "counter-trend"],
  },
  {
    id: "dirty_range_sweep",
    title: "Range with sweeps on both sides",
    correctAnswer: "NO_TRADE",
    htfBias: "range",
    macroContext: "normal",
    metric: "discipline",
    context: "Price just swept the liquidity on both edges of the range. No clear direction, institutional accumulation is invisible.",
    shortContext: "Range with sweeps on both edges.",
    rationales: {
      BUY: "✗ No long signal. The recent sweep of the top neutralizes the bottom zone as reliable support. No edge.",
      SELL: "✗ Symmetric: the recent sweep of the bottom neutralizes the top zone. The market cleaned itself out on both sides.",
      NO_TRADE: "✓ No directional bias = no exploitable structure. Wait for a confirmed break OR a recognizable accumulation.",
    },
    lessons: {
      intermediate: "When a range has swept both sides with no direction, you wait for the exit. Non-negotiable.",
      advanced:     "The double sweep is invisible institutional accumulation. The good trader waits for the range exit. The worst thing is playing ping-pong.",
      beginner:     "If you see large wicks on top AND bottom, and price is in the middle, NO TRADE.",
    },
    difficulties: ["advanced"],
    tags: ["discipline", "range", "sweep"],
  },
  {
    id: "setup_toxic_execution",
    title: "Clean setup, toxic execution",
    correctAnswer: "NO_TRADE",
    htfBias: "bullish",
    macroContext: "normal",
    metric: "discipline",
    context: "Valid technical setup, but the execution context is unfavorable: high spread, dead session, no volatility. Real R/R is cut in half.",
    shortContext: "Clean setup, but high spread in a dead session.",
    rationales: {
      BUY: "✗ The signal is good but the context kills the R/R. High spread + dead session = your stop jumps on bid-ask, your TP becomes unreachable. The technique wins, the execution loses.",
      SELL: "✗ Against the HTF on top of the already toxic execution context. Double mistake: you trade against the trend AND in poor liquidity conditions.",
      NO_TRADE: "✓ Pro decision. The same setup will come back in the London or NY session with a clean spread. You lose nothing by waiting.",
    },
    lessons: {
      intermediate: "A nice setup in poor execution conditions is NOT a nice trade. Technique AND execution must both be aligned.",
      advanced:     "Spread x3 + dead volume = your real R/R cut in half even if the setup works. A pro trader always factors execution into the edge.",
      beginner:     "Check session + spread BEFORE clicking. A setup in dead hours often equals NO TRADE.",
    },
    difficulties: ["intermediate", "advanced"],
    tags: ["discipline", "execution", "spread"],
    metaOverride: {
      session:    "Heures mortes",
      volatility: "faible",
      spread:     "élevé",
    },
  },
];

// Canonical alias so the page can import SCENARIO_TEMPLATES just like in FR.
export const SCENARIO_TEMPLATES = SCENARIO_TEMPLATES_EN;

// ─── EN generateScenarios ─────────────────────────────────────────────────────
// Reuse FR logic but remap text fields to the EN template by id.
// This way, same seeds = same scenarios (same asset/session/etc).

export function generateScenarios(seed: number, difficulty: Difficulty = "intermediate"): ScenarioInstance[] {
  const frInstances = generateScenariosFr(seed, difficulty);
  // Take from the EN template by id, keeping the meta (asset/session/volatility/spread/seed/difficulty)
  return frInstances.map((inst) => {
    const enTpl = SCENARIO_TEMPLATES_EN.find((t) => t.id === inst.id);
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

// ─── EN DIFFICULTY_META ───────────────────────────────────────────────────────

export const DIFFICULTY_META: Record<Difficulty, { label: string; dotClass: string; textClass: string; description: string }> = {
  beginner: {
    label:       "Beginner",
    dotClass:    "bg-emerald-400",
    textClass:   "text-emerald-400",
    description: "Clear signals, guided context, few traps. To build the associations.",
  },
  intermediate: {
    label:       "Intermediate",
    dotClass:    "bg-blue-400",
    textClass:   "text-blue-400",
    description: "Ambiguous context, possible fakeouts, several plausible reads. Interpretation.",
  },
  advanced: {
    label:       "Advanced",
    dotClass:    "bg-amber-400",
    textClass:   "text-amber-400",
    description: "Traps, liquidity, sweeps, frequent NO TRADE. Decision before final confirmation.",
  },
};

// Re-export FR_TEMPLATES under another name in case a consumer wants to compare.
export { FR_TEMPLATES as SCENARIO_TEMPLATES_FR };
