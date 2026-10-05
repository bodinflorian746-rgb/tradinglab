"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { MultiTimeframeDiagram } from "@/app/components/charts/MultiTimeframeDiagram";
import MultiTFEntryDiagram from "@/app/components/charts/MultiTFEntryDiagram";
import { TradePlanDiagram } from "@/app/components/charts/TradePlanDiagram";
import MultiTFAlignmentCheckDiagram from "@/app/components/charts/MultiTFAlignmentCheckDiagram";
import MultiTFConflictDiagram from "@/app/components/charts/MultiTFConflictDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Reading a candle", disabled: false },
  { id: "lecon2", title: "Pin bar",          disabled: false },
  { id: "lecon3", title: "Engulfing",        disabled: false },
  { id: "lecon4", title: "MTF setup",        disabled: false },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "price-action", "lecon4"));
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
          <span className="text-zinc-500">Lesson 4</span>
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
            Multi-timeframe setup: aligning 3 horizons
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              This lesson teaches you to build a precise entry by aligning 3 timeframes: Daily (bias), H4 (zone), M15 (signal). Without alignment, no setup.
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
              const isCurrent = lesson.id === "lecon4";
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
            <span className="ml-auto text-xs text-zinc-600">4 / 4 lessons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Block 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo; A clean entry is built on 3 levels: the context gives the direction, the zone gives the place, the signal gives the moment. &rdquo;
              </p>
            </div>
          </section>

          {/* Block 2 — PREREQUISITES */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Candle reading → see PA Strategy L1</li>
              <li>- Pin bar and engulfing → see PA Strategy L2 and L3</li>
              <li>- Concept of timeframes → see Trading Course L1</li>
            </ul>
          </div>

          {/* Block 3 — TOP-DOWN READING */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Top-down reading Daily → H4 → M15</h2>

            <div className="my-8">
              <MultiTimeframeDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Each timeframe plays a distinct and non-interchangeable role. The top-down sequence guarantees that entries always align with the major bias.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="font-semibold text-zinc-100">Daily</span> = global directional bias (bullish HH/HL or bearish LH/LL)</li>
              <li>- <span className="font-semibold text-zinc-100">H4</span> = major support / resistance zones, potential entry locations</li>
              <li>- <span className="font-semibold text-zinc-100">H1</span> = structural confirmation of the alignment with the Daily</li>
              <li>- <span className="font-semibold text-zinc-100">M15</span> = fine timing via a price action signal (pin bar, engulfing)</li>
            </ul>
          </section>

          {/* Block 4 — VALIDATE THE ALIGNMENT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Validate the alignment</h2>

            <div className="my-8">
              <MultiTFAlignmentCheckDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A multi-timeframe setup is validated only when the 4 alignment criteria are met. A single one missing invalidates the setup.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Daily trend clearly oriented (HH/HL or LH/LL over the last 30-50 candles)</li>
              <li>- H4 zone identified and tradable near the price (distance ≤ 100 pips/$ from the current price)</li>
              <li>- H1 structure aligned with the Daily trend (no temporary correction in progress)</li>
              <li>- Explicit M15 signal at contact with the H4 zone (pin bar, engulfing, immediate reaction)</li>
            </ul>
          </section>

          {/* Block 5 — MULTI-TF CONFLICT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Multi-TF conflict (do not trade)</h2>

            <div className="my-8">
              <MultiTFConflictDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              When the timeframes show conflicting biases, no setup is workable. The discipline is to not trade until the alignment is restored.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Bullish Daily + bearish H4 = correction in progress, wait for the H4 resumption</li>
              <li>- Ambiguous Daily (sideways consolidation) = no bias, no trade until it clears up</li>
              <li>- M15 against the Daily = short-term noise, ignore the isolated signal</li>
            </ul>
          </section>

          {/* Block 6 — NUMBERED TRADE PLAN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Trade plan: MTF setup EUR/USD</h2>

            <div className="my-8">
              <MultiTFEntryDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              EUR/USD in a confirmed bullish trend on the Daily (HH/HL over 6 weeks). H4 support zone at 1.1750-1.1770 (3 touches, fresh). H1 aligned bullish. M15 pin bar printed at contact with the zone.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Daily: last HH 1.1840, last HL 1.1720, long bias</li>
                <li>- H4: support zone 1.1750-1.1770, 3 touches in 5 weeks</li>
                <li>- M15: bullish pin bar, lower wick 1.1762, close 1.1778</li>
                <li>- Long entry: 1.1778 (close of the M15 pin bar)</li>
                <li>- Stop loss: 1.1745 (5 pips below the H4 zone)</li>
                <li>- Take profit level 1: 1.1840 (Daily HH), level 2: 1.1900 (extension)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">R/R calculation</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risk: 1.1778 - 1.1745 = 33 pips</li>
                <li>- Gain level 1: 1.1840 - 1.1778 = 62 pips → R/R 1.88</li>
                <li>- Gain level 2: 1.1900 - 1.1778 = 122 pips → R/R 3.70</li>
                <li>- The setup primarily targets the TP level 2 for an optimal R/R</li>
              </ul>
            </div>

            <div className="my-8">
              <TradePlanDiagram locale="en" />
            </div>

            <p className="text-white font-semibold text-sm mb-2">Retail calculation</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- €300 account → 5% = €15 risk, €56 potential gain</li>
              <li>- €500 account → 3% = €15 risk, €56 potential gain</li>
              <li>- €1,000 account → 2% = €20 risk, €74 potential gain</li>
              <li>- €2,500 account → 2% = €50 risk, €185 potential gain</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              The R/R stays 3.70:1 regardless of account size.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "Top-down procedure is mandatory: Daily → H4 → H1 → M15. No directional analysis on an isolated M15.",
              "Daily = bias. H4 = zones. H1 = structural alignment. M15 = entry timing.",
              "All 4 alignment criteria must be validated. A single one missing invalidates the setup.",
              "Stop loss beyond the H4 zone with a 5-10 pip margin. Take profit toward the next H4 zone in the direction of the trade.",
            ]}
          />

          <LessonExercice
            description="On XAU/USD, the Daily is in a bullish trend with last HH at $4,680 and last HL at $4,520. An H4 support zone is identified between $4,560 and $4,580 (3 touches in 5 weeks). The current price is $4,595. The H1 structure is aligned bullish. Price drops to touch $4,575 then prints a bullish M15 engulfing with a close at $4,595. How is the trade plan built?"
            steps={[
              "Validate the 4 alignment criteria: confirmed bullish Daily trend, tradable H4 zone $4,560-$4,580 (3 touches, fresh), H1 structure aligned bullish, bullish M15 engulfing signal at contact with the H4 zone",
              "Place the long entry at $4,595 (close of the M15 engulfing)",
              "Place the stop loss at $4,555 ($5 below the bottom of the H4 zone at $4,560)",
              "Place the take profit level 1 at $4,680 (prior Daily HH) or level 2 at $4,750 (Daily extension projection)",
              "Calculate the R/R: Risk $40, gain level 1 = $85 → R/R 2.12; gain level 2 = $155 → R/R 3.88. Position size based on the per-trade risk adapted to the capital",
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

          <LessonQuiz
            question="Your setup is clean and price reacts at a good zone, but your bias on the higher timeframe (HTF) points the opposite way. What do you do?"
            options={[
              "I take the trade: a valid setup and zone are enough.",
              "I stand aside: without the HTF bias in my direction, the probability drops too much.",
              "I take it with a heavily reduced size to test.",
            ]}
            correctIndex={1}
            explanation="A clean setup at a good zone does not make up for a context that works against you. The HTF bias is a filter: against the grain, you're swimming against the market. The right move is to let it go and wait for an aligned trade."
          />

          <LessonQuiz
            question="In the top-down multi-timeframe procedure, what is the exclusive role of the M15?"
            options={[
              "Provide the global directional bias",
              "Identify the major support and resistance zones",
              "Provide the precise entry timing via a price action signal",
              "Confirm the Daily trend",
            ]}
            correctIndex={2}
            explanation="The M15 is exclusively a fine-timing tool. The directional bias comes from the Daily. The zones come from the H4. The structural alignment comes from the H1. The M15 only provides the price action signal (pin bar, engulfing, sharp reaction) that confirms the entry at contact with the H4 zone."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "price-action", "lecon4");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 4 of the Price Action module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/strategies/price-action/lecon3"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-zinc-600">
                  <path d="M9.5 3.5l-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 3. Engulfing: the shift of force
              </Link>
              <Link
                href="/strategies/price-action"
                className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Module completed. Back to the module
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M5.5 10.5l4-4-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
