// Dashboard du Journal (Server Component, présentationnel).
// V1 simple : total, winrate, R moyen, répartition W/L/BE/en cours, top erreurs.

import type { JournalStats } from "@/lib/journal/types";
import type { Dictionaries } from "@/i18n/dictionaries";

type JournalDict = Dictionaries["journal"];

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-4 flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide text-zinc-500 font-medium">
        {label}
      </span>
      <span className={`text-2xl font-bold tabular-nums ${accent ?? "text-white"}`}>
        {value}
      </span>
    </div>
  );
}

export function JournalDashboard({
  stats,
  t,
}: {
  stats: JournalStats;
  t: JournalDict;
}) {
  const d = t.dashboard;

  return (
    <section>
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-4">
        {d.title}
      </h2>

      {/* KPIs principaux */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label={d.totalTrades} value={String(stats.total)} />
        <StatCard
          label={d.winrate}
          value={`${stats.winrate}%`}
          accent="text-emerald-400"
        />
        <StatCard
          label={d.avgR}
          value={stats.avgR === null ? "—" : `${stats.avgR > 0 ? "+" : ""}${stats.avgR}R`}
          accent={
            stats.avgR === null
              ? "text-white"
              : stats.avgR >= 0
                ? "text-emerald-400"
                : "text-red-400"
          }
        />
        <StatCard label={d.open} value={String(stats.open)} accent="text-amber-400" />
      </div>

      {/* Répartition W / L / BE */}
      <div className="grid grid-cols-3 gap-3 mt-3">
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-zinc-400">{d.wins}</span>
          <span className="text-lg font-bold text-emerald-400 tabular-nums">{stats.wins}</span>
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-zinc-400">{d.losses}</span>
          <span className="text-lg font-bold text-red-400 tabular-nums">{stats.losses}</span>
        </div>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-zinc-400">{d.breakEven}</span>
          <span className="text-lg font-bold text-zinc-300 tabular-nums">{stats.breakEven}</span>
        </div>
      </div>

      {/* Top erreurs + setup le plus utilisé */}
      {(stats.topMistakes.length > 0 || stats.topSetup) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {stats.topMistakes.length > 0 && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">
                {d.topMistakes}
              </h3>
              <ul className="flex flex-col gap-2">
                {stats.topMistakes.map((m) => (
                  <li key={m.key} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-zinc-300 truncate">
                      {t.options.main_mistake[m.key]}
                    </span>
                    <span className="shrink-0 text-[11px] font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-2 py-0.5 tabular-nums">
                      {m.count} {d.occurrences}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stats.topSetup && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-4 flex flex-col justify-center">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">
                {d.topSetup}
              </h3>
              <div className="flex items-center justify-between gap-3">
                <span className="text-lg font-bold text-emerald-400">
                  {t.options.setup[stats.topSetup.key]}
                </span>
                <span className="shrink-0 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5 tabular-nums">
                  {stats.topSetup.count} {d.occurrences}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
