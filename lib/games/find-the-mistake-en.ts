// Mini-game "FIND THE MISTAKE" (EN translation).
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
  type MistakeId,
  type MistakeCategory,
  type DifficultyLessons,
  type MistakeTemplate,
  type MistakeInstance,
  type ChartShape,
  type ScenarioChart,
  type MistakeScoreResult,
  ROUNDS_PER_SESSION,
  MISTAKE_TEMPLATES as FR_TEMPLATES,
  generateMistakeScenarios as generateMistakeScenariosFr,
  buildScenarioChart as buildScenarioChartFr,
  scoreMistakeChoice,
} from "./find-the-mistake";
import type { MarketCtx } from "./candle-realism";
export { withAssetPrices } from "./find-the-mistake";

// ─── Reexports types / utils ─────────────────────────────────────────────────

export type {
  Asset, Session, Volatility, Spread, HtfBias, MacroContext,
  Candle, ChartZone,
  Difficulty,
  TradeDirection,
  MistakeId,
  MistakeCategory,
  DifficultyLessons,
  MistakeTemplate,
  MistakeInstance,
  ChartShape,
  ScenarioChart,
  MistakeScoreResult,
};

export { ROUNDS_PER_SESSION, scoreMistakeChoice };

// ─── Translation table for zone labels (FR key → EN) ─────────────────────────

const ZONE_LABEL_EN: Record<string, string> = {
  "Swing low":          "Swing low",
  "Swing high":         "Swing high",
  "Résistance HTF":     "HTF resistance",
  "Support HTF":        "HTF support",
  "Résistance":         "Resistance",
  "Support":            "Support",
  "Plafond range":      "Range top",
  "Plancher range":     "Range bottom",
  "Précédent low":      "Previous low",
  "Liquidité balayée":  "Liquidity swept",
  "FVG haussier":       "Bullish FVG",
};

function translateZones(zones: ChartZone[]): ChartZone[] {
  return zones.map((z) => ({ ...z, label: ZONE_LABEL_EN[z.label] ?? z.label }));
}

// Wrapper around buildScenarioChart that translates the zone labels.
export function buildScenarioChart(template: MistakeTemplate, seed: number, vol: Volatility, ctx: MarketCtx = {}): ScenarioChart {
  const chart = buildScenarioChartFr(template, seed, vol, ctx);
  return { ...chart, zones: translateZones(chart.zones) };
}

// ─── EN mistake labels ────────────────────────────────────────────────────────

export const MISTAKE_LABELS: Record<MistakeId, string> = {
  stop_too_tight:              "Stop too tight",
  stop_in_liquidity:           "Stop in liquidity",
  trade_against_htf:           "Trade against HTF",
  trade_before_news:           "Trade before news",
  buy_in_resistance:           "Buy into resistance",
  sell_in_support:             "Sell into support",
  bad_rr:                      "Bad R/R ratio",
  no_confirmation:             "Breakout without confirmation",
  oversized_position:          "Excessive exposure",
  bad_spread:                  "Spread ignored",
  volatility_ignored:          "Volatility ignored",
  fomo_after_pump:             "FOMO entry",
  revenge_trade:               "Revenge trade",
  range_middle:                "Trade without directional bias",
  sweep_ignored:               "Liquidity ignored",
  mitigation_misread:          "Mitigation misread",
  bad_timing:                  "Bad timing",
  ignored_zone:                "HTF zone ignored",
  risk_not_reduced_news:       "Risk not reduced before news",
  position_held_through_event: "Position not managed before event",
  size_not_adapted_to_vol:     "Size not adapted to volatility",
  weekend_gap_exposure:        "Weekend exposure not reduced",
};

// ─── EN templates ─────────────────────────────────────────────────────────────

export const MISTAKE_TEMPLATES_EN: MistakeTemplate[] = [
  {
    id: "buy_in_resistance",
    title: "BUY just below HTF resistance",
    category: "technique",
    chartShape: "approach_resistance",
    direction: "BUY",
    htfBias: "range",
    macroContext: "normal",
    context: "You take this BUY right below an HTF resistance tested several times.",
    correctMistake: "buy_in_resistance",
    decoyMistakes: ["bad_rr", "no_confirmation", "fomo_after_pump"],
    explanation: "Here, the HTF resistance tested several times held at every test. A BUY just below puts the entry at the worst spot: the TP is capped by the immediate resistance, and the R/R becomes very unfavorable.",
    lessons: {
      beginner:     "Buying below a resistance that rejects at every test is rarely a good idea. Waiting for a break or a reversal is often more logical.",
      intermediate: "Location often matters more than the pattern. Even a technically good setup can turn bad if the entry sits in a hostile zone.",
      advanced:     "An HTF resistance touched 3 times or more can signal a solid supply zone. Here, the edge rather lies in a SELL on the retest than in a BUY on the pullback.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "buy_entry",
  },
  {
    id: "sell_in_support",
    title: "SELL just above HTF support",
    category: "technique",
    chartShape: "approach_support",
    direction: "SELL",
    htfBias: "range",
    macroContext: "normal",
    context: "You take this SELL right above an HTF support tested several times.",
    correctMistake: "sell_in_support",
    decoyMistakes: ["bad_rr", "no_confirmation", "fomo_after_pump"],
    explanation: "Here, the HTF support held at every test. A SELL just above puts the entry at the worst spot: the TP is capped by the immediate support, and the R/R becomes very unfavorable.",
    lessons: {
      beginner:     "Selling above a support that keeps bouncing is rarely a good idea. Waiting for the support to break, or for a bounce off resistance, is often more logical.",
      intermediate: "Location often matters more than the pattern. Selling into an HTF demand zone here means positioning against the edge.",
      advanced:     "An HTF support with 3 bounces or more can signal a solid demand zone. Here, the edge rather lies in a BUY on the bounce than in a SELL.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "sell_entry",
  },
  {
    id: "trade_against_htf",
    title: "BUY in an HTF downtrend",
    category: "technique",
    chartShape: "downtrend_pullback",
    direction: "BUY",
    htfBias: "bearish",
    macroContext: "normal",
    context: "Clearly bearish HTF. You take this BUY on a local bounce.",
    correctMistake: "trade_against_htf",
    decoyMistakes: ["bad_timing", "no_confirmation", "fomo_after_pump"],
    explanation: "In a downtrend, bounces rather offer SELL opportunities than BUYs. Buying against the HTF often works less than half the time: the edge is reversed.",
    lessons: {
      beginner:     "With a bearish HTF, you rather look for SELLs, not BUYs.",
      intermediate: "A local setup doesn't erase the HTF trend. If the HTF goes against you, it's often better to stay out.",
      advanced:     "Trading against the HTF often means playing unfavorable odds. A local setup rarely makes up for that statistical gap.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "buy_entry",
  },
  {
    id: "trade_before_news",
    title: "Trade opened just before news",
    category: "timing",
    chartShape: "calm_before_news",
    direction: "BUY",
    htfBias: "range",
    macroContext: "dangereux",
    context: "Major macro news (NFP) in 18 minutes. You open this BUY now.",
    correctMistake: "trade_before_news",
    decoyMistakes: ["bad_timing", "volatility_ignored", "no_confirmation"],
    explanation: "Trading 30 min before major news exposes you to a spread x3 to x5, heavy slippage and a stop that can be hit by the bid-ask. Here, the setup's technique counts for little against execution volatility.",
    lessons: {
      beginner:     "A cautious guide: avoid trading in the 30 min before and the 15 min after major news. Many traders make it a rule in their plan.",
      intermediate: "The spread can triple and your SL can be hit by the bid-ask. The setup's statistics apply poorly to an illiquid market.",
      advanced:     "Even with a strong view on the news, execution works against you. A logical option: cut size by 3 and double the stop, or NO TRADE.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "buy_entry",
  },
  {
    id: "stop_too_tight",
    title: "Stop just above the swing low",
    category: "technique",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "You take this BUY on the pullback with a stop just above the swing low.",
    correctMistake: "stop_too_tight",
    decoyMistakes: ["bad_rr", "trade_against_htf", "fomo_after_pump"],
    explanation: "The swing low is very often retested before the continuation. Here, a stop above the low is likely to be swept by the normal noise of the retest. The trade would hold better with a stop below the swing low.",
    lessons: {
      beginner:     "A stop is rather placed BEHIND the invalidation, with a margin: placing it inside or above exposes it to noise.",
      intermediate: "The low is often retested during a pullback, before the continuation. An anti-noise margin behind the low is therefore a logical option.",
      advanced:     "Without an ATR margin behind the structure, your stop can attract liquidity. These levels are often targeted before the real move.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "buy_with_tight_stop",
  },
  {
    id: "range_middle",
    title: "Trade in the middle of a range",
    category: "discipline",
    chartShape: "range_oscillation",
    direction: "BUY",
    htfBias: "range",
    macroContext: "normal",
    context: "Price oscillates in a range. You take this BUY in the middle.",
    correctMistake: "range_middle",
    decoyMistakes: ["bad_rr", "no_confirmation", "fomo_after_pump"],
    explanation: "Here, in the middle of the range: no tested zone, no signal, no catalyst. The R/R is poor (TP smaller than the risk). A range is rather traded at its edges or on the break.",
    lessons: {
      beginner:     "Without a signal, the trade lacks a reason to exist. If you can't explain it in one sentence, NO TRADE is often the logical option.",
      intermediate: "The middle of a range often means risking 1R for about 0.3R of reward. Over time, that math works against you.",
      advanced:     "Discipline matters more than activity. Forcing a trade in the middle of the range often benefits other participants, not you.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "buy_entry",
  },
  {
    id: "stop_in_liquidity",
    title: "Stop just above the swing high",
    category: "liquidite",
    chartShape: "downtrend_pullback",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "normal",
    context: "You take this SELL on the bounce with a stop just above the swing high.",
    correctMistake: "stop_in_liquidity",
    decoyMistakes: ["stop_too_tight", "bad_rr", "no_confirmation"],
    explanation: "The swing high is an obvious target: that's often where the liquidity of trapped sellers sits. Here, a stop placed right on it may attract a sweep. A margin above is a logical option.",
    lessons: {
      intermediate: "Swing highs and lows are often liquidity-hunt zones. Placing your stop right on them increases the risk of being taken out.",
      advanced:     "These levels are often targeted to collect liquidity. A logical stop rather goes beyond the liquidity zone, not inside it.",
      beginner:     "Avoid placing your stop right on an obvious swing. Behind the zone, with a margin, it often holds better.",
    },
    difficulties: ["intermediate", "advanced"],
    showLines: "sell_with_liquidity_stop",
  },
  {
    id: "bad_rr",
    title: "Valid setup, TP too close",
    category: "rr",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Technically valid setup. Wide stop, very close TP.",
    correctMistake: "bad_rr",
    decoyMistakes: ["stop_too_tight", "trade_against_htf", "fomo_after_pump"],
    explanation: "With an R/R below 1, even 60% winning trades can leave a negative expectancy. A valid setup with a poor R/R remains a questionable trade here.",
    lessons: {
      intermediate: "A setup's expectancy is computed as: (win prob × reward) - (loss prob × risk). With an R/R below 1, you need over 50% wins to break even, and 67% for an R/R of 0.5.",
      advanced:     "Many traders aim for an R/R of at least 2:1: it leaves room for fees and losing streaks. With a lower R/R, you need a higher win rate to stay profitable.",
      beginner:     "If you risk €100 to make €50, you risk losing in the long run, even when you win often.",
    },
    difficulties: ["intermediate", "advanced"],
    showLines: "buy_with_bad_rr",
  },
  {
    id: "weak_breakout",
    title: "BUY on a weak breakout",
    category: "technique",
    chartShape: "weak_breakout",
    direction: "BUY",
    htfBias: "range",
    macroContext: "normal",
    context: "You take this BUY on the resistance break. The strong candle is tiny.",
    correctMistake: "no_confirmation",
    decoyMistakes: ["buy_in_resistance", "bad_rr", "fomo_after_pump"],
    explanation: "A break without a momentum candle (small body, just above resistance) continues much less often. It often serves as liquidity bait.",
    lessons: {
      intermediate: "A weak break can be a trap. A logical option: wait for a clear follow-through or a retest that holds.",
      advanced:     "Weak breakouts often serve to absorb the stops placed above resistance, before a move back in the HTF direction.",
      beginner:     "A real breakout often comes with a visible strong candle. Otherwise, waiting makes sense.",
    },
    difficulties: ["intermediate", "advanced"],
    showLines: "buy_entry",
  },
  {
    id: "oversized_position",
    title: "Position too big for the account",
    category: "execution",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "You take this BUY on XAU/USD. Account capital: €500. Position size chosen: a lot that exposes €250 if the SL is hit. The technical setup is correct.",
    correctMistake: "oversized_position",
    decoyMistakes: ["stop_too_tight", "volatility_ignored", "bad_rr"],
    explanation: "Risking 50% of capital on a single trade is extremely dangerous. A single loss cuts the account in half, and to get back to €500, you would then need +100% on the remaining capital.",
    lessons: {
      advanced:     "A common pro benchmark: 0.5 to 2% of capital per trade depending on account size. Beyond 5%, you drift away from trading and closer to gambling.",
      intermediate: "Position size is a key variable of money management. A correct setup with a lot that's too big can be enough to wipe out an account. The often-quoted benchmark is 1 to 2% of capital, even on a small account.",
      beginner:     "An often-quoted benchmark: 1 to 2% of capital per trade, whatever the account size (so €5 to €10 on €500). Your broker's leverage matters little; what counts is how much you lose in euros if your SL is hit.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "Risk per trade: 50% of capital",
    showLines: "buy_entry",
  },
  {
    id: "bad_spread",
    title: "Trade in a dead session with x4 spread",
    category: "execution",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "You take this BUY at 3am (dead hours). Spread quadrupled.",
    correctMistake: "bad_spread",
    decoyMistakes: ["bad_timing", "volatility_ignored", "trade_against_htf"],
    explanation: "With an x4 spread and an illiquid session, the real R/R can be halved even if the setup works. Here, the stop can be hit by the bid-ask, and the TP becomes hard to reach.",
    lessons: {
      advanced:     "Many pro traders factor execution into their edge. With a spread x3 or more and low volume, NO TRADE is often the logical option.",
      intermediate: "Paper R/R can differ from real R/R: here, the spread eats into your edge.",
      beginner:     "Check the session and spread before clicking. In off-hours, NO TRADE is often the logical option.",
    },
    difficulties: ["advanced"],
    extraInfo: "Spread x4",
    metaOverride: { session: "Heures mortes", spread: "élevé" },
    showLines: "buy_entry",
  },
  {
    id: "volatility_ignored",
    title: "Standard stop in explosive vol",
    category: "execution",
    chartShape: "high_vol_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Explosive volatility on BTC. You take this BUY with a standard-size stop.",
    correctMistake: "volatility_ignored",
    decoyMistakes: ["stop_too_tight", "bad_rr", "oversized_position"],
    explanation: "In high volatility, normal noise can be 2 to 3 times wider. Here, a 'normal' stop sits inside that amplified noise and is likely to be swept before the trade plays out.",
    lessons: {
      advanced:     "The stop works better when it adapts to the current ATR rather than a fixed distance. In high volatility, widening the stop AND the TP proportionally is a logical option.",
      intermediate: "If volatility doubles, a stop twice as wide is often needed. Otherwise, your stop can become a trap.",
      beginner:     "The harder the market moves, the more room your stop needs.",
    },
    difficulties: ["intermediate", "advanced"],
    metaOverride: { volatility: "élevée" },
    showLines: "buy_with_tight_stop",
  },
  {
    id: "fomo_after_pump",
    title: "BUY after a 5% pump",
    category: "psychologique",
    chartShape: "fast_rally",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Price just pumped 5% in 3 candles. You BUY now to not miss out.",
    correctMistake: "fomo_after_pump",
    decoyMistakes: ["bad_rr", "trade_against_htf", "no_confirmation"],
    explanation: "Buying the top of a pump often means entering where others take profits. Here, the R/R is poor (distant TP, short stop) and a retracement is likely in the short term.",
    lessons: {
      intermediate: "Vertical pumps often retrace a good part of the move (38 to 61%). A BUY at the top can quickly end up in a loss.",
      advanced:     "FOMO can signal an excess. Here, the edge rather lies in WAITING for the retracement than chasing price.",
      beginner:     "If you take a trade out of fear of 'missing it', it's often the moment NOT to take it.",
    },
    difficulties: ["beginner", "intermediate", "advanced"],
    showLines: "buy_entry",
  },
  {
    id: "revenge_trade",
    title: "Immediate re-entry after 2 stops",
    category: "psychologique",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "You just took 2 stops in a row. You re-enter immediately on this setup.",
    correctMistake: "revenge_trade",
    decoyMistakes: ["fomo_after_pump", "bad_timing", "stop_too_tight"],
    explanation: "The setup may be valid, but here your decision seems driven by the urge to recover losses rather than by analysis. It's one of the most frequent emotional traps.",
    lessons: {
      intermediate: "After 2 stops, a break (15-30 min) is a logical option. Under the weight of losses, decisions tend to be biased.",
      advanced:     "Revenge trades often perform worse than the same trader's average. A break helps restore objectivity.",
      beginner:     "If you trade to 'recover', you risk gambling rather than trading.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "2 recent stops",
    showLines: "buy_entry",
  },
  {
    id: "sweep_ignored",
    title: "SELL just after a sweep low",
    category: "liquidite",
    chartShape: "sweep_low_done",
    direction: "SELL",
    htfBias: "bullish",
    macroContext: "normal",
    context: "Price just swept the liquidity below the previous low with a big wick. You SELL now.",
    correctMistake: "sweep_ignored",
    decoyMistakes: ["trade_against_htf", "bad_rr", "stop_too_tight"],
    explanation: "Here, the sweep just happened and can signal a bullish reversal. A SELL means selling the low that buyers just used to get in: the read seems inverted.",
    lessons: {
      advanced:     "Classic ICT pattern: the sweep grabs liquidity before the HTF continuation. Here, a BUY on the reversal makes more sense than a SELL.",
      intermediate: "A big wick that sweeps a level and comes back can signal a likely reversal. Here, selling means reading the chart backwards.",
      beginner:     "Avoid selling a low that just got 'eaten' by a wick. Looking for the bounce is often more logical.",
    },
    difficulties: ["advanced"],
    showLines: "sell_entry",
  },
  {
    id: "mitigation_misread",
    title: "BUY on an FVG eaten 85%",
    category: "liquidite",
    chartShape: "fvg_deep_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "normal",
    context: "You BUY on this bullish FVG. The pullback has mitigated 85%+ of the zone with no visible reaction.",
    correctMistake: "mitigation_misread",
    decoyMistakes: ["bad_rr", "stop_too_tight", "trade_against_htf"],
    explanation: "Here, a deep mitigation with no reaction can signal an exhausted FVG: buyers no longer seem to defend the zone. A BUY would mean hoping rather than following a signal.",
    lessons: {
      advanced:     "An FVG mitigated over 75% with no visible reaction often loses its edge. Two logical options: wait for a break to SELL, or NO TRADE.",
      intermediate: "A deeply tested zone often loses strength. The 1st and 2nd tests generally offer more edge than a deep test.",
      beginner:     "If a zone is slow to react, it often loses strength. In this case, it's better to wait for the next one.",
    },
    difficulties: ["advanced"],
    showLines: "buy_entry",
  },
  {
    id: "risk_not_reduced_news",
    title: "Usual lot before major news",
    category: "timing",
    chartShape: "calm_before_news",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "8:20am. NFP in 10 minutes. You enter a BUY on EUR/USD with your usual lot size. The technical setup is correct.",
    correctMistake: "risk_not_reduced_news",
    decoyMistakes: ["stop_too_tight", "oversized_position", "bad_rr"],
    explanation: "On major news (NFP, FOMC, CPI), the spread can widen x5 to x10, and an instant move can jump the SL. A common practice: divide the lot size by 2 or 3 in the 30 minutes around red news, or don't trade.",
    lessons: {
      advanced:     "Many players reduce their exposure before news for this reason: price action can become binary and unpredictable. Keeping a normal size then means betting on chance.",
      intermediate: "Major news can move a pair by several dozen pips within seconds. Your SL becomes theoretical if slippage takes you out several pips further. Reducing size protects your account.",
      beginner:     "Before an NFP, an FOMC or a CPI, a logical option: divide your lot by 2 or 3, or wait for the news to pass. The market can get jumpy, and your stops may not hold as usual.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "NFP at 8:30am · lot 1.00",
    showLines: "buy_entry",
  },
  {
    id: "position_held_through_event",
    title: "Position left open through FOMC",
    category: "timing",
    chartShape: "calm_before_news",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "You've had a BUY open on XAU/USD since 1:55pm. FOMC in 5 minutes (announcement + Powell press conference for 1h). You decide to let it run with your usual lot and SL.",
    correctMistake: "position_held_through_event",
    decoyMistakes: ["stop_too_tight", "oversized_position", "trade_before_news"],
    explanation: "On an FOMC followed by Powell's press conference, XAU can move $50-100 in a few minutes. Your standard SL may be blown through with slippage. Closing the position, reducing the lot or widening the SL a lot are three logical options.",
    lessons: {
      advanced:     "Risk managers often reduce exposure before an event that can move prices. During Powell, even a good setup can be swept away by a misread sentence.",
      intermediate: "A position left open through a macro event becomes a binary bet. Against a strong headline, the technical setup counts for little. Exiting, or knowingly accepting that risk: it's your call, based on your plan.",
      beginner:     "Before an FOMC or a central bank press conference, closing your position or reducing it heavily are two logical options. The market can move far more than your technical calculations predict.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "FOMC at 2:00pm · BUY open since 1:55pm",
    showLines: "buy_entry",
  },
  {
    id: "size_not_adapted_to_vol",
    title: "Usual lot in doubled volatility",
    category: "execution",
    chartShape: "high_vol_pullback",
    direction: "SELL",
    htfBias: "bearish",
    macroContext: "dangereux",
    context: "Daily ATR on XAU/USD at $80 vs $35 usually (volatility x2.3). You take this SELL with your usual lot size and your standard $30 SL.",
    correctMistake: "size_not_adapted_to_vol",
    decoyMistakes: ["stop_too_tight", "oversized_position", "bad_rr"],
    explanation: "When volatility doubles, your effective risk doubles too if the lot size stays the same. A $30 SL that held with a $35 ATR can easily be hit with an $80 ATR. Adapting size to volatility is a basic principle of risk management.",
    lessons: {
      advanced:     "Dynamic position sizing is computed on the ATR: size ≈ (capital × risk %) / (ATR × SL multiplier). When the ATR doubles, halving the size keeps the same risk.",
      intermediate: "Many traders adjust their lot to the day's volatility. With an ATR twice the usual, halving the lot or doubling the SL are two options. Otherwise, the real risk can slip out of your control.",
      beginner:     "When the market moves more than usual, reducing your lot size is a logical option. Otherwise, your stop may get hit too easily. The idea: size adapted to volatility, not to gut feeling.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "ATR $80 (average $35) · lot 1.00 · SL $30",
    showLines: "sell_entry",
  },
  {
    id: "weekend_gap_exposure",
    title: "FX position open before the weekend",
    category: "timing",
    chartShape: "uptrend_pullback",
    direction: "BUY",
    htfBias: "bullish",
    macroContext: "dangereux",
    context: "Friday 4:45pm, forex closes in 15 minutes. You open a BUY on EUR/USD with your usual lot size. The setup is valid.",
    correctMistake: "weekend_gap_exposure",
    decoyMistakes: ["stop_too_tight", "oversized_position", "trade_before_news"],
    explanation: "Over the weekend, FX markets are closed, but the news keeps coming. Major geopolitical news (central bank statement, conflict, election) can create a gap at Sunday's open and jump your SL by several dozen pips, sometimes far more. Weekend slippage is beyond your control.",
    lessons: {
      advanced:     "Some funds reduce their directional FX positions before the Friday close, or hedge via options. Holding unhedged exposure over the weekend means betting on geopolitical headlines.",
      intermediate: "Before a weekend, two logical options: exit your positions, or heavily reduce size. The Sunday opening gap can be brutal, and your SL doesn't protect you while the market is closed.",
      beginner:     "On Friday evening, closing your positions or reducing their size is a logical option. Over the weekend, the market is closed but the world moves. On Monday morning, price can jump straight to the other side of your stop.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "Friday 4:45pm · forex close at 5:00pm",
    showLines: "buy_entry",
  },
];

// Canonical alias so the page can import MISTAKE_TEMPLATES just like in FR.
export const MISTAKE_TEMPLATES = MISTAKE_TEMPLATES_EN;

// ─── generateMistakeScenarios EN ─────────────────────────────────────────────
// Reuse FR logic but remap the text fields to the EN template by id.

export function generateMistakeScenarios(seed: number, difficulty: Difficulty): MistakeInstance[] {
  const frInstances = generateMistakeScenariosFr(seed, difficulty);
  return frInstances.map((inst) => {
    const enTpl = MISTAKE_TEMPLATES_EN.find((t) => t.id === inst.id);
    if (!enTpl) return inst;
    return {
      ...enTpl,
      asset:           inst.asset,
      session:         inst.session,
      volatility:      inst.volatility,
      spread:          inst.spread,
      seed:            inst.seed,
      difficulty:      inst.difficulty,
      shuffledChoices: inst.shuffledChoices,
    };
  });
}

// ─── EN verdicts ──────────────────────────────────────────────────────────────

export const CATEGORY_META: Record<MistakeCategory, { label: string; dotClass: string; textClass: string }> = {
  technique:     { label: "Technical mistake",      dotClass: "bg-blue-400",    textClass: "text-blue-400"    },
  psychologique: { label: "Psychological mistake",  dotClass: "bg-amber-400",   textClass: "text-amber-400"   },
  execution:     { label: "Execution mistake",      dotClass: "bg-violet-400",  textClass: "text-violet-400"  },
  rr:            { label: "R/R mistake",            dotClass: "bg-pink-400",    textClass: "text-pink-400"    },
  timing:        { label: "Timing mistake",         dotClass: "bg-red-400",     textClass: "text-red-400"     },
  liquidite:     { label: "Liquidity mistake",      dotClass: "bg-emerald-400", textClass: "text-emerald-400" },
  discipline:    { label: "Discipline mistake",     dotClass: "bg-zinc-400",    textClass: "text-zinc-400"    },
};

export const DIFFICULTY_META: Record<Difficulty, { label: string; dotClass: string; textClass: string; description: string }> = {
  beginner: {
    label:       "Beginner",
    dotClass:    "bg-emerald-400",
    textClass:   "text-emerald-400",
    description: "Obvious mistakes: clear context, simple traps, strong teaching.",
  },
  intermediate: {
    label:       "Intermediate",
    dotClass:    "bg-blue-400",
    textClass:   "text-blue-400",
    description: "Several plausible mistakes, ambiguous context, you have to interpret.",
  },
  advanced: {
    label:       "Advanced",
    dotClass:    "bg-amber-400",
    textClass:   "text-amber-400",
    description: "Several almost-valid answers, institutional nuance, real doubt.",
  },
};

export function sessionVerdict(score: number, correctCount: number, total: number): string {
  if (correctCount >= total - 1) return "Eagle eye";
  if (score >= 70)               return "Solid";
  if (score >= 30)               return "Needs polish";
  if (score >= 10)               return "Still some way to go";
  return "Lots to learn";
}

// Re-export FR for comparison if needed.
export { FR_TEMPLATES as MISTAKE_TEMPLATES_FR };
