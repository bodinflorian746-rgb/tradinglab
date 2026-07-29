"use client";

// Magasin d'un groupe côté Membre : articles actifs, solde, bouton d'achat.
// Appelle purchaseItemAction avec une clé d'idempotence : générée au premier
// clic sur un article, réutilisée tant que cette tentative n'a pas abouti (si
// le clic se répète pendant que la requête est en vol), puis effacée une fois
// la tentative terminée — un nouveau clic ultérieur obtient une clé neuve.
// C'est cette clé, vérifiée EN BASE (contrainte unique côté RPC), qui garantit
// qu'une tentative rejouée ne peut jamais produire un second débit.

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDict, useLocale } from "@/app/components/LocaleProvider";
import { purchaseItemAction } from "@/app/[locale]/fidelite/actions";
import type { GroupShopItem } from "@/lib/loyalty/types";

export function MemberShop({
  groupId,
  items,
  balance,
  loadError,
}: {
  groupId: string;
  items: GroupShopItem[];
  balance: number;
  loadError?: string | null;
}) {
  const t = useDict("fidelite");
  const locale = useLocale();
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const pendingKeys = useRef<Map<string, string>>(new Map());

  function onBuy(item: GroupShopItem) {
    setMsg(null);
    let idempotencyKey = pendingKeys.current.get(item.id);
    if (!idempotencyKey) {
      idempotencyKey = crypto.randomUUID();
      pendingKeys.current.set(item.id, idempotencyKey);
    }
    setPendingId(item.id);
    start(async () => {
      const res = await purchaseItemAction({ locale, groupId, itemId: item.id, idempotencyKey });
      pendingKeys.current.delete(item.id);
      if (res.ok) {
        setMsg({ ok: true, text: t.shop.buySuccess.replace("{name}", item.name) });
        router.refresh();
      } else {
        const map = t.shop.buyErrors as Record<string, string>;
        setMsg({ ok: false, text: map[res.error] ?? t.shop.buyErrors.db });
      }
      setPendingId(null);
    });
  }

  if (items.length === 0) {
    return (
      <p
        className={`rounded-2xl border px-5 py-6 text-center text-sm ${
          loadError
            ? "border-red-500/30 bg-red-500/10 text-red-300"
            : "border-zinc-800 bg-zinc-900/50 text-zinc-500"
        }`}
      >
        {loadError ?? t.shop.empty}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {msg && (
        <p className={`text-sm ${msg.ok ? "text-emerald-400" : "text-red-400"}`} role="status">
          {msg.text}
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const soldOut = item.stock !== null && item.stock <= 0;
          const affordable = balance >= item.price_points;
          const isPending = pending && pendingId === item.id;
          const label = isPending
            ? t.shop.buying
            : soldOut
              ? t.shop.outOfStock
              : affordable
                ? t.shop.buy
                : t.shop.insufficientBalance;
          return (
            <div key={item.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="font-bold text-zinc-100">{item.name}</h3>
                <span className="whitespace-nowrap rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-400">
                  {item.price_points} {t.shop.points}
                </span>
              </div>
              {item.description && <p className="mb-4 text-sm text-zinc-400">{item.description}</p>}
              <button
                type="button"
                onClick={() => onBuy(item)}
                disabled={pending || !affordable || soldOut}
                className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
