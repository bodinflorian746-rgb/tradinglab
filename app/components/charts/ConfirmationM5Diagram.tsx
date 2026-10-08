// Multi-UT 4 bloc 1 et Multi-UT 5 bloc 4 (fusionné avec M15ValidationDiagram) — l'UT
// inférieure confirme (EUR/USD, M5 en leçon 4, M15 en leçon 5) : dans la zone 1.1750-1.1760,
// trois mèches hautes (jusqu'à 1.1770) sans clôture au-dessus de la zone, creux local 1.1748
// cassé par trois bougies baissières vers 1.1745, retour du prix : short 1.1758, SL 1.1772
// (au-dessus du dernier sommet de rejet), TP 1.1695 (dernier LL Daily). R/R calculé.
// Bougies : scenarios.ts (« ltf-confirm »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { tradeSetup } from "@/app/components/lessons/trade";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);
const Z = { y1: 1.175, y2: 1.176 };
const LOCAL_LOW = 1.1748, ENTRY = 1.1758;

export function ConfirmationM5Diagram({ tf = "M5" }: { tf?: "M5" | "M15"; className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["ltf-confirm"];
  const wicks = cs.map((k, i) => (k.h > Z.y2 && k.c <= Z.y2 ? i : -1)).filter((i) => i >= 0);
  const lowAt = cs.findIndex((k) => k.l === LOCAL_LOW);
  const brk = cs.findIndex((k, i) => i > lowAt && k.c < LOCAL_LOW);
  const entryAt = cs.findIndex((k, i) => i > brk && k.h >= ENTRY);
  const t = tradeSetup({ entry: ENTRY, sl: 1.1772, tp: 1.1695, from: entryAt, tpOffscale: true, names: { tp: "TP dernier LL Daily" } });
  return (
    <LessonChart
      id="ConfirmationM5Diagram"
      title="Réaction dans la zone, breakout, entrée"
      caption="Aucune réaction = aucune entrée. L'UT inférieure ne prédit pas, elle confirme."
      panels={[{
        key: "ltf", title: `EUR/USD ${tf}, dans la zone H1`, decimals: 5, height: 290, candles: cs,
        zones: [{ key: "zone", ...Z, label: `Zone H1 ${p(Z.y1)}-${p(Z.y2)}`, short: "Zone H1", tone: "zone" }],
        levels: [
          { key: "low", price: LOCAL_LOW, from: lowAt, to: brk, label: `Creux local ${p(LOCAL_LOW)}`, short: "Creux local", tone: "neutral", dashed: true },
          ...t.levels,
        ],
        offscale: t.offscale,
        markers: [
          { key: "wicks", i: wicks[1], price: cs[wicks[2]].h, label: `${wicks.length} mèches de rejet`, short: `${wicks.length} rejets`, tone: "bear", side: "above" },
          { key: "brk", i: brk, price: cs[brk].l, label: "Breakout du creux", short: "Breakout", tone: "bear", side: "below" },
        ],
        chips: t.chips,
      }]}
    />
  );
}
