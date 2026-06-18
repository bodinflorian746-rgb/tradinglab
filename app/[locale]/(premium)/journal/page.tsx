// Page principale du Journal de trading IA (Server Component).
// Récupère les trades de l'utilisateur (RLS) + calcule les stats, puis rend
// le dashboard, la liste et le bouton d'ajout (modale client).

import Link from "next/link";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";
import { getJournalView, computeStats } from "@/lib/journal/queries";
import { MOCK_ANALYSIS } from "@/lib/journal/analysis-mock";
import { JournalDashboard } from "./_components/JournalDashboard";
import { JournalList } from "./_components/JournalList";
import { AddTradeButton } from "./_components/AddTradeButton";
import {
  CoachHero,
  CoachInsightsCard,
  ObjectiveCard,
  BehaviorsCard,
  LastAnalysisCard,
} from "./_components/CommandCenter";

export default async function JournalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;

  const t = await getDictionary(locale, "journal");
  const { entries, isMock } = await getJournalView();
  const stats = computeStats(entries);
  const isEmpty = entries.length === 0;

  // Command center (V0.5) — réutilise le mock d'analyse + les entrées chargées.
  const a = MOCK_ANALYSIS;
  const lastAnalyzed = entries.find((e) => e.ai_status === "analyzed") ?? null;
  const topMistakeKey = stats.topMistakes[0]?.key ?? null;
  const mistakeLabel = topMistakeKey ? t.options.main_mistake[topMistakeKey] : null;

  return (
    <main className="min-h-screen text-white">
      {/* Halo emerald diffus en haut (cohérent avec /formations) */}
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[420px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(16,185,129,0.10) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto px-5 sm:px-6 py-10 md:py-14">
        {/* ── Header slim (le hero coach domine, pas le titre) ── */}
        <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">{t.hero.title}</h1>
            {isMock && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-amber-300 bg-amber-400/10 border border-amber-400/30 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Mode démo local
              </span>
            )}
          </div>
          {!isEmpty && (
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={localizedHref("/journal/analyse", locale)}
                className="inline-flex items-center gap-2 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-300 hover:text-emerald-200 bg-emerald-500/5 hover:bg-emerald-500/10 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 9.5l3.5-3.5 2.5 2.5L14 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10.5 2.5H14v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t.analysis.nav}
              </Link>
              <AddTradeButton variant="primary" />
            </div>
          )}
        </header>

        {isEmpty ? (
          /* ── État vide ── */
          <section className="flex flex-col items-center text-center bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-14 md:py-20">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_24px_rgba(16,185,129,0.18)] mb-5">
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect x="5" y="6" width="22" height="20" rx="3" stroke="#34d399" strokeWidth="1.6" />
                <line x1="5" y1="12" x2="27" y2="12" stroke="#34d399" strokeWidth="1.6" />
                <line x1="10" y1="17" x2="20" y2="17" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="10" y1="21" x2="16" y2="21" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">{t.empty.title}</h2>
            <p className="text-sm text-zinc-400 max-w-sm mb-7 leading-relaxed">
              {t.empty.subtitle}
            </p>
            <AddTradeButton variant="empty" />
          </section>
        ) : (
          <div className="space-y-6">
            {/* 1 — Hero coach (effet wow immédiat) */}
            <CoachHero score={a.score} level={a.level} t={t} />

            {/* 2 — Ton coach IA (teaser → analyse complète) */}
            <CoachInsightsCard
              strengths={a.strengths}
              weakness={a.weaknesses[0] ?? null}
              locale={locale}
              t={t}
            />

            {/* 3 — Objectif de la semaine */}
            <ObjectiveCard goal={a.weeklyGoal} t={t} />

            {/* 4 — Comportements détectés (emphase) */}
            <BehaviorsCard behaviors={a.behaviors} t={t} />

            {/* 5 — Dernière analyse IA (si disponible) */}
            {lastAnalyzed && (
              <LastAnalysisCard
                entry={lastAnalyzed}
                mistakeLabel={mistakeLabel}
                locale={locale}
                t={t}
              />
            )}

            {/* 6 — Statistiques (secondaires) */}
            <div className="pt-4">
              <JournalDashboard stats={stats} t={t} />
            </div>

            {/* 7 — Trades récents (tout en bas) */}
            <div className="pt-4">
              <JournalList entries={entries} t={t} locale={locale} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
