// Multi-UT 5 bloc 2 — le Daily donne la direction (EUR/USD), exemple et plan du texte : trois
// LH consécutifs (1.1860, 1.1830, 1.1780) sous la résistance 1.1860, impulsions baissières
// franches entre chaque correction, dernier LL 1.1695 (objectif du plan). Pivots calculés.
// Bougies : scenarios.ts (« daily-ctx »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice, pivots } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const p = (x: number) => fmtPrice(x, 4);

export function DailyContextDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["daily-ctx"];
  const named = pivots(cs, 2).filter((q) => q.name === "LH" || q.name === "LL");
  const lastLL = named.filter((q) => q.name === "LL").at(-1)!;
  return (
    <LessonChart
      id="DailyContextDiagram"
      title="Trois LH sous la résistance : biais vendeur"
      caption="Tant que la structure Daily n'est pas cassée, le biais reste le même : uniquement des ventes."
      panels={[{
        key: "d1", title: "EUR/USD Daily", decimals: 5, height: 280, candles: cs,
        levels: [
          { key: "res", price: 1.186, label: `Résistance ${p(1.186)}`, short: "Résistance", tone: "zone" },
          { key: "ll", price: lastLL.price, from: lastLL.index, label: `Dernier LL ${p(lastLL.price)}`, short: "Dernier LL", tone: "neutral", dashed: true },
        ],
        markers: named.map((q) => ({ key: `p${q.index}`, i: q.index, price: q.price, label: q.name === "LH" ? `LH ${p(q.price)}` : "LL", short: q.name!, pivot: q.name!, tone: "bear" as const, side: q.side === "h" ? "above" as const : "below" as const })),
      }]}
    />
  );
}
