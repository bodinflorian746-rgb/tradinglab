// Support / résistance 1 bloc 3 et exercice — toujours une zone, pas une ligne (EUR/USD H4) :
// trois creux 1.1685, 1.1688 et 1.1690 ; tracé en ligne fine à 1.1690, les mèches semblent
// casser le niveau ; tracé en zone 1.1680-1.1695 (15 pips), les mèches sont absorbées.
// Mèches sous la ligne calculées. Bougies : scenarios.ts (« zone-line »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const LINE = 1.169, Z = { y1: 1.168, y2: 1.1695 };

export default function ZoneVsLineDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["zone-line"];
  const pierce = cs.map((k, i) => (k.l < LINE ? i : -1)).filter((i) => i >= 0);
  return (
    <LessonChart
      id="ZoneVsLineDiagram"
      title="Ligne fine ou zone ?"
      caption="Le tracé englobe corps et mèches : 10 à 20 pips sur EUR/USD, 10 à 20 $ sur XAU/USD."
      panels={[
        {
          key: "line", title: "✗ Ligne fine", decimals: 5, height: 220, candles: cs,
          subtitle: `${pierce.length} mèches sous la ligne : faux breakouts`,
          levels: [{ key: "l", price: LINE, label: `Ligne ${p(LINE)}`, short: "Ligne", tone: "bear" }],
          markers: pierce.map((i, n) => ({ key: `m${n}`, i, price: cs[i].l, label: "Breakout ?", short: "?", tone: "bear" as const, side: "below" as const })),
        },
        {
          key: "zone", title: "✓ Zone de 15 pips", decimals: 5, height: 220, candles: cs,
          subtitle: "Mèches naturelles absorbées",
          zones: [{ key: "z", ...Z, label: `Zone ${p(Z.y1)}-${p(Z.y2)}`, short: "Zone", tone: "bull" }],
        },
      ]}
      rows={[2]}
      sharedScale
    />
  );
}
