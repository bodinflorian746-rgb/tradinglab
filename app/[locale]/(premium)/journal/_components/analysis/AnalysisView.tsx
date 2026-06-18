// Vue "Mon Analyse" (Server Component, présentationnel). Compose les 7 sections
// à partir d'un objet TraderAnalysis mocké. Ton = débrief de coach.

import type { TraderAnalysis } from "@/lib/journal/analysis-mock";
import type { Dictionaries } from "@/i18n/dictionaries";
import { ScoreGauge } from "./ScoreGauge";

type JournalDict = Dictionaries["journal"];

function DeltaBadge({ delta, positive }: { delta: string; positive: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold rounded-full px-2 py-0.5 ${
        positive
          ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
          : "text-red-400 bg-red-500/10 border border-red-500/20"
      }`}
    >
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
          d={positive ? "M6 9V3M6 3L3 6M6 3l3 3" : "M6 3v6M6 9L3 6M6 9l3-3"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {delta}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">
      {children}
    </h2>
  );
}

export function AnalysisView({ a, t }: { a: TraderAnalysis; t: JournalDict }) {
  const s = t.analysis;

  return (
    <div className="space-y-8">
      {/* Intro coach */}
      <div className="flex items-start gap-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5">
        <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-[0_0_20px_-6px_rgba(16,185,129,0.4)]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3a5 5 0 015 5v1a4 4 0 01-1 8H8a4 4 0 01-1-8V8a5 5 0 015-5z" stroke="#34d399" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M9 21h6" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide mb-1">
            {s.coachName}
          </p>
          <p className="text-sm text-zinc-200 leading-relaxed">{a.coachIntro}</p>
        </div>
      </div>

      {/* SECTION 1 — Score global */}
      <section>
        <SectionTitle>{s.sections.score}</SectionTitle>
        <div className="bg-gradient-to-br from-emerald-500/10 to-zinc-900/40 border border-emerald-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
          <ScoreGauge value={a.score.value} max={a.score.max} label={a.score.label} />
          <div className="text-center sm:text-left">
            <p className="text-2xl font-bold text-white mb-2">{a.score.label}</p>
            <DeltaBadge delta={a.score.deltaLabel} positive={a.score.positive} />
          </div>
        </div>
      </section>

      {/* SECTION 2 — Progression */}
      <section>
        <SectionTitle>{s.sections.progression}</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {a.progression.map((m) => (
            <div key={m.label} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-4">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500 font-medium mb-1">
                {m.label}
              </p>
              <div className="flex items-end justify-between gap-2">
                <span className="text-2xl font-bold text-white tabular-nums">{m.value}</span>
                <DeltaBadge delta={m.delta} positive={m.positive} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTIONS 3 & 4 — Forces / Axes */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5">
          <SectionTitle>{s.sections.strengths}</SectionTitle>
          <ul className="space-y-2.5">
            {a.strengths.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2.5 6.2l2.2 2.3L9.5 3.5" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-sm text-zinc-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5">
          <SectionTitle>{s.sections.weaknesses}</SectionTitle>
          <ul className="space-y-2.5">
            {a.weaknesses.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-400/15 border border-amber-400/25 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M6 2.5v4M6 8.5h.01" stroke="#fbbf24" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="text-sm text-zinc-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 5 — Comportements détectés */}
      <section>
        <SectionTitle>{s.sections.behaviors}</SectionTitle>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-emerald-400 mb-2.5">{s.behaviorsBetter}</p>
            <div className="flex flex-wrap gap-2">
              {a.behaviors.better.map((b) => (
                <span key={b} className="text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div className="border-t border-zinc-800/70 pt-4">
            <p className="text-xs font-semibold text-amber-400 mb-2.5">{s.behaviorsWorse}</p>
            <div className="flex flex-wrap gap-2">
              {a.behaviors.worse.map((b) => (
                <span key={b} className="text-xs font-medium text-amber-300 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1.5">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — Objectif de la semaine */}
      <section>
        <SectionTitle>{s.sections.goal}</SectionTitle>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5">
          <p className="text-base font-semibold text-white mb-4">« {a.weeklyGoal.label} »</p>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {Array.from({ length: a.weeklyGoal.target }).map((_, i) => (
                <span
                  key={i}
                  className={`w-7 h-7 rounded-full border flex items-center justify-center ${
                    i < a.weeklyGoal.progress
                      ? "bg-emerald-500/20 border-emerald-500/40"
                      : "bg-zinc-800/40 border-zinc-700/50"
                  }`}
                >
                  {i < a.weeklyGoal.progress && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2.5 6.2l2.2 2.3L9.5 3.5" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
              ))}
            </div>
            <span className="text-sm text-zinc-400 tabular-nums">
              {s.goalProgress
                .replace("{done}", String(a.weeklyGoal.progress))
                .replace("{target}", String(a.weeklyGoal.target))}
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 7 — Niveau */}
      <section>
        <SectionTitle>{s.sections.level}</SectionTitle>
        <div className="bg-gradient-to-br from-emerald-500/10 to-zinc-900/40 border border-emerald-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">{s.levelCurrent}</p>
              <p className="text-lg font-bold text-emerald-400">{a.level.current}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">{s.levelNext}</p>
              <p className="text-sm font-semibold text-zinc-300">{a.level.next}</p>
            </div>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${a.level.progress}%` }}
            />
          </div>
          <p className="text-right text-xs font-medium text-emerald-400 mt-1.5 tabular-nums">
            {a.level.progress}%
          </p>
        </div>
      </section>
    </div>
  );
}
