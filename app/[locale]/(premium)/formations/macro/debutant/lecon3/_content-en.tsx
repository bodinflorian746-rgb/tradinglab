"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { ConsensusVsRealDiagram } from "@/app/components/charts/ConsensusVsRealDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "What is macro",                     href: "/formations/macro/debutant/lecon1", disabled: false },
  { id: "lecon2", title: "The 4 major central banks",        href: "/formations/macro/debutant/lecon2", disabled: false },
  { id: "lecon3", title: "The macro numbers to watch",       href: "/formations/macro/debutant/lecon3", disabled: false },
  { id: "lecon4", title: "Understanding inflation",          href: null,                                disabled: true  },
  { id: "lecon5", title: "The dollar's role in the world",   href: null,                                disabled: true  },
  { id: "lecon6", title: "Macro and risk management",        href: null,                                disabled: true  },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-debutant", "lecon3"));
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
          <span className="text-zinc-500">Lesson 3</span>
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
            The macro numbers to watch: what to look at and when
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              2:30pm. An M5 candle prints 80 pips in one shot. You look for the pattern.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              There isn&apos;t one. It&apos;s a number you ignored that just dropped.
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

          {/* Block 1 — The principle nobody explains to you */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The principle nobody explains to you</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Macro numbers don&apos;t come out at random. They&apos;re released at precise moments:
            </p>
            <ul className="space-y-1.5 mb-4">
              {["every month", "every quarter", "always at the same times"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              But here&apos;s the key point most beginners miss:
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-200 font-semibold leading-relaxed">
                The market doesn&apos;t react to the number itself. It reacts to the difference between what was expected and what actually comes out.
              </p>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Simple analogy</span>: the forecast says sunny. It rains. It&apos;s not the rain that surprises you. It&apos;s the gap with what you expected.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                The market doesn&apos;t react to the number. It reacts to the surprise.
              </p>
            </div>
          </section>

          {/* Block 2 — The 5 numbers that really move the market */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The 5 numbers that really move the market</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              You don&apos;t need to know 30. Focus on these 5:
            </p>
            <div className="space-y-3 mb-5">
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">NFP (Non-Farm Payrolls)</p>
                <ul className="space-y-1">
                  <li className="text-sm text-zinc-300">US job creation</li>
                  <li className="text-sm text-zinc-300">Released on the <span className="font-semibold text-zinc-200">1st Friday of the month at 2:30pm</span> (Paris time)</li>
                  <li className="text-sm text-zinc-300">Often ultra violent</li>
                </ul>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">CPI (Consumer Price Index)</p>
                <ul className="space-y-1">
                  <li className="text-sm text-zinc-300">US inflation</li>
                  <li className="text-sm text-zinc-300">Released around <span className="font-semibold text-zinc-200">mid-month at 2:30pm</span></li>
                  <li className="text-sm text-zinc-300">Very strong impact on the dollar</li>
                </ul>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">FOMC (Fed rate decision)</p>
                <ul className="space-y-1">
                  <li className="text-sm text-zinc-300">About <span className="font-semibold text-zinc-200">8 times a year at 8:00pm</span></li>
                  <li className="text-sm text-zinc-300">Huge impact (see the Advanced Macro lesson on the FOMC)</li>
                </ul>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">PMI (Purchasing Managers Index)</p>
                <ul className="space-y-1">
                  <li className="text-sm text-zinc-300">Economic health (manufacturing / services)</li>
                  <li className="text-sm text-zinc-300">Released every month</li>
                </ul>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">GDP (Gross Domestic Product)</p>
                <ul className="space-y-1">
                  <li className="text-sm text-zinc-300">Quarterly economic growth</li>
                  <li className="text-sm text-zinc-300">Medium but directional impact</li>
                </ul>
              </div>
            </div>

            {/* Box 💰 Retail reality */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Retail reality</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                You don&apos;t need to follow the whole calendar. Master these 5 numbers and you already understand <span className="font-semibold text-zinc-200">80% of the market&apos;s brutal moves</span>. The rest is noise.
              </p>
            </div>
          </section>

          {/* Block 3 — The secondary numbers */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The secondary numbers (worth knowing but not overrating)</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Other numbers exist and move the market, but with less violence:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "PPI", rest: " (inflation on the producer side)" },
                { bold: "Retail Sales", rest: " (retail sales)" },
                { bold: "Unemployment Rate", rest: " (unemployment rate)" },
                { bold: "Consumer Confidence", rest: " (consumer confidence)" },
                { bold: "ISM", rest: " (manufacturing index)" },
              ].map((item) => (
                <li key={item.bold} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              They can create moves, but rarely as violent as the 5 majors. Learn them <span className="font-semibold text-zinc-200">after</span> you&apos;ve mastered the first 5.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Every number moves the market. Few really control it.
              </p>
            </div>
          </section>

          {/* Block 4 — The star system */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The star system: what deserves your attention</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              You already know the impact system (seen in lesson 1): <span className="font-semibold text-zinc-200">1 star</span> = low, <span className="font-semibold text-zinc-200">2 stars</span> = medium, <span className="font-semibold text-zinc-200">3 stars</span> = strong.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              But here&apos;s the rule nobody applies:
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-200 font-semibold leading-relaxed">
                The 1 or 2 star numbers, you can ignore them as a beginner.
              </p>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Why? Because they won&apos;t break a strong trend, they won&apos;t invalidate a clean setup, and their impact dilutes over the day.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              The 3 star numbers, on the other hand, can:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "Wipe out a perfect setup in 30 seconds",
                "Reverse the day's trend",
                "Create violent moves: 100 to 300 pips on forex, $30 to $60 on gold, 1 to 2% on indices",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                If it&apos;s red, you cut your trade or you wait.
              </p>
            </div>
          </section>

          {/* Block 5 — Concrete example */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Concrete example (what really happens)</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Let&apos;s take an example with numbers.
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-4 mb-4">
              <p className="text-sm font-semibold text-zinc-200 mb-2">Positive surprise case:</p>
              <ul className="space-y-1 mb-3">
                <li className="text-sm text-zinc-300">NFP expected: <span className="font-semibold text-zinc-200">200k</span></li>
                <li className="text-sm text-zinc-300">NFP actual: <span className="font-semibold text-zinc-200">350k</span></li>
              </ul>
              <p className="text-sm text-zinc-300 mb-2">
                Huge positive surprise on the US economy → the dollar rises hard → EUR/USD drops.
              </p>
              <p className="text-sm font-semibold text-zinc-200">
                Typical move: -50 to -100 pips in 30 seconds.
              </p>
              <div className="mt-3 bg-zinc-900/60 rounded-lg px-3 py-2.5">
                <p className="text-xs font-semibold text-zinc-400 mb-2">The same NFP also hits:</p>
                <ul className="space-y-1">
                  {[
                    { asset: "XAU/USD", move: "-$25 to -$40 in 30 seconds" },
                    { asset: "Nasdaq", move: "-1 to -1.5% in the first minutes" },
                    { asset: "BTC/USD", move: "-$300 to -$800 depending on volatility" },
                  ].map((item) => (
                    <li key={item.asset} className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="font-semibold text-zinc-300">{item.asset}</span>
                      <span>{item.move}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-zinc-500 mt-2 italic">The NFP doesn&apos;t only hit EUR/USD. It hits the whole market.</p>
              </div>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              On 0.10 lot of EUR/USD, that&apos;s <span className="font-semibold text-zinc-200">$50 to $100 of change in 30 seconds</span>. If you were long with a 30 pip SL, <span className="font-semibold text-zinc-200">you get stopped out BEFORE you even understand what happened.</span>
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-4 mb-5">
              <p className="text-sm font-semibold text-zinc-200 mb-2">Negative surprise case:</p>
              <ul className="space-y-1 mb-3">
                <li className="text-sm text-zinc-300">NFP expected: <span className="font-semibold text-zinc-200">200k</span></li>
                <li className="text-sm text-zinc-300">NFP actual: <span className="font-semibold text-zinc-200">100k</span></li>
              </ul>
              <p className="text-sm text-zinc-300 mb-2">
                US economy weaker than expected → the dollar drops → EUR/USD rises.
              </p>
              <p className="text-sm font-semibold text-zinc-200">
                Typical move: +50 to +100 pips in 30 seconds.
              </p>
              <div className="mt-3 bg-zinc-900/60 rounded-lg px-3 py-2.5">
                <p className="text-xs font-semibold text-zinc-400 mb-2">The same NFP also hits:</p>
                <ul className="space-y-1">
                  {[
                    { asset: "XAU/USD", move: "+$25 to +$40 in 30 seconds" },
                    { asset: "Nasdaq", move: "+1 to +1.5% in the first minutes" },
                    { asset: "BTC/USD", move: "+$300 to +$800 depending on volatility" },
                  ].map((item) => (
                    <li key={item.asset} className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="font-semibold text-zinc-300">{item.asset}</span>
                      <span>{item.move}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-zinc-500 mt-2 italic">The mechanism is strictly symmetric: an NFP that disappoints pushes up what an NFP that surprises pushes down.</p>
              </div>
            </div>

            {/* Visual component */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <ConsensusVsRealDiagram locale="en" />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                The bigger the gap between forecast and reality, the more violent the move.
              </p>
            </div>
          </section>

          {/* Block 6 — How to use this concretely */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">How to use this concretely</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              You don&apos;t need to be an expert. Here&apos;s the simple routine:
            </p>
            <div className="space-y-3 mb-5">
              {[
                { n: "1", text: "Look only at the 3 star (red) events" },
                { n: "2", text: "Note the times in your calendar" },
                { n: "3", text: "Don't trade in the 30 minutes before" },
                { n: "4", text: "Watch the reaction at the moment of release" },
                { n: "5", text: "If the setup is confirmed after the reaction → you can enter following the move, based on your own trading plan" },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-5">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">The experienced trader&apos;s method</span>: you will <span className="font-semibold text-zinc-300">never</span> trade the news live. You wait 15-30 minutes after, the market calms down, the new direction takes shape, and you enter with technical confluence.
              </p>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                You don&apos;t trade the news. You trade the reaction.
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
              "The market reacts to the surprise (actual vs forecast), not the raw number",
              "5 numbers dominate: NFP, CPI, FOMC, PMI, GDP, focus on them",
              "The 3 star events are the only ones that deserve your attention",
              "The bigger the gap between forecast and reality, the more violent the move",
            ]}
          />

          <LessonExercice
            description="This week, train yourself to read the macro numbers."
            steps={[
              "Open an economic calendar (Investing.com or Forex Factory).",
              "Filter by 3 star events only, for this week.",
              "Spot an NFP, a CPI or an FOMC.",
              "Note the exact time and the forecast (consensus) shown.",
              "On the day, watch the chart of an affected asset (EUR/USD, XAU/USD or a US index) 15 min before, at the moment of, and 30 min after the release.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            The goal: get used to <span className="font-semibold text-zinc-400">anticipating volatility</span> instead of taking it on the chin.
          </p>

          <LessonQuiz
            question="A CPI number is expected at 3.0%. It comes out at 3.8%. What happens most often?"
            options={[
              "Nothing, it's already priced in",
              "The market always goes up",
              "The market reacts strongly because it's a big surprise",
              "The market always goes down",
            ]}
            correctIndex={2}
            explanation="The market doesn't react to the number alone, but to the gap with expectations. Here, inflation comes out at 3.8% instead of the 3.0% expected → big inflationary surprise → violent move almost guaranteed. Options A, B and D are wrong: the direction always depends on context (whether higher inflation is perceived as positive or negative depends on the economic situation at the time). This principle applies to all assets: forex, gold, indices, crypto."
            answerExplanations={[
              "Wrong. Just because a number is expected doesn't mean it won't have impact. 3.8% vs 3.0% expected is a significant gap, the market always reacts to a surprise like this.",
              "Wrong. The direction of the move depends on the economic context. Higher inflation can be perceived as positive or negative depending on the situation. The only certainty: there will be a strong move.",
              "Correct. 3.8% vs 3.0% expected = +0.8% gap on inflation, that's a big surprise. The market is going to react strongly. The exact direction depends on context, but the violent move is almost guaranteed.",
              "Wrong. The direction depends on the economic context, not a fixed rule. What's certain is that there will be a strong move, not necessarily to the downside.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-debutant", "lecon3"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">The next lesson (Understanding inflation) will be available soon.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/debutant/lecon2"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 2. The 4 major central banks
              </Link>
              <Link
                href="/formations/macro/debutant/lecon4"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Lesson 4. Understanding inflation
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
