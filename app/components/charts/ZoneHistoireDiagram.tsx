// Multi-timeframe 3 — une zone doit raconter une histoire. EUR/USD H1 : 1.1760 est un
// support touché deux fois (rebonds nets), puis cassé par une chute ; l'impulsion baissière
// laisse un FVG bearish 1.1750-1.1760 ; la remontée actuelle revient au contact du FVG, sous
// l'ancien support devenu résistance : le niveau cumule deux raisons.
// Bougies : scenarios.ts (« zone-histoire ») ; FVG calculé.

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, largestFvg } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

export function ZoneHistoireDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["zone-histoire"];
  const g = largestFvg(cs, "bear")!;
  const last = cs.length - 1;
  // touches du support avant la cassure : plus bas à 1.1761 et 1.1760, suivis d'un rebond
  const touches = cs.map((k, i) => i).filter((i) => i < g.i - 1 && cs[i].l <= g.y2 + 0.00015 && cs[i + 2]?.l > g.y2 + 0.001);
  return (
    <LessonChart
      id="ZoneHistoireDiagram"
      title="Une zone qui raconte une histoire"
      panels={[{
        key: "h1", subtitle: "EUR/USD H1 — ancien support devenu résistance + FVG non mitigé",
        decimals: 5, height: 280, candles: cs,
        zones: [{ key: "fvg", y1: g.y1, y2: g.y2, from: g.i - 1, label: `FVG bearish ${p(g.y1)}-${p(g.y2)}`, short: "FVG bearish", tone: "bear", kind: "fvg", src: `zone-histoire:${g.i}`, role: "fvg" }],
        levels: [{ key: "support", price: g.y2, label: `Ancien support ${p(g.y2)}`, short: "Ancien support", tone: "bull", dashed: true, role: "support" }],
        markers: [
          ...touches.map((i, n) => ({ key: `t${n + 1}`, i, price: cs[i].l, label: `Touche ${n + 1} du support`, short: `Touche ${n + 1}`, tone: "bull" as const, side: "below" as const, role: "low" as const })),
          { key: "bo", i: g.i, price: cs[g.i].c, label: "Clôture sous le support", short: "Breakout", tone: "bear", side: "below", role: "close" },
          { key: "now", i: last, price: cs[last].h, label: "Retour au contact du FVG", short: "Retour", tone: "entry", side: "above", role: "high" },
        ],
      }]}
      caption="Deux raisons de réagir au même niveau : ancien support devenu résistance et FVG non mitigé."
    />
  );
}
