// Price action 2 — la pin bar a besoin d'un niveau. EUR/USD H4, range 1.0800-1.0950 (décision PO 9) :
// pin bar baissière au plus haut (tradable), pin bar en milieu de range (ignorée : le
// prix continue), pin bar haussière au plus bas (tradable). Aucun sommet ne dépasse
// la résistance. Bougies : scenarios.ts (« pin-location »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import { xauToEur } from "@/lib/lessons/eur-from-xau";
import CANDLES from "@/lib/lessons/generated/candles.json";

const SUP = xauToEur(4500), RES = xauToEur(4650);
const p = (x: number) => fmtPrice(x, 4);

export default function PinBarLocationDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["pin-location"];
  const top = cs.findIndex((k) => k.h === RES);
  const bottom = cs.findIndex((k) => k.l === SUP);
  const mid = cs.findIndex((k, i) => i > top && i < bottom && k.l === xauToEur(4562));
  return (
    <LessonChart
      id="PinBarLocationDiagram"
      title="Le niveau, pas la bougie"
      panels={[{
        key: "h4", subtitle: `EUR/USD H4 — range entre ${p(SUP)} et ${p(RES)}`,
        decimals: 5, height: 300, candles: cs,
        levels: [
          { key: "res", price: RES, label: `Résistance ${p(RES)}`, short: "Résistance", tone: "bear", dashed: true, role: "range-high" },
          { key: "sup", price: SUP, label: `Support ${p(SUP)}`, short: "Support", tone: "bull", dashed: true, role: "range-low" },
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
