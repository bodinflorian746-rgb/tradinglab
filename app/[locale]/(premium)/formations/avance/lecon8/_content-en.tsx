import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { TradingJournalDiagram } from "@/app/components/charts/TradingJournalDiagram";

export default function ContentEn() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon8"
      title="Journaling, analyze to improve"
      subtitle="The best traders don't improve through intuition, they improve through data. The trading journal is the tool that turns raw experience into measurable progress."
      duration="18 min"
      lessonNumber={8}
      prev={{ href: "/formations/avance/lecon7", label: "Lesson 7: Precision entries" }}
      next={{ href: "/formations/avance/lecon9", label: "Lesson 9: Backtesting" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Why most traders never improve</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Without a journal, trading stays a string of disconnected experiences. You lose a trade, you move on to the next. You win, you assume your strategy is good. But without objective data, you have no way to know what actually works, what mistakes you keep repeating, or where your edge really is.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Fact:</span> most professional traders keep a detailed journal. It's not optional, it's a performance tool on the same level as a strategy.
          </p>
        </div>
        <p className="text-zinc-300 leading-relaxed text-sm mt-4">
          Treat your trading like a game of probabilities. No trade is ever certain; over a large number of trades, it's your statistical edge that decides. That's exactly what the journal is for: spotting which parameters (setups, sessions, pairs, conditions) are profitable for you and which ones cost you, so you can optimize that edge. The goal isn't to judge a single trade but to understand your recurring mistakes. Trading adapts to each person: one trader = one strategy, and yours is built from your own data.
        </p>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">What a good trading journal contains</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          An effective journal documents every trade in a structured way, before, during and after. Here's the essential information to capture.
        </p>
        <div className="space-y-2.5">
          {[
            {
              phase: "Before the trade",
              items: ["Instrument & timeframe", "Market bias (bullish / bearish / neutral)", "Confluences identified (OB, FVG, liquidity, OTE...)", "Planned entry, SL, TP", "Calculated R/R ratio", "Screenshot of the setup"],
            },
            {
              phase: "After the trade",
              items: ["Result (win/loss in R, not in dollars)", "Did price behave as you expected?", "Did you respect the plan?", "Mistakes made (entered too early, SL moved, TP cut...)", "Screenshot of the result with annotations"],
            },
            {
              phase: "Weekly review",
              items: ["Win rate", "Average R (average gain per trade)", "Max drawdown of the week", "Recurring mistake pattern", "Market condition where your strategy performs or underperforms"],
            },
          ].map((section, i) => (
            <div key={i} className="bg-zinc-800/40 rounded-xl px-4 py-3">
              <p className="text-sm font-semibold text-white mb-2">{section.phase}</p>
              <ul className="space-y-1">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-zinc-400">
                    <span className="text-zinc-600 shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <TradingJournalDiagram locale="en" />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Analyze in R, not in dollars</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          R (Risk/Reward) is the standard unit for measuring trading performance. Analyzing in dollars biases your analysis, a $50 winning trade can be a bad trade if the R/R was 1:0.5. A $20 losing trade can be a good trade if the plan was respected.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Result", "In dollars", "In R", "Verdict"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pb-2.5 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Trade 1", "+$85", "+1.7R", "Good trade"],
                ["Trade 2", "+$10", "+0.2R", "Bad trade"],
                ["Trade 3", "-$50", "-1R", "Good trade (plan respected)"],
                ["Trade 4", "-$50", "-3R", "Bad trade (SL moved)"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-zinc-800/70">
                  <td className="py-2.5 pr-4 text-zinc-400 text-xs">{row[0]}</td>
                  <td className="py-2.5 pr-4 text-white text-xs font-mono">{row[1]}</td>
                  <td className="py-2.5 pr-4 text-emerald-400 text-xs font-mono">{row[2]}</td>
                  <td className={`py-2.5 pr-4 text-xs font-medium ${row[3].startsWith("Good") ? "text-emerald-400" : "text-red-400"}`}>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Review</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "The journal turns raw experience into usable data to improve.",
          "Document BEFORE (plan, confluences, SL/TP) and AFTER (result, behavior, mistakes).",
          "Measure everything in R, not in dollars. Dollars bias your perception of trade quality.",
          "The weekly review is as important as the journal itself, that's where learning happens.",
          "A losing trade that respects the plan is a good trade. A winning trade that's off-plan is a mistake.",
        ]}
      />

      <LessonExercice
        description="Create and start filling in your first trading journal."
        steps={[
          "Create a document (Notion, Google Sheets, notebook) with the columns: Date, Instrument, Confluences, Entry, SL, TP, R/R, Result (R), Plan respected? (yes/no), Notes.",
          "Pull up 3 past trades (on paper or in demo) and fill in their entry in the journal.",
          "For each trade: note whether you respected the plan. If not, write down the exact mistake.",
          "Calculate your win rate and your average R over those 3 trades. What do you notice?",
        ]}
      />

      <LessonQuiz
        question="You won 3 trades this week for +1.5R total, and lost 2 trades for -2R. What does a good journal tell you?"
        options={[
          "Your week is negative (-0.5R), you should change your strategy immediately",
          "The weekly result isn't enough to draw conclusions, analyze the 5 trades individually",
          "Your 60% win rate is excellent, keep doing exactly what you're doing",
          "Losing trades matter more than winning ones, focus on the mistakes",
        ]}
        correctIndex={1}
        explanation="5 trades aren't enough to draw statistically reliable conclusions. A good journal pushes you to analyze each trade individually: were the winning trades well built? Did the losing trades respect the plan? The weekly result (-0.5R) can be perfectly normal with a good strategy over a small sample."
        answerExplanations={[
          "Too hasty. -0.5R over 5 trades justifies no strategy change. Such a short sample can just be normal variance. Switching strategy on 5 trades is counterproductive micromanagement.",
          "Correct. 5 trades = no reliable statistical signal. Analyzing each trade individually (plan respected? confluences valid? execution mistake?) is far more instructive than the raw result.",
          "Wrong. A 60% win rate over 5 trades says nothing meaningful. And a high win rate can hide a bad R/R. If the 3 wins are +0.5R each and the 2 losses -1R each, the account loses money long term.",
          "Partly true. Analyzing mistakes is important, but ignoring winning trades is a mistake. Understanding why a trade won is just as crucial as understanding why another one lost.",
        ]}
      />

    </LessonPage>
  );
}
