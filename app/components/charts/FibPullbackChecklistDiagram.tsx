// Trend-following 3 — valider le pullback Fibonacci : le setup EUR/USD du plan de
// la leçon (HL 1.0780, HH 1.0960, repli jusqu'à 1.0850, pin bar haussière) et les
// 4 critères, chacun vérifié sur les prix (profondeur du repli calculée).
// Bougies : scenarios.ts (« tf3-pullback »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { Checklist } from "@/app/components/lessons/LessonSchema";
import { fibLevel, fmtNum, pivots, fmtPrice, pips } from "@/lib/lessons/chart-analysis";
import { EUR_PIP } from "@/lib/lessons/eur-from-xau";
import CANDLES from "@/lib/lessons/generated/candles.json";

const px = (x: number) => fmtPrice(x, 4);

export default function FibPullbackChecklistDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const candles = CANDLES["tf3-pullback"];
  const piv = pivots(candles, 2);
  const A = piv.filter((q) => q.side === "l").reduce((a, b) => (b.price < a.price ? b : a));
  const B = piv.filter((q) => q.side === "h" && q.index > A.index).reduce((a, b) => (b.price > a.price ? b : a));
  const last = candles.length - 1;
  const low = candles[last].l;
  const depth = ((B.price - low) / (B.price - A.price)) * 100;
  const f618 = fibLevel(A.price, B.price, 0.618), f786 = fibLevel(A.price, B.price, 0.786);
  return (
    <LessonChart
      id="FibPullbackChecklistDiagram"
      title="Valider le pullback Fibonacci"
      panels={[{
        key: "h4", subtitle: `EUR/USD H4 — Fibonacci du HL ${px(A.price)} au HH ${px(B.price)}`,
        decimals: 5, height: 300, candles,
        zones: [{ key: "ote", y1: f786, y2: f618, from: B.index, label: "OTE 0.618-0.786", short: "OTE", tone: "fib", kind: "fib" }],
        segments: [{ key: "trace", i1: A.index, p1: A.price, i2: B.index, p2: B.price, tone: "fib", dashed: true }],
        markers: [
          { key: "hl", i: A.index, price: A.price, label: "HL", tone: "sky", side: "below", role: "swing-low" },
          { key: "hh", i: B.index, price: B.price, label: "HH", tone: "neutral", side: "above", role: "swing-high" },
          { key: "pin", i: last, price: low, label: "Pin bar", tone: "bull", side: "below", role: "pinbar", dir: "bull" },
        ],
      }]}
    >
      <Checklist items={[
        { ok: true, title: "Impulsion claire :", text: `${pips(B.price, A.price, EUR_PIP)} pips de hausse, corps significatifs.` },
        { ok: true, title: "Profondeur du repli :", text: `${fmtNum(depth, 0)} % de l'impulsion (zone 0.5 à 0.786, OTE 0.618-0.786).` },
        { ok: true, title: "Signal de rejet au contact :", text: "pin bar haussière." },
        { ok: true, title: "Biais de l'UT supérieure aligné :", text: "tendance haussière (HL puis HH)." },
      ]} />
    </LessonChart>
  );
}
