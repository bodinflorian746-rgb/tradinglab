"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { WeeklyBiasCalendarDiagram } from "@/app/components/charts/WeeklyBiasCalendarDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Hawkish vs Dovish",                       href: "/formations/macro/intermediaire/lecon1", disabled: false },
  { id: "lecon2", title: "Understanding the economic calendar",      href: "/formations/macro/intermediaire/lecon2", disabled: false },
  { id: "lecon3", title: "CPI, PPI and inflation",                   href: "/formations/macro/intermediaire/lecon3", disabled: false },
  { id: "lecon4", title: "Trading sessions and liquidity",           href: "/formations/macro/intermediaire/lecon4", disabled: false },
  { id: "lecon5", title: "Correlations",                             href: "/formations/macro/intermediaire/lecon5", disabled: false },
  { id: "lecon6", title: "Building your weekly bias",                href: "/formations/macro/intermediaire/lecon6", disabled: false },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-intermediaire", "lecon6"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/formations" className="hover:text-zinc-400 transition-colors">Courses</Link>
          <span>/</span>
          <Link href="/formations/macro" className="hover:text-zinc-400 transition-colors">Macro Trading</Link>
          <span>/</span>
          <Link href="/formations/macro/intermediaire" className="hover:text-zinc-400 transition-colors">Intermediate</Link>
          <span>/</span>
          <span className="text-zinc-500">Lesson 6</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20">
              Intermediate
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">14 min</span>
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
            Building your weekly bias, the macro routine nobody does
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Retail discovers the market on Monday morning.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              The prepared trader shows up with a bias, a plan and zones to avoid.
            </p>
          </div>

          {/* Structure indicator */}
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

          {/* Lesson pills */}
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            {LESSONS.map((lesson) => {
              const isCurrent = lesson.id === "lecon6";
              const pill = (
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  isCurrent
                    ? "bg-zinc-800 border-zinc-600 text-white"
                    : "border-zinc-800 text-zinc-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : "bg-zinc-600"}`} />
                  {lesson.title}
                </span>
              );
              return <div key={lesson.id}>{pill}</div>;
            })}
            <span className="ml-auto text-xs text-zinc-600">6 / 6 lessons</span>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="space-y-8">

          {/* Block 1 — Why the bias changes everything */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Why the bias changes everything</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Without a weekly bias, you <span className="font-semibold text-zinc-200">react</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-1">
              You see a candle go up, you want to buy.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              You see a candle go down, you want to sell.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The problem: you trade the <span className="font-semibold text-zinc-200">noise of the day</span> instead of the <span className="font-semibold text-zinc-200">context of the week</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              A weekly bias gives you a <span className="font-semibold text-zinc-200">priority direction</span>:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "where to look for buys",
                "where to look for sells",
                "when to do nothing",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                A trade without a bias is a decision without a compass.
              </p>
            </div>
          </section>

          {/* Block 2 — The 4 pillars of a solid bias */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The 4 pillars of a solid bias</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Your bias should not come from your gut.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              It has to come from <span className="font-semibold text-zinc-200">4 pillars</span>:
            </p>
            <div className="space-y-4 mb-4">
              {[
                {
                  n: "1. The macro tone",
                  body: "Hawkish or dovish?",
                  ref: "(see lesson 1)",
                },
                {
                  n: "2. The week's calendar",
                  body: "Is there a CPI, an NFP, an FOMC or a cluster?",
                  ref: "(see lesson 2)",
                },
                {
                  n: "3. Correlations",
                  body: "Does XAU/USD confirm the DXY? Is BTC/USD still following the Nasdaq?",
                  ref: "(see lesson 5)",
                },
                {
                  n: "4. The global context",
                  body: "Risk-on or risk-off? Is the market chasing risk or safety?",
                  ref: null,
                },
              ].map((pilier) => (
                <div key={pilier.n} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{pilier.n}</p>
                  <p className="text-sm text-zinc-300">
                    {pilier.body}{pilier.ref && <span className="text-zinc-500 ml-1 italic">{pilier.ref}</span>}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Without these 4 pillars, your bias is an <span className="font-semibold text-zinc-200">opinion</span>.<br />
              With them, it&apos;s a <span className="font-semibold text-zinc-200">thesis</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Your opinion is worth nothing. Your thesis needs evidence.
              </p>
            </div>
          </section>

          {/* Block 3 — The Sunday night routine */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The Sunday night routine</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The routine takes <span className="font-semibold text-zinc-200">20 minutes</span>. No more.
            </p>
            <div className="space-y-3 mb-5">
              {[
                { bold: "Step 1. Calendar (5 min)", rest: "You open up the week. You note the 3-star news. You spot the clusters." },
                { bold: "Step 2. Macro tone (5 min)", rest: "You look at the latest Fed / ECB communication. Hawkish, dovish or neutral?" },
                { bold: "Step 3. DXY (3 min)", rest: "Is the dollar bullish, bearish or ranging?" },
                { bold: "Step 4. Correlations (3 min)", rest: "Does XAU/USD confirm the DXY? Is BTC/USD following the Nasdaq? Is any correlation breaking down?" },
                { bold: "Step 5. Bias per asset (4 min)", rest: "For each asset you trade: long / short / neutral." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.bold}</span>
                    <br />{item.rest}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              You don&apos;t need 10 biases. <span className="font-semibold text-zinc-200">Two or three assets are enough</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Total: 20 minutes on Sunday night. That&apos;s it.</span>
            </p>

            {/* Visual component */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <WeeklyBiasCalendarDiagram />
            </div>

            {/* Callout 💰 Retail reality */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Retail reality</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                Retail picks their trade in front of the chart. The pro picks their context before opening the chart.
              </p>
            </div>
          </section>

          {/* Block 4 — Concrete example of a weekly bias */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Concrete example of a weekly bias</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Starting context</span>:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "Fed hawkish, rates at 5.50%",
                "CPI Wednesday at 8:30am",
                "NFP Friday at 8:30am",
                "DXY bullish for 3 weeks",
                "XAU/USD ranging",
                "BTC/USD correlated to the Nasdaq, but with no clear direction",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Possible bias</span>:
            </p>
            <div className="space-y-2 mb-5">
              {[
                { asset: "EUR/USD", biais: "short bias", detail: "Strong DXY + hawkish Fed." },
                { asset: "XAU/USD", biais: "neutral bias / slight short", detail: "Strong dollar, but technical range." },
                { asset: "Nasdaq", biais: "short bias", detail: "High rates = pressure on tech." },
                { asset: "BTC/USD", biais: "neutral bias", detail: "Nasdaq correlation, but unclear structure." },
              ].map((item) => (
                <div key={item.asset} className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-0.5">
                    {item.asset} → <span className="text-zinc-300 font-normal">{item.biais}</span>
                  </p>
                  <p className="text-xs text-zinc-500">{item.detail}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Week plan</span>:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                { bold: "Monday", rest: ": short EUR/USD setups only" },
                { bold: "Tuesday", rest: ": caution ahead of CPI" },
                { bold: "Wednesday", rest: ": no trade before the CPI reaction" },
                { bold: "Thursday", rest: ": recalibrate based on CPI" },
                { bold: "Friday", rest: ": no new trade before NFP" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                The bias doesn&apos;t tell you where to click. It tells you where to look.
              </p>
            </div>
          </section>

          {/* Block 5 — When to change your bias */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">When to change your bias</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              You don&apos;t change your bias because a red candle shows up.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              You change your bias <span className="font-semibold text-zinc-200">only if the context changes</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Example</span>:
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              You have a long XAU/USD bias on Sunday.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Tuesday, CPI comes in hotter than expected. The DXY explodes. The Fed turns more hawkish again.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              → Your long XAU/USD bias is <span className="font-semibold text-zinc-200">invalidated</span>. You close the idea. You wait.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Conversely</span>:
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              XAU/USD drops $20 on Monday with no major news. Your bias isn&apos;t necessarily invalidated. It might just be a pullback.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">The difference</span>:
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                { bold: "technical move", rest: " = patience" },
                { bold: "macro invalidation", rest: " = change of plan" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                A bad trade that follows your bias costs you money. Changing your bias on every pullback costs you your consistency.
              </p>
            </div>
          </section>

          {/* Block 6 — The 5 classic traps */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The 5 classic traps</h2>
            <div className="space-y-3 mb-5">
              {[
                {
                  bold: "Trap 1",
                  desc: ": building a bias without looking at the calendar.",
                  consequence: "You'll get caught off guard by the news.",
                },
                {
                  bold: "Trap 2",
                  desc: ": changing your bias on every pullback.",
                  consequence: "You become reactive instead of structured.",
                },
                {
                  bold: "Trap 3",
                  desc: ": having too many biases.",
                  consequence: "Long XAU/USD, short EUR/USD, long BTC/USD, short Nasdaq, long GBP/USD… You end up tracking nothing at all.",
                },
                {
                  bold: "Trap 4",
                  desc: ": forgetting correlations.",
                  consequence: "Long XAU/USD + long BTC/USD + long Nasdaq can turn into one big risk-on bet.",
                  ref: "(see lesson 5)",
                },
                {
                  bold: "Trap 5",
                  desc: ": never reviewing your plan.",
                  consequence: "A weekly bias is not a prison. It's a framework.",
                },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm text-zinc-300 mb-1">
                    <span className="font-semibold text-zinc-200">{item.bold}</span>{item.desc}
                  </p>
                  <p className="text-sm text-zinc-400 italic">
                    → {item.consequence}{item.ref && <span className="text-zinc-500 ml-1">{item.ref}</span>}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Discipline isn&apos;t being stubborn. It&apos;s knowing what invalidates your plan.
              </p>
            </div>
          </section>

          {/* ── Review separator ── */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Review</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <LessonKeyPoints
            points={[
              "A weekly bias turns your ideas into a structured plan",
              "A good bias rests on macro, calendar, correlations and global sentiment",
              "You don't change your bias on a candle, but on a clear invalidation",
              "The Sunday night routine prepares your week before the market forces you to react",
            ]}
          />

          <LessonExercice
            description="Build your macro bias for next week."
            steps={[
              "Open the economic calendar in week view.",
              "Note the 3 to 5 major events.",
              "Analyze the DXY, XAU/USD, BTC/USD and Nasdaq.",
              "Define a long / short / neutral bias for 2 or 3 assets max.",
              "Classify your days: aggressive, neutral or defensive.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            The goal: show up on Monday with a{" "}
            <span className="font-semibold text-zinc-400">plan</span>, not a reaction.
          </p>

          <LessonQuiz
            question="On Sunday you build a long XAU/USD bias. On Tuesday, CPI comes in much hotter than expected, the DXY explodes to the upside and XAU/USD breaks an important support. What do you do?"
            options={[
              "You keep your long bias because you have to respect your plan",
              "You double your position to get a better price",
              "You consider your bias invalidated and you wait for a new structure",
              "You flip immediately to short with no other confirmation",
            ]}
            correctIndex={2}
            explanation="A bias must be respected, but only as long as its conditions stay valid. Here, the hotter-than-expected CPI + the exploding DXY + the technical break form a complete macro invalidation. You close the idea and wait for a new structure. Option A confuses discipline with stubbornness (an invalidated bias is no longer respected). Option B adds risk to a broken thesis. Option D reacts too fast without rebuilding a plan, you have to wait for a new confirmation, not flip right away."
            answerExplanations={[
              "Wrong. Respecting your plan doesn't mean ignoring a complete macro invalidation. When the conditions that founded your bias change radically, the bias has to change too.",
              "Wrong. Doubling a position on a thesis invalidated by the macro adds risk. It's one of the most costly traps in trading.",
              "Correct. The hotter-than-expected CPI + the exploding DXY + the technical break form a complete macro invalidation. You close the idea and wait for a new structure before repositioning.",
              "Wrong. Flipping straight to short after an invalidation, without rebuilding a plan, is replacing one reaction with another. You first need a new confirmation, not an immediate flip.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-intermediaire", "lecon6"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">You finished the Intermediate Macro module. Well done.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/intermediaire/lecon5"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 5. Correlations
              </Link>
              <span className="text-sm font-bold text-emerald-400 cursor-default">
                Intermediate Macro module complete ✓
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
