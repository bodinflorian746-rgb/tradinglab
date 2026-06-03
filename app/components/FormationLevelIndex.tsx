"use client";

// Index par niveau d'une formation (débutant / intermédiaire / avancé).
// Liste les leçons cliquables + CTA "Reprendre" en haut basé sur la
// progression localStorage (mêmes helpers que le hub formations/page.tsx).
// Locale + dictionnaire récupérés via LocaleProvider, comme le hub.

import Link from "next/link";
import { useState, useEffect } from "react";
import { FORMATIONS } from "@/lib/formations";
import {
  getStoredProgress,
  isLessonComplete,
  getFormationStats,
  type ProgressData,
} from "@/lib/progress";
import { useLocale, useDict } from "@/app/components/LocaleProvider";
import { localizedHref } from "@/lib/i18n/href";

type FormationDictEntry = {
  title?: string;
  description?: string;
  badge?: string;
  lessons?: Record<string, { title?: string; duration?: string }>;
};

type FormationsDict = Record<string, FormationDictEntry | undefined>;

type LevelKey = "debutant" | "intermediaire" | "avance";

type LevelTheme = {
  badge:        string;
  numberPill:   string;
  arrow:        string;
  progressBar:  string;
  ctaBorder:    string;
  ctaBg:        string;
  ctaHover:     string;
};

const LEVEL_THEMES: Record<LevelKey, LevelTheme> = {
  debutant: {
    badge:       "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    numberPill:  "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
    arrow:       "text-emerald-400",
    progressBar: "bg-emerald-500",
    ctaBorder:   "border-emerald-500/30 hover:border-emerald-500/50",
    ctaBg:       "bg-emerald-500/10",
    ctaHover:    "hover:bg-emerald-500/15",
  },
  intermediaire: {
    badge:       "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    numberPill:  "bg-blue-500/10 border border-blue-500/20 text-blue-400",
    arrow:       "text-blue-400",
    progressBar: "bg-blue-400",
    ctaBorder:   "border-blue-500/30 hover:border-blue-500/50",
    ctaBg:       "bg-blue-500/10",
    ctaHover:    "hover:bg-blue-500/15",
  },
  avance: {
    badge:       "bg-amber-400/10 text-amber-400 border border-amber-400/20",
    numberPill:  "bg-amber-400/10 border border-amber-400/20 text-amber-400",
    arrow:       "text-amber-400",
    progressBar: "bg-amber-400",
    ctaBorder:   "border-amber-400/30 hover:border-amber-400/50",
    ctaBg:       "bg-amber-400/10",
    ctaHover:    "hover:bg-amber-400/15",
  },
};

function IconCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7l3.5 3.5 6.5-6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconArrow({ className = "" }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={className} aria-hidden="true">
      <path d="M5.5 10.5l4-4-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface Props {
  formationId: LevelKey;
}

export default function FormationLevelIndex({ formationId }: Props) {
  const locale = useLocale();
  const fdictRaw = useDict("formations");
  const fdict = fdictRaw as unknown as FormationsDict;
  const common = useDict("common");

  const [progress, setProgress] = useState<ProgressData>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProgress(getStoredProgress());
    setMounted(true);
  }, []);

  const formation = FORMATIONS.find((f) => f.id === formationId);
  if (!formation) return null;

  const theme = LEVEL_THEMES[formationId];
  const fEntry = fdict[formationId];
  const fTitle = fEntry?.title ?? formation.title;
  const fDesc = fEntry?.description ?? formation.description;
  const fBadge = fEntry?.badge ?? formation.badge;

  const lessonIds = formation.lessons.map((l) => l.id);
  const stats = mounted
    ? getFormationStats(progress, formation.id, lessonIds)
    : { completed: 0, total: formation.lessons.length, pct: 0, nextLessonId: lessonIds[0] };

  const nextLesson =
    formation.lessons.find((l) => l.id === stats.nextLessonId) ?? formation.lessons[0];
  const allDone = stats.completed === stats.total && mounted;

  const nextLessonEntry = fEntry?.lessons?.[nextLesson.id];
  const nextLessonTitle = nextLessonEntry?.title ?? nextLesson.title;
  const lessonsLabel = locale === "es" ? "lecciones" : "leçons";

  const ctaLabel = allDone
    ? common.buttons.review
    : stats.completed === 0
      ? common.buttons.start
      : common.buttons.resume;

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-600 mb-8">
          <Link
            href={localizedHref("/formations", locale)}
            className="hover:text-zinc-400 transition-colors"
          >
            {common.lessons.breadcrumbFormations}
          </Link>
          <span>/</span>
          <span className="text-zinc-400">{fTitle}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h1 className="text-4xl md:text-5xl font-bold">{fTitle}</h1>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${theme.badge}`}>
              {fBadge}
            </span>
          </div>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl leading-relaxed">
            {fDesc}
          </p>

          {/* Progression */}
          <div className="mt-5 max-w-md">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-zinc-500 tabular-nums">
                {stats.completed}/{stats.total} {lessonsLabel}
              </span>
              <span className="text-xs font-medium text-zinc-400 tabular-nums">{stats.pct}%</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${theme.progressBar} rounded-full transition-all duration-500`}
                style={{ width: `${stats.pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* CTA Reprendre (caché si tout terminé) */}
        {!allDone && (
          <Link
            href={localizedHref(nextLesson.href, locale)}
            className={`flex items-center justify-between gap-4 rounded-2xl px-5 py-4 mb-6 border transition-all ${theme.ctaBg} ${theme.ctaHover} ${theme.ctaBorder}`}
          >
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-500 mb-1">
                {ctaLabel}
              </p>
              <p className="text-sm font-medium text-white truncate">
                {nextLessonTitle}
              </p>
            </div>
            <IconArrow className={`${theme.arrow} shrink-0`} />
          </Link>
        )}

        {/* Liste des leçons */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="divide-y divide-zinc-800/60">
            {formation.lessons.map((lesson, i) => {
              const lEntry = fEntry?.lessons?.[lesson.id];
              const lTitle = lEntry?.title ?? lesson.title;
              const lDuration = lEntry?.duration ?? lesson.duration;
              const done = mounted && isLessonComplete(progress, formation.id, lesson.id);
              const number = i + 1;
              const isDisabled = (lesson as { disabled?: boolean }).disabled === true;

              if (isDisabled) {
                return (
                  <div key={lesson.id} className="flex items-center justify-between px-6 py-4 opacity-40">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-zinc-800 border border-zinc-700 text-zinc-600">
                        {number}
                      </div>
                      <span className="text-sm font-medium text-zinc-500 truncate">{lTitle}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {lDuration && (
                        <span className="text-xs text-zinc-700">{lDuration}</span>
                      )}
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-600 border border-zinc-700">
                        {common.status.comingSoon}
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={lesson.id}
                  href={localizedHref(lesson.href, locale)}
                  className="block hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center justify-between px-6 py-4 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${theme.numberPill}`}>
                        {number}
                      </div>
                      <div className="min-w-0 flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-white">{lTitle}</span>
                        {done && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                            <IconCheck />
                            {common.status.done}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {lDuration && (
                        <span className="text-xs text-zinc-700">{lDuration}</span>
                      )}
                      <IconArrow className={theme.arrow} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}
