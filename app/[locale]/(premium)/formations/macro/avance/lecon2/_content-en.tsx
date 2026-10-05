"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { NFPReportAnatomyDiagram } from "@/app/components/charts/NFPReportAnatomyDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "FOMC",                href: "/formations/macro/avance/lecon1", disabled: false },
  { id: "lecon2", title: "NFP",                 href: "/formations/macro/avance/lecon2", disabled: false },
  { id: "lecon3", title: "US bond yields",      href: "/formations/macro/avance/lecon3", disabled: false },
  { id: "lecon4", title: "Risk-on / Risk-off",  href: "/formations/macro/avance/lecon4", disabled: false },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-avance", "lecon2"));
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
          <span className="text-zinc-500">Lesson 2</span>
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
            NFP, the monthly release that shakes every asset
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              The NFP isn&apos;t just &apos;a jobs number&apos;.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              It&apos;s a full report that can shift rate expectations, the DXY, gold, the Nasdaq and Bitcoin in 30 seconds.
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
            <span className="ml-auto text-xs text-zinc-600">2 / 4 lessons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — Pourquoi le NFP est si violent */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Why the NFP is so violent</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The <span className="font-semibold text-zinc-200">NFP</span> is released on the <span className="font-semibold text-zinc-200">first Friday of the month at 2:30pm Paris time</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              It measures job creation in the United States, excluding the agricultural sector.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Why does it matter so much?
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Because the Fed watches <span className="font-semibold text-zinc-200">two pillars</span>:
            </p>
            <ul className="space-y-1.5 mb-4">
              {["inflation", "employment"].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              If employment stays too strong, the Fed can stay restrictive.
              If employment slows down too fast, the market prices in a more dovish Fed.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              So the NFP directly hits <span className="font-semibold text-zinc-200">rate expectations</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Typical ranges on a big miss</span>:
            </p>
            <div className="overflow-hidden rounded-xl border border-zinc-800 mb-5">
              <div className="grid grid-cols-2 border-b border-zinc-800">
                <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Asset</div>
                <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-l border-zinc-800">Possible move in 30 seconds</div>
              </div>
              <div className="divide-y divide-zinc-800/60">
                {[
                  { asset: "EUR/USD", move: "50 to 200 points" },
                  { asset: "XAU/USD", move: "20 to 80 points" },
                  { asset: "Nasdaq",  move: "30 to 200 points" },
                  { asset: "BTC/USD", move: "300 to 1500 points" },
                ].map((row) => (
                  <div key={row.asset} className="grid grid-cols-2">
                    <div className="px-4 py-2.5 text-sm font-semibold text-zinc-200">{row.asset}</div>
                    <div className="px-4 py-2.5 text-sm text-zinc-400 border-l border-zinc-800/60">{row.move}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Composant visuel */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <NFPReportAnatomyDiagram locale="en" />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                The NFP doesn&apos;t move one market. It shakes the entire risk chain.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Les 4 données du rapport NFP */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The 4 data points in the NFP report</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Retail only looks at the headline number.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The pro reads the <span className="font-semibold text-zinc-200">full report</span>.
            </p>
            <div className="space-y-3 mb-5">
              {[
                {
                  bold: "1. Non-Farm Payrolls (NFP)",
                  body: "This is the headline number: job creation outside the agricultural sector.",
                },
                {
                  bold: "2. Unemployment Rate",
                  body: "The unemployment rate. Sometimes more important than the headline if the market is looking for a slowdown signal.",
                },
                {
                  bold: "3. Average Hourly Earnings (AHE)",
                  body: "Average hourly wages.",
                  extra: "Crucial, because wages that are too high can fuel future inflation.",
                },
                {
                  bold: "4. Participation Rate",
                  body: "The participation rate. It shows how many people are actually taking part in the labor market.",
                },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{item.bold}</p>
                  <p className="text-sm text-zinc-300">
                    {item.body}
                    {item.extra && <span> <span className="font-semibold text-zinc-200">{item.extra}</span></span>}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              <span className="font-semibold text-zinc-200">Example 1</span>:
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Strong NFP, but unemployment rising. → Positive headline, but a more fragile labor market quality.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              <span className="font-semibold text-zinc-200">Example 2</span>:
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Neutral NFP, but wages too strong. → The market can turn hawkish because the Fed sees an inflation risk.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                The headline grabs your eyes. The sub-data give you the truth.
              </p>
            </div>
          </section>

          {/* Bloc 3 — Les révisions : le piège silencieux */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Revisions: the silent trap</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Every NFP can <span className="font-semibold text-zinc-200">revise the previous months&apos; numbers</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              And those revisions sometimes change the entire reading.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Concrete case</span>:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { pre: "Expected NFP: ", bold: "200k" },
                { pre: "Actual NFP: ", bold: "250k" },
                { pre: "Apparent surprise: ", bold: "+50k" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item.pre}<span className="font-semibold text-zinc-200">{item.bold}</span></span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Beginner reading: &apos;strong jobs, bullish dollar&apos;.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              But if the previous month is <span className="font-semibold text-zinc-200">revised by -80k</span>, the net effect changes.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The market no longer sees just +50k. It sees <span className="font-semibold text-zinc-200">weaker momentum than expected</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Possible outcome</span>:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "DXY hesitates or drops",
                "EUR/USD reverses",
                "XAU/USD climbs back",
                "Nasdaq recovers",
                "BTC/USD follows the risk-on sentiment",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                A good NFP can turn average if the past gets rewritten.
              </p>
            </div>
          </section>

          {/* Bloc 4 — La timeline pro du jour NFP */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The pro timeline of NFP day</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The NFP isn&apos;t traded like a normal candle. You read a <span className="font-semibold text-zinc-200">sequence</span>.
            </p>
            <div className="space-y-2 mb-5">
              {[
                {
                  time: "1:00pm–2:25pm. Securing",
                  body: "You close or trim fragile positions. You check EUR/USD, DXY, XAU/USD, Nasdaq and BTC/USD.",
                },
                {
                  time: "2:25pm–2:30pm. Pre-positioning",
                  body: "Spreads can widen. You don't enter.",
                },
                {
                  time: "2:30pm–2:35pm. Raw read",
                  body: "The first impulse can be violent.",
                  bold: "You don't trade the first few minutes.",
                },
                {
                  time: "2:35pm–3:00pm. Full analysis",
                  items: ["headline", "unemployment", "wages", "participation", "revisions"],
                  suffix: "Then you compare with DXY, XAU/USD and Nasdaq.",
                },
                {
                  time: "3:00pm–3:30pm. Possible setup",
                  body: "If the reaction is coherent and confirmed, you can look for an entry with confluence.",
                },
                {
                  time: "3:30pm+. Continuation or digestion",
                  body: "With the US open, the market confirms or cancels the first read.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.time}</span>
                    <br />
                    {"body" in item && item.body}
                    {"bold" in item && <> <span className="font-semibold text-zinc-200">{item.bold}</span></>}
                    {"items" in item && (
                      <>
                        <span className="text-zinc-300"> You watch:</span>
                        {item.items!.map((sub, j) => (
                          <span key={j} className="block ml-2 text-zinc-400">– {sub}</span>
                        ))}
                        <span className="block mt-1">{item.suffix}</span>
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded mb-4">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Retail trades at 2:30pm. The pro trades at 3:00pm. Thirty minutes that change the result.
              </p>
            </div>

            {/* Encadré 💰 Réalité du retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Retail reality</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                Retail trades the number in 30 seconds. The pro reads the report, waits for confirmation and lets everyone else pay the spread.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Les 3 setups pros sur NFP */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The 3 pro setups on NFP</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              There are three ways to work an NFP.
            </p>
            <div className="space-y-4 mb-5">
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1">1. Anticipation setup</p>
                <p className="text-sm text-zinc-300">
                  Based on the prior data: CPI, PPI, wages, Fed bias. It&apos;s <span className="font-semibold text-zinc-200">risky</span>. Reserved for very experienced traders.
                </p>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-2">2. Confirmed reaction setup <span className="text-zinc-500 font-normal">(the cleanest)</span></p>
                <p className="text-sm text-zinc-300 mb-2">You wait for:</p>
                <ul className="space-y-1 mb-3">
                  {[
                    "a coherent report",
                    "DXY aligned",
                    "XAU/USD confirming the inverse of the dollar",
                    "Nasdaq and BTC/USD coherent with the risk-on / risk-off",
                    "a valid technical level",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                      <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-zinc-400 italic">
                  Strong NFP + strong wages + DXY breaks a resistance. EUR/USD breaks a support. XAU/USD rejects a high zone.<br />
                  → Cleaner short EUR/USD or short XAU/USD setup.
                </p>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1">3. Continuation setup</p>
                <p className="text-sm text-zinc-300">
                  After 3:30pm, if the market keeps going in the same direction with volume, you look for a continuation on a pullback.
                </p>
              </div>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                The NFP creates the shock. Confluence decides whether you trade.
              </p>
            </div>
          </section>

          {/* Bloc 6 — Les pièges spécifiques au NFP */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The traps specific to the NFP</h2>
            <div className="space-y-3 mb-5">
              {[
                {
                  bold: "Trap 1. The first impulse",
                  body: "The first candle goes one way, then reverses. That's often where retail gets stopped out.",
                },
                {
                  bold: "Trap 2. Trading only the headline",
                  body: "An NFP above expectations doesn't always mean a bullish dollar. Wages, unemployment and revisions can contradict the number.",
                },
                {
                  bold: "Trap 3. Ignoring correlated assets",
                  body: "If you trade XAU/USD, watch the DXY. If you trade BTC/USD, watch the Nasdaq. If you trade EUR/USD, also watch GBP/USD and USD/CHF.",
                },
                {
                  bold: "Trap 4. Stop too tight",
                  body: "After the NFP, a classic stop can get hit without invalidating the thesis. The volatility is different. Your risk has to be too.",
                },
                {
                  bold: "Trap 5. Forgetting the macro chain",
                  body: "The NFP comes after CPI and PPI, then influences the next FOMC.",
                  chain: true,
                },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{item.bold}</p>
                  <p className="text-sm text-zinc-300">{item.body}</p>
                  {item.chain && (
                    <>
                      <p className="text-sm font-semibold text-zinc-200 mt-2 mb-1">Full chain:</p>
                      <p className="text-sm text-zinc-400">PPI → CPI → NFP → FOMC</p>
                      <p className="text-sm text-zinc-300 mt-2">
                        You don&apos;t read the NFP alone. <span className="font-semibold text-zinc-200">You read it within the Fed&apos;s narrative.</span>
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                The NFP alone gives you a number. The NFP within the chain gives you a thesis.
              </p>
            </div>
          </section>

          {/* ET TOI, RETAIL ? */}
          <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-6 my-8">
            <p className="text-emerald-400 uppercase tracking-widest text-xs font-bold mb-4">AND YOU, RETAIL?</p>
            <div className="text-zinc-300 leading-relaxed space-y-3">
              <p>
                Friday 2:25pm. Capital €1,500. The NFP drops in 5 minutes. You work from home, your morning is done. You close your fragile positions on EUR/USD and XAU/USD. No point staying exposed during the shock. You open your four charts: EUR/USD, XAU/USD, Nasdaq and BTC/USD. You wait for the market reaction, not the number alone.
              </p>
              <p>
                2:30pm: the NFP comes in at 220k versus 180k expected. Unemployment stable. Wages at +0.3%. First read: strong dollar. But the previous month&apos;s revisions drop to -50k. The read becomes more nuanced. DXY rises anyway, EUR/USD falls and XAU/USD plunges. You don&apos;t trade the first candle. At 2:45pm, the market starts to slow down. Then at 3:00pm, XAU/USD breaks the $4,580 support before re-testing it from below. Confirmed hawkish reaction + validated technical break. The setup is clean.
              </p>
              <p>
                Concretely: short XAU/USD entry at $4,575, SL at $4,600, TP at $4,525. You risk €30 (2% of €1,500), you can make about €60. You close your chart, you take your Friday night off. You&apos;ll check tomorrow morning.
              </p>
            </div>
          </div>

          {/* ── Séparateur révision ── */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Review</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <LessonKeyPoints
            points={[
              "The NFP is a full report: headline, unemployment, wages, participation and revisions",
              "Wages and revisions can flip the reading of the headline number",
              "The real read happens after the first few minutes, with DXY, XAU/USD, Nasdaq and BTC/USD",
              "The NFP must be read within the PPI → CPI → NFP → FOMC chain",
            ]}
          />

          <LessonExercice
            description="Take an old NFP and rebuild the full reading."
            steps={[
              "Note the expected NFP, the actual NFP and the previous month's revisions.",
              "Note the unemployment rate, average hourly earnings and the participation rate.",
              "Watch DXY, EUR/USD, XAU/USD, Nasdaq and BTC/USD between 2:30pm and 3:30pm.",
              "Identify whether the first impulse held or reversed.",
              "Note which setup would have been the cleanest: no entry, confirmed reaction or post-3:30pm continuation.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            The goal:{" "}
            <span className="font-semibold text-zinc-400">stop reading the NFP as a single number</span>.
          </p>

          <LessonQuiz
            question="The NFP comes in at 250k versus 200k expected. But the previous month is revised by -80k and wages come in below expectations. Which reading is the most professional?"
            options={[
              "Bullish dollar automatically, because the NFP is above expectations",
              "Mixed reading: the headline is strong, but the revisions and wages weaken the signal",
              "XAU/USD must necessarily fall",
              "BTC/USD can't be impacted by the NFP",
            ]}
            correctIndex={1}
            explanation="The headline number is positive, but it's not enough. A negative revision to the previous month (-80k) and weak wages can reduce or reverse the impact of the headline. Option A is too simplistic (a beginner reading that ignores the context). Option C ignores the full context (the sub-data can contradict the headline). Option D is wrong: BTC/USD often reacts to risk sentiment and rate expectations, which are directly impacted by the NFP."
            answerExplanations={[
              "Wrong. Reading only the headline is a classic mistake. A -80k revision and weak wages can neutralize or reverse the impact of a strong NFP.",
              "Correct. The headline number is positive, but the negative revisions and weak wages weaken the signal. The pro reading always factors in the sub-data.",
              "Wrong. XAU/USD depends on the broader context: if the revisions and wages weaken the dollar, gold can climb even with a strong headline NFP.",
              "Wrong. BTC/USD often reacts to risk sentiment and policy rate expectations, two variables directly influenced by the NFP.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-avance", "lecon2"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">The next lesson (US bond yields) is now available.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/avance/lecon1"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 1. FOMC
              </Link>
              <Link
                href="/formations/macro/avance/lecon3"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Lesson 3. US bond yields
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
