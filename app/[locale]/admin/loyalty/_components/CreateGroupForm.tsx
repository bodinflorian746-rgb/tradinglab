"use client";

// Création d'un groupe (Super Admin) : nom + une ou plusieurs adresses e-mail
// d'administrateurs. Le groupe est une entité séparée des comptes utilisateurs
// (partner_groups) ; les e-mails sont résolus en comptes TradeScaleX EXISTANTS
// côté serveur (createGroupAction → RPC create_group_with_admins) — aucun
// nouveau compte n'est jamais créé ici.

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n/href";
import { createGroupAction } from "../actions";

const ERROR_LABELS: Record<string, string> = {
  forbidden: "Action non autorisée.",
  invalid_name: "Nom de groupe invalide.",
  invalid_emails: "Adresse(s) e-mail invalide(s). Vérifie le format de chaque ligne.",
  no_admins: "Ajoute au moins une adresse e-mail d'administrateur.",
  db: "Erreur technique, réessayez.",
};

export function CreateGroupForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [name, setName] = useState("");
  const [emails, setEmails] = useState<string[]>([""]);
  const [msg, setMsg] = useState<
    { ok: true; text: string; groupId: string } | { ok: false; text: string } | null
  >(null);

  function updateEmail(i: number, value: string) {
    setEmails((prev) => prev.map((e, idx) => (idx === i ? value : e)));
  }
  function addEmailRow() {
    setEmails((prev) => [...prev, ""]);
  }
  function removeEmailRow(i: number) {
    setEmails((prev) => (prev.length <= 1 ? prev : prev.filter((_, idx) => idx !== i)));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      const res = await createGroupAction({ locale, name, adminEmails: emails });
      if (res.ok) {
        setMsg({ ok: true, text: `Groupe « ${name.trim()} » créé.`, groupId: res.groupId });
        setName("");
        setEmails([""]);
        router.refresh();
      } else if (res.error === "email_not_found") {
        setMsg({
          ok: false,
          text: `Aucun compte TradeScaleX ne correspond à ${res.detail} — l'utilisateur doit d'abord créer son compte.`,
        });
      } else {
        setMsg({ ok: false, text: ERROR_LABELS[res.error] ?? ERROR_LABELS.db });
      }
    });
  }

  const inputCls =
    "w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none disabled:opacity-50";

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="mb-1 text-lg font-bold">Créer un groupe</h2>
      <p className="mb-5 text-sm text-zinc-400">
        Le nom identifie le groupe. Chaque adresse e-mail doit correspondre à un compte TradeScaleX déjà
        existant — ces utilisateurs gardent leur compte normal et reçoivent uniquement l&rsquo;accès à
        l&rsquo;espace Admin de ce groupe.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="new-group-name" className="mb-1.5 block text-xs font-medium text-zinc-400">
            Nom du groupe
          </label>
          <input
            id="new-group-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Crypto VIP"
            disabled={pending}
            className={inputCls}
          />
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-medium text-zinc-400">
            Administrateurs (adresses e-mail)
          </span>
          <div className="space-y-2">
            {emails.map((email, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={email}
                  onChange={(e) => updateEmail(i, e.target.value)}
                  placeholder="admin@email.com"
                  disabled={pending}
                  className={inputCls}
                />
                {emails.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEmailRow(i)}
                    disabled={pending}
                    className="shrink-0 rounded-lg border border-zinc-700 px-3 py-2.5 text-xs text-zinc-400 transition-colors hover:border-red-500/50 hover:text-red-400 disabled:opacity-50"
                  >
                    Retirer
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addEmailRow}
            disabled={pending}
            className="mt-2 text-xs font-medium text-emerald-400 transition-colors hover:text-emerald-300 disabled:opacity-50"
          >
            + Ajouter un e-mail
          </button>
        </div>

        <button
          type="submit"
          disabled={pending || !name.trim() || !emails.some((e) => e.trim())}
          className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Création…" : "Créer le groupe"}
        </button>
      </form>

      {msg && (
        <p
          className={`mt-4 text-sm ${msg.ok ? "text-emerald-400" : "text-red-400"}`}
          role="status"
        >
          {msg.text}
          {msg.ok && (
            <>
              {" "}
              <Link
                href={localizedHref(`/admin/loyalty/groups/${msg.groupId}`, locale)}
                className="underline hover:no-underline"
              >
                Voir le groupe →
              </Link>
            </>
          )}
        </p>
      )}
    </section>
  );
}
