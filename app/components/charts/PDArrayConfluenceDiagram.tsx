// ICT 2 — confluence à 1.1780, EUR/USD H1 : ancien support H1 tenu puis cassé,
// FVG bearish laissé par l'impulsion de breakout (il contient 1.1780), sweep récent
// juste au-dessus quand le prix revient tester la zone, puis rejet.
// Bougies : scenarios.ts (« pd-confluence ») ; FVG calculé.

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, largestFvg } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const SUPPORT = 1.1780;
const p = (x: number) => fmtPrice(x, 4);

export function PDArrayConfluenceDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["pd-confluence"];
  const g = largestFvg(cs, "bear")!;
  const bo = g.i;
  const sweep = cs.reduce((b, k, i) => (i > bo + 2 && k.h > (cs[b]?.h ?? 0) ? i : b), bo + 2);
  return (
    <LessonChart
      id="PDArrayConfluenceDiagram"
      title="Trois éléments au même prix : 1.1780"
      panels={[{
        key: "h1", subtitle: "EUR/USD H1 — ancien support cassé, FVG bearish, sweep au-dessus",
        decimals: 5, height: 300, candles: cs,
        zones: [{ key: "fvg", y1: g.y1, y2: g.y2, from: bo - 1, label: `FVG bearish ${p(g.y1)}-${p(g.y2)}`, short: "FVG bearish", tone: "bear", kind: "fvg", src: `pd-confluence:${bo}` }],
        levels: [{ key: "support", price: SUPPORT, to: bo, label: "Ancien support 1.1780", short: "Ancien support", tone: "bull", dashed: true }],
        markers: [
          { key: "bo", i: bo, price: cs[bo].l, label: "Breakout du support", short: "Breakout", tone: "bear", side: "below" },
          { key: "sweep", i: sweep, price: cs[sweep].h, label: `Sweep ${p(cs[sweep].h)}`, short: "Sweep", tone: "zone", side: "above" },
        ],
      }]}
      caption="Une zone seule = setup correct ; ancien support cassé + FVG + sweep au même prix = setup premium."
    />
  );
}
