"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { PDArrayContextDiagram } from "@/app/components/charts/PDArrayContextDiagram";
import { FVGMitigationDiagram } from "@/app/components/charts/FVGMitigationDiagram";
import { FVGMitigationScenariosDiagram } from "@/app/components/charts/FVGMitigationScenariosDiagram";
import { PDArrayConfluenceDiagram } from "@/app/components/charts/PDArrayConfluenceDiagram";

const LESSONS = [
  { id: "lecon1", title: "Liquidity and manipulation", disabled: false },
  { id: "lecon2", title: "PD Arrays", disabled: false },
  { id: "lecon3", title: "Killzones", disabled: false },
  { id: "lecon4", title: "Displacement", disabled: false },
  { id: "lecon5", title: "Complete ICT model", disabled: false },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "ict", "lecon2"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Strategies</Link>
          <span>/</span>
          <Link href="/strategies/ict" className="hover:text-zinc-400 transition-colors">Complete ICT</Link>
          <span>/</span>
          <span className="text-zinc-500">Lesson 2</span>
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
            PD Arrays: spotting the zones where the market can react
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              The market doesn&apos;t react everywhere. Certain zones naturally concentrate more reactions, rejections and moves.
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
            <span className="ml-auto text-xs text-zinc-600">2 / 5 lessons</span>
          </div>
        </header>

        <div className="space-y-8">

          {/* Bloc 1 — HERO QUOTE */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &laquo; The market doesn&apos;t stop just anywhere. It stops where it has a structural reason to. &raquo;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PREREQUISITES + INTRO */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Liquidity and manipulation → see ICT module, Lesson 1</li>
              <li>- FVG and Order Blocks → see SMC module, lessons &laquo; Order Blocks: identifying institutional zones &raquo; and &laquo; FVG and liquidity: trading the institutional imbalance &raquo;</li>
              <li>- Multi-timeframe → see Multi-timeframe Process module</li>
            </ul>
          </div>

          <section>
            <p className="text-zinc-300 leading-relaxed text-sm">
              After the liquidity grab covered in Lesson 1, the second building block of the ICT model is knowing WHERE the market can react. PD Array stands for Premium/Discount Array: these are the price zones where the institutional market is statistically most likely to react. FVG, Order Blocks, old supports/resistances, recent sweeps, these elements are the basic bricks of a PD Array. Read well, they let you anticipate where a zone will likely produce a rejection; read poorly, they flood the chart with an endless number of levels, none of which hold.
            </p>
          </section>

          {/* Bloc 3 — NOT ALL FVG AND OB ARE EQUAL */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Not all FVG and OB are equal</h2>

            <div className="my-8">
              <PDArrayContextDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              On any chart, you can find dozens of FVG and Order Blocks. Most of them will produce nothing, price will run straight through without even slowing down. The sorting is done by CONTEXT: an FVG created by an impulse right after a liquidity sweep is very different from an FVG left by a random candle in the middle of a range. The first carries the institutional intent that just took the liquidity; the second is only a statistical gap with no structural meaning.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1: H4 resistance at 1.1780, two visible equal highs. A candle sweeps to 1.1792 and takes the liquidity above, then a large bearish candle creates an FVG between 1.1758 and 1.1770. This FVG is qualified: it was born right after the liquidity grab, in a clear impulse. When price comes back into this zone, the rejection probability is high, not because it&apos;s &laquo; an FVG &raquo;, but because it&apos;s an FVG in a coherent structural context.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- An FVG or an OB on its own, out of context, has no predictive value</li>
              <li>- Context = what happened just before (sweep, BOS, CHoCH)</li>
              <li>- An FVG born from a post-liquidity impulse is qualified, a &laquo; mid-range &raquo; FVG is not</li>
              <li>- The rule: no context = ignore the level, even if it looks visually clean</li>
            </ul>
          </section>

          {/* Bloc 4 — THE MARKET OFTEN RETURNS INTO IMBALANCES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The market often returns into imbalances</h2>

            <div className="my-8">
              <FVGMitigationDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              An impulse that leaves an FVG is by nature an imbalance, price moved too fast for all the transactions at the &laquo; right &raquo; price to be executed. The market tends to come back to mitigate these imbalances before continuing in the direction of the impulse. This mitigation is precisely the opportunity the ICT trader looks for: the return into the FVG offers a much more precise and tight entry zone than the impulse itself, which is rarely caught in time.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD H1: from $4,690, a strong bearish impulse leaves an FVG between $4,655 and $4,665. Price continues down to 4,620, then climbs back gradually toward 4,660, entering the FVG. There, an impulsive bearish candle marks the rejection; price heads toward 4,610 in the next session. The mitigation was the entry signal, not the initial impulse, already gone.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- An FVG is an imbalance, the market tends to return to fill the missing transactions</li>
              <li>- The mitigation offers a second chance to enter, with a better price and a tighter SL</li>
              <li>- Not all FVG are mitigated, but those in a strong structural context often are</li>
              <li>- Don&apos;t confuse mitigation and invalidation: a mitigated FVG is filled but can still react on the next test</li>
            </ul>
          </section>

          {/* Bloc 4.5 — BOUNCE, DEEP MITIGATION OR INVALIDATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Bounce, deep mitigation or invalidation: don&apos;t confuse them</h2>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              When price comes back into an FVG, there&apos;s a classic trap: believing a &laquo; filled &raquo; FVG is automatically dead. That&apos;s false. An FVG can be traversed deeply, almost entirely, and keep reacting perfectly on the next test. What truly invalidates an FVG isn&apos;t the filling, it&apos;s the <span className="text-white font-semibold">clean structural break</span> beyond the zone, accompanied by an absence of reaction and an HTF context that no longer supports the scenario.
            </p>

            <div className="my-6">
              <FVGMitigationScenariosDiagram locale="en" />
            </div>

            <div className="space-y-4">
              {/* 1. Immediate bounce */}
              <div className="border-l-2 border-emerald-500/50 pl-4">
                <p className="text-white font-semibold text-sm mb-1">1. Immediate bounce</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Price barely touches the zone (top of the FVG)</li>
                  <li>- Quick reaction, visible rejection candle</li>
                  <li>- Strong momentum on the resumption</li>
                  <li>- Clear directional context, this is the textbook read of a fresh FVG</li>
                </ul>
              </div>

              {/* 2. Partial mitigation */}
              <div className="border-l-2 border-emerald-500/30 pl-4">
                <p className="text-white font-semibold text-sm mb-1">2. Partial mitigation</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Price enters part of the FVG (~30-50%)</li>
                  <li>- The zone is rebalanced but not saturated</li>
                  <li>- The setup stays valid as long as the structure holds</li>
                  <li>- Intermediate read: between bounce and deep mitigation, manage as an active FVG</li>
                </ul>
              </div>

              {/* 3. Deep mitigation */}
              <div className="border-l-2 border-amber-500/60 pl-4">
                <p className="text-white font-semibold text-sm mb-1">3. Deep mitigation</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Price fills 70-95% of the zone, sometimes down to the bottom</li>
                  <li>- <span className="text-amber-400 font-semibold">Not automatically an invalidation</span></li>
                  <li>- What matters: the reaction that follows (rejection wick, clean resumption candle)</li>
                  <li>- If the HTF structure holds and the reaction comes, the FVG is mitigated but valid</li>
                </ul>
              </div>

              {/* 4. Real invalidation */}
              <div className="border-l-2 border-red-500/60 pl-4">
                <p className="text-white font-semibold text-sm mb-1">4. Real invalidation</p>
                <ul className="space-y-1 text-sm text-zinc-300">
                  <li>- Clean structural break beyond the invalidation zone</li>
                  <li>- Clean close beyond the FVG, not just a wick</li>
                  <li>- Total absence of reaction over several candles</li>
                  <li>- Clean opposite displacement, continued momentum in the contrary direction</li>
                  <li>- HTF context that no longer supports the scenario (opposite BOS / CHoCH)</li>
                </ul>
              </div>
            </div>

            <div className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-4 md:p-6 my-6">
              <p className="text-amber-400 font-semibold text-sm mb-2">Rule to remember</p>
              <p className="text-sm text-zinc-200 leading-relaxed">
                Filled FVG <span className="text-zinc-500">≠</span> dead setup.
                <br />
                <span className="text-white font-semibold">Filled FVG WITHOUT reaction + broken structure = probable invalidation.</span>
              </p>
            </div>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-3">Concrete example. Bullish FVG between 1.0840 and 1.0860</p>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>
                  <span className="text-emerald-400 font-semibold">Case A. Immediate bounce:</span> price comes back to 1.0860, prints a wick, a green candle of strength, heads toward 1.0920. Fresh FVG, A+ setup, optimized RR.
                </li>
                <li>
                  <span className="text-amber-400 font-semibold">Case B. Deep mitigation:</span> price drops to 1.0842 (almost the whole FVG), long buy wick, close at 1.0855 then resumption. The FVG is mitigated but the rejection is clean, the setup stays active. Stop at 1.0838.
                </li>
                <li>
                  <span className="text-red-400 font-semibold">Case C. Invalidation:</span> price runs through the FVG without reaction, closes at 1.0825, breaks the previous swing low. No buy wick, continued bearish momentum. The FVG is dead, no trade, you wait for a new structure.
                </li>
              </ul>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Before calling an &laquo; FVG dead &raquo;, check: was there a reaction candle?</li>
              <li>- A deep wick without a close beyond = mitigation, not invalidation</li>
              <li>- Invalidation is confirmed in what follows, not in the touch itself</li>
              <li>- If HTF holds and the structure is intact, a deeply mitigated FVG can give the best signal of the session</li>
            </ul>
          </section>

          {/* Bloc 5 — THE BEST ZONES = CONFLUENCE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The best zones = confluence</h2>

            <div className="my-8">
              <PDArrayConfluenceDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A single zone, even a qualified one, remains a probabilistic bet. The strength of a PD Array increases significantly when several structural elements overlap at the same price level: an old broken support turned resistance, a bearish FVG in the same band, a recent sweep above. When three elements tell the same story in the same place, the zone becomes a true pivot point, this is what we call a confluence. Confluence zones are rare but offer the best setups in the ICT model.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD H1: at 1.1780 you find simultaneously an old H1 support broken two sessions earlier, a bearish FVG left by the impulse that broke that support, and a recent sweep just above. Three elements, one single zone. When price comes back to test this level, the rejection probability is clearly higher than that of an isolated FVG, the market &laquo; sees &raquo; the zone through several channels at once.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- A single zone = a decent setup; a confluence = a premium setup</li>
              <li>- Stacking old support/resistance + FVG + sweep at the same price multiplies reliability</li>
              <li>- Confluence zones are rare, you spot 1 to 3 per week on a major pair</li>
              <li>- If no structural element overlaps the FVG, you should probably pass</li>
            </ul>
          </section>

          {/* Bloc 6 — APPLICATION PLAN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Application plan: a complete EUR/USD PD Array</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Here is the full sequence to qualify and trade a PD Array on EUR/USD. Four steps, each with its role.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Step 1. Daily: direction and context</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: EUR/USD Daily in LH/LL structure, Daily resistance at 1.1780, current price 1.1735</li>
                <li>- Conclusion: bearish bias, we&apos;ll look for shorts on a high PD Array</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 2. H1: identify the PD Arrays</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: old H1 support broken at 1.1780 + bearish FVG between 1.1758 and 1.1770 + recent sweep at 1.1792</li>
                <li>- Conclusion: confluent zone 1.1758-1.1780. Premium PD Array, we prepare a short scenario on the return</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 3. Return into the zone: watch the mitigation</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: over 3 sessions, price climbs gradually toward 1.1760, entering the FVG</li>
                <li>- Conclusion: the zone is tested, we switch to &laquo; watch &raquo; mode for the reaction, no entry yet</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 4. Potential execution (M15)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: on M15, upper rejection wicks at 1.1768, then an impulsive bearish candle that breaks the local low at 1.1748</li>
                <li>- Conclusion: short entry at 1.1758 on the break, SL at 1.1772 (above the rejection high), TP toward the next low liquidity zone at 1.1695. If no impulsive candle appears, the zone fails, no entry</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  Daily = context · H1 = PD Array · Return = mitigation · M15 = execution
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "An FVG or an OB on its own is worthless without structural context, sweep, BOS or impulse right before.",
              "The market tends to come back to mitigate imbalances before continuing in the direction of the impulse.",
              "A confluence (broken support + FVG + sweep in the same zone) clearly multiplies the reliability of the PD Array.",
              "No context = ignore the level; no confluence = a decent but not premium setup.",
            ]}
          />

          <LessonExercice
            description="On TradingView, spot a confluent PD Array on the pair of your choice and qualify it step by step."
            steps={[
              "HTF (Daily/H4): conclude a clear directional bias. Without a bias, don't drop lower, a PD Array against the bias is very unreliable.",
              "H1: look for an FVG in the direction of the bias, created by an impulse right after a sweep or a BOS. Check that it coincides with an old broken support/resistance. If so, you have a confluence.",
              "Wait for price to return into the PD Array. On M15, watch the reaction: rejection wicks + impulsive candle = validated entry. If the zone is traversed without reaction, the setup is invalidated, move to the next one.",
            ]}
          />

          <LessonQuiz
            question="You spotted a bearish FVG on H1 EUR/USD. Which confluence makes it clearly more reliable for a short?"
            options={[
              "The FVG is well isolated and cleanly delimited, with no other level around it",
              "The FVG coincides with an old broken support and a recent sweep above",
              "The FVG is very far from all the other structural levels on the chart",
              "The FVG formed without a prior impulse, simply through sideways drift",
            ]}
            correctIndex={1}
            explanation="An isolated PD Array remains a probabilistic bet. Reliability increases significantly when several elements tell the same story at the same level: old broken support + FVG + recent sweep = confluence. It's precisely this overlap that turns a decent setup into a premium one."
            answerExplanations={[
              "False. An isolated FVG, with no other structural level around it, is a weak setup. The market can run through it without reaction. Isolation isn't a quality, it's the absence of confluence.",
              "Correct. The confluence (old broken support + FVG + sweep) means several structural reads converge at the same price. The market 'sees' the zone through several channels, which clearly increases the probability of a reaction.",
              "False. An FVG far from any structure is anything but premium. ICT looks for the concentration of elements, not their dispersion, an isolated level has no particular reason to hold.",
              "False. An FVG born without a prior impulse, in simple sideways drift, is not qualified. The impulse is precisely what gives the FVG its value: it reflects the institutional intent that imbalanced the price.",
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
                  markLessonComplete(p, "ict", "lecon2");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 2 of the Complete ICT module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/ict/lecon1" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Previous lesson
              </Link>
              <Link href="/strategies/ict/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
