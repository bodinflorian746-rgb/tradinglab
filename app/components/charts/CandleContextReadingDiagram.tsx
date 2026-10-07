// Price action 1 — le contexte change la lecture. La MÊME bougie verte (petit corps,
// mèche haute ; identique au prix près dans les trois panneaux, même échelle) au
// sommet d'une impulsion, au milieu d'une chute, dans un range.
// Bougies : scenarios.ts (« ctx-top / -drop / -range », SAME_CANDLE).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import CANDLES from "@/lib/lessons/generated/candles.json";

const CASES = [
  { key: "ctx-top", i: 9, title: "Au sommet d'une impulsion", read: "Essoufflement : retournement potentiel", tone: "zone" },
  { key: "ctx-drop", i: 5, title: "Au milieu d'une chute", read: "Bruit : continuation baissière probable", tone: "bear" },
  { key: "ctx-range", i: 6, title: "Dans un range", read: "Pas de signal : oscillation normale", tone: "neutral" },
] as const;

export default function CandleContextReadingDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const panels: LCPanel[] = CASES.map((c) => {
    const cs = CANDLES[c.key];
    return {
      key: c.key, title: c.title, decimals: 2, height: 220, candles: cs,
      markers: [{ key: "same", i: c.i, price: cs[c.i].h, label: "Même bougie", tone: "entry", side: "above" }],
      chips: [{ label: c.read, tone: c.tone }],
    };
  });
  return (
    <LessonChart
      id="CandleContextReadingDiagram"
      title="Même bougie, trois lectures"
      panels={panels}
      rows={[3]}
      sharedScale
      caption="La bougie ne devient un signal que reliée à un niveau structurel."
    />
  );
}
