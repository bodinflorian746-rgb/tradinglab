// "PLACE STOP" mini-game — V2 (EN translation).
//
// Mirror of the FR module with user-facing strings translated.
// Logic, types, seeds and numeric values are re-exported from the
// original module.

import {
  type Asset, type Session, type Volatility, type Spread,
  type HtfBias, type MacroContext,
  type Candle, type ChartZone,
  type Difficulty,
  type TradeDirection,
  type PlaceStopSetupKey,
  type StopType,
  type StopId,
  type StopOption,
  type DifficultyLessons,
  type PlaceStopTemplate,
  type PlaceStopInstance,
  type PlaceStopChart,
  type ScoreResult,
  ROUNDS_PER_SESSION,
  PLACE_STOP_TEMPLATES as FR_TEMPLATES,
  generatePlaceStopScenarios as generatePlaceStopScenariosFr,
  buildPlaceStopChart as buildPlaceStopChartFr,
  computeHits,
  scoreStopChoice,
} from "./place-stop";
import type { MarketCtx } from "./candle-realism";
export { withAssetPrices } from "./place-stop";

// ─── Re-exports types / utilities ────────────────────────────────────────────

export type {
  Asset, Session, Volatility, Spread, HtfBias, MacroContext,
  Candle, ChartZone,
  Difficulty,
  TradeDirection,
  PlaceStopSetupKey,
  StopType,
  StopId,
  StopOption,
  DifficultyLessons,
  PlaceStopTemplate,
  PlaceStopInstance,
  PlaceStopChart,
  ScoreResult,
};

export { ROUNDS_PER_SESSION, computeHits, scoreStopChoice };

// ─── EN Templates ─────────────────────────────────────────────────────────────

export const PLACE_STOP_TEMPLATES_EN: PlaceStopTemplate[] = [
  {
    id: "pullback_bull",
    title: "Pullback in a bullish trend",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Bullish trend, price corrects into the demand zone. You entered on the bounce.",
    shortContext: "BUY pullback in an uptrend.",
    lessons: {
      beginner:     "The logical stop rather goes BEHIND the swing low, with a margin: inside, it sits in the noise; too far, it degrades the R/R.",
      intermediate: "Pullback noise often retests the low before continuation. Here, a margin behind the low protects against that classic sweep.",
      advanced:     "Here, the logical stop meets 3 constraints: behind the low, outside the ATR noise, and an R/R of at least 2. It's the only one of the three that meets them all.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "structure",
  },
  {
    id: "pullback_bear",
    title: "Pullback in a bearish trend",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Bearish trend, price bounces into a supply zone. You entered short.",
    shortContext: "SELL pullback in a downtrend.",
    lessons: {
      beginner:     "The logical stop rather goes ABOVE the swing high, with a margin: below it, it stays exposed; too far, it degrades the R/R.",
      intermediate: "The bounce can retest its high before dropping. Hugging the high here strongly exposes you to a stop hunt.",
      advanced:     "A stop covering the high's wick, with an ATR margin, is a logical option. Right on the level, it may get trapped; too far, it degrades the R/R.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "structure",
  },
  {
    id: "bounce_support",
    title: "Bounce on a major support",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Price just bounced on a major HTF support.",
    shortContext: "BUY on HTF support.",
    lessons: {
      beginner:     "A stop below the support, with a realistic margin, makes sense. Right on the support, it may get swept by the liquidity hunt.",
      intermediate: "HTF support often attracts a deep test before the real reaction. Here, the margin protects against that stop hunt.",
      advanced:     "A distance of 1 to 1.5x ATR below the level is often a good benchmark. Tighter, the stop sits in the noise; farther, it ties up capital.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "reading",
  },
  {
    id: "rejection_resistance",
    title: "Rejection at a major resistance",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Price just rejected a major HTF resistance with wicks.",
    shortContext: "SELL on HTF resistance.",
    lessons: {
      beginner:     "A stop above the highest wick, with a margin, is a logical option. Hugging the level strongly exposes you to a stop hunt.",
      intermediate: "HTF resistance retests are often tricky. A margin behind the wick is strongly recommended here.",
      advanced:     "Here, the rejection wick plus 1 ATR outlines a clean zone. Hugging the wick exposes you to the 2nd test; too far, the R/R degrades.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "reading",
  },
  {
    id: "fakeout_above_resistance",
    title: "False breakout: short after rejection",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Price spiked above the resistance then closed below. You sell the trap.",
    shortContext: "SELL after fakeout.",
    lessons: {
      intermediate: "A stop above the PEAK of the fakeout (rather than inside it) is a logical option: here, the peak marks the real invalidation of the trap.",
      advanced:     "A stop ABOVE the wick high, with an ATR margin, makes sense. Hugging the high exposes you to the fakeout retest; inside the trap, the stop costs a lot.",
      beginner:     "Here, the stop works better when it covers the false breakout's wick. A stop placed in the trap zone is likely to be hit.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "trap",
  },
  {
    id: "sweep_low_reversal",
    title: "Liquidity sweep then reversal",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Price just swept the liquidity below the previous low then turned around.",
    shortContext: "BUY after a low sweep.",
    lessons: {
      intermediate: "A stop below the LOW of the sweep, rather than in the zone just taken, is a logical option. Here, the sweep becomes the new invalidation.",
      advanced:     "A stop below the sweep's wick, with a margin, makes sense. Right on the sweep low, a retest is likely; inside the liquidity zone, the trap is complete.",
      beginner:     "Here, the market just spiked a zone: your stop is more likely to hold BELOW that zone than inside it.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "trap",
  },
  {
    id: "fvg_continuation",
    title: "Reaction in a bullish FVG",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "A bullish FVG was left after the impulse. Price retests it and starts to react.",
    shortContext: "BUY on the FVG retest.",
    lessons: {
      intermediate: "A stop below the BOTTOM of the FVG is a logical option. Inside the FVG, it stays exposed to a deep retest; too far, the R/R becomes fragile.",
      advanced:     "Here, the FVG serves as the invalidation zone. A stop about 1 ATR below its bottom makes sense: tighter, it sits in the noise; farther, it ties up capital.",
      beginner:     "Here, the FVG is your buy zone. The stop is more likely to hold BELOW the zone than inside it.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "reading",
  },
  {
    id: "high_vol_pullback",
    title: "Pullback in high volatility",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Pullback in a high-volatility market. Candles are wide, wicks deep.",
    shortContext: "BUY pullback, high vol.",
    lessons: {
      advanced:     "In high volatility, the 'normal' stop often becomes too tight. Doubling the margin makes sense: what looks like a wide stop is the LOGICAL one here.",
      intermediate: "Volatility widens the normal noise. Here, a 'standard' stop is likely to be too tight.",
      beginner:     "The harder the market moves, the more room your stop needs to breathe.",
    },
    difficulties: ["advanced"],
    tag: "volatility",
  },
  {
    id: "equal_lows_trap",
    title: "Apparent double bottom — trapped liquidity",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Two almost equal lows a few pips apart. The pattern looks like a double bottom. But this symmetry attracts retail liquidity.",
    shortContext: "Apparent double bottom",
    lessons: {
      beginner:     "Two almost equal lows form an obvious double bottom for many traders. A stop with a margin below the zone often holds better than one right inside it.",
      intermediate: "When 2 lows are almost equal, they create a liquidity zone visible to everyone, often visited before a reversal. An SL below, with an anti-sweep margin, is a logical option.",
      advanced:     "Equal lows often form a liquidity pool. Here, the real invalidation rather lies several ATR lower, after the sweep, than just below the lows.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "trap",
  },
  {
    id: "round_number_sweep",
    title: "Round number — the level everyone sees",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Price floats just above a major psychological level (round number). Every retail trader has their SL just below this level.",
    shortContext: "Below a round number",
    lessons: {
      beginner:     "Round numbers (1.1000, 100,000…) attract many SLs. Placing your stop farther away, rather than right below, is a logical option.",
      intermediate: "Round numbers are psychological levels where liquidity concentrates: many traders put their SLs and TPs there. These levels are often swept.",
      advanced:     "1.1000, 4,300, 100,000… these levels attract stops. An SL just below is likely to be hunted. An SL farther away, or no trade, are two logical options.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "trap",
  },
  {
    id: "asia_high_sweep",
    title: "Asia high — predictable sweep at the London open",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Asian session over, range well defined. London open in 10 minutes. You sell the Asia range high.",
    shortContext: "Before the London open",
    lessons: {
      beginner:     "The Asia high is often swept at the London open. Here, an SL above the expected sweep holds better than one right at the high.",
      intermediate: "The Asia high is often swept at the London open. Selling with a stop right at the high, without anticipating this sweep, strongly exposes you to an early stop out.",
      advanced:     "The Asia high sweep is a well-known market mechanic. An SL above the expected sweep, rather than above the high, is a logical option here.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "trap",
  },
  {
    id: "order_block_respect",
    title: "Order Block — beyond the swing low",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "You enter BUY on an identified bullish Order Block. A recent swing low is visible just above the OB bottom.",
    shortContext: "Bullish Order Block",
    lessons: {
      beginner:     "An Order Block's invalidation rather lies below its bottom than below the recent swing low. Here, the SL works better when it accounts for that.",
      intermediate: "The Order Block's bottom defines the concept's invalidation here, more than the last swing. An SL below the OB's bottom, with a margin, makes sense.",
      advanced:     "An Order Block's invalidation rather lies below its bottom than below the last swing low. Confusing the two can stop you out on the mitigation wick while the setup is still valid.",
    },
    difficulties: ["advanced"],
    tag: "reading",
  },
  {
    id: "prev_day_low_trap",
    title: "Previous Day Low — the daily liquidity",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Price approaches the Previous Day Low. The zone is known to all institutional participants. You prepare your BUY.",
    shortContext: "Near the PDL",
    lessons: {
      beginner:     "The PDL (Previous Day Low) is often a hunting zone. An SL below the PDL, with a margin, holds better than one right below it.",
      intermediate: "The PDL (Previous Day Low) is a daily liquidity level, often targeted by stop hunts. An SL right below it is likely to be captured.",
      advanced:     "The PDL is one of the key levels, along with PDH, PWL, PWH and PML. An SL placed 0-5 pips beyond one of them is quite likely to be hunted before the real move.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "trap",
  },
  {
    id: "news_vol_expansion",
    title: "ATR volatility doubled — standard SL becomes tight",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "Day's ATR at 2x the 20-day average. Exceptional volatility after the FOMC. You take your usual setup with your standard SL margin.",
    shortContext: "ATR x2 vs normal",
    lessons: {
      beginner:     "When volatility explodes (FOMC, NFP), a 'normal' SL often becomes too tight. Widening the margin to the day's ATR is a logical option.",
      intermediate: "On a day when the ATR doubles, the 'standard' SL is effectively too tight. Here, a margin adjusted to real volatility avoids a very likely stop out.",
      advanced:     "SL size isn't a fixed number of pips: it rather follows the day's ATR. When the ATR doubles, doubling the margin makes sense, otherwise your SL becomes too tight.",
    },
    difficulties: ["advanced"],
    tag: "volatility",
  },
  {
    id: "htf_invalidation",
    title: "HTF invalidation — an H1 SL isn't enough",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "BUY setup on H1. But the last H4 Higher Low is quite a bit lower. The HTF structure stays bullish as long as this H4 HL holds.",
    shortContext: "Deeper H4 bias",
    lessons: {
      beginner:     "When the setup is on H1 but the HTF bias is on H4, your SL works better respecting the H4 HL than the H1 swing.",
      intermediate: "The SL rather belongs at the scale of the invalidation timeframe than the entry timeframe. Here (H1 setup, H4 bias), an SL below the H4 HL is a logical option.",
      advanced:     "The SL works better placed at the scale of the setup. Here (H1 setup, H4 bias), an SL at least below the relevant H4 HL makes sense; otherwise, a normal H1 fluctuation can take you out before the real move.",
    },
    difficulties: ["advanced"],
    tag: "reading",
  },
  {
    id: "multi_swing_low",
    title: "Two nearby swing lows — below which one?",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "You identify 2 recent swing lows a few pips apart. The second is lower. Which one to respect for the SL?",
    shortContext: "2 nearby swing lows",
    lessons: {
      beginner:     "When 2 swing lows are close, an SL that respects the LOWER one is a logical option: the 1st is often swept before the real break.",
      intermediate: "When 2 swing lows are close, the structure is only truly invalidated if the LOWER one breaks. An SL below the first may get hit on a normal fluctuation.",
      advanced:     "In a sequence of lows, as long as the lowest holds, the bullish structure stays intact. An SL below the 1st swing ignores this mechanic here.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "structure",
  },
  {
    id: "fakeout_then_retest",
    title: "Fakeout already happened — SL beyond the wick, not the swing",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Fakeout at resistance already visible: a wick that breaks, then comes back down. You enter SELL now. Where to place the SL?",
    shortContext: "Resistance fakeout already happened",
    lessons: {
      beginner:     "When a fakeout is already visible, the real high to invalidate is rather the wick than the top of the body.",
      intermediate: "The natural retest after a fakeout often seeks the wick. An SL above the wick, with a margin, holds better than one above the body.",
      advanced:     "When a fakeout has already happened, the real high to invalidate is rather the tip of the wick than the body's swing high. An SL below the wick may get hit on the natural retest.",
    },
    difficulties: ["advanced"],
    tag: "trap",
  },
  {
    id: "tight_consolidation",
    title: "Narrow range — the SL size vs R/R trade-off",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Narrow range: low amplitude, price trapped between nearby support and resistance. You want to enter BUY at the support. The R/R will be poor with a standard SL.",
    shortContext: "Narrow range",
    lessons: {
      beginner:     "In a narrow range, waiting for a breakout or reducing your position size are two logical options. With a standard SL, the R/R becomes weak.",
      intermediate: "In a narrow range, a standard SL degrades the R/R, and a tight SL is likely to be hit. A logical option: wait for expansion, or reduce the lot size.",
      advanced:     "In a narrow range, the trade-off between SL and R/R requires a compromise on size. Wait for expansion, or accept an R/R below 1:2 offset by the win rate: your call.",
    },
    difficulties: ["intermediate", "advanced"],
    tag: "structure",
  },
  // V2.2 — scenarios where "wide" becomes the correct answer
  {
    id: "extreme_volatility_buy",
    title: "Extreme volatility — standard SL swept",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "ATR at 3x the 20-day average. Market in violent expansion mode. You take your classic BUY setup. The 'standard' SL won't hold.",
    shortContext: "ATR x3, violent expansion",
    lessons: {
      beginner:     "In extreme volatility, your 'normal' SL often becomes too tight. A margin proportional to the day's ATR is a logical option.",
      intermediate: "With a tripled ATR, a standard SL often becomes unsuitable. Adapting the margin or passing are two logical options.",
      advanced:     "When the ATR triples, a standard 1.2x ATR SL actually becomes too tight. It's better to adapt the SL to the day's volatility than to a fixed number of pips. In extreme volatility, a 3-4x ATR SL, or no trade, both make sense.",
    },
    difficulties: ["advanced"],
    tag: "volatility",
  },
  {
    id: "extreme_volatility_sell",
    title: "Extreme volatility — standard SL swept (SELL)",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "dangereux",
    context: "ATR at 3x the 20-day average. Market in violent expansion. You sell a rejection. The 'standard' SL on the wick won't hold.",
    shortContext: "ATR x3, short in extreme vol",
    lessons: {
      beginner:     "In extreme volatility, your 'normal' SL often becomes too tight, on a SELL too. A margin proportional to the ATR is a logical option.",
      intermediate: "With a tripled ATR, a standard SL above the high often becomes unsuitable. Adapting the margin or passing are two logical options.",
      advanced:     "On a SELL too, the SL rather follows the day's ATR than a fixed margin. With a tripled ATR, tripling the margin, or not trading, both make sense.",
    },
    difficulties: ["advanced"],
    tag: "volatility",
  },
  {
    id: "news_imminent_wide",
    title: "News in 5 min — standard SL burned",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "NFP in 5 minutes. You want to enter now on this BUY setup. The expected amplitude is x2-3 of normal. Standard SL = guaranteed stop out.",
    shortContext: "NFP imminent",
    lessons: {
      beginner:     "Before major news, candle range can double or triple. Adapting your SL, or not taking the trade, are two logical options.",
      intermediate: "A news candle three times wider is likely to sweep your 'standard' SL before you have time to react. Here, a wide margin is strongly recommended.",
      advanced:     "Before major news, candle range can double or triple. Not trading, or adapting your SL accordingly, are two logical options; a standard SL is likely to be carried away by the move.",
    },
    difficulties: ["advanced"],
    tag: "macro",
  },
  {
    id: "liquidity_hunt_zone",
    title: "Institutional hunting zone — move your SL away",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "The 'obvious' swing low just below the entry is actually a well-known institutional liquidity zone. The SL placed below = guaranteed stop out. You have to move away.",
    shortContext: "Known hunting zone",
    lessons: {
      beginner:     "Obvious swing lows attract many SLs. Placing your SL well beyond the zone, or waiting until after the sweep, are two logical options.",
      intermediate: "The more 'obvious' a zone looks, the more likely it is to be hunted. An SL right below it is likely to be captured.",
      advanced:     "Swing lows that are too 'obvious' are frequent hunting zones. An SL right below them is likely to be captured. Waiting for the hunt to be done before entering, or placing your SL well beyond, both make sense.",
    },
    difficulties: ["advanced"],
    tag: "trap",
  },
  {
    id: "multi_swing_deep",
    title: "Multiple stacked swing lows — aim for the lowest",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "3 swing lows visible in the last 15 candles, each lower than the previous. SL below the 1st or 2nd = swept. The real invalidation is below the 3rd (the lowest).",
    shortContext: "3 stacked swings",
    lessons: {
      beginner:     "When 3 swing lows line up on the way down, the real invalidation rather lies below the lowest. An SL below the 1st is likely to be hit.",
      intermediate: "When several swing lows line up, the structural invalidation rather lies below the lowest. An SL below the others may get hit on a normal fluctuation.",
      advanced:     "Here, the sequence of lower lows is part of the pullback. The SL works better respecting the pullback's maximum expected depth than stopping at the 1st swing.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "structure",
  },
  {
    id: "fakeout_zone_wide",
    title: "Zone with recurring fakeouts — wide SL mandatory",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "This resistance already had 2 fakeouts in the last few hours. The market will probably make a 3rd before the real move. A tight SL = capture.",
    shortContext: "Resistance with multi-fakeouts",
    lessons: {
      beginner:     "A resistance that has already rejected with wicks often produces more. An SL above the maximum wick, rather than the previous one, is a logical option.",
      intermediate: "Repeated fakeouts often form a pattern. Here, anticipating a range larger than the previous wicks makes sense.",
      advanced:     "A zone that has already produced 2 fakeouts often produces a 3rd. The SL works better anticipating that maximum range than stopping at the previous wicks.",
    },
    difficulties: ["advanced"],
    tag: "trap",
  },
  {
    id: "weekly_open_volatility",
    title: "Monday open — possible weekend gap",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "Monday morning, FX markets open. A weekend gap is possible. The SL must absorb this exceptional amplitude.",
    shortContext: "Monday open, possible gap",
    lessons: {
      beginner:     "The Monday open can create a gap that sweeps a standard SL. A wide margin, or no position before the open, are two logical options.",
      intermediate: "A Monday open gap can reach 1 to 2x ATR. Placing your SL beyond it, or waiting for price to stabilize, both make sense.",
      advanced:     "The Monday open gap can be brutal depending on the weekend's news. Waiting for the open to be digested, or placing a wide SL to absorb the range, are two logical options.",
    },
    difficulties: ["advanced"],
    tag: "macro",
  },
  {
    id: "key_level_magnet",
    title: "Magnetic level — price will touch it",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "A major psychological level (round number, PDH/L, weekly high) is visible just below the entry. Price will statistically go test it. SL just above the level = capture.",
    shortContext: "Magnetic level below",
    lessons: {
      beginner:     "Psychological levels often attract price like magnets. Rather than right above, an SL well beyond is a logical option.",
      intermediate: "Psychological levels often act as magnets: price tests them very frequently. An SL right above is likely to be swept.",
      advanced:     "To anticipate the test of a magnetic level, placing the SL beyond the likely sweep range, rather than just above the level, makes sense.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "reading",
  },
  // V2.3 — 5 SELL mirrors to rebalance the spatial distribution
  {
    id: "news_imminent_wide_sell",
    title: "News in 5 min — SELL and standard SL burned",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "dangereux",
    context: "FOMC in 5 minutes. You take this SELL on EUR/USD. The expected amplitude is x2-3 of normal. Standard SL = guaranteed stop out.",
    shortContext: "FOMC imminent",
    lessons: {
      beginner:     "Before an FOMC, candle range can double or triple, and a standard SL is likely to be carried away. Adapting the margin, or not trading, are two logical options.",
      intermediate: "An FOMC impact candle is likely to sweep your 'standard' SL above the high before the directional move starts.",
      advanced:     "Before an FOMC, candle range can double or triple. A standard 1.2x ATR SL is likely to be swept by the first move. Not trading, or planning an SL of at least 3x ATR, both make sense.",
    },
    difficulties: ["advanced"],
    tag: "macro",
  },
  {
    id: "liquidity_hunt_zone_sell",
    title: "SELL hunting zone — move your SL away above",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "The obvious swing high just above the entry is actually a well-known institutional liquidity zone. SL placed above = guaranteed stop out.",
    shortContext: "Hunting zone above",
    lessons: {
      beginner:     "Obvious swing highs attract many SLs. Placing your SL well beyond the zone, or waiting until after the sweep, are two logical options.",
      intermediate: "The more 'obvious' a zone looks, the more likely it is to be hunted. An SL right above the swing high is likely to be captured.",
      advanced:     "Swing highs that are too obvious are frequent hunting zones, and an SL right above them is likely to be captured. Waiting for the hunt, or placing your SL well beyond, both make sense.",
    },
    difficulties: ["advanced"],
    tag: "trap",
  },
  {
    id: "multi_swing_high_deep",
    title: "Multiple stacked swing highs — aim for the highest",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "3 swing highs visible in the last 15 candles, each higher than the previous. SL above the 1st or 2nd = swept. The real invalidation is above the 3rd.",
    shortContext: "3 stacked swings",
    lessons: {
      beginner:     "When 3 swing highs line up on the way up, the real invalidation rather lies above the highest. An SL above the 1st is likely to be hit.",
      intermediate: "When several swing highs line up, the structural invalidation rather lies above the highest. An SL above the others may get hit on a normal fluctuation.",
      advanced:     "Here, the sequence of higher highs is part of the bearish pullback. The SL works better respecting the pullback's maximum expected depth.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "structure",
  },
  {
    id: "weekly_open_volatility_sell",
    title: "Monday open SELL — possible weekend gap",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "dangereux",
    context: "Monday morning, FX markets open. A bullish weekend gap is possible. The SELL SL must absorb this amplitude.",
    shortContext: "Monday open, possible gap",
    lessons: {
      beginner:     "The Monday open can create a bullish gap that sweeps a standard SL. A wide margin, or no position before the open, are two logical options.",
      intermediate: "A Monday open gap can reach 1 to 2x ATR upward. Placing your SELL SL beyond it, or waiting for price to stabilize, both make sense.",
      advanced:     "The Monday open gap can be brutal depending on the weekend's news. Here, the SELL's SL works better when it absorbs the gap's range.",
    },
    difficulties: ["advanced"],
    tag: "macro",
  },
  {
    id: "key_level_magnet_sell",
    title: "Magnetic level above — price will test it",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "A major psychological level (round number, PDH, weekly high) is visible just above the entry. Price will statistically go test it.",
    shortContext: "Magnetic level above",
    lessons: {
      beginner:     "Psychological levels often attract price like magnets, upward too. Rather than right below, an SL well beyond is a logical option.",
      intermediate: "Psychological levels often act as magnets: price tests them very frequently. An SL right above is likely to be swept.",
      advanced:     "To anticipate the test of a magnetic level, placing the SL beyond the likely upward sweep range makes sense.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    tag: "reading",
  },
];

// Canonical alias so the page can import PLACE_STOP_TEMPLATES just like in FR.
export const PLACE_STOP_TEMPLATES = PLACE_STOP_TEMPLATES_EN;

// ─── Translation table for zone labels ───────────────────────────────────────

const ZONE_LABEL_EN: Record<string, string> = {
  "Résistance":           "Resistance",
  "Support":              "Support",
  "Résistance HTF":       "HTF Resistance",
  "Support HTF":          "HTF Support",
  "Swing high":           "Swing high",
  "Swing low":            "Swing low",
  "Dernier creux":        "Previous low",
  "Dernier sommet":       "Previous high",
  "Liquidité balayée":    "Swept liquidity",
  "FVG haussier":         "Bullish FVG",
  "Mèche du fakeout":         "Fakeout wick",
  // V2.1 — zones of the new scenarios
  "Equal lows":           "Equal lows",
  "Niveau psychologique":         "Round number",
  "Haut de la session asiatique":            "Asia high",
  "Order Block":          "Order Block",
  "PDL":                  "PDL",
  "HL H4":                "HL H4",
  "Swing low H1":         "Swing low H1",
  "Swing low 1":          "Swing low 1",
  "Swing low 2":          "Swing low 2",
  "Bas du range":         "Range bottom",
  "Haut du range":        "Range top",
  // V2.2
  "Swing low évident":    "Obvious swing low",
  "Zone de stop hunt":       "Hunt zone",
  "Swing low 3":          "Swing low 3",
  "Fakeouts précédents":  "Previous fakeouts",
  "Niveau clé":    "Magnetic level",
  // V2.3 — SELL mirrors
  "Swing high évident":   "Obvious swing high",
  "Swing high 1":         "Swing high 1",
  "Swing high 2":         "Swing high 2",
  "Swing high 3":         "Swing high 3",
};

function translateZones(zones: ChartZone[]): ChartZone[] {
  return zones.map((z) => ({ ...z, label: ZONE_LABEL_EN[z.label] ?? z.label }));
}

// ─── Rationale translation table ─────────────────────────────────────────────
// Rationales are embedded in the chart (not in the templates). Those from the
// FR module are fixed strings; we translate them by exact-match mapping.

const TIGHT_RATIONALE_FR = "✗ Trop serré : ici, le stop est placé dans le bruit normal du marché. La 1re mèche de retest risque de le balayer avant que le trade aboutisse. C'est une erreur fréquente.";
const LOGICAL_RATIONALE_FR = "✓ Placement logique : derrière la vraie invalidation, avec une marge anti-bruit. Ici, il survit aux retests et laisse le trade capter la cassure structurelle si elle arrive.";
const WIDE_RATIONALE_FR = "≈ Il survit, mais dégrade le R/R. Ici, la distance est trop grande : le capital est mal utilisé, et le R/R baisse nettement par rapport au stop logique.";

const FAKEOUT_TIGHT_FR   = "✗ Ici, le stop est dans la zone du piège, là où la liquidité vient d'être ramassée. Le 2e test risque de le balayer.";
const FAKEOUT_LOGICAL_FR = "✓ Au-dessus du pic du fakeout, avec une marge. C'est ici la VRAIE invalidation du piège : si le prix repasse là, le scénario est probablement cassé.";

const SWEEP_TIGHT_FR   = "✗ Ici, le stop est DANS la zone du sweep, là où la liquidité vient d'être ramassée. Le retest risque de venir le chercher.";
const SWEEP_LOGICAL_FR = "✓ Sous la mèche du sweep, avec une marge. Ici, le low du sweep devient la nouvelle invalidation, à l'abri d'un 2e ramassage.";

const FVG_TIGHT_FR   = "✗ Ici, le stop est DANS le FVG, une zone où le marché peut revenir pour terminer sa mitigation. Il risque d'être pris dans la profondeur de la zone.";
const FVG_LOGICAL_FR = "✓ Sous le bas du FVG, avec une marge. Ici, un FVG entièrement traversé signerait une invalidation propre : c'est le placement structurel le plus cohérent.";

const HIGHVOL_TIGHT_FR   = "✗ Stop « standard », correct en volatilité normale, mais ici ce niveau se trouve dans le bruit. La 1re bougie de retest, ample à cause de la volatilité, risque de le balayer.";
const HIGHVOL_LOGICAL_FR = "✓ Stop élargi à la volatilité du marché. Ce qui ressemblerait à un stop large en temps normal est ici le stop LOGIQUE : il survit au bruit amplifié sans sacrifier le R/R (le TP est aussi plus loin).";
const HIGHVOL_WIDE_FR    = "≈ Il survit, mais même avec un TP étendu en volatilité élevée, le R/R descend ici sous 1,5. Le capital est mal utilisé.";

// V2.1 — rationales of the new scenarios
const EQUAL_LOWS_TIGHT_FR_NEW   = "✗ Ici, le stop est DANS la zone de liquidité créée par les 2 equal lows. C'est le SL le plus évident, souvent ramassé avant la hausse.";
const EQUAL_LOWS_LOGICAL_FR_NEW = "✓ Sous la zone de sweep des 2 lows, avec une marge anti-mèche. Ici, c'est l'invalidation réelle du concept, à l'abri de la chasse à la liquidité.";
const ROUND_LIQUIDITY_FR_NEW    = "✗ Ici, le stop est pile sous le niveau psychologique, là où beaucoup de SL s'entassent. Ce niveau est très souvent balayé.";
const ROUND_LOGICAL_FR_NEW      = "✓ Sous le sweep attendu du niveau psychologique, avec une marge. Ici, le SL reste hors de la zone ciblée, et le setup reste valide après la chasse.";
const ASIA_LIQUIDITY_FR_NEW     = "✗ Ici, le stop est pile au-dessus du haut de la session asiatique, dans la zone que l'ouverture de Londres balaie souvent. C'est un piège fréquent de l'ouverture européenne.";
const ASIA_LOGICAL_FR_NEW       = "✓ Au-dessus du sweep attendu du haut de la session asiatique, avec une marge. Si le prix revient là après l'ouverture de Londres, le biais baissier est probablement faux.";
const OB_TIGHT_FR_NEW           = "✗ Ici, le stop est sous le swing low, mais au-dessus du bas de l'Order Block. Le swing risque d'être balayé alors que le concept OB reste valide.";
const OB_LOGICAL_FR_NEW         = "✓ Sous le bas de l'Order Block, avec une marge. Ici, c'est la VRAIE invalidation du concept : le swing low peut être balayé sans casser le setup.";
const PDL_LIQUIDITY_FR_NEW      = "✗ Ici, le stop est pile sous le PDL, un niveau quotidien très souvent visé par les stop hunts. Tu exposes ta position à ce stop hunt.";
const PDL_LOGICAL_FR_NEW        = "✓ Sous la zone de stop hunt du PDL, avec une marge. Le sweep attendu peut avoir lieu : ici, le SL reste hors de la zone ciblée.";
const NEWS_TIGHT_FR_NEW         = "✗ Stop « standard » calibré pour une volatilité normale, alors qu'ici le marché bouge deux fois plus que d'habitude (ATR, l'amplitude moyenne d'une journée). Ce qui paraît raisonnable est en fait trop serré.";
const NEWS_LOGICAL_FR_NEW       = "✓ Marge calibrée sur la volatilité réelle du jour, doublée (ATR, l'amplitude moyenne d'une journée). Ce qui semblerait large en temps normal est ici le stop LOGIQUE : il survit au bruit amplifié.";
const NEWS_WIDE_FR_NEW          = "≈ Il survit largement, mais la marge est surestimée, même pour une volatilité doublée (ATR, l'amplitude moyenne d'une journée). Ici, le capital est sous-utilisé et le R/R plus faible qu'avec le stop logique.";
const HTF_TIGHT_FR_NEW          = "✗ Ici, le stop est sous le swing low H1, mais le biais H4 n'est pas cassé. Une fluctuation H1 normale risque de te sortir alors que le setup HTF reste valide.";
const HTF_LOGICAL_FR_NEW        = "✓ Sous le HL H4 pertinent, avec une marge. Ici, c'est la cassure du biais HTF qui invaliderait le setup, pas une simple fluctuation H1.";
const MULTI_TIGHT_FR_NEW        = "✗ Ici, le stop est sous le 1er swing low (le plus haut), alors que le swing low plus bas tient encore. La structure n'est pas cassée, et le retest du 2e low risque de te sortir.";
const MULTI_LOGICAL_FR_NEW      = "✓ Sous le PLUS BAS des 2 swing lows, avec une marge. C'est ici l'invalidation structurelle réelle : tant que ce niveau tient, la structure haussière reste intacte.";
const FAKE2_TIGHT_FR_NEW        = "✗ Ici, le stop est au-dessus du swing high du corps, mais sous la mèche du fakeout. Le retest naturel de la mèche risque de venir le chercher.";
const FAKE2_LOGICAL_FR_NEW      = "✓ Au-dessus de la mèche du fakeout, avec une marge. Ici, la pointe de la mèche est le vrai high à invalider, plutôt que le haut du corps.";
const TIGHTCONS_TIGHT_FR_NEW    = "✗ Ici, le stop est dans le range serré, en plein bruit de la consolidation. La 1re oscillation du range risque de le balayer.";
const TIGHTCONS_LOGICAL_FR_NEW  = "✓ Juste sous le bas du range, avec une marge. Le SL respecte ici la structure du range, mais le R/R reste limité par le haut : à arbitrer avec la taille de position.";
const TIGHTCONS_WIDE_FR_NEW     = "≈ SL très large, mais ici le haut du range rend le R/R très difficile. Sans expansion, le trade offre peu de marge de gain.";

// V2.2 — scenarios where "wide" is the correct answer
const EXTREME_VOL_TIGHT_FR_NEW   = "✗ Ici, le stop est dans le bruit immédiat. La 1re bougie de retest, ample à cause de la volatilité extrême, risque de le balayer très vite.";
const EXTREME_VOL_LTT_FR_NEW     = "✗ Stop « standard » calibré pour une volatilité normale. Avec une volatilité du jour triplée (ATR, l'amplitude moyenne d'une journée), ce niveau se trouve ici dans le bruit, et risque d'être balayé avant que le setup ait le temps de jouer.";
const EXTREME_VOL_WIDE_FR_NEW    = "✓ Marge calibrée sur la volatilité RÉELLE du jour (3 fois la normale). Ici, c'est le seul stop qui absorbe l'expansion sans casser le setup.";
const NEWS_IMM_TIGHT_FR_NEW      = "✗ Ici, le stop est dans le bruit immédiat. La bougie d'impact de la news risque de le balayer en quelques secondes.";
const NEWS_IMM_LTT_FR_NEW        = "✗ Stop « normal », peu adapté à l'amplitude d'une news. Une bougie d'impact (2 à 3 fois plus ample) risque ici de te sortir avant le vrai mouvement directionnel.";
const NEWS_IMM_WIDE_FR_NEW       = "✓ Marge assez large pour absorber l'amplitude de la news. Ici, c'est ce SL, ou pas de trade pendant la fenêtre de news.";
const LIQ_HUNT_TIGHT_FR_NEW      = "✗ Ici, le stop est dans le bruit immédiat. Le 1er retest risque de le balayer avant même la chasse principale.";
const LIQ_HUNT_LTT_FR_NEW        = "✗ Ici, le stop est sous un swing low évident, une zone de stop hunt fréquente. Le sweep prend très souvent ce niveau avant le vrai retournement.";
const LIQ_HUNT_WIDE_FR_NEW       = "✓ Sous la zone de stop hunt, avec une marge ample. Le sweep peut avoir lieu : ici, ton SL reste hors d'atteinte.";
const MULTI_DEEP_TIGHT_FR_NEW    = "✗ Ici, le stop est sous le 1er swing low (le plus haut). Le pullback structurel descend plus bas, et le SL reste dans le bruit du mouvement.";
const MULTI_DEEP_LTT_FR_NEW      = "✗ Ici, le stop est sous le 2e swing low. La séquence de lower lows se prolonge jusqu'au 3e : le stop risque d'être balayé avant l'invalidation réelle.";
const MULTI_DEEP_WIDE_FR_NEW     = "✓ Sous le 3e swing low (le plus bas), avec une marge. C'est ici la vraie invalidation structurelle de la séquence.";
const FAKEOUT_ZONE_TIGHT_FR_NEW  = "✗ Ici, le stop est dans le bruit immédiat : la moindre mèche de retest risque de le balayer.";
const FAKEOUT_ZONE_LTT_FR_NEW    = "✗ Ici, le stop est au-dessus des 2 fakeouts précédents, mais un 3e fakeout dépasse souvent cette amplitude. Il risque d'être balayé.";
const FAKEOUT_ZONE_WIDE_FR_NEW   = "✓ Au-dessus de l'amplitude maximale probable des fakeouts répétés. Ici, un 3e fakeout a peu de chances de te toucher.";
const WEEKLY_OPEN_TIGHT_FR_NEW   = "✗ Ici, le stop est dans le bruit immédiat. Le gap d'ouverture du lundi risque de le balayer dès la 1re bougie.";
const WEEKLY_OPEN_LTT_FR_NEW     = "✗ Stop « standard », peu adapté à un gap de weekend qui peut atteindre 2 à 3 fois l'amplitude normale d'une bougie.";
const WEEKLY_OPEN_WIDE_FR_NEW    = "✓ Marge large pour absorber l'amplitude du gap d'ouverture. Ici, tant que la structure tient, le SL tient aussi.";
const KEY_MAGNET_TIGHT_FR_NEW    = "✗ Ici, le stop est dans le bruit immédiat, et risque d'être balayé avant même que le niveau clé soit atteint.";
const KEY_MAGNET_LTT_FR_NEW      = "✗ Ici, le stop est juste au-dessus du niveau clé. Le test profond risque d'aller plus bas, et le sweep de prendre ce niveau.";
const KEY_MAGNET_WIDE_FR_NEW     = "✓ Au-delà de l'amplitude du test attendu sur le niveau clé. Le sweep peut toucher le niveau : ici, ton SL reste hors d'atteinte.";

// V2.3 — SELL variants: directional reformulations
const LIQ_HUNT_LTT_SELL_FR_NEW     = "✗ Ici, le stop est au-dessus d'un swing high évident, une zone de stop hunt fréquente. Le sweep prend très souvent ce niveau avant le vrai retournement.";
const LIQ_HUNT_WIDE_SELL_FR_NEW    = "✓ Au-dessus de la zone de stop hunt, avec une marge ample. Le sweep peut avoir lieu : ici, ton SL reste hors d'atteinte.";
const MULTI_DEEP_TIGHT_SELL_FR_NEW = "✗ Ici, le stop est au-dessus du 1er swing high (le plus bas). Le pullback structurel monte plus haut, et le SL reste dans le bruit du mouvement.";
const MULTI_DEEP_LTT_SELL_FR_NEW   = "✗ Ici, le stop est au-dessus du 2e swing high. La séquence de higher highs se prolonge jusqu'au 3e : le stop risque d'être balayé avant l'invalidation réelle.";
const MULTI_DEEP_WIDE_SELL_FR_NEW  = "✓ Au-dessus du 3e swing high (le plus haut), avec une marge. C'est ici la vraie invalidation structurelle de la séquence.";
const KEY_MAGNET_LTT_SELL_FR_NEW   = "✗ Ici, le stop est juste sous le niveau clé. Le test profond risque d'aller plus haut, et le sweep de prendre ce niveau.";
const KEY_MAGNET_WIDE_SELL_FR_NEW  = "✓ Au-delà de l'amplitude du test attendu vers le haut. Le sweep peut toucher le niveau clé : ici, ton SL reste hors d'atteinte.";

const RATIONALE_EN: Record<string, string> = {
  [TIGHT_RATIONALE_FR]:   "✗ Too tight: here, the stop sits in the market's normal noise. The 1st retest wick is likely to sweep it before the trade plays out. It's a frequent mistake.",
  [LOGICAL_RATIONALE_FR]: "✓ Logical placement: behind the real invalidation, with an anti-noise margin. Here, it survives the retests and lets the trade capture the structural break if it comes.",
  [WIDE_RATIONALE_FR]:    "≈ It survives, but degrades the R/R. Here, the distance is too large: capital is poorly used, and the R/R drops clearly compared with the logical stop.",
  [FAKEOUT_TIGHT_FR]:     "✗ Here, the stop is in the trap zone, where liquidity was just collected. The 2nd test is likely to sweep it.",
  [FAKEOUT_LOGICAL_FR]:   "✓ Above the fakeout's peak, with a margin. Here, it's the REAL invalidation of the trap: if price goes back there, the scenario is probably broken.",
  [SWEEP_TIGHT_FR]:       "✗ Here, the stop is INSIDE the sweep zone, where liquidity was just collected. The retest is likely to come for it.",
  [SWEEP_LOGICAL_FR]:     "✓ Below the sweep's wick, with a margin. Here, the sweep low becomes the new invalidation, sheltered from a 2nd grab.",
  [FVG_TIGHT_FR]:         "✗ Here, the stop is INSIDE the FVG, a zone the market can return to in order to finish its mitigation. It's likely to get caught in the depth of the zone.",
  [FVG_LOGICAL_FR]:       "✓ Below the bottom of the FVG, with a margin. Here, an FVG crossed entirely would mark a clean invalidation: it's the most consistent structural placement.",
  [HIGHVOL_TIGHT_FR]:     "✗ 'Standard' stop, fine in normal volatility, but here this level sits in the noise. The 1st retest candle, wide because of the volatility, is likely to sweep it.",
  [HIGHVOL_LOGICAL_FR]:   "✓ Stop widened to the market's volatility. What would look like a wide stop in normal times is the LOGICAL one here: it survives the amplified noise without sacrificing the R/R (the TP is farther too).",
  [HIGHVOL_WIDE_FR]:      "≈ It survives, but even with an extended TP in high volatility, the R/R drops below 1.5 here. Capital is poorly used.",
  // V2.1
  [EQUAL_LOWS_TIGHT_FR_NEW]:   "✗ Here, the stop is INSIDE the liquidity zone created by the 2 equal lows. It's the most obvious SL, often collected before the move up.",
  [EQUAL_LOWS_LOGICAL_FR_NEW]: "✓ Below the sweep zone of the 2 lows, with an anti-wick margin. Here, it's the real invalidation of the concept, sheltered from the liquidity hunt.",
  [ROUND_LIQUIDITY_FR_NEW]:    "✗ Here, the stop is right below the round number, where many SLs pile up. This level is very often swept.",
  [ROUND_LOGICAL_FR_NEW]:      "✓ Below the expected sweep of the round number, with a margin. Here, the SL stays outside the targeted zone, and the setup remains valid after the hunt.",
  [ASIA_LIQUIDITY_FR_NEW]:     "✗ Here, the stop is right above the Asia high, in the zone the London open often sweeps. It's a frequent trap of the European open.",
  [ASIA_LOGICAL_FR_NEW]:       "✓ Above the expected sweep of the Asia high, with a margin. If price comes back there after the London open, the bearish bias is probably wrong.",
  [OB_TIGHT_FR_NEW]:           "✗ Here, the stop is below the swing low, but above the Order Block's bottom. The swing may be swept while the OB concept remains valid.",
  [OB_LOGICAL_FR_NEW]:         "✓ Below the Order Block's bottom, with a margin. Here, it's the REAL invalidation of the concept: the swing low can be swept without breaking the setup.",
  [PDL_LIQUIDITY_FR_NEW]:      "✗ Here, the stop is right below the PDL, a daily level that is very often hunted. You expose your position to that hunt.",
  [PDL_LOGICAL_FR_NEW]:        "✓ Below the PDL's hunting zone, with a margin. The expected sweep can happen: here, the SL stays outside the targeted zone.",
  [NEWS_TIGHT_FR_NEW]:         "✗ 'Standard' stop calibrated for normal volatility, while here the day's ATR has doubled. What looks reasonable is actually too tight.",
  [NEWS_LOGICAL_FR_NEW]:       "✓ Margin calibrated on the day's real volatility (doubled ATR). What would look wide in normal times is the LOGICAL stop here: it survives the amplified noise.",
  [NEWS_WIDE_FR_NEW]:          "≈ It survives easily, but the margin is overestimated, even for a doubled ATR. Here, capital is underused and the R/R lower than with the logical stop.",
  [HTF_TIGHT_FR_NEW]:          "✗ Here, the stop is below the H1 swing low, but the H4 bias isn't broken. A normal H1 fluctuation may take you out while the HTF setup stays valid.",
  [HTF_LOGICAL_FR_NEW]:        "✓ Below the relevant H4 HL, with a margin. Here, it's a break of the HTF bias that would invalidate the setup, not a simple H1 fluctuation.",
  [MULTI_TIGHT_FR_NEW]:        "✗ Here, the stop is below the 1st swing low (the higher one), while the lower swing low still holds. The structure isn't broken, and the retest of the 2nd low may take you out.",
  [MULTI_LOGICAL_FR_NEW]:      "✓ Below the LOWER of the 2 swing lows, with a margin. It's the real structural invalidation here: as long as this level holds, the bullish structure stays intact.",
  [FAKE2_TIGHT_FR_NEW]:        "✗ Here, the stop is above the body's swing high, but below the fakeout's wick. The natural wick retest is likely to come for it.",
  [FAKE2_LOGICAL_FR_NEW]:      "✓ Above the fakeout's wick, with a margin. Here, the tip of the wick is the real high to invalidate, rather than the top of the body.",
  [TIGHTCONS_TIGHT_FR_NEW]:    "✗ Here, the stop is inside the narrow range, right in the consolidation's noise. The 1st range oscillation is likely to sweep it.",
  [TIGHTCONS_LOGICAL_FR_NEW]:  "✓ Just below the range bottom, with a margin. The SL respects the range structure here, but the R/R stays limited by the top: to weigh against position size.",
  [TIGHTCONS_WIDE_FR_NEW]:     "≈ Very wide SL, but here the range ceiling makes the R/R very difficult. Without expansion, the trade offers little profit margin.",
  // V2.2 — wide = correct answer
  [EXTREME_VOL_TIGHT_FR_NEW]:   "✗ Here, the stop sits in the immediate noise. The 1st retest candle, wide because of the extreme volatility, is likely to sweep it very quickly.",
  [EXTREME_VOL_LTT_FR_NEW]:     "✗ 'Standard' stop calibrated for normal volatility. With a tripled ATR, this level sits in the noise here, and is likely to be swept before the setup has time to play out.",
  [EXTREME_VOL_WIDE_FR_NEW]:    "✓ Margin calibrated on the day's REAL volatility (3x normal). Here, it's the only stop that absorbs the expansion without breaking the setup.",
  [NEWS_IMM_TIGHT_FR_NEW]:      "✗ Here, the stop sits in the immediate noise. The news impact candle is likely to sweep it within seconds.",
  [NEWS_IMM_LTT_FR_NEW]:        "✗ 'Normal' stop, poorly suited to a news range. An impact candle (2 to 3 times wider) may take you out here before the real directional move.",
  [NEWS_IMM_WIDE_FR_NEW]:       "✓ Margin wide enough to absorb the news range. Here, it's this SL, or no trade during the news window.",
  [LIQ_HUNT_TIGHT_FR_NEW]:      "✗ Here, the stop sits in the immediate noise. The 1st retest is likely to sweep it even before the main hunt.",
  [LIQ_HUNT_LTT_FR_NEW]:        "✗ Here, the stop is below an obvious swing low, a frequent hunting zone. The sweep very often takes this level before the real reversal.",
  [LIQ_HUNT_WIDE_FR_NEW]:       "✓ Below the hunting zone, with an ample margin. The sweep can happen: here, your SL stays out of reach.",
  [MULTI_DEEP_TIGHT_FR_NEW]:    "✗ Here, the stop is below the 1st swing low (the higher one). The structural pullback goes lower, and the SL stays in the noise of the move.",
  [MULTI_DEEP_LTT_FR_NEW]:      "✗ Here, the stop is below the 2nd swing low. The sequence of lower lows extends to the 3rd: the stop is likely to be swept before the real invalidation.",
  [MULTI_DEEP_WIDE_FR_NEW]:     "✓ Below the 3rd swing low (the lowest), with a margin. It's the real structural invalidation of the sequence here.",
  [FAKEOUT_ZONE_TIGHT_FR_NEW]:  "✗ Here, the stop sits in the immediate noise: the slightest retest wick is likely to sweep it.",
  [FAKEOUT_ZONE_LTT_FR_NEW]:    "✗ Here, the stop is above the 2 previous fakeouts, but a 3rd fakeout often exceeds that range. It's likely to be swept.",
  [FAKEOUT_ZONE_WIDE_FR_NEW]:   "✓ Above the maximum likely range of the repeated fakeouts. Here, a 3rd fakeout is unlikely to reach you.",
  [WEEKLY_OPEN_TIGHT_FR_NEW]:   "✗ Here, the stop sits in the immediate noise. The Monday open gap is likely to sweep it on the 1st candle.",
  [WEEKLY_OPEN_LTT_FR_NEW]:     "✗ 'Standard' stop, poorly suited to a weekend gap that can reach 2 to 3 times a candle's normal range.",
  [WEEKLY_OPEN_WIDE_FR_NEW]:    "✓ Wide margin to absorb the open gap's range. Here, as long as the structure holds, the SL holds too.",
  [KEY_MAGNET_TIGHT_FR_NEW]:    "✗ Here, the stop sits in the immediate noise, and is likely to be swept even before the magnetic level is reached.",
  [KEY_MAGNET_LTT_FR_NEW]:      "✗ Here, the stop is just above the magnetic level. The deep test is likely to go lower, and the sweep to take this level.",
  [KEY_MAGNET_WIDE_FR_NEW]:     "✓ Beyond the range of the expected test on the magnetic level. The sweep can touch the level: here, your SL stays out of reach.",
  // V2.3 — SELL mirrors
  [LIQ_HUNT_LTT_SELL_FR_NEW]:     "✗ Here, the stop is above an obvious swing high, a frequent hunting zone. The sweep very often takes this level before the real reversal.",
  [LIQ_HUNT_WIDE_SELL_FR_NEW]:    "✓ Above the hunting zone, with an ample margin. The sweep can happen: here, your SL stays out of reach.",
  [MULTI_DEEP_TIGHT_SELL_FR_NEW]: "✗ Here, the stop is above the 1st swing high (the lower one). The structural pullback goes higher, and the SL stays in the noise of the move.",
  [MULTI_DEEP_LTT_SELL_FR_NEW]:   "✗ Here, the stop is above the 2nd swing high. The sequence of higher highs extends to the 3rd: the stop is likely to be swept before the real invalidation.",
  [MULTI_DEEP_WIDE_SELL_FR_NEW]:  "✓ Above the 3rd swing high (the highest), with a margin. It's the real structural invalidation of the sequence here.",
  [KEY_MAGNET_LTT_SELL_FR_NEW]:   "✗ Here, the stop is just below the magnetic level. The deep test is likely to go higher, and the sweep to take this level.",
  [KEY_MAGNET_WIDE_SELL_FR_NEW]:  "✓ Beyond the range of the expected upward test. The sweep can touch the magnetic level: here, your SL stays out of reach.",
};

function translateRationale(fr: string): string {
  return RATIONALE_EN[fr] ?? fr;
}

function translateStops(stops: StopOption[]): StopOption[] {
  return stops.map((s) => ({ ...s, rationale: translateRationale(s.rationale) }));
}

// buildPlaceStopChart wrapper that translates zone labels and rationales.
export function buildPlaceStopChart(
  setup: PlaceStopSetupKey,
  seed: number,
  volatility: Volatility,
  difficulty: Difficulty,
  ctx: MarketCtx = {},
): PlaceStopChart {
  const chart = buildPlaceStopChartFr(setup, seed, volatility, difficulty, ctx);
  return {
    ...chart,
    zones: translateZones(chart.zones),
    stops: translateStops(chart.stops),
  };
}

// ─── EN generatePlaceStopScenarios ───────────────────────────────────────────
// Reuse FR logic but remap text fields to the EN template by id.

export function generatePlaceStopScenarios(seed: number, difficulty: Difficulty = "intermediate"): PlaceStopInstance[] {
  const frInstances = generatePlaceStopScenariosFr(seed, difficulty);
  return frInstances.map((inst) => {
    const enTpl = PLACE_STOP_TEMPLATES_EN.find((t) => t.id === inst.id);
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

// ─── EN Verdicts ─────────────────────────────────────────────────────────────

export const STOP_TYPE_META: Record<StopType, { label: string; color: "emerald" | "amber" | "red" }> = {
  logical:   { label: "Logical stop",    color: "emerald" },
  wide:      { label: "Too wide stop",   color: "amber"   },
  tight:     { label: "Too tight stop",  color: "red"     },
  liquidity: { label: "Stop in liquidity", color: "red"   },
};

export const DIFFICULTY_META: Record<Difficulty, { label: string; dotClass: string; textClass: string; description: string }> = {
  beginner: {
    label:       "Beginner",
    dotClass:    "bg-emerald-400",
    textClass:   "text-emerald-400",
    description: "Clear structure, obvious logical stop, very visible sweep.",
  },
  intermediate: {
    label:       "Intermediate",
    dotClass:    "bg-blue-400",
    textClass:   "text-blue-400",
    description: "Dirtier volatility, several plausible stops, tempting tight stop.",
  },
  advanced: {
    label:       "Advanced",
    dotClass:    "bg-amber-400",
    textClass:   "text-amber-400",
    description: "Ambiguous market, partial sweep, trade-off survival / invalidation / R/R.",
  },
};

export function sessionVerdict(score: number, logicalCount: number, total: number): string {
  if (logicalCount >= total - 1) return "Stop sniper";
  if (score >= 70)               return "Good protection";
  if (score >= 50)               return "Solid read";
  if (score >= 30)               return "To polish";
  if (score >= 10)               return "Too emotional";
  return "You give your SL to the market";
}

// Re-export FR for comparison if needed.
export { FR_TEMPLATES as PLACE_STOP_TEMPLATES_FR };
