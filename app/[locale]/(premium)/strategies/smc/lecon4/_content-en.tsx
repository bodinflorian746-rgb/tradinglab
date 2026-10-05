"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LiquidityPoolsDiagram } from "@/app/components/charts/LiquidityPoolsDiagram";
import { LiquidityGrabDiagram } from "@/app/components/charts/LiquidityGrabDiagram";
import { FVGDiagram } from "@/app/components/charts/FVGDiagram";

const LESSONS = [
  { id: "lecon1", title: "Lesson 1", disabled: false },
  { id: "lecon2", title: "Lesson 2", disabled: false },
  { id: "lecon3", title: "Lesson 3", disabled: false },
  { id: "lecon4", title: "FVG and liquidity: trading the institutional imbalance", disabled: false },
  { id: "lecon5", title: "Lesson 5", disabled: true },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "smc", "lecon4"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Strategies</Link>
          <span>/</span>
          <Link href="/strategies/smc" className="hover:text-zinc-400 transition-colors">SMC: Think institutional</Link>
          <span>/</span>
          <span className="text-zinc-500">Lesson 4</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Intermediate
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
            FVG and liquidity: trading the institutional imbalance
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              The market does not move solely through trend or structure. The most aggressive moves often appear after a liquidity grab followed by a price imbalance. This lesson links 3 operational concepts: liquidity (BSL/SSL), the sweep and the Fair Value Gap (FVG).
            </p>
          </div>

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
            <span className="ml-auto text-xs text-zinc-600">4 / 5 lessons</span>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="space-y-8">

          {/* Block 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo;Retail sees a breakout. Institutions see a pool of stops to sweep before the real move.&rdquo;
              </p>
            </div>
          </section>

          {/* Block 2 — PREREQUISITES */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Market Structure → see SMC Strategy L1</li>
              <li>- BOS / CHoCH → see SMC Strategy L2</li>
              <li>- Order Blocks → see SMC Strategy L3</li>
            </ul>
          </div>

          {/* Block 3 — LIQUIDITY POOLS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Liquidity pools</h2>
            <div className="my-8">
              <LiquidityPoolsDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Liquidity zones correspond to the places where retail stops are concentrated. Recent highs attract sell stops (BSL), while recent lows concentrate buy stops (SSL). Equal highs and equal lows create obvious liquidity zones for institutions.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">What to spot</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Equal highs = potential BSL</li>
              <li>- Equal lows = potential SSL</li>
              <li>- HTF highs/lows = major liquidity</li>
            </ul>
          </section>

          {/* Block 4 — THE SWEEP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The sweep: the liquidity grab</h2>
            <div className="my-8">
              <LiquidityGrabDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">The sweep appears when price brutally crosses a liquidity zone before quickly reintegrating the prior range or structure. The wick takes the stops. The close rejects the move. The sweep often serves to fill institutional orders before the opposite impulse.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Sweep characteristics</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Quick piercing of a high or a low</li>
              <li>- Aggressive wick with visible rejection</li>
              <li>- Close reintegrated below/above the swept level</li>
            </ul>
          </section>

          {/* Block 5 — THE FAIR VALUE GAP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The Fair Value Gap (FVG)</h2>
            <div className="my-8">
              <FVGDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">The Fair Value Gap represents an imbalance left by a fast impulse. In a 3-candle sequence, a space remains untraded between the wick of candle 1 and that of candle 3. The market frequently returns to this zone to mitigate the inefficiency before continuing its move.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">FVG characteristics</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Appears within a strong impulse</li>
              <li>- Imbalance visible across 3 candles</li>
              <li>- Frequent return of price for mitigation</li>
            </ul>
          </section>

          {/* Block 6 — COMBINING SWEEP + FVG */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Combining sweep + FVG: the complete setup</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">The sweep often creates a brutal displacement that leaves an FVG in the rejection move. The return of price into the FVG then provides a more precise entry with a reduced stop.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Typical sequence</p>
            <ol className="space-y-1 text-sm text-zinc-300 list-decimal pl-5">
              <li>Liquidity identified (BSL/SSL)</li>
              <li>Sweep of the zone</li>
              <li>Aggressive displacement</li>
              <li>Creation of the FVG</li>
              <li>Return into the FVG</li>
              <li>Target toward the opposite liquidity</li>
            </ol>
          </section>

          {/* Block 7 — EUR/USD H4 TRADE PLAN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Worked trade plan (EUR/USD H4)</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">EUR/USD H4. Accumulation between 1.1700 and 1.1750. Equal highs at 1.1760 = identified BSL. An H4 candle pierces 1.1760 then closes at 1.1745. The rejection creates a bearish FVG between 1.1735 and 1.1748. The setup consists of waiting for price to return into the FVG to look for a short entry toward the SSL located below 1.1700.</p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Short entry: 1.1745</li>
                <li>- Stop loss: 1.1768</li>
                <li>- Take profit: 1.1700</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Reading the setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Bullish sweep above 1.1760</li>
                <li>- Immediate reintegration below the BSL</li>
                <li>- Aggressive bearish displacement</li>
                <li>- Creation of the bearish FVG</li>
                <li>- Return into the FVG = entry zone</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">R/R calculation</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-3">
                <li>- Risk: 1.1768 - 1.1745 = 23 pips</li>
                <li>- Gain: 1.1745 - 1.1700 = 45 pips</li>
                <li>- R/R: 45 / 23 = 1.96</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed text-sm">The setup offers a return almost twice the risk taken.</p>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Retail calculation</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- €300 account → 5% = €15 risk, €29 potential gain</li>
              <li>- €500 account → 3% = €15 risk, €29 potential gain</li>
              <li>- €1,000 account → 2% = €20 risk, €39 potential gain</li>
              <li>- €2,500 account → 2% = €50 risk, €98 potential gain</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">The R/R stays 1.96:1 regardless of account size.</p>
          </section>

          {/* Block 8 — FILTERS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Filters: when not to take the setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">Sweep without a clear FVG</span> <span className="text-zinc-300">= no tradable imbalance.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">FVG already fully mitigated</span> <span className="text-zinc-300">= inefficiency already filled.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">Context without directional bias</span> <span className="text-zinc-300">= no HTF direction.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">Major macro news imminent</span> <span className="text-zinc-300">= unpredictable volatility.</span></div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Liquidity concentrates above highs and below lows.",
              "The sweep sweeps the stops before the real move.",
              "The FVG represents an inefficiency left by the impulse.",
              "The complete SMC setup = sweep → displacement → FVG → mitigation.",
            ]}
          />

          <LessonExercice
            description="On XAU/USD H4, the market shows 2 equal highs at $4,680 and a recent low at $4,600. An H4 candle pierces $4,680, prints a wick at $4,690, then closes at $4,660. The following candles create a bearish FVG between $4,645 and $4,658. Price then returns into the FVG. How do you build the trade plan on this setup?"
            steps={[
              "Identify the liquidity: the 2 equal highs at $4,680 form a BSL. The wick at $4,690 confirms the sweep above the level.",
              "Confirm the rejection: the close at $4,660, below the equal highs, validates the reintegration, the breakout was a sweep, not a break.",
              "Locate the FVG: the bearish imbalance sits between $4,645 and $4,658. The return of price into this zone provides the short entry point.",
              "Lay out the plan: short entry $4,655 (inside the FVG), stop loss $4,695 (above the sweep wick), take profit $4,605 (targets the SSL below the $4,600 low).",
              "Calculate the R/R: risk $40, potential gain $50, R/R 1.25. The setup remains acceptable but offers a less favorable return than the EUR/USD H4 case.",
            ]}
          />

          <LessonQuiz
            question="Which characteristic most often distinguishes a sweep from a real institutional breakout?"
            options={[
              "The market closes above the broken level with strong continuation",
              "The sweep rarely leaves a visible wick",
              "Price quickly reintegrates the swept level after taking the liquidity",
              "A sweep only appears during macro news",
            ]}
            correctIndex={2}
            explanation="A sweep is recognized by the quick reintegration of the swept level after the liquidity has been taken. The wick pierces, the stops are triggered, then price returns below (or above) the level and rejects the move. A real institutional breakout would instead produce a clean close beyond the level with directional continuation."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "smc", "lecon4");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 4 of the SMC: Think institutional module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/smc/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 3
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lesson 5. Coming up
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
