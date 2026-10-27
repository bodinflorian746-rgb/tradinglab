// Support / résistance 4 bloc 3 — la chasse aux stops institutionnelle (EUR/USD H1), exemple du
// texte : cluster de stops juste au-delà de la résistance (1.1020 → 1.1030, bande fine que la mèche dépasse), la mèche pique dans la
// zone, déclenche les stops, la bougie clôture sous le niveau, puis continuation baissière rapide.
// Mèche et clôture lues sur les bougies. Bougies : scenarios.ts (« hunt-sr4 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { fmtPrice } from "@/lib/lessons/chart-analysis";
import { xauToEur } from "@/lib/lessons/eur-from-xau";
import CANDLES from "@/lib/lessons/generated/candles.json";

const px = (x: number) => fmtPrice(x, 4);

const RES = xauToEur(4720);

export default function StopHuntDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["hunt-sr4"];
  const k = cs.findIndex((x) => x.h > RES);
  const end = cs.length - 1;
  return (
    <LessonChart
      id="StopHuntDiagram"
      title="La mèche déclenche les stops, la clôture rejette"
      caption="Le trade se prend dans le sens opposé au breakout rejeté."
      panels={[{
        key: "h1", title: "EUR/USD H1", decimals: 5, height: 280, candles: cs,
        // Animation : la résistance et les stops au-dessus, la mèche qui les chasse, puis la continuation
        anim: [{ candles: k - 1 }, { show: ["res", "stops"] }, { candles: k }, { show: "k" }, { candles: end }, { show: "end" }],
        zones: [{ key: "stops", y1: RES, y2: xauToEur(4730), from: k - 4, label: `Stops ${px(RES)} → ${px(xauToEur(4730))}`, short: "Stops", tone: "bear" }],
        levels: [{ key: "res", price: RES, to: k, label: `Résistance ${px(RES)}`, short: "Résistance", tone: "zone", role: "resistance" }],
        markers: [
          { key: "k", i: k, price: cs[k].h, label: `Mèche ${px(cs[k].h)}, clôture ${px(cs[k].c)}`, short: "Mèche", tone: "bear", side: "above", role: "sweep", ref: RES, dir: "bear" },
          { key: "end", i: end, price: cs[end].c, label: `Continuation → ${px(cs[end].c)}`, short: "Continuation", tone: "bear", side: "below", role: "close" },
        ],
      }]}
    />
  );
}
