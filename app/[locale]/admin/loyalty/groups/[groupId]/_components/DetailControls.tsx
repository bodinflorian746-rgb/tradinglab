"use client";

// Contrôles client de la fiche détail (LECTURE SEULE) : filtres du ledger,
// filtre de statut des codes, et pagination des listes. Ils ne font que muter
// les query params de l'URL (router.replace) — le rendu des données reste
// entièrement côté serveur. Aucune écriture.

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  CODE_STATUSES,
  CODE_STATUS_LABELS,
  KIND_LABELS,
  LEDGER_KINDS,
} from "@/lib/loyalty/admin-format";

function useParamWriter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return useCallback(
    (updates: Record<string, string | null>, resetPageParam?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v === null || v === "") params.delete(k);
        else params.set(k, v);
      }
      if (resetPageParam) params.delete(resetPageParam);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );
}

const inputCls =
  "rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none";

export function LedgerFilters() {
  const searchParams = useSearchParams();
  const write = useParamWriter();
  const get = (k: string) => searchParams.get(k) ?? "";

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className="mb-1 block text-xs text-zinc-400">Du</label>
        <input
          type="date"
          defaultValue={get("lfrom")}
          onChange={(e) => write({ lfrom: e.target.value || null }, "lpage")}
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-400">Au</label>
        <input
          type="date"
          defaultValue={get("lto")}
          onChange={(e) => write({ lto: e.target.value || null }, "lpage")}
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-400">Type d’opération</label>
        <select
          value={get("lkind")}
          onChange={(e) => write({ lkind: e.target.value || null }, "lpage")}
          className={inputCls}
        >
          <option value="">Tous</option>
          {LEDGER_KINDS.map((k) => (
            <option key={k} value={k}>
              {KIND_LABELS[k]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-400">Sens</label>
        <select
          value={get("lsign")}
          onChange={(e) => write({ lsign: e.target.value || null }, "lpage")}
          className={inputCls}
        >
          <option value="">Tous</option>
          <option value="credit">Crédits</option>
          <option value="debit">Débits</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-400">ID membre (UUID)</label>
        <input
          type="text"
          defaultValue={get("lmember")}
          placeholder="uuid complet"
          onChange={(e) => write({ lmember: e.target.value.trim() || null }, "lpage")}
          className={`${inputCls} w-48 font-mono text-xs`}
        />
      </div>
      <button
        type="button"
        onClick={() => write({ lfrom: null, lto: null, lkind: null, lsign: null, lmember: null }, "lpage")}
        className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-emerald-500/50"
      >
        Réinitialiser
      </button>
    </div>
  );
}

export function CodeStatusFilter() {
  const searchParams = useSearchParams();
  const write = useParamWriter();
  return (
    <div>
      <label className="mb-1 block text-xs text-zinc-400">Statut du code</label>
      <select
        value={searchParams.get("cstatus") ?? ""}
        onChange={(e) => write({ cstatus: e.target.value || null }, "cpage")}
        className={inputCls}
      >
        <option value="">Tous</option>
        {CODE_STATUSES.map((s) => (
          <option key={s} value={s}>
            {CODE_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Pager({
  page,
  totalPages,
  param,
}: {
  page: number;
  totalPages: number;
  param: string;
}) {
  const write = useParamWriter();
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-end gap-3 text-sm">
      <button
        type="button"
        onClick={() => write({ [param]: String(Math.max(1, page - 1)) })}
        disabled={page <= 1}
        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-300 transition-colors hover:border-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Précédent
      </button>
      <span className="text-zinc-500">
        Page {page} / {totalPages}
      </span>
      <button
        type="button"
        onClick={() => write({ [param]: String(Math.min(totalPages, page + 1)) })}
        disabled={page >= totalPages}
        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-300 transition-colors hover:border-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Suivant
      </button>
    </div>
  );
}
