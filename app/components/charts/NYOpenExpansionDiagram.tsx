// ICT 3 — NY Open : consolidation ~4 640 $ (5 bougies calmes), bougie explosive haussière
// à 4 668 $ (mèche de sweep), puis cascade baissière jusqu'à 4 610 $.
// Bougies : scenarios.ts (« ny-expansion »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";

export function NYOpenExpansionDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["ny-expansion"];
  const CALM_END = 4, EXP = 5;
  const calLow = Math.min(...cs.slice(0, CALM_END + 1).map((k) => k.l));
  const calHigh = Math.max(...cs.slice(0, CALM_END + 1).map((k) => k.h));
  const peak = Math.max(...cs.map((k) => k.h));
  const peakAt = cs.findIndex((k) => k.h === peak);
  const low = Math.min(...cs.map((k) => k.l));
  const lowAt = cs.findIndex((k) => k.l === low);
  const amplitude = Math.round(peak - low);
  return (
    <LessonChart
      id="NYOpenExpansionDiagram"
      title="L'ouverture New York : expansion en quelques bougies"
      caption="NY Open = superposition London + flux US. Amplitude souvent supérieure à la veille entière."
      panels={[{
        key: "m15", title: "XAU/USD M15", decimals: 0, height: 280, candles: cs,
        zones: [
          { key: "cons", y1: calLow, y2: calHigh, from: 0, to: CALM_END, label: "Consolidation calme", short: "Calme", tone: "neutral" },
        ],
        markers: [
          { key: "exp", i: EXP, price: cs[EXP].l, label: "NY Open : bougie explosive", short: "NY Open", tone: "bull", side: "below" },
          { key: "peak", i: peakAt, price: peak, label: `${usd(peak)} mèche sweep`, short: "Sweep", tone: "zone", side: "above" },
          { key: "low", i: lowAt, price: low, label: usd(low), tone: "bear", side: "below" },
        ],
        chips: [{ label: `Amplitude totale ${usd(amplitude)}`, tone: "zone" }],
      }]}
    />
  );
}
