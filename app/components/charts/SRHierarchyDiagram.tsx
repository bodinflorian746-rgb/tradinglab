// Support-résistance 2 — hiérarchie multi-unités de temps : plus l'unité de temps est
// élevée, plus le niveau est défendu. Rôles repris du texte de la leçon. Schéma (pas de
// prix à lire) : cartes classées du niveau majeur au niveau marginal.

import { Cards, LessonSchema } from "@/app/components/lessons/LessonSchema";

export default function SRHierarchyDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonSchema id="SRHierarchyDiagram" title="Hiérarchie des niveaux : Daily > H4 > H1 > M15" caption="Un niveau M15 isolé ne tient pas seul : il sert au timing au contact d'un niveau supérieur.">
      <Cards cols={4} mobileCols={2} items={[
        { tag: "1", title: "Daily", value: "Majeur", text: "Référence prioritaire pour la sélection des setups. Peu de touches, mais franches.", tone: "bull" },
        { tag: "2", title: "H4", value: "Secondaire", text: "Zone de trade principale, alignée sur le Daily.", tone: "entry" },
        { tag: "3", title: "H1", value: "Intermédiaire", text: "Sert à l'approche et à l'observation.", tone: "zone" },
        { tag: "4", title: "M15 / M30", value: "Marginal", text: "Uniquement pour le timing au contact d'un niveau supérieur ; perforations fréquentes.", tone: "neutral" },
      ]} />
    </LessonSchema>
  );
}
