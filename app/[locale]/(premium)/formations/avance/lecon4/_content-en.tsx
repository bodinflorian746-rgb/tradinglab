import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { KillzonesDiagram } from "@/app/components/charts/KillzonesDiagram";

export default function ContentEn() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon4"
      title="Killzones, the sessions that matter"
      subtitle="The market doesn't move uniformly. There are precise time windows where institutional activity peaks, and that's where the best setups form."
      duration="20 min"
      lessonNumber={4}
      prev={{ href: "/formations/avance/lecon3", label: "Lesson 3: Order Blocks" }}
      next={{ href: "/formations/avance/lecon5", label: "Lesson 5: OTE" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Why timing is critical</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Most traders analyze <em>what</em> to trade, but ignore <em>when</em> to trade. Yet institutions operate on precise schedules tied to the openings of the major financial centers. Outside those windows, the market is dominated by retail traders, and the moves are less reliable, more random.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Killzone:</span> a time window where institutional activity is concentrated. Prices move with more force, levels are more respected, and fakeouts are less frequent.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">The 4 main Killzones</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          These times are in Paris time (CET/CEST). Adjust for daylight saving time and your local time zone.
        </p>
        <div className="space-y-3">
          {[
            {
              name: "Asian Killzone",
              hours: "1am – 4am",
              color: "bg-blue-500/5 border-blue-500/15 text-blue-400",
              detail: "Asian session (Tokyo). Low volume, the market often accumulates. The levels formed here serve as a reference for the European and American sessions. Useful for spotting overnight manipulation (NY Midnight Open).",
            },
            {
              name: "London Killzone",
              hours: "7am – 10am",
              color: "bg-emerald-500/5 border-emerald-500/15 text-emerald-400",
              detail: "London open, one of the most powerful windows. European institutions enter the market. You'll often see a liquidity sweep followed by a strong directional move. This is where the highs or lows of the day form.",
            },
            {
              name: "New York Killzone",
              hours: "1pm – 4pm",
              color: "bg-emerald-500/5 border-emerald-500/15 text-emerald-400",
              detail: "New York open, the most volatile. Overlaps with London for 1 to 2 hours: maximum liquidity. The major economic releases drop at 1:30pm or 3pm. The moves here are fast and powerful.",
            },
            {
              name: "London Close",
              hours: "4pm – 5pm",
              color: "bg-blue-500/5 border-blue-500/15 text-blue-400",
              detail: "London close. European institutions liquidate or adjust their positions. You'll often see a reversal or a pullback move. Useful for exits and partial profit-taking.",
            },
          ].map((kz, i) => (
            <div key={i} className={`rounded-xl p-4 border ${kz.color}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">{kz.name}</p>
                <span className="text-xs font-mono text-zinc-400">{kz.hours}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{kz.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <KillzonesDiagram locale="en" />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">How to use the Killzones</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          The Killzones structure your trading day. They tell you when to be in front of the screen, and above all when not to trade.
        </p>
        <div className="space-y-2.5">
          {[
            {
              label: "Analyze before the Killzone",
              detail: "Identify your key zones (OB, FVG, liquidity) BEFORE the open. Enter the Killzone with a plan already defined.",
            },
            {
              label: "Watch the first 15 minutes",
              detail: "The very first candle of the session often sets the direction. A liquidity sweep followed by a reversal in the first 15 min is a classic signal.",
            },
            {
              label: "Don't enter mid-Killzone",
              detail: "The best entry time is near the start of the Killzone. Right in the middle, you risk entering at the wrong time.",
            },
            {
              label: "Avoid the dead hours",
              detail: "Between 10am and 1pm (after London and before NY), liquidity drops. Fakeouts are far more frequent.",
            },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-emerald-400 shrink-0 mt-0.5">
                <path d="M2 7l3.5 3.5 6.5-6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
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
          "Killzones are the time windows of maximum institutional activity.",
          "London Killzone (7am–10am) and NY Killzone (1pm–4pm) are the most important for Forex.",
          "Analyze and plan BEFORE the open, enter the Killzone with a plan, not with questions.",
          "The dead hours (10am–1pm) are treacherous: low liquidity, random moves.",
          "The Asian Session (1am–4am) often forms the levels that London and NY come to hunt.",
        ]}
      />

      <LessonExercice
        description="Watch a full trading day in real time, focusing on the Killzones."
        steps={[
          "On TradingView, open EUR/USD on M15. Add vertical lines at 7am and 10am (London KZ) and at 1pm and 4pm (NY KZ).",
          "Identify the liquidity levels from the previous evening (EQH, EQL, OB). Mark them on the chart.",
          "At the London KZ open (7am), watch: is there a sweep of an overnight level? Followed by a reversal?",
          "Repeat at 1pm for the NY KZ. Note the difference in volatility between the Killzones and the dead hours.",
        ]}
      />

      <LessonQuiz
        question="You want to trade EUR/USD. It's 11:30am (Paris time). What do you do?"
        options={[
          "You trade normally, the market is still open and active",
          "You wait for the NY Killzone (1pm), current liquidity is too low for reliable setups",
          "You drop to M5 to catch the micro-moves of this dead hour",
          "You trade range breakouts, the dead hours are ideal for breakouts",
        ]}
        correctIndex={1}
        explanation="11:30am is right in the middle of the dead hours, after the London Killzone close and before the New York open. Institutional liquidity is minimal, moves are random and fakeouts are plentiful. The disciplined decision is to wait for the NY Killzone at 1pm."
        answerExplanations={[
          "False. The market is open, but that's not enough to trade. The dead hours (10am–1pm) have very low institutional liquidity, the moves lack direction and fakeouts are everywhere.",
          "Correct. By waiting for the NY Killzone, you make sure you're trading in a window where institutional activity is strong, moves are directional and setups are more reliable.",
          "False. Dropping to M5 during the dead hours amplifies the problem, the noise is even stronger on small timeframes when liquidity is low.",
          "False. The dead hours are not ideal for breakouts, they're known for fakeouts precisely because institutional volume is missing to confirm the breaks.",
        ]}
      />

    </LessonPage>
  );
}
