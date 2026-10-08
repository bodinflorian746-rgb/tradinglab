// Reversal 3 bloc 3 — les 4 types de divergence du texte : classiques (retournement) et cachées
// (continuation), selon le sens du prix et du RSI. Tableau de classement ; la lecture sur le
// graphique est montrée par RSIDivergenceDiagram.

import { LessonSchema, Matrix } from "@/app/components/lessons/LessonSchema";

export default function DivergenceTypesComparisonDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonSchema id="DivergenceTypesComparisonDiagram" title="Les 4 types de divergence" caption="Les classiques annoncent un retournement ; les cachées, une continuation (à éviter pour un débutant).">
      <Matrix
        head={["Prix", "RSI", "Lecture"]}
        rows={[
          { label: "Classique baissière", cells: [{ text: "HH" }, { text: "LH" }, { text: "Retournement baissier", tone: "bear" }] },
          { label: "Classique haussière", cells: [{ text: "LL" }, { text: "HL" }, { text: "Retournement haussier", tone: "bull" }] },
          { label: "Cachée baissière", cells: [{ text: "LH" }, { text: "HH" }, { text: "Continuation baissière", tone: "zone" }] },
          { label: "Cachée haussière", cells: [{ text: "HL" }, { text: "LL" }, { text: "Continuation haussière", tone: "zone" }] },
        ]}
      />
    </LessonSchema>
  );
}
