// Macro-trading 3 bloc 2 — trader dans le sens du régime (XAU/USD H4) : impulsion
// 4 610→4 690 (HH), pullback vers 4 655 (HL), entrée long 4 660, SL 4 640, TP 4 730.
// Bougies : scenarios.ts (« riskoff-trend-h4 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { tradeSetup } from "@/app/components/lessons/trade";
import { pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const ENTRY = 4660, SL = 4640, TP = 4730;

export function RiskoffTrendDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["riskoff-trend-h4"];
  const piv = pivots(cs, 2);
  const hh1 = piv.find((q) => q.name === "HH")!;
  const hl1 = piv.find((q) => q.name === "HL" && q.index > hh1.index)!;
  const entryAt = cs.findIndex((k, i) => i > hl1.index && k.c >= ENTRY);
  const t = tradeSetup({ entry: ENTRY, sl: SL, tp: TP, unit: "$", from: entryAt, names: { entry: "Entrée long", tp: "TP continuation" } });
  return (
    <LessonChart
      id="RiskoffTrendDiagram"
      title="Les pullbacks H4 = opportunités d'entrée"
      caption="Structure HH/HL intacte = régime intact. On entre sur pullback, pas sur le breakout."
      panels={[{
        key: "h4", title: "XAU/USD H4 — régime risk-off bullish", decimals: 0, height: 280, candles: cs,
        levels: t.levels,
        markers: [
          { key: "hh1", i: hh1.index, price: hh1.price, label: "HH", pivot: "HH", tone: "bull", side: "above" },
          { key: "hl1", i: hl1.index, price: hl1.price, label: "HL", pivot: "HL", tone: "neutral", side: "below" },
        ],
        chips: t.chips,
      }]}
    />
  );
}
