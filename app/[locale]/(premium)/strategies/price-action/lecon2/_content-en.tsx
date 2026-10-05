"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import PinBarSetupDiagram from "@/app/components/charts/PinBarSetupDiagram";
import PinBarValidationGridDiagram from "@/app/components/charts/PinBarValidationGridDiagram";
import PinBarLocationDiagram from "@/app/components/charts/PinBarLocationDiagram";
import PinBarFailureDiagram from "@/app/components/charts/PinBarFailureDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Reading a candle", disabled: false },
  { id: "lecon2", title: "Pin bar",          disabled: false },
  { id: "lecon3", title: "Lesson 3",         disabled: true },
  { id: "lecon4", title: "Lesson 4",         disabled: true },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "price-action", "lecon2"));
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
          <span className="text-zinc-500">Lesson 2</span>
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
            Pin bar: the level rejection
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              This lesson teaches you to trade a rejection pin bar at a structural level: validation criteria, a numbered execution plan, and recognizing a setup that fails.
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

          {/* Block 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo; An isolated pin bar says nothing. A pin bar at contact with a level says everything. &rdquo;
              </p>
            </div>
          </section>

          {/* Block 2 — PREREQUISITES */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Anatomy of a candle → see PA Strategy L1</li>
              <li>- Concept of rejection / significant wick → see Trading Course L2</li>
              <li>- Support/resistance levels → see Trading Course L3</li>
            </ul>
          </div>

          {/* Block 3 — VALIDATE A PIN BAR */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Validate a pin bar</h2>

            <div className="my-8">
              <PinBarValidationGridDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              4 quantified criteria qualify a tradable pin bar. Without validating all 4, the candle stays informative but does not trigger a setup.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Wick / body ratio ≥ 2:1 (ideally 3:1)</li>
              <li>- Coherent directional wick: long at the bottom for a bullish pin bar, long at the top for a bearish one</li>
              <li>- Close in the third opposite the directional wick</li>
              <li>- Direct contact with a qualified structural level (support, resistance, Fibonacci, OB)</li>
            </ul>
          </section>

          {/* Block 4 — THE PIN BAR NEEDS A LEVEL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The pin bar needs a level</h2>

            <div className="my-8">
              <PinBarLocationDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Contact with a structural level is the most discriminating criterion. A perfect pin bar in the middle of a range is worth nothing.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Pin bar at strong support = tradable (institutional bounce expected)</li>
              <li>- Pin bar at strong resistance = tradable (institutional rejection expected)</li>
              <li>- Pin bar in the middle of a range = off-level, signal disqualified</li>
              <li>- External conditions: higher-TF alignment, no major news within the next 60 min</li>
            </ul>
          </section>

          {/* Block 5 — NUMBERED TRADE PLAN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Trade plan: bullish pin bar XAU/USD H4</h2>

            <div className="my-8">
              <PinBarSetupDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              XAU/USD drops toward the psychological support at $4,500 (already touched 3 times in 6 weeks). H4 trend bullish. Bullish pin bar at contact with the support.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Long entry: $4,520 (close of the pin bar)</li>
                <li>- Stop loss: $4,470 (below the lower wick, margin included)</li>
                <li>- Take profit: $4,650 (next H4 resistance)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">R/R calculation</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risk: $4,520 - $4,470 = $50</li>
                <li>- Potential gain: $4,650 - $4,520 = $130</li>
                <li>- R/R: 130 / 50 = 2.6</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Retail calculation</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- €300 account → 5% = €15 risk, €39 potential gain</li>
              <li>- €500 account → 3% = €15 risk, €39 potential gain</li>
              <li>- €1,000 account → 2% = €20 risk, €52 potential gain</li>
              <li>- €2,500 account → 2% = €50 risk, €130 potential gain</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              The R/R stays 2.6:1 regardless of account size.
            </p>
          </section>

          {/* Block 6 — WHEN THE SETUP FAILS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">When the setup fails</h2>

            <div className="my-8">
              <PinBarFailureDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A perfectly valid pin bar can fail. The SL is there to cap the loss when the scenario gets invalidated.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- The market can break the structural level = invalidation of the rejection</li>
              <li>- The SL must be placed beyond the directional wick, with a 5-10 pip / $5-10 margin</li>
              <li>- Never move the SL against yourself during the trade</li>
            </ul>
          </section>

          <LessonKeyPoints
            points={[
              "A tradable pin bar validates 4 criteria: wick/body ratio ≥ 2:1, coherent direction, close in the opposite third, contact with a structural level.",
              "Contact with a structural level is the most discriminating criterion. Isolated pin bar out of context = no setup.",
              "Stop loss beyond the wick with a 5-10 pip/$ margin. Never at the close or inside the body.",
              "No trade within the 60 minutes around major news (NFP, FOMC, CPI).",
            ]}
          />

          <LessonExercice
            description="On EUR/USD H1, price approaches a qualified resistance at 1.1820 (3 touches in the last 5 weeks, MA50 H4 at 1.1815 = confluence). An H1 candle prints an upper wick up to 1.1835 then closes at 1.1803. Open at 1.1815. How do you qualify this signal and what is the trade plan?"
            steps={[
              "Measure the pin bar: upper wick 32 pips (from 1.1803 to 1.1835), body 12 pips (from 1.1815 to 1.1803). Wick/body ratio = 32/12 = 2.67:1, criterion 1 validated",
              "Check the direction and the contact: long wick at the top, bearish pin bar at contact with the 1.1820 resistance, criteria 2 and 4 validated",
              "Position of the close: 1.1803 within the 1.1803-1.1835 range, at the absolute low, close in the lower third, criterion 3 validated",
              "Confluence: MA50 H4 at 1.1815 inside the zone = reinforcement of the signal",
              "Plan: short entry at 1.1803 (pin bar close), stop loss at 1.1843 (8 pips above the wick at 1.1835), take profit at 1.1720 (next H4 support). Risk 40 pips, gain 83 pips, R/R 2.07. Position size based on the per-trade risk adapted to the capital",
            ]}
          />

          <LessonQuiz
            question="A bullish pin bar prints a lower wick 3 times larger than its body and closes in the upper third, but it appears in the middle of a sideways range with no structural level nearby. What is the operational verdict?"
            options={[
              "Workable setup, the quality of the pin bar is enough",
              "Invalid setup, the lack of contact with a structural level disqualifies the signal",
              "Workable setup provided there is high volume",
              "Undetermined without Fibonacci confirmation",
            ]}
            correctIndex={1}
            explanation="Contact with a qualified structural level is the most discriminating criterion of a tradable pin bar. Without that contact, the rejection is not anchored on a zone of collective memory. The post-pin-bar move lacks structural fuel and the signal frequently invalidates in the following candles. Even a 3:1 ratio and a perfect close do not make up for the absence of a level."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "price-action", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 2 of the Price Action module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/strategies/price-action/lecon1"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-zinc-600">
                  <path d="M9.5 3.5l-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 1. Reading a candle: body, wick, signal
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lesson 3, Engulfing, the shift of force
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
