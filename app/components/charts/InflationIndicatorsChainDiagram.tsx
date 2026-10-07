// Macro Intermédiaire 3 — du producteur au consommateur, et ce que la Fed regarde :
// PPI (prix producteurs, signal précoce) → CPI Headline (choc médiatisé, 14h30) →
// Core CPI (tendance de fond) → Core PCE (indicateur préféré de la Fed). Puis la
// réaction typique du marché selon le Core CPI, d'après l'exemple de la leçon.

import { Cards, Flow, LessonSchema, SchemaHeading, Sig } from "@/app/components/lessons/LessonSchema";

export function InflationIndicatorsChainDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonSchema id="InflationIndicatorsChainDiagram" title="La chaîne d'inflation que les pros surveillent" caption="Le PPI prévient. Le CPI déclenche. Le Core confirme.">
      <Flow steps={[
        { tag: "PPI", title: "Prix producteurs", text: "Signal précoce : la hausse en amont, avant le consommateur. Même semaine que le CPI.", tone: "fib" },
        { tag: "CPI HEADLINE", title: "Prix consommateurs", text: "Choc médiatisé, publié à 14h30 (heure de Paris). Volatil avec l'énergie.", tone: "zone" },
        { tag: "CORE CPI", title: "Hors énergie et alimentation", text: "La tendance de fond : ce que les pros regardent.", tone: "bear" },
        { tag: "CORE PCE", title: "Indicateur préféré de la Fed", text: "Publié en fin de mois.", tone: "entry" },
      ]} />
      <SchemaHeading sub="Exemple de la leçon : Headline conforme, Core au-dessus des attentes">Réaction du marché selon le Core CPI</SchemaHeading>
      <Cards cols={2} items={[
        { title: "Core CPI > attentes", tone: "bear", value: <Sig s="DXY ↑ · Or ↓ · Indices ↓" />, text: "La Fed pourrait rester restrictive." },
        { title: "Core CPI < attentes", tone: "bull", value: <Sig s="DXY ↓ · Or ↑ · Indices ↑" />, text: "La pression sur la Fed baisse." },
      ]} />
    </LessonSchema>
  );
}
