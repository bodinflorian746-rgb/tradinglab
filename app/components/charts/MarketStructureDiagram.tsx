// Structure de marché (SMC 1, Trading Intermédiaire 1) : tendance haussière HH / HL et
// baissière LH / LL, EUR/USD H4, swings de 50 pips et plus. Chaque étiquette est posée
// sur un vrai sommet / creux, nommée par comparaison au précédent (calculé).
// Bougies : scenarios.ts (« structure-bull / -bear »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

function panel(trend: "bullish" | "bearish"): LCPanel {
  const cs = CANDLES[trend === "bullish" ? "structure-bull" : "structure-bear"];
  const piv = pivots(cs, 2).filter((q) => q.name);
  return {
    key: trend, title: trend === "bullish" ? "Tendance haussière ↗" : "Tendance baissière ↘",
    subtitle: trend === "bullish" ? "Chaque sommet et chaque creux plus haut que le précédent" : "Chaque sommet et chaque creux plus bas que le précédent",
    decimals: 5, height: 240, candles: cs,
    segments: piv.slice(1).map((q, k) => ({ key: `s${k}`, i1: piv[k].index, p1: piv[k].price, i2: q.index, p2: q.price, tone: trend === "bullish" ? "bull" as const : "bear" as const, dashed: true })),
    markers: piv.map((q) => ({ key: `p${q.index}`, i: q.index, price: q.price, label: q.name!, pivot: q.name, tone: q.side === "h" ? "neutral" as const : "sky" as const, side: q.side === "h" ? "above" as const : "below" as const })),
  };
}

export function MarketStructureDiagram({ trend }: { trend?: "bullish" | "bearish"; className?: string; locale?: "fr" | "es" | "en" }) {
  const panels = trend ? [panel(trend)] : [panel("bullish"), panel("bearish")];
  return (
    <LessonChart
      id="MarketStructureDiagram"
      title={trend ? undefined : "Lire la structure : HH / HL ou LH / LL"}
      panels={panels}
      rows={[panels.length]}
    />
  );
}
