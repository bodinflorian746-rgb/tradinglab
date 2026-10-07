// Stratégie Reversal 2 — ligne de cou horizontale, ascendante, descendante :
// même méthode pour le TP (méthode standard). Hauteur = de la tête à la ligne
// de cou, mesurée à la verticale de la tête ; reportée sous le point de
// breakout de la ligne de cou. Tout est calculé sur les prix (XAU/USD,
// lib/lessons/line-data.ts et models.ts).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import { HS_CASES } from "@/lib/lessons/line-data";
import { headShouldersModel } from "@/lib/lessons/models";

const usd = (x: number) => fmtPrice(Math.round(x), 0, "$");

export default function HSNecklineSlopeDiagram({ className = "" }: { className?: string; locale?: "fr" | "es" | "en" }) {
  const panels: LCPanel[] = HS_CASES.map((c) => {
    const m = headShouldersModel(c.line);
    const last = c.line.length - 1;
    return {
      key: c.key, title: c.title, decimals: 0, height: 230,
      line: c.line,
      segments: [
        { key: "neck", i1: m.t1.index - 1, p1: m.neck(m.t1.index - 1), i2: last, p2: m.neck(last), tone: "neutral", dashed: true, label: "Ligne de cou" },
        { key: "height", i1: m.head.index, p1: m.head.price, i2: m.head.index, p2: m.neck(m.head.index), tone: "zone", arrow: true },
        { key: "proj", i1: m.bo.i, p1: m.bo.price, i2: m.bo.i, p2: m.tp, tone: "zone", arrow: true },
      ],
      levels: [{ key: "tp", price: m.tp, from: Math.floor(m.bo.i), label: `TP ${usd(m.tp)}`, tone: "bull", dashed: true }],
      markers: [
        { key: "head", i: m.head.index, price: m.head.price, label: "Tête", tone: "neutral", side: "above" },
        { key: "bo", i: m.bo.i, price: m.bo.price, label: `Breakout ${usd(m.bo.price)}`, short: "Breakout", tone: "zone", side: "above", dot: true },
      ],
      chips: [{ label: `Hauteur ${usd(m.height)}`, tone: "zone", data: { head: m.head.price, neck: m.neck(m.head.index), breakout: m.bo.price, tp: m.tp } }],
    };
  });
  return (
    <div className={className}>
      <LessonChart
        id="HSNecklineSlopeDiagram"
        title="Ligne de cou inclinée : même calcul du TP"
        panels={panels}
        sharedScale
        caption="Hauteur mesurée de la tête à la ligne de cou, à la verticale de la tête, puis reportée sous le point de breakout. XAU/USD, ETE de la leçon (tête 4 660$)."
      />
    </div>
  );
}
