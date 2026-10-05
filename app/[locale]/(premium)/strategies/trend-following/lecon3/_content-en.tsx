"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { FibonacciDiagram } from "@/app/components/charts/FibonacciDiagram";
import { OTEDiagram } from "@/app/components/charts/OTEDiagram";
import PullbackContinuationDiagram from "@/app/components/charts/PullbackContinuationDiagram";
import FibPullbackChecklistDiagram from "@/app/components/charts/FibPullbackChecklistDiagram";
import FibTPProjectionDiagram from "@/app/components/charts/FibTPProjectionDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Recognizing a trend (HH/HL vs LH/LL)", disabled: false },
  { id: "lecon2", title: "Trendline and moving averages: drawing the trend", disabled: false },
  { id: "lecon3", title: "Fibonacci pullback 0.618/0.786: optimal entry", disabled: false },
  { id: "lecon4", title: "Lesson 4",          disabled: true },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "trend-following", "lecon3"));
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
            Fibonacci pullback 0.618/0.786: optimal entry
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              This lesson teaches you to trade the pullback into the OTE zone (Fibonacci 0.618-0.786) with Order Block / FVG confluence for a precision entry.
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

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &quot;The OTE zone (0.618-0.786) is the point where the market breathes before moving again. It is also the institutionals&apos; preferred entry.&quot;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Pullback in a trend → see TF Strategy L1</li>
              <li>- Fibonacci retracement → see Trading Course L4</li>
              <li>- Order Block / FVG → see SMC Strategy L3 (quick mention)</li>
            </ul>
          </div>

          {/* Bloc 3 — REPÉRER LA ZONE OTE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Spotting the OTE zone</h2>

            <div className="my-8">
              <OTEDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The OTE zone (Optimal Trade Entry) covers the Fibonacci retracements from 0.618 to 0.786. A deep but structurally valid retracement as long as the 0.786 holds.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Fibo drawing: last HL → last HH (uptrend) or last LH → last LL (downtrend)</li>
              <li>- 0.618 level: preferred entry, optimal balance between retracement and risk</li>
              <li>- 0.786 level: acceptable limit, requires a strong rejection signal</li>
              <li>- Beyond 0.786: trend probably broken, no trade in the previous direction</li>
            </ul>
          </section>

          {/* Bloc 4 — VALIDER LE PULLBACK FIBO */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Validating the Fibo pullback (checklist)</h2>

            <div className="my-8">
              <FibPullbackChecklistDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              4 criteria qualify a tradable Fibonacci pullback. Once validated, the setup enters the priority selection.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Clear impulse: marked directional displacement (significant bodies)</li>
              <li>- Retracement 30-60% (ideally 0.5 to 0.618): tradable depth</li>
              <li>- Rejection signal at contact (pin bar, engulfing, immediate reaction)</li>
              <li>- Higher TF bias (H4 or Daily) aligned with the direction of the impulse</li>
            </ul>
          </section>

          {/* Bloc 5 — CONFLUENCE MULTI-ÉLÉMENTS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Multi-element confluence</h2>

            <div className="my-8">
              <PullbackContinuationDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The OTE zone gains strength when it fits within a coherent sequence: structural anchor at the bottom, retracement inside the OTE, institutional footprint at the entry point, imbalance to fill as the target.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- HTF support in the low zone = structural anchor (where price wants to defend)</li>
              <li>- Pullback toward OTE 61.8%-78.6% = optimal retracement zone to re-enter the trend</li>
              <li>- Order Block inside the OTE = institutional footprint where to place the entry</li>
              <li>- FVG above = imbalance to fill, logical continuation target</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN DE TRADE CHIFFRÉ */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Trade plan: XAU/USD H4 Fibo pullback</h2>

            <div className="my-8">
              <FibonacciDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              XAU/USD in a confirmed uptrend. Last HL at $4,480, last HH at $4,660 ($180 impulse). Fibonacci: 0.618 = $4,548, 0.786 = $4,519. Price drops to touch $4,550 (practically 0.618). Bullish pin bar at contact.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Setup (long trade on 0.618 pullback)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Long entry: $4,565 (pin bar close)</li>
                <li>- Stop loss: $4,510 ($10 below the 0.786 level at $4,519)</li>
                <li>- Take profit level 1: $4,660 (previous HH), level 2: $4,720 (138% extension)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">R/R calculation</p>
              <ul className="space-y-1 text-sm text-zinc-300">
                <li>- Risk: $4,565 - $4,510 = $55</li>
                <li>- Gain level 1: $95 → R/R 1.73</li>
                <li>- Gain level 2: $155 → R/R 155/55 = 2.82</li>
                <li>- The setup primarily targets TP level 2</li>
              </ul>
            </div>

            <div className="my-8">
              <FibTPProjectionDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Projection of the Fibonacci extension targets 1.272 and 1.618 to scale out of the trade in 2 parts.
            </p>

            <p className="text-white font-semibold text-sm mb-2">Retail calculation</p>
            <ul className="space-y-1 text-sm text-zinc-300 mb-3">
              <li>- €300 account → 5% = €15 risk, €42 potential gain</li>
              <li>- €500 account → 3% = €15 risk, €42 potential gain</li>
              <li>- €1,000 account → 2% = €20 risk, €56 potential gain</li>
              <li>- €2,500 account → 2% = €50 risk, €141 potential gain</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              The R/R stays at 2.82:1 regardless of account size.
            </p>
          </section>

          <LessonKeyPoints
            points={[
              "Fibonacci drawing: last HL → HH (uptrend) or LH → LL (downtrend). 4 key levels: 0.382, 0.5, 0.618, 0.786.",
              "Preferred entry zone: OTE between 0.618 and 0.786 with a confirmed rejection signal.",
              "OTE + OB + FVG + Support confluence = institutional precision entry.",
              "Stop loss beyond 0.786 with a 5-10 pip margin. Beyond that, the trend is probably broken.",
            ]}
          />

          <LessonExercice
            description="On EUR/USD H4 in an uptrend, the last HL is at 1.1720 and the last HH at 1.1820. Price is currently retracing to 1.1760. Which Fibonacci level does this retracement correspond to and what is the setup status?"
            steps={[
              "Measure the impulse: 1.1820 - 1.1720 = 100 pips",
              "Calculate the retracement position: 1.1820 - 1.1760 = 60 pips below the HH, i.e. 60% of the impulse",
              "Identify the Fibonacci level: 60% corresponds to a level between 0.5 (1.1770) and 0.618 (1.1758). The current price at 1.1760 sits practically at the 0.618 level, optimal entry zone",
              "Wait for the rejection signal (pin bar, engulfing) at the contact of 1.1758-1.1760 to validate the setup",
              "Build the plan: long entry at the signal close, stop loss below 1.1741 (0.786 level + 10 pip margin), take profit at 1.1820 (previous HH) or 1.1858 (138% extension). Position size according to the per-trade risk adapted to capital",
            ]}
          />

          <LessonQuiz
            question="In a confirmed uptrend, price has retraced to 70% of the last impulse. A rejection pin bar forms at this level. What is the operational status of the setup?"
            options={[
              "Invalid setup, retracement too deep",
              "Valid entry zone between 0.618 and 0.786, tradable setup with a rejection signal",
              "Shallow setup, wait for a deeper retracement",
              "Undetermined, Fibonacci does not apply in a trend",
            ]}
            correctIndex={1}
            explanation="A 70% retracement sits between 0.618 (61.8%) and 0.786 (78.6%), a valid but deep entry zone, tradable only with a confirmed rejection signal. The rejection pin bar provides that confirmation. The stop loss is placed beyond 0.786 with a 5-10 pip margin. Beyond 0.786, the trend structure would be called into question."
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "trend-following", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 3 of the Trend Following module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Link href="/strategies/trend-following/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 2
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-zinc-700 cursor-not-allowed">
                Lesson 4. Coming soon
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
