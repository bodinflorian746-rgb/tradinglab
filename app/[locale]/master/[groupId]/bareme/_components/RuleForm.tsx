"use client";

// Formulaire de création OU d'édition d'une règle de barème (Master). Un seul
// composant pour les deux cas : `initial` fourni → édition (label + points
// uniquement, le slug ne se modifie jamais après création — cf. actions.ts),
// sinon création. Même pattern que ShopItemForm (magasin/_components).

import { useState, useTransition } from "react";
import { useDict, useLocale } from "@/app/components/LocaleProvider";
import { createGroupPointRuleAction, updateGroupPointRuleAction } from "@/app/[locale]/master/actions";
import { RULE_LABEL_MAX_LENGTH, RULE_POINTS_MIN, RULE_POINTS_MAX } from "@/lib/loyalty/master-validation";
import type { GroupPointRule } from "@/lib/loyalty/types";

export function RuleForm({
  groupId,
  initial,
  onDone,
  onCancel,
}: {
  groupId: string;
  initial?: GroupPointRule;
  onDone?: () => void;
  onCancel?: () => void;
}) {
  const t = useDict("master");
  const locale = useLocale();
  const [pending, start] = useTransition();
  const [label, setLabel] = useState(initial?.label ?? "");
  const [points, setPoints] = useState(initial ? String(initial.points) : "");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const isEdit = !!initial;
  const uid = initial?.id ?? "new";

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      const res = isEdit
        ? await updateGroupPointRuleAction({ locale, groupId, ruleId: initial!.id, label, points })
        : await createGroupPointRuleAction({ locale, groupId, label, points });

      if (res.ok) {
        if (!isEdit) {
          setLabel("");
          setPoints("");
        }
        onDone?.();
      } else {
        const map = t.bareme.errors as Record<string, string>;
        setMsg({ ok: false, text: map[res.error] ?? t.bareme.errors.db });
      }
    });
  }

  const inputCls =
    "w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none disabled:opacity-50";

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_140px]">
      <div>
        <label htmlFor={`rule-label-${uid}`} className="mb-1.5 block text-xs font-medium text-zinc-400">
          {t.bareme.form.label}
        </label>
        <input
          id={`rule-label-${uid}`}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          disabled={pending}
          required
          maxLength={RULE_LABEL_MAX_LENGTH}
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor={`rule-points-${uid}`} className="mb-1.5 block text-xs font-medium text-zinc-400">
          {t.bareme.form.points}
        </label>
        <input
          id={`rule-points-${uid}`}
          type="number"
          min={RULE_POINTS_MIN}
          max={RULE_POINTS_MAX}
          step={1}
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          disabled={pending}
          required
          className={inputCls}
        />
      </div>

      {msg && (
        <p className="sm:col-span-2 text-sm text-red-400" role="status">
          {msg.text}
        </p>
      )}

      <div className="flex gap-2 sm:col-span-2">
        <button
          type="submit"
          disabled={pending || !label.trim() || !points.trim()}
          className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? t.bareme.form.saving : isEdit ? t.bareme.form.save : t.bareme.form.create}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500"
          >
            {t.bareme.form.cancel}
          </button>
        )}
      </div>
    </form>
  );
}
