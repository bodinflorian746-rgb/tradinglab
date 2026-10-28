"use client";

// Leçons de la stratégie Volume Profile + VWAP : gabarit commun des stratégies (StrategyLessonShell).

import type { ComponentProps } from "react";
import { StrategyLessonShell, type StrategyShellModule } from "@/app/components/StrategyLessonShell";

export { Block, Example, Mistakes, P, Points } from "@/app/components/StrategyLessonShell";

export const LESSONS = [
  { id: "lecon1", title: "Construire son plan avec le Volume Profile" },
  { id: "lecon2", title: "Filtrer les opportunités avec le VWAP" },
  { id: "lecon3", title: "Confirmer son entrée" },
  { id: "lecon4", title: "Exécuter et gérer un trade complet" },
];

const MODULE: StrategyShellModule = { id: "volume-profile-vwap", title: "Volume Profile + VWAP", level: "Avancé", lessons: LESSONS };

export function StrategyLesson(props: Omit<ComponentProps<typeof StrategyLessonShell>, "module">) {
  return <StrategyLessonShell module={MODULE} {...props} />;
}
