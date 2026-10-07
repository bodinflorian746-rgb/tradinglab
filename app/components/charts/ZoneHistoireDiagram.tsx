// Multi-timeframe 3 — une zone doit raconter une histoire. EUR/USD H1 : 1.1760 est un
// ancien support cassé par une chute ; l'impulsion baissière laisse un FVG bearish
// 1.1750-1.1760 ; la remontée actuelle revient vers ce niveau, qui cumule deux raisons.
// Bougies : scenarios.ts (« zone-histoire ») ; FVG calculé.

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, largestFvg } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

export function ZoneHistoireDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["zone-histoire"];
  const g = largestFvg(cs, "bear")!;
  const last = cs.length - 1;
  return (
    <LessonChart
      id="ZoneHistoireDiagram"
      title="Une zone qui raconte une histoire"
      panels={[{
        key: "h1", subtitle: "EUR/USD H1 — ancien support devenu résistance + FVG non mitigé",
        decimals: 5, height: 280, candles: cs,
        zones: [{ key: "fvg", y1: g.y1, y2: g.y2, from: g.i - 1, label: `FVG bearish ${p(g.y1)}-${p(g.y2)}`, short: "FVG bearish", tone: "bear", kind: "fvg", src: `zone-histoire:${g.i}` }],
        levels: [{ key: "support", price: g.y2, to: g.i, label: `Ancien support ${p(g.y2)}`, short: "Ancien support", tone: "bull", dashed: true }],
        markers: [
          { key: "bo", i: g.i, price: cs[g.i].l, label: "Breakout baissier", short: "Breakout", tone: "bear", side: "below" },
          { key: "now", i: last, price: cs[last].h, label: "Remontée actuelle", short: "Remontée", tone: "entry", side: "above" },
        ],
      }]}
      caption="Deux raisons de réagir au même niveau : ancien support devenu résistance et FVG non mitigé."
    />
  );
}
