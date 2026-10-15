// Price action 2 — quand le setup échoue : la pin bar du plan (EUR/USD, support 1.0800, entrée
// 1.0820, SL 1.0770 sous la mèche avec marge ; décision PO 9) ; le marché casse le support, le SL est
// touché, la perte reste bornée à 1R. Bougies : scenarios.ts (« pinbar-failure »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, pips } from "@/lib/lessons/chart-analysis";
import { xauToEur, EUR_PIP } from "@/lib/lessons/eur-from-xau";
import CANDLES from "@/lib/lessons/generated/candles.json";

const ENTRY = xauToEur(4520), SL = xauToEur(4470), SUP = xauToEur(4500);
const p = (x: number) => fmtPrice(x, 4);

export default function PinBarFailureDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["pinbar-failure"];
  const pin = cs.findIndex((k) => k.c === ENTRY && k.l < SUP);
  const bo = cs.findIndex((k, i) => i > pin && k.c < SUP);
  const hit = cs.findIndex((k, i) => i > pin && k.l <= SL);
  return (
    <LessonChart
      id="PinBarFailureDiagram"
      title="Quand le setup échoue, le SL borne la perte"
      panels={[{
        key: "h4", subtitle: "EUR/USD H4 — la même pin bar valide, puis breakout du support",
        decimals: 5, height: 300, candles: cs,
        levels: [
          { key: "support", price: SUP, to: bo, label: `Support ${p(SUP)}`, short: "Support", tone: "bull", dashed: true, faint: true },
          { key: "entry", price: ENTRY, from: pin, label: `Entrée ${p(ENTRY)}`, short: "Entrée", tone: "entry" },
          { key: "sl", price: SL, from: pin, to: hit, label: `SL ${p(SL)} : touché`, short: "SL touché", tone: "bear", dashed: true },
        ],
        markers: [
          { key: "pin", i: pin, price: cs[pin].h, label: "Pin bar", tone: "bull", side: "above", role: "pinbar", dir: "bull" },
          { key: "bo", i: bo, price: cs[bo].c, label: "Clôture sous le support", short: "Support cassé", tone: "bear", side: "above", role: "close" },

        ],
        chips: [{ label: `Perte : ${pips(ENTRY, SL, EUR_PIP)} pips = −1R, comme prévu`, tone: "bear" }],
      }]}
      caption="Le niveau cassé invalide le rejet. Le SL au-delà de la mèche, jamais déplacé, limite la perte."
    />
  );
}
