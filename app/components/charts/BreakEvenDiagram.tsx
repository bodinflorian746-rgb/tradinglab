// Trading Débutant 7 — avec et sans Break Even (texte de la leçon) : achat Bitcoin à
// 78 000 $, SL initial 75 000 $ (1R = 3 000 $). Le prix monte à 81 000 $ (+1R) puis
// redescend brutalement à 73 500 $. Avec BE (SL déplacé à 78 000 $) : sortie à 0.
// Sans BE : SL 75 000 $ touché, −3 000 $. Même chemin, sorties calculées. Schéma en ligne.

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { usdSp } from "@/app/components/lessons/trade";
import { crossing } from "@/lib/lessons/chart-analysis";

const ENTRY = 78000, SL0 = 75000;
const PATH = [78000, 78700, 79300, 80100, 81000, 80200, 79100, 77600, 76200, 74800, 73500];

export function BreakEvenDiagram() {
  const oneR = PATH.indexOf(ENTRY + (ENTRY - SL0));
  const panel = (be: boolean): LCPanel => {
    const stop = be ? ENTRY : SL0;
    const hit = crossing(PATH, () => stop, oneR, "down")!;
    return {
      key: be ? "avec" : "sans", title: be ? "Avec Break Even ✓" : "Sans Break Even ✗",
      decimals: 0, height: 220, line: PATH.slice(0, Math.ceil(hit.i) + 1), slots: PATH.length,
      levels: [
        { key: "entry", price: ENTRY, label: `Entrée ${usdSp(ENTRY)}`, short: "Entrée", tone: "entry", dashed: true },
        { key: "sl0", price: SL0, to: be ? oneR : undefined, label: `SL initial ${usdSp(SL0)}`, short: "SL initial", tone: "bear", dashed: true, faint: be },
        ...(be ? [{ key: "be", price: ENTRY, from: oneR, label: "SL → entrée (BE)", short: "BE", tone: "zone" as const, dashed: true }] : []),
      ],
      markers: [
        { key: "1r", i: oneR, price: PATH[oneR], label: "+1R", tone: "bull", side: "above", dot: true },
        { key: "exit", i: hit.i, price: stop, label: be ? "Sortie à 0" : "SL touché", tone: be ? "zone" : "bear", side: "below", dot: true },
      ],
      chips: [{ label: be ? "Ni gain ni perte" : `−${usdSp(ENTRY - SL0)} alors qu'il était à +${usdSp(ENTRY - SL0)}`, tone: be ? "zone" : "bear" }],
    };
  };
  return <LessonChart id="BreakEvenDiagram" title="Bitcoin : le même trajet, avec et sans Break Even" panels={[panel(true), panel(false)]} rows={[2]} sharedScale />;
}
