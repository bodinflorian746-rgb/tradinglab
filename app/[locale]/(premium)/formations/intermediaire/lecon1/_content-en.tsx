import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { MarketStructureDiagram } from "@/app/components/charts/MarketStructureDiagram";
import { BOSDiagram } from "@/app/components/charts/BOSDiagram";
import { CHoCHDiagram } from "@/app/components/charts/CHoCHDiagram";

export default function ContentEn() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon1"
      title="Market structure. BOS & CHoCH"
      subtitle="Before you can spot an entry, you need to know which direction the market is moving. Structure is your compass. Without it, you trade blind."
      duration="20 min"
      lessonNumber={1}
      prev={null}
      next={{ href: "/formations/intermediaire/lecon2", label: "Lesson 2: Key zones" }}
    >

      {/* ── Ce que tu dois VOIR ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">What you should see on the chart</p>
        <h2 className="text-lg font-semibold text-white mb-4">Reading structure by looking at the chart</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-1">Uptrend</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Price rises → makes a high → pulls back a little → moves off higher than the previous high → makes a low higher than the previous one. That's <strong className="text-white">HH (Higher High) + HL (Higher Low)</strong>.
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-1">Downtrend</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Price falls → makes a low → bounces a little → moves off lower → makes a lower high. That's <strong className="text-white">LH (Lower High) + LL (Lower Low)</strong>.
            </p>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-zinc-300 mb-1">Range (consolidation)</p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Price swings between two horizontal levels. No significant new highs or lows. Neither side dominates.
            </p>
          </div>
        </div>
      </section>

      {/* ── Schéma visuel ── */}
      <div className="border border-zinc-800 rounded-2xl p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <MarketStructureDiagram trend="bullish" locale="en" />
          <MarketStructureDiagram trend="bearish" locale="en" />
        </div>
      </div>

      {/* ── BOS ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Break of Structure (BOS): the trend confirms</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          A BOS is when price breaks the last high (in an uptrend) or the last low (in a downtrend). It confirms the trend is continuing. It's information, not an entry signal.
        </p>
        <div className="space-y-2.5">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-emerald-400 mb-1">Bullish BOS</p>
            <p className="text-xs text-zinc-400">EUR/USD in an uptrend. Price breaks above the last HH at 1.0950 → BOS confirmed. You keep looking for buys on the pullbacks.</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-red-400 mb-1">Bearish BOS</p>
            <p className="text-xs text-zinc-400">BTC in a downtrend. Price breaks below the last LL at $42,000 → BOS confirmed. You keep looking for sells on the bounces.</p>
          </div>
        </div>
        <div className="mt-4">
          <BOSDiagram trend="bullish" locale="en" />
        </div>
      </section>

      {/* ── CHoCH ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Change of Character (CHoCH): the trend cracks</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          The CHoCH is the first crack in the structure. In an uptrend, it's when price breaks below the last Higher Low. It's not a confirmed reversal yet, it's a warning.
        </p>
        <div className="space-y-2.5">
          <div className="bg-zinc-800/50 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-white mb-1">Real-world scenario</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              You're watching EUR/USD on a bullish H4. Price makes a HH at 1.0950, pulls back, then breaks its last HL at 1.0880. That's a bearish CHoCH. You switch to observation mode, you stop buying. You wait for a bearish BOS to confirm the reversal.
            </p>
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm text-zinc-400">
              <span className="text-white font-medium">CHoCH → opposite BOS = confirmed reversal.</span> A CHoCH on its own = just a warning. Always wait for confirmation.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <CHoCHDiagram trend="bullish" locale="en" />
        </div>
      </section>

      {/* ── 5 secondes ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">How to analyze in 5 seconds</p>
        <h2 className="text-lg font-semibold text-white mb-4">Reading structure fast</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Zoom out on the Daily or H4", d: "Never start on the M15, you'd lose the bigger picture." },
            { n: "2", t: "Mark the last 3 significant highs and lows", d: "Ignore the small fluctuations, only the major swings count." },
            { n: "3", t: "The direction of the highs/lows = your trend", d: "Highs and lows rising → uptrend. Falling → downtrend. Flat → range, no trade." },
          ].map((item) => (
            <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-4">{item.n}</span>
              <div>
                <p className="text-sm font-medium text-white">{item.t}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ce que tu dois faire ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-3">What you should do</p>
        <h2 className="text-lg font-semibold text-white mb-4">The trader's logic</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↑</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Uptrend</p>
              <p className="text-xs text-zinc-400 mt-0.5">You look only for buys. You wait for a pullback to the last Higher Low to enter.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↓</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Downtrend</p>
              <p className="text-xs text-zinc-400 mt-0.5">You look only for sells. You wait for a bounce to the last Lower High to enter.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-zinc-800/40 border border-zinc-700/40 rounded-xl px-4 py-3">
            <span className="text-lg">—</span>
            <div>
              <p className="text-sm font-semibold text-zinc-300">Range / No clear structure</p>
              <p className="text-xs text-zinc-400 mt-0.5">You do nothing. No trade without a defined trend. Wait for the structure to clear up.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Erreur classique ── */}
      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Classic mistake</p>
        <p className="text-sm font-semibold text-white mb-2">Entering on the BOS instead of waiting for the return to structure</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          You see price break a new High → you buy immediately. But that's often exactly when the market pulls back. The right timing is to wait for price to come back to the last HL, not to buy the breakout. Entering on the BOS = paying a high price with a poor R/R ratio.
        </p>
      </section>

      {/* ── Résumé ultra-rapide ── */}
      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Recap in 3 seconds</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>HH + HL → uptrend → you buy on the HLs</p>
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>LH + LL → downtrend → you sell on the LHs</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>No clear structure → range → you do nothing</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Review</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "HH + HL = uptrend. LH + LL = downtrend. Flat = range.",
          "BOS = price breaks a previous high/low → the trend continues.",
          "CHoCH = first reversal signal → a warning, not a trade yet.",
          "CHoCH + opposite BOS = confirmed reversal.",
          "In a range, you don't trade, you wait for clear structure.",
        ]}
      />

      <LessonExercice
        description="Open EUR/USD on H4 in TradingView. Analyze the structure right now."
        steps={[
          "Zoom out to see the last 3 months. Mark the last 4 significant highs and lows.",
          "Classify each high: HH or LH? Each low: HL or LL? Write down the sequence.",
          "Identify the last BOS: at what level did price break? In which direction?",
          "Was there a recent CHoCH? Did the structure change character over the last 2 weeks?",
        ]}
      />

      <LessonQuiz
        question="You're looking at EUR/USD on H4. Price is in an uptrend (HH/HL). It just broke below the last Higher Low at 1.0820. What does that mean?"
        options={[
          "The uptrend is confirmed, it's a good time to buy now",
          "It's a CHoCH, the bullish structure is weakened, you switch to observation",
          "The downtrend is official, you enter short immediately",
          "It's neutral information, no action to take",
        ]}
        correctIndex={1}
        explanation="Breaking the last Higher Low in an uptrend is the definition of a CHoCH. The bullish structure is compromised. You stop looking for buys, you watch whether a bearish BOS confirms the reversal."
        answerExplanations={[
          "False. Breaking the last HL is the opposite of a buy signal. It's the first break in the bullish structure, you should not buy now.",
          "Correct. CHoCH = Change of Character. The bullish structure is weakened. You switch to observation mode and wait for a bearish BOS to confirm the reversal before entering short.",
          "False. A CHoCH on its own does not confirm a reversal. You need a bearish BOS (a break of the last LL) to make the new trend official. Entering short immediately means anticipating without confirmation.",
          "False. A CHoCH is very important information, it's the first sign that the context is changing. Ignoring it means missing a major warning from the market.",
        ]}
      />

    </LessonPage>
  );
}
