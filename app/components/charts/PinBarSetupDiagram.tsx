// Price action 2 — plan de trade : pin bar haussière sur le support 1.0800,
// EUR/USD H4 en tendance haussière (décision PO 9 : exemple passé de l'or à EUR/USD, eur-from-xau.ts).
// Entrée 1.0820 (clôture de la pin bar), SL 1.0770 (sous la mèche, marge incluse), TP 1.0950
// (résistance H4 suivante).
// Bougies : lib/lessons/scenarios.ts (« pinbar-setup ») ; R/R calculé.

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import { tradeSetup } from "@/app/components/lessons/trade";
import { xauToEur } from "@/lib/lessons/eur-from-xau";
import CANDLES from "@/lib/lessons/generated/candles.json";

const SUPPORT = xauToEur(4500);
const p = (x: number) => fmtPrice(x, 4);

export default function PinBarSetupDiagram(_props: { locale?: "fr" | "es" | "en" } = {}) {
  const candles = CANDLES["pinbar-setup"];
  const pin = candles.length - 1;
  const k = candles[pin];
  const t = tradeSetup({ entry: k.c, sl: xauToEur(4470), tp: xauToEur(4650), names: { tp: "TP résistance" }, from: pin - 1 });
  return (
    <LessonChart
      id="PinBarSetupDiagram"
      title={`Pin bar haussière sur le support ${p(SUPPORT)}`}
      panels={[{
        key: "h4", subtitle: "EUR/USD H4 — tendance haussière, support touché 3 fois en 6 semaines",
        decimals: 5, height: 320, candles,
        // Animation : le support et ses touches, la pin bar au contact, puis le plan
        anim: [{ candles: pin - 1 }, { show: "support" }, { candles: pin }, { show: "pin" }, { show: ["entry", "sl", "tp"] }],
        levels: [{ key: "support", price: SUPPORT, label: `Support ${p(SUPPORT)}`, short: "Support", tone: "bull", dashed: true, faint: true, role: "support" }, ...t.levels],
        markers: [{ key: "pin", i: pin, price: k.l, label: "Pin bar", tone: "bull", side: "below", role: "pinbar", dir: "bull" }],
        chips: t.chips,
      }]}
      caption="Entrée à la clôture de la pin bar, SL sous sa mèche basse avec une marge."
    />
  );
}
