import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { FibonacciDiagram } from "@/app/components/charts/FibonacciDiagram";

export default function ContentEn() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon9"
      title="Fibonacci, retracements and confluences"
      subtitle="The Fibonacci tool identifies the probabilistic retracement zones within a move. Combined with other confluences, it sharpens entry precision considerably."
      duration="20 min"
      lessonNumber={9}
      prev={{ href: "/formations/intermediaire/lecon8", label: "Lesson 8: Trading plan" }}
      next={null}
    >

      {/* ── What you must SEE ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">What you must see on the chart</p>
        <h2 className="text-lg font-semibold text-white mb-4">Fibonacci in action on EUR/USD</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">The impulsive move (starting point)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              EUR/USD rises from 1.0800 (swing low) to 1.0980 (swing high) in an uptrend. You draw Fibonacci from 1.0800 to 1.0980. The levels appear on the chart: 23.6% = 1.0937, 38.2% = 1.0911, 50% = 1.0890, <strong className="text-white">61.8% = 1.0869.</strong>
            </p>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-blue-400 mb-2">The retracement (entry zone)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Price pulls back from 1.0980. It drops, drops... and stalls at 1.0870. That's the 61.8% of Fibonacci. You look, and there's also a historical support at that level. <strong className="text-white">Confluence.</strong> You wait for a candle signal before entering long.
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-2">What you must NOT do</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Enter the moment price touches the 61.8%, with no signal. Price can punch through toward the 78.6% or lower. Fibonacci identifies the <strong className="text-white">watch zone</strong>, not the automatic entry.
            </p>
          </div>
        </div>
      </section>

      {/* ── The levels ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">The Fibonacci levels you need to know</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          The levels are mathematical ratios applied to a price move. They identify the probabilistic bounce zones during a retracement.
        </p>
        <div className="space-y-2.5">
          {[
            { level: "23.6%", desc: "Shallow retracement, very strong trend, little correction. Rare.", color: "text-zinc-400" },
            { level: "38.2%", desc: "Moderate retracement, common in a solid trend. Good risk/reward ratio.", color: "text-blue-400" },
            { level: "50%", desc: "Strong psychological level, not a pure Fibonacci, but very respected by traders.", color: "text-blue-400" },
            { level: "61.8%", desc: "The 'golden ratio', the most used and most powerful retracement zone. Watch it as a priority.", color: "text-emerald-400" },
            { level: "78.6%", desc: "Deep retracement, useful for aggressive entries near the swing low. Risky without confluence.", color: "text-red-400" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-zinc-800/40 rounded-xl px-4 py-3">
              <span className={`text-sm font-bold shrink-0 w-12 ${item.color}`}>{item.level}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <FibonacciDiagram locale="en" />
      </div>

      {/* ── Draw it correctly ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">How to draw Fibonacci correctly</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Fibonacci levels are drawn over a complete impulsive move, from swing low to swing high (uptrend), or from swing high to swing low (downtrend).
        </p>
        <div className="space-y-2">
          {[
            { step: "1", text: "Identify a clear impulsive move: a sharp swing low and swing high on the chart." },
            { step: "2", text: "In an uptrend: click first on the swing low, then on the swing high. The levels appear between the two." },
            { step: "3", text: "Price retraces from the swing high → watch the 38.2%, 50% and 61.8% zones as a priority." },
            { step: "4", text: "Look for a confluence on these zones: historical S/R, SD zone, psychological level (1.0850, 1.0900…). That's where you prepare your entry." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-4">{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Fibonacci + confluences ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Fibonacci + confluences = golden zones</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Fibonacci alone isn't enough. A Fib level that coincides with other confluences becomes a major zone of interest.
        </p>
        <div className="space-y-2.5">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-emerald-400 mb-1">Ideal setup, 3 confluences + signal</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              EUR/USD Daily bullish → 61.8% Fib at 1.0869 → former historical support at 1.0870 → un-retested Demand zone on the same area. Price arrives. Bullish pin bar. You enter long. SL below the zone (1.0848), TP toward 1.0980.
            </p>
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm text-zinc-400 leading-relaxed">
              <span className="text-white font-medium">Fibonacci's limit:</span> the levels are not magic magnets. Price can punch through the 61.8% and keep going down to the 78.6%. Use Fibonacci to identify watch zones, not to place orders without a signal.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5 seconds ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">How to analyze in 5 seconds</p>
        <h2 className="text-lg font-semibold text-white mb-4">Using Fibonacci quickly</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Is there a clear, recent impulsive move?", d: "If yes, draw Fibonacci on it (swing low → swing high in an uptrend). If not → no usable Fibonacci." },
            { n: "2", t: "Is there a confluence on the 61.8% or the 50%?", d: "Historical S/R, SD zone, psychological level at the same level? If yes → golden zone to watch." },
            { n: "3", t: "Wait for the candle signal in the zone", d: "Pin bar or engulfing in the direction of the Daily trend on the Fib zone = entry. No signal = nothing to do." },
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

      {/* ── What you must do ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-3">What you must do</p>
        <h2 className="text-lg font-semibold text-white mb-4">Facing a Fibonacci level</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✓</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Fib level + confluence + candle signal</p>
              <p className="text-xs text-zinc-400 mt-0.5">That's the complete setup, a confirmation to weigh within your own trading plan, not an automatic entry. SL below the whole Fib zone, TP toward the previous swing high (or the next resistance).</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-400/5 border border-amber-400/15 rounded-xl px-4 py-3">
            <span className="text-lg">~</span>
            <div>
              <p className="text-sm font-semibold text-amber-400">Fib level alone (no confluence)</p>
              <p className="text-xs text-zinc-400 mt-0.5">You watch but you don't enter yet. Fibonacci alone with no other reason = insufficient probability. Look for a confluence before deciding.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✗</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Entry on the touch of the level, no signal</p>
              <p className="text-xs text-zinc-400 mt-0.5">You don't enter. Price can punch through the 61.8% and keep going. Always wait for a candle signal that confirms price is reacting to the zone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Classic mistake ── */}
      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Classic mistake</p>
        <p className="text-sm font-semibold text-white mb-2">Entering on every Fibonacci level automatically</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Price retraces. It touches the 38.2% → you buy. It keeps dropping. You buy at the 50%. It keeps going. You buy at the 61.8%. Now you have 3 losing positions. The problem: Fibonacci is not a grid of automatic buys. It's a tool to identify zones. If the 38.2% has no confluence and no signal → you don't touch it. You wait for the strongest level, with confluence, with a signal.
        </p>
      </section>

      {/* ── Ultra-fast recap ── */}
      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Recap in 3 seconds</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>61.8% + confluence (S/R, SD) + candle signal → you enter</p>
          <p className="text-zinc-200"><span className="text-amber-400 font-bold mr-2">~</span>Fib level without confluence → you only watch</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>Price touches the Fib with no signal → you don't enter</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Review</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Fibonacci identifies probabilistic retracement zones: 38.2%, 50%, 61.8% are the most used.",
          "Draw Fibonacci over a complete impulsive move: swing low → swing high (uptrend).",
          "The 61.8% (golden ratio) is the most respected level, but never infallible.",
          "Fibonacci alone isn't a signal, wait for a confluence (S/R, SD zone) AND a candle signal.",
          "The 'golden zones' = intersection of several confluences including a key Fib level.",
        ]}
      />

      <LessonExercice
        description="On TradingView, draw and analyze Fibonacci retracements on EUR/USD."
        steps={[
          "Open EUR/USD on H4. Use the Fibonacci Retracement tool in TradingView's drawing tools.",
          "Identify the last big bullish move. Draw your Fib from the swing low to the swing high.",
          "Did price retrace? On which Fib level did it stall (38.2%, 50%, 61.8%)? Was there a candle signal on that level?",
          "Are there other confluences on that level (historical S/R, SD zone, psychological level)? If yes, note why it was a golden zone.",
        ]}
      />

      <LessonQuiz
        question="You draw Fibonacci over a bullish EUR/USD move (1.0800 → 1.0980). Price retraces to the 61.8% at 1.0869. This level coincides with a historical support respected twice. What do you do?"
        options={[
          "You enter long immediately, the golden ratio + support is enough",
          "You wait for a candle signal (bullish pin bar or engulfing) on the zone before entering",
          "You place a sell order, the retracement will probably continue to the 78.6%",
          "You ignore the 61.8%, the support has already been touched twice, it's weakened",
        ]}
        correctIndex={1}
        explanation="You have 2 solid confluences: 61.8% Fib + historical support. It's a golden zone to watch. But the candle signal is still missing. Wait for a bullish pin bar or an engulfing to confirm that price is reacting to the zone, then enter with SL below 1.0848 and TP toward 1.0980."
        answerExplanations={[
          "Too hasty. You have 2 solid confluences, but without a candle signal, you're entering at a price that can keep dropping toward 1.0840 or lower. The confluence tells you 'look here', not 'enter now'.",
          "Correct. The 61.8% + support is a golden zone. But the confirmation is still necessary. A bullish pin bar or an engulfing on this zone tells you the buyers are reacting. Then you enter with SL below the zone (1.0848) and TP toward the swing high (1.0980).",
          "Wrong. In a bullish Daily trend, the retracement toward the 61.8% is a buying opportunity, not a selling one. Shorting here means trading against the underlying trend and against 2 bullish confluences.",
          "Partially. A support touched twice is less strong than a virgin support, but it stays valid, especially combined with the 61.8% Fib. The overlap of the two levels reinforces the zone, it doesn't cancel it.",
        ]}
      />

    </LessonPage>
  );
}
