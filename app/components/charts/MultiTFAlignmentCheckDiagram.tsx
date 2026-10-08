// Price action 4 bloc 2 — valider l'alignement : les 4 critères du texte, tous obligatoires
// (un seul manquant invalide le setup). Schéma de règles, pas de prix.

import { Checklist, LessonSchema } from "@/app/components/lessons/LessonSchema";

export default function MultiTFAlignmentCheckDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonSchema id="MultiTFAlignmentCheckDiagram" title="Les 4 critères d'alignement" caption="Un seul critère manquant invalide le setup.">
      <Checklist items={[
        { ok: true, title: "Daily", text: "Tendance clairement orientée : HH / HL ou LH / LL sur les 30 à 50 dernières bougies." },
        { ok: true, title: "H4", text: "Zone identifiée et tradable à proximité du prix (100 pips ou 100 $ au plus)." },
        { ok: true, title: "H1", text: "Structure alignée avec la tendance Daily, pas de correction temporaire en cours." },
        { ok: true, title: "M15", text: "Signal explicite au contact de la zone H4 : pin bar, engulfing, réaction immédiate." },
      ]} />
    </LessonSchema>
  );
}
