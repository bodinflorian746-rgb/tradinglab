import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { MultiTimeframeDiagram } from "@/app/components/charts/MultiTimeframeDiagram";

export default function ContentEn() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon7"
      title="Multi-Timeframe Analysis"
      subtitle="The market tells the same story at different scales. Learning to read these levels in the right order is one of the most powerful skills a trader can have."
      duration="22 min"
      lessonNumber={7}
      prev={{ href: "/formations/intermediaire/lecon6", label: "Lesson 6: Fake Breakout" }}
      next={{ href: "/formations/intermediaire/lecon8", label: "Lesson 8: Trade Plan" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">What you should see on the chart</p>
        <h2 className="text-lg font-semibold text-white mb-4">The same pair, two different stories</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">EUR/USD. Daily (bias)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              You open EUR/USD on the Daily. The chart has been stepping higher for 3 weeks. Clear HH/HL. <strong className="text-white">Bullish bias.</strong> You only look for buys this week.
            </p>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-blue-400 mb-2">EUR/USD. H4 (zone of interest)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              You switch to H4. Price pulls back to 1.0850, the last Higher Low. It&apos;s a support zone. <strong className="text-white">You mark the zone</strong> as a potential long entry area.
            </p>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-blue-400 mb-2">EUR/USD. M15 (trigger)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              You switch to M15 when price hits the zone. A bullish pin bar forms. <strong className="text-white">That&apos;s the signal.</strong> You buy in the direction of the Daily. All 3 timeframes tell the same story.
            </p>
          </div>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <MultiTimeframeDiagram locale="en" />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Why timeframes seem to contradict each other</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          The same market can show a bullish trend on the Daily and a bearish trend on H1 at the same time. It&apos;s not a mistake, it&apos;s two different levels of reading. The Daily shows the context. The H1 shows the move currently unfolding within that context.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Analogy: </span>
            Think of looking at a map of a whole country (Daily) vs a map of your city (H1). The country gives you the direction, the city gives you the streets. Both are correct, just at different scales.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">The role of each timeframe</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Each timeframe has a precise function. You don&apos;t use them for the same reasons.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Timeframe", "Role", "What you look for"].map((h, i) => (
                  <th key={i} className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pb-2.5 pr-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Weekly", "Background context", "Long-term trend, major zones"],
                ["Daily", "Directional bias", "Current trend, key zones that matter"],
                ["H4", "Zones of interest", "Intermediate structures, SD zones"],
                ["H1", "Setup confirmation", "Continuation pattern, entry signal"],
                ["M15 / M5", "Precise timing", "Entry on candle signal, final timing"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-zinc-800/70">
                  {row.map((cell, j) => (
                    <td key={j} className={`py-2.5 pr-6 leading-snug text-sm ${j === 0 ? "text-amber-400 font-semibold" : j === 1 ? "text-white font-medium" : "text-zinc-400"}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">The Top-Down method in practice</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          The top-down method means analyzing from the higher timeframe down to the lower one, never the other way around. Each level validates or invalidates what you see on the level below.
        </p>
        <div className="space-y-2">
          {[
            { tf: "Daily", action: "Identify the trend: bullish, bearish or range? Define your bias for the week." },
            { tf: "H4", action: "Locate the key zones: support, resistance, SD zones. Where has price historically reacted?" },
            { tf: "H1", action: "Wait for price to reach an H4 zone. Is there a setup in the direction of the Daily trend?" },
            { tf: "M15", action: "Look for the trigger signal: rejection, engulfing, pin bar inside the H4 zone." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-6">{item.tf}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.action}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Absolute rule:</span> if the Daily is bullish and the H1 shows a sell signal, you don&apos;t go short. You wait for the next aligned buy signal.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">How to analyze in 5 seconds</p>
        <h2 className="text-lg font-semibold text-white mb-4">Check the alignment of timeframes</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Daily — what's the trend?", d: "Bullish = look for buys. Bearish = look for sells. Range = no directional trade." },
            { n: "2", t: "H4 — is price on a key zone?", d: "Support in an uptrend = potential buy. Resistance in a downtrend = potential sell. If not → wait." },
            { n: "3", t: "M15 — is there a signal?", d: "Pin bar, engulfing in the direction of the Daily on the H4 zone = entry. If the signal goes against the Daily → ignore." },
          ].map((item) => (
            <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-4">{item.n}</span>
              <div>
                <p className="text-sm font-medium text-white">{item.t}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-3">What you should do</p>
        <h2 className="text-lg font-semibold text-white mb-4">Based on timeframe alignment</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✓</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Daily + H4 + M15 aligned</p>
              <p className="text-xs text-zinc-400 mt-0.5">This is the high-probability setup, a confirmation to weigh within your own trading plan, not an automatic entry order. Daily bias confirmed by the H4 zone, M15 signal in the same direction.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-400/5 border border-amber-400/15 rounded-xl px-4 py-3">
            <span className="text-lg">~</span>
            <div>
              <p className="text-sm font-semibold text-amber-400">Daily aligned, H4 not on a zone yet</p>
              <p className="text-xs text-zinc-400 mt-0.5">You don&apos;t enter yet. You wait for price to come back to an H4 zone in the direction of the Daily. Patience is a position.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✗</span>
            <div>
              <p className="text-sm font-semibold text-red-400">M15 signal against the Daily</p>
              <p className="text-xs text-zinc-400 mt-0.5">You ignore it. A lower timeframe that goes against the higher one is a pullback, not a reversal. Never trade against the Daily bias.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Classic mistake</p>
        <p className="text-sm font-semibold text-white mb-2">Entering on an M15 signal without checking the Daily</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          You look at EUR/USD on M15. You spot a clean bearish engulfing. You sell. Except the Daily is bullish and price is on an H4 support. You just entered exactly against the flow. Price resumes higher and you lose. The rule: before any signal, always check the Daily first. Always.
        </p>
      </section>

      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Summary in 3 seconds</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Daily + H4 + M15 aligned → you enter</p>
          <p className="text-zinc-200"><span className="text-amber-400 font-bold mr-2">~</span>Daily clear, H4 not on a zone yet → you wait</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>M15 signal against the Daily → you ignore</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Review</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Always analyze from the higher timeframe down to the lower one, the Daily defines the bias, the M15 refines the entry.",
          "A signal on the lower timeframe that contradicts the higher one should be ignored.",
          "Weekly/Daily = context and trend. H4 = zones. H1/M15 = timing and signal.",
          "All 3 timeframes must tell the same story for a setup to be high-probability.",
          "The lower you go in timeframes, the more precision you gain, but the bias always comes from the higher one.",
        ]}
      />

      <LessonExercice
        description="On TradingView, run a full top-down analysis on EUR/USD."
        steps={[
          "Open EUR/USD on the Daily — what's the trend? Bullish, bearish or range? Note your bias.",
          "Drop down to H4, identify the 2 most important zones (support or resistance depending on the trend). Note the exact prices.",
          "Drop down to H1 — is price near one of those H4 zones? Is there an emerging signal in the direction of the Daily?",
          "Drop down to M15, if the H1 signal is present, does the M15 confirm it? Note whether all 3 timeframes align or contradict each other.",
        ]}
      />

      <LessonQuiz
        question="EUR/USD is clearly bullish on the Daily. You switch to H1 and see a clean bearish engulfing on an H1 resistance. What do you do?"
        options={[
          "You take the Short on H1, the signal is clean and recent",
          "You ignore the H1 signal, it goes against the Daily trend, you wait for an aligned buy signal",
          "You wait for the Daily to turn back down to confirm before entering",
          "You take the Short but with a half-size position to limit the risk",
        ]}
        correctIndex={1}
        explanation="In multi-timeframe analysis, the higher timeframe always wins. If the Daily is bullish, you look for buys, not sells. The bearish H1 signal is probably a pullback within the bullish Daily trend, exactly where you might look for a Long."
        answerExplanations={[
          "Wrong. Trading an H1 signal against a strong Daily trend is statistically unfavorable. You're going against the dominant direction, even if the technical signal looks clean.",
          "Correct. The top-down rule is clear: the Daily defines the bias. If Daily = bullish, you only look for buys. The bearish H1 signal means price is in a pullback. That's exactly where you look for a buy, not a sell.",
          "Partially valid but too conservative. Waiting for the Daily to reverse is a very slow approach. In practice, a bearish H1 signal within a bullish Daily trend is a temporary pullback, not a reversal signal.",
          "Wrong. Reducing the size doesn't change the core problem: you're trading against the dominant trend. Position size manages risk, it doesn't make up for a bad direction.",
        ]}
      />

    </LessonPage>
  );
}
