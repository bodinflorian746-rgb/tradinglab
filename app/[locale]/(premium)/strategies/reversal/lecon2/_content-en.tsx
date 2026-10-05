"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import HeadShouldersDiagram from "@/app/components/charts/HeadShouldersDiagram";
import HSNecklineSlopeDiagram from "@/app/components/charts/HSNecklineSlopeDiagram";
import HSTradeExecutionDiagram from "@/app/components/charts/HSTradeExecutionDiagram";

const LESSONS = [
  { id: "lecon1", slug: "lecon1", title: "Double top / Double bottom: the reversal signature", duration: "16 min", disabled: false },
  { id: "lecon2", slug: "lecon2", title: "Head & Shoulders: the major reversal", duration: "18 min", disabled: false },
  { id: "lecon3", slug: "lecon3", title: "Lesson 3", duration: "", disabled: true },
  { id: "lecon4", slug: "lecon4", title: "Lesson 4", duration: "", disabled: true },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "reversal", "lecon2"));
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
          <span className="text-zinc-500">Lesson 2</span>
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
            Head &amp; Shoulders: the major reversal
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              The Head &amp; Shoulders is the most famous reversal pattern in technical trading. More complex than a double top, it becomes more reliable when it forms cleanly. This lesson shows how to spot it, validate it, and trade it with a modest R/R but a high win rate.
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
              const isCurrent = lesson.id === "lecon2";
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
            <span className="ml-auto text-xs text-zinc-600">2 / 4 lessons</span>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="space-y-8">

          {/* Block 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo;When the market makes 3 peaks and the 3rd fails below the previous one, it&apos;s rarely chance.&rdquo;
              </p>
            </div>
          </section>

          {/* Block 2 — PREREQUISITES */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Market structure, peaks and lows → see Trading Course L3</li>
              <li>- Support / Resistance → see SR Strategy L1</li>
              <li>- Double Top / Double Bottom → see Reversal Strategy L1</li>
            </ul>
          </div>

          {/* Block 3 — WHY THE H&S WORKS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Why the Head &amp; Shoulders works</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">An H&amp;S forms at the end of an uptrend. Price creates three peaks: a first peak called the left shoulder, a higher peak called the head, then a third peak lower than the head called the right shoulder. The two lows between the peaks form the neckline. When that neckline breaks, the reversal is confirmed.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Each successive peak shows a loss of buyer strength. The head represents the last true bullish move. When the right shoulder fails to climb back to the head&apos;s level, the market shows that buyers are running out of room. The neckline break then triggers the buyers&apos; stops and accelerates the drop.</p>
            <p className="text-zinc-300 leading-relaxed text-sm">The H&amp;S stays a very accessible pattern for retail. No complicated indicator or advanced calculation is needed. It shows up directly on the chart, no matter the asset or the timeframe. It&apos;s the most taught reversal pattern for over 100 years, and it still works.</p>
          </section>

          {/* Block 4 — CLASSIC H&S */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Head &amp; Shoulders: end of an uptrend</h2>
            <div className="my-8">
              <HeadShouldersDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">The classic H&amp;S appears at the end of an uptrend. It forms three peaks: a left shoulder with a moderate peak, a head with a higher peak, then a right shoulder with a peak close to the left shoulder. The two lows between these peaks define the neckline.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">The 3 conditions for a valid H&amp;S:</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- A clear prior uptrend</li>
              <li>- The head must be strictly higher than the 2 shoulders</li>
              <li>- A confirmed neckline break (close, not a wick)</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Example on XAU/USD. The market has been bullish for several sessions. It climbs toward $4,620 to form the left shoulder, drops back to $4,580, heads back up to $4,660 to form the head, then drops back to $4,575. Next, it climbs to $4,625 to form the right shoulder, at the same level as the left shoulder. The neckline links the two lows around $4,578. When price closes below $4,575, the H&amp;S is confirmed.</p>
          </section>

          {/* Block 5 — NECKLINE VARIANTS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Neckline variants</h2>
            <div className="my-8">
              <HSNecklineSlopeDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">An H&amp;S neckline isn&apos;t always strictly horizontal. Its slope conditions the measured move and therefore the TP target.</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="text-white font-semibold">Horizontal neckline</span>, standard measured move, full TP kept.</li>
              <li>- <span className="text-white font-semibold">Rising neckline</span>, extended measured move, the TP gains a few extra pips.</li>
              <li>- <span className="text-white font-semibold">Falling neckline</span>, reduced measured move, tighter TP, often a less favorable R/R.</li>
            </ul>
          </section>

          {/* Block 6 — INVERSE H&S */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Inverse Head &amp; Shoulders: end of a downtrend</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">The inverse H&amp;S is the mirror of the classic H&amp;S. It appears at the end of a downtrend. Price forms three lows: a left shoulder with a moderate low, a head with a lower low, then a right shoulder with a low close to the left shoulder. The neckline links the two highs between the lows.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">The 3 conditions stay the same, mirrored:</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- A clear prior downtrend</li>
              <li>- The head must be strictly lower than the 2 shoulders</li>
              <li>- A confirmed neckline break to the upside (close)</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">Example on XAU/USD. The market has been bearish for several sessions. It drops toward $4,470 to form the left shoulder, climbs back to $4,510, heads back down to $4,430 to form the head, then climbs to $4,515. Next, it drops back to $4,475 to form the right shoulder. The neckline links the two highs around $4,512. When price closes above $4,515, the inverse H&amp;S is confirmed.</p>
          </section>

          {/* Block 7 — TRADE EXECUTION PLAN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Trade execution plan</h2>
            <div className="my-8">
              <HSTradeExecutionDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">The entry is short just below the neckline to catch the breakdown. You don&apos;t chase price during the drop. A clean close below the neckline is required.</p>
            <p className="text-zinc-300 leading-relaxed text-sm">The classic SL goes above the head for maximum invalidation, but that often gives too weak an R/R. The tighter tactical SL goes above the right shoulder: less secure, but more tradeable. The TP follows the measured move: pattern height between the head and the neckline, projected below the neckline.</p>
          </section>

          {/* Block 8 — TRADE PLAN XAU/USD H1 */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Trade plan: H&amp;S XAU/USD H1</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">We pick up the classic H&amp;S context from Block 4. The uptrend was already in place. The left shoulder forms at $4,620, the head at $4,660, the right shoulder at $4,625, with a neckline around $4,578. Price has just closed an H1 candle at $4,570, below the neckline. The pattern is confirmed.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">The tactical SL is placed just above the right shoulder at $4,630. The classic SL above the head at $4,670 would give too weak an R/R: the tactical option is the one kept for this setup.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">The TP follows the measured move: pattern height between the head at $4,660 and the neckline at $4,578, i.e. $82. This height is projected below the neckline toward $4,496. The target is extended slightly to $4,480 to get a round 1.5:1 R/R.</p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Short entry: $4,570 (close below neckline)</li>
                <li>- Stop loss: $4,630 ($60 above the right shoulder at $4,625)</li>
                <li>- Take profit: $4,480 ($90, extended measured move)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">R/R calculation</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risk: 4,630 - 4,570 = $60</li>
                <li>- Potential gain: 4,570 - 4,480 = $90</li>
                <li>- R/R: 90 / 60 = 1.5:1</li>
                <li>- Setup tradeable at the minimum threshold.</li>
              </ul>
            </div>
          </section>

          {/* Block 9 — RETAIL CALCULATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Retail calculation</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Risk per trade adapts to your capital. On this 1.5:1 R/R setup, here&apos;s the breakdown by account size.</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- €300 account → 5% = €15 risk, ~€22 potential gain</li>
              <li>- €500 account → 3% = €15 risk, ~€22 potential gain</li>
              <li>- €1,000 account → 2% = €20 risk, ~€30 potential gain</li>
              <li>- €2,500 account → 2% = €50 risk, ~€75 potential gain</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">The 1.5:1 R/R stays modest compared to a Pin bar or a trend pullback, but the H&amp;S has a higher win rate when the pattern is clean. Over 100 trades, profitability is reached even with a modest R/R if the win rate exceeds 50%.</p>
          </section>

          {/* Block 10 — FILTERS: WHEN NOT TO TAKE THE SETUP */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Filters: when not to take the setup</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">1. Head not marked enough.</span> <span className="text-zinc-300">If the head barely tops the shoulders, less than 0.3% above, the pattern becomes weak. The market hesitates without a clean structural break. Skip the setup.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">2. Shoulders too asymmetric.</span> <span className="text-zinc-300">If the right shoulder is much higher or lower than the left, with more than 0.5% gap, the pattern loses its classic logic. The structure becomes less reliable.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">3. Break on a wick, without a close.</span> <span className="text-zinc-300">A wick that briefly breaks the neckline then climbs back validates nothing. A real clean close is expected. On an H&amp;S, patience stays critical.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-red-400 font-semibold">4. Major news in the window.</span> <span className="text-zinc-300">If FOMC, NFP or CPI comes within 30 minutes, the setup isn&apos;t taken. A news print can invalidate the pattern instantly.</span></div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "Head & Shoulders = 3 peaks after an uptrend. The head is higher than the 2 shoulders. Inverse H&S = mirror on a downtrend.",
              "Confirmation = a clean close below or above the neckline. No wick.",
              "Classic SL above the head, tactical SL above the right shoulder for a more tradeable R/R. TP = measured move (head → neckline height projected).",
              "The H&S R/R is modest, often around 1.5:1, but the win rate stays high when the pattern is clean.",
            ]}
          />

          <LessonExercice
            description="On XAU/USD H1, you see an H&S with a left shoulder at $4,650, head at $4,680, right shoulder at $4,658. Neckline at $4,620. The head is 30 pips above the shoulders (0.65%). Price has just closed at $4,615. Do you take the setup?"
            steps={[
              "Check that the head ($4,680) is strictly higher than the 2 shoulders: 30 pips above, i.e. 0.65%, above the 0.3% threshold, OK",
              "Confirm the shoulders are symmetric: $4,650 vs $4,658, an 8-pip gap (0.17%), below the 0.5% threshold, OK",
              "Confirm the break: close at $4,615 below the neckline at $4,620, not just a wick",
              "Check that no major news is scheduled in the next 30 minutes",
              "Take the short entry at $4,615, SL above the right shoulder at $4,668, TP extended measured move at $4,540 for a round 1.5:1 R/R",
            ]}
          />

          <LessonQuiz
            question="What characterizes a Head & Shoulders?"
            options={[
              "Two near-equal peaks",
              "Three peaks where the central one is the highest",
              "A broken trendline",
              "A moving average crossover",
            ]}
            correctIndex={1}
            explanation="The H&S is defined by 3 peaks: left shoulder, head (the highest), right shoulder. The head must be strictly higher than the 2 shoulders for the pattern to be valid. The two lows between these peaks form the neckline."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "reversal", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 2 of the Reversal &amp; Reversals module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/reversal/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 1
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lesson 3. Coming soon
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
