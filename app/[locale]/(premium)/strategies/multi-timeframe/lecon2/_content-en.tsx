"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { ContreTendanceTrapDiagram } from "@/app/components/charts/ContreTendanceTrapDiagram";
import { DirectionDominanteDiagram } from "@/app/components/charts/DirectionDominanteDiagram";
import { HTFFilterDiagram } from "@/app/components/charts/HTFFilterDiagram";

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
    setDone(isLessonComplete(getStoredProgress(), "multi-timeframe", "lecon2"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Strategies</Link>
          <span>/</span>
          <Link href="/strategies/multi-timeframe" className="hover:text-zinc-400 transition-colors">Multi-timeframe Process</Link>
          <span>/</span>
          <span className="text-zinc-500">Lesson 2</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Intermediate
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
            The higher timeframe: defining the dominant direction
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              The higher timeframe builds the context before any execution: it identifies the dominant direction, spots the important zones and shows where the market is actually pushing. It is not used to enter a position, it is used to avoid trades taken against the underlying trend.
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
            <span className="ml-auto text-xs text-zinc-600">2 / 5 lessons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo; The M5 shows a candle. The HTF, on the other hand, shows the real direction of the market. &rdquo;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Multi-timeframe reading → see Lesson 1</li>
              <li>- Market structure, HH/HL and LH/LL → see SMC module</li>
              <li>- HTF supports and resistances → see Support/Resistance module</li>
            </ul>
          </div>

          {/* Bloc 3 — LE PIÈGE DE LA CONTRE-TENDANCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The counter-trend trap</h2>

            <div className="my-8">
              <ContreTendanceTrapDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A clean setup on M15 can fail for one reason alone: it goes against the dominant HTF direction. The small timeframe often shows a simple local pullback. The higher timeframe, on the other hand, shows whether the market is really pushing up... or down.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: the Daily is bearish, with Daily/H4 resistance at 1.1760 and a current price at 1.1715. On M15, a bullish breakout forms at 1.1740. Price rises to 1.1752... then gets violently rejected toward 1.1685. The M15 breakout was real; the problem came from the underlying trend, which stayed bearish.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Check the HTF direction before any entry</li>
              <li>- A local impulse is not a global reversal</li>
              <li>- Avoid buys against a clear downtrend</li>
              <li>- Observe which direction produces the strongest impulses</li>
            </ul>
          </section>

          {/* Bloc 4 — LIRE LA DIRECTION DOMINANTE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Reading the dominant direction</h2>

            <div className="my-8">
              <DirectionDominanteDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The dominant direction is read in the quality of impulses and corrections. The goal is not to count candles, it is to observe which direction actually controls the market.
            </p>

            <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 mb-6">
              <p className="text-white font-semibold text-sm mb-2">What to look at</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Bullish vs bearish impulses</li>
                <li>- Strength of rejections</li>
                <li>- Speed of the moves</li>
                <li>- Size of the corrections</li>
              </ul>
            </div>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD: the bullish corrections on M15 are slow, but the drops on H4 are aggressive, in the range of $35-40, with systematic rejections below $4,680. The market stays bearish despite several local bounces.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Compare impulses and corrections</li>
              <li>- Observe which direction &ldquo; crushes &rdquo; the other</li>
              <li>- Prioritize setups in the direction of the dominant trend</li>
              <li>- Do not mistake a bounce for a reversal</li>
            </ul>
          </section>

          {/* Bloc 5 — LE HTF SERT À FILTRER */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The HTF is there to filter</h2>

            <div className="my-8">
              <HTFFilterDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The HTF eliminates weak setups before you even look for an entry. The trader is not looking for &ldquo; a trade &rdquo;, they are looking for a trade aligned with the dominant direction.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: the Daily is bearish, the Daily/H4 resistance is at 1.1760, the current price at 1.1715. What is sought: a return toward 1.1760, a local rejection, then a bearish continuation. What is avoided: an impulsive buy placed directly below the HTF resistance.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Always start with the HTF</li>
              <li>- Identify the dominant direction before the setup</li>
              <li>- Note the HTF zones before dropping down a timeframe</li>
              <li>- Filter out trades taken against the trend</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Application plan: an EUR/USD case</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The HTF is read from the biggest to the smallest. Here is the sequence on an EUR/USD case, without looking for an entry, the goal is only to set the context.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Step 1. Daily</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: structure in LH/LL, Daily resistance at 1.1760, bearish impulses stronger than the bounces</li>
                <li>- Conclusion: bearish dominant direction, priority to sells</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 2. H4</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: resistance zone between 1.1750 and 1.1760, repeated rejections below the resistance</li>
                <li>- Conclusion: ideal zone to wait for a bearish reaction</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 3. Prepare the scenario</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Expected: a move up toward the resistance, a local rejection, then a confirmation later on the execution timeframe</li>
                <li>- Avoided: an impulsive buy against the Daily trend</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  Daily = dominant direction · H4 = reaction zone · LTF = execution (Lesson 4)
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "The HTF defines the dominant direction of the market.",
              "A local impulse does not necessarily change the underlying trend.",
              "The strongest impulses show who actually controls the market.",
              "The HTF is used to filter out bad trades before looking for an entry.",
            ]}
          />

          <LessonExercice
            description="Open EUR/USD on TradingView and learn to recognize the real trend of the market before any execution."
            steps={[
              "On Daily: identify the dominant structure, compare the strength of impulses and corrections, and determine the main direction of the market.",
              "Then move to H4: spot an important HTF zone and note where the market could react.",
              "Finally write down the dominant direction, the setups to favor and the setups to avoid.",
            ]}
          />

          <LessonQuiz
            question="Which element best identifies the dominant direction of the market?"
            options={[
              "The total number of green candles",
              "The strongest impulses and the dominant rejections",
              "The M1 timeframe only",
              "A single isolated impulsive candle",
            ]}
            correctIndex={1}
            explanation="The dominant direction is read in the quality of impulses and reactions, not in the number of candles. A bearish market generally produces fast drops, weak corrections and aggressive sell rejections. The M1 only shows noise, and an isolated candle is never enough to define a lasting trend: it is the comparative strength of the moves that reveals which direction actually controls the market."
          />

        </div>

        {/* Footer */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "multi-timeframe", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 2 of the Multi-timeframe Process module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/multi-timeframe/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Previous lesson
              </Link>
              <Link href="/strategies/multi-timeframe/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
