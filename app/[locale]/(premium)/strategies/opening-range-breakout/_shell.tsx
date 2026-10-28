"use client";

// Leçons de la stratégie Opening Range Breakout : gabarit commun des stratégies (StrategyLessonShell).

import type { ComponentProps } from "react";
import { StrategyLessonShell, type StrategyShellModule } from "@/app/components/StrategyLessonShell";

export { Block, Example, Mistakes, P, Points } from "@/app/components/StrategyLessonShell";

export const LESSONS = [
  { id: "lecon1", title: "Tracer l'Opening Range" },
  { id: "lecon2", title: "Filtrer les breakouts" },
  { id: "lecon3", title: "Construire le trade" },
  { id: "lecon4", title: "Appliquer et évaluer" },
];

const MODULE: StrategyShellModule = { id: "opening-range-breakout", title: "Opening Range Breakout", level: "Intermédiaire", lessons: LESSONS };

export function StrategyLesson(props: Omit<ComponentProps<typeof StrategyLessonShell>, "module">) {
  return <StrategyLessonShell module={MODULE} {...props} />;
}
