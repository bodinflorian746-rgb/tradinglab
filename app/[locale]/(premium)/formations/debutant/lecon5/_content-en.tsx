import { LessonTemplate } from "@/app/components/LessonTemplate";
import { StopLossChartDiagram } from "@/app/components/charts/StopLossChartDiagram";

// ── Diagram: Trade with SL and TP ────────────────────────────────────────────
function StopLossDiagram() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-4 text-center">
        Bitcoin, Long trade with Stop Loss and Take Profit
      </p>
      <div className="max-w-xs mx-auto space-y-0">
        {/* TP zone */}
        <div className="rounded-t-xl bg-emerald-500/10 border border-emerald-500/25 px-4 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide mb-0.5">Take Profit</p>
            <p className="text-lg font-mono font-bold text-emerald-400">$81,000</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 mb-0.5">If the price rises to here</p>
            <p className="text-sm font-bold text-emerald-400">Change +$3,000</p>
          </div>
        </div>

        {/* Arrows */}
        <div className="flex items-center justify-center bg-zinc-900 border-x border-zinc-700 h-8 gap-8">
          <div className="flex items-center gap-1 text-[9px] text-emerald-400">
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
              <path d="M5 13V2M2 5L5 2l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Target</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-red-400">
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
              <path d="M5 1v11M2 9l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Protection</span>
          </div>
        </div>

        {/* Entry */}
        <div className="bg-zinc-800 border-x border-zinc-700 px-4 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-white uppercase tracking-wide mb-0.5">Entry</p>
            <p className="text-lg font-mono font-bold text-white">$78,000</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 mb-0.5">Buy price</p>
            <span className="text-xs font-mono text-zinc-400">R/R 1:2</span>
          </div>
        </div>

        {/* SL zone */}
        <div className="rounded-b-xl bg-red-500/10 border border-red-500/25 px-4 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-wide mb-0.5">Stop Loss</p>
            <p className="text-lg font-mono font-bold text-red-400">$76,500</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 mb-0.5">If the price drops to here</p>
            <p className="text-sm font-bold text-red-400">Change −$1,500</p>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-3 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-center">
          <p className="text-[10px] text-zinc-400">
            Change at risk <strong className="text-red-400">$1,500</strong> · target <strong className="text-emerald-400">$3,000</strong>
            <span className="text-zinc-600 mx-1.5">·</span>
            Ratio <strong className="text-white">1:2</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Diagram: with SL vs without SL ───────────────────────────────────────────
function WithWithoutSLDiagram() {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
        <p className="text-[10px] font-bold text-emerald-400 mb-2 uppercase tracking-wide">With Stop Loss ✓</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-500">Buy</span>
            <span className="text-white font-mono">$78,000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">SL triggered at</span>
            <span className="text-white font-mono">$76,500</span>
          </div>
          <div className="h-px bg-zinc-700 my-1" />
          <div className="flex justify-between">
            <span className="text-zinc-500">Change</span>
            <span className="text-red-400 font-bold">−$1,500</span>
          </div>
          <p className="text-[9px] text-emerald-400/80 mt-1">Risk limited and defined in advance</p>
        </div>
      </div>
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
        <p className="text-[10px] font-bold text-red-400 mb-2 uppercase tracking-wide">Without Stop Loss ✗</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-500">Buy</span>
            <span className="text-white font-mono">$78,000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Overnight drop to</span>
            <span className="text-white font-mono">$70,000</span>
          </div>
          <div className="h-px bg-zinc-700 my-1" />
          <div className="flex justify-between">
            <span className="text-zinc-500">Change</span>
            <span className="text-red-400 font-bold">−$8,000</span>
          </div>
          <p className="text-[9px] text-red-400/80 mt-1">Risk with no cap</p>
        </div>
      </div>
    </div>
  );
}

export default function ContentEn() {
  return (
    <LessonTemplate
      formationId="debutant"
      lessonId="lecon5"
      lessonNumber={5}
      duration="10 min"
      prev={{ href: "/formations/debutant/lecon4", label: "Lesson 4: Spread" }}
      next={{ href: "/formations/debutant/lecon6", label: "Lesson 6: Take Profit" }}
      title="The Stop Loss"
      hook="Without a Stop Loss, a single trade can ruin months of work in a few minutes. Not because you analyze badly, because the market can go much further than you imagine, and nothing stops you. The Stop Loss is the most important rule in trading."
      sections={[
        {
          title: "What is a Stop Loss?",
          content: "A Stop Loss (SL) is an automatic order that closes your trade if the price goes too far in the wrong direction. You set it before entering the trade. When the price reaches it, your position closes on its own, whether you're in front of the screen or not.",
          visual: <StopLossDiagram />,
          items: [
            "Long trade (buy): your SL is placed BELOW your entry price",
            "Short trade (sell): your SL is placed ABOVE your entry price",
            "When the price reaches the SL, the trade closes automatically",
            "Your loss stays capped and known in advance, its exact amount in money depends on the size of your position",
          ],
        },
        {
          title: "Price change and position size",
          content: "The price change between the entry and the Stop Loss is identical for every trader on this trade. In this example, the market moves $1,500 between $78,000 and $76,500. On the other hand, the gain or loss in money depends on the size of the position used (the lot). On exactly the same price move, a trader positioned with 1 lot will lose 10× more than a trader positioned with 0.1 lot, and 100× more than a trader positioned with 0.01 lot. Two traders can therefore take exactly the same trade, with the same SL and the same TP, while gaining or losing totally different amounts. The precise calculation of position size is covered in Lesson 8 (Money Management).",
          items: [
            "The price change up to the SL is identical for every trader on the trade",
            "The gain or loss in money depends on the size of your position, your lot",
            "Same trade, same SL, same TP: with different lots, the amounts gained or lost are totally different",
          ],
        },
        {
          title: "A concrete example: with and without a Stop Loss",
          content: "Case 1, with a Stop Loss: Bitcoin entry at $78,000, Stop Loss at $76,500. Overnight, the market drops sharply and the Stop Loss automatically closes the position near $76,500. The negative price change is limited to about $1,500: a risk defined in advance and controlled. Case 2, without a Stop Loss: same entry at $78,000, but with no protection. Overnight, the market collapses to $70,000: the negative price change reaches $8,000, a risk with no cap. In both cases, the amount actually lost in money depends on the size of the position. The Stop Loss doesn't guarantee a winning trade, above all it guarantees that a bad position doesn't turn into a catastrophe.",
          visual: <WithWithoutSLDiagram />,
          items: [
            "With an SL: the loss is limited and known in advance from the entry",
            "Without an SL: the loss can be unlimited, the market doesn't wait for you to be ready",
            "Traders without an SL think 'the price will come back', sometimes it does, sometimes it doesn't. The 'doesn't' destroys the account.",
          ],
        },
        {
          title: "Where to place your Stop Loss?",
          content: "A good SL isn't placed at random. It's placed at a logical spot on the chart, where your analysis would be clearly wrong if the price reached it.",
          visual: <StopLossChartDiagram />,
          items: [
            "Long: SL just below the last significant low (the support)",
            "Short: SL just above the last significant high (the resistance)",
            "Example: you buy on the bounce off a support at $78,000. The last low is at $77,200. Your SL goes to $77,000.",
            "Rule: if the price reaches my SL, my analysis was wrong. The loss is normal.",
          ],
        },
      ]}
      errors={[
        "Not setting an SL 'to give the trade a chance', it's the #1 cause of destroyed accounts among beginners",
        "An SL that's too tight: a $100 SL on Bitcoin, which normally fluctuates more than $1,000 per hour, you'll be taken out for no reason",
        "An SL placed at random ('$1,500 because it feels right'), the SL must match a logical level on the chart",
        "Forgetting to place the SL when you enter, thinking 'I'll add it right after', and never adding it",
      ]}
      fatalError="Moving the Stop Loss in the wrong direction to avoid being stopped out. Your trade is losing, you're at −$500. You move the SL away to 'give it a chance'. The trade keeps losing. You move it further. In the end, you lose 5 or 10 times more than planned. This mistake, made under emotion, is responsible for destroying thousands of beginner traders' accounts."
      keyPoints={[
        "Stop Loss = an automatic order that limits your loss to an amount defined in advance",
        "Long: SL below the entry. Short: SL above the entry.",
        "Without an SL, your loss is potentially unlimited, that's an unacceptable risk",
        "Place the SL at a logical spot on the chart, not at random",
        "NEVER move the SL in the direction of the loss, that's the fatal mistake",
      ]}
      exerciseTitle="Identifying logical Stop Loss placements"
      exercise={[
        "On TradingView, open Bitcoin (BTC/USD) on H1",
        "Spot the last bullish move. Identify the last low before that rise.",
        "If you bought at the current price, your SL would go just below that low. Note the exact price.",
        "Calculate the difference in euros between that SL and the current price. That's the maximum risk of this trade.",
      ]}
      quiz={{
        question: "A buy position on BTC/USD is open at $78,000. The last significant low sits at $77,000. Which Stop Loss placement best respects the technical logic?",
        answers: [
          "$77,900",
          "$77,500",
          "$76,900",
          "$78,200",
        ],
        correctIndex: 2,
        explanation: "The Stop Loss must be placed beyond the technical level that invalidates the scenario. The last important low sits at $77,000. A Stop Loss at $76,900 leaves a small margin below that level while keeping a consistent risk. The change between the entry ($78,000) and the SL ($76,900) represents a price change of $1,100. The loss actually suffered in money then depends on the size of the position used.",
        answerExplanations: [
          "Incorrect. The Stop Loss is placed too close to the entry. A normal Bitcoin fluctuation can easily hit this level without invalidating the scenario.",
          "Incorrect. The Stop Loss stays above the last significant low. The market could sweep that level before resuming.",
          "Correct. The Stop Loss sits just below the last important low at $77,000. The level genuinely invalidates the scenario if the price breaks it.",
          "Incorrect. The Stop Loss is placed above the entry price. The trade would close immediately or almost.",
        ],
      }}
    />
  );
}
