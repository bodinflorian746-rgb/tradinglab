"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { ZoneHistoireDiagram } from "@/app/components/charts/ZoneHistoireDiagram";
import { RetourDesequilibreDiagram } from "@/app/components/charts/RetourDesequilibreDiagram";
import { ScenarioZoneDiagram } from "@/app/components/charts/ScenarioZoneDiagram";

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
    setDone(isLessonComplete(getStoredProgress(), "multi-timeframe", "lecon3"));
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
          <span className="text-zinc-500">Lesson 3</span>
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
            The intermediate timeframe: spotting the zone that matters
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              The HTF gives the direction. The intermediate timeframe shows where the market has a real reason to react.
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
            <span className="ml-auto text-xs text-zinc-600">3 / 5 lessons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo; A strong zone is never a line drawn at random. It is a level that stacks several reasons to react. &rdquo;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- HTF dominant direction → see Lesson 2</li>
              <li>- Supports and resistances → see Support/Resistance module</li>
              <li>- FVG, liquidity, sweep → see SMC module</li>
            </ul>
          </div>

          {/* Bloc 3 — UNE ZONE DOIT RACONTER UNE HISTOIRE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">A zone has to tell a story</h2>

            <div className="my-8">
              <ZoneHistoireDiagram />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A valid zone of interest is not just a line drawn at random. A strong zone tells a story: it stacks several reasons to react at the same level, a former support turned resistance, an FVG left by an impulse, a liquidity zone not yet taken. The more reasons the level stacks, the higher the probability of reaction.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1: 1.1760 is a former support broken during a drop. Price then left a bearish FVG between 1.1750 and 1.1760 in the bearish impulse. On the current move up, this level therefore stacks two reasons: former support turned resistance and an unmitigated FVG. The zone concentrates several reasons to react in the same spot.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Look for confluence before drawing a zone</li>
              <li>- Stack the reasons: former S/R, FVG, liquidity, projection</li>
              <li>- Favor zones that stack at least two criteria</li>
              <li>- Ignore isolated levels with no technical context</li>
            </ul>
          </section>

          {/* Bloc 4 — LE MARCHÉ REVIENT DANS LES ZONES FORTES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The market comes back into strong zones</h2>

            <div className="my-8">
              <RetourDesequilibreDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The market does not go up or down in a straight line. After a strong impulse, price frequently comes back into the imbalance zones left along the way. FVG, Order Block, rejection wick. This return is not a reversal: it is a mitigation of the imbalance before the original move resumes.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD H1: brutal bearish impulse from $4,680. The move leaves a bearish FVG between $4,648 and $4,660. Several hours later, price climbs gradually back into that band. On contact, the wick partially crosses the FVG, then the rejection kicks in strongly to the downside. The return into the imbalance preceded the bearish continuation.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Spot the FVGs left by HTF impulses</li>
              <li>- Wait for price to return into the zone, do not anticipate</li>
              <li>- A return is not a reversal, it is a mitigation</li>
              <li>- Favor zones consistent with the HTF bias</li>
            </ul>
          </section>

          {/* Bloc 5 — LE TIMEFRAME INTERMÉDIAIRE PRÉPARE LE SCÉNARIO */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The intermediate timeframe prepares the scenario</h2>

            <div className="my-8">
              <ScenarioZoneDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The intermediate timeframe is not for entering, it is for setting the table. It is the level that turns the HTF direction into an actionable plan. There you draw the zone, you note the levels, you prepare what you will wait for next on the execution timeframe. The scenario is set well before a signal appears.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1: bearish HTF bias, wide resistance zone between 1.1750 and 1.1760 drawn in advance. As price approaches the band, the bullish candles lose amplitude, the impulses shorten, the corrections lengthen. The market runs out of steam without any entry signal yet being given. The scenario is ready: all that is left is to wait for the trigger on the execution timeframe.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Draw the zone BEFORE price reaches it</li>
              <li>- Note the key levels ahead of time</li>
              <li>- Watch for the loss of impulse as price approaches the zone</li>
              <li>- Do not enter on the intermediate timeframe, prepare, that is all</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Application plan: an EUR/USD case</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The intermediate timeframe is read after the HTF and before the LTF. Here is how to set the zone on an EUR/USD case, the goal is not to enter, but to prepare the scenario.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Step 1. HTF (Daily/H4)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: structure in LH/LL, bearish bias already identified (see Lesson 2)</li>
                <li>- Conclusion: bearish dominant direction, sells prioritized</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 2. Intermediate timeframe (H1)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: former support at 1.1760 turned resistance, unmitigated bearish FVG 1.1750-1.1760</li>
                <li>- Conclusion: confluent zone to watch, prepare a short scenario on price return</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 3. Prepare the scenario</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Expected: a move up toward the 1.1750-1.1760 band, loss of impulse on approach, then confirmation on the execution timeframe (Lesson 4)</li>
                <li>- Avoided: an anticipated entry before price actually returns into the zone</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = direction · Intermediate timeframe = zone · LTF = execution (Lesson 4)
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "A strong zone stacks several reasons to react, confluence above all.",
              "The market comes back into the imbalances left by HTF impulses.",
              "The intermediate timeframe prepares the scenario, it does not execute.",
              "Draw the zone before price reaches it, never after.",
            ]}
          />

          <LessonExercice
            description="Open EUR/USD on TradingView in H1 and practice identifying a zone that tells a story."
            steps={[
              "Spot an important former support on H1 and draw it. Check whether it was broken then turned into resistance.",
              "Look for an FVG left by the last bearish impulse. Draw the full band, not just a single line.",
              "Note all the reasons that stack at this level: former S/R, FVG, liquidity, projection. If you stack at least two, the zone tells a story.",
            ]}
          />

          <LessonQuiz
            question="What makes a zone of interest particularly strong on the intermediate timeframe?"
            options={[
              "The mere fact that price has already touched it several times",
              "Confluence, several reasons to react stacked at the same level",
              "Its position on a round number like 1.1800 or 1.2000",
              "The fact that it is the absolute high or low of the day",
            ]}
            correctIndex={1}
            explanation="A strong zone tells a story: a former support turned resistance, an FVG left by an impulse, a liquidity zone not yet taken. The more reasons the level stacks, the higher the probability of reaction. A simple repeated touch, a round number or a daily extreme are not enough on their own, it is the stacking of technical criteria that creates a truly actionable zone."
            answerExplanations={[
              "Incorrect. A level touched several times draws attention, but without context (former S/R, FVG, liquidity), it stays fragile. The number of touches does not create confluence on its own.",
              "Correct. Confluence, the stacking of several reasons to react in the same spot, is the central criterion. The more technical arguments the zone stacks, the stronger the probability of reaction.",
              "Incorrect. Round numbers attract the psychological attention of participants, but do not, on their own, create an institutional zone of interest. Without real technical confluence, they are weak levels.",
              "Incorrect. The high or low of the day is only a statistical reference. Without alignment with a structural zone, an FVG or liquidity, that level tells no actionable story.",
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
                  markLessonComplete(p, "multi-timeframe", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 3 of the Multi-timeframe Process module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/multi-timeframe/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Previous lesson
              </Link>
              <Link href="/strategies/multi-timeframe/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
