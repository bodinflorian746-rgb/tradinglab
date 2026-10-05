import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { Candle } from "@/app/components/charts/Candle";
import { GraphFakeBreakout } from "@/app/components/charts/GraphFakeBreakout";

export default function ContentEn() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon6"
      title="Fake Breakout, don't get trapped"
      subtitle="Price breaks a level, you enter in the direction of the break, and price immediately reverses the other way. This trap happens several times a week. Here's how to recognize it, and even how to trade it."
      duration="18 min"
      lessonNumber={6}
      prev={{ href: "/formations/intermediaire/lecon5", label: "Lesson 5: Confluences" }}
      next={{ href: "/formations/intermediaire/lecon7", label: "Lesson 7: Multi-Timeframe" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">What you should see on the chart</p>
        <h2 className="text-lg font-semibold text-white mb-4">What a fake breakout looks like</h2>
        <div className="space-y-3">
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-2">Bullish fake breakout (buyer trap)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              You're watching EUR/USD. Price approaches a resistance at 1.0950. It pokes above → 1.0960, 1.0965. You see buyers stepping in. Then price snaps violently back below 1.0950. The H1 candle has a long upper wick and closes <strong className="text-white">below the resistance</strong>. The buyers are trapped.
            </p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">Bearish fake breakout (seller trap)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Price pokes below a support at 1.0850 → drops to 1.0840. Sellers step in. Price rips back up and closes <strong className="text-white">above the support</strong>. Long lower wick visible. The sellers are trapped.
            </p>
          </div>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <GraphFakeBreakout locale="en" />
        <div className="flex justify-center pt-1 border-t border-zinc-800/50">
          <Candle
            type="pin-bear"
            label="The trap candle"
            caption="Upper wick + close below the resistance"
          />
        </div>
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Why fake breakouts happen</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Obvious levels naturally concentrate orders. Above a resistance → stops from short buyers + breakout buyers' entry orders. The market goes to grab that liquidity, triggers all those orders, then heads back the other way.
        </p>
        <div className="space-y-2.5">
          <div className="bg-zinc-800/50 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-white mb-1">What happens</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Price rises, triggers the buy orders above the resistance. Those buys push price up slightly. But there isn't enough momentum to keep going. Price falls back below, and the buyers who followed the break are now at a loss.
            </p>
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm text-zinc-400">
              <span className="text-white font-medium">Key rule:</span> the more obvious and widely known a level is, the higher the risk of a fake breakout. Be wary of breaks that look &quot;too clean&quot;.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">How to recognize a fake breakout</h2>
        <div className="space-y-2.5">
          {[
            { label: "The candle closes on the other side of the level", detail: "Main signal. Price pokes through the level but the close stays on the other side → fake breakout. Always wait for the close: never the intrabar." },
            { label: "Long wick in the direction of the break", detail: "An upper wick above a resistance with a close below it = strong rejection. It's the number 1 visual sign of a fake breakout." },
            { label: "The reversal is fast and aggressive", detail: "After a fake, the reversal is violent. Price doesn't hesitate: it comes back with momentum. That in itself is a signal." },
            { label: "The underlying trend contradicts the break", detail: "Bullish break in a strong downtrend = suspicious. The market is hunting stops, not a real direction." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-blue-400 shrink-0 mt-0.5">
                <path d="M7 2v5M7 10v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Trading the fake breakout: the reverse-direction setup</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Once identified, you can trade the fake breakout in the direction of the reversal. It's one of the most powerful setups: you enter right after the stops have been swept.
        </p>
        <div className="space-y-2">
          {[
            { step: "1", text: "EUR/USD resistance at 1.0950. Price rises to 1.0962 then comes back.", color: "text-zinc-400" },
            { step: "2", text: "The H1 candle closes BELOW 1.0950. Upper wick visible. Fake breakout confirmed.", color: "text-amber-400" },
            { step: "3", text: "You enter short at the close of that candle. SL above the peak (1.0965).", color: "text-emerald-400" },
            { step: "4", text: "TP toward the next support (1.0880). R/R = 1:3. The trapped buyers fuel the decline.", color: "text-emerald-400" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className={`text-xs font-bold shrink-0 mt-0.5 w-4 ${item.color}`}>{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">How to analyze it in 5 seconds</p>
        <h2 className="text-lg font-semibold text-white mb-4">Check whether a break is real or fake</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Wait for the candle close", d: "Absolute rule. Never judge a break on an intrabar price. The close is the only judge." },
            { n: "2", t: "Is the close on the other side of the level?", d: "Yes = potentially a real break. No (long wick + close on the other side) = fake breakout." },
            { n: "3", t: "Is the reversal violent?", d: "Fast and aggressive return back below the level = confirmation of the fake. You can enter in the reverse direction, if that fits your trading plan." },
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

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-3">What you should do</p>
        <h2 className="text-lg font-semibold text-white mb-4">Facing a level break</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✓</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Real break (clean close beyond)</p>
              <p className="text-xs text-zinc-400 mt-0.5">You can follow the break with an SL on the other side of the level. But ideally wait for a pullback to the broken level before entering.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-400/5 border border-amber-400/15 rounded-xl px-4 py-3">
            <span className="text-lg">!</span>
            <div>
              <p className="text-sm font-semibold text-amber-400">Fake breakout (wick + close on the other side)</p>
              <p className="text-xs text-zinc-400 mt-0.5">Don't follow the break. You can enter in the reverse direction with SL beyond the peak, TP toward the next level, if your trading plan allows it.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-zinc-800/40 border border-zinc-700/40 rounded-xl px-4 py-3">
            <span className="text-lg">—</span>
            <div>
              <p className="text-sm font-semibold text-zinc-300">Uncertainty (candle still open)</p>
              <p className="text-xs text-zinc-400 mt-0.5">You do nothing. Never a decision on an unclosed candle. Wait.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Classic mistake</p>
        <p className="text-sm font-semibold text-white mb-2">Entering on the break before the candle close</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Price pokes through the resistance at 1.0950 → climbs to 1.0962 intrabar. You buy immediately &quot;so you don't miss the move&quot;. The candle closes at 1.0945, below the resistance. You're unintentionally short. The rule is simple: candle close first, decision after.
        </p>
      </section>

      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Summary in 3 seconds</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Clean close ABOVE the level → real break → you can follow</p>
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Wick + close BELOW → fake breakout → you sell in the reverse direction</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>Candle still open → you always wait for the close</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Review</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Fake breakout = price pokes through a level but the candle closes on the other side.",
          "Visual signal: long wick beyond the level + a close that stays on the other side.",
          "Absolute rule: wait for the candle close before judging a break.",
          "The fake breakout is traded in the reverse direction: entry at the reversal, SL beyond the peak.",
          "The more obvious a level is, the higher the risk of a fake breakout.",
        ]}
      />

      <LessonExercice
        description="On TradingView, open EUR/USD on H1 and hunt for recent fake breakouts."
        steps={[
          "Identify the 3 most visible support and resistance levels of the last 4 weeks.",
          "For each level, examine the candles that approached it: are there wicks that poke through the level with a close on the other side?",
          "For each fake breakout you find, note: did price head off in the opposite direction? Within how many candles?",
          "Identify the best fake breakout you could have traded. Note the theoretical entry, SL and TP.",
        ]}
      />

      <LessonQuiz
        question="On EUR/USD H1, price rises and pokes through the resistance at 1.0950 during the current candle. The candle hasn't closed yet and shows +18 pips above the level. What do you do?"
        options={[
          "You buy immediately, the break is underway and you want to be in the move",
          "You wait for this H1 candle to close before making a decision",
          "You sell, price rose too fast, it's surely a fake",
          "You place a buy order just above 1.0950 for the next candle",
        ]}
        correctIndex={1}
        explanation="The rule is absolute: wait for the candle close. Price can be +18 pips above intrabar and close below the resistance, that's exactly the definition of a fake breakout. Deciding before the close means trading on a provisional price."
        answerExplanations={[
          "False. The break isn't confirmed yet. Price can drop back below 1.0950 before the close. Entering now means reacting to a temporary price. If the candle closes below 1.0950, you're on the wrong side.",
          "Correct. The candle close is the only moment when you can judge a break. If it closes above 1.0950 → potentially a real break. If it closes below → fake breakout. You wait.",
          "False. +18 pips at a resistance can be the start of a real break, not necessarily a fake. You can't conclude &apos;fake breakout&apos; without the candle close.",
          "Risky. Placing a limit order just above 1.0950 for the next candle means anticipating a continuation without confirmation. Wait for the close first.",
        ]}
      />

    </LessonPage>
  );
}
