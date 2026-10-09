// Macro-trading 2 bloc 1 — le headline provoque une sur-réaction (XAU/USD M15), exemple du
// texte : support 4 600 $ touché deux fois avant (rebonds nets), 4 640 $ avant le NFP, impulsion
// baissière jusqu'à 4 575 $ qui casse le support 4 600 $, stabilisation autour de 4 580-4 585 $, puis remontée vers 4 625 $ dans l'heure
// suivante. Mouvements calculés. Bougies : scenarios.ts (« nfp-headline »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";

/** Bougies des scénarios NFP : 14 avant la publication (dont le support 4 600 touché deux fois),
 *  l'impulsion, 4 de stabilisation */
export const NFP = { impulse: 14, stabEnd: 18 };

export function NFPHeadlineReactionDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["nfp-headline"];
  const pre = cs[NFP.impulse].o, low = cs[NFP.impulse].l;
  const end = cs.length - 1;
  return (
    <LessonChart
      id="NFPHeadlineReactionDiagram"
      title="Le headline d'abord, le rapport complet ensuite"
      caption={`Impulsion headline de −${usd(pre - low)} en quelques minutes ; le marché digère ensuite salaires et révisions.`}
      panels={[{
        key: "m15", title: "XAU/USD M15, publication NFP", decimals: 0, height: 280, candles: cs,
        levels: [
          { key: "pre", price: pre, label: `Avant NFP ${usd(pre)}`, short: "Avant NFP", tone: "neutral", dashed: true },
          { key: "sup", price: 4600, to: NFP.impulse, label: `Support ${usd(4600)} cassé`, short: "Support", tone: "zone" },
        ],
        markers: [
          { key: "nfp", i: NFP.impulse, price: low, label: `Headline : ${usd(low)}`, short: "Headline", tone: "bear", side: "below", role: "low" },
          { key: "end", i: end, price: cs[end].h, label: `1 h plus tard : ${usd(cs[end].h)}`, short: "1 h plus tard", tone: "bull", side: "above", role: "high" },
        ],
      }]}
    />
  );
}
