"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { InflationIndicatorsChainDiagram } from "@/app/components/charts/InflationIndicatorsChainDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Hawkish vs Dovish",                      href: "/formations/macro/intermediaire/lecon1", disabled: false },
  { id: "lecon2", title: "Understanding the economic calendar",     href: "/formations/macro/intermediaire/lecon2", disabled: false },
  { id: "lecon3", title: "CPI, PPI and inflation",                  href: "/formations/macro/intermediaire/lecon3", disabled: false },
  { id: "lecon4", title: "The carry trade",                         href: null,                                     disabled: true  },
  { id: "lecon5", title: "Macro correlations",                      href: null,                                     disabled: true  },
  { id: "lecon6", title: "Building your weekly bias",               href: null,                                     disabled: true  },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-intermediaire", "lecon3"));
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
          <Link href="/formations/macro/intermediaire" className="hover:text-zinc-400 transition-colors">Intermediate</Link>
          <span>/</span>
          <span className="text-zinc-500">Lesson 3</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20">
              Intermediate
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">16 min</span>
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
            CPI, PPI and inflation: decoding the numbers that move the market
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              8:30am. The CPI drops, the market explodes. But the pros didn&apos;t wait for the shock.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              The real signal had come out 12 days earlier, on a number nobody watches: the PPI.
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
              const isCurrent = lesson.id === "lecon3";
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
            <span className="ml-auto text-xs text-zinc-600">3 / 6 lessons</span>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="space-y-8">

          {/* Block 1 — The inflation chain */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The inflation chain: from producer to consumer</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Inflation doesn&apos;t fall from the sky. It follows a <span className="font-semibold text-zinc-200">logical chain</span>: from the producer to the consumer, with indicators at each stage.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              The market tracks <span className="font-semibold text-zinc-200">4 key indicators</span>, in this order:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "PPI", rest: " (Producer Price Index), prices at the factory gate" },
                { bold: "CPI Headline", rest: " the total inflation the consumer feels" },
                { bold: "Core CPI", rest: " inflation excluding energy and food" },
                { bold: "Core PCE", rest: " the Fed's official indicator" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>

            {/* Visual component */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <InflationIndicatorsChainDiagram locale="en" />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                The PPI warns. The CPI triggers. The Core confirms.
              </p>
            </div>
          </section>

          {/* Block 2 — The PPI, the early signal */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The PPI: the early signal the market ignores</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The PPI comes out roughly <span className="font-semibold text-zinc-200">12 days before the CPI</span>. It&apos;s the price producers receive for their goods, before inflation works its way up to the consumer.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Why is it an early signal?</span> Because cost increases at the producer level almost always end up being passed downstream.
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "PPI rising", rest: " → producers pass it on → the CPI rises in the following weeks" },
                { bold: "PPI flat or falling", rest: " → reduced inflationary pressure → the CPI may drop" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Concrete example</span>: if January&apos;s PPI comes in well above expectations, experienced traders start repositioning their exposure <span className="font-semibold text-zinc-200">before the February CPI</span> even prints.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              The beginner reacts to the CPI. The intermediate trader <span className="font-semibold text-zinc-200">gets ready with the PPI</span>.
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">When the PPI surprises hard, the pros watch in parallel:</p>
              <ul className="space-y-1.5">
                {[
                  { bold: "DXY", rest: " (dollar strength), pricing in the Fed's reaction" },
                  { bold: "XAU/USD", rest: " often the first to react to inflationary signals" },
                  { bold: "Nasdaq", rest: " sensitive to long US yields (inflation = higher rates = tech under pressure)" },
                  { bold: "BTC/USD", rest: " tends to front-run global risk-on/risk-off" },
                ].map((item) => (
                  <li key={item.bold} className="flex items-start gap-2 text-xs text-zinc-400">
                    <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-1.5" />
                    <span><span className="font-semibold text-zinc-300">{item.bold}</span>{item.rest}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-zinc-500 mt-2 italic">Institutions don&apos;t rely on EUR/USD alone to validate an inflation thesis.</p>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Reading the PPI means seeing inflation before it arrives.
              </p>
            </div>
          </section>

          {/* Block 3 — CPI Headline vs Core CPI */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">CPI Headline vs Core CPI: why it changes everything</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              When the CPI comes out, you see two numbers. Most beginners only look at the first one.
            </p>
            <div className="space-y-2 mb-4">
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">CPI Headline</span> → total inflation, energy and food included. It&apos;s the number the media quotes. It&apos;s <span className="font-semibold text-zinc-200">volatile</span>, it rises and falls with the price of oil.
              </p>
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Core CPI</span> → inflation excluding energy and food. It&apos;s the <span className="font-semibold text-zinc-200">underlying trend</span>. It&apos;s what the pros really watch.
              </p>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Typical example</span>:
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-300">CPI Headline: <span className="font-semibold text-zinc-200">+2.1%</span> (in line with expectations)</p>
              <p className="text-sm text-zinc-300 mt-1">Core CPI: <span className="font-semibold text-zinc-200">+3.6%</span> (above the 3.2% expected)</p>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              The market&apos;s reaction? <span className="font-semibold text-zinc-200">Dollar up, gold down, indices pulling back</span>. And yet the Headline was right on target.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              It was the <span className="font-semibold text-zinc-200">Core that triggered everything</span>. Because it&apos;s the one that sends a signal about the monetary policy ahead.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                The Headline makes the noise. The Core makes the move.
              </p>
            </div>
          </section>

          {/* Block 4 — Core PCE, the Fed's official indicator */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Core PCE: the Fed&apos;s official indicator</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Core PCE (Personal Consumption Expenditures) is the <span className="font-semibold text-zinc-200">inflation indicator officially preferred by the Fed</span>. It comes out roughly 2 weeks after the CPI.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Why does the Fed prefer the PCE?</span>
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "It covers a broader basket", rest: " than the CPI" },
                { bold: "It automatically adjusts", rest: " for consumption habits (if beef goes up, people buy chicken, and the PCE captures it)" },
                { bold: "It smooths out", rest: " temporary swings better" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">The Fed&apos;s official target</span>: 2% annual Core PCE.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              When Core PCE runs above that target, the Fed turns hawkish. When it gets close to 2%, it can start talking about rate cuts. <span className="font-semibold text-zinc-200">Everything starts there.</span>
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Core PCE is the thermometer the Fed checks before deciding.
              </p>
            </div>
          </section>

          {/* Block 5 — Market reaction in practice */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Market reaction: what happens in practice</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The most frequent scenario on CPI day:
            </p>
            <div className="space-y-2 mb-4">
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Core CPI above expectations</span> → strong dollar, gold down, crypto and indices under pressure.
              </p>
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Core CPI below expectations</span> → weak dollar, gold and indices up, pricing in rate cuts.
              </p>
            </div>

            <div className="bg-zinc-900/60 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">Concretely, on a Core CPI that surprises hard to the upside (e.g. 3.5% vs 3.2% expected), first 30 minutes:</p>
              <div className="overflow-hidden rounded-xl border border-zinc-800">
                <div className="grid grid-cols-2 border-b border-zinc-800">
                  <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Asset</div>
                  <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-l border-zinc-800">Typical reaction</div>
                </div>
                <div className="divide-y divide-zinc-800/60">
                  {[
                    { asset: "EUR/USD", reaction: "-100 to -150 pips" },
                    { asset: "XAU/USD", reaction: "-$30 to -$50" },
                    { asset: "Nasdaq", reaction: "-1.5 to -2%" },
                    { asset: "BTC/USD", reaction: "-$800 to -$1,500" },
                  ].map((row) => (
                    <div key={row.asset} className="grid grid-cols-2">
                      <div className="px-4 py-2.5 text-sm font-semibold text-zinc-200">{row.asset}</div>
                      <div className="px-4 py-2.5 text-sm text-red-400 font-semibold border-l border-zinc-800/60">{row.reaction}</div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-zinc-500 mt-2 italic">Core inflation surprises → the Fed can stay hawkish longer → all risk assets correct at the same time.</p>
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">But beware the first move</span>. Often called the &apos;fakeout&apos;: the market spikes one way, then reverses a few minutes later as the algos and institutional traders absorb the full report.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Practical rule</span>: wait <span className="font-semibold text-zinc-200">2 to 5 minutes</span> after the release to see the real direction confirm. The first tick is often not the real move.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              PPI + CPI + Core PCE all pointing the same way is the strongest signal. When all 3 converge, the Fed has no excuse left not to act.
            </p>

            {/* 💰 Retail reality box */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Retail reality</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                Retail enters on the first move and gets stopped out on the reversal. The pro waits for confirmation and enters on the real momentum. The difference between the two? <span className="font-semibold text-zinc-200">2 to 5 minutes of patience</span>.
              </p>
            </div>
          </section>

          {/* Block 6 — How to read these numbers like a trader */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">How to read these numbers like a trader</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              On CPI day, your process needs to be structured. No decisions on instinct.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Pre-release checklist</span>:
            </p>
            <div className="space-y-2 mb-5">
              {[
                { n: "1", bold: "Previous week's PPI:", rest: " rising or falling?" },
                { n: "2", bold: "Core CPI consensus:", rest: " at what level?" },
                { n: "3", bold: "Prior Core CPI:", rest: " trending up or down?" },
                { n: "4", bold: "Fed context:", rest: " hiking cycle, pause, or cuts under way?" },
                { n: "5", bold: "Your plan A and plan B:", rest: " ready before 8:30am" },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              If the scenario confirms after 2-5 minutes: you enter with your usual size.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              If the reaction is murky or contradictory: <span className="font-semibold text-zinc-200">you don&apos;t trade</span>. It&apos;s not a missed opportunity, it&apos;s preserved capital.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                A well-prepared inflation print is an opportunity. Poorly prepared, it&apos;s a trap.
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
              "The inflation chain follows an order: PPI → CPI Headline → Core CPI → Core PCE",
              "The PPI comes out 12 days before the CPI, it's the early signal the market underestimates",
              "Core CPI (excluding energy and food) is what the pros really watch",
              "Core PCE is the Fed's official indicator, with a 2% annual target",
              "Wait 2-5 minutes after the release to avoid the first-tick fakeout",
            ]}
          />

          <LessonExercice
            description="Prepare a CPI release like an intermediate trader."
            steps={[
              "Find the date of the next US CPI on your economic calendar.",
              "Note the Core CPI consensus and the previous number.",
              "Check the PPI released in the previous weeks, was it rising or falling?",
              "Write your plan A (Core CPI > expectations) and your plan B (Core CPI < expectations) with the markets involved.",
              "On the day, wait 2-5 minutes after 8:30am before any decision.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            The goal: <span className="font-semibold text-zinc-400">stop being a victim of the CPI. Anticipate it with the PPI and trade it with a plan</span>.
          </p>

          <LessonQuiz
            question="The PPI just came out well above expectations. The CPI hasn't been released yet. What does this information most likely indicate?"
            options={[
              "Nothing, the PPI and the CPI are independent indicators with no direct link",
              "Upstream inflationary pressure that's likely to show up in the next CPI",
              "The dollar will necessarily fall over the coming days",
              "The Fed will immediately announce a rate hike",
            ]}
            correctIndex={1}
            explanation="The PPI measures prices at the factory gate. When it beats expectations, higher production costs are generally passed on to consumers in the following weeks, which tends to push the CPI up. That's the logic of the inflation chain. Option A is false: there is a documented link between PPI and CPI. Option C is too direct and too certain, the dollar's reaction depends on the broader context. Option D is false: the Fed waits for several releases before acting, it doesn't react to a single isolated PPI number. A PPI that surprises to the upside doesn't only impact EUR/USD. XAU/USD, Nasdaq and BTC/USD often front-run the same hawkish repricing before the CPI is even released."
            answerExplanations={[
              "False. PPI and CPI are connected by the inflation transmission chain. Cost increases at the producer level work their way up to consumers in the following weeks.",
              "Correct. A high PPI signals upstream inflationary pressure. Those extra costs generally end up being passed on, which can push the next CPI higher.",
              "False. The dollar's reaction depends on the broader context, the Fed's expectations, and other factors. A high PPI alone doesn't guarantee an immediate drop in the dollar.",
              "False. The Fed watches several releases over time before changing its policy. A single PPI number doesn't trigger a rate-hike announcement.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-intermediaire", "lecon3"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">The next lesson (The carry trade) will be available soon.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/intermediaire/lecon2"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 2. Understanding the economic calendar
              </Link>
              <Link
                href="/formations/macro/intermediaire/lecon4"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Lesson 4. Trading sessions and liquidity
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
