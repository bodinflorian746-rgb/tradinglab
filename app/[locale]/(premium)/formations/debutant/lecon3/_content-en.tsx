import { LessonTemplate } from "@/app/components/LessonTemplate";
import { CandleAnatomyDiagram } from "@/app/components/charts/CandleAnatomyDiagram";

// ── Diagram: green candle vs red candle example ──────────────────────────────
function CandleExampleDiagram() {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
        <p className="text-xs font-bold text-emerald-400 mb-2">Green candle</p>
        <svg viewBox="0 0 60 100" className="w-10 mx-auto mb-2" aria-label="Green candle">
          <line x1="30" y1="5"  x2="30" y2="18" stroke="#4b5563" strokeWidth="2" />
          <rect x="18" y="18" width="24" height="52" rx="2" fill="#059669" fillOpacity="0.9" />
          <line x1="30" y1="70" x2="30" y2="92" stroke="#4b5563" strokeWidth="2" />
        </svg>
        <p className="text-[10px] text-emerald-400/80 leading-snug">Close &gt; Open<br />Buyers won</p>
      </div>
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-center">
        <p className="text-xs font-bold text-red-400 mb-2">Red candle</p>
        <svg viewBox="0 0 60 100" className="w-10 mx-auto mb-2" aria-label="Red candle">
          <line x1="30" y1="5"  x2="30" y2="18" stroke="#4b5563" strokeWidth="2" />
          <rect x="18" y="18" width="24" height="52" rx="2" fill="#dc2626" fillOpacity="0.8" />
          <line x1="30" y1="70" x2="30" y2="92" stroke="#4b5563" strokeWidth="2" />
        </svg>
        <p className="text-[10px] text-red-400/80 leading-snug">Open &gt; Close<br />Sellers won</p>
      </div>
    </div>
  );
}

export default function ContentEn() {
  return (
    <LessonTemplate
      formationId="debutant"
      lessonId="lecon3"
      lessonNumber={3}
      duration="10 min"
      prev={{ href: "/formations/debutant/lecon2", label: "Lesson 2: Long and Short" }}
      next={{ href: "/formations/debutant/lecon4", label: "Lesson 4: Spread" }}
      title="Reading a candlestick chart"
      hook="A candlestick chart is a picture of the battle between buyers and sellers. Each candle tells you who won, with what force, and whether there was any resistance. Learning to read them means seeing what most people miss."
      sections={[
        {
          title: "Anatomy of a candle: 4 pieces of info in one image",
          content: "Each candle shows exactly 4 data points. Together, they sum up everything that happened during a period, 1 minute, 1 hour or 1 day.",
          visual: <CandleAnatomyDiagram locale="en" />,
          items: [
            "Open (O), the price at the moment the period begins",
            "Close (C), the price at the moment the period ends",
            "High (H), the highest price reached during the period",
            "Low (L), the lowest price reached during the period",
          ],
        },
        {
          title: "A concrete example: a green candle, a red candle",
          content: "Green candle: Bitcoin opens at $78,000, rises to $79,000, drops to $77,500, closes at $78,600. The price ends higher than the open: Close (78,600) > Open (78,000). The buyers win the battle. Red candle: Bitcoin opens at $78,600, rises to $78,900, falls to $77,000, closes at $77,400. The price ends lower than the open: Close (77,400) < Open (78,600). The sellers win the battle.",
          visual: <CandleExampleDiagram />,
          items: [
            "Green body = close > open, the buyers dominated the period",
            "Red body = close < open, the sellers dominated the period",
            "Upper wick = an attempt to push up rejected by the sellers",
            "Lower wick = an attempt to push down rejected by the buyers",
          ],
        },
        {
          title: "Candle patterns to know",
          content: "These configurations show up often. They give information, but their value depends entirely on where they appear on the chart.",
          items: [
            "Hammer: small body at the top, long lower wick → the sellers tried to push down, the buyers resisted hard",
            "Shooting star: small body at the bottom, long upper wick → the buyers tried to push up, the sellers rejected it",
            "Doji: almost no body, wicks on both sides → total indecision between buyers and sellers",
            "Bullish engulfing: a large green candle that swallows the previous red one → the buyers take control",
          ],
        },
      ]}
      errors={[
        "Entering a trade because a candle 'looks like' a hammer, without checking whether it sits at an important level",
        "Confusing the color with a buy or sell signal: a red candle doesn't mean 'sell now'",
        "Analyzing a single isolated candle: it's always the sequence of candles that tells the story",
        "Ignoring the wicks: a green candle with a very long upper wick is not a strong bullish signal",
      ]}
      fatalError="Entering a trade just because a candle pattern looks interesting to you, without looking at the overall trend and without the candle sitting at a key level. A hammer in the middle of the chart means nothing. A hammer on a major support, within an uptrend, that's when it becomes relevant."
      keyPoints={[
        "Each candle = 4 data points: Open, High, Low, Close",
        "Green body = buyers win. Red body = sellers win.",
        "The wicks = failed attempts, they show the resistance of the opposing side",
        "Doji = indecision. Hammer = rejection of low prices. Engulfing = clear takeover.",
        "A candle pattern on its own means nothing, context gives it value",
      ]}
      exerciseTitle="Reading candles on a real chart"
      exercise={[
        "On TradingView.com, open EUR/USD on the Daily timeframe",
        "Find a green candle with a long upper wick — what happened in the following days?",
        "Find a Doji — did the market pick a clear direction in the next candles?",
        "Identify an Engulfing (a large candle that swallows the previous one) — what impact did it have on what followed?",
      ]}
      quiz={{
        question: "You see a red candle with a very long lower wick. What does this indicate most precisely?",
        answers: [
          "The market is strongly bearish and will keep falling",
          "The sellers dominated the period, but the buyers defended the low prices with force",
          "The candle closed at the lowest level of the period",
          "It's an immediate buy signal, enter now",
        ],
        correctIndex: 1,
        explanation: "Red body = the sellers won the period (close < open). Long lower wick = the price fell very low, but the buyers rejected that drop before the close. It's a sign of buyer resistance, not total seller dominance.",
        answerExplanations: [
          "False. The long lower wick proves the opposite of total seller dominance. The buyers reacted strongly from the lows, that's resistance, not a confirmation of a bearish trend.",
          "Correct. Red body = sellers win the period. Long lower wick = the buyers pushed prices back up from the lows with force. There was a visible fight, not a crushing dominance.",
          "False. The long lower wick proves the price went very low AND THEN came back up before closing. The close is therefore above the low, otherwise the wick would be nonexistent.",
          "False. No single candle is a sufficient buy signal. For this candle to be actionable, it would need to sit at an important support, in a favorable trend context.",
        ],
      }}
    />
  );
}
