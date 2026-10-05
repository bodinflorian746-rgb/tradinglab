"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { DollarHubDiagram } from "@/app/components/charts/DollarHubDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "What macro is",                    href: "/formations/macro/debutant/lecon1", disabled: false },
  { id: "lecon2", title: "The 4 major central banks",        href: "/formations/macro/debutant/lecon2", disabled: false },
  { id: "lecon3", title: "The macro numbers to watch",       href: "/formations/macro/debutant/lecon3", disabled: false },
  { id: "lecon4", title: "Understanding inflation",          href: "/formations/macro/debutant/lecon4", disabled: false },
  { id: "lecon5", title: "The role of the dollar worldwide", href: "/formations/macro/debutant/lecon5", disabled: false },
  { id: "lecon6", title: "Macro and risk management",        href: null,                                disabled: true  },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-debutant", "lecon5"));
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
          <span className="text-zinc-500">Lesson 5</span>
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
            The role of the dollar worldwide, why everything runs through it
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              You trade XAU/USD, EUR/USD, BTC/USD? Look at what they have in common.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              You&apos;re not trading gold, the euro or Bitcoin. You&apos;re trading the dollar, whether it&apos;s at the top or the bottom of the symbol.
            </p>
          </div>

          {/* Structure indicator */}
          <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600">
            {["Reading", "Key takeaways", "Exercise", "Quiz"].map((step, i, arr) => (
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
              const isCurrent = lesson.id === "lecon5";
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
            <span className="ml-auto text-xs text-zinc-600">5 / 6 lessons</span>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="space-y-8">

          {/* Block 1 — Why the dollar is unique */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Why the dollar is unique</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The dollar isn&apos;t a currency like the others. <span className="font-semibold text-zinc-200">It sits at the center of the global financial system.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              A few numbers worth knowing:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "around 60% of the world's central bank reserves", rest: " are held in dollars" },
                { bold: "around 88% of forex transactions", rest: " involve the dollar" },
                { bold: "gold, oil and most commodities", rest: " are priced in USD" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Since Bretton Woods (1944), the financial world has been built around the dollar. That central position has never been called into question.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                The dollar isn&apos;t just a currency. It&apos;s the backbone of the market.
              </p>
            </div>
          </section>

          {/* Block 2 — The DXY + visual */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The DXY: the dollar&apos;s weather report</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              The <span className="font-semibold text-zinc-200">DXY</span> (Dollar Index) measures the strength of the dollar against a basket of 6 major currencies:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { label: "EUR", note: "(largest weight: ~57.6%)" },
                { label: "JPY", note: null },
                { label: "GBP", note: null },
                { label: "CAD", note: null },
                { label: "SEK", note: null },
                { label: "CHF", note: null },
              ].map((item) => (
                <li key={item.label} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  <span className="font-semibold text-zinc-200">{item.label}</span>
                  {item.note && <span className="text-zinc-500">{item.note}</span>}
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">So:</p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-zinc-200">
                  <span className="text-zinc-400 font-normal">DXY rises</span> → strong dollar
                </p>
                <p className="text-sm font-semibold text-zinc-200">
                  <span className="text-zinc-400 font-normal">DXY falls</span> → weak dollar
                </p>
              </div>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Simple analogy</span>: the DXY is the <span className="font-semibold text-zinc-200">dollar&apos;s thermometer</span>. You check it to know whether the market is heating up or cooling down.
            </p>

            {/* Visual component */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden">
              <DollarHubDiagram locale="en" />
            </div>
          </section>

          {/* Block 3 — When the dollar rises, everything changes */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">When the dollar rises, everything changes</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A strong dollar reshapes the read on <span className="font-semibold text-zinc-200">almost every market</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              When the DXY rises:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "EUR/USD", rest: " often falls" },
                { bold: "XAU/USD", rest: " (gold) can fall" },
                { bold: "Crypto", rest: " often falls" },
                { bold: "Commodities", rest: " under pressure" },
                { bold: "Indices", rest: " sometimes under pressure" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Why?</span> Because a strong dollar makes USD-denominated assets more expensive for the rest of the world. And because investors prefer the safe-haven dollar when uncertainty rises.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                When the dollar strengthens, risk breathes less easily.
              </p>
            </div>
          </section>

          {/* Block 4 — Recent example: 2022 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Recent example: 2022</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The best recent example: <span className="font-semibold text-zinc-200">2022</span>. The dollar (DXY) gained <span className="font-semibold text-zinc-200">+20%</span> over the year.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Cascading consequences:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "EUR/USD", rest: ": -21% (drops from 1.20 to 0.95)" },
                { bold: "Gold", rest: ": under pressure all year" },
                { bold: "Crypto", rest: ": -65%" },
                { bold: "US indices", rest: ": Nasdaq -33%" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              You&apos;ll find the full breakdown of the chain in the <span className="font-semibold text-zinc-200">previous lesson on inflation</span>. But remember this: it was the <span className="font-semibold text-zinc-200">strong dollar that squeezed the whole system</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                A single currency squeezed the entire system. That&apos;s the power of the dollar.
              </p>
            </div>
          </section>

          {/* Block 5 — The dollar and fragile countries */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The dollar and fragile countries</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Many countries and companies <span className="font-semibold text-zinc-200">borrow in dollars</span> (and not in their local currency).
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              When the dollar rises:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "their debt becomes more expensive", rest: " to repay" },
                { bold: "their local currency weakens", rest: "" },
                { bold: "financial tensions", rest: " increase" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              That&apos;s why periods of a strong dollar can put pressure on countries like <span className="font-semibold text-zinc-200">Argentina</span>, <span className="font-semibold text-zinc-200">Turkey</span> or <span className="font-semibold text-zinc-200">Sri Lanka</span>. Currency crises, defaults, collapsing local currencies.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                A strong dollar doesn&apos;t just move the charts. It squeezes the entire system.
              </p>
            </div>
          </section>

          {/* Block 6 — How to use it in your trading */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">How to use it in your trading</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Here&apos;s the routine of the trader who actually uses the DXY:
            </p>
            <div className="space-y-3 mb-5">
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">Step 1. Before your technical analysis</p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Pull up the DXY chart on H1 or H4. Look at the trend over the last 3 days.
                </p>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-2">Step 2. Identify the context</p>
                <ul className="space-y-1">
                  {[
                    { bold: "Strong bullish DXY", rest: " → strong dollar → risk-off context" },
                    { bold: "Bearish DXY", rest: " → weak dollar → risk-on context" },
                    { bold: "DXY in a range", rest: " → neutral context, classic technical analysis takes priority" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                      <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-2" />
                      <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1.5">Step 3. Adapt your setups</p>
                <p className="text-sm text-zinc-300 leading-relaxed mb-2">
                  If you want to buy (long) EUR/USD, XAU/USD or BTC/USD → make sure the DXY is <span className="font-semibold text-zinc-200">NOT rising hard</span>. Otherwise your setup will probably fail even if it&apos;s technically perfect.
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  <span className="font-semibold text-zinc-200">The opposite is also true</span>: if you want to sell (short) those same assets, a bullish DXY <span className="font-semibold text-zinc-200">strengthens</span> your setup.
                </p>
              </div>
            </div>

            {/* Callout 💰 Retail reality */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Retail reality</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                If you trade EUR/USD, XAU/USD or BTC/USD without looking at the DXY, you&apos;re missing half the story. Technical setups often fail because <span className="font-semibold text-zinc-200">the dollar context isn&apos;t favorable</span>, not because the strategy is bad.
              </p>
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                A bad read on the DXY = a bad trade, even with a perfect strategy.
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
              "The dollar is the central currency of the global financial system",
              "The DXY measures the strength of the dollar in a single chart",
              "Bullish DXY = frequent pressure on EUR/USD, gold, crypto, risk assets",
              "Checking the DXY every morning gives you the macro context for your day",
            ]}
          />

          <LessonExercice
            description="Before your next session, add the DXY to your routine."
            steps={[
              "Pull up the DXY chart (on TradingView or Investing.com).",
              "Note the trend: bullish, bearish or range over the last 3 days.",
              "Compare it with the EUR/USD chart over the same period.",
              "Compare it with XAU/USD or BTC/USD over the same period.",
              "Note whether the moves are consistent with the strength of the dollar (DXY up = others down, and vice versa).",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            The goal: <span className="font-semibold text-zinc-400">learning to see the market through the dollar</span>.
          </p>

          <LessonQuiz
            question="The DXY has been rising sharply for several days. Which read is the most logical?"
            options={[
              "The dollar is weak, so EUR/USD should rise",
              "The dollar is strong, so EUR/USD is probably under pressure",
              "The DXY is only useful for trading US stocks",
              "The DXY has no impact on gold or crypto",
            ]}
            correctIndex={1}
            explanation="When the DXY rises, it means the dollar is strengthening. EUR/USD is generally under pressure because the euro falls against the dollar. Option A confuses a high DXY with a weak dollar (it's the opposite). Option C is false: the DXY gives a global context on the dollar, not just on US stocks, it influences forex, commodities, gold and crypto. Option D is false too: gold (XAU/USD) and crypto (BTC/USD) are priced in dollars, so they're directly impacted by its strength."
            answerExplanations={[
              "Wrong. A rising DXY means a strong dollar, the opposite of a weak dollar. When the dollar strengthens, EUR/USD generally falls, not the other way around.",
              "Correct. A rising DXY means a strong dollar. EUR/USD is generally under pressure in this context because the euro depreciates against the dollar.",
              "Wrong. The DXY gives a global context on the strength of the dollar, it influences forex, commodities, gold and crypto, not just US stocks.",
              "Wrong. Gold (XAU/USD) and crypto (BTC/USD) are both priced in dollars, so they're directly impacted by the strength of the dollar. A bullish DXY often puts gold and crypto under pressure.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-debutant", "lecon5"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">The next lesson (Macro and risk management) will be available soon.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/debutant/lecon4"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 4. Understanding inflation
              </Link>
              <Link
                href="/formations/macro/debutant/lecon6"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Lesson 6. Macro and risk management
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
