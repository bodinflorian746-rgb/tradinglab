// Support / résistance 2 bloc 1 — les 4 critères de qualification d'une zone (texte de la leçon),
// appliqués dans l'ordre ; une zone qui n'en valide que 2 ou 3 reste à surveiller. Schéma de règles.

import { Checklist, LessonSchema } from "@/app/components/lessons/LessonSchema";

export default function SRQualificationChecklistDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonSchema id="SRQualificationChecklistDiagram" title="4 critères pour une zone tradable" caption="2 ou 3 critères : zone à surveiller, pas une priorité.">
      <Checklist items={[
        { ok: true, title: "1. Touches multiples", text: "2 touches confirmées au minimum, 3 pour une confiance élevée." },
        { ok: true, title: "2. Réactions claires", text: "Rebond de 30 pips ou plus sur EUR/USD, de 25 à 50 $ sur XAU/USD, à chaque touche." },
        { ok: true, title: "3. Fraîcheur", text: "Zone touchée dans les 30 derniers jours : mémoire collective forte." },
        { ok: true, title: "4. Confluence", text: "Chiffre rond, Fibonacci, MM ou Order Block au même endroit : priorité." },
      ]} />
    </LessonSchema>
  );
}
