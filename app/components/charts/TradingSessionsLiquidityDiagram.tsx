// Macro Intermédiaire 4 — les 3 sessions (heure de Paris, texte de la leçon) : Asie
// 00h-09h, Londres 08h-17h, New York 14h-22h ; overlap Londres-New York 14h-17h.

import { LessonSchema, Timeline } from "@/app/components/lessons/LessonSchema";

export const TradingSessionsLiquidityDiagram = (_props: { locale?: "fr" | "es" | "en" } = {}) => (
  <LessonSchema id="TradingSessionsLiquidityDiagram" title="Les 3 sessions et l'overlap (heure de Paris)" caption="Ouvert ne veut pas dire actif : la liquidité réelle suit les sessions.">
    <Timeline
      ticks={[0, 8, 14, 17, 22]}
      rows={[
        { label: "Asie", note: "USD/JPY, AUD/JPY, AUD/USD · liquidité faible", from: 0, to: 9, tone: "entry" },
        { label: "Londres", note: "EUR/USD, GBP/USD, XAU/USD · 35-40 % du volume", from: 8, to: 17, tone: "bull" },
        { label: "New York", note: "EUR/USD, USD/JPY, XAU/USD, indices US · 20-25 %", from: 14, to: 22, tone: "zone" },
        { label: "Overlap Londres-New York", note: "14h-17h · liquidité maximale", from: 14, to: 17, tone: "bear" },
      ]}
    />
  </LessonSchema>
);
