// Macro-trading 2 bloc 1 — le headline provoque une sur-réaction (XAU/USD M15), exemple du
// texte : 4 640 $ avant le NFP, impulsion baissière jusqu'à 4 575 $ qui casse le support
// 4 600 $, stabilisation autour de 4 580-4 585 $, puis remontée vers 4 625 $ dans l'heure
// suivante. Mouvements calculés. Bougies : scenarios.ts (« nfp-headline »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";

/** Bougies des scénarios NFP : 5 avant la publication, l'impulsion, 4 de stabilisation */
export const NFP = { impulse: 5, stabEnd: 9 };

export function NFPHeadlineReactionDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["nfp-headline"];
  const pre = cs[NFP.impulse].o, low = cs[NFP.impulse].l;
  const end = cs.length - 1;
  return (
    <LessonChart
      id="NFPHeadlineReactionDiagram"
      title="Le headline d'abord, le rapport complet ensuite"
      caption="Le marché réagit au headline en quelques minutes, puis digère salaires et révisions."
      panels={[{
        key: "m15", title: "XAU/USD M15, publication NFP", decimals: 0, height: 280, candles: cs,
        levels: [
          { key: "pre", price: pre, label: `Avant NFP ${usd(pre)}`, short: "Avant NFP", tone: "neutral", dashed: true },
          { key: "sup", price: 4600, to: NFP.impulse, label: `Support ${usd(4600)}`, short: "Support", tone: "zone" },
        ],
        markers: [
          { key: "nfp", i: NFP.impulse, price: low, label: `Headline : ${usd(low)}`, short: usd(low), tone: "bear", side: "below" },
          { key: "end", i: end, price: cs[end].h, label: `1 h plus tard : ${usd(cs[end].h)}`, short: usd(cs[end].h), tone: "bull", side: "above" },
        ],
        chips: [
          { label: `Impulsion headline : −${usd(pre - low)}`, tone: "bear" },
          { label: `Réévaluation : ${usd(cs[end].h)}`, tone: "bull" },
        ],
      }]}
    />
  );
}
