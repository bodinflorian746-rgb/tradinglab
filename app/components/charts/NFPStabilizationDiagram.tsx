// Macro-trading 2 bloc 2 — le retournement apparaît après la stabilisation (XAU/USD M15),
// exemple du texte : après la chute à 4 575 $, quatre bougies M15 impriment des mèches basses
// de 6 à 8 $ sans clôturer sous 4 580 $, le prix se cale entre 4 580 et 4 585 $, puis
// reprise franche vers 4 630 $ dans l'heure. Mèches calculées. Bougies : scenarios.ts (« nfp-stab »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";
import { NFP } from "./NFPHeadlineReactionDiagram";

export function NFPStabilizationDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["nfp-stab"];
  const stab = cs.slice(NFP.impulse + 1, NFP.stabEnd + 1);
  const wicks = stab.map((k) => Math.min(k.o, k.c) - k.l);
  const end = cs.length - 1;
  return (
    <LessonChart
      id="NFPStabilizationDiagram"
      title="Les mèches basses répétées : les vendeurs ont fini"
      caption="Pas de stabilisation visible = pas de setup, quelle que soit l'amplitude initiale."
      panels={[{
        key: "m15", title: "XAU/USD M15, après le NFP", decimals: 0, height: 280, candles: cs,
        zones: [{ key: "base", y1: 4580, y2: 4585, from: NFP.impulse + 1, to: NFP.stabEnd, label: `Base ${usd(4580)}-${usd(4585)}`, short: "Base", tone: "zone" }],
        markers: [
          { key: "stab", i: NFP.impulse + 2, price: Math.min(...stab.map((k) => k.l)), label: "4 mèches basses", tone: "zone", side: "below" },
          { key: "go", i: NFP.stabEnd + 1, price: cs[NFP.stabEnd + 1].c, label: `1re reprise franche : clôture ${usd(cs[NFP.stabEnd + 1].c)}`, short: "Reprise franche", tone: "entry", side: "above", role: "close" },
          { key: "end", i: end, price: cs[end].h, label: `Reprise : ${usd(cs[end].h)}`, short: "Reprise", tone: "bull", side: "above", role: "high" },
        ],
        chips: [{ label: `Mèches basses de ${Math.min(...wicks)} à ${Math.max(...wicks)} $`, tone: "zone" }],
      }]}
    />
  );
}
