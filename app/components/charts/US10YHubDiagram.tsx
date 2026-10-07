// Macro Avancé 3 — US10Y, la chaîne invisible du marché (texte de la leçon) : ventes
// d'obligations → prix ↓, rendement ↑ → DXY ↑ → pression sur XAU/USD, Nasdaq, BTC/USD,
// avec les exemples chiffrés du texte. Pas de coefficient de corrélation (il varie).

import { Cards, Flow, LessonSchema, SchemaHeading } from "@/app/components/lessons/LessonSchema";

export const US10YHubDiagram = (_props: { locale?: "fr" | "es" | "en" } = {}) => (
  <LessonSchema id="US10YHubDiagram" title="Quand US10Y monte" caption="Chiffres ronds à surveiller sur US10Y : 4 %, 4,5 % et 5 %. La corrélation n'est jamais automatique.">
    <Flow steps={[
      { tag: "OBLIGATIONS", title: "Les investisseurs vendent", text: "Le prix des obligations baisse.", tone: "neutral" },
      { tag: "US10Y ↑", title: "Le rendement monte", text: "Le taux sans risque devient attractif.", tone: "bear" },
      { tag: "DXY ↑", title: "Le dollar se renforce", text: "La pression augmente sur les actifs risqués.", tone: "entry" },
    ]} />
    <SchemaHeading>Les actifs sous pression</SchemaHeading>
    <Cards cols={3} items={[
      { tag: "XAU/USD ↓", title: "L'or ne paie pas de rendement", text: "US10Y de 4 % à 4,5 % : l'or peut perdre 50 à 100 $, surtout si le DXY monte aussi.", tone: "zone" },
      { tag: "NASDAQ ↓", title: "La tech, très sensible aux taux", text: "US10Y +50 points de base : le Nasdaq peut corriger de 2 % à 3 %.", tone: "sky" },
      { tag: "BTC/USD ↓", title: "Un actif risqué", text: "US10Y casse 4,5 % : BTC/USD peut perdre son momentum, surtout si le Nasdaq baisse.", tone: "fib" },
    ]} />
  </LessonSchema>
);
