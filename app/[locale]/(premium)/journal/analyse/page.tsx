// Page "Mon Analyse" — DÉ-MOCKÉE. L'analyse globale est désormais calculée à
// partir des vrais trades (getJournalView) via le moteur existant :
// computeCoachReport (coach.ts) + computeCoachInsights (insights.ts) + computeStats.
// Aucune donnée inventée : si l'échantillon est insuffisant, on affiche
// "Données insuffisantes" au lieu de chiffres fictifs.
//
// L'UI (AnalysisView) est conservée à l'identique : on se contente de lui passer
// un objet TraderAnalysis rempli avec des valeurs réelles.

import Link from "next/link";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionaries } from "@/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";
import { getJournalView, computeStats } from "@/lib/journal/queries";
import { computeCoachReport } from "@/lib/journal/coach";
import { computeCoachInsights } from "@/lib/journal/insights";
import type { TradeEntry } from "@/lib/journal/types";
import type { TraderAnalysis } from "@/lib/journal/analysis-mock";
import { AnalysisView } from "../_components/analysis/AnalysisView";
import { CoachDataInsights } from "../_components/CoachDataInsights";

type JournalDict = Dictionaries["journal"];

const RISKY_BEFORE = ["fomo", "euphoric", "frustrated", "impatient"];

// ── Helpers purs (progression réelle par fenêtres chronologiques) ────────────
function decisiveOf(list: TradeEntry[]): TradeEntry[] {
  return list.filter((e) => e.result === "win" || e.result === "loss");
}
function winrateOf(list: TradeEntry[]): number | null {
  const d = decisiveOf(list);
  if (d.length === 0) return null;
  return Math.round((d.filter((e) => e.result === "win").length / d.length) * 100);
}
function avgROf(list: TradeEntry[]): number | null {
  const r = list
    .map((e) => e.r_multiple)
    .filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  if (r.length === 0) return null;
  return Math.round((r.reduce((s, v) => s + v, 0) / r.length) * 100) / 100;
}
function splitChrono(list: TradeEntry[]): { older: TradeEntry[]; recent: TradeEntry[] } {
  const s = [...list].sort(
    (a, b) => new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime(),
  );
  const mid = Math.floor(s.length / 2);
  return { older: s.slice(0, mid), recent: s.slice(mid) };
}

// Construit un TraderAnalysis RÉEL (appelée uniquement quand report.overall != null).
function buildRealAnalysis(
  entries: TradeEntry[],
  t: JournalDict,
  report: ReturnType<typeof computeCoachReport>,
  insights: ReturnType<typeof computeCoachInsights>,
  stats: ReturnType<typeof computeStats>,
): TraderAnalysis {
  const c = t.coach;
  const r = t.analysis.real;
  const setupL = (k: string) => t.options.setup[k as keyof typeof t.options.setup] ?? k;
  const sessionL = (k: string) => t.options.session[k as keyof typeof t.options.session] ?? k;
  const dirL = (k: string) => t.options.direction[k as keyof typeof t.options.direction] ?? k;
  const mistakeL = (k: string) => t.options.main_mistake[k as keyof typeof t.options.main_mistake] ?? k;
  const emoL = (k: string) => t.options.emotion_before[k as keyof typeof t.options.emotion_before] ?? k;

  // ── Progression : deltas réels (fenêtre récente vs ancienne) ──
  const { older, recent } = splitChrono(entries);
  const enoughDelta = decisiveOf(entries).length >= 6 && older.length > 0 && recent.length > 0;
  const wrDelta = enoughDelta ? (winrateOf(recent) ?? 0) - (winrateOf(older) ?? 0) : null;
  const discOlder = enoughDelta ? computeCoachReport(older).discipline.score : null;
  const discRecent = enoughDelta ? computeCoachReport(recent).discipline.score : null;
  const discDelta = discOlder != null && discRecent != null ? discRecent - discOlder : null;
  const rDelta = enoughDelta
    ? Math.round(((avgROf(recent) ?? 0) - (avgROf(older) ?? 0)) * 10) / 10
    : null;

  const fmtPct = (d: number | null) => (d == null ? "—" : `${d >= 0 ? "+" : ""}${d}%`);
  const fmtNum = (d: number | null) => (d == null ? "—" : `${d >= 0 ? "+" : ""}${d}`);
  const fmtR = (d: number | null) => (d == null ? "—" : `${d >= 0 ? "+" : ""}${d.toFixed(1)}`);

  const progression: TraderAnalysis["progression"] = [
    {
      label: t.dashboard.winrate,
      value: `${stats.winrate}%`,
      delta: fmtPct(wrDelta),
      positive: (wrDelta ?? 0) >= 0,
    },
    {
      label: c.scores.discipline,
      value: report.discipline.score != null ? String(report.discipline.score) : "—",
      delta: fmtNum(discDelta),
      positive: (discDelta ?? 0) >= 0,
    },
    {
      label: t.dashboard.avgR,
      value: stats.avgR == null ? "—" : `${stats.avgR > 0 ? "+" : ""}${stats.avgR}`,
      delta: fmtR(rDelta),
      positive: (rDelta ?? 0) >= 0,
    },
  ];

  // ── Forces (max 4) ──
  const strengths: string[] = [];
  if (insights.bestSetup) strengths.push(r.strengthSetup.replace("{x}", setupL(insights.bestSetup.key)));
  if (insights.bestSession) strengths.push(r.strengthSession.replace("{x}", sessionL(insights.bestSession.key)));
  if (insights.bestDirection) strengths.push(r.strengthDirection.replace("{x}", dirL(insights.bestDirection.key)));
  if ((report.discipline.score ?? 0) >= 70) strengths.push(r.strengthDiscipline);
  if (insights.winEmotion) strengths.push(r.strengthEmotion.replace("{x}", emoL(insights.winEmotion.key)));
  if (strengths.length === 0) strengths.push(r.noStrengths);

  // ── Axes d'amélioration (max 4) ──
  const planned = entries.filter((e) => e.followed_plan != null);
  const outOfPlanRate = planned.length
    ? Math.round((planned.filter((e) => e.followed_plan === "no").length / planned.length) * 100)
    : 0;
  const weaknesses: string[] = [];
  if (insights.worstSetup) weaknesses.push(r.weaknessSetup.replace("{x}", setupL(insights.worstSetup.key)));
  if (insights.topMistake) weaknesses.push(r.weaknessMistake.replace("{x}", mistakeL(insights.topMistake.key)));
  if (outOfPlanRate >= 30) weaknesses.push(r.weaknessOutOfPlan);
  if (insights.worstSession) weaknesses.push(r.weaknessSession.replace("{x}", sessionL(insights.worstSession.key)));
  if (insights.lossEmotion && RISKY_BEFORE.includes(insights.lossEmotion.key))
    weaknesses.push(r.weaknessEmotion.replace("{x}", emoL(insights.lossEmotion.key)));
  if (weaknesses.length === 0) weaknesses.push(r.noWeaknesses);

  // ── Comportements détectés (puces courtes) ──
  const better = [
    insights.bestSetup && setupL(insights.bestSetup.key),
    insights.bestSession && sessionL(insights.bestSession.key),
    insights.bestDirection && dirL(insights.bestDirection.key),
  ].filter((x): x is string => !!x);
  const worse = [
    insights.worstSetup && setupL(insights.worstSetup.key),
    insights.worstSession && sessionL(insights.worstSession.key),
    insights.worstDirection && dirL(insights.worstDirection.key),
  ].filter((x): x is string => !!x);

  // ── Objectif (même logique que la page Journal) ──
  let weeklyGoal: TraderAnalysis["weeklyGoal"] = { label: r.noWeaknesses, progress: 0, target: 0 };
  if (report.objective) {
    const o = report.objective;
    const tmpl = c.objectives[o.key as keyof typeof c.objectives];
    weeklyGoal = {
      label: o.x ? tmpl.replace("{x}", mistakeL(o.x)) : tmpl,
      progress: o.progress,
      target: o.target,
    };
  }

  // ── Niveau ──
  const levelName = c.level[report.level.key as keyof typeof c.level];
  const nextName = report.level.nextKey
    ? c.level[report.level.nextKey as keyof typeof c.level]
    : levelName;

  return {
    tradesAnalyzed: entries.length,
    coachIntro: r.intro.replace("{n}", String(entries.length)),
    score: {
      label: c.overall,
      value: report.overall ?? 0,
      max: 100,
      deltaLabel: r.basedOn.replace("{n}", String(entries.length)),
      positive: (report.overall ?? 0) >= 50,
    },
    progression,
    strengths,
    weaknesses,
    behaviors: { better, worse },
    weeklyGoal,
    level: { current: levelName, next: nextName, progress: report.level.progress },
  };
}

export default async function AnalysePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = await getDictionary(locale, "journal");

  const { entries } = await getJournalView();
  const report = computeCoachReport(entries);
  const insights = computeCoachInsights(entries);
  const stats = computeStats(entries);

  const isEmpty = entries.length === 0;
  const insufficient = !isEmpty && report.overall === null;
  const r = t.analysis.real;

  return (
    <main className="min-h-screen text-white">
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[420px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(16,185,129,0.10) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-4xl mx-auto px-5 sm:px-6 py-10 md:py-14">
        {/* En-tête */}
        <div className="mb-8">
          <Link
            href={localizedHref("/journal", locale)}
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.analysis.back}
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t.analysis.nav}</h1>
            {!isEmpty && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {r.basedOn.replace("{n}", String(entries.length))}
              </span>
            )}
          </div>
        </div>

        {isEmpty || insufficient ? (
          <section className="flex flex-col items-center text-center bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-14 md:py-16">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3a5 5 0 015 5v1a4 4 0 01-1 8H8a4 4 0 01-1-8V8a5 5 0 015-5z" stroke="#34d399" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M9 21h6" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">
              {isEmpty ? t.empty.title : r.notEnoughTitle}
            </h2>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              {isEmpty ? r.noTrades : r.notEnoughBody}
            </p>
          </section>
        ) : (
          <div className="space-y-8">
            <AnalysisView a={buildRealAnalysis(entries, t, report, insights, stats)} t={t} />
            <CoachDataInsights insights={insights} t={t} />
          </div>
        )}
      </div>
    </main>
  );
}
