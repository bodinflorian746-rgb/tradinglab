// Reversal 4 bloc 2 — la checklist d'invalidation : les 5 critères du texte ; un seul allumé
// déclenche la sortie (le 5e impose au minimum un SL au break-even). Schéma de règles.

import { Checklist, LessonSchema } from "@/app/components/lessons/LessonSchema";

export default function InvalidationTriggersGridDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonSchema id="InvalidationTriggersGridDiagram" title="5 critères qui déclenchent la coupe" caption="Un seul critère allumé suffit. Pas de débat, pas d'attente d'une bougie supplémentaire.">
      <Checklist items={[
        { ok: false, title: "1. Breakout rejeté", text: "Re-clôture de l'autre côté de la ligne de cou dans les 1 à 3 bougies après l'entrée." },
        { ok: false, title: "2. Bougie de rejet violente", text: "Une grosse bougie qui englobe les 2 ou 3 bougies précédentes : absorption." },
        { ok: false, title: "3. Volume incohérent", text: "Breakout sans volume, reprise avec gros volume : lecture inversée." },
        { ok: false, title: "4. News imprévue", text: "Fed minutes, géopolitique, donnée inattendue pendant le trade : sortie par précaution." },
        { ok: false, title: "5. Temps écoulé", text: "5 à 8 bougies (H1 ou H4) sans progression vers le TP : SL au break-even au minimum." },
      ]} />
    </LessonSchema>
  );
}
