"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { CentralBanksHierarchy } from "@/app/components/charts/CentralBanksHierarchy";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "What macro is",                  href: "/formations/macro/debutant/lecon1", disabled: false },
  { id: "lecon2", title: "The 4 major central banks",      href: "/formations/macro/debutant/lecon2", disabled: false },
  { id: "lecon3", title: "The macro data to watch",        href: null,                                disabled: true  },
  { id: "lecon4", title: "Understanding inflation",        href: null,                                disabled: true  },
  { id: "lecon5", title: "The dollar's role in the world", href: null,                                disabled: true  },
  { id: "lecon6", title: "Macro and risk management",      href: null,                                disabled: true  },
];

export default function ContentEn() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-debutant", "lecon2"));
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
          <Link href="/formations/macro/debutant" className="hover:text-zinc-400 transition-colors">Beginner</Link>
          <span>/</span>
          <span className="text-zinc-500">Lesson 2</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Beginner
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">12 min</span>
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
            The 4 major central banks, who controls the market
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              If Powell coughs, the trading planet catches a cold.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              And you trade that planet, whether you know it or not.
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
              const isCurrent = lesson.id === "lecon2";
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
            <span className="ml-auto text-xs text-zinc-600">2 / 6 lessons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — Les 4 banques que tu dois connaître */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The 4 banks you need to know</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              You don&apos;t need to know 50 institutions. In reality, <span className="font-semibold text-zinc-200">4 central banks drive most of the market</span>:
            </p>
            <div className="space-y-2.5 mb-4">
              {[
                { label: "Fed", desc: "US Federal Reserve",     devise: "dollar (USD)" },
                { label: "ECB", desc: "European Central Bank",  devise: "euro (EUR)"   },
                { label: "BoE", desc: "Bank of England",        devise: "pound (GBP)"  },
                { label: "BoJ", desc: "Bank of Japan",          devise: "yen (JPY)"    },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0 mt-1.5" />
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.label}</span> ({item.desc}) → controls the <span className="font-semibold text-zinc-200">{item.devise}</span>
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              These 4 currencies make up the majority of trades on the global market.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Understanding these 4 banks means understanding most of the market&apos;s moves.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Pourquoi elles sont si importantes */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Why they matter so much</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              These banks influence <span className="font-semibold text-zinc-200">every market</span>:
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                "Forex (EUR/USD, GBP/USD, USD/JPY…)",
                "Indices (NASDAQ, S&P500, CAC40…)",
                "Gold (XAU/USD)",
                "Crypto (BTC, ETH)",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Why? Because they control <span className="font-semibold text-zinc-200">the cost of money</span>.
            </p>
            <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl px-4 py-4 mb-4">
              <div className="space-y-1.5">
                <p className="text-sm leading-relaxed text-emerald-400 font-medium">
                  When a central bank <span className="font-semibold">raises</span> its rates → money gets more expensive → markets slow down.
                </p>
                <p className="text-sm leading-relaxed text-emerald-400 font-medium">
                  When it <span className="font-semibold">cuts</span> its rates → money flows more freely → markets rise.
                </p>
              </div>
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Real example:</span> When the Fed turns hawkish (just a speech, not even a decision), EUR/USD can drop <span className="font-semibold text-zinc-300">100 to 300 pips in 24h</span>. On a 0.10 lot, that&apos;s <span className="font-semibold text-zinc-300">$100 to $300 of movement</span> to stomach in a few hours.
              </p>
            </div>
          </section>

          {/* Bloc 3 — Ce qu'elles font concrètement */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">What they actually do</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              A central bank doesn&apos;t trade itself. It <span className="font-semibold text-zinc-200">influences</span> the market.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              It acts mainly through 3 levers:
            </p>
            <div className="space-y-3 mb-5">
              {[
                { n: "1", label: "Interest rates",  text: "how much borrowed money costs" },
                { n: "2", label: "Liquidity",       text: "injecting or withdrawing money from the system" },
                { n: "3", label: "Communication",   text: "speeches, decisions, future projections" },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.label}</span> → {item.text}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              The 3rd lever is the most powerful in the short term. A single word from Powell can move global markets for 48h, <span className="font-semibold text-zinc-200">before any decision is even made</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                The market doesn&apos;t follow traders. It follows the central banks.
              </p>
            </div>
          </section>

          {/* Bloc 4 — La Fed : le boss du jeu */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The Fed: the boss of the game</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Every bank matters. But one dominates.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">The Fed.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Why?</p>
            <ul className="space-y-2 mb-5">
              {[
                { bold: "The US dollar is the world's reserve currency", rest: "" },
                { bold: "International trade runs in USD", rest: "" },
                { bold: "Commodities", rest: " (gold, oil, wheat) are priced in USD" },
                { bold: "Over 60% of global reserves", rest: " held by central banks are in USD" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              When the Fed moves, <span className="font-semibold text-zinc-200">the whole world reacts</span>. The other central banks often adjust their policy in reaction to the Fed, not the other way around.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Simple analogy</span>: the Fed is the conductor. The other 3 play their part around it.
            </p>

            {/* Composant visuel */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <CentralBanksHierarchy locale="en" />
            </div>

            {/* Encadré 💰 Réalité du retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Retail reality</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                You probably trade EUR/USD, GBP/USD or XAU/USD? Those 3 pairs are <span className="font-semibold text-zinc-200">all against the dollar</span>. So in practice, <span className="font-semibold text-zinc-200">you&apos;re trading the Fed 80% of the time</span>, even if you think you&apos;re trading &apos;just the euro&apos; or &apos;just gold&apos;. Understanding the Fed = understanding 80% of your trades.
              </p>
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                If you ignore the Fed, you&apos;re trading blind.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Le calendrier de leurs réunions */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">The calendar of their meetings</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              These 4 banks make their rate decisions on dates <span className="font-semibold text-zinc-200">known in advance</span>:
            </p>
            <ul className="space-y-2 mb-5">
              {[
                { label: "FOMC (Fed)", freq: "~8 meetings per year" },
                { label: "ECB",        freq: "~8 meetings per year" },
                { label: "BoE",        freq: "~8 meetings per year" },
                { label: "BoJ",        freq: "~8 meetings per year" },
              ].map((item) => (
                <li key={item.label} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  <span><span className="font-semibold text-zinc-200">{item.label}</span> → {item.freq}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Why does it matter to you as a trader?
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Because on those days, the market gets <span className="font-semibold text-zinc-200">far more volatile</span>. Not just on D-day, but also <span className="font-semibold text-zinc-200">the hours before</span> (anticipation) and the ones after (reaction).
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Key point:</span> On EUR/USD, an FOMC decision can generate <span className="font-semibold text-zinc-300">200 to 500 pips of total movement</span> in a few hours (see the Advanced Macro lesson on the FOMC for details).
              </p>
            </div>
          </section>

          {/* Bloc 6 — Comment suivre concrètement */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">How to actually track them</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              You don&apos;t need to become a macro expert. Here&apos;s the simple routine:
            </p>
            <div className="space-y-3 mb-5">
              {[
                { n: "1", text: "Check the economic calendar every week (Investing.com, Forex Factory)" },
                { n: "2", text: "Identify the decisions of the 4 central banks" },
                { n: "3", text: "Note the important times in your planner" },
                { n: "4", text: "Avoid trading without understanding the context of the 24-48h around those dates" },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                These 4 banks move the markets on known dates. If you trade blind on those days, it&apos;s because you didn&apos;t check the calendar.
              </p>
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
              "4 central banks dominate the market: Fed, ECB, BoE, BoJ",
              "They control rates, liquidity and the direction of the markets",
              "The Fed is the most important (USD = world currency, 80% of major pairs)",
              "Their decisions create the biggest moves, knowing the calendar is essential",
            ]}
          />

          <LessonExercice
            description="This week, start following the central banks."
            steps={[
              "Go to an economic calendar (Investing.com or Forex Factory).",
              "Find the upcoming Fed, ECB, BoE or BoJ meetings this month.",
              "Note the dates and times in your personal calendar.",
              "On D-day, watch the chart of the relevant pair (EUR/USD for ECB/Fed, GBP/USD for BoE, USD/JPY for BoJ) 30 min before and 30 min after the decision.",
              "Note what you observe: direction, range in pips, volatility.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            The goal: get used to <span className="font-semibold text-zinc-400">linking violent moves</span> to their <span className="font-semibold text-zinc-400">macro causes</span>.
          </p>

          <LessonQuiz
            question="You're trading GBP/USD during rate decision week. The BoE announced its rate this morning (8:00 GMT) and the Fed announces its own at 20:00. Which event is most likely to move your pair during the day?"
            options={[
              "The BoE, it's the central bank of the GBP, so a direct impact on GBP/USD",
              "The Fed, the US dollar influences all major pairs, and its impact is generally stronger",
              "Neither, the two decisions cancel each other out",
              "The BoE in the morning, but the Fed will take back control in the evening",
            ]}
            correctIndex={1}
            explanation="Even on a pair that contains GBP, the Fed remains the primary driver. The US dollar influences all major pairs, and historically, Fed decisions have more impact on GBP/USD than BoE decisions themselves. It's confirmation that the Fed is 'the boss of the game' even when you think you're trading 'something else'. Option D seems logical but doesn't reflect reality, the Fed effect often completely erases the BoE effect later in the day."
            answerExplanations={[
              "Wrong. The BoE does have an impact on GBP/USD, but historically, the Fed generates stronger moves on all major pairs. Since the US dollar is the world's reserve currency, a Fed decision impacts the entire forex market, including GBP/USD.",
              "Correct. The Fed is the primary driver even on GBP/USD. Its announcement at 20:00 will dominate the day's moves. It's confirmation of the principle: the Fed is 'the boss of the game' even on pairs that seem to involve other currencies.",
              "Wrong. The two decisions don't automatically cancel out. They can overlap, amplify or contradict each other, but in practice, the Fed remains the dominant driver. The 'cancellation' effect is an incorrect oversimplification.",
              "Partially logical, but incomplete. The BoE effect in the morning exists, but the full answer is that the Fed is the dominant driver overall, not just taking back control in the evening. Historically, the Fed effect often completely erases the earlier BoE effect.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-debutant", "lecon2"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">The next lesson (The macro data to watch) will be available soon.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/debutant/lecon1"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Lesson 1. What macro is
              </Link>
              <Link
                href="/formations/macro/debutant/lecon3"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Lesson 3. The macro numbers to watch
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
