"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { TrendDiagram } from "@/app/components/charts/TrendDiagram";
import TrendIdentificationStepsDiagram from "@/app/components/charts/TrendIdentificationStepsDiagram";
import TrendStrengthGradationDiagram from "@/app/components/charts/TrendStrengthGradationDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Recognizing a trend (HH/HL vs LH/LL)", disabled: false },
  { id: "lecon2", title: "Lesson 2",          disabled: true },
  { id: "lecon3", title: "Lesson 3",          disabled: true },
  { id: "lecon4", title: "Lesson 4",          disabled: true },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "trend-following", "lecon1"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Strategies</Link>
          <span>/</span>
          <Link href="/strategies/trend-following" className="hover:text-zinc-400 transition-colors">Trend Following</Link>
          <span>/</span>
          <span className="text-zinc-500">Lesson 1</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Beginner
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">15 min</span>
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
            Recognizing a trend (HH/HL vs LH/LL)
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              This lesson teaches you to identify a tradable trend and to trade the pullback in the direction of that trend.
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
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &quot;A healthy trend is recognized by its regularity. A clean entry is taken on the pullback, not on the extension.&quot;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- HH/HL/LL/LH → see Trading Course L3</li>
              <li>- Pullback concept → see Trading Course L3</li>
              <li>- S/R levels for targets → see SR Strategy L1</li>
            </ul>
          </div>

          {/* Bloc 3 — RECONNAÎTRE LA TENDANCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Recognizing the trend (3 states)</h2>

            <div className="my-8">
              <TrendDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The market alternates between 3 recognizable states. Identifying the current state determines the type of setup to favor.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Uptrend: ascending HH/HL sequence → long trade on pullback</li>
              <li>- Sideways range: oscillation between 2 levels → range trade or wait for the breakout</li>
              <li>- Downtrend: descending LL/LH sequence → short trade on pullback</li>
              <li>- Main identification timeframe: H4. Daily confirmation reinforces the bias</li>
            </ul>
          </section>

          {/* Bloc 4 — IDENTIFIER EN 3 ÉTAPES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Identify in 3 steps</h2>

            <div className="my-8">
              <TrendIdentificationStepsDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Qualifying a trend follows a methodical procedure in 3 successive steps.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Step 1: spot the pivots (lows and highs) over the last 30-50 candles</li>
              <li>- Step 2: confirm the sequence (2 HL + 2 HH minimum, or 2 LH + 2 LL minimum)</li>
              <li>- Step 3: validate the amplitude (≥ 30-50 pips on EUR/USD H4, $50-100 on XAU/USD H4)</li>
            </ul>
          </section>

          {/* Bloc 5 — QUALIFIER LA FORCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Qualify the strength</h2>

            <div className="my-8">
              <TrendStrengthGradationDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Not all trends have the same strength. Swing amplitude and slope condition the structural R/R.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Weak trend (slope &lt; 20°, amplitude ~50 pips): barely tradable</li>
              <li>- Moderate trend (slope ~35°, amplitude ~100 pips): tradable with discipline</li>
              <li>- Strong trend (slope &gt; 55°, amplitude ~200 pips): setup to favor</li>
              <li>- Tradable pullback: between 30% and 60% of the previous impulse</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Trade plan: EUR/USD H4 pullback</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              EUR/USD in a confirmed uptrend (2 HL at 1.1700 and 1.1730, 2 HH at 1.1780 and 1.1810). Price pulls back toward 1.1760 (62% of the 80-pip impulse) and prints a bullish pin bar.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup (long trade on pullback)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Long entry: 1.1765 (pin bar close)</li>
                <li>- Stop loss: 1.1720 (10 pips below the last HL at 1.1730)</li>
                <li>- Take profit level 1: 1.1810 (previous HH), level 2: 1.1890 (80-pip projection)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">R/R calculation</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risk: 1.1765 - 1.1720 = 45 pips</li>
                <li>- Gain level 1: 45 pips → R/R 1:1 (partial exit possible)</li>
                <li>- Gain level 2: 125 pips → R/R 125/45 = 2.78</li>
                <li>- The setup primarily targets TP level 2</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Retail calculation</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- €300 account → 5% = €15 risk, €42 potential gain</li>
              <li>- €500 account → 3% = €15 risk, €42 potential gain</li>
              <li>- €1,000 account → 2% = €20 risk, €56 potential gain</li>
              <li>- €2,500 account → 2% = €50 risk, €139 potential gain</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              The R/R stays at 2.78:1 regardless of account size.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "A tradable trend requires 2 HL + 2 HH (uptrend) or 2 LH + 2 LL (downtrend) minimum on H4.",
              "Daily + H4 alignment in the same direction maximizes setup reliability.",
              "The tradable pullback sits between 30% and 60% of the previous impulse.",
              "Stop loss beyond the last structural low/high with a 5-10 pip margin. The entry requires a rejection signal.",
            ]}
          />

          <LessonExercice
            description="On EUR/USD H4, price formed 2 successive lows at 1.1700 and 1.1730, then 2 successive highs at 1.1780 and 1.1810. Price then pulls back toward 1.1760 and prints a rejection pin bar. How is the pullback trade plan built?"
            steps={[
              "Confirm the uptrend: 2 HL at 1.1700 and 1.1730 + 2 HH at 1.1780 and 1.1810",
              "Measure the impulse: from the last HL (1.1730) to the last HH (1.1810) = 80 pips",
              "Calculate the retracement: return to 1.1760 = 62% of the impulse (50/80), at the upper limit of the tradable retracement",
              "Validate the signal: the pin bar at the level contact confirms the rejection",
              "Set the plan: long entry at the close (1.1762), stop loss at 1.1720 (10 pips below the last HL), take profit at 1.1810 (previous HH) or 1.1890 (projection over 80 pips, ratio 1:3)",
            ]}
          />

          <LessonQuiz
            question="On an H4 chart in a confirmed uptrend, price retraces 45% of the previous impulse and prints a rejection signal at the contact of the last structural low (HL). What is the correct stop loss placement?"
            options={[
              "Halfway between the entry level and the last HL",
              "Beyond the last HL with a 5-10 pip margin",
              "At the last HH",
              "No stop loss, manual management",
            ]}
            correctIndex={1}
            explanation="The stop loss is placed beyond the last structural low (HL in an uptrend) with a 5-10 pip margin to absorb the wicks. This position structurally invalidates the trend: if price breaks the last HL, the HL/HH structure is broken. A stop placed halfway gets triggered by the normal pullback."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "trend-following", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 1 of the Trend Following module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Previous lesson
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-600 border border-zinc-700">
                  Start of module
                </span>
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lesson 2. Coming soon
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-600 border border-zinc-700">
                  Soon
                </span>
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
