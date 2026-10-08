// Macro-trading 1 bloc 1 — impulsion FOMC excessive (XAU/USD M15) : prix stable 4 660 $,
// grande bougie FOMC bearish jusqu'à 4 590 $ (70 $), retour progressif vers 4 638 $.
// Bougies : scenarios.ts (« fomc-excess »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";

const FOMC_I = 5;

export function FOMCImpulseExcessDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["fomc-excess"];
  const preLevel = Math.max(...cs.slice(0, FOMC_I).map((k) => k.c));
  const impulse = cs[FOMC_I];
  const recovery = Math.max(...cs.slice(FOMC_I).map((k) => k.h));
  const recovAt = cs.findIndex((k, i) => i > FOMC_I && k.h === recovery);
  return (
    <LessonChart
      id="FOMCImpulseExcessDiagram"
      title="La première impulsion FOMC : souvent excessive"
      caption="Trader l'impulsion = trader le bruit émotionnel. Le vrai setup apparaît après l'essoufflement."
      panels={[{
        key: "m15", title: "XAU/USD M15", decimals: 0, height: 280, candles: cs,
        levels: [
          { key: "pre", price: preLevel, to: FOMC_I + 1, label: `Pré-FOMC ${usd(preLevel)}`, short: "Pré-FOMC", tone: "neutral", dashed: true },
        ],
        markers: [
          { key: "fomc", i: FOMC_I, price: impulse.h, label: "FOMC : impulsion bearish", short: "FOMC", tone: "bear", side: "above" },
          { key: "low", i: FOMC_I, price: impulse.l, label: usd(impulse.l), tone: "bear", side: "below" },
          { key: "ret", i: recovAt, price: recovery, label: `Retour ${usd(recovery)}`, short: "Retour", tone: "bull", side: "above" },
        ],
        chips: [
          { label: `Impulsion ${usd(preLevel - impulse.l)}`, tone: "bear" },
          { label: `Retour partiel ${usd(recovery - impulse.l)}`, tone: "bull" },
        ],
      }]}
    />
  );
}
