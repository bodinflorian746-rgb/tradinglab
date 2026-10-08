// Reversal 3 bloc 2 — divergence baissière (XAU/USD H1), exemple du texte : premier sommet
// 4 600 $ (RSI 75), creux 4 570 $, nouveau sommet 4 640 $ (HH) alors que le RSI ne monte qu'à 68
// (LH). RSI 14 calculé sur les clôtures. Bougies : scenarios.ts (« rsi-div »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import { pivots, rsi } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

export default function RSIDivergenceDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["rsi-div"];
  const r = rsi(cs.map((k) => k.c), 14);
  const piv = pivots(cs, 2);
  const [t1, t2] = piv.filter((q) => q.side === "h").slice(-2);
  const low = piv.find((q) => q.side === "l" && q.index > t1.index && q.index < t2.index)!;
  const v1 = Math.round(r[t1.index]!), v2 = Math.round(r[t2.index]!);
  return (
    <LessonChart
      id="RSIDivergenceDiagram"
      title="Le prix monte, le RSI baisse"
      caption="Divergence baissière : la tendance continue visuellement mais perd de la force. Ce n'est pas encore un retournement."
      panels={[{
        key: "h1", title: "XAU/USD H1", decimals: 0, height: 300, candles: cs,
        segments: [{ key: "div", i1: t1.index, p1: t1.price, i2: t2.index, p2: t2.price, tone: "bear", dashed: true }],
        markers: [
          { key: "t1", i: t1.index, price: t1.price, label: `Sommet ${usd(t1.price)}`, short: "Sommet", tone: "neutral", side: "above", role: "swing-high" },
          { key: "low", i: low.index, price: low.price, label: `Creux ${usd(low.price)}`, short: "Creux", tone: "neutral", side: "below", role: "swing-low" },
          { key: "t2", i: t2.index, price: t2.price, label: `HH ${usd(t2.price)}`, pivot: "HH", tone: "bull", side: "above" },
        ],
        rsi: { values: r, label: "RSI 14", marks: [{ i: t1.index, label: `RSI ${v1}`, tone: "fib" }, { i: t2.index, label: `RSI ${v2} (LH)`, tone: "bear" }] },
      }]}
    />
  );
}
