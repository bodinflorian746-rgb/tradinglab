// ICT 3 — même résistance 1.1780 testée à deux moments : Asia = rejet mou,
// London Open = sweep à 1.1792, cascade. Deux panneaux à échelle commune.
// Bougies : scenarios.ts (« timing-asia » et « timing-london »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const RES = 1.178;

export function TimingComparisonDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const a = CANDLES["timing-asia"] as Candle[], l = CANDLES["timing-london"] as Candle[];
  const aTop = a.reduce((b, k, i) => (k.h > a[b].h ? i : b), 0);
  const aWick = Math.round((a[aTop].h - Math.max(a[aTop].o, a[aTop].c)) / 0.0001);
  const lSweep = l.findIndex((k) => k.h > RES);
  const lLow = Math.min(...l.slice(lSweep + 1, lSweep + 5).map((k) => k.l));
  const lLowAt = l.findIndex((k, i) => i >= lSweep && k.l === lLow);
  return (
    <LessonChart
      id="TimingComparisonDiagram"
      title="Même setup, deux timings"
      caption="Le filtre horaire élimine 80 % des setups corrects non rentables."
      panels={[
        {
          key: "asia", title: "Asia Session 03h UTC : rejet mou", decimals: 5, height: 240, candles: a,
          levels: [{ key: "res", price: RES, label: `Résistance ${p(RES)}`, short: "Résistance", tone: "zone" }],
          markers: [{ key: "top", i: aTop, price: a[aTop].h, label: `Rejet : mèche de ${aWick} pips`, short: "Rejet", tone: "bear", side: "above" }],
          chips: [{ label: "Puis latéralisation sans direction", tone: "neutral" }],
        },
        {
          key: "london", title: "London Open : sweep + cascade", decimals: 5, height: 240, candles: l,
          levels: [{ key: "res", price: RES, label: `Résistance ${p(RES)}`, short: "Résistance", tone: "zone" }],
          markers: [
            { key: "sweep", i: lSweep, price: l[lSweep].h, label: `Sweep ${p(l[lSweep].h)}`, short: "Sweep", tone: "bear", side: "above", role: "sweep", ref: RES, dir: "bear" },
            { key: "low", i: lLowAt, price: lLow, label: `Plus bas ${p(lLow)}`, short: "Plus bas", tone: "bear", side: "below", role: "low" },
          ],
          chips: [{ label: `Cascade de ${Math.round((l[lSweep].h - lLow) / 0.0001)} pips en 4 bougies`, tone: "bear" }],
        },
      ]}
      rows={[1, 1]}
      sharedScale
    />
  );
}
