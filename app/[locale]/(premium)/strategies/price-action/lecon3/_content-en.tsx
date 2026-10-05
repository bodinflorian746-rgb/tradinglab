"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import EngulfingSetupDiagram from "@/app/components/charts/EngulfingSetupDiagram";
import EngulfingValidationGridDiagram from "@/app/components/charts/EngulfingValidationGridDiagram";
import BullishVsBearishEngulfingDiagram from "@/app/components/charts/BullishVsBearishEngulfingDiagram";
import EngulfingContextDiagram from "@/app/components/charts/EngulfingContextDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Reading a candle", disabled: false },
  { id: "lecon2", title: "Pin bar",          disabled: false },
  { id: "lecon3", title: "Engulfing",        disabled: false },
  { id: "lecon4", title: "Lesson 4",         disabled: true },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "price-action", "lecon3"));
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
          <span className="text-zinc-500">Lesson 3</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Beginner
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">14 min</span>
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
            Engulfing: the shift of force
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              This lesson teaches you to trade an engulfing candle (bullish or bearish) at a structural level: validation criteria, required confluence, a numbered execution plan.
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
              const isCurrent = lesson.id === "lecon3";
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
            <span className="ml-auto text-xs text-zinc-600">3 / 4 lessons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Block 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo; The engulfing does not suggest. It imposes. The 2nd candle is so strong it erases the first. &rdquo;
              </p>
            </div>
          </section>

          {/* Block 2 — PREREQUISITES */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Anatomy of a candle → see PA Strategy L1</li>
              <li>- Concept of engulfing → see Trading Course L2</li>
              <li>- Support/resistance levels → see Trading Course L3</li>
            </ul>
          </div>

          {/* Block 3 — BULLISH VS BEARISH */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Bullish vs Bearish engulfing</h2>

            <div className="my-8">
              <BullishVsBearishEngulfingDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              An engulfing = a shift of power in 2 candles. The 2nd engulfs the body of the 1st in the opposite direction.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="font-semibold text-zinc-100">Bullish engulfing</span>: 1st red candle + 2nd green candle engulfing the red body, at a key support</li>
              <li>- <span className="font-semibold text-zinc-100">Bearish engulfing</span>: 1st green candle + 2nd red candle engulfing the green body, at a key resistance</li>
              <li>- The direction of the signal follows the direction of the 2nd candle (the one that engulfs)</li>
            </ul>
          </section>

          {/* Block 4 — VALIDATE AN ENGULFING */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Validate an engulfing</h2>

            <div className="my-8">
              <EngulfingValidationGridDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Not every overlapping pair of candles is a valid engulfing. 4 criteria qualify the pattern as tradable.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- The body of the 2nd candle ENTIRELY engulfs the body of the 1st (wicks excluded)</li>
              <li>- The 2 candles are of opposite direction (red then green or the reverse)</li>
              <li>- The 2nd candle is clearly larger than the 1st (not 5%, real contrast)</li>
              <li>- Range greater than the average of the previous 20 candles</li>
            </ul>
          </section>

          {/* Block 5 — CONFLUENCE CHANGES EVERYTHING */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Confluence changes everything</h2>

            <div className="my-8">
              <EngulfingContextDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              An isolated engulfing outside structural context is just a big candle. Confluence gives it the operational value.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Engulfing at qualified support / resistance = tradable setup</li>
              <li>- Engulfing on a Fibonacci retracement 0.5 / 0.618 / 0.786 in a trend = tradable setup</li>
              <li>- Engulfing in confluence with MA50 or MA200 = reinforcement of the signal</li>
              <li>- Isolated engulfing in the middle of an impulse = noise, no setup</li>
            </ul>
          </section>

          {/* Block 6 — NUMBERED TRADE PLAN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Trade plan: bullish engulfing XAU/USD H4</h2>

            <div className="my-8">
              <EngulfingSetupDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              XAU/USD bounces from $4,500 toward $4,720, then corrects to the Fibonacci 0.618 at $4,600. Bullish engulfing at contact with the Fib in a bullish H4 trend.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- 1st bearish candle: Open $4,615, Close $4,600 (body $15)</li>
                <li>- 2nd bullish candle: Open $4,595, Close $4,625 (body $30, 2x the 1st)</li>
                <li>- Body of the 2nd entirely engulfs that of the 1st</li>
                <li>- Long entry: $4,630 (break of the high of the engulfing candle)</li>
                <li>- Stop loss: $4,590 ($5 below the low of the engulfing candle)</li>
                <li>- Take profit: $4,720 (recent prior high)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">R/R calculation</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risk: $4,630 - $4,590 = $40</li>
                <li>- Potential gain: $4,720 - $4,630 = $90</li>
                <li>- R/R: 90 / 40 = 2.25</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Retail calculation</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- €300 account → 5% = €15 risk, €34 potential gain</li>
              <li>- €500 account → 3% = €15 risk, €34 potential gain</li>
              <li>- €1,000 account → 2% = €20 risk, €45 potential gain</li>
              <li>- €2,500 account → 2% = €50 risk, €113 potential gain</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              The R/R stays 2.25:1 regardless of account size.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "Engulfing = 2 candles of opposite direction, the 2nd ENTIRELY engulfs the body of the 1st.",
              "Pin bar = rejection signal, Engulfing = shift signal: complementary, not competing.",
              "Always on a key level or a retracement, never in the middle of nowhere.",
              "SL below the low of the engulfing candle (bullish) or above the high (bearish), minimum R/R 1:2.",
            ]}
          />

          <LessonExercice
            description="Put candle reading into practice on a real chart."
            steps={[
              "Open a XAU/USD or EUR/USD chart on the H4 timeframe",
              "Identify 2 valid engulfings in the history of the last 30 days and note the context: support, resistance or Fib",
              "For each engulfing, check that the body of the 2nd candle entirely engulfs the body of the 1st",
              "Calculate the potential R/R for 1 valid engulfing: entry on the break, SL below the low of the engulfing candle, TP at the next level",
              "Spot 1 case where a pin bar and an engulfing appear at the same level, then observe what happened afterward",
            ]}
          />

          <LessonQuiz
            question="On EUR/USD H4, a bearish engulfing candle appears in the middle of a range, with no nearby support or resistance, no clear trend, no Fibonacci confluence. What is the operational verdict?"
            options={[
              "Workable setup, the engulfing is a standalone signal",
              "Invalid setup, the lack of structural context disqualifies the signal",
              "Workable setup provided there is high volume",
              "Undetermined without multi-timeframe confirmation",
            ]}
            correctIndex={1}
            explanation="An isolated engulfing candle outside structural context is not an operational signal. Contact with a qualified structural level (support, resistance, Fibonacci, clear trend) is essential. Without context, the engulfing candle stays informative but does not trigger a setup."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "price-action", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 3 of the Price Action module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/strategies/price-action/lecon2"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-zinc-600">
                  <path d="M9.5 3.5l-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 2. Pin bar: the level rejection
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lesson 4. Multi-timeframe setup Daily → H1
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
