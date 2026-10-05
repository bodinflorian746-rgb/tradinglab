import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { TrendDiagram } from "@/app/components/charts/TrendDiagram";
import { RetracementInteractive } from "@/app/components/charts/RetracementInteractive";

export default function ContentEn() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon4"
      title="Trends: trade in the direction of the market"
      subtitle="90% of losing traders trade against the trend without knowing it. Learning to read the dominant direction means putting the odds on your side before you even open a trade."
      duration="18 min"
      lessonNumber={4}
      prev={{ href: "/formations/intermediaire/lecon3", label: "Lesson 3: Supply & Demand" }}
      next={{ href: "/formations/intermediaire/lecon5", label: "Lesson 5: Confluences" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">What you should see on the chart</p>
        <h2 className="text-lg font-semibold text-white mb-4">Read the trend in 3 seconds</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">Uptrend</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              The chart &quot;climbs like a staircase&quot;. You see: a move up → a small pullback → a higher move up → an even higher small pullback. Each wave goes higher than the last. <strong className="text-white">You look for buys, only on the pullbacks.</strong>
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-2">Downtrend</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              The chart &quot;steps down like a staircase&quot;. Each bounce is lower than the previous one. <strong className="text-white">You look for sells, only on the bounces.</strong>
            </p>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-zinc-300 mb-2">Range</p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Price moves back and forth between two horizontal levels. Neither buyers nor sellers are clearly winning. No directional trade, wait.
            </p>
          </div>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <TrendDiagram locale="en" />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Test your instinct</p>
        <h2 className="text-lg font-semibold text-white mb-4">When do you enter?</h2>
        <p className="text-zinc-300 text-sm leading-relaxed mb-4">
          Price is in an uptrend. It pulls back to the Higher Low. At that exact point — what do you do?
        </p>
        <RetracementInteractive locale="en" />
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Identify the trend correctly</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          The trend depends on the timeframe. A market can be bullish on the Daily and bearish on H1. The rule: the higher timeframe defines the bias. You trade in its direction.
        </p>
        <div className="space-y-2.5">
          {[
            { label: "Daily or H4: the main bias", detail: "This is the trend you must respect. If the Daily is bullish, you look only for buys." },
            { label: "H1: the entry zones", detail: "In a Daily uptrend, H1 shows the pullbacks (corrections). These are your entry windows." },
            { label: "M15: the precise timing", detail: "On M15, you look for the final signal (rejection, pin bar, engulfing). It's the trigger for the entry." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span style={{ fontSize: 9, fontWeight: 700, color: "#10b981" }}>{i + 1}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Real scenario: trading the pullback</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          This is the basic trend setup: wait for price to come back to a structure level, then enter in the direction of the trend.
        </p>
        <div className="space-y-2">
          {[
            { step: "Situation", text: "EUR/USD Daily bullish. Price has just made a new HH at 1.0950. It starts to correct.", color: "text-zinc-400" },
            { step: "Wait", text: "You identify the last Higher Low at 1.0850. You wait for price to drop back to this zone.", color: "text-zinc-400" },
            { step: "Signal", text: "Price reaches 1.0850. You switch to H1. A bullish pin bar forms. Signal confirmed.", color: "text-emerald-400" },
            { step: "Entry", text: "You buy with SL below 1.0800 (under the HL) and TP toward 1.0950 (toward the HH). R/R = 1:2.", color: "text-emerald-400" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className={`text-xs font-bold shrink-0 mt-0.5 w-12 ${item.color}`}>{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">How to analyze in 5 seconds</p>
        <h2 className="text-lg font-semibold text-white mb-4">Check the trend before every trade</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Open the Daily", d: "Look at the overall direction: are the highs and lows moving up or down?" },
            { n: "2", t: "Note your bias: buys or sells", d: "Bullish = buys only. Bearish = sells only. Range = no trade." },
            { n: "3", t: "Drop to H4 — where is the last HL or LH?", d: "That's where you'll watch to enter. The pullback must reach this zone." },
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
        <h2 className="text-lg font-semibold text-white mb-4">The logic according to the trend</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↑</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Uptrend</p>
              <p className="text-xs text-zinc-400 mt-0.5">You only buy on the pullbacks (corrections). Never on the impulses. You wait for price to come back to a HL before entering.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↓</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Downtrend</p>
              <p className="text-xs text-zinc-400 mt-0.5">You only enter a sell on the bounces. Never on the bearish impulses. You wait for a LH to sell.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-zinc-800/40 border border-zinc-700/40 rounded-xl px-4 py-3">
            <span className="text-lg">—</span>
            <div>
              <p className="text-sm font-semibold text-zinc-300">Range</p>
              <p className="text-xs text-zinc-400 mt-0.5">No directional trade. If you want to trade the range, you buy the bottom and sell the top, but that's advanced. For now, avoid it.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Classic mistake</p>
        <p className="text-sm font-semibold text-white mb-2">Entering a sell in an uptrend &quot;because price has gone up too far&quot;</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          EUR/USD has been in an uptrend for 2 weeks. Price keeps rising. You tell yourself &quot;it can't keep going, I'll sell&quot;. You enter a short. Price goes up another 200 pips. An uptrend can last for weeks. Never trade &quot;against&quot; it because you think it's &quot;too high&quot; or &quot;too low&quot;. The market is always right.
        </p>
      </section>

      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Recap in 3 seconds</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Daily bullish → you buy only on the pullbacks (HL)</p>
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Daily bearish → you sell only on the bounces (LH)</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>Range / uncertain direction → no directional trade</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Review</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Uptrend = HH+HL. Buys only on the pullbacks.",
          "Downtrend = LH+LL. Sells only on the bounces.",
          "The Daily defines the bias. H4 gives the zones. M15 gives the entry.",
          "Never enter against the trend without a solid structural reason.",
          "A pullback within a trend = an opportunity. Not a reversal signal.",
        ]}
      />

      <LessonExercice
        description="On TradingView, identify the trend on 3 different markets and plan an entry."
        steps={[
          "Open EUR/USD, GBP/USD and BTC/USD on the Daily. For each one, note: bullish, bearish or range?",
          "On the bullish pair: identify the last 3 Higher Lows. That's where you'd look to buy.",
          "Drop to H4 on that pair. Is price currently in a pullback or in an impulse?",
          "If price is in a pullback at a HL, drop to H1 and wait for a candle signal. Note the zone, the logical SL and the TP.",
        ]}
      />

      <LessonQuiz
        question="EUR/USD is clearly bullish on the Daily (HH/HL). Price has just made a new high at 1.0950 and is now pulling back. It drops toward 1.0860 (last Higher Low). You see a bullish pin bar at that level on H1. What do you do?"
        options={[
          "You wait some more, maybe the pullback will continue down to 1.0800",
          "You buy on the pin bar, SL below 1.0850, TP toward 1.0990",
          "You sell, price is dropping, it's a sign of weakness",
          "You do nothing, the market is too uncertain right now",
        ]}
        correctIndex={1}
        explanation="Every element is aligned: Daily uptrend, pullback to the last HL, confirmation signal (pin bar). This is the trend setup par excellence. You enter a buy with SL below the HL and TP toward the break of the last HH."
        answerExplanations={[
          "Too cautious. You have 3 elements aligned: trend, structure level, signal. This is exactly the setup you were waiting for. Waiting longer for no reason means letting a valid opportunity slip away.",
          "Correct. Uptrend + pullback to a HL + pin bar signal = high-probability setup. SL at 1.0810 (below the HL at 1.0860), TP toward the next HH (1.0960). R/R of roughly 1:2.",
          "Wrong. Price dropping toward a HL in an uptrend is a normal pullback, a correction. It's not weakness. It's the buy opportunity you were waiting for.",
          "Wrong. Uncertainty doesn't justify inaction when the setup is clearly defined. Trend + structure + signal = valid trade. Uncertainty is always present; risk management (SL + size) takes care of it.",
        ]}
      />

    </LessonPage>
  );
}
