// Price action 2 — plan de trade : pin bar haussière sur le support 4 500$,
// XAU/USD H4 en tendance haussière. Entrée 4 520$ (clôture de la pin bar), SL
// 4 470$ (sous la mèche, marge incluse), TP 4 650$ (résistance H4 suivante).
// Bougies : lib/lessons/scenarios.ts (« pinbar-setup ») ; R/R calculé.

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { tradeSetup } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";

export default function PinBarSetupDiagram(_props: { locale?: "fr" | "es" | "en" } = {}) {
  const candles = CANDLES["pinbar-setup"];
  const pin = candles.length - 1;
  const k = candles[pin];
  const t = tradeSetup({ entry: k.c, sl: 4470, tp: 4650, unit: "$", names: { tp: "TP résistance" }, from: pin - 1 });
  return (
    <LessonChart
      id="PinBarSetupDiagram"
      title="Pin bar haussière sur le support 4 500$"
      panels={[{
        key: "h4", subtitle: "XAU/USD H4 — tendance haussière, support touché 3 fois en 6 semaines",
        decimals: 1, height: 320, candles,
        levels: [{ key: "support", price: 4500, label: "Support 4 500$", short: "Support", tone: "bull", dashed: true, faint: true }, ...t.levels],
        markers: [{ key: "pin", i: pin, price: k.l, label: "Pin bar", tone: "bull", side: "below" }],
        chips: t.chips,
      }]}
      caption="Entrée à la clôture de la pin bar, SL sous sa mèche basse avec une marge."
    />
  );
}
