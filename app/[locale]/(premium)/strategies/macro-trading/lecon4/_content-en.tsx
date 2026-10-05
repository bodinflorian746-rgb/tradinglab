"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { MacroFilterCalendarDiagram } from "@/app/components/charts/MacroFilterCalendarDiagram";
import { MacroFilterRegimeDiagram } from "@/app/components/charts/MacroFilterRegimeDiagram";
import { MacroFilterFlowchartDiagram } from "@/app/components/charts/MacroFilterFlowchartDiagram";

const LESSONS = [
  { id: "lecon1", title: "FOMC Fade", disabled: false },
  { id: "lecon2", title: "NFP Overreaction", disabled: false },
  { id: "lecon3", title: "Risk-off Regime", disabled: false },
  { id: "lecon4", title: "Pre-trade macro filter", disabled: false },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-trading", "lecon4"));
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
          <span className="text-zinc-500">Lesson 4</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Advanced
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
            The pre-trade macro filter: validate the context before executing
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              A clean technical setup can turn into a bad trade in a bad macro context. The macro filter isn't there to find trades. It's there to avoid the ones that should never have been taken.
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
            <div className="bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                « The best trades start with a refusal: refusing to execute when the macro context doesn't validate the setup. »
              </p>
            </div>
          </section>

          {/* Bloc 2 — PRÉREQUIS */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-xs uppercase tracking-wide font-semibold mb-2">Prerequisites</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- FOMC Fade → see Macro Trading module, Lesson 1</li>
              <li>- NFP Overreaction → see Macro Trading module, Lesson 2</li>
              <li>- Risk-off Regime → see Macro Trading module, Lesson 3</li>
              <li>- Economic calendar → see Macro module</li>
              <li>- Multi-timeframe → see Multi-timeframe Process module</li>
            </ul>
          </div>

          {/* Bloc 3 — LE CALENDRIER ÉCONOMIQUE EST LE PREMIER FILTRE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The economic calendar is the first filter</h2>

            <div className="my-8">
              <MacroFilterCalendarDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Before any setup, the first question to ask is simple: is there a major economic release in the window ahead? FOMC, NFP, CPI, jobs data, Powell press conference, these events trigger extreme and unpredictable volatility that completely disrupts technical structures. A technically perfect setup at 5:00am ET can be wiped out by a $70 candle at 8:30am ET on the NFP release. The economic calendar is therefore the simplest and most effective filter: if a major news item is in the trade window, you don't take the trade, no matter how good the setup looks technically.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD 8:25am ET: perfect H4 short setup, price below resistance, clean bearish structure. But the calendar shows the US CPI release at 8:30am ET. The probability of $50-100 of volatility in the following minutes is very high, the SL would be taken out before the scenario has any chance to play out. Red filter: no trade. You wait for the release to be digested (typically 30-60 minutes) before re-evaluating.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Actionable points: check the economic calendar BEFORE analyzing the chart</li>
              <li>- Major news within the next 30 minutes = red filter, no execution</li>
              <li>- Major news in the last hour = wait for digestion before any trade</li>
              <li>- No technical setup justifies trading blind into a major release</li>
            </ul>
          </section>

          {/* Bloc 4 — LE TRADE DOIT ÊTRE ALIGNÉ AVEC LE RÉGIME DOMINANT */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The trade must be aligned with the dominant regime</h2>

            <div className="my-8">
              <MacroFilterRegimeDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The second filter is the macro regime. If the general context (risk-on, risk-off, Daily bias of safe-haven assets, HTF structure) points one way, taking a trade against that direction isn't just risky, it's statistically a losing game. An isolated M15 bearish signal on gold during an established bullish risk-off regime has a very low probability of continuation. The HTF structure usually absorbs these counter signals within a few candles, the SL is hit, and the trade fails. Trade with the regime, never against it.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                XAU/USD H4 in an established risk-off regime, clear HH/HL structure pointing toward $4,740. An M15 bearish signal appears during a mini-pullback: rejection on local resistance, start of a break of the last low. Technically, it's a valid short. Macro-contextually, it's a trade against the dominant regime. Red filter: you don't take it. The market does keep rising and breaks the previous highs in the following hours.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Actionable points: check the macro regime and the HTF structure before every trade</li>
              <li>- Counter-trend setup = amber or red filter, barring structural proof of reversal</li>
              <li>- The dominant regime trumps the local signal, always</li>
              <li>- A technically valid signal but out of regime = a setup to skip</li>
            </ul>
          </section>

          {/* Bloc 5 — LE FILTRE MACRO SERT À RÉDUIRE LES MAUVAIS TRADES */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">The macro filter is there to cut the bad trades</h2>

            <div className="my-8">
              <MacroFilterFlowchartDiagram locale="en" />
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The macro filter is NOT a tool to find trades. It's a tool to avoid them. Its logic is negative: at each step, you look for a reason NOT to take the trade. Major news imminent? Reject. Opposing regime? Reject. Weak setup? Reject. Only the setups that pass all three filters deserve execution. This reverse logic, looking for reasons to reject rather than reasons to enter, is exactly what separates profitable traders from the rest: they take few trades, but the ones they take have passed every check.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Concrete example</p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Over a trading week, a disciplined trader might identify 15 technical setups. Applying the macro filter: 5 are rejected due to major news in the window, 4 are rejected because they go against the dominant regime, 2 are rejected because the technical setup lacks a clear confluence. That leaves 4, which they execute. This selectivity, perceived as "trading less", is in reality the main performance multiplier.
              </p>
            </div>

            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Actionable points: apply the 3 filters systematically to every setup you consider</li>
              <li>- A single red filter is enough to reject the trade, no negotiation</li>
              <li>- Trading fewer but higher-quality setups = the main performance lever</li>
              <li>- The filter logic is NEGATIVE: look to avoid, not to find</li>
            </ul>
          </section>

          {/* Bloc 6 — PLAN D'APPLICATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Application plan: two concrete cases on XAU/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Here are two concrete cases, a trade validated through the filter, and a rejected trade, to illustrate the decision step by step.
            </p>

            <div className="border border-zinc-800 rounded-xl p-4 md:p-6 my-6 bg-zinc-950/60">
              <p className="text-white font-semibold text-sm mb-2">Case 1. Trade validated in 3 steps</p>

              <p className="text-zinc-300 leading-relaxed text-sm mb-2"><span className="font-semibold text-white">Step 1. Calendar:</span></p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-3">
                <li>- Observation: no major release in the previous 2 hours nor in the next 4 hours</li>
                <li>- Conclusion: calendar filter GREEN, we continue</li>
              </ul>

              <p className="text-zinc-300 leading-relaxed text-sm mb-2"><span className="font-semibold text-white">Step 2. Macro regime:</span></p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-3">
                <li>- Observation: established risk-off regime, clear HH/HL structure on H4 on XAU, confirmed bullish Daily bias</li>
                <li>- Conclusion: regime filter GREEN, a long setup is aligned</li>
              </ul>

              <p className="text-zinc-300 leading-relaxed text-sm mb-2"><span className="font-semibold text-white">Step 3. Technical setup:</span></p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-3">
                <li>- Observation: H4 pullback toward a former high turned support, visible M15 stabilization, clean recovery candle</li>
                <li>- Conclusion: setup filter GREEN, execution validated. Long entry with SL below the pullback, target on the next continuation zone</li>
              </ul>

              <div className="border-t border-zinc-800/60 pt-3 mt-3 mb-5">
                <p className="text-sm text-emerald-400 font-semibold text-center">
                  3 GREEN filters → trade executed
                </p>
              </div>

              <p className="text-white font-semibold text-sm mb-2">Case 2. Rejected trade</p>

              <p className="text-zinc-300 leading-relaxed text-sm mb-2"><span className="font-semibold text-white">Step 1. Calendar:</span></p>
              <ul className="space-y-1 text-sm text-zinc-300 mb-3">
                <li>- Observation: US CPI release at 8:30am ET, in 25 minutes</li>
                <li>- Conclusion: calendar filter RED, no trade, regardless of the rest</li>
              </ul>

              <p className="text-sm text-zinc-400 italic leading-relaxed mb-1">
                Note: we're not going to check the other filters. A single red filter is enough to reject. The technical setup can be superb, the regime can be aligned, the imminent news makes execution too risky. We wait for the release to be digested before re-evaluating.
              </p>

              <div className="border-t border-zinc-800/60 pt-3 mt-3">
                <p className="text-sm text-red-400 font-semibold text-center">
                  RED filter from step 1 → trade rejected
                </p>
              </div>
            </div>
          </section>

          <LessonKeyPoints
            points={[
              "The macro filter is a NEGATIVE logic: look for reasons to reject a trade, not to take one.",
              "Three filters in series: economic calendar, macro regime, technical setup. A single red = no trade.",
              "Trading less but better is the main performance lever, selectivity trumps frequency.",
              "No technical setup justifies trading against the calendar or against the dominant regime.",
            ]}
          />

          <LessonExercice
            description="For one week, apply the macro filter to every setup you identify. Log the rejections and the executions."
            steps={[
              "For each technical setup you spot, first check the economic calendar for the next 2 hours. If a major news item is in that window, mark the setup REJECTED for calendar.",
              "If the calendar is green, check the macro regime and the HTF structure. If the setup goes against the dominant regime, mark it REJECTED for regime.",
              "If the first two filters pass, evaluate the technical quality of the setup (confluence, structure, levels). If it's insufficient, mark REJECTED for weak setup. Otherwise, mark EXECUTED. At the end of the week, compare the number of setups identified with the number executed, that's your selectivity.",
            ]}
          />

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Key takeaways from the macro lessons</h2>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li>- FOMC Fade: the first impulse after the decision is emotional. You wait for exhaustion (rejection wicks, failure to print a new high or low), then you fade toward a partial retrace of the move, without aiming for a Daily trend reversal.</li>
              <li>- NFP Overreaction: the market overreacts to the number before re-pricing over 15 to 60 minutes. The signal comes after stabilization (repeated wicks, loss of acceleration, narrow range), with a fade toward the pre-news level.</li>
              <li>- Risk-off Regime: it's confirmed by the concordance of several macro signals, never a single market. As long as the HH/HL structure holds on safe-haven assets, you trade with the regime; H4 pullbacks are entries, not reversals.</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mt-4">
              The common thread across these three setups: you never enter on the first emotional reaction, you wait for confirmation. And before looking for a setup, the macro filter below is there to validate whether the context allows you to trade.
            </p>
          </section>

          <LessonQuiz
            question="You identify a technically perfect H4 short setup on XAU/USD at 8:00am ET. The calendar shows an NFP release at 8:30am ET. The macro regime is neutral. What do you do?"
            options={[
              "You execute: the technical setup is solid, that's what matters",
              "You don't execute: the imminent news is a red filter, regardless of how good the setup is",
              "You execute with reduced size to limit the risk",
              "You place a limit order further out to avoid the initial volatility",
            ]}
            correctIndex={1}
            explanation="The macro filter rule is non-negotiable: a single red filter is enough to reject the trade. Here, the calendar is explicitly red (NFP in 30 minutes), which makes execution too risky, post-NFP volatility can take out the SL within minutes regardless of the technical quality of the setup. The quality of the macro regime or the technical setup never compensates for a red calendar filter. The discipline is to wait for the release to be digested (typically 30-60 minutes) before re-evaluating."
            answerExplanations={[
              "Wrong. \"The technical setup is solid\" is never enough to compensate for a red calendar filter. NFP volatility is unpredictable and can take out the SL before the setup has any chance to play out.",
              "Correct. A single red filter is enough to reject, and the calendar is the simplest filter to respect. You wait for the release, watch the reaction, and re-evaluate afterward. Discipline trumps attachment to the setup you identified.",
              "Wrong. Reducing size doesn't change the nature of the problem: NFP volatility can far exceed any reasonable SL. You don't mitigate a bad trade by risking less, you eliminate it.",
              "Wrong. Placing a limit order further out doesn't bypass the filter. It's a rationalization to execute anyway a setup you've already mentally decided to take, exactly what the filter is meant to prevent.",
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
                  markLessonComplete(p, "macro-trading", "lecon4");
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
                  <p className="text-sm font-semibold text-emerald-400">Macro Trading module completed</p>
                  <p className="text-xs text-zinc-500 mt-0.5">You have completed all 4 lessons of the Macro Trading module.</p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between gap-4">
              <Link href="/strategies/macro-trading/lecon3" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8 10l-4-3 4-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Previous lesson
              </Link>
              <Link href="/strategies/macro-trading" className="inline-flex items-center gap-2 py-3 -my-1 text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
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
