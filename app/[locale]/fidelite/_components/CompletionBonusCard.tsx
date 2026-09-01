// Bonus mensuel de complétion — onglet "Gagner" de l'espace membre. Affiche la
// progression du mois (checklist + barre) et le temps restant (urgence).
// Composant de présentation pur (déjà résolu côté serveur, cf.
// lib/loyalty/member.ts#getMyCompletionBonusStatus) : pas de hook, pas de
// "use client" — rendu par PointsTabs (client) sans effet de bord.

import type { CompletionBonusStatus } from "@/lib/loyalty/member";

export type CompletionBonusDict = {
  title: string;
  subtitle: string; // "{n}" remplacé par le montant du bonus
  daysRemaining: string; // "{n}" remplacé par le nombre de jours restants
  alreadyAwarded: string;
  complete: string;
};

export function CompletionBonusCard({ status, t }: { status: CompletionBonusStatus; t: CompletionBonusDict }) {
  const progressPct = status.totalCount > 0 ? Math.round((status.completedCount / status.totalCount) * 100) : 0;

  return (
    <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-400">{t.title}</h3>
        <span className="shrink-0 text-xs text-zinc-400">
          {t.daysRemaining.replace("{n}", String(status.daysRemaining))}
        </span>
      </div>
      <p className="mb-4 text-sm text-zinc-300">{t.subtitle.replace("{n}", String(status.points))}</p>

      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      <ul className="space-y-2">
        {status.rules.map((r) => (
          <li key={r.slug} className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${
                r.done ? "border-emerald-500 bg-emerald-500 text-zinc-950" : "border-zinc-600 text-transparent"
              }`}
              aria-hidden="true"
            >
              ✓
            </span>
            <span className={`text-sm ${r.done ? "text-zinc-400 line-through decoration-zinc-600" : "text-zinc-200"}`}>
              {r.label}
            </span>
          </li>
        ))}
      </ul>

      {status.alreadyAwardedThisMonth ? (
        <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400">
          {t.alreadyAwarded}
        </p>
      ) : status.complete ? (
        <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400">
          {t.complete}
        </p>
      ) : null}
    </section>
  );
}
