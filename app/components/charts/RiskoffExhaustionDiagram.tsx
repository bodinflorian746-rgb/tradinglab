// Macro-trading 3 bloc 3 — essoufflement du régime risk-off (XAU/USD H4) : tendance
// haussière forte depuis 4 590 $, puis 3 sommets faiblissants (HH→LH→LH) et corrections
// de plus en plus profondes. Bougies : scenarios.ts (« riskoff-exhaust-h4 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import { pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

export function RiskoffExhaustionDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["riskoff-exhaust-h4"];
  const piv = pivots(cs, 2);
  const highs = piv.filter((q) => q.side === "h");
  const lows = piv.filter((q) => q.side === "l");
  const hh = highs[0];
  const lh1 = highs.find((q) => q.name === "LH");
  const lh2 = highs.filter((q) => q.name === "LH").at(-1);
  return (
    <LessonChart
      id="RiskoffExhaustionDiagram"
      title="L'essoufflement se lit progressivement"
      caption="Sommets plus faibles + corrections plus profondes + VIX qui redescend = signal d'essoufflement. On réduit AVANT la cassure structurelle."
      panels={[{
        key: "h4", title: "XAU/USD H4 — régime risk-off qui s'essouffle", decimals: 0, height: 280, candles: cs,
        markers: [
          ...(hh ? [{ key: "hh", i: hh.index, price: hh.price, label: `HH ${usd(hh.price)}`, pivot: "HH" as const, tone: "bull" as const, side: "above" as const }] : []),
          ...(lh1 && lh1 !== lh2 ? [{ key: "lh1", i: lh1.index, price: lh1.price, label: `LH ${usd(lh1.price)}`, pivot: "LH" as const, tone: "zone" as const, side: "above" as const }] : []),
          ...(lh2 ? [{ key: "lh2", i: lh2.index, price: lh2.price, label: `LH ${usd(lh2.price)}`, pivot: "LH" as const, tone: "bear" as const, side: "above" as const }] : []),
        ],
        chips: [
          { label: "Sommets : HH → LH → LH (faiblissants)", tone: "zone" },
          { label: "Corrections croissantes : signal d'alerte", tone: "bear" },
        ],
      }]}
    />
  );
}
