import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { BacktestMetricsDiagram } from "@/app/components/charts/BacktestMetricsDiagram";

export default function ContentEn() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon9"
      title="Backtesting, validating your strategy"
      subtitle="Before risking real money, you need proof that your strategy works. Backtesting is that proof, built on historical data, not on hope."
      duration="22 min"
      lessonNumber={9}
      prev={{ href: "/formations/avance/lecon8", label: "Lesson 8: Journaling" }}
      next={null}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">What is backtesting?</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Backtesting means applying your strategy to past market data to assess its performance. You replay historical situations as if you were trading in real time, and you log every decision in a journal.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          It&apos;s not the same as looking at a past chart and saying &quot;I would have sold here&quot;. Rigorous backtesting hides the future candles (replay mode) and forces decisions in simulated real time.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Goal:</span> get a sample of 50 to 100 trades to validate your strategy&apos;s edge with reliable statistical data.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">How to run a rigorous backtest</h2>
        <div className="space-y-2">
          {[
            { step: "1", text: "Define your strategy precisely: which confluences are required? On which timeframe? In which Killzones? Be specific, a vague strategy gives a vague backtest." },
            { step: "2", text: "Use TradingView in Replay mode ('play' arrow at the top) or Forex Tester. Go back 6 to 12 months and move forward candle by candle." },
            { step: "3", text: "Apply your strategy exactly as you would live: spot the setups, mark the entry, the SL and the TP before the next candle forms." },
            { step: "4", text: "Log every trade in your journal: confluences present, result in R, screenshot." },
            { step: "5", text: "After 50 to 100 trades, analyze the stats: win rate, average R, max drawdown, profitable vs losing months." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-4">{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
        <div className="flex items-center gap-2 mb-2">
          <span>💰</span>
          <span className="text-sm font-bold text-amber-400 tracking-wide">Retail reality</span>
        </div>
        <p className="text-base text-zinc-300 leading-relaxed">
          If you backtest with €200 to €1,000 of capital, use the real % from your risk management grid (cf. Beginner lesson 8), not the theoretical 1% rule. Backtesting with 1% on a €300 account means risking €3 per trade, unworkable with the available lots. A backtest calibrated to your real capital will give you results you can actually use live, not numbers disconnected from your reality.
        </p>
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">The key metrics of a backtest</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          These metrics give you a complete picture of your strategy. They decide whether you can trust it live.
        </p>
        <div className="space-y-2.5">
          {[
            { metric: "Win Rate", good: "> 40%", desc: "Percentage of winning trades. With a good R/R, even a 40% win rate can be profitable." },
            { metric: "Average R", good: "> +0.5R", desc: "Average gain per trade in R. A 50% win rate with an average R of +1R = very profitable." },
            { metric: "Profit Factor", good: "> 1.5", desc: "Total gains ÷ total losses. Must be above 1.0 to be profitable." },
            { metric: "Max drawdown", good: "< 15%", desc: "Maximum loss from a peak. A high drawdown tests your psychology live, know it ahead of time." },
            { metric: "Number of trades", good: "> 50", desc: "Below 50 trades, the results aren't statistically reliable. Aim for 100 minimum." },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-4 bg-zinc-800/40 rounded-xl px-4 py-3">
              <div className="shrink-0">
                <p className="text-sm font-semibold text-white">{r.metric}</p>
                <p className="text-xs font-mono text-emerald-400">{r.good}</p>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <BacktestMetricsDiagram />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">The backtesting mistakes to avoid</h2>
        <div className="space-y-2.5">
          {[
            { label: "Hindsight bias", detail: "Believing you'd have 'obviously' seen the setup because you can see the past candles. Candle-by-candle replay is the only cure." },
            { label: "Over-fitting", detail: "Optimizing your strategy until it performs perfectly on the past. Live, that strategy over-tuned to historical data fails." },
            { label: "Ignoring fees", detail: "Every trade has a cost (spread, commission). Build them into your backtest: they can turn a positive edge into a negative one." },
            { label: "Backtesting on too few conditions", detail: "A backtest over 3 months of uptrend says nothing about performance in a range or a downtrend. Test over at least 12 months with different conditions." },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-red-400 shrink-0 mt-0.5">
                <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div>
                <p className="text-sm font-medium text-white">{r.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Review</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Backtesting validates your strategy on past data before you risk real money.",
          "Use TradingView's Replay mode to simulate real time, never the static chart.",
          "50 trades minimum for validation, 100 for solid statistical confidence.",
          "The key metrics: win rate (>40%), average R (>+0.5R), profit factor (>1.5), drawdown (<15%).",
          "Build the fees (spread, commission) into every trade, they add up over time.",
        ]}
      />

      <LessonExercice
        description="Run your first backtest on your main strategy."
        steps={[
          "On TradingView, open EUR/USD on H1. Go back 3 months in Replay mode (arrow button at the top of the interface).",
          "Move forward candle by candle. Apply your strategy (BOS → OTE pullback → OB → candle signal). Note every potential trade.",
          "For the first 10 trades you spot, log: confluences present, entry, SL, TP, result in R.",
          "Calculate your win rate and your average R over those 10 trades. That's the start of your personal edge.",
        ]}
      />

      <LessonQuiz
        question="After 20 trades in backtest, you get a 70% win rate and a profit factor of 1.8. You decide to go live right away. What's the mistake?"
        options={[
          "A 70% win rate is too high, it's not realistic",
          "20 trades is too small a sample to validate a strategy in a statistically reliable way",
          "A profit factor of 1.8 is insufficient, you need at least 3.0 to trade live",
          "You should first backtest on 5 different instruments before trading EUR/USD",
        ]}
        correctIndex={1}
        explanation="20 trades is too small a sample to draw statistically reliable conclusions. A run of 20 trades can be positive by pure luck, even with a strategy that has no edge. You need at least 50 trades, ideally 100, for the results to truly reflect the strategy's performance rather than random variance."
        answerExplanations={[
          "False. A 70% win rate isn't unrealistic if the R/R is favorable (>1:1). Some scalping or high-confluence strategies can hit those numbers. That's not the problem here.",
          "Correct. 20 trades = too much random variance. The same backtest with 20 other trades could give a 30% win rate and a profit factor of 0.8. You need 50 to 100 trades for the stats to be meaningful.",
          "False. A profit factor of 1.8 is already solid, above 1.5 is generally a valid target. 3.0 is exceptional and isn't required to trade live with a real edge.",
          "False. Backtesting on several instruments can be useful but isn't a mandatory prerequisite. The priority is having a large enough sample on a single instrument before generalizing.",
        ]}
      />

    </LessonPage>
  );
}
