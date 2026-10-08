// Intermédiaire 4 et Trend-following 1 bloc 1 — les 3 états du marché (EUR/USD H4) :
// tendance haussière en escalier (HL 1.1700 et 1.1730, HH 1.1780 et 1.1810, structure du plan de
// TF 1), tendance baissière en escalier (LH / LL), range entre deux niveaux horizontaux.
// Pivots calculés. Bougies : scenarios.ts (« trend-up », « trend-down », « trend-range »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { fmtPrice, pivots, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

function trend(key: "trend-up" | "trend-down", title: string, subtitle: string): LCPanel {
  const cs = CANDLES[key] as Candle[];
  const named = pivots(cs, 2).filter((q) => q.name);
  const up = key === "trend-up";
  return {
    key, title, subtitle, decimals: 5, height: 200, candles: cs,
    markers: named.map((q) => ({ key: `p${q.index}`, i: q.index, price: q.price, label: q.name!, pivot: q.name!, tone: up ? "bull" as const : "bear" as const, side: q.side === "h" ? "above" as const : "below" as const })),
  };
}

export function TrendDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const r = CANDLES["trend-range"] as Candle[];
  return (
    <LessonChart
      id="TrendDiagram"
      title="Les 3 états du marché"
      caption="Haussier : achats sur les corrections. Baissier : ventes sur les rebonds. Range : pas de trade directionnel."
      panels={[
        trend("trend-up", "Tendance haussière", "HH / HL : achats sur pullback"),
        trend("trend-down", "Tendance baissière", "LH / LL : ventes sur pullback"),
        {
          key: "range", title: "Range", subtitle: "Ni acheteurs ni vendeurs ne gagnent", decimals: 5, height: 200, candles: r,
          levels: [
            { key: "top", price: 1.178, label: `Haut du range ${p(1.178)}`, short: "Haut", tone: "zone", dashed: true, role: "range-high" },
            { key: "bot", price: 1.17, label: `Bas du range ${p(1.17)}`, short: "Bas", tone: "zone", dashed: true, role: "range-low" },
          ],
        },
      ]}
      rows={[1, 1, 1]}
    />
  );
}
