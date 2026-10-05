"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { CalendarReadingComparisonDiagram } from "@/app/components/charts/CalendarReadingComparisonDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Hawkish vs Dovish",                          href: "/formations/macro/intermediaire/lecon1", disabled: false },
  { id: "lecon2", title: "Understanding the economic calendar",         href: "/formations/macro/intermediaire/lecon2", disabled: false },
  { id: "lecon3", title: "CPI, PPI and inflation",                      href: null,                                     disabled: true  },
  { id: "lecon4", title: "The carry trade",                             href: null,                                     disabled: true  },
  { id: "lecon5", title: "Macro correlations",                          href: null,                                     disabled: true  },
  { id: "lecon6", title: "Building your weekly bias",                   href: null,                                     disabled: true  },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-intermediaire", "lecon2"));
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
          <span className="text-zinc-500">Lesson 2</span>
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
            Understanding the economic calendar, how to read the market ahead of time
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Friday 2:30pm. NFP prints 205k vs 200k expected. No move.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Three minutes later, EUR/USD drops 60 pips. You didn&apos;t see it coming. The market, though, saw the revision.
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
              const isCurrent = lesson.id === "lecon2";
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
            <span className="ml-auto text-xs text-zinc-600">2 / 6 lessons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — Ce que tu rates en lecture débutant */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">What you miss with a beginner read</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Reading an economic calendar isn&apos;t just spotting the 3-star news. <span className="font-semibold text-zinc-200">That&apos;s the bare minimum.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              An intermediate trader looks at the context:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "the consensus",
                "the previous figure",
                "the actual figure",
                "the revisions",
                "the full macro week",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span className="font-semibold text-zinc-200">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Simple analogy</span>: the economic calendar is a <span className="font-semibold text-zinc-200">GPS</span>. The beginner only looks at the destination. The prepared trader also looks at the turns, the traffic jams and the dangerous zones.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                The calendar doesn&apos;t give you an alert. It gives you a map of the risk.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Les 4 colonnes à lire à chaque news */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The 4 columns to read on every news</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Every important release should be read with <span className="font-semibold text-zinc-200">4 data points</span>.
            </p>

            <div className="space-y-2 mb-4">
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Consensus</span> → what the market expects.
              </p>
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Previous</span> → the figure released last month.
              </p>
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Actual</span> → the figure that prints at the moment of the announcement.
              </p>
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Revisions</span> → <span className="font-semibold text-zinc-200">the forgotten trap.</span> The previous month&apos;s figure can be corrected up or down.
              </p>
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Concrete example</span>:
            </p>
            <ul className="space-y-1.5 mb-4">
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>NFP expected: <span className="font-semibold text-zinc-200">200k</span></span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>NFP actual: <span className="font-semibold text-zinc-200">205k</span></span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>Beginner read: &apos;nothing special&apos;</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span><span className="font-semibold text-zinc-200">But the previous month is revised from 250k to 170k</span></span>
              </li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Result: the market can react hard, <span className="font-semibold text-zinc-200">even if the figure of the day looks neutral</span>. That&apos;s exactly what happened in the hero of this lesson.
            </p>

            <div className="bg-zinc-900/60 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">On this NFP revision (250k → 170k), all of these assets moved simultaneously:</p>
              <div className="space-y-1.5">
                {[
                  { asset: "EUR/USD", detail: "-60 pips", note: "dollar repriced higher" },
                  { asset: "XAU/USD", detail: "-$20 to -$25", note: "gold penalized by the strong dollar" },
                  { asset: "Nasdaq", detail: "-0.8 to -1%", note: "solid labor market = higher rates kept in place" },
                  { asset: "BTC/USD", detail: "-$300 to -$500", note: "risk-off on speculative assets" },
                ].map((item) => (
                  <div key={item.asset} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-300 w-20">{item.asset}</span>
                    <span className="text-red-400 font-semibold w-20">{item.detail}</span>
                    <span className="text-zinc-500 italic">{item.note}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-2 italic">A single NFP revision. Four markets hit at the same time.</p>
            </div>

            {/* Composant visuel */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <CalendarReadingComparisonDiagram locale="en" />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                The figure of the day doesn&apos;t tell the whole story.
              </p>
            </div>
          </section>

          {/* Bloc 3 — Paramétrer ton calendrier comme un trader */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Set up your calendar like a trader</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              You need to stop looking at the whole calendar in bulk.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Simple, professional setup</span>:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "Filter the currencies", rest: " you trade" },
                { bold: "Always keep USD enabled", rest: "" },
                { bold: "Show the week view", rest: " (not just the day)" },
                { bold: "Keep the 3-star events", rest: " by default" },
                { bold: "Watch certain 2-star events", rest: " in a strong context" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Why does USD always stay important?</span> Because even if you trade EUR/USD, XAU/USD, BTC/USD or NASDAQ, the dollar drives everything (see Beginner Macro lesson 5).
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              The <span className="font-semibold text-zinc-200">week view</span> is essential. It lets you see the risk zones <span className="font-semibold text-zinc-200">before they arrive</span>, not during.
            </p>

            {/* Encadré 💰 Réalité du retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Retail reality</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                The amateur trader discovers the news at 2:30pm. The prepared trader sees it coming <span className="font-semibold text-zinc-200">since Sunday night</span>. The difference? 5 minutes of prep per week.
              </p>
            </div>
          </section>

          {/* Bloc 4 — Les clusters de news */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">News clusters</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Some weeks are dangerous because <span className="font-semibold text-zinc-200">several big announcements land almost together</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Typical cluster example</span>:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "Wednesday", rest: ": FOMC" },
                { bold: "Thursday", rest: ": CPI" },
                { bold: "Friday", rest: ": NFP" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              In this kind of week, the market can turn <span className="font-semibold text-zinc-200">nervous even before the announcements</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Why?</span> Because institutions reduce their exposure, adjust their positions, and wait for the figures. You often see <span className="font-semibold text-zinc-200">pre-news moves</span> as early as Tuesday morning in these weeks.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Conversely, a <span className="font-semibold text-zinc-200">quiet macro week</span> leaves more room for pure technical analysis, it&apos;s the right time to apply your usual setups with no external surprises.
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">In an FOMC + CPI + NFP week, all of these assets are impacted:</p>
              <ul className="space-y-1.5">
                {[
                  { bold: "EUR/USD, GBP/USD", rest: ": maximum volatility over the 3 days" },
                  { bold: "XAU/USD", rest: ": very nervous (sensitive to rates and the dollar)" },
                  { bold: "Nasdaq, S&P500", rest: ": possible gaps at the NY open" },
                  { bold: "BTC/USD", rest: ": amplification of the general risk-off or risk-on" },
                ].map((item) => (
                  <li key={item.bold} className="flex items-start gap-2 text-xs text-zinc-400">
                    <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-1.5" />
                    <span><span className="font-semibold text-zinc-300">{item.bold}</span>{item.rest}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-zinc-500 mt-2 italic">A cluster doesn&apos;t hit just one currency. It hits the whole market at the same time.</p>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                A single news moves the market. A cluster changes the whole week.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Les chiffres secondaires qui peuvent surprendre */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The secondary figures that can surprise you</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A 2-star figure is <span className="font-semibold text-zinc-200">not always weak</span>. It becomes important when it prints <span className="font-semibold text-zinc-200">very far from the consensus</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Example</span>:
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-300">ISM Manufacturing expected: <span className="font-semibold text-zinc-200">50</span></p>
              <p className="text-sm text-zinc-300 mt-1">Result: <span className="font-semibold text-zinc-200">45</span></p>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Pro interpretation:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "Below 50 =", rest: " economic contraction" },
                { bold: "Strong gap", rest: " versus expectations" },
                { bold: "Signal of economic", rest: " slowdown" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Possible result:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                "Indices under pressure (Nasdaq, S&P500)",
                "Volatile dollar",
                "Market repricing the recession risk",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              The level of impact depends on the <span className="font-semibold text-zinc-200">overall context</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              An average figure in a quiet week may make little noise. The <span className="font-semibold text-zinc-200">same figure in a tense week</span> (news cluster, fragile macro context) can trigger a real move.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                A figure has no absolute importance. It has contextual importance.
              </p>
            </div>
          </section>

          {/* Bloc 6 — Construire ta feuille de route hebdomadaire */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Building your weekly roadmap</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Every <span className="font-semibold text-zinc-200">Sunday night</span> or <span className="font-semibold text-zinc-200">Monday morning</span>, you prepare your macro week.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Simple method</span>:
            </p>
            <div className="space-y-2 mb-5">
              {[
                { n: "1", text: "List the 3 to 5 big announcements of the week" },
                { n: "2", text: "Note the exact days and times" },
                { n: "3", text: "Identify the currencies involved" },
                { n: "4", bold: "Rank the days:", rest: " aggressive, neutral, defensive" },
                { n: "5", text: "Adjust your setups accordingly" },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {"bold" in item ? (
                      <><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</>
                    ) : item.text}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Concrete example</span>:
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              If Thursday has US CPI and Friday NFP:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                { bold: "Monday/Tuesday", rest: ": more normal trading (the week starts quiet)" },
                { bold: "Wednesday", rest: ": caution before the figures (market anticipation)" },
                { bold: "Thursday/Friday", rest: ": reduced size or wait for post-news" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                You don&apos;t predict the market. You organize your risk for the week.
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
              "An economic calendar is read with 4 parameters: consensus, previous, actual and revisions",
              "Revisions can completely change the interpretation of a news",
              "News clusters make the whole week more volatile (not just the day itself)",
              "Your macro roadmap must be prepared before you trade, not during",
            ]}
          />

          <LessonExercice
            description="Prepare your next week like a pro macro trader."
            steps={[
              "Open your economic calendar in week view (Investing.com or Forex Factory).",
              "Keep only USD + the currencies you trade.",
              "List the 3 to 5 most important events of the week.",
              "Note consensus, previous and exact time for each event.",
              "Rank each day: aggressive, neutral or defensive.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            The goal: <span className="font-semibold text-zinc-400">stop being caught off guard by the news. See it coming</span>.
          </p>

          <LessonQuiz
            question="An NFP prints at 205k while the consensus was 200k. The move looks weak at first, but the dollar rallies hard afterwards. Which explanation is the most likely?"
            options={[
              "The market is random, these moves can't be explained",
              "The actual figure is far above the consensus",
              "The previous figure may have been revised sharply lower",
              "Macro news is useless on forex",
            ]}
            correctIndex={2}
            explanation="An actual figure close to the consensus isn't always enough to explain a big move. Revisions can change the whole read of the employment trend (for example, a previous figure revised from 250k to 170k changes the perception of the US labor market). Option A ignores macro logic, moves almost always have an identifiable cause. Option B is false here: 205k vs 200k isn't a big gap. Option D contradicts the entire Macro module. It's exactly the scenario from the hero of this lesson. This revisions logic applies to every dollar-linked asset: EUR/USD, XAU/USD, Nasdaq and BTC/USD all react to the same repricing."
            answerExplanations={[
              "Wrong. The market follows a precise logic based on expectations and revisions. The reaction isn't random, it almost always has an identifiable cause.",
              "Wrong. 205k vs 200k is a minimal gap, not enough to cause a big move. It's not the figure of the day that explains the reaction.",
              "Correct. Revisions can change the whole macro read. A previous figure revised from 250k to 170k changes the perception of the US labor market, and the market reacts to this new reality.",
              "Wrong. Macro news is one of the main causes of big moves on forex. This entire module proves it.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-intermediaire", "lecon2"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">The next lesson (CPI, PPI and inflation) will be available soon.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/intermediaire/lecon1"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 1. Hawkish vs Dovish
              </Link>
              <Link
                href="/formations/macro/intermediaire/lecon3"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Lesson 3. CPI, PPI and inflation
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
