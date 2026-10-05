"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { SupportResistance } from "@/app/components/charts/SupportResistance";
import { ConfluenceDiagram } from "@/app/components/charts/ConfluenceDiagram";
import SRQualificationChecklistDiagram from "@/app/components/charts/SRQualificationChecklistDiagram";
import SRHierarchyDiagram from "@/app/components/charts/SRHierarchyDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Support and resistance: the zones where the market reacts", disabled: false },
  { id: "lecon2", title: "Identifying a real level (vs a line drawn at random)", disabled: false },
  { id: "lecon3", title: "Lesson 3",          disabled: true },
  { id: "lecon4", title: "Lesson 4",          disabled: true },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "support-resistance", "lecon2"));
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
            Identifying a real level (vs a line drawn at random)
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              This lesson teaches you to tell a real level from a decorative line through 4 qualification criteria, the multi-timeframe hierarchy, and the search for confluences.
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
                &ldquo;Not all drawn zones are equal. Qualifying a real level means knowing which one deserves a setup and which one stays decorative.&rdquo;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Identifying S/R zones → see SR Strategy L1</li>
              <li>- Concept of confluence → see Trading Course L3</li>
              <li>- Timeframes → see Trading Course L1</li>
            </ul>
          </div>

          {/* Bloc 3 — 4 CRITÈRES DE QUALIFICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4 qualification criteria</h2>

            <div className="my-8">
              <SRQualificationChecklistDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A tradable zone must validate 4 numeric criteria applied sequentially. A zone that only validates 2 or 3 stays on watch without being an operational priority.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Multiple touches: ≥ 2 confirmed touches, ideally 3 for high confidence</li>
              <li>- Clear reactions: bounce ≥ 1% on EUR/USD or $25-50 on XAU/USD at each touch</li>
              <li>- Freshness: zone touched within the last 30 days = strong collective memory</li>
              <li>- Confluence with a round number, Fibonacci, MA or Order Block = priority</li>
            </ul>
          </section>

          {/* Bloc 4 — LA CONFLUENCE RENFORCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Confluence reinforces</h2>

            <div className="my-8">
              <ConfluenceDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A zone&apos;s strength grows when it coincides with other structural elements. A zone with 2 confluences or more becomes a priority.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Fibonacci confluence 0.5 / 0.618 / 0.786 = zone respected by institutions</li>
              <li>- MA50 or MA200 confluence (Daily or H4) = defended dynamic level</li>
              <li>- Psychological round number confluence (1.1800, $4,500) = emotional memory</li>
              <li>- 3 confluences or more = real major level, priority selection</li>
            </ul>
          </section>

          {/* Bloc 5 — HIÉRARCHIE MULTI-TIMEFRAME */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Multi-timeframe hierarchy</h2>

            <div className="my-8">
              <SRHierarchyDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A level&apos;s strength also depends on the timeframe it&apos;s drawn on. The higher the timeframe, the more the zone is defended institutionally.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Daily = major level, priority reference for setup selection</li>
              <li>- H4 = secondary level, main trade zone in alignment with Daily</li>
              <li>- H1 = intermediate level, used for the approach and observation</li>
              <li>- M15/M30 = marginal level, used only for timing at contact with a higher level</li>
            </ul>
          </section>

          <LessonKeyPoints
            points={[
              "A tradable zone validates 4 criteria: 2 touches minimum, clear reactions, recent freshness, confluence with other structural elements.",
              "Strength hierarchy by timeframe: Daily > H4 > H1 > M30/M15.",
              "Confluences (round number, Fibonacci, MA, Order Block) multiply strength. 2 confluences or more = priority.",
              "An isolated M15 level doesn't hold on its own. It serves for entry timing at contact with a higher level.",
            ]}
          />

          <LessonExercice
            description="An EUR/USD resistance zone between 1.1880 and 1.1900 has been touched twice in the last 8 weeks with clean rejections (30 to 40 pip wicks). The psychological level 1.1900 sits at the top of the zone. The H4 MA50 currently runs through 1.1875. What's the qualification verdict?"
            steps={[
              "Criterion 1. Touches: 2 confirmed touches in the last 8 weeks = minimum required validated",
              "Criterion 2. Reactions: clean rejections with 30 to 40 pip wicks = clear, proportionate reactions",
              "Criterion 3. Freshness: zone touched in the last 8 weeks = acceptable freshness",
              "Criterion 4. Confluences: psychological level 1.1900 at the top of the zone (confluence 1) + H4 MA50 at 1.1875 inside the zone (confluence 2) = 2 confluences identified",
              "Verdict: tradable zone confirmed. 3 criteria cleanly validated + 2 confluences. High operational rating. The zone enters priority selection for a short setup on the retracement with a confirmed rejection signal",
            ]}
          />

          <LessonQuiz
            question="A zone visible only on M15, touched twice in the last day, with no alignment with H4 or Daily — can it be a primary reference for a setup?"
            options={[
              "Yes, 2 touches are enough regardless of the timeframe",
              "No, isolated M15 levels serve only for entry timing at contact with a higher level",
              "Yes, as long as there's a Fibonacci confluence",
              "No, you need a minimum of 5 touches on M15",
            ]}
            correctIndex={1}
            explanation="Isolated M15 levels have a short lifespan and can be ignored or broken by the market without real challenge. The timeframe hierarchy places Daily > H4 > H1 > M30/M15. An M15 level serves only as an entry-timing point at contact with a higher zone, never as a primary reference, even with 2 recent touches."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "support-resistance", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 2 of the Support / Resistance &amp; Range module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/support-resistance/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
