"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { InflationChainDiagram } from "@/app/components/charts/InflationChainDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "What is macro",                     href: "/formations/macro/debutant/lecon1", disabled: false },
  { id: "lecon2", title: "The 4 major central banks",        href: "/formations/macro/debutant/lecon2", disabled: false },
  { id: "lecon3", title: "The macro numbers to watch",       href: "/formations/macro/debutant/lecon3", disabled: false },
  { id: "lecon4", title: "Understanding inflation",          href: "/formations/macro/debutant/lecon4", disabled: false },
  { id: "lecon5", title: "The role of the dollar in the world", href: null,                             disabled: true  },
  { id: "lecon6", title: "Macro and risk management",        href: null,                                disabled: true  },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-debutant", "lecon4"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/formations" className="hover:text-zinc-400 transition-colors">Courses</Link>
          <span>/</span>
          <Link href="/formations/macro" className="hover:text-zinc-400 transition-colors">Macro Trading</Link>
          <span>/</span>
          <Link href="/formations/macro/debutant" className="hover:text-zinc-400 transition-colors">Beginner</Link>
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
            Understanding inflation, why everything starts here
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              2022. A baguette goes from €1 to €1.30. And at the same time, the Fed hikes rates 20 times in 18 months.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              That&apos;s no coincidence.
            </p>
          </div>

          {/* Structure indicator */}
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
              const isCurrent = lesson.id === "lecon4";
              const pill = (
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  isCurrent
                    ? "bg-zinc-800 border-zinc-600 text-white"
                    : "border-zinc-800 text-zinc-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : "bg-zinc-600"}`} />
                  {lesson.title}
                </span>
              );
              return <div key={lesson.id}>{pill}</div>;
            })}
            <span className="ml-auto text-xs text-zinc-600">4 / 6 lessons</span>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="space-y-8">

          {/* Block 1 — Inflation is concrete */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Inflation is concrete (not theoretical)</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Inflation is simple:
            </p>
            <ul className="space-y-1.5 mb-4">
              {["prices go up", "your money is worth less"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm font-semibold text-zinc-200 mb-2">Real example:</p>
              <ul className="space-y-1">
                <li className="text-sm text-zinc-300">a baguette at €1</li>
                <li className="text-sm text-zinc-300">two years later → €1.30</li>
              </ul>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              You did nothing. But your purchasing power dropped. <span className="font-semibold text-zinc-200">That&apos;s inflation.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              It&apos;s measured in % per year:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                { bold: "2%", rest: " → normal" },
                { bold: "5%+", rest: " → problematic" },
              ].map((item) => (
                <li key={item.bold} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                When prices go up, your money goes down.
              </p>
            </div>
          </section>

          {/* Block 2 — Why central banks hate it */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Why central banks hate it</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Inflation that&apos;s too high is dangerous:
            </p>
            <ul className="space-y-1.5 mb-4">
              {["it destroys savings", "it creates instability", "it can lead to a crisis"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Central banks have one mission: <span className="font-semibold text-zinc-200">keep inflation around 2%</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Why?</p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "too low", rest: " → sluggish economy" },
                { bold: "too high", rest: " → unstable economy" },
              ].map((item) => (
                <li key={item.bold} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              So as soon as inflation runs too hot, they have to act.
            </p>
          </section>

          {/* Block 3 — The chain that controls the market */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The chain that controls the market</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Here&apos;s the single most important mechanism in all of macro:
            </p>
            <div className="space-y-2 mb-4">
              {[
                { n: "1", text: "Inflation rises" },
                { n: "2", text: "The central bank reacts" },
                { n: "3", text: "It hikes rates" },
                { n: "4", text: "The currency becomes more attractive" },
                { n: "5", text: "The markets react" },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-2.5">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed font-semibold text-zinc-200">{item.text}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Result</span>:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "the currency rises",
                "indices often fall",
                "gold often falls",
                "crypto often falls",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Inflation = the starting point. Everything else follows.
              </p>
            </div>
          </section>

          {/* Block 4 — Real example (2022-2023) */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Real example (2022-2023)</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              This is exactly what happened recently.
            </p>
            <div className="space-y-3 mb-5">
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1">Phase 1. Inflation explodes</p>
                <p className="text-sm text-zinc-300">
                  US inflation climbs from 1.4% to <span className="font-semibold text-zinc-200">9.1%</span> (40-year high).
                </p>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1">Phase 2. The Fed panics and acts</p>
                <p className="text-sm text-zinc-300">
                  it hikes rates from <span className="font-semibold text-zinc-200">0.25% to 5.5%</span> in less than 18 months, one of the most violent hiking cycles in history.
                </p>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1">Phase 3. The dollar explodes</p>
                <p className="text-sm text-zinc-300">
                  the DXY (dollar index) gains <span className="font-semibold text-zinc-200">+20%</span> in 2022. EUR/USD goes from 1.20 to 0.95.
                </p>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-2">Phase 4. Every market gets slaughtered</p>
                <ul className="space-y-1">
                  <li className="text-sm text-zinc-300">Nasdaq: <span className="font-semibold text-zinc-200">-33%</span> over 2022</li>
                  <li className="text-sm text-zinc-300">Bitcoin: <span className="font-semibold text-zinc-200">-65%</span> on the year</li>
                  <li className="text-sm text-zinc-300">Gold: volatile with dips down to <span className="font-semibold text-zinc-200">-15%</span></li>
                  <li className="text-sm text-zinc-300">Bonds: worst year in 100 years</li>
                </ul>
              </div>
            </div>

            {/* Visual component */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <InflationChainDiagram locale="en" />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                One single macro cause moved the ENTIRE market.
              </p>
            </div>
          </section>

          {/* Block 5 — How traders track it */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">How traders track it</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              You don&apos;t watch inflation directly every single day.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              But you do keep an eye on:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { text: "the monthly releases (like ", bold: "CPI", after: ")" },
                { text: "central bank speeches", bold: null, after: null },
                { text: "market expectations", bold: null, after: null },
                { text: "related indicators (like ", bold: "Core PCE", after: ", the Fed's favorite gauge)" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>
                    {item.text}
                    {item.bold && <span className="font-semibold text-zinc-200">{item.bold}</span>}
                    {item.after}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              The goal isn&apos;t to be an expert. The goal is to <span className="font-semibold text-zinc-200">understand the direction</span>.
            </p>
          </section>

          {/* Block 6 — Why it's vital for you */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Why it&apos;s vital for you</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              If you understand inflation:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "you understand why central banks move",
                "you understand why the dollar rises or falls",
                "you understand why the markets react",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Callout 💰 Retail reality */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Retail reality</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                Trading without following US inflation? That&apos;s like driving on the highway without looking at your speedometer. You might survive 10 minutes, but not for long.
              </p>
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                If you understand inflation, you understand the market.
              </p>
            </div>
          </section>

          {/* ── Review separator ── */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Review</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <LessonKeyPoints
            points={[
              "Inflation = rising prices + falling purchasing power",
              "Central banks control it through rates",
              "The core chain: Inflation → Rates → Currency → Markets",
              "Understanding inflation = understanding 80% of macro",
            ]}
          />

          <LessonExercice
            description="Start folding inflation into your analysis."
            steps={[
              "Look up the current US inflation level (a rough figure is enough, on Investing.com).",
              "Note whether it's high or low (above or below 2-3%).",
              "Check the trend over the last 6 months (rising or falling).",
              "Watch how the dollar (DXY or EUR/USD) behaved over the same period.",
              "Ask yourself: is this consistent with the chain of causation?",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            The goal: <span className="font-semibold text-zinc-400">build the link between inflation and the market</span> in your head.
          </p>

          <LessonQuiz
            question="US inflation comes in at 5% (instead of the 3% expected). Without even knowing what happens next, what's the most likely reaction from the dollar in the hours that follow?"
            options={[
              "The dollar falls, inflation is bad for the currency",
              "The dollar rises, the market expects the Fed to hike rates to fight inflation",
              "No move, inflation only affects consumers, not the markets",
              "The dollar only reacts when the Fed makes a real decision",
            ]}
            correctIndex={1}
            explanation="The market prices in the chain of causation before the Fed even acts. Hot inflation surprise → expectation of a rate hike → higher demand for dollars → the dollar rises. That's exactly what happened in 2022 when inflation exploded: the DXY climbed before the rate hikes even started. Option A confuses the long-term cause with the immediate reaction. Option C is wrong, inflation is THE main macro driver. Option D ignores the role of expectations: the market moves on expectations, not on done deals (see lesson 3 on consensus vs actual)."
            answerExplanations={[
              "Wrong. High inflation is seen as positive for the currency in the short term because it signals the central bank is going to hike rates, which attracts capital. The confusion comes from the long term, where uncontrolled inflation can destroy the currency.",
              "Correct. The market prices in the chain before the Fed even acts: inflation surprise → likely rate hike → attractive dollar → the dollar rises. That's exactly what happened in 2022.",
              "Wrong. Inflation is the main macro driver of every market. A +2% inflation surprise triggers immediate moves across forex, bonds, equities and commodities.",
              "Wrong. The market moves on expectations, not on official decisions. The moment the CPI print lands, traders re-price the odds of a rate hike, and the dollar moves immediately.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-debutant", "lecon4"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">The next lesson (The role of the dollar in the world) will be available soon.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/debutant/lecon3"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 3. The macro numbers to watch
              </Link>
              <Link
                href="/formations/macro/debutant/lecon5"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Lesson 5: The dollar's role in the world
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
