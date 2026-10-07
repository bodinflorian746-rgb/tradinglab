// Macro Débutant 4 — la chaîne inflation → taux → dollar → marchés, et l'exemple
// réel de la leçon (2021-2023 : l'inflation US à 1,4 % date de janvier 2021).

import { Cards, Flow, LessonSchema, SchemaHeading } from "@/app/components/lessons/LessonSchema";

export const InflationChainDiagram = (_props: { locale?: "fr" | "es" | "en" } = {}) => (
  <LessonSchema id="InflationChainDiagram" title="La chaîne qui fait bouger tout le marché" caption="Une seule cause macro a fait bouger tout le marché.">
    <Flow steps={[
      { tag: "1", title: "Inflation ↑", text: "Les prix montent.", tone: "bear" },
      { tag: "2", title: "Taux ↑", text: "La banque centrale monte ses taux.", tone: "zone" },
      { tag: "3", title: "Dollar ↑", text: "Le dollar devient plus attractif.", tone: "entry" },
      { tag: "4", title: "Marchés ↓", text: "Forex, indices, or, crypto sous pression.", tone: "fib" },
    ]} />
    <SchemaHeading sub="Exemple réel, 2021-2023">La chaîne en action</SchemaHeading>
    <Cards cols={4} mobileCols={2} items={[
      { title: "Inflation US", value: "1,4 % → 9,1 %", text: "Janv. 2021 → juin 2022", tone: "bear" },
      { title: "Taux de la Fed", value: "0,25 % → 5,5 %", text: "En moins de 18 mois", tone: "zone" },
      { title: "Dollar (DXY)", value: "+20 %", text: "En 2022 ; EUR/USD de 1.20 à 0.95", tone: "entry" },
      { title: "Marchés 2022", value: "Nasdaq −33 %", text: "Bitcoin −65 %, or jusqu'à −15 %", tone: "fib" },
    ]} />
  </LessonSchema>
);
