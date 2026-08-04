"use client";

// Édition inline de la référence Telegram d'un groupe — même modèle que
// RenameGroupForm (app/[locale]/admin/loyalty/groups/[groupId]/_components/
// MemberRoleControls.tsx) : bouton "Modifier" → formulaire inline →
// Enregistrer/Annuler. Composant partagé : utilisé à la fois par le tableau
// de bord Master (Group Admin) et la fiche groupe Super Admin —
// updateGroupTelegramAction accepte les deux (authorizeGroupWrite).

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateGroupTelegramAction } from "../actions";

const ERROR_LABELS: Record<string, string> = {
  unauthenticated: "Session expirée, reconnectez-vous.",
  forbidden: "Action non autorisée.",
  group_suspended: "Groupe suspendu : action désactivée.",
  invalid_telegram: "Référence Telegram invalide.",
  not_found: "Groupe introuvable.",
  db: "Erreur technique, réessayez.",
};

export function TelegramEditForm({
  locale,
  groupId,
  currentValue,
}: {
  locale: string;
  groupId: string;
  currentValue: string | null;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  const [value, setValue] = useState(currentValue ?? "");
  const [err, setErr] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    start(async () => {
      const res = await updateGroupTelegramAction({ locale, groupId, telegramReference: value.trim() });
      if (res.ok) {
        setEditing(false);
        router.refresh();
      } else {
        setErr(ERROR_LABELS[res.error] ?? ERROR_LABELS.db);
      }
    });
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setValue(currentValue ?? "");
          setEditing(true);
        }}
        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
      >
        Modifier
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={pending}
        autoFocus
        placeholder="@handle ou lien Telegram"
        className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "…" : "Enregistrer"}
      </button>
      <button
        type="button"
        onClick={() => {
          setEditing(false);
          setErr(null);
        }}
        disabled={pending}
        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-500"
      >
        Annuler
      </button>
      {err && <span className="text-[11px] text-red-400">{err}</span>}
    </form>
  );
}
