// Reversal 2 — plan d'exécution de l'ETE XAU/USD H1 (épaule gauche 4 620$, tête
// 4 660$, épaule droite 4 625$, ligne de cou ≈ 4 578$). Entrée short à la clôture
// sous la ligne de cou (4 570$) ; SL tactique au-dessus de l'épaule droite
// (4 630$) ou SL classique au-dessus de la tête (4 670$) ; measured move 82$ →
// 4 496$, TP étendu 4 480$. R/R calculés pour les deux SL.

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import { fmtRR, lineAt, pivots, tradeMath } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const SL_TACTIQUE = 4630, SL_CLASSIQUE = 4670, TP = 4480;

export default function HSTradeExecutionDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const candles = CANDLES["hs-execution"];
  const n = candles.length;
  const piv = pivots(candles, 2);
  const head = piv.filter((q) => q.side === "h").reduce((a, b) => (b.price > a.price ? b : a));
  const ls = piv.filter((q) => q.side === "h" && q.index < head.index).at(-1)!;
  const rs = piv.filter((q) => q.side === "h" && q.index > head.index)[0];
  const t1 = piv.filter((q) => q.side === "l" && q.index > ls.index && q.index < head.index).at(-1)!;
  const t2 = piv.filter((q) => q.side === "l" && q.index > head.index && q.index < rs.index)[0];
  const neck = Math.round((t1.price + t2.price) / 2);
  const neckAt = (i: number) => lineAt(t1.index, t1.price, t2.index, t2.price, i);
  const mm = neck - (head.price - neck);
  const entry = candles[n - 1].c;
  const rr = (sl: number) => tradeMath(entry, sl, TP).rr;
  const chip = (name: string, sl: number, expect?: string) => ({
    label: `${name} : risque ${usd(sl - entry)}, R/R ${fmtRR(rr(sl))}`, tone: rr(sl) >= 1.5 ? "bull" as const : "bear" as const,
    data: { rr: fmtRR(rr(sl)), entry, sl, tp: TP, ...(expect ? { expect } : {}) },
  });
  return (
    <LessonChart
      id="HSTradeExecutionDiagram"
      title="Exécuter un ETE : entrée, deux SL possibles, measured move"
      panels={[{
        key: "h1", subtitle: "XAU/USD H1 — clôture sous la ligne de cou, entrée short",
        decimals: 1, height: 340, candles,
        segments: [{ key: "neck", i1: t1.index, p1: neckAt(t1.index), i2: n - 1, p2: neckAt(n - 1), tone: "neutral", dashed: true, label: `Ligne de cou ≈ ${usd(neck)}`, short: "Ligne de cou" }],
        levels: [
          { key: "sl-c", price: SL_CLASSIQUE, from: head.index, label: `SL classique ${usd(SL_CLASSIQUE)}`, short: "SL classique", tone: "bear", dashed: true, faint: true },
          { key: "sl-t", price: SL_TACTIQUE, from: rs.index, label: `SL tactique ${usd(SL_TACTIQUE)}`, short: "SL tactique", tone: "bear", dashed: true },
          { key: "entry", price: entry, from: n - 1, label: `Entrée ${usd(entry)}`, short: "Entrée", tone: "entry" },
          { key: "mm", price: mm, from: n - 1, label: `Measured move ${usd(mm)}`, short: "Measured move", tone: "zone", dashed: true, faint: true },
          { key: "tp", price: TP, from: n - 1, label: `TP ${usd(TP)}`, short: "TP", tone: "bull", dashed: true },
        ],
        markers: [
          { key: "ls", i: ls.index, price: ls.price, label: "Épaule G.", tone: "neutral", side: "above" },
          { key: "head", i: head.index, price: head.price, label: "Tête", tone: "neutral", side: "above" },
          { key: "rs", i: rs.index, price: rs.price, label: "Épaule D.", tone: "neutral", side: "above" },
        ],
        chips: [chip("SL tactique", SL_TACTIQUE), chip("SL classique", SL_CLASSIQUE, "<1")],
      }]}
      caption={`Hauteur tête → ligne de cou : ${usd(head.price - neck)}, reportée sous la ligne de cou (${usd(mm)}) ; TP étendu à ${usd(TP)}.`}
    />
  );
}
