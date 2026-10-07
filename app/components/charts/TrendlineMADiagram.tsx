// Trend-following 2 — trendline + MM. EUR/USD H4 en tendance haussière : la trendline
// relie 3 HL successifs (pivots calculés, alignés) ; MM20 et MM50 calculées sur les
// clôtures (historique complet, fenêtre affichée). La MM20 suit le prix au plus près,
// la MM50 accompagne la trendline : zone défendue dynamique.
// Bougies : scenarios.ts (« tf-trend »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { lineAt, pivots, sma } from "@/lib/lessons/chart-analysis";
import { TRENDLINE_SHOW } from "@/lib/lessons/scenarios-meta";
import CANDLES from "@/lib/lessons/generated/candles.json";

export default function TrendlineMADiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const all = CANDLES["tf-trend"];
  const closes = all.map((k) => k.c);
  const cs = all.slice(TRENDLINE_SHOW);
  const m20 = sma(closes, 20).slice(TRENDLINE_SHOW), m50 = sma(closes, 50).slice(TRENDLINE_SHOW);
  const hls = pivots(cs, 2).filter((q) => q.name === "HL").slice(-3);
  const [a, b] = [hls[0], hls[hls.length - 1]];
  const last = cs.length - 1;
  return (
    <LessonChart
      id="TrendlineMADiagram"
      title="Trendline et moyennes mobiles"
      panels={[{
        key: "h4", subtitle: "EUR/USD H4 — trendline sur 3 HL, MM20 et MM50",
        decimals: 5, height: 300, candles: cs,
        series: [
          { key: "mm50", values: m50, tone: "zone", label: "MM50" },
          { key: "mm20", values: m20, tone: "sky", label: "MM20" },
        ],
        segments: [{ key: "trend", i1: a.index, p1: a.price, i2: last, p2: lineAt(a.index, a.price, b.index, b.price, last), tone: "bull", label: "Trendline (3 HL)", short: "Trendline" }],
        markers: hls.map((q) => ({ key: `hl${q.index}`, i: q.index, price: q.price, label: "HL", pivot: "HL" as const, tone: "bull" as const, side: "below" as const, dot: true })),
      }]}
      caption="Trendline haussière reliée à 3 HL au moins ; la confluence trendline + MM50 forme la zone défendue."
    />
  );
}
