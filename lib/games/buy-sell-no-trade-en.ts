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
import type { MarketCtx } from "./candle-realism";
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
export { withAssetPrices } from "./buy-sell-no-trade";

export { ROUNDS_PER_SESSION, scoreChoice, mulberry32 };

// ─── Translation table for zone labels ───────────────────────────────────────

const ZONE_LABEL_EN: Record<string, string> = {
  "Résistance":           "Resistance",
  "Support":              "Support",
  "Résistance HTF":       "HTF Resistance",
  "Support HTF":          "HTF Support",
  "Zone de demand":      "Demand zone",
  "Zone de supply":         "Supply zone",
  "Dernier creux":        "Previous low",
  "Dernier sommet":       "Previous high",
  "Liquidité au-dessus":  "Liquidity above",
  "Liquidité en-dessous": "Liquidity below",
  "Liquidité balayée":    "Swept liquidity",
  "FVG haussier":         "Bullish FVG",
  "Haut du range":        "Range ceiling",
  "Bas du range":       "Range floor",
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
  ctx: MarketCtx = {},
): BuySellChart {
  const chart = buildChartFr(setup, seed, volatility, difficulty, ctx);
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
      BUY: "✓ Here, the HTF is bullish and the breakout goes with it. Resistance was just cleared with a strong candle: a typical continuation scenario. In this case, a BUY is the most logical read.",
      SELL: "✗ Selling into a bullish breakout, on a bullish HTF, here means going against the current with no reversal signal. This kind of trade is often emotional.",
      NO_TRADE: "✗ Here, the setup ticks the boxes: breakout, aligned HTF, macro context with no danger. Passing in this case looks more like a missed opportunity than discipline.",
    },
    lessons: {
      beginner:     "A simple guide: a breakout in the direction of the HTF, with no macro danger, can make a valid trade. In this case, there is no need to overthink it.",
      intermediate: "When the HTF, structure and context align, the edge becomes statistical. This type of setup may deserve a place in your trading plan.",
      advanced:     "Alignment setups this clean are fairly rare. When they show up, size is decided by your risk management plan, not by instinct.",
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
      BUY: "✗ Buying a support break on a bearish HTF here means going against the market. No reversal signal appears, only a bearish acceleration.",
      SELL: "✓ Clean breakdown in the direction of the bearish HTF, with momentum on the seller side. Here, a SELL is the most consistent read.",
      NO_TRADE: "✗ Aligned HTF, clean break, no news: here, the setup looks complete. Passing in this case is less caution than hesitation.",
    },
    lessons: {
      beginner:     "The mirror of the bullish breakout: with a bearish HTF and a broken support, a SELL stays in line with the scenario, if it fits your plan.",
      intermediate: "After a clean break aligned with the HTF, continuation is often the more likely scenario. Good reasoning: this setup ticks the boxes. In real conditions, the final call depends on your plan.",
      advanced:     "If the breakout looks too obvious, watch out for the retest. On an aligned HTF with clear structure, size follows your risk management plan, and a stop above the broken support is a logical option.",
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
      BUY: "✗ Here, you follow the breakout without checking the HTF. A bullish break on a bearish HTF can often be a liquidity trap: a scenario where many traders get caught.",
      SELL: "✓ Here, a bearish HTF and a counter-trend breakout can signal a fakeout. Liquidity above resistance often fuels the sellers. A SELL after the trap makes sense.",
      NO_TRADE: "≈ Not a disaster (you avoid the trap), but here the bearish HTF and the counter-trend signal give a fairly clear edge on the SELL side. An experienced trader might take it.",
    },
    lessons: {
      beginner:     "A useful guide: a breakout AGAINST the HTF is often a trap. In this case (bearish HTF, bullish breakout), staying out or looking for the SELL are both logical options.",
      intermediate: "A classic trap: the break can serve to absorb the liquidity of stops placed above resistance, before a move back in the direction of the HTF.",
      advanced:     "Here, you don't yet have the rejection wick as confirmation: you decide BEFORE. If the HTF and macro allow it, anticipating the fakeout can be a real edge. Otherwise, NO TRADE makes sense.",
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
      BUY: "✓ Here, a bullish HTF and a counter-trend bearish breakout can signal a trap. Liquidity below support is often collected before the bullish move. A BUY on the return makes sense.",
      SELL: "✗ Selling a break against the HTF here means joining the trapped sellers. These fakeouts often move back in the direction of the HTF.",
      NO_TRADE: "≈ You avoid the loss, but you miss the opportunity. Here, fading the fakeout was a logical option.",
    },
    lessons: {
      beginner:     "A break AGAINST the HTF can be a trap. Selling a bearish break in a bullish market remains, in most cases, a risky bet.",
      intermediate: "Here, the stop hunt below support can signal a bullish reversal if the HTF is aligned, to be confirmed before acting. The market may have just reloaded fuel to move higher.",
      advanced:     "Here, you decide BEFORE price returns above support. If the HTF and structure are aligned, a BUY makes sense. If in doubt, NO TRADE remains a logical option.",
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
      BUY: "✓ Here, the pullback within the trend offers a chance to buy at a better price. You join the trend instead of chasing it, often with a better R/R.",
      SELL: "✗ Selling in an uptrend often means rowing against the current. Here, the pullback looks more like a buying opportunity than a selling signal.",
      NO_TRADE: "≈ Cautious, but here the setup is clean. Discipline also means taking the good trades, not only avoiding them.",
    },
    lessons: {
      beginner:     "In an uptrend, dips are often the best moments to buy, rather than the other way around. It's one of the most common trades among trend traders.",
      intermediate: "A pullback in the direction of the HTF, on a visible demand zone, is often among the most solid setups.",
      advanced:     "A deep pullback doesn't necessarily invalidate the scenario. As long as the HTF holds and structure isn't broken, the pullback can remain an opportunity.",
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
      BUY: "✗ Buying the bounce in a downtrend here means trying to pick the bottom. This kind of trade often loses.",
      SELL: "✓ Here, the bounce brings price back to a visible supply zone. Selling in the direction of the bearish HTF, at a better price, is a logical option.",
      NO_TRADE: "≈ Not wrong, but here the HTF and the zone are aligned. Discipline means filtering trades, not avoiding them all.",
    },
    lessons: {
      beginner:     "In a downtrend, you rather look for bounces to sell. Buying in the hope of a recovery often goes against the market.",
      intermediate: "Here, a pullback onto a supply zone in a downtrend can be a good-probability setup, worth weighing against your trading plan.",
      advanced:     "If the supply zone is retested cleanly and the HTF stays intact, the SELL makes sense. If structure breaks during the pullback, NO TRADE becomes the logical option.",
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
      BUY: "✗ Buying under a major resistance, on a bearish HTF, here means hoping that the level that has rejected price so far won't reject it this time.",
      SELL: "✓ Here, a zone defended by sellers and a bearish HTF can signal a reversal. A SELL with a stop above the zone is a logical option.",
      NO_TRADE: "≈ Waiting for extra confirmation is understandable. But here, an aligned HTF and zone are often enough.",
    },
    lessons: {
      beginner:     "Major resistance and bearish HTF: a SELL stays in line with the scenario, if it fits your plan. The market gives you two reasons here to go the same way.",
      intermediate: "HTF zones often hold better than LTF zones. On the first test of a major HTF resistance, a rejection is frequent, though not systematic.",
      advanced:     "If the zone has already been tested 3 times or more, watch out for the break (each test can weaken the level). At 1 or 2 tests in the direction of the HTF, size depends on your risk management plan.",
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
      BUY: "✓ Here, a major support and a bullish HTF outline a buying zone. Buyers defend the level and the context is aligned. A BUY with a stop below the zone is a logical option.",
      SELL: "✗ Selling under a defended major support, on a bullish HTF, here means positioning against the statistical edge. In this case, it's better to stay out.",
      NO_TRADE: "≈ Waiting for confirmation isn't wrong, but here the HTF and the zone often already give the signal.",
    },
    lessons: {
      beginner:     "Major support and bullish HTF: a BUY stays in line with the scenario, if it fits your plan. It mirrors the resistance rejection.",
      intermediate: "On the first test, HTF zones often hold more than they break. That asymmetry is what can create an edge.",
      advanced:     "HTF supports tested 1 or 2 times are often the most reliable. Beyond that, the level can weaken and a break-and-retest becomes more likely.",
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
      BUY: "✓ Here, the sweep took the liquidity of the trapped sellers. The market may now have the fuel to move higher. A BUY on the reversal makes sense.",
      SELL: "✗ Selling AFTER the sweep here means selling where large buyers often step in. You risk joining the trapped sellers.",
      NO_TRADE: "≈ Without post-sweep confirmation, NO TRADE is a defensive option. But here, the wick and the close above the level already form a credible signal.",
    },
    lessons: {
      beginner:     "A large wick that sweeps a zone and comes back can signal a likely reversal. In this case, selling the low is rarely the logical option; buying it makes sense.",
      intermediate: "Classic ICT pattern: liquidity grab before HTF continuation. Here, the sweep is a strong argument for an entry, to confirm against your plan.",
      advanced:     "Waiting for post-sweep confirmation (close above the broken level, bullish structure) is often safer. Without confirmation, anticipating increases the risk.",
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
      BUY: "✓ Here, a bullish FVG, an aligned HTF and a first retest can form a solid demand zone. It's a classic ICT setup.",
      SELL: "✗ Selling into a still-valid bullish FVG here means positioning against a zone that buyers often defend.",
      NO_TRADE: "≈ If you doubt the mitigation, waiting for the reaction makes sense. But here, an aligned HTF and a still-intact zone give an edge.",
    },
    lessons: {
      beginner:     "The FVG often acts as a magnet for price, then as a demand zone on the retest. If the HTF is aligned, a BUY is a logical option.",
      intermediate: "A fully filled zone isn't necessarily invalidated. Here, the reaction on the retest is what matters. With a visible reaction and an aligned HTF, a BUY makes sense.",
      advanced:     "Tell them apart: a partial mitigation (intact zone) can support a good-probability BUY. A deep mitigation (over 75%) with no reaction rather points to NO TRADE or a reversal.",
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
      BUY: "✗ Trading 30 min before an NFP here exposes your edge to high risk: spread x3 to x5, heavy slippage, a stop that can blow regardless of direction. In this case, the setup counts for little.",
      SELL: "✗ Same problem: here, direction matters less than VOLATILITY and SPREAD. Your TP may be valid, but your stop is likely to be run.",
      NO_TRADE: "✓ A pro decision. No trade, no loss. Once the news is out, the market often regains its structure, and you can come back in 1h to a readable chart.",
    },
    lessons: {
      beginner:     "A cautious guide: avoid trading in the 30 min before and the 15 min after a major news release. Many traders make it a rule in their plan.",
      intermediate: "The spread can triple, your SL can be hit by the bid-ask, and the setup's statistics apply poorly to an illiquid market. Here, waiting is often the best choice.",
      advanced:     "Even with a view on the news outcome, execution volatility works against you. If you insist on trading, a logical option is to cut size by 3 and double the stop. Otherwise, NO TRADE.",
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
      BUY: "✗ Buying in the middle of a range offers no clear edge here: no tested support, no signal, no catalyst. You take the risk without a real reason.",
      SELL: "✗ Same on the short side: no tested resistance, no signal. In this case, the trade looks mostly like a bet.",
      NO_TRADE: "✓ Here, the market offers nothing readable. Good trades will rather come at the range edges or on the break. Patience.",
    },
    lessons: {
      beginner:     "If you can't explain in one sentence why the trade exists, it's often better not to take it. Here, NO TRADE.",
      intermediate: "Trading the middle of a range often means risking 1R for about 0.3R of reward. A range is rather traded at its edges.",
      advanced:     "Discipline matters more than activity. Many experienced traders filter their entries heavily. Not trading is also a decision in its own right.",
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
      BUY: "✗ Here, you're chasing a weak break. Without a clear momentum candle, continuation becomes much less likely, and the expected R/R deteriorates.",
      SELL: "✗ Selling a bullish break with no reversal signal looks premature here: there's neither a reversal candle nor a bearish structure.",
      NO_TRADE: "✓ A break is more tradable once it asserts itself. Without a strong candle, a logical option is to wait for a clean retest or a clear follow-through. Patience.",
    },
    lessons: {
      beginner:     "A big candle that breaks a zone brings strong confirmation. A small candle that barely breaks remains weak confirmation, often not enough to act on.",
      intermediate: "The market doesn't give a clean signal on every break. If conviction is missing, nothing forces you to go.",
      advanced:     "A break with no body often serves as liquidity bait: these weak breakouts regularly trap impatient traders. Here, NO TRADE then observation is a logical option.",
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
      BUY: "✗ Here, you're betting on a bounce that isn't coming. A deep mitigation with no reaction can signal an exhausted FVG: buyers no longer seem to defend the zone.",
      SELL: "✗ Premature: no structural break is confirmed yet. Here, you'd be selling a hunch rather than a signal.",
      NO_TRADE: "✓ Here, the edge is insufficient. A logical option: wait for a clear rejection of the FVG's low (confirmed BUY) or a structural break (confirmed SELL).",
    },
    lessons: {
      beginner:     "If a zone is slow to react, it often loses its value. In this case, it's better to wait for the next one.",
      intermediate: "A deeply mitigated zone often loses its edge. If the reaction doesn't come within 2-3 candles, the zone can be considered exhausted.",
      advanced:     "An FVG mitigated over 80% with no reaction can point to looking for a bearish break for a SELL. Without that break, NO TRADE remains the logical option.",
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
      BUY: "✗ Trading against the HTF trend by betting on a secondary level here means playing a low probability. The statistics often work against you before you even click.",
      SELL: "✗ Not the right moment: here, the local bounce shows no sign of exhaustion yet. Selling now, 2-3 green candles can stop you out before the resumption.",
      NO_TRADE: "✓ The local setup holds, BUT it goes against the HTF: here, the edge is missing. A logical option is to wait for the bounce to exhaust and a clear HTF zone to sell.",
    },
    lessons: {
      beginner:     "With a bearish HTF, you rather look for SELLs; BUYs against the trend remain risky bets.",
      intermediate: "A local setup doesn't erase the HTF trend. If the HTF goes against you, it's often better to stay out, even if the local zone holds.",
      advanced:     "In a downtrend, bounces rather offer SELL opportunities than BUYs. But timing matters: here it's too early, with no rejection wick on an HTF resistance.",
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
      BUY: "✗ No buy signal here. The recent sweep of the top makes the lower zone less reliable as support. The edge is missing.",
      SELL: "✗ Symmetric: the recent sweep of the bottom makes the upper zone less reliable. Here, the market has cleared liquidity on both sides.",
      NO_TRADE: "✓ Here, no directional bias emerges, so there's no exploitable structure. A logical option: wait for a confirmed break or a recognizable accumulation.",
    },
    lessons: {
      intermediate: "When a range has swept both sides with no direction, waiting for the exit is often the wisest decision.",
      advanced:     "A double sweep can reflect quiet accumulation. In this case, waiting for the range exit makes sense; playing ping-pong inside is often costly.",
      beginner:     "If you see large wicks at the top AND bottom, with price in the middle, NO TRADE is often the logical option.",
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
      BUY: "✗ The signal is good, but here the context degrades the R/R: with a high spread in a dead session, your stop can be hit by the bid-ask and your TP becomes hard to reach. Technique isn't enough.",
      SELL: "✗ Against the HTF, on top of an already unfavorable execution context. Here, two mistakes add up: going against the trend AND trading in thin liquidity.",
      NO_TRADE: "✓ A pro decision. This kind of setup often comes back in the London or New York session, with a clean spread. Here, you lose nothing by waiting.",
    },
    lessons: {
      intermediate: "A nice setup in poor execution conditions doesn't necessarily make a nice trade. Technique AND execution work best when aligned.",
      advanced:     "With a spread x3 and low volume, your real R/R can be halved even if the setup works. Many pro traders factor execution into their edge.",
      beginner:     "Check the session and spread BEFORE clicking. In off-hours, a setup often deserves a NO TRADE.",
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
