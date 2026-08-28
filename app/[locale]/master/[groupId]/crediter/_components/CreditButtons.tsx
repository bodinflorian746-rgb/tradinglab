"use client";

// Trois boutons (ou autant que de règles actives) portant leur valeur lue du
// barème — jamais une saisie libre de montant. Même pattern que
// MarkDeliveredButton (commandes/_components/) : useTransition, feedback
// inline, router.refresh() après succès. Pas de dictionnaire i18n (écran hors
// périmètre des fichiers ayant un namespace dédié) : messages français
// directs, comme le reste de cette Server Action.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { creditContributionAction } from "../actions";
import type { GroupPointRule } from "@/lib/loyalty/types";

const ERROR_MESSAGES: Record<string, string> = {
  unauthenticated: "Tu dois être connecté.",
  forbidden: "Tu n'as pas les droits sur ce groupe.",
  rule_not_found: "Cette règle n'est plus disponible.",
  not_member: "Cet utilisateur n'est plus membre actif du groupe.",
  db: "Une erreur est survenue, réessaie plus tard.",
};

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
        setMsg({ ok: true, text: `+${res.amount} points crédités (${res.label}).` });
        router.refresh();
      } else {
        setMsg({ ok: false, text: ERROR_MESSAGES[res.error] ?? ERROR_MESSAGES.db });
      }
      setPendingSlug(null);
    });
  }

  if (rules.length === 0) {
    return (
      <p className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-500">
        Aucune règle de barème active pour ce groupe.
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
            {pending && pendingSlug === rule.slug ? "Crédit..." : `${rule.label} (+${rule.points})`}
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
