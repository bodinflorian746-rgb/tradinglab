import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LiquidityPoolsDiagram } from "@/app/components/charts/LiquidityPoolsDiagram";

export default function ContentEn() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon1"
      title="Liquidity"
      subtitle="Institutions need liquidity to fill their orders. Understanding where it sits means understanding where the market is really headed."
      duration="25 min"
      lessonNumber={1}
      prev={null}
      next={{ href: "/formations/avance/lecon2", label: "Lesson 2: Fair Value Gap" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">What is liquidity?</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Liquidity is the ability to fill an order without moving the price.
          For an institution placing a multi-million dollar order, it needs a
          counterparty, someone selling when it buys, and vice versa.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Those counterparties sit where the other traders have placed their
          stops. Stops are resting orders, they form a pool of liquidity that
          institutions tap into.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Key takeaway:</span> the market
            moves toward liquidity, not the other way around. Before any big move,
            price often goes to grab the stops to fuel the next move.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Buy-side and Sell-side Liquidity</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Liquidity pools build up around the obvious levels everyone is watching,
          that is exactly where the stops pile up.
        </p>
        <div className="space-y-3 mb-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="font-semibold text-emerald-400 text-sm mb-2">Buy-side Liquidity (BSL)</p>
            <p className="text-xs text-zinc-400 leading-relaxed mb-2">
              Sits <span className="text-white">above</span> resistance levels
              and Equal Highs (EQH). Short traders have placed their stops there.
              When price rises into it, it triggers those stops, buy orders
              that fuel an institutional sell.
            </p>
            <p className="text-xs text-zinc-500">
              EQH = Equal Highs: two highs at the same level. A classic sign of accumulated liquidity.
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <p className="font-semibold text-red-400 text-sm mb-2">Sell-side Liquidity (SSL)</p>
            <p className="text-xs text-zinc-400 leading-relaxed mb-2">
              Sits <span className="text-white">below</span> support levels
              and Equal Lows (EQL). Long traders have placed their stops there.
              When price drops into it, it triggers those stops, sell orders
              that fuel an institutional buy.
            </p>
            <p className="text-xs text-zinc-500">
              EQL = Equal Lows: two lows at the same level. A typical sell-side liquidity zone.
            </p>
          </div>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <LiquidityPoolsDiagram locale="en" />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-sm text-zinc-300 leading-relaxed">
          These liquidity zones are exactly what stop hunts target:
          sharp moves that trigger the accumulated stops before reversing in
          the other direction. We cover them in detail in lesson 6.
        </p>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Using liquidity in your setups</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Once you spot the liquidity pools, you can anticipate where
          price will go to grab before reversing, and position your entry accordingly.
        </p>
        <div className="space-y-2.5">
          {[
            {
              label: "Spot the EQH / EQL on the chart",
              detail: "Look for two or three highs or lows at the same level, that is where the stops pile up.",
            },
            {
              label: "Wait for price to reach it",
              detail: "Do not chase the wick. Watch how price behaves when it reaches the liquidity zone.",
            },
            {
              label: "Confirm the rejection before entering",
              detail: "A rejection candle (pin bar, engulfing) after the stop hunt is your entry signal.",
            },
            {
              label: "Target the opposite liquidity",
              detail: "If you enter after an SSL sweep, target the BSL above as your take profit.",
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
          "Institutions need liquidity to fill their orders, they go grab it where the stops sit.",
          "Buy-side Liquidity = above the Equal Highs. Sell-side Liquidity = below the Equal Lows.",
          "Price moves toward liquidity before heading in its real direction, anticipate that move.",
        ]}
      />

      <LessonExercice
        description="On any H1 chart, go hunting for the liquidity pools. It is the most important analysis before any trade."
        steps={[
          "Spot at least one set of Equal Highs (EQH), two or more highs lined up at the same level.",
          "Spot at least one set of Equal Lows (EQL), two or more lows lined up at the same level.",
          "Did price recently go grab one of those levels before heading the other way? You just spotted a stop hunt.",
        ]}
      />

      <LessonQuiz
        question="Why do institutions hunt retail traders' stops?"
        options={[
          "To manipulate the market illegally and profit alone",
          "To generate the liquidity needed to fill their own orders",
          "To trigger technical signals and attract new buyers",
        ]}
        correctIndex={1}
        explanation="Institutions place massive orders that require an equivalent counterparty. Retail traders' stop losses are resting orders, by pushing price toward those levels, institutions trigger those stops and get the liquidity they need to enter or exit the market at scale."
      />

    </LessonPage>
  );
}
