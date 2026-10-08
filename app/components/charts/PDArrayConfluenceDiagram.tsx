// ICT 2 — confluence à 1.1780, EUR/USD H1 : ancien support H1 tenu puis cassé,
// FVG bearish laissé par l'impulsion de breakout (il contient 1.1780), sweep récent
// juste au-dessus quand le prix revient tester la zone, puis rejet.
// Bougies : scenarios.ts (« pd-confluence ») ; FVG calculé.

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, largestFvg, pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const SUPPORT = 1.1780;
const p = (x: number) => fmtPrice(x, 4);

export function PDArrayConfluenceDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["pd-confluence"];
  const g = largestFvg(cs, "bear")!;
  const bo = g.i;
  const sweep = cs.reduce((b, k, i) => (i > bo + 2 && k.h > (cs[b]?.h ?? 0) ? i : b), bo + 2);
  // dernier creux posé sur le support avant la cassure
  const swing = pivots(cs, 2).filter((q) => q.side === "l" && q.index < bo).at(-1)!.index;
  return (
    <LessonChart
      id="PDArrayConfluenceDiagram"
      title="Trois éléments au même prix : 1.1780"
      panels={[{
        key: "h1", subtitle: "EUR/USD H1 — ancien support cassé, FVG bearish, sweep au-dessus",
        decimals: 5, height: 300, candles: cs,
        zones: [{ key: "fvg", y1: g.y1, y2: g.y2, from: bo - 1, label: `FVG bearish ${p(g.y1)}-${p(g.y2)}`, short: "FVG bearish", tone: "bear", kind: "fvg", src: `pd-confluence:${bo}`, role: "confluence", ref: "support" }],
        levels: [{ key: "support", price: SUPPORT, to: bo, label: `Ancien support ${p(SUPPORT)}`, short: "Ancien support", tone: "bull", dashed: true, role: "support" }],
        markers: [
          { key: "bo", i: bo, price: cs[bo].c, label: "Clôture sous le support", short: "Breakout", tone: "bear", side: "below", role: "bos", ref: swing, dir: "bear" },
          { key: "sweep", i: sweep, price: cs[sweep].h, label: `Sweep ${p(cs[sweep].h)}`, short: "Sweep", tone: "zone", side: "above", role: "sweep", ref: g.y2, dir: "bear" },
        ],
      }]}
      caption="Une zone seule = setup correct ; ancien support cassé + FVG + sweep au même prix = setup premium."
    />
  );
}
