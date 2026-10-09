// Trading Intermédiaire 3 — supports et résistances de type demande / offre : le prix
// arrive lentement, forme une base, puis un départ IMPULSIF ; la zone se trace sur les
// bougies de base (du plus bas au plus haut corps pour un support, l'inverse pour une
// résistance), calculée. Le RETEST la confirme : le prix revient dans la zone, rejette et
// repart (règle PO). Bougies : scenarios.ts (« sd-support / -resistance »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import CANDLES from "@/lib/lessons/generated/candles.json";

function panel(key: "sd-support" | "sd-resistance"): LCPanel {
  const cs = CANDLES[key];
  const sup = key === "sd-support";
  // départ impulsif : la 1re bougie dont le corps dépasse 2,5 fois le corps médian
  const bodies = cs.map((k) => Math.abs(k.c - k.o)).sort((a, b) => a - b);
  const med = bodies[Math.floor(bodies.length / 2)];
  const imp = cs.findIndex((k) => Math.abs(k.c - k.o) > 2.5 * med && (sup ? k.c > k.o : k.c < k.o));
  const base = cs.slice(imp - 3, imp);
  const zone = sup
    ? { y1: Math.min(...base.map((k) => k.l)), y2: Math.max(...base.map((k) => Math.max(k.o, k.c))) }
    : { y1: Math.min(...base.map((k) => Math.min(k.o, k.c))), y2: Math.max(...base.map((k) => k.h)) };
  // retest : 1re bougie, après le départ, qui revient dans la zone
  const rt = cs.findIndex((k, i) => i > imp + 1 && (sup ? k.l <= zone.y2 : k.h >= zone.y1));
  return {
    key, title: sup ? "Support (achat)" : "Résistance (vente)",
    subtitle: sup ? "Descente lente, base, départ impulsif haussier" : "Montée lente, base, départ impulsif baissier",
    decimals: 5, height: 250, candles: cs,
    zones: [{ key: "zone", ...zone, from: imp - 3, label: sup ? "Support" : "Résistance", tone: sup ? "bull" : "bear", kind: "zone" }],
    markers: [
      { key: "imp", i: imp, price: sup ? cs[imp].h : cs[imp].l, label: "Départ impulsif (2 bougies)", short: "Départ", tone: sup ? "bull" : "bear", side: sup ? "above" : "below", role: "impulse", span: [imp, imp + 1] },
      { key: "retest", i: rt, price: sup ? cs[rt].l : cs[rt].h, label: sup ? "Retest : rejet haussier" : "Retest : rejet baissier", short: "Retest", tone: "entry", side: sup ? "below" : "above", role: "rejet", ref: "zone", dir: sup ? "bull" : "bear" },
    ],
  };
}

export function SupplyDemandDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonChart
      id="SupplyDemandDiagram"
      title="La zone se trace sur la base, le retest la confirme"
      panels={[panel("sd-support"), panel("sd-resistance")]}
      rows={[2]}
      caption="Le départ impulsif désigne la zone ; le retest la confirme : le prix y revient et réagit."
    />
  );
}
