"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { MacroCalendarDiagram } from "@/app/components/charts/MacroCalendarDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "What is macro",                     href: "/formations/macro/debutant/lecon1", disabled: false },
  { id: "lecon2", title: "The 4 major central banks",         href: null,                                disabled: true  },
  { id: "lecon3", title: "The macro data to watch",           href: null,                                disabled: true  },
  { id: "lecon4", title: "Understanding inflation",           href: null,                                disabled: true  },
  { id: "lecon5", title: "The role of the dollar worldwide",  href: null,                                disabled: true  },
  { id: "lecon6", title: "Macro and risk management",         href: null,                                disabled: true  },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-debutant", "lecon1"));
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
          <span className="text-zinc-500">Lesson 1</span>
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
            What is macro and why it matters in trading
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              A macro event can wipe out 2% of your capital in 2 minutes.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              On EUR/USD, on gold, on the Nasdaq, on Bitcoin, no matter what you trade, macro lands on you.
            </p>
          </div>

          {/* Indicateur de structure */}
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

          {/* Pills des leçons */}
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            {LESSONS.map((lesson) => {
              const isCurrent = lesson.id === "lecon1";
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
            <span className="ml-auto text-xs text-zinc-600">1 / 6 lessons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — La macro, c'est quoi exactement ? */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">What exactly is macro?</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Macro</span> (short for macroeconomics) is the study of the <span className="font-semibold text-zinc-200">big forces</span> that move the global economy: interest rates, inflation, employment, growth, central bank decisions.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              In trading, these forces have a direct impact on <span className="font-semibold text-zinc-200">every market</span>: forex, indices, crypto, commodities, bonds.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              A simple analogy: <span className="font-semibold text-zinc-200">technicals tell you WHERE to enter. Macro tells you WHY the market is moving.</span>
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded mb-4">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                If you ignore macro, you take what the market gives you. If you understand it, you see it coming.
              </p>
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Key point:</span> You can ignore macro and trade purely on technicals. But you&apos;ll get swept away regularly by moves you don&apos;t understand. Understanding macro means you stop getting caught off guard.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Pourquoi un trader doit s'y intéresser */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Why a trader has to care about it</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Picture this scenario.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              You spot a perfect setup on EUR/USD at 2:25pm. Every candle is aligned, your trade plan is rock solid, you go long. At 2:30pm, EUR/USD drops 80 pips in 2 minutes. Your stop gets hit. You have no idea what happened.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              And it&apos;s not just on EUR/USD. On the same macro news, you&apos;d probably have seen:
            </p>
            <ul className="space-y-1.5 mb-3">
              {[
                { asset: "XAU/USD", move: "-$25 to -$40 in 2 minutes" },
                { asset: "Nasdaq", move: "-1 to -1.5% in the first few minutes" },
                { asset: "BTC/USD", move: "-$300 to -$800 depending on volatility at the time" },
              ].map((item) => (
                <li key={item.asset} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.asset}</span>: {item.move}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Macro doesn&apos;t hit just one pair. It hits the whole market at once.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">What happened</span>: at 2:30pm (Paris time), the monthly US inflation figures were released. Higher than expected. The market priced in that the Fed would turn more hawkish. The dollar ripped higher. Your EUR/USD long, betting on a weak dollar, got swept away.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Technicals alone couldn&apos;t warn you.</span> Only macro (the economic calendar + understanding the data) could have made you <span className="font-semibold text-zinc-200">avoid</span> that trade.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded mb-4">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                The market doesn&apos;t reward the best chart. It rewards the one who knows why it&apos;s moving.
              </p>
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Key point:</span> Macro doesn&apos;t replace technicals. It <span className="font-semibold text-zinc-300">completes</span> them. It tells you when NOT to trade, and when a move is likely to keep going.
              </p>
            </div>
          </section>

          {/* Bloc 3 — Les 4 forces macro */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The 4 macro forces that move the markets</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              You don&apos;t need to become an economist. But 4 forces move 90% of the markets.
            </p>
            <div className="space-y-3 mb-6">
              {[
                {
                  n: "1",
                  label: "Interest rates",
                  text: "set by the central banks. Rates going up → currency strengthens. Rates going down → currency weakens.",
                },
                {
                  n: "2",
                  label: "Inflation",
                  text: "the rise in prices. High inflation → the central bank is forced to raise rates to rein it in.",
                },
                {
                  n: "3",
                  label: "Employment",
                  text: "a number like the NFP (released every first Friday of the month) can violently move every asset at the same time.",
                },
                {
                  n: "4",
                  label: "Economic growth",
                  text: "measured by GDP. Strong economy → currency that attracts foreign investors.",
                },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.label}</span> — {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-300 leading-relaxed mb-2">
                An NFP that surprises can move:
              </p>
              <ul className="space-y-1.5">
                {[
                  { asset: "EUR/USD", move: "by 100 to 200 pips" },
                  { asset: "XAU/USD", move: "by $30 to $60" },
                  { asset: "Nasdaq", move: "by 1 to 2%" },
                  { asset: "BTC/USD", move: "by $500 to $1,500" },
                ].map((item) => (
                  <li key={item.asset} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                    <span><span className="font-semibold text-zinc-200">{item.asset}</span> {item.move}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-zinc-400 mt-2 italic">All of that in a few minutes.</p>
            </div>

            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">A concrete example of the chain reaction</p>
            <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl px-4 py-4 mb-3">
              <div className="space-y-1.5">
                {[
                  "US inflation climbs to 4% (instead of the 3% expected).",
                  "→ The Fed announces it will raise rates faster.",
                  "→ The dollar climbs against every currency.",
                  "→ EUR/USD loses 150 pips in a single day.",
                ].map((item, i) => (
                  <p key={i} className={`text-sm leading-relaxed ${item.startsWith("→") ? "text-emerald-400 font-medium" : "text-zinc-300"}`}>
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <p className="text-sm text-zinc-400 italic leading-relaxed mb-4">
              <span className="font-semibold text-zinc-300">One macro cause, one chain reaction, one violent move.</span>
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Key point:</span> These 4 forces are connected. Inflation drives rates. Rates move currencies. Currencies move the markets. <span className="font-semibold text-zinc-300">Following the chain = anticipating the move.</span>
              </p>
            </div>
          </section>

          {/* Bloc 4 — Qui décide quoi ? */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Who decides what?</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">The main players</span> you&apos;ll run into in macro:
            </p>
            <ul className="space-y-3 mb-5">
              {[
                {
                  label: "Central banks",
                  text: "(Fed for the US, ECB for Europe, BOE for the UK, BOJ for Japan). They set interest rates and steer monetary policy.",
                },
                {
                  label: "Governments",
                  text: "they make fiscal policy decisions (taxes, public spending, debt).",
                },
                {
                  label: "Statistics agencies",
                  text: "they publish the official inflation, employment and GDP figures. Their releases are what trigger the brutal moves in the markets.",
                },
                {
                  label: "Institutional investors",
                  text: "banks, investment funds, asset managers. They make up the majority of market volume. When they buy or sell en masse on a macro headline, price moves violently.",
                },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.label}</span> {item.text}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded mb-4">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Retail doesn&apos;t make the market. Retail takes it or follows it.
              </p>
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Key point:</span> Retail (individual traders like you) makes up a tiny fraction of the volume. <span className="font-semibold text-zinc-300">The market moves on central bank decisions and institutional flows.</span> Understanding macro = understanding what they&apos;re watching.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Le calendrier économique */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The economic calendar: your #1 tool</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              The <span className="font-semibold text-zinc-200">economic calendar</span> is a free tool that lists all the upcoming macro releases, ranked by importance.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              On sites like <span className="font-semibold text-zinc-200">Investing.com</span> or <span className="font-semibold text-zinc-200">Forex Factory</span>, each event is tagged with an impact icon:
            </p>
            <ul className="space-y-2 mb-5">
              {[
                { label: "Low impact", desc: "(1 star / green): little movement expected", color: "bg-emerald-400/60" },
                { label: "Medium impact", desc: "(2 stars / yellow or orange): moderate move possible", color: "bg-amber-400/60" },
                { label: "High impact", desc: "(3 stars / red): violent move almost guaranteed", color: "bg-red-500/60" },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.color} shrink-0 mt-1.5`} />
                  <span><span className="font-semibold text-zinc-200">{item.label}</span> {item.desc}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">The 3-star events you absolutely need to know</p>
            <ul className="space-y-1.5 mb-5">
              {[
                "Fed rate decisions (FOMC)",
                "ECB rate decisions",
                "NFP (Non-Farm Payrolls US)",
                "CPI (US inflation)",
                "Speeches from Jerome Powell or Christine Lagarde",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/60 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <MacroCalendarDiagram locale="en" />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded mb-4">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                The economic calendar is the difference between trading and gambling.
              </p>
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Key point:</span> Before every trading day, check the economic calendar. 3-star events can turn a perfect setup into a deadly trap. Better to <span className="font-semibold text-zinc-300">stay out</span> in the 30 minutes before and after a major release.
              </p>
            </div>
          </section>

          {/* Bloc 6 — Comment commencer concrètement */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">How to get started, concretely</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              You don&apos;t need to know everything. Here&apos;s the <span className="font-semibold text-zinc-200">simple routine</span> of a trader who builds macro into their workflow.
            </p>

            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Every morning (5 minutes)</p>
            <div className="space-y-2 mb-5">
              {[
                "Open Investing.com or Forex Factory.",
                "Look at the day&apos;s calendar.",
                "Spot the 3-star events → mark the times.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{i + 1}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">During your trading session</p>
            <ul className="space-y-2 mb-5">
              {[
                "Avoid entering a position in the 30 minutes before a 3-star event.",
                "If you already have an open position, check your stop loss before the release.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Once a month (15 minutes)</p>
            <ul className="space-y-2 mb-5">
              {[
                "Read a recap of the Fed and ECB decisions (Reuters, Bloomberg, or a site like Bloomberg).",
                "Note where the main interest rates are heading.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Key point:</span> <span className="font-semibold text-zinc-300">That&apos;s it.</span> With these 2 habits, you&apos;re already ahead of 80% of individual traders who trade in the dark.
              </p>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                5 minutes a day to stop getting swept away. The best time-to-result ratio of your entire trading career.
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
              "Macro is the study of the big economic forces (rates, inflation, employment, growth) that move the markets.",
              "Technicals tell you WHERE to enter, macro tells you WHY the market is moving, the two work together.",
              "The 4 key forces: interest rates, inflation, employment, economic growth.",
              "The economic calendar is your #1 tool, avoid trading in the 30 min before/after a 3-star event.",
            ]}
          />

          <LessonExercice
            description="This week, build macro into your trading routine."
            steps={[
              "Go to Investing.com or Forex Factory and find the economic calendar.",
              "Filter for 3-star events only, for this week.",
              "Write down (in a notebook or a note on your phone) the date and time of each event.",
              "Spot at least 2 events that involve a currency you trade (USD, EUR, GBP, JPY).",
              "During the week, watch the chart of the relevant pair 15 minutes before the release, at the moment of the release, and 30 minutes after.",
              "Note what you observe: size of the move (in pips), direction, duration.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            The goal: getting used to linking the <span className="font-semibold text-zinc-400">brutal market moves</span> to their <span className="font-semibold text-zinc-400">macro causes</span>. After 2-3 weeks, you&apos;ll start to see them coming.
          </p>

          <LessonQuiz
            question="You spot a perfect setup on EUR/USD at 2:25pm. You check the calendar: there&apos;s a US CPI release at 2:30pm (3-star impact). What do you do?"
            options={[
              "I enter anyway, my technical analysis is solid",
              "I wait 30 minutes after the release to see how the market reacts, then I re-evaluate my setup",
              "I short EUR/USD because CPI always pushes the euro down",
              "I switch to H4 to ignore the news noise",
            ]}
            correctIndex={1}
            explanation="A 3-star release can move EUR/USD by 80-150 pips in a few minutes, in an unpredictable direction. Entering right before (option A) is the same as flipping a coin. Option C is false: CPI can push the euro up or down depending on whether the data surprises to the upside or downside. Option D is just running away, switching timeframe doesn't protect you from the violent move. The right approach: wait for the news to pass, watch how the market reacts, and trade afterwards with the new information. This principle applies to every asset: forex, gold, indices, crypto."
            answerExplanations={[
              "Wrong. Entering right before a 3-star release is the same as flipping a coin. EUR/USD can move 80-150 pips in a few minutes in an unpredictable direction. Your technical analysis no longer matters, macro crushes everything.",
              "Correct. The right approach: wait for the news to pass, watch how the market reacts, and trade afterwards with the new information. You keep your setup AND you know which direction the market decided to go.",
              "Wrong. CPI can push the euro up or down depending on whether the data surprises to the upside or downside. There's no systematic direction, what matters is the gap versus expectations.",
              "Wrong. Switching timeframe doesn't protect you from the violent move. An 80-150 pip move on M5 is an 80-150 pip move on H4 too. The timeframe doesn't change the actual size.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-debutant", "lecon1"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">The next lesson (The 4 major central banks) will be available soon.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/debutant"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to module
              </Link>
              <Link
                href="/formations/macro/debutant/lecon2"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Lesson 2. The 4 major central banks
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
