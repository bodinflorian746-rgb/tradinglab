// Macro-trading 1 bloc 3 — setup Fade FOMC (XAU/USD M15) : même impulsion 4 660→4 590 $
// que FOMCImpulseExcess, mais avec les niveaux de trade du texte : entrée long 4 600 $,
// SL 4 578 $, target 4 638 $ (retour partiel). Bougies : scenarios.ts (« fomc-excess »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { tradeSetup, usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";

const FOMC_I = 5;
const ENTRY = 4600, SL = 4578, TP = 4638;

export function FOMCFadeSetupDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["fomc-excess"];
  const entryAt = cs.findIndex((k, i) => i > FOMC_I + 2 && k.c >= ENTRY);
  const t = tradeSetup({ entry: ENTRY, sl: SL, tp: TP, unit: "$", from: entryAt, names: { entry: "Entrée fade", tp: "Target pré-FOMC" } });
  return (
    <LessonChart
      id="FOMCFadeSetupDiagram"
      title="FOMC Fade : exécution après essoufflement"
      caption="Entrée après stabilisation visible. SL serré au-delà de l'extrémité. Target = niveau pré-FOMC."
      panels={[{
        key: "m15", title: "XAU/USD M15", decimals: 0, height: 290, candles: cs,
        levels: t.levels,
        markers: [
          { key: "fomc", i: FOMC_I, price: cs[FOMC_I].h, label: "FOMC : impulsion", short: "FOMC", tone: "bear", side: "above" },
          { key: "stab", i: FOMC_I + 1, price: cs[FOMC_I].l, label: `Stabilisation ~${usd(cs[FOMC_I].l)}`, short: "Stab.", tone: "zone", side: "below" },
        ],
        chips: t.chips,
      }]}
    />
  );
}
