// Trading Débutant 6 — avec et sans Take Profit (texte de la leçon) : achat Bitcoin à
// 78 000 $, le prix monte à 84 000 $ puis redescend à 75 000 $. Avec TP à 84 000 $ :
// sortie à l'objectif, +6 000 $. Sans TP : sortie en panique à 75 000 $, −3 000 $.
// Même chemin de prix, variations calculées. Schéma en ligne.

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { usdSp } from "@/app/components/lessons/trade";

const ENTRY = 78000, TP = 84000;
const PATH = [78000, 78900, 79800, 80600, 81900, 82700, 84000, 82600, 80900, 79100, 77200, 75000];

export function TakeProfitDiagram() {
  const top = PATH.indexOf(TP);
  const exit = PATH[PATH.length - 1];
  const panels: LCPanel[] = [
    {
      key: "avec", title: "Avec Take Profit ✓", decimals: 0, height: 220, line: PATH.slice(0, top + 1), slots: PATH.length,
      levels: [
        { key: "tp", price: TP, label: `TP ${usdSp(TP)}`, short: "TP", tone: "bull", dashed: true },
        { key: "entry", price: ENTRY, label: `Entrée ${usdSp(ENTRY)}`, short: "Entrée", tone: "entry", dashed: true },
      ],
      markers: [{ key: "tp", i: top, price: TP, label: "Sortie à l'objectif", short: "Sortie", tone: "bull", side: "below", dot: true }],
      chips: [{ label: `+${usdSp(TP - ENTRY)} sécurisés`, tone: "bull" }],
    },
    {
      key: "sans", title: "Sans Take Profit ✗", decimals: 0, height: 220, line: PATH,
      levels: [{ key: "entry", price: ENTRY, label: `Entrée ${usdSp(ENTRY)}`, short: "Entrée", tone: "entry", dashed: true }],
      markers: [
        { key: "top", i: top, price: TP, label: `${usdSp(TP)} ignoré`, short: "Ignoré", tone: "neutral", side: "above", dot: true },
        { key: "exit", i: PATH.length - 1, price: exit, label: `Sortie ${usdSp(exit)}`, short: "Sortie", tone: "bear", side: "above", dot: true },
      ],
      chips: [{ label: `−${usdSp(ENTRY - exit)} au lieu de +${usdSp(TP - ENTRY)}`, tone: "bear" }],
    },
  ];
  return <LessonChart id="TakeProfitDiagram" title="Bitcoin : le même trajet, avec et sans Take Profit" panels={panels} rows={[2]} sharedScale />;
}
