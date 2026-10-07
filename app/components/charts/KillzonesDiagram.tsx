// Trading Avancé 4 — les 4 Killzones de la leçon, en heure de Paris (CET/CEST),
// avec les heures creuses (10h-13h) et les publications majeures (13h30, 15h00).

import { LessonSchema, Timeline } from "@/app/components/lessons/LessonSchema";

export function KillzonesDiagram(_props: { className?: string; locale?: "fr" | "es" | "en" }) {
  return (
    <LessonSchema id="KillzonesDiagram" title="Les Killzones sur 24 h (heure de Paris)" caption="Heure d'été / d'hiver : les horaires suivent l'heure de Paris.">
      <Timeline
        ticks={[0, 4, 8, 12, 16, 20, 24]}
        rows={[
          { label: "Asian Killzone", note: "01h00 – 04h00", from: 1, to: 4, tone: "entry" },
          { label: "London Killzone", note: "07h00 – 10h00", from: 7, to: 10, tone: "bull" },
          { label: "Heures creuses", note: "10h00 – 13h00, à éviter", from: 10, to: 13, tone: "neutral" },
          {
            label: "New York Killzone", note: "13h00 – 16h00", from: 13, to: 16, tone: "bull",
            marks: [
              { at: 13.5, label: "13h30 : news US majeures (ex. NFP, CPI)", tone: "zone" },
              { at: 15, label: "15h00 : autres publications US", tone: "zone" },
            ],
          },
          { label: "London Close", note: "16h00 – 17h00", from: 16, to: 17, tone: "entry" },
        ]}
      />
    </LessonSchema>
  );
}
