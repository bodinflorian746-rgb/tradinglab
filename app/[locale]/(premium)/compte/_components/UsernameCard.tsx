"use client";

// Bloc « Mon pseudo » de Mon compte : affichage, copie et modification du
// pseudo public (public.profiles.username). Même style visuel que
// GroupMembership.tsx du même dossier (rounded-2xl border zinc-800
// bg-zinc-900/50, boutons secondaires zinc-700/zinc-300, action primaire
// emerald-500) — aucune nouvelle couleur. Même pattern client :
// useTransition pour l'appel async, erreur affichée via un état local
// (role="status"), router.refresh() après succès (pas de mise à jour
// optimiste). Pas de dictionnaire i18n (composant hors du périmètre des
// fichiers autorisés pour ajouter des clés de traduction) : texte français
// direct, comme les messages renvoyés par updateUsernameAction.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUsernameAction } from "../actions";

export function UsernameCard({ username }: { username: string | null }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(username ?? "");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function onCopy() {
    if (!username) return;
    navigator.clipboard.writeText(username).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function onEdit() {
    setValue(username ?? "");
    setError(null);
    setEditing(true);
  }

  function onCancel() {
    setError(null);
    setEditing(false);
  }

  function onSave() {
    setError(null);
    start(async () => {
      const res = await updateUsernameAction({ username: value });
      if (res.ok) {
        setEditing(false);
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="mb-1 text-lg font-bold">Mon pseudo</h2>

      {!editing ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
          <p className="font-mono text-sm text-white">{username ?? "—"}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCopy}
              disabled={!username}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? "Copié" : "Copier"}
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500"
            >
              Modifier
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={pending}
              maxLength={20}
              className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none disabled:opacity-50"
            />
            <button
              type="button"
              onClick={onSave}
              disabled={pending || !value.trim()}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={pending}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-500 disabled:opacity-60"
            >
              Annuler
            </button>
          </div>
          <p className="text-xs text-zinc-500">3 à 20 caractères, minuscules, chiffres et _</p>
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-400" role="status">
          {error}
        </p>
      )}
    </section>
  );
}
