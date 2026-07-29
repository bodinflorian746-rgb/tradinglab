"use client";

// Contrôles d'écriture Super Admin (seuls de la console fidélité) : promouvoir
// / rétrograder un membre existant, attribuer le rôle admin à un utilisateur
// par e-mail (compte TradeScaleX existant), et renommer le groupe. Réutilise
// setGroupMemberRoleAction / addGroupAdminByEmailAction / renameGroupAction —
// aucune nouvelle table.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setGroupMemberRoleAction, addGroupAdminByEmailAction, renameGroupAction } from "../../../actions";

const ERROR_LABELS: Record<string, string> = {
  forbidden: "Action non autorisée.",
  invalid: "Identifiant invalide.",
  invalid_email: "Adresse e-mail invalide.",
  invalid_name: "Nom de groupe invalide.",
  user_not_found: "Aucun compte TradeScaleX ne correspond à cet identifiant.",
  email_not_found: "Aucun compte TradeScaleX ne correspond à cette adresse e-mail. L'utilisateur doit d'abord créer son compte.",
  not_found: "Cet utilisateur n'est pas membre de ce groupe.",
  db: "Erreur technique, réessayez.",
};

export function RoleToggleButton({
  locale,
  groupId,
  userId,
  role,
}: {
  locale: string;
  groupId: string;
  userId: string;
  role: "admin" | "member";
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const nextRole = role === "admin" ? "member" : "admin";

  function onClick() {
    setErr(null);
    const label =
      nextRole === "admin"
        ? "Promouvoir cet utilisateur administrateur de ce groupe ?"
        : "Retirer le rôle administrateur de ce groupe à cet utilisateur ?";
    if (!window.confirm(label)) return;
    start(async () => {
      const res = await setGroupMemberRoleAction({ locale, groupId, userId, role: nextRole });
      if (res.ok) {
        router.refresh();
      } else {
        setErr(ERROR_LABELS[res.error] ?? ERROR_LABELS.db);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-emerald-500/50 hover:text-emerald-400 disabled:opacity-50"
      >
        {pending ? "…" : nextRole === "admin" ? "Promouvoir admin" : "Rétrograder membre"}
      </button>
      {err && <span className="text-[11px] text-red-400">{err}</span>}
    </div>
  );
}

export function AssignAdminForm({ locale, groupId }: { locale: string; groupId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      const res = await addGroupAdminByEmailAction({ locale, groupId, email: email.trim() });
      if (res.ok) {
        setMsg({ ok: true, text: "Rôle administrateur attribué." });
        setEmail("");
        router.refresh();
      } else {
        setMsg({ ok: false, text: ERROR_LABELS[res.error] ?? ERROR_LABELS.db });
      }
    });
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="mb-1 text-lg font-bold">Attribuer le rôle admin à un utilisateur</h2>
      <p className="mb-5 text-sm text-zinc-400">
        Saisis l&rsquo;adresse e-mail d&rsquo;un compte TradeScaleX existant. Aucun nouveau compte
        n&rsquo;est créé : l&rsquo;utilisateur garde son compte normal et reçoit uniquement l&rsquo;accès
        à l&rsquo;espace Admin de ce groupe.
      </p>
      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
        <div className="min-w-[280px] flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@email.com"
            disabled={pending}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={pending || !email.trim()}
          className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Attribution…" : "Attribuer"}
        </button>
      </form>
      {msg && (
        <p className={`mt-4 text-sm ${msg.ok ? "text-emerald-400" : "text-red-400"}`} role="status">
          {msg.text}
        </p>
      )}
    </section>
  );
}

export function RenameGroupForm({
  locale,
  groupId,
  currentName,
}: {
  locale: string;
  groupId: string;
  currentName: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  const [name, setName] = useState(currentName);
  const [err, setErr] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    start(async () => {
      const res = await renameGroupAction({ locale, groupId, name: name.trim() });
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
          setName(currentName);
          setEditing(true);
        }}
        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
      >
        Renommer
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={pending}
        autoFocus
        className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={pending || !name.trim()}
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
