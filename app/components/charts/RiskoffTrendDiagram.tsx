// Macro-trading 3 bloc 2 — trader dans le sens du régime (XAU/USD H4), exemple et plan du
// texte : impulsion 4 610 → 4 690 $ (HH) avec un palier à 4 655 $, pullback contrôlé
// jusqu'à 4 655 $ (ancien sommet devenu support, HL), stabilisation, bougie de reprise :
// long 4 660 $, SL 4 640 $ (sous le pullback), TP 4 730 $ (continuation). Pivots et R/R
// calculés. Bougies : scenarios.ts (« riskoff-trend-h4 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { tradeSetup, usd } from "@/app/components/lessons/trade";
import { pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const ENTRY = 4660, SL = 4640, TP = 4730;

export function RiskoffTrendDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["riskoff-trend-h4"];
  const piv = pivots(cs, 2);
  const hh = piv.find((q) => q.name === "HH")!;
  const old = piv.filter((q) => q.side === "h" && q.index < hh.index).at(-1)!;
  const hl = piv.find((q) => q.name === "HL" && q.index > hh.index)!;
  const entryAt = cs.findIndex((k, i) => i > hl.index && k.c === ENTRY);
  const t = tradeSetup({ entry: ENTRY, sl: SL, tp: TP, unit: "$", from: entryAt, names: { entry: "Entrée long", tp: "TP continuation" } });
  return (
    <LessonChart
      id="RiskoffTrendDiagram"
      title="Les pullbacks H4 = opportunités d'entrée"
      caption="Structure HH/HL intacte = régime intact. On entre sur le pullback, pas sur le breakout."
      panels={[{
        key: "h4", title: "XAU/USD H4, régime risk-off établi", decimals: 0, height: 290, candles: cs,
        levels: [{ key: "old", price: old.price, from: old.index, to: entryAt, label: `Ancien sommet ${usd(old.price)} = support`, short: "Support", tone: "zone", dashed: true }, ...t.levels],
        markers: [
          { key: "hh", i: hh.index, price: hh.price, label: `HH ${usd(hh.price)}`, pivot: "HH", tone: "bull", side: "above" },
          { key: "hl", i: hl.index, price: hl.price, label: `HL ${usd(hl.price)}`, pivot: "HL", tone: "bull", side: "below" },
        ],
        chips: t.chips,
      }]}
    />
  );
}
