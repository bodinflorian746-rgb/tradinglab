import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { PrecisionEntryDiagram } from "@/app/components/charts/PrecisionEntryDiagram";

export default function ContentEn() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon7"
      title="Precision entries"
      subtitle="The entry is the moment where everything is decided. A precise entry gives you a tight SL, a high R/R, and less stress once the trade is open. Here's how to sharpen every entry."
      duration="25 min"
      lessonNumber={7}
      prev={{ href: "/formations/avance/lecon6", label: "Lesson 6: Stop Hunts" }}
      next={{ href: "/formations/avance/lecon8", label: "Lesson 8: Journaling" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Why a precise entry changes everything</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Two traders can analyze the same setup and get very different results depending on their entry point. A trader who enters in the middle of an OB has a wide SL and a poor R/R. A trader who enters on the rejection inside the OB has a tight SL and a R/R potentially above 1:5.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <p className="font-semibold text-red-400 text-sm mb-2">Imprecise entry</p>
            <p className="text-xs text-zinc-400 leading-relaxed">The trader enters as soon as price reaches the zone. Wide SL (below the entire zone). R/R often below 1:2. Higher chance of being stopped out on an internal pullback.</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="font-semibold text-emerald-400 text-sm mb-2">Precision entry</p>
            <p className="text-xs text-zinc-400 leading-relaxed">The trader waits for a rejection signal on the M5/M15 inside the zone. Tight SL (below the signal). R/R often above 1:3 or 1:5. Less exposure to risk.</p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">The 3 precision entry methods</h2>
        <div className="space-y-3">
          {[
            {
              title: "1. Candle rejection entry (M5/M15)",
              color: "bg-blue-500/5 border-blue-500/15",
              accentColor: "text-blue-400",
              detail: "When price reaches the zone (OB, FVG, OTE), drop down to M5 or M15. Wait for a rejection candle: a pin bar with a long wick inside the zone, or an engulfing in the opposite direction. Enter on the close of that candle. SL below the bottom of the wick.",
            },
            {
              title: "2. Entry on the retest of a broken level",
              color: "bg-blue-500/5 border-blue-500/15",
              accentColor: "text-blue-400",
              detail: "After a BOS, price often comes back to retest the old broken level (now support or resistance). It's a classic entry: precise, with strong context. Enter on the rejection of the return to the broken level.",
            },
            {
              title: "3. Sweep + reversal entry",
              color: "bg-amber-400/5 border-amber-400/15",
              accentColor: "text-amber-400",
              detail: "After a stop hunt (sweep of an EQH or EQL), the reversal is often fast and strong. Enter as soon as the first candle confirms the reversal on M5. SL beyond the peak of the sweep. This is the post-stop-hunt entry.",
            },
          ].map((m, i) => (
            <div key={i} className={`rounded-xl p-4 border ${m.color}`}>
              <p className={`text-sm font-semibold mb-2 ${m.accentColor}`}>{m.title}</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{m.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <PrecisionEntryDiagram locale="en" />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Placing the precision Stop Loss</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          A precision SL is placed on structural logic, never arbitrarily. It must be invalidating: if price reaches it, the setup is genuinely invalidated.
        </p>
        <div className="space-y-2.5">
          {[
            { rule: "Below the bottom of the zone (OB or FVG)", detail: "If price runs entirely through the OB or the FVG, the institutional level is consumed and the trade idea is invalidated." },
            { rule: "Below the swing low of the entry", detail: "If you enter on a rejection on M15, the SL goes below the lowest point of the pin bar or the engulfing." },
            { rule: "A few pips of margin", detail: "Leave 2 to 5 pips (depending on the instrument) below the exact level to avoid being stopped out by the spread or the natural noise of the market." },
            { rule: "Never a fixed amount", detail: "A 20-pip SL 'because that's your habit' has no structural meaning. The SL must reflect the geography of the chart." },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              <div>
                <p className="text-sm font-medium text-white">{r.rule}</p>
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
          "A precise entry = waiting for a confirmation signal on M5/M15 inside the institutional zone.",
          "The 3 methods: candle rejection, retest of the broken level, sweep + reversal.",
          "A precise SL is based on chart structure, never on an arbitrary fixed amount.",
          "Dropping down to M5 to sharpen the entry allows for a tighter SL and a significantly better R/R.",
          "Waiting for a confirmation reduces the number of trades, but improves the quality of each one.",
        ]}
      />

      <LessonExercice
        description="On a setup you've identified, practice sharpening the entry on a smaller timeframe."
        steps={[
          "Identify an active Bullish Order Block on H1. Mark the zone (open → close of the OB candle).",
          "Drop down to M5. If price is in the zone, watch: is there a rejection (pin bar, bullish engulfing)?",
          "If the signal is there: note the entry price (close of the pin bar/engulfing), the SL (below the lower wick), and the TP (next resistance or liquidity level).",
          "Calculate your R/R. Is it above 1:3? If not, is the setup really valid?",
        ]}
      />

      <LessonQuiz
        question="Price reaches a Bullish Order Block on H1. What is the best entry?"
        options={[
          "Enter immediately at market price as soon as price touches the bottom of the OB",
          "Place a limit order in the middle of the OB so you don't miss the move",
          "Drop down to M5/M15 and wait for a rejection signal (pin bar or bullish engulfing) before entering",
          "Enter long on the next M15 candle that closes bullish inside the OB",
        ]}
        correctIndex={2}
        explanation="Waiting for a rejection signal on M5/M15 is the most precise approach. It gives you confirmation that price is actually reacting to the OB (not just passing through), a tight SL on the bottom of the signal, and a R/R clearly superior to an entry on the touch or in the middle of the zone."
        answerExplanations={[
          "Too hasty. Price can run through the bottom of the OB then come back, or run through it completely. Entering on the touch without confirmation exposes you to a wide SL or a premature stop.",
          "Better than the touch, but still imprecise. The middle of the OB has no particular structural logic. A limit order here can also be triggered without price reacting.",
          "Correct. This is the precision entry: drop down to M5/M15, wait for a rejection inside the OB zone, enter on the close of the signal with a SL below the bottom of the wick. It's the optimal balance between confirmation and timing.",
          "Not precise enough. 'The next bullish candle' inside the OB can be any small green candle, it isn't necessarily a strong rejection signal. A pin bar or an engulfing is required for an institutional confirmation.",
        ]}
      />

    </LessonPage>
  );
}
