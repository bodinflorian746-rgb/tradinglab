// ICT 4 bloc 4 — une grande bougie isolée ≠ displacement : à gauche vol-spike (bougie
// haussière isolée de 18 pips, retournement immédiat, pas de suite) ; à droite disp-bear
// (sweep + 4 bougies baissières, cassure de structure). Même échelle de prix.
// Bougies : scenarios.ts (« vol-spike » et « disp-bear »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

export function DisplacementVsVolatilityDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const vol = CANDLES["vol-spike"] as Candle[], disp = CANDLES["disp-bear"] as Candle[];
  const volPeak = vol.reduce((b, k, i) => (k.h > vol[b].h ? i : b), 0);
  const dispSweep = disp.findIndex((k) => k.h === Math.max(...disp.map((x) => x.h)));
  const dispLow = Math.min(...disp.map((k) => k.l));
  const dispLowAt = disp.findIndex((k) => k.l === dispLow);
  const spike = Math.round((vol[volPeak].h - vol[volPeak - 1].c) / 0.0001);
  return (
    <LessonChart
      id="DisplacementVsVolatilityDiagram"
      title="Volatilité vs displacement"
      caption="La taille d'une seule bougie n'est pas un critère : c'est la séquence directionnelle et la suite qui comptent."
      panels={[
        {
          key: "vol", title: "Volatilité : grande bougie isolée", decimals: 5, height: 240, candles: vol,
          markers: [
            { key: "spike", i: volPeak, price: vol[volPeak].h, label: `+${spike} pips : rejet immédiat`, short: `+${spike} pips`, tone: "bull", side: "above" },
          ],
          chips: [{ label: "Pas de breakout, pas de suite → volatilité", tone: "neutral" }],
        },
        {
          key: "disp", title: "Displacement : séquence orientée", decimals: 5, height: 240, candles: disp,
          markers: [
            { key: "sweep", i: dispSweep, price: disp[dispSweep].h, label: `Sweep ${p(disp[dispSweep].h)}`, short: "Sweep", tone: "zone", side: "above" },
            { key: "low", i: dispLowAt, price: dispLow, label: p(dispLow), tone: "bear", side: "below" },
          ],
          chips: [{ label: "Breakout de structure + suite → displacement", tone: "bear" }],
        },
      ]}
      rows={[1, 1]}
      sharedScale
    />
  );
}
