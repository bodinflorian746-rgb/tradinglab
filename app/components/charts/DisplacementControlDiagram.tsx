// ICT 4 bloc 2 — contraste consolidation vs displacement (XAU/USD M15) : à gauche
// les 5 bougies calmes de la consolidation, à droite le sweep à 4 668 $ et la cascade
// jusqu'à 4 610 $. Mêmes bougies issues de « ny-expansion » ; deux vues.
// Bougies : scenarios.ts (« ny-expansion »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import type { Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

export function DisplacementControlDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const full = CANDLES["ny-expansion"] as Candle[];
  const calm = full.slice(0, 5);
  const peak = Math.max(...full.map((k) => k.h));
  const peakAt = full.findIndex((k) => k.h === peak);
  const low = Math.min(...full.map((k) => k.l));
  const lowAt = full.findIndex((k) => k.l === low);
  const calLow = Math.min(...calm.map((k) => k.l));
  const calHigh = Math.max(...calm.map((k) => k.h));
  return (
    <LessonChart
      id="DisplacementControlDiagram"
      title="Consolidation vs displacement"
      caption="Un displacement n'est pas une seule grande bougie, c'est une séquence orientée qui casse une structure."
      panels={[
        {
          key: "calm", title: "Consolidation calme : pas de direction", decimals: 0, height: 240, candles: calm,
          zones: [{ key: "range", y1: calLow, y2: calHigh, label: `Range ${usd(calHigh - calLow)}`, short: "Range", tone: "neutral" }],
          chips: [{ label: "Bougies plates, marché équilibré", tone: "neutral" }],
        },
        {
          key: "disp", title: "Displacement bearish : prise de contrôle", decimals: 0, height: 240, candles: full,
          markers: [
            { key: "sweep", i: peakAt, price: peak, label: `Sweep ${usd(peak)}`, short: "Sweep", tone: "zone", side: "above" },
            { key: "low", i: lowAt, price: low, label: usd(low), tone: "bear", side: "below" },
          ],
          chips: [{ label: `${usd(peak - low)} en ${full.length - 5} bougies`, tone: "bear" }],
        },
      ]}
      rows={[1, 1]}
      sharedScale
    />
  );
}
