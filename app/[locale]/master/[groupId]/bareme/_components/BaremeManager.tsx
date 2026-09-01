"use client";

// Gestion du barème de points d'un groupe (Master) : liste par sort_order,
// création, édition inline, activation/désactivation, suppression (sauf
// règles système), réordonnancement (flèches haut/bas — plus simple et aussi
// rapide qu'un drag-and-drop pour une liste courte, cf. rapport de mission).
// Écritures désactivées si le groupe est suspendu (canWrite=false, même
// convention que ShopManager/codes).

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDict, useLocale } from "@/app/components/LocaleProvider";
import {
  deleteGroupPointRuleAction,
  reorderGroupPointRuleAction,
  toggleGroupPointRuleStatusAction,
} from "@/app/[locale]/master/actions";
import { TableShell } from "../../../_components/ui";
import { RuleForm } from "./RuleForm";
import { CompletionBonusManager } from "./CompletionBonusManager";
import type { GroupCompletionBonusWithRules, GroupPointRule } from "@/lib/loyalty/types";

function RowActions({
  groupId,
  rule,
  isFirst,
  isLast,
  onEdit,
}: {
  groupId: string;
  rule: GroupPointRule;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
}) {
  const t = useDict("master");
  const locale = useLocale();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [busy, setBusy] = useState<"toggle" | "delete" | "up" | "down" | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function run(kind: "toggle" | "delete" | "up" | "down", fn: () => Promise<{ ok: boolean; error?: string }>) {
    setErr(null);
    setBusy(kind);
    start(async () => {
      const res = await fn();
      if (res.ok) {
        router.refresh();
      } else {
        const map = t.bareme.errors as Record<string, string>;
        setErr(map[res.error ?? "db"] ?? t.bareme.errors.db);
      }
      setBusy(null);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex justify-end gap-1.5">
        <button
          type="button"
          onClick={() => run("up", () => reorderGroupPointRuleAction({ locale, groupId, ruleId: rule.id, direction: "up" }))}
          disabled={pending || isFirst}
          title={t.bareme.moveUp}
          className="rounded-lg border border-zinc-700 px-2 py-1.5 text-xs text-zinc-300 transition-colors hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {busy === "up" ? t.bareme.moving : "↑"}
        </button>
        <button
          type="button"
          onClick={() => run("down", () => reorderGroupPointRuleAction({ locale, groupId, ruleId: rule.id, direction: "down" }))}
          disabled={pending || isLast}
          title={t.bareme.moveDown}
          className="rounded-lg border border-zinc-700 px-2 py-1.5 text-xs text-zinc-300 transition-colors hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {busy === "down" ? t.bareme.moving : "↓"}
        </button>
        <button
          type="button"
          onClick={onEdit}
          disabled={pending}
          className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500"
        >
          {t.bareme.edit}
        </button>
        <button
          type="button"
          onClick={() =>
            run("toggle", () =>
              toggleGroupPointRuleStatusAction({ locale, groupId, ruleId: rule.id, nextActive: !rule.is_active }),
            )
          }
          disabled={pending}
          className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
        >
          {busy === "toggle" ? t.bareme.toggling : rule.is_active ? t.bareme.deactivate : t.bareme.activate}
        </button>
        {!rule.is_system && (
          <button
            type="button"
            onClick={() => {
              if (!window.confirm(t.bareme.deleteConfirm)) return;
              run("delete", () => deleteGroupPointRuleAction({ locale, groupId, ruleId: rule.id }));
            }}
            disabled={pending}
            className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/10"
          >
            {busy === "delete" ? t.bareme.deleting : t.bareme.delete}
          </button>
        )}
      </div>
      {err && <span className="text-[11px] text-red-400">{err}</span>}
    </div>
  );
}

export function BaremeManager({
  groupId,
  canWrite,
  rules,
  loadError,
  bonus,
  bonusLoadError,
}: {
  groupId: string;
  canWrite: boolean;
  rules: GroupPointRule[];
  loadError?: string | null;
  bonus: GroupCompletionBonusWithRules | null;
  bonusLoadError?: string | null;
}) {
  const t = useDict("master");
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const head = [t.bareme.th.label, t.bareme.th.points, t.bareme.th.status, ""];

  return (
    <div className="space-y-4">
      {canWrite && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          {creating ? (
            <RuleForm
              groupId={groupId}
              onDone={() => {
                setCreating(false);
                router.refresh();
              }}
              onCancel={() => setCreating(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
            >
              {t.bareme.newRule}
            </button>
          )}
        </div>
      )}

      <TableShell
        head={head}
        isEmpty={rules.length === 0}
        empty={loadError ?? t.bareme.empty}
        emptyColspan={head.length}
      >
        {rules.map((rule, i) =>
          editingId === rule.id ? (
            <tr key={rule.id} className="border-b border-zinc-800/60 last:border-0">
              <td colSpan={head.length} className="px-4 py-4">
                <RuleForm
                  groupId={groupId}
                  initial={rule}
                  onDone={() => {
                    setEditingId(null);
                    router.refresh();
                  }}
                  onCancel={() => setEditingId(null)}
                />
              </td>
            </tr>
          ) : (
            <tr key={rule.id} className="border-b border-zinc-800/60 last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-zinc-200">{rule.label}</p>
                  {rule.is_system && (
                    <span className="rounded-full bg-zinc-700/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                      {t.bareme.systemBadge}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 font-semibold text-amber-400">+{rule.points}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    rule.is_active ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-700/40 text-zinc-400"
                  }`}
                >
                  {rule.is_active ? t.shop.status.active : t.shop.status.inactive}
                </span>
              </td>
              <td className="px-4 py-3">
                {canWrite && (
                  <RowActions
                    groupId={groupId}
                    rule={rule}
                    isFirst={i === 0}
                    isLast={i === rules.length - 1}
                    onEdit={() => setEditingId(rule.id)}
                  />
                )}
              </td>
            </tr>
          ),
        )}
      </TableShell>

      <CompletionBonusManager
        groupId={groupId}
        canWrite={canWrite}
        rules={rules}
        bonus={bonus}
        loadError={bonusLoadError}
      />
    </div>
  );
}
