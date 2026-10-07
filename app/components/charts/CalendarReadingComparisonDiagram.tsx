// Macro Intermédiaire 2 — lire un calendrier, débutant vs pro, sur l'exemple de la leçon :
// NFP 205k pour 200k attendus (écart minime), mais le mois précédent est révisé de 170k
// à 250k : le marché du travail est plus fort que prévu, le dollar monte.

import { Cards, LessonSchema } from "@/app/components/lessons/LessonSchema";

export const CalendarReadingComparisonDiagram = (_props: { locale?: "fr" | "es" | "en" } = {}) => (
  <LessonSchema id="CalendarReadingComparisonDiagram" title="Le même NFP, deux lectures" caption="Le calendrier ne te donne pas une alerte. Il te donne une carte.">
    <Cards cols={2} items={[
      {
        tag: "LECTURE DÉBUTANT", title: "Je vois une news importante.", tone: "bear",
        items: ["NFP réel : 205k", "Consensus : 200k", "→ « Rien de spécial », je sais juste qu'il y a un risque."],
      },
      {
        tag: "LECTURE PRO", title: "Je lis le contexte complet.", tone: "bull",
        items: ["Réel 205k, consensus 200k : écart minime", "Mois précédent révisé de 170k à 250k : révision forte", "→ Le marché du travail est plus fort que prévu : dollar ↑, EUR/USD ↓"],
      },
    ]} />
  </LessonSchema>
);
