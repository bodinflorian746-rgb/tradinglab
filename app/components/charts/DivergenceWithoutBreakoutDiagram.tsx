// Reversal 3 — le piège de la divergence sans breakout. XAU/USD H1 : le prix
// fait un HH pendant que le RSI (14, calculé sur les clôtures) fait un sommet plus
// bas ; le creux structurel 4 570$ n'est jamais cassé et la tendance haussière
// continue (nouveau HH). Bougies : scenarios.ts (« divergence-no-break »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import { pivots, rsi } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

export default function DivergenceWithoutBreakoutDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const candles = CANDLES["divergence-no-break"];
  const r = rsi(candles.map((k) => k.c), 14);
  const piv = pivots(candles, 2);
  const hh = piv.filter((q) => q.side === "h" && q.name === "HH");
  const [t1, t2] = [hh[0], hh[1]];
  const trough = piv.filter((q) => q.side === "l" && q.index > t1.index && q.index < t2.index).reduce((a, b) => (b.price < a.price ? b : a));
  const last = candles.length - 1;
  return (
    <LessonChart
      id="DivergenceWithoutBreakoutDiagram"
      title="Divergence sans breakout : la tendance continue"
      panels={[{
        key: "h1", subtitle: "XAU/USD H1 — prix en HH, RSI en LH, creux structurel intact",
        decimals: 1, height: 360, candles,
        segments: [{ key: "div", i1: t1.index, p1: t1.price, i2: t2.index, p2: t2.price, tone: "bear", dashed: true }],
        levels: [{ key: "creux", price: trough.price, from: trough.index, label: `Creux ${usd(trough.price)} jamais cassé`, short: `Creux ${usd(trough.price)}`, tone: "bull", dashed: true }],
        markers: [
          ...[t1, t2].map((q) => ({ key: `hh${q.index}`, i: q.index, price: q.price, label: "HH", pivot: "HH" as const, tone: "neutral" as const, side: "above" as const })),
          { key: "suite", i: last, price: candles[last].h, label: "Nouveau HH", tone: "bull", side: "above" },
        ],
        rsi: { values: r, label: "RSI 14", marks: [{ i: t1.index, label: "Sommet 1", tone: "fib" }, { i: t2.index, label: "LH", tone: "bear" }] },
        chips: [
          { label: `RSI : ${Math.round(r[t1.index]!)} puis ${Math.round(r[t2.index]!)}`, tone: "bear", data: { rsi1: r[t1.index]!.toFixed(1), rsi2: r[t2.index]!.toFixed(1) } },
          { label: "Aucune clôture sous le creux : pas de retournement", tone: "bull" },
        ],
      }]}
      caption="La divergence signale un essoufflement du momentum. Sans breakout du dernier creux, la structure HH / HL reste valide."
    />
  );
}
