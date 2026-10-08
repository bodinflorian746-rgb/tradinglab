// ICT 1 et ICT 5 — liquidité au-dessus d'equal highs (EUR/USD H1), un seul schéma pour les
// deux leçons (fusion d'IctLiquidityGrab et d'ICTLiquidityPrep) :
// - « prise » (ICT 1, bloc 1) : deux sommets à 1.1780, stops des vendeurs vers
//   1.1790-1.1795, 3e poussée jusqu'à 1.1792 (stops déclenchés), chute vers 1.1720 ;
// - « attente » (ICT 5, bloc 2) : prix actuel 1.1745 sous les equal highs (résistance
//   Daily 1.1780) ; pas de sweep, pas de séquence, on patiente.
// Sommets et creux lus sur les bougies. Bougies : scenarios.ts (« ict-eqh »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const EQH = 1.178;
const STOPS = { y1: 1.179, y2: 1.1795 };

export function IctLiquidityGrabDiagram({ variant = "prise" }: { variant?: "prise" | "attente"; locale?: "fr" | "es" | "en" }) {
  const all = CANDLES["ict-eqh"];
  const tops = pivots(all, 2).filter((q) => q.side === "h" && q.price === EQH).slice(0, 2);
  const sweep = all.findIndex((k, i) => i > tops[1].index && k.h > EQH);
  // « attente » : le graphique s'arrête au prix actuel (1.1745), avant la 3e poussée
  const now = all.findIndex((k, i) => i > tops[1].index && k.c === 1.1745);
  const cs = variant === "attente" ? all.slice(0, now + 1) : all;
  const low = Math.min(...all.slice(sweep).map((k) => k.l));
  const lowAt = all.findIndex((k, i) => i > sweep && k.l === low);
  const common = {
    zones: [{ key: "stops", ...STOPS, from: tops[0].index, label: `Stops des vendeurs ${p(STOPS.y1)}-${p(STOPS.y2)}`, short: "Stops", tone: "bear" as const, kind: "liquidite" }],
    levels: [{ key: "eqh", price: EQH, from: tops[0].index, label: variant === "attente" ? `Equal highs ${p(EQH)} · résistance Daily` : `Equal highs ${p(EQH)}`, short: "Equal highs", tone: "zone" as const }],
  };
  const markers = [
    { key: "t1", i: tops[0].index, price: EQH, label: "Sommet 1", tone: "zone" as const, side: "above" as const },
    { key: "t2", i: tops[1].index, price: EQH, label: "Sommet 2", tone: "zone" as const, side: "above" as const },
  ];
  if (variant === "attente") {
    return (
      <LessonChart
        id="IctLiquidityGrabDiagram"
        title="La liquidité est la cible : on attend qu'elle soit prise"
        caption="Pas de mèche au-dessus de 1.1780 = pas de séquence. On n'anticipe pas la prise."
        panels={[{
          key: "h1", title: "EUR/USD H1, biais Daily baissier", decimals: 5, height: 280, candles: cs, ...common,
          markers: [...markers, { key: "now", i: now, price: cs[now].c, label: `Prix actuel ${p(cs[now].c)}`, short: "Prix actuel", tone: "entry", side: "below" }],
          chips: [{ label: "Sans sweep, on patiente", tone: "zone" }],
        }]}
      />
    );
  }
  return (
    <LessonChart
      id="IctLiquidityGrabDiagram"
      title="Le marché va chercher les stops au-dessus des equal highs"
      caption="La liquidité a été prise : le mouvement réel commence après."
      panels={[{
        key: "h1", title: "EUR/USD H1", decimals: 5, height: 280, candles: cs, ...common,
        markers: [
          ...markers,
          { key: "sweep", i: sweep, price: all[sweep].h, label: `Sweep ${p(all[sweep].h)} : stops déclenchés`, short: `Sweep ${p(all[sweep].h)}`, tone: "bear", side: "above", role: "sweep", ref: EQH, dir: "bear" },
          { key: "low", i: lowAt, price: low, label: `Chute de ${Math.round((all[sweep].h - low) / 0.0001)} pips → ${p(low)}`, short: "Chute", tone: "bear", side: "below", role: "low" },
        ],
      }]}
    />
  );
}
