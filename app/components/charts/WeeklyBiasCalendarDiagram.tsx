// Macro Intermédiaire 6 — la semaine du trader macro : routine du dimanche soir (20 min :
// calendrier, ton macro, DXY, corrélations, biais), exécution les jours propres,
// prudence les jours de news 3 étoiles, bilan en fin de semaine.

import { Cards, LessonSchema } from "@/app/components/lessons/LessonSchema";

export const WeeklyBiasCalendarDiagram = () => (
  <LessonSchema id="WeeklyBiasCalendarDiagram" title="Une semaine type" caption="Exemple : CPI le mercredi, NFP le vendredi, à 14h30.">
    <Cards cols={4} mobileCols={2} items={[
      { tag: "DIM", title: "Construire le biais", text: "20 min : calendrier, ton Fed / BCE, DXY, corrélations, biais par actif.", tone: "entry" },
      { tag: "LUN", title: "Exécuter", text: "Jour propre : setups dans le sens du biais.", tone: "bull" },
      { tag: "MAR", title: "Exécuter", text: "Jour propre.", tone: "bull" },
      { tag: "MER", title: "Prudence", text: "CPI à 14h30 : jour à risque.", tone: "bear" },
      { tag: "JEU", title: "Ajuster", text: "Recalibrer le biais après le CPI.", tone: "zone" },
      { tag: "VEN", title: "Pas de trade avant la news", text: "NFP à 14h30 : jour pause.", tone: "bear" },
      { tag: "SAM", title: "Bilan", text: "Ce qui a marché, ce qui a cassé.", tone: "fib" },
    ]} />
  </LessonSchema>
);
