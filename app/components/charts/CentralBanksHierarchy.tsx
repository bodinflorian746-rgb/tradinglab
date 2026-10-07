// Macro Débutant 2 — les 4 banques centrales du texte : la Fed domine (devise de réserve,
// commerce et matières premières en USD) ; BCE, BoE et BoJ ajustent souvent leur
// politique en réaction à la Fed.

import { Cards, LessonSchema } from "@/app/components/lessons/LessonSchema";

export const CentralBanksHierarchy = (_props: { locale?: "fr" | "es" | "en" } = {}) => (
  <LessonSchema id="CentralBanksHierarchy" title="Une banque centrale domine : la Fed" caption="Tous les actifs majeurs (forex, or, crypto, indices US) dépendent du dollar.">
    <Cards cols={2} items={[
      { tag: "LE CHEF D'ORCHESTRE", title: "Fed · Réserve fédérale", value: "USD", text: "Quand la Fed bouge, le monde entier réagit.", tone: "bull" },
      { title: "BCE · Banque centrale européenne", value: "EUR", text: "Ajuste souvent sa politique après la Fed.", tone: "entry" },
    ]} />
    <Cards cols={2} items={[
      { title: "BoE · Bank of England", value: "GBP", text: "Joue sa partition autour de la Fed.", tone: "fib" },
      { title: "BoJ · Banque du Japon", value: "JPY", text: "Joue sa partition autour de la Fed.", tone: "zone" },
    ]} />
  </LessonSchema>
);
