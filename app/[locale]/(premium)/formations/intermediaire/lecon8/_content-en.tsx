import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { TradePlanDiagram } from "@/app/components/charts/TradePlanDiagram";

export default function ContentEn() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon8"
      title="Trade plan"
      subtitle="A trade without a plan is an emotional decision. The trade plan turns your analysis into precise actions, and removes improvisation at the worst possible moment."
      duration="20 min"
      lessonNumber={8}
      prev={{ href: "/formations/intermediaire/lecon7", label: "Lesson 7: Multi-Timeframe" }}
      next={{ href: "/formations/intermediaire/lecon9", label: "Lesson 9: Fibonacci" }}
    >

      {/* ── What you must SEE ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">What you must see on the chart</p>
        <h2 className="text-lg font-semibold text-white mb-4">The difference between trading with and without a plan</h2>
        <div className="space-y-3">
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-2">Without a plan, what actually happens</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              EUR/USD rises fast. You see +30 pips in 10 minutes. You enter on FOMO at 1.0980. Price pulls back to 1.0960. You hold &quot;because it&apos;ll go back up&quot;. It drops to 1.0940. You panic and cut. Price runs to 1.1020 without you. You lost 40 pips and the trade you were waiting for.
            </p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">With a plan, the same day</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              You had identified 1.0850 as a buy zone in the morning. You watch price rise without you, stress-free. It retraces to 1.0853. Pin bar on your zone. You enter exactly as planned. SL at 1.0835, TP at 1.0950. You improvise nothing. <strong className="text-white">You execute.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── Why a plan ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Why a trade plan is essential</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Most traders lose not because they lack knowledge, but because they make decisions in the heat of the moment. A trade plan forces you to decide BEFORE emotion comes into play, when you&apos;re calm, clear-headed and objective.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400">
            <span className="text-white font-medium">Core rule:</span> everything you&apos;re going to do during a trade must be decided before you enter. SL, TP, size, set in advance, never changed under emotion.
          </p>
        </div>
      </section>

      {/* ── The 6 elements ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">The elements of a complete trade plan</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          A good trade plan answers 6 questions before each session.
        </p>
        <div className="space-y-2.5">
          {[
            { q: "What is my bias?", r: "Bullish, bearish or neutral (no trade). Based on the Daily analysis." },
            { q: "What are my key levels?", r: "The support/resistance zones, SD zones and important structures for the session." },
            { q: "On what condition do I enter?", r: "The precise trigger: 'If price comes back to 1.0850 and forms a rejection, I buy'." },
            { q: "Where is my Stop Loss?", r: "Level defined in advance, logical on the chart, not to be changed once the trade is open." },
            { q: "Where is my Take Profit?", r: "Target based on market structure. R/R of at least 1:2." },
            { q: "What is my daily stop rule?", r: "If I lose X% today, I stop. Protects against revenge trading." },
          ].map((item, i) => (
            <div key={i} className="bg-zinc-800/40 rounded-xl px-4 py-3">
              <p className="text-sm font-semibold text-white mb-1">{item.q}</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.r}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <TradePlanDiagram locale="en" />
      </div>

      {/* ── Trading journal ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">The trading journal: what truly makes you improve</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          The journal is the record of every trade. It lets you identify your winning patterns, your recurring mistakes, and improve in a structured way.
        </p>
        <div className="space-y-2.5">
          {[
            { label: "Before the trade", detail: "Bias, levels, expected trigger, SL/TP, confluences. Why you take this trade." },
            { label: "After the trade", detail: "Result in R (gain/loss), what happened, did you respect the plan, what would you do differently?" },
            { label: "Weekly review", detail: "Analysis of all the week's trades: win rate, average R, repeated mistakes, winning pattern." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-blue-400 shrink-0 mt-0.5">
                <rect x="2" y="1.5" width="10" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M4.5 5h5M4.5 7.5h5M4.5 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5 seconds ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">How to analyze in 5 seconds</p>
        <h2 className="text-lg font-semibold text-white mb-4">Check your plan before entering</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Is the trigger validated?", d: "Price is on my zone AND I have a candle signal. If not → I don't enter, no matter the temptation." },
            { n: "2", t: "Are my SL and TP defined?", d: "Exact entry price, SL below the zone, TP on the next structure. R/R above 1:2?" },
            { n: "3", t: "Is my daily rule respected?", d: "Have I already lost my daily loss limit? If yes → I close the platform." },
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

      {/* ── What you must do ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-3">What you must do</p>
        <h2 className="text-lg font-semibold text-white mb-4">The non-negotiable rules</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✓</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Trade within the plan → you execute</p>
              <p className="text-xs text-zinc-400 mt-0.5">The planned trigger happens on the planned zone. You enter with SL and TP already defined. No improvisation.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-400/5 border border-amber-400/15 rounded-xl px-4 py-3">
            <span className="text-lg">!</span>
            <div>
              <p className="text-sm font-semibold text-amber-400">Trade outside the plan → you pass</p>
              <p className="text-xs text-zinc-400 mt-0.5">An opportunity shows up but it wasn&apos;t in your plan. You pass. There will be other trades. Better to miss a trade than to lose on an impulse.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✗</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Moving the SL under emotion → never</p>
              <p className="text-xs text-zinc-400 mt-0.5">The trade goes against you. You want to move the SL &quot;to give it a chance&quot;. It&apos;s the most expensive mistake. If the SL is logical, you leave it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Classic mistake ── */}
      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Classic mistake</p>
        <p className="text-sm font-semibold text-white mb-2">Moving the SL &quot;to give it a chance&quot;</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          You&apos;re short on EUR/USD. SL at 1.0965. Price rises to 1.0960 — 5 pips from your SL. You tell yourself &quot;if I move it to 1.0980, it has more room&quot;. You move it. Price keeps going to 1.0975. You move it again to 1.0995. You go from a 15-pip loss to a 35-pip loss. The initial SL existed for a reason: the structure. Don&apos;t touch it once the trade is open.
        </p>
      </section>

      {/* ── Ultra-fast recap ── */}
      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Recap in 3 seconds</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Planned trigger on your zone → you execute the plan</p>
          <p className="text-zinc-200"><span className="text-amber-400 font-bold mr-2">!</span>Opportunity outside the plan → you pass (there will be other trades)</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>SL in place under pressure → you never move it</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Review</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "A trade plan is written BEFORE the session, never in real time under emotion.",
          "The 6 essential elements: bias, key levels, trigger, SL, TP, daily stop rule.",
          "The trading journal is the tool that lets you improve in a structured way.",
          "A trade that doesn't respect the plan is a mistake, even if it ends up winning.",
          "Discipline is executing the plan even when emotion suggests otherwise.",
        ]}
      />

      <LessonExercice
        description="Write your first complete trade plan for the next session on EUR/USD."
        steps={[
          "Analyze EUR/USD on Daily and H4, note your bias for tomorrow (bullish, bearish, or no trade).",
          "Identify 2 key zones where you could react. Write down the exact prices.",
          "For each zone, describe the exact trigger: 'If price reaches X and I see Y, then I enter at Z'.",
          "Define your SL (below the zone), your TP (next structure level), calculate the R/R and set your daily stop rule.",
        ]}
      />

      <LessonQuiz
        question="You're long on EUR/USD. SL at 1.0835. The trade goes against you, price drops to 1.0845, 10 pips from your SL. You think 'it'll go back up'. What do you do?"
        options={[
          "Move the SL to 1.0820 to give it more room",
          "Close the trade immediately, the market is going against your plan",
          "Keep the SL at 1.0835 and let the market decide, that's the plan's decision",
          "Add to your long position to improve your average entry price",
        ]}
        correctIndex={2}
        explanation="The SL was placed at 1.0835 for a structural reason, below the entry zone. The market can swing before going back in the right direction. Moving the SL means going from a defined loss to an unknown one. If the SL is logical, you let it do its job."
        answerExplanations={[
          "False. Moving the SL under emotion is one of the most expensive mistakes. You had 1.0835 for a structural reason. Moving it means accepting a bigger loss for no valid reason. Emotional pressure is not a technical reason.",
          "Partially valid. If the structure you had identified is clearly broken (not just 'going down'), closing can be justified. But if the SL hasn't been touched and the zone holds, the plan prevails.",
          "Correct. The plan was set outside of emotion. If the SL is logical on the chart, you leave it in place. Price can swing before moving on. That's exactly why the SL exists, to define your max loss without you having to decide under pressure.",
          "False. Adding to a losing position ('averaging down') increases your risk on a trade that's already going the wrong way. It's one of the most dangerous mistakes in trading, it turns small losses into big ones.",
        ]}
      />

    </LessonPage>
  );
}
