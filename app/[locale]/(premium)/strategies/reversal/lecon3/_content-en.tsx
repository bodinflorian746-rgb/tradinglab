"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import RSIDivergenceDiagram from "@/app/components/charts/RSIDivergenceDiagram";
import DivergenceTypesComparisonDiagram from "@/app/components/charts/DivergenceTypesComparisonDiagram";
import DivergenceWithoutBreakoutDiagram from "@/app/components/charts/DivergenceWithoutBreakoutDiagram";

const LESSONS = [
  { id: "lecon1", slug: "lecon1", title: "Double top / Double bottom: the reversal signature", duration: "16 min", disabled: false },
  { id: "lecon2", slug: "lecon2", title: "Head & Shoulders: the major reversal", duration: "18 min", disabled: false },
  { id: "lecon3", slug: "lecon3", title: "RSI divergence: when momentum betrays the trend", duration: "17 min", disabled: false },
  { id: "lecon4", slug: "lecon4", title: "Lesson 4", duration: "", disabled: true },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "reversal", "lecon3"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Strategies</Link>
          <span>/</span>
          <Link href="/strategies/reversal" className="hover:text-zinc-400 transition-colors">Reversal &amp; Reversals</Link>
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
            RSI divergence: when momentum betrays the trend
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Price can keep climbing or dropping visually while the momentum behind the move is already starting to weaken. RSI divergence is exactly what makes that phenomenon visible. It&apos;s a powerful signal when read well, but also one of the classic beginner traps when used without confirmation.
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

        {/* ── Content ── */}
        <div className="space-y-8">

          {/* Block 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo;Price can lie. Momentum, rarely.&rdquo;
              </p>
            </div>
          </section>

          {/* Block 2 — PREREQUISITES */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Market structure HH/HL/LL/LH → see Trading Course L3</li>
              <li>- RSI indicator, momentum oscillator → see Trading Course L4</li>
              <li>- Double Top / Head &amp; Shoulders → see Reversal Strategy L1 or L2</li>
            </ul>
          </div>

          {/* Block 3 — WHY IT WORKS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Why RSI divergence works</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">The RSI, or Relative Strength Index, is an oscillator that measures the strength of a move between 0 and 100. Above 70, the market enters overbought territory. Below 30, it enters oversold territory. In this lesson, the exact RSI value matters less than its direction relative to price.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">A divergence appears when price and RSI no longer point in the same direction. Price can keep making a new high while the RSI drops. Or the other way around, price can make a new low while the RSI climbs. This shows the trend is continuing visually, but losing strength underneath.</p>
            <p className="text-zinc-300 leading-relaxed text-sm">The RSI measures the true momentum of the candles: their size, their speed and their succession. When price climbs toward a new high with weaker, less aggressive candles, the RSI detects it immediately. It&apos;s one of the few tools able to show information invisible on raw price. But for a beginner, a powerful signal also becomes a powerful trap if the filters aren&apos;t respected.</p>
          </section>

          {/* Block 4 — BEARISH DIVERGENCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Bearish divergence: an uptrend that weakens</h2>
            <div className="my-8">
              <RSIDivergenceDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">A bearish divergence appears in an uptrend. Price makes two ascending peaks, so two Higher Highs. In parallel, the RSI makes two descending peaks, so two Lower Highs. Price climbs while the RSI drops. That&apos;s the signal the uptrend is starting to lose its momentum.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">The 3 conditions for a valid bearish divergence:</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- A clear prior uptrend with at least 2 identifiable peaks</li>
              <li>- The 2nd price peak must be strictly higher than the 1st</li>
              <li>- The 2nd RSI peak must be strictly lower than the 1st</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Example on XAU/USD. Price climbs to a first peak at $4,600, then drops back toward $4,570. Next, it heads back up to a new peak at $4,640, so a HH. But on the H1 RSI, the first peak had reached 75 while the second only climbs to 68. Bearish divergence confirmed.</p>
          </section>

          {/* Block 5 — THE 4 TYPES OF DIVERGENCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The 4 types of divergence</h2>
            <div className="my-8">
              <DivergenceTypesComparisonDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Divergence comes in 4 types depending on the direction of price and RSI. The regular ones (bearish + bullish) announce a reversal. The hidden ones (bearish + bullish) signal a continuation of the trend.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="text-white font-semibold">Regular bearish</span>, price HH + RSI LH = potential bearish reversal.</li>
              <li>- <span className="text-white font-semibold">Regular bullish</span>, price LL + RSI HL = potential bullish reversal.</li>
              <li>- <span className="text-white font-semibold">Hidden bearish</span>, price LH + RSI HH = bearish continuation (to avoid for a beginner).</li>
              <li>- <span className="text-white font-semibold">Hidden bullish</span>, price HL + RSI LL = bullish continuation (to avoid for a beginner).</li>
            </ul>
          </section>

          {/* Block 6 — BULLISH DIVERGENCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Bullish divergence: a downtrend that weakens</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">A bullish divergence is the mirror of the bearish divergence. It forms in a downtrend. Price makes two descending lows, so two Lower Lows. Meanwhile, the RSI makes two ascending lows, so two Higher Lows. Price drops but the RSI climbs. This shows the downtrend is starting to run out of steam.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">The 3 conditions stay the same, mirrored:</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- A clear prior downtrend with at least 2 identifiable lows</li>
              <li>- The 2nd price low must be strictly lower than the 1st</li>
              <li>- The 2nd RSI low must be strictly higher than the 1st</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Example on XAU/USD. Price drops to a first low at $4,480, then climbs back toward $4,510. Next, it heads back down to a new low at $4,450, so a LL. But on the H1 RSI, the first low had touched 28 while the second climbs back to 35. Bullish divergence confirmed.</p>
          </section>

          {/* Block 7 — THE TRAP: DIVERGENCE WITHOUT A BREAK */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The trap: divergence without a break</h2>
            <div className="my-8">
              <DivergenceWithoutBreakoutDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">A divergence on its own, without a structure break, is a classic trap. As long as price keeps respecting its HH/HL or LH/LL structure, the trend stays valid even with a divergence present.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- The divergence signals a momentum exhaustion, not an actual reversal.</li>
              <li>- The break of the last structural low or peak stays mandatory to confirm the reversal.</li>
              <li>- Without a break, price can keep going in the trend direction despite the visible divergence.</li>
            </ul>
          </section>

          {/* Block 8 — BEARISH DIVERGENCE TRADE PLAN XAU/USD H1 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Trade plan: Bearish divergence XAU/USD H1</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">We pick up the bearish divergence context from Block 4. The trend stays bullish, price prints a HH at $4,640 and the RSI forms a LH at 68. The divergence is confirmed. But a divergence alone is never enough to go short. An extra confirmation is required.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">The classic confirmation is the break of the last ascending low. The low between the two peaks sits at $4,570. If price closes a candle below $4,570, the divergence is confirmed by market structure. That signal triggers the short entry.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">The short entry is just below the broken low, at $4,565. The classic SL would go above the second peak at $4,650, but that gives too weak an R/R. The tighter tactical SL goes above the second peak&apos;s wick at $4,605, i.e. $40 of risk. The TP follows the measured move: height between the second peak at $4,640 and the low at $4,570, i.e. $70, extended slightly to $80 below the broken low to get a round 2:1 R/R.</p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Short entry: $4,565 (below the broken low)</li>
                <li>- Stop loss: $4,605 ($40 above the 2nd peak&apos;s wick)</li>
                <li>- Take profit: $4,485 ($80, extended measured move)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">R/R calculation</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risk: 4,605 - 4,565 = $40</li>
                <li>- Potential gain: 4,565 - 4,485 = $80</li>
                <li>- R/R: 80 / 40 = 2:1</li>
                <li>- Tradeable setup.</li>
              </ul>
            </div>
          </section>

          {/* Block 9 — RETAIL CALCULATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Retail calculation</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Risk per trade adapts to your capital. On this 2:1 R/R setup, here&apos;s the breakdown by account size.</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- €300 account → 5% = €15 risk, €30 potential gain</li>
              <li>- €500 account → 3% = €15 risk, €30 potential gain</li>
              <li>- €1,000 account → 2% = €20 risk, €40 potential gain</li>
              <li>- €2,500 account → 2% = €50 risk, €100 potential gain</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">The 2:1 R/R stays solid. RSI divergence has a medium win rate when the pattern is clean and confirmed by the structure break. Without confirmation, the trap stays high.</p>
          </section>

          {/* Block 10 — FILTERS: WHEN NOT TO TAKE THE SETUP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Filters: when not to take the setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">1. Divergence without a structure break.</span> <span className="text-zinc-300">A divergence alone is never enough. As long as price keeps making HH/HL or LH/LL, the trend stays valid. The break of the last structural low or peak is required.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">2. Divergence on a small timeframe (M5 or M15).</span> <span className="text-zinc-300">Divergences on very small timeframes produce a ton of noise. Minimum timeframe: H1. H4 stays the cleanest.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">3. Hidden divergence mistaken for a regular one.</span> <span className="text-zinc-300">Hidden divergences are there to spot a continuation, not a reversal. The regular ones are prioritized for their superior readability.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">4. Major news in the window.</span> <span className="text-zinc-300">If FOMC, NFP or CPI comes within 30 minutes, the setup isn&apos;t taken. A news print can break the divergence completely.</span></div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Divergence = price and RSI point in opposite directions. Bearish divergence = price HH + RSI LH. Bullish divergence = price LL + RSI HL.",
              "A divergence alone is NEVER enough. The break of the last structural low/peak is required to confirm.",
              "Minimum H1, ideally H4. Divergences on small timeframes are noise.",
              "The regular divergence (reversal) is distinct from the hidden divergence (continuation). To start out, only the regular ones are to be traded.",
            ]}
          />

          <LessonExercice
            description="On XAU/USD H1: price makes a peak 1 at $4,720, drops to $4,690, then makes a peak 2 at $4,740. The RSI showed 78 at peak 1 and 72 at peak 2. Price has just closed at $4,685. Do you take the short setup?"
            steps={[
              "Check that price forms a HH: $4,740 > $4,720, OK",
              "Check that the RSI forms a LH: 72 < 78, OK, bearish divergence confirmed",
              "Confirm the structure break: close at $4,685 below the low at $4,690, OK",
              "Check that no major news is scheduled in the next 30 minutes",
              "Take the short entry at $4,685, SL above the peak 2 wick (for example $4,750), TP extended measured move toward $4,585 to target a 1.5 to 2:1 R/R",
            ]}
          />

          <LessonQuiz
            question="Is an RSI divergence alone enough to enter a position?"
            options={[
              "Yes, it's a strong signal on its own",
              "No, you need a structure break to confirm",
              "Yes, but only on H1",
              "No, you need a moving average on top",
            ]}
            correctIndex={1}
            explanation="A divergence alone is NEVER enough. As long as price keeps respecting its structure (HH/HL up or LH/LL down), the trend stays valid. It's the break of the last structural low/peak that confirms and triggers the entry."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "reversal", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 3 of the Reversal &amp; Reversals module completed.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/reversal/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 2
              </Link>
              <Link href="/strategies/reversal/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Lesson 4
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
