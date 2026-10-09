// Trading Débutant 5 — où placer son Stop Loss (exemple du texte) : achat Bitcoin au
// rebond du support 78 000 $, dernier swing low 77 200 $, SL à 77 000 $ juste en
// dessous. Bougies : scenarios.ts (« sl-chart ») ; swing low calculé.

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usdSp } from "@/app/components/lessons/trade";
import { pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const SUPPORT = 78000, SL = 77000;

export function StopLossChartDiagram(_props: { className?: string }) {
  const cs = CANDLES["sl-chart"];
  const swing = pivots(cs, 2).filter((q) => q.side === "l").reduce((a, b) => (b.price < a.price ? b : a));
  const last = cs.length - 1;
  return (
    <LessonChart
      id="StopLossChartDiagram"
      title="Le SL se place sous le dernier swing low"
      panels={[{
        key: "btc", subtitle: "Bitcoin H1 — achat au rebond du support 78 000 $",
        decimals: 0, height: 280, candles: cs,
        levels: [
          { key: "support", price: SUPPORT, label: `Achat ${usdSp(SUPPORT)} (support)`, short: "Achat", tone: "entry", dashed: true, role: "support" },
          { key: "sl", price: SL, label: `SL ${usdSp(SL)}`, short: "SL", tone: "bear", dashed: true },
        ],
        markers: [
          { key: "swing", i: swing.index, price: swing.price, label: `Swing low ${usdSp(swing.price)}`, short: "Swing low", tone: "neutral", side: "below", role: "swing-low" },
          { key: "rebond", i: last - 1, price: cs[last - 1].h, label: "Rebond", tone: "bull", side: "above" },
        ],
      }]}
      caption="Si le prix atteint le SL, l'analyse était fausse : la perte est normale."
    />
  );
}
