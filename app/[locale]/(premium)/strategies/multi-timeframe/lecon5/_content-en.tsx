"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { ProcessFunnelDiagram } from "@/app/components/charts/ProcessFunnelDiagram";
import { DailyContextDiagram } from "@/app/components/charts/DailyContextDiagram";
import { H1ZonePreparationDiagram } from "@/app/components/charts/H1ZonePreparationDiagram";
import { M15ValidationDiagram } from "@/app/components/charts/M15ValidationDiagram";

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
    setDone(isLessonComplete(getStoredProgress(), "multi-timeframe", "lecon5"));
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
          <span className="text-zinc-500">Lesson 5</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Intermediate
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">20 min</span>
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
            The complete multi-timeframe process: from the Daily to execution
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Losing traders look for an entry. Structured traders build a scenario before they even think about clicking.
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
              const isCurrent = lesson.id === "lecon5";
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
            <span className="ml-auto text-xs text-zinc-600">5 / 5 lessons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-blue-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &ldquo; A winning trade is not a good entry. It is a scenario that lined up from top to bottom. &rdquo;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Multi-timeframe introduction → see Lesson 1</li>
              <li>- HTF dominant direction → see Lesson 2</li>
              <li>- H1-H4 zones of interest → see Lesson 3</li>
              <li>- LTF confirmation → see Lesson 4</li>
            </ul>
          </div>

          {/* Bloc 3 — LE PROCESS COMPLET */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The complete process at a glance</h2>

            <div className="my-8">
              <ProcessFunnelDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The multi-timeframe process works like a funnel: each level filters the next and narrows the possibilities. Daily / H4 → give the direction; H1 → identify the zone of interest; M15 / M30 → wait for the reaction and confirm. The trade only comes at the very end, it is the outcome of a logical chain, not an isolated signal grabbed on the fly.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- The analysis always goes down from the HTF to the LTF, never the other way</li>
              <li>- Each level answers a precise question: where is the market going, where can it react, when to enter</li>
              <li>- A trade aligned across all three levels is rare, but that is precisely what makes it a high-probability setup</li>
              <li>- Skipping a level = improvising; the process protects against impulsiveness</li>
            </ul>
          </section>

          {/* Bloc 4 — LE DAILY DONNE LA DIRECTION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The Daily gives the direction</h2>

            <div className="my-8">
              <DailyContextDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The Daily (or H4) is the context level. It answers a single question: which way is the market moving over several days or weeks? You read it through structure: Lower Highs / Lower Lows for a downtrend, Higher Highs / Higher Lows for an uptrend. The impulses are strong and extended in the dominant direction, the corrections are soft and limited in the opposite direction. This bias conditions everything that follows, you will only take sells in a bearish HTF context, buys only in a bullish HTF context.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: on the Daily, three consecutive LH (1.1860, 1.1830, 1.1780) below the 1.1860 resistance, with clean bearish impulses between each correction. The bias is clearly a sell, any buy idea is ruled out from the start. You will look for shorts on a return of price into a higher zone.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- The HTF (Daily / H4) sets the direction of the possible trades</li>
              <li>- LH/LL structure = sells only; HH/HL = buys only</li>
              <li>- As long as the HTF structure is not broken, the bias stays the same</li>
              <li>- Trading against the HTF bias = trading against the flow with no need to</li>
            </ul>
          </section>

          {/* Bloc 5 — LE H1 PRÉPARE LA ZONE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The H1 prepares the zone</h2>

            <div className="my-8">
              <H1ZonePreparationDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Once the direction is set, the H1 locates the precise zone where the scenario can activate. These zones are drawn in advance, former supports turned resistances, unmitigated FVGs, bearish Order Blocks, confluences. Price usually approaches them by slowing down: the candles get shorter, the momentum fades. This zone stays inert as long as price has not actually tested it, it triggers no trade on its own, it sets the table.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: at 1.1750-1.1760, a former broken support overlaps an unmitigated bearish FVG left by the last bearish impulse. The zone is drawn on the H1, in the direction of the Daily bias. Price climbs gradually with shorter and shorter candles as it approaches 1.1760, the table is set, you wait for the reaction.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- An H1 zone is drawn in advance, never after the fact</li>
              <li>- The more confluent the zone (FVG + former support + Order Block) the stronger it is</li>
              <li>- The zone triggers nothing, it prepares the trade hypothesis</li>
              <li>- Price slowing down on approach is a sign of interest, not an entry signal</li>
            </ul>
          </section>

          {/* Bloc 6 — LE M15 VALIDE L'EXÉCUTION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The M15 validates the execution</h2>

            <div className="my-8">
              <M15ValidationDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The M15 is the timing level. When price enters the H1 zone, you drop to the LTF to watch the reaction: successive rejection wicks, formation of a local high, then a structural break of a recent low in favor of the bias. It is these concrete signals that validate the entry, not the mere presence of price in the zone. The execution happens on the break, the SL is anchored tight just above the last rejection high.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: price reaches the 1.1750-1.1760 zone and prints three consecutive upper wicks between 1.1758 and 1.1762, without closing above. The last local low between the rejection candles is at 1.1750. Three bearish M15 candles follow and break that low cleanly toward 1.1745. The reaction is clean, the break confirms, short entry at 1.1758 on the break, SL at 1.1772 (just above the last rejection high).
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- The M15 is not for analyzing the market, it is for confirming a hypothesis built higher up</li>
              <li>- Rejection wick + break of a local low = classic validation combo</li>
              <li>- A tight SL requires a clear local structure (rejection high)</li>
              <li>- No reaction = no entry, the zone fails, you wait for the next one</li>
            </ul>
          </section>

          {/* Bloc 7 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Application plan: a full EUR/USD case</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Here is a short EUR/USD trade run from the Daily to execution, step by step. Each level plays its distinct role and naturally leads to the next.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Step 1. Daily: direction</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: clean LH/LL structure for three weeks, Daily resistance at 1.1860</li>
                <li>- Conclusion: bearish bias confirmed, only shorts to favor</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 2. H1: zone</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: confluent zone 1.1750-1.1760 (former broken support + unmitigated bearish FVG)</li>
                <li>- Conclusion: zone drawn in advance, ready to receive price; short scenario prepared on return</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 3. M15: confirmation</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: price in the zone, three consecutive upper wicks, break of the local low at 1.1748</li>
                <li>- Conclusion: the reaction validates the entry, execution authorized</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 4. Execution</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Short entry: 1.1758</li>
                <li>- Stop loss: 1.1772 (just above the last rejection high), i.e. 14 pts of risk</li>
                <li>- Take profit: 1.1695 (at the level of the last Daily LL), i.e. 63 pts of potential gain</li>
                <li>- R/R ≈ 1:4.5, high-probability setup because aligned Daily + H1 + M15</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  Daily = direction · H1 = zone · M15 = timing · Execution = outcome, not starting point
                </p>
              </div>
            </div>
          </section>

          {/* Bloc 8 — LES ERREURS QUI DÉTRUISENT LE PROCESS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The mistakes that destroy the process</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The process is powerful as long as it is followed in order. The moment you skip a level, the scenario loses all its logic, you fall back into impulsive trading. Here are the four typical slip-ups.
            </p>

            <div className="grid gap-3 my-6">
              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">1. Starting directly on M15</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Spotting a setup on M15 then trying to justify it on the higher TFs is reversing the process. You end up mentally validating a trade you have already decided to take. The HTF must always come first.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">2. Skipping the H1 zone</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Having a Daily bias and entering directly on an M15 signal, without an H1 zone drawn in advance, is trading isolated signals. The zone gives the context of the entry, without it, the M15 produces noise constantly.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">3. Entering without an M15 reaction</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Price touches the H1 zone, you enter early because &ldquo; everything else is aligned &rdquo;. That is exactly where the zone fails most often. Without a clear LTF signal, the entry is not validated, you wait or you pass.
                </p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/60">
                <p className="text-white font-semibold text-sm mb-1.5">4. Trading against the HTF bias based on the last M15 move</p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Bearish Daily bias, but a &ldquo; nice &rdquo; H1 support zone and a last bullish M15 move invite a long. Trading counter-trend based on a recent LTF move, with no HTF structural reason (CHoCH, major reversal), amounts to betting on noise. The HTF bias stays the priority as long as it is not broken.
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "The process always goes down from the HTF to the LTF, never the other way.",
              "Each level has a distinct role: Daily = direction, H1 = zone, M15 = timing.",
              "The M15 validates the execution, it confirms the reaction, it does not predict it.",
              "Skipping a level = falling back into impulsive trading: the process protects against improvisation.",
            ]}
          />

          <LessonExercice
            description="On TradingView, run a full multi-timeframe process on the pair of your choice, from the Daily to the M15."
            steps={[
              "Daily: identify the structure (LH/LL or HH/HL) and conclude a clear directional bias. If the structure is ambiguous, change pairs, without a clear HTF bias, the process does not start.",
              "H1: draw in advance the most confluent zone of interest in the direction of the bias (former support/resistance, FVG, Order Block). Note the exact levels at the top and bottom of the zone.",
              "M15: wait for price to enter the zone, then watch the reaction. If a rejection wick appears followed by a structural break, note the entry, the tight SL and the target TP. If nothing happens, do not force it, simply note that the zone failed.",
            ]}
          />

          <LessonQuiz
            question="You spot a clean M15 signal (rejection + break) on EUR/USD, but without having drawn an H1 zone beforehand and without having checked the Daily bias. What do you do?"
            options={[
              "You drop to M5 to confirm more precisely before entering",
              "You enter with a reduced size to limit the risk",
              "You take the other side, assuming the signal heralds a fake move",
              "You do not enter: an M15 signal outside the process is not a valid setup",
            ]}
            correctIndex={3}
            explanation="An isolated LTF signal, without a prepared H1 zone and without an aligned Daily bias, is not a multi-timeframe setup, it is just noise you happened to notice. The process requires the three levels to be coherent BEFORE the execution signal. Trading an M15 signal out of context is exactly what the process is designed to guard against: impulsiveness."
            answerExplanations={[
              "Wrong. Dropping even lower (M5) does not add the missing HTF context. Refining an isolated signal does not turn it into a setup, it just increases the precision of a poorly framed decision.",
              "Wrong. Reducing the size does not fix the underlying problem: the absence of HTF context. You do not shrink a bad setup by risking less, you eliminate it.",
              "Wrong. Taking the other side based on a single LTF signal, with no structural bias or zone, is trading the noise in the other direction, exactly the same problem.",
              "Correct. The process requires Daily + H1 + M15 alignment. An M15 signal outside the process is by definition an isolated signal, spotted without preparation. The discipline is not to trade outside the process, patience lets you wait for a truly built setup.",
            ]}
          />

          <LessonQuiz
            question="You have a bearish Daily bias and an H1 zone at 1.1750-1.1760. Price enters the zone, but on M15, no rejection wick, no break of a local low, just a sideways consolidation. What do you do?"
            options={[
              "You enter: the H1 zone is confluent, the consolidation will eventually break to the downside",
              "You enter in the middle of the zone betting on the average fluctuation",
              "You do not enter as long as the M15 does not confirm the reaction",
              "You place a limit order above the zone and let it run",
            ]}
            correctIndex={2}
            explanation="Without M15 confirmation, the process is not complete, no matter the quality of the Daily and the H1 zone. The sideways consolidation in the zone is neither a rejection nor a break; it validates nothing. The role of the M15 is precisely to filter out this kind of zone that &ldquo; could have &rdquo; worked but shows no concrete signal. Patience."
            answerExplanations={[
              "Wrong. &ldquo; Will eventually break &rdquo; is a prediction, not an observation. The process is built on concrete signals, not on projections.",
              "Wrong. Entering in the middle of the zone with no LTF signal is a bet on the average, exactly the opposite of a confirmed setup. That is what you avoid.",
              "Correct. The M15 has to validate the reaction (rejection wick + structural break). Without these signals, the execution level is not crossed, no entry. This discipline protects against zones that look strong but do not react.",
              "Wrong. A passive limit order turns an unconfirmed setup into an automatism, it is the worst compromise: you take the risk without having validated the trigger.",
            ]}
          />

          <LessonQuiz
            question="What is the exact role of the Daily in the multi-timeframe process?"
            options={[
              "Give the precise entry point thanks to its readability",
              "Refine the timing at the M1 level and complete the execution signal",
              "Define the dominant direction and the side of the allowed trades",
              "Provide the SL thanks to wide and stable structures",
            ]}
            correctIndex={2}
            explanation="The Daily (or H4) is the context level. Its sole role is to define the dominant direction via structure (LH/LL or HH/HL). This direction then conditions which types of trades are allowed on the lower levels. The Daily gives neither a precise entry point (too wide), nor the execution zone (that is the H1), nor the tight SL (that is the M15)."
            answerExplanations={[
              "Wrong. The Daily is too wide to provide a precise entry point, a Daily candle represents a range of several dozen pts. The entry is prepared on H1 and triggered on M15.",
              "Wrong. The Daily has nothing to do with fine timing. Refining on M1 would be the LTF's job, and the Daily is precisely at the opposite end from that level, it sets the general context, not the trigger.",
              "Correct. The Daily gives the general context: LH/LL structure = sells only, HH/HL structure = buys only. It is this direction that conditions the whole process downstream.",
              "Wrong. The tight SL is built on the M15 local structure (rejection high or low). An SL anchored to a Daily structure would be far too wide and would kill the R/R.",
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
                  markLessonComplete(p, "multi-timeframe", "lecon5");
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
                  <p className="text-sm font-semibold text-emerald-400">Multi-timeframe module completed</p>
                  <p className="text-xs text-zinc-500 mt-0.5">You have completed all 5 lessons of the Multi-timeframe Process module.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/multi-timeframe/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Previous lesson
              </Link>
              <Link href="/strategies/multi-timeframe" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
