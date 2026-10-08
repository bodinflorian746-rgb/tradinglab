// Reversal 1 blocs 2 et 4 — double top et double bottom, exemples du texte :
// EUR/USD H1 : tendance haussière, sommets 1.1880 et 1.1895, ligne de cou 1.1800, clôture
// sous 1.1800 ; XAU/USD H1 : tendance baissière, creux 4 480 et 4 478 $, ligne de cou 4 520 $,
// clôture au-dessus. Sommets, creux, écart et breakout lus sur les bougies.
// Bougies : scenarios.ts (« dt-eur », « db-xau »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import { fmtPrice, pivots, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const pct = (a: number, b: number) => `${((Math.abs(a - b) / Math.min(a, b)) * 100).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} %`;

/** Les deux extrêmes du pattern et la ligne de cou (pivot opposé entre les deux) */
export function dtbShape(cs: Candle[], side: "h" | "l") {
  const piv = pivots(cs, 2);
  const ext = piv.filter((q) => q.side === side).slice(-2);
  const neck = piv.find((q) => q.side !== side && q.index > ext[0].index && q.index < ext[1].index)!;
  const brk = cs.findIndex((k, i) => i > ext[1].index && (side === "h" ? k.c < neck.price : k.c > neck.price));
  return { a: ext[0], b: ext[1], neck, brk };
}

export default function DoubleTopBottomDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const top = CANDLES["dt-eur"] as Candle[], bot = CANDLES["db-xau"] as Candle[];
  const t = dtbShape(top, "h"), b = dtbShape(bot, "l");
  return (
    <LessonChart
      id="DoubleTopBottomDiagram"
      title="Deux échecs au même prix"
      caption="La confirmation arrive à la clôture de l'autre côté de la ligne de cou, pas sur une mèche."
      panels={[
        {
          key: "top", title: "Double top · EUR/USD H1", decimals: 5, height: 230, candles: top,
          levels: [{ key: "neck", price: t.neck.price, from: t.a.index, label: `Ligne de cou ${p(t.neck.price)}`, short: "Ligne de cou", tone: "zone" }],
          markers: [
            { key: "a", i: t.a.index, price: t.a.price, label: p(t.a.price), tone: "bear", side: "above" },
            { key: "b", i: t.b.index, price: t.b.price, label: p(t.b.price), tone: "bear", side: "above" },
            { key: "brk", i: t.brk, price: top[t.brk].l, label: "Clôture sous la ligne de cou", short: "Clôture", tone: "bear", side: "below" },
          ],
          chips: [{ label: `Écart entre les sommets : ${pct(t.a.price, t.b.price)}`, tone: "neutral" }],
        },
        {
          key: "bottom", title: "Double bottom · XAU/USD H1", decimals: 0, height: 230, candles: bot,
          levels: [{ key: "neck", price: b.neck.price, from: b.a.index, label: `Ligne de cou ${usd(b.neck.price)}`, short: "Ligne de cou", tone: "zone" }],
          markers: [
            { key: "a", i: b.a.index, price: b.a.price, label: usd(b.a.price), tone: "bull", side: "below" },
            { key: "b", i: b.b.index, price: b.b.price, label: usd(b.b.price), tone: "bull", side: "below" },
            { key: "brk", i: b.brk, price: bot[b.brk].h, label: "Clôture au-dessus", short: "Clôture", tone: "bull", side: "above" },
          ],
          chips: [{ label: `Écart entre les creux : ${pct(b.a.price, b.b.price)}`, tone: "neutral" }],
        },
      ]}
      rows={[2]}
    />
  );
}
