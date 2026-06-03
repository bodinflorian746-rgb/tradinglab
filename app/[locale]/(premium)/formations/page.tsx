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

/* ── Icônes ─────────────────────────────────────────────────────────────── */

function IconCandlesLarge() {
  return (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <line x1="8" y1="4" x2="8" y2="9" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="5" y="9" width="6" height="9" fill="#10b981" rx="1" />
      <line x1="8" y1="18" x2="8" y2="22" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="6" x2="16" y2="10" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="13" y="10" width="6" height="13" fill="#10b981" rx="1" />
      <line x1="16" y1="23" x2="16" y2="27" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="2" x2="24" y2="6" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="21" y="6" width="6" height="17" fill="#10b981" rx="1" />
      <line x1="24" y1="23" x2="24" y2="28" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Débutant : livre ouvert (fondations / apprentissage)
function IconBook() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M4 6c0-1.1.9-2 2-2h7v18H6c-1.1 0-2-.9-2-2V6z" stroke="#34d399" strokeWidth="1.6" strokeLinejoin="round" fill="#10b981" fillOpacity="0.1" />
      <path d="M24 6c0-1.1-.9-2-2-2h-7v18h7c1.1 0 2-.9 2-2V6z" stroke="#34d399" strokeWidth="1.6" strokeLinejoin="round" fill="#10b981" fillOpacity="0.1" />
      <line x1="7" y1="9" x2="11" y2="9" stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="7" y1="12.5" x2="11" y2="12.5" stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="7" y1="16" x2="10" y2="16" stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="17" y1="9" x2="21" y2="9" stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="17" y1="12.5" x2="21" y2="12.5" stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="17" y1="16" x2="20" y2="16" stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

// Intermédiaire : graphique en hausse (progression)
function IconChartUp() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <line x1="4" y1="23" x2="24" y2="23" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="4" y1="23" x2="4" y2="5" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M6 18l5-5 4 4 7-9" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M17 8h5v5" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="11" cy="13" r="1.6" fill="#60a5fa" />
      <circle cx="15" cy="17" r="1.6" fill="#60a5fa" />
    </svg>
  );
}

// Avancé : diamant (maîtrise / expertise)
function IconDiamond() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 4l5 6-5 16-5-16 5-6z" stroke="#fbbf24" strokeWidth="1.6" strokeLinejoin="round" fill="#fbbf24" fillOpacity="0.2" />
      <path d="M6 10h16" stroke="#fbbf24" strokeWidth="1.6" />
      <path d="M14 4l-5 6h10l-5-6z" fill="#fbbf24" fillOpacity="0.35" stroke="#fbbf24" strokeWidth="1.6" strokeLinejoin="round" />
      <line x1="11" y1="10" x2="14" y2="26" stroke="#fbbf24" strokeWidth="1.2" opacity="0.5" />
      <line x1="17" y1="10" x2="14" y2="26" stroke="#fbbf24" strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}

// MT5 : moniteur avec petit graphique (désactivé, zinc)
function IconMonitor() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="22" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="10" y1="23" x2="18" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="19" x2="14" y2="23" stroke="currentColor" strokeWidth="1.5" />
      <polyline points="7,15 10,11 13,13 17,8 20,11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Theme par niveau ───────────────────────────────────────────────────── */

type LevelTheme = {
  Icon:        () => React.ReactElement;
  iconBg:      string;
  iconBorder:  string;
  iconGlow:    string;
  cardHover:   string;
  textAccent:  string;
  progressBar: string;
};

const LEVEL_THEMES: Record<string, LevelTheme> = {
  debutant: {
    Icon:        IconBook,
    iconBg:      "bg-emerald-500/10",
    iconBorder:  "border-emerald-500/20",
    iconGlow:    "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    cardHover:   "hover:border-emerald-500/40 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.25)] hover:scale-[1.02]",
    textAccent:  "text-emerald-400",
    progressBar: "bg-emerald-500",
  },
  intermediaire: {
    Icon:        IconChartUp,
    iconBg:      "bg-blue-500/10",
    iconBorder:  "border-blue-500/20",
    iconGlow:    "shadow-[0_0_20px_rgba(59,130,246,0.15)]",
    cardHover:   "hover:border-blue-500/40 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.25)] hover:scale-[1.02]",
    textAccent:  "text-blue-400",
    progressBar: "bg-blue-400",
  },
  avance: {
    Icon:        IconDiamond,
    iconBg:      "bg-amber-400/10",
    iconBorder:  "border-amber-400/20",
    iconGlow:    "shadow-[0_0_20px_rgba(251,191,36,0.15)]",
    cardHover:   "hover:border-amber-400/40 hover:shadow-[0_0_40px_-10px_rgba(251,191,36,0.25)] hover:scale-[1.02]",
    textAccent:  "text-amber-400",
    progressBar: "bg-amber-400",
  },
  mt5: {
    Icon:        IconMonitor,
    iconBg:      "bg-zinc-800/40",
    iconBorder:  "border-zinc-700/60",
    iconGlow:    "",
    cardHover:   "",
    textAccent:  "text-zinc-500",
    progressBar: "bg-zinc-700",
  },
};

/* ── Helpers ─────────────────────────────────────────────────────────────── */

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

/* ── Page ────────────────────────────────────────────────────────────────── */

type FormationDictEntry = {
  title?: string;
  description?: string;
  badge?: string;
  lessons?: Record<string, { title?: string; duration?: string }>;
};

type FormationsDict = Record<string, FormationDictEntry | undefined> & {
  page?: { hero?: { title?: string; subtitle?: string } };
};

export default function FormationsPage() {
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

  const global = mounted
    ? getGlobalStats(progress, FORMATIONS)
    : { completedLessons: 0, totalFreeLessons: 0, pct: 0 };

  const activeLessonKey = mounted ? getActiveLessonKey(progress) : null;

  // Hero text — fallback FR si ES n&apos;a pas la clé page.hero
  const isEs = locale === "es";
  const heroTitle = fdict.page?.hero?.title ?? "Trading";
  const heroSubtitle = fdict.page?.hero?.subtitle ?? (isEs
    ? "Domina las bases y construye setups sólidos en cada etapa de tu progresión."
    : "Maîtrise les bases et construis des setups solides à chaque étape de ta progression.");

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Halo emerald radial diffus en haut */}
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(16,185,129,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">

        {/* ── HERO ── */}
        <section className="text-center mb-14 md:mb-16">
          <div className="inline-flex w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)] mb-6">
            <IconCandlesLarge />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{heroTitle}</h1>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            {heroSubtitle}
          </p>

          {/* Progression globale */}
          <div className="max-w-md mx-auto bg-zinc-900/60 border border-zinc-800 rounded-xl px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white tabular-nums">
                {common.lessons.globalCount
                  .replace("{done}", String(global.completedLessons))
                  .replace("{total}", String(global.totalFreeLessons))}
              </span>
              <span className="text-xs font-medium text-emerald-400 tabular-nums">{global.pct}%</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${global.pct}%` }}
              />
            </div>
          </div>
        </section>

        {/* ── CARDS GRID ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FORMATIONS.map((formation) => {
            const theme = LEVEL_THEMES[formation.id] ?? LEVEL_THEMES.debutant;
            const lessonIds = formation.lessons.map((l) => l.id);
            const stats = mounted
              ? getFormationStats(progress, formation.id, lessonIds)
              : { completed: 0, total: formation.lessons.length, pct: 0, nextLessonId: lessonIds[0] };
            const nextLesson =
              formation.lessons.find((l) => l.id === stats.nextLessonId) ?? formation.lessons[0];
            const allDone = stats.completed === stats.total && mounted;
            const isDisabled = !!formation.disabled;
            const fEntry = fdict[formation.id];
            const fTitle = fEntry?.title ?? formation.title;
            const fDesc = fEntry?.description ?? formation.description;
            const isActive = !!(activeLessonKey && activeLessonKey.startsWith(`${formation.id}:`));

            const baseClasses =
              "group flex flex-col bg-gradient-to-b from-zinc-900/80 to-zinc-900/30 border border-zinc-800 rounded-2xl p-6 transition-all duration-200";
            const cardClasses = isDisabled
              ? `${baseClasses} opacity-60 cursor-not-allowed`
              : `${baseClasses} ${theme.cardHover}`;

            const ctaLabel = isDisabled
              ? common.status.comingSoon
              : allDone
                ? common.buttons.review
                : stats.completed === 0
                  ? common.buttons.start
                  : common.buttons.continue;

            const cardInner = (
              <>
                <div className="flex justify-center mb-5">
                  <div
                    className={`w-16 h-16 rounded-2xl ${theme.iconBg} border ${theme.iconBorder} flex items-center justify-center ${theme.iconGlow} ${
                      isDisabled ? "text-zinc-600" : ""
                    }`}
                  >
                    <theme.Icon />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                  <h3 className="text-xl font-bold text-white">{fTitle}</h3>
                  {isActive && !isDisabled && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 uppercase tracking-wide">
                      <span className="w-1 h-1 rounded-full bg-amber-400" />
                      {common.status.inProgress}
                    </span>
                  )}
                </div>

                <p className="text-[13px] text-zinc-400 text-center leading-relaxed mb-5 flex-1">
                  {fDesc}
                </p>

                {/* Compteur + barre de progression */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-zinc-500 tabular-nums">
                      {stats.completed}/{stats.total} {isEs ? "lecciones" : "leçons"}
                    </span>
                    {allDone && (
                      <span className={`text-[10px] font-bold ${theme.textAccent}`}>
                        {common.status.done}
                      </span>
                    )}
                    {isDisabled && (
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                        {common.status.comingSoon}
                      </span>
                    )}
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${theme.progressBar} rounded-full transition-all duration-500`}
                      style={{ width: `${stats.pct}%` }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <span
                  className={`inline-flex items-center justify-center gap-1.5 text-sm font-semibold ${theme.textAccent} ${
                    isDisabled ? "" : "group-hover:gap-2 transition-all"
                  }`}
                >
                  {ctaLabel}
                  {!isDisabled && <IconArrow />}
                </span>
              </>
            );

            if (isDisabled) {
              return (
                <div key={formation.id} className={cardClasses} aria-disabled="true">
                  {cardInner}
                </div>
              );
            }

            return (
              <Link
                key={formation.id}
                href={localizedHref(`/formations/${formation.id}`, locale)}
                className={cardClasses}
              >
                {cardInner}
              </Link>
            );
          })}
        </section>

      </div>
    </main>
  );
}
