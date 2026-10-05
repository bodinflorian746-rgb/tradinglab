"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import TrendlineMADiagram from "@/app/components/charts/TrendlineMADiagram";
import MMHierarchyStackDiagram from "@/app/components/charts/MMHierarchyStackDiagram";
import TrendlineWrongDrawingDiagram from "@/app/components/charts/TrendlineWrongDrawingDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Recognizing a trend (HH/HL vs LH/LL)", disabled: false },
  { id: "lecon2", title: "Trendline and moving averages: drawing the trend", disabled: false },
  { id: "lecon3", title: "Lesson 3",          disabled: true },
  { id: "lecon4", title: "Lesson 4",          disabled: true },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "trend-following", "lecon2"));
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
          <span className="text-zinc-500">Lesson 2</span>
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
            Trendline and moving averages: drawing the trend
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              This lesson teaches you to draw a tradable trendline, to read the MA20/MA50/MA200 in combination, and to exploit the trendline + MA confluence.
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
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &quot;The trend is read in the structure. Trendlines and moving averages make it visible to the pixel.&quot;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Recognizing a trend → see TF Strategy L1</li>
              <li>- Trendline concept → see Trading Course L3</li>
              <li>- MA20 / MA50 / MA200 → see Trading Course L4</li>
            </ul>
          </div>

          {/* Bloc 3 — TRACER UNE TRENDLINE + MM */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Drawing a trendline + MA</h2>

            <div className="my-8">
              <TrendlineMADiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The trendline and the MA50 form a dynamic defended zone. The confluence of both multiplies the reliability of the entry signal on a bounce.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Bullish trendline: connected to the successive HL (3 points minimum)</li>
              <li>- Bearish trendline: connected to the successive LH (3 points minimum)</li>
              <li>- Tradable slope: between 20° and 60° (below 20° = weak, above 60° = unrealistic)</li>
              <li>- MA20 = short dynamic, MA50 = intermediate reference, MA200 = long-term bias</li>
            </ul>
          </section>

          {/* Bloc 4 — LIRE LES 3 MM EN COMBINAISON */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Reading the 3 MAs in combination</h2>

            <div className="my-8">
              <MMHierarchyStackDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The relative order of the 3 MAs (MA20, MA50, MA200) signals the overall directional bias. The hierarchy determines the direction of the allowed setups.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Golden cross: MA20 &gt; MA50 &gt; MA200, ascending → long bias, long setups only</li>
              <li>- Death cross: MA20 &lt; MA50 &lt; MA200, descending → short bias, short setups only</li>
              <li>- Range: 3 MAs intertwined, flat slope → no bias, wait for clarification</li>
              <li>- Setup against the MA200 bias = reduced win rate, avoid without exceptional confluence</li>
            </ul>
          </section>

          {/* Bloc 5 — ERREURS DE TRACÉ FRÉQUENTES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Common drawing mistakes</h2>

            <div className="my-8">
              <TrendlineWrongDrawingDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A forced trendline loses all operational value. 3 drawing mistakes systematically degrade signal reliability.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- 2 isolated points that ignore the other pivots = arbitrary trendline</li>
              <li>- Unrealistic slope (&gt; 60°) = unsustainable impulse, fast reversal expected</li>
              <li>- Ignored break = trendline extended after it has lost its validity</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Trade plan: EUR/USD H4 confluence</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              EUR/USD in a confirmed uptrend on H4 and Daily (price above the H4 MA200 for 6 weeks). Bullish trendline on 3 HL (1.1680, 1.1720, 1.1755), moderate 35° slope. H4 MA50 at 1.1770. Trendline + MA50 confluence in the 1.1768-1.1775 zone. Bullish pin bar at contact.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup (long trade on confluence bounce)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Long entry: 1.1778 (pin bar close)</li>
                <li>- Stop loss: 1.1750 (10 pips below the lower wick at 1.1762)</li>
                <li>- Take profit level 1: 1.1820 (previous HH), level 2: 1.1860 (extension)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">R/R calculation</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risk: 1.1778 - 1.1750 = 28 pips</li>
                <li>- Gain level 1: 42 pips → R/R 1.50</li>
                <li>- Gain level 2: 82 pips → R/R 82/28 = 2.93</li>
                <li>- The setup primarily targets TP level 2</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Retail calculation</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- €300 account → 5% = €15 risk, €44 potential gain</li>
              <li>- €500 account → 3% = €15 risk, €44 potential gain</li>
              <li>- €1,000 account → 2% = €20 risk, €59 potential gain</li>
              <li>- €2,500 account → 2% = €50 risk, €147 potential gain</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              The R/R stays at 1:2.93 regardless of account size.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "A tradable trendline relies on 2 points minimum (3 ideally), with a slope between 20° and 60°.",
              "MA20 = short dynamic. MA50 = intermediate reference. MA200 = long-term structural bias.",
              "The trendline + MA50 confluence creates a zone defended by 2 distinct dynamic references.",
              "Respect the MA200 bias: long trade above, short trade below. No entry without a rejection signal.",
            ]}
          />

          <LessonExercice
            description="On XAU/USD H4 in a confirmed downtrend, price moves below the H4 MA200 at $4,720. A bearish trendline was drawn on 3 successive LH at $4,680, $4,650 and $4,620. The H4 MA50 is currently at $4,605. Price climbs toward $4,600. What is the setup status and what theoretical plan applies?"
            steps={[
              "Validate the bearish trendline: 3 LH confirmed at $4,680, $4,650, $4,620, tradable trendline",
              "Identify the confluence: H4 MA50 at $4,605 + trendline passing through $4,600 = confluence zone $4,600-$4,605",
              "Check the H4 MA200 bias: price below $4,720 = short bias aligned, compliant setup",
              "Wait for the bearish rejection signal (high pin bar, bearish engulfing) at the contact of the $4,600-$4,605 zone to validate the entry",
              "Build the plan: short entry at the signal close, stop loss at $4,615 ($10 above the MA50), take profit at $4,555 (previous LL, level 1) or $4,510 (bearish extension, level 2). Position size according to the per-trade risk adapted to capital",
            ]}
          />

          <LessonQuiz
            question="Price touches the H4 MA50 on EUR/USD with no explicit rejection signal (no pin bar, no engulfing), in a confirmed uptrend. What is the operational verdict?"
            options={[
              "Tradable setup, the mere contact with the MA50 is enough",
              "Invalid setup, the absence of a rejection signal disqualifies the entry",
              "Tradable setup provided there is high volume",
              "Undetermined without Fibonacci confirmation",
            ]}
            correctIndex={1}
            explanation="Contact with an MA does not automatically trigger an entry. An explicit price action signal (rejection pin bar, engulfing in the direction of the trend, or immediate reaction with no significant penetration) must confirm the bounce. Without a signal, the MA can be crossed without a significant bounce, especially in a moderate trend. A trade taken on mere contact frequently ends up in a loss."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "trend-following", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 2 of the Trend Following module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/trend-following/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 1
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lesson 3. Coming soon
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
