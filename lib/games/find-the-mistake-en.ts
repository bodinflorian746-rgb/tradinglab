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
export function buildScenarioChart(template: MistakeTemplate, seed: number, vol: Volatility): ScenarioChart {
  const chart = buildScenarioChartFr(template, seed, vol);
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
    explanation: "The HTF resistance tested several times held at every test. BUY just below = entry at the worst possible location. The R/R ratio becomes atrocious because the TP is capped by the immediate resistance.",
    lessons: {
      beginner:     "You don't buy below a resistance that rejects at every test. You wait for a break or a reversal.",
      intermediate: "Location > pattern. Even a technically good setup turns bad if the entry sits in a hostile zone.",
      advanced:     "An HTF resistance with 3+ touches is an institutional supply zone. The edge is to SHORT the retest, not BUY the pullback into it.",
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
    explanation: "The HTF support held at every test. SELL just above = entry at the worst location. The TP is capped by the immediate support → catastrophic R/R.",
    lessons: {
      beginner:     "You don't sell above a support that bounces. You wait for the support to break OR the bounce off a resistance.",
      intermediate: "Location > pattern. Selling into an HTF demand zone is placing yourself against the edge.",
      advanced:     "An HTF support with 3+ bounces is an institutional demand zone. Edge = BUY the bounce, not SELL the pullback into it.",
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
    explanation: "Bounces in a downtrend are SHORT opportunities, not BUY. Statistically, taking longs against the HTF has a 30-40% win rate; the edge is inverted.",
    lessons: {
      beginner:     "Bearish HTF = you look for SELLs. Never BUYs.",
      intermediate: "A local setup doesn't erase the HTF trend. If the HTF says no, you don't say yes.",
      advanced:     "Trading against the HTF = playing 30-40% odds. No local setup can make up for that statistical gap.",
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
    explanation: "Trading 30 min before major news = spread x3-x5, massive slippage, stop jumped by bid-ask. The setup's technique no longer counts; only execution volatility kills you.",
    lessons: {
      beginner:     "No trades in the 30 min before AND 15 min after major news. Absolute rule.",
      intermediate: "The spread can triple, your SL jumps by bid-ask. The setup's stats no longer apply to an illiquid market.",
      advanced:     "Even with a strong view on the news, execution is your enemy. Position size /3 and stop x2, or NO TRADE.",
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
    explanation: "The swing low will almost always be retested before the continuation. A stop above the low = swept by the normal noise of the retest. The trade would be good with a stop below the swing low.",
    lessons: {
      beginner:     "A stop is placed BEHIND the invalidation with margin, never inside, never on top.",
      intermediate: "The retest of the low is statistically present in 70%+ of pullbacks. The anti-noise margin is mandatory.",
      advanced:     "Without an ATR margin behind the structure, your stop acts as a liquidity magnet. Institutions collect those levels.",
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
    explanation: "In the middle of a range: no tested zone, no signal, no catalyst. The R/R is awful (TP < risk). A range is traded at the edges or on the break.",
    lessons: {
      beginner:     "No signal = no trade. If you can't explain why in 1 sentence, it's NO TRADE.",
      intermediate: "The middle of a range = an invitation to risk 1R for 0.3R reward. Mathematically losing.",
      advanced:     "Discipline > activity. Forcing a trade in the middle = feeding the market makers.",
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
    explanation: "The swing high is an obvious institutional target; that's where the liquidity of trapped shorts sits. A stop placed exactly there = a sweep magnet. Margin mandatory above.",
    lessons: {
      intermediate: "Swing highs/lows are liquidity-hunt zones. Sticking your stop on them = getting hunted.",
      advanced:     "Institutions TARGET those levels to collect the fuel. The logical stop goes beyond the liquidity zone, not inside it.",
      beginner:     "Your stop never sits right on an obvious swing. Always behind the zone with margin.",
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
    explanation: "R/R below 1 = even winning 60% of trades, your expectancy is negative. A valid setup with a bad R/R is still a bad trade.",
    lessons: {
      intermediate: "A setup's expectancy = (win_prob × reward) - (loss_prob × risk). If R/R < 1, you need a win rate > 60% just to break even.",
      advanced:     "The minimum acceptable R/R is 2:1 to absorb fees and drawdown periods. Below that threshold, the statistical edge disappears.",
      beginner:     "If you risk €100 to make €50, you lose in the long run even when you win often.",
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
    explanation: "A break without a momentum candle (small body, just above R) has a ~35% continuation rate. It's often an institutional liquidity bait.",
    lessons: {
      intermediate: "Weak breakout = trap. Wait for either a clear follow-through or a retest that holds.",
      advanced:     "Institutions create weak breakouts to suck in the short stops above R, then push in the HTF direction.",
      beginner:     "A real breakout = a visible strong candle. Otherwise, wait.",
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
    explanation: "Risking 50% of capital on a single trade is suicidal. A single loss cuts the account in half. And to get back to €500, you'll then need +100% on the remaining capital.",
    lessons: {
      advanced:     "The pro risk grid: 0.5 to 2% of capital per trade depending on account size. Beyond 5%, it's no longer trading, it's gambling.",
      intermediate: "Position size is the #1 variable of money management. A correct setup + a lot that's too big = dead account. The rule: on €500, never more than 5% per trade (so €25 max risk).",
      beginner:     "The reference grid: 5% max on a €200-500 account, 3% on €500-1,000, 2% on €1,000-5,000. Your broker's leverage doesn't matter; what counts is how much you lose in euros if your SL is hit.",
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
    explanation: "x4 spread + illiquid session = real R/R halved even if the setup works. The stop jumps by bid-ask, the TP becomes unreachable.",
    lessons: {
      advanced:     "A pro trader always factors execution into their edge. Spread x3+ and dead volume → NO TRADE.",
      intermediate: "Paper R/R ≠ real R/R. The spread eats your edge.",
      beginner:     "Check session + spread before clicking. Dead hours = NO TRADE.",
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
    explanation: "In high vol, the normal noise is 2-3x wider. A 'normal' stop sits inside the amplified noise → swept before the trade plays out.",
    lessons: {
      advanced:     "The stop must adapt to the current ATR, not a fixed distance. In high vol, widen the stop AND the TP proportionally.",
      intermediate: "Doubled volatility = doubled stop. Otherwise your stop becomes a trap.",
      beginner:     "The harder the market moves, the more your stop must breathe.",
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
    explanation: "Buying the top of a pump = exactly what institutions are waiting for. The R/R is terrible (far TP / short stop), a retracement is likely short-term.",
    lessons: {
      intermediate: "Vertical pumps statistically retrace 38-61%. BUY at the top = sell at the bottom.",
      advanced:     "FOMO = a counter-trend signal. The edge is to WAIT for the retracement, not to chase.",
      beginner:     "If you take a trade because 'you're going to miss it', that's precisely the moment NOT to take it.",
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
    explanation: "The setup may be valid, but your decision isn't driven by analysis, it's driven by the urge to recover the losses. It's retail's #1 emotional trap.",
    lessons: {
      intermediate: "After 2 stops, a break is mandatory (15-30 min). A brain in capital drawdown makes biased decisions.",
      advanced:     "The revenge trade has a win rate ~10 points below the same trader's average. The break restores objectivity.",
      beginner:     "If you trade to 'recover', you're no longer trading, you're gambling.",
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
    explanation: "The sweep just happened; it's the bullish reversal signal. SELL here = selling the bottom the institution just created to buy back. The direction is inverted.",
    lessons: {
      advanced:     "Classic ICT pattern: sweep = liquidity grab before HTF continuation. The edge is to BUY the reversal, not SELL.",
      intermediate: "A big wick that sweeps a level then reverses = a likely reversal signal. Inverted read.",
      beginner:     "Don't sell a bottom that just got 'eaten' by a wick. Look for the bounce.",
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
    explanation: "A deep mitigation with no reaction = a dead FVG. Institutional buyers no longer defend the zone. BUY here = praying, not following a signal.",
    lessons: {
      advanced:     "FVG > 75% mitigated with no visible reaction = the zone loses its statistical edge. Either wait for a break to SELL, or NO TRADE.",
      intermediate: "A deeply tested zone loses its power. The 1st or 2nd test = edge; the deep test = a tired zone.",
      beginner:     "If a zone is slow to react, it loses its strength. Better to wait for the next one.",
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
    explanation: "On major news (NFP, FOMC, CPI), the spread can widen x5 to x10, and price can make an instant move that jumps the SL. The pro rule: divide the lot size by 2 or 3 in the 30 minutes around red news, or don't trade at all.",
    lessons: {
      advanced:     "Institutional algos cut their exposure before news for the same reason: price action becomes binary and unpredictable. Keeping a normal size = betting on randomness.",
      intermediate: "Major news can move a pair 50-100 pips in 1 second. Your SL becomes theoretical because slippage takes you out 20-30 pips further. Reducing size protects your account.",
      beginner:     "Before an NFP, an FOMC, or a CPI: you divide your lot by 2 or 3, or you wait for the news to pass. The market will shake, your stops won't hold like usual.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "Lot size identical to a normal trade",
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
    explanation: "On FOMC + Powell, XAU can move $50-100 in a few minutes. Your standard SL will be blown through on slippage. Either you cut the position before the announcement, or you reduce the lot, or you set a very wide SL to absorb the vol.",
    lessons: {
      advanced:     "Institutional risk management requires neutralizing exposure before any event with pricing power. On Powell, even good setups are at the mercy of a misread sentence.",
      intermediate: "A position left exposed through a macro event = a binary bet. The technical setup loses all value against a strong headline. Either you exit, or you accept gambling.",
      beginner:     "Before an FOMC or a central bank press conference: you close your position, or reduce it heavily. The market will move more than your technical calculations predict.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "Position not managed approaching the event",
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
    explanation: "When volatility doubles, your effective risk doubles too at a constant lot size. A $30 SL that held on a $35 ATR will easily get hit on an $80 ATR. Adapting size to vol = a basic principle of risk management.",
    lessons: {
      advanced:     "Dynamic position sizing is computed on the ATR: size = (capital × risk%) / (ATR × SL multiplier). When the ATR doubles, size must be halved to keep the same risk.",
      intermediate: "Good traders adjust their lot to the day's volatility. An ATR 2x above normal = lot halved or SL doubled. Otherwise the real risk gets out of control.",
      beginner:     "When the market moves more than usual, you reduce your lot size. Otherwise your stop gets hit too easily. The rule: size adapted to volatility, not to feeling.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "ATR x2.3 vs average, lot unchanged",
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
    explanation: "Over the weekend, FX markets are closed but the world keeps turning. Major geopolitical news (central bank statement, conflict, election) can create a gap at Sunday's open that jumps your SL by 50 to 200 pips. Weekend slippage is non-negotiable.",
    lessons: {
      advanced:     "Hedge funds generally exit their directional FX positions before the Friday close, or hedge via options. Holding naked exposure over the weekend = betting on geopolitical headlines.",
      intermediate: "Before a weekend, two options: exit your positions, or heavily reduce size. The Sunday opening gap can be brutal and your SL doesn't protect you during the close.",
      beginner:     "Friday evening: you close your positions or reduce their size. Over the weekend, the market is closed but the world moves. Monday morning, price can jump straight to the other side of your stop.",
    },
    difficulties: ["intermediate", "advanced"],
    extraInfo: "Position left open over the weekend",
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
  if (score >= 700)              return "Solid";
  if (score >= 300)              return "Needs polish";
  if (score >= 0)                return "Still some way to go";
  return "Lots to learn";
}

// Re-export FR for comparison if needed.
export { FR_TEMPLATES as MISTAKE_TEMPLATES_FR };
