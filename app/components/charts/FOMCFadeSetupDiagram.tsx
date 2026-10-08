// Macro-trading 1 bloc 3 — le FOMC Fade (XAU/USD M15), exemple et plan du texte : chute
// 4 660 → 4 590 $, stabilisation M15 autour de 4 595 $, retour progressif vers 4 638 $ ;
// long 4 600 $ après la stabilisation, SL 4 578 $ (au-delà de l'extrémité), objectif 4 638 $
// (retour partiel vers le niveau pré-FOMC). R/R calculé. Bougies : scenarios.ts (« fomc-excess »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { tradeSetup, usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";
import { FOMC_IMPULSE } from "./FOMCImpulseExcessDiagram";

const ENTRY = 4600, SL = 4578, TP = 4638;

export function FOMCFadeSetupDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["fomc-excess"];
  const entryAt = cs.findIndex((k, i) => i > FOMC_IMPULSE && k.c > ENTRY);
  const stab = cs.slice(FOMC_IMPULSE + 1, entryAt);
  const stabZone = { y1: Math.min(...stab.map((k) => k.l)), y2: Math.max(...stab.map((k) => k.h)) };
  const t = tradeSetup({ entry: ENTRY, sl: SL, tp: TP, unit: "$", from: entryAt, names: { entry: "Entrée long", tp: "Objectif" } });
  return (
    <LessonChart
      id="FOMCFadeSetupDiagram"
      title="Le fade : un retour partiel, structuré"
      caption="Entrée après stabilisation, SL juste au-delà de l'extrémité, objectif sur le niveau d'où l'impulsion est partie."
      panels={[{
        key: "m15", title: "XAU/USD M15, après le FOMC", decimals: 0, height: 290, candles: cs,
        zones: [{ key: "stab", ...stabZone, from: FOMC_IMPULSE + 1, to: entryAt - 1, label: `Stabilisation ${usd(stabZone.y1)}-${usd(stabZone.y2)}`, short: "Stabilisation", tone: "zone" }],
        levels: t.levels,
        markers: [{ key: "low", i: FOMC_IMPULSE, price: cs[FOMC_IMPULSE].l, label: `Extrémité ${usd(cs[FOMC_IMPULSE].l)}`, short: "Extrémité", tone: "bear", side: "below", role: "low" }],
        chips: t.chips,
      }]}
    />
  );
}
