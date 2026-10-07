// Support-résistance 4 — vrai vs faux breakout de la résistance 4 650$ (XAU/USD H1),
// même approche du niveau : vrai = clôture 4 680$ au-dessus et follow-through ;
// faux = mèche à 4 685$, clôture 4 620$ revenue sous le niveau, retournement.
// Bougies : scenarios.ts (« breakout-real / -fake »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";

const LEVEL = 4650;

function panel(key: "breakout-real" | "breakout-fake"): LCPanel {
  const cs = CANDLES[key];
  const real = key === "breakout-real";
  const b = cs.findIndex((k) => k.h > LEVEL + 10);
  const k = cs[b];
  return {
    key, title: real ? "✓ Vrai breakout" : "✗ Faux breakout",
    subtitle: real ? `Clôture ${usd(k.c)} au-dessus du niveau, puis follow-through` : `Mèche ${usd(k.h)}, clôture ${usd(k.c)} sous le niveau, retournement`,
    decimals: 1, height: 260, candles: cs,
    levels: [{ key: "res", price: LEVEL, label: `Résistance ${usd(LEVEL)}`, short: "Résistance", tone: "bear", dashed: true }],
    markers: [{ key: "b", i: b, price: real ? k.l : k.h, label: real ? "Clôture au-dessus" : "Mèche seule", tone: real ? "bull" : "bear", side: real ? "below" : "above" }],
  };
}

export default function FakeVsRealBreakoutComparisonDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonChart
      id="FakeVsRealBreakoutComparisonDiagram"
      title="Vrai vs faux breakout"
      panels={[panel("breakout-real"), panel("breakout-fake")]}
      rows={[2]}
      sharedScale
      caption="Critère : clôture nette au-delà du niveau et follow-through sur 3-5 bougies. Une mèche qui dépasse puis une clôture revenue sous le niveau = faux breakout."
    />
  );
}
