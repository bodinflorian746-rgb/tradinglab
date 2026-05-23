"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FORMATIONS } from "@/lib/formations";
import {
  getStoredProgress,
  isLessonComplete,
  isLessonUnlocked,
  getFormationStats,
  getGlobalStats,
  type ProgressData,
} from "@/lib/progress";
import { useLocale, useDict } from "@/app/components/LocaleProvider";
import { localizedHref } from "@/lib/i18n/href";

/* ── Icônes ──────────────────────────────────────────── */

function CheckIcon({ className = "text-emerald-400" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path d="M2.5 7.5l3.5 3.5 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4 9l4-3-4-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Barre de progression ────────────────────────────── */

function ProgressBar({ pct, height = "h-1" }: { pct: number; height?: string }) {
  return (
    <div className={`w-full ${height} bg-zinc-800 rounded-full overflow-hidden`}>
      <div
        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ── Couleurs d'accent par niveau ───────────────────── */

type LevelColor = {
  badge: string;
  button: string;
};

const LEVEL_COLORS: Record<string, LevelColor> = {
  debutant: {
    badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    button: "bg-emerald-500 hover:bg-emerald-400 text-zinc-950",
  },
  intermediaire: {
    badge: "bg-blue-400/10 text-blue-400 border border-blue-400/20",
    button: "bg-blue-400 hover:bg-blue-300 text-zinc-950",
  },
  avance: {
    badge: "bg-amber-400/10 text-amber-400 border border-amber-400/20",
    button: "bg-amber-400 hover:bg-amber-300 text-zinc-950",
  },
};

/* ── Helpers ────────────────────────────────────────── */

function getActiveLessonKey(progress: ProgressData): string | null {
  for (const f of FORMATIONS) {
    const ids = f.lessons.map((l) => l.id);
    for (let i = 0; i < f.lessons.length; i++) {
      if (
        isLessonUnlocked(progress, f.id, ids, i) &&
        !isLessonComplete(progress, f.id, f.lessons[i].id)
      ) {
        return `${f.id}:${f.lessons[i].id}`;
      }
    }
  }
  return null;
}

/* ── Page ────────────────────────────────────────────── */

export default function FormationsPage() {
  const locale = useLocale();
  const fdict = useDict("formations") as Record<string, {
    title?: string;
    description?: string;
    badge?: string;
    lessons?: Record<string, { title?: string; duration?: string }>;
  } | undefined>;
  const common = useDict("common");
  const [progress, setProgress] = useState<ProgressData>({});
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    setProgress(getStoredProgress());
    setMounted(true);
  }, []);

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const global = mounted
    ? getGlobalStats(progress, FORMATIONS)
    : { completedLessons: 0, totalFreeLessons: 0, pct: 0 };

  const activeLessonKey = mounted ? getActiveLessonKey(progress) : null;

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">

        {/* ── En-tête ── */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{common.lessons.breadcrumbFormations}</h1>
        </div>

        {/* ── Progression globale ── */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-5 py-4 mb-8">
          <div className="flex items-center justify-between gap-4 mb-2.5">
            <span className="text-sm font-semibold tabular-nums">
              {common.lessons.globalCount
                .replace("{done}", String(global.completedLessons))
                .replace("{total}", String(global.totalFreeLessons))}
            </span>
          </div>
          <ProgressBar pct={global.pct} height="h-1.5" />
        </div>

        {/* ── Cards de formations ── */}
        <div className="space-y-6">
          {FORMATIONS.map((formation) => {
            const lessonIds = formation.lessons.map((l) => l.id);
            const stats = mounted
              ? getFormationStats(progress, formation.id, lessonIds)
              : { completed: 0, total: formation.lessons.length, pct: 0, nextLessonId: lessonIds[0] };

            const nextLesson = formation.lessons.find((l) => l.id === stats.nextLessonId) ?? null;
            const allDone = stats.completed === stats.total && mounted;
            const isExpanded = expanded.has(formation.id);
            const colors = LEVEL_COLORS[formation.id];
            const fEntry = fdict[formation.id];
            const fTitle = fEntry?.title ?? formation.title;
            const fBadge = fEntry?.badge ?? formation.badge;
            const fDesc  = fEntry?.description ?? formation.description;
            const tr = (lid: string, fallback: string) => fEntry?.lessons?.[lid]?.title ?? fallback;

            return (
              <div
                key={formation.id}
                className={`bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden ${
                  formation.disabled ? "opacity-50 bg-zinc-900/40 border-zinc-800/60" : ""
                }`}
              >
                {/* En-tête de card — cliquable pour déplier */}
                <div
                  className={`px-6 py-5 ${
                    isExpanded && !formation.disabled ? "border-b border-zinc-800" : ""
                  } ${!formation.disabled ? "cursor-pointer" : ""}`}
                  onClick={() => !formation.disabled && toggleExpand(formation.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">

                      {/* Titre + badge */}
                      <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                        <h2 className="text-xl font-semibold">{fTitle}</h2>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors?.badge ?? formation.badgeStyle}`}>
                          {fBadge}
                        </span>
                        {formation.disabled && (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">
                            {common.status.comingSoon}
                          </span>
                        )}
                        {allDone && !formation.disabled && (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {common.status.done}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-zinc-500 mb-3">{fDesc}</p>

                      {/* Barre de progression */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[180px]">
                          <ProgressBar pct={stats.pct} />
                        </div>
                        <span className="text-xs text-zinc-600 tabular-nums shrink-0">
                          {stats.completed}/{stats.total}
                        </span>
                      </div>
                    </div>

                    {/* Bouton Commencer / Continuer / Réviser */}
                    <div
                      className="shrink-0 hidden md:flex flex-col items-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {!formation.disabled && (
                        <>
                          {allDone ? (
                            <Link
                              href={localizedHref(formation.lessons[0].href, locale)}
                              className="inline-flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
                            >
                              {common.buttons.review}
                            </Link>
                          ) : nextLesson ? (
                            <Link
                              href={localizedHref(nextLesson.href, locale)}
                              className={`inline-flex items-center gap-1.5 ${colors?.button ?? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950"} text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors`}
                            >
                              {stats.completed === 0 ? common.buttons.start : common.buttons.continue}
                              <ArrowIcon />
                            </Link>
                          ) : null}
                          {nextLesson && stats.completed > 0 && (
                            <span className="text-[11px] text-zinc-600 max-w-[140px] text-right leading-tight">
                              {tr(nextLesson.id, nextLesson.title).split(":")[0]}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Chevron déplier / replier */}
                    {!formation.disabled && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(formation.id);
                        }}
                        aria-label={isExpanded ? "Replier le module" : "Déplier le module"}
                        aria-expanded={isExpanded}
                        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-colors mt-1"
                      >
                        <ChevronIcon open={isExpanded} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Liste des leçons */}
                {isExpanded && !formation.disabled && (
                  <div className="divide-y divide-zinc-800/60">
                  {formation.lessons.map((lesson, i) => {
                    const completed = mounted && isLessonComplete(progress, formation.id, lesson.id);
                    const isActive = mounted && activeLessonKey === `${formation.id}:${lesson.id}`;

                    const row = (
                      <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3 min-w-0">

                          {/* Numéro / check */}
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            completed
                              ? "bg-emerald-500/10 border border-emerald-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}>
                            {completed ? <CheckIcon /> : i + 1}
                          </div>

                          {/* Titre + badge "En cours" */}
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <span className="text-sm font-medium truncate text-white">
                              {tr(lesson.id, lesson.title)}
                            </span>
                            {isActive && (
                              <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 uppercase tracking-wide">
                                <span className="w-1 h-1 rounded-full bg-amber-400" />
                                {common.status.inProgress}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-zinc-700">{lesson.duration}</span>
                          {!completed && (
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-emerald-400">
                              <path d="M5.5 10.5l4-4-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                    );

                    return (
                      <Link
                        key={lesson.id}
                        href={localizedHref(lesson.href, locale)}
                        className={`block transition-colors ${
                          isActive
                            ? "bg-amber-400/5 hover:bg-amber-400/10"
                            : "hover:bg-zinc-800/40"
                        }`}
                      >
                        {row}
                      </Link>
                    );
                  })}
                </div>
                )}

                {/* Bouton mobile */}
                {isExpanded && !formation.disabled && !allDone && nextLesson && (
                  <div className="px-6 py-4 border-t border-zinc-800 md:hidden">
                    <Link
                      href={localizedHref(nextLesson.href, locale)}
                      className={`flex items-center justify-between ${colors?.button ?? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950"} text-sm font-semibold px-4 py-3 rounded-xl transition-colors`}
                    >
                      <span>{stats.completed === 0 ? common.buttons.start : common.buttons.continue}</span>
                      <span className="opacity-70 text-xs font-normal truncate max-w-[160px]">
                        {tr(nextLesson.id, nextLesson.title).split(":")[0]}
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}
