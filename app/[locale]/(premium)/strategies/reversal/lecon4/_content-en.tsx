"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import InvalidationDiagram from "@/app/components/charts/InvalidationDiagram";
import InvalidationTriggersGridDiagram from "@/app/components/charts/InvalidationTriggersGridDiagram";
import SLManagementProgressionDiagram from "@/app/components/charts/SLManagementProgressionDiagram";

const LESSONS = [
  { id: "lecon1", slug: "lecon1", title: "Double top / Double bottom: the reversal signature", duration: "16 min", disabled: false },
  { id: "lecon2", slug: "lecon2", title: "Head & Shoulders: the major reversal", duration: "18 min", disabled: false },
  { id: "lecon3", slug: "lecon3", title: "RSI divergence: when momentum betrays the trend", duration: "17 min", disabled: false },
  { id: "lecon4", slug: "lecon4", title: "Trading a reversal: invalidation checklist", duration: "18 min", disabled: false },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "reversal", "lecon4"));
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
          <span className="text-zinc-500">Lesson 4</span>
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
            Trading a reversal: invalidation checklist
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Entering a reversal is relatively simple: three patterns are available, Double top, H&amp;S and RSI divergence. The real problem: knowing when the pattern has failed. This lesson gives you a practical checklist to spot an invalidation and cut before handing the account back.
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

        {/* ── Content ── */}
        <div className="space-y-8">

          {/* Block 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo;Getting out fast of a trade that&apos;s going wrong isn&apos;t up for debate. You execute it.&rdquo;
              </p>
            </div>
          </section>

          {/* Block 2 — PREREQUISITES */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Double Top / Double Bottom → see Reversal Strategy L1</li>
              <li>- Head &amp; Shoulders → see Reversal Strategy L2</li>
              <li>- RSI divergence → see Reversal Strategy L3</li>
            </ul>
          </div>

          {/* Block 3 — WHY 70% FAIL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Why 70% of reversals fail for retail traders</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Reversal patterns like the Double top, the H&amp;S or RSI divergence have a real win rate around 55-65% when they&apos;re clean. For the majority of retail traders, that rate drops to 30-40%. Not because the patterns are bad. Because retail traders don&apos;t know how to recognize when the pattern has failed.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">On an entry into a double top where price climbs back above the neckline, the human brain has two possible reactions. Either the exit is immediate and the small loss is taken. Or the retail trader tells himself: &apos;it&apos;ll come back, I saw the pattern&apos;. The average retail trader picks the second option. Over 10 trades like that, he maybe saves 2 and hands back 8 with losses 3 to 5 times bigger than planned.</p>
            <p className="text-zinc-300 leading-relaxed text-sm">A pro trader has an invalidation checklist. Not intuition. Not a feeling. A mechanical list of criteria that trigger the cut as soon as they light up. No debate. No &apos;I&apos;ll wait for one more candle&apos;. The exit is immediate, the loss is booked, the next trade is studied. This lesson presents that checklist.</p>
          </section>

          {/* Block 4 — 5-CRITERIA CHECKLIST */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Invalidation checklist: 5 criteria that trigger the cut</h2>
            <div className="my-8">
              <InvalidationTriggersGridDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">A single one of these 5 conditions lighting up is enough to trigger the immediate exit. No debate, no waiting for an extra candle.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">1. Break rejected.</span> <span className="text-zinc-300">Price closes back above (or below) the neckline within the 1-3 candles following the entry. Pattern invalidated, immediate exit.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">2. Violent rejection candle.</span> <span className="text-zinc-300">A big green candle engulfing the previous 2-3 bearish candles = absorption signal. Immediate exit even without a re-break of the neckline.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">3. Inconsistent volume.</span> <span className="text-zinc-300">Initial break with no notable volume + recovery with big volume = inverted read. Weak pattern, immediate exit.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm"><span className="text-white font-semibold">4. Unexpected news in the window.</span> <span className="text-zinc-300">Macro news printing during the trade (Fed minutes, geopolitics, unexpected data). Exit as a precaution required, news destroys patterns.</span></div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4 text-sm md:col-span-2"><span className="text-white font-semibold">5. Time elapsed without confirmation.</span> <span className="text-zinc-300">After 5-8 candles on the entry timeframe (H1 or H4) with no progress toward the TP, weak pattern. Exit isn&apos;t mandatory, but tighten the SL to break-even at minimum. If the pattern was working, it would already be moving.</span></div>
            </div>
          </section>

          {/* Block 5 — RECOGNIZE AN INVALIDATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Recognize an invalidation</h2>
            <div className="my-8">
              <InvalidationDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Visually, the invalidation reads immediately on the chart. The market literally signals the invalidation, the only action required is to listen to the signal and execute the cut without debate.</p>
            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Visual signals to spot:</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- A clean close back above (or below) the broken level, criterion 1.</li>
              <li>- A wide green absorption candle engulfing the previous 2-3 bearish ones, criterion 2.</li>
              <li>- Volume opposite to the initial break, criterion 3.</li>
              <li>- Prolonged stagnation with no progress toward the TP, criterion 5.</li>
            </ul>
          </section>

          {/* Block 6 — 3 NUMBERED PRACTICAL CASES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3 numbered practical cases: when the pattern fails</h2>

            {/* Case 1 */}
            <div className="mb-6 last:mb-0">
              <h3 className="text-base font-semibold text-zinc-100 mb-2">Case 1: Double top on EUR/USD that invalidates</h3>
              <p className="text-zinc-300 leading-relaxed text-sm mb-2">Short EUR/USD entry taken at 1.1795 after the neckline break, scenario from Lesson 4.1. SL at 1.1835, TP at 1.1715. Position open for 30 minutes. Price first drops to 1.1780, then climbs back sharply. An H1 candle closes at 1.1810.</p>
              <p className="text-zinc-300 leading-relaxed text-sm mb-3">Price has re-broken the neckline at 1.1800 to the upside. The double top is invalidated, criterion 1. The recovery candle is wide and engulfs the previous 2 bearish candles, criterion 2. No imminent news. 2 criteria out of 5 are lit.</p>
              <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-emerald-500/50 pl-3 py-1">
                <span className="font-semibold text-emerald-400">Action:</span> the position is cut at 1.1810. Loss: 15 pips instead of the planned 40 pips if you had waited for the SL. 25 pips saved.
              </p>
            </div>

            <div className="border-t border-zinc-800/60 my-6" />

            {/* Case 2 */}
            <div className="mb-6 last:mb-0">
              <h3 className="text-base font-semibold text-zinc-100 mb-2">Case 2: H&amp;S on XAU that turns into a continuation</h3>
              <p className="text-zinc-300 leading-relaxed text-sm mb-2">Short XAU/USD entry taken at $4,570 after the neckline break of an H&amp;S, scenario from Lesson 4.2. SL at $4,630, TP at $4,480. Price drops nicely to $4,540 over 2 candles, then climbs back strongly.</p>
              <p className="text-zinc-300 leading-relaxed text-sm mb-3">An H1 candle closes at $4,595, above the neckline but below the right shoulder. Check: break rejected, criterion 1, consistent volume on the recovery, criterion 3. The H&amp;S pattern is turning into a simple pause within the uptrend. No waiting for price to re-test the right shoulder at $4,625.</p>
              <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-emerald-500/50 pl-3 py-1">
                <span className="font-semibold text-emerald-400">Action:</span> the position is cut at $4,595. Loss: $25 per unit instead of the planned $60. More than half the risk is saved.
              </p>
            </div>

            <div className="border-t border-zinc-800/60 my-6" />

            {/* Case 3 */}
            <div>
              <h3 className="text-base font-semibold text-zinc-100 mb-2">Case 3: RSI divergence without a structure break</h3>
              <p className="text-zinc-300 leading-relaxed text-sm mb-2">A clean bearish divergence is spotted on XAU H1. Price HH at $4,640, RSI LH at 68. The temptation to enter short directly stays strong. But the rule is clear: &apos;a divergence alone is NEVER enough&apos;, Lesson 4.3.</p>
              <p className="text-zinc-300 leading-relaxed text-sm mb-3">The break of the structural low at $4,570 is required. For 6 H1 candles, price oscillates between $4,580 and $4,645. It NEVER breaks the low at $4,570. Criterion 5, time elapsed without confirmation, lights up. The entry isn&apos;t taken, despite the visible divergence.</p>
              <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-emerald-500/50 pl-3 py-1">
                <span className="font-semibold text-emerald-400">Action:</span> no entry. 100% of the capital is preserved on this trade not taken. RSI divergence without a structure break is not a tradeable setup.
              </p>
            </div>
          </section>

          {/* Block 7 — CUT FAST */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Cut fast (without hesitating)</h2>
            <div className="my-8">
              <SLManagementProgressionDiagram locale="en" />
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">When a checklist criterion activates, the exit is immediate, manual, on the close of the current candle on the entry timeframe, H1 or H4. Not before the close, otherwise an exit too early stays possible on a false signal. Not the next candle, otherwise too much risk is handed back. On the confirmed close.</p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">The emotional trap to avoid: &apos;I&apos;ll wait for one more candle to confirm&apos;. NO. The SL is already placed at entry, so the max loss is capped. But if an extra candle is waited for on every invalidation, a cut at -0.5R (at half the SL) turns into a full loss at -1R (at the SL). Over 10 trades that fail, that&apos;s the difference between -5R and -10R. The pro rule: the first confirmation triggers the action.</p>
            <p className="text-zinc-300 leading-relaxed text-sm">Without active monitoring, the SL must be tightened after the entry. For Double top or H&amp;S, the SL moves from its classic position (above the head or the shoulder) to the neckline itself. For RSI divergence, it moves to the last structural low. The market will cut automatically if the pattern invalidates. A bit of room is sacrificed in exchange for peace of mind, but the initial SL ALWAYS stays in place from the entry.</p>
          </section>

          {/* Block 8 — META RETAIL CALCULATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Retail calculation: what you save by cutting early</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">Cutting at the invalidation = losing only a fraction of the initial risk. Concrete comparison by account size.</p>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Scenario: cut at -50% of the planned SL (at the invalidation)</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-4">
              <li>- €300 account → planned risk €15, real loss ~€7 (instead of €15)</li>
              <li>- €500 account → planned risk €15, real loss ~€7</li>
              <li>- €1,000 account → planned risk €20, real loss ~€10</li>
              <li>- €2,500 account → planned risk €50, real loss ~€25</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm font-semibold text-zinc-200 mb-2">Over 10 trades that fail: total savings</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- €300 account → ~€70 saved instead of €150 lost</li>
              <li>- €500 account → ~€70 saved</li>
              <li>- €1,000 account → ~€100 saved</li>
              <li>- €2,500 account → ~€250 saved</li>
            </ul>

            <p className="text-zinc-300 leading-relaxed text-sm">By cutting at the invalidation, losses are reduced by 50% on the trades that fail. Over 100 trades with 40-50 losers, that&apos;s the difference between an account that survives and an account that melts.</p>
          </section>

          <LessonKeyPoints
            points={[
              "70% of retail reversals fail because the trader doesn't know how to recognize an invalidation. Not because the pattern is bad.",
              "The 5-criteria checklist: break rejected, violent rejection candle, inconsistent volume, unexpected news, time elapsed.",
              "The exit happens on the close of the current candle. Not before. Not the next candle. On the close.",
              "Cutting at the invalidation = cutting the loss by 50% versus the initial SL. Over 100 trades, that changes overall profitability.",
            ]}
          />

          <LessonExercice
            description="You entered short XAU/USD at $4,720 on a double top. SL at $4,760, TP at $4,640. Position open for 1 hour. Price drops to $4,705, then climbs back strongly. An H1 candle closes at $4,745 with volume 2x above average. What do you do?"
            steps={[
              "Check criterion 1, break rejected: price has re-broken the neckline at $4,720 to the upside, YES",
              "Check criterion 2, violent rejection candle: wide green candle closing at $4,745, YES",
              "Check criterion 3, inconsistent volume: volume 2x higher during the recovery, YES",
              "3 criteria out of 5 lit: no debate, you cut immediately on the close",
              "Cut at $4,745: loss of $25 per unit instead of the planned $40 if you had waited for the SL at $4,760, you save more than a third of your risk",
            ]}
          />

          <LessonQuiz
            question="What is the main invalidation criterion for a double top or an H&S after the entry?"
            options={[
              "Price drops too fast toward the TP",
              "Price closes back above the neckline within the next 1-3 candles",
              "Volume drops",
              "The RSI climbs back above 50",
            ]}
            correctIndex={1}
            explanation="Criterion 1, break rejected, is the main trigger. If price closes back above the neckline within the 1-3 candles following the entry, the pattern is invalidated. The market literally signals the invalidation. The exit is immediate."
          />

          <LessonQuiz
            question="When an invalidation is identified, the position is cut:"
            options={[
              "Immediately, before the candle closes",
              "On the close of the current candle",
              "On the next candle to confirm",
              "At the initial SL without changing anything",
            ]}
            correctIndex={1}
            explanation="The exit happens on the close of the current candle on the entry timeframe. Before the close = risk of exiting on a false signal. The next candle = too much risk handed back. The pro rule: the first confirmation triggers the action."
          />

          <LessonQuiz
            question="Why do 70% of reversals fail for retail traders?"
            options={[
              "Because the patterns don't work",
              "Because retail traders don't know how to recognize an invalidation and hold on to their losing positions",
              "Because brokers manipulate prices",
              "Because retail traders use the maximum leverage offered by their broker",
            ]}
            correctIndex={1}
            explanation="The patterns have a real win rate around 55-65% when they're clean. For the majority of retail traders, that rate drops to 30-40% because they don't know how to recognize when the pattern has failed and hold their positions hoping for a return."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "reversal", "lecon4");
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
                  <p className="text-sm font-semibold text-emerald-400">Reversal &amp; Reversals module completed</p>
                  <p className="text-xs text-zinc-500 mt-0.5">All the lessons in the module have been completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/reversal/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 3
              </Link>
              <Link href="/strategies/reversal" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Back to module
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
