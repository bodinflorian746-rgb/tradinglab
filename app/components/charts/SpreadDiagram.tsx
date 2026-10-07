// Trading Débutant 4 — Bid et Ask : deux prix en permanence (exemple du texte :
// EUR/USD Bid 1,0800, Ask 1,0805 → spread de 5 points, calculé).

import { Cards, LessonSchema } from "@/app/components/lessons/LessonSchema";

const BID = 1.08, ASK = 1.0805;
const fr = (x: number) => x.toFixed(4).replace(".", ",");

export function SpreadDiagram(_props: { className?: string }) {
  const spread = Math.round((ASK - BID) / 0.0001);
  return (
    <LessonSchema id="SpreadDiagram" title="Bid, Ask et spread" caption="L'Ask est toujours plus élevé que le Bid : tu achètes plus cher que tu ne pourrais revendre au même instant.">
      <Cards cols={3} items={[
        { tag: "BID", title: "Prix de vente", value: fr(BID), text: "Le moins élevé des deux.", tone: "bear" },
        { tag: "SPREAD", title: "Ask − Bid", value: `${spread} points`, text: "Le coût payé à l'ouverture de chaque trade.", tone: "zone" },
        { tag: "ASK", title: "Prix d'achat", value: fr(ASK), text: "Le plus élevé des deux.", tone: "bull" },
      ]} />
    </LessonSchema>
  );
}
