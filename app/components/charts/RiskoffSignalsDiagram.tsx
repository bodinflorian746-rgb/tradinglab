// Macro-trading 3 bloc 1 — signaux concordants risk-off : XAU/USD Daily en structure
// HH/HL haussière (4 585→4 705 $) accompagnée des 4 signaux concordants du texte
// (indices ↓, VIX ↑, DXY ↑, or ↑). Bougies : scenarios.ts (« riskoff-daily »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { Cards } from "@/app/components/lessons/LessonSchema";
import { usd } from "@/app/components/lessons/trade";
import { pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

export function RiskoffSignalsDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["riskoff-daily"];
  const piv = pivots(cs, 3);
  const peak = Math.max(...cs.map((k) => k.h));
  const peakAt = cs.findIndex((k) => k.h === peak);
  const hls = piv.filter((q) => q.name === "HL");
  const hh2At = piv.filter((q) => q.name === "HH").at(-1)?.index ?? peakAt;
  return (
    <LessonChart
      id="RiskoffSignalsDiagram"
      title="Régime risk-off : 4 signaux concordants"
      caption="La concordance de 3-4 signaux macro confirme le régime. Un seul marché ne suffit pas."
      panels={[{
        key: "daily", title: "XAU/USD Daily — structure HH/HL en régime risk-off", decimals: 0, height: 240, candles: cs,
        markers: [
          { key: "peak", i: peakAt, price: peak, label: usd(peak), tone: "bull", side: "above" },
          ...(hls.slice(0, 2).map((hl, j) => ({ key: `hl${j}`, i: hl.index, price: hl.price, label: hl.name!, pivot: hl.name! as "HL", tone: "neutral" as const, side: "below" as const }))),
        ],
        chips: [{ label: "Structure HH / HL intacte = régime intact", tone: "bull" }],
      }]}
    >
      <div style={{ marginTop: 16 }}>
        <Cards cols={4} mobileCols={2} items={[
          { tag: "INDICES US", title: "Indices baissiers", text: "S&P 500 −3 %, pression vendeuse sur les actifs risqués.", tone: "bear" },
          { tag: "VIX", title: "Volatilité en hausse", text: "VIX passe de 14 à 22 : la peur monte.", tone: "zone" },
          { tag: "DXY", title: "Dollar fort", text: "DXY +1,5 % : les flux fuient vers le dollar.", tone: "sky" },
          { tag: "XAU/USD", title: "Or haussier", text: "Flux refuge, structure HH/HL établie.", tone: "bull" },
        ]} />
      </div>
    </LessonChart>
  );
}
