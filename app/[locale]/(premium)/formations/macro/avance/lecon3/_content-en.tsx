"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { US10YHubDiagram } from "@/app/components/charts/US10YHubDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "FOMC",                        href: "/formations/macro/avance/lecon1", disabled: false },
  { id: "lecon2", title: "NFP",                         href: "/formations/macro/avance/lecon2", disabled: false },
  { id: "lecon3", title: "US bond yields",              href: "/formations/macro/avance/lecon3", disabled: false },
  { id: "lecon4", title: "Risk-on / Risk-off",          href: "/formations/macro/avance/lecon4", disabled: false },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-avance", "lecon3"));
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
          <Link href="/formations/macro/avance" className="hover:text-zinc-400 transition-colors">Advanced</Link>
          <span>/</span>
          <span className="text-zinc-500">Lesson 3</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Advanced
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
            US bond yields, the market that drives all the others
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Retail watches gold, the Nasdaq or Bitcoin.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Pros watch US yields first.
            </p>
          </div>

          {/* Indicateur de structure */}
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

          {/* Pills des leçons */}
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            {LESSONS.map((lesson) => {
              const isCurrent = lesson.id === "lecon3";
              const pill = (
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  isCurrent
                    ? "bg-zinc-800 border-zinc-600 text-white"
                    : lesson.disabled
                    ? "border-zinc-800/50 text-zinc-700"
                    : "border-zinc-800 text-zinc-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : lesson.disabled ? "bg-zinc-700" : "bg-zinc-600"}`} />
                  {lesson.title}
                </span>
              );
              return <div key={lesson.id}>{pill}</div>;
            })}
            <span className="ml-auto text-xs text-zinc-600">3 / 4 lessons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — What a bond yield is */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">What a bond yield is</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A bond yield is the rate a government pays to borrow.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              In the United States, these bonds are called <span className="font-semibold text-zinc-200">US Treasuries</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              The three main maturities:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "US2Y", suf: ": 2-year yield" },
                { bold: "US10Y", suf: ": 10-year yield" },
                { bold: "US30Y", suf: ": 30-year yield" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.suf}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The most important one for the markets: <span className="font-semibold text-zinc-200">US10Y</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              <span className="font-semibold text-zinc-200">Why?</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Because the US 10-year is the global benchmark. It&apos;s the <span className="font-semibold text-zinc-200">&apos;risk-free rate&apos;</span> institutions use to compare every other asset.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                If the risk-free rate becomes attractive, risk assets have to justify themselves.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Price and yield: the basic trap */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Price and yield: the basic trap</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A bond works the <span className="font-semibold text-zinc-200">opposite</span> way to what many people imagine.
            </p>
            <div className="space-y-1.5 mb-4">
              {[
                { pre: "When the bond price ", bold: "rises", mid: ", its yield ", bold2: "falls", suf: "." },
                { pre: "When the bond price ", bold: "falls", mid: ", its yield ", bold2: "rises", suf: "." },
              ].map((item, i) => (
                <p key={i} className="text-zinc-300 leading-relaxed text-sm">
                  {item.pre}<span className="font-semibold text-zinc-200">{item.bold}</span>{item.mid}<span className="font-semibold text-zinc-200">{item.bold2}</span>{item.suf}
                </p>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              This is crucial.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              If investors sell US bonds:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                "bond prices fall",
                "yields rise",
                "the market gets more tense",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              And when yields rise, assets like <span className="font-semibold text-zinc-200">XAU/USD, Nasdaq and BTC/USD can suffer</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                When yields rise, the market breathes worse.
              </p>
            </div>
          </section>

          {/* Bloc 3 — The 3 yields to watch */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The 3 yields to watch</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              You don&apos;t need to watch the whole curve every morning. Focus on <span className="font-semibold text-zinc-200">three numbers</span>.
            </p>
            <div className="space-y-3 mb-5">
              {[
                {
                  bold: "US2Y",
                  body: "It reflects short-term Fed rate expectations. It moves hard on CPI, NFP and FOMC.",
                },
                {
                  bold: "US10Y",
                  body: "It's the global benchmark. It directly impacts XAU/USD, Nasdaq, BTC/USD and DXY.",
                  highlight: true,
                },
                {
                  bold: "US30Y",
                  body: "It reflects the very long-term expectations: future inflation, debt, long-term growth.",
                },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{item.bold}</p>
                  <p className="text-sm text-zinc-300">{item.body}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              <span className="font-semibold text-zinc-200">In practice</span>:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "US2Y = short-term Fed expectations",
                "US10Y = global macro sentiment",
                "US30Y = long-term view",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                The 2-year listens to the Fed. The 10-year listens to the economy.
              </p>
            </div>
          </section>

          {/* Bloc 4 — US10Y vs XAU/USD, Nasdaq and BTC/USD */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">US10Y vs XAU/USD, Nasdaq and BTC/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              The <span className="font-semibold text-zinc-200">US10Y</span> is one of the most important charts for trading several assets.
            </p>
            <div className="space-y-4 mb-5">
              {[
                {
                  bold: "US10Y vs XAU/USD",
                  intro: "Gold pays no yield. So when the US 10-year yield rises, gold becomes",
                  boldMid: "less attractive",
                  items: ["US10Y moves from 4.0% to 4.5%", "XAU/USD can lose $50 to $100", "especially if the DXY rises too"],
                },
                {
                  bold: "US10Y vs Nasdaq",
                  intro: "Tech stocks are",
                  boldMid: "very rate-sensitive",
                  body: "Why? Because their valuations depend heavily on future profits. When rates rise, those future profits are worth less today.",
                  items: ["US10Y +50 basis points", "Nasdaq can correct 2% to 3%"],
                },
                {
                  bold: "US10Y vs BTC/USD",
                  intro: "BTC/USD is often treated as a",
                  boldMid: "risk asset",
                  body: "When yields rise, the market sometimes prefers the safe yield over crypto risk.",
                  items: ["US10Y breaks 4.5%", "BTC/USD can lose its momentum", "especially if the Nasdaq falls at the same time"],
                },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-2">{item.bold}</p>
                  <p className="text-sm text-zinc-300 mb-2">
                    {item.intro} <span className="font-semibold text-zinc-200">{item.boldMid}</span>.
                  </p>
                  {item.body && (
                    <p className="text-sm text-zinc-300 mb-2">{item.body}</p>
                  )}
                  <p className="text-sm font-semibold text-zinc-400 mb-1">Example:</p>
                  <ul className="space-y-1">
                    {item.items.map((sub, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-zinc-300">
                        <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-1.5" />
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Composant visuel */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <US10YHubDiagram locale="en" />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded mb-4">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Gold, tech and Bitcoin often react to the same number. And that number is US10Y.
              </p>
            </div>
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Retail reality</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                Retail watches XAU/USD. The pro watches what drives XAU/USD before the candle takes off.
              </p>
            </div>
          </section>

          {/* Bloc 5 — The yield curve */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The yield curve</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The <span className="font-semibold text-zinc-200">yield curve</span> compares yields across maturities.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The most followed one: <span className="font-semibold text-zinc-200">US10Y - US2Y</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Three situations:
            </p>
            <div className="space-y-3 mb-5">
              {[
                {
                  bold: "Normal curve",
                  body: "US10Y > US2Y. Example: 10Y at 4.5%, 2Y at 4.0%.",
                  result: "The market sees a relatively healthy economy.",
                },
                {
                  bold: "Flat curve",
                  body: "US10Y ≈ US2Y.",
                  result: "The market is hesitant.",
                },
                {
                  bold: "Inverted curve",
                  body: "US10Y < US2Y. Example: 10Y at 4.0%, 2Y at 4.5%.",
                  result: "The market is pricing a slowdown or a future recession.",
                },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{item.bold}</p>
                  <p className="text-sm text-zinc-300">{item.body}</p>
                  <p className="text-sm text-zinc-400 italic mt-1">→ {item.result}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Since 1955, every lasting inversion of the curve has been followed by a recession in the United States within 6 to 24 months.</span>
              {" "}It&apos;s not perfect timing. But it&apos;s a <span className="font-semibold text-zinc-200">major macro signal</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                The 10Y shows you today&apos;s pressure. The curve shows you the cycle&apos;s risk.
              </p>
            </div>
          </section>

          {/* Bloc 6 — How to fit it into your routine */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">How to fit it into your routine</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Before the US open, add yields to your check.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Simple routine</span>:
            </p>
            <div className="space-y-2 mb-5">
              {[
                { step: "1.", bold: "Look at US10Y", suf: ": is it rising or falling?" },
                { step: "2.", bold: "Note the key level", suf: ": 4%, 4.5% and 5% are psychological thresholds." },
                { step: "3.", bold: "Compare with your asset", suf: ": if you want to go long XAU/USD but US10Y is rising hard, there's a conflict." },
                { step: "4.", bold: "Look at DXY", suf: ": US10Y rising + DXY rising = strong pressure on gold and risk assets." },
                { step: "5.", bold: "Check Nasdaq and BTC/USD", suf: ": if both weaken while US10Y rises, the market is reducing risk." },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.step} {item.bold}</span>{item.suf}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              <span className="font-semibold text-zinc-200">Mistakes to avoid</span>:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "confusing bond price and yield",
                "believing the correlation is automatic",
                "ignoring psychological thresholds",
                "forgetting real rates",
                "watching US10Y without watching US2Y",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              The <span className="font-semibold text-zinc-200">real rate</span> matters a lot for gold:
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-5">
              <p className="text-sm font-semibold text-zinc-200 text-center">
                real rate = nominal yield - inflation
              </p>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              If the yield rises but inflation rises too, the impact can be different.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                US10Y → DXY → XAU/USD, Nasdaq, BTC/USD. That&apos;s often the market&apos;s invisible chain.
              </p>
            </div>
          </section>

          {/* ── Séparateur révision ── */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Review</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <LessonKeyPoints
            points={[
              "US10Y is the global benchmark pros watch every day",
              "When yields rise, XAU/USD, Nasdaq and BTC/USD can come under pressure",
              "The US10Y - US2Y curve gives a key signal on the economic cycle",
              "Yields should be read with DXY, inflation and the macro context",
            ]}
          />

          <LessonExercice
            description="Add US yields to your pre-market routine."
            steps={[
              "Open US10Y and note its direction for the day.",
              "Note whether it's near a key threshold: 4%, 4.5% or 5%.",
              "Compare with XAU/USD: does gold confirm the move?",
              "Compare with Nasdaq and BTC/USD: are risk assets reacting?",
              "Look at US2Y and check whether the 10Y - 2Y curve is normal, flat or inverted.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            The goal: understand whether your trade{" "}
            <span className="font-semibold text-zinc-400">follows or fights the bond market</span>.
          </p>

          <LessonQuiz
            question="US10Y rises sharply, DXY rises too, and XAU/USD breaks a support. Which read is the most professional?"
            options={[
              "Gold is dropping for no reason, you have to buy the dip no matter what",
              "Yields and the dollar confirm macro pressure on XAU/USD",
              "US10Y only concerns bonds, not gold",
              "The Nasdaq should definitely rise when rates rise",
            ]}
            correctIndex={1}
            explanation="When US10Y rises, the risk-free yield becomes more attractive. If DXY rises at the same time, the pressure on XAU/USD is reinforced. Option A ignores the macro context (buying a dip without analyzing yields and the dollar = beginner read). Option C is false: US10Y directly influences gold, indices and crypto. Option D is generally inverted: higher rates often weigh on the Nasdaq because they reduce the valuation of tech companies' future profits."
            answerExplanations={[
              "Wrong. Gold is dropping for a precise reason: the risk-free yield is rising (US10Y) and the dollar is strengthening (DXY). Ignoring this context and buying the dip is a beginner read.",
              "Correct. A rising US10Y makes the risk-free rate more attractive. A rising DXY reinforces the pressure on XAU/USD. Both elements confirm the bearish macro pressure on gold.",
              "Wrong. US10Y directly influences gold, indices and crypto via real rates, the DXY and global risk sentiment.",
              "Wrong. Higher rates generally weigh on the Nasdaq because they reduce the valuation of tech companies' future profits. The relationship is inverse.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-avance", "lecon3"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">The next lesson (Risk-on / Risk-off) is now available.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/avance/lecon2"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 2. NFP
              </Link>
              <Link
                href="/formations/macro/avance/lecon4"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Lesson 4. Risk-on / Risk-off
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
