"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import BOSCHoCHSequenceDiagram from "@/app/components/charts/BOSCHoCHSequenceDiagram";
import { LiquidityGrabDiagram } from "@/app/components/charts/LiquidityGrabDiagram";
import MitigationZoneEntryDiagram from "@/app/components/charts/MitigationZoneEntryDiagram";

const LESSONS = [
  { id: "lecon1", title: "Lesson 1", disabled: false },
  { id: "lecon2", title: "Lesson 2", disabled: false },
  { id: "lecon3", title: "Lesson 3", disabled: false },
  { id: "lecon4", title: "Lesson 4", disabled: false },
  { id: "lecon5", title: "The complete SMC trade: from HTF analysis to execution", disabled: false },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "smc", "lecon5"));
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
          <span className="text-zinc-500">Lesson 5</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Intermediate
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
            The complete SMC trade: from HTF analysis to execution
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              This lesson assembles the whole SMC module into a complete operational workflow. The institutional logic is rebuilt step by step: HTF reading, liquidity identification, sweep, structural confirmation, mitigation and execution.
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
              const isCurrent = lesson.id === "lecon5";
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
            <span className="ml-auto text-xs text-zinc-600">5 / 5 lessons</span>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="space-y-8">

          {/* Block 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo;An SMC trade is not an isolated signal. It is a sequence: liquidity → sweep → displacement → mitigation → execution.&rdquo;
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
              <li>- FVG &amp; Liquidity → see SMC Strategy L4</li>
            </ul>
          </div>

          {/* Block 3 — THE COMPLETE INSTITUTIONAL SEQUENCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The complete institutional sequence</h2>
            <div className="my-8">
              <BOSCHoCHSequenceDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">The SMC model rests on a succession of coherent steps. Structure (BOS/CHoCH) gives the bias and context, then the mitigation of the FVG or Order Block provides the entry.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">The 7 steps of the SMC trade</p>
            <ol className="space-y-1 text-sm text-zinc-300 list-decimal pl-5">
              <li>HTF analysis: determine the directional bias via market structure</li>
              <li>Identify the liquidity (BSL/SSL) that will be the target</li>
              <li>Wait for the sweep of the opposite liquidity</li>
              <li>Confirm the CHoCH on the entry timeframe</li>
              <li>Spot the Order Block or FVG in the displacement</li>
              <li>Enter on the mitigation of that zone</li>
              <li>Manage: SL beyond the zone, TP on the targeted liquidity</li>
            </ol>
          </section>

          {/* Block 4 — READING STRUCTURE AND LIQUIDITY */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Reading structure and liquidity</h2>
            <div className="my-8">
              <LiquidityGrabDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">The HTF bias gives the priority direction of the trade. Liquidity then identifies the zones where institutions will look to provoke the move before the real impulse. The sweep generally appears as an aggressive wick followed by a quick reintegration.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">What to watch</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- HTF structure in LH/LL = bearish bias</li>
              <li>- Equal highs/lows = tradable liquidity</li>
              <li>- Sweep = stop grab + quick rejection</li>
            </ul>
          </section>

          {/* Block 5 — CONFIRM AND EXECUTE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Confirm and execute</h2>
            <div className="my-8">
              <MitigationZoneEntryDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">The CHoCH confirms that control of the market changes sides on the entry timeframe. The displacement then leaves an Order Block or FVG that will serve as a mitigation zone. The entry occurs when price returns into this zone before the impulsive continuation.</p>
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Execution logic</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- CHoCH = structural confirmation</li>
              <li>- FVG/OB = institutional entry zone</li>
              <li>- Mitigation = optimization of the risk/reward ratio</li>
            </ul>
          </section>

          {/* Block 6 — EUR/USD H4 TRADE PLAN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Complete worked trade plan (EUR/USD H4)</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">EUR/USD H4. Bearish HTF bias with structure in LH/LL. Equal highs at 1.1780 = identified BSL. Final target: SSL below the 1.1690 low. An H4 candle sweeps the BSL printing a wick at 1.1792 then closes at 1.1772. Price then breaks the last minor low at 1.1755: bearish CHoCH confirmed. The displacement leaves a bearish FVG between 1.1758 and 1.1770 with an Order Block just above.</p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Walkthrough of the 7 steps</p>
              <ol className="space-y-1 text-sm text-zinc-300 list-decimal pl-5 mb-4">
                <li>HTF analysis: H4 structure in LH/LL · Bearish directional bias</li>
                <li>Identify the liquidity: Equal highs at 1.1780 · BSL clearly visible</li>
                <li>Liquidity sweep: Wick at 1.1792 · Immediate reintegration below the BSL</li>
                <li>CHoCH confirmation: Break of the minor low at 1.1755 · Bearish change of character confirmed</li>
                <li>Identify the entry zone: Bearish FVG 1.1758 → 1.1770 · Order Block just above</li>
                <li>Entry on mitigation: Return of price into the FVG · Short entry on mitigation</li>
                <li>Management: SL above the sweep wick · TP on the SSL at 1.1690</li>
              </ol>

              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Short entry: 1.1765</li>
                <li>- Stop loss: 1.1798</li>
                <li>- Take profit: 1.1690</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">R/R calculation</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-3">
                <li>- Risk: 1.1798 - 1.1765 = 33 pips</li>
                <li>- Gain: 1.1765 - 1.1690 = 75 pips</li>
                <li>- R/R: 75 / 33 = 2.27</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed text-sm">The potential return represents more than double the risk taken.</p>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Retail calculation</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- €300 account → 5% = €15 risk, €34 potential gain</li>
              <li>- €500 account → 3% = €15 risk, €34 potential gain</li>
              <li>- €1,000 account → 2% = €20 risk, €45 potential gain</li>
              <li>- €2,500 account → 2% = €50 risk, €113 potential gain</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">The R/R stays 2.27:1 regardless of account size.</p>
          </section>

          {/* Block 7 — THE MISTAKES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The mistakes that break the SMC trade</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">Mistake 1: Entering before the CHoCH</span> <span className="text-zinc-300">= no structural confirmation.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">Mistake 2: Confusing sweep and breakout</span> <span className="text-zinc-300">= buying/selling straight into the liquidity grab.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">Mistake 3: Ignoring the HTF bias</span> <span className="text-zinc-300">= execution against the dominant structure.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">Mistake 4: Targeting already-taken liquidity</span> <span className="text-zinc-300">= no clear institutional target.</span></div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "The HTF structure defines the bias.",
              "The sweep often precedes the real move.",
              "The CHoCH confirms the change of control.",
              "The FVG/OB provides the execution zone.",
            ]}
          />

          <LessonExercice
            description="On XAU/USD H4, the market moves within a bearish bias. The equal highs at $4,720 represent a visible BSL, and the main liquidity target sits on the SSL of the $4,600 low. An H4 candle sweeps the BSL with a wick at $4,735 then closes at $4,705. The market then breaks the minor low at $4,680 and creates a bearish FVG between $4,685 and $4,700. Price then returns into the zone. How do you rebuild the complete SMC trade on this setup?"
            steps={[
              "Set the HTF bias: the H4 structure is bearish (LH/LL). The bias points toward sell setups as a priority.",
              "Identify the liquidity: the equal highs at $4,720 form the BSL. The SSL of the $4,600 low becomes the final target of the trade.",
              "Validate the sweep: the wick at $4,735 takes the liquidity above $4,720, and the close at $4,705 confirms the reintegration below the BSL.",
              "Confirm the CHoCH: the break of the minor low at $4,680 validates the bearish change of character on the entry timeframe.",
              "Build the plan: short entry $4,692 (mitigation of the FVG $4,685-$4,700), stop loss $4,740 (above the sweep wick), take profit $4,600 (targets the SSL). Risk $48, gain $92, R/R ≈ 1.9.",
            ]}
          />

          <LessonQuiz
            question="Which sequence corresponds to the logical flow of a complete SMC trade?"
            options={[
              "Sweep → mitigation → BOS → liquidity → entry",
              "HTF analysis → sweep → entry → CHoCH → liquidity",
              "HTF analysis → liquidity → sweep → CHoCH → mitigation → execution",
              "Liquidity → breakout → entry → mitigation → BOS",
            ]}
            correctIndex={2}
            explanation="The SMC model rests on a sequential logic. The HTF bias defines the priority direction. Liquidity then draws price in before the sweep. Structure (BOS/CHoCH) gives the bias and context, then the mitigation of the FVG or Order Block provides the entry."
          />

          <LessonQuiz
            question="Which element most often distinguishes a sweep from a real impulsive breakout?"
            options={[
              "Price closes above the level with immediate continuation",
              "Price quickly reintegrates the zone after taking the liquidity",
              "The sweep never leaves a wick",
              "The breakout only appears on the Daily timeframe",
            ]}
            correctIndex={1}
            explanation="The sweep mainly seeks to take the stops before the real move. The key characteristic therefore remains the quick reintegration of the swept level. A real breakout generally keeps its close beyond the broken level with immediate continuation."
          />

          <LessonQuiz
            question="In a bearish SMC setup, where is the most logical stop loss generally placed?"
            options={[
              "In the middle of the FVG",
              "Directly on the entry level",
              "Below the target SSL",
              "Above the wick that swept the liquidity",
            ]}
            correctIndex={3}
            explanation="The sweep wick often represents the extreme of the liquidity-grab move. Placing the stop loss beyond this zone lets the trade breathe while clearly invalidating the institutional scenario if the level is reclaimed."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "smc", "lecon5");
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
                  <p className="text-sm font-semibold text-emerald-400">SMC: Think institutional module completed</p>
                  <p className="text-xs text-zinc-500 mt-0.5">All lessons in the module have been completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/smc/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 4
              </Link>
              <Link href="/strategies/smc" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Back to the module
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M6 4l4 3-4 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
