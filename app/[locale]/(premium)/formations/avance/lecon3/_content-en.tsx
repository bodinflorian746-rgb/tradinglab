import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { OrderBlockDiagram } from "@/app/components/charts/OrderBlockDiagram";

export default function ContentEn() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon3"
      title="Order Blocks"
      subtitle="An Order Block is the last candle before an institutional impulsive move. That's where institutions placed their orders, and where price often comes back to find them."
      duration="24 min"
      lessonNumber={3}
      prev={{ href: "/formations/avance/lecon2", label: "Lesson 2: Fair Value Gap" }}
      next={{ href: "/formations/avance/lecon4", label: "Lesson 4: Killzones" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">What is an Order Block?</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          When an institution places a massive order (buy or sell), it can't fill it all at once, the market doesn't have enough liquidity. It splits its orders across several candles, then launches the move. The last candle before that impulsive move is called an <span className="text-white font-medium">Order Block (OB)</span>.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          When price comes back into that OB zone during a pullback, the remaining institutional orders fire, which often creates a powerful bounce.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">In short:</span> an OB is a zone where institutions left unfilled orders. Price comes back to fill them, it's a potential zone of interest, not an automatic entry: further confirmation is still needed, and the decision depends on your own trading plan.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Identifying a valid Order Block</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Not every cluster of candles is an Order Block. For an OB to be valid, it has to meet precise criteria.
        </p>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="font-semibold text-emerald-400 text-sm mb-2">Bullish Order Block</p>
            <ul className="space-y-1.5">
              <li className="text-xs text-zinc-400 leading-relaxed">— Last <span className="text-white">bearish</span> candle before an impulsive bullish move</li>
              <li className="text-xs text-zinc-400 leading-relaxed">— The move that follows must create a bullish BOS (Break of Structure)</li>
              <li className="text-xs text-zinc-400 leading-relaxed">— The OB zone = body of that bearish candle (open → close)</li>
              <li className="text-xs text-zinc-400 leading-relaxed">— Potential zone of interest to buy when price comes back into that zone on a pullback, not a signal on its own</li>
            </ul>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <p className="font-semibold text-red-400 text-sm mb-2">Bearish Order Block</p>
            <ul className="space-y-1.5">
              <li className="text-xs text-zinc-400 leading-relaxed">— Last <span className="text-white">bullish</span> candle before an impulsive bearish move</li>
              <li className="text-xs text-zinc-400 leading-relaxed">— The move that follows must create a bearish BOS</li>
              <li className="text-xs text-zinc-400 leading-relaxed">— The OB zone = body of that bullish candle (open → close)</li>
              <li className="text-xs text-zinc-400 leading-relaxed">— Potential zone of interest to sell when price comes back into that zone, not a signal on its own</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <OrderBlockDiagram locale="en" />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">OB vs &quot;mitigated&quot; Order Block</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          An Order Block is only valid once. When price comes back and reacts, the OB is said to be <span className="text-white font-medium">&quot;mitigated&quot;</span>. After mitigation, the zone loses its institutional power, you should no longer treat a mitigated OB as a signal.
        </p>
        <div className="space-y-2">
          {[
            { step: "1", text: "OB formed (impulsive move creates the zone) → zone active, not mitigated" },
            { step: "2", text: "Price comes back into the OB → bullish or bearish reaction → OB mitigated" },
            { step: "3", text: "If price slices through the OB with no reaction → OB invalidated, remove it from your analysis" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-4">{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Order Block + confluences = institutional setup</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          An OB on its own isn't enough. Its power multiplies when it lines up with other institutional elements.
        </p>
        <div className="space-y-2.5">
          {[
            { label: "OB + FVG in the same zone", detail: "If a Fair Value Gap sits inside the Order Block zone, the confluence is extremely powerful." },
            { label: "OB + liquidity level", detail: "An OB sitting just below a BSL or SSL liquidity pool drastically increases the odds of a reaction." },
            { label: "OB + structure bias", detail: "In an uptrend, only trade Bullish OBs. The OB has to be in the direction of the dominant market." },
            { label: "Candle confirmation", detail: "Wait for a rejection at the OB (pin bar, engulfing) before entering. Don't enter the zone blindly." },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
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
          "An Order Block = last candle before an institutional impulsive move that creates a BOS.",
          "Bullish OB = last bearish candle before an impulsive rally. Bearish OB = the opposite.",
          "The OB zone is defined by the body (open → close) of the candle, not the wicks.",
          "An OB is valid only once: after mitigation it loses its power, stop trading it.",
          "The OB + FVG confluence is one of the most powerful combinations in Smart Money.",
        ]}
      />

      <LessonExercice
        description="On TradingView, identify active Order Blocks on EUR/USD on H1."
        steps={[
          "Look for a recent impulsive bullish move (a series of directional candles with no pullback). Mark the candle that comes before it.",
          "Check: is that candle bearish? If so, it's a potential Bullish Order Block. Note its open and close levels.",
          "Has price come back into the zone since? If so, was there a reaction (bounce)? Is the OB mitigated or still active?",
          "Repeat the exercise for a bearish move, find a Bearish Order Block.",
        ]}
      />

      <LessonQuiz
        question="You spot an impulsive bullish move on the chart. The candle right before that move is bearish. What does it represent?"
        options={[
          "A sell signal, the bearish candle means the market is going to drop",
          "A Bullish Order Block, it's the zone where institutions placed their buy orders",
          "A Fair Value Gap, there were no trades at that level",
          "A classic support/resistance level with no institutional meaning",
        ]}
        correctIndex={1}
        explanation="The last bearish candle before an impulsive bullish move is a Bullish Order Block. Paradoxically, it's a bearish candle that marks an institutional buy zone, the institutions absorbed the selling pressure in that candle before launching their bullish move."
        answerExplanations={[
          "Wrong. The candle's direction on its own isn't the signal, its context is. A bearish candle preceding an impulsive bullish move is a Bullish OB, not a sell signal.",
          "Correct. That's exactly the definition of a Bullish Order Block. The last directionally opposite candle before an impulsive move marks the zone where institutions filled their orders.",
          "Wrong. An FVG is defined across 3 candles and concerns a price zone that wasn't traded. The Order Block is the candle itself (its body), not a gap between candles.",
          "Wrong. It's not a plain S/R, it's an institutional zone with resting orders. The difference is fundamental: OBs have a trigger logic that classic S/R levels don't have.",
        ]}
      />

    </LessonPage>
  );
}
