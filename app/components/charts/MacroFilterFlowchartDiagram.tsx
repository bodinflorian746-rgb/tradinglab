// Macro-trading 4 bloc 3 — filtre macro pré-trade : organigramme de 3 décisions
// (calendrier, régime, setup). Un seul filtre rouge = pas de trade. Pas de prix.

import { Checklist, Flow, LessonSchema } from "@/app/components/lessons/LessonSchema";

export function MacroFilterFlowchartDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonSchema id="MacroFilterFlowchartDiagram" title="Les 3 filtres macro avant chaque trade" caption="Logique négative : chercher à refuser, pas à trouver. Un seul rouge suffit à bloquer.">
      <Flow steps={[
        { tag: "1 · CALENDRIER", title: "News majeure dans la fenêtre ?", text: "FOMC, NFP, CPI, conférence Powell dans les 30 min à venir → ROUGE, pas de trade.", tone: "zone" },
        { tag: "2 · RÉGIME MACRO", title: "Le setup va contre le régime dominant ?", text: "Setup contre-tendance sans preuve de retournement → ROUGE, pas de trade.", tone: "zone" },
        { tag: "3 · SETUP TECHNIQUE", title: "Confluence suffisante ?", text: "Support/résistance, FVG, niveau structurel + signal de déclenchement visible.", tone: "zone" },
      ]} />
      <Checklist items={[
        { ok: true, title: "3 filtres VERTS → exécution possible", text: "Calendrier libre · Régime aligné · Setup avec confluence → trade exécuté." },
        { ok: false, title: "1 filtre ROUGE → pas de trade", text: "On ne négocie pas. Pas de réduction de taille. Pas d'ordre limite. On passe son tour." },
      ]} />
    </LessonSchema>
  );
}
