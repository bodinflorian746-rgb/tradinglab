// Macro Débutant 5 — le dollar au centre : DXY ↑ = pression sur les marchés cotés
// contre le dollar, DXY ↓ = respiration. Marchés repris du texte de la leçon.

import { Cards, LessonSchema } from "@/app/components/lessons/LessonSchema";

export const DollarHubDiagram = (_props: { locale?: "fr" | "es" | "en" } = {}) => (
  <LessonSchema id="DollarHubDiagram" title="Une seule devise pivot, plusieurs marchés majeurs" caption="Le DXY est le thermomètre du dollar.">
    <Cards cols={2} items={[
      { tag: "DXY ↑", title: "Dollar fort", text: "Pression sur les actifs cotés en dollar.", tone: "bear" },
      { tag: "DXY ↓", title: "Dollar faible", text: "Respiration pour les actifs cotés en dollar.", tone: "bull" },
    ]} />
    <Cards cols={4} mobileCols={2} items={[
      { title: "Forex", value: "EUR/USD", text: "GBP/USD", tone: "entry" },
      { title: "Or", value: "XAU/USD", tone: "zone" },
      { title: "Crypto", value: "BTC/USD", tone: "fib" },
      { title: "Indices US", value: "Nasdaq", text: "S&P 500", tone: "sky" },
    ]} />
  </LessonSchema>
);
