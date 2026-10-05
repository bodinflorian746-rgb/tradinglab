"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import FlipDiagram from "@/app/components/charts/FlipDiagram";
import FlipRetestValidationDiagram from "@/app/components/charts/FlipRetestValidationDiagram";
import FlipFailureDiagram from "@/app/components/charts/FlipFailureDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Support and resistance: the zones where the market reacts", disabled: false },
  { id: "lecon2", title: "Identifying a real level (vs a line drawn at random)", disabled: false },
  { id: "lecon3", title: "Support↔resistance flip and trading a bounce", disabled: false },
  { id: "lecon4", title: "Lesson 4",          disabled: true },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "support-resistance", "lecon3"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Strategies</Link>
          <span>/</span>
          <Link href="/strategies/support-resistance" className="hover:text-zinc-400 transition-colors">Support / Resistance &amp; Range</Link>
          <span>/</span>
          <span className="text-zinc-500">Lesson 3</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Beginner
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
            Support↔resistance flip and trading a bounce
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              This lesson teaches you to trade the polarity flip: a broken resistance becomes support (and vice versa), with a numeric execution plan on the retest.
            </p>
          </div>

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

          <div className="mt-6 flex items-center gap-2 flex-wrap">
            {LESSONS.map((lesson) => {
              const isCurrent = lesson.id === "lecon3";
              return (
                <div key={lesson.id}>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                    isCurrent
                      ? "bg-zinc-800 border-zinc-600 text-white"
                      : lesson.disabled
                      ? "border-zinc-800/50 text-zinc-700"
                      : "border-zinc-800 text-zinc-500"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : lesson.disabled ? "bg-zinc-700" : "bg-zinc-600"}`} />
                    {isCurrent ? (
                      <>
                        <span className="md:hidden">Lesson {lesson.id.replace("lecon", "")}</span>
                        <span className="hidden md:inline">{lesson.title}</span>
                      </>
                    ) : (
                      lesson.title
                    )}
                  </span>
                </div>
              );
            })}
            <span className="ml-auto text-xs text-zinc-600">3 / 4 lessons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo;A broken support becomes a resistance. A broken resistance becomes a support. The market remembers prices.&rdquo;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Identifying S/R → see SR Strategy L1</li>
              <li>- Qualifying a level → see SR Strategy L2</li>
              <li>- Concept of a break (clean close) → see Trading Course L3</li>
            </ul>
          </div>

          {/* Bloc 3 — LE FLIP DE POLARITÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The polarity flip</h2>

            <div className="my-8">
              <FlipDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A broken zone isn&apos;t a dead zone. It reverses its role. The sequence break + retest + bounce makes up the flip setup.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Clean break: clean close + distance ≥ 15-20 pips/$ beyond the level</li>
              <li>- No reintegration within the next 3-5 candles (otherwise flip invalidated)</li>
              <li>- Retest: price returns toward the broken level from the opposite side</li>
              <li>- Bounce confirmed by a rejection signal (pin bar, engulfing, clean reaction)</li>
            </ul>
          </section>

          {/* Bloc 4 — VALIDER LE RETEST */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Validating the retest</h2>

            <div className="my-8">
              <FlipRetestValidationDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Without a rejection signal at contact with the flipped zone, the flip isn&apos;t validated. 3 signals are operationally acceptable.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Rejection pin bar (long wick on the zone side, small body on the opposite side)</li>
              <li>- Engulfing in the direction of the flip (engulfs the previous candle)</li>
              <li>- Immediate reaction (clean bounce within 1-2 candles without deep penetration)</li>
              <li>- Signal absent = zone unconfirmed, wait for another opportunity</li>
            </ul>
          </section>

          {/* Bloc 5 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Trade plan: EUR/USD H4 flip</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              EUR/USD in an uptrend for 2 weeks. Major resistance 1.1850 touched 3 times in 3 weeks before being broken. 4 candles confirm the break with no reintegration. Rejection pin bar on the retest.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup (long trade on a confirmed flip)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Break: close at 1.1878 (28 pips above the zone)</li>
                <li>- Validation: 4 candles with no reintegration below 1.1850</li>
                <li>- Retest: pin bar with low wick at 1.1842 and close at 1.1858</li>
                <li>- Long entry: 1.1858 (pin bar close)</li>
                <li>- Stop loss: 1.1830 (28 pips below the wick, 12-pip margin)</li>
                <li>- Take profit: 1.1950 (next H4 resistance)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">R/R calculation</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risk: 1.1858 - 1.1830 = 28 pips</li>
                <li>- Potential gain: 1.1950 - 1.1858 = 92 pips</li>
                <li>- R/R: 92 / 28 = 3.28</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Retail calculation</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- €300 account → 5% = €15 risk, €49 potential gain</li>
              <li>- €500 account → 3% = €15 risk, €49 potential gain</li>
              <li>- €1,000 account → 2% = €20 risk, €66 potential gain</li>
              <li>- €2,500 account → 2% = €50 risk, €164 potential gain</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              The R/R stays 3.28:1 regardless of account size.
            </p>
          </section>

          {/* Bloc 6 — QUAND LE FLIP ÉCHOUE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">When the flip fails</h2>

            <div className="my-8">
              <FlipFailureDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A flip can fail after an apparently clean break. The fast return of price below the level invalidates the flip.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Fast return below the broken level within 3-5 candles = flip invalidated</li>
              <li>- The SL placed on the other side of the zone (with a 5-10 pip margin) caps the loss</li>
              <li>- No moving the SL against yourself during the trade</li>
            </ul>
          </section>

          <LessonKeyPoints
            points={[
              "A flip requires a qualified break: clean close, sufficient distance, no immediate return.",
              "The broken zone reverses its role on the retest: broken support → resistance, broken resistance → support.",
              "The retest is validated only by a rejection signal at contact (pin bar, engulfing, clean reaction).",
              "The stop loss goes on the other side of the zone with a 5-10 pip margin. No rejection signal, no entry.",
            ]}
          />

          <LessonExercice
            description="On EUR/USD H4, a resistance at 1.1850 is broken by a candle that closes at 1.1875 with a significant body. 4 candles later, price retraces toward 1.1850 and prints a pin bar with a long wick that rejects. How do you build the flip trade plan?"
            steps={[
              "Qualify the break: close at 1.1875, 25 pips distance above the zone, significant body, no immediate return over 4 candles, break validated",
              "Note the role reversal: the 1.1850 resistance becomes a support",
              "Identify the rejection signal: the pin bar at contact with the zone validates the flip",
              "Place the long entry at the pin bar close, stop loss at 1.1830 (20 pips below the zone to absorb the wicks)",
              "Set the take profit at the next major resistance identified on the H4 chart (minimum 1:2 ratio), position size based on the per-trade risk fitted to capital",
            ]}
          />

          <LessonQuiz
            question="A resistance has just been broken to the upside with a clean close. Price then retraces toward the zone. Which signal validates the flip and allows a long entry?"
            options={[
              "Price simply returning to the zone is enough",
              "A rejection signal (pin bar, engulfing, clean reaction) at contact with the zone",
              "A break of the next zone",
              "No signal needed, the entry is mechanical",
            ]}
            correctIndex={1}
            explanation="Without a rejection signal, the flip isn't validated. A pin bar, an engulfing or a clean reaction at contact with the zone confirms the flipped zone is playing its new role. Without that signal, price can cut through the zone and invalidate the flip."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "support-resistance", "lecon3");
                  setDone(true);
                }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 3 of the Support / Resistance &amp; Range module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/support-resistance/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 2
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lesson 4. Coming soon
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-600 border border-zinc-700">
                  Soon
                </span>
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
