"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { IctLiquidityGrabDiagram } from "@/app/components/charts/IctLiquidityGrabDiagram";
import { FalseBreakoutTrapDiagram } from "@/app/components/charts/FalseBreakoutTrapDiagram";
import { PostSweepReactionDiagram } from "@/app/components/charts/PostSweepReactionDiagram";

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
    setDone(isLessonComplete(getStoredProgress(), "ict", "lecon1"));
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
            Understanding the ICT model: liquidity and manipulation
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              The market doesn&apos;t break highs by accident. It often goes to grab liquidity before the real move.
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
            <span className="ml-auto text-xs text-zinc-600">1 / 5 lessons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &laquo; The market doesn&apos;t pay for the obvious. It pays those who wait until the manipulation is done. &raquo;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PREREQUISITES */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Market structure, BOS and CHoCH → see SMC module, lesson &laquo; BOS and CHoCH: reading institutional structural signals &raquo;</li>
              <li>- FVG and liquidity → see SMC module, lesson &laquo; FVG and liquidity: trading the institutional imbalance &raquo;</li>
              <li>- Multi-timeframe → see Multi-timeframe Process module</li>
            </ul>
          </div>

          {/* Bloc 3 — THE MARKET HUNTS THE OBVIOUS ZONES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The market hunts the obvious zones</h2>

            <div className="my-8">
              <IctLiquidityGrabDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The ICT framework starts from a simple observation: the most obvious levels, equal highs, equal lows, recent highs or lows clearly visible on the chart, concentrate the stop orders of retail participants. Stop loss above a high, stop loss below a low: these zones form pools of liquidity visible to the naked eye on the chart. The market will go there, mechanically, because that&apos;s where the orders that drive the institutional algorithms are sitting.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1: two nearly identical highs form at 1.1780 over a few hours. Every trader who is short sees this resistance and places their SL just above, around 1.1790-1.1795. The market pushes up a third time, breaks through 1.1780, hits 1.1792, every stop is triggered, then drops violently toward 1.1720. The liquidity has been taken, the real move starts after.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Equal highs / equal lows = liquidity visible to the naked eye</li>
              <li>- The more obvious a level, the more stops it concentrates</li>
              <li>- The market goes to grab these zones, it&apos;s not random, it&apos;s order execution</li>
              <li>- Trading the naive break of these levels = getting caught on the wrong side</li>
            </ul>
          </section>

          {/* Bloc 4 — A BREAK IS NOT ALWAYS A CONTINUATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">A break is not always a continuation</h2>

            <div className="my-8">
              <FalseBreakoutTrapDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A beginner&apos;s natural reflex when facing a resistance break is to buy the breakout. The ICT reflex is to ask whether that break holds or whether it&apos;s simply a manipulation. A break that doesn&apos;t confirm, meaning it isn&apos;t followed by a clean continuation in the new direction, is almost always a trap. Price comes back below the resistance, and everyone who bought the breakout is instantly in a loss.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD M15: resistance sits at $4,680, tested several times. A candle breaks above, hits $4,695, breakout traders enter long with their SL below 4,680. A few candles later, price reclaims below 4,680, drops quickly toward 4,650. The break didn&apos;t hold, it only served to trigger the breakout orders to fuel the drop.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- A break only has value if it holds and is followed by a continuation</li>
              <li>- Immediate reclaim below the broken level = trap, you flip the scenario mentally</li>
              <li>- The naive breakout is one of the most expensive setups for retail traders</li>
              <li>- ICT doesn&apos;t trade the break, it trades what happens AFTER</li>
            </ul>
          </section>

          {/* Bloc 5 — THE REAL SIGNAL = THE REACTION AFTER THE LIQUIDITY */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The real signal = the reaction after the liquidity</h2>

            <div className="my-8">
              <PostSweepReactionDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The heart of the ICT model fits in one sentence: you don&apos;t trade the liquidity grab, you trade the REACTION that follows. The sweep itself isn&apos;t a signal, it&apos;s a precondition. The signal comes right after: price must reclaim below (or above, depending on direction) the swept level, then a clean impulsive candle must confirm the reversal. It&apos;s that sweep → reclaim → impulse sequence that validates an entry, not the sweep wick alone.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD M15 chart: price just printed a wick above 1.1780 (sweep). On the next candle, it closes back below 1.1780 (reclaim). On the candle after, a large bearish body of 35 pts (impulse). It&apos;s that sequence that allows a short, entry on the break of the last local low, SL just above the sweep high, TP toward the next liquidity zone downstream.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- The sweep alone triggers nothing, it&apos;s a condition, not a signal</li>
              <li>- The reclaim below the swept level is the first confirmation</li>
              <li>- A clean impulsive candle in the new direction validates the entry</li>
              <li>- Tight SL above the sweep high, the structure invalidates the scenario</li>
            </ul>
          </section>

          {/* Bloc 6 — APPLICATION PLAN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Application plan: a complete EUR/USD sweep</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Here is the full HTF → Liquidity → Sweep → Reaction sequence on a EUR/USD case. Four steps, each with its role.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Step 1. HTF (Daily): directional bias</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: EUR/USD Daily in LH/LL structure for three weeks, major resistance at 1.1860</li>
                <li>- Conclusion: bearish bias confirmed, we&apos;ll look for shorts on a high liquidity grab</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 2. Liquidity (H1): spot the target</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: two nearly identical highs formed at 1.1780 in the last session</li>
                <li>- Conclusion: equal highs at 1.1780 = visible liquidity. The short stops are sitting above, around 1.1790-1.1795</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 3. Sweep (M15): wait for the grab</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: an M15 candle prints a wick above 1.1780, hits 1.1792, and closes back below 1.1780</li>
                <li>- Conclusion: the liquidity has been taken. We switch to &laquo; watch &raquo; mode for the reaction, no entry yet</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 4. Reaction (M15): execute</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: the next candle is a large impulsive bearish body (35 pts), break of the last local low at 1.1762</li>
                <li>- Conclusion: short entry at 1.1758 on the break, SL at 1.1795 (3 pts above the sweep high), TP toward the next low liquidity zone at 1.1695. R/R ≈ 1 : 1.7, high-probability setup aligned Daily + sweep + reaction</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = bias · Liquidity = target · Sweep = condition · Reaction = signal
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "The market goes to grab the obvious liquidity zones, equal highs/lows, recent visible highs/lows.",
              "A break isn’t a continuation until it holds. The reclaim below the broken level is a sign of manipulation.",
              "The real entry signal comes AFTER the sweep: reclaim + impulsive candle in the opposite direction.",
              "Without a clean reaction, the sweep alone isn’t enough, patience beats the urge to trade the wick.",
            ]}
          />

          <LessonExercice
            description="On TradingView, spot a complete sweep on the pair of your choice and map the HTF → Liquidity → Sweep → Reaction sequence."
            steps={[
              "HTF (Daily or H4): identify the structure and conclude a clear directional bias. Without a clean HTF bias, don’t drop lower.",
              "H1: spot two nearly identical highs (equal highs) or two nearly identical lows (equal lows) in the direction of the bias. Draw a horizontal line at that level, it’s the target liquidity zone.",
              "M15: wait for price to come sweep that level (wick that overshoots, body that closes back on the right side). Then look for the reclaim and the impulsive candle. If the sequence is complete, note the entry, the SL above/below the sweep high/low, and the TP toward the next liquidity zone.",
            ]}
          />

          <LessonQuiz
            question="Price just printed a wick above an equal high at 1.1780, hits 1.1792 then closes back below 1.1780. What do you look for to validate a short entry?"
            options={[
              "You enter immediately: the sweep alone is the entry signal",
              "You wait for an impulsive bearish candle after the reclaim below the level",
              "You wait for a green candle on M1 confirming the bullish resumption",
              "You wait for price to retouch exactly the wick high at 1.1792 before entering",
            ]}
            correctIndex={1}
            explanation="The sweep is only a precondition, not a signal. The ICT model requires a complete SEQUENCE: sweep → reclaim below the level → impulsive candle in the new direction. Without that confirming impulsive candle, you don't enter, patience lets you avoid false signals where the sweep is followed by a sideways consolidation or another bullish push."
            answerExplanations={[
              "False. Entering on the sweep alone, without waiting for the reaction, is trading the wick, exactly what the ICT model aims to avoid. The sweep can be followed by a consolidation, another bullish push, or nothing at all. Without confirmation, it's a gamble.",
              "Correct. The complete ICT sequence requires sweep → reclaim → impulsive candle. It's the bearish impulse that confirms the liquidity grab translated into a real move. The entry is taken on the break of the last local low, tight SL above the sweep high.",
              "False. A green candle would signal the bullish resumption, meaning the invalidation of the short scenario. To validate a short, you look for a RED impulsive candle, not green. Plus, dropping down to M1 to find confirmation goes against the model, which executes on M15.",
              "False. A sweep never replays exactly to the pip. Waiting for the wick high to be retouched is waiting for an event that won't happen, price runs in the opposite direction while you watch the wrong spot.",
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
                  markLessonComplete(p, "ict", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 1 of the Complete ICT module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/ict" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                ICT module. Overview
              </Link>
              <Link href="/strategies/ict/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
