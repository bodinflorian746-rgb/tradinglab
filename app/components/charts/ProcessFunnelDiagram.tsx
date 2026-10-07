// Multi-timeframe 5 — le process multi-unités de temps en entonnoir : chaque étage
// répond à une question et filtre le suivant ; le trade n'arrive qu'au bout.
// Étage d'exécution : M15 / M5 (validation M15 en leçon 5, confirmation M5 en leçon 4).

import { Flow, LessonSchema } from "@/app/components/lessons/LessonSchema";

export function ProcessFunnelDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonSchema id="ProcessFunnelDiagram" title="Le process en entonnoir" caption="L'analyse descend toujours de l'UT supérieure vers l'UT inférieure. Sauter un étage = improviser.">
      <Flow steps={[
        { tag: "DAILY / H4", title: "Où va le marché ?", text: "La direction dominante.", tone: "entry" },
        { tag: "H1", title: "Où peut-il réagir ?", text: "La zone d'intérêt.", tone: "zone" },
        { tag: "M15 / M5", title: "Quand entrer ?", text: "Attendre la réaction dans la zone et confirmer.", tone: "fib" },
        { tag: "TRADE", title: "Aligné sur les 3 étages", text: "Rare, et c'est ce qui en fait un setup haute probabilité.", tone: "bull" },
      ]} />
    </LessonSchema>
  );
}
