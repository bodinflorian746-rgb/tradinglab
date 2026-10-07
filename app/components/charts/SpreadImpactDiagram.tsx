// Trading Débutant 4 — l'impact du spread : achat EUR/USD à l'Ask 1,0805 ; tant que
// le Bid n'a pas dépassé 1,0805, la position est dans le rouge (5 points à rattraper).
// Schéma en ligne (le Bid au fil du temps), équilibre calculé.

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { crossing } from "@/lib/lessons/chart-analysis";

const ASK = 1.0805;
const BID = [1.0800, 1.0801, 1.0799, 1.0802, 1.0801, 1.0803, 1.0804, 1.0803, 1.0806, 1.0808, 1.0807, 1.0810];
const fr = (x: number) => x.toFixed(4).replace(".", ",");

export function SpreadImpactDiagram() {
  const even = crossing(BID, () => ASK, 0, "up")!;
  return (
    <LessonChart
      id="SpreadImpactDiagram"
      title="Tu commences chaque trade dans le rouge"
      panels={[{
        key: "eurusd", subtitle: "EUR/USD — achat à l'Ask, sortie possible au Bid",
        decimals: 4, height: 230, line: BID,
        zones: [{ key: "rouge", y1: BID[0], y2: ASK, to: Math.ceil(even.i), label: "Dans le rouge", tone: "bear", kind: "zone" }],
        levels: [{ key: "ask", price: ASK, label: `Ton achat (Ask) ${fr(ASK)}`, short: `Ask ${fr(ASK)}`, tone: "entry", dashed: true }],
        markers: [
          { key: "start", i: 0, price: BID[0], label: `Bid ${fr(BID[0])}`, tone: "neutral", side: "below", dot: true },
          { key: "even", i: even.i, price: ASK, label: "Équilibre", tone: "bull", side: "above", dot: true },
        ],
        chips: [{ label: `Le Bid doit monter de ${Math.round((ASK - BID[0]) / 0.0001)} points avant le premier gain`, tone: "zone" }],
      }]}
    />
  );
}
