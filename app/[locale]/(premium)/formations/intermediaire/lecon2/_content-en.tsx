import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { Candle } from "@/app/components/charts/Candle";
import { SupportResistance } from "@/app/components/charts/SupportResistance";

export default function ContentEn() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon2"
      title="Key Zones. Support & Resistance"
      subtitle="Key zones are the levels where price has already stalled. They're the only places where you should trade, everything else is noise."
      duration="22 min"
      lessonNumber={2}
      prev={{ href: "/formations/intermediaire/lecon1", label: "Lesson 1: Structure" }}
      next={{ href: "/formations/intermediaire/lecon3", label: "Lesson 3: Supply & Demand" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">What you should see on the chart</p>
        <h2 className="text-lg font-semibold text-white mb-4">Spot the zones at a glance</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">Support zone</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              You watch price drop, reach a level, bounce back up. Drop again, reach the same level, bounce again. <strong className="text-white">That repeated level = support zone.</strong> Buyers defend that floor.
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-2">Resistance zone</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Price rises, reaches a level, gets pushed back down. Rises again, reaches the same level, rejected again. <strong className="text-white">That repeated ceiling = resistance zone.</strong> Sellers defend that top.
            </p>
          </div>
        </div>
        <div className="mt-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-3 py-2">
          <p className="text-xs text-zinc-400"><span className="text-white font-medium">Key:</span> these are <span className="text-white font-medium">zones</span> (rectangles), not lines. Price never respects a level down to the exact candle.</p>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <SupportResistance supportPrice="1.0800" resistancePrice="1.0950" locale="en" />
        <div className="flex justify-around items-start pt-1 border-t border-zinc-800/50">
          <Candle type="pin-bull" label="Support rejection" caption="Bullish pin bar" />
          <div className="flex flex-col items-center justify-center gap-1 mt-8">
            <p className="text-[10px] text-zinc-600 font-mono text-center leading-relaxed">Signal<br/>→ entry<br/>+ SL below zone</p>
          </div>
          <Candle type="pin-bear" label="Resistance rejection" caption="Bearish pin bar" />
        </div>
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Polarity: when the role flips</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          When a support breaks with conviction, it becomes resistance. When a resistance breaks, it becomes support. It's one of the most reliable dynamics in the market.
        </p>
        <div className="space-y-2.5">
          <div className="bg-zinc-800/50 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-white mb-1">Real scenario. EUR/USD</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              EUR/USD bounces 3× off 1.0800 (support). Then price breaks 1.0800 with a big bearish candle. It later climbs back to retest 1.0800 → that zone was a support, now it becomes resistance. You can sell there with a SL above.
            </p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-emerald-400 mb-1">Opposite direction</p>
            <p className="text-xs text-zinc-400">Resistance broken → becomes support. Price breaks 1.0950, pullback to 1.0950 → buy zone. The old sellers are trapped, buyers take back control.</p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Order Blocks: where the institutions acted</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          An Order Block (OB) is the last candle of opposite direction before an impulsive move. It's where an institution placed a large order. Price often comes back there to complete the execution.
        </p>
        <div className="space-y-2.5 mb-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-emerald-400 mb-1">Bullish OB</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              You see a red candle, then a bullish explosion. The red candle = the bullish OB. When price returns to that red zone, look for a buy.
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-red-400 mb-1">Bearish OB</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              You see a green candle, then a bearish explosion. The green candle = the bearish OB. When price rises into that green zone, look for a sell.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">How to analyze in 5 seconds</p>
        <h2 className="text-lg font-semibold text-white mb-4">Find the important zones fast</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Look for aligned lows on the chart", d: "Several lows at the same level = support zone. Draw a rectangle that wraps around them." },
            { n: "2", t: "Look for aligned highs", d: "Several highs at the same level = resistance zone. Draw a horizontal rectangle." },
            { n: "3", t: "Note if a zone changed roles", d: "A broken support + pullback to that level = sell. A broken resistance + pullback = buy." },
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
        <h2 className="text-lg font-semibold text-white mb-4">The trader's logic at the zones</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↑</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Price reaches a support</p>
              <p className="text-xs text-zinc-400 mt-0.5">You wait for a rejection signal (pin bar, bullish engulfing). If the signal is there + the trend is bullish → buy with SL below the zone.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↓</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Price reaches a resistance</p>
              <p className="text-xs text-zinc-400 mt-0.5">You wait for a rejection (upper wick, bearish engulfing). If the signal is there + the trend is bearish → sell with SL above the zone.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-zinc-800/40 border border-zinc-700/40 rounded-xl px-4 py-3">
            <span className="text-lg">—</span>
            <div>
              <p className="text-sm font-semibold text-zinc-300">Price in the middle between two zones</p>
              <p className="text-xs text-zinc-400 mt-0.5">Nothing to do. You never enter in the middle of the range. You wait for price to reach a key zone.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Classic mistake</p>
        <p className="text-sm font-semibold text-white mb-2">Drawing a line instead of a zone</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          You draw an exact line at 1.0800 and place your SL at 1.0798. Price drops to 1.0796, triggers your SL, then rallies. The problem: price is never exact. You need to draw a zone 10-20 pips thick and place the SL below the entire zone, not below the line.
        </p>
      </section>

      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Summary in 3 seconds</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Price at support + rejection signal → you buy</p>
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Price at resistance + rejection signal → you sell</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>Price between two zones → you do nothing</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Review</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Support = zone where buyers pushed the drop back several times.",
          "Resistance = zone where sellers pushed the rise back several times.",
          "Polarity: broken support → resistance. Broken resistance → support.",
          "Order Block = last opposite candle before an impulsive move, institutional zone.",
          "Never trade in the middle, always wait for price to reach a key zone.",
        ]}
      />

      <LessonExercice
        description="On TradingView, open EUR/USD on H4 and draw your zones."
        steps={[
          "Identify 2 support zones: draw horizontal rectangles over the aligned lows. Give them thickness (10-20 pips minimum).",
          "Identify 2 resistance zones: do the same over the aligned highs.",
          "Check the polarity: is there a level that changed roles recently? Support turned resistance?",
          "Identify a recent Order Block: the last candle of opposite direction before the last big move. Note the exact level.",
        ]}
      />

      <LessonQuiz
        question="EUR/USD had been bouncing off 1.0800 for 3 weeks. Price just broke 1.0800 to the downside with a big bearish candle. Now it's climbing back toward 1.0800. What do you do?"
        options={[
          "You buy, 1.0800 is a strong historical support",
          "You sell at 1.0800, the old support becomes resistance through polarity",
          "You do nothing, the level is too well known, it won't work",
          "You wait for price to move back above 1.0800 to confirm",
        ]}
        correctIndex={1}
        explanation="This is polarity in action. 1.0800 was a support. It was broken with conviction. Now that price comes back to retest that level, it behaves like a resistance. You sell on the pullback with SL above 1.0800."
        answerExplanations={[
          "False. 1.0800 was a support, but it was broken. Once broken, a support no longer plays its buyer role, it flips into resistance. Buying here means ignoring polarity.",
          "Correct. Polarity is one of the most reliable behaviors in the market. 1.0800 broken → becomes resistance. The pullback to that level is a sell opportunity with a logical SL above.",
          "False. Very well-known levels often work better, not worse, that's where the orders concentrate. A level's popularity is no reason to ignore it.",
          "False. Waiting for price to move back above to confirm means missing the entry. The sell signal is the return to 1.0800 with a rejection, not the break to the upside.",
        ]}
      />

    </LessonPage>
  );
}
