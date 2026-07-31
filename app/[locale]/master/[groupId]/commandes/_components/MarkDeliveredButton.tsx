"use client";

// Bouton unique de la page Commandes : marque une commande 'pending' comme
// 'delivered'. Aucune autre action possible (pas de statut intermédiaire,
// pas de retour arrière).

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDict } from "@/app/components/LocaleProvider";
import { markOrderDeliveredAction } from "../actions";

export function MarkDeliveredButton({
  locale,
  groupId,
  orderId,
  disabled,
}: {
  locale: string;
  groupId: string;
  orderId: string;
  disabled?: boolean;
}) {
  const t = useDict("master").orders;
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    setError(null);
    start(async () => {
      const res = await markOrderDeliveredAction({ locale, groupId, orderId });
      if (res.ok) {
        router.refresh();
      } else {
        const map = t.errors as Record<string, string>;
        setError(map[res.error] ?? t.errors.db);
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || pending}
        className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? t.marking : t.markDelivered}
      </button>
      {error && <p className="mt-1 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
