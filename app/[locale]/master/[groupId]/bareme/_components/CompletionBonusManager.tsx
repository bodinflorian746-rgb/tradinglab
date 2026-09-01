"use client";

// Bonus mensuel de complétion (Master, sous la liste des actions du barème) :
// l'admin choisit un sous-ensemble de règles ACTIVES + un montant + actif/
// inactif. Un seul par groupe (pas de liste comme les règles) — toujours
// affiché comme un unique bloc de configuration, jamais de bascule création/
// édition (contrairement à RuleForm, il n'existe qu'UNE configuration
// possible pour ce groupe).

import { useState, useTransition } from "react";
import { useDict, useLocale } from "@/app/components/LocaleProvider";
import { upsertGroupCompletionBonusAction } from "@/app/[locale]/master/actions";
import { COMPLETION_BONUS_POINTS_MAX, COMPLETION_BONUS_POINTS_MIN } from "@/lib/loyalty/master-validation";
import type { GroupCompletionBonusWithRules, GroupPointRule } from "@/lib/loyalty/types";

export function CompletionBonusManager({
  groupId,
  canWrite,
  rules,
  bonus,
  loadError,
}: {
  groupId: string;
  canWrite: boolean;
  rules: GroupPointRule[];
  bonus: GroupCompletionBonusWithRules | null;
  loadError?: string | null;
}) {
  const t = useDict("master");
  const locale = useLocale();
  const [pending, start] = useTransition();
  const [points, setPoints] = useState(bonus ? String(bonus.points) : "");
  const [isActive, setIsActive] = useState(bonus?.is_active ?? false);
  const [selected, setSelected] = useState<Set<string>>(new Set(bonus?.ruleSlugs ?? []));
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const b = t.bareme.completionBonus;

  // Cases à cocher : règles actives, PLUS toute règle déjà sélectionnée dans
  // le bonus mais devenue inactive depuis (sinon son slug disparaîtrait
  // silencieusement de la config à la prochaine sauvegarde).
  const pickable = rules.filter((r) => r.is_active || selected.has(r.slug));

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      const res = await upsertGroupCompletionBonusAction({
        locale,
        groupId,
        points,
        ruleSlugs: [...selected],
        isActive,
      });
      if (res.ok) {
        setMsg({ ok: true, text: b.success });
      } else {
        const map = b.errors as Record<string, string>;
        setMsg({ ok: false, text: map[res.error] ?? b.errors.db });
      }
    });
  }

  const inputCls =
    "w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none disabled:opacity-50";

  return (
    <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
      <h2 className="mb-1 text-lg font-bold text-white">{b.title}</h2>
      <p className="mb-4 text-sm text-zinc-400">{b.hint}</p>

      {loadError ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {loadError}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium text-zinc-400">{b.rulesLabel}</p>
            {pickable.length === 0 ? (
              <p className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3 text-sm text-zinc-500">
                {b.noActiveRules}
              </p>
            ) : (
              <ul className="space-y-2">
                {pickable.map((rule) => (
                  <li key={rule.id}>
                    <label className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-3">
                      <span className="flex min-w-0 items-center gap-2 text-sm text-zinc-200">
                        <input
                          type="checkbox"
                          checked={selected.has(rule.slug)}
                          onChange={() => toggle(rule.slug)}
                          disabled={pending || !canWrite}
                          className="h-4 w-4 shrink-0 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
                        />
                        <span className="truncate">{rule.label}</span>
                        {!rule.is_active && (
                          <span className="shrink-0 rounded-full bg-zinc-700/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                            {b.inactiveBadge}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-amber-400">+{rule.points}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[160px_1fr]">
            <div>
              <label htmlFor="bonus-points" className="mb-1.5 block text-xs font-medium text-zinc-400">
                {b.pointsLabel}
              </label>
              <input
                id="bonus-points"
                type="number"
                min={COMPLETION_BONUS_POINTS_MIN}
                max={COMPLETION_BONUS_POINTS_MAX}
                step={1}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                disabled={pending || !canWrite}
                required
                className={inputCls}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-zinc-200 sm:self-end sm:pb-2.5">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={pending || !canWrite}
                className="h-4 w-4 shrink-0 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
              />
              {b.activeLabel}
            </label>
          </div>

          {msg && (
            <p className={`text-sm ${msg.ok ? "text-emerald-400" : "text-red-400"}`} role="status">
              {msg.text}
            </p>
          )}

          {canWrite && (
            <button
              type="submit"
              disabled={pending || !points.trim() || selected.size === 0}
              className="w-full rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {pending ? b.saving : b.save}
            </button>
          )}
        </form>
      )}
    </section>
  );
}
