// Trend-following 1 — identifier une tendance en 3 étapes sur EUR/USD H4 : 1. repérer
// les pivots ; 2. confirmer la succession (2 HL + 2 HH) ; 3. valider l'amplitude
// (dernier HH − premier HL : 140 pips, au-dessus du seuil de 30-50 pips). Pivots et
// amplitude calculés. Bougies : scenarios.ts (« trend-steps »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, pips, pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

export default function TrendIdentificationStepsDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["trend-steps"];
  const piv = pivots(cs, 2);
  const named = piv.filter((q) => q.name);
  const hls = named.filter((q) => q.name === "HL"), hhs = named.filter((q) => q.name === "HH");
  const amp = pips(hhs[hhs.length - 1].price, hls[0].price, 0.0001);
  return (
    <LessonChart
      id="TrendIdentificationStepsDiagram"
      title="Identifier une tendance en 3 étapes"
      panels={[{
        key: "h4", subtitle: "EUR/USD H4",
        decimals: 5, height: 300, candles: cs,
        segments: [{ key: "amp", i1: hhs[hhs.length - 1].index, p1: hls[0].price, i2: hhs[hhs.length - 1].index, p2: hhs[hhs.length - 1].price, tone: "fib", arrow: true }],
        levels: [{ key: "hl1", price: hls[0].price, from: hls[0].index, to: hhs[hhs.length - 1].index, label: `HL ${p(hls[0].price)}`, short: "1er HL", tone: "fib", dashed: true, faint: true }],
        markers: named.map((q) => ({ key: `p${q.index}`, i: q.index, price: q.price, label: `${q.name} ${p(q.price)}`, short: q.name, pivot: q.name, tone: q.side === "h" ? "neutral" as const : "sky" as const, side: q.side === "h" ? "above" as const : "below" as const })),
        chips: [
          { label: `1 · Pivots : ${named.length} sommets et creux repérés` },
          { label: `2 · Succession : ${hls.length} HL + ${hhs.length} HH`, tone: "bull" },
          { label: `3 · Amplitude : ${amp} pips (≥ 30-50)`, tone: "fib", data: { amplitude: amp } },
        ],
      }]}
    />
  );
}
