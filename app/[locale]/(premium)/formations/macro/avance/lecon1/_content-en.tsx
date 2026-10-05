"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { FOMCTimelineDiagram } from "@/app/components/charts/FOMCTimelineDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "FOMC",                          href: "/formations/macro/avance/lecon1", disabled: false },
  { id: "lecon2", title: "NFP",                           href: "/formations/macro/avance/lecon2", disabled: false },
  { id: "lecon3", title: "US bond yields",                href: "/formations/macro/avance/lecon3", disabled: false },
  { id: "lecon4", title: "Risk-on / Risk-off",            href: "/formations/macro/avance/lecon4", disabled: false },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-avance", "lecon1"));
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
          <span className="text-zinc-500">Lesson 1</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Advanced
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">22 min</span>
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
            FOMC, the event that can flip the market&apos;s direction
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              You can have a perfect setup, enter at the right level… and get stopped out in under a minute. The FOMC creates moves that trap traders who are too quick. If you don&apos;t understand its timing, you&apos;re trading the noise.
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
            <span className="ml-auto text-xs text-zinc-600">1 / 4 lessons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 : Qu'est-ce que le FOMC ? */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">What is the FOMC?</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The FOMC is the Fed committee that decides US interest rates and monetary policy.
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Key point:</span> the FOMC sets the cost of money, and therefore the direction of flows across the markets.
              </p>
            </div>
          </section>

          {/* Bloc 2 : Pourquoi le marché y réagit autant */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Why the market reacts so hard</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              A rate decision directly impacts:
            </p>
            <ul className="space-y-1.5 mb-4 ml-1">
              {["the dollar", "the indices", "crypto"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              High rates → pressure on the markets. Low rates → support for the markets.
            </p>
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3">
              <p className="text-sm text-white font-semibold leading-relaxed">
                The market doesn&apos;t react to the decision. It reacts to what Powell hints at.
              </p>
            </div>
          </section>

          {/* Bloc 3 : Le timing exact */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The exact timing of an FOMC</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              An FOMC reads in three phases:
            </p>
            <div className="space-y-2 mb-6">
              {[
                { time: "2:00pm", label: "Fed decision", color: "text-blue-400" },
                { time: "2:30pm", label: "Powell speech", color: "text-amber-400" },
                { time: "3:00pm+", label: "Real direction", color: "text-emerald-400" },
              ].map((item) => (
                <div key={item.time} className="flex items-center gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className={`text-xs font-bold shrink-0 w-14 ${item.color}`}>{item.time}</span>
                  <span className="text-sm text-zinc-300">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Visuel SVG */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <FOMCTimelineDiagram locale="en" />
            </div>

            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-4 mb-3">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Concrete example</p>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                At 2:00pm, EUR/USD can move +100 to +150 pips in 3 minutes, sometimes more. You see the breakout, you enter. At 2:30pm, Powell speaks. The market reverses. Between 2:30pm and 3:30pm, EUR/USD can lose 200 to 400 pips.
              </p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Hawkish surprise matrix, in 3 minutes</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { asset: "EUR/USD", move: "-100 to -150 pips", note: "stronger dollar" },
                  { asset: "XAU/USD", move: "-$30 to -$60", note: "gold penalized by rates" },
                  { asset: "Nasdaq", move: "-1.5 to -2.5%", note: "tech under pressure" },
                  { asset: "BTC/USD", move: "-$800 to -$2,000", note: "massive risk-off" },
                ].map((item) => (
                  <div key={item.asset} className="bg-zinc-900/60 rounded-lg px-3 py-2">
                    <p className="text-xs font-bold text-zinc-300">{item.asset}</p>
                    <p className="text-xs text-red-400 font-semibold">{item.move}</p>
                    <p className="text-[10px] text-zinc-500">{item.note}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-zinc-500 italic">
                On a dovish surprise FOMC, it&apos;s the opposite: EUR/USD +100/+150, XAU/USD +$30/+$60, Nasdaq +2/+3%, BTC/USD +$1,000/+$3,000.
              </p>
            </div>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-3">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">A genuine surprise FOMC, extreme amplitudes</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {[
                  { asset: "EUR/USD", move: "200 to 400 pips" },
                  { asset: "XAU/USD", move: "$80 to $150" },
                  { asset: "Nasdaq", move: "3 to 5%" },
                  { asset: "BTC/USD", move: "$3,000 to $6,000" },
                ].map((item) => (
                  <div key={item.asset} className="flex items-center justify-between bg-zinc-900/40 rounded-lg px-3 py-1.5">
                    <span className="text-xs font-semibold text-zinc-300">{item.asset}</span>
                    <span className="text-xs text-zinc-400">{item.move}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 italic">
                At this level of amplitude, it&apos;s not trading anymore. It&apos;s panic management.
              </p>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              The first impulse is unstable and can reverse violently. It&apos;s rarely the real direction.
            </p>
          </section>

          {/* Bloc 4 : ERREUR CLASSIQUE */}
          <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Classic mistake</p>
            <p className="text-sm font-semibold text-white mb-3">You rush in on the first candle</p>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              You see the candle shooting up. You tell yourself: &quot;I have to get in now&quot;. You buy. 30 seconds later, the market slows down. Then it reverses. Your stop gets hit.
            </p>
            <div className="bg-zinc-900/40 border border-red-500/15 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 italic leading-relaxed">
                The first impulse often serves to grab liquidity, not to give a direction.
              </p>
            </div>
          </section>

          {/* Bloc 5 : Comment trader un FOMC */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">How to trade an FOMC</h2>
            <div className="space-y-2 mb-4">
              {[
                "You watch DXY + EUR/USD between 1:45pm and 3:00pm",
                "You wait for a confirmed M5 or M15 close after 3:00pm",
                "You look for confluence with a strong technical level",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-3">
                  <span className="text-emerald-500 font-bold text-base shrink-0 mt-0.5">✓</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-3">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Assets to watch during an FOMC</p>
              <div className="space-y-1.5">
                {[
                  { asset: "EUR/USD", role: "barometer of the dollar" },
                  { asset: "XAU/USD", role: "maximum sensitivity to real rates" },
                  { asset: "Nasdaq", role: "direct impact of rates on tech" },
                  { asset: "BTC/USD", role: "risk-on / risk-off indicator" },
                ].map((item) => (
                  <div key={item.asset} className="flex items-center gap-3 text-sm">
                    <span className="font-semibold text-zinc-300 shrink-0 w-20">{item.asset}</span>
                    <span className="text-zinc-600">—</span>
                    <span className="text-zinc-400">{item.role}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-3 italic">The pro rule: watch the consistency across these 4 assets to validate your bias.</p>
            </div>
            <div className="space-y-2 mb-5">
              {[
                "You never enter between 2:00pm and 2:30pm",
                "You don't trade the first breakout candle",
                "You don't trade blind if you haven't listened to Powell",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3">
                  <span className="text-red-500 font-bold text-base shrink-0 mt-0.5">✗</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-white font-semibold leading-relaxed">
                You don&apos;t trade the news. You trade the reaction.
              </p>
            </div>
          </section>

          {/* Bloc 6 : Confluence avec analyse technique */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Confluence with technical analysis</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              FOMC + technical setup = premium setup.
            </p>
            <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl px-4 py-4 mb-4">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Example</p>
              <div className="space-y-1.5">
                {[
                  "Price in an H1 Order Block zone",
                  "DXY breaks a Daily resistance",
                  "Powell hawkish at 2:45pm",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <span className="text-zinc-600 shrink-0">—</span>
                    {item}
                  </div>
                ))}
                <div className="mt-3 flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0">→</span>
                  <p className="text-sm text-emerald-400 font-medium">Triple confluence, realistic R/R 1:3 or more.</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-3">
              With an FOMC that produces 300+ pips of directional move, a confirmed setup can target an R/R of 1:5, even 1:10.
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                The same phenomenon happens simultaneously on XAU/USD, the Nasdaq and BTC/USD, technical levels get swept across all dollar-linked assets at the same time. That&apos;s what makes the FOMC so dangerous: you can get stopped out on 4 assets in the same second.
              </p>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Without technical confluence, you&apos;re just trading the news. With it, you trade the news + the structure.
            </p>
          </section>

          {/* ET TOI, RETAIL ? */}
          <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-6 my-8">
            <p className="text-emerald-400 uppercase tracking-widest text-xs font-bold mb-4">WHAT ABOUT YOU, RETAIL?</p>
            <div className="text-zinc-300 leading-relaxed space-y-3">
              <p>
                Wednesday evening, 1:45pm. Capital €1,000. The FOMC drops in 15 minutes. You have no open position on EUR/USD or on the US indices. Everything is flat. Yesterday, you had already spotted an H1 Order Block around 1.1820 on EUR/USD. That&apos;s your key level. Between 2:00pm and 2:30pm, you know the market can go either way with no logic of its own.
              </p>
              <p>
                2:00pm: the Fed leaves rates unchanged. Violent first impulse. 2:30pm: Powell turns hawkish and insists inflation is still too high. EUR/USD plunges, snaps back up, then plunges again. The classic FOMC chaos. You still don&apos;t touch anything. At 3:05pm, an M15 candle closes below your 1.1820 Order Block. The dollar confirms its strength. The macro + technical confluence is there.
              </p>
              <p>
                Concretely: short entry at 1.1820, SL at 1.1850, TP at 1.1760. You risk €20 (2% of €1,000), you can make around €40. You close your chart, you go to sleep. You&apos;ll check on waking up, the post-3:00pm moves of the FOMC often keep going through the whole Asian session.
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
              "The FOMC decides US interest rates and monetary policy.",
              "Powell's speech is decisive, he's the one who gives the real direction.",
              "2:00pm–3:00pm = unstable zone; the real direction shows up after 3pm.",
              "The first impulse is unstable and often acts as a liquidity trap.",
              "The FOMC hits EUR/USD, XAU/USD, Nasdaq and BTC/USD at the same time, watch the consistency between them.",
            ]}
          />

          <LessonExercice
            description="On TradingView, analyze a recent FOMC."
            steps={[
              "Open EUR/USD on M5.",
              "Find a recent FOMC via an economic calendar (Investing.com, Forex Factory).",
              "Watch the move at 2:00pm — which direction? What amplitude?",
              "Watch the reaction at 2:30pm (start of Powell's speech) — was there a reversal?",
              "Identify the confirmed direction after 3:00pm.",
              "Question: if you'd been in front of your screen that day, at exactly what time would you have entered? With what confluence? Write it down.",
            ]}
          />

          <LessonQuiz
            question="At 2:00pm, EUR/USD breaks a resistance during an FOMC. What do you do?"
            options={[
              "You buy immediately, it's a clear breakout",
              "You wait for the end of the speech and a confirmed M5 close after 3:00pm",
              "You sell directly, betting on a reversal",
              "You enter both ways with two opposite orders",
            ]}
            correctIndex={1}
            explanation="The first impulse of an FOMC is unstable and often serves to grab liquidity before Powell speaks. Waiting for a confirmed close after 3:00pm avoids that trap and lets you enter in the real direction with a technical confluence. This principle applies to every asset hit by the FOMC: the same trap happens on XAU/USD, the Nasdaq and BTC/USD at the same time."
            answerExplanations={[
              "False. That impulse at 2:00pm is very often a trap, the market hunts the liquidity of the stops before reversing at 2:30pm when Powell speaks. Buying immediately means entering the most unstable zone of the FOMC.",
              "Correct. The real direction confirms after 3:00pm. By waiting for an M5 close with a technical confluence (OB, broken resistance), you avoid the noise and enter with a far higher probability.",
              "Too aggressive and with no logic. There's no confirmed reversal signal at this stage, you don't know if the resistance will hold or give way. Selling blind into a breakout is gambling, not trading.",
              "False. Entering both ways is a mistake, you pay the spread on both sides and you have no directional bias. The correct method is to wait for confirmation, not to hedge blind.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-avance", "lecon1"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">The next lesson (NFP) will be available soon.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/avance"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to module
              </Link>
              <Link
                href="/formations/macro/avance/lecon2"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Lesson 2. NFP
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
