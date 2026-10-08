// Multi-UT 1 bloc 3 — l'UT supérieure donne le biais (process, étape 1) : EUR/USD H4 en
// LH/LL, résistance importante à 1.1780 (ancien support cassé, dernier LH), prix actuel
// 1.1725 : priorité aux ventes. Pivots calculés. Bougies : scenarios.ts (« htf-bear-h4 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const RES = 1.178;

export function HTFBiasDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["htf-bear-h4"];
  const named = pivots(cs, 2).filter((q) => q.name === "LH" || q.name === "LL");
  const last = cs.length - 1;
  return (
    <LessonChart
      id="HTFBiasDiagram"
      title="Le biais se lit sur l'UT supérieure"
      caption="Structure LH/LL : biais baissier, priorité aux ventes, aucun achat agressif."
      panels={[{
        key: "h4", title: "EUR/USD H4", decimals: 5, height: 280, candles: cs,
        levels: [{ key: "res", price: RES, label: `Résistance ${p(RES)}`, short: "Résistance", tone: "zone" }],
        markers: [
          ...named.map((q) => ({ key: `p${q.index}`, i: q.index, price: q.price, label: q.name!, pivot: q.name!, tone: "bear" as const, side: q.side === "h" ? "above" as const : "below" as const })),
          { key: "now", i: last, price: cs[last].c, label: `Prix actuel ${p(cs[last].c)}`, short: p(cs[last].c), tone: "entry", side: "below" },
        ],
        chips: [{ label: "Biais baissier : priorité aux ventes", tone: "bear" }],
      }]}
    />
  );
}
