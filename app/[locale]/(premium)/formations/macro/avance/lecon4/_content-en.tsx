"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import RiskRegimesQuadrantDiagram from "@/app/components/charts/RiskRegimesQuadrantDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "FOMC",                  href: "/formations/macro/avance/lecon1", disabled: false },
  { id: "lecon2", title: "NFP",                   href: "/formations/macro/avance/lecon2", disabled: false },
  { id: "lecon3", title: "US bond yields",        href: "/formations/macro/avance/lecon3", disabled: false },
  { id: "lecon4", title: "Risk-on / Risk-off",    href: "/formations/macro/avance/lecon4", disabled: false },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-avance", "lecon4"));
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
          <span className="text-zinc-500">Lesson 4</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Advanced
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">18 min</span>
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
            Risk-on / Risk-off, the pro&apos;s mental framework
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Retail looks at a chart. The pro reads a regime.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Two traders, same setup, opposite results because they&apos;re not in the same environment.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Risk-on, risk-off, reflation, flight to quality: this isn&apos;t jargon, it&apos;s the map of the terrain.
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
              const isCurrent = lesson.id === "lecon4";
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
            <span className="ml-auto text-xs text-zinc-600">4 / 4 lessons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — Risk-on / Risk-off: the pro's mental grid */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Risk-on / Risk-off: the pro&apos;s mental grid</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Risk-on = capital chases yield and accepts volatility. Risk-off = it flees to safety.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              It&apos;s not an opinion, it&apos;s a flow. And flows dominate your patterns.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Why it&apos;s critical</span>: a breakout doesn&apos;t carry the same value depending on the regime.
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                "Nasdaq breaks a resistance in risk-on → you buy, continuation likely.",
                "The same breakout in risk-off → you sell the trap, squeeze then rejection.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              Concrete example: Nasdaq +140 points on a soft CPI print in risk-on, followed by +220 points in extension.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Same pattern in risk-off: +120 points spike then -260 points back below the level.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              The market doesn&apos;t pay you to see a signal. It pays you to understand the context in which that signal appears.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              You don&apos;t trade an asset. You trade an environment.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo;Before asking WHERE you trade, ask WHAT you&apos;re trading in.&rdquo;
              </p>
            </div>
          </section>

          {/* Bloc 2 — The typology of the 4 regimes */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The typology of the 4 regimes</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              It&apos;s not binary. Between risk appetite and risk aversion, there are 4 distinct states. Each has its signature and its trades.
            </p>
            <div className="space-y-4">

              <div className="bg-zinc-800/30 rounded-xl px-4 py-4">
                <h3 className="text-sm font-semibold text-zinc-200 mb-3">Classic risk-on</h3>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Signature:</span>{" "}DXY -30 to -60 points, US10Y flat or +5 points, gold flat to moderately bullish (+10 to +30 points), US indices +150 to +300 points, BTC/USD +800 to +2000.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Read:</span>{" "}growth ok, inflation under control, liquidity sufficient.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Typical trade:</span>{" "}long indices, long BTC, short USD against AUD/NZD.
                </p>
                <p className="text-sm text-zinc-300">
                  <span className="font-semibold text-zinc-400">Concrete case:</span>{" "}late 2023, Fed pivot narrative. Nasdaq strings together +250 then +320 points over the week, DXY pulls back -80 points.
                </p>
              </div>

              <div className="bg-zinc-800/30 rounded-xl px-4 py-4">
                <h3 className="text-sm font-semibold text-zinc-200 mb-3">Panic risk-off</h3>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Signature:</span>{" "}DXY +80 to +150 points, US10Y -20 to -40 points (flight to Treasuries), gold +40 to +90 points, indices -300 to -800 points, BTC/USD -2000 to -6000.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Read:</span>{" "}global liquidation, dash for cash and safety.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Typical trade:</span>{" "}long USD, long CHF/JPY, long gold, short indices or flat.
                </p>
                <p className="text-sm text-zinc-300">
                  <span className="font-semibold text-zinc-400">Concrete case:</span>{" "}March 16, 2020. Nasdaq -900 points intraday, DXY +140 points, US10Y -35 points.
                </p>
              </div>

              <div className="bg-zinc-800/30 rounded-xl px-4 py-4">
                <h3 className="text-sm font-semibold text-zinc-200 mb-3">Reflation trade</h3>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Signature:</span>{" "}DXY mixed (+/-30 points), US10Y +15 to +40 points, gold +20 to +70 points, indices rise but with internal rotation, BTC/USD bullish.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Read:</span>{" "}growth + inflation picking back up. Money flows toward real assets.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Typical trade:</span>{" "}long commodities, long financials, short long-duration tech.
                </p>
                <p className="text-sm text-zinc-300">
                  <span className="font-semibold text-zinc-400">Concrete case:</span>{" "}early 2021. US10Y takes +30 points in a few weeks, Nasdaq underperforms, rotation into value.
                </p>
              </div>

              <div className="bg-zinc-800/30 rounded-xl px-4 py-4">
                <h3 className="text-sm font-semibold text-zinc-200 mb-3">Flight to quality</h3>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Signature:</span>{" "}DXY +30 to +80 points, US10Y -10 to -25 points, gold +20 to +60 points, indices -80 to -200 points, BTC/USD modestly lower.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Definition:</span>{" "}flight to quality = capital shifting toward assets perceived as safe.
                </p>
                <p className="text-sm text-zinc-300 mb-1">
                  <span className="font-semibold text-zinc-400">Typical trade:</span>{" "}long USD, long gold, reducing risk on equities.
                </p>
                <p className="text-sm text-zinc-300">
                  <span className="font-semibold text-zinc-400">Concrete case:</span>{" "}early 2022, Ukraine tensions. Nasdaq -150 points, gold +50 points, DXY +60 points without a global crash.
                </p>
              </div>

            </div>
          </section>

          {/* Bloc 3 — How to recognize the current regime */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">How to recognize the current regime</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Simple routine. Four questions. Four answers.
            </p>
            <div className="space-y-3 mb-5">
              {[
                {
                  q: "Is DXY going up or down?",
                  a: "Up = dollar demand, stress or attractiveness. Down = global risk appetite.",
                },
                {
                  q: "Is US10Y going up or down?",
                  a: "Up = inflation/growth expectations. Down = search for safety or recession fear.",
                },
                {
                  q: "Is gold going up or down?",
                  a: "Up = hedge against risk or inflation. Down = no interest in protection.",
                },
                {
                  q: "Are US indices and BTC moving together or decoupling?",
                  a: "Together = clear regime. Decoupling = transition or internal rotation.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{i + 1}. {item.q}</p>
                  <p className="text-sm text-zinc-400 italic">→ {item.a}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Cross-reference the answers. You identify the regime without a pro terminal. Just 4 charts.
            </p>
          </section>

          {/* Bloc 4 — Visuel */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The 4 market regimes</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              The market can be read as a quadrant. Horizontal axis: low to high inflation. Vertical axis: strong to weak growth. Each corner corresponds to a distinct regime. This map lets you quickly locate the macro environment and anticipate which assets should outperform or underperform.
            </p>
            <div className="border border-zinc-800 rounded-xl overflow-hidden">
              <RiskRegimesQuadrantDiagram locale="en" />
            </div>
          </section>

          {/* Bloc 5 — Transitions between regimes */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Transitions between regimes: where the edge hides</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              The market doesn&apos;t switch. It slides. Your edge is in the first cracks.
            </p>
            <div className="space-y-4 mb-5">
              {[
                {
                  signal: "Gold rises while yields rise",
                  body: "Normally inverse. If XAU/USD +40 points and US10Y +20 points at the same time, the market is pricing persistent inflation.",
                },
                {
                  signal: "Yields drop despite a hawkish Fed tone",
                  body: "The market doesn't believe the Fed. Example: US10Y -25 points post FOMC while the tone stays restrictive → pricing a recession.",
                },
                {
                  signal: "DXY rises alongside rising yields",
                  body: "Double pressure: rate attractiveness + demand for safety. Example: DXY +70 points with US10Y +15 points = latent tension.",
                },
                {
                  signal: "Nasdaq diverges from the Russell 2000",
                  body: "If Nasdaq +120 points while Russell -80 points = market pricing an anticipated drop in yields (favorable to long-duration tech), not a real economic recovery. The reverse (Russell +80 / Nasdaq -120) = reflation, real domestic growth favored.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-2">— {item.signal}</p>
                  <p className="text-sm text-zinc-400">→ {item.body}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm">
              These signals show up before the headlines. That&apos;s where you get ahead.
            </p>
          </section>

          {/* Bloc 6 — The institutional vocabulary to know */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The institutional vocabulary to know</h2>
            <div className="space-y-3">
              {[
                {
                  term: "Flight to quality",
                  def: "Capital shifting toward safe assets.",
                  util: "Spot defensive phases without panic.",
                  cas: "Gold +50 points, US10Y -15 points, indices -100 points.",
                },
                {
                  term: "Reflation trade",
                  def: "Positioning for the return of growth and inflation.",
                  util: "Understand sector rotations.",
                  cas: "US10Y +25 points, banks rise, tech underperforms.",
                },
                {
                  term: "Carry trade",
                  def: "Borrowing in a low-rate currency to invest in a high-rate currency.",
                  util: "Capture the rate differential.",
                  cas: "Massive short JPY positions built up over months, then a violent unwind in August 2024 with USD/JPY -2000 pips in a few sessions (July 31 to August 5).",
                },
                {
                  term: "Safe haven flow",
                  def: "Flows into safe-haven assets.",
                  util: "Confirm a defensive bias.",
                  cas: "USD, CHF and gold rise together on a geopolitical tension.",
                },
                {
                  term: "Risk parity",
                  def: "A strategy that balances risk between equities and bonds.",
                  util: "Understand forced selling.",
                  cas: "When yields and equities rise together, funds cut both → violent, synchronized moves.",
                },
              ].map((item) => (
                <div key={item.term} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{item.term}</p>
                  <p className="text-sm text-zinc-300 mb-1">{item.def}</p>
                  <p className="text-xs text-zinc-500"><span className="font-semibold">Use:</span> {item.util}</p>
                  <p className="text-xs text-zinc-500 mt-0.5"><span className="font-semibold">Case:</span> {item.cas}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Bloc 7 — Multi-asset */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Multi-asset: where each regime reads best</h2>
            <div className="space-y-3">
              {[
                { bold: "DXY + US10Y", body: "= main barometer. If both rise, tension. If DXY falls and yields are stable, risk-on." },
                { bold: "XAU/USD", body: "= arbiter. It distinguishes a controlled fear from a panic. Gold rising without an equity crash = flight to quality." },
                { bold: "Nasdaq", body: "= sensitive to yields. +25 points on US10Y can be enough to trigger -150 points on the index." },
                { bold: "Russell 2000", body: "= proxy for US domestic growth. Outperforms in reflation, underperforms in stress and in flight to quality." },
                { bold: "BTC/USD", body: "= amplified version of the Nasdaq. If Nasdaq +120 points, BTC can do +1500. Ideal for reading raw sentiment." },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm text-zinc-300">
                    <span className="font-semibold text-zinc-200">{item.bold}</span> {item.body}
                  </p>
                </div>
              ))}
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
              "Risk-on/off is NOT binary, it's a quadrant of 4 regimes",
              "DXY + US10Y + Gold + Indices = the 4 charts to read every morning",
              "The same technical setup is traded differently depending on the regime",
              "Transitions show up in the weak signals BEFORE the obvious",
              "Flight to quality / reflation trade / carry trade = pro vocabulary that describes real flows",
            ]}
          />

          <LessonExercice
            description="Put the 4-regime grid into practice before your next session."
            steps={[
              "Identify the current market regime using the 4-question checklist",
              "Check the 4 charts (DXY, US10Y, XAU/USD, Nasdaq) this morning and name the regime out loud",
              "Find a mention of \"flight to quality\" or \"reflation trade\" in the news and understand the context",
              "Compare how your main asset behaved the last time we were in the regime opposite to today's",
              "Add a \"Regime of the day\" line to your trading journal before each session",
            ]}
          />

          <LessonQuiz
            question="This morning: DXY ↑, US10Y ↓, Gold ↑, Nasdaq ↓ slightly. Which regime are you in?"
            options={[
              "Classic risk-on",
              "Panic risk-off",
              "Reflation trade",
              "Flight to quality",
            ]}
            correctIndex={3}
            explanation="DXY rising + yields falling + gold rising + indices falling slightly = capital positioning defensively without panic. Not a collapse, just a repositioning. Key difference from panic risk-off: in panic risk-off, indices and BTC fall violently. Here, the drop is contained, a sign of measured fear."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-avance", "lecon4"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">You&apos;ve completed the full Advanced Macro module.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/avance/lecon3"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 3. US bond yields
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
