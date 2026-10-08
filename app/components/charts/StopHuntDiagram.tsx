// Support / résistance 4 bloc 3 — la chasse aux stops institutionnelle (XAU/USD H1), exemple du
// texte : cluster de stops juste au-delà de la résistance (4 720 → 4 745 $), la mèche pique dans la
// zone, déclenche les stops, la bougie clôture sous le niveau, puis continuation baissière rapide.
// Mèche et clôture lues sur les bougies. Bougies : scenarios.ts (« hunt-sr4 »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";

const RES = 4720;

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
        key: "h1", title: "XAU/USD H1", decimals: 0, height: 280, candles: cs,
        zones: [{ key: "stops", y1: RES, y2: 4745, from: k - 4, label: `Stops ${usd(RES)} → ${usd(4745)}`, short: "Stops", tone: "bear" }],
        levels: [{ key: "res", price: RES, to: k, label: `Résistance ${usd(RES)}`, short: "Résistance", tone: "zone" }],
        markers: [
          { key: "k", i: k, price: cs[k].h, label: `Mèche ${usd(cs[k].h)}, clôture ${usd(cs[k].c)}`, short: "Mèche", tone: "bear", side: "above" },
          { key: "end", i: end, price: cs[end].l, label: usd(cs[end].c), tone: "bear", side: "below" },
        ],
      }]}
    />
  );
}
