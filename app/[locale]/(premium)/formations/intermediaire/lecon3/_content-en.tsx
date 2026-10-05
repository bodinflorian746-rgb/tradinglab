import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { Candle } from "@/app/components/charts/Candle";
import { SupplyDemandDiagram } from "@/app/components/charts/SupplyDemandDiagram";

export default function ContentEn() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon3"
      title="Supply & Demand"
      subtitle="SD zones aren't magic lines, they're the scars left by institutions when they placed large orders. Price comes back there to execute the rest."
      duration="20 min"
      lessonNumber={3}
      prev={{ href: "/formations/intermediaire/lecon2", label: "Lesson 2: Key zones" }}
      next={{ href: "/formations/intermediaire/lecon4", label: "Lesson 4: Trends" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">What you should see on the chart</p>
        <h2 className="text-lg font-semibold text-white mb-4">Spotting an SD zone without hesitation</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">Demand zone (buy)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Price drifts down slowly → enters a zone → BOOM, one or two big bullish candles explode upward. <strong className="text-white">That zone = Demand.</strong> Institutions bought heavily there. When price comes back, their remaining orders get triggered.
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-2">Supply zone (sell)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Price drifts up slowly → enters a zone → BOOM, a big bearish candle explodes downward. <strong className="text-white">That zone = Supply.</strong> Institutions sold heavily there. When price returns, their leftover orders get executed.
            </p>
          </div>
        </div>
        <div className="mt-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-3 py-2">
          <p className="text-xs text-zinc-400"><span className="text-white font-medium">Key tell:</span> the move out of the zone is always IMPULSIVE, strong, fast, few wicks. If the move out is slow, it's not a valid SD zone.</p>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <SupplyDemandDiagram />
      </div>

      <div className="border border-zinc-800 rounded-2xl p-5">
        <div className="flex justify-around items-start pt-4 mt-2 border-t border-zinc-800/50">
          <Candle type="bullish" label="Demand signal" caption="Bullish rejection in the zone" />
          <Candle type="bearish" label="Supply signal" caption="Bearish rejection in the zone" />
        </div>
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">How to draw a valid SD zone</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          An SD zone is drawn on the consolidation candles right before the impulsive move out, not on the move itself. The zone = where the orders were placed. The move out = the proof they were executed.
        </p>
        <div className="space-y-2">
          {[
            { n: "1", t: "Identify the impulsive move out", d: "One or several big candles in the same direction, few wicks. That's the signal an institution acted." },
            { n: "2", t: "Go back just before that move", d: "You'll often find 1 to 3 consolidation candles (small candles). That's where the zone starts." },
            { n: "3", t: "Draw your rectangle on that consolidation", d: "From the bottom to the top of the last candle before the move out. That's your SD zone." },
            { n: "4", t: "Check that the zone is still fresh", d: "If price has already returned to the zone several times, it's weaker. An untested zone = a strong zone." },
          ].map((item) => (
            <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-emerald-400 shrink-0 mt-0.5 w-4">{item.n}</span>
              <div>
                <p className="text-sm font-medium text-white">{item.t}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">SD vs S/R: the difference in practice</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          The two look similar but their logic is different. In practice, they complement each other, an SD zone that lines up with an S/R level is a powerful confluence.
        </p>
        <div className="space-y-2.5">
          <div className="bg-zinc-800/50 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-white mb-1">Support &amp; Resistance</p>
            <p className="text-xs text-zinc-500 leading-relaxed">Based on repeated reactions. Price bounced several times → important zone. The more it gets touched, the more likely it gives way.</p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-white mb-1">Supply &amp; Demand</p>
            <p className="text-xs text-zinc-500 leading-relaxed">Based on the origin of the move. A single impulsive reaction is enough. The fresher the zone (untested), the more powerful it is.</p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">How to analyze in 5 seconds</p>
        <h2 className="text-lg font-semibold text-white mb-4">Spot an SD zone fast</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Look for the big impulsive moves on the chart", d: "The large candles with no hesitation. They're the traces institutions leave behind." },
            { n: "2", t: "Go back just before each move out", d: "A few small consolidation candles = your SD zone. Draw the rectangle." },
            { n: "3", t: "Has price already returned to that zone?", d: "If no → fresh, strong zone. If yes several times → weakened zone, less reliable." },
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
        <h2 className="text-lg font-semibold text-white mb-4">The trader's logic on SD zones</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↑</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Price comes back into a Demand zone</p>
              <p className="text-xs text-zinc-400 mt-0.5">You wait for a rejection signal in the zone (pin bar, bullish engulfing). If the Daily trend is bullish → buy. SL below the whole zone.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↓</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Price rallies into a Supply zone</p>
              <p className="text-xs text-zinc-400 mt-0.5">You wait for a rejection in the zone (upper wick, bearish engulfing). If the Daily trend is bearish → sell. SL above the zone.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-zinc-800/40 border border-zinc-700/40 rounded-xl px-4 py-3">
            <span className="text-lg">—</span>
            <div>
              <p className="text-sm font-semibold text-zinc-300">Zone already tested several times</p>
              <p className="text-xs text-zinc-400 mt-0.5">You skip it or lower your confidence. A zone touched 3+ times loses its power, the institutional orders are used up.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Classic mistake</p>
        <p className="text-sm font-semibold text-white mb-2">Entering the zone before the confirmation signal</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          You see price dropping toward your Demand zone. You rush to buy &quot;because the zone is right there&quot;. But price keeps falling and slices through your zone. The problem: an SD zone tells you where to LOOK, not where to enter without a signal. Always wait for a rejection candle in the zone before entering.
        </p>
      </section>

      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Summary in 3 seconds</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Demand zone + bullish signal → you buy (SL below the zone)</p>
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Supply zone + bearish signal → you sell (SL above the zone)</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>Zone touched 3× or no signal → you skip it</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Review</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Demand = price leaves a zone with an impulsive bullish move out → institutions bought.",
          "Supply = price leaves a zone with an impulsive bearish move out → institutions sold.",
          "Fresh zone (untested) = strong zone. Zone tested 3× = weakened zone.",
          "You draw the zone on the consolidation before the move out, not on the move itself.",
          "The SD zone tells you where to look, the candle signal tells you when to enter.",
        ]}
      />

      <LessonExercice
        description="On TradingView, open EUR/USD on H4 and identify valid SD zones."
        steps={[
          "Spot the last big bullish move (several green candles in a row). Go back just before it, that's where your Demand zone is. Draw a rectangle.",
          "Do the same for the last big bearish move. Draw your Supply zone.",
          "Check whether price has come back to test either of these zones since. How did it react?",
          "Look for an SD zone that lines up with a historical S/R level, that's a strong confluence. Note the exact price.",
        ]}
      />

      <LessonQuiz
        question="You draw a Demand zone on EUR/USD H4. Price drops toward it. What do you do?"
        options={[
          "Buy immediately as soon as price enters the zone",
          "Wait for a rejection signal in the zone (pin bar or bullish engulfing), then enter",
          "Skip the zone, price is dropping, that's a sign of weakness",
          "Place a limit order at the bottom of the zone without waiting for a signal",
        ]}
        correctIndex={1}
        explanation="The zone tells you where to look, the candle signal tells you when to enter. Waiting for a rejection (pin bar, bullish engulfing) in the Demand zone confirms institutional buyers are active. Without a signal, you're anticipating with no proof."
        answerExplanations={[
          "Too hasty. Price can slice through the zone and keep falling. Entering without a confirmation signal means risking entry on a zone that doesn't hold. The zone is an attention area, not an automatic buy trigger.",
          "Correct. It's the two-step method: the zone defines the level of interest, the candle signal confirms buyers are reacting. Pin bar = rejection of lower prices. Bullish engulfing = buyers take control. You enter with SL below the zone.",
          "Wrong. Price dropping toward a Demand zone is exactly the expected scenario. It's the pullback that creates the buy opportunity. Price has to drop into the zone for the setup to be valid.",
          "Risky. A limit order at the bottom of the zone can work, but you enter without confirmation. Price can slice through the bottom of the zone and keep going. Waiting for the candle signal gives you an extra edge.",
        ]}
      />

    </LessonPage>
  );
}
