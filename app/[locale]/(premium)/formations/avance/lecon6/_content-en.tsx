import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { StopHuntInteractive } from "@/app/components/charts/StopHuntInteractive";

export default function ContentEn() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon6"
      title="Stop Hunts, the hunt for stops"
      subtitle="Stop hunts aren't illegal manipulation, they're a structural mechanic of the market. Learning to read them turns you from victim into sharp observer."
      duration="22 min"
      lessonNumber={6}
      prev={{ href: "/formations/avance/lecon5", label: "Lesson 5: OTE" }}
      next={{ href: "/formations/avance/lecon7", label: "Lesson 7: Precision entries" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">The mechanics of the Stop Hunt</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          A stop hunt happens when price briefly pushes beyond a key level, support, resistance, Equal High or Equal Low, just to trigger the stops of traders positioned at that level. Once the stops are filled, price immediately snaps back in the opposite direction.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          It's not a conspiracy. It's a natural mechanic: the stops of retail traders form <span className="text-white font-medium">pools of liquidity</span> that institutions need to consume in order to fill their own massive orders.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <p className="font-semibold text-red-400 text-sm mb-2">Stop Hunt on resistance (BSL)</p>
            <p className="text-xs text-zinc-400 leading-relaxed">Price pushes above a resistance or EQH, triggers the stops of the shorts, then drops back below the resistance. Institutions sell into that bullish spike.</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="font-semibold text-emerald-400 text-sm mb-2">Stop Hunt on support (SSL)</p>
            <p className="text-xs text-zinc-400 leading-relaxed">Price drops below a support or EQL, triggers the stops of the longs, then pushes back above the support. Institutions buy into that bearish spike.</p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Spotting a Stop Hunt in real time</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Several signals let you identify a stop hunt before or as it forms.
        </p>
        <div className="space-y-2.5">
          {[
            {
              label: "Long wick that pushes past an obvious level",
              detail: "A candle with a wick that pierces a resistance or support visible to everyone is the sign that stops were hunted.",
            },
            {
              label: "Close on the other side of the level",
              detail: "The candle pierces the level but closes on the opposite side. That confirms the penetration was temporary (stop hunt), not a real break.",
            },
            {
              label: "Sharp and fast reversal",
              detail: "After the spike, price snaps back violently the other way. That move is fueled by the positions of the institutions that just got their liquidity.",
            },
            {
              label: "Levels to watch out for: EQH and EQL",
              detail: "Equal Highs and Equal Lows are the favorite targets of stop hunts. Two or three highs/lows at the same level = stop accumulation = obvious target.",
            },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-blue-400 shrink-0 mt-0.5">
                <path d="M7 2v5M7 10v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              <div>
                <p className="text-sm font-medium text-white">{r.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Trading AFTER the Stop Hunt</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          A confirmed stop hunt is one of the most powerful setups in Smart Money. You enter after the hunt, in the direction of the institutional reversal.
        </p>
        <div className="space-y-2">
          {[
            { step: "1", text: "Identify a level with stop accumulation: EQH, EQL, obvious resistance or support." },
            { step: "2", text: "Wait for price to spike beyond the level but not close on the opposite side." },
            { step: "3", text: "Confirm the reversal: rejection candle (pin bar, engulfing) that returns into the zone." },
            { step: "4", text: "Enter in the direction of the reversal. SL beyond the peak of the spike. TP toward the opposite liquidity level." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-emerald-400 shrink-0 mt-0.5 w-4">{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">The edge:</span> by entering after the stop hunt, you get a very tight SL (just beyond the spike) for a potentially wide TP (the market has just positioned itself institutionally).
          </p>
        </div>
      </section>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-widest">Test your instinct, face to face with a stop hunt</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <StopHuntInteractive locale="en" />
      </div>

      {/* AND YOU, RETAIL? */}
      <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-6 my-8">
        <p className="text-emerald-400 uppercase tracking-widest text-xs font-bold mb-4">AND YOU, RETAIL?</p>
        <div className="text-zinc-300 leading-relaxed space-y-3">
          <p>
            Tuesday night, 8pm. $700 account. You've got 30 minutes before dinner. You open your XAU/USD H1 chart. You see a resistance that's already been tested 3 times over the past few weeks at $4,650. A zone that's far too obvious. Exactly the kind of level where institutions know there's liquidity above the highs.
          </p>
          <p>
            An H1 candle spikes up to $4,670, with a long wick above the resistance, then closes below $4,650. The next candle is bearish and confirms the rejection. The BSL has just been taken. The sellers' stops got triggered, the liquidity was grabbed, and the market refuses to hold above the zone. The trap is over.
          </p>
          <p>
            In concrete terms: short entry at $4,645, SL at $4,680 above the spike, TP at $4,580 toward the next liquidity below. You risk $21 (3% of $700, scaled to your account), you can make around $39. You close your chart, you go to dinner. You'll check it before bed.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Review</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "A stop hunt: fast spike beyond a key level → stops triggered → sharp reversal.",
          "EQH and EQL are the favorite targets of stop hunts, be wary of levels that are 'too obvious'.",
          "Signal: long wick piercing a level + close on the opposite side + violent reversal.",
          "Never chase the wick of a spike, wait for the reversal to confirm before entering.",
          "After a confirmed stop hunt: tight SL beyond the peak, TP toward the opposite liquidity.",
        ]}
      />

      <LessonExercice
        description="Go hunting for stop hunts on recent charts."
        steps={[
          "On EUR/USD on H1, identify Equal Highs or Equal Lows from the last 2 weeks.",
          "For each level, check: was there a spike beyond it followed by a fast reversal?",
          "If so, measure the size of the reversal after the stop hunt. Was the move significant?",
          "Practice mentally placing an entry: where would your entry, SL and TP have been on that stop hunt?",
        ]}
      />

      <LessonQuiz
        question="Price briefly pushes above a major resistance (Equal Highs) then immediately closes below it, with a long upper wick. What do you do?"
        options={[
          "You buy the breakout, price clearly pushed past the resistance",
          "You ignore it, that move is too ambiguous to draw any conclusion",
          "You watch for a bearish reversal signal, it's probably a stop hunt on the BSL",
          "You place a buy order above the peak of the spike to follow the momentum",
        ]}
        correctIndex={2}
        explanation="A spike above the Equal Highs with a close back below is the signature of a stop hunt on Buy-side Liquidity (BSL). Institutions have just taken the liquidity from the stops of the shorts. The bearish reversal that follows is fueled by institutional selling, that's an area where you look for sell confirmation, not a signal on its own."
        answerExplanations={[
          "Wrong. The close below the resistance invalidates the break. It's not a breakout, it's precisely a false breakout (stop hunt). Buying here means positioning yourself on the wrong side of the institutional move.",
          "Wrong. It's not ambiguous for someone who knows stop hunts. The signature is clear: spike + long wick + close on the opposite side. It's a warning signal, not a neutral situation.",
          "Correct. A spike on the EQH with a return below the resistance = stop hunt on the BSL. Institutions sold into that spike. The probability of a bearish continuation is high, watch for a bearish engulfing or pin bar to enter.",
          "Wrong. Placing an order above the spike means hoping the break is real. But the signal is exactly the opposite: price rejected that level hard. You'd be about to enter in the direction of the stop hunt, not in the institutional direction.",
        ]}
      />

    </LessonPage>
  );
}
