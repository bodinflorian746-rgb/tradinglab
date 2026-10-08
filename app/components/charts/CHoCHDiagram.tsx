// Intermédiaire 1, SMC 2, Trend-following 4 — le CHoCH (EUR/USD H4, exemple d'Intermédiaire 1) :
// tendance haussière, HH 1.0950, recul, puis clôture sous le dernier HL 1.0880 : première fissure,
// une alerte ; le retournement se confirme par un BOS baissier. Pivots calculés.
// Bougies : scenarios.ts (« choch-eur »). Version haussière seule (prop trend gardée).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

export function CHoCHDiagram(_props: { trend?: "bullish" | "bearish"; className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["choch-eur"];
  const piv = pivots(cs, 2);
  const hh = piv.filter((q) => q.name === "HH").at(-1)!;
  const hl = piv.filter((q) => q.name === "HL" && q.index < hh.index).at(-1)!;
  const named = piv.filter((q) => (q.name === "HH" || q.name === "HL") && q.index <= hh.index);
  const choch = cs.findIndex((k, i) => i > hh.index && k.c < hl.price);
  return (
    <LessonChart
      id="CHoCHDiagram"
      title="CHoCH : la tendance craque"
      caption="Un CHoCH seul est une alerte : on n'achète plus, on attend un BOS baissier pour confirmer le retournement."
      panels={[{
        key: "h4", title: "EUR/USD H4, tendance haussière", decimals: 5, height: 260, candles: cs,
        levels: [{ key: "hl", price: hl.price, from: hl.index, label: `Dernier HL ${p(hl.price)}`, short: "Dernier HL", tone: "zone", dashed: true }],
        markers: [
          ...named.map((q) => ({ key: `p${q.index}`, i: q.index, price: q.price, label: q.name!, pivot: q.name!, tone: "bull" as const, side: q.side === "h" ? "above" as const : "below" as const })),
          { key: "choch", i: choch, price: cs[choch].c, label: "CHoCH : clôture sous le HL", short: "CHoCH", tone: "bear", side: "below", role: "choch", ref: hl.index, dir: "bear" },
        ],
      }]}
    />
  );
}
