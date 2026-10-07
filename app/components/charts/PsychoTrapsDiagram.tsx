// Trading Débutant 9 — les pièges psychologiques : les 4 biais du tableau de la leçon
// (FOMO, vengeance trading, ancrage, overconfidence), ce qui se passe et la conséquence.

import { Cards, LessonSchema } from "@/app/components/lessons/LessonSchema";

export function PsychoTrapsDiagram() {
  return (
    <LessonSchema id="ErrorsDiagram" title="Les 4 biais qui détruisent les comptes">
      <Cards cols={2} items={[
        { title: "FOMO", text: "Le marché monte fort, tu achètes en urgence : souvent au sommet, juste avant le retournement.", tone: "zone" },
        { title: "Vengeance trading", text: "Tu perds un trade et tu ré-ouvres aussitôt : tu perds encore plus, avec moins de lucidité.", tone: "bear" },
        { title: "Ancrage", text: "Tu refuses de fermer un trade perdant : la perte s'aggrave et tu fermes au pire moment.", tone: "fib" },
        { title: "Overconfidence", text: "5 gains d'affilée, tu te sens invincible et tu multiplies les lots : le prochain trade perdant efface tout.", tone: "sky" },
      ]} />
    </LessonSchema>
  );
}
