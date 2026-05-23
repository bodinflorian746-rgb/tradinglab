"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  loadProfile,
  resetProfile,
  SKILL_LABELS,
  SKILL_DESCRIPTIONS,
  GAME_LABELS,
  type GameId,
  type Recommendation,
  type SkillId,
  type SkillScore,
  type TraderProfileSnapshot,
} from "@/lib/trader-profile";
import { MicroFeedback } from "@/app/components/MicroFeedback";
import { useLocale, useDict } from "@/app/components/LocaleProvider";
import { localizedHref } from "@/lib/i18n/href";
import type { Locale } from "@/i18n/config";
import type { Dictionaries } from "@/i18n/dictionaries";

type ProfileDict = Dictionaries["profile"];

// Helpers de lookup typés sur le dico profile. Fallback FR vers constantes si
// la clé manque côté locale (ex : EN vide → bascule sur FR ou hardcoded FR).
function skillLabel(t: ProfileDict, id: SkillId): string {
  return t.skills?.labels?.[id] ?? SKILL_LABELS[id];
}
function skillDescription(t: ProfileDict, id: SkillId): string {
  return t.skills?.descriptions?.[id] ?? SKILL_DESCRIPTIONS[id];
}
function gameLabel(t: ProfileDict, id: GameId): string {
  return t.gameLabels?.[id] ?? GAME_LABELS[id];
}
function profileName(t: ProfileDict, id: string, fallback: string): string {
  return t.profiles?.[id as keyof ProfileDict["profiles"]]?.name ?? fallback;
}
function profileDescription(t: ProfileDict, id: string, fallback: string): string {
  return t.profiles?.[id as keyof ProfileDict["profiles"]]?.description ?? fallback;
}
function recoReason(t: ProfileDict, id: SkillId, fallback: string): string {
  return t.recommendations?.[id]?.reason ?? fallback;
}
function recoGameLabel(t: ProfileDict, id: SkillId, fallback: string): string {
  return t.recommendations?.[id]?.gameLabel ?? fallback;
}
function recoLessonLabel(t: ProfileDict, id: SkillId, fallback: string | undefined): string | undefined {
  const r = t.recommendations?.[id];
  return ("lessonLabel" in (r ?? {}) ? (r as { lessonLabel?: string }).lessonLabel : undefined) ?? fallback;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ProfilTraderPage() {
  const locale = useLocale();
  const t = useDict("profile");
  const [snapshot, setSnapshot] = useState<TraderProfileSnapshot | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSnapshot(loadProfile());
    setMounted(true);
  }, []);

  const handleReset = () => {
    if (confirm(t.page.resetConfirm)) {
      resetProfile();
      setSnapshot(loadProfile());
    }
  };

  if (!mounted || !snapshot) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-sm text-zinc-500">{t.page.loading}</p>
      </main>
    );
  }

  // État vide : aucun event
  if (snapshot.totalEvents === 0) {
    return <EmptyState locale={locale} t={t} />;
  }

  const profile = snapshot.primaryProfile;
  const hasEnoughData = snapshot.totalEvents >= 10;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* Micro-feedback : "Ton profil trader commence à prendre forme" affiché
          UNE FOIS, dès qu'on a au moins 3 events trackés. */}
      <MicroFeedback milestone="profile_forming" condition={snapshot.totalEvents >= 3} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
            {t.page.eyebrow}
          </p>
          <button
            onClick={handleReset}
            className="text-[10px] text-zinc-600 hover:text-red-400 uppercase tracking-wide font-medium"
          >
            {t.page.reset}
          </button>
        </div>

        {/* HERO : Profil principal */}
        <div className="bg-gradient-to-br from-emerald-500/[0.08] to-zinc-900/60 border border-emerald-500/30 rounded-2xl p-5 sm:p-7 mb-6">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2.5">
            {t.page.profileMain}
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
            {profileName(t, profile.id, profile.name)}
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-4">
            {profileDescription(t, profile.id, profile.description)}
          </p>
          {!hasEnoughData && (
            <div className="flex items-center gap-2 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M6 4v3M6 8.5v0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              {t.page.minRounds.replace("{events}", String(snapshot.totalEvents))}
            </div>
          )}
        </div>

        {/* Stats globales */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
          <BigStat
            label={t.stats.events}
            value={`${snapshot.totalEvents}`}
            colorClass="text-white"
          />
          <BigStat
            label={t.stats.accuracy}
            value={accuracyStr(snapshot)}
            colorClass={accuracyColor(snapshot)}
          />
          <BigStat
            label={t.stats.strengths}
            value={`${snapshot.strengths.length}`}
            colorClass="text-emerald-400"
          />
          <BigStat
            label={t.stats.weaknesses}
            value={`${snapshot.weaknesses.length}`}
            colorClass={snapshot.weaknesses.length > 0 ? "text-red-400" : "text-zinc-300"}
          />
        </div>

        {/* Compétences (10 bars) */}
        <Section title={t.sections.skills} subtitle={t.sections.skillsSubtitle}>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-2.5">
            {snapshot.skills.map((s) => (
              <SkillBar key={s.skill} skill={s} t={t} />
            ))}
          </div>
        </Section>

        {/* Forces */}
        {snapshot.strengths.length > 0 && (
          <Section title={t.sections.strengths} subtitle={t.sections.strengthsSubtitle}>
            <div className="grid sm:grid-cols-3 gap-3">
              {snapshot.strengths.map((s) => (
                <StrengthCard key={s.skill} skill={s} t={t} />
              ))}
            </div>
          </Section>
        )}

        {/* Faiblesses */}
        {snapshot.weaknesses.length > 0 && (
          <Section title={t.sections.weaknesses} subtitle={t.sections.weaknessesSubtitle}>
            <div className="grid sm:grid-cols-3 gap-3">
              {snapshot.weaknesses.map((s) => (
                <WeaknessCard key={s.skill} skill={s} t={t} />
              ))}
            </div>
          </Section>
        )}

        {/* Recommandations */}
        {snapshot.recommendations.length > 0 && (
          <Section title={t.sections.recommendations} subtitle={t.sections.recommendationsSubtitle}>
            <div className="flex flex-col gap-3">
              {snapshot.recommendations.map((r) => (
                <RecoCard key={r.skill} reco={r} locale={locale} t={t} />
              ))}
            </div>
          </Section>
        )}

        {/* Stats par jeu */}
        <Section title={t.sections.gameActivity}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(Object.entries(snapshot.gameStats) as [GameId, { wins: number; losses: number; total: number }][])
              .filter(([, st]) => st.total > 0)
              .map(([game, st]) => (
                <GameStatCard key={game} game={game} stats={st} locale={locale} winRateTpl={t.stats2.winRate} t={t} />
              ))}
          </div>
        </Section>

        {/* Historique récent */}
        {snapshot.recentEvents.length > 0 && (
          <Section title={t.sections.recentActivity} subtitle={t.sections.recentSubtitle}>
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl divide-y divide-zinc-800/60">
              {snapshot.recentEvents.map((e, i) => (
                <RecentRow key={i} event={e} timeT={t.time} locale={locale} t={t} />
              ))}
            </div>
          </Section>
        )}

        {/* CTA bas de page */}
        <div className="mt-10 pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">
            {t.footer.tip}
          </p>
          <Link
            href={localizedHref("/jeux", locale)}
            className="flex items-center justify-center gap-2 bg-emerald-500 text-zinc-950 font-bold text-sm px-5 py-3 rounded-xl hover:bg-emerald-400 transition-colors"
          >
            {t.footer.cta}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <div className="mb-3">
        <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">{title}</h2>
        {subtitle && <p className="text-[11px] text-zinc-600 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function BigStat({ label, value, colorClass }: { label: string; value: string; colorClass: string }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-3">
      <p className="text-[10px] text-zinc-600 uppercase tracking-wide font-semibold mb-1">{label}</p>
      <p className={`text-xl font-black tabular-nums ${colorClass}`}>{value}</p>
    </div>
  );
}

function SkillBar({ skill, t }: { skill: SkillScore; t: ProfileDict }) {
  const color = skillColorClass(skill.score);
  const bgFill = skillBgClass(skill.score);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[12px] font-semibold text-zinc-300">{skillLabel(t, skill.skill)}</span>
        <span className={`text-[11px] tabular-nums font-bold ${color}`}>
          {skill.score}
          {skill.events > 0 && <span className="text-zinc-700 font-normal"> · {skill.events}</span>}
        </span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${bgFill}`}
          style={{ width: `${skill.score}%` }}
        />
      </div>
    </div>
  );
}

function StrengthCard({ skill, t }: { skill: SkillScore; t: ProfileDict }) {
  return (
    <div className="bg-emerald-500/8 border border-emerald-500/30 rounded-xl px-4 py-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
          {skillLabel(t, skill.skill)}
        </span>
        <span className="text-sm font-black tabular-nums text-emerald-400">{skill.score}</span>
      </div>
      <p className="text-[11px] text-zinc-400 leading-snug">{skillDescription(t, skill.skill)}</p>
    </div>
  );
}

function WeaknessCard({ skill, t }: { skill: SkillScore; t: ProfileDict }) {
  return (
    <div className="bg-red-500/8 border border-red-500/30 rounded-xl px-4 py-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-bold text-red-400 uppercase tracking-wide">
          {skillLabel(t, skill.skill)}
        </span>
        <span className="text-sm font-black tabular-nums text-red-400">{skill.score}</span>
      </div>
      <p className="text-[11px] text-zinc-400 leading-snug">{skillDescription(t, skill.skill)}</p>
    </div>
  );
}

function RecoCard({ reco, locale, t }: { reco: Recommendation; locale: Locale; t: ProfileDict }) {
  const localReason = recoReason(t, reco.skill, reco.reason);
  const localGameLabel = recoGameLabel(t, reco.skill, reco.gameLabel);
  const localLessonLabel = recoLessonLabel(t, reco.skill, reco.lessonLabel);
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        <p className="text-[11px] font-bold text-blue-400 uppercase tracking-wide">
          {skillLabel(t, reco.skill)}
        </p>
      </div>
      <p className="text-[13px] text-zinc-200 leading-relaxed mb-3">{localReason}</p>
      <div className="flex flex-col gap-2">
        <Link
          href={localizedHref(reco.gameUrl, locale)}
          className="flex items-center justify-between gap-2 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-lg px-3 py-2 transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-emerald-400 shrink-0">
              <path d="M2 6l3-3v6l-3-3zM6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[12px] font-semibold text-emerald-400 truncate">{localGameLabel}</span>
          </div>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="text-emerald-400 shrink-0">
            <path d="M2 5.5h7M6.5 3l3 2.5-3 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        {reco.lessonUrl && localLessonLabel && (
          <Link
            href={localizedHref(reco.lessonUrl, locale)}
            className="flex items-center justify-between gap-2 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 rounded-lg px-3 py-2 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-blue-400 shrink-0">
                <path d="M2 2.5h6.5L10 4v5.5H2v-7zM4 5h4M4 7h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[12px] font-semibold text-blue-400 truncate">{localLessonLabel}</span>
            </div>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="text-blue-400 shrink-0">
              <path d="M2 5.5h7M6.5 3l3 2.5-3 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}

function GameStatCard({
  game,
  stats,
  locale,
  winRateTpl,
  t,
}: {
  game: GameId;
  stats: { wins: number; losses: number; total: number };
  locale: Locale;
  winRateTpl: string;
  t: ProfileDict;
}) {
  const winRate = stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;
  return (
    <Link
      href={localizedHref(`/jeux/${game}`, locale)}
      className="bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900 rounded-xl px-3 py-3 transition-all"
    >
      <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-semibold mb-1 truncate">
        {gameLabel(t, game)}
      </p>
      <p className="text-base font-bold text-white tabular-nums">{stats.total}</p>
      <p className="text-[10px] text-zinc-500 tabular-nums">
        {winRateTpl.replace("{rate}", String(winRate))}
      </p>
    </Link>
  );
}

function RecentRow({
  event,
  timeT,
  locale,
  t,
}: {
  event: { game: GameId; skill: SkillId; outcome: "win" | "loss"; timestamp: number; difficulty: string };
  timeT: ProfileDict["time"];
  locale: Locale;
  t: ProfileDict;
}) {
  const time = formatRelativeTime(event.timestamp, timeT, locale);
  return (
    <div className="px-4 py-2.5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${event.outcome === "win" ? "bg-emerald-500" : "bg-red-500"}`} />
        <span className="text-[11px] text-zinc-400 font-medium truncate">{skillLabel(t, event.skill)}</span>
        <span className="text-[10px] text-zinc-700">·</span>
        <span className="text-[10px] text-zinc-500 truncate">{gameLabel(t, event.game)}</span>
      </div>
      <span className="text-[10px] text-zinc-600 tabular-nums shrink-0">{time}</span>
    </div>
  );
}

function EmptyState({ locale, t }: { locale: Locale; t: ProfileDict }) {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">
          {t.empty.eyebrow}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          {t.empty.title}
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          {t.empty.subtitle}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {(["buy-sell-no-trade", "place-stop", "find-the-mistake", "build-the-trade"] as GameId[]).map((g) => (
            <Link
              key={g}
              href={localizedHref(`/jeux/${g}`, locale)}
              className="bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 rounded-2xl px-5 py-4 transition-all flex items-center justify-between gap-3"
            >
              <span className="text-sm font-bold text-white truncate">{gameLabel(t, g)}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-zinc-600 shrink-0">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </div>
        <Link
          href={localizedHref("/jeux", locale)}
          className="inline-flex items-center gap-2 text-sm text-emerald-400 font-semibold hover:text-emerald-300"
        >
          {t.empty.viewGames}
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 6.5h9M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </main>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function accuracyStr(snapshot: TraderProfileSnapshot): string {
  const wins   = Object.values(snapshot.gameStats).reduce((a, b) => a + b.wins, 0);
  const total  = snapshot.totalEvents;
  if (total === 0) return "—";
  return `${Math.round((wins / total) * 100)}%`;
}

function accuracyColor(snapshot: TraderProfileSnapshot): string {
  const wins  = Object.values(snapshot.gameStats).reduce((a, b) => a + b.wins, 0);
  const total = snapshot.totalEvents;
  if (total === 0) return "text-zinc-300";
  const rate = wins / total;
  return rate >= 0.65 ? "text-emerald-400" : rate >= 0.45 ? "text-amber-400" : "text-red-400";
}

function skillColorClass(score: number): string {
  if (score >= 65) return "text-emerald-400";
  if (score >= 50) return "text-zinc-300";
  if (score >= 35) return "text-amber-400";
  return "text-red-400";
}

function skillBgClass(score: number): string {
  if (score >= 65) return "bg-emerald-500";
  if (score >= 50) return "bg-zinc-500";
  if (score >= 35) return "bg-amber-500";
  return "bg-red-500";
}

function formatRelativeTime(ts: number, t: ProfileDict["time"], locale: Locale): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1)   return t.now;
  if (min < 60)  return t.minAgo.replace("{n}", String(min));
  const h = Math.floor(min / 60);
  if (h < 24)    return t.hourAgo.replace("{n}", String(h));
  const d = Math.floor(h / 24);
  if (d < 7)     return t.dayAgo.replace("{n}", String(d));
  const bcp47 = locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : "en-US";
  return new Date(ts).toLocaleDateString(bcp47, { day: "2-digit", month: "short" });
}
