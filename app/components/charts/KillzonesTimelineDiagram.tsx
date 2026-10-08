// ICT 3 — les 3 sessions ICT sur un seul graphique EUR/USD M15 : Asia range étroit (7 bougies),
// London Open sweep + expansion haussière, NY continuation.
// Bougies : scenarios.ts (« killzones-kz »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const ASIA_END = 6, LONDON_START = 7, NY_START = 14;
const ASIA_HIGH = 1.1725, ASIA_LOW = 1.171;

export function KillzonesTimelineDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["killzones-kz"];
  const sweep = cs[LONDON_START].l;
  const peak = Math.max(...cs.slice(LONDON_START).map((k) => k.h));
  const peakAt = cs.findIndex((k, i) => i >= LONDON_START && k.h === peak);
  return (
    <LessonChart
      id="KillzonesTimelineDiagram"
      title="Asia → London → New York"
      caption="80 % des mouvements significatifs se produisent dans 20 % des heures."
      panels={[{
        key: "m15", title: "EUR/USD M15", decimals: 5, height: 280, candles: cs,
        zones: [
          { key: "asia", y1: ASIA_LOW, y2: ASIA_HIGH, from: 0, to: ASIA_END, label: "Range Asia", short: "Asia", tone: "sky" },
        ],
        levels: [
          { key: "asialow", price: ASIA_LOW, to: LONDON_START, label: `Bas Asia ${p(ASIA_LOW)}`, short: "Bas Asia", tone: "zone", dashed: true },
        ],
        markers: [
          { key: "london", i: LONDON_START, price: sweep, label: "London Open : sweep du bas Asia", short: "London : sweep", tone: "bull", side: "below", role: "sweep", ref: ASIA_LOW, dir: "bull" },
          { key: "ny", i: NY_START, price: cs[NY_START].l, label: "NY Open", short: "NY", tone: "entry", side: "below" },
          { key: "peak", i: peakAt, price: peak, label: `Expansion → ${p(peak)}`, short: "Expansion", tone: "bull", side: "above", role: "high" },
        ],
        chips: [
          { label: `Asia : range ${Math.round((ASIA_HIGH - ASIA_LOW) / 0.0001)} pips`, tone: "sky" },
        ],
      }]}
    />
  );
}
