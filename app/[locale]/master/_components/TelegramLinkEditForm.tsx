"use client";

// Édition inline du LIEN Telegram cliquable du groupe (group_telegram_link) —
// même modèle que TelegramEditForm (référence Telegram, texte libre) mais
// pour un champ distinct, validé côté serveur (handle ou URL t.me), affiché
// aux membres dans l'onglet "Gagner" de /fidelite.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateGroupTelegramLinkAction } from "../actions";

const ERROR_LABELS: Record<string, string> = {
  unauthenticated: "Session expirée, reconnectez-vous.",
  forbidden: "Action non autorisée.",
  group_suspended: "Groupe suspendu : action désactivée.",
  invalid_telegram_link: "Lien invalide (handle Telegram, ex. @moncanal, ou URL https://t.me/…).",
  db: "Erreur technique, réessayez.",
};

export function TelegramLinkEditForm({
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
      const res = await updateGroupTelegramLinkAction({ locale, groupId, telegramLink: value.trim() });
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
    <form onSubmit={onSubmit} className="flex flex-wrap items-center gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={pending}
        autoFocus
        placeholder="@moncanal ou https://t.me/moncanal"
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
