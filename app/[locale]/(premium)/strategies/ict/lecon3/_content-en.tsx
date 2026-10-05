"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { KillzonesTimelineDiagram } from "@/app/components/charts/KillzonesTimelineDiagram";
import { AsiaRangeSweepDiagram } from "@/app/components/charts/AsiaRangeSweepDiagram";
import { NYOpenExpansionDiagram } from "@/app/components/charts/NYOpenExpansionDiagram";
import { TimingComparisonDiagram } from "@/app/components/charts/TimingComparisonDiagram";

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
    setDone(isLessonComplete(getStoredProgress(), "ict", "lecon3"));
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
            Killzones: when the market really moves
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              The market doesn&apos;t produce its biggest moves at random. Certain hours concentrate the bulk of the impulses, manipulations and expansions.
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
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                &laquo; The market spends 80% of its day waiting. Everything that matters plays out in the remaining 20%. &raquo;
              </p>
            </div>
          </section>

          {/* Bloc 2 — PREREQUISITES */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Liquidity and manipulation → see ICT module, Lesson 1</li>
              <li>- PD Arrays and FVG → see ICT module, Lesson 2</li>
              <li>- Multi-timeframe → see Multi-timeframe Process module</li>
            </ul>
          </div>

          {/* Bloc 3 — THE MARKET DOESN'T MOVE THE SAME ALL DAY */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The market doesn&apos;t move the same all day</h2>

            <div className="my-8">
              <KillzonesTimelineDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Market volatility isn&apos;t spread evenly across 24 hours. Certain time windows, called Killzones in the ICT methodology, concentrate nearly all the significant moves: impulses, liquidity grabs, range expansions, structural reversals. Outside a Killzone, the market is generally flat, flat candles, sideways action, false signals. Recognizing these windows means turning timing into a statistical edge.
            </p>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- 80% of significant moves happen in 20% of the hours</li>
              <li>- Outside a Killzone: tight range, flat candles, slow sweeps</li>
              <li>- In a Killzone: expansion, clean impulses, real displacement</li>
              <li>- Trading without watching the clock means trading blind</li>
            </ul>
          </section>

          {/* Bloc 4 — THE ASIA SESSION OFTEN ACTS AS LIQUIDITY */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The Asia Session often acts as liquidity</h2>

            <div className="my-8">
              <AsiaRangeSweepDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The Asian session (roughly 00h-07h UTC) rarely produces large directional moves. It usually draws a tight range, with low-amplitude candles and little volume. But this range has a major structural function: it serves as a liquidity target for the following sessions. The high and low of the Asia range concentrate the stops placed by traders who set their SL &laquo; just above &raquo; or &laquo; just below &raquo; the quiet session. London or New York often come to sweep these levels right at the open, then impulse in the opposite direction.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD M15: during the Asian session, price oscillates in a tight range between 1.1710 and 1.1725. At the London open, a candle breaks below 1.1710, drops to 1.1702, the stops below the Asia range are triggered. Immediately after, price shoots up toward 1.1750 in an impulsive bullish sequence. The target wasn&apos;t the downside break, it was the liquidity.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- The Asia range = a visible pool of liquidity</li>
              <li>- The stops stacked above and below this range are the target for London / NY</li>
              <li>- Sweep of the Asia range + reclaim = classic expansion signal</li>
              <li>- Trading Asia without session context = enduring the sweeps that are coming</li>
            </ul>
          </section>

          {/* Bloc 5 — NY OPEN OFTEN PRODUCES THE BIGGEST MOVES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">New York Open often produces the biggest moves</h2>

            <div className="my-8">
              <NYOpenExpansionDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The New York open (9:30am ET, with US data often dropping at 8:30am ET) coincides with the massive arrival of US institutional volume, on top of the already-active London session. This overlap frequently produces the most violent expansions of the day: explosive impulse in one direction, sweep of a recent high or low, then a clean reversal the other way. The SMC/ICT setups prepared ahead of time (PD Arrays, equal highs/lows) often get &laquo; resolved &raquo; in a few candles at the NY open.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD M15 chart: just before the New York open, price consolidates around $4,640 in flat, low-amplitude candles. At the open, around 9:30am ET, an explosive bullish candle of $28 projects price to $4,668, where a sweep wick marks the high. In the minutes that follow, a red cascade brings price back to $4,610, a total range of $58 in the first hour of NY, more than the entire previous day.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- NY Open = London overlap + US flow = volatility peak</li>
              <li>- The setups prepared on HTF often resolve in this window</li>
              <li>- Sweep + clean reversal is the most frequent pattern</li>
              <li>- Trading before the NY Open without a plan = trading the noise that precedes it</li>
            </ul>
          </section>

          {/* Bloc 6 — KILLZONES SERVE TO FILTER TIMING */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Killzones serve to filter timing</h2>

            <div className="my-8">
              <TimingComparisonDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The same technical setup, a tested H1 resistance, will produce radically different reactions depending on when the test arrives. In the middle of the Asia Session, the resistance can be touched and only generate a weak sideways drift; at the London Open, the same level can produce a clean sweep followed by a 30-pip bearish impulse. The Killzone isn&apos;t a trigger in itself, it&apos;s a timing FILTER: you wait for the time context to be favorable before taking a setup, even one that&apos;s technically well prepared.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                EUR/USD: the H1 resistance at 1.1780 is tested twice on the same day. First test at 03h UTC in the middle of Asia: price touches, produces a 4-pip rejection candle, then stalls into sideways action for 2h with no displacement. Second test at the London Open: price touches, sweeps to 1.1792, then a 35-pip bearish cascade in 4 candles. Same setup, two outcomes, the only difference is the timing.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- An ICT setup is only valid if the timing is too</li>
              <li>- Outside a Killzone: weak reaction, sideways drift, false signals</li>
              <li>- In a Killzone: clean sweep, impulse, real displacement</li>
              <li>- The timing filter eliminates 80% of the &laquo; decent setups &raquo; that aren&apos;t profitable</li>
            </ul>
          </section>

          {/* Bloc 7 — APPLICATION PLAN */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Application plan: a EUR/USD Killzone trade</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Here is the full sequence to exploit a Killzone on EUR/USD. Four steps, each with its role.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Step 1. HTF (Daily): directional bias</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: EUR/USD Daily in LH/LL, Daily resistance at 1.1780</li>
                <li>- Conclusion: bearish bias, we&apos;ll look for shorts on the next test of the upper zone</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 2. Asia Session (00h-07h UTC): spot the range</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: price oscillates between 1.1710 and 1.1725 during the Asian session</li>
                <li>- Conclusion: Asia range drawn, levels noted. The stops below 1.1710 and above 1.1725 are potential targets for London / NY</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 3. London Open (07h-10h UTC): wait for the sweep</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: at 08:15 UTC, price breaks below 1.1710, drops to 1.1702 (sweep of the stops below the Asia range), then a bullish impulse kicks off</li>
                <li>- Conclusion: complete sweep, but the Daily bias stays bearish. We wait for the next target: the 1.1780 resistance</li>
              </ul>

              <p className="text-white font-semibold text-sm mb-2">Step 4. Execution (M15 during NY Open)</p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-4">
                <li>- Observation: at the NY open (around 9:30am ET), price climbs to test 1.1780, sweeps to 1.1792, reclaims below 1.1780, an impulsive M15 bearish candle breaks the local low at 1.1762</li>
                <li>- Conclusion: short entry at 1.1758 (Killzone timing + aligned ICT setup), SL at 1.1795 (above the sweep), TP toward 1.1695. R/R ≈ 1 : 1.7, high-probability setup because it&apos;s aligned Daily + Asia range + NY Open</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-zinc-300 italic text-center">
                  HTF = bias · Asia = liquidity · London/NY = execution · Outside a Killzone = we wait
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "The market only produces its real moves in certain time windows (Killzones), not continuously.",
              "The Asia Session often acts as a pool of liquidity; London and NY come to sweep it before impulsing.",
              "The same technical setup produces radically different reactions depending on the time of day.",
              "The Killzone is a filter, not a trigger: without favorable timing, you wait even on a perfect setup.",
            ]}
          />

          <LessonExercice
            description="On TradingView, observe a full day on a major pair and identify where the Killzones produce the real moves."
            steps={[
              "Visually spot the Asian session (00h-07h UTC) on M15: note the range amplitude and the candle size.",
              "Mark the London open (07h UTC) and the NY open (around 9:30am ET). Watch the first 1-2 hours of each Killzone: sweep of the Asia range? clean impulse? amplitude versus the Asian session?",
              "On the same day, spot a technical setup (resistance test, FVG, equal highs) that played out IN a Killzone and another that played out OUTSIDE a Killzone. Compare the quality of the reaction.",
            ]}
          />

          <LessonQuiz
            question="You have a perfect ICT setup on EUR/USD: bearish Daily bias, confluent H1 zone, price comes to touch the zone at 04h UTC in the middle of the Asia Session. What do you do?"
            options={[
              "You don't enter: the setup is decent but the timing isn't a Killzone, the reaction will be weak or nil",
              "You enter immediately: the setup is aligned, the time doesn't matter",
              "You enter with a very wide SL to absorb the slowness of the Asian session",
              "You take the other direction, assuming Asia will break the Daily bias",
            ]}
            correctIndex={0}
            explanation="The Killzone is a timing filter, not a minor detail. A technically perfect setup that shows up during the Asia Session has a very low probability of a clean reaction, the market simply lacks the volume to produce a real impulse. Discipline means waiting for the London Open or NY Open. If price sweeps the level during Asia, it's often a false move that will be reclaimed when the real volume arrives."
            answerExplanations={[
              "Correct. The Killzone filters timing even when the setup is technically perfect. Outside a Killzone, the probability of a clean reaction drops drastically. ICT discipline means waiting for the time of day to validate the setup before entering.",
              "False. 'The time doesn't matter' is the opposite of the ICT model. Timing is as structural as the setup itself, a perfect setup outside a Killzone is statistically unprofitable, regardless of its technical quality.",
              "False. Widening the SL doesn't fix the timing problem: the market simply doesn't have the volume to impulse during Asia. You'd only take more risk on a setup that probably won't trigger.",
              "False. Taking the other direction just because the Killzone isn't favorable makes no structural sense. The Daily bias stays the priority, the only thing to do is wait for the next Killzone to execute the aligned scenario.",
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
                  markLessonComplete(p, "ict", "lecon3");
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
                  <p className="text-xs text-zinc-500 mt-0.5">Lesson 3 of the Complete ICT module completed.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/ict/lecon2" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Previous lesson
              </Link>
              <Link href="/strategies/ict/lecon4" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
