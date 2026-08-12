// Carte "Tes scores réels" — Discipline / Exécution / Psychologie + Niveau.
// 100% calculée (lib/journal/coach.ts), explicable (chaque score détaille ses
// composantes). Server Component présentationnel. Aucune donnée inventée :
// un score null → "pas assez de données".

import type { CoachReport, ScoreResult } from "@/lib/journal/coach";
import type { Dictionaries } from "@/i18n/dictionaries";

type JournalDict = Dictionaries["journal"];

function bandColor(v: number): string {
  if (v >= 60) return "text-emerald-300";
  if (v >= 40) return "text-amber-300";
  return "text-red-300";
}
function barColor(v: number): string {
  if (v >= 60) return "bg-emerald-500";
  if (v >= 40) return "bg-amber-400";
  return "bg-red-400";
}

function PartRow({
  label,
  value,
  weight,
  weightWord,
}: {
  label: string;
  value: number;
  weight: number;
  weightWord: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-zinc-400 w-40 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden min-w-0">
        <div className={`h-full rounded-full ${barColor(value)}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs tabular-nums text-zinc-300 w-8 text-right shrink-0">{value}</span>
      <span className="text-[10px] tabular-nums text-zinc-600 w-14 text-right shrink-0">
        {Math.round(weight * 100)}% {weightWord}
      </span>
    </div>
  );
}

function ScoreBlock({
  title,
  result,
  t,
}: {
  title: string;
  result: ScoreResult;
  t: JournalDict;
}) {
  const c = t.coach;
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5">
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {result.score != null ? (
          <span className={`text-lg font-bold tabular-nums ${bandColor(result.score)}`}>
            {result.score}
            <span className="text-xs text-zinc-500 font-medium"> / 100</span>
          </span>
        ) : (
          <span className="text-xs font-medium text-zinc-500">{c.notEnough}</span>
        )}
      </div>
      {result.score != null && (
        <div className="space-y-2">
          {result.parts.map((p) => (
            <PartRow
              key={p.key}
              label={c.parts[p.key as keyof typeof c.parts] ?? p.key}
              value={p.value}
              weight={p.weight}
              weightWord={c.weight}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CoachScores({ report, t }: { report: CoachReport; t: JournalDict }) {
  const c = t.coach;
  const lvl = c.level;
  const levelName = lvl[report.level.key as keyof typeof lvl];
  const nextName = report.level.nextKey
    ? lvl[report.level.nextKey as keyof typeof lvl]
    : null;

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-white">{c.scoresTitle}</h2>
        <p className="text-xs text-zinc-500">{c.scoresSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <ScoreBlock title={c.scores.discipline} result={report.discipline} t={t} />
        <ScoreBlock title={c.scores.execution} result={report.execution} t={t} />
        <ScoreBlock title={c.scores.psychology} result={report.psychology} t={t} />
      </div>

      {/* Niveau trader */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-zinc-900/40 border border-emerald-500/20 rounded-2xl p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">{lvl.current}</p>
            <p className="text-lg font-bold text-emerald-400">{levelName}</p>
          </div>
          {nextName && (
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">{lvl.next}</p>
              <p className="text-sm font-semibold text-zinc-300">{nextName}</p>
            </div>
          )}
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${report.level.progress}%` }}
          />
        </div>
        <p className="text-right text-xs font-medium text-emerald-400 mt-1.5 tabular-nums">
          {report.level.progress}%
        </p>
      </div>
    </section>
  );
}
