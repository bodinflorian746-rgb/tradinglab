// Price action 1 bloc 2 — reconnaître les 4 types clés (XAU/USD H1), chacun dans un court
// contexte : marubozu (grand corps, pas de mèche) dans une impulsion, pin bar (corps réduit +
// longue mèche) sur un creux, doji (corps quasi inexistant) au sommet, engulfing (le corps
// englobe la bougie précédente). Proportions calculées sur les bougies.
// Bougies : scenarios.ts (« pa-type-… »).

import { LessonChart, type LCMarker, type LCPanel } from "@/app/components/lessons/LessonChart";
import type { Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const body = (k: Candle) => Math.abs(k.c - k.o);
const pct = (a: number, b: number) => `${Math.round((a / b) * 100)} %`;

export default function CandleStrengthComparisonDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const C = (k: string) => CANDLES[`pa-type-${k}` as "pa-type-marubozu"] as Candle[];
  const m = C("marubozu"), p = C("pinbar"), d = C("doji"), e = C("engulfing");
  const mi = 4, pi = 3, di = 3, ei = 4;
  const panel = (key: string, title: string, subtitle: string, cs: Candle[], i: number, label: string, side: "above" | "below", sem: Pick<LCMarker, "role" | "dir"> = {}): LCPanel => ({
    key, title, subtitle, decimals: 0, height: 170, candles: cs,
    markers: [{ key: "k", i, price: side === "above" ? cs[i].h : cs[i].l, label, tone: "entry", side, ...sem }],
  });
  const wick = Math.min(p[pi].o, p[pi].c) - p[pi].l;
  return (
    <LessonChart
      id="CandleStrengthComparisonDiagram"
      title="Les 4 types clés"
      caption="Une même bougie n'a pas la même valeur selon son contexte : lis toujours les bougies voisines."
      panels={[
        panel("marubozu", "Marubozu", "Conviction maximale, continuation", m, mi, `Corps = ${pct(body(m[mi]), m[mi].h - m[mi].l)} de la bougie`, "above"),
        panel("pinbar", "Pin bar", "Rejet de niveau, retournement local", p, pi, `Mèche = ${(wick / body(p[pi])).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} × le corps`, "below", { role: "pinbar", dir: "bull" }),
        panel("doji", "Doji", "Indécision, attente", d, di, `Corps = ${pct(body(d[di]), d[di].h - d[di].l)} de la bougie`, "above"),
        panel("engulfing", "Engulfing", "Bascule de pouvoir nette", e, ei, `Corps ${(body(e[ei]) / body(e[ei - 1])).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} × plus grand`, "below", { role: "engulfing" }),
      ]}
      rows={[2, 2]}
    />
  );
}
