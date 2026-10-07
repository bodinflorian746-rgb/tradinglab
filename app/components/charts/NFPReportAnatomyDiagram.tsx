// Macro Avancé 2 — le rapport NFP complet : les 4 données du texte (headline, chômage,
// salaires, participation) et les révisions du mois précédent, qui peuvent changer la
// lecture (exemple du texte : +50k de surprise, mois précédent révisé de −80k).

import { Cards, LessonSchema, SchemaHeading } from "@/app/components/lessons/LessonSchema";

export const NFPReportAnatomyDiagram = (_props: { locale?: "fr" | "es" | "en" } = {}) => (
  <LessonSchema id="NFPReportAnatomyDiagram" title="Ce que lit le pro dans un NFP" caption="Le retail regarde le headline. Le pro lit les 4 données et les révisions.">
    <SchemaHeading>Les 4 données du rapport</SchemaHeading>
    <Cards cols={4} mobileCols={2} items={[
      { tag: "1 · HEADLINE", title: "Non-Farm Payrolls", text: "Créations d'emplois hors agriculture.", tone: "entry" },
      { tag: "2", title: "Taux de chômage", text: "Signal de ralentissement.", tone: "sky" },
      { tag: "3", title: "Salaires horaires (AHE)", text: "Trop élevés : inflation future.", tone: "zone" },
      { tag: "4", title: "Taux de participation", text: "Qui participe vraiment au marché du travail.", tone: "fib" },
    ]} />
    <SchemaHeading>Puis les révisions</SchemaHeading>
    <Cards cols={2} items={[
      { tag: "CE MOIS-CI", title: "Surprise apparente : +50k", text: "250k pour 200k attendus.", tone: "bull" },
      { tag: "MOIS PRÉCÉDENT", title: "Révisé de −80k", text: "La dynamique est moins solide que prévu : la lecture change.", tone: "bear" },
    ]} />
  </LessonSchema>
);
