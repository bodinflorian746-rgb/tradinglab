// Macro-trading 2 bloc 1 — réaction headline NFP (XAU/USD M15) : prix stable 4 640 $,
// impulsion NFP bearish jusqu'à 4 575 $, stabilisation 4 580-4 585 $, retour vers 4 625 $.
// Bougies : scenarios.ts (« nfp-headline »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";

const NFP_I = 5;

export function NFPHeadlineReactionDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["nfp-headline"];
  const preLevel = Math.max(...cs.slice(0, NFP_I).map((k) => k.c));
  const impulse = cs[NFP_I];
  const stabHigh = Math.max(...cs.slice(NFP_I + 1, NFP_I + 4).map((k) => k.h));
  const recovery = Math.max(...cs.slice(NFP_I).map((k) => k.h));
  const recovAt = cs.findIndex((k, i) => i > NFP_I + 3 && k.h === recovery);
  return (
    <LessonChart
      id="NFPHeadlineReactionDiagram"
      title="NFP : headline → sur-réaction → réévaluation"
      caption="Le marché lit d'abord le headline, puis digère le rapport complet et réévalue dans les 15-60 minutes."
      panels={[{
        key: "m15", title: "XAU/USD M15", decimals: 0, height: 280, candles: cs,
        levels: [
          { key: "pre", price: preLevel, to: NFP_I + 1, label: `Pré-NFP ${usd(preLevel)}`, short: "Pré-NFP", tone: "neutral", dashed: true },
          { key: "stab", price: stabHigh, from: NFP_I + 1, to: NFP_I + 4, label: `Stabilisation ~${usd(stabHigh)}`, short: "Stab.", tone: "zone", dashed: true },
        ],
        markers: [
          { key: "nfp", i: NFP_I, price: impulse.h, label: "NFP : sur-réaction headline", short: "NFP", tone: "bear", side: "above" },
          { key: "low", i: NFP_I, price: impulse.l, label: usd(impulse.l), tone: "bear", side: "below" },
          { key: "ret", i: recovAt, price: recovery, label: `Réévaluation ${usd(recovery)}`, short: "Rééval.", tone: "bull", side: "above" },
        ],
        chips: [
          { label: `Impulsion headline ${usd(preLevel - impulse.l)}`, tone: "bear" },
          { label: `Retour vers ${usd(recovery)}`, tone: "bull" },
        ],
      }]}
    />
  );
}
