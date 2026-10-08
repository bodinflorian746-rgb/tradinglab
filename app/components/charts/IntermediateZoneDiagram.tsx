// Multi-UT 1 bloc 3 — zone intermédiaire H1 : EUR/USD H1, prix qui remonte vers la zone
// de résistance 1.1765-1.1780 héritée du H4. L'H1 localise où agir.
// Bougies : scenarios.ts (« inter-zone-h1 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

export function IntermediateZoneDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["inter-zone-h1"];
  const peak = Math.max(...cs.map((k) => k.h));
  const peakAt = cs.findIndex((k) => k.h === peak);
  return (
    <LessonChart
      id="IntermediateZoneDiagram"
      title="H1 localise la zone : prix revient sur la résistance"
      caption="L'UT intermédiaire transforme le biais HTF en zone exploitable. L'H1 dit où, pas quand."
      panels={[{
        key: "h1", title: "EUR/USD H1", decimals: 5, height: 260, candles: cs,
        zones: [
          { key: "zone", y1: 1.1765, y2: 1.178, label: "Zone de résistance H1", short: "Zone H1", tone: "zone" },
        ],
        markers: [
          { key: "ret", i: peakAt, price: peak, label: `Retour à ${p(peak)}`, short: "Retour", tone: "zone", side: "above" },
        ],
        chips: [{ label: "Zone héritée du H4 : on attend le signal LTF", tone: "zone" }],
      }]}
    />
  );
}
