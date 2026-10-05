"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { NFPHeadlineReactionDiagram } from "@/app/components/charts/NFPHeadlineReactionDiagram";
import { NFPStabilizationDiagram } from "@/app/components/charts/NFPStabilizationDiagram";
import { NFPReversalDiagram } from "@/app/components/charts/NFPReversalDiagram";

const LESSONS = [
  { id: "lecon1", title: "FOMC Fade", disabled: false },
  { id: "lecon2", title: "NFP Overreaction", disabled: false },
  { id: "lecon3", title: "Risk-off Regime", disabled: false },
  { id: "lecon4", title: "Pre-trade macro filter", disabled: false },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-trading", "lecon2"));
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
          <span className="text-zinc-500">Lesson 2</span>
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
            NFP Overreaction: trading the overreaction to the US jobs report
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              The first NFP move often looks more impressive than it really is informative. The market reacts to the headline number… then sharply re-reads the report a few minutes later.
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
              const isCurrent = lesson.id === "lecon2";
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
            <span className="ml-auto text-xs text-zinc-600">2 / 4 lessons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « The NFP number is just one line of the report. The market takes a few minutes to read everything else, and that's where the real move plays out. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- NFP and the economic calendar → see Macro module</li>
              <li>- Consensus vs actual number → see Macro module</li>
              <li>- Support, resistance and liquidity → see Strategies module</li>
              <li>- Multi-timeframe → see Multi-timeframe Process module</li>
            </ul>
          </div>

          {/* Bloc 3 — LE CHIFFRE HEADLINE PROVOQUE SOUVENT UNE SUR-RÉACTION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The headline number often triggers an overreaction</h2>

            <div className="my-8">
              <NFPHeadlineReactionDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The NFP is released every first Friday of the month and almost always triggers a violent impulse on the dollar and the assets sensitive to it. XAU/USD, EUR/USD, US indices. But that first reaction is built on the headline number (the number of jobs created) in a split second, while the full report contains other data, wages, unemployment rate, participation rate, revisions to previous months. The market reacts to the headline first, then abruptly prices in the rest of the report a few minutes later. This two-phase structure is the very signature of the NFP Overreaction setup.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD: price before the NFP $4,640. The number comes in above consensus, headline read as hawkish. First bearish impulse down to $4,575 in 5 minutes, breaking support at $4,600. Then the market digests the detail of the report (softer wages, downward revisions), price stabilizes around $4,580-4,585, then climbs back toward $4,625 over the following hour.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Actionable points: the headline triggers an instant reaction, rarely well calibrated structurally</li>
              <li>- The initial size can overshoot the "logical" level of the full report by a lot</li>
              <li>- The market typically takes 15 to 60 minutes to digest the full report</li>
              <li>- Trading the first impulse = trading the emotional read of the headline</li>
            </ul>
          </section>

          {/* Bloc 4 — LE RETOURNEMENT APPARAÎT APRÈS LA STABILISATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The reversal appears after the stabilization</h2>

            <div className="my-8">
              <NFPStabilizationDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The execution window for the NFP setup opens when the initial move stops progressing. Visually, this shows up as a SERIES of M15 candles with repeated wicks against the direction of the impulse, lower wicks if the impulse was bearish, upper wicks if it was bullish. Price compresses around a level, can no longer make new extremes. This is the visible trace that the initial sellers (or buyers) are done acting, and that the opposing liquidity is starting to absorb. Without this visible stabilization, the setup is not activated.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD: after the initial NFP drop to $4,575, four consecutive M15 candles print lower wicks of $6-8 each, without closing below. Price settles between $4,580-4,585. Once that base is recognized, the market starts a clean recovery toward $4,630 over the following hour.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Actionable points: stabilization is read on the M15, not on faster timeframes</li>
              <li>- Series of repeated wicks + loss of acceleration = end-of-impulse signal</li>
              <li>- No stabilization = no setup, regardless of the initial size</li>
              <li>- The execution is taken after confirmation, never in anticipation</li>
            </ul>
          </section>

          {/* Bloc 5 — LE NFP PEUT PRODUIRE UN VRAI CHANGEMENT DE DIRECTION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The NFP can produce a real change of direction</h2>

            <div className="my-8">
              <NFPReversalDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Not every NFP produces a simple fade. When the post-stabilization re-pricing turns into a clean, wide and sustained move, the market actually changes direction, the full report implies a different read than the initial headline, and institutional participants position the other way. The telltale sign: the move back does not stop at the pre-NFP level but clearly overshoots it. When this dynamic appears, the setup is no longer a tactical fade but a short/medium-term trend opportunity.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD: initial NFP impulse from $4,640 toward $4,575. Base around $4,580-4,585. Then a bullish break above $4,620, acceleration up to $4,665, beyond the pre-NFP level. The full report (solid wages, positive revisions) cancelled the hawkish read of the headline. The market completely reversed its bias.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Actionable points: overshooting the pre-NFP level signals a real reversal, not a simple fade</li>
              <li>- A clean break above (or below) the pre-NFP level changes the nature of the setup</li>
              <li>- The full reversal justifies a more ambitious target than the classic tactical fade</li>
              <li>- The fade / reversal distinction confirms within 30-60 minutes after stabilization</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Application plan: a complete NFP Overreaction on XAU/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Here is the full sequence of an NFP Overreaction trade, from the pre-NFP context to risk management. Six steps, each with its role.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Step 1. Pre-NFP H4 context</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: XAU/USD compresses between $4,630 and $4,650 in the hours before the NFP, reduced volatility</li>
                <li>- Conclusion: high probability of expansion on the release, we prepare the fade scenario</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 2. NFP release</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: headline number above consensus, first bearish impulse $4,640 → $4,575 in a few minutes</li>
                <li>- Conclusion: excessive headline reaction, we wait for stabilization, no immediate entry</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 3. M15 stabilization</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: price stops making new lows, four M15 candles with repeated lower wicks, price settled around $4,580-4,585</li>
                <li>- Conclusion: visible buying absorption, the setup condition is validated</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 4. Confirmation of the re-pricing</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: first clean recovery candle, the market starts printing local highs</li>
                <li>- Conclusion: the re-pricing is underway, we can execute the fade</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 5. Fade execution</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Long entry: $4,612</li>
                <li>- Stop loss: $4,568 (beyond the extreme of the impulse)</li>
                <li>- Target: $4,655 (near the pre-NFP level)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 6. Risk management</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Post-NFP volatility above normal → cautious position size</li>
                <li>- Execute only after visible stabilization, never in the impulse</li>
                <li>- If stabilization does not appear within 30 minutes: skip the trade</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  Headline = overreaction · Stabilization = condition · Re-pricing = signal · Pre-NFP = natural target
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "The first NFP impulse is driven by the headline number, not by the full report, which is digested over 15-60 minutes.",
              "The tradable signal appears after the stabilization: repeated wicks, loss of acceleration, price settled in a narrow zone.",
              "The classic fade aims for a partial retrace toward the pre-NFP level; a clean overshoot signals a real shift of bias.",
              "Without visible stabilization, no entry, the initial size is never in itself an execution signal.",
            ]}
          />

          <LessonExercice
            description="On TradingView, identify a recent NFP on EUR/USD or XAU/USD and reconstruct the NFP Overreaction setup after the fact."
            steps={[
              "Spot the exact moment of the NFP release: note the price just before, the size of the first impulse, and the extreme level reached within 5-10 minutes.",
              "Watch what happens over the next 15-60 minutes: visible stabilization? repeated wicks? break of the pre-NFP level the other way? Note the exact point where the dynamic flips.",
              "If stabilization happened: reconstruct the fade setup (entry, tight SL, target toward the pre-NFP level). If the move back clearly overshoots the pre-NFP: note the full reversal. If nothing clean happens: note why the setup should not have been taken.",
            ]}
          />

          <LessonQuiz
            question="The NFP has just dropped on XAU/USD: violent bearish impulse toward $4,575, price settled around $4,580-4,585 for the last 20 minutes with repeated lower wicks. What do you do?"
            options={[
              "You short, assuming the drop will continue",
              "You wait for a first clean recovery candle, then take the long fade",
              "You place a limit order at $4,575 to buy the exact lower wick",
              "You ignore the setup: post-NFP volatility is too dangerous to trade",
            ]}
            correctIndex={1}
            explanation="The NFP Overreaction sequence is clear: impulse → stabilization → confirmation → execution. Here the stabilization is visible (repeated lower wicks, price settled), but the confirmation of the re-pricing hasn't arrived yet. You wait for the first clean recovery candle to validate that the market has really shifted onto the full read of the report. Without that confirmation, the entry would be premature, the stabilization can last longer than expected, or even give way in the initial direction."
            answerExplanations={[
              "Wrong. Shorting after stabilization means trading in the direction of the initial emotional impulse exactly when the market is signaling it is done falling. It is the opposite of the NFP Overreaction setup.",
              "Correct. The sequence requires stabilization AND THEN confirmation. The first clean recovery candle validates the re-pricing and opens the fade execution window. Without that confirmation, you wait, the stabilization can run longer, or extend into a range.",
              "Wrong. A limit order at the extreme of the initial move assumes you know the boundary, when it may be retested lower or not. And even if price returns there, the entry would happen without structural confirmation.",
              "Wrong. Post-NFP volatility is exactly what makes this setup interesting, it is what creates the range the fade exploits. Discipline (waiting for stabilization + confirmation) is enough to manage the risk without giving up the setup.",
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
                  markLessonComplete(p, "macro-trading", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 2 of the Macro Trading module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/macro-trading/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Previous lesson
              </Link>
              <Link href="/strategies/macro-trading/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
