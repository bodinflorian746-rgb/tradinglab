import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { FVGDiagram } from "@/app/components/charts/FVGDiagram";

export default function ContentEn() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon2"
      title="Fair Value Gap"
      subtitle="Fair Value Gaps are imbalances left behind by fast institutional moves. The market looks to fill them, and that's where some of the best entries hide."
      duration="20 min"
      lessonNumber={2}
      prev={{ href: "/formations/avance/lecon1", label: "Lesson 1: Liquidity" }}
      next={{ href: "/formations/avance/lecon3", label: "Lesson 3: Order Blocks" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">What is a Fair Value Gap?</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          A Fair Value Gap (FVG) is a price imbalance created when a move
          is so fast that adjacent candles don't overlap.
          A price zone is left where no trades happened, and the market
          tends to return to &quot;fill&quot; that imbalance.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Principle:</span> an FVG
            forms over 3 consecutive candles. The zone between the upper wick of
            candle 1 and the lower wick of candle 3 was never traded, that's
            the gap.
          </p>
        </div>
        <p className="text-zinc-300 text-sm leading-relaxed">
          In practice, FVGs show up after major economic news,
          session opens with a gap, or impulsive institutional moves.
          They represent imbalance zones that the market naturally
          looks to fill back in.
        </p>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Spotting an FVG on the chart</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Reading an FVG always comes down to 3 candles. The analysis is simple
          once you know what to look for.
        </p>
        <div className="space-y-3">
          <div className="bg-zinc-800/50 rounded-xl p-4">
            <p className="text-sm font-semibold text-white mb-2">The 3 candles</p>
            <div className="space-y-2">
              {[
                { label: "Candle 1", desc: "The candle before the move. Keep an eye on its upper wick (for a bullish FVG) or lower wick (for a bearish one)." },
                { label: "Candle 2", desc: "The impulsive candle: large, directional, often with no wick. It creates the imbalance." },
                { label: "Candle 3", desc: "The candle that follows. Keep its lower wick (bullish) or upper wick (bearish). If it doesn't overlap candle 1's wick, the FVG exists." },
              ].map((b) => (
                <div key={b.label} className="flex items-start gap-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 w-16 mt-0.5">{b.label}</span>
                  <p className="text-xs text-zinc-400 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm text-zinc-400 leading-relaxed">
              <span className="text-white font-medium">Quick test:</span> an FVG
              exists if the upper wick of candle 1 is below the lower wick
              of candle 3 (bullish), or if the lower wick of candle 1
              is above the upper wick of candle 3 (bearish).
            </p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Bullish vs Bearish FVG</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="font-semibold text-emerald-400 text-sm mb-2">Bullish FVG</p>
            <ul className="space-y-1.5">
              <li className="text-xs text-zinc-400 leading-relaxed">
               . Formed after an impulsive bullish move (candle 2 bullish)
              </li>
              <li className="text-xs text-zinc-400 leading-relaxed">
               . The zone sits between: upper wick of C1 (bottom of the gap) and lower wick of C3 (top of the gap)
              </li>
              <li className="text-xs text-zinc-400 leading-relaxed">
               . When price returns to that zone, it's a potential buy spot
              </li>
              <li className="text-xs text-zinc-400 leading-relaxed">
               . Stop: below the zone. Target: next resistance level or liquidity
              </li>
            </ul>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <p className="font-semibold text-red-400 text-sm mb-2">Bearish FVG</p>
            <ul className="space-y-1.5">
              <li className="text-xs text-zinc-400 leading-relaxed">
               . Formed after an impulsive bearish move (candle 2 bearish)
              </li>
              <li className="text-xs text-zinc-400 leading-relaxed">
               . The zone sits between: lower wick of C1 (top of the gap) and upper wick of C3 (bottom of the gap)
              </li>
              <li className="text-xs text-zinc-400 leading-relaxed">
               . When price rallies back into that zone, it's a potential sell spot
              </li>
              <li className="text-xs text-zinc-400 leading-relaxed">
               . Stop: above the zone. Target: next support or liquidity pool
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <FVGDiagram locale="en" />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Practical use</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          An FVG on its own isn't enough. It has to fit into a favorable context
          to become a valid entry signal.
        </p>
        <div className="space-y-2.5">
          {[
            {
              label: "FVG in the direction of the trend",
              detail: "In an uptrend, only trade bullish FVGs. Going against the trend with an FVG multiplies the risk.",
            },
            {
              label: "FVG + zone confluence",
              detail: "An FVG that lines up with an Order Block or an old historical support is far more reliable.",
            },
            {
              label: "Unfilled FVG = active zone",
              detail: "As long as an FVG hasn't been retested, it stays active on the chart. Mark them and keep an eye on them.",
            },
            {
              label: "Filled FVG = invalidated",
              detail: "If price runs through the gap completely without reacting, the FVG is invalidated. Drop it from your analysis.",
            },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              <div>
                <p className="text-sm font-medium text-white">{r.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Full workflow:</span> structure
            → liquidity → FVG + confluence → entry on rejection inside the zone. Those
            4 steps combined are what define a complete institutional setup.
          </p>
        </div>
      </section>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Review</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "An FVG is an imbalance over 3 candles: no trades happened in the zone between the upper wick of C1 and the lower wick of C3 (bullish).",
          "The market looks to fill its FVGs, they're potential return zones to watch.",
          "An FVG is only valid in the direction of the trend and with at least one extra confluence.",
          "An FVG that gets run through without a reaction is invalidated, drop it from your analysis right away.",
        ]}
      />

      <LessonExercice
        description="On TradingView, open BTC/USD or EUR/USD on M15 or H1. Your mission: spot 3 active Fair Value Gaps on the chart."
        steps={[
          "Look for a sequence of 3 candles with an impulsive C2. Check that the upper wick of C1 doesn't touch the lower wick of C3.",
          "For each FVG you find, decide whether it's bullish or bearish, and whether price has already returned to it or not.",
          "If an FVG is still intact (unfilled), mark it and note the entry direction it suggests in the trend context.",
        ]}
      />

      <LessonQuiz
        question="A Bullish Fair Value Gap is identified when…"
        options={[
          "Candle 2 is larger than candles 1 and 3 combined",
          "The upper wick of candle 1 is below the lower wick of candle 3",
          "Price closes above the high of the previous candle",
        ]}
        correctIndex={1}
        explanation="A Bullish FVG exists when the upper wick of candle 1 is below the lower wick of candle 3, leaving a gap between those two wicks that was never traded. That's the imbalance the market looks to fill when it comes back, creating a buy entry opportunity within a bullish context."
      />

    </LessonPage>
  );
}
