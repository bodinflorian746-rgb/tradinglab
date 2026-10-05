import { LessonTemplate } from "@/app/components/LessonTemplate";
import { SpreadDiagram } from "@/app/components/charts/SpreadDiagram";
import { SpreadVariationDiagram } from "@/app/components/charts/SpreadVariationDiagram";

// ── Diagram: gain and loss with the spread ───────────────────────────────────
function SpreadImpactDiagram() {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
        <p className="text-[10px] font-bold text-emerald-400 mb-2 uppercase tracking-wide">Enough movement ✓</p>
        <div className="space-y-1 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-500">Buy (Ask)</span>
            <span className="text-white">1.0805</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Sell (Bid)</span>
            <span className="text-white">1.0870</span>
          </div>
          <div className="h-px bg-zinc-700 my-1" />
          <div className="flex justify-between">
            <span className="text-zinc-500">Net gain</span>
            <span className="text-emerald-400 font-bold">+65 pts ✓</span>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
        <p className="text-[10px] font-bold text-red-400 mb-2 uppercase tracking-wide">Movement too small ✗</p>
        <div className="space-y-1 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-500">Buy (Ask)</span>
            <span className="text-white">1.0805</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Sell (Bid)</span>
            <span className="text-white">1.0806</span>
          </div>
          <div className="h-px bg-zinc-700 my-1" />
          <div className="flex justify-between">
            <span className="text-zinc-500">Result</span>
            <span className="text-red-400 font-bold">−4 pts ✗</span>
          </div>
        </div>
        <p className="text-[9px] text-zinc-600 mt-1.5">The spread wipes out the gain</p>
      </div>
    </div>
  );
}

export default function ContentEn() {
  return (
    <LessonTemplate
      formationId="debutant"
      lessonId="lecon4"
      lessonNumber={4}
      duration="8 min"
      prev={{ href: "/formations/debutant/lecon3", label: "Lesson 3: Candles" }}
      next={{ href: "/formations/debutant/lecon5", label: "Lesson 5: Stop Loss" }}
      title="Spread, Bid and Ask"
      hook="You analyze the market perfectly. You enter at the right moment. And yet, you're already in the red from the very first second, without the price having moved. It's not a mistake. It's the spread. And every trader pays it, on every trade, without exception."
      sections={[
        {
          title: "Bid and Ask: two prices at all times",
          content: "On any market, two prices are always displayed at the same time. It's not a bug, it's how it normally works. The Bid is the price at which you can sell. The Ask is the price at which you can buy. The Ask is always slightly higher than the Bid.",
          visual: <SpreadDiagram />,
          items: [
            "BID = selling price (always the lower of the two)",
            "ASK = buying price (always the higher of the two)",
            "SPREAD = Ask − Bid = the cost paid every time you open a trade",
            "Example: EUR/USD Bid = 1.0800, Ask = 1.0805 → a 5-point spread",
          ],
        },
        {
          title: "A concrete example: the impact of the spread on your trades",
          content: "You buy EUR/USD at the Ask (1.0805). To be profitable, the Bid price has to exceed 1.0805, meaning the market has to move at least 5 points in your direction before you start making money.",
          visual: <SpreadImpactDiagram />,
          items: [
            "The spread is paid when you ENTER the trade, not when you exit",
            "You start every trade in the red by the amount of the spread",
            "For EUR/USD with a 5-point spread: the market has to move +5 points before breaking even",
            "On small targets, the spread can represent 50% of the gain you're aiming for",
          ],
        },
        {
          title: "The spread varies with conditions",
          content: "The spread isn't fixed. It depends on the market's liquidity, how many buyers and sellers are active right now. The more activity there is, the tighter the spread and the less you pay.",
          visual: <SpreadVariationDiagram />,
          items: [
            "EUR/USD during peak hours (9am–5pm): 1–2 points, minimal cost",
            "EUR/USD overnight (10pm–6am): 4–8 points, higher cost",
            "Cryptos on the weekend: very variable, can be very expensive",
            "Exotic pairs (USD/TRY...): 20–100 points, dangerous for small targets",
          ],
        },
      ]}
      errors={[
        "Trading high-spread assets (exotic pairs, crypto on the weekend) without checking the entry cost",
        "Trying to make 3 points on a trade with a 5-point spread, it's impossible to be profitable",
        "Trading overnight or during off-peak hours without knowing that the spread widens significantly",
        "Choosing a broker on advertising alone without comparing spreads, 1 point of difference × 100 trades = a real impact",
      ]}
      fatalError="Trading a high-spread asset with a profit target smaller than the spread. If your spread is 20 points and you're aiming for a 15-point gain, you're at a loss before the market even moves a single point. Always calculate the spread before setting your target."
      keyPoints={[
        "Bid = selling price. Ask = buying price. The Ask is always higher.",
        "Spread = Ask − Bid = the cost paid when entering each trade",
        "You start every trade in the red by the amount of the spread",
        "The spread is lower during high-activity hours (9am–5pm Paris time)",
        "Your profit target must always exceed the spread, otherwise the trade is a loser from the start",
      ]}
      exerciseTitle="Observing the spread in real conditions"
      exercise={[
        "On TradingView.com, open EUR/USD. In the chart settings, turn on the Bid and Ask display.",
        "Note the difference between Bid and Ask on a weekday at 10am, that's the spread at that moment.",
        "Come back to check this spread at 11pm or on a Sunday, is it wider or tighter? Why?",
        "Open an exotic pair like USD/MXN and compare its spread to that of EUR/USD.",
      ]}
      quiz={{
        question: "EUR/USD: Bid = 1.0800, Ask = 1.0805. You open a buy (Long). At what price does your trade execute, and how far in the red are you immediately?",
        answers: [
          "At 1.0800, you start at break-even, zero spread",
          "At 1.0802, you're 2 points in the red",
          "At 1.0805, you're 5 points in the red immediately",
          "The execution price depends on the size of your position",
        ],
        correctIndex: 2,
        explanation: "A buy always executes at the Ask = 1.0805. The spread = Ask − Bid = 1.0805 − 1.0800 = 5 points. If you close immediately, you sell at the Bid = 1.0800 and lose 5 points. That's the entry cost paid on every trade.",
        answerExplanations: [
          "False. The Bid (1.0800) is the price at which you SELL, not the one at which you buy. On a buy, the order executes at the Ask (1.0805). You start with a 5-point deficit, not at break-even.",
          "False. There's no intermediate price between Bid and Ask for a market order. You buy at the Ask (1.0805) or sell at the Bid (1.0800). Here: 1.0805, so 5 points in the red.",
          "Correct. The buy executes at the Ask = 1.0805. Spread = 5 points. Closing immediately at the Bid = 1.0800 → a 5-point loss. This cost is paid when opening every trade, without exception.",
          "False. The execution price is always the Ask for a buy, whatever the position size. Size affects the amount in euros lost per point, not the execution price level.",
        ],
      }}
    />
  );
}
