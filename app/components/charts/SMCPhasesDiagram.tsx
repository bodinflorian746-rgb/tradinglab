// SMC 1 — les 3 phases : accumulation (range après une baisse, bornes touchées plusieurs fois),
// manipulation (sweep sous le range : la mèche perce, la clôture revient dedans), expansion haussière
// (HH / HL nets). Une expansion haussière suit un sweep du BAS du range. EUR/USD H4,
// bougies : scenarios.ts (« smc-phases ») ; range, sweep et pivots vérifiés par l'audit (rôles).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const RANGE = { y1: 1.1760, y2: 1.1800 };

export default function SMCPhasesDiagram(_props: { className?: string }) {
  const cs = CANDLES["smc-phases"];
  const start = cs.findIndex((k) => k.l <= RANGE.y1);
  const sweep = cs.reduce((b, k, i) => (k.l < cs[b].l ? i : b), 0);
  const out = cs.findIndex((k, i) => i > sweep && k.c > RANGE.y2);
  const trend = pivots(cs, 2).filter((q) => q.index > sweep && (q.name === "HH" || q.name === "HL"));
  return (
    <LessonChart
      id="SMCPhasesDiagram"
      title="Accumulation, manipulation, expansion"
      panels={[{
        key: "h4", subtitle: "EUR/USD H4 — range après une baisse, sweep du bas, expansion haussière",
        decimals: 5, height: 300, candles: cs,
        zones: [{ key: "range", ...RANGE, from: start, to: out, label: "1 · Accumulation : range", short: "1 · Range", tone: "neutral", kind: "range", role: "range" }],
        markers: [
          { key: "sweep", i: sweep, price: cs[sweep].l, label: "2 · Manipulation : sweep du bas", short: "2 · Sweep", tone: "zone", side: "below", role: "sweep", ref: RANGE.y1, dir: "bull" },
          ...trend.map((q, n) => ({
            key: `p${q.index}`, i: q.index, price: q.price, pivot: q.name, tone: "bull" as const, side: q.side === "h" ? "above" as const : "below" as const,
            label: n ? q.name! : `3 · Expansion : ${q.name}`, short: n ? q.name! : `3 · ${q.name}`,
          })),
        ],
      }]}
      caption="Le sweep du bas du range collecte les stops des acheteurs ; l'expansion part dans l'autre sens."
    />
  );
}
