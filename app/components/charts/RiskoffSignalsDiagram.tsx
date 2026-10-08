// Macro-trading 3 bloc 1 — le risk-off se confirme par des signaux concordants, exemple du
// texte sur une semaine : S&P 500 −3 %, VIX de 14 à 22, DXY +1,5 %, et XAU/USD de 4 585 $ à
// 4 705 $ en structure haussière (H4). Pivots calculés. Bougies : scenarios.ts (« riskoff-daily »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { Cards } from "@/app/components/lessons/LessonSchema";
import { usd } from "@/app/components/lessons/trade";
import { pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

export function RiskoffSignalsDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["riskoff-daily"];
  const piv = pivots(cs, 2);
  const start = cs[0].l, end = Math.max(...cs.map((k) => k.h));
  const named = piv.filter((q) => q.name === "HH" || q.name === "HL");
  return (
    <LessonChart
      id="RiskoffSignalsDiagram"
      title="Quatre marchés racontent la même histoire"
      caption="Sans concordance, on ne parle pas encore de régime, juste d'un mouvement."
      panels={[{
        key: "h4", title: "XAU/USD H4, une semaine de tensions", decimals: 0, height: 240, candles: cs,
        markers: [
          { key: "start", i: 0, price: start, label: usd(start), tone: "neutral", side: "below" },
          ...named.map((q) => ({ key: `p${q.index}`, i: q.index, price: q.price, label: q.name!, pivot: q.name!, tone: "bull" as const, side: q.side === "h" ? "above" as const : "below" as const })),
          { key: "end", i: cs.length - 1, price: end, label: usd(end), tone: "bull", side: "above" },
        ],
        chips: [{ label: `Or : ${usd(start)} → ${usd(end)}, structure HH / HL`, tone: "bull" }],
      }]}
    >
      <div style={{ marginTop: 16 }}>
        <Cards cols={4} mobileCols={2} items={[
          { tag: "S&P 500 ↓", title: "Indices baissiers", text: "−3 % sur la semaine.", tone: "bear" },
          { tag: "VIX ↑", title: "Volatilité en hausse", text: "De 14 à 22.", tone: "zone" },
          { tag: "DXY ↑", title: "Dollar fort", text: "+1,5 % face aux devises plus risquées.", tone: "sky" },
          { tag: "XAU/USD ↑", title: "L'or attire les flux", text: "Actif directionnel à privilégier, à l'achat.", tone: "bull" },
        ]} />
      </div>
    </LessonChart>
  );
}
