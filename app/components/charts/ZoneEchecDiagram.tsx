// Multi-UT 4 bloc 3 — une zone peut échouer (XAU/USD M5), exemple du texte : support H1 à
// 4 545 $, prouvé par deux rebonds ; au passage suivant, le prix traverse la bande sans aucune
// mèche basse de rejet, dans une séquence baissière franche, et continue nettement sous la zone.
// Pas de signal = pas d'entrée.
// Mèches calculées. Bougies : scenarios.ts (« zone-fail-xau »).

import { LessonChart } from "@/app/components/lessons/LessonChart";
import { usd } from "@/app/components/lessons/trade";
import CANDLES from "@/lib/lessons/generated/candles.json";

const Z = { y1: 4540, y2: 4550 };

export function ZoneEchecDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  const cs = CANDLES["zone-fail-xau"];
  // traversée : depuis le dernier sommet (plus bas au-dessus de 4 570), les bougies qui touchent la bande
  const top = cs.reduce((b, k, i) => (k.l > Z.y2 + 20 ? i : b), 0);
  const inZone = cs.map((k, i) => (i > top && k.l <= Z.y2 && k.h >= Z.y1 ? i : -1)).filter((i) => i >= 0);
  // rebonds antérieurs : plus bas dans la bande, suivis d'une remontée nette
  const bounces = cs.map((k, i) => i).filter((i) => i < top && cs[i].l <= Z.y2 && cs[i].l >= Z.y1 && cs[i].c > cs[i].o);
  const maxWick = Math.max(...inZone.map((i) => Math.min(cs[i].o, cs[i].c) - cs[i].l));
  const last = cs.length - 1;
  return (
    <LessonChart
      id="ZoneEchecDiagram"
      title="Une zone traversée sans réaction"
      caption="L'absence de réaction est elle-même un signal : pas d'entrée, on attend la zone suivante."
      panels={[{
        key: "m5", title: "XAU/USD M5", decimals: 0, height: 260, candles: cs,
        zones: [{ key: "sup", ...Z, label: `Support H1 ${usd(4545)}`, short: "Support H1", tone: "zone" }],
        markers: [
          ...bounces.map((i, n) => ({ key: `b${n + 1}`, i, price: cs[i].l, label: `Rebond ${n + 1}`, tone: "bull" as const, side: "below" as const, role: "low" as const })),
          { key: "cross", i: inZone[1], price: cs[inZone[1]].l, label: "Aucune mèche basse", short: "Pas de rejet", tone: "bear", side: "below" },
          { key: "end", i: last, price: cs[last].c, label: `Continuation : clôture ${usd(cs[last].c)}`, short: "Continuation", tone: "bear", side: "below", role: "close" },
        ],
        chips: [{ label: `Mèches basses dans la zone : ${usd(maxWick)} au plus`, tone: "bear" }],
      }]}
    />
  );
}
