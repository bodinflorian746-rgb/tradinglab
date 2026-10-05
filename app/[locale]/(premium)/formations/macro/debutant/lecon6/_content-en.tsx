"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { MacroDangerWindowsDiagram } from "@/app/components/charts/MacroDangerWindowsDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "What is macro",                     href: "/formations/macro/debutant/lecon1", disabled: false },
  { id: "lecon2", title: "The 4 major central banks",         href: "/formations/macro/debutant/lecon2", disabled: false },
  { id: "lecon3", title: "The macro numbers to watch",        href: "/formations/macro/debutant/lecon3", disabled: false },
  { id: "lecon4", title: "Understanding inflation",           href: "/formations/macro/debutant/lecon4", disabled: false },
  { id: "lecon5", title: "The dollar's role in the world",    href: "/formations/macro/debutant/lecon5", disabled: false },
  { id: "lecon6", title: "Macro and risk management",         href: "/formations/macro/debutant/lecon6", disabled: false },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-debutant", "lecon6"));
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
          <span className="text-zinc-500">Lesson 6</span>
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
            Macro and risk management, adapt your risk to the context
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Your stop loss can be perfect. So can your analysis.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              But if a major news print drops in 5 minutes, your SL can blow through like it doesn&apos;t even exist.
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
              const isCurrent = lesson.id === "lecon6";
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
            <span className="ml-auto text-xs text-zinc-600">6 / 6 lessons</span>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="space-y-8">

          {/* Block 1 — Why macro changes your risk */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Why macro changes your risk</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              In normal conditions, your technical stop loss makes sense. If your analysis calls for a 30-pip SL, the market can respect that zone.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              But during a major news print:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "volatility explodes", rest: " (moves 2 to 5 times more violent than usual)" },
                { bold: "spreads can widen", rest: " sharply" },
                { bold: "price can blow through several levels", rest: " in a few seconds" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              The result: <span className="font-semibold text-zinc-200">your real risk becomes bigger than your planned risk</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                During a macro news print, your risk is no longer on paper. It&apos;s in the speed of the market.
              </p>
            </div>
          </section>

          {/* Block 2 — The 3 golden rules */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The 3 golden rules</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              In a macro window, you don&apos;t trade with the same rules as on a quiet day.
            </p>

            <div className="space-y-5 mb-5">
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-2">Rule 1. No open position into a 3-star news print</p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  If a major news print is coming, you check your positions. You close, you trim, or you consciously accept the risk. But you <span className="font-semibold text-zinc-200">never discover</span> the news after the fact.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-2">Rule 2. Size cut in half after the news</p>
                <p className="text-sm text-zinc-300 leading-relaxed mb-2">
                  If you trade after the reaction (the method covered in lesson 3):
                </p>
                <ul className="space-y-1.5 mb-2">
                  <li className="flex items-center gap-2.5 text-sm text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                    <span>normal size: 0.10 lot</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                    <span>post-news size: <span className="font-semibold text-zinc-200">0.05 lot</span></span>
                  </li>
                </ul>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  The goal isn&apos;t to win faster. The goal is to <span className="font-semibold text-zinc-200">survive the volatility</span>.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-2">Rule 3. Wider SL or no trade</p>
                <p className="text-sm text-zinc-300 leading-relaxed mb-2">
                  If the market is still moving too fast after the news:
                </p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                    <span>either you <span className="font-semibold text-zinc-200">widen your SL intelligently</span> (50 pips minimum instead of 20-30)</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                    <span>or you <span className="font-semibold text-zinc-200">wait 1 to 2 hours</span> for things to settle</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                When the market speeds up, your risk has to slow down.
              </p>
            </div>
          </section>

          {/* Block 3 — The danger windows */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The danger windows</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Certain hours need to become <span className="font-semibold text-zinc-200">automatic in your head</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              The most important ones (Paris time):
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "2:30pm", rest: " → major US numbers: NFP, CPI, Retail Sales" },
                { bold: "8:00pm", rest: " → Fed / FOMC decisions" },
                { bold: "2:15pm", rest: " → ECB decisions" },
                { bold: "1:00pm", rest: " → BOE decisions" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              The most dangerous zone:
            </p>
            <ul className="space-y-1.5 mb-4">
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span><span className="font-semibold text-zinc-200">30 minutes before</span> the release</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>up to <span className="font-semibold text-zinc-200">1 hour after</span></span>
              </li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              During this window, the market can turn <span className="font-semibold text-zinc-200">irrational</span>. No classic technical analysis holds.
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">Assets affected during these windows:</p>
              <ul className="space-y-1.5">
                {[
                  { bold: "Forex", rest: ": EUR/USD, GBP/USD (maximum volatility)" },
                  { bold: "Gold (XAU/USD)", rest: ": very reactive to US news (dollar / rates)" },
                  { bold: "US indices", rest: ": Nasdaq, S&P500 react immediately" },
                  { bold: "BTC/USD", rest: ": sensitive to macro news since 2022" },
                ].map((item) => (
                  <li key={item.bold} className="flex items-start gap-2 text-xs text-zinc-400">
                    <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-1.5" />
                    <span><span className="font-semibold text-zinc-300">{item.bold}</span>{item.rest}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-zinc-500 mt-2 italic">The 30 minutes before / 1h after rule applies to all of these assets.</p>
            </div>

            {/* Visual component */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <MacroDangerWindowsDiagram locale="en" />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                A good entry at the wrong moment is still a bad entry.
              </p>
            </div>
          </section>

          {/* Block 4 — Good management vs bad management */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Good management vs bad management</h2>

            <div className="space-y-4 mb-5">
              <div className="bg-zinc-800/30 rounded-xl px-4 py-4">
                <p className="text-sm font-semibold text-zinc-200 mb-3">Good management case:</p>
                <ul className="space-y-1.5">
                  {[
                    "2:30pm: NFP scheduled",
                    "2:00pm: you close or trim your positions",
                    "2:30pm: the number prints",
                    "EUR/USD moves 80 pips",
                    "3:30pm: the market settles",
                    "you spot a clean retracement",
                    "you enter with size cut in half",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-zinc-300 leading-relaxed mt-3">
                  You didn&apos;t avoid the market. <span className="font-semibold text-zinc-200">You avoided the chaos.</span>
                </p>
              </div>

              <div className="bg-zinc-800/30 rounded-xl px-4 py-4">
                <p className="text-sm font-semibold text-zinc-200 mb-3">Bad management case:</p>
                <p className="text-sm text-zinc-300 leading-relaxed mb-2">
                  You go long EUR/USD at 2:00pm without checking the calendar. At 2:30pm, NFP prints very positive. EUR/USD drops 80 pips in 30 seconds. Your 30-pip SL gets blown.
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  <span className="font-semibold text-zinc-200">Technically, your analysis could have been correct.</span> But your timing was bad. And the market doesn&apos;t forgive bad timing in macro.
                </p>
              </div>
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Macro doesn&apos;t reward boldness. It rewards patience.
              </p>
            </div>
          </section>

          {/* Block 5 — The retail reality */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The retail reality</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              With a €500 account, one bad macro trade can hurt <span className="font-semibold text-zinc-200">a lot</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Concrete calculation:
            </p>
            <ul className="space-y-1.5 mb-4">
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>EUR/USD drops 80 pips</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>Position: 0.10 lot</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>Loss: <span className="font-semibold text-zinc-200">around €80</span></span>
              </li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">€80 on €500 = 16% of the account in 30 seconds.</span>
            </p>
            <div className="bg-zinc-900/60 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">And it&apos;s not just a risk on EUR/USD. With a €500 account and a position sized by risk management rules (2% per trade), a bad macro news print can wipe the same percentage off the account on every asset:</p>
              <div className="space-y-1.5">
                {[
                  { asset: "EUR/USD", detail: "-80 pips → -€80", pct: "16% of the account" },
                  { asset: "XAU/USD", detail: "-$30 → -€90", pct: "18% of the account" },
                  { asset: "Nasdaq", detail: "-1.5% → -€75", pct: "15% of the account" },
                  { asset: "BTC/USD", detail: "-$800 → -€120", pct: "24% of the account" },
                ].map((item) => (
                  <div key={item.asset} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-300 w-20">{item.asset}</span>
                    <span className="text-zinc-400">{item.detail}</span>
                    <span className="font-semibold text-red-400">{item.pct}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-2 italic">Note: these equivalences are calculated at a similar risk size (not at the same number of lots). The point is to show that whatever asset you trade, bad risk management on macro news can wipe 15-25% off the account in a few minutes.</p>
            </div>

            {/* Callout 💰 The retail reality */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">The retail reality</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                In 30 seconds, you can lose more than <span className="font-semibold text-zinc-200">several weeks of discipline</span>. Macro doesn&apos;t destroy accounts because it&apos;s complicated. <span className="font-semibold text-zinc-200">It destroys them because it gets ignored.</span>
              </p>
            </div>
          </section>

          {/* Block 6 — How to adapt your risk management */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">How to adapt your risk management</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              You already learned to adapt your risk to your capital (see the Trading lesson &apos;Risk management&apos;):
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "small account (€300)", rest: " → 3% ideal, max 5%" },
                { bold: "mid-size account (€500-1000)", rest: " → 2-3% ideal" },
                { bold: "more solid account (€2000+)", rest: " → 2% strict" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">Macro adds an extra layer.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Here&apos;s the decision grid based on the macro context:
            </p>

            {/* Decision grid */}
            <div className="overflow-hidden rounded-xl border border-zinc-800 mb-5">
              <div className="grid grid-cols-2">
                <div className="px-4 py-2.5 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Context</div>
                <div className="px-4 py-2.5 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-l border-zinc-800">Action</div>
              </div>
              <div className="divide-y divide-zinc-800/60">
                {[
                  { ctx: "Quiet macro", action: "Standard rules (% based on your capital)" },
                  { ctx: "3-star news in <2h", action: "Close / trim / wait" },
                  { ctx: "Macro against your setup", action: "Cut size in half or skip" },
                  { ctx: "Macro confirms your setup", action: "Standard setup with stronger confluence" },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-2">
                    <div className="px-4 py-3 text-sm font-semibold text-zinc-200">{row.ctx}</div>
                    <div className="px-4 py-3 text-sm text-zinc-400 border-l border-zinc-800/60">{row.action}</div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              If macro goes against your setup → <span className="font-semibold text-zinc-200">you cut size or you skip</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              If macro confirms your setup → you can look for a clean entry, <span className="font-semibold text-zinc-200">but without increasing your size for it</span>.
            </p>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                A good trader doesn&apos;t risk the same in the calm and in the storm.
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
              "A macro news print can multiply your real risk by 2 to 5 times",
              "The danger windows: 30 min before until 1h after 3-star news",
              "On 3-star news: close, trim or wait (never ignore)",
              "The decision grid: favorable macro + clean technicals = best context",
            ]}
          />

          <LessonExercice
            description="Before your next session, build your macro risk plan."
            steps={[
              "Open today's economic calendar (Investing.com or Forex Factory).",
              "Spot every 3-star event during your trading session.",
              "Note the danger hours in your plan (30 min before + 1h after each news).",
              "Decide in advance for each news: do you close, trim, or wait?",
              "After each news, watch whether the market becomes tradable or stays chaotic.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            The goal: <span className="font-semibold text-zinc-400">never discover a news print after you&apos;ve already taken a position</span>.
          </p>

          <LessonQuiz
            question="You want to go long EUR/USD at 2:10pm. The calendar shows an NFP at 2:30pm. Your technical setup is clean. What do you do?"
            options={[
              "You enter normally, your setup is clean, macro is for the news channels",
              "You enter with more size to ride the expected move",
              "You wait for the NFP release, watch the reaction, and re-evaluate the setup afterward",
              "You pull your stop loss to avoid getting taken out by the volatility",
            ]}
            correctIndex={2}
            explanation="An NFP can create a violent, unpredictable move (200-500 pips of total move possible). Even if your setup is technically clean, the real risk is too high right before the release. Option A completely ignores the macro context and leaves you exposed to the volatility. Option B is even worse, you increase your risk in the most dangerous window. Option D is catastrophic: pulling your SL turns a limited loss into a potentially huge one. The only pro answer: wait, watch, re-evaluate. This principle holds on every macro-sensitive asset: EUR/USD, XAU/USD, Nasdaq, BTC/USD."
            answerExplanations={[
              "Wrong. Ignoring a 3-star news print 20 minutes out means taking the volatility head-on. An NFP can create a 200-500 pip move, your technical setup doesn't hold against that reality.",
              "Wrong. Increasing size in the maximum danger window is a serious mistake. You maximize your risk at the worst possible moment.",
              "Correct. An NFP can create a violent, unpredictable move. Waiting, watching the reaction, then re-evaluating the setup is the only professional approach.",
              "Wrong. Pulling your SL is catastrophic: it turns a limited loss into a potentially huge one if the market goes the wrong way.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-debutant", "lecon6"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">You&apos;ve finished the Beginner Macro module. Well done!</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/debutant/lecon5"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 5: The dollar's role in the world
              </Link>
              <span className="text-sm text-emerald-400 italic cursor-default">
                Beginner Macro module complete ✓
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
