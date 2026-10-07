// Anatomie d'une bougie (Trading Débutant 3, Price action 1). Les deux bougies de
// l'exemple de Débutant 3 (Bitcoin) : verte O 78 000 · H 79 000 · L 77 500 ·
// C 78 600 ; rouge O 78 600 · H 78 900 · L 77 000 · C 77 400.
// - "anatomie" : nom des 4 valeurs (Open, High, Low, Close) ;
// - "exemple" : les mêmes bougies avec leurs prix.

import { LessonChart, type LCLevel, type LCPanel } from "@/app/components/lessons/LessonChart";
import type { Candle } from "@/lib/lessons/chart-analysis";
import { usd } from "@/app/components/lessons/trade";

const GREEN: Candle = { o: 78000, h: 79000, l: 77500, c: 78600 };
const RED: Candle = { o: 78600, h: 78900, l: 77000, c: 77400 };

function panel(key: string, k: Candle, withPrices: boolean): LCPanel {
  const up = k.c > k.o;
  const name = (n: string, fr: string, v: number) => (withPrices ? `${n} ${usd(v)}` : `${n} — ${fr}`);
  const levels: LCLevel[] = [
    { key: "h", price: k.h, from: 0.5, to: 1, label: name("High", "plus haut", k.h), short: withPrices ? undefined : "High", tone: "neutral" },
    { key: "o", price: k.o, from: 0.5, to: 1, label: name("Open", "ouverture", k.o), short: withPrices ? undefined : "Open", tone: "entry" },
    { key: "c", price: k.c, from: 0.5, to: 1, label: name("Close", "clôture", k.c), short: withPrices ? undefined : "Close", tone: up ? "bull" : "bear" },
    { key: "l", price: k.l, from: 0.5, to: 1, label: name("Low", "plus bas", k.l), short: withPrices ? undefined : "Low", tone: "neutral" },
  ];
  return {
    key, title: up ? "Bougie verte (haussière)" : "Bougie rouge (baissière)",
    decimals: 0, height: 260, candleWidth: 40,
    candles: [k], slots: 2,
    levels,
    chips: [{ label: up ? "Close > Open : les acheteurs ont gagné" : "Close < Open : les vendeurs ont gagné", tone: up ? "bull" : "bear" }],
  };
}

export function CandleAnatomyDiagram({ variant = "anatomie" }: { className?: string; locale?: "fr" | "es" | "en"; variant?: "anatomie" | "exemple" }) {
  const prices = variant === "exemple";
  return (
    <LessonChart
      id={prices ? "CandleExampleDiagram" : "CandleAnatomyDiagram"}
      title={prices ? "Exemple : Bitcoin, une bougie verte puis une bougie rouge" : "Anatomie d'une bougie : 4 valeurs"}
      panels={[panel("verte", GREEN, prices), panel("rouge", RED, prices)]}
      rows={[2]}
      sharedScale
      caption={prices ? undefined : "Corps : de l'ouverture à la clôture. Mèches : jusqu'au plus haut et au plus bas de la période."}
    />
  );
}
