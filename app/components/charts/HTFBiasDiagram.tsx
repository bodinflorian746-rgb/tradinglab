// Multi-UT 1 bloc 2 — biais HTF : EUR/USD H4 en structure LH/LL baissière, résistance
// 1.1780 rejetée deux fois. L'H4 dit « ventes prioritaires, pas d'achats ».
// Bougies : scenarios.ts (« htf-bear-h4 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const RES = 1.178;

export function HTFBiasDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["htf-bear-h4"];
  const piv = pivots(cs, 2);
  const lhs = piv.filter((q) => q.name === "LH");
  const lls = piv.filter((q) => q.name === "LL");
  return (
    <LessonChart
      id="HTFBiasDiagram"
      title="L'H4 donne le biais : LH/LL baissier"
      caption="L'UT supérieure filtre les trades avant même de chercher un setup. LH/LL → ventes prioritaires."
      panels={[{
        key: "h4", title: "EUR/USD H4", decimals: 5, height: 280, candles: cs,
        levels: [{ key: "res", price: RES, label: `Résistance ${p(RES)}`, short: "Résistance", tone: "zone", dashed: true }],
        markers: [
          ...lhs.slice(0, 2).map((q, i) => ({ key: `lh${i}`, i: q.index, price: q.price, label: "LH", pivot: "LH" as const, tone: "bear" as const, side: "above" as const })),
          ...lls.slice(0, 2).map((q, i) => ({ key: `ll${i}`, i: q.index, price: q.price, label: "LL", pivot: "LL" as const, tone: "bear" as const, side: "below" as const })),
        ],
        chips: [
          { label: "Structure LH / LL : biais baissier confirmé", tone: "bear" },
          { label: "Ventes prioritaires, achats contre le biais", tone: "neutral" },
        ],
      }]}
    />
  );
}
