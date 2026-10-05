"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { DisplacementImpulseDiagram } from "@/app/components/charts/DisplacementImpulseDiagram";
import { DisplacementControlDiagram } from "@/app/components/charts/DisplacementControlDiagram";
import { DisplacementSetupDiagram } from "@/app/components/charts/DisplacementSetupDiagram";
import { DisplacementVsVolatilityDiagram } from "@/app/components/charts/DisplacementVsVolatilityDiagram";

const LESSONS = [
  { id: "lecon1", title: "Liquidity and manipulation", disabled: false },
  { id: "lecon2", title: "PD Arrays", disabled: false },
  { id: "lecon3", title: "Killzones", disabled: false },
  { id: "lecon4", title: "Displacement", disabled: false },
  { id: "lecon5", title: "Complete ICT model", disabled: false },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "ict", "lecon4"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Strategies</Link>
          <span>/</span>
          <Link href="/strategies/ict" className="hover:text-zinc-400 transition-colors">Complete ICT</Link>
          <span>/</span>
          <span className="text-zinc-500">Lesson 4</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Advanced
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">18 min</span>
            {done && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1 4.5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Completed
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold leading-tight mb-4">
            Displacement: recognizing the real institutional move
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              The market doesn&apos;t always move with conviction. Some impulses show a true takeover.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600">
            {["Reading", "Key points", "Exercise", "Quiz"].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span>{step}</span>
                {i < arr.length - 1 && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-zinc-800 shrink-0">
                    <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2 flex-wrap">
            {LESSONS.map((lesson) => {
              const isCurrent = lesson.id === "lecon4";
              return (
                <div key={lesson.id}>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                    isCurrent
                      ? "bg-zinc-800 border-zinc-600 text-white"
                      : lesson.disabled
                      ? "border-zinc-800/50 text-zinc-700"
                      : "border-zinc-800 text-zinc-500"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : lesson.disabled ? "bg-zinc-700" : "bg-zinc-600"}`} />
                    {isCurrent ? (
                      <>
                        <span className="md:hidden">Lesson {lesson.id.replace("lecon", "")}</span>
                        <span className="hidden md:inline">{lesson.title}</span>
                      </>
                    ) : (
                      lesson.title
                    )}
                  </span>
                </div>
              );
            })}
            <span className="ml-auto text-xs text-zinc-600">4 / 5 lessons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &laquo; A big candle isn&apos;t a signal. A big candle that breaks a structure and continues, yes. &raquo;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PREREQUISITES */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Liquidity and manipulation → see ICT module, Lesson 1</li>
              <li>- PD Arrays and FVG → see ICT module, Lesson 2</li>
              <li>- Killzones → see ICT module, Lesson 3</li>
              <li>- BOS and CHoCH → see SMC module, lesson &laquo; BOS and CHoCH: reading institutional structural signals &raquo;</li>
            </ul>
          </div>

          {/* Bloc 3 — A DISPLACEMENT IS NOT A SIMPLE IMPULSE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">A displacement is not a simple impulse</h2>

            <div className="my-8">
              <DisplacementImpulseDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A displacement is a sequence of impulsive, large-bodied candles that moves in one direction without significant correction, not just a single big candle. The sequence is recognized by three traits: body amplitude abnormally larger than the prior candles, absence of significant wicks in the opposite direction (the market doesn&apos;t catch its breath), and the near-systematic creation of one or more FVG in the drop or the rise. It&apos;s this combination that distinguishes displacement from plain volatility.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD M15 chart: from 1.1780, price prints a sweep wick to 1.1792 then chains 4 consecutive bearish candles, each with a 12-15 pip body, with no notable upper wick. Price drops to 1.1748 in under an hour, leaving two visible bearish FVG in the drop. This is a textbook displacement, not passing volatility, but a directional sequence.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Displacement = a sequence of impulsive large-bodied candles, not a single candle</li>
              <li>- Absence of wicks in the opposite direction = the market isn&apos;t breathing</li>
              <li>- Creation of FVG within the move = structural trace of the imbalance</li>
              <li>- Body amplitude clearly above the average of the last candles</li>
            </ul>
          </section>

          {/* Bloc 4 — DISPLACEMENT SHOWS WHO TAKES CONTROL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Displacement shows who takes control</h2>

            <div className="my-8">
              <DisplacementControlDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Before a displacement, the market is generally in balance, low-amplitude candles, green/red alternation, sideways action. When the displacement hits, it&apos;s the balance that breaks: one side abruptly takes over and imposes the direction. This break is the signature of institutional intent. Reading a displacement means reading who, sellers or buyers, just won the ongoing battle. The direction of the displacement defines the immediate bias for the minutes / hours that follow.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD M15: price consolidates around $4,650 for 3 hours, flat candles, balanced market. At 14h UTC, a candle sweeps a high at $4,668, immediately followed by 5 large-bodied bearish candles that bring price back to $4,608. The balance is broken: it&apos;s the sellers taking control. The bias for the coming hours is set, we no longer look for longs until proven otherwise.
            </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- The displacement marks the shift from balance to a takeover of control</li>
              <li>- The direction of the displacement defines the bias for the minutes / hours that follow</li>
              <li>- Before the displacement = flat, balanced market; after = imposed direction</li>
              <li>- Ignoring a displacement = trading against the institutional intent that just expressed itself</li>
            </ul>
          </section>

          {/* Bloc 5 — DISPLACEMENT OFTEN CREATES THE SETUP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Displacement often creates the setup</h2>

            <div className="my-8">
              <DisplacementSetupDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A displacement leaves behind an exploitable zone: the FVG created by the large candles of the sequence. The market often comes back to revisit this zone before continuing in the direction of the displacement, it&apos;s the mitigation scenario already seen in Lesson 2, but here in a particularly reliable context because the FVG was born from visible institutional intent. The return into the FVG offers a tight entry, with an SL above the displacement&apos;s extreme and a TP toward the next liquidity zone in the direction of the move.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1: the sweep at 1.1792 and the bearish displacement down to 1.1748 leave a visible FVG between 1.1768 and 1.1780. Over the following hours, price climbs back gradually, enters the FVG band, then a clean bearish candle relaunches the drop. Short entry on the return into the FVG, SL just above 1.1780, TP toward the next low liquidity zone, the initial displacement created both the entry and the SL on its own.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- The FVG created by a displacement is a premium entry zone</li>
              <li>- The return into the FVG offers a tight entry with a structural SL</li>
              <li>- The intent of the displacement stays valid as long as the FVG isn&apos;t violated in the opposite direction</li>
              <li>- The displacement creates both the entry (FVG) and the invalidation (extreme of the move)</li>
            </ul>
          </section>

          {/* Bloc 6 — NOT ALL FAST MOVES ARE DISPLACEMENTS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Not all fast moves are displacements</h2>

            <div className="my-8">
              <DisplacementVsVolatilityDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The classic trap is to mistake any big candle for a displacement. An isolated candle, even a very big one, that&apos;s neither preceded by an exploited structure nor followed by continuity, is simply volatility, a one-off event with no follow-through. The real displacement stands out through two elements: it breaks a local structure (BOS in the direction of the move) and it&apos;s followed by a continuation, not an immediate rejection. Without these two conditions, it&apos;s just a wick the market will erase in the following minutes. A size of 18 pips is never a criterion in itself, the break and the continuity are.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                On EUR/USD, an M15 candle abruptly prints 18 pips up following a minor news, then the next candle fully closes the move back, no structural break, no continuation. That&apos;s volatility, not a displacement. Conversely, a sequence of 4 bearish candles of 10-12 pips each that breaks a local low and chains in the same direction is a displacement, even if no candle exceeds 12 pips.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Isolated big candle + immediate rejection = volatility, not displacement</li>
              <li>- Displacement = structure break (BOS) + continuation in the direction</li>
              <li>- The size of a single candle is never a criterion, the sequence and the follow-through are what matter</li>
              <li>- Trading volatility as a displacement = getting caught on the wrong side</li>
            </ul>
          </section>

          {/* Bloc 7 — APPLICATION PLAN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Application plan: a complete EUR/USD displacement</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Here is the sequence to identify and exploit a displacement on EUR/USD. Five steps, each with its role.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Step 1. HTF (Daily): directional bias</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: EUR/USD Daily in LH/LL, Daily resistance 1.1780</li>
                <li>- Conclusion: bearish bias, we&apos;ll look for a displacement in the sell direction</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 2. Liquidity (H1): identify the target</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: recent equal highs at 1.1780, stops stacked above</li>
                <li>- Conclusion: the liquidity above 1.1780 is the likely target before any real bearish move</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 3. Sweep (M15 in a Killzone)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: at the NY open, price sweeps to 1.1792 then reclaims below 1.1780</li>
                <li>- Conclusion: the liquidity is taken. We now watch for the displacement</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 4. Bearish displacement</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: 4 consecutive large-bodied bearish candles, no upper wicks, price drops to 1.1748. Visible FVG between 1.1768 and 1.1780</li>
                <li>- Conclusion: displacement validated. The entry isn&apos;t in the displacement (already gone), it&apos;s in the FVG it created</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 5. Return into the FVG: execution</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: price climbs gradually toward 1.1768-1.1780, enters the FVG band, then a bearish rejection candle</li>
                <li>- Conclusion: short entry on the return into the FVG, SL just above 1.1780 (extreme of the displacement), TP toward 1.1695. R/R ≈ 1 : 2, high-probability setup because it&apos;s aligned HTF + liquidity + sweep + displacement + FVG</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = bias · Liquidity = target · Sweep = condition · Displacement = confirmation · FVG = execution
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "A displacement is a sequence of impulsive candles, not a single one, large bodies, few opposite wicks, FVG left behind.",
              "The displacement marks the shift from balance to an institutional takeover of control.",
              "The FVG created by a displacement is a premium entry zone, the entry is taken on the return, not in the displacement itself.",
              "An isolated big candle with no break or continuation is volatility, not a displacement.",
            ]}
          />

          <LessonExercice
            description="On TradingView, spot a complete displacement on the pair of your choice and qualify it step by step."
            steps={[
              "Spot a sequence of 3-5 consecutive M15 or H1 candles, all in the same direction, with bodies larger than the average of the prior 10 candles and few or no opposite wicks.",
              "Check that the sequence breaks a local structure (recent low or high) and leaves at least one visible FVG. If so, it's a qualified displacement.",
              "Draw the FVG on the chart. Wait for price to return to it. If the reaction on the return confirms the direction of the displacement (rejection candle, break in the direction), note the entry, the SL above the displacement's extreme and the TP toward the next liquidity.",
            ]}
          />

          <LessonQuiz
            question="On EUR/USD, an M15 candle abruptly prints 18 pips up, then the next candle fully closes the move back. No structural break is visible. How do you qualify this move?"
            options={[
              "It's a bullish displacement, 18 pips in one candle is a strong signal",
              "It's volatility with no follow-through, not a displacement, no break and no continuation",
              "It's a sweep, so the reverse scenario is validated to enter short immediately",
              "It's an undetermined signal, you have to wait 1h to decide",
            ]}
            correctIndex={1}
            explanation="A displacement is never defined by the size of a single candle. The two structural criteria are: a local structure break (BOS) AND a continuation in the direction. Here, the next candle fully closes the move back and there's no break, this is exactly the definition of volatility with no follow-through, not a displacement. Trading this candle as a buy signal would mean buying the high of the false move."
            answerExplanations={[
              "False. A candle's size has no value without a structure break and continuation. 18 isolated pips immediately rejected = one-off volatility, exactly the trap the displacement concept aims to avoid.",
              "Correct. Without a structural break or continuation, it's an isolated candle, therefore volatility, not a displacement. The ICT rule is clear: a displacement is only validated by a directional sequence that breaks a structure and continues.",
              "False. A sweep is only a precondition, never an entry signal on its own. Entering short immediately on the basis of an isolated bullish candle has no structural logic, you have to wait for confirmation (reclaim + opposite impulsive candle).",
              "False. Waiting 1h arbitrarily doesn't change the read. The move is already qualified as volatility by the structural criteria (no break, immediate rejection). No need for a timer, you just have to read correctly what you see.",
            ]}
          />

        </div>

        {/* Footer */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "ict", "lecon4");
                  setDone(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-zinc-950 font-semibold py-3.5 rounded-xl transition-all duration-150 shadow-lg shadow-emerald-500/10"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Mark lesson as completed
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-5 py-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-emerald-400">
                    <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-400">Lesson completed</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 4 of the Complete ICT module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/ict/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Previous lesson
              </Link>
              <Link href="/strategies/ict/lecon5" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Next lesson
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M6 4l4 3-4 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
