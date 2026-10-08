// Trend-following 2 — lire les 3 MM ensemble : MM20, MM50, MM200 calculées sur 260
// bougies (fenêtre affichée : les 80 dernières). Alignement haussier (MM20 > MM50 >
// MM200), alignement baissier, range (MM enchevêtrées). L'ordre affiché est lu sur
// les valeurs de la dernière bougie. Bougies : scenarios.ts (« ma-bull / -bear / -range »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { sma } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const SHOW = 80;
const CASES = [
  { key: "ma-bull", title: "Alignement haussier", read: "Biais long : setups long uniquement" },
  { key: "ma-bear", title: "Alignement baissier", read: "Biais short : setups short uniquement" },
  { key: "ma-range", title: "Range", read: "Pente nulle : pas de biais" },
] as const;

export default function MMHierarchyStackDiagram(_props: { className?: string }) {
  const panels: LCPanel[] = CASES.map((c) => {
    const all = CANDLES[c.key];
    const closes = all.map((k) => k.c);
    const from = all.length - SHOW;
    const [m20, m50, m200] = [20, 50, 200].map((n) => sma(closes, n).slice(from));
    const v = [m20, m50, m200].map((s) => s[s.length - 1]!);
    // Range : les MM se croisent sans cesse, l'ordre du moment ne veut rien dire
    const order = c.key === "ma-range" ? "MM qui se croisent sans cesse" : v[0] > v[1] && v[1] > v[2] ? "MM20 > MM50 > MM200" : v[0] < v[1] && v[1] < v[2] ? "MM20 < MM50 < MM200" : "Ordre mélangé";
    return {
      key: c.key, title: c.title, decimals: 5, height: 230, candles: all.slice(from),
      series: [
        { key: "mm200", values: m200, tone: "fib", label: "MM200" },
        { key: "mm50", values: m50, tone: "zone", label: "MM50" },
        { key: "mm20", values: m20, tone: "sky", label: "MM20" },
      ],
      chips: [{ label: order, tone: c.key === "ma-bull" ? "bull" : c.key === "ma-bear" ? "bear" : undefined, data: { order } }, { label: c.read }],

    };
  });
  return <LessonChart id="MMHierarchyStackDiagram" title="Lire les 3 MM ensemble" panels={panels} rows={[3]} caption="Un golden cross (MM50 qui passe au-dessus de la MM200) ouvre souvent l'alignement haussier ; un death cross, l'alignement baissier." />;
}
