// Multi-UT 2 bloc 3 et plan — l'UT supérieure sert à filtrer (EUR/USD H4) : résistance
// Daily/H4 1.1760, zone 1.1750-1.1760 rejetée à plusieurs reprises, prix actuel 1.1715.
// Recherché : un retour vers 1.1760, un rejet, une continuation baissière. Évité : un achat
// impulsif sous la résistance. Bougies : scenarios.ts (« htf-filter-h4 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { Cards } from "@/app/components/lessons/LessonSchema";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const Z = { y1: 1.175, y2: 1.176 };

export function HTFFilterDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["htf-filter-h4"];
  // rejets : bougies baissières dont la mèche entre dans la zone après le premier passage dessous
  const first = cs.findIndex((k) => k.c < Z.y1);
  const rejects = cs.map((k, i) => (i > first && k.h >= Z.y1 && k.c < k.o ? i : -1)).filter((i) => i >= 0);
  const last = cs.length - 1;
  return (
    <LessonChart
      id="HTFFilterDiagram"
      title="Filtrer avant de chercher une entrée"
      caption="Le trader ne cherche pas « un trade » : il cherche un trade aligné avec la direction dominante."
      panels={[{
        key: "h4", title: "EUR/USD H4, Daily baissier", decimals: 5, height: 260, candles: cs,
        zones: [{ key: "zone", ...Z, label: `Zone ${p(Z.y1)}-${p(Z.y2)}`, short: "Zone H4", tone: "zone" }],
        markers: [
          ...rejects.map((i, n) => ({ key: `r${n}`, i, price: cs[i].h, label: "Rejet", tone: "bear" as const, side: "above" as const })),
          { key: "now", i: last, price: cs[last].l, label: `Prix ${p(cs[last].c)}`, short: p(cs[last].c), tone: "entry", side: "below" },
        ],
      }]}
    >
      <div style={{ marginTop: 16 }}>
        <Cards cols={2} items={[
          { tag: "RECHERCHÉ", title: `Retour vers ${p(1.176)}`, text: "Un rejet local, puis une continuation baissière.", tone: "bull" },
          { tag: "ÉVITÉ", title: "Achat impulsif", text: "Acheter directement sous la résistance de l'UT supérieure.", tone: "bear" },
        ]} />
      </div>
    </LessonChart>
  );
}
