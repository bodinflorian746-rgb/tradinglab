"use client";

// Section « Groupe de fidélité » de Mon compte : rattachement par code de
// référence (réutilise JoinGroupForm tel quel — même Server Action
// join_group_by_reference_code) + liste des groupes déjà rejoints avec un
// bouton « Quitter ce groupe » (confirmation inline, jamais de suppression
// directe) pour chaque adhésion role='member'. Les adhésions 'admin'
// n'affichent jamais de bouton de départ (ce n'est pas leur rôle qui gère
// ça — cf. leaveGroupAction, qui refuse structurellement).
//
// Le formulaire de rattachement reste toujours visible, même si l'utilisateur
// a déjà rejoint un ou plusieurs groupes : rien n'empêche d'en rejoindre un
// de plus (aucune limite à un seul groupe).

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDict, useLocale } from "@/app/components/LocaleProvider";
import { JoinGroupForm } from "@/app/[locale]/fidelite/_components/JoinGroupForm";
import { leaveGroupAction } from "../actions";
import type { MyGroupMembership } from "@/lib/loyalty/member";

function formatDate(iso: string, locale: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const lang = locale === "es" ? "es-ES" : locale === "en" ? "en-US" : "fr-FR";
  return new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", year: "numeric" }).format(d);
}

export function GroupMembership({ memberships }: { memberships: MyGroupMembership[] }) {
  const t = useDict("common").account.group;
  const locale = useLocale();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onLeave(groupId: string) {
    setError(null);
    start(async () => {
      const res = await leaveGroupAction({ locale, groupId });
      setConfirmingId(null);
      if (res.ok) {
        router.refresh();
      } else {
        const map = t.leaveErrors as Record<string, string>;
        setError(map[res.error] ?? t.leaveErrors.db);
      }
    });
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="mb-1 text-lg font-bold">{t.title}</h2>

      {memberships.length > 0 && (
        <div className="mb-6 space-y-3">
          {memberships.map((m) => (
            <div
              key={m.membershipId}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4"
            >
              <div>
                <p className="font-medium text-white">{m.group.name}</p>
                {m.joinedAt && (
                  <p className="text-xs text-zinc-500">
                    {t.joinedOn.replace("{date}", formatDate(m.joinedAt, locale))}
                  </p>
                )}
              </div>

              {m.role === "admin" ? (
                <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-[11px] font-semibold text-zinc-400">
                  {t.adminRole}
                </span>
              ) : confirmingId === m.membershipId ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">{t.confirmLeave}</span>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => onLeave(m.group.id)}
                    className="rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/25 disabled:opacity-60"
                  >
                    {pending ? t.leaving : t.confirmYes}
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => setConfirmingId(null)}
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-500 disabled:opacity-60"
                  >
                    {t.confirmNo}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingId(m.membershipId)}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-red-500/50 hover:text-red-400"
                >
                  {t.leaveButton}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mb-4 text-sm text-red-400" role="status">
          {error}
        </p>
      )}

      <JoinGroupForm />
    </section>
  );
}
