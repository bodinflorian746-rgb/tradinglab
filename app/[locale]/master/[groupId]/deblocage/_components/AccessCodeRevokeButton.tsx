"use client";

// Bouton de révocation d'un code de déblocage disponible (Master). Appelle
// revokeAccessCodeAction ; en cas d'erreur métier, affiche le message localisé.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDict, useLocale } from "@/app/components/LocaleProvider";
import { revokeAccessCodeAction } from "@/app/[locale]/master/actions";

export function AccessCodeRevokeButton({ groupId, code }: { groupId: string; code: string }) {
  const t = useDict("master");
  const locale = useLocale();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function onClick() {
    setErr(null);
    if (!window.confirm(t.unlock.revokeConfirm)) return;
    start(async () => {
      const res = await revokeAccessCodeAction({ locale, groupId, code });
      if (res.ok) {
        router.refresh();
      } else {
        const map = t.unlock.revokeErrors as Record<string, string>;
        setErr(map[res.error] ?? t.unlock.revokeErrors.db);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-red-500/50 hover:text-red-400 disabled:opacity-50"
      >
        {pending ? t.unlock.revoking : t.unlock.revoke}
      </button>
      {err && <span className="text-[11px] text-red-400">{err}</span>}
    </div>
  );
}
