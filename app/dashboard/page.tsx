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

// ── Composants internes ───────────────────────────────────────────────────────

function ProgressBar({
  pct,
  height = "h-1.5",
  color = "bg-emerald-500",
}: {
  pct: number;
  height?: string;
  color?: string;
}) {
  return (
    <div className={`w-full ${height} bg-zinc-800 rounded-full overflow-hidden`}>
      <div
        className={`h-full ${color} rounded-full transition-all duration-700`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function CheckIcon({ className = "text-emerald-400" }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={className}>
      <path d="M1.5 5l3 3 4-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Helper : leçon active ────────────────────────────────────────────────────

function getActiveLesson(progress: ProgressData) {
  for (const f of FORMATIONS) {
    const ids = f.lessons.map((l) => l.id);
    for (let i = 0; i < f.lessons.length; i++) {
      if (
        isLessonUnlocked(progress, f.id, ids, i) &&
        !isLessonComplete(progress, f.id, f.lessons[i].id)
      ) {
        return { formation: f, lesson: f.lessons[i], lessonIndex: i };
      }
    }
  }
  return null;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [progress, setProgress] = useState<ProgressData>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProgress(getStoredProgress());
    setMounted(true);
  }, []);

  const global = mounted
    ? getGlobalStats(progress, FORMATIONS)
    : { completedLessons: 0, totalFreeLessons: 0, pct: 0 };

  const active = mounted ? getActiveLesson(progress) : null;
  const hasStarted = global.completedLessons > 0;
  const allDone = mounted && !active && hasStarted;

  const hour = mounted ? new Date().getHours() : 12;
  const greeting =
    hour < 12 ? "Bonjour" : hour < 18 ? "Bon retour" : "Bonsoir";

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div>
          <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
            {mounted ? greeting : "Bonjour"} · Mon espace
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Tableau de bord
          </h1>
          <p className="text-zinc-500 text-sm">
            {mounted
              ? hasStarted
                ? `${global.completedLessons} leçon${global.completedLessons > 1 ? "s" : ""} terminée${global.completedLessons > 1 ? "s" : ""} · ${global.pct}% du parcours`
                : "Aucune leçon commencée — démarre quand tu veux."
              : " "}
          </p>
        </div>

        {/* ── Statistiques ────────────────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                value: mounted ? global.completedLessons : "—",
                label: "Leçons terminées",
              },
              {
                value: mounted ? `${global.pct}%` : "—",
                label: "Progression",
              },
              {
                value: mounted
                  ? global.totalFreeLessons - global.completedLessons
                  : "—",
                label: "Leçons restantes",
              },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4"
              >
                <p className="text-2xl font-bold tabular-nums">{value}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Barre globale */}
          <ProgressBar pct={mounted ? global.pct : 0} height="h-1" />
        </div>

        {/* ── Formation en cours ──────────────────────────────────────────── */}
        {mounted && (
          <>
            {/* En cours */}
            {active && (
              <div className="border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl p-6">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  En cours
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-500 mb-0.5">
                      Formation {active.formation.title}
                    </p>
                    <h2 className="text-lg font-bold mb-4 leading-snug">
                      {active.lesson.title.replace(/Leçon \d+ : /, "")}
                    </h2>
                    {(() => {
                      const ids = active.formation.lessons.map((l) => l.id);
                      const stats = getFormationStats(
                        progress,
                        active.formation.id,
                        ids
                      );
                      return (
                        <div className="flex items-center gap-3 max-w-xs">
                          <ProgressBar pct={stats.pct} />
                          <span className="text-xs text-zinc-500 shrink-0 tabular-nums">
                            {stats.completed} / {stats.total}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  <Link
                    href={active.lesson.href}
                    className="shrink-0 inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-zinc-950 font-semibold px-6 py-4 rounded-xl transition-all group"
                  >
                    <div>
                      <p className="text-sm leading-tight">
                        {active.lessonIndex === 0 && global.completedLessons === 0
                          ? "Commencer"
                          : "Reprendre"}
                      </p>
                      <p className="text-xs opacity-60 font-normal leading-tight mt-0.5">
                        Leçon {active.lessonIndex + 1}
                      </p>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="group-hover:translate-x-0.5 transition-transform"
                    >
                      <path
                        d="M6 12l5-4-5-4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            )}

            {/* Tout terminé */}
            {allDone && (
              <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-2xl px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold text-white mb-1">
                    Toutes les formations complétées
                  </p>
                  <p className="text-sm text-zinc-400">
                    Félicitations — tu as terminé l'intégralité du parcours.
                  </p>
                </div>
                <Link
                  href="/formations"
                  className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
                >
                  Réviser
                </Link>
              </div>
            )}

            {/* Pas commencé */}
            {!active && !hasStarted && (
              <div className="border border-zinc-800 rounded-2xl px-6 py-10 text-center">
                <p className="font-semibold text-white mb-2">
                  Prêt à commencer ?
                </p>
                <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">
                  La première leçon est accessible immédiatement.
                </p>
                <Link
                  href="/formations/debutant/lecon1"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
                >
                  Commencer la leçon 1
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M5 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </>
        )}

        {/* ── Mes formations ──────────────────────────────────────────────── */}
        <div>
          <h2 className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest mb-4">
            Mes formations
          </h2>

          <div className="space-y-3">
            {FORMATIONS.map((formation) => {
              const lessonIds = formation.lessons.map((l) => l.id);
              const stats = mounted
                ? getFormationStats(progress, formation.id, lessonIds)
                : {
                    completed: 0,
                    total: formation.lessons.length,
                    pct: 0,
                    nextLessonId: lessonIds[0],
                  };
              const nextLesson =
                formation.lessons.find((l) => l.id === stats.nextLessonId) ??
                null;
              const allDone = mounted && stats.completed === stats.total;
              const started = mounted && stats.completed > 0;
              const isActiveFormation = active?.formation.id === formation.id;

              return (
                <div
                  key={formation.id}
                  className={`bg-zinc-900/60 border rounded-2xl overflow-hidden transition-all ${
                    isActiveFormation
                      ? "border-emerald-500/20"
                      : allDone
                      ? "border-emerald-500/10"
                      : "border-zinc-800"
                  }`}
                >
                  {/* Ligne de progression fine */}
                  {mounted && stats.pct > 0 && (
                    <div className="h-0.5 bg-zinc-800">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-700"
                        style={{ width: `${stats.pct}%` }}
                      />
                    </div>
                  )}

                  <div className="p-5">
                    {/* Header formation */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white">
                          {formation.title}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${formation.badgeStyle}`}
                        >
                          {formation.badge}
                        </span>
                        {isActiveFormation && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 uppercase tracking-wide">
                            En cours
                          </span>
                        )}
                        {allDone && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                            Terminée
                          </span>
                        )}
                      </div>
                      {mounted && (
                        <span className="text-xs text-zinc-600 tabular-nums shrink-0">
                          {stats.completed}/{stats.total} leçons
                        </span>
                      )}
                    </div>

                    {/* Liste des leçons */}
                    <div className="space-y-0.5 mb-4">
                      {formation.lessons.map((lesson) => {
                        const isDone =
                          mounted &&
                          isLessonComplete(progress, formation.id, lesson.id);
                        const isCurrent =
                          active?.lesson.id === lesson.id &&
                          active?.formation.id === formation.id;

                        const lessonRow = (
                          <div
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                              isCurrent ? "bg-amber-400/5" : "hover:bg-zinc-800/50"
                            }`}
                          >
                            {/* Icône de statut */}
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                                isDone
                                  ? "bg-emerald-500/10 border-emerald-500/25"
                                  : isCurrent
                                  ? "bg-amber-400/10 border-amber-400/25"
                                  : "bg-zinc-800 border-zinc-700"
                              }`}
                            >
                              {isDone ? (
                                <CheckIcon />
                              ) : isCurrent ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                              )}
                            </div>

                            {/* Titre */}
                            <p
                              className={`text-sm leading-tight flex-1 min-w-0 ${
                                isDone
                                  ? "text-zinc-500"
                                  : isCurrent
                                  ? "text-white font-medium"
                                  : "text-zinc-300"
                              }`}
                            >
                              {lesson.title.replace(/Leçon \d+ : /, "")}
                            </p>

                            {/* Badge ou flèche */}
                            {isCurrent && (
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded shrink-0">
                                En cours
                              </span>
                            )}
                            {isDone && !isCurrent && (
                              <span className="text-[10px] text-zinc-700 shrink-0">
                                {lesson.duration}
                              </span>
                            )}
                            {!isDone && !isCurrent && (
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                className="text-zinc-700 shrink-0"
                              >
                                <path
                                  d="M4 2l4 4-4 4"
                                  stroke="currentColor"
                                  strokeWidth="1.4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        );

                        return (
                          <Link key={lesson.id} href={lesson.href}>
                            {lessonRow}
                          </Link>
                        );
                      })}
                    </div>

                    {/* CTA */}
                    {allDone ? (
                      <Link
                        href={formation.lessons[0].href}
                        className="flex items-center justify-center gap-2 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 text-sm font-medium py-2.5 rounded-xl transition-colors"
                      >
                        <CheckIcon className="text-zinc-500" />
                        Réviser depuis le début
                      </Link>
                    ) : (
                      <Link
                        href={nextLesson?.href ?? formation.lessons[0].href}
                        className="flex items-center justify-between bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors group"
                      >
                        <span>{started ? "Reprendre" : "Commencer"}</span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          className="text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all"
                        >
                          <path
                            d="M5 3l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Liens rapides ───────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-zinc-800/60">
          <Link
            href="/formations"
            className="text-sm text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 px-4 py-2 rounded-lg transition-colors"
          >
            Toutes les formations
          </Link>
          <Link
            href="/strategies"
            className="text-sm text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 px-4 py-2 rounded-lg transition-colors"
          >
            Stratégies
          </Link>
        </div>

      </div>
    </main>
  );
}
