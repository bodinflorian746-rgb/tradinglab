"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { RiskoffSignalsDiagram } from "@/app/components/charts/RiskoffSignalsDiagram";
import { RiskoffTrendDiagram } from "@/app/components/charts/RiskoffTrendDiagram";
import { RiskoffExhaustionDiagram } from "@/app/components/charts/RiskoffExhaustionDiagram";

const LESSONS = [
  { id: "lecon1", title: "FOMC Fade", disabled: false },
  { id: "lecon2", title: "NFP Overreaction", disabled: false },
  { id: "lecon3", title: "Risk-off Regime", disabled: false },
  { id: "lecon4", title: "Pre-trade macro filter", disabled: false },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-trading", "lecon3"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Strategies</Link>
          <span>/</span>
          <Link href="/strategies/macro-trading" className="hover:text-zinc-400 transition-colors">Macro Trading</Link>
          <span>/</span>
          <span className="text-zinc-500">Lesson 3</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Advanced
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
            Risk-off Regime: trading when the market flees risk
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              The market doesn't change regime on a single candle. Risk-off builds in gradually, then durably drives the dominant direction of safe-haven assets.
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
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « A regime isn't traded like a signal. It's a context that lasts, you identify it, you respect it, you exploit it for as long as it holds. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Risk-on / risk-off → see Macro module</li>
              <li>- Macro correlations and safe-haven assets → see Macro module</li>
              <li>- Market structure and trends → see Strategies module</li>
              <li>- Multi-timeframe → see Multi-timeframe Process module</li>
            </ul>
          </div>

          {/* Bloc 3 — LE RISK-OFF SE CONFIRME PAR DES SIGNAUX CONCORDANTS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Risk-off is confirmed by concordant signals</h2>

            <div className="my-8">
              <RiskoffSignalsDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A risk-off regime is never inferred from a single market. It sets in when several indicators tell the same story at once: equity indices fall, volatility (VIX) rises, the dollar strengthens against the riskier currencies, gold and the Swiss franc attract the flows. When these four signals point the same way over several sessions, you are no longer in an isolated move, you are in a change of regime. It is this concordance that lets you trust the direction of safe-haven assets.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Over a week of geopolitical tensions, the S&amp;P 500 drops 3%, the VIX goes from 14 to 22, the DXY rises 1.5%, and XAU/USD moves gradually from $4,585 to $4,705 in a bullish structure. The four markets converge, the risk-off regime is in place, gold is the directional asset to favor on the long side as long as the concordance holds.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Actionable points: the concordance of 3-4 macro signals confirms the regime, not a single one</li>
              <li>- Bearish indices + rising VIX + strong Dollar + strong gold = classic risk-off signature</li>
              <li>- Without concordance, it's not a regime yet, just a move</li>
              <li>- The macro read comes before the technical read on safe-haven assets</li>
            </ul>
          </section>

          {/* Bloc 4 — TRADER DANS LE SENS DU RÉGIME, PAS CONTRE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Trade with the regime, not against it</h2>

            <div className="my-8">
              <RiskoffTrendDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Once the regime is identified, the operational discipline is simple: you trade in its direction, never against it. This means favoring exclusively longs on gold and shorts on risky pairs as long as the macro structure stays coherent. H4 pullbacks then become entry opportunities, you wait for price to readjust to a technical support, to stabilize, and you enter to ride the continuation. Counter-trading an established regime means fighting the underlying direction, statistically a losing game.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD H4 in an established risk-off regime: bullish impulse from $4,610 to $4,690, then a controlled pullback toward $4,655 on a former support. Stabilization, then a new bullish impulse up to $4,730. Long entry on the retest of $4,655 with SL below the pullback, target on the continuation zone $4,730. The HH/HL structure respects the regime.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Actionable points: longs prioritized on gold in a risk-off regime, never the reverse</li>
              <li>- Pullbacks are entries, not reversals to anticipate</li>
              <li>- Intact HH/HL structure = intact regime = likely continuation</li>
              <li>- Counter-trading an established regime = going against the statistics</li>
            </ul>
          </section>

          {/* Bloc 5 — LE RISK-OFF S'ESSOUFFLE PROGRESSIVEMENT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Risk-off exhausts gradually</h2>

            <div className="my-8">
              <RiskoffExhaustionDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              No regime lasts forever. The exhaustion of a risk-off reads gradually: progressively weaker highs on safe-haven assets (each new high is lower than the previous one), deeper H4 corrections than in the setup phase, bullish impulses that lose amplitude. The macro signals accompany this slowdown: the VIX comes back down, indices stabilize, the dollar stops rising. When these signs appear, you gradually reduce long exposure on gold, you don't wait for the structural break.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD H4: after a strong uptrend from $4,590, three successive highs weaken, $4,735, then $4,720, then $4,705. The corrections grow from $25 to $40 then $65 in amplitude. The bullish impulses become shorter. The regime isn't broken yet, but it is losing strength, you tighten the SLs, reduce position size, prepare the transition.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Actionable points: weaker highs + deeper corrections = exhaustion signal</li>
              <li>- The VIX coming back down confirms the macro slowdown</li>
              <li>- You reduce exposure BEFORE the structural break, not after</li>
              <li>- Exhaustion is not a reversal, it's a transition to watch</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Application plan: a trade in a risk-off regime on XAU/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Here is the full sequence of a trade aligned with a risk-off regime, from the macro diagnosis to management. Five steps, each with its role.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Step 1. Macro diagnosis</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: S&amp;P 500 falling for 3 sessions, VIX above 20, DXY bullish, XAU bullish</li>
                <li>- Conclusion: risk-off regime confirmed by concordance, long bias only on gold</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 2. H4 technical context</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: XAU/USD in a clear HH/HL structure since the start of the regime, current price $4,690</li>
                <li>- Conclusion: structure intact, we look for the next pullback to go long</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 3. Waiting for the pullback</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: H4 correction toward $4,655 (former high turned support), visible stabilization with lower wicks on M15</li>
                <li>- Conclusion: entry zone prepared, we wait for the first clean recovery candle</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 4. Execution</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Long entry: $4,660</li>
                <li>- Stop loss: $4,640 (below the pullback)</li>
                <li>- Target: $4,730 (continuation zone)</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 5. Monitoring the regime</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Watch the concordance of the macro signals while the position is open</li>
                <li>- If the VIX drops sharply OR if indices stabilize: exhaustion alert</li>
                <li>- If the HH/HL structure breaks: immediate exit, the regime is no longer valid</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  Macro = regime · Structure = direction · Pullback = entry · Concordance = condition to stay in
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "A risk-off regime is confirmed by CONCORDANCE of several macro signals, never by a single market.",
              "As long as the HH/HL structure holds on safe-haven assets, you trade with the regime and avoid any counter-trade.",
              "H4 pullbacks are entry opportunities, not reversals to anticipate.",
              "Exhaustion reads gradually: weaker highs, deeper corrections, VIX coming back down.",
            ]}
          />

          <LessonExercice
            description="Identify a recent risk-off regime in the market and reconstruct, after the fact, the diagnosis + an aligned setup."
            steps={[
              "Find a week where the VIX clearly rose. Over the same window, check the direction of US indices, the DXY and XAU/USD. Note how long the concordance held.",
              "On XAU/USD H4 during that period: draw the HH/HL structure. Identify the H4 pullbacks and mark the zones where a long entry would have been consistent with the regime.",
              "Watch the transition: at what point did the highs start to weaken, the corrections to deepen? Note that exhaustion signal and how long it played out before the structure actually broke.",
            ]}
          />

          <LessonQuiz
            question="You observe a well-established risk-off regime on XAU/USD with a clear HH/HL structure on H4. Price starts a $30 pullback toward a former high turned support. What do you do?"
            options={[
              "You short the pullback to ride the correction",
              "You wait for stabilization on the support, then go long to ride the continuation",
              "You close your existing long position: the regime is probably over",
              "You stay out until price has broken the previous high",
            ]}
            correctIndex={1}
            explanation="In an established risk-off regime with an intact HH/HL structure, an H4 pullback toward a former support is exactly the recommended entry opportunity. You let price stabilize on the technical level, look for the first clean recovery candle, and enter in the direction of the regime. Trading against the underlying direction (shorting the pullback) or anticipating the end of the regime without an exhaustion signal means fighting the macro logic that drives the move."
            answerExplanations={[
              "Wrong. Shorting in an established risk-off regime means trading against the macro context that supports gold. The pullback is a technical correction, not a reversal, the statistics favor continuation.",
              "Correct. The discipline of the regime is clear: you enter in its direction on pullbacks. The technical support offers a tight entry, the macro concordance supports the trade, the HH/HL structure validates the likely continuation.",
              "Wrong. Closing a long position on a $30 pullback, without any exhaustion sign (weakening highs, deeper corrections, VIX coming back down), means exiting prematurely. Pullbacks are part of a healthy trend.",
              "Wrong. Waiting for the break of the previous high to enter means entering far too late, above the last high, with no technical support to anchor the SL. The best entries in a regime are on pullback, not on breakout.",
            ]}
          />

        </div>

        {/* Footer */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => {
                  const p = getStoredProgress();
                  markLessonComplete(p, "macro-trading", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 3 of the Macro Trading module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/macro-trading/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Previous lesson
              </Link>
              <Link href="/strategies/macro-trading/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                Next lesson
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
