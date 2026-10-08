// Avancé 1 et SMC 4 — pools de liquidité (EUR/USD H1) : un range avec deux sommets au même
// niveau (equal highs 1.0900) et deux creux au même niveau (equal lows 1.0840). Les stops des
// vendeurs dorment au-dessus (liquidité buy-side), ceux des acheteurs en dessous (sell-side).
// Sommets et creux lus sur les bougies. Bougies : scenarios.ts (« liq-pools »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

export function LiquidityPoolsDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["liq-pools"];
  const hi = Math.max(...cs.map((k) => k.h)), lo = Math.min(...cs.map((k) => k.l));
  const tops = cs.map((k, i) => (k.h === hi ? i : -1)).filter((i) => i >= 0);
  const bots = cs.map((k, i) => (k.l === lo ? i : -1)).filter((i) => i >= 0);
  return (
    <LessonChart
      id="LiquidityPoolsDiagram"
      title="Où dorment les stops"
      caption="Les institutions visent ces zones : le prix va souvent chercher les stops avant le mouvement suivant."
      panels={[{
        key: "h1", title: "EUR/USD H1", decimals: 5, height: 280, candles: cs,
        zones: [
          { key: "bsl", y1: hi, y2: hi + 0.001, label: "Liquidité buy-side (stops des vendeurs)", short: "BSL", tone: "bull" },
          { key: "ssl", y1: lo - 0.001, y2: lo, label: "Liquidité sell-side (stops des acheteurs)", short: "SSL", tone: "bear" },
        ],
        markers: [
          ...tops.map((i, n) => ({ key: `t${n}`, i, price: hi, label: n ? `EQH ${p(hi)}` : "EQH", short: "EQH", tone: "zone" as const, side: "above" as const })),
          ...bots.map((i, n) => ({ key: `b${n}`, i, price: lo, label: n ? `EQL ${p(lo)}` : "EQL", short: "EQL", tone: "zone" as const, side: "below" as const })),
        ],
      }]}
    />
  );
}
