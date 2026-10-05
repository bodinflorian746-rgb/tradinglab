import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { ConfluenceDiagram } from "@/app/components/charts/ConfluenceDiagram";

export default function ContentEn() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon5"
      title="Confluences and probability"
      subtitle="A single signal is a gamble. Three signals lined up on the same level is a built trade. The difference is your probability of success."
      duration="20 min"
      lessonNumber={5}
      prev={{ href: "/formations/intermediaire/lecon4", label: "Lesson 4: Trends" }}
      next={{ href: "/formations/intermediaire/lecon6", label: "Lesson 6: Fake Breakout" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">What you should see on the chart</p>
        <h2 className="text-lg font-semibold text-white mb-4">When confluences line up</h2>
        <p className="text-zinc-300 text-sm leading-relaxed mb-4">
          You open EUR/USD on H4. You see: price is sitting on a historical support → AND it's also the last Higher Low in an uptrend → AND a 61.8% Fibonacci level points to the same zone. Three independent reasons in the same spot. <strong className="text-white">That's a confluence.</strong>
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400">
            <span className="text-white font-medium">Core rule:</span> never enter on a single reason. Each additional independent confluence raises the probability, and lowers the risk of entering in the wrong direction.
          </p>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <ConfluenceDiagram locale="en" />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">The confluences to combine</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Each category brings a different type of information. It's their combination that creates value, not their number alone.
        </p>
        <div className="space-y-2.5">
          {[
            { label: "Trend (market structure)", detail: "The dominant direction: bullish or bearish. It's the foundation. Check the Daily first.", color: "bg-emerald-500/5 border-emerald-500/15 text-emerald-400" },
            { label: "S/R or SD zone", detail: "A level where price has already reacted. An old support, a resistance, or a Demand/Supply zone.", color: "bg-blue-500/5 border-blue-500/15 text-blue-400" },
            { label: "Fibonacci level", detail: "38.2%, 50% or 61.8% of the last impulsive move. Often lines up with an S/R: that's where the power is.", color: "bg-blue-500/5 border-blue-500/15 text-blue-400" },
            { label: "Psychological level", detail: "1.1000, $45,000, $2,000... Traders naturally place stops and orders on round numbers.", color: "bg-amber-400/5 border-amber-400/15 text-amber-400" },
            { label: "Candle signal (trigger)", detail: "Pin bar, engulfing, rejection. It's the trigger: not the reason to enter. The reason is the confluences above.", color: "bg-zinc-800/50 border-zinc-700/50 text-zinc-300" },
          ].map((item, i) => (
            <div key={i} className={`rounded-xl px-4 py-3 border ${item.color}`}>
              <p className="text-sm font-semibold mb-1">{item.label}</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Full scenario: 4 confluences aligned</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Here's how to build a high-probability trade, step by step.
        </p>
        <div className="space-y-2">
          {[
            { step: "1", text: "Daily bullish (HH/HL), your bias: buys only." },
            { step: "2", text: "H4: price pulls back to the last Higher Low at 1.0850." },
            { step: "3", text: "1.0850 lines up with a historical support respected 2× in the past." },
            { step: "4", text: "61.8% Fibonacci of the last impulsive move = 1.0848." },
            { step: "✓", text: "M15: a bullish pin bar forms in the zone. Signal validated. You enter a buy." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className={`text-xs font-bold shrink-0 mt-0.5 w-5 ${item.step === "✓" ? "text-emerald-400" : "text-emerald-400/60"}`}>{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400">
            <span className="text-white font-medium">Result:</span> 4 independent confluences on the same level. Entry at 1.0851, SL at 1.0835, TP at 1.0950. R/R = 1:6.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">How to analyze in 5 seconds</p>
        <h2 className="text-lg font-semibold text-white mb-4">Count your confluences before entering</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "What's the trend?", d: "Daily bullish → buys. Bearish → sells. No trend → no trade." },
            { n: "2", t: "Is there a structure level in my zone?", d: "S/R, Higher Low, SD zone? If yes, first confluence validated." },
            { n: "3", t: "Is there a second independent confluence?", d: "Fibonacci? Psychological level? If yes, the trade is qualified. If not, we wait." },
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
        <h2 className="text-lg font-semibold text-white mb-4">The confluence rule</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✓</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">3+ confluences aligned + candle signal</p>
              <p className="text-xs text-zinc-400 mt-0.5">You enter. It's a high-probability trade. Logical SL below/above the zone. TP toward the next structure zone.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-400/5 border border-amber-400/15 rounded-xl px-4 py-3">
            <span className="text-lg">~</span>
            <div>
              <p className="text-sm font-semibold text-amber-400">2 confluences + candle signal</p>
              <p className="text-xs text-zinc-400 mt-0.5">You can enter with a reduced size. The trade is possible but less solid. Make sure the trend is aligned.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✗</span>
            <div>
              <p className="text-sm font-semibold text-red-400">1 confluence only</p>
              <p className="text-xs text-zinc-400 mt-0.5">You don't trade. A single signal = a gamble. Wait for other confluences to stack up or move on to the next opportunity.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Classic mistake</p>
        <p className="text-sm font-semibold text-white mb-2">Counting redundant confluences as independent confluences</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          You see: RSI oversold + MACD crossed + Stochastic low. You think &quot;3 confluences&quot;. But these 3 indicators use the same price data, they all say the same thing in 3 different ways. 3 indicators = 1 single confluence. Real confluences are independent: trend, S/R, Fibonacci, psychological level.
        </p>
      </section>

      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Recap in 3 seconds</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>3+ confluences + signal → you enter (normal size)</p>
          <p className="text-zinc-200"><span className="text-amber-400 font-bold mr-2">~</span>2 confluences + signal → reduced size, keep looking</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>1 confluence only → you don't trade</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Review</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Confluence = an independent reason that backs your trade. Minimum 2-3 before entering.",
          "The 5 main ones: trend, S/R, SD zone, Fibonacci, psychological level.",
          "The candle signal is the trigger, not the main reason to enter.",
          "Indicators (RSI, MACD) are not independent confluences from each other.",
          "Quality beats quantity: 3 solid confluences are worth more than 6 mediocre ones.",
        ]}
      />

      <LessonExercice
        description="On TradingView, build a complete setup with at least 3 confluences on EUR/USD."
        steps={[
          "Analyze EUR/USD on the Daily, what's the trend? Note your bias (buy or sell only).",
          "Drop down to H4, identify the next key structure level (HL in an uptrend, LH in a downtrend).",
          "Check: is there a historical S/R or an SD zone that lines up with that level? Note the confluence.",
          "Draw Fibonacci on the last impulsive move, does a Fib level line up with your zone? If yes, 3 confluences aligned. Note the entry, the SL and the TP with the R/R.",
        ]}
      />

      <LessonQuiz
        question="You see EUR/USD Daily bullish. Price pulls back to 1.0850. It's also a historical support respected 2×. No other confluence. What do you do?"
        options={[
          "You buy immediately, 2 confluences (trend + support) are plenty",
          "You wait for a rejection candle signal at 1.0850 before entering",
          "You look for a 3rd confluence (Fibonacci, psychological level) then a candle signal",
          "You don't enter, 2 confluences is too little for a trade",
        ]}
        correctIndex={2}
        explanation="2 confluences are a start, but not yet enough to enter with confidence. You look for a 3rd confluence (61.8% Fibonacci? Psychological level 1.0850?) then you wait for a candle signal in the zone. That's the full process."
        answerExplanations={[
          "Too hasty. 2 confluences without a confirmation signal means entering too early. Price can keep dropping in the zone. Wait at least for a candle signal on the level.",
          "Better, but incomplete. Waiting for the signal is good practice, but looking for a 3rd confluence first strengthens the trade even more. Combining both is the optimal method.",
          "Correct. You have 2 solid confluences. Check whether a Fibonacci level (61.8% of the move) or a psychological level lines up with 1.0850, if yes, you have 3 confluences. Then you wait for the candle signal. That's the full process.",
          "Not quite. 2 confluences can justify a trade with reduced size. 3 confluences + signal = normal size. It's not skipping the trade that's recommended, but adding a 3rd confirmation.",
        ]}
      />

    </LessonPage>
  );
}
