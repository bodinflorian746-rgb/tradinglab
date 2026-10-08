// Macro-trading 2 bloc 2 — stabilisation post-NFP (XAU/USD M15) : impulsion bearish
// 4 640→4 575 $, puis 4 bougies avec mèches basses répétées (épuisement des vendeurs,
// 4 580-4 585 $), reprise bullish vers 4 630 $. Bougies : scenarios.ts (« nfp-stab »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";

const NFP_I = 5, STAB_END = 9;

export function NFPStabilizationDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["nfp-stab"];
  const impulse = cs[NFP_I];
  const stabLow = Math.min(...cs.slice(NFP_I + 1, STAB_END + 1).map((k) => k.l));
  const stabHigh = Math.max(...cs.slice(NFP_I + 1, STAB_END + 1).map((k) => k.h));
  const recovery = Math.max(...cs.slice(STAB_END).map((k) => k.h));
  const recovAt = cs.findIndex((k, i) => i >= STAB_END && k.h === recovery);
  return (
    <LessonChart
      id="NFPStabilizationDiagram"
      title="Stabilisation : les mèches basses = épuisement des vendeurs"
      caption="Série de mèches basses répétées + perte d'accélération = signal de fin d'impulsion. Pas de stabilisation = pas de setup."
      panels={[{
        key: "m15", title: "XAU/USD M15", decimals: 0, height: 280, candles: cs,
        zones: [
          { key: "stab", y1: stabLow, y2: stabHigh, from: NFP_I + 1, to: STAB_END, label: `Zone de stabilisation ${usd(stabLow)}-${usd(stabHigh)}`, short: "Stabilisation", tone: "zone" },
        ],
        markers: [
          { key: "nfp", i: NFP_I, price: impulse.l, label: `Impulsion ${usd(impulse.l)}`, short: "NFP", tone: "bear", side: "below" },
          { key: "rec", i: recovAt, price: recovery, label: `Reprise ${usd(recovery)}`, short: "Reprise", tone: "bull", side: "above" },
        ],
        chips: [
          { label: `4 bougies avec mèches basses ~${usd(stabLow)}-${usd(stabHigh)}`, tone: "zone" },
          { label: "Pression vendeuse épuisée", tone: "bull" },
        ],
      }]}
    />
  );
}
