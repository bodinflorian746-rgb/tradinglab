"use client";

// Gestion des articles du magasin (Master) : création, édition inline,
// activation/désactivation. Écritures désactivées si le groupe est suspendu
// (canWrite=false, cohérent avec codes/membres). Aucun dashboard supplémentaire :
// une seule liste + un formulaire.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDict, useLocale } from "@/app/components/LocaleProvider";
import { toggleShopItemStatusAction } from "@/app/[locale]/master/actions";
import { TableShell } from "../../../_components/ui";
import { ShopItemForm } from "./ShopItemForm";
import type { GroupShopItem } from "@/lib/loyalty/types";

function StatusToggle({
  groupId,
  item,
}: {
  groupId: string;
  item: GroupShopItem;
}) {
  const t = useDict("master");
  const locale = useLocale();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const next = item.status === "active" ? "inactive" : "active";

  function onClick() {
    setErr(null);
    start(async () => {
      const res = await toggleShopItemStatusAction({ locale, groupId, itemId: item.id, nextStatus: next });
      if (res.ok) {
        router.refresh();
      } else {
        const map = t.shop.errors as Record<string, string>;
        setErr(map[res.error] ?? t.shop.errors.db);
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
        {pending ? t.shop.toggling : item.status === "active" ? t.shop.deactivate : t.shop.activate}
      </button>
      {err && <span className="text-[11px] text-red-400">{err}</span>}
    </div>
  );
}

export function ShopManager({
  groupId,
  canWrite,
  items,
  loadError,
}: {
  groupId: string;
  canWrite: boolean;
  items: GroupShopItem[];
  loadError?: string | null;
}) {
  const t = useDict("master");
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const head = [t.shop.th.name, t.shop.th.type, t.shop.th.price, t.shop.th.stock, t.shop.th.status, ""];

  return (
    <div className="space-y-4">
      {canWrite && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          {creating ? (
            <ShopItemForm
              groupId={groupId}
              onDone={() => {
                setCreating(false);
                router.refresh();
              }}
              onCancel={() => setCreating(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
            >
              {t.shop.newItem}
            </button>
          )}
        </div>
      )}

      <TableShell
        head={head}
        isEmpty={items.length === 0}
        empty={loadError ?? t.shop.empty}
        emptyColspan={head.length}
      >
        {items.map((item) =>
          editingId === item.id ? (
            <tr key={item.id} className="border-b border-zinc-800/60 last:border-0">
              <td colSpan={head.length} className="px-4 py-4">
                <ShopItemForm
                  groupId={groupId}
                  initial={item}
                  onDone={() => {
                    setEditingId(null);
                    router.refresh();
                  }}
                  onCancel={() => setEditingId(null)}
                />
              </td>
            </tr>
          ) : (
            <tr key={item.id} className="border-b border-zinc-800/60 last:border-0">
              <td className="px-4 py-3">
                <p className="font-medium text-zinc-200">{item.name}</p>
                {item.description && (
                  <p className="mt-0.5 max-w-md truncate text-xs text-zinc-500">{item.description}</p>
                )}
              </td>
              <td className="px-4 py-3 text-zinc-400">{t.shop.type[item.item_type]}</td>
              <td className="px-4 py-3 text-amber-400">{item.price_points}</td>
              <td className="px-4 py-3 text-zinc-400">{item.stock ?? "∞"}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    item.status === "active"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-zinc-700/40 text-zinc-400"
                  }`}
                >
                  {t.shop.status[item.status]}
                </span>
              </td>
              <td className="px-4 py-3">
                {canWrite && (
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(item.id)}
                      className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500"
                    >
                      {t.shop.edit}
                    </button>
                    <StatusToggle groupId={groupId} item={item} />
                  </div>
                )}
              </td>
            </tr>
          ),
        )}
      </TableShell>
    </div>
  );
}
