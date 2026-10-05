"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { BOSDiagram } from "@/app/components/charts/BOSDiagram";
import { CHoCHDiagram } from "@/app/components/charts/CHoCHDiagram";
import BOSvsCHoCHComparisonDiagram from "@/app/components/charts/BOSvsCHoCHComparisonDiagram";
import BOSCHoCHSequenceDiagram from "@/app/components/charts/BOSCHoCHSequenceDiagram";
import BOSFakeoutDiagram from "@/app/components/charts/BOSFakeoutDiagram";

const LESSONS = [
  { id: "lecon1", title: "Lesson 1", disabled: false },
  { id: "lecon2", title: "BOS and CHoCH: reading institutional structural signals", disabled: false },
  { id: "lecon3", title: "Lesson 3", disabled: true },
  { id: "lecon4", title: "Lesson 4", disabled: true },
  { id: "lecon5", title: "Lesson 5", disabled: true },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "smc", "lecon2"));
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
          <span className="text-zinc-500">Lesson 2</span>
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
            BOS and CHoCH: reading institutional structural signals
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              BOS and CHoCH are the two fundamental structural signals in SMC reading. This lesson teaches you to qualify them operationally, to understand the 3-step reversal sequence, and to avoid the classic traps.
            </p>
          </div>

          {/* Progress indicator */}
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

          {/* Lesson pills */}
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
            <span className="ml-auto text-xs text-zinc-600">2 / 5 lessons</span>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="space-y-8">

          {/* Block 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo;A BOS confirms the trend. A CHoCH questions it. Reading the difference in a few seconds changes how you read the market.&rdquo;
              </p>
            </div>
          </section>

          {/* Block 2 — PREREQUISITES */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- SMC Market Structure, HH/HL/LL/LH → see SMC Strategy L1</li>
              <li>- Breakout candle, displacement → see Trading Course L2</li>
              <li>- Multi-timeframe directional trend → see Trading Course L3</li>
            </ul>
          </div>

          {/* Block 3 — BOS vs CHoCH DISTINCTION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">BOS vs CHoCH distinction</h2>

            <div className="my-8">
              <BOSvsCHoCHComparisonDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              BOS and CHoCH refer to two distinct types of structural break, with opposite operational consequences. The distinction rests on the nature of the level broken: an extreme in the direction of the trend, or a low/high of the inverse structure.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-emerald-400 font-semibold text-sm mb-2">BOS. Break of Structure</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Break in the direction of the trend (HH in an uptrend, LL in a downtrend)</li>
                  <li>- Validates continuation, HH/HL or LH/LL structure intact</li>
                  <li>- Authorizes new positions in the direction of the trend</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-amber-400 font-semibold text-sm mb-2">CHoCH. Change of Character</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Break against the direction of the trend (HL in an uptrend, LH in a downtrend)</li>
                  <li>- Signals a potential reversal, structure broken</li>
                  <li>- Triggers exit from positions, prepares the reversal after confirmation</li>
                </ul>
              </div>
            </div>

            <BOSDiagram locale="en" />
            <CHoCHDiagram locale="en" />
          </section>

          {/* Block 4 — CRITERIA FOR A VALID BOS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Criteria for a valid BOS</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">4 criteria qualify a BOS as institutionally tradable. A break that fails to validate all 4 criteria remains hypothetical and exposes you to the fake breakout.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">1. Clean close beyond the level</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Candle closes fully beyond the HH/LL, a wick alone = test</li>
                  <li>- Validation on the close of the analysis timeframe (H4 or Daily)</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">2. Marked directional displacement</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Range clearly above the recent average</li>
                  <li>- Operational threshold: body ≥ 1.5× the average of the last 20 candles</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">3. No reintegration</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Price held beyond the broken level over 3-5 candles</li>
                  <li>- Immediate reintegration retroactively invalidates the BOS</li>
                </ul>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-white font-semibold text-sm mb-2">4. Multi-timeframe alignment</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- H4 BOS consistent with the Daily bias (HTF)</li>
                  <li>- Bullish BOS above the 200MA, bearish below</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Block 5 — BOS → CHoCH → MITIGATION SEQUENCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Operational sequence BOS → CHoCH → mitigation</h2>

            <div className="my-8">
              <BOSCHoCHSequenceDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">The institutional structural reversal follows a 3-step sequence. This sequence guarantees the reversal is only taken after full confirmation.</p>

            <ol className="space-y-2 text-sm text-zinc-300 list-decimal pl-5">
              <li><span className="font-semibold text-white">Counter-trend BOS</span>, break of the last HL (uptrend) or LH (downtrend). Opens the possibility of a reversal without confirming it. Gradual exit from positions, no reversal yet.</li>
              <li><span className="font-semibold text-white">Formation of the new structure</span>, 5 to 15 candles to produce a first LL/LH (bearish reversal) or HH/HL (bullish reversal). No reversal entry during this observation phase.</li>
              <li><span className="font-semibold text-white">Confirmed CHoCH + mitigation</span>, the new inverse structure is complete. Entry on the retracement toward the broken structural level (ex-HL turned resistance, or ex-LH turned support) with a rejection signal. A tight stop loss is possible.</li>
            </ol>
          </section>

          {/* Block 6 — FAKE BOS + MISTAKES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Fake BOS: the wick pierces, the close invalidates</h2>

            <div className="my-8">
              <BOSFakeoutDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A BOS that looks validated on the wick can be retroactively invalidated by a close below the level or by a quick reintegration. 3 recurring mistakes degrade the reading.
            </p>

            <div className="space-y-3">
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">1. Confusing wick and close</p>
                <p className="text-zinc-300 text-sm">Validating on the wick exposes you to a return to the origin zone. Wait for the full close of the candle.</p>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">2. Confusing BOS and CHoCH</p>
                <p className="text-zinc-300 text-sm">HH/LL broken = BOS (continuation). HL/LH broken = CHoCH (potential reversal).</p>
              </div>
              <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
                <p className="text-red-400 font-semibold text-sm mb-1">3. Trading the 1st counter-trend BOS without CHoCH</p>
                <p className="text-zinc-300 text-sm">A reversal taken before confirmation = return to the original trend. Wait for the full LL+LH or HH+HL sequence.</p>
              </div>
            </div>
          </section>

          {/* Block 7 — EUR/USD H4 TRADE PLAN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Trade plan: bullish BOS EUR/USD H4</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              EUR/USD in an H4 uptrend for 4 weeks. Structure: 3 HL at 1.1620, 1.1680, 1.1720, and 3 HH at 1.1700, 1.1760, 1.1820. Daily 200MA at 1.1500, price above. The H4 candle just closed at 1.1858, i.e. 38 pips above the 1.1820 HH, marked displacement. 5 candles hold their close above 1.1820 with no reintegration. No macro news in the window. The last HL 1.1720 has not been broken: no CHoCH, bullish BOS validated.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Entry: 1.1822 (retest of the former resistance level turned support, M15 rejection signal)</li>
                <li>- Stop loss: 1.1710 (below the last HL 1.1720 with a 10-pip buffer)</li>
                <li>- Take profit: 1.1990 (structural projection, next extension of the impulse)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">R/R calculation</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risk: 1.1822 - 1.1710 = 112 pips</li>
                <li>- Potential gain: 1.1990 - 1.1822 = 168 pips</li>
                <li>- R/R: 168 / 112 = 1.5</li>
                <li>- Setup tradable at the minimum institutional threshold.</li>
              </ul>
            </div>
          </section>

          {/* Block 8 — RETAIL CALCULATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Retail calculation</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Risk per trade by account size applied to this setup.
            </p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- €300 account → 5% = €15 risk, €22.50 potential gain</li>
              <li>- €500 account → 3% = €15 risk, €22.50 potential gain</li>
              <li>- €1,000 account → 2% = €20 risk, €30 potential gain</li>
              <li>- €2,500 account → 2% = €50 risk, €75 potential gain</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              The R/R stays 1.5:1 regardless of account size. What changes is the lot size and the risk percentage adapted to the capital.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "A BOS confirms the trend by breaking a structural extreme (HH or LL). A CHoCH questions it by breaking an inverse low or high (HL or LH). The level broken dictates the signal.",
              "4 criteria qualify a valid BOS: clean close, marked displacement, no reintegration, multi-timeframe alignment.",
              "The reversal sequence follows 3 steps: counter-trend BOS, formation of the new structure, confirmed CHoCH.",
              "The reversal entry is taken only after a confirmed CHoCH, on the mitigation zone with a rejection signal.",
            ]}
          />

          <LessonExercice
            description="On XAU/USD H4, the ongoing downtrend shows 3 successive LH at $4,720, $4,660 and $4,620, and 3 successive LL at $4,660, $4,600 and $4,540. An H4 candle just closed at $4,670, i.e. $50 above the last LH at $4,620. The next 4 candles hold their close above $4,620. No macro news in the window. How do you build the BOS/CHoCH reading?"
            steps={[
              "Identify the nature of the broken level: $4,620 is the last LH (high of the inverse bearish structure), this is a potential reversal signal, not a continuation.",
              "Qualify the break: clean close at $4,670 ($50 above the LH), displacement above the recent average, no reintegration over 4 candles, break validated structurally.",
              "Classify the signal: the break of the last LH constitutes a counter-trend BOS, the first potential reversal signal of the downtrend.",
              "Wait for the new structure to form: look for the formation of a first HL (low higher than the previous one) after the counter-trend BOS.",
              "Validate the CHoCH before reversing: confirm the CHoCH through the full HL plus HH sequence in the new bullish structure before taking any long position. Exit from existing short positions can be triggered as soon as the counter-trend BOS prints, but the reversal requires the CHoCH.",
            ]}
          />

          <LessonQuiz
            question="What is the fundamental operational difference between a BOS and a CHoCH in an uptrend?"
            options={[
              "The BOS breaks an HL, the CHoCH breaks an HH",
              "The BOS breaks an HH (bullish extreme), the CHoCH breaks an HL (structural low)",
              "Both refer to the same structural break",
              "The BOS is used on M15, the CHoCH on Daily",
            ]}
            correctIndex={1}
            explanation="In an uptrend, a BOS validates continuation by breaking the last HH (extreme in the direction of the trend). A CHoCH starts a reversal by breaking the last HL (structural low that defines the bullish structure). The nature of the broken level, HH vs HL, dictates the nature of the signal and the operational decision."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "smc", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 2 of the SMC: Think institutional module completed.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/smc/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 1
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lesson 3. Coming up
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
