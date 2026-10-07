// Stratégie Reversal 4 — « Couper rapidement ». Cas 1 de la leçon : short
// EUR/USD à 1.1795 après le breakout de la ligne de cou (1.1800), SL 1.1835.
// Le prix descend à 1.1780 puis une bougie H1 clôture à 1.1810, au-dessus de la
// ligne de cou : invalidation. Trois issues, pertes calculées sur les niveaux :
// couper à la clôture, attendre une bougie de plus (SL touché), SL resserré
// sur la ligne de cou dès l'entrée.

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { crossing, fmtNum, fmtPrice, pips } from "@/lib/lessons/chart-analysis";
import { SL_CASE } from "@/lib/lessons/line-data";
import { PIP } from "@/lib/lessons/models";

// Clôtures H1 : breakout (entrée), creux 1.1780, clôture d'invalidation 1.1810, puis montée jusqu'au SL
const { neck: NECK, entry: ENTRY, sl: SL, closes: CLOSES, entryIndex: ENTRY_I, cutIndex: CUT_I } = SL_CASE;
const SLOTS = CLOSES.length;

const p = (x: number) => fmtPrice(x, 4);
const loss = (exit: number) => {
  const pp = pips(exit, ENTRY, PIP);
  return `Perte ${pp} pips · −${fmtNum(pp / pips(SL, ENTRY, PIP))}R`;
};

export default function SLManagementProgressionDiagram({ className = "" }: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cut = CLOSES.slice(0, CUT_I + 1);
  const hitSL = crossing(CLOSES, () => SL, ENTRY_I, "up")!;
  const hitNeck = crossing(cut, () => NECK, ENTRY_I, "up")!;
  const neck = { key: "neck", price: NECK, label: `Ligne de cou ${p(NECK)}`, short: "Ligne de cou", tone: "neutral" as const, dashed: true, faint: true };
  const entry = { key: "entry", price: ENTRY, from: ENTRY_I, label: `Entrée ${p(ENTRY)}`, short: "Entrée", tone: "entry" as const };
  const panels: LCPanel[] = [
    {
      key: "cut", title: "Couper à la clôture", subtitle: "La bougie H1 clôture à 1.1810, au-dessus de la ligne de cou : sortie à cette clôture",
      decimals: 4, height: 210, line: cut, slots: SLOTS,
      levels: [neck, entry, { key: "sl", price: SL, from: ENTRY_I, label: `SL ${p(SL)}`, tone: "bear", dashed: true }],
      markers: [{ key: "cut", i: CUT_I, price: CLOSES[CUT_I], label: `Coupe ${p(CLOSES[CUT_I])}`, tone: "zone", side: "above", dot: true }],
      chips: [{ label: loss(CLOSES[CUT_I]), tone: "zone", data: { entry: ENTRY, exit: CLOSES[CUT_I], sl: SL } }],
    },
    {
      key: "wait", title: "Attendre une bougie de plus", subtitle: "Le prix continue de monter jusqu'au SL",
      decimals: 4, height: 210, line: CLOSES, slots: SLOTS,
      levels: [neck, entry, { key: "sl", price: SL, from: ENTRY_I, label: `SL ${p(SL)}`, tone: "bear", dashed: true }],
      markers: [{ key: "hit", i: hitSL.i, price: SL, label: "SL touché", tone: "bear", side: "above", dot: true }],
      chips: [{ label: loss(SL), tone: "bear", data: { entry: ENTRY, exit: SL, sl: SL } }],
    },
    {
      key: "tight", title: "SL resserré sur la ligne de cou", subtitle: "Le SL passe de 1.1835 à la ligne de cou après l'entrée",
      decimals: 4, height: 210, line: cut, slots: SLOTS,
      levels: [
        entry,
        { key: "sl0", price: SL, from: ENTRY_I, to: ENTRY_I + 1, label: `SL initial ${p(SL)}`, short: "SL initial", tone: "bear", dashed: true, faint: true },
        { key: "sl", price: NECK, from: ENTRY_I + 1, label: `SL ${p(NECK)} (ligne de cou)`, short: `SL ${p(NECK)}`, tone: "bear", dashed: true },
      ],
      markers: [{ key: "hit", i: hitNeck.i, price: NECK, label: "SL touché", tone: "bear", side: "above", dot: true }],
      chips: [{ label: loss(NECK), tone: "bull", data: { entry: ENTRY, exit: NECK, sl: SL } }],
    },
  ];
  return (
    <div className={className}>
      <LessonChart
        id="SLManagementProgressionDiagram"
        title="Couper vite plutôt que subir le SL"
        panels={panels}
        sharedScale
        caption="Cas 1 de la leçon : short EUR/USD à 1.1795, SL 1.1835 (40 pips = 1R). Clôtures H1."
      />
    </div>
  );
}
