// Macro Débutant 6 — les fenêtres dangereuses : de 30 minutes avant une publication
// majeure à 1 heure après (règle du texte), sur une journée type (heure de Paris).

import { Flow, LessonSchema, Timeline } from "@/app/components/lessons/LessonSchema";

const WINDOWS = [
  { label: "Décision BCE", at: 14.25, txt: "14h15" },
  { label: "NFP / CPI", at: 14.5, txt: "14h30" },
  { label: "Décision Fed", at: 20, txt: "20h00" },
];
const hm = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}h${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;

export const MacroDangerWindowsDiagram = (_props: { locale?: "fr" | "es" | "en" } = {}) => (
  <LessonSchema id="MacroDangerWindowsDiagram" title="La zone dangereuse : 30 min avant, 1 h après" caption="La règle s'applique au forex, à l'or, aux indices US et au BTC/USD.">
    <Timeline
      start={8}
      end={22}
      ticks={[8, 12, 14, 16, 20, 22]}
      rows={WINDOWS.map((w) => ({
        label: `${w.label} ${w.txt}`, note: `zone de ${hm(w.at - 0.5)} à ${hm(w.at + 1)}`, from: w.at - 0.5, to: w.at + 1, tone: "bear" as const,
        marks: [{ at: w.at, label: `${w.txt} : ${w.label}`, tone: "zone" as const }],
      }))}
    />
    <Flow steps={[
      { tag: "30 MIN AVANT", title: "Évite d'entrer", text: "Le marché se fige ou s'agite sans direction.", tone: "zone" },
      { tag: "PENDANT", title: "Ne trade pas, observe", text: "Le marché peut devenir irrationnel.", tone: "bear" },
      { tag: "1 H APRÈS", title: "Attends la confirmation", text: "La direction se dessine, la volatilité retombe.", tone: "bull" },
    ]} />
  </LessonSchema>
);
