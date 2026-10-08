// Price action 2 bloc 1 — valider une pin bar (XAU/USD H4) avec les critères chiffrés du texte :
// ratio mèche / corps ≥ 2:1 (idéalement 3:1), mèche longue en bas pour une pin bar haussière,
// clôture dans le tiers haut, contact avec un niveau. Quatre candidates : la 1re remplit tout,
// chacune des autres rate un critère. Ratio, tiers de clôture et contact calculés.
// Bougies : scenarios.ts (« pin-case-… »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import type { Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const SUPPORT = 4500;
const fr = (x: number) => x.toLocaleString("fr-FR", { maximumFractionDigits: 1 });

export function pinCheck(k: Candle, level?: number) {
  const body = Math.abs(k.c - k.o) || 1;
  const ratio = (Math.min(k.o, k.c) - k.l) / body;
  const closePos = (k.c - k.l) / (k.h - k.l);
  const touch = level !== undefined && k.l <= level && Math.min(k.o, k.c) >= level;
  return { ratio, top: closePos >= 2 / 3, touch, ok: ratio >= 2 && closePos >= 2 / 3 && touch };
}

const CASES = [
  { key: "valide", title: "✓ Pin bar valide", level: SUPPORT },
  { key: "ratio", title: "✗ Mèche trop courte", level: SUPPORT },
  { key: "cloture", title: "✗ Clôture au milieu", level: SUPPORT },
  { key: "niveau", title: "✗ Aucun niveau", level: undefined },
] as const;

export default function PinBarValidationGridDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const panels: LCPanel[] = CASES.map(({ key, title, level }) => {
    const cs = CANDLES[`pin-case-${key}` as "pin-case-valide"] as Candle[];
    const i = cs.length - 1, r = pinCheck(cs[i], level);
    return {
      key, title, decimals: 0, height: 180, candles: cs,
      subtitle: `Ratio ${fr(r.ratio)}:1 · clôture ${r.top ? "tiers haut" : "hors tiers haut"} · ${r.touch ? "niveau touché" : "milieu de range"}`,
      levels: level ? [{ key: "sup", price: level, label: `Support ${usd(level)}`, short: "Support", tone: "zone" as const }] : [],
      markers: [{ key: "pin", i, price: cs[i].l, label: r.ok ? "Tradable" : "Pas de setup", tone: r.ok ? "bull" as const : "bear" as const, side: "below" as const }],
    };
  });
  return (
    <LessonChart
      id="PinBarValidationGridDiagram"
      title="Une pin bar tradable remplit les 4 critères"
      caption="Ratio mèche / corps ≥ 2:1, mèche du bon côté, clôture dans le tiers opposé, contact avec un niveau."
      panels={panels}
      rows={[2, 2]}
    />
  );
}
