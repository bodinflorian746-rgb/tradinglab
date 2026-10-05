import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { OTEDiagram } from "@/app/components/charts/OTEDiagram";

export default function ContentEn() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon5"
      title="OTE. Optimal Trade Entry"
      subtitle="The OTE is a precision entry technique based on Fibonacci retracements. It lets you enter at the best possible price in the direction of the institutional move."
      duration="22 min"
      lessonNumber={5}
      prev={{ href: "/formations/avance/lecon4", label: "Lesson 4: Killzones" }}
      next={{ href: "/formations/avance/lecon6", label: "Lesson 6: Stop Hunts" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">What is the OTE?</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          The OTE (Optimal Trade Entry) is a retracement zone defined by the 61.8% and 78.6% Fibonacci levels of an impulsive move. After a BOS (Break of Structure), price often returns to this zone, which lines up with an Order Block or an FVG, before resuming the institutional direction.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          The OTE is not an entry signal on its own. It's a <span className="text-white font-medium">timing zone</span> that tells you where to look for your entry, not directly why.
        </p>
        <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-blue-400 font-medium">OTE zone:</span> retracement between 61.8% and 78.6% of a swing. That's where institutions buy back (in an uptrend) or sell again (in a downtrend) at a favorable price.
          </p>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">How to draw the OTE</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          The OTE is drawn on the last significant swing, after a confirmed BOS or CHoCH.
        </p>
        <div className="space-y-2">
          {[
            { step: "1", text: "Spot a bullish BOS: price broke a Higher High. That's the starting point." },
            { step: "2", text: "Mark the swing low (A) and swing high (B) of the impulsive move that created the BOS." },
            { step: "3", text: "Draw the Fibonacci from A (swing low) to B (swing high)." },
            { step: "4", text: "The OTE zone = between the 61.8% and 78.6% retracement. That's your area of focus for the entry." },
            { step: "5", text: "Look for a confluence in that zone: OB, FVG, or an old structure level. That's a point of interest that strengthens the setup, not an automatic entry: confirmation is still needed, based on your own trading plan." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-4">{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <OTEDiagram locale="en" />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">OTE + institutional structure</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          The OTE alone isn't enough. Its power comes from combining it with the institutional concepts covered earlier.
        </p>
        <div className="space-y-2.5">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="font-semibold text-emerald-400 text-sm mb-2">Complete OTE setup (bullish)</p>
            <ul className="space-y-1.5">
              <li className="text-xs text-zinc-400 leading-relaxed">1. Bullish bias confirmed (HH/HL on Daily)</li>
              <li className="text-xs text-zinc-400 leading-relaxed">2. Bullish BOS on the working timeframe (H1/H4)</li>
              <li className="text-xs text-zinc-400 leading-relaxed">3. Retracement into the OTE zone (61.8%–78.6%)</li>
              <li className="text-xs text-zinc-400 leading-relaxed">4. Confluence in the OTE: Bullish OB or Bullish FVG</li>
              <li className="text-xs text-zinc-400 leading-relaxed">5. Candle signal on M15 (pin bar, bullish engulfing) → entry</li>
            </ul>
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm text-zinc-400 leading-relaxed">
              <span className="text-white font-medium">SL and TP:</span> the Stop Loss goes below the swing low (point A) with a small buffer. The Take Profit targets the next liquidity pool or resistance level above the BOS.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">What the OTE is NOT</h2>
        <div className="space-y-2.5">
          {[
            { label: "Not an automatic order", detail: "Reaching the OTE zone doesn't automatically trigger an entry. It's an area of focus that requires confirmation." },
            { label: "Not always at 61.8%", detail: "Price can react at 63%, 70% or 78%. The OTE zone is a range: not a single level. Use an OB or FVG to pinpoint the entry." },
            { label: "Not valid without a BOS", detail: "The OTE only makes sense after a BOS. Without a confirmed break of structure, drawing a Fibonacci is an exercise with no institutional basis." },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-red-400 shrink-0 mt-0.5">
                <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div>
                <p className="text-sm font-medium text-white">{r.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Review</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "OTE = 61.8%–78.6% retracement zone of a swing after a confirmed BOS.",
          "The OTE is a timing zone, not a signal, you need a confluence (OB or FVG) to enter.",
          "The complete OTE setup: bias → BOS → OTE retracement → OB/FVG → candle signal → entry.",
          "The SL goes below the swing low (point A), the TP targets the next liquidity pool.",
          "Without a prior BOS, drawing the OTE has no institutional meaning.",
        ]}
      />

      <LessonExercice
        description="Apply the OTE setup on a live chart."
        steps={[
          "On EUR/USD on H1, spot the last bullish BOS. Mark the swing low (A) and swing high (B) that created it.",
          "Draw the Fibonacci from A to B. Identify the 61.8%–78.6% zone, that's your OTE zone.",
          "Is there a Bullish Order Block or a Bullish FVG inside that zone? If so, you have a confluence.",
          "If price returns to the OTE, note the candle signal you expect for the entry. Define SL and TP.",
        ]}
      />

      <LessonQuiz
        question="You spot a bullish BOS on H1. Price retraces to 65% of the A→B swing and forms a bullish pin bar in a Bullish OB. What do you do?"
        options={[
          "You don't enter, 65% isn't exactly the golden ratio at 61.8%",
          "You enter long. BOS confirmed, retracement in the OTE zone, OB confluence, candle signal",
          "You wait for price to reach 78.6% to be in the exact OTE zone",
          "You enter short, the 65% retracement suggests buyer weakness",
        ]}
        correctIndex={1}
        explanation="65% is inside the OTE zone (61.8%–78.6%). The Bullish OB + bullish pin bar confluence in that zone after a confirmed BOS makes a complete, high-probability institutional setup. The OTE is a range, 65% is valid."
        answerExplanations={[
          "False. The OTE zone runs from 61.8% to 78.6%. 65% is fully inside that zone. Waiting for exactly 61.8% is a precision error that makes you miss valid entries.",
          "Correct. Every element of the complete OTE setup is in place: bullish BOS → retracement into the OTE → Bullish OB as confluence → pin bar as the signal. It's a high-probability institutional setup.",
          "False. 78.6% is the upper bound of the OTE zone, if a confluence and a signal show up at 65%, there's no reason to wait further. Waiting for 78.6% for no reason means potentially missing the optimal entry.",
          "False. In an uptrend with a confirmed BOS, a 65% retracement is expected and normal. It's not weakness, it's exactly the institutional reload zone before the move resumes up.",
        ]}
      />

    </LessonPage>
  );
}
