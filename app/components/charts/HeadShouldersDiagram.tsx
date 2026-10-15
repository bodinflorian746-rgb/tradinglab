// Reversal 2 blocs 2 et 4 — épaule-tête-épaule et ETE inversé (EUR/USD H1), exemples du texte :
// épaule gauche 1.0920, tête 1.0960, épaule droite 1.0925, ligne de cou ≈ 1.0878, clôture sous la
// ligne de cou ; inversé : 1.0770 / 1.0730 / 1.0775, ligne de cou ≈ 1.0812, clôture au-dessus de
// 1.0815. Sommets, creux et ligne de cou lus sur les bougies.
// Bougies : scenarios.ts (« hs-execution », « ihs-xau »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { pivots, type Candle, fmtPrice } from "@/lib/lessons/chart-analysis";
import { eurToXau, xauToEur } from "@/lib/lessons/eur-from-xau";
import CANDLES from "@/lib/lessons/generated/candles.json";

const px = (x: number) => fmtPrice(x, 4);

function hs(cs: Candle[], side: "h" | "l", key: string, title: string, decimals: number): LCPanel {
  const piv = pivots(cs, 2);
  const [ls, head, rs] = piv.filter((q) => q.side === side).slice(-3);
  const necks = piv.filter((q) => q.side !== side && q.index > ls.index && q.index < rs.index);
  const neck = necks.reduce((s, q) => s + q.price, 0) / necks.length;
  const neckR = xauToEur(Math.round(eurToXau(neck))); // arrondi au pip, calculé en dollars
  const last = cs.length - 1;
  const tone = side === "h" ? "bear" as const : "bull" as const, at = side === "h" ? "above" as const : "below" as const;
  return {
    key, title, decimals, height: 230, candles: cs,
    levels: [{ key: "neck", price: neckR, from: necks[0].index, label: `Ligne de cou ≈ ${px(neckR)}`, short: "Ligne de cou", tone: "zone" }],
    markers: [
      { key: "ls", i: ls.index, price: ls.price, label: `Épaule ${px(ls.price)}`, short: "Épaule", tone, side: at, role: side === "h" ? "swing-high" as const : "swing-low" as const },
      { key: "head", i: head.index, price: head.price, label: `Tête ${px(head.price)}`, short: "Tête", tone, side: at, role: side === "h" ? "swing-high" as const : "swing-low" as const },
      { key: "rs", i: rs.index, price: rs.price, label: `Épaule ${px(rs.price)}`, short: "Épaule", tone, side: at, role: side === "h" ? "swing-high" as const : "swing-low" as const },
      { key: "brk", i: last, price: cs[last].c, label: `Clôture ${px(cs[last].c)}`, short: "Clôture", tone, side: side === "h" ? "below" : "above", role: "close" },
    ],
  };
}

export default function HeadShouldersDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonChart
      id="HeadShouldersDiagram"
      title="Trois sommets, la tête au-dessus"
      caption="La tête doit être strictement plus haute (ou plus basse) que les deux épaules ; la clôture de l'autre côté de la ligne de cou confirme."
      panels={[
        hs(CANDLES["hs-execution"] as Candle[], "h", "ete", "ETE · fin de tendance haussière", 1),
        hs(CANDLES["ihs-xau"] as Candle[], "l", "inv", "ETE inversé · fin de tendance baissière", 0),
      ]}
      rows={[2]}
    />
  );
}
