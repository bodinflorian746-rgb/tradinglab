// Macro-trading 3 bloc 3 — le risk-off s'essouffle progressivement (XAU/USD H4), exemple du
// texte : après une forte tendance depuis 4 590 $, trois sommets qui faiblissent (4 735,
// 4 720, 4 705 $) et des corrections de 25, 40 puis 65 $. Sommets et corrections calculés
// sur les pivots. Bougies : scenarios.ts (« riskoff-exhaust-h4 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import { pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

export function RiskoffExhaustionDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["riskoff-exhaust-h4"];
  const piv = pivots(cs, 2);
  const first = piv.findIndex((q) => q.name === "HH");
  const tops = piv.slice(first).filter((q) => q.side === "h");
  // creux de chaque correction : le plus bas entre un sommet et le suivant (ou la fin)
  const lows = tops.map((t, n) => {
    const to = n + 1 < tops.length ? tops[n + 1].index : cs.length;
    const seg = cs.slice(t.index, to), l = Math.min(...seg.map((k) => k.l));
    return { i: t.index + seg.findIndex((k) => k.l === l), price: l, depth: t.price - l };
  });
  return (
    <LessonChart
      id="RiskoffExhaustionDiagram"
      title="Sommets plus faibles, corrections plus profondes"
      caption="Le régime perd en force : on resserre les SL, on réduit la taille, avant la cassure structurelle."
      panels={[{
        key: "h4", title: "XAU/USD H4", decimals: 0, height: 290, candles: cs,
        markers: [
          ...tops.map((t, n) => ({ key: `t${n}`, i: t.index, price: t.price, label: `${t.name} ${usd(t.price)}`, short: t.name!, pivot: t.name!, tone: n ? "bear" as const : "bull" as const, side: "above" as const })),
          ...lows.map((l, n) => ({ key: `l${n}`, i: l.i, price: l.price, label: `Repli −${usd(l.depth)}`, tone: "bear" as const, side: "below" as const, role: "low" as const })),
        ],
      }]}
    />
  );
}
