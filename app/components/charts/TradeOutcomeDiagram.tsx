// Trading Débutant 1 — les deux cas du texte : achat de Bitcoin à 78 000 $, puis
// cas 1 : hausse à 81 000 $ (+3 000 $) ; cas 2 : baisse à 76 500 $ (−1 500 $).
// Schéma en ligne (notion de variation de prix), même échelle pour les deux cas ;
// écarts calculés.

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { fmtPrice } from "@/lib/lessons/chart-analysis";

const usdSp = (x: number) => `${fmtPrice(x, 0, "$").replace("$", "")} $`;
const BUY = 78000;
const CASES = [
  { key: "hausse", title: "Cas 1 : le prix monte en ta faveur", line: [78000, 78250, 78100, 78600, 78900, 78750, 79400, 79800, 80300, 80150, 80700, 81000], tone: "bull" as const },
  { key: "baisse", title: "Cas 2 : le prix descend contre toi", line: [78000, 78150, 77800, 77900, 77550, 77700, 77300, 77050, 77200, 76800, 76650, 76500], tone: "bear" as const },
];

export function TradeOutcomeDiagram() {
  const panels: LCPanel[] = CASES.map((c) => {
    const exit = c.line[c.line.length - 1];
    const diff = exit - BUY;
    return {
      key: c.key, title: c.title, decimals: 0, height: 220, line: c.line,
      levels: [{ key: "achat", price: BUY, label: `Achat ${usdSp(BUY)}`, short: "Achat", tone: "entry", dashed: true }],
      markers: [{ key: "sortie", i: c.line.length - 1, price: exit, label: `Revente ${usdSp(exit)}`, short: "Revente", tone: c.tone, side: diff > 0 ? "above" : "below", dot: true }],
      chips: [{ label: `${diff > 0 ? "+" : "−"}${usdSp(Math.abs(diff))} ${diff > 0 ? "de hausse" : "de baisse"}`, tone: c.tone, data: { diff } }],
    };
  });
  return <LessonChart id="TradeDiagram" title="Un achat, deux issues possibles" panels={panels} rows={[2]} sharedScale caption="Le montant gagné ou perdu en argent dépend ensuite de la taille de la position (Leçon 8)." />;
}
