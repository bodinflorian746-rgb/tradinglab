// Reversal 1 bloc 5 — plan de trade du double top EUR/USD H1 et measured move (décision PO) :
// hauteur mesurée depuis le sommet le PLUS HAUT des deux (1.1895) jusqu'à la ligne de cou 1.1800 =
// 95 pips, projection théorique sous la ligne de cou à 1.1705 ; TP prudent à 1.1715, juste avant
// la projection ; short 1.1795 à la clôture sous la ligne de cou, SL tactique 1.1835 au-dessus du
// dernier rebond (1.1832), 40 pips. Hauteur, projection et R/R calculés et vérifiés par l'audit.
// Bougies : scenarios.ts (« dt-eur »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { tradeSetup } from "@/app/components/lessons/trade";
import { fmtPrice, pips, pivots, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";
import { dtbShape } from "./DoubleTopBottomDiagram";

const p = (x: number) => fmtPrice(x, 4);

export default function DTBMeasuredMoveProjectionDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["dt-eur"] as Candle[];
  const { a, b, neck, brk } = dtbShape(cs, "h");
  const top = a.price >= b.price ? a : b;          // le sommet le plus haut du pattern
  const height = top.price - neck.price, proj = neck.price - height;
  const entry = cs[brk].c;
  const t = tradeSetup({ entry, sl: 1.1835, tp: 1.1715, from: brk, names: { entry: "Entrée short", tp: "TP prudent" } });
  const end = cs.length + 3;
  // dernier rebond sous les sommets (le SL tactique se place juste au-dessus)
  const bounce = pivots(cs, 1).filter((q) => q.side === "h" && q.index > b.index && q.index < brk).at(-1)!;
  return (
    <LessonChart
      id="DTBMeasuredMoveProjectionDiagram"
      title="Measured move : la hauteur du pattern projetée"
      caption="Hauteur mesurée depuis le sommet le plus haut. TP prudent placé juste avant la projection théorique."
      panels={[{
        key: "h1", title: "EUR/USD H1", decimals: 5, height: 300, candles: cs, slots: end + 1,
        levels: [
          { key: "neck", price: neck.price, from: a.index, label: `Ligne de cou ${p(neck.price)}`, short: "Ligne de cou", tone: "zone" },
          { key: "proj", price: proj, from: brk, label: `Projection théorique ${p(proj)}`, short: "Projection", tone: "fib", dashed: true },
          ...t.levels,
        ],
        segments: [
          { key: "h", i1: top.index, p1: top.price, i2: top.index, p2: neck.price, tone: "fib", arrow: true, role: "dt-height", ref: `${a.index},${b.index}` },
          { key: "m", i1: end, p1: neck.price, i2: end, p2: proj, tone: "fib", arrow: true },
        ],
        markers: [
          { key: "bounce", i: bounce.index, price: bounce.price, label: `Dernier rebond ${p(bounce.price)}`, short: "Rebond", tone: "bear", side: "above" },
          { key: "hgt", i: top.index, price: top.price, label: `Hauteur ${pips(top.price, neck.price, 0.0001)} pips`, short: `Hauteur ${pips(top.price, neck.price, 0.0001)} pips`, tone: "fib", side: "above" },
        ],
        chips: t.chips,
      }]}
    />
  );
}
