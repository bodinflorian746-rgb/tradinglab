// Trading Débutant 2 — Long vs Short avec les exemples du texte (or) : Long à 4 600 $,
// le prix monte à 4 720 $ (+120 $ en ta faveur) ; Short à 4 700 $, le prix descend à
// 4 580 $ (+120 $ en ta faveur). Schéma en ligne (sens du gain), écarts calculés.

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { fmtPrice } from "@/lib/lessons/chart-analysis";

const usdSp = (x: number) => `${fmtPrice(x, 0, "$").replace("$", "")} $`;
const CASES = [
  { key: "long", title: "Long (Buy) : tu gagnes si le prix monte", entry: 4600, line: [4600, 4612, 4605, 4631, 4648, 4640, 4669, 4685, 4678, 4702, 4720], name: "Achat" },
  { key: "short", title: "Short (Sell) : tu gagnes si le prix baisse", entry: 4700, line: [4700, 4689, 4697, 4672, 4655, 4663, 4634, 4618, 4626, 4601, 4580], name: "Vente" },
];

export function LongShortDiagram() {
  const panels: LCPanel[] = CASES.map((c) => {
    const exit = c.line[c.line.length - 1];
    const gain = c.key === "long" ? exit - c.entry : c.entry - exit;
    return {
      key: c.key, title: c.title, decimals: 0, height: 220, line: c.line,
      levels: [{ key: "entry", price: c.entry, label: `${c.name} ${usdSp(c.entry)}`, short: c.name, tone: "entry", dashed: true }],
      markers: [{ key: "exit", i: c.line.length - 1, price: exit, label: `Sortie ${usdSp(exit)}`, short: "Sortie", tone: "bull", side: c.key === "long" ? "above" : "below", dot: true }],
      chips: [{ label: `${gain > 0 ? "+" : "−"}${usdSp(Math.abs(gain))} en ta faveur`, tone: "bull", data: { gain } }],
    };
  });
  return <LessonChart id="LongShortDiagram" title="Long ou Short : seul le sens du gain change" panels={panels} rows={[2]} />;
}
