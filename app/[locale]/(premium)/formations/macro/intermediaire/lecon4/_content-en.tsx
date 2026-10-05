"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { TradingSessionsLiquidityDiagram } from "@/app/components/charts/TradingSessionsLiquidityDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Hawkish vs Dovish",                      href: "/formations/macro/intermediaire/lecon1", disabled: false },
  { id: "lecon2", title: "Understanding the economic calendar",     href: "/formations/macro/intermediaire/lecon2", disabled: false },
  { id: "lecon3", title: "CPI, PPI and inflation",                  href: "/formations/macro/intermediaire/lecon3", disabled: false },
  { id: "lecon4", title: "Trading sessions and liquidity",          href: "/formations/macro/intermediaire/lecon4", disabled: false },
  { id: "lecon5", title: "Correlations",                            href: null,                                     disabled: true  },
  { id: "lecon6", title: "Building your weekly bias",               href: null,                                     disabled: true  },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-intermediaire", "lecon4"));
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
          <span className="text-zinc-500">Lesson 4</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20">
              Intermediate
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
            Trading sessions and liquidity, when the market really moves
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              You can have a solid strategy and still lose, just because you&apos;re trading at the wrong time.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              The market doesn&apos;t move the same way at 3pm as it does at 11pm.
            </p>
          </div>

          {/* Structure indicator */}
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

          {/* Block 1 — The 3 major sessions */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The 3 major sessions</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              The forex market runs from Sunday evening (11pm Paris time) to Friday evening,{" "}
              <span className="font-semibold text-zinc-200">24/7 with no real break</span>. The only &apos;close&apos; is a short daily gap around midnight (varies by CFD broker), then it picks right back up.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              But &apos;open&apos; doesn&apos;t mean &apos;active&apos;. There are{" "}
              <span className="font-semibold text-zinc-200">3 major sessions</span>{" "}
              that take turns and determine the real liquidity:
            </p>

            <div className="space-y-4 mb-5">
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-1">Asian session, 12am to 9am Paris time</p>
                <p className="text-sm text-zinc-300 mb-0.5">Tokyo, Singapore, Hong Kong. Low liquidity. Low volatility.</p>
                <p className="text-sm text-zinc-400">Active pairs: USD/JPY, AUD/JPY, NZD/JPY, AUD/USD.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-1">London session, 8am to 5pm Paris time</p>
                <p className="text-sm text-zinc-300 mb-0.5">
                  <span className="font-semibold text-zinc-200">THE most important session.</span> It accounts for roughly{" "}
                  <span className="font-semibold text-zinc-200">35-40% of global forex volume</span>.
                </p>
                <p className="text-sm text-zinc-400">Active pairs: EUR/USD, GBP/USD, EUR/GBP, GBP/JPY, XAU/USD.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-1">New York session, 2pm to 10pm Paris time</p>
                <p className="text-sm text-zinc-300 mb-0.5">
                  Wall Street, US indices, US news. It accounts for roughly{" "}
                  <span className="font-semibold text-zinc-200">20-25% of global forex volume</span>.
                </p>
                <p className="text-sm text-zinc-400">Active pairs: EUR/USD, GBP/USD, USD/JPY, USD/CAD, XAU/USD, US indices.</p>
              </div>
            </div>

            {/* Visual component */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <TradingSessionsLiquidityDiagram locale="en" />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                The market doesn&apos;t close. What changes is the liquidity.
              </p>
            </div>
          </section>

          {/* Block 2 — The London-New York overlap */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The London-New York overlap</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The best liquidity window is often between{" "}
              <span className="font-semibold text-zinc-200">2pm and 5pm Paris time</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Why? Because London and New York are open{" "}
              <span className="font-semibold text-zinc-200">at the same time</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">During those 3 hours:</p>
            <ul className="space-y-1.5 mb-4">
              {[
                "European institutions are active",
                "American institutions come online",
                "US news often drops at 2:30pm",
                "volumes explode",
                "the real moves form",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              On EUR/USD,{" "}
              <span className="font-semibold text-zinc-200">a big chunk of the daily volatility is often concentrated</span>{" "}
              in this window.
            </p>
            <div className="bg-zinc-900/60 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">It&apos;s the same for the other major assets:</p>
              <ul className="space-y-1.5">
                {[
                  { bold: "XAU/USD (gold)", rest: ": 50-60% of the daily volatility is concentrated in the overlap" },
                  { bold: "Nasdaq, S&P500", rest: ": US open at 3:30pm = peak of institutional activity" },
                  { bold: "BTC/USD", rest: ": peak institutional volatility between 2pm and 5pm" },
                ].map((item) => (
                  <li key={item.bold} className="flex items-start gap-2 text-xs text-zinc-400">
                    <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-1.5" />
                    <span><span className="font-semibold text-zinc-300">{item.bold}</span>{item.rest}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-zinc-500 mt-2 italic">The overlap isn&apos;t just a forex window. It&apos;s THE window, period.</p>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                The overlap is where the market stops breathing softly and starts swinging.
              </p>
            </div>
          </section>

          {/* Block 3 — The Asian session trap */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The Asian session trap</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              A lot of traders trade in the evening, after work.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              10pm. 11pm. Midnight.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              The problem: on EUR/USD or GBP/USD,{" "}
              <span className="font-semibold text-zinc-200">that&apos;s often the worst time</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              The same trap exists on{" "}
              <span className="font-semibold text-zinc-200">XAU/USD</span> and{" "}
              <span className="font-semibold text-zinc-200">US indices</span>: between 10pm and 6am, these assets are also in a quiet zone with widened spreads. Only the JPY pairs (USD/JPY, AUD/JPY) really move during the Asian session.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Between 10pm and 6am:</p>
            <ul className="space-y-1.5 mb-4">
              {[
                "low liquidity",
                "wider spreads",
                "frequent ranges",
                "more fakeouts",
                "fewer macro catalysts",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              You see a breakout. You enter. Price comes right back into the range.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              It wasn&apos;t a real breakout.{" "}
              <span className="font-semibold text-zinc-200">It was just an empty market.</span>
            </p>

            {/* 💰 Retail reality box */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Retail reality</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                Retail traders often trade when they&apos;re available. Not when the market is optimal. The result? Setups that look perfect but fail, not because of the strategy, but because of the time.
              </p>
            </div>
          </section>

          {/* Block 4 — Which pair to trade by session */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Which pair to trade by session</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Every asset has its strong hours.
            </p>

            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-left py-2 pr-6 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                      Asset / pair
                    </th>
                    <th className="text-left py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                      Best session
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {[
                    ["EUR/USD", "London + overlap"],
                    ["GBP/USD", "London + overlap"],
                    ["USD/JPY", "New York + Asia"],
                    ["AUD/JPY", "Asia"],
                    ["NZD/JPY", "Asia"],
                    ["XAU/USD (gold)", "London + New York"],
                    ["US indices", "New York"],
                    ["BTC/USD", "24/7, but often cleaner during London-New York"],
                  ].map(([pair, session]) => (
                    <tr key={pair}>
                      <td className="py-2.5 pr-6 font-semibold text-zinc-200">{pair}</td>
                      <td className="py-2.5 text-zinc-400">{session}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              If you trade EUR/USD at 11pm,{" "}
              <span className="font-semibold text-zinc-200">you&apos;re often trading a sleeping market</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              If you trade EUR/USD between 2pm and 5pm,{" "}
              <span className="font-semibold text-zinc-200">you&apos;re trading when the big players are there</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                The right pair at the wrong time becomes a bad setup.
              </p>
            </div>
          </section>

          {/* Block 5 — Adapting your style to the session */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Adapting your style to the session</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              You don&apos;t trade every session the same way.
            </p>
            <div className="space-y-3 mb-5">
              {[
                { bold: "Scalping", rest: ": needs liquidity. London and overlap only." },
                { bold: "Day trading", rest: ": London-New York overlap is ideal. That&apos;s where the moves are cleanest." },
                { bold: "Swing trading", rest: ": you can use London to spot the important breakouts." },
                { bold: "News trading", rest: ": often around 2:30pm or 8pm. But only with preparation." },
              ].map((item, i) => (
                <p key={i} className="text-zinc-300 leading-relaxed text-sm">
                  <span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}
                </p>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              If your strategy needs movement,{" "}
              <span className="font-semibold text-zinc-200">don&apos;t test it on a dead session</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                A scalping strategy in the Asian session is like playing tennis with no opponent, you can hit the ball, but nothing happens.
              </p>
            </div>
          </section>

          {/* Block 6 — Building your trading window */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Building your trading window</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              The goal isn&apos;t to <span className="font-semibold text-zinc-200">trade more</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The goal is to <span className="font-semibold text-zinc-200">trade at the right time</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">For a trader on European time:</p>
            <ul className="space-y-2 mb-5">
              {[
                { bold: "8am-10am", rest: ": London open" },
                { bold: "2pm-5pm", rest: ": London-New York overlap (ideal)" },
                { bold: "3:30pm-6pm", rest: ": US indices open" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>
                  <span className="font-semibold text-zinc-200">10pm-6am</span>
                  {": the market stays open but "}
                  <span className="font-semibold text-zinc-200">liquidity is low</span>
                  {" on EUR/USD, GBP/USD and XAU/USD. For JPY pairs, it can actually be active (Tokyo opens around 1am)."}
                </span>
              </li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              These windows hold for most major assets: forex, gold, US indices and crypto. The only exception: JPY pairs can justify watching the Asian session (12am-9am).
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              If you work during the day, the evening can be tempting.{" "}
              <span className="font-semibold text-zinc-200">But tempting doesn&apos;t mean profitable.</span>
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Your edge doesn&apos;t depend on your strategy alone. It also depends on the time you use it.
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
              "The market is open 24/7, but liquidity varies enormously",
              "London and the London-New York overlap are the cleanest windows",
              "The Asian session is often dangerous for EUR/USD, GBP/USD, XAU/USD and US indices",
              "Adapting your pair and your strategy to the session improves your edge",
            ]}
          />

          <LessonExercice
            description="Analyze your own trading window."
            steps={[
              "Note the hours when you trade most often.",
              "Identify the matching session: Asia, London or New York.",
              "Compare your results by time of day (if you keep a journal).",
              "Watch EUR/USD between 2pm and 5pm for 3 days in a row.",
              "Compare it with how the same asset behaves after 10pm.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            The goal: check whether you trade{" "}
            <span className="font-semibold text-zinc-400">at the right time or only when you&apos;re available</span>.
          </p>

          <LessonQuiz
            question="You trade EUR/USD at 11pm Paris time. Price breaks a resistance, then immediately comes back into the range and stops you out. What's the most likely explanation?"
            options={[
              "Your strategy no longer works, you need to rethink everything",
              "The session has low liquidity, so fakeouts are more frequent on EUR/USD at that hour",
              "EUR/USD never respects resistances",
              "The forex market is closed at 11pm",
            ]}
            correctIndex={1}
            explanation="At 11pm Paris time, London and New York are closed. On EUR/USD, liquidity is often lower, spreads can widen and breakouts are less reliable. This is exactly the Asian session trap on European/US pairs. Option A is too extreme (your strategy can work just fine during the London-NY overlap). Option C is false (EUR/USD respects resistances perfectly when liquidity is there). Option D is incorrect: forex is open, but not always well tradable. This same principle applies to XAU/USD, US indices and BTC/USD, the timing is universal, not just forex."
            answerExplanations={[
              "Wrong. Your strategy isn't to blame here. The problem comes from the timing context, not the technical analysis. A strategy can work perfectly during the overlap and fail at night.",
              "Correct. At 11pm Paris time, London and New York are closed. Liquidity on EUR/USD is low, spreads widen and breakouts are less reliable. It's the classic Asian session trap on European pairs.",
              "Wrong. EUR/USD respects technical levels very well, but only when there's liquidity, meaning mainly during the London and New York sessions.",
              "Wrong. Forex is technically open 24/7. But 'open' doesn't mean 'tradable in good conditions'.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-intermediaire", "lecon4"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">The next lesson (Correlations) will be available soon.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/intermediaire/lecon3"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 3. CPI, PPI and inflation
              </Link>
              <Link
                href="/formations/macro/intermediaire/lecon5"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Lesson 5. Correlations
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
