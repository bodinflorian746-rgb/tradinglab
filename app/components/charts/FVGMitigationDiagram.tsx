// ICT 2 — mitigation d'un FVG baissier (XAU/USD H1) : depuis 4 690 $, impulsion qui
// laisse un FVG ~4 652-4 665 $. Le prix descend jusqu'à 4 620 $, remonte progressivement
// vers 4 663 $ (rentre dans le FVG), bougie baissière de rejet, puis 4 610 $.
// FVG et pivots calculés. Bougies : scenarios.ts (« fvg-mitigation-xau »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import { largestFvg } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

export function FVGMitigationDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["fvg-mitigation-xau"];
  const fvg = largestFvg(cs, "bear")!;
  // Creux du repli initial (5 premières bougies après l'impulsion du FVG)
  const repli = cs.slice(fvg.i + 1, fvg.i + 6);
  const low1 = Math.min(...repli.map((k) => k.l));
  const low1At = fvg.i + 1 + repli.findIndex((k) => k.l === low1);
  // Pic dans la zone FVG : bougie avec le plus haut sommet après le creux
  const back = cs.reduce((best, k, i) =>
    i > low1At && k.h >= fvg.y1 && (best < 0 || cs[best].h < k.h) ? i : best, -1);
  const rej = back + 1;
  const end = Math.min(...cs.slice(rej + 1).map((k) => k.l));
  return (
    <LessonChart
      id="FVGMitigationDiagram"
      title="Le retour dans le FVG est l'entrée"
      caption="La mitigation a été le signal d'entrée, pas l'impulsion initiale, déjà passée."
      panels={[{
        key: "h1", title: "XAU/USD H1", decimals: 0, height: 290, candles: cs,
        zones: [{ key: "fvg", y1: fvg.y1, y2: fvg.y2, from: fvg.i - 1, label: `FVG ${usd(fvg.y1)}-${usd(fvg.y2)}`, short: "FVG", tone: "bear", kind: "fvg", src: `fvg-mitigation-xau:${fvg.i}` }],
        markers: [
          { key: "imp", i: fvg.i, price: cs[fvg.i].l, label: "Impulsion", tone: "bear", side: "below" },
          { key: "low", i: low1At, price: low1, label: usd(low1), tone: "neutral", side: "below" },
          { key: "back", i: back, price: cs[back].h, label: `Retour à ${usd(cs[back].h)}`, short: "Retour", tone: "zone", side: "above" },
          { key: "rej", i: rej, price: cs[rej].l, label: "Rejet", tone: "bear", side: "below" },
        ],
        chips: [{ label: `Puis ${usd(end)}`, tone: "bear" }],
      }]}
    />
  );
}
