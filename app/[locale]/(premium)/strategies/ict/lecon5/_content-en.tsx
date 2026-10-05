"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { ICTSequenceTimelineDiagram } from "@/app/components/charts/ICTSequenceTimelineDiagram";
import { ICTLiquidityPrepDiagram } from "@/app/components/charts/ICTLiquidityPrepDiagram";
import { ICTDisplacementSetupDiagram } from "@/app/components/charts/ICTDisplacementSetupDiagram";
import { ICTTimingDiagram } from "@/app/components/charts/ICTTimingDiagram";

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
    setDone(isLessonComplete(getStoredProgress(), "ict", "lecon5"));
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
          <span className="text-zinc-500">Lesson 5</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Advanced
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">20 min</span>
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
            The complete ICT model: from liquidity to execution
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              The market doesn&apos;t produce its real moves at random. Most ICT setups follow a precise sequence: liquidity → manipulation → displacement → execution.
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
              const isCurrent = lesson.id === "lecon5";
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
            <span className="ml-auto text-xs text-zinc-600">5 / 5 lessons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &laquo; An ICT trade isn&apos;t a reaction to a signal. It&apos;s the culmination of a sequence we saw coming. &raquo;
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
              <li>- Displacement → see ICT module, Lesson 4</li>
            </ul>
          </div>

          {/* Bloc 3 — THE ICT MODEL WORKS BY SEQUENCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The ICT model works by sequence</h2>

            <div className="my-8">
              <ICTSequenceTimelineDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The ICT model isn&apos;t traded by isolated signal: it&apos;s traded by sequence. Most high-probability trades chain a series of structural events that build on one another: an HTF bias that sets the direction, a liquidity spotted as a probable target, a sweep that takes it, a displacement that validates the intent, an FVG that opens an entry window, then the execution on the return. Reading the sequence means anticipating the trade, not enduring it.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- The ICT model = a sequence of events, not an isolated signal</li>
              <li>- Each step builds the next, skipping a step breaks the read</li>
              <li>- Reading the sequence lets you anticipate the execution before it arrives</li>
              <li>- Trading out of sequence = falling back into the reactive pattern</li>
            </ul>
          </section>

          {/* Bloc 4 — LIQUIDITY PREPARES THE MOVE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Liquidity prepares the move</h2>

            <div className="my-8">
              <ICTLiquidityPrepDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The first step of any ICT sequence is liquidity. Before a real institutional move arrives, you have to identify WHERE the visible liquidity is, equal highs, equal lows, recent clearly identifiable highs / lows. This liquidity is the probable target of the next sweep. The sequence doesn&apos;t start before that pool is taken: if price hovers around it without touching it, you wait.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1: current price 1.1745, bearish Daily bias, Daily resistance at 1.1780. Two visible equal highs at 1.1780 over the prior hours, the liquidity above these highs is the target. The full scenario waits for that liquidity to be taken (wick above 1.1780) before looking for the short execution. Without a sweep, no sequence, you wait.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Liquidity = the structural equivalent of the probable target</li>
              <li>- Equal highs / equal lows / recent highs-lows = visible pools</li>
              <li>- No sweep = no sequence; we don&apos;t anticipate the grab</li>
              <li>- The liquidity grab is the trigger for the next phase (manipulation)</li>
            </ul>
          </section>

          {/* Bloc 5 — DISPLACEMENT CREATES THE SETUP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Displacement creates the setup</h2>

            <div className="my-8">
              <ICTDisplacementSetupDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Once the liquidity is taken by the sweep, the critical step is the displacement: the sequence of impulsive candles that shows the market has truly reversed in the direction of the HTF bias. Without displacement, the sweep can be a false move, price sweeps, hesitates, then runs back in the initial direction. WITH displacement, the institutional intent is clear and the FVG left in the drop (or the rise) becomes the execution zone. The entry is taken on price&apos;s return into that FVG.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: after the sweep at 1.1792, 4 consecutive large-bodied bearish candles bring price back to 1.1748. An FVG is left between 1.1768 and 1.1780. The displacement validates the sell intent. Price then climbs back gradually toward the FVG: short entry on the return into the band, SL above 1.1780 (extreme of the displacement), TP toward the next low liquidity.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Sweep without displacement = false move, we don&apos;t enter</li>
              <li>- Displacement validates the intent and creates the FVG (execution zone)</li>
              <li>- The entry is taken on the RETURN into the FVG, not during the displacement</li>
              <li>- SL above the extreme of the displacement = clear invalidation structure</li>
            </ul>
          </section>

          {/* Bloc 6 — TIMING REMAINS ESSENTIAL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Timing remains essential</h2>

            <div className="my-8">
              <ICTTimingDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The ICT sequence only has its full value in a Killzone. The same chain liquidity → sweep → displacement → FVG can technically occur in the Asia Session, but with a low probability of continuation, the volume is lacking to support the move. High-probability sequences always combine ICT setup AND timing: sweep of an Asia range at the London Open, sweep of an equal high at the NY Open, displacement at the open of a Killzone. Without favorable timing, you wait for the next window.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD: Asia range between $4,642 and $4,655. At the London Open, a sweep wick above $4,655, then a bearish displacement of $38 that creates an FVG in the drop. Complete setup AND in a Killzone = premium setup. The same sequence at 03h UTC would likely have failed, the market lacked the volume to support the displacement.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- ICT setup + Killzone timing = premium setup</li>
              <li>- ICT setup outside a Killzone = reduced probability, limited moves</li>
              <li>- The best sequences unfold at the London or NY Open</li>
              <li>- Filtering by timing eliminates the technical setups with no energy to follow through</li>
            </ul>
          </section>

          {/* Bloc 7 — APPLICATION PLAN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Application plan: a complete EUR/USD ICT sequence</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Here is the full sequence, from reading the context to execution. Six steps, each with its distinct role.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Step 1. HTF (Daily): directional bias</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: EUR/USD Daily in LH/LL, Daily resistance at 1.1780</li>
                <li>- Conclusion: bearish bias, the whole sequence will look for a short</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 2. Liquidity (H1): identify the target</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: two visible equal highs at 1.1780, stops stacked above</li>
                <li>- Conclusion: the liquidity above 1.1780 is the probable target of the next sweep</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 3. Sweep (M15 in a Killzone)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: at the NY open, a wick to 1.1792 then a reclaim below 1.1780</li>
                <li>- Conclusion: the liquidity is taken. We now wait for the displacement</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 4. Bearish displacement</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: 4 consecutive large-bodied bearish M15 candles, drop to 1.1748. Visible FVG between 1.1768 and 1.1780</li>
                <li>- Conclusion: displacement validated, the FVG is the execution zone</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 5. Return into the FVG</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: over the following hours, price climbs gradually and enters the 1.1768-1.1780 band</li>
                <li>- Conclusion: execution zone active, we watch for the rejection confirmation</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 6. Execution</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: an M15 rejection candle appears in the FVG, followed by an impulsive bearish candle</li>
                <li>- Conclusion: short entry at 1.1774, SL at 1.1798 (above the extreme of the displacement), TP toward 1.1695. R/R ≈ 1 : 3.3, complete and aligned ICT sequence</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = bias · Liquidity = target · Sweep = condition · Displacement = confirmation · FVG = execution
                </p>
              </div>
            </div>
          </section>

          {/* Bloc 8 — THE MISTAKES THAT BREAK THE ICT MODEL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The mistakes that break the ICT model</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The model is powerful as long as it&apos;s respected in order. The moment you skip a step or read the sequence backwards, you fall back into reactive trading. Here are the four most frequent slip-ups.
            </p>

            <div className="grid gap-3 my-6">
              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">1. Entering on the sweep alone</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Seeing a wick overshoot an equal high and entering immediately, without waiting for the displacement, is trading the wick, exactly the trap the sequence aims to avoid. The sweep is only a precondition; without a displacement following, it&apos;s just a false move.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">2. Skipping the HTF</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Spotting a sweep and a displacement without first having set the Daily / H4 bias is confusing a local setup with a trade. The HTF dictates the direction of allowed trades, without that read, the sequence can move correctly and place you on the wrong side of the real move.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">3. Trading outside a Killzone</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  A technically perfect sequence that unfolds during the Asia Session has a very low probability of continuation. The volume is lacking to support the displacement, the FVG isn&apos;t respected, the execution dissolves into sideways action. Decent setup + lousy timing = no trade.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">4. Entering during the displacement</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Seeing the displacement underway and trying to jump on board is missing the clean entry and taking a far-too-wide SL. The ICT entry is taken on the RETURN into the FVG, never in the impulse sequence itself. The patience between displacement and return is what makes the R/R favorable.
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "The ICT model is a SEQUENCE, liquidity, manipulation, displacement, execution, not an isolated signal.",
              "Each step builds the next: skipping or reversing the order breaks the read of the market.",
              "The FVG created by the displacement is the execution zone, you enter on the return, never during the impulse.",
              "Timing (Killzones) remains essential: an ICT setup outside a Killzone is statistically unprofitable.",
            ]}
          />

          <LessonExercice
            description="On TradingView, run a complete ICT sequence on the pair of your choice, from the Daily to execution."
            steps={[
              "HTF (Daily): conclude a clear directional bias. Spot on H1 a visible liquidity pool in the direction of the bias (equal highs/lows, recent high/low).",
              "Wait for a Killzone (London or NY Open). Watch for the sweep of the spotted liquidity, then the displacement that follows. If the sequence stops at the sweep without a displacement, it's a false move, no trade.",
              "Draw the FVG left by the displacement. Wait for price to return into the band. If the reaction confirms (rejection candle + impulse), note the entry, the SL above the extreme of the displacement, the TP toward the next liquidity.",
            ]}
          />

          <LessonQuiz
            question="On EUR/USD you see a wick that sweeps equal highs at 1.1780, climbing to 1.1792. No bearish displacement candle follows, price consolidates around 1.1782 for 6 candles. What do you do?"
            options={[
              "You enter short immediately: the sweep alone is the ICT model's entry signal",
              "You don't enter: without a displacement after the sweep, the ICT sequence isn't validated",
              "You enter long assuming the consolidation will break to the upside",
              "You place a limit order at 1.1780 and let it fill automatically",
            ]}
            correctIndex={1}
            explanation="The sweep is only a precondition of the ICT sequence, not an entry signal. Without the bearish displacement that follows, the institutional intent isn't confirmed, the consolidation above the swept level even suggests the sweep could be a false move. The model's discipline is clear: no displacement, no sequence, no entry. You wait for the market to speak more clearly before acting."
            answerExplanations={[
              "False. Entering on the sweep alone is exactly the trap the ICT sequence aims to avoid. The sweep is a condition, not a signal, without displacement, nothing confirms the sell intent.",
              "Correct. The ICT sequence requires sweep + displacement + FVG + return. If the displacement doesn't materialize after the sweep, the next step is missing, the sequence isn't validated. The discipline is not to enter.",
              "False. Anticipating the direction of a consolidation with no structural signal is pure speculation. And trading long against the assumed bearish HTF bias is doubly risky.",
              "False. Placing a limit order turns an unconfirmed setup into an automatic bet. It's one of the worst habits, you take the risk without having checked that the sequence actually unfolds.",
            ]}
          />

          <LessonQuiz
            question="You have a technically complete ICT setup (sweep, displacement, FVG) on EUR/USD at 04h UTC in the middle of the Asia Session. Price just entered the FVG. What do you do?"
            options={[
              "You enter: the setup is technically validated, the time doesn't matter",
              "You enter with a widened SL to absorb the low Asia liquidity",
              "You don't enter: without a Killzone, the ICT setup has a very low probability of continuation",
              "You wait for price to exit the FVG then you take the break",
            ]}
            correctIndex={2}
            explanation="Timing is a structural component of the ICT model, not a secondary detail. A technically perfect ICT sequence outside a Killzone lacks the institutional volume to support the continuation, price in the FVG can easily stay sideways for several hours without triggering anything. ICT discipline means filtering by timing BEFORE executing, not executing every technically valid setup. You wait for the next Killzone."
            answerExplanations={[
              "False. 'The time doesn't matter' contradicts the ICT model, which integrates timing as a structural condition. A technically perfect setup without favorable timing is statistically unprofitable.",
              "False. Widening the SL doesn't fix the underlying problem: the market lacks the volume to execute the scenario. You only take more risk on a setup that probably won't trigger.",
              "Correct. The ICT sequence requires timing AND setup. Outside a Killzone, the probability that the FVG is respected and the continuation occurs drops drastically. The discipline is to wait for London or NY to execute.",
              "False. 'Exiting the FVG' and 'taking the break' is a mechanical read with no structural logic. The FVG isn't a range you trade on the breakout, it's an entry zone on rejection, not on exit.",
            ]}
          />

          <LessonQuiz
            question="What is the most dangerous mistake in applying the ICT model?"
            options={[
              "Entering during the displacement instead of waiting for the return into the FVG",
              "Mis-memorizing the exact Killzone times in UTC",
              "Confusing a bearish FVG and a bullish FVG by eye on the chart",
              "Using major pairs rather than exotic pairs",
            ]}
            correctIndex={0}
            explanation="Entering during the displacement means skipping the critical step of the ICT sequence: waiting for the return into the FVG. This mistake has two major consequences: a much wider SL (since you enter in the middle of an ongoing impulse) and a catastrophic R/R. The model's logic is to be patient between the displacement and the return to get a tight entry with a structural SL, skipping that patience flips the risk/reward of the entire sequence."
            answerExplanations={[
              "Correct. It's the most costly mistake because it ruins the setup's R/R. Entering in the middle of the displacement = too-wide SL + too-late entry. ICT demands patience: you wait for the return into the FVG.",
              "False. The exact times can be looked up on any terminal. It's not a structural mistake, it's a technical detail easy to fix.",
              "False. The bearish/bullish distinction of an FVG comes from the direction of the move that created it, not from an eyeball read. It's an understanding of the concept, not an application mistake.",
              "False. The choice of pair is a personal preference, not a model mistake. Major pairs are simply more liquid and offer cleaner sequences.",
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
                  markLessonComplete(p, "ict", "lecon5");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 5 of the Complete ICT module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/ict/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Previous lesson
              </Link>
              <Link href="/strategies/ict" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Back to module
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
