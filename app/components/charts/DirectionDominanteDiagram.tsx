// Multi-UT 2 bloc 2 — lire la direction dominante (XAU/USD H4), exemple du texte : chutes
// agressives de 35 à 40 $, corrections haussières lentes, rebonds qui s'arrêtent de plus en plus
// bas (LH 4 666 $ puis 4 645 $, lus sur les bougies).
// Amplitudes calculées sur les bougies. Bougies : scenarios.ts (« dir-dom-xau »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";

/** Chutes : [bougie de départ (sommet de correction), dernière bougie de la chute] */
const DROPS: [number, number][] = [[0, 2], [6, 8], [12, 14]];
/** Sommets des rebonds (vrais swings, de plus en plus bas) */
const LH = [6, 12];

export function DirectionDominanteDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["dir-dom-xau"];
  const drops = DROPS.map(([a, b]) => ({ a, b, size: cs[a].c - cs[b].c }));
  return (
    <LessonChart
      id="DirectionDominanteDiagram"
      title="Quelle direction écrase l'autre ?"
      caption="Chutes en 2 bougies, corrections lentes en 4 bougies : les rebonds locaux ne changent rien, les chutes dominent."
      panels={[{
        key: "h4", title: "XAU/USD H4", decimals: 0, height: 280, candles: cs,
        markers: [
          ...drops.map((d) => ({ key: `d${d.a}`, i: d.b, price: cs[d.b].l, label: `Chute −${usd(d.size)}`, tone: "bear" as const, side: "below" as const })),
          // sommets des rebonds, plus bas à chaque fois
          ...LH.map((i) => ({ key: `lh${i}`, i, price: cs[i].h, label: `LH ${usd(cs[i].h)}`, short: "LH", tone: "bear" as const, side: "above" as const, role: "high" as const })),
        ],
      }]}
    />
  );
}
