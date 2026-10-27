// Macro-trading 2 bloc 3 — le NFP peut produire un vrai changement de direction (XAU/USD
// M15), exemple du texte : impulsion 4 640 → 4 575 $, base 4 580-4 585 $, clôture au-dessus
// du niveau pré-NFP (4 640 $) puis accélération jusqu'à 4 665 $.
// Le breakout qui compte est la clôture au-dessus du niveau pré-NFP : 4 620 $ n'était pas
// un vrai sommet avant le NFP (plus haut 4 629 $), il n'est pas tracé. Breakout calculé. Bougies : scenarios.ts (« nfp-reversal »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";
import { NFP } from "./NFPHeadlineReactionDiagram";

export function NFPReversalDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["nfp-reversal"];
  const pre = cs[NFP.impulse].o;
  const brk = cs.findIndex((k, i) => i > NFP.stabEnd && k.c > pre);
  const end = cs.length - 1;
  return (
    <LessonChart
      id="NFPReversalDiagram"
      title="Au-delà du niveau pré-NFP : le biais s'inverse"
      caption="Le retour ne s'arrête pas au niveau pré-NFP, il le dépasse : ce n'est plus un fade, c'est un retournement."
      panels={[{
        key: "m15", title: "XAU/USD M15, après le NFP", decimals: 0, height: 280, candles: cs,
        // Animation : le niveau pré-NFP, la chute du headline, la base, la clôture au-dessus, puis l'accélération
        anim: [{ candles: NFP.impulse - 1 }, { show: "pre" }, { candles: NFP.impulse }, { show: "low" }, { candles: brk }, { show: "brk" }, { candles: end }, { show: "end" }],
        levels: [
          { key: "pre", price: pre, label: `Niveau pré-NFP ${usd(pre)}`, short: "Pré-NFP", tone: "neutral", dashed: true },
        ],
        markers: [
          { key: "low", i: NFP.impulse, price: cs[NFP.impulse].l, label: `Headline : ${usd(cs[NFP.impulse].l)}`, short: "Headline", tone: "bear", side: "below", role: "low" },
          { key: "brk", i: brk, price: cs[brk].c, label: `Clôture au-dessus de ${usd(pre)}`, short: "Breakout", tone: "bull", side: "below", role: "close" },
          { key: "end", i: end, price: cs[end].h, label: `Accélération → ${usd(cs[end].h)}`, short: "Accélération", tone: "bull", side: "above", role: "high" },
        ],
        chips: [{ label: `${usd(cs[end].h - pre)} au-dessus du niveau pré-NFP`, tone: "bull" }],
      }]}
    />
  );
}
