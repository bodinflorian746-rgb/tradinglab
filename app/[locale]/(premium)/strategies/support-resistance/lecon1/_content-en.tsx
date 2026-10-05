"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { SupportResistance } from "@/app/components/charts/SupportResistance";
import StrongVsWeakLevelDiagram from "@/app/components/charts/StrongVsWeakLevelDiagram";
import ZoneVsLineDiagram from "@/app/components/charts/ZoneVsLineDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Support and resistance: the zones where the market reacts", disabled: false },
  { id: "lecon2", title: "Lesson 2",          disabled: true },
  { id: "lecon3", title: "Lesson 3",          disabled: true },
  { id: "lecon4", title: "Lesson 4",          disabled: true },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "support-resistance", "lecon1"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Strategies</Link>
          <span>/</span>
          <Link href="/strategies/support-resistance" className="hover:text-zinc-400 transition-colors">Support / Resistance &amp; Range</Link>
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
            Support and resistance: the zones where the market reacts
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              This lesson teaches you how to visually identify support and resistance zones on a chart: through multiple touches, through the zone vs line distinction, and by assessing their strength.
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
                &ldquo;Finding a zone that holds takes 30 seconds on a chart. Not 30 minutes of reading.&rdquo;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Concept of support and resistance → see Trading Course L3</li>
              <li>- Reading candles → see PA Strategy L1</li>
              <li>- Concept of swing high/low → see Trading Course L2</li>
            </ul>
          </div>

          {/* Bloc 3 — IDENTIFIER PAR LES TOUCHES MULTIPLES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Identifying through multiple touches</h2>

            <div className="my-8">
              <SupportResistance supportPrice="$4,500" resistancePrice="$4,650" locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A zone reveals itself through repeated price bounces off the same level. The repetition validates the market&apos;s collective memory around that zone.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Minimum 2 touches to qualify a zone, 3 touches for high confidence</li>
              <li>- Main identification timeframe: H4 (100-150 candle history)</li>
              <li>- On EUR/USD: 10-20 pips thickness. On XAU/USD: $10-20 thickness</li>
              <li>- No trade on the 1st touch: the initial touch validates existence, not tradability</li>
            </ul>
          </section>

          {/* Bloc 4 — NIVEAU FORT VS NIVEAU FAIBLE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Strong level vs weak level</h2>

            <div className="my-8">
              <StrongVsWeakLevelDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Not all the zones you draw carry the same strength. The number of touches and the quality of the reactions separate the tradable levels from the marginal ones.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- 4 clean touches with sharp bounces = strong level, prioritized in setup selection</li>
              <li>- 2 soft touches with no amplitude after the bounce = weak level, to exclude</li>
              <li>- Freshness: a zone touched within the last 30 days keeps its structural weight</li>
              <li>- Psychological zones (1.1800, $4,500, $100,000) reinforce the strength of the level</li>
            </ul>
          </section>

          {/* Bloc 5 — TOUJOURS UNE ZONE, PAS UNE LIGNE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Always a zone, never a line</h2>

            <div className="my-8">
              <ZoneVsLineDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              An institutional level is a zone of interest, not a precise line. The drawing must absorb the market&apos;s natural wicks.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Drawn as a thin line = repeated wicks make you believe in a break that never happened</li>
              <li>- Drawn as a zone (10-20 pip rectangle) = natural wicks absorbed, reliable reading</li>
              <li>- The drawing encompasses bodies + wicks, never limited to bodies alone</li>
              <li>- Rectangle tool on the platform, translucent coloring (40% opacity)</li>
            </ul>
          </section>

          <LessonKeyPoints
            points={[
              "A valid zone has a minimum of 2 confirmed touches, ideally 3 (collective memory).",
              "Zone thickness: 10-20 pips on EUR/USD, $10-20 on XAU/USD.",
              "Drawing as a zone (not a line) absorbs natural wicks and avoids false signals.",
              "A fresh zone (touched within the last 30 days) takes priority over an old one.",
            ]}
          />

          <LessonExercice
            description="On EUR/USD H4, 3 lows are identified at 1.1685, 1.1690 and 1.1688. The current price sits at 1.1750. How do you draw the support zone?"
            steps={[
              "Start the drawing with the Rectangle tool, from the lowest of the 3 lows (1.1685) to the highest (1.1690), an initial 5-pip zone, too thin",
              "Widen the zone: lower bound at 1.1680, upper bound at 1.1695, final 15-pip zone, compliant with the 10-20 pip rule",
              "Color the rectangle transparent green (40% opacity)",
              "Check the 4 criteria: 3 confirmed touches (OK), 15-pip thickness (OK), 60-pip distance from the current price (OK), freshness to confirm against history",
              "Conclusion: the zone meets all 4 criteria and becomes tradable",
            ]}
          />

          <LessonQuiz
            question="How many touches minimum are needed to validate a support zone?"
            options={[
              "1 touch is enough if the level is psychological",
              "2 touches minimum, 3 ideally",
              "5 touches mandatory",
              "No defined threshold, judge by eye",
            ]}
            correctIndex={1}
            explanation="The operational rule: 2 touches minimum at the same level to qualify a tradable zone. 3 touches raise confidence and confirm the collective memory. A single touch, even on a psychological level, remains an unconfirmed one-off level."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "support-resistance", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 1 of the Support / Resistance &amp; Range module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <span />
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
