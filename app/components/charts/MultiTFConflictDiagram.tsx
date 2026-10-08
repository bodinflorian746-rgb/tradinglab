// Price action 4 bloc 3 — conflit entre unités de temps : les trois cas du texte, aucun setup
// exploitable tant que l'alignement n'est pas rétabli. Schéma de règles, pas de prix.

import { Cards, LessonSchema } from "@/app/components/lessons/LessonSchema";

export default function MultiTFConflictDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonSchema id="MultiTFConflictDiagram" title="Unités de temps en conflit : pas de trade" caption="La discipline consiste à ne pas trader tant que l'alignement n'est pas rétabli.">
      <Cards cols={3} items={[
        { tag: "DAILY ↑ · H4 ↓", title: "Correction en cours", text: "Attendre la reprise H4.", tone: "zone" },
        { tag: "DAILY ↔", title: "Pas de biais", text: "Consolidation latérale : pas de trade jusqu'à clarification.", tone: "neutral" },
        { tag: "M15 CONTRE DAILY", title: "Bruit de court terme", text: "Ignorer le signal isolé.", tone: "bear" },
      ]} />
    </LessonSchema>
  );
}
