// Macro-trading 1 bloc 1 — la première impulsion FOMC est souvent excessive (XAU/USD M15),
// exemple du texte : 4 660 $ avant FOMC, impulsion baissière jusqu'à 4 590 $ (70 $) en
// quelques minutes, puis retour vers 4 638 $ une heure plus tard (la majorité de
// l'impulsion corrigée). Mouvements calculés. Bougies : scenarios.ts (« fomc-excess »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";

export const FOMC_IMPULSE = 5;

export function FOMCImpulseExcessDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["fomc-excess"];
  const pre = cs[FOMC_IMPULSE].o, low = cs[FOMC_IMPULSE].l;
  const top = Math.max(...cs.slice(FOMC_IMPULSE + 1).map((k) => k.h));
  const topAt = cs.findIndex((k, i) => i > FOMC_IMPULSE && k.h === top);
  const share = Math.round(((top - low) / (pre - low)) * 100);
  return (
    <LessonChart
      id="FOMCImpulseExcessDiagram"
      title="La première impulsion FOMC est souvent excessive"
      caption="Trader l'impulsion, c'est trader le bruit. Le vrai mouvement arrive après."
      panels={[{
        key: "m15", title: "XAU/USD M15", decimals: 0, height: 280, candles: cs,
        levels: [{ key: "pre", price: pre, label: `Avant FOMC ${usd(pre)}`, short: "Avant FOMC", tone: "neutral", dashed: true }],
        markers: [
          { key: "fomc", i: FOMC_IMPULSE, price: low, label: `FOMC : ${usd(low)}`, short: usd(low), tone: "bear", side: "below" },
          { key: "back", i: topAt, price: top, label: `1 h plus tard : ${usd(top)}`, short: usd(top), tone: "bull", side: "above" },
        ],
        chips: [
          { label: `Impulsion de ${usd(pre - low)} en une bougie`, tone: "bear" },
          { label: `Retour : ${share} % de l'impulsion corrigés`, tone: "bull" },
        ],
      }]}
    />
  );
}
