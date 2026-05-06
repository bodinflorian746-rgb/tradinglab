import { type ReactNode } from "react";
import { LessonPage } from "./LessonPage";
import { LessonKeyPoints } from "./LessonKeyPoints";
import { LessonExercice } from "./LessonExercice";
import { LessonQuiz } from "./LessonQuiz";

export interface TemplateSectionData {
  title: string;
  content: string;
  visual?: ReactNode;
  items?: string[];
}

export interface TemplateQuizData {
  question: string;
  answers: string[];
  correctIndex: number;
  explanation: string;
  answerExplanations: string[];
}

export interface LessonTemplateProps {
  formationId: string;
  lessonId: string;
  lessonNumber: number;
  prev: { href: string; label: string } | null;
  next: { href: string; label: string } | null;
  duration: string;
  title: string;
  hook: string;
  sections: TemplateSectionData[];
  keyPoints: string[];
  errors: string[];
  fatalError: string;
  exerciseTitle?: string;
  exercise: string[];
  quiz: TemplateQuizData;
}

export function LessonTemplate({
  formationId,
  lessonId,
  lessonNumber,
  prev,
  next,
  duration,
  title,
  hook,
  sections,
  keyPoints,
  errors,
  fatalError,
  exerciseTitle = "Pratique sur TradingView",
  exercise,
  quiz,
}: LessonTemplateProps) {
  return (
    <LessonPage
      formationId={formationId}
      lessonId={lessonId}
      title={title}
      subtitle={hook}
      duration={duration}
      lessonNumber={lessonNumber}
      prev={prev}
      next={next}
    >
      {/* ── Sections de contenu ────────────────────────────────── */}
      {sections.map((section, i) => (
        <section key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-3">{section.title}</h2>
          <p className="text-zinc-300 leading-relaxed text-sm">{section.content}</p>

          {section.visual != null && (
            <div className="mt-4">{section.visual}</div>
          )}

          {section.items && section.items.length > 0 && (
            <div className="space-y-2.5 mt-4">
              {section.items.map((item, j) => (
                <div key={j} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-emerald-400 shrink-0 mt-0.5">
                    <path d="M2 7l3.5 3.5 6.5-6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      {/* ── Erreurs fréquentes ─────────────────────────────────── */}
      {errors.length > 0 && (
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Erreurs fréquentes des débutants</h2>
          <div className="space-y-2.5">
            {errors.map((error, i) => (
              <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-red-400 shrink-0 mt-0.5">
                  <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="text-sm text-zinc-300 leading-relaxed">{error}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Erreur fatale ──────────────────────────────────────── */}
      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-red-400 shrink-0">
            <path d="M8 2L14.5 13H1.5L8 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M8 6.5v3M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <h2 className="text-base font-bold text-red-400">L'erreur fatale</h2>
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed">{fatalError}</p>
      </section>

      {/* ── Séparateur ─────────────────────────────────────────── */}
      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints points={keyPoints} />

      <LessonExercice description={exerciseTitle} steps={exercise} />

      <LessonQuiz
        question={quiz.question}
        options={quiz.answers}
        correctIndex={quiz.correctIndex}
        explanation={quiz.explanation}
        answerExplanations={quiz.answerExplanations}
      />
    </LessonPage>
  );
}
