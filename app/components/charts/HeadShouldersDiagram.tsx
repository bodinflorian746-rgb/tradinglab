// Reversal 2 blocs 2 et 4 — épaule-tête-épaule et ETE inversé (XAU/USD H1), exemples du texte :
// épaule gauche 4 620, tête 4 660, épaule droite 4 625, ligne de cou ≈ 4 578, clôture sous la
// ligne de cou ; inversé : 4 470 / 4 430 / 4 475, ligne de cou ≈ 4 512, clôture au-dessus de
// 4 515. Sommets, creux et ligne de cou lus sur les bougies.
// Bougies : scenarios.ts (« hs-execution », « ihs-xau »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import { pivots, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

function hs(cs: Candle[], side: "h" | "l", key: string, title: string, decimals: number): LCPanel {
  const piv = pivots(cs, 2);
  const [ls, head, rs] = piv.filter((q) => q.side === side).slice(-3);
  const necks = piv.filter((q) => q.side !== side && q.index > ls.index && q.index < rs.index);
  const neck = necks.reduce((s, q) => s + q.price, 0) / necks.length;
  const last = cs.length - 1;
  const tone = side === "h" ? "bear" as const : "bull" as const, at = side === "h" ? "above" as const : "below" as const;
  return {
    key, title, decimals, height: 230, candles: cs,
    levels: [{ key: "neck", price: Math.round(neck), from: necks[0].index, label: `Ligne de cou ≈ ${usd(neck)}`, short: "Ligne de cou", tone: "zone" }],
    markers: [
      { key: "ls", i: ls.index, price: ls.price, label: `Épaule ${usd(ls.price)}`, short: "Épaule", tone, side: at, role: side === "h" ? "swing-high" as const : "swing-low" as const },
      { key: "head", i: head.index, price: head.price, label: `Tête ${usd(head.price)}`, short: "Tête", tone, side: at, role: side === "h" ? "swing-high" as const : "swing-low" as const },
      { key: "rs", i: rs.index, price: rs.price, label: `Épaule ${usd(rs.price)}`, short: "Épaule", tone, side: at, role: side === "h" ? "swing-high" as const : "swing-low" as const },
      { key: "brk", i: last, price: cs[last].c, label: `Clôture ${usd(cs[last].c)}`, short: "Clôture", tone, side: side === "h" ? "below" : "above", role: "close" },
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
