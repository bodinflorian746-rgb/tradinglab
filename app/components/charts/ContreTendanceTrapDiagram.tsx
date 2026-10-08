// Multi-UT 2 bloc 1 — piège de la contre-tendance : EUR/USD Daily LH/LL baissier
// (résistance 1.1760) vs M15 breakout haussier à 1.1752, puis rejet à 1.1685.
// Bougies : scenarios.ts (« ct-daily » et « ct-m15 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const RES = 1.176;

export function ContreTendanceTrapDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const d = CANDLES["ct-daily"] as Candle[], m = CANDLES["ct-m15"] as Candle[];
  const mPeak = m.reduce((b, k, i) => (k.h > m[b].h ? i : b), 0);
  const mLow = Math.min(...m.map((k) => k.l));
  const mLowAt = m.findIndex((k) => k.l === mLow);
  return (
    <LessonChart
      id="ContreTendanceTrapDiagram"
      title="Le breakout M15 contredisait le Daily baissier"
      caption="Une impulsion locale n'est pas un retournement global. L'UT supérieure reste baissière."
      panels={[
        {
          key: "daily", title: "EUR/USD Daily — LH/LL baissier, résistance 1.1760", decimals: 5, height: 220, candles: d,
          levels: [{ key: "res", price: RES, label: `Résistance Daily ${p(RES)}`, short: "Résistance", tone: "zone", dashed: true }],
          chips: [{ label: "Direction dominante : baissière", tone: "bear" }],
        },
        {
          key: "m15", title: "EUR/USD M15 — breakout local → rejet vers 1.1685", decimals: 5, height: 220, candles: m,
          levels: [{ key: "res", price: RES, label: `Résistance ${p(RES)}`, short: "Résistance", tone: "zone", dashed: true }],
          markers: [
            { key: "brk", i: mPeak, price: m[mPeak].h, label: `Breakout ${p(m[mPeak].h)}`, short: "Breakout", tone: "bull", side: "above" },
            { key: "low", i: mLowAt, price: mLow, label: p(mLow), tone: "bear", side: "below" },
          ],
          chips: [{ label: `Rejet vers ${p(mLow)} : le biais Daily a prévalu`, tone: "bear" }],
        },
      ]}
      rows={[1, 1]}
      sharedScale
    />
  );
}
