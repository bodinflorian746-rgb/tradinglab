"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { MarketStructureDiagram } from "@/app/components/charts/MarketStructureDiagram";
import InternalVsExternalStructureZoomDiagram from "@/app/components/charts/InternalVsExternalStructureZoomDiagram";
import SMCPhasesDiagram from "@/app/components/charts/SMCPhasesDiagram";

const LESSONS = [
  { id: "lecon1", title: "SMC Market Structure: reading market structure like an institution", disabled: false },
  { id: "lecon2", title: "Lesson 2", disabled: false },
  { id: "lecon3", title: "Lesson 3", disabled: false },
  { id: "lecon4", title: "Lesson 4", disabled: true },
  { id: "lecon5", title: "Lesson 5", disabled: true },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "smc", "lecon1"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Strategies</Link>
          <span>/</span>
          <Link href="/strategies/smc" className="hover:text-zinc-400 transition-colors">SMC: Think institutional</Link>
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
            SMC Market Structure: reading market structure like an institution
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              This lesson covers the institutional reading of market structure: identifying significant swings, distinguishing internal from external structure, and recognizing the accumulation, manipulation and expansion phases.
            </p>
          </div>

          {/* Progress indicator */}
          <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600">
            {["Read", "Key points", "Exercise", "Quiz"].map((step, i, arr) => (
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

          {/* Lesson pills */}
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

        {/* ── Content ── */}
        <div className="space-y-8">

          {/* Block 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo;Retail sees a trend. The institutional player sees a structure with precise intentions at every swing.&rdquo;
              </p>
            </div>
          </section>

          {/* Block 2 — PREREQUISITES */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- HH/HL/LL/LH and directional trend → see Trading Course L3</li>
              <li>- Swing high / swing low → see Trading Course L2</li>
              <li>- Accumulation/distribution phases → see Macro Course L4</li>
            </ul>
          </div>

          {/* Block 3 — RECOGNIZING STRUCTURE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Recognizing structure</h2>

            <div className="my-8">
              <MarketStructureDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              SMC reading is built on identifying the significant swing highs and swing lows, not every oscillation of price. A significant swing leaves a visible structural footprint.
            </p>

            <h3 className="text-sm font-semibold text-zinc-200 mb-2">Criteria for a significant swing</h3>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Minimum range: 50-80 pips EUR/USD H4, $50-100 XAU/USD H4</li>
              <li>- Clear pivot candle with a significant rejection wick</li>
              <li>- Post-swing reaction: retracement ≥ 20% in the opposite direction</li>
              <li>- Multi-timeframe visibility: visible on Daily and H4</li>
            </ul>
          </section>

          {/* Block 4 — INTERNAL VS EXTERNAL STRUCTURE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Internal vs external structure</h2>

            <div className="my-8">
              <InternalVsExternalStructureZoomDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              SMC reading distinguishes 2 nested levels of structure on the same chart. When both align, you get the strong directional bias.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">Internal structure (M15 - H1)</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Moves visible on short timeframes</li>
                  <li>- Can print HH/HL inside an external LL/LH</li>
                  <li>- Trading in the external direction = institutional alignment</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">External structure (H4 - Daily)</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Major swings visible on higher timeframes</li>
                  <li>- Gives the directional bias for several days/weeks</li>
                  <li>- No institutional position goes against it without BOS + CHoCH</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Block 5 — THE 3 MARKET PHASES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The 3 market phases</h2>

            <div className="my-8">
              <SMCPhasesDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The market alternates between 3 recognizable phases. Identifying the current phase determines which setups are tradable.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-emerald-400 font-semibold text-sm mb-2">Accumulation</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Sideways range after a downtrend</li>
                  <li>- Reduced range, frequent fakeouts</li>
                  <li>- Range setups + bullish breakout after confirmation</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-amber-400 font-semibold text-sm mb-2">Manipulation (fakeout)</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Liquidity sweep above or below the range</li>
                  <li>- Wick pierces, then snaps brutally back inside the range</li>
                  <li>- Trap to collect retail stops before the real move</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-emerald-400 font-semibold text-sm mb-2">Expansion (markup/markdown)</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Clean directional trend HH/HL or LL/LH</li>
                  <li>- Swing amplitude above average</li>
                  <li>- This is the phase where SMC setups are taken in the directional sense</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Block 6 — 4-STEP METHOD */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Top-down reading in 4 steps</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Mapping a chart with SMC follows a structured top-down method.
            </p>
            <ol className="space-y-2 text-sm text-zinc-300 list-decimal pl-5">
              <li><span className="font-semibold text-white">Daily or Weekly</span>, identify the last 3-5 major swings (external structure)</li>
              <li><span className="font-semibold text-white">Classify the phase</span>, accumulation, expansion, or distribution</li>
              <li><span className="font-semibold text-white">H4</span>, check the alignment of internal structure with external structure</li>
              <li><span className="font-semibold text-white">H1 or M15</span>, pre-identify zones of interest (HL, liquidity, potential OB)</li>
            </ol>
          </section>

          {/* Block 7 — WORKED EXAMPLE XAU/USD */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Worked example: SMC reading on XAU/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              XAU/USD in a bullish dynamic for 8 weeks. Applying the SMC method to map the market.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Major Daily swings</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Swing low: $4,380 (-5 wk)</li>
                <li>- Swing high: $4,520 (-4 wk)</li>
                <li>- HL: $4,460 (-3 wk)</li>
                <li>- HH: $4,720 (-1 wk)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Verdict</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Phase: bullish expansion (markup) confirmed</li>
                <li>- Bias: long</li>
                <li>- Active pullback zone: $4,580-$4,600 (last H4 HL)</li>
                <li>- Secondary zone: $4,540-$4,560 (61.8% Fibo)</li>
                <li>- Setup to watch: M15 rejection signal at the $4,580-$4,600 touch for a long in the direction of the Daily markup</li>
              </ul>
            </div>
          </section>

          {/* Block 8 — COMMON MISTAKES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Common mistakes</h2>
            <div className="space-y-3">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-2">1. Confusing internal and external structure</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- HH/HL M15 inside a bearish Daily = pullback, not reversal</li>
                  <li>- Always establish the external structure first</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-2">2. Reading M15 without HTF context</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Every oscillation becomes a signal with no coherence</li>
                  <li>- Top-down procedure is mandatory: Daily → M15</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-2">3. Significant swing on insufficient range</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- A 20-pip swing on EUR/USD H4 is NOT a structural reference</li>
                  <li>- Strictly apply the thresholds from Block 3</li>
                </ul>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "SMC reading distinguishes internal structure (M15/H1) from external structure (H4/Daily). Alignment gives the bias.",
              "The market alternates between 3 phases: accumulation, manipulation (fakeout), expansion (markup/markdown).",
              "Top-down procedure is mandatory: Daily → H4 → H1 → M15. No directional analysis on M15 in isolation.",
              "No setup against the external Daily structure without a counter-trend BOS + confirmed CHoCH.",
            ]}
          />

          <LessonExercice
            description="On EUR/USD, the Daily shows a bearish structure with LL/LH over the last 6 weeks. For the past 3 days the H4 shows an internal structure with a recent HH at 1.1780 and an HL at 1.1720. Current price is 1.1760. How do you classify this situation and what operational bias follows from it?"
            steps={[
              "Identify the external Daily structure: bearish structure confirmed (LL/LH) over the last 6 weeks, major bearish directional bias.",
              "Identify the internal H4 structure: short-term bullish structure (recent HH at 1.1780, HL at 1.1720), a counter-trend move relative to the Daily.",
              "Classify the situation: bullish H4 internal structure INSIDE a bearish external Daily structure → technical pullback within the major bearish trend.",
              "Check for the absence of a reversal signal: no counter-trend Daily BOS nor confirmed CHoCH. The external Daily structure remains valid.",
              "Operational bias: SHORT, in the direction of the external Daily structure. No long setup is tradable until the Daily produces BOS + CHoCH. The internal H4 structure serves only to identify the potential rejection zone around 1.1780 (last H4 HH = potential short resistance on the touch).",
            ]}
          />

          <LessonQuiz
            question="On an SMC setup, which timeframe dictates the overall direction of the trade?"
            options={[
              "M15, which gives the most recent signal",
              "H4, which combines direction and timing",
              "Daily, which establishes the external structure and directional bias",
              "M1, for maximum precision",
            ]}
            correctIndex={2}
            explanation="The external Daily structure dictates the overall directional bias. H4 refines the context (internal structure and operational levels), M15 serves only for fine entry timing. No SMC setup is taken against the direction given by the Daily."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "smc", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 1 of the SMC: Think institutional module completed.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/smc" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                SMC module. Overview
              </Link>
              <Link href="/strategies/smc/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Lesson 2
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
