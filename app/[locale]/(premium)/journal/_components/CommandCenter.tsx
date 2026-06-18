// V0.5 — Command Center du Journal (Server Components, présentationnels).
// PURE UX/hiérarchie : réutilise le mock d'analyse (MOCK_ANALYSIS) et les
// entrées déjà chargées. Aucune logique métier, aucune donnée modifiée.

import Link from "next/link";
import type { TraderAnalysis } from "@/lib/journal/analysis-mock";
import type { TradeEntryView } from "@/lib/journal/types";
import type { Locale } from "@/i18n/config";
import type { Dictionaries } from "@/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";
import { ScoreGauge } from "./analysis/ScoreGauge";

type JournalDict = Dictionaries["journal"];

function CoachIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3a5 5 0 015 5v1a4 4 0 01-1 8H8a4 4 0 01-1-8V8a5 5 0 015-5z" stroke="#34d399" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 21h6" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowCta({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 group-hover:gap-2.5 transition-all">
      {label}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/* ── SECTION 1 — Hero coach ─────────────────────────────────────────────── */
export function CoachHero({
  score,
  level,
  t,
}: {
  score: TraderAnalysis["score"];
  level: TraderAnalysis["level"];
  t: JournalDict;
}) {
  return (
    <section className="bg-gradient-to-br from-emerald-500/15 via-zinc-900/40 to-zinc-900/20 border border-emerald-500/25 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_-24px_rgba(16,185,129,0.5)]">
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
        <ScoreGauge value={score.value} max={score.max} label={score.label} />
        <div className="text-center sm:text-left">
          <p className="text-[11px] uppercase tracking-wide text-emerald-400 font-semibold mb-1">
            {t.analysis.levelCurrent}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-3">{level.current}</p>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 9V3M6 3L3 6M6 3l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {score.deltaLabel}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ── SECTION 2 — Ton coach IA (teaser) ──────────────────────────────────── */
export function CoachInsightsCard({
  strengths,
  weakness,
  locale,
  t,
}: {
  strengths: string[];
  weakness: string | null;
  locale: Locale;
  t: JournalDict;
}) {
  return (
    <Link
      href={localizedHref("/journal/analyse", locale)}
      className="group block bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/40 rounded-2xl p-5 transition-colors"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <CoachIcon />
        </span>
        <div>
          <p className="text-sm font-bold text-white">{t.command.coachTitle}</p>
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">{t.command.thisWeek}</p>
        </div>
      </div>

      <ul className="space-y-2.5 mb-4">
        {strengths.slice(0, 2).map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2.5 6.2l2.2 2.3L9.5 3.5" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-sm text-zinc-300">{item}</span>
          </li>
        ))}
        {weakness && (
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-amber-400/15 border border-amber-400/25 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 2.5v4M6 8.5h.01" stroke="#fbbf24" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="text-sm text-zinc-300">{weakness}</span>
          </li>
        )}
      </ul>

      <ArrowCta label={t.command.seeFullAnalysis} />
    </Link>
  );
}

/* ── SECTION 3 — Objectif de la semaine ─────────────────────────────────── */
export function ObjectiveCard({
  goal,
  t,
}: {
  goal: TraderAnalysis["weeklyGoal"];
  t: JournalDict;
}) {
  return (
    <section className="bg-gradient-to-br from-emerald-500/10 to-zinc-900/40 border border-emerald-500/20 rounded-2xl p-6">
      <p className="text-[11px] uppercase tracking-wide text-emerald-400 font-semibold mb-2">
        {t.analysis.sections.goal}
      </p>
      <p className="text-lg font-bold text-white mb-4">« {goal.label} »</p>
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          {Array.from({ length: goal.target }).map((_, i) => (
            <span
              key={i}
              className={`w-7 h-7 rounded-full border flex items-center justify-center ${
                i < goal.progress
                  ? "bg-emerald-500/20 border-emerald-500/40"
                  : "bg-zinc-800/40 border-zinc-700/50"
              }`}
            >
              {i < goal.progress && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2.5 6.2l2.2 2.3L9.5 3.5" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          ))}
        </div>
        <span className="text-sm text-zinc-400 tabular-nums">
          {t.analysis.goalProgress
            .replace("{done}", String(goal.progress))
            .replace("{target}", String(goal.target))}
        </span>
      </div>
    </section>
  );
}

/* ── SECTION 4 — Comportements détectés (emphase pleine largeur) ─────────── */
export function BehaviorsCard({
  behaviors,
  t,
}: {
  behaviors: TraderAnalysis["behaviors"];
  t: JournalDict;
}) {
  return (
    <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4">
        {t.analysis.sections.behaviors}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <p className="text-xs font-semibold text-emerald-400 mb-2.5">{t.analysis.behaviorsBetter}</p>
          <div className="flex flex-wrap gap-2">
            {behaviors.better.map((b) => (
              <span key={b} className="text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
                {b}
              </span>
            ))}
          </div>
        </div>
        <div className="sm:border-l sm:border-zinc-800/70 sm:pl-5">
          <p className="text-xs font-semibold text-amber-400 mb-2.5">{t.analysis.behaviorsWorse}</p>
          <div className="flex flex-wrap gap-2">
            {behaviors.worse.map((b) => (
              <span key={b} className="text-xs font-medium text-amber-300 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1.5">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── SECTION 5 — Dernière analyse IA ────────────────────────────────────── */
export function LastAnalysisCard({
  entry,
  mistakeLabel,
  locale,
  t,
}: {
  entry: TradeEntryView;
  mistakeLabel: string | null;
  locale: Locale;
  t: JournalDict;
}) {
  return (
    <Link
      href={localizedHref("/journal/analyse", locale)}
      className="group block bg-gradient-to-br from-emerald-500/12 to-zinc-900/40 border border-emerald-500/25 rounded-2xl p-6 transition-colors hover:border-emerald-500/50"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 rounded-full px-2.5 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {t.command.newAnalysis}
        </span>
        <span className="text-xs text-zinc-500 font-medium">{entry.asset}</span>
      </div>

      {entry.ai_summary && (
        <p className="text-sm text-zinc-200 leading-relaxed mb-2">{entry.ai_summary}</p>
      )}

      {mistakeLabel && (
        <p className="text-sm text-amber-300 mb-4">
          <span className="text-zinc-500">{t.command.frequentError} : </span>
          {mistakeLabel}
        </p>
      )}

      <ArrowCta label={t.command.seeAnalysis} />
    </Link>
  );
}
