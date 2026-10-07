// Macro Intermédiaire 1 — échelle dovish ↔ hawkish. Ce qui compte est la position
// RELATIVE des banques centrales (texte de la leçon). Positions datées : 2022
// (Fed en plein cycle de hausse, BCE plus tardive, BoJ à taux négatifs) ; elles
// changent avec les cycles.

import { LessonSchema, Scale } from "@/app/components/lessons/LessonSchema";

export function HawkishDovishScale(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonSchema
      id="HawkishDovishScale"
      title="Dovish ou hawkish : une position relative"
      caption="Exemple 2022 : Fed plus hawkish que la BCE et la BoJ → dollar fort, EUR/USD et USD/JPY suivent l'écart. Les positions changent à chaque cycle."
    >
      <Scale
        left="Très dovish"
        right="Très hawkish"
        gradient="linear-gradient(90deg, #38bdf8, #9ca0ab, #f59e0b)"
        marks={[
          { pos: 8, label: "BoJ", sub: "taux négatifs, politique très accommodante", tone: "sky" },
          { pos: 62, label: "BCE", sub: "hausse des taux plus tardive", tone: "neutral" },
          { pos: 90, label: "Fed", sub: "hausse rapide des taux contre l'inflation", tone: "zone" },
        ]}
      />
    </LessonSchema>
  );
}
