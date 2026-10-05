"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { CandleAnatomyDiagram } from "@/app/components/charts/CandleAnatomyDiagram";
import CandleStrengthComparisonDiagram from "@/app/components/charts/CandleStrengthComparisonDiagram";
import CandleContextReadingDiagram from "@/app/components/charts/CandleContextReadingDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Reading a candle", disabled: false },
  { id: "lecon2", title: "Pin bar",          disabled: true },
  { id: "lecon3", title: "Lesson 3",         disabled: true },
  { id: "lecon4", title: "Lesson 4",         disabled: true },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "price-action", "lecon1"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Strategies</Link>
          <span>/</span>
          <Link href="/strategies/price-action" className="hover:text-zinc-400 transition-colors">Price Action</Link>
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
            <span className="text-xs text-zinc-600">12 min</span>
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
            Reading a candle: body, wick, signal
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              This lesson teaches you to quickly read the balance of power in a candle and to recognize the 4 key patterns (Marubozu, pin bar, doji, engulfing) that structure all of price action.
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

          {/* Block 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo; A candle is not a drawing. It&apos;s the numerical summary of a battle between buyers and sellers over a given period. &rdquo;
              </p>
            </div>
          </section>

          {/* Block 2 — PREREQUISITES */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Notions of OHLC (open/high/low/close) → see Trading Course L1</li>
              <li>- Japanese candlesticks → see Trading Course L1</li>
              <li>- Concept of swing high/low → see Trading Course L2</li>
            </ul>
          </div>

          {/* Block 3 — ANATOMY OF A CANDLE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Anatomy of a candle</h2>

            <div className="my-8">
              <CandleAnatomyDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A candle sums up 4 values (OHLC) over a given period. The visible shape (body + wicks) tells the final balance of power.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Significant body (&gt; 50% of the average of the last 20 candles) = clear direction</li>
              <li>- Long wick on one side (≥ body) = sharp rejection in that direction</li>
              <li>- Close in the top or bottom third = dominance sustained through the close</li>
              <li>- Candle still forming = provisional reading, wait for the close</li>
            </ul>
          </section>

          {/* Block 4 — RECOGNIZE THE 4 KEY TYPES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Recognize the 4 key types</h2>

            <div className="my-8">
              <CandleStrengthComparisonDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              4 patterns show up constantly on the charts. Quickly identifying them guides the whole overall reading.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="font-semibold text-zinc-100">Marubozu</span>: large body, no wick = maximum conviction, continuation signal</li>
              <li>- <span className="font-semibold text-zinc-100">Pin bar</span>: small body + long wick on one side = level rejection, local reversal signal</li>
              <li>- <span className="font-semibold text-zinc-100">Doji</span>: body almost nonexistent = indecision, wait signal or potential reversal in an extreme zone</li>
              <li>- <span className="font-semibold text-zinc-100">Engulfing</span>: body that engulfs the previous candle in the opposite direction = clear shift of power</li>
            </ul>
          </section>

          {/* Block 5 — CONTEXT CHANGES THE READING */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Context changes the reading</h2>

            <div className="my-8">
              <CandleContextReadingDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The same candle does not carry the same value depending on the adjacent candles and the structural position. Reading it in isolation systematically overstates the signal.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Green candle at the top of an impulse = exhaustion, potential reversal</li>
              <li>- Isolated green candle in the middle of a drop = noise, bearish continuation likely</li>
              <li>- Green candle inside a sideways range = no signal, normal oscillation</li>
              <li>- The candle being analyzed must be tied to a structural level to become an actionable signal</li>
            </ul>
          </section>

          <LessonKeyPoints
            points={[
              "A candle is read through 4 elements: body size, wicks, position of the close, adjacent context.",
              "4 key patterns: Marubozu (conviction), pin bar (rejection), doji (indecision), engulfing (shift of power).",
              "Read only fully closed candles. The candle in progress stays provisional.",
              "Structural context determines the value of a signal: same pattern, different value depending on its position.",
            ]}
          />

          <LessonExercice
            description="On XAU/USD H4, a candle closes with these characteristics: open $4,580, high $4,595, low $4,530, close $4,588. How is this candle read according to the 4 balance-of-power criteria?"
            steps={[
              "Criterion 1. Body size: open $4,580 to close $4,588 = bullish body of $8 (to compare with the average of the 20 recent candles)",
              "Criterion 2. Wicks: lower wick of $50 ($4,580 - $4,530), upper wick of $7 ($4,595 - $4,588), lower wick 6 times longer than the body, powerful bullish rejection signal at the bottom",
              "Criterion 3. Position of the close: $4,588 within the $4,530-$4,595 range = 89% of the range, in the upper third, buyers dominating at the end of the period",
              "Criterion 4. Adjacent context: to be related to the previous candles and a nearby structural level",
              "Summary: the candle matches the bullish pin bar pattern (small body + long lower wick + close near the top), a downside-rejection signal that is especially actionable if it occurs at contact with a support or an Order Block zone",
            ]}
          />

          <LessonQuiz
            question="A candle shows a small body, a long lower wick (3 times the body size) and a close in the upper third of the range. Which pattern and which market message?"
            options={[
              "Doji of indecision, balance between the two camps",
              "Bullish pin bar, downside rejection confirmed",
              "Bearish Marubozu, total dominance of the sellers",
              "Bearish engulfing, shift of power toward the sellers",
            ]}
            correctIndex={1}
            explanation="Small body + lower wick 3 times longer than the body + close in the upper third = the exact signature of a bullish pin bar. The market message: an attempted bearish extension quickly rejected by buyers, who regain control before the close. A downside-rejection signal that is especially actionable if it appears at contact with a structural level."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "price-action", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 1 of the Price Action module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <span />
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lesson 2, Pin bar, the level rejection
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
