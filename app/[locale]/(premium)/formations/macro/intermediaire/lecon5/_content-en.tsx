"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { CorrelationMatrixDiagram } from "@/app/components/charts/CorrelationMatrixDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Hawkish vs Dovish",                       href: "/formations/macro/intermediaire/lecon1", disabled: false },
  { id: "lecon2", title: "Understanding the economic calendar",      href: "/formations/macro/intermediaire/lecon2", disabled: false },
  { id: "lecon3", title: "CPI, PPI and inflation",                  href: "/formations/macro/intermediaire/lecon3", disabled: false },
  { id: "lecon4", title: "Trading sessions and liquidity",          href: "/formations/macro/intermediaire/lecon4", disabled: false },
  { id: "lecon5", title: "Correlations",                            href: "/formations/macro/intermediaire/lecon5", disabled: false },
  { id: "lecon6", title: "Building your weekly bias",               href: null,                                     disabled: true  },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-intermediaire", "lecon5"));
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
          <span className="text-zinc-500">Lesson 5</span>
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
            Correlations: how markets move together (and why you get trapped)
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Opening 3 different trades doesn&apos;t mean taking 3 different risks.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Sometimes you think you&apos;re diversifying. In reality, you&apos;re stacking the same bet.
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

          {/* Block 1 — What a correlation is */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">What a correlation is</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A correlation measures the way two assets move together.
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "+1", rest: " = they move almost the same" },
                { bold: "0", rest: " = no clear link" },
                { bold: "-1", rest: " = they move in opposite directions" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Examples:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                { bold: "EUR/USD and GBP/USD", rest: " often rise together (strong positive correlation)" },
                { bold: "XAU/USD and DXY", rest: " often move in opposite directions (strong negative correlation)" },
                { bold: "BTC/USD and Nasdaq", rest: " have often been correlated since 2022 (positive correlation)" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>

            {/* Visual component */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <CorrelationMatrixDiagram />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Two different charts can hide the same trade.
              </p>
            </div>
          </section>

          {/* Block 2 — The major correlations to know */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The major correlations to know</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Here are the most useful relationships to watch:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "EUR/USD vs GBP/USD", rest: ": strong positive correlation, often around ", val: "+0.85" },
                { bold: "EUR/USD vs USD/CHF", rest: ": very strong negative correlation, often around ", val: "-0.95" },
                { bold: "XAU/USD vs DXY", rest: ": strong negative correlation, often around ", val: "-0.80" },
                { bold: "Nasdaq vs DXY", rest: ": moderate negative correlation, often around ", val: "-0.60" },
                { bold: "BTC/USD vs Nasdaq", rest: ": strong positive correlation since 2022, often around ", val: "+0.75" },
                { bold: "WTI vs USD/CAD", rest: ": strong negative correlation, often around ", val: "-0.75" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>
                    <span className="font-semibold text-zinc-200">{item.bold}</span>
                    {item.rest}
                    <span className="font-semibold text-zinc-200">{item.val}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="space-y-1.5 mb-5">
              {[
                { pre: "When the DXY rises, ", bold: "XAU/USD", post: " is often under pressure." },
                { pre: "When the Nasdaq rises, ", bold: "BTC/USD", post: " can follow." },
                { pre: "When the DXY drops, ", bold: "XAU/USD", post: " can breathe." },
              ].map((item, i) => (
                <p key={i} className="text-zinc-300 leading-relaxed text-sm">
                  {item.pre}<span className="font-semibold text-zinc-200">{item.bold}</span>{item.post}
                </p>
              ))}
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Knowing 6 major correlations means being able to read 6 markets while looking at a single chart.
              </p>
            </div>
          </section>

          {/* Block 3 — The false-diversification trap */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The false-diversification trap</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Classic case:
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">You open:</p>
            <ul className="space-y-1.5 mb-4">
              {["long EUR/USD", "long GBP/USD", "short USD/CHF"].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              You think you have 3 different trades.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              In reality, what you mostly took is{" "}
              <span className="font-semibold text-zinc-200">3 anti-dollar positions</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              If the dollar explodes after a hawkish FOMC, you can lose on all 3 at the same time.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Concrete math</span>:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "2% risk per trade", rest: " (healthy management)" },
                { bold: "3 correlated trades", rest: " (long EUR/USD + long GBP/USD + short USD/CHF)" },
                { bold: "surprise hawkish FOMC", rest: " → the dollar explodes" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>You take <span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Result:{" "}
              <span className="font-semibold text-zinc-200">-6% of the account on a single news event</span>. You managed your per-trade risk well. But you didn&apos;t see that your 3 trades were{" "}
              <span className="font-semibold text-zinc-200">the same trade</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              On $500, that&apos;s{" "}
              <span className="font-semibold text-zinc-200">-$30 in one hour</span>. On $2,000, that&apos;s{" "}
              <span className="font-semibold text-zinc-200">-$120</span>. And the worst part: you&apos;ll think it was &apos;bad luck&apos;. When it&apos;s really just badly calculated risk.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Same logic with</span>:
            </p>
            <ul className="space-y-1.5 mb-4">
              {["long XAU/USD", "long BTC/USD", "long Nasdaq"].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              You think you&apos;re diversifying across gold, crypto and indices. But if the market turns risk-off and the DXY rises,{" "}
              <span className="font-semibold text-zinc-200">XAU/USD can drop, BTC/USD can drop, and the Nasdaq can drop too</span>.
            </p>

            {/* Box 💰 Retail reality */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Retail reality</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                Retail thinks they&apos;re diversifying because the names change. Pros look at the hidden risk behind them.
              </p>
            </div>
          </section>

          {/* Block 4 — Using correlations as confirmation */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Using correlations as confirmation</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Correlations aren&apos;t only there to avoid over-risking. They also serve to{" "}
              <span className="font-semibold text-zinc-200">confirm a trade</span>.
            </p>
            <div className="space-y-4 mb-5">
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-2">If you want to short EUR/USD:</p>
                <ul className="space-y-1.5">
                  {[
                    "DXY should ideally be rising",
                    "GBP/USD should also be weak",
                    "USD/CHF should confirm the dollar's strength",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-2">If you want to buy XAU/USD:</p>
                <ul className="space-y-1.5">
                  {[
                    "DXY should ideally be falling",
                    "US yields should be under pressure",
                    "XAU/USD should hold a bullish structure",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-2">If you want to buy BTC/USD:</p>
                <ul className="space-y-1.5">
                  {[
                    "Nasdaq should ideally be strong",
                    "the DXY shouldn't be exploding higher",
                    "the risk-on context should support risk assets",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                A good trade is rarely alone. The markets around it should confirm.
              </p>
            </div>
          </section>

          {/* Block 5 — When correlations break */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">When correlations break</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A correlation isn&apos;t a fixed law. It can break.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              And when it breaks, it&apos;s often an{" "}
              <span className="font-semibold text-zinc-200">important signal</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Examples</span>:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "BTC/USD rises while the Nasdaq falls", rest: " → possible crypto-specific buying or institutional flow" },
                { bold: "XAU/USD rises while the DXY rises", rest: " → possible geopolitical stress or extreme safe-haven demand" },
                { bold: "EUR/USD falls but GBP/USD holds", rest: " → possible news specific to the euro or the pound" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              A correlation break doesn&apos;t mean &apos;market error&apos;. It means:{" "}
              <span className="font-semibold text-zinc-200">something specific is happening</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                When a correlation breaks, the market is showing you where to look.
              </p>
            </div>
          </section>

          {/* Block 6 — The pro risk-management rule */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The pro risk-management rule</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">Simple rule</span>: never too many strongly correlated trades open at the same time.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              If you take two positions that go the same way macro-wise:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "you cut the size", rest: "" },
                { bold: "you assume the risk is cumulative", rest: "" },
                { bold: "you avoid believing it's diversification", rest: "" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Example</span>:
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              You want to buy XAU/USD and BTC/USD.
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { pre: "If the DXY rises hard, ", bold: "both can suffer", post: "." },
                { pre: "If the Nasdaq drops, ", bold: "BTC/USD can be dragged down", post: "." },
                { pre: "If the market turns risk-off, ", bold: "XAU/USD can hold up sometimes, but BTC/USD and the Nasdaq are often vulnerable", post: "." },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item.pre}<span className="font-semibold text-zinc-200">{item.bold}</span>{item.post}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              So you don&apos;t count this as two separate risks.{" "}
              <span className="font-semibold text-zinc-200">You count it as one block of risk.</span>
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Diversification starts when your risks don&apos;t fall together.
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
              "A correlation shows whether two assets move together or in opposite directions",
              "XAU/USD, BTC/USD, Nasdaq and DXY should be watched together",
              "Several trades can hide the same macro risk",
              "A correlation break is often an early signal",
            ]}
          />

          <LessonExercice
            description="Before opening several trades, check whether you're really taking several risks."
            steps={[
              "Pick 3 assets you trade often: for example XAU/USD, BTC/USD and Nasdaq.",
              "Compare their direction with the DXY over the last sessions.",
              "Check whether your setups all go the same way macro-wise.",
              "If two assets are strongly correlated, split the size or pick the best setup.",
              "Note when a correlation breaks: it's often the most interesting signal.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            The goal:{" "}
            <span className="font-semibold text-zinc-400">stop stacking the same risk without realizing it</span>.
          </p>

          <LessonQuiz
            question="You open long XAU/USD, long BTC/USD and long Nasdaq on the same day. The DXY starts rising hard. What's the real danger?"
            options={[
              "None, they're three different markets",
              "You're probably exposed several times to the same macro risk",
              "The DXY only concerns forex pairs",
              "BTC/USD never has any link with the Nasdaq",
            ]}
            correctIndex={1}
            explanation="XAU/USD, BTC/USD and Nasdaq can all suffer in a strong-dollar or risk-off context. Even if the assets are different, the risk can be the same. Option A ignores correlations (beginner reading). Option C is false because the DXY also drives gold, crypto and US indices. Option D is false now that BTC/USD often behaves like a risk asset correlated with the Nasdaq (since 2022)."
            answerExplanations={[
              "False. XAU/USD, BTC/USD and Nasdaq share an exposure to a strong dollar and to risk-off. Even if the names are different, they can all drop at the same time.",
              "Correct. XAU/USD, BTC/USD and Nasdaq can all suffer in a strong-dollar or risk-off context. The risk can be the same, even if the assets are different.",
              "False. The DXY also drives gold (XAU/USD), crypto (BTC/USD) and US indices (Nasdaq). It's not limited to forex pairs.",
              "False. Since 2022, BTC/USD often behaves like a risk asset correlated with the Nasdaq. The two tend to rise or fall together.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-intermediaire", "lecon5"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">The next lesson (Building your weekly bias) will be available soon.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/intermediaire/lecon4"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 4. Trading sessions and liquidity
              </Link>
              <Link
                href="/formations/macro/intermediaire/lecon6"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Lesson 6. Building your weekly bias
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
