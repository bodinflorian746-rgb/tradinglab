"use client";

// Formulaire de création OU d'édition d'un article du magasin (Master).
// Un seul composant pour les deux cas : `initial` fourni → édition (appelle
// updateShopItemAction), sinon création (createShopItemAction).

import { useState, useTransition } from "react";
import { useDict, useLocale } from "@/app/components/LocaleProvider";
import {
  createShopItemAction,
  updateShopItemAction,
} from "@/app/[locale]/master/actions";
import { SHOP_ITEM_PRICE_MIN, SHOP_ITEM_PRICE_MAX } from "@/lib/loyalty/master-validation";
import type { GroupShopItem } from "@/lib/loyalty/types";

export function ShopItemForm({
  groupId,
  initial,
  onDone,
  onCancel,
}: {
  groupId: string;
  initial?: GroupShopItem;
  onDone?: () => void;
  onCancel?: () => void;
}) {
  const t = useDict("master");
  const locale = useLocale();
  const [pending, start] = useTransition();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [itemType, setItemType] = useState<"product" | "reward">(initial?.item_type ?? "product");
  const [pricePoints, setPricePoints] = useState(initial ? String(initial.price_points) : "");
  const [stock, setStock] = useState(initial?.stock != null ? String(initial.stock) : "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const isEdit = !!initial;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      const res = isEdit
        ? await updateShopItemAction({
            locale,
            groupId,
            itemId: initial!.id,
            name,
            description,
            itemType,
            pricePoints,
            stock,
            imageUrl,
          })
        : await createShopItemAction({ locale, groupId, name, description, itemType, pricePoints, stock, imageUrl });

      if (res.ok) {
        if (!isEdit) {
          setName("");
          setDescription("");
          setItemType("product");
          setPricePoints("");
          setStock("");
          setImageUrl("");
        }
        onDone?.();
      } else {
        const map = t.shop.errors as Record<string, string>;
        setMsg({ ok: false, text: map[res.error] ?? t.shop.errors.db });
      }
    });
  }

  const inputCls =
    "w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none disabled:opacity-50";
  // Suffixe unique par instance : plusieurs ShopItemForm (création + lignes en
  // édition) peuvent coexister sur la même page — des id dupliqués casseraient
  // l'association label/champ (et getByLabel côté tests).
  const uid = initial?.id ?? "new";

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor={`shop-name-${uid}`} className="mb-1.5 block text-xs font-medium text-zinc-400">{t.shop.form.name}</label>
        <input
          id={`shop-name-${uid}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={pending}
          required
          maxLength={120}
          className={inputCls}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`shop-desc-${uid}`} className="mb-1.5 block text-xs font-medium text-zinc-400">
          {t.shop.form.description}
        </label>
        <textarea
          id={`shop-desc-${uid}`}
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          disabled={pending}
          rows={2}
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor={`shop-type-${uid}`} className="mb-1.5 block text-xs font-medium text-zinc-400">{t.shop.form.type}</label>
        <select
          id={`shop-type-${uid}`}
          value={itemType}
          onChange={(e) => setItemType(e.target.value as "product" | "reward")}
          disabled={pending}
          className={inputCls}
        >
          <option value="product">{t.shop.type.product}</option>
          <option value="reward">{t.shop.type.reward}</option>
        </select>
      </div>
      <div>
        <label htmlFor={`shop-price-${uid}`} className="mb-1.5 block text-xs font-medium text-zinc-400">{t.shop.form.price}</label>
        <input
          id={`shop-price-${uid}`}
          type="number"
          min={SHOP_ITEM_PRICE_MIN}
          max={SHOP_ITEM_PRICE_MAX}
          step={1}
          value={pricePoints}
          onChange={(e) => setPricePoints(e.target.value)}
          disabled={pending}
          required
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor={`shop-stock-${uid}`} className="mb-1.5 block text-xs font-medium text-zinc-400">{t.shop.form.stock}</label>
        <input
          id={`shop-stock-${uid}`}
          type="number"
          min={0}
          step={1}
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          disabled={pending}
          placeholder="∞"
          className={inputCls}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`shop-image-${uid}`} className="mb-1.5 block text-xs font-medium text-zinc-400">{t.shop.form.imageUrl}</label>
        <input
          id={`shop-image-${uid}`}
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={pending}
          className={inputCls}
        />
      </div>

      {msg && (
        <p className="sm:col-span-2 text-sm text-red-400" role="status">
          {msg.text}
        </p>
      )}

      <div className="flex gap-2 sm:col-span-2">
        <button
          type="submit"
          disabled={pending || !name.trim() || !pricePoints.trim()}
          className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? t.shop.form.saving : isEdit ? t.shop.form.save : t.shop.form.create}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500"
          >
            {t.shop.form.cancel}
          </button>
        )}
      </div>
    </form>
  );
}
