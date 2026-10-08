// Multi-UT 1 bloc 1 — piège du graphique unique : le même EUR/USD vu sur deux échelles.
// Panneau H4 : LH/LL baissier, résistance 1.1780. Panneau M15 : breakout haussier local
// à 1.1775 (techniquement valide), puis chute vers 1.1700. Le M15 montrait un retracement.
// Bougies : scenarios.ts (« htf-bear-h4 » et « trap-m15 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const RES = 1.178;

export function SingleTimeframeTrapDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const h4 = CANDLES["htf-bear-h4"] as Candle[], m15 = CANDLES["trap-m15"] as Candle[];
  const m15Peak = m15.reduce((b, k, i) => (k.h > m15[b].h ? i : b), 0);
  const m15Low = Math.min(...m15.map((k) => k.l));
  const m15LowAt = m15.findIndex((k) => k.l === m15Low);
  return (
    <LessonChart
      id="SingleTimeframeTrapDiagram"
      title="Le piège du graphique unique"
      caption="Un signal M15 techniquement valide peut n'être qu'un retracement dans la tendance H4. L'UT supérieure prime toujours."
      panels={[
        {
          key: "h4", title: "EUR/USD H4 — structure LH/LL baissière", decimals: 5, height: 240, candles: h4,
          levels: [{ key: "res", price: RES, label: `Résistance HTF ${p(RES)}`, short: "Résistance", tone: "zone", dashed: true }],
          chips: [{ label: "Biais HTF : ventes prioritaires", tone: "bear" }],
        },
        {
          key: "m15", title: "EUR/USD M15 — breakout « propre » → piège", decimals: 5, height: 240, candles: m15,
          levels: [{ key: "res", price: RES, label: `Résistance ${p(RES)}`, short: "Résistance", tone: "zone", dashed: true }],
          markers: [
            { key: "peak", i: m15Peak, price: m15[m15Peak].h, label: `Breakout ${p(m15[m15Peak].h)}`, short: "Breakout", tone: "bull", side: "above" },
            { key: "low", i: m15LowAt, price: m15Low, label: p(m15Low), tone: "bear", side: "below" },
          ],
          chips: [{ label: "Retournement sur la résistance HTF", tone: "bear" }],
        },
      ]}
      rows={[1, 1]}
      sharedScale
    />
  );
}
