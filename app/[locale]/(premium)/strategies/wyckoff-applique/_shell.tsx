"use client";

// Leçons de la stratégie Wyckoff appliqué : gabarit commun des stratégies (StrategyLessonShell).

import type { ComponentProps } from "react";
import { StrategyLessonShell, type StrategyShellModule } from "@/app/components/StrategyLessonShell";

export { Block, Example, Mistakes, P, Points } from "@/app/components/StrategyLessonShell";

export const LESSONS = [
  { id: "lecon1", title: "Identifier un range exploitable" },
  { id: "lecon2", title: "Confirmer la transition" },
  { id: "lecon3", title: "Construire les trades" },
  { id: "lecon4", title: "Règles finales et backtest" },
];

const MODULE: StrategyShellModule = { id: "wyckoff-applique", title: "Wyckoff appliqué", level: "Avancé", lessons: LESSONS };

export function StrategyLesson(props: Omit<ComponentProps<typeof StrategyLessonShell>, "module">) {
  return <StrategyLessonShell module={MODULE} {...props} />;
}
