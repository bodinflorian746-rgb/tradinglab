"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { GraphFakeBreakout } from "@/app/components/charts/GraphFakeBreakout";
import FakeVsRealBreakoutComparisonDiagram from "@/app/components/charts/FakeVsRealBreakoutComparisonDiagram";
import StopHuntDiagram from "@/app/components/charts/StopHuntDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Support and resistance: the zones where the market reacts", disabled: false },
  { id: "lecon2", title: "Identifying a real level (vs a line drawn at random)", disabled: false },
  { id: "lecon3", title: "Support↔resistance flip and trading a bounce", disabled: false },
  { id: "lecon4", title: "Real break vs fake breakout", disabled: false },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "support-resistance", "lecon4"));
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
          <span className="text-zinc-500">Lesson 4</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Beginner
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">17 min</span>
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
            Real break vs fake breakout
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              This lesson teaches you to recognize a fake breakout and trade the return: real vs fake distinction, the mechanics of the institutional stop hunt, and a numeric execution plan.
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
              const isCurrent = lesson.id === "lecon4";
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
            <span className="ml-auto text-xs text-zinc-600">4 / 4 lessons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo;The fake break traps retail traders who jump in too fast. The same break, taken against the crowd, becomes a clean setup.&rdquo;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Identifying S/R → see SR Strategy L1</li>
              <li>- Close vs wick concept → see Trading Course L2</li>
              <li>- Concept of stop hunt / liquidity → see Trading Course L4</li>
            </ul>
          </div>

          {/* Bloc 3 — VRAI VS FAUX BREAKOUT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Real vs fake breakout</h2>

            <div className="my-8">
              <FakeVsRealBreakoutComparisonDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The distinction between a real breakout and a fake breakout rests on the behavior of the break candle and the ones that follow. The essential criterion: a clean close, or a wick then a return.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Real breakout: clean close beyond the level + follow-through over 3-5 candles</li>
              <li>- Fake breakout: the wick clears the level, but the close comes back into the zone</li>
              <li>- Reintegration within 1-3 candles after the wick = fake confirmed</li>
              <li>- Strong zone (3+ touches, psychological level) = fertile ground for fakes</li>
            </ul>
          </section>

          {/* Bloc 4 — RECONNAÎTRE UN FAKE BREAKOUT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Recognizing a fake breakout</h2>

            <div className="my-8">
              <GraphFakeBreakout locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              4 criteria qualify a fake breakout that&apos;s operationally tradable.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Wick of at least 50% of the candle body, sticking out on the break side</li>
              <li>- Clean reintegration into the zone within the next 1-3 candles</li>
              <li>- High relative volume on the wick, then collapse after the rejection</li>
              <li>- Strong-zone context (3+ touches, psychological level, visible OB)</li>
            </ul>
          </section>

          {/* Bloc 5 — LE STOP HUNT INSTITUTIONNEL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The institutional stop hunt</h2>

            <div className="my-8">
              <StopHuntDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The fake breakout is often an institutional stop hunt: stop orders are targeted and triggered, then price returns to its original direction.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Stop-cluster zone located just beyond the structural level ($4,720 → $4,745)</li>
              <li>- The wick pokes into the zone, triggers the stops, then closes below the level</li>
              <li>- Fast bearish continuation after the liquidity is absorbed</li>
              <li>- The trade is taken in the opposite direction to the rejected break</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Trade plan: XAU/USD H1 fake breakout</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Resistance $4,650 touched 3 times in 2 months (strong psychological level). The 4th approach triggers a suspicious break. Candle 1: wick up to $4,680 + close at $4,655. Candle 2: close at $4,640.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup (short trade on a fake breakout)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Candle 1: wick $25 above, $5 body, close at the edge</li>
                <li>- Candle 2: clean close at $4,640 (reintegration confirmed)</li>
                <li>- Short entry: $4,640 (close of the confirmation candle)</li>
                <li>- Stop loss: $4,685 ($5 above the wick at $4,680)</li>
                <li>- Take profit: $4,540 (support zone identified lower)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">R/R calculation</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risk: $4,685 - $4,640 = $45</li>
                <li>- Potential gain: $4,640 - $4,540 = $100</li>
                <li>- R/R: 100 / 45 = 2.22</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Retail calculation</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- €300 account → 5% = €15 risk, €33 potential gain</li>
              <li>- €500 account → 3% = €15 risk, €33 potential gain</li>
              <li>- €1,000 account → 2% = €20 risk, €44 potential gain</li>
              <li>- €2,500 account → 2% = €50 risk, €111 potential gain</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              The R/R stays 2.22:1 regardless of account size.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "A fake breakout combines 4 criteria: long wick with no clean close, fast reintegration, disproportionate volume, strong zone.",
              "The trade is taken in the opposite direction to the rejected break, after double confirmation (close + 2nd candle).",
              "The stop loss goes beyond the initial wick with a 3-5 pip margin.",
              "Fake breakouts are best observed on strong zones (3+ touches, psychological levels).",
            ]}
          />

          <LessonExercice
            description="On XAU/USD H1, the $4,650 resistance has been touched 3 times in 2 months. A candle prints a wick up to $4,680 then closes at $4,655. The next candle closes at $4,640. How do you build the fake breakout trade plan?"
            steps={[
              "Validate the 4 detection criteria: $25 wick above the zone with no clean close, reintegration within 1 candle, strong zone (3 touches + $4,650 psychological level)",
              "Validate the double confirmation: candle 1 closes at $4,655 (at the edge), candle 2 closes at $4,640 (clean reintegration)",
              "Place the short entry at $4,640 (close of the confirmation candle)",
              "Place the stop loss at $4,685 ($5 above the initial wick at $4,680)",
              "Place the take profit at $4,560 (support zone identified lower, R/R ratio 1:1.8), position size based on the per-trade risk fitted to capital",
            ]}
          />

          <LessonQuiz
            question="What is the minimum number of touches needed to qualify a support or resistance zone as tradable?"
            options={[
              "1 touch, if it's strong",
              "2 touches minimum, 3 ideally",
              "5 touches mandatory",
              "No defined threshold",
            ]}
            correctIndex={1}
            explanation="2 touches minimum confirm the zone exists, 3 touches raise the confidence level and confirm the market's collective memory. A single touch remains an unconfirmed one-off level."
          />

          <LessonQuiz
            question="A resistance has just been broken to the upside with a clean close. Price then retraces toward the zone. Which signal validates the flip and allows a long entry on the zone now turned support?"
            options={[
              "Price simply returning to the zone is enough",
              "A rejection signal (pin bar, engulfing, clean reaction) at contact with the zone",
              "A break of the next zone",
              "No signal required, the entry is mechanical",
            ]}
            correctIndex={1}
            explanation="Without a rejection signal at contact with the flipped zone, the flip isn't validated. A pin bar, an engulfing or a clean reaction confirm the zone is playing its new role as support."
          />

          <LessonQuiz
            question="A candle prints a wick beyond a strong resistance, then closes below the edge. What additional confirmation is required before considering a short fake breakout trade?"
            options={[
              "A second candle that holds or reinforces the reintegration into the zone",
              "No confirmation, the entry is taken on the rejected wick",
              "A break of the next zone",
              "A full retracement toward the opposite zone",
            ]}
            correctIndex={0}
            explanation="The double confirmation (close of the rejection candle inside the zone + a second candle that holds the reintegration) filters out one-off rejections that ultimately turn into a valid break. Entering on the initial wick exposes you to high risk."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "support-resistance", "lecon4");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 4 of the Support / Resistance &amp; Range module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/support-resistance/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 3
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Module completed
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-600 border border-zinc-700">
                  ✓
                </span>
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
