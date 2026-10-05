"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { ConfirmationM5Diagram } from "@/app/components/charts/ConfirmationM5Diagram";
import { RiskAffineDiagram } from "@/app/components/charts/RiskAffineDiagram";
import { ZoneEchecDiagram } from "@/app/components/charts/ZoneEchecDiagram";

const LESSONS = [
  { id: "lecon1", title: "Why analyze in multi-timeframe", disabled: false },
  { id: "lecon2", title: "The higher timeframe: the bias", disabled: false },
  { id: "lecon3", title: "The intermediate timeframe: the zone", disabled: false },
  { id: "lecon4", title: "The execution timeframe: the entry", disabled: false },
  { id: "lecon5", title: "The complete process", disabled: false },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "multi-timeframe", "lecon4"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Strategies</Link>
          <span>/</span>
          <Link href="/strategies/multi-timeframe" className="hover:text-zinc-400 transition-colors">Multi-timeframe Process</Link>
          <span>/</span>
          <span className="text-zinc-500">Lesson 4</span>
        </nav>

        {/* Header */}
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
            The execution timeframe: waiting for confirmation
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              A good zone is not enough. The market has to show that it is actually reacting before the entry.
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
            <span className="ml-auto text-xs text-zinc-600">4 / 5 lessons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo; The LTF does not predict the market. It confirms that the market is reacting. &rdquo;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- HTF dominant direction → see Lesson 2</li>
              <li>- H1-H4 zones of interest → see Lesson 3</li>
              <li>- Market structure, BOS, CHoCH → see SMC module</li>
            </ul>
          </div>

          {/* Bloc 3 — LE LTF SERT À VALIDER LA RÉACTION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The LTF is there to validate the reaction</h2>

            <div className="my-8">
              <ConfirmationM5Diagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The execution timeframe (M1/M5/M15) is the timeframe of timing, not of analysis. Its role is to confirm that the market is physically reacting in the zone prepared on the higher level. A clean reaction triggers the entry; no reaction = no trade. The LTF predicts nothing, it checks.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: the H1 zone is between 1.1750 and 1.1760. On M5, price arrives in the band, prints three consecutive upper wicks above 1.1755, then a bearish impulse breaks the last local low at 1.1748. The reaction is visible, the structural break confirms, the entry signal is valid.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Wait for a visible reaction in the zone, not just price being present</li>
              <li>- Rejection wicks, break of a local low, bearish BOS = LTF signals</li>
              <li>- No reaction = no entry, patience comes first</li>
              <li>- The LTF does not predict, it confirms</li>
            </ul>
          </section>

          {/* Bloc 4 — LE LTF SERT À AFFINER LE RISQUE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The LTF is there to refine risk</h2>

            <div className="my-8">
              <RiskAffineDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The LTF is not only for confirming: it also lets you reduce the distance between the entry and the Stop Loss. The same idea plays out with two very different risk sizings depending on whether you enter from the HTF or after local confirmation. The SL stays anchored to a structure that invalidates the scenario, but that structure is tighter on the LTF.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: short entry at 1.1758 below the zone. Without LTF confirmation, the SL has to cover the whole H4 zone, placed at 1.1790, i.e. 35 pts of risk. With M5 confirmation, the SL goes just above the last local rejection high, placed at 1.1772, i.e. 14 pts. Same trade idea, same target, but the entry-SL distance is divided by 2.5.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- A tight SL requires a clear local structure (rejection high, wick)</li>
              <li>- Reduced entry-SL distance = better R/R on the same target</li>
              <li>- The SL is never placed arbitrarily, it invalidates a structure</li>
              <li>- Risk measured in pts/pips, regardless of position size (see Lesson 8 Beginner)</li>
            </ul>
          </section>

          {/* Bloc 5 — UNE ZONE PEUT ÉCHOUER */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">A zone can fail</h2>

            <div className="my-8">
              <ZoneEchecDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Not all zones react. A zone that looks strong on paper can be cut through without any signal, the market does not stop there, produces no rejection wick, no local break in favor of the scenario. The LTF then protects the capital: no reaction = no entry. Patience lets you wait for the next zone instead of forcing a trade.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD: H1 support expected at $4,545. On M5, price arrives and cuts through the band without any lower rejection wick, in a clean bearish sequence. The continuation extends well below the zone, with no bounce or sign of recovery. No entry signal is given, the setup is invalidated.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- A zone can be cut through without reaction, that is expected</li>
              <li>- The absence of reaction is itself a signal, do not enter</li>
              <li>- Keep your patience: the next zone or a return can give a better signal</li>
              <li>- Trade on confirmation, never on prediction</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Application plan: a full EUR/USD case</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Here is the complete Daily → H1 → M5 sequence on an EUR/USD case. The goal is to run the three levels end to end and make the distinct role of each one concrete.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Step 1. HTF (Daily / H4)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: bearish bias in LH/LL, Daily resistance 1.1780, current price 1.1715</li>
                <li>- Conclusion: bearish dominant direction, sells prioritized</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 2. Intermediate timeframe (H1)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: confluent zone 1.1750-1.1760 (former broken support + unmitigated bearish FVG)</li>
                <li>- Conclusion: prepare a short scenario on price return into the zone</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 3. LTF (M5)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: price in the zone, three consecutive rejection upper wicks, break of the local low at 1.1748</li>
                <li>- Conclusion: valid confirmation, short entry at 1.1758, tight SL just above the last rejection high (1.1772, 14 pts)</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = direction · Intermediate timeframe = zone · LTF = timing + reduced risk
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "The LTF is not for analyzing, it is for confirming that the zone reacts.",
              "A visible reaction (rejection wick, local structure break) triggers the entry.",
              "The LTF also lets you reduce risk with a tight SL on the local structure.",
              "No reaction = no entry, protecting the capital comes before the need to trade.",
            ]}
          />

          <LessonExercice
            description="Open EUR/USD on TradingView and practice waiting for the LTF confirmation before any entry."
            steps={[
              "Draw a zone of interest on H1 (see Lesson 3) and wait for price to return into it.",
              "When price touches the zone, drop to M5. Look for a rejection (wick), a local structure break (BOS) or a build-up of signals in the direction of the HTF bias.",
              "If the reaction is clean: note the entry point and the tight SL, anchored to the local structure. If no reaction appears: stay on the sidelines, note the cut-through and move to the next zone.",
            ]}
          />

          <LessonQuiz
            question="Price arrives in a prepared HTF zone. On M5, no rejection wick, no local structure break, just a clean cut-through. What do you do?"
            options={[
              "You enter anyway: the HTF zone is solid, the LTF only has a secondary role",
              "You enter with a very wide SL to absorb the fluctuation",
              "You do not enter: without an LTF reaction, the setup is invalidated",
              "You take the other side, assuming a reversal",
            ]}
            correctIndex={2}
            explanation="The role of the LTF is to CONFIRM the market's reaction in the zone. If the zone is cut through without any rejection signal or structural break, the scenario is invalidated. The absence of reaction is itself a signal, patience lets you wait for the next opportunity instead of entering blind."
            answerExplanations={[
              "Wrong. The LTF is not optional, it is the very condition of the entry. A zone that does not react is not actionable, no matter its HTF quality.",
              "Wrong. Widening the SL to 'absorb the risk' does not fix the underlying problem: without an LTF reaction, nothing indicates the scenario will trigger. It is just a more expensive bet.",
              "Correct. Without an LTF signal (rejection wick, BOS, break of a local low), the setup is not confirmed. The rule is clear: no reaction = no entry. The capital stays protected.",
              "Wrong. Taking the other side on the mere cut-through of a zone, without favorable HTF context or a structural reversal signal, is trading against the dominant trend with no basis at all.",
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
                  markLessonComplete(p, "multi-timeframe", "lecon4");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 4 of the Multi-timeframe Process module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/multi-timeframe/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Previous lesson
              </Link>
              <Link href="/strategies/multi-timeframe/lecon5" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
