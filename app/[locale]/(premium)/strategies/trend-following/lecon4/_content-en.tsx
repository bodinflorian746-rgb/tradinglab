"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { BOSDiagram } from "@/app/components/charts/BOSDiagram";
import { CHoCHDiagram } from "@/app/components/charts/CHoCHDiagram";
import BOSvsCHoCHComparisonDiagram from "@/app/components/charts/BOSvsCHoCHComparisonDiagram";
import BOSFakeoutDiagram from "@/app/components/charts/BOSFakeoutDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Recognizing a trend (HH/HL vs LH/LL)", disabled: false },
  { id: "lecon2", title: "Trendline and moving averages: drawing the trend", disabled: false },
  { id: "lecon3", title: "Trading with the trend: pullback and entry", disabled: false },
  { id: "lecon4", title: "When to exit: trend reversal", disabled: false },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "trend-following", "lecon4"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Strategies</Link>
          <span>/</span>
          <Link href="/strategies/trend-following" className="hover:text-zinc-400 transition-colors">Trend Following</Link>
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
            When to exit: trend reversal
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              This lesson teaches you to distinguish BOS (continuation) and CHoCH (reversal): numerical criteria, fake BOS to avoid, execution plan on a confirmed reversal.
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
                &quot;A trend does not end on a red candle. It ends on a confirmed structural break.&quot;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- HH/HL/LL/LH structure → see Trading Course L3</li>
              <li>- Structural break → see Trading Course L3</li>
              <li>- Full SMC approach → see SMC Strategies L1 and L2</li>
            </ul>
          </div>

          {/* Bloc 3 — BOS VS CHoCH CÔTE À CÔTE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">BOS vs CHoCH side by side</h2>

            <div className="my-8">
              <BOSvsCHoCHComparisonDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Same starting structure, opposite break direction. The nature of the broken level dictates the nature of the signal.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- <span className="font-semibold text-zinc-100">BOS</span>: break in the direction of the trend (HH in an uptrend, LL in a downtrend) = continuation</li>
              <li>- <span className="font-semibold text-zinc-100">CHoCH</span>: break against the direction (HL in an uptrend, LH in a downtrend) = reversal</li>
              <li>- Exiting on a BOS protects gains. The reversal requires a confirmed CHoCH</li>
            </ul>
          </section>

          {/* Bloc 4 — RECONNAÎTRE UN BOS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Recognizing a BOS</h2>

            <div className="my-8">
              <BOSDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A Break of Structure (BOS) validates trend continuation through a clean break of the last structural extreme.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Bullish BOS: break of the last HH with a clean close above</li>
              <li>- Bearish BOS: break of the last LL with a clean close below</li>
              <li>- Minimum distance: 15-20 pips EUR/USD H4 or $15-20 XAU/USD H4</li>
              <li>- No re-entry within the next 3-5 candles</li>
            </ul>
          </section>

          {/* Bloc 5 — RECONNAÎTRE UN CHoCH */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Recognizing a CHoCH</h2>

            <div className="my-8">
              <CHoCHDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A Change of Character (CHoCH) initiates a reversal through the break of the last low or high of the opposite structure.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Bearish CHoCH (from an uptrend): break of the last HL</li>
              <li>- Bullish CHoCH (from a downtrend): break of the last LH</li>
              <li>- First structural reversal signal, triggers the exit of positions</li>
              <li>- The reversal (entry in the new direction) requires confirmation via the formation of a new structure + a complete CHoCH</li>
            </ul>
          </section>

          {/* Bloc 6 — FAUX BOS À ÉVITER */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Fake BOS to avoid</h2>

            <div className="my-8">
              <BOSFakeoutDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A wick that pierces the structural level without a clean close is not a BOS. It is often an institutional liquidity grab.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Wick exceeds the HH/LL, but the body closes short of it = invalid BOS</li>
              <li>- Liquidity grab: institutions target the stops accumulated beyond the level</li>
              <li>- Wait for the full candle close before any BOS reading</li>
            </ul>
          </section>

          {/* Bloc 7 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Trade plan: reversal on CHoCH XAU/USD H4</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              XAU/USD in an H4 uptrend for 3 weeks (2 HL at $4,520 and $4,580, 2 HH at $4,620 and $4,660). Bearish BOS: close at $4,555 ($25 below the HL at $4,580). Validation over 4 candles with no re-entry. New structure forming: LH at $4,600 then LL at $4,530 = confirmed CHoCH.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup (short trade on confirmed reversal)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Short entry: $4,580 (pullback to the former HL turned resistance, rejection signal expected)</li>
                <li>- Stop loss: $4,615 (beyond the LH at $4,600, $15 margin)</li>
                <li>- Take profit: $4,450 (support zone identified lower)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">R/R calculation</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risk: $4,615 - $4,580 = $35</li>
                <li>- Potential gain: $4,580 - $4,450 = $130</li>
                <li>- R/R: 130 / 35 = 3.71</li>
              </ul>
            </div>

            <p className="text-white font-semibold text-sm mb-2">Retail calculation</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- €300 account → 5% = €15 risk, €55 potential gain</li>
              <li>- €500 account → 3% = €15 risk, €55 potential gain</li>
              <li>- €1,000 account → 2% = €20 risk, €74 potential gain</li>
              <li>- €2,500 account → 2% = €50 risk, €185 potential gain</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              The R/R stays at 3.71:1 regardless of account size.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "BOS = break of the last structural extreme in the direction of the trend (continuation).",
              "CHoCH = break of the last low/high of the opposite structure (reversal).",
              "The exit of a position triggers as soon as the BOS is validated. The reversal requires a confirmed CHoCH.",
              "Without a clean close (wick only), there is no BOS, it is a liquidity grab.",
            ]}
          />

          <LessonExercice
            description="On XAU/USD H4, the ongoing uptrend has formed a last HL at $4,580 and a last HH at $4,660. A candle closes at $4,555 with a significant body, i.e. $25 below the last HL. The next 4 candles keep their close below $4,580. Price then forms a high at $4,600 then drops back to form a low at $4,530. How is the full plan built?"
            steps={[
              "Qualify the bearish BOS: clean close at $4,555 ($25 below the HL at $4,580), significant body, no re-entry over 4 candles. BOS validated",
              "Trigger the exit of any existing long position as soon as the close at $4,555 occurs",
              "Observe the post-break structure: high at $4,600 (potential first LH) then low at $4,530 (first LL)",
              "Confirm the bearish CHoCH: the sequence LH ($4,600) + LL ($4,530) officially reverses the trend",
              "Build the reversal plan: short entry on the pullback toward $4,580 (former HL turned resistance) with a rejection signal, stop loss at $4,615 (beyond the LH at $4,600 + $15 margin), take profit at $4,450 (R/R ratio 1:3.7), position size according to the per-trade risk",
            ]}
          />

          <LessonQuiz
            question="What is the minimum condition to qualify an uptrend as tradable on an H4 chart?"
            options={[
              "1 higher high is enough",
              "2 successive ascending lows (HL) and 2 ascending highs (HH)",
              "A moving average pointing up",
              "High volume over 5 candles",
            ]}
            correctIndex={1}
            explanation="A tradable trend requires a minimum of 2 successive HL + 2 HH on the H4 timeframe. Below that threshold, the market stays in a range or consolidation, not in a structurally confirmed trend."
          />

          <LessonQuiz
            question="In a confirmed uptrend, what retracement depth defines a tradable pullback?"
            options={[
              "Less than 10% of the impulse",
              "Between 30% and 60% of the previous impulse",
              "More than 80% of the impulse",
              "No defined threshold",
            ]}
            correctIndex={1}
            explanation="The tradable pullback sits between 30% and 60% of the previous impulse. A retracement below 30% stays shallow and offers no clean entry level. A retracement above 60% calls the trend structure into question."
          />

          <LessonQuiz
            question="A break of the last HL is confirmed in an uptrend. A reversal position (short entry) is being considered. When should this reversal be executed?"
            options={[
              "As soon as the HL breaks (BOS)",
              "After the CHoCH confirmation (first LH + first LL in the new structure)",
              "On price returning to the broken HL with no other confirmation",
              "No waiting, the entry is immediate",
            ]}
            correctIndex={1}
            explanation="The reversal requires CHoCH confirmation before execution. The exit of an existing position can trigger as soon as the BOS, but a reversal position is only taken after the formation of the first LH + first LL in the new bearish structure. Without a CHoCH, the BOS can be invalidated."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "trend-following", "lecon4");
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
                  <p className="text-sm font-semibold text-emerald-400">Trend Following module completed</p>
                  <p className="text-xs text-zinc-500 mt-0.5">All lessons in the module have been completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/trend-following/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 3
              </Link>
              <Link href="/strategies/trend-following" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
