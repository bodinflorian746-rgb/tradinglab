// Trend-following 1 bloc 3 — qualifier la force (EUR/USD H4) : même nombre de bougies, même
// échelle de prix, swings d'environ 50, 100 et 200 pips : la pente se lit d'elle-même (faible,
// modérée, forte). Amplitudes calculées sur les pivots. Bougies : scenarios.ts (« str-… »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { pivots, pips, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

function panel(key: "str-weak" | "str-mid" | "str-strong", title: string, verdict: string): LCPanel {
  const cs = CANDLES[key] as Candle[];
  const piv = pivots(cs, 2);
  const hl = piv.find((q) => q.name === "HL")!, hh = piv.find((q) => q.name === "HH" && q.index > hl.index)!;
  return {
    key, title, decimals: 5, height: 200, candles: cs,
    subtitle: `Swing de ${Math.round(pips(hh.price, hl.price, 0.0001))} pips · ${verdict}`,
  };
}

export default function TrendStrengthGradationDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonChart
      id="TrendStrengthGradationDiagram"
      title="Faible, modérée, forte"
      caption="L'amplitude des swings et la pente conditionnent le R/R structurel. Pullback exploitable : 30 à 60 % de l'impulsion."
      panels={[
        panel("str-weak", "Tendance faible", "peu exploitable"),
        panel("str-mid", "Tendance modérée", "exploitable avec discipline"),
        panel("str-strong", "Tendance forte", "setup à privilégier"),
      ]}
      rows={[3]}
      sharedScale
    />
  );
}
