// OTE (Trend-following 3, Trading Avancé 5) : BOS haussier (breakout du sommet 1.0900),
// Fibonacci du swing low A (1.0780) au swing high B (1.0960), zone OTE 0.618-0.786
// calculée, repli dans la zone et bougie de rejet = entrée ; SL au-delà du 0.786 avec
// marge, objectif B. EUR/USD H1, bougies : scenarios.ts (« ote »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { tradeSetup } from "@/app/components/lessons/trade";
import { fibLevel, pivots, fmtPrice } from "@/lib/lessons/chart-analysis";
import { eurToXau, xauToEur } from "@/lib/lessons/eur-from-xau";
import CANDLES from "@/lib/lessons/generated/candles.json";

const px = (x: number) => fmtPrice(x, 4);

export function OTEDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["ote"];
  const piv = pivots(cs, 2);
  const h0 = piv.find((q) => q.side === "h")!;
  const A = piv.filter((q) => q.side === "l" && q.index > h0.index)[0];
  const B = piv.filter((q) => q.side === "h" && q.index > A.index).reduce((x, y) => (y.price > x.price ? y : x));
  const bos = cs.findIndex((k, i) => i > A.index && k.c > h0.price);
  const f618 = fibLevel(A.price, B.price, 0.618), f786 = fibLevel(A.price, B.price, 0.786);
  const last = cs.length - 1;
  const t = tradeSetup({ entry: cs[last].c, sl: xauToEur(Math.floor(eurToXau(f786)) - 8), tp: B.price, names: { tp: "Objectif B" }, from: last });
  return (
    <LessonChart
      id="OTEDiagram"
      title="La zone OTE : entre 61.8% et 78.6% du swing"
      panels={[{
        key: "h1", subtitle: `EUR/USD H1 — Fibonacci de A (${px(A.price)}) à B (${px(B.price)})`,
        decimals: 5, height: 320, candles: cs,
        // Animation : le sommet cassé, A, l'impulsion et le BOS jusqu'à B, le tracé Fibonacci, la zone OTE,
        // puis le repli dans la zone et le rejet ; le plan ensuite
        anim: [{ candles: A.index + 1 }, { show: "a" }, { candles: B.index + 1 }, { show: ["h0", "bos", "b"] }, { show: ["fib", "f618", "f786"] }, { show: "ote" }, { candles: last }, { show: "rej" }],
        zones: [{ key: "ote", y1: f786, y2: f618, from: B.index, label: `OTE ${px(f786)}-${px(f618)}`, short: "OTE", tone: "fib", kind: "fib", role: "confluence", ref: "f618,f786" }],
        levels: [
          { key: "h0", price: h0.price, from: h0.index, to: bos, label: `Sommet cassé ${px(h0.price)}`, short: "Sommet cassé", tone: "neutral", dashed: true, faint: true, role: "bos", ref: h0.index, dir: "bull" },
          { key: "f618", price: f618, from: B.index, tone: "fib", faint: true, role: "fib", ref: `${A.index}:${B.index}:0.618` },
          { key: "f786", price: f786, from: B.index, tone: "fib", faint: true, role: "fib", ref: `${A.index}:${B.index}:0.786` },
          ...t.levels,
        ],
        segments: [{ key: "fib", i1: A.index, p1: A.price, i2: B.index, p2: B.price, tone: "fib", dashed: true }],
        markers: [
          { key: "a", i: A.index, price: A.price, label: "A : swing low (100 %)", short: "A · 100 %", tone: "fib", side: "below", role: "swing-low" },
          { key: "b", i: B.index, price: B.price, label: "B : swing high (0 %)", short: "B · 0 %", tone: "fib", side: "above", role: "swing-high" },
          { key: "bos", i: bos, price: cs[bos].c, label: "BOS : clôture au-dessus", short: "BOS", tone: "bull", side: "above" },
          { key: "rej", i: last, price: cs[last].l, label: "Rejet dans l'OTE", short: "Rejet", tone: "bull", side: "below", role: "rejet", ref: "ote", dir: "bull" },
        ],
        chips: t.chips,
      }]}
      caption="L'OTE est une zone de timing : l'entrée se prend sur le signal de rejet dans la zone, pas au simple contact."
    />
  );
}
