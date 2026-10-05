"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import DoubleTopBottomDiagram from "@/app/components/charts/DoubleTopBottomDiagram";
import DTBValidationGridDiagram from "@/app/components/charts/DTBValidationGridDiagram";
import DTBMeasuredMoveProjectionDiagram from "@/app/components/charts/DTBMeasuredMoveProjectionDiagram";

const LESSONS = [
  { id: "lecon1", slug: "lecon1", title: "Double top / Double bottom: the reversal signature", duration: "16 min", disabled: false },
  { id: "lecon2", slug: "lecon2", title: "Lesson 2", duration: "", disabled: true },
  { id: "lecon3", slug: "lecon3", title: "Lesson 3", duration: "", disabled: true },
  { id: "lecon4", slug: "lecon4", title: "Lesson 4", duration: "", disabled: true },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "reversal", "lecon1"));
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
          <span className="text-zinc-500">Lesson 1</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Beginner
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
            Double top / Double bottom: the reversal signature
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Spotting a reversal before it&apos;s too late is what separates keeping your gains from handing them all back. The double top and the double bottom are the two easiest reversal patterns to spot. This lesson shows how to identify and trade them.
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
              const isCurrent = lesson.id === "lecon1";
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
            <span className="ml-auto text-xs text-zinc-600">1 / 4 lessons</span>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="space-y-8">

          {/* Block 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo;When the market fails twice at the same price, it&apos;s no longer chance. It&apos;s a signal.&rdquo;
              </p>
            </div>
          </section>

          {/* Block 2 — PREREQUISITES */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Market structure HH/HL/LL/LH → see Trading Course L3</li>
              <li>- Support / Resistance → see SR Strategy L1</li>
              <li>- Breakout candle, close vs wick → see Trading Course L2</li>
            </ul>
          </div>

          {/* Block — WHY THESE PATTERNS WORK */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Why these patterns work</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">When price hits a resistance, drops back, then comes back to test that same level without breaking it, that&apos;s a clear signal. Buyers no longer have enough strength to push above it. The market is showing that level is defended. As a mirror, the double bottom shows the same logic on a support.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">A double top isn&apos;t just a drawing on a chart. It&apos;s the visible expression of an imbalance. At each test of the level, sellers take profits or new sellers step in. On the second failure, the ones who were long on the pullback start to exit, which accelerates the drop.</p>
            <p className="text-zinc-300 leading-relaxed text-sm">This pattern stays accessible to retail because it reads fast. Unlike ICT concepts or complex structures, a double top shows up in 5 seconds. No need for 6 indicators to spot it.</p>
          </section>

          {/* Block 3 — DOUBLE TOP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Double Top: end of an uptrend</h2>
            <div className="my-8">
              <DoubleTopBottomDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">A double top forms at the end of an uptrend. Price hits a resistance, drops back slightly and forms a low called the neckline. It climbs back to test the same resistance level. If it fails to break it and drops, the pattern is complete. Confirmation arrives when price breaks the neckline below the intermediate low.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">The 3 conditions for a valid double top:</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- A clear prior uptrend (HH/HL)</li>
              <li>- Two near-equal peaks (tolerated gap: 0.2% maximum)</li>
              <li>- A confirmed neckline break (close, not just a wick)</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Example on EUR/USD. The market has been bullish for several days. It hits a resistance at 1.1880 and drops back toward 1.1800. It climbs back to test 1.1895, nearly equal to the first peak, then fails. It drops back and a candle closes below 1.1800. Double top confirmed.</p>
          </section>

          {/* Block 4 — VALIDATE THE PATTERN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Validate the pattern</h2>
            <div className="my-8">
              <DTBValidationGridDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Validating a double top or bottom follows 4 strict criteria. A single missing one structurally invalidates the pattern.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">1. Clear prior trend.</span> <span className="text-zinc-300">No range before the peaks/lows. The HH/HL or LH/LL structure must be clean.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">2. Gap ≤ 0.3%.</span> <span className="text-zinc-300">On EUR/USD: 30 pips maximum between the 2 peaks/lows. Beyond that: pattern not valid.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">3. Break by close.</span> <span className="text-zinc-300">A clean candle close below (or above) the neckline. Wick alone = test, not confirmation.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">4. No major news.</span> <span className="text-zinc-300">FOMC, NFP, CPI within 30 minutes: the pattern can break in any direction.</span></div>
            </div>
          </section>

          {/* Block 5 — DOUBLE BOTTOM */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Double Bottom: end of a downtrend</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">The double bottom is the perfect mirror of the double top. Price hits a support, climbs slightly and forms a neckline. It drops back to test the same support. If it fails to break it and climbs back, the pattern is complete. Confirmation arrives when price breaks the neckline above the intermediate high.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">The 3 conditions, mirrored:</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- A clear prior downtrend (LH/LL)</li>
              <li>- Two near-equal lows</li>
              <li>- A confirmed neckline break (close above)</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Example on XAU/USD. The market has been bearish for 2 days. It hits a support at $4,480 and climbs toward $4,520. It drops back to test $4,478 and rejects. It climbs back and a candle closes above $4,520. Double bottom confirmed.</p>
          </section>

          {/* Block 6 — TAKE PROFIT PROJECTION (MEASURED MOVE) */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Take Profit projection (measured move)</h2>
            <div className="my-8">
              <DTBMeasuredMoveProjectionDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">The take profit of a double top/bottom follows the measured move principle: the height of the pattern (from the peak to the neckline) is projected from the neckline in the direction of the break.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Pattern height = distance peak (or low) → neckline.</li>
              <li>- Theoretical TP = neckline ± pattern height, depending on the break direction.</li>
              <li>- TP adjusted by a few pips to get a round R/R (2:1 or 3:1).</li>
            </ul>
          </section>

          {/* Block 7 — TRADE PLAN EUR/USD H1 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Trade plan: Double Top EUR/USD H1</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">We pick up the EUR/USD double top context from Block 3. Prior uptrend, two peaks at 1.1880 and 1.1895, neckline at 1.1800. Price has just closed an H1 candle at 1.1795, below the neckline. Pattern confirmed.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">The entry is short just below the neckline to catch the breakdown. You don&apos;t chase a price that&apos;s already diving. A clean confirmation with a close below the neckline is required. The SL goes above the last peak to cleanly invalidate the pattern. The TP follows the measured move: the pattern height, from the peak to the neckline, is projected down from the neckline.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Pattern height: 1.1880 - 1.1800 = 80 pips. Theoretical projection below the neckline: 1.1720. The TP is taken 5 pips lower at 1.1715 to get a round 2:1 R/R (40 pips of risk, 80 pips of gain).</p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Short entry: 1.1795 (close below neckline)</li>
                <li>- Stop loss: 1.1835 (40 pips above the 2nd peak&apos;s wick)</li>
                <li>- Take profit: 1.1715 (80 pips, adjusted measured move)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">R/R calculation</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risk: 1.1835 - 1.1795 = 40 pips</li>
                <li>- Potential gain: 1.1795 - 1.1715 = 80 pips</li>
                <li>- R/R: 80 / 40 = 2:1</li>
                <li>- Tradeable setup.</li>
              </ul>
            </div>
          </section>

          {/* Block 8 — RETAIL CALCULATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Retail calculation</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Risk per trade adapts to your capital. On this 2:1 R/R setup, here&apos;s the breakdown by account size.</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- €300 account → 5% = €15 risk, €30 potential gain</li>
              <li>- €500 account → 3% = €15 risk, €30 potential gain</li>
              <li>- €1,000 account → 2% = €20 risk, €40 potential gain</li>
              <li>- €2,500 account → 2% = €50 risk, €100 potential gain</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">The 2:1 R/R stays constant regardless of account size. What changes is the lot size and the risk percentage adapted to the capital.</p>
          </section>

          {/* Block 9 — FILTERS: WHEN NOT TO TAKE THE SETUP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Filters: when not to take the setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">1. No clear prior trend.</span> <span className="text-zinc-300">If the market was in a range before the 2 peaks/lows, it&apos;s not a reversal. Skip the setup.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">2. Gap too large between peaks/lows.</span> <span className="text-zinc-300">Beyond 0.3% (30 pips on EUR/USD), the mechanics are no longer those of a double top. Pattern not valid.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">3. Break on a wick, without a close.</span> <span className="text-zinc-300">A wick that pokes below the neckline then comes back above confirms nothing. Wait for the clean close.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">4. Major news in the window.</span> <span className="text-zinc-300">FOMC, NFP, CPI within 30 minutes: the setup isn&apos;t taken. The news can break the pattern in any direction.</span></div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Double top = 2 near-equal peaks on a resistance after an uptrend. Double bottom = mirror on a support.",
              "Confirmation = a close (not a wick) on the other side of the neckline.",
              "Entry just after the break. SL beyond the last peak/low. TP = measured move (pattern height projected).",
              "Skip the setup if the prior trend isn't clear, if the gap exceeds 0.3%, or if major news is coming.",
            ]}
          />

          <LessonExercice
            description="On EUR/USD H1, you see a double top with a first peak at 1.1850 and a second at 1.1825. Gap: 25 pips, about 0.23%. The neckline is at 1.1750. Price closes at 1.1745. Do you take the setup?"
            steps={[
              "Check that the gap between the 2 peaks stays under the limit: 0.23% < 0.3%. OK",
              "Confirm the break is by a close below 1.1750, not just a wick. OK",
              "Check that the prior uptrend is clear (HH/HL)",
              "Check that no major news is scheduled in the next 30 minutes",
              "Take the short entry at 1.1745, SL above the 2nd peak, TP measured move",
            ]}
          />

          <LessonQuiz
            question="What confirms a double top?"
            options={[
              "The second peak touching the resistance",
              "A wick poking below the neckline",
              "A candle close below the neckline",
              "Very high volume",
            ]}
            correctIndex={2}
            explanation="A double top is confirmed only when price closes a candle below the neckline. A simple wick that pokes below then comes back above validates nothing, waiting for a clean close stays essential to avoid false signals."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "reversal", "lecon1");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 1 of the Reversal &amp; Reversals module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/reversal" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to module
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lesson 2. Coming soon
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
