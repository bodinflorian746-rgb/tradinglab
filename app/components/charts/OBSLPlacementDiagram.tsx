// SMC 3 bloc 4 — placement du SL sur un OB haussier (EUR/USD H1, même OB que le plan
// d'exécution) : SL dans la zone (touché par la mèche du retest), SL à la limite (sur la mèche
// extrême, tolérance zéro), SL avec marge de 7 pips au-delà de la mèche extrême (correct).
// Touches calculées sur les bougies. Bougies : scenarios.ts (« smc-ob »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";
import { SMC_OB_MARGIN } from "./OBExecutionPlanDiagram";
import { obLayout } from "./OrderBlockDiagram";

const p = (x: number) => fmtPrice(x, 4);

export default function OBSLPlacementDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["smc-ob"];
  const { obI, ob } = obLayout(cs);
  const retest = cs.findIndex((k, i) => i > obI + 2 && k.l <= ob.y2);
  const inZone = Number(((ob.y1 + ob.y2) / 2).toFixed(5)), atWick = cs[obI].l, margin = Number((cs[obI].l - SMC_OB_MARGIN).toFixed(5));
  const hit = (sl: number) => cs.slice(retest).some((k) => k.l <= sl);
  return (
    <LessonChart
      id="OBSLPlacementDiagram"
      title="Où placer le SL d'un Order Block"
      caption="SL au-delà de la mèche extrême avec 5 à 10 pips de marge, jamais à l'intérieur du corps."
      panels={[{
        key: "h1", title: "EUR/USD H1, OB haussier", decimals: 5, height: 300, candles: cs,
        zones: [{ key: "ob", ...ob, from: obI, label: "Order Block", short: "OB", tone: "zone", kind: "ob", src: `smc-ob:${obI}` }],
        levels: [
          { key: "in", price: inZone, from: obI, label: `✗ SL dans la zone ${p(inZone)}${hit(inZone) ? " : touché" : ""}`, short: "✗ Dans la zone", tone: "bear", dashed: true },
          { key: "at", price: atWick, from: obI, label: `✗ SL à la limite ${p(atWick)}`, short: "✗ À la limite", tone: "zone", dashed: true },
          { key: "ok", price: margin, from: obI, label: `✓ SL avec marge ${p(margin)}`, short: "✓ Avec marge", tone: "bull", dashed: true },
        ],
        markers: [{ key: "retest", i: retest, price: cs[retest].l, label: "Mèche du retest", short: "Retest", tone: "neutral", side: "below" }],
      }]}
    />
  );
}
