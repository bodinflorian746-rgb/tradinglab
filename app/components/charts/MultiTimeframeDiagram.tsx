// Deux usages :
// - Intermédiaire 7 (par défaut) — « la même paire, trois histoires » (EUR/USD) : Daily en
//   escalier depuis 3 semaines (HH / HL), H4 qui recule jusqu'à 1.0850 (dernier HL), pin bar
//   haussière M15 au contact de la zone. Bougies : scenarios.ts (« l7-daily / -h4 / -m15 »).
// - Price action 4 bloc 1 (variant « roles ») — lecture top-down Daily → H4 → H1 → M15 et le
//   rôle de chaque unité de temps (schéma de processus, pas de prix).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { Flow, LessonSchema } from "@/app/components/lessons/LessonSchema";
import { fmtPrice, pivots, type Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const ZONE = 1.085;

export function MultiTimeframeDiagram({ variant = "l7" }: { variant?: "l7" | "roles"; className?: string; locale?: "fr" | "es" | "en" }) {
  if (variant === "roles") {
    return (
      <LessonSchema id="MultiTimeframeDiagram" title="Lecture top-down : un rôle par unité de temps" caption="Chaque unité de temps joue un rôle distinct et non interchangeable.">
        <Flow steps={[
          { tag: "DAILY", title: "Biais directionnel", text: "HH / HL haussier ou LH / LL baissier.", tone: "entry" },
          { tag: "H4", title: "Zones majeures", text: "Supports et résistances, lieux potentiels d'entrée.", tone: "zone" },
          { tag: "H1", title: "Alignement", text: "La structure confirme le biais Daily.", tone: "sky" },
          { tag: "M15", title: "Timing", text: "Signal de price action : pin bar, engulfing.", tone: "bull" },
        ]} />
      </LessonSchema>
    );
  }
  const d = CANDLES["l7-daily"] as Candle[], h4 = CANDLES["l7-h4"] as Candle[], m = CANDLES["l7-m15"] as Candle[];
  const named = pivots(d, 2).filter((q) => q.name === "HH" || q.name === "HL");
  const pin = m.reduce((b, k, i) => (k.l < m[b].l ? i : b), 0);
  return (
    <LessonChart
      id="MultiTimeframeDiagram"
      title="La même paire, trois unités de temps"
      caption="Les 3 unités de temps racontent la même histoire : biais, zone, signal."
      panels={[
        {
          key: "d1", title: "Daily : biais haussier", decimals: 5, height: 200, candles: d,
          markers: named.map((q) => ({ key: `p${q.index}`, i: q.index, price: q.price, label: q.name!, pivot: q.name!, tone: "bull" as const, side: q.side === "h" ? "above" as const : "below" as const })),
        },
        {
          key: "h4", title: `H4 : recul vers le dernier HL ${p(ZONE)}`, decimals: 5, height: 200, candles: h4,
          levels: [{ key: "zone", price: ZONE, label: `Dernier HL ${p(ZONE)}`, short: "Dernier HL", tone: "zone" }],
        },
        {
          key: "m15", title: "M15 : pin bar sur la zone", decimals: 5, height: 200, candles: m,
          levels: [{ key: "zone", price: ZONE, label: `Dernier HL ${p(ZONE)}`, short: "Dernier HL", tone: "zone" }],
          markers: [{ key: "pin", i: pin, price: m[pin].l, label: "Pin bar : achat", short: "Pin bar", tone: "bull", side: "below", role: "pinbar", dir: "bull" }],
        },
      ]}
      rows={[1, 1, 1]}
    />
  );
}
