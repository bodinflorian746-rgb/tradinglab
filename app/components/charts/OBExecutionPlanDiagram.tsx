// SMC 3 — plan d'exécution d'un Order Block haussier (EUR/USD H4), les 4 éléments du
// texte : entrée sur la limite haute du corps de l'OB, SL au-delà de la mèche extrême
// avec 7 pips de marge, TP sur le prochain HH (R/R ≥ 1:2), taille de position calculée
// sur la distance entrée-SL. OB = corps de la dernière bougie rouge avant l'impulsion.
// Bougies : scenarios.ts (« smc-ob »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { tradeSetup } from "@/app/components/lessons/trade";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";
import { obLayout } from "./OrderBlockDiagram";

export const SMC_OB_MARGIN = 0.0007;
const p = (x: number) => fmtPrice(x, 4);

export default function OBExecutionPlanDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["smc-ob"];
  const { obI, ob } = obLayout(cs);
  const hhI = cs.reduce((b, k, i) => (i > obI && k.h > cs[b].h ? i : b), obI);
  const retest = cs.findIndex((k, i) => i > hhI && k.l <= ob.y2);
  const sl = Number((cs[obI].l - SMC_OB_MARGIN).toFixed(5));
  const t = tradeSetup({ entry: ob.y2, sl, tp: cs[hhI].h, from: retest, expect: ">2" });
  return (
    <LessonChart
      id="OBExecutionPlanDiagram"
      title="Plan d'exécution d'un Order Block"
      panels={[{
        key: "h4", subtitle: `EUR/USD H4 — OB haussier ${p(ob.y1)}-${p(ob.y2)}, retest après le BOS`,
        decimals: 5, height: 300, candles: cs,
        zones: [{ key: "ob", ...ob, from: obI, label: "Order Block", short: "OB", tone: "zone", kind: "ob", src: `smc-ob:${obI}`, role: "ob", dir: "bull" }],
        levels: t.levels,
        markers: [{ key: "retest", i: retest, price: cs[retest].l, label: "Retest + rejet", short: "Retest", tone: "bull", side: "below", role: "rejet", ref: "ob", dir: "bull" }],
        chips: t.chips,
      }]}
      caption="1 · Entrée sur la limite haute du corps de l'OB. 2 · SL au-delà de la mèche extrême, marge 5-10 pips. 3 · TP : prochain HH, R/R 1:2 minimum. 4 · Taille selon la distance entrée-SL."
    />
  );
}
