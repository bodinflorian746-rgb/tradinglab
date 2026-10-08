// Multi-UT 1 bloc 4 — l'unité de temps intermédiaire trouve la zone (process, étape 2) :
// EUR/USD H1, zone 1.1765-1.1780 = ancien support devenu résistance, rejet déjà observé,
// puis retour du prix dans la zone : on surveille un signal vendeur sur l'UT inférieure.
// Bougies : scenarios.ts (« inter-zone-h1 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const Z = { y1: 1.1765, y2: 1.178 };

export function IntermediateZoneDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["inter-zone-h1"];
  const brk = cs.findIndex((k) => k.c < Z.y1);
  const rej = cs.findIndex((k, i) => i > brk && k.h >= Z.y1 && k.c < k.o);
  const last = cs.length - 1;
  return (
    <LessonChart
      id="IntermediateZoneDiagram"
      title="L'UT supérieure dit « vendre », le H1 dit « où »"
      caption="On attend le retour du prix dans la zone, jamais d'entrée « au milieu du vide »."
      panels={[{
        key: "h1", title: "EUR/USD H1", decimals: 5, height: 280, candles: cs,
        zones: [{ key: "zone", ...Z, label: `Zone ${p(Z.y1)}-${p(Z.y2)}`, short: "Zone H1", tone: "zone" }],
        markers: [
          { key: "brk", i: brk, price: cs[brk].c, label: "Clôture sous la zone : support cassé", short: "Support cassé", tone: "bear", side: "below", role: "close" },
          { key: "rej", i: rej, price: cs[rej].h, label: "Rejet", tone: "bear", side: "above", role: "rejet", ref: "zone", dir: "bear" },
          { key: "back", i: last, price: cs[last].h, label: "Retour dans la zone", short: "Retour", tone: "entry", side: "above" },
        ],
        chips: [{ label: "Ancien support devenu résistance", tone: "zone" }],
      }]}
    />
  );
}
