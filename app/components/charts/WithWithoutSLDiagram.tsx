// Trading Débutant 5 — avec et sans Stop Loss (texte de la leçon) : même achat Bitcoin à
// 78 000 $, chute nocturne. Avec SL 76 500 $ : −1 500 $. Sans SL : le marché s'effondre
// jusqu'à 70 000 $, −8 000 $. Même échelle, variations calculées. Schéma en ligne.

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { usdSp } from "@/app/components/lessons/trade";
import { crossing } from "@/lib/lessons/chart-analysis";

const ENTRY = 78000, SL = 76500;
const PATH = [78000, 78200, 77900, 77600, 77100, 76300, 75100, 73800, 72400, 71200, 70500, 70000];

// Animation : l'achat, puis la chute nocturne point par point ; à gauche le SL coupe, à droite la
// chute continue jusqu'à 70 000 $
export function WithWithoutSLDiagram() {
  const hit = crossing(PATH, () => SL, 0, "down")!;
  const cut = PATH.slice(0, Math.ceil(hit.i) + 1);
  const panels: LCPanel[] = [
    {
      key: "avec", title: "Avec Stop Loss ✓", decimals: 0, height: 220, line: cut, slots: PATH.length,
      anim: [{ show: ["entry", "sl"] }, { candles: cut.length - 1 }, { show: "hit" }],
      levels: [
        { key: "entry", price: ENTRY, label: `Achat ${usdSp(ENTRY)}`, short: "Achat", tone: "entry", dashed: true },
        { key: "sl", price: SL, label: `SL ${usdSp(SL)}`, short: "SL", tone: "bear", dashed: true },
      ],
      markers: [{ key: "hit", i: hit.i, price: SL, label: "SL déclenché", tone: "bear", side: "below", dot: true }],
      chips: [{ label: `Variation −${usdSp(ENTRY - SL)} : risque limité, défini à l'avance`, tone: "bull" }],
    },
    {
      key: "sans", title: "Sans Stop Loss ✗", decimals: 0, height: 220, line: PATH,
      // même rythme que le panneau de gauche jusqu'au SL (pause = durée d'un élément allumé), puis la chute continue
      anim: [{ show: "entry" }, { candles: cut.length - 1 }, { pause: 720 }, { candles: PATH.length - 1 }, { show: "low" }],
      levels: [{ key: "entry", price: ENTRY, label: `Achat ${usdSp(ENTRY)}`, short: "Achat", tone: "entry", dashed: true }],
      markers: [{ key: "low", i: PATH.length - 1, price: PATH[PATH.length - 1], label: `Chute à ${usdSp(PATH[PATH.length - 1])}`, short: "Chute", tone: "bear", side: "above", dot: true }],
      chips: [{ label: `Variation −${usdSp(ENTRY - PATH[PATH.length - 1])} : risque non plafonné`, tone: "bear" }],
    },
  ];
  return <LessonChart id="WithWithoutSLDiagram" title="La même nuit, avec et sans Stop Loss" panels={panels} rows={[2]} sharedScale />;
}
