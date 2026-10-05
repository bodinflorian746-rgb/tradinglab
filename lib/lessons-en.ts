// English version of lib/lessons.ts — only the 9 beginner lessons,
// because DebutantLessonView only reads `level === "debutant"`.
//
// Exact structural mirror of LESSONS[0] to allow a clean switch in
// DebutantLessonView depending on the locale. IDs/slugs stay identical so
// that localStorage progress remains compatible.
//
// Native retail-trader English, direct tone, EN terminology kept as-is
// (Long, Short, Buy, Sell, Bid, Ask, Stop Loss, Take Profit, Break Even,
// R/R, FOMO, etc.).

import type { LevelData } from "./lessons";

export const LESSONS_EN: LevelData[] = [
  {
    level: "debutant",
    title: "The Foundations",
    promise: "Understand the markets before risking a single cent.",
    lessons: [

      // ─── Leçon 1 ────────────────────────────────────────────────────────────
      {
        id: "lecon-1",
        slug: "lecon1",
        title: "What is trading?",
        duration: "8 min",
        introduction:
          "Most people who open a trading account lose money in the first 3 months. Not because they lack intelligence. Because they started without understanding what they were really doing.",
        sections: [
          {
            heading: "The principle, in one sentence",
            body: "Trading is betting on the direction of a price. You think it's going up → you buy. You think it's going down → you sell. You're right → you win. You're wrong → you lose. It's that simple, and that's exactly why it's hard.",
            items: [
              "Markets are buyers and sellers agreeing on a price",
              "If buyers are more numerous and more aggressive → the price goes up",
              "If sellers dominate → the price goes down",
              "You can profit in both directions: on the way up as well as on the way down",
            ],
          },
          {
            heading: "Concrete example: profit and loss",
            body: "Case 1, the price moves up in your favor: You buy Bitcoin at $78,000. A few hours later, Bitcoin rises to $81,000. The price has moved $3,000 in favor of your position. You stick to your plan, let the trade breathe, then take your profits. Case 2, the price drops against you: You buy Bitcoin at $78,000. A few hours later, Bitcoin falls to $76,500. The price has dropped $1,500 against your position. Out of fear, you close the position in a panic and take the loss. Trading is about trying to anticipate these price movements. The amount actually won or lost in money then depends on the size of your position. The precise calculation of that size is covered in Lesson 8. The difference between the two cases? It's not the analysis, it's the behavior in the face of a loss.",
            diagram: "trade",
            items: [
              "A winning trade ≠ a good trade (you might have just gotten lucky)",
              "A losing trade ≠ a bad trade (if you followed a solid plan, it's normal)",
              "What counts over the long run: the method and the discipline, not each individual result",
            ],
          },
          {
            heading: "Trading, investing, casino: the 3 are not the same thing",
            body: "Many beginners confuse these three concepts. That confusion costs money.",
            table: {
              headers: ["", "Trading", "Investing", "Casino"],
              rows: [
                ["Duration", "Minutes to weeks", "Months to years", "Seconds"],
                ["Decision", "Technical analysis", "Fundamental analysis", "Pure chance"],
                ["Outcome", "Reproducible", "Reproducible", "Not reproducible"],
                ["Control", "High (SL, TP)", "Medium", "None"],
              ],
            },
          },
          {
            heading: "Common beginner mistakes",
            body: "These mistakes are universal. Almost every new trader makes at least one in the first few weeks.",
            items: [
              "Confusing trading and investing, a trader who 'holds the position because he believes in the project' is no longer a trader, he's an investor",
              "Believing you have to be right often to be profitable, false: a good risk/reward ratio is enough",
              "Following trading tips without understanding why, you can't learn to cook by watching someone else eat",
            ],
          },
        ],
        keyPoints: [
          "Trading = betting on the direction of a price, up or down",
          "You can profit in both directions, when it goes up and when it goes down",
          "Trading ≠ investing ≠ casino, these are three different activities",
          "What counts: the method and the discipline, not the result of each trade",
        ],
        exercise: {
          title: "Observe the markets on TradingView",
          steps: [
            "Go to TradingView.com and create a free account",
            "Search 'EURUSD', the current price is shown at the top left. Write it down.",
            "Wait 10 minutes. Did the price move? In which direction? By how much?",
            "Search 'BTCUSD', compare the speed and amplitude of the moves with EUR/USD",
          ],
        },
        quiz: {
          question: "You buy Bitcoin at $78,000 then sell it at $81,000. Which statement is correct?",
          answers: [
            "The price movement is +$3,000",
            "You automatically make $3,000",
            "You necessarily double your capital",
            "The result depends solely on the final sale price",
          ],
          correct: 0,
          explanation:
            "Trading is based on price variations between the entry and the exit. In this example, Bitcoin goes from $78,000 to $81,000, a movement of +$3,000. However, the amount actually won in money depends on the size of your position. Two traders can take exactly the same move and win very different amounts.",
          answerExplanations: [
            "Correct. The price went from $78,000 to $81,000, a positive variation of $3,000.",
            "Incorrect. $3,000 corresponds to the price movement, not automatically to the real gain in money. The final result also depends on the size of your position.",
            "Incorrect. The price movement doesn't tell you the exact evolution of your capital without knowing the size of the position.",
            "Incorrect. The sale price alone isn't enough. The result depends on the difference between entry and exit, plus the size of your position.",
          ],
        },
      },

      // ─── Leçon 2 ────────────────────────────────────────────────────────────
      {
        id: "lecon-2",
        slug: "lecon2",
        title: "Buy / Sell: Long and Short",
        duration: "9 min",
        introduction:
          "In 2022, Bitcoin lost 70% of its value in a few months. Thousands of people lost everything. Yet some traders profited precisely from that drop. How? By knowing how to sell short. This lesson explains how.",
        sections: [
          {
            heading: "Long = you bet on the upside",
            body: "Going Long (or Buy) means buying an asset hoping its price will rise. You buy now and sell later at a higher price. It's the most intuitive direction, like buying sneakers to resell them for more.",
            items: [
              "Gold is at $4,600. You think it's going to rise. You buy (Long).",
              "Gold rises to $4,720. The price climbed $120: the move goes your way.",
              "Gold drops to $4,510. The price fell $90: the move plays against you.",
              "Long = you want the price to GO UP AFTER you've bought",
            ],
          },
          {
            heading: "Short = you bet on the downside",
            body: "Going Short (or Sell) means selling an asset you don't physically own, hoping to buy it back cheaper later. In practice, your broker handles the mechanics, you simply click 'Sell'. If the price drops, you profit.",
            items: [
              "Gold is at $4,700. You think it's going to drop. You sell (Short).",
              "Gold drops to $4,580. The price fell $120: for a Short, a drop goes your way.",
              "Gold rises to $4,790. The price climbed $90: for a Short, a rise plays against you.",
              "Short = you want the price to GO DOWN after you've sold",
            ],
          },
          {
            heading: "Long vs Short: the comparison",
            body: "The two directions are symmetrical. Only the direction of the profit changes. Risk management works exactly the same in both cases.",
            diagram: "long-short",
            table: {
              headers: ["", "Long (Buy, Purchase)", "Short (Sell, Sale)"],
              rows: [
                ["You win if…", "The price goes up", "The price goes down"],
                ["You lose if…", "The price goes down", "The price goes up"],
                ["Other term", "Bullish", "Bearish"],
                ["MT5 button", "BUY", "SELL"],
              ],
            },
          },
          {
            heading: "Common beginner mistakes",
            body: "These mix-ups happen often. They can cost entire trades taken in the wrong direction.",
            items: [
              "Believing you can only profit when it goes up, the Short exists precisely to take advantage of drops",
              "Confusing 'Sell to close a Long' and 'open a Short', in MT5 both are called Sell but they're not the same thing",
              "Shorting without a Stop Loss, an even more serious mistake than a Long without an SL (explained below)",
              "Looking to Short everything 'because it always drops', markets rise over the long term, the Long is statistically favored",
            ],
          },
          {
            heading: "The fatal mistake",
            body: "Opening a Short without a Stop Loss. An asset that drops has a natural floor: the price can't fall below 0. But an asset that rises has no theoretical ceiling. If you Short and the price explodes upward, your loss can exceed your initial stake. Without an SL, an uncontrolled Short can ruin an entire account in a few hours.",
          },
        ],
        keyPoints: [
          "Long (Buy) = you buy = you profit if the price goes up",
          "Short (Sell) = you sell = you profit if the price goes down",
          "You can profit in both directions, the upside as well as the downside",
          "BUY = Long / SELL = Short in every trading platform",
          "Short without a Stop Loss = potentially unlimited risk, always protect your positions",
        ],
        exercise: {
          title: "Identify Long and Short opportunities on a chart",
          steps: [
            "On TradingView, open BTC/USD on Daily (daily chart)",
            "Spot the last big bullish move on the chart. When did it start? How long did it last?",
            "Spot the last big drop. By what percentage did the price fall?",
            "If you had opened a Short at the start of that drop, how far would the price have moved in your favor?",
          ],
        },
        quiz: {
          question: "Bitcoin is at $78,000. You think it's going to drop to $75,000. Which order do you open?",
          answers: [
            "A Long (Buy), to take advantage of the anticipated drop",
            "A Short (Sell), to take advantage of the anticipated drop",
            "None, you can only profit when the price goes up",
            "A Long and a Short at the same time to cover both directions",
          ],
          correct: 1,
          explanation:
            "To take advantage of an anticipated drop, you open a Short (Sell). You sell at $78,000 and buy back at $75,000. The price dropped $3,000, and that move plays in your favor. The amount actually won in money then depends on the size of your position, that's the subject of Lesson 8.",
          answerExplanations: [
            "Wrong. A Long (Buy) = betting on a RISE. If you think Bitcoin is going to drop and you open a Long, you'll lose when the price falls to $75,000, exactly the opposite of what you wanted.",
            "Correct. A Short (Sell) = betting on a DROP. You sell at $78,000, the price falls to $75,000, you buy back: it dropped $3,000. That's the move the Short seeks to capture, the real gain in money depends on the size of your position (Lesson 8).",
            "Wrong. The Short exists precisely to take advantage of drops. In trading, you can profit in both directions. Limiting yourself to the upside means giving up half the market's opportunities.",
            "Wrong. Opening a Long and a Short simultaneously on the same asset cancels out perfectly, the gains of one offset the losses of the other. You gain nothing, but you pay the fees twice.",
          ],
        },
      },

      // ─── Leçon 3 ────────────────────────────────────────────────────────────
      {
        id: "lecon-3",
        slug: "lecon3",
        title: "Reading a candlestick chart",
        duration: "10 min",
        introduction:
          "A candlestick chart is a picture of the battle between buyers and sellers. Each candle tells you who won, with what strength, and whether there was resistance. Learning to read them means learning to see what most people don't.",
        sections: [
          {
            heading: "Anatomy of a candle: 4 pieces of information in one image",
            body: "Each candle displays exactly 4 data points. Together, they summarize everything that happened during a given period, whether it's 1 minute, 1 hour or 1 day.",
            diagram: "candle",
            items: [
              "Open (O), the price at the start of the period",
              "Close (C), the price at the end of the period",
              "High (H), the highest price reached during the period",
              "Low (L), the lowest price reached during the period",
            ],
          },
          {
            heading: "Concrete example: reading a candle step by step",
            body: "Case 1, green candle (buyers winning): Bitcoin opens at €20,000. It rises up to €20,800. It drops slightly to €19,700. It closes at €20,400. Result: green body from 20,000 to 20,400 (close > open). Upper wick from 20,400 to 20,800 (sellers pushed buyers back from the highs). Lower wick from 20,000 to 19,700 (buyers defended the low prices).\n\nCase 2, red candle (sellers winning): Bitcoin opens at €20,400. Rises to €20,600. Falls to €19,500. Closes at €19,800. Result: red body from 20,400 to 19,800 (close < open). Sellers dominated the period.",
            items: [
              "Green body = buyers won (close > open)",
              "Red body = sellers won (close < open)",
              "Upper wick = an attempt to rise pushed back by sellers",
              "Lower wick = an attempt to drop pushed back by buyers",
            ],
          },
          {
            heading: "Candlestick patterns to know",
            body: "These configurations come up often. They give information, but they're never signals on their own. Their value depends entirely on where they appear.",
            table: {
              headers: ["Pattern", "What it looks like", "What it says"],
              rows: [
                ["Hammer", "Small body at the top, long lower wick", "Sellers failed to push down, buyers defended"],
                ["Shooting star", "Small body at the bottom, long upper wick", "Buyers failed to push up, sellers rejected"],
                ["Doji", "Almost no body, wicks on both sides", "Total indecision, neither buyers nor sellers win"],
                ["Bullish engulfing", "Large green candle that swallows the previous red one", "Buyers took control decisively"],
                ["Bearish engulfing", "Large red candle that swallows the previous green one", "Sellers took control decisively"],
              ],
            },
          },
          {
            heading: "Common beginner mistakes",
            body: "These reading mistakes are costly. Knowing how to name patterns isn't enough, you also have to know when they matter.",
            items: [
              "Entering a trade just because a candle 'looks like' a hammer, without checking whether it's on an important level",
              "Confusing the color of a candle with a trade signal: a red candle doesn't mean 'sell now'",
              "Analyzing a single candle: it's always the sequence of candles that tells the story, not an isolated candle",
              "Ignoring the wicks: a green candle with a very long upper wick isn't necessarily a strong bullish signal",
            ],
          },
          {
            heading: "The fatal mistake",
            body: "Entering a trade just because a candle pattern looks interesting, without looking at the overall trend and without the candle being on a key level. A hammer in the middle of nowhere means nothing. A hammer on a major support, within an uptrend, that's when it becomes relevant.",
          },
        ],
        keyPoints: [
          "Each candle = 4 data points: Open, High, Low, Close",
          "Green body = buyers winning. Red body = sellers winning.",
          "The wicks = failed attempts, they show the resistance of the opposing side",
          "Doji = indecision. Hammer = rejection of low prices. Engulfing = clear takeover.",
          "A candle pattern alone means nothing, the context (zone, trend) gives it value",
        ],
        exercise: {
          title: "Read candles on a real chart",
          steps: [
            "On TradingView, open EUR/USD on the Daily timeframe",
            "Find a green candle with a long upper wick — what happened in the following days?",
            "Find a Doji — did the market pick a clear direction in the following candles?",
            "Identify an Engulfing (a large candle that swallows the previous one) — what impact did it have on what followed?",
          ],
        },
        quiz: {
          question: "You see a red candle with a very long lower wick. What does this indicate most precisely?",
          answers: [
            "The market is strongly bearish and will keep dropping",
            "Sellers dominated the period, but buyers defended the low prices strongly",
            "The candle's close happened at the lowest level of the period",
            "It's an immediate buy signal, enter now",
          ],
          correct: 1,
          explanation:
            "Red body = sellers won the period (close < open). Long lower wick = the price fell very low, but buyers pushed back that drop before the close. It's a sign of buying resistance, not total seller dominance.",
          answerExplanations: [
            "Wrong. The long lower wick proves the opposite of total seller dominance. If sellers had controlled everything, there would be no lower wick, the close would have been at the low. The lower wick shows that buyers reacted strongly.",
            "Correct. Red body = sellers winning over the period. Long lower wick = buyers pushed prices back up from the lows with strength. It's not crushing seller dominance, there was a fight and visible resistance.",
            "Wrong. If the close were at the low, the lower wick would be nonexistent. Here, the long lower wick proves the price went very low AND THEN came back up before closing, so the close is above the low.",
            "Wrong. No isolated candle is a sufficient buy or sell signal. For this candle to be a signal, it would have to be on an important support level, in a favorable trend context. On its own, it indicates nothing actionable.",
          ],
        },
      },

      // ─── Leçon 4 ────────────────────────────────────────────────────────────
      {
        id: "lecon-4",
        slug: "lecon4",
        title: "Spread, Bid and Ask",
        duration: "8 min",
        introduction:
          "You analyze the market perfectly. You enter at the right moment. And yet, you're already in the red from the very first second, without the price having moved. It's not a mistake. It's the spread. And every trader pays it, on every trade, without exception.",
        sections: [
          {
            heading: "Bid and Ask: two prices at all times",
            body: "On any market, there are always two prices displayed at the same time. It's not a bug, it's the normal functioning of the market. The Bid is the price at which you can sell. The Ask is the price at which you can buy. The Ask is always slightly higher than the Bid.",
            diagram: "spread",
            items: [
              "BID = selling price (the lower of the two)",
              "ASK = buying price (the higher of the two)",
              "Example: EUR/USD shows Bid = 1.0800 / Ask = 1.0804",
              "If you buy now → you pay 1.0804. If you sell now → you receive 1.0800.",
            ],
          },
          {
            heading: "Concrete example: profit and loss with the spread",
            body: "Case 1, you profit despite the spread: You buy EUR/USD at the Ask (1.0804). The price rises to 1.0870. You sell at the Bid (1.0866). You make 1.0866 - 1.0804 = 62 euros for 1 euro per point. The spread reduced your gain by 4 euros, but you're still solidly positive.\n\nCase 2, the spread becomes a problem: You buy at 1.0804. The price only rises 2 points to 1.0806. You sell at the Bid: 1.0802. You lose 2 euros despite a move in your direction. The 4-point spread erased your gain and put you in a loss.",
            items: [
              "The spread is paid on ENTRY, not on exit",
              "You start every trade in the red by the amount of the spread",
              "For EUR/USD with a 4-point spread: your trade has to gain more than 4 points to be profitable",
              "On small targets, the spread represents a significant share of the gain you're aiming for",
            ],
          },
          {
            heading: "The spread varies with conditions",
            body: "The spread isn't fixed. It depends on market liquidity, how many buyers and sellers are active at that moment. The more activity, the tighter the spread.\n\nBeyond liquidity, brokers and intermediaries often add their own margin to the spread: it's one of their sources of revenue. A wider spread means a higher cost of entry for you.",
            table: {
              headers: ["Situation", "Typical spread", "Impact"],
              rows: [
                ["EUR/USD during peak hours (9am–5pm)", "1–2 points", "Low cost of entry"],
                ["EUR/USD at night (10pm–6am)", "4–8 points", "Higher cost"],
                ["Cryptos on the weekend", "Very variable", "Can be very costly"],
                ["Exotic pairs (USD/TRY…)", "20–100 points", "Dangerous for small targets"],
              ],
            },
          },
          {
            heading: "Common beginner mistakes",
            body: "These spread-related mistakes often go unnoticed, until you realize why the account is going down even on trades 'in the right direction'.",
            items: [
              "Trading high-spread assets (exotic pairs, crypto on the weekend) without checking the cost",
              "Wanting to make 5 euros on a trade with a 4-euro spread, the break-even threshold is nearly impossible to reach",
              "Trading during dead hours or at night without knowing the spread widens",
              "Choosing a broker based on advertising alone without comparing spreads, 1 point of difference × 100 trades = real impact on your results",
            ],
          },
          {
            heading: "The fatal mistake",
            body: "Trading a high-spread asset with a profit target smaller than the spread. If your spread is 20 points and you're aiming for a 15-point gain, you're in a loss before the market even moves. Always calculate the spread before choosing your target.",
          },
        ],
        keyPoints: [
          "Bid = selling price. Ask = buying price. The Ask is always higher.",
          "Spread = Ask − Bid = the cost paid on every trade, from the moment you open",
          "You start every trade in the red by the amount of the spread",
          "The spread is lower during high-activity hours (London 8am–10am, New York 2pm–5pm)",
          "Your profit target must always be greater than the spread, otherwise the trade is a loser from the start",
        ],
        exercise: {
          title: "Observe the spread in real conditions",
          steps: [
            "On TradingView, open EUR/USD. Look for the option to display Bid and Ask prices (chart settings).",
            "Note the difference between Bid and Ask at 10am on a weekday, that's the spread at that moment.",
            "Check that spread again at 11pm or on a Sunday — is it wider or tighter?",
            "Open an exotic pair like USD/MXN and compare its spread with that of EUR/USD.",
          ],
        },
        quiz: {
          question: "EUR/USD: Bid = 1.0800, Ask = 1.0805. You open a buy (Long). At what price does your trade execute, and how far in the red are you at the start?",
          answers: [
            "At 1.0800, you start at break-even, zero spread",
            "At 1.0802, you're 2 points in the red",
            "At 1.0805, you're 5 points in the red immediately",
            "The price depends on the size of your position",
          ],
          correct: 2,
          explanation:
            "A buy always executes at the Ask = 1.0805. The spread = Ask - Bid = 1.0805 - 1.0800 = 5 points. If you close immediately, you sell at the Bid = 1.0800. You lose 5 points: that's the trade's cost of entry.",
          answerExplanations: [
            "Wrong. The Bid (1.0800) is the price at which you SELL, not the one at which you buy. On a buy, your order executes at the Ask (1.0805). So you start with a 5-point deficit, not at break-even.",
            "Wrong. There's no 'average price' between Bid and Ask for a market order. The market is binary: you buy at the Ask or sell at the Bid. Here, the buy executes at the Ask = 1.0805, and the spread is 5 points.",
            "Correct. A Long executes at the Ask = 1.0805. Spread = 1.0805 - 1.0800 = 5 points. If you close immediately, you sell at the Bid = 1.0800. Loss = 5 points. That's the cost of entry you pay on every trade.",
            "Wrong. The execution price is always the Ask for a buy, regardless of the size of the position. Position size affects the amount in euros won or lost per point, not the price at which the order executes.",
          ],
        },
      },

      // ─── Leçon 5 ────────────────────────────────────────────────────────────
      {
        id: "lecon-5",
        slug: "lecon5",
        title: "The Stop Loss",
        duration: "10 min",
        introduction:
          "Without a Stop Loss, a single trade can ruin months of work in a few minutes. Not because you analyze badly, but because the market can go much further than you imagine, and nothing stops you. The Stop Loss is the most important rule in trading.",
        sections: [
          {
            heading: "What is a Stop Loss?",
            body: "A Stop Loss (SL) is an automatic order that closes your trade if the price goes too far in the wrong direction. You set it before entering the trade. When the price reaches it, your position closes on its own, whether you're in front of the screen or not.\n\nThe real role of the Stop Loss: it marks the invalidation of your theory, the exact point where you tell yourself «here, I no longer take the trade». Without that level, no R/R, no winrate, no measurable risk. In the long run, it's what protects your capital.",
            items: [
              "Long trade (buy): your SL is placed BELOW your entry price",
              "Short trade (sell): your SL is placed ABOVE your entry price",
              "When the price reaches the SL, the trade closes automatically",
              "You lose exactly the amount planned, not a single euro more",
            ],
          },
          {
            heading: "Concrete example: with and without a Stop Loss",
            body: "Case 1, with a Stop Loss: You buy Bitcoin at €30,000. You place an SL at €28,500. The market falls to €28,500. Your SL triggers. You lose €1,500 per Bitcoin. You still have 98.5% of your capital. You keep trading.\n\nCase 2, without a Stop Loss: You buy Bitcoin at €30,000. No SL. Overnight, bad news makes Bitcoin crash to €22,000. You wake up with a loss of €8,000 per Bitcoin, 27% of your capital gone in one night. Without you being able to react.",
            diagram: "stoploss",
            items: [
              "With an SL: the loss is limited and known in advance",
              "Without an SL: the loss can be unlimited, the market doesn't wait for you to be ready",
              "Traders without an SL always think 'the price will come back', sometimes yes, sometimes no. And the 'no' destroys the account.",
            ],
          },
          {
            heading: "Where to place your Stop Loss?",
            body: "A good SL isn't placed at random. It's placed at a logical spot on the chart, where your analysis would clearly be wrong if the price reached it.",
            items: [
              "Long: SL just below the last significant low point (the support)",
              "Short: SL just above the last significant high point (the resistance)",
              "Example: you buy on the bounce off a support at €30,000. The last low point is at €29,200. Your SL goes to €29,100.",
              "Rule: if the price reaches my SL, my analysis was wrong. The loss is normal.",
            ],
          },
          {
            heading: "Common beginner mistakes",
            body: "These Stop Loss mistakes are the most destructive in trading. They sometimes act silently, until the day they destroy the account.",
            items: [
              "Not setting an SL 'to give the trade a chance', it's the #1 cause of destroyed accounts among beginners",
              "SL too tight: 3 euros of SL on Bitcoin, the market normally fluctuates 100-200 euros, you'll be taken out for no reason",
              "SL placed at random ('50 euros because it feels right'), the SL must correspond to a logical level on the chart",
              "Forgetting to place the SL when entering, thinking 'I'll set it right after', and never setting it",
            ],
          },
          {
            heading: "The fatal mistake",
            body: "Moving the Stop Loss in the wrong direction to avoid being stopped out. Your trade is losing, you're at -€500. You move the SL away to 'give it a chance'. The trade keeps losing. You move it further. In the end, you lose 5 or 10 times more than you had planned. This mistake, made under emotion, is responsible for the destruction of thousands of beginner trader accounts.",
          },
        ],
        keyPoints: [
          "Stop Loss = automatic order that limits your loss to an amount defined in advance",
          "Long: SL below the entry. Short: SL above the entry.",
          "Without an SL, your loss is potentially unlimited, that's an unacceptable risk",
          "Place the SL at a logical spot on the chart, not at random",
          "NEVER move the SL in the direction of the loss, that's the fatal mistake",
        ],
        exercise: {
          title: "Identify logical Stop Loss placements",
          steps: [
            "On TradingView, open Bitcoin (BTC/USD) on H1",
            "Spot the last bullish move. Identify the last low point before that rise.",
            "If you bought at the current price, your SL would go just below that low point. Note the exact price.",
            "Calculate the difference in euros between that SL and the current price. That's the maximum risk of this trade.",
          ],
        },
        quiz: {
          question: "You buy Bitcoin at €30,000. The last low point on the chart is at €29,000. Where do you place your Stop Loss?",
          answers: [
            "At €31,000, above the entry so as not to lose money",
            "At €29,950, just €50 below the entry, to minimize the loss",
            "At €28,900, just below the logical low point, where your analysis would be wrong",
            "No Stop Loss. Bitcoin always ends up going back up",
          ],
          correct: 2,
          explanation:
            "A Long's SL goes below the entry, at a logical level. The last low point at €29,000 is the level that invalidates your bullish scenario. By placing the SL at €28,900 (just below), if the price gets there, your analysis was wrong. The loss = €1,100 per Bitcoin, known and accepted in advance.",
          answerExplanations: [
            "Wrong. An SL above the entry on a Long closes the position when the price goes up, when you're winning. That's completely backwards. A Long's SL always goes BELOW the entry to protect you from a drop.",
            "Wrong. €50 of SL on Bitcoin is way too tight. Bitcoin normally fluctuates hundreds of euros per hour. You'll be taken out automatically by the simple noise of the market, before the trade can even develop.",
            "Correct. The logical SL is placed just below the level that invalidates your analysis. The low point at €29,000 is that level. At €28,900, if the price gets there, the bullish structure is broken, you were wrong. The loss is €1,100: defined and accepted from the start.",
            "Wrong. 'Bitcoin always ends up going back up' is true over 10 years, but on a position open without an SL, a 30% drop can happen in a few days. Without an SL, a 30% loss on a position = potentially all the capital committed. An SL doesn't prevent the bounce, it limits the loss if the bounce takes too long.",
          ],
        },
      },

      // ─── Leçon 6 ────────────────────────────────────────────────────────────
      {
        id: "lecon-6",
        slug: "lecon6",
        title: "The Take Profit",
        duration: "9 min",
        introduction:
          "You're in a trade, you're in profit, and you watch. The price rises more. You hold. It drops. You hold more 'because it's going to go back up'. It keeps dropping and erases all your gain. It's one of the most frustrating scenarios in trading. The Take Profit avoids it.",
        sections: [
          {
            heading: "The principle, in one sentence",
            body: "A Take Profit (TP) is an automatic order that closes your trade as soon as the price reaches the target you've set. You define that target before entering, the broker executes on its own when the price gets there, whether you're in front of the screen or not.\n\nConversely, the Take Profit marks the validation of your theory: the level where your scenario has played out. It's not an amount you want to reach at all costs, nor a profit you impose on yourself, it's the point where the reason for your trade is confirmed.",
            diagram: "takeprofit",
            items: [
              "Long: your TP is placed ABOVE your entry price",
              "Short: your TP is placed BELOW your entry price",
              "Example: you buy Bitcoin at $78,000. You place a TP at $84,000.",
              "When Bitcoin touches $84,000, the trade closes on its own at your target, the price will have moved $6,000 in your favor",
            ],
          },
          {
            heading: "Concrete example: with and without a Take Profit",
            body: "Case 1, with a Take Profit: You buy Bitcoin at $78,000. You place a TP at $84,000. The price rises up to $84,000. The trade closes automatically at your target: the price moved $6,000 in your favor. Even if the price drops afterward to $73,000, your exit is already done, the move is secured.\n\nCase 2, without a Take Profit: You buy Bitcoin at $78,000. The price rises to $84,000. You watch and you hold 'because it's still going up'. The price drops to $75,000. You panic and you close. At that instant, the price is back $3,000 BELOW your entry, whereas it had been $6,000 ABOVE.",
            items: [
              "With a TP: your exit triggers automatically at the target, without emotion",
              "Without a TP: emotion decides when to exit, almost always at the wrong moment",
              "Without a TP, a price that was $6,000 above your entry can drop back below it",
            ],
          },
          {
            heading: "The Risk / Reward ratio (R/R)",
            body: "The R/R compares two distances: the one separating your entry from your Stop Loss (the risk), and the one separating your entry from your Take Profit (the target). It's a ratio, it doesn't depend on the size of your position. It's the most important metric in risk management: it determines whether your strategy is profitable over the long run, independently of your winrate.",
            table: {
              headers: ["R/R ratio", "Concrete example", "What it allows"],
              rows: [
                ["1:1", "Stop at $3,000, target at $3,000", "You have to win 1 trade out of 2 to be profitable"],
                ["1:2", "Stop at $3,000, target at $6,000", "You can lose 2 trades out of 3 and stay positive"],
                ["1:3", "Stop at $3,000, target at $9,000", "You can lose 3 trades out of 4 and stay positive"],
              ],
            },
          },
          {
            heading: "Common beginner mistakes",
            body: "These Take Profit mistakes turn winning trades into break-even or losing ones.",
            items: [
              "Closing the trade too early out of fear: the price only moved $1,500 in your favor, you close. Then it moves $4,500.",
              "TP too ambitious: aiming for a 1:10 R/R on every trade, the TP is almost never reached.",
              "Having no TP at all: 'I'll see when to exit.' Result: a winning position that becomes a losing one.",
              "Moving the TP along the way: the price approaches the TP, you move it further 'because it's going up nicely'. Emotion takes back control.",
            ],
          },
          {
            heading: "The fatal mistake",
            body: "Having no Take Profit and leaving a winning position open indefinitely. The market never goes up in a straight line. Without a TP, you watch the price erode from its high: it was $6,000 above your entry, then $4,500, then $2,500, then $800. You wait for the bounce. The bounce doesn't come. The price drops back $3,000 below your entry. A trade that was excellent becomes a loser, solely because there was no order to lock in the exit at the right level.",
          },
        ],
        keyPoints: [
          "Take Profit = automatic order that closes your trade when the price reaches your target",
          "Long: TP above the entry. Short: TP below the entry.",
          "Place the TP just BEFORE the next resistance (Long) or the next support (Short)",
          "Minimum recommended R/R ratio: 1:2, your target is 2 times further from your entry than your Stop Loss",
          "Define your TP before entering the trade, never along the way under emotion",
        ],
        exercise: {
          title: "Calculate a Take Profit with a good R/R ratio",
          steps: [
            "On TradingView, open Bitcoin (BTC/USD) on H1. Note the current price.",
            "Identify the next resistance above the current price, note that level.",
            "Imagine a Long entry at the current price with an SL placed $3,000 below. For a 1:2 R/R, your TP must be $6,000 above (2 times the stop distance).",
            "Is the next resistance you identified beyond that TP? If so, the setup has good potential.",
          ],
        },
        quiz: {
          question: "You buy Bitcoin at $78,000. Your Stop Loss is at $75,000, that's $3,000 below your entry. For a 1:2 R/R ratio, where do you place your Take Profit?",
          answers: [
            "At $79,500, the target is at $1,500, the stop at $3,000",
            "At $81,000, target and stop at the same distance (1:1 ratio)",
            "At $84,000, the target is at $6,000, which is 2 times the stop distance",
            "The highest possible to maximize the gain",
          ],
          correct: 2,
          explanation:
            "1:2 ratio = your target is 2 times further than your stop. The Stop Loss is $3,000 below the entry; the Take Profit must therefore be $6,000 above: 78,000 + 6,000 = $84,000. The gain or loss in money then depends on the size of your position (see Lesson 8), but the ratio stays 1:2 regardless of that size. With this ratio, you can lose 2 trades out of 3 and stay profitable over the long run.",
          answerExplanations: [
            "Wrong. A target at $1,500 for a stop at $3,000 is a 1:0.5 ratio: your target is 2 times closer than your stop. Even with 70% winning trades, a strategy with that ratio loses over the long run.",
            "Wrong. Target and stop at the same distance = 1:1 ratio. It's not enough: you'd have to win more than one trade out of two to be profitable, hard to sustain over time.",
            "Correct. A target at $6,000 for a stop at $3,000 = 1:2 ratio. It's the minimum recommended for a healthy strategy: with this ratio, 34% winning trades is enough to be in overall profit.",
            "Wrong. Aiming for 'the highest possible' with no defined level is trading without a plan. A TP that's too far is almost never reached, you watch the price rise, touch your zone, then drop without your exit having triggered.",
          ],
        },
      },

      // ─── Leçon 7 ────────────────────────────────────────────────────────────
      {
        id: "lecon-7",
        slug: "lecon7",
        title: "The Break Even",
        duration: "8 min",
        introduction:
          "You're in a trade, the price has moved a good distance in your favor, you relax. The market makes a correction, comes back, and erases all your advance. The trade closes on your initial Stop Loss, you exit in a loss when the price was widely in your favor shortly before. It's avoidable. That's what the Break Even corrects.",
        sections: [
          {
            heading: "The principle, in one sentence",
            body: "The Break Even (BE) means moving your Stop Loss to your exact entry price. If the price comes back, you exit at zero, neither gain nor loss. If the price keeps going your way, you stay in the running. Your trade can no longer end in a loss.",
            diagram: "breakeven",
            items: [
              "You buy Bitcoin at $78,000 with an initial SL at $75,000",
              "Bitcoin rises to $81,000, the price moved $3,000 in your favor, which is the exact distance of your risk (1R)",
              "You move your SL from $75,000 to $78,000 (your entry price), that's the Break Even",
              "Now: if Bitcoin drops back to $78,000, you exit at zero. If it keeps rising, you stay in the running.",
            ],
          },
          {
            heading: "Concrete example: with and without a Break Even",
            body: "Case 1, with a Break Even: You buy Bitcoin at $78,000, SL at $75,000. The price rises to $81,000, it moved $3,000 in your favor, which is 1R. You activate the BE (SL → $78,000). The market makes a correction and drops back to $78,000. Automatic exit: you exit exactly at your entry price, neither gain nor loss. And if the price had continued up to $84,000, you'd have stayed in the running for a $6,000 move in your favor.\n\nCase 2, without a Break Even: Same trade. Bitcoin rises to $81,000. You touch nothing. The market drops brutally to $73,500. Your original SL at $75,000 triggers, the price ends $3,000 BELOW your entry, when it had been $3,000 ABOVE.",
            items: [
              "With a BE: the trade can no longer end in a loss once activated",
              "Without a BE: a price that was $3,000 above your entry can drop back $3,000 below",
              "The BE frees you from stress, you can wait for your TP calmly",
            ],
          },
          {
            heading: "When to activate the Break Even?",
            body: "Timing is crucial. Too early, the market takes you out on a simple normal fluctuation. At the right moment, the BE really protects you. The rule: wait until the price has moved at least 1R in your favor, that is the distance separating your entry from your Stop Loss.\n\nLeave a small margin before moving to break-even: if you place your stop exactly at your entry price, fees and the spread can take you out at a slight loss. We move to break-even when we estimate that the price can reverse and invalidate our theory at our entry point.",
            table: {
              headers: ["Entry → SL distance", "Activate the BE when…", "Why"],
              rows: [
                ["$2,000", "the price moved $2,000 in your favor", "1R reached, protection becomes logical"],
                ["$3,000", "the price moved $3,000 in your favor", "Before that, a normal fluctuation would take you out"],
                ["No matter", "the price hasn't moved 1R yet → wait", "Too early: the market fluctuates, you'd exit for no reason"],
              ],
            },
          },
          {
            heading: "Common beginner mistakes",
            body: "These Break Even mistakes cause you to miss winning trades or create a false sense of security.",
            items: [
              "Activating the BE too early: the price only moved $200 in your favor while your risk is $3,000, the slightest fluctuation takes you out at zero",
              "Never activating the BE: you suffer complete reversals on trades that were widely winning",
              "Confusing the BE with partial profit taking: the BE = securing the risk (zero loss), not pocketing a gain",
              "Believing the BE guarantees a profit: no, the BE guarantees zero loss. The profit always depends on the TP.",
            ],
          },
          {
            heading: "The fatal mistake",
            body: "Activating the Break Even too early under stress. The price only moved $800 in your favor, while your risk (entry → SL distance) is $3,000. You panic at the idea of losing it all again. You move your SL to your entry price. The market fluctuates normally, briefly drops back below your entry, triggers your BE, you exit at zero. Then, the price rises $6,000. You watch the trade do exactly what you had planned, without you. Impatience took you out of a winning trade.",
          },
        ],
        keyPoints: [
          "Break Even = moving the Stop Loss to the entry price → no more risk of loss",
          "Activate the BE when the price has moved at least 1R in your favor, 1R = the distance between your entry and your Stop Loss",
          "Too early = the market takes you out on a simple normal fluctuation",
          "A trade at BE can exit at zero or keep winning, never lose",
          "The BE doesn't replace a good TP, it's an additional protection",
        ],
        exercise: {
          title: "Simulate the Break Even on historical trades",
          steps: [
            "On TradingView, open Bitcoin (BTC/USD) on H1. Spot a Long trade you could have opened 2 weeks ago.",
            "Note the entry and the logical SL (just below the last low point). Measure the distance between the two: that's your 1R.",
            "At what moment had the price moved +1R in your favor (the distance you just measured)? Note that level, that's where you'd have activated the BE.",
            "What would the BE activated at that moment have given: exit at zero or continuation in profit?",
          ],
        },
        quiz: {
          question: "You buy Bitcoin at $78,000 with an SL at $75,000. The price rises to $81,000. What do you do?",
          answers: [
            "You activate the Break Even: you move your SL from $75,000 to $78,000",
            "You keep the SL at $75,000, you should never move an SL",
            "You close the trade at $81,000 right away, to no longer risk anything",
            "You move the SL to $78,900 to lock in part of the move",
          ],
          correct: 0,
          explanation:
            "At $81,000, the price moved $3,000 in your favor, exactly the distance between your entry and your SL, which is 1R. It's the right moment to activate the BE: you move the SL from $75,000 to $78,000. From there, the trade can no longer end in a loss, and if the price keeps going toward your TP, you stay in the running. The amount in money, though, depends on the size of your position (see Lesson 8).",
          answerExplanations: [
            "Correct. The price moved $3,000 in your favor = exactly 1R (the entry → SL distance). You move the SL from $75,000 to $78,000. The trade can no longer end in a loss: if the price comes back to $78,000, exit at zero; if it keeps rising, you stay in the running.",
            "Wrong. It's perfectly valid, and even recommended, to move the SL in the favorable direction. The rule is to never move the SL in the direction of the LOSS. Here, you move it toward your entry price to protect yourself.",
            "Wrong. Closing at $81,000 locks in the move already gained, but you give up a possible extension toward $84,000 or more. Activating the BE lets you stay in the trade with no more risk of loss, often the best choice.",
            "Wrong. Moving the SL to $78,900 ($900 above the entry) is a technique called a 'partial trailing stop'. It's different from the standard Break Even, which places the SL exactly at the entry price. The risk here: getting taken out on a simple normal fluctuation of $900.",
          ],
        },
      },

      // ─── Leçon 8 ────────────────────────────────────────────────────────────
      {
        id: "lecon-8",
        slug: "lecon8",
        title: "Risk management: money management",
        duration: "12 min",
        introduction:
          "A single trade can ruin entire weeks of work. Not because the analysis was bad, but because the risk was too high. But risk adapted to what capital? Most guides talk about '1% per trade' for accounts of €5,000+. If you're starting with €300 or €700, you need a different grid.",
        sections: [
          {
            heading: "What nobody tells you about the '1%'",
            body: "Money management is what separates traders who survive from those who burn their account in 2 months. The golden rule: NEVER risk more than your capital allows. The theoretical '1% per trade' rule is made for accounts of €5,000+. Below that, 1% = 2 to 10 euros of risk, an amount often lower than the minimum risk generated by the lots available on the major pairs.",
            items: [
              "Minimum lots on Forex often generate 10 to 20 euros of risk even with a tight Stop Loss",
              "Capital of €300 → 1% = €3 max risk. Inapplicable with standard lots.",
              "The solution: adapt your risk % to your capital bracket, not apply a generic rule",
              "The risk = the amount you lose if your Stop Loss triggers",
            ],
          },
          {
            heading: "The grid adapted to retail",
            body: "Here's the reference grid: adapt your risk per trade to your real capital. The % drops as the capital rises, because you have more to protect.",
            table: {
              headers: ["Starting capital", "Risk per trade", "Concrete example"],
              rows: [
                ["€200 – 500", "5%", "€10 – 25 max per trade"],
                ["€500 – 1,000", "3%", "€15 – 30 max per trade"],
                ["€1,000 – 5,000", "2%", "€20 – 100 max per trade"],
                ["€5,000 and up", "0.5 – 2%", "€25 – 100+ per trade"],
              ],
            },
            note: "The 1% rule you'll read everywhere is technically correct for €5,000+ accounts. On a small account (€200–1,000), 1% = 2 to 10 euros of risk, often inapplicable in practice because the minimum lot already generates more. Adapting your % isn't cheating: it's aligning with the reality of the lots available.",
          },
          {
            heading: "The numbers in practice",
            body: "Here's how to calculate your max risk with the grid:",
            items: [
              "Capital €300, ideal 3% (€9), max 5% (€15) per trade",
              "Capital €500, ideal 2-3% (€12-15), max 5% (€25) per trade",
              "Capital €1,000, ideal 2-3% (€20-30), max 3% (€30) per trade",
              "Capital €2,000, 2% (€40) per trade (ideal = max)",
            ],
            diagram: "risk",
          },
          {
            heading: "Why over-risking destroys accounts",
            body: "Imagine 10 bad trades in a row. It's a normal streak, even the best traders go through losing streaks. Here's what's left of your capital depending on the risk per trade.",
            table: {
              headers: ["Risk per trade", "Capital remaining after 10 consecutive losses"],
              rows: [
                ["1%", "90.4%, you keep trading calmly"],
                ["2%", "81.7%, still manageable"],
                ["5%", "59.9%, morale in the gutter, mistakes piling up"],
                ["10%", "34.9%, very hard to recover"],
                ["20%", "10.7%, account nearly destroyed"],
              ],
            },
          },
          {
            heading: "The effect of drawdown: why protect your capital",
            body: "The heavier the loss, the more disproportionate the recovery. Hence the priority: preserve capital rather than trying to win it back.",
            table: {
              headers: ["Loss suffered", "Gain needed to get back to break-even"],
              rows: [
                ["-10%", "+11%"],
                ["-25%", "+33%"],
                ["-50%", "+100%"],
                ["-75%", "+300%"],
                ["-90%", "+900%"],
              ],
            },
          },
          {
            heading: "Common beginner mistakes",
            body: "These risk management mistakes are the most destructive, they act in silence until the moment everything collapses.",
            items: [
              "Risking more after a win: 'I traded well, I can afford to risk more.' That's overconfidence, it always precedes big losses.",
              "Risking more after a loss to recover: exactly the opposite of what you should do.",
              "Not calculating the position size and 'eyeballing it': a calibration error can double or triple the real risk.",
              "Ignoring the spread in the calculation: the spread adds to the potential loss, you have to account for it.",
            ],
          },
          {
            heading: "The fatal mistake",
            body: "Doubling your stake after a losing streak to 'recover' faster. Example: account of €1,000, risk at 3%. You lose 3 trades → -€30 × 3 = -€90. You have €910 left. You tell yourself: 'I'll risk 10% on the next one to recover in one shot.' You lose that trade too. -€91 more. Total: -€181 in 4 trades instead of -€90 by following the grid. Multiplying the risk after losses is the fastest path to a zeroed account.",
          },
        ],
        keyPoints: [
          "Adapt your risk % to your capital: €200-500 → 5%, €500-1000 → 3%, €1000-5000 → 2%",
          "Calculate your risk in euros BEFORE entering: Capital × adapted % = maximum amount to lose",
          "With 3% risk, 10 consecutive losses = 74% of the capital intact. You can bounce back.",
          "Recommended R/R ratio: 1:2 minimum, aim for 2 times what you risk",
          "Never increase the risk to 'recover', it's the path to a zeroed account",
        ],
        exercise: {
          title: "Calculate your risk adapted to your capital",
          steps: [
            "Note your capital. Identify your bracket in the grid: €200-500 → 5%, €500-1000 → 3%, €1000-5000 → 2%.",
            "Calculate your maximum risk per trade. Example: €700 × 3% = €21 maximum per trade.",
            "On TradingView (EUR/USD, H1), identify a Long setup. Where will you put your Stop Loss? Estimate the loss in euros if the SL triggers with 0.1 lot.",
            "Compare that amount with your adapted risk. If you exceed your max, reduce the position size until you respect the calculated amount.",
          ],
        },
        quiz: {
          question: "You have a capital of €700. What's the correct application of the risk grid?",
          answers: [
            "1% of €700 = €7, the universal rule always applies",
            "3% of €700 = €21, adapted to the €500-1,000 bracket",
            "5% of €700 = €35, to maximize gains on small capital",
            "10% of €700 = €70, acceptable if the setup is 'safe'",
          ],
          correct: 1,
          explanation:
            "€700 falls into the €500-1,000 bracket → 3% risk per trade = €21 maximum. The 1% rule is designed for €5,000+ accounts, with €700, 1% = €7, often lower than the risk generated by the minimum lot available on the major pairs.",
          answerExplanations: [
            "Wrong. The 1% rule applies to accounts of €5,000+. On €700, 1% = €7, often inapplicable because minimum lots generate 10-20 euros of risk on the major pairs.",
            "Correct. €700 is in the €500-1,000 bracket, so 3% risk per trade = €21. It's the adapted % that lets you execute your orders correctly while protecting your capital.",
            "Wrong. 5% is adapted to the €200-500 bracket. With €700, you're in the higher bracket (3%). Using 5% on €700 would mean over-risking.",
            "Wrong. 10% per trade = account destroyed in a few normal losing streaks. There's no such thing as a safe trade.",
          ],
        },
      },

      // ─── Leçon 9 ────────────────────────────────────────────────────────────
      {
        id: "lecon-9",
        slug: "lecon9",
        title: "Beginner mistakes",
        duration: "11 min",
        introduction:
          "Beginners who lose their account almost never make analysis mistakes. They make behavioral mistakes. The same mistakes, repeated by almost everyone, in the same order. This lesson shows them to you before you make them.",
        sections: [
          {
            heading: "The principle, in one sentence",
            body: "Most accounts aren't destroyed by bad analysis, they're destroyed by bad decisions made under emotion. Recognizing these mistakes in advance is the first line of defense.",
            items: [
              "Behavioral mistakes cost more than analysis mistakes",
              "These mistakes are universal, experienced traders and beginners all make them",
              "A trading journal is the only tool that lets you spot and correct them",
            ],
          },
          {
            heading: "The 4 mistakes that destroy accounts",
            body: "These mistakes don't seem dangerous in the moment. That's exactly why they do so much damage.",
            items: [
              "1. Trading without a Stop Loss — 'I'm watching the trade.' An economic announcement, a lost connection, and you lose 40% of the account in 10 minutes.",
              "2. Over-trading, opening 15 trades a day because you're bored. More trades = more spreads paid = an account that slowly melts away.",
              "3. Risking too much, 10, 20% of the capital on a 'safe' trade. There's no such thing as a safe trade. A streak of 3 losses at 20% = 49% of the account lost.",
              "4. Not respecting your plan, entering too early, moving the SL, closing the TP halfway. Emotion takes back control.",
            ],
          },
          {
            heading: "The psychological traps",
            body: "Trading doesn't only test your analysis, it tests your psychology. These biases hit all traders, even experienced ones. Knowing them helps you spot them at the right moment.",
            diagram: "errors",
          },
          {
            heading: "What each bias looks like in practice",
            body: "Here are the 4 typical scenarios you must learn to recognize on the chart before they cost you dearly.",
            diagram: "biaschart",
            table: {
              headers: ["Bias", "What happens", "Typical consequence"],
              rows: [
                ["FOMO", "The market rises hard, you buy in a hurry", "You buy at the top, right before the reversal"],
                ["Revenge trading", "You lose a trade, you re-open immediately", "You lose even more, with less clarity"],
                ["Anchoring", "You refuse to close a losing trade", "The loss doubles, you close at the worst moment"],
                ["Overconfidence", "5 winning trades in a row, you feel invincible", "You double the lots, the next trade erases everything"],
              ],
            },
          },
          {
            heading: "Common mistakes on this last lesson",
            body: "There's a specific mistake at this stage of the journey: reading these mistakes, nodding your head, and thinking they don't apply to you.",
            items: [
              "Ignoring the trading journal because 'it takes time', it's exactly what separates the traders who progress from the rest",
              "Underestimating psychology: managing emotions is as important, even more so, than the technical strategy",
            ],
          },
        ],
        keyPoints: [
          "Stop Loss mandatory on every trade, no exception, no justification",
          "Adapt your risk % to your capital (see lesson 8), never over-risk even on a 'safe' trade",
          "Keep a trading journal, it's the only tool that lets you truly progress",
          "If you lose 2 trades in a row: stop, analyze, come back fresh the next day",
        ],
        exercise: {
          title: "Prepare your personal discipline plan",
          steps: [
            "Write your 3 non-negotiable rules: for example 'Stop Loss mandatory, risk adapted to my capital (see grid lesson 8), never enter on FOMO'",
            "Define your daily stop rule: at what % of loss do you stop for the day?",
          ],
        },
        quiz: {
          question: "You've just lost two trades in a row. You're stressed. What's the most disciplined reaction?",
          answers: [
            "Open a third trade immediately to recover the losses",
            "Increase your position size to make up for the losses faster",
            "Stop, analyze the two trades in your journal, come back the next day",
            "Trade without a Stop Loss to have more flexibility",
          ],
          correct: 2,
          explanation:
            "Two consecutive losses in a stressed state is the ideal ground for revenge trading. The disciplined reaction: stop completely, analyze why you lost (plan error? bad timing? emotion?), and come back fresh the next day. The market will still be there tomorrow.",
          answerExplanations: [
            "Wrong. Opening a trade immediately after two losses to 'recover' is the definition of revenge trading. You're making an emotional decision under stress, not an analytical one. The odds of losing again are statistically much higher in that state.",
            "Wrong. Increasing the position size after losses is exactly the opposite of what you should do. You're in the worst possible emotional state. If you lose again with an increased size, the damage is exponentially larger.",
            "Correct. Stopping and analyzing in the journal: did the two trades follow the plan? Were there execution errors? It's calm, it's factual, and it's what lets you progress. Come back tomorrow, rested, with a clear plan.",
            "Wrong. Removing the Stop Loss after losses in a stressed state is the most dangerous decision possible. You increase your exposure to risk at the very moment you're least able to handle a bad situation.",
          ],
        },
      },

      // ─── Lesson 10 ──────────────────────────────────────────────────────────
      {
        id: "lecon-10",
        slug: "lecon10",
        title: "Risk management: why 90% of traders lose",
        duration: "13 min",
        introduction:
          "The retail trader's problem usually isn't the entry. It comes from what happens AROUND the trade: too much risk, bad R/R, excessive leverage, revenge trading. Two traders with the same setup: one ends up profitable, the other blows up their account. The difference doesn't come from the strategy. It comes from risk management.",
        sections: [
          {
            heading: "The biggest lie in retail trading",
            body: "Retail traders often think: \"If I find the right strategy, I'll become profitable.\" That's false. A good strategy with bad risk management almost always ends up dying. No strategy wins 100% of the time. Even an excellent strategy takes losses, goes through drawdowns, hits rough patches, and sometimes strings together several stops in a row. The retail trader's problem is that they build their trading as if losses should never happen. So the moment they do, they increase risk, force setups, move the stop, delete the SL, want to win it back immediately. And that's when the account really starts to die.",
          },
          {
            heading: "How an account really dies",
            body: "An account usually doesn't die because of a single trade. It dies from an accumulation of bad decisions, too much risk, and an inability to handle losses emotionally.",
            table: {
              headers: ["", "Scenario A. Risk 3%", "Scenario B. Risk 10%"],
              rows: [
                ["Account", "€500", "€500"],
                ["Risk per trade", "€15 (3%)", "€50 (10%)"],
                ["5 losses in a row", "−€75", "−€250"],
                ["Account left", "€425", "€250"],
                ["Verdict", "The trader is still alive, they can keep trading normally.", "The account is psychologically destroyed, they now need +100% to get back to €500."],
              ],
            },
          },
          {
            heading: "The retail psychological trap",
            body: "Retail traders often want to win it back fast. And that's exactly what accelerates the account's destruction. Here's the classic cycle of a dying account:",
            items: [
              "A normal loss happens (it's part of the game)",
              "Frustration → bigger position size to \"catch up\"",
              "A new, bigger loss → deleting the SL to \"let it breathe\"",
              "The market keeps going against them → revenge trading",
              "Account burned in a few hours",
            ],
            note: "The problem then becomes psychological. The trader is no longer trading to execute a setup. They're trading to win it back, relieve frustration, erase a loss, get \"revenge\" on the market. And in that state, decision quality collapses.",
          },
          {
            heading: "Why R/R changes everything",
            body: "Situation 1: you risk €20 to make €10. Situation 2: you risk €20 to make €40. Which one is smarter? Obviously Situation 2, you make 4x more for exactly the same risk. And yet, 90% of retail traders spend their time taking Situation 1 trades without realizing it, either because they set their Take Profit too early \"to lock it in,\" or because they accept mediocre trades where the upside is tiny compared to the risk. R/R (risk/reward) is the ratio between what you RISK and what you can MAKE on a trade. You do NOT need to be right often to make money in the markets. You need your winning trades to bring in much more than your losing trades cost you.",
            items: [
              "If you risk €20 and aim for €40 → your R/R is 1:2",
              "If you risk €20 and aim for €60 → your R/R is 1:3",
              "If you risk €20 and aim for €10 → your R/R is 1:0.5 (catastrophic)",
            ],
            table: {
              headers: ["Trader", "Win rate", "R/R", "Risk/trade", "Over 10 trades"],
              rows: [
                ["Trader A", "70%", "1:0.7", "€15", "+€28.50"],
                ["Trader B", "45%", "1:3", "€15", "+€120"],
              ],
            },
            note: "The market doesn't reward \"the one who wins often.\" It rewards \"the one who loses little when wrong, and makes enough when right.\" Trader A is wrong 30% of the time, Trader B is wrong 55% of the time. And yet Trader B ends up more than 4x more profitable, because every time they're right, they bank €45, against only €10.50 for Trader A.",
          },
          {
            heading: "Surviving matters more than winning fast",
            body: "Retail traders often want to double the account fast, speed things up, use a lot of leverage, aggressively size up. The problem: the market rarely rewards aggression for long. Traders who survive a long time generally have low risk, controlled exposure, slower growth, and stronger emotional stability. The real goal isn't to make +300% fast. The real goal is to stay alive long enough to build experience, protect your capital, and avoid emotional destruction. Because a trader with no capital can't execute any setup anymore.",
          },
          {
            heading: "A concrete XAU/USD example: two R/R, two outcomes",
            body: "Two traders take XAU/USD at the same moment, on the same entry setup. Same €500 account, same €15 risk (3%). The only difference: where they place their Take Profit, so their R/R. Here's the real impact over 10 trades.",
            table: {
              headers: ["Metric", "Trader R/R 1:1", "Trader R/R 1:3"],
              rows: [
                ["Starting capital", "€500", "€500"],
                ["Risk per trade", "€15 (3%)", "€15 (3%)"],
                ["XAU/USD entry", "4,320", "4,320"],
                ["SL", "4,300 (20 pts)", "4,300 (20 pts)"],
                ["TP", "4,340 (20 pts, R/R 1:1)", "4,380 (60 pts, R/R 1:3)"],
                ["Win rate over 10 trades", "60%", "40%"],
                ["Winning trades", "6 × +€15 = +€90", "4 × +€45 = +€180"],
                ["Losing trades", "4 × −€15 = −€60", "6 × −€15 = −€90"],
                ["Net result", "+€30", "+€90"],
              ],
            },
            note: "The R/R 1:1 trader wins more often (60% of trades) but finishes at +€30. The R/R 1:3 trader loses more often (60% of trades) but finishes at +€90, 3x more profitable with fewer winning trades. That's the power of R/R: you can be wrong more than half the time and still be far more profitable than someone who's right more often.",
          },
          {
            heading: "What retail traders should do",
            body: "Simple rules to apply starting today:",
            items: [
              "Risk per trade: 3% to 5% of capital (per the account-size grid detailed in Lesson 8: 5% if you start at €200-500, 3% if you're at €500-1,000, 2% above that)",
              "2-3 trades per day max",
              "Daily stop: 10% to 15% of capital max per day",
              "Minimum acceptable R/R: 1:2",
              "Stop immediately after a loss that makes you lose your emotional clarity",
              "Never any revenge trading",
              "Never move an SL just to \"hope\"",
            ],
            note: "The goal isn't to make a ton today. The goal is to still be able to trade in 6 months.",
          },
          {
            heading: "Key takeaway",
            body: "The profitable trader doesn't have a better strategy than everyone else. They have a better mental hierarchy:",
            items: [
              "1. Survive first.",
              "2. Protect capital next.",
              "3. Perform last.",
            ],
            note: "Retail traders flip this hierarchy. They want to perform fast, without protecting, without surviving. And that's exactly why they lose.",
          },
        ],
        keyPoints: [
          "A good strategy with bad risk management almost always ends up dying.",
          "Adapt your risk per trade to your capital and aim for a minimum R/R of 1:2.",
          "R/R matters more than win rate: a trader with a 45% win rate and good R/R beats a 70% win rate trader with bad R/R.",
          "The profitable trader's hierarchy: survive first, protect capital next, perform last.",
        ],
        exercise: {
          title: "Simple rules to apply starting today",
          steps: [
            "Risk per trade: 3% to 5% of capital (per the account-size grid detailed in Lesson 8).",
            "2-3 trades per day max.",
            "Daily stop: 10% to 15% of capital max per day.",
            "Minimum acceptable R/R: 1:2.",
            "Stop immediately after a loss that makes you lose your emotional clarity.",
          ],
        },
        quiz: {
          question: "You risk €20 to make €60 on a trade. What's your R/R?",
          answers: ["1:0.3", "1:2", "1:3", "1:60"],
          correct: 2,
          explanation:
            "R/R = potential gain / risk. Here €60 / €20 = 3. So the R/R is 1:3. You risk 1 to make 3.",
          answerExplanations: [
            "Wrong. 1:0.3 would mean risking more than you aim to make, which isn't the case here.",
            "Wrong. An R/R of 1:2 would mean aiming for €40 on a €20 risk, not €60.",
            "Correct. €60 / €20 = 3, your R/R is 1:3. You risk 1 to make 3.",
            "Wrong. 1:60 would mean a gain 60 times the risk, which isn't the case here.",
          ],
        },
      },
    ],
  },
];
