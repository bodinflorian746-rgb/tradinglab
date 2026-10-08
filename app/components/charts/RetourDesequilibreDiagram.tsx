// Multi-UT 3 bloc 2 — le marché revient dans les zones fortes (XAU/USD H1), exemple du texte :
// impulsion baissière brutale depuis 4 680 $, FVG 4 648-4 660 $, remontée progressive, mèche
// qui traverse partiellement le FVG, puis rejet fort vers le bas. FVG calculé.
// Bougies : scenarios.ts (« retour-deseq-xau »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import { largestFvg } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

export function RetourDesequilibreDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["retour-deseq-xau"];
  const fvg = largestFvg(cs, "bear")!;
  const touch = cs.findIndex((k, i) => i > fvg.i + 2 && k.h >= fvg.y1 && k.c < k.o);
  return (
    <LessonChart
      id="RetourDesequilibreDiagram"
      title="Un retour n'est pas un retournement"
      caption="Le retour dans le déséquilibre a précédé la continuation baissière : c'est une mitigation."
      panels={[{
        key: "h1", title: "XAU/USD H1", decimals: 0, height: 280, candles: cs,
        zones: [{ key: "fvg", y1: fvg.y1, y2: fvg.y2, from: fvg.i - 1, label: `FVG ${usd(fvg.y1)}-${usd(fvg.y2)}`, short: "FVG", tone: "bear", kind: "fvg", src: `retour-deseq-xau:${fvg.i}` }],
        markers: [
          { key: "start", i: fvg.i - 1, price: cs[fvg.i - 1].h, label: `Impulsion depuis ${usd(cs[fvg.i - 1].h)}`, short: usd(cs[fvg.i - 1].h), tone: "bear", side: "above" },
          { key: "touch", i: touch, price: cs[touch].h, label: "Mèche dans le FVG, rejet", short: "Rejet", tone: "bear", side: "above" },
        ],
      }]}
    />
  );
}
