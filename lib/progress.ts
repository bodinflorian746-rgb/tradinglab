import type { Formation } from "./formations";

export type ProgressData = Record<string, Record<string, boolean>>;

const STORAGE_KEY = "tradinglab_progress";

export function getStoredProgress(): ProgressData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressData) : {};
  } catch {
    return {};
  }
}

export function markLessonComplete(
  current: ProgressData,
  formationId: string,
  lessonId: string
): ProgressData {
  const updated: ProgressData = {
    ...current,
    [formationId]: {
      ...(current[formationId] ?? {}),
      [lessonId]: true,
    },
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function isLessonComplete(
  progress: ProgressData,
  formationId: string,
  lessonId: string
): boolean {
  return !!progress[formationId]?.[lessonId];
}

// All lessons are freely accessible — no sequential locking.
export function isLessonUnlocked(
  _progress: ProgressData,
  _formationId: string,
  _lessonIds: string[],
  _lessonIndex: number
): boolean {
  return true;
}

export interface FormationStats {
  completed: number;
  total: number;
  pct: number;
  nextLessonId: string | null;
}

export function getFormationStats(
  progress: ProgressData,
  formationId: string,
  lessonIds: string[]
): FormationStats {
  const completed = lessonIds.filter((id) =>
    isLessonComplete(progress, formationId, id)
  ).length;
  const total = lessonIds.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const nextLessonId =
    lessonIds.find((id) => !isLessonComplete(progress, formationId, id)) ?? null;
  return { completed, total, pct, nextLessonId };
}

export const TOTAL_FREE_LESSONS = 47;

// XP gagné par leçon terminée (idempotent : ne double-compte jamais).
export const LESSON_XP = 20;

export interface GlobalStats {
  completedLessons: number;
  totalFreeLessons: number;
  pct: number;
  totalXp: number;
}

export function getGlobalStats(
  progress: ProgressData,
  formations: Formation[]
): GlobalStats {
  const totalFreeLessons = formations.reduce((acc, f) => acc + f.lessons.length, 0);
  const completedLessons = formations.reduce(
    (acc, f) =>
      acc +
      f.lessons.filter((l) => isLessonComplete(progress, f.id, l.id)).length,
    0
  );
  const pct =
    totalFreeLessons > 0
      ? Math.round((completedLessons / totalFreeLessons) * 100)
      : 0;
  const totalXp = completedLessons * LESSON_XP;
  return { completedLessons, totalFreeLessons, pct, totalXp };
}

// Calcule le XP total d'un user en fonction du nombre de leçons completes
// dans le ProgressData (toutes formations confondues).
export function getTotalXp(progress: ProgressData): number {
  let count = 0;
  for (const lessons of Object.values(progress)) {
    for (const done of Object.values(lessons)) {
      if (done) count++;
    }
  }
  return count * LESSON_XP;
}
