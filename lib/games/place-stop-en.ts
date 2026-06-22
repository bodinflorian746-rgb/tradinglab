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
      beginner:     "The logical stop goes BEHIND the swing low with a margin, never inside (noise), never too far (R/R ruined).",
      intermediate: "Pullback noise often retests the low before continuation. The margin behind the low protects against that classic sweep.",
      advanced:     "The logical stop respects 3 constraints: behind the low, outside the ATR noise, and preserves an R/R >= 2. It's the only one satisfying all 3.",
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
      beginner:     "The logical stop goes ABOVE the swing high with a margin, never below, never too far.",
      intermediate: "The bounce can retest its high before dropping. Hugging the high = guaranteed stop hunt.",
      advanced:     "Stop = covers the high's wick + ATR margin. A stop right on the level is trapped, a stop too far kills the R/R.",
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
      beginner:     "Stop below the support with a realistic margin. Glued to the support = institutional liquidity grab.",
      intermediate: "HTF support often attracts a deep test before the real reaction. The margin protects against that stop hunt.",
      advanced:     "Optimal distance = 1.0 to 1.5x ATR below the level. Tighter = noise, farther = dead capital.",
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
      beginner:     "Stop above the highest wick, with a margin. Hugging the level = guaranteed stop hunt.",
      intermediate: "HTF resistance retests are often tricky. Margin behind the wick = mandatory.",
      advanced:     "The rejection wick + 1 ATR = clean zone. Hugging the wick = exposed to the 2nd test, too far = broken R/R.",
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
      intermediate: "Stop ABOVE the PEAK of the fakeout (never inside). The peak is the real invalidation of the trap.",
      advanced:     "Stop ABOVE the wick high + ATR margin. Hugging the high = a fakeout retest takes you out. Inside the trap = -100.",
      beginner:     "The stop must cover the false breakout's wick. Any stop placed in the trap zone = lost.",
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
      intermediate: "Stop below the LOW of the sweep, never in the zone that was just taken. The sweep is the new invalidation.",
      advanced:     "Stop = below the sweep's wick + margin. Glued to the sweep low = likely retest, inside the liquidity zone = total trap.",
      beginner:     "The market just spiked a zone, your stop must be BELOW that zone, not inside it.",
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
      intermediate: "Stop below the BOTTOM of the FVG. Inside the FVG = exposed to a deep re-test, too far = fragile R/R.",
      advanced:     "The FVG is the invalidation zone. Stop = FVG bottom - 1 ATR. Tighter = noise, farther = dead capital.",
      beginner:     "The FVG is your buy zone. The stop goes BELOW the zone, not inside it.",
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
      advanced:     "In high vol, the 'normal' stop becomes too tight. The margin must double — what looks like a wide stop is actually the LOGICAL one here.",
      intermediate: "Volatility widens the normal noise. A 'standard' stop is probably too tight.",
      beginner:     "The more the market moves, the wider your stop must be to breathe.",
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
      beginner:     "2 almost equal lows = an obvious double bottom for retail. Stop with a margin below the zone, not glued inside it.",
      intermediate: "When 2 lows are almost equal, they create a liquidity zone visible to everyone. Institutions come to grab it before reversing. SL below but with an anti-sweep margin.",
      advanced:     "Equal lows = retail double bottom = institutional liquidity pool. The real invalidation isn't below the lows, it's several ATR lower, after the sweep.",
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
      beginner:     "Round numbers (1.1000, 100,000, etc.) attract retail SLs. Place your stop farther away, never right below.",
      intermediate: "Round numbers = psychological levels = concentrated liquidity. Retail places SLs and TPs in bulk. Algos sweep them systematically.",
      advanced:     "1.1000, 4,300, 100,000... these levels attract stops. Placing the SL just below = handing your position to the algo. SL farther away, or don't trade.",
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
      beginner:     "The Asia high is often swept at the London open. Your SL must be above the expected sweep, not glued to the high.",
      intermediate: "The Asia high is swept in ~60% of sessions at the London open. Selling glued to the high without anticipating this sweep = guaranteed stop out.",
      advanced:     "The Asia high sweep is a well-documented institutional market mechanic. SL above the expected sweep, not on the high.",
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
      beginner:     "An Order Block's invalidation is below its bottom, not below the recent swing low. Place the SL accordingly.",
      intermediate: "The Order Block bottom defines the concept's invalidation, not the last swing. SL below the OB bottom with a margin.",
      advanced:     "An Order Block's invalidation is below its bottom, not below the last swing low. Confusing the two = stop out on the mitigation wick while the setup is still valid.",
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
      beginner:     "PDL = Previous Day Low. It's an institutional hunting zone. SL below the PDL with a margin, not glued below it.",
      intermediate: "PDL = Previous Day Low = daily liquidity level. Algos use it as a hunting zone. SL glued below = captured.",
      advanced:     "The PDL is part of the major institutional levels along with PDH, PWL, PWH, PML. Any SL placed 0-5 pips below one of these levels has a high probability of being hunted before the real move.",
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
      beginner:     "When vol explodes (FOMC, NFP), a 'normal' SL becomes tight. Widen the margin to the day's ATR.",
      intermediate: "On a doubled-ATR day, the 'standard' SL is effectively tight. Margin adjusted to the real vol, otherwise automatic stop out.",
      advanced:     "SL size isn't a fixed number in pips. It's a multiple of the day's ATR. When the ATR doubles, the SL margin must double too, otherwise your SL becomes statistically tight.",
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
      beginner:     "When the setup is on H1 but the HTF bias is on H4, your SL must respect the H4 HL, not the H1 swing.",
      intermediate: "The SL must be at the scale of the invalidation timeframe, not the entry timeframe. H1 setup + H4 bias = SL below the H4 HL.",
      advanced:     "The SL must be placed at the scale of the setup. H1 setup with H4 bias = SL at minimum below the relevant H4 HL. Otherwise normal H1 fluctuation takes you out before the real move.",
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
      beginner:     "When 2 swing lows are close, respect the LOWER one for the SL. The 1st will be swept before the real break.",
      intermediate: "When 2 swing lows are close, structural invalidation requires the LOWER one to be broken. SL below the first = stop out on normal fluctuation.",
      advanced:     "Sequence of lows: as long as the lower bottom holds, the bullish structure isn't broken. SL below the 1st swing ignores this market mechanic.",
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
      beginner:     "When a fakeout is already visible, the real high to invalidate is the wick, not the top of the body.",
      intermediate: "The natural retest after a fakeout goes to seek the wick. SL above the wick + margin, not on the body.",
      advanced:     "When a fakeout has already happened, the real high to invalidate is the tip of the wick, not the body's swing high. SL below the wick = stop out on the natural wick retest.",
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
      beginner:     "In a narrow range, either you wait for a breakout, or you reduce your position size. Standard SL = terrible R/R.",
      intermediate: "Narrow range + standard SL = poor R/R. Narrow range + tight SL = stop out. The solution: wait for expansion, or reduce the lot size.",
      advanced:     "In a narrow range, the SL/R/R trade-off becomes unsolvable without a compromise on size. Either you wait for expansion, or you accept an R/R < 1:2 and offset it with winrate.",
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
      beginner:     "In extreme vol, your 'normal' SL becomes effectively tight. The margin must be proportional to the day's ATR.",
      intermediate: "Tripled ATR = standard SL unsuited. Either you adapt the margin, or you pass your turn.",
      advanced:     "When the ATR triples versus normal, your standard 1.2 × ATR SL actually becomes a tight SL. The rule: adapt the SL to the day's volatility, not a fixed number in pips. In extreme vol, it's a 3-4 × ATR SL or no trade.",
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
      beginner:     "In extreme vol, your 'normal' SL becomes tight, on SELL too. Margin proportional to the ATR.",
      intermediate: "Tripled ATR = standard SL on the high unsuited. Either you adapt, or you pass.",
      advanced:     "On SELL too, the rule is: SL = a multiple of the day's ATR, not a fixed margin. ATR ×3 = margin ×3 or no trade.",
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
      beginner:     "Before a major news event, candle amplitude × 2-3. Adapt your SL or don't take the trade.",
      intermediate: "A news candle with × 3 amplitude will sweep your 'standard' SL before you react. Wide margin mandatory.",
      advanced:     "Before a major news event, candle amplitude × 2-3. Either you don't trade, or you adapt your SL accordingly. Putting a standard SL = handing your position to the news move.",
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
      beginner:     "Obvious swing lows attract retail SLs. Put your SL well beyond the zone, or wait until after the sweep.",
      intermediate: "The more 'obvious' a zone, the more it will be hunted. SL glued below = institutional capture.",
      advanced:     "Swing lows that are too 'obvious' are favorite hunting zones. SL placed just below = institutional capture. Either you wait for the hunt to be done and enter after, or you put your SL well beyond.",
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
      beginner:     "When 3 swing lows are aligned downward, the real invalidation is below the lowest. SL below the 1st = guaranteed stop out.",
      intermediate: "When several swing lows are aligned, the true structural invalidation is below the lowest. SL below the others = stop out on normal fluctuation.",
      advanced:     "The sequence of lower lows in pullback mode is part of the structural design. The SL must respect the maximum depth of the expected pullback, not stop at the 1st swing.",
    },
    difficulties: ["intermediate", "advanced"],
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
      beginner:     "A resistance that already rejected with wicks often makes more. SL above the maximum wick, not on the previous wick.",
      intermediate: "Multi-fakeouts = statistical pattern. Anticipate an amplitude greater than the previous wicks.",
      advanced:     "A zone that already made 2 fakeouts will statistically make a 3rd. The SL must anticipate this maximum amplitude, not stop at the previous wicks.",
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
      beginner:     "The Monday open can produce a gap. Standard SL = swept by the gap. Wide margin or don't open a position before the open.",
      intermediate: "A Monday open gap can do 1-2 × ATR. Put your SL beyond it or wait for stabilization.",
      advanced:     "The Monday open gap can be brutal depending on the weekend's news. Either you wait for the open to be digested, or you put a wide SL to absorb the amplitude.",
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
      beginner:     "Psychological levels attract price like magnets. Don't place your SL glued above, put it well beyond.",
      intermediate: "Psychological levels are magnets. Price tests them almost systematically. SL placed glued above = guaranteed sweep.",
      advanced:     "Anticipating the test of a magnetic level = placing the SL beyond the foreseeable sweep amplitude, not just above the level.",
    },
    difficulties: ["intermediate", "advanced"],
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
      beginner:     "Before an FOMC, candle amplitude × 2-3. Standard SL burned. Adapt the margin or don't trade.",
      intermediate: "An FOMC impact candle will sweep your 'standard' SL on the high before the directional move triggers.",
      advanced:     "Before an FOMC, candle amplitude × 2-3. The standard 1.2 × ATR SL will be swept by the first move. Either you don't trade, or you use a minimum 3 × ATR SL.",
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
      beginner:     "Obvious swing highs attract retail SLs. Put your SL well beyond the zone, or wait until after the sweep.",
      intermediate: "The more 'obvious' a zone, the more it will be hunted. SL glued above the swing high = institutional capture.",
      advanced:     "Swing highs that are too obvious = hunting zones. SL glued above = institutional capture. Either you wait for the hunt, or you put your SL well beyond.",
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
      beginner:     "When 3 swing highs are aligned upward, the real invalidation is above the highest. SL above the 1st = guaranteed stop out.",
      intermediate: "When several swing highs are aligned, the true structural invalidation is above the highest. SL above the others = stop out on normal fluctuation.",
      advanced:     "The sequence of higher highs in bearish pullback mode is part of the structural design. The SL must respect the maximum depth of the expected pullback.",
    },
    difficulties: ["intermediate", "advanced"],
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
      beginner:     "The Monday open can produce a bullish gap. Standard SL = swept. Wide margin or don't open a position before the open.",
      intermediate: "A Monday open gap can do 1-2 × ATR upward. Put your SELL SL beyond it or wait for stabilization.",
      advanced:     "The Monday open gap can be brutal depending on the weekend's news. The SELL SL must absorb the gap's amplitude.",
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
      beginner:     "Psychological levels attract price like magnets, upward too. Don't place your SL glued below, put it well beyond.",
      intermediate: "Psychological levels are magnets. Price tests them systematically. SL glued above = guaranteed sweep.",
      advanced:     "Anticipating the test of a magnetic level = placing the SL beyond the foreseeable upward sweep amplitude.",
    },
    difficulties: ["intermediate", "advanced"],
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
  "Précédent low":        "Previous low",
  "Précédent high":       "Previous high",
  "Liquidité balayée":    "Swept liquidity",
  "FVG haussier":         "Bullish FVG",
  "Wick fakeout":         "Fakeout wick",
  // V2.1 — zones of the new scenarios
  "Equal lows":           "Equal lows",
  "Chiffre rond":         "Round number",
  "Asia high":            "Asia high",
  "Order Block":          "Order Block",
  "PDL":                  "PDL",
  "HL H4":                "HL H4",
  "Swing low H1":         "Swing low H1",
  "Swing low 1":          "Swing low 1",
  "Swing low 2":          "Swing low 2",
  "Bottom range":         "Range bottom",
  "Top range":            "Range top",
  // V2.2
  "Swing low évident":    "Obvious swing low",
  "Zone de chasse":       "Hunt zone",
  "Swing low 3":          "Swing low 3",
  "Fakeouts précédents":  "Previous fakeouts",
  "Niveau magnétique":    "Magnetic level",
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

const TIGHT_RATIONALE_FR = "✗ Trop serré, placé dans le bruit normal du marché. La 1re mèche de retest va le balayer avant que le trade aboutisse. C'est l'erreur retail classique.";
const LOGICAL_RATIONALE_FR = "✓ Placement logique, derrière la vraie invalidation, avec une marge anti-bruit. Survit aux retests, capture la cassure structurelle si elle arrive.";
const WIDE_RATIONALE_FR = "≈ Survit, mais détruit le RR. Distance trop grande = capital mal utilisé, ratio risque/rendement souvent < 1.";

const FAKEOUT_TIGHT_FR   = "✗ Stop dans la zone du piège, pile dans la zone que les institutionnels viennent d'utiliser pour ramasser la liquidité. Le 2e test va te balayer.";
const FAKEOUT_LOGICAL_FR = "✓ Au-dessus du pic du fakeout, avec marge. C'est la VRAIE invalidation du piège, si le prix repasse là, le scénario est cassé.";

const SWEEP_TIGHT_FR   = "✗ Stop DANS la zone du sweep, exactement là où les institutionnels viennent de ramasser la liquidité. Le retest va te chercher.";
const SWEEP_LOGICAL_FR = "✓ Sous la mèche du sweep, avec marge. Le low du sweep est la nouvelle invalidation, protégé contre un 2e ramassage.";

const FVG_TIGHT_FR   = "✗ Stop DANS le FVG, la zone est précisément celle où le marché peut retourner pour finir sa mitigation. Tu seras pris dans la profondeur de la zone.";
const FVG_LOGICAL_FR = "✓ Sous le bas du FVG avec marge. Le FVG entièrement traversé = invalidation propre. C'est le placement structurel correct.";

const HIGHVOL_TIGHT_FR   = "✗ Stop 'standard', qui serait OK en vol normale, mais en vol élevée ce niveau est dans le bruit. La 1re bougie de retest, large à cause de la vol, va te balayer.";
const HIGHVOL_LOGICAL_FR = "✓ Stop élargi à la volatilité du marché. Ce qui ressemble à un 'wide stop' en vol normale est en fait le LOGIQUE ici, il survit au noise amplifié sans tuer le RR (TP également plus loin).";
const HIGHVOL_WIDE_FR    = "≈ Survie garantie, mais même avec un TP étendu en vol élevée, le RR descend sous 1.5. Capital mal utilisé.";

// V2.1 — rationales of the new scenarios
const EQUAL_LOWS_TIGHT_FR_NEW   = "✗ Stop DANS la zone de liquidité créée par les 2 equal lows. C'est le SL retail évident, les institutionnels le ramassent avant de partir en hausse.";
const EQUAL_LOWS_LOGICAL_FR_NEW = "✓ Sous la zone de sweep des 2 lows + marge anti-mèche. C'est l'invalidation réelle du concept, protégé contre la chasse à la liquidité retail.";
const ROUND_LIQUIDITY_FR_NEW    = "✗ Stop pile sous le chiffre rond, exactement là où tous les SL retail sont entassés. Les algos sweep ce niveau de façon systématique.";
const ROUND_LOGICAL_FR_NEW      = "✓ Sous le sweep attendu du chiffre rond + marge. Le SL est hors de la zone que les algos viennent ramasser, le setup reste valide après la chasse.";
const ASIA_LIQUIDITY_FR_NEW     = "✗ Stop pile au-dessus de l'Asia high, dans la zone que le London open va sweep. C'est le piège classique de l'ouverture européenne.";
const ASIA_LOGICAL_FR_NEW       = "✓ Au-dessus du sweep attendu de l'Asia high + marge. Si le prix revient là après l'ouverture London, c'est que le bias bearish est faux.";
const OB_TIGHT_FR_NEW           = "✗ Stop sous le swing low, mais au-dessus du bas du Order Block. Le swing va être sweep alors que le concept OB est encore valide.";
const OB_LOGICAL_FR_NEW         = "✓ Sous le bas du Order Block + marge. C'est la VRAIE invalidation du concept OB, le swing low peut être sweep sans que le setup soit cassé.";
const PDL_LIQUIDITY_FR_NEW      = "✗ Stop pile sous le PDL, niveau institutionnel quotidien chassé quasi systématiquement. Tu offres ta position aux algos.";
const PDL_LOGICAL_FR_NEW        = "✓ Sous la zone de chasse du PDL + marge. Le sweep attendu peut avoir lieu, le SL est hors de la zone d'embuscade institutionnelle.";
const NEWS_TIGHT_FR_NEW         = "✗ Stop 'standard' calibré pour vol normale, mais l'ATR du jour est doublé. Ce qui paraît raisonnable est en fait tight pour la vol réelle.";
const NEWS_LOGICAL_FR_NEW       = "✓ Marge calibrée sur la vol réelle du jour (ATR doublé). Ce qui semble large en vol normale est le LOGIQUE ici, survit au bruit amplifié.";
const NEWS_WIDE_FR_NEW          = "≈ Survit largement, mais marge surestimée même pour ATR doublé. Capital sous-utilisé, RR plus faible qu'avec logical.";
const HTF_TIGHT_FR_NEW          = "✗ Stop sous le swing low H1, mais le bias H4 n'est pas cassé. Une fluctuation H1 normale va te sortir alors que le setup HTF reste valide.";
const HTF_LOGICAL_FR_NEW        = "✓ Sous le HL H4 pertinent + marge. Le bias HTF doit être cassé pour invalider le setup, pas une simple fluctuation H1.";
const MULTI_TIGHT_FR_NEW        = "✗ Stop sous le 1er swing low (le plus haut), mais le swing low plus bas tient encore. La structure n'est pas cassée, tu seras stop sur le retest du 2e low.";
const MULTI_LOGICAL_FR_NEW      = "✓ Sous le PLUS BAS des 2 swing lows + marge. C'est l'invalidation structurelle réelle, tant que ce niveau tient la structure bullish est intacte.";
const FAKE2_TIGHT_FR_NEW        = "✗ Stop au-dessus du swing high du corps, mais sous la mèche du fakeout. Le retest naturel du wick va te chercher.";
const FAKE2_LOGICAL_FR_NEW      = "✓ Au-dessus de la mèche du fakeout + marge. La pointe du wick est le vrai high à invalider, pas le sommet du corps.";
const TIGHTCONS_TIGHT_FR_NEW    = "✗ Stop dans le range serré, dans le bruit normal de la consolidation. La 1re oscillation du range va le balayer.";
const TIGHTCONS_LOGICAL_FR_NEW  = "✓ Juste sous le bottom du range + marge. Le SL respecte la structure du range, mais le RR sera limité par le top, à arbitrer avec la taille de position.";
const TIGHTCONS_WIDE_FR_NEW     = "≈ SL très large, mais le RR est rendu impossible par le plafond du range. Sans expansion, le trade n'a pas de marge bénéfice.";

// V2.2 — scenarios where "wide" is the correct answer
const EXTREME_VOL_TIGHT_FR_NEW   = "✗ Stop dans le bruit immédiat. La 1re bougie de retest, large à cause de la vol extrême, va te balayer en quelques secondes.";
const EXTREME_VOL_LTT_FR_NEW     = "✗ Stop 'standard' calibré pour vol normale. Avec un ATR triplé, ce niveau est statistiquement dans le bruit. Tu seras balayé avant que le setup ait le temps de jouer.";
const EXTREME_VOL_WIDE_FR_NEW    = "✓ Marge calibrée sur la vol RÉELLE du jour (×3 vs normale). C'est le seul stop qui absorbe l'expansion sans casser le setup.";
const NEWS_IMM_TIGHT_FR_NEW      = "✗ Stop dans le bruit immédiat. La bougie d'impact news va le balayer en quelques secondes.";
const NEWS_IMM_LTT_FR_NEW        = "✗ Stop 'normal' inadapté à l'amplitude news. Une bougie d'impact (×2-3 amplitude) va te sortir avant le vrai move directionnel.";
const NEWS_IMM_WIDE_FR_NEW       = "✓ Marge assez large pour absorber l'amplitude news. Soit ce SL, soit pas de trade pendant la fenêtre news.";
const LIQ_HUNT_TIGHT_FR_NEW      = "✗ Stop dans le bruit immédiat. Balayé par le 1er retest avant même la chasse principale.";
const LIQ_HUNT_LTT_FR_NEW        = "✗ Stop sous un swing low évident = zone de chasse institutionnelle. Le sweep prend ce niveau systématiquement avant le vrai retournement.";
const LIQ_HUNT_WIDE_FR_NEW       = "✓ Sous la zone de chasse + marge ample. Le sweep peut avoir lieu, ton SL reste hors d'atteinte.";
const MULTI_DEEP_TIGHT_FR_NEW    = "✗ Stop sous le 1er swing low (le plus haut). Le pullback structurel descend plus bas, le SL est dans le bruit du déroulé.";
const MULTI_DEEP_LTT_FR_NEW      = "✗ Stop sous le 2e swing low. La séquence de lower lows continue jusqu'au 3e. Balayé avant l'invalidation réelle.";
const MULTI_DEEP_WIDE_FR_NEW     = "✓ Sous le 3e swing low (le plus bas) + marge. C'est la vraie invalidation structurelle de la séquence.";
const FAKEOUT_ZONE_TIGHT_FR_NEW  = "✗ Stop dans le bruit immédiat. Balayé par n'importe quelle mèche de retest.";
const FAKEOUT_ZONE_LTT_FR_NEW    = "✗ Stop au-dessus des 2 fakeouts précédents, mais le 3e fakeout va statistiquement dépasser cette amplitude. Balayé.";
const FAKEOUT_ZONE_WIDE_FR_NEW   = "✓ Au-dessus de l'amplitude maximale prévisible des fakeouts récurrents. Le 3e ne te touchera pas.";
const WEEKLY_OPEN_TIGHT_FR_NEW   = "✗ Stop dans le bruit immédiat. Le gap d'ouverture lundi le balaye à la 1re bougie.";
const WEEKLY_OPEN_LTT_FR_NEW     = "✗ Stop 'standard' inadapté à un gap weekend qui peut faire 2-3× l'amplitude normale d'une bougie.";
const WEEKLY_OPEN_WIDE_FR_NEW    = "✓ Marge large pour absorber l'amplitude du gap d'ouverture. La structure tient, le SL aussi.";
const KEY_MAGNET_TIGHT_FR_NEW    = "✗ Stop dans le bruit immédiat, balayé avant même que le niveau magnétique soit atteint.";
const KEY_MAGNET_LTT_FR_NEW      = "✗ Stop juste au-dessus du niveau magnétique. Mais le test profond va aller plus bas, le sweep prend ce niveau.";
const KEY_MAGNET_WIDE_FR_NEW     = "✓ Au-delà de l'amplitude du test attendu sur le niveau magnétique. Le sweep touche le niveau, ton SL reste hors d'atteinte.";

// V2.3 — SELL variants: directional reformulations
const LIQ_HUNT_LTT_SELL_FR_NEW     = "✗ Stop au-dessus d'un swing high évident = zone de chasse institutionnelle. Le sweep prend ce niveau systématiquement avant le vrai retournement.";
const LIQ_HUNT_WIDE_SELL_FR_NEW    = "✓ Au-dessus de la zone de chasse + marge ample. Le sweep peut avoir lieu, ton SL reste hors d'atteinte.";
const MULTI_DEEP_TIGHT_SELL_FR_NEW = "✗ Stop au-dessus du 1er swing high (le plus bas). Le pullback structurel monte plus haut, le SL est dans le bruit du déroulé.";
const MULTI_DEEP_LTT_SELL_FR_NEW   = "✗ Stop au-dessus du 2e swing high. La séquence de higher highs continue jusqu'au 3e. Balayé avant l'invalidation réelle.";
const MULTI_DEEP_WIDE_SELL_FR_NEW  = "✓ Au-dessus du 3e swing high (le plus haut) + marge. C'est la vraie invalidation structurelle de la séquence.";
const KEY_MAGNET_LTT_SELL_FR_NEW   = "✗ Stop juste sous le niveau magnétique. Mais le test profond va aller plus haut, le sweep prend ce niveau.";
const KEY_MAGNET_WIDE_SELL_FR_NEW  = "✓ Au-delà de l'amplitude du test attendu vers le haut. Le sweep touche le niveau magnétique, ton SL reste hors d'atteinte.";

const RATIONALE_EN: Record<string, string> = {
  [TIGHT_RATIONALE_FR]:   "✗ Too tight, placed in the market's normal noise. The 1st retest wick will sweep it before the trade plays out. It's the classic retail mistake.",
  [LOGICAL_RATIONALE_FR]: "✓ Logical placement, behind the real invalidation, with an anti-noise margin. Survives retests, captures the structural break if it comes.",
  [WIDE_RATIONALE_FR]:    "≈ Survives, but destroys the R/R. Distance too large = poorly used capital, risk/reward ratio often < 1.",
  [FAKEOUT_TIGHT_FR]:     "✗ Stop in the trap zone, right in the area institutions just used to grab liquidity. The 2nd test will sweep you.",
  [FAKEOUT_LOGICAL_FR]:   "✓ Above the fakeout's peak, with a margin. It's the REAL invalidation of the trap — if price goes back there, the scenario is broken.",
  [SWEEP_TIGHT_FR]:       "✗ Stop INSIDE the sweep zone, exactly where institutions just grabbed the liquidity. The retest will come for you.",
  [SWEEP_LOGICAL_FR]:     "✓ Below the sweep's wick, with a margin. The sweep low is the new invalidation, protected against a 2nd grab.",
  [FVG_TIGHT_FR]:         "✗ Stop INSIDE the FVG, precisely the zone where the market can return to finish its mitigation. You'll get caught in the depth of the zone.",
  [FVG_LOGICAL_FR]:       "✓ Below the bottom of the FVG with a margin. The FVG fully crossed = clean invalidation. It's the correct structural placement.",
  [HIGHVOL_TIGHT_FR]:     "✗ 'Standard' stop, which would be OK in normal vol, but in high vol this level is in the noise. The 1st retest candle, wide because of the vol, will sweep you.",
  [HIGHVOL_LOGICAL_FR]:   "✓ Stop widened to the market's volatility. What looks like a 'wide stop' in normal vol is actually the LOGICAL one here — it survives the amplified noise without killing the R/R (TP also farther).",
  [HIGHVOL_WIDE_FR]:      "≈ Survival guaranteed, but even with an extended TP in high vol, the R/R drops below 1.5. Poorly used capital.",
  // V2.1
  [EQUAL_LOWS_TIGHT_FR_NEW]:   "✗ Stop INSIDE the liquidity zone created by the 2 equal lows. It's the obvious retail SL — institutions grab it before heading up.",
  [EQUAL_LOWS_LOGICAL_FR_NEW]: "✓ Below the sweep zone of the 2 lows + anti-wick margin. It's the real invalidation of the concept, protected against the retail liquidity hunt.",
  [ROUND_LIQUIDITY_FR_NEW]:    "✗ Stop right below the round number, exactly where all the retail SLs are stacked. Algos sweep this level systematically.",
  [ROUND_LOGICAL_FR_NEW]:      "✓ Below the expected sweep of the round number + margin. The SL is outside the zone algos come to grab, the setup stays valid after the hunt.",
  [ASIA_LIQUIDITY_FR_NEW]:     "✗ Stop right above the Asia high, in the zone the London open will sweep. It's the classic European-open trap.",
  [ASIA_LOGICAL_FR_NEW]:       "✓ Above the expected sweep of the Asia high + margin. If price comes back there after the London open, the bearish bias is wrong.",
  [OB_TIGHT_FR_NEW]:           "✗ Stop below the swing low, but above the Order Block bottom. The swing will be swept while the OB concept is still valid.",
  [OB_LOGICAL_FR_NEW]:         "✓ Below the Order Block bottom + margin. It's the REAL invalidation of the OB concept — the swing low can be swept without the setup being broken.",
  [PDL_LIQUIDITY_FR_NEW]:      "✗ Stop right below the PDL, a daily institutional level hunted almost systematically. You're handing your position to the algos.",
  [PDL_LOGICAL_FR_NEW]:        "✓ Below the PDL hunting zone + margin. The expected sweep can happen, the SL is outside the institutional ambush zone.",
  [NEWS_TIGHT_FR_NEW]:         "✗ 'Standard' stop calibrated for normal vol, but the day's ATR is doubled. What looks reasonable is actually tight for the real vol.",
  [NEWS_LOGICAL_FR_NEW]:       "✓ Margin calibrated on the day's real vol (doubled ATR). What looks wide in normal vol is the LOGICAL one here, survives the amplified noise.",
  [NEWS_WIDE_FR_NEW]:          "≈ Survives easily, but margin overestimated even for a doubled ATR. Underused capital, lower R/R than with logical.",
  [HTF_TIGHT_FR_NEW]:          "✗ Stop below the H1 swing low, but the H4 bias isn't broken. A normal H1 fluctuation will take you out while the HTF setup stays valid.",
  [HTF_LOGICAL_FR_NEW]:        "✓ Below the relevant H4 HL + margin. The HTF bias must be broken to invalidate the setup, not just an H1 fluctuation.",
  [MULTI_TIGHT_FR_NEW]:        "✗ Stop below the 1st swing low (the highest), but the lower swing low still holds. The structure isn't broken, you'll be stopped on the retest of the 2nd low.",
  [MULTI_LOGICAL_FR_NEW]:      "✓ Below the LOWEST of the 2 swing lows + margin. It's the real structural invalidation — as long as this level holds, the bullish structure is intact.",
  [FAKE2_TIGHT_FR_NEW]:        "✗ Stop above the body's swing high, but below the fakeout's wick. The natural wick retest will come for you.",
  [FAKE2_LOGICAL_FR_NEW]:      "✓ Above the fakeout's wick + margin. The tip of the wick is the real high to invalidate, not the top of the body.",
  [TIGHTCONS_TIGHT_FR_NEW]:    "✗ Stop in the narrow range, in the consolidation's normal noise. The 1st range oscillation will sweep it.",
  [TIGHTCONS_LOGICAL_FR_NEW]:  "✓ Just below the range bottom + margin. The SL respects the range structure, but the R/R will be limited by the top — to weigh against position size.",
  [TIGHTCONS_WIDE_FR_NEW]:     "≈ Very wide SL, but the R/R is made impossible by the range ceiling. Without expansion, the trade has no profit margin.",
  // V2.2 — wide = correct answer
  [EXTREME_VOL_TIGHT_FR_NEW]:   "✗ Stop in the immediate noise. The 1st retest candle, wide because of the extreme vol, will sweep you in seconds.",
  [EXTREME_VOL_LTT_FR_NEW]:     "✗ 'Standard' stop calibrated for normal vol. With a tripled ATR, this level is statistically in the noise. You'll be swept before the setup has time to play out.",
  [EXTREME_VOL_WIDE_FR_NEW]:    "✓ Margin calibrated on the day's REAL vol (×3 vs normal). It's the only stop that absorbs the expansion without breaking the setup.",
  [NEWS_IMM_TIGHT_FR_NEW]:      "✗ Stop in the immediate noise. The news impact candle will sweep it in seconds.",
  [NEWS_IMM_LTT_FR_NEW]:        "✗ 'Normal' stop unsuited to the news amplitude. An impact candle (×2-3 amplitude) will take you out before the real directional move.",
  [NEWS_IMM_WIDE_FR_NEW]:       "✓ Margin wide enough to absorb the news amplitude. Either this SL, or no trade during the news window.",
  [LIQ_HUNT_TIGHT_FR_NEW]:      "✗ Stop in the immediate noise. Swept by the 1st retest even before the main hunt.",
  [LIQ_HUNT_LTT_FR_NEW]:        "✗ Stop below an obvious swing low = institutional hunting zone. The sweep takes this level systematically before the real reversal.",
  [LIQ_HUNT_WIDE_FR_NEW]:       "✓ Below the hunting zone + ample margin. The sweep can happen, your SL stays out of reach.",
  [MULTI_DEEP_TIGHT_FR_NEW]:    "✗ Stop below the 1st swing low (the highest). The structural pullback goes lower, the SL is in the noise of the unfolding.",
  [MULTI_DEEP_LTT_FR_NEW]:      "✗ Stop below the 2nd swing low. The sequence of lower lows continues to the 3rd. Swept before the real invalidation.",
  [MULTI_DEEP_WIDE_FR_NEW]:     "✓ Below the 3rd swing low (the lowest) + margin. It's the real structural invalidation of the sequence.",
  [FAKEOUT_ZONE_TIGHT_FR_NEW]:  "✗ Stop in the immediate noise. Swept by any retest wick.",
  [FAKEOUT_ZONE_LTT_FR_NEW]:    "✗ Stop above the 2 previous fakeouts, but the 3rd fakeout will statistically exceed this amplitude. Swept.",
  [FAKEOUT_ZONE_WIDE_FR_NEW]:   "✓ Above the maximum foreseeable amplitude of the recurring fakeouts. The 3rd won't touch you.",
  [WEEKLY_OPEN_TIGHT_FR_NEW]:   "✗ Stop in the immediate noise. The Monday open gap sweeps it on the 1st candle.",
  [WEEKLY_OPEN_LTT_FR_NEW]:     "✗ 'Standard' stop unsuited to a weekend gap that can do 2-3× the normal amplitude of a candle.",
  [WEEKLY_OPEN_WIDE_FR_NEW]:    "✓ Wide margin to absorb the open gap's amplitude. The structure holds, so does the SL.",
  [KEY_MAGNET_TIGHT_FR_NEW]:    "✗ Stop in the immediate noise, swept even before the magnetic level is reached.",
  [KEY_MAGNET_LTT_FR_NEW]:      "✗ Stop just above the magnetic level. But the deep test will go lower, the sweep takes this level.",
  [KEY_MAGNET_WIDE_FR_NEW]:     "✓ Beyond the amplitude of the expected test on the magnetic level. The sweep touches the level, your SL stays out of reach.",
  // V2.3 — SELL mirrors
  [LIQ_HUNT_LTT_SELL_FR_NEW]:     "✗ Stop above an obvious swing high = institutional hunting zone. The sweep takes this level systematically before the real reversal.",
  [LIQ_HUNT_WIDE_SELL_FR_NEW]:    "✓ Above the hunting zone + ample margin. The sweep can happen, your SL stays out of reach.",
  [MULTI_DEEP_TIGHT_SELL_FR_NEW]: "✗ Stop above the 1st swing high (the lowest). The structural pullback goes higher, the SL is in the noise of the unfolding.",
  [MULTI_DEEP_LTT_SELL_FR_NEW]:   "✗ Stop above the 2nd swing high. The sequence of higher highs continues to the 3rd. Swept before the real invalidation.",
  [MULTI_DEEP_WIDE_SELL_FR_NEW]:  "✓ Above the 3rd swing high (the highest) + margin. It's the real structural invalidation of the sequence.",
  [KEY_MAGNET_LTT_SELL_FR_NEW]:   "✗ Stop just below the magnetic level. But the deep test will go higher, the sweep takes this level.",
  [KEY_MAGNET_WIDE_SELL_FR_NEW]:  "✓ Beyond the amplitude of the expected test upward. The sweep touches the magnetic level, your SL stays out of reach.",
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
): PlaceStopChart {
  const chart = buildPlaceStopChartFr(setup, seed, volatility, difficulty);
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
  if (score >= 700)              return "Good protection";
  if (score >= 300)              return "Solid read";
  if (score >= 0)                return "To polish";
  if (score >= -200)             return "Too emotional";
  return "You give your SL to the market";
}

// Re-export FR for comparison if needed.
export { FR_TEMPLATES as PLACE_STOP_TEMPLATES_FR };
