"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { OrderBlockDiagram } from "@/app/components/charts/OrderBlockDiagram";
import OBFreshnessDiagram from "@/app/components/charts/OBFreshnessDiagram";
import OBExecutionPlanDiagram from "@/app/components/charts/OBExecutionPlanDiagram";
import OBSLPlacementDiagram from "@/app/components/charts/OBSLPlacementDiagram";
import MitigationZoneEntryDiagram from "@/app/components/charts/MitigationZoneEntryDiagram";

const LESSONS = [
  { id: "lecon1", title: "Lesson 1", disabled: false },
  { id: "lecon2", title: "Lesson 2", disabled: false },
  { id: "lecon3", title: "Order Blocks: identifying institutional zones", disabled: false },
  { id: "lecon4", title: "Lesson 4", disabled: true },
  { id: "lecon5", title: "Lesson 5", disabled: true },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "smc", "lecon3"));
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
          <span className="text-zinc-500">Lesson 3</span>
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
            Order Blocks: identifying institutional zones
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Order Blocks (OB) are the institutional memory zones where significant orders were placed before an impulse. This lesson covers the identification procedure, the qualification criteria, the numbered execution plan and the traps to avoid.
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
            <span className="ml-auto text-xs text-zinc-600">3 / 5 lessons</span>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="space-y-8">

          {/* Block 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo;An Order Block is not a theoretical zone. It is the visible footprint of the last institutional order before the impulse.&rdquo;
              </p>
            </div>
          </section>

          {/* Block 2 — PREREQUISITES */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- SMC Market Structure, swings, phases → see SMC Strategy L1</li>
              <li>- BOS and CHoCH, structural break → see SMC Strategy L2</li>
              <li>- Impulse candle, displacement → see Trading Course L2</li>
            </ul>
          </div>

          {/* Block 3 — IDENTIFYING AN ORDER BLOCK */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Identifying an Order Block</h2>
            <div className="my-8">
              <OrderBlockDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Identifying an Order Block follows a strict 4-step procedure. Skipping any of these steps leads to qualifying a non-institutional zone as an OB.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">1. Directional impulse.</span> <span className="text-zinc-300">A clean move with range above average that produces a BOS. 3 to 8 candles on H4 or Daily.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">2. Opposite candle preceding the impulse.</span> <span className="text-zinc-300">For a bullish impulse: the last bearish candle. For a bearish one: the last bullish candle. The footprint of the last institutional order.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">3. Validation by BOS.</span> <span className="text-zinc-300">The impulse following the opposite candle MUST produce a validated BOS. Without a BOS: just a reaction zone, not an OB.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">4. Precise delimitation.</span> <span className="text-zinc-300">The body of the opposite candle = boundaries. High open / low close for a bullish OB. Exact coordinates define entry and SL.</span></div>
            </div>
          </section>

          {/* Block 4 — FRESH OB vs MITIGATED OB */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Fresh OB vs mitigated OB</h2>
            <div className="my-8">
              <OBFreshnessDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">A fresh OB (never retested) shows a higher reaction rate than a consumed OB. Freshness directly conditions how tradable the setup is.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Fresh OB: fewer than 20 H4 candles since formation, never re-crossed. A full institutional reaction is expected.</li>
              <li>- Mitigated OB: price has already fully re-crossed the body zone. Orders executed, OB consumed, setup not tradable.</li>
            </ul>
          </section>

          {/* Block 5 — CRITERIA FOR A TRADABLE OB */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Criteria for a tradable OB</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">4 criteria qualify an OB as operationally tradable. An OB that fails these criteria is still structurally present but exposes you to a reduced win rate.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">1. OB freshness.</span> <span className="text-zinc-300">Fewer than 20 H4 candles since formation. Beyond that, the institutional player may have accumulated elsewhere.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">2. Associated FVG in the impulse.</span> <span className="text-zinc-300">Gap between wicks with no overlap. Signals a violent impulse. Increases the probability of a reaction on retest.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">3. Multi-timeframe alignment.</span> <span className="text-zinc-300">H4 OB + aligned Daily bias. Price above the 200MA for a bullish OB, below for a bearish OB.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">4. No prior mitigation.</span> <span className="text-zinc-300">Price has not yet fully re-crossed the zone. Full mitigation consumes the OB.</span></div>
            </div>
          </section>

          {/* Block 6 — OB SETUP EXECUTION PLAN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">OB setup execution plan</h2>
            <div className="my-8">
              <OBExecutionPlanDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">The execution plan follows a strict structure of 4 elements. Valid for a bullish OB (long entry on retest) and a bearish OB (short entry on retest).</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">1. Entry level.</span> <span className="text-zinc-300">Outer boundary of the OB body: high boundary (bullish), low boundary (bearish). An M15 rejection signal confirms.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">2. Stop loss placement.</span> <span className="text-zinc-300">Beyond the extreme wick, 5-10 pip buffer on EUR/USD or $5-10 on XAU/USD. NEVER inside the body.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">3. Take profit placement.</span> <span className="text-zinc-300">R/R ratio 1:2 minimum. Target: next HH, supply zone, or measured projection of the initial impulse.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">4. Position size.</span> <span className="text-zinc-300">Risk per trade: 5% for €300, 3% for €500, 2% for €1,000+. Lot calculated on the entry-SL distance.</span></div>
            </div>
          </section>

          {/* Block 7 — STOP LOSS PLACEMENT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Stop Loss placement</h2>
            <div className="my-8">
              <OBSLPlacementDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">SL placement determines the survival of the trade. 3 possible positions, only one is correct.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="text-red-400 font-semibold">SL inside the zone</span>: a normal wick on retest triggers the SL before the reaction. Setup killed by a stop hunt.</li>
              <li>- <span className="text-amber-400 font-semibold">SL at the boundary</span>: zero tolerance for retest wicks. High risk of premature invalidation.</li>
              <li>- <span className="text-emerald-400 font-semibold">SL with buffer (correct)</span>: 5-10 pips beyond the extreme wick. Absorbs secondary wicks.</li>
            </ul>
          </section>

          {/* Block 8 — MITIGATION ZONE AFTER CHoCH */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Mitigation zone after CHoCH</h2>
            <div className="my-8">
              <MitigationZoneEntryDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">After a CHoCH (see SMC Strategy L2), the broken former structural level becomes a mitigation OB zone to enter in the new direction. A precise entry setup with a tight stop.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- The ex-HL becomes resistance (bearish CHoCH), the ex-LH becomes support (bullish CHoCH).</li>
              <li>- Entry on the retest of the zone with an M15 rejection signal.</li>
              <li>- Tight stop loss beyond the zone, take profit on a structural projection.</li>
            </ul>
          </section>

          {/* Block 9 — COMMON MISTAKES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Common mistakes on Order Blocks</h2>
            <div className="space-y-3">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">1. Identifying an OB without a validated BOS</p>
                <p className="text-zinc-300 text-sm">An isolated opposite candle with no impulse or structural break = a worthless zone. Always validate the clear impulse and the BOS before qualifying.</p>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">2. Trading an already-mitigated OB</p>
                <p className="text-zinc-300 text-sm">If price has fully re-crossed the zone, the institutional orders are consumed. Favor fresh OBs less than 20 H4 candles old.</p>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">3. SL placed inside the OB zone</p>
                <p className="text-zinc-300 text-sm">A normal wick on retest triggers the SL. Place it beyond the extreme wick with a 5-10 pip buffer, never inside the body.</p>
              </div>
            </div>
          </section>

          {/* Block 10 — EUR/USD H4 TRADE PLAN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Trade plan: bullish OB EUR/USD H4</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">EUR/USD in a confirmed H4 uptrend. Price above the Daily 200MA (1.1500) and the Daily 50MA (1.1700). A 4-candle bullish impulse from 1.1740 to 1.1830, validated by a BOS above the previous HH at 1.1820. Opposite candle preceding the impulse: body 1.1780 (open) / 1.1752 (close), low wick 1.1745. OB zone: 1.1752-1.1780, fresh OB (5 candles since formation), aligned with the Daily, unmitigated.</p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entry: 1.1780 (high boundary of the OB body, limit order or waiting for the M15 signal)</li>
                <li>- Stop loss: 1.1752 (28 pips below entry, beyond the low wick 1.1745 with a 7-pip buffer)</li>
                <li>- Take profit: 1.1858 (78 pips above, extension projection of the initial impulse)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">R/R calculation</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risk: 1.1780 - 1.1752 = 28 pips</li>
                <li>- Potential gain: 1.1858 - 1.1780 = 78 pips</li>
                <li>- R/R: 78 / 28 = 2.79</li>
                <li>- Setup tradable.</li>
              </ul>
            </div>
          </section>

          {/* Block 11 — RETAIL CALCULATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Retail calculation</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Risk per trade by account size applied to this setup.</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- €300 account → 5% = €15 risk, €42 potential gain</li>
              <li>- €500 account → 3% = €15 risk, €42 potential gain</li>
              <li>- €1,000 account → 2% = €20 risk, €56 potential gain</li>
              <li>- €2,500 account → 2% = €50 risk, €140 potential gain</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">The R/R stays 2.79:1 regardless of account size. What changes is the lot size and the risk percentage adapted to the capital.</p>
          </section>

          <LessonKeyPoints
            points={[
              "An Order Block is the last opposite-direction candle preceding an impulse validated by a BOS. The identification procedure follows 4 strict steps.",
              "4 criteria qualify a tradable OB: freshness (fewer than 20 H4 candles), associated FVG, multi-timeframe alignment, no prior mitigation.",
              "The entry is placed at the outer boundary of the OB body with an M15 rejection signal. The SL beyond the extreme wick, never inside the body.",
              "The minimum R/R is 1:2. The TP targets the next structural zone or the measured projection of the initial impulse.",
            ]}
          />

          <LessonExercice
            description="On XAU/USD H4, a confirmed uptrend (price above the Daily 200MA at $4,320). A 5-candle bullish impulse carried price from $4,540 to $4,660, validated by a BOS above the previous HH at $4,650. The last bearish candle before the impulse has a body between $4,562 (open) and $4,555 (close), with a low wick at $4,547. No mitigation since formation (8 H4 candles elapsed). Price is currently retracing toward the zone. Build the full plan and calculate two R/R variants: naive variant (distant TP) and realistic variant (intermediate partial TP)."
            steps={[
              "Delimit the bullish Order Block: body of the opposite candle between $4,555 and $4,562, low wick at $4,547. Fresh OB (8 candles elapsed), aligned with the bullish Daily, unmitigated.",
              "Place the entry at $4,562 (high boundary of the OB body) waiting for the M15 rejection signal (pin bar, bullish engulfing).",
              "Place the stop loss at $4,549 ($13 below entry, beyond the low wick $4,547 with a $2 buffer). Risk = $13 per unit.",
              "Naive variant. Distant TP at $4,720 (full extension projection of the initial impulse): Gain = 4,720 - 4,562 = $158. R/R = 158 / 13 = 12.3. An attractive ratio on paper but too optimistic: the probability of reaching a 12:1 target without an intermediate pullback stays low.",
              "Realistic variant. Partial TP at $4,632 (first intermediate HH identified, partial profit-taking): Gain = 4,632 - 4,562 = $70. R/R = 70 / 13 = 5.4. A realistic structural target, reachable without a detour. The 5.4 R/R remains excellent for an OB setup and lets you secure the position before the previous HH at $4,650, where the market is likely to produce a technical reaction before the final TP.",
            ]}
          />

          <LessonQuiz
            question="Which element structurally validates the qualification of an opposite candle as a tradable Order Block?"
            options={[
              "The opposite candle must have high volume",
              "The impulse following the opposite candle must produce a validated BOS",
              "The OB must form in an RSI overbought zone",
              "The opposite candle must be red",
            ]}
            correctIndex={1}
            explanation="Without a validated BOS after the opposite candle, the impulse remains hypothetical and the opposite candle is just a local change, not a tradable Order Block. The structural break (BOS) confirms that significant institutional orders were actually placed at the zone and trigger the impulse that follows."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "smc", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 3 of the SMC: Think institutional module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/smc/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 2
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lesson 4. Coming up
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
