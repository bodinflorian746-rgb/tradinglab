"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { SingleTimeframeTrapDiagram } from "@/app/components/charts/SingleTimeframeTrapDiagram";
import { HTFBiasDiagram } from "@/app/components/charts/HTFBiasDiagram";
import { IntermediateZoneDiagram } from "@/app/components/charts/IntermediateZoneDiagram";
import { LTFExecutionDiagram } from "@/app/components/charts/LTFExecutionDiagram";

const LESSONS = [
  { id: "lecon1", title: "Why analyze in multi-timeframe", disabled: false },
  { id: "lecon2", title: "The higher timeframe: the bias", disabled: false },
  { id: "lecon3", title: "The intermediate timeframe: the zone", disabled: false },
  { id: "lecon4", title: "The execution timeframe: the entry", disabled: false },
  { id: "lecon5", title: "The complete process", disabled: false },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "multi-timeframe", "lecon1"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Strategies</Link>
          <span>/</span>
          <Link href="/strategies/multi-timeframe" className="hover:text-zinc-400 transition-colors">Multi-timeframe Process</Link>
          <span>/</span>
          <span className="text-zinc-500">Lesson 1</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Intermediate
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">16 min</span>
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
            Why analyze in multi-timeframe
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              This lesson lays out the logic of multi-timeframe: why trading a single chart leaves you blind, and the concrete role of each level, the higher timeframe gives the bias, the intermediate timeframe locates the zone, the execution timeframe triggers the entry.
            </p>
          </div>

          {/* Indicateur de structure */}
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

          {/* Pills des leçons */}
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

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo; A perfect setup on M15 can turn into a complete trap if the Daily tells the opposite story. &rdquo;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Trends and chart reading → see Trading Courses</li>
              <li>- Market structure, BOS and CHoCH → see SMC module, Lesson 2</li>
              <li>- Supports, resistances and key zones → see Support/Resistance module</li>
            </ul>
          </div>

          {/* Bloc 3 — LE PIÈGE DU GRAPHIQUE UNIQUE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The single-chart trap</h2>

            <div className="my-8">
              <SingleTimeframeTrapDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A single timeframe shows only a part of the market, never the whole. An M15 chart can display a clean bounce while the Daily stays in a heavy downtrend. The result: an &ldquo; obvious buy &rdquo; on the small timeframe turns into a simple pullback before the bearish continuation.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: the Daily shows a bearish structure in LH/LL, with major resistance around 1.1820. On M15, a local bullish breakout forms near 1.1760. Price rises to 1.1775, then drops back toward 1.1700. The M15 signal was technically valid; the problem came from the HTF context.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Always check the HTF direction before entering</li>
              <li>- An LTF signal against the HTF = reduced probability</li>
              <li>- The small timeframe often shows a pullback, not a reversal</li>
              <li>- The HTF context outweighs the local signal</li>
            </ul>
          </section>

          {/* Bloc 4 — HTF : TROUVER LE BIAIS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The higher timeframe: finding the bias</h2>

            <div className="my-8">
              <HTFBiasDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The HTF answers a single question: in which direction does the market statistically have the best chance of continuing? It is not used to enter, it is used to filter out bad trades before you even look for a setup.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">What to look at</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Market structure: HH/HL or LH/LL</li>
                  <li>- Major Daily and H4 zones</li>
                  <li>- Direction of the dominant impulses</li>
                  <li>- Visible HTF liquidity</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">What to conclude</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Bullish bias = priority to buys</li>
                  <li>- Bearish bias = priority to sells</li>
                  <li>- HTF zone nearby = caution</li>
                  <li>- Market with no clear structure = avoid aggressive setups</li>
                </ul>
              </div>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Always start with the HTF</li>
              <li>- Identify a direction before looking for an entry</li>
              <li>- Ignore signals opposed to the main bias</li>
              <li>- Note the HTF zones before dropping down a timeframe</li>
            </ul>
          </section>

          {/* Bloc 5 — TIMEFRAME INTERMÉDIAIRE : ZONE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The intermediate timeframe: finding the zone</h2>

            <div className="my-8">
              <IntermediateZoneDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The intermediate timeframe locates the zone where the market can react. It is the level that turns a general HTF idea into an actionable scenario. The HTF says &ldquo; sell &rdquo;; the intermediate timeframe says &ldquo; where &rdquo;.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">What to look for</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- H1 or H4 support / resistance</li>
                  <li>- Order Block or FVG</li>
                  <li>- Liquidity zone</li>
                  <li>- Retest after an impulse</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">What to do</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Wait for price to return into the zone</li>
                  <li>- Prepare the scenario before the entry</li>
                  <li>- Avoid entries &ldquo; in the middle of nowhere &rdquo;</li>
                </ul>
              </div>
            </div>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: the HTF is bearish. On H1, a resistance zone forms between 1.1765 and 1.1780. Price returns there, then you watch for a sell signal on the LTF.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Work from precise zones</li>
              <li>- Wait for price to return into the zone</li>
              <li>- Prepare the scenario before the trigger</li>
              <li>- An aligned HTF + H1 zone = cleaner reaction</li>
            </ul>
          </section>

          {/* Bloc 6 — LTF : EXÉCUTION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The execution timeframe: triggering the trade</h2>

            <div className="my-8">
              <LTFExecutionDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The LTF is used only to execute. It is the timeframe of timing, not of bias. Its role is to show that the market is actually reacting in the zone prepared on the higher timeframes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">What to look for</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Local CHoCH or BOS</li>
                  <li>- Violent rejection</li>
                  <li>- Liquidity sweep</li>
                  <li>- Impulsive candle exiting the zone</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">What to do</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Enter after confirmation</li>
                  <li>- Place the SL behind the local structure</li>
                  <li>- Execute in the direction of the HTF</li>
                </ul>
              </div>
            </div>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: the H1 zone is at 1.1765-1.1780. On M15, a bullish sweep reaches for liquidity up to 1.1778. A bearish CHoCH forms on M5. The short entry triggers after the rejection.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- The LTF is for timing, not for context</li>
              <li>- Wait for a clear reaction in the zone</li>
              <li>- Avoid premature entries</li>
              <li>- Execute only in the direction prepared by the HTF</li>
            </ul>
          </section>

          {/* Bloc 7 — PROCESS COMPLET (sans SVG) */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The complete process: an EUR/USD trade step by step</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Put end to end, the three levels form a funnel: context narrows the possibilities, then timing refines the execution. Here is the full sequence on an EUR/USD case.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Step 1. HTF (H4)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: bearish structure in LH/LL, major resistance at 1.1780, current price at 1.1725</li>
                <li>- Conclusion: priority to sells, no aggressive buy sought</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 2. Intermediate timeframe (H1)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: resistance zone between 1.1765 and 1.1780, former support turned resistance, rejection already observed</li>
                <li>- Conclusion: ideal zone to wait for a bearish reaction</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 3. LTF (M5 / M15)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: bullish sweep up to 1.1778, bearish CHoCH on M5, impulsive rejection candle</li>
                <li>- Conclusion: valid sell confirmation, short entry possible after the local break</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = direction · Intermediate timeframe = zone · LTF = timing
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "A single timeframe gives an incomplete view of the market.",
              "The HTF defines the main bias, the direction of the trade.",
              "The intermediate timeframe locates the zone of interest where to act.",
              "The LTF is used only for the trigger: it gives the timing, not the bias.",
            ]}
          />

          <LessonExercice
            description="Open EUR/USD on TradingView and run the multi-timeframe process yourself, from the big timeframe to the small one. The goal: to see concretely what each level brings to the decision."
            steps={[
              "On H4, identify the dominant structure (HH/HL or LH/LL), the last major swing, and an important zone.",
              "Drop to H1: locate a zone where price could react in the direction of the H4 bias, and draw it.",
              "Finish on M5 or M15: wait for a trigger in the zone (rejection, CHoCH or sweep) and note precisely what would validate an entry.",
              "Compare: what did the H4 tell you that the M5 did not show? What does the M5 specify that the H4 could not give?",
            ]}
          />

          <LessonQuiz
            question="What is the main role of the execution timeframe (LTF) in a multi-timeframe process?"
            options={[
              "Determine the market's main bias",
              "Identify the major Daily zones",
              "Give the precise timing of the entry",
              "Completely replace the HTF analysis",
            ]}
            correctIndex={2}
            explanation="The LTF is used to confirm execution in a zone already prepared by the higher timeframes. The bias comes from the HTF, the zone comes from the intermediate timeframe; the LTF only steps in to refine the timing and reduce risk. It complements the HTF analysis, it never replaces it."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "multi-timeframe", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 1 of the Multi-timeframe Process module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/multi-timeframe" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Multi-timeframe module. Overview
              </Link>
              <Link href="/strategies/multi-timeframe/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
