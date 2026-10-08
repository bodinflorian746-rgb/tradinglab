// Macro-trading 2 bloc 3 — retournement complet NFP (XAU/USD M15) : chute 4 640→4 575 $,
// base 4 580-4 585 $, breakout bullish au-dessus de 4 620 $, accélération vers 4 665 $
// (au-delà du niveau pré-NFP). Bougies : scenarios.ts (« nfp-reversal »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";

const NFP_I = 5, STAB_END = 8, BRK = 9;
const PRE_NFP = 4640;

export function NFPReversalDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["nfp-reversal"];
  const impulse = cs[NFP_I];
  const brkCandle = cs[BRK];
  const peak = Math.max(...cs.map((k) => k.h));
  const peakAt = cs.findIndex((k) => k.h === peak);
  return (
    <LessonChart
      id="NFPReversalDiagram"
      title="Retournement complet : le rapport renverse le headline"
      caption="Quand le retour dépasse le niveau pré-NFP, la nature du setup change : ce n'est plus un fade, c'est un retournement de biais."
      panels={[{
        key: "m15", title: "XAU/USD M15", decimals: 0, height: 290, candles: cs,
        levels: [
          { key: "pre", price: PRE_NFP, label: `Niveau pré-NFP ${usd(PRE_NFP)}`, short: "Pré-NFP", tone: "neutral", dashed: true },
        ],
        markers: [
          { key: "nfp", i: NFP_I, price: impulse.l, label: `Impulsion ${usd(impulse.l)}`, short: "NFP", tone: "bear", side: "below" },
          { key: "brk", i: BRK, price: brkCandle.h, label: `Breakout ${usd(brkCandle.h)}`, short: "Breakout", tone: "bull", side: "above" },
          { key: "peak", i: peakAt, price: peak, label: `${usd(peak)} > pré-NFP`, short: usd(peak), tone: "bull", side: "above" },
        ],
        chips: [
          { label: `Breakout au-dessus de ${usd(PRE_NFP)} : retournement de biais`, tone: "bull" },
          { label: `Accélération → ${usd(peak)}`, tone: "bull" },
        ],
      }]}
    />
  );
}
