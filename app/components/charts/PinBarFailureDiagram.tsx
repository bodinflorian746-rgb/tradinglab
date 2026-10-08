// Price action 2 — quand le setup échoue : la pin bar du plan (support 4 500$, entrée
// 4 520$, SL 4 470$ sous la mèche avec marge) ; le marché casse le support, le SL est
// touché, la perte reste bornée à 1R. Bougies : scenarios.ts (« pinbar-failure »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";

const ENTRY = 4520, SL = 4470;

export default function PinBarFailureDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["pinbar-failure"];
  const pin = cs.findIndex((k) => k.c === ENTRY && k.l < 4500);
  const bo = cs.findIndex((k, i) => i > pin && k.c < 4500);
  const hit = cs.findIndex((k, i) => i > pin && k.l <= SL);
  return (
    <LessonChart
      id="PinBarFailureDiagram"
      title="Quand le setup échoue, le SL borne la perte"
      panels={[{
        key: "h4", subtitle: "XAU/USD H4 — la même pin bar valide, puis breakout du support",
        decimals: 1, height: 300, candles: cs,
        levels: [
          { key: "support", price: 4500, to: bo, label: "Support 4 500$", short: "Support", tone: "bull", dashed: true, faint: true },
          { key: "entry", price: ENTRY, from: pin, label: `Entrée ${usd(ENTRY)}`, short: "Entrée", tone: "entry" },
          { key: "sl", price: SL, from: pin, to: hit, label: `SL ${usd(SL)} : touché`, short: "SL touché", tone: "bear", dashed: true },
        ],
        markers: [
          { key: "pin", i: pin, price: cs[pin].h, label: "Pin bar", tone: "bull", side: "above", role: "pinbar", dir: "bull" },
          { key: "bo", i: bo, price: cs[bo].c, label: "Clôture sous le support", short: "Support cassé", tone: "bear", side: "above", role: "close" },

        ],
        chips: [{ label: `Perte : ${usd(ENTRY - SL)} = −1R, comme prévu`, tone: "bear" }],
      }]}
      caption="Le niveau cassé invalide le rejet. Le SL au-delà de la mèche, jamais déplacé, limite la perte."
    />
  );
}
