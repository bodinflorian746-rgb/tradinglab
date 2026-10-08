// Trading Intermédiaire 3 — supports et résistances de type demande / offre : le prix
// arrive lentement, forme une base, puis un départ IMPULSIF ; la zone se trace sur les
// bougies de base (du plus bas au plus haut corps pour un support, l'inverse pour une
// résistance), calculée ; le prix y revient. Bougies : scenarios.ts (« sd-support / -resistance »).

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
  const last = cs.length - 1;
  return {
    key, title: sup ? "Support (achat)" : "Résistance (vente)",
    subtitle: sup ? "Descente lente, base, départ impulsif haussier" : "Montée lente, base, départ impulsif baissier",
    decimals: 5, height: 250, candles: cs,
    zones: [{ key: "zone", ...zone, from: imp - 3, label: sup ? "Support" : "Résistance", tone: sup ? "bull" : "bear", kind: "zone" }],
    markers: [
      { key: "imp", i: imp, price: sup ? cs[imp].h : cs[imp].l, label: "Départ impulsif (2 bougies)", short: "Départ", tone: sup ? "bull" : "bear", side: sup ? "above" : "below", role: "impulse", span: [imp, imp + 1] },
      { key: "retour", i: last, price: sup ? cs[last].l : cs[last].h, label: "Retour dans la zone", short: "Retour", tone: "entry", side: sup ? "below" : "above", role: sup ? "low" : "high" },
    ],
  };
}

export function SupplyDemandDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonChart
      id="SupplyDemandDiagram"
      title="La zone se trace sur la base, avant le départ impulsif"
      panels={[panel("sd-support"), panel("sd-resistance")]}
      rows={[2]}
      caption="Au retour du prix, les ordres restants des institutions se déclenchent dans la zone."
    />
  );
}
