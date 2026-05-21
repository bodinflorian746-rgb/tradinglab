"use client";

import Link from "next/link";
import { useState, useEffect, createContext, useContext } from "react";
import { FORMATIONS } from "@/lib/formations";
import {
  getStoredProgress,
  markLessonComplete,
  isLessonComplete,
  getGlobalStats,
  TOTAL_FREE_LESSONS,
  LESSON_XP,
  type ProgressData,
} from "@/lib/progress";
import { LessonCelebration } from "@/app/components/LessonCelebration";
import { MicroFeedback } from "@/app/components/MicroFeedback";
// StickyLessonNav est monté GLOBALEMENT dans app/layout.tsx et se détecte
// automatiquement via pathname — pas besoin d'intégration ici.

// ── Context partagé avec LessonQuiz ──────────────────────────────────────────
interface QuizAnsweredCtx { onAnswered: () => void }
export const QuizAnsweredContext = createContext<QuizAnsweredCtx>({ onAnswered: () => {} });
export function useQuizAnswered() { return useContext(QuizAnsweredContext); }

// ── Types ─────────────────────────────────────────────────────────────────────
export interface LessonMeta {
  formationId: string;
  lessonId: string;
  title: string;
  subtitle: string;
  duration: string;
  lessonNumber: number;
  prev: { href: string; label: string } | null;
  next: { href: string; label: string } | null;
}

// ── Composant principal ───────────────────────────────────────────────────────
export function LessonPage({
  formationId,
  lessonId,
  title,
  subtitle,
  duration,
  lessonNumber,
  prev,
  next,
  children,
}: LessonMeta & { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressData>({});
  const [mounted, setMounted] = useState(false);
  // triggerKey pour la célébration : incrémenté quand on complète pour la
  // 1re fois la leçon. Reste à 0 si l'utilisateur reclique sur "terminée"
  // (déjà fait) → pas de double-XP visuel ni d'animation.
  const [celebKey, setCelebKey] = useState(0);

  useEffect(() => {
    setProgress(getStoredProgress());
    setMounted(true);
  }, []);

  const formation = FORMATIONS.find((f) => f.id === formationId);
  const lessons = formation?.lessons ?? [];
  const lessonIds = lessons.map((l) => l.id);
  const done = mounted && isLessonComplete(progress, formationId, lessonId);
  const globalStats = mounted ? getGlobalStats(progress, FORMATIONS) : null;

  function handleComplete() {
    const wasComplete = isLessonComplete(progress, formationId, lessonId);
    const updated = markLessonComplete(progress, formationId, lessonId);
    setProgress(updated);
    if (!wasComplete) {
      setCelebKey((k) => k + 1);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* Célébration unifiée : confettis + XP toast lors d'une 1re complétion */}
      <LessonCelebration triggerKey={celebKey} />

      {/* Micro-feedback : 1re leçon terminée (toutes formations confondues) */}
      <MicroFeedback
        milestone="first_lesson"
        condition={!!globalStats && globalStats.completedLessons >= 1}
      />

      {/* Barre de progression globale — tout en haut de la page */}
      {mounted && globalStats && globalStats.completedLessons > 0 && (
        <div className="h-0.5 bg-zinc-800">
          <div
            className="h-full bg-emerald-500 transition-all duration-700"
            style={{ width: `${globalStats.pct}%` }}
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Fil d'Ariane */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/formations" className="hover:text-zinc-400 transition-colors">
            Formations
          </Link>
          <span>/</span>
          <Link href="/formations" className="hover:text-zinc-400 transition-colors capitalize">
            {formation?.title ?? formationId}
          </Link>
          <span>/</span>
          <span className="text-zinc-500">Leçon {lessonNumber}</span>
        </nav>

        {/* En-tête ────────────────────────────────────────────────────────── */}
        <header className="mb-10">
          {/* Méta ligne */}
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${formation?.badgeStyle ?? "bg-zinc-700 text-zinc-300"}`}>
              {formation?.badge ?? formation?.title}
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">{duration}</span>
            {done && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1 4.5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Terminée
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold leading-tight mb-4">{title}</h1>

          {/* Bloc introduction */}
          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">{subtitle}</p>
          </div>

          {/* Indicateur de structure */}
          <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600">
            {["Lecture", "À retenir", "Exercice", "Quiz"].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span>{step}</span>
                {i < arr.length - 1 && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-zinc-800 shrink-0">
                    <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            ))}
          </div>

          {/* Navigation entre les leçons de la formation ─────────────────── */}
          {lessons.length > 1 && (
            <div className="mt-6 flex items-center gap-2 flex-wrap">
              {lessons.map((lesson, i) => {
                void i;
                const isCurrent = lesson.id === lessonId;
                const isDone = mounted && isLessonComplete(progress, formationId, lesson.id);

                const pill = (
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                    isCurrent
                      ? "bg-zinc-800 border-zinc-600 text-white"
                      : isDone
                      ? "bg-emerald-500/8 border-emerald-500/20 text-emerald-400"
                      : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400"
                  }`}>
                    {isDone ? (
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1 4.5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : "bg-zinc-600"}`} />
                    )}
                    {lesson.title.replace(/Leçon \d+ : /, "")}
                  </span>
                );

                return !isCurrent ? (
                  <Link key={lesson.id} href={lesson.href}>{pill}</Link>
                ) : (
                  <div key={lesson.id}>{pill}</div>
                );
              })}

              {/* Stats globales à droite */}
              {mounted && globalStats && (
                <span className="ml-auto text-xs text-zinc-600">
                  {globalStats.completedLessons} / {TOTAL_FREE_LESSONS} leçons gratuites
                </span>
              )}
            </div>
          )}
        </header>

        {/* Contenu ─────────────────────────────────────────────────────────── */}
        <QuizAnsweredContext.Provider value={{ onAnswered: () => {} }}>
          <div className="space-y-5">{children}</div>
        </QuizAnsweredContext.Provider>

        {/* Zone de fin ─────────────────────────────────────────────────────── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {/* Bouton Marquer comme terminée */}
            {!done ? (
              <button
                onClick={handleComplete}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-zinc-950 font-semibold py-3.5 rounded-xl transition-all duration-150 shadow-lg shadow-emerald-500/10"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Marquer la leçon comme terminée
              </button>
            ) : (
              /* État terminé */
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-5 py-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-emerald-400">
                      <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-400">Leçon terminée</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {next
                        ? "Continue sur ta lancée — la leçon suivante t'attend."
                        : "Tu as complété toutes les leçons de cette formation."}
                    </p>
                  </div>
                </div>

                {next && (
                  <Link
                    href={next.href}
                    className="group w-full flex items-center justify-between bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 px-5 py-4 rounded-xl transition-all duration-200"
                  >
                    <div>
                      <p className="text-xs text-zinc-500 mb-0.5">Leçon suivante</p>
                      <p className="text-sm font-semibold text-white">{next.label}</p>
                    </div>
                    <svg
                      width="18" height="18" viewBox="0 0 18 18" fill="none"
                      className="text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0"
                    >
                      <path d="M6 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                )}

                {!next && (
                  <Link
                    href="/formations"
                    className="group w-full flex items-center justify-between bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 px-5 py-4 rounded-xl transition-all duration-200"
                  >
                    <div>
                      <p className="text-xs text-zinc-500 mb-0.5">Formation complète</p>
                      <p className="text-sm font-semibold text-white">Voir toutes les formations</p>
                    </div>
                    <svg
                      width="18" height="18" viewBox="0 0 18 18" fill="none"
                      className="text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0"
                    >
                      <path d="M6 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                )}
              </div>
            )}

            {/* Navigation précédente */}
            {prev && (
              <div className="mt-5">
                <Link
                  href={prev.href}
                  className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {prev.label}
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
