// ICT 5 bloc 1 — la séquence ICT complète : UT supérieure → Liquidité → Sweep →
// Displacement → FVG → Exécution. Pas de prix : c'est un schéma de processus.

import { Flow, LessonSchema } from "@/app/components/lessons/LessonSchema";

export function ICTSequenceTimelineDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonSchema id="ICTSequenceTimelineDiagram" title="La séquence ICT : 6 étapes" caption="Sauter une étape = retomber dans le trading réactif.">
      <Flow wrap steps={[
        { tag: "1 · UT SUPÉRIEURE", title: "Biais directionnel", text: "Daily / H4 : lire la structure. Sans biais net, on ne descend pas plus bas.", tone: "neutral" },
        { tag: "2 · LIQUIDITÉ", title: "Identifier la cible", text: "Equal highs / equal lows visibles = poche de liquidité probable.", tone: "sky" },
        { tag: "3 · SWEEP", title: "Attendre la prise", text: "Mèche qui prend les stops au-dessus ou sous la poche. Pas de sweep = on attend.", tone: "zone" },
        { tag: "4 · DISPLACEMENT", title: "Valider l'intention", text: "Séquence de grands corps dans le sens du biais. Sans displacement : faux mouvement.", tone: "bear" },
        { tag: "5 · FVG", title: "Zone d'exécution", text: "Le displacement laisse un FVG. On attend le retour dans la bande.", tone: "bull" },
        { tag: "6 · EXÉCUTION", title: "Entrée au retour + rejet", text: "SL au-dessus de l'extrémité du displacement. TP vers la prochaine liquidité.", tone: "entry" },
      ]} />
    </LessonSchema>
  );
}
