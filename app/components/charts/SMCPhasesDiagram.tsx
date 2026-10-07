// SMC 1 — les 3 phases : accumulation (range après une baisse), manipulation (sweep
// sous le range, mèche qui perce puis retour dedans), expansion haussière (HH / HL).
// Une expansion haussière suit un sweep du BAS du range. EUR/USD H4,
// bougies : scenarios.ts (« smc-phases »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import CANDLES from "@/lib/lessons/generated/candles.json";

const RANGE = { y1: 1.1760, y2: 1.1800 };

export default function SMCPhasesDiagram(_props: { className?: string }) {
  const cs = CANDLES["smc-phases"];
  const start = cs.findIndex((k) => k.l <= RANGE.y1);
  const sweep = cs.reduce((b, k, i) => (k.l < cs[b].l ? i : b), 0);
  const out = cs.findIndex((k, i) => i > sweep && k.c > RANGE.y2);
  const last = cs.length - 1;
  return (
    <LessonChart
      id="SMCPhasesDiagram"
      title="Accumulation, manipulation, expansion"
      panels={[{
        key: "h4", subtitle: "EUR/USD H4 — range après une baisse, sweep du bas, expansion haussière",
        decimals: 5, height: 300, candles: cs,
        zones: [{ key: "range", ...RANGE, from: start, to: out, label: "Accumulation", tone: "neutral", kind: "range" }],
        markers: [
          { key: "sweep", i: sweep, price: cs[sweep].l, label: "Manipulation : sweep", short: "Sweep", tone: "zone", side: "below" },
          { key: "exp", i: last, price: cs[last].h, label: "Expansion", tone: "bull", side: "above" },
        ],
        chips: [
          { label: "1 · Accumulation : range latéral, amplitude réduite" },
          { label: "2 · Manipulation : la mèche perce, retour dans le range", tone: "zone" },
          { label: "3 · Expansion : tendance nette HH / HL", tone: "bull" },
        ],
      }]}
    />
  );
}
