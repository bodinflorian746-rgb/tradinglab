"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { FOMCImpulseExcessDiagram } from "@/app/components/charts/FOMCImpulseExcessDiagram";
import { FOMCExhaustionDiagram } from "@/app/components/charts/FOMCExhaustionDiagram";
import { FOMCFadeSetupDiagram } from "@/app/components/charts/FOMCFadeSetupDiagram";

const LESSONS = [
  { id: "lecon1", title: "FOMC Fade", disabled: false },
  { id: "lecon2", title: "NFP Overreaction", disabled: false },
  { id: "lecon3", title: "Risk-off Regime", disabled: false },
  { id: "lecon4", title: "Pre-trade macro filter", disabled: false },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-trading", "lecon1"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Strategies</Link>
          <span>/</span>
          <Link href="/strategies/macro-trading" className="hover:text-zinc-400 transition-colors">Macro Trading</Link>
          <span>/</span>
          <span className="text-zinc-500">Lesson 1</span>
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
            FOMC Fade: trading the swing-back after the decision
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              The market often reacts too fast after the FOMC. The first impulse grabs all the attention. The swing-back is usually what creates the real tradable setup.
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
              const isCurrent = lesson.id === "lecon1";
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
            <span className="ml-auto text-xs text-zinc-600">1 / 4 lessons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « The FOMC decision is rarely the signal. What happens AFTER the initial impulse is what creates the real trade. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- FOMC decisions and Powell press conference → see Macro module</li>
              <li>- Hawkish vs dovish → see Macro module</li>
              <li>- Support, resistance and liquidity → see Strategies module</li>
              <li>- Multi-timeframe → see Multi-timeframe Process module</li>
            </ul>
          </div>

          {/* Bloc 3 — LA PREMIÈRE IMPULSION EST SOUVENT EXCESSIVE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The first impulse is often excessive</h2>

            <div className="my-8">
              <FOMCImpulseExcessDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The FOMC decision almost always triggers an immediate market reaction, but that first impulse is rarely the real directional move. It is driven by the emotion of participants who over-read Powell's tone, the wording of the minutes, or a marginal shift in stance. This emotional reaction pushes price beyond the structural level that would have been consistent with the actual content of the decision, hence the excess.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD: price before the FOMC $4,660; first bearish impulse down to $4,590; initial move of $70 in a few minutes. Thirty minutes later: price comes back toward $4,638, correcting most of the initial impulse.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Actionable points: the first FOMC impulse is often an emotional reaction, not a structural read</li>
              <li>- The initial move frequently overshoots what the actual data justifies</li>
              <li>- Trading the impulse = trading the noise, not the decision</li>
              <li>- The real directional move comes after, sometimes within the hour, sometimes later</li>
            </ul>
          </section>

          {/* Bloc 4 — LE SIGNAL APPARAÎT APRÈS L'ESSOUFFLEMENT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The signal appears after the exhaustion</h2>

            <div className="my-8">
              <FOMCExhaustionDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Exhaustion is the key signal of the FOMC Fade. After the initial impulse, the market reaches a level where it can no longer make progress: the following candles print repeated rejection wicks, the acceleration stops, price fails to print a meaningful new high (or low). This is the visible signature that emotion is running out, the participants who chased the impulse realize they are alone, and the pressure in the initial direction weakens. This exhaustion point is the precondition for executing the fade.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD: bullish impulse $4,640 → $4,705 after the FOMC. At the top, three consecutive M15 candles print upper wicks of $6-8 without closing above 4,705. The acceleration is broken, the market stops making new highs. A few candles later, price corrects toward $4,670, the fade works.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Actionable points: exhaustion = repeated rejection wicks + loss of acceleration</li>
              <li>- Failure to print a meaningful new high / low = end-of-impulse signal</li>
              <li>- No visible exhaustion = no fade, you wait</li>
              <li>- The M15 is the timeframe for reading exhaustion</li>
            </ul>
          </section>

          {/* Bloc 5 — LE RETOUR DE BALANCIER DOIT RESTER STRUCTURÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The swing-back must stay structured</h2>

            <div className="my-8">
              <FOMCFadeSetupDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The FOMC Fade is not about anticipating a full trend reversal, it is a PARTIAL retrace trade, calibrated on the zone where most of the excessive impulse has been corrected. The structure must stay clear: entry after price stabilizes at the exhaustion point, tight stop loss just beyond the extreme of the impulse, target on the structural level the impulse started from. Without these three elements aligned, the setup is not valid.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD: FOMC drop $4,660 → $4,590; M15 stabilization around $4,595; gradual move back toward $4,638. Fade setup: long entry $4,600, stop loss $4,578, target $4,638. The setup aims for a partial retrace of the move, not a full Daily reversal.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Actionable points: the fade aims for a partial retrace, typically 50-80% of the impulse</li>
              <li>- Entry after a visible stabilization, never mid-impulse</li>
              <li>- Tight SL beyond the extreme, clear invalidation structure</li>
              <li>- Target on the structural level preceding the impulse (former support / resistance)</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Application plan: a complete FOMC Fade on XAU/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Here is the full sequence of a FOMC Fade setup, from the pre-FOMC context to risk management. Five steps, each with its role.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Step 1. H4 context</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: XAU below H4 resistance at $4,680, market waiting before the FOMC, volatility compression</li>
                <li>- Conclusion: high probability of expansion on the decision, we prepare the fade scenario</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 2. FOMC reaction</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: first bearish impulse $4,660 → $4,590, a $70 move in a few minutes, aggressive volatility</li>
                <li>- Conclusion: potentially excessive reaction, we wait for exhaustion, not immediate entry</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 3. Exhaustion</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: the market stops making new lows, long lower wicks on M15, stabilization around $4,595</li>
                <li>- Conclusion: selling pressure slowing down, the fade condition is validated</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 4. Fade execution</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Long entry: $4,600</li>
                <li>- Stop loss: $4,578 (beyond the extreme of the impulse)</li>
                <li>- Target: $4,638 (partial retrace toward the pre-FOMC level)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 5. Risk management</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Above-normal volatility → cautious position size</li>
                <li>- Execute only after stabilization, not mid-impulse</li>
                <li>- The main danger remains a premature entry into the initial impulse</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  Excess = condition · Exhaustion = signal · Stabilization = entry · Partial retrace = target
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "The first FOMC impulse is almost always driven by emotion, not by structural interpretation.",
              "The tradable signal appears after the exhaustion: rejection wicks, failure to print a new low / high.",
              "The FOMC Fade aims for a PARTIAL retrace of the initial move, not a full Daily trend reversal.",
              "No visible stabilization = no entry. Entering the initial impulse = trading emotional noise.",
            ]}
          />

          <LessonExercice
            description="On TradingView, identify a recent FOMC on EUR/USD or XAU/USD and reconstruct the FOMC Fade setup after the fact."
            steps={[
              "Spot the FOMC M15 candle: note the price before the impulse, the size of the first reaction, and the extreme level reached.",
              "Watch what happens over the next 30-60 minutes: visible exhaustion? rejection wicks? stabilization? Note the exact point where the pressure stops.",
              "If stabilization happened: reconstruct the fade setup (entry, tight SL, target on the pre-FOMC level). Check after the fact whether the R/R would have been favorable. If no visible stabilization: note why the setup should not have been taken.",
            ]}
          />

          <LessonQuiz
            question="You are positioned ahead of the FOMC on XAU/USD. The decision drops and triggers a violent bearish impulse of $70 in a few minutes. What do you do?"
            options={[
              "You short into the impulse to ride the ongoing move",
              "You don't enter right away: you wait for the impulse to exhaust before any trade",
              "You go long immediately, betting on a full reversal",
              "You place a limit order right at the extreme reached by the impulse",
            ]}
            correctIndex={1}
            explanation="The core rule of the FOMC Fade is clear: you never enter mid-impulse. The first FOMC reaction is driven by emotion, its size is unpredictable, and its extreme can be exceeded several times before the real stabilization. Discipline means waiting for the market to signal its own exhaustion, rejection wicks, failure to print new lows, stabilization around a level. It is that signal that opens the execution window, not the size of the initial move."
            answerExplanations={[
              "Wrong. Shorting into the impulse is exactly the trap the FOMC Fade is designed to avoid. The emotional impulse can extend without warning, and entering right in the middle exposes you to a very wide SL or a violent reversal against the position.",
              "Correct. Exhaustion is the absolute precondition of the setup. Without a visible end-of-impulse signal (rejection wicks, loss of acceleration, stabilization), there is no entry. Patience is the structural discipline of the Fade.",
              "Wrong. The FOMC Fade is not an immediate reversal trade. Going long right in the middle of a bearish impulse means anticipating a reversal with no visible structural basis, which is exactly the opposite of the model.",
              "Wrong. Placing a limit order at the extreme of the impulse assumes you know the extreme in advance, which is impossible. The market can overshoot several times before stabilizing, and the limit order would trigger without structural confirmation.",
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
                  markLessonComplete(p, "macro-trading", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 1 of the Macro Trading module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/macro-trading" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Macro Trading module. Overview
              </Link>
              <Link href="/strategies/macro-trading/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
