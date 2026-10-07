// Trading Débutant 5 — ce qu'est un Stop Loss : achat Bitcoin à 78 000 $, SL à 76 500 $
// (si le prix descend, −1 500 $), TP à 81 000 $ (si le prix monte, +3 000 $). Niveaux
// d'un trade Long ; R/R calculé. Schéma en ligne (notion).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usdSp } from "@/app/components/lessons/trade";
import { fmtRR, tradeMath } from "@/lib/lessons/chart-analysis";

const ENTRY = 78000, SL = 76500, TP = 81000;

export function StopLossBasicsDiagram() {
  const rr = tradeMath(ENTRY, SL, TP).rr;
  return (
    <LessonChart
      id="StopLossDiagram"
      title="Trade Long : le SL sous l'entrée, le TP au-dessus"
      panels={[{
        key: "btc", subtitle: "Bitcoin — achat à 78 000 $",
        decimals: 0, height: 230, line: [77800, 78000, 77900, 78000], slots: 10,
        levels: [
          { key: "tp", price: TP, label: `TP ${usdSp(TP)} : +${usdSp(TP - ENTRY)}`, short: `TP ${usdSp(TP)}`, tone: "bull", dashed: true },
          { key: "entry", price: ENTRY, label: `Entrée ${usdSp(ENTRY)}`, short: "Entrée", tone: "entry" },
          { key: "sl", price: SL, label: `SL ${usdSp(SL)} : −${usdSp(ENTRY - SL)}`, short: `SL ${usdSp(SL)}`, tone: "bear", dashed: true },
        ],
        markers: [{ key: "now", i: 3, price: ENTRY, label: "Achat", tone: "entry", side: "above", dot: true }],
        chips: [
          { label: `Risque ${usdSp(ENTRY - SL)}`, tone: "bear" },
          { label: `Objectif ${usdSp(TP - ENTRY)}`, tone: "bull" },
          { label: `R/R ${fmtRR(rr)}`, tone: "entry", data: { rr: fmtRR(rr), entry: ENTRY, sl: SL, tp: TP } },
        ],
      }]}
      caption="Quand le prix atteint le SL, le trade se ferme automatiquement : la perte reste plafonnée et connue à l'avance."
    />
  );
}
