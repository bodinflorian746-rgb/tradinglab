// Multi-timeframe 4 — l'UT inférieure affine le risque. EUR/USD M5 dans la zone H1
// 1.1750-1.1760 (sous la résistance Daily 1.1780) : trois mèches hautes (jusqu'à
// 1.1770), cassure du creux local 1.1748, retour à 1.1758 = entrée short. Même
// entrée, deux SL : au-dessus de la zone H4 (1.1790) sans confirmation, ou au-dessus
// du dernier sommet de rejet (1.1772) avec confirmation M5. Écarts calculés.
// Bougies : scenarios.ts (« risk-affine-m5 »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { fmtNum, fmtPrice, pips } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const ENTRY = 1.1758, SL_H4 = 1.1790, SL_M5 = 1.1772, H4_TOP = 1.1780;
const p = (x: number) => fmtPrice(x, 4);

export function RiskAffineDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const candles = CANDLES["risk-affine-m5"];
  const last = candles.length - 1;
  const top = candles.reduce((b, k, i) => (k.h > candles[b].h ? i : b), 0);
  const panel = (key: string, title: string, sub: string, sl: number, h4: boolean): LCPanel => ({
    key, title, subtitle: sub, decimals: 5, height: 280, candles,
    zones: [{ key: "zone", y1: 1.1750, y2: 1.1760, label: "Zone H1", tone: "zone", kind: "zone" }],
    levels: [
      ...(h4 ? [{ key: "h4", price: H4_TOP, label: `Haut zone H4 ${p(H4_TOP)}`, short: "Zone H4", tone: "neutral" as const, dashed: true, faint: true }] : []),
      { key: "sl", price: sl, from: h4 ? undefined : top, label: `SL ${p(sl)}`, tone: "bear", dashed: true },
      { key: "entry", price: ENTRY, from: last - 1, label: `Entrée ${p(ENTRY)}`, short: "Entrée", tone: "entry" },
    ],
    markers: h4 ? [] : [{ key: "rej", i: top, price: candles[top].h, label: "Dernier sommet de rejet", short: "Rejet", tone: "bear", side: "above", role: "high" }],
    chips: [{ label: `Risque ${pips(sl, ENTRY, 0.0001)} pips`, tone: h4 ? "bear" : "bull", data: { entry: ENTRY, sl } }],
  });
  return (
    <LessonChart
      id="RiskAffineDiagram"
      title="Même entrée, deux SL"
      panels={[
        panel("h4", "Sans confirmation", "SL au-dessus de toute la zone H4", SL_H4, true),
        panel("m5", "Avec confirmation M5", "SL au-dessus du dernier sommet de rejet", SL_M5, false),
      ]}
      rows={[2]}
      sharedScale
      caption={`EUR/USD M5. La distance entrée-SL passe de ${pips(SL_H4, ENTRY, 0.0001)} à ${pips(SL_M5, ENTRY, 0.0001)} pips : divisée par ${fmtNum(pips(SL_H4, ENTRY, 0.0001) / pips(SL_M5, ENTRY, 0.0001), 1)}.`}
    />
  );
}
