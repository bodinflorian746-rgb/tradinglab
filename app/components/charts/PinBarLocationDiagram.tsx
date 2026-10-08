// Price action 2 — la pin bar a besoin d'un niveau. XAU/USD H4, range 4 500$-4 650$ :
// pin bar baissière au plus haut (tradable), pin bar en milieu de range (ignorée : le
// prix continue), pin bar haussière au plus bas (tradable). Aucun sommet ne dépasse
// la résistance. Bougies : scenarios.ts (« pin-location »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import CANDLES from "@/lib/lessons/generated/candles.json";

export default function PinBarLocationDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["pin-location"];
  const top = cs.findIndex((k) => k.h === 4650);
  const bottom = cs.findIndex((k) => k.l === 4500);
  const mid = cs.findIndex((k, i) => i > top && i < bottom && k.l === 4562);
  return (
    <LessonChart
      id="PinBarLocationDiagram"
      title="Le niveau, pas la bougie"
      panels={[{
        key: "h4", subtitle: "XAU/USD H4 — range entre 4 500$ et 4 650$",
        decimals: 1, height: 300, candles: cs,
        levels: [
          { key: "res", price: 4650, label: "Résistance 4 650$", short: "Résistance", tone: "bear", dashed: true, role: "range-high" },
          { key: "sup", price: 4500, label: "Support 4 500$", short: "Support", tone: "bull", dashed: true, role: "range-low" },
        ],
        markers: [
          { key: "top", i: top, price: cs[top].h, label: "Pin bar baissière : tradable", short: "Tradable", tone: "bear", side: "above", role: "pinbar", dir: "bear" },
          { key: "mid", i: mid, price: cs[mid].l, label: "Milieu de range : ignorer", short: "Ignorer", tone: "neutral", side: "below", role: "pinbar", dir: "bull" },
          { key: "bottom", i: bottom, price: cs[bottom].l, label: "Pin bar haussière : tradable", short: "Tradable", tone: "bull", side: "below", role: "pinbar", dir: "bull" },
        ],
      }]}
      caption="Pin bar = signal de confirmation à un niveau. Sans niveau, c'est du bruit."
    />
  );
}
