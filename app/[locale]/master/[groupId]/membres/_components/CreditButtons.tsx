"use client";

// Trois boutons (ou autant que de règles actives) portant leur valeur lue du
// barème — jamais une saisie libre de montant. useTransition désactive tous
// les boutons pendant la requête : c'est la seule protection anti-double-clic
// nécessaire, le ledger étant append-only côté base (cf. actions.ts).

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDict } from "@/app/components/LocaleProvider";
import { creditContributionAction } from "../actions";
import type { GroupPointRule } from "@/lib/loyalty/types";

export function CreditButtons({
  locale,
  groupId,
  userId,
  rules,
}: {
  locale: string;
  groupId: string;
  userId: string;
  rules: GroupPointRule[];
}) {
  const t = useDict("master");
  const router = useRouter();
  const [pending, start] = useTransition();
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function onCredit(rule: GroupPointRule) {
    setMsg(null);
    setPendingSlug(rule.slug);
    start(async () => {
      const res = await creditContributionAction({
        locale,
        groupId,
        userId,
        ruleSlug: rule.slug,
      });
      if (res.ok) {
        setMsg({
          ok: true,
          text: t.members.credit.success.replace("{n}", String(res.amount)).replace("{label}", res.label),
        });
        router.refresh();
      } else {
        const map = t.members.credit.errors as Record<string, string>;
        setMsg({ ok: false, text: map[res.error] ?? t.members.credit.errors.db });
      }
      setPendingSlug(null);
    });
  }

  if (rules.length === 0) {
    return (
      <p className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-500">
        {t.members.credit.noRules}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {rules.map((rule) => (
          <button
            key={rule.id}
            type="button"
            onClick={() => onCredit(rule)}
            disabled={pending}
            className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending && pendingSlug === rule.slug ? t.members.credit.crediting : `${rule.label} (+${rule.points})`}
          </button>
        ))}
      </div>
      {msg && (
        <p className={`text-sm ${msg.ok ? "text-emerald-400" : "text-red-400"}`} role="status">
          {msg.text}
        </p>
      )}
    </div>
  );
}
