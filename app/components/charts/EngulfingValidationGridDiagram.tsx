// Price action 3 bloc 2 — valider un engulfing (XAU/USD H4) avec les 4 critères du texte : le
// corps de la 2e bougie englobe entièrement celui de la 1re, couleurs opposées, 2e bougie
// clairement plus grande, amplitude supérieure à la moyenne des 20 bougies précédentes.
// Mêmes 20 bougies de contexte, quatre paires : seule la 1re passe tout. Critères calculés.
// Bougies : scenarios.ts (« eng-case-… »).

import { LessonChart, type LCPanel } from "@/app/components/lessons/LessonChart";
import type { Candle } from "@/lib/lessons/chart-analysis";
import CANDLES from "@/lib/lessons/generated/candles.json";

const fr = (x: number) => x.toLocaleString("fr-FR", { maximumFractionDigits: 2 });

export function engulfCheck(cs: Candle[]) {
  const b = cs[cs.length - 1], a = cs[cs.length - 2];
  const prev = cs.slice(-22, -2);
  const avg = prev.reduce((s, k) => s + (k.h - k.l), 0) / prev.length;
  const covers = Math.min(b.o, b.c) <= Math.min(a.o, a.c) && Math.max(b.o, b.c) >= Math.max(a.o, a.c);
  const opposite = Math.sign(b.c - b.o) === -Math.sign(a.c - a.o);
  const contrast = Math.abs(b.c - b.o) / Math.abs(a.c - a.o);
  const range = b.h - b.l;
  return { covers, opposite, contrast, range, avg, ok: covers && opposite && contrast >= 1.5 && range > avg };
}

const CASES = [
  { key: "valide", title: "✓ Engulfing valide" },
  { key: "partiel", title: "✗ Corps pas englobé" },
  { key: "contraste", title: "✗ À peine plus grande" },
  { key: "amplitude", title: "✗ Amplitude trop faible" },
] as const;

export default function EngulfingValidationGridDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const panels: LCPanel[] = CASES.map(({ key, title }) => {
    const cs = CANDLES[`eng-case-${key}` as "eng-case-valide"] as Candle[];
    const r = engulfCheck(cs), i = cs.length - 1;
    return {
      key, title, decimals: 0, height: 180, candles: cs,
      subtitle: `${r.covers ? "Englobe" : "N'englobe pas"} · ${fr(r.contrast)} × · amplitude ${Math.round(r.range)} $ (moyenne ${fr(r.avg)} $)`,
      markers: [{ key: "pair", i, price: cs[i].h, label: r.ok ? "Tradable" : "Pas de setup", tone: r.ok ? "bull" as const : "bear" as const, side: "above" as const, ...(r.ok ? { role: "engulfing" as const } : {}) }],
    };
  });
  return (
    <LessonChart
      id="EngulfingValidationGridDiagram"
      title="Un engulfing tradable remplit les 4 critères"
      caption="Corps entièrement englobé, couleurs opposées, vrai contraste de taille, amplitude au-dessus de la moyenne des 20 bougies précédentes."
      panels={panels}
      rows={[2, 2]}
    />
  );
}
