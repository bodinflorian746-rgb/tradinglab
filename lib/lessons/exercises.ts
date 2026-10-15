// Étape « Exercice » des leçons (décision PO, 2026-10-15) : retirée de toutes les leçons. Les exercices
// restent dans le code (LessonExercice, données des leçons), désactivés : passer l'interrupteur à true
// les réaffiche partout, avec leur étape dans la barre de progression.
export const LESSON_EXERCISES_ENABLED = false;

/** Étapes affichées en tête de leçon (français) */
export const LESSON_STEPS_FR: string[] = LESSON_EXERCISES_ENABLED
  ? ["Lecture", "À retenir", "Exercice", "Quiz"]
  : ["Lecture", "À retenir", "Quiz"];
