// Trading Débutant 4 — le spread varie selon l'heure (EUR/USD, heure de Paris, texte de
// la leçon) : 1-2 points aux heures de pointe (9h-17h), 4-8 points la nuit (22h-6h).

import { LessonSchema, Timeline } from "@/app/components/lessons/LessonSchema";

export function SpreadVariationDiagram(_props: { className?: string }) {
  return (
    <LessonSchema
      id="SpreadVariationDiagram"
      title="Le spread EUR/USD sur 24 h"
      caption="Cryptos le week-end : très variable. Paires exotiques (USD/TRY…) : 20 à 100 points."
    >
      <Timeline
        ticks={[0, 6, 9, 17, 22]}
        rows={[
          { label: "Heures de pointe", note: "9h-17h : 1 à 2 points, coût minimal", from: 9, to: 17, tone: "bull" },
          { label: "Nuit", note: "22h-6h : 4 à 8 points, coût plus élevé", from: 22, to: 6, tone: "bear" },
        ]}
      />
    </LessonSchema>
  );
}
