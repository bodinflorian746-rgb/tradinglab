"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { HawkishDovishScale } from "@/app/components/charts/HawkishDovishScale";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Hawkish vs Dovish",                          href: "/formations/macro/intermediaire/lecon1", disabled: false },
  { id: "lecon2", title: "Understanding the economic calendar",         href: null,                                     disabled: true  },
  { id: "lecon3", title: "CPI, PPI and inflation",                     href: null,                                     disabled: true  },
  { id: "lecon4", title: "The carry trade",                            href: null,                                     disabled: true  },
  { id: "lecon5", title: "Macro correlations",                         href: null,                                     disabled: true  },
  { id: "lecon6", title: "Building your weekly bias",                  href: null,                                     disabled: true  },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-intermediaire", "lecon1"));
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
          <span className="text-zinc-500">Lesson 1</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20">
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
            Hawkish vs Dovish, how to read a central bank&apos;s tone
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              You can be right on the numbers and still lose. Because what moves the market isn&apos;t the Fed&apos;s decision, it&apos;s the tone Powell uses to deliver it.
            </p>
          </div>

          {/* Indicateur de structure */}
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

          {/* Pills des leçons */}
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            {LESSONS.map((lesson) => {
              const isCurrent = lesson.id === "lecon1";
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
            <span className="ml-auto text-xs text-zinc-600">1 / 6 lessons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Hawkish, dovish: what&apos;s with this bird vocabulary?</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              When you read financial news, you keep running into these two words:
            </p>
            <ul className="space-y-2 mb-4 ml-1">
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span><span className="text-white font-semibold">Hawkish</span> (hawk) = HARD tone. The central bank wants to <span className="font-semibold text-zinc-200">tighten</span> monetary policy: raise rates, drain liquidity, fight inflation.</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                <span><span className="text-white font-semibold">Dovish</span> (dove) = SOFT tone. The central bank wants to <span className="font-semibold text-zinc-200">stimulate</span> the economy: cut rates, inject liquidity, support growth.</span>
              </li>
            </ul>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              A simple analogy: <span className="text-white font-medium">the hawk tightens the screws, the dove opens the taps.</span>
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Key point:</span> These terms describe the <span className="font-semibold text-zinc-200">orientation</span> of a central banker&apos;s message, not a decision in itself. Powell can deliver a hawkish message without raising rates. Lagarde can sound dovish without cutting them. What matters is the tone, not the immediate action.
              </p>
            </div>
          </section>

          {/* Bloc 2 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Why this changes everything for your trading</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              The market doesn&apos;t wait for the actual decisions to move. It moves on <span className="font-semibold text-zinc-200">expectations</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              When Powell says <span className="italic text-zinc-300">&quot;we remain data-dependent and prepared to hold rates higher for longer if needed&quot;</span>, he hasn&apos;t actually decided anything. But the market hears &quot;Fed more hawkish than expected&quot; → the dollar jumps immediately, EUR/USD drops, gold falls, US indices correct.
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Key point:</span> Tone precedes action. Learning to read the tone = anticipating the move before the numbers even land.
              </p>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              That&apos;s exactly why the best macro traders read the <span className="font-semibold text-zinc-300">speeches</span> and the <span className="font-semibold text-zinc-300">minutes</span> (the records of central bank meetings), not just the numbers.
            </p>
          </section>

          {/* Bloc 3 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">How to recognize a hawkish vs dovish tone</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Here are the <span className="font-semibold text-zinc-200">signal words</span> you&apos;ll come across in official statements (most are published in English, here&apos;s what they mean).
            </p>

            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">HAWKISH vocabulary (hard tone, pro-tightening)</p>
            <ul className="space-y-2 mb-6">
              {[
                { en: "inflation remains elevated", fr: "inflation is still high" },
                { en: "further tightening may be appropriate", fr: "more rate hikes may be on the table" },
                { en: "labor market remains tight", fr: "the job market is still tight" },
                { en: "premature easing would be a mistake", fr: "cutting too early would be a mistake" },
                { en: "higher for longer", fr: "rates stay elevated for a long time" },
                { en: "more work to do", fr: "the job isn't done yet" },
                { en: "vigilant against persistent inflation", fr: "watching out for sticky inflation" },
              ].map((item) => (
                <li key={item.en} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60 shrink-0 mt-1.5" />
                  <span><em className="text-zinc-300">&quot;{item.en}&quot;</em> → {item.fr}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">DOVISH vocabulary (soft tone, pro-stimulus)</p>
            <ul className="space-y-2 mb-5">
              {[
                { en: "inflation is moderating", fr: "inflation is cooling down" },
                { en: "risks are now balanced", fr: "risks are now balanced" },
                { en: "we can be patient", fr: "we can afford to wait" },
                { en: "appropriate to consider easing", fr: "time to consider rate cuts" },
                { en: "growth is slowing", fr: "growth is slowing down" },
                { en: "downside risks have increased", fr: "downside risks have risen" },
                { en: "policy is now restrictive enough", fr: "policy is restrictive enough now" },
              ].map((item) => (
                <li key={item.en} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60 shrink-0 mt-1.5" />
                  <span><em className="text-zinc-300">&quot;{item.en}&quot;</em> → {item.fr}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm text-zinc-400 leading-relaxed">
              You don&apos;t need to memorize everything. <span className="font-semibold text-zinc-300">Just spot the intent</span>: is the central bank talking about SLOWING the economy (hawkish) or SUPPORTING it (dovish)?
            </p>
          </section>

          {/* Bloc 4 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Real impact on the markets</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Let&apos;s take a concrete example to make it stick.
            </p>

            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">Hawkish case on the US dollar, the Fed hardens its tone</p>
            <div className="overflow-hidden rounded-xl border border-zinc-800 mb-2">
              <div className="grid grid-cols-2 border-b border-zinc-800">
                <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Asset</div>
                <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-l border-zinc-800">Typical reaction</div>
              </div>
              <div className="divide-y divide-zinc-800/60">
                {[
                  { asset: "EUR/USD", reaction: "Falls, 100 to 300 pips on the session" },
                  { asset: "DXY", reaction: "Rises (measures dollar strength)" },
                  { asset: "XAU/USD", reaction: "Falls (high real yields hurt gold)" },
                  { asset: "Nasdaq", reaction: "Falls (high rates hurt tech)" },
                  { asset: "BTC/USD", reaction: "Falls (risk asset flees a hawkish environment)" },
                ].map((row) => (
                  <div key={row.asset} className="grid grid-cols-2">
                    <div className="px-4 py-2.5 text-sm font-semibold text-zinc-200">{row.asset}</div>
                    <div className="px-4 py-2.5 text-sm text-zinc-400 border-l border-zinc-800/60">{row.reaction}</div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-zinc-500 italic mb-5">A single hawkish decision triggers ALL of this at the same time.</p>

            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Dovish case on the US dollar, the Fed softens its tone</p>
            <div className="overflow-hidden rounded-xl border border-zinc-800 mb-2">
              <div className="grid grid-cols-2 border-b border-zinc-800">
                <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Asset</div>
                <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-l border-zinc-800">Typical reaction</div>
              </div>
              <div className="divide-y divide-zinc-800/60">
                {[
                  { asset: "EUR/USD", reaction: "Rises (weaker dollar)" },
                  { asset: "DXY", reaction: "Falls" },
                  { asset: "XAU/USD", reaction: "Rises (gold loves low rates)" },
                  { asset: "Nasdaq", reaction: "Rises (tech loves low rates)" },
                  { asset: "BTC/USD", reaction: "Rises (risk-on, more abundant liquidity)" },
                ].map((row) => (
                  <div key={row.asset} className="grid grid-cols-2">
                    <div className="px-4 py-2.5 text-sm font-semibold text-zinc-200">{row.asset}</div>
                    <div className="px-4 py-2.5 text-sm text-zinc-400 border-l border-zinc-800/60">{row.reaction}</div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-zinc-500 italic mb-5">A dovish tone is one of the most powerful drivers of crypto and tech rallies.</p>

            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <HawkishDovishScale locale="en" />
            </div>

            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Key point:</span> The logic to remember: a strong dollar always comes from a Fed that&apos;s more hawkish than the other central banks. A weak dollar, the opposite. A currency&apos;s strength is always <span className="font-semibold text-zinc-300">relative</span> to ITS central bank&apos;s tone compared to the others.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Erreur classique */}
          <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Common mistake</p>
            <p className="text-sm font-semibold text-white mb-3">The &apos;hawkish but less than expected&apos; trap</p>
            <p className="text-sm font-semibold text-zinc-300 mb-3">You trade the tone without looking at expectations</p>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              This is THE trap that wrecks beginner macro traders.
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              <span className="font-semibold text-zinc-200">You see Powell hike rates by 25bps and think</span>: &quot;That&apos;s hawkish, the dollar is going to rise, I&apos;m shorting EUR/USD.&quot;
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              And then, EUR/USD <span className="font-semibold text-zinc-200">rises</span> instead of falling. You get stopped out.
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              Why? Because the market had priced in a <span className="font-semibold text-zinc-200">50bps</span> hike. So 25bps is <span className="font-semibold text-zinc-200">less hawkish than expected</span>. And &quot;less hawkish than expected&quot; = <span className="font-semibold text-zinc-200">dovish surprise</span> for the market. The dollar falls because expectations were too optimistic.
            </p>
            <div className="bg-zinc-900/40 border border-red-500/15 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-400 italic leading-relaxed">
                On macro news, the market doesn&apos;t react to the decision itself, it reacts to the gap between the decision and what was expected.
              </p>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Before every FOMC meeting, check what&apos;s <span className="font-semibold text-zinc-300">priced in</span> by the market (the CME&apos;s FedWatch Tool gives you these probabilities). If the Fed delivers EXACTLY what was expected, little movement. If it delivers something harder or softer, a violent move in the direction of the surprise.
            </p>
          </section>

          {/* Bloc 6 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">How to trade it: adjusting your weekly bias</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              You won&apos;t trade the news itself at the moment it lands (see the FOMC lesson for the exact-timing technique). But you&apos;ll use the tone to <span className="font-semibold text-zinc-200">adjust your macro thesis for the week</span>.
            </p>

            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Simple 3-step method</p>
            <div className="space-y-3 mb-6">
              {[
                {
                  n: "1",
                  text: (
                    <><span className="font-semibold text-zinc-200">After each central bank meeting, identify the tone</span>: hawkish, dovish, or neutral. Read the statement + 2-3 Reuters/Bloomberg articles that summarize the press conference.</>
                  ),
                },
                {
                  n: "2",
                  text: (
                    <><span className="font-semibold text-zinc-200">Compare it to the previous tone</span>: is the bank getting more hawkish or more dovish than last time? It&apos;s the <span className="font-semibold text-zinc-200">shift</span> that matters most, not the absolute tone.</>
                  ),
                },
                {
                  n: "3",
                  text: (
                    <><span className="font-semibold text-zinc-200">Define your directional bias for the week</span> on the currency in question. Example: &quot;ECB more hawkish than expected → long EUR bias for the next 5 days → I look for long setups on EUR/USD, EUR/GBP, EUR/JPY, and I avoid short EUR setups.&quot;</>
                  ),
                },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-4">
              {[
                "Read the tone after every meeting",
                "Compare to the previous meeting",
                "Define 1 bias per major currency",
                "Look for setups in the direction of the bias",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-3">
                  <span className="text-emerald-500 font-bold text-base shrink-0 mt-0.5">✓</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[
                "Trading the news live without experience",
                "Ignoring the market's expectations",
                "Keeping a bias from 2 months ago",
                "Confusing decision with tone",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3">
                  <span className="text-red-500 font-bold text-base shrink-0 mt-0.5">✗</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Séparateur révision ── */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Review</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <LessonKeyPoints
            points={[
              "Hawkish = hawk = hard tone (the central bank wants to slow things down). Dovish = dove = soft tone (the central bank wants to support).",
              "Tone precedes action: learning to read the tone means anticipating the move before the actual rate changes.",
              "The market reacts to the gap between decision and expectation, not to the decision itself.",
              "Use the tone to define your weekly directional bias on every market involved: forex, gold, indices, crypto.",
            ]}
          />

          <LessonExercice
            description="Pick a recent Fed, ECB or BOE meeting."
            steps={[
              "Go to the central bank's official site (federalreserve.gov, ecb.europa.eu, bankofengland.co.uk).",
              "Find the official statement from the latest meeting.",
              "Read it looking for hawkish or dovish signal words (see block 3).",
              "Note your verdict: hawkish, dovish, or neutral. Justify it in 2 sentences.",
              "Compare with a Reuters or Bloomberg article analyzing the same meeting: does your read match the analysts'?",
              "Look at the chart of the main pair (EUR/USD for the ECB or the Fed, GBP/USD for the BOE) over the following 24h: does the move match your verdict?",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            The goal isn&apos;t to get it right on the first try. It&apos;s to train yourself to read the tone the way a macro trader does every week.
          </p>

          <LessonQuiz
            question="The Fed hikes its rates by 25bps. You read the statement and the tone is broadly hawkish. Yet the dollar FALLS after the announcement. What's the most likely explanation?"
            options={[
              "The market doesn't always follow fundamental logic, it's random",
              "The market had expected a bigger hike (50bps) or an even harder tone, it's a \"dovish surprise\"",
              "The dollar always falls on Fed announcements, regardless of the tone",
              "Powell made a communication error",
            ]}
            correctIndex={1}
            explanation="The market doesn't react to the decision in absolute terms, but to the gap between the decision and expectations. If the Fed hikes 25bps while the market priced in 50bps, that amounts to a 'less hawkish than expected' signal, hence dovish by contrast. Options A and C are wrong: the market follows a precise logic, and the direction of the reaction always depends on expectations. Option D dodges the point: Powell doesn't make communication errors, he calibrates every word. This expectations logic holds for every dollar-linked asset: EUR/USD, XAU/USD, Nasdaq and BTC/USD all react to the gap between expectations and reality."
            answerExplanations={[
              "Wrong. The market follows a very precise logic based on expectations. The reaction isn't random, it measures the gap between what was expected and what was announced.",
              "Correct. The market had priced in 50bps. A 25bps hike is therefore 'less hawkish than expected', it's a dovish surprise. The dollar falls because expectations weren't confirmed.",
              "Wrong. The dollar can rise or fall on a Fed announcement depending on the direction of the surprise. There's no mechanical rule independent of the tone and expectations.",
              "Wrong. Powell calibrates every word with precision. The market's reaction reflects the gap between expectations and reality, not a communication error.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-intermediaire", "lecon1"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">The next lesson (Understanding the economic calendar) will be available soon.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/intermediaire"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to module
              </Link>
              <Link
                href="/formations/macro/intermediaire/lecon2"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Lesson 2. Understanding the economic calendar
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
