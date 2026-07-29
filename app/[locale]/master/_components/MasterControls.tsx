"use client";

// Contrôles client (Master) : filtre de statut de code, filtres du registre et
// pagination. Ne mutent que les query params (router.replace) — les données
// restent lues côté serveur. Libellés via i18n (namespace master).

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDict } from "@/app/components/LocaleProvider";
import { CODE_STATUSES, LEDGER_KINDS } from "@/lib/loyalty/admin-format";

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

export function CodeStatusFilter() {
  const t = useDict("master");
  const searchParams = useSearchParams();
  const write = useParamWriter();
  return (
    <div>
      <label className="mb-1 block text-xs text-zinc-400">{t.codes.statusFilter}</label>
      <select
        value={searchParams.get("cstatus") ?? ""}
        onChange={(e) => write({ cstatus: e.target.value || null }, "cpage")}
        className={inputCls}
      >
        <option value="">{t.codes.all}</option>
        {CODE_STATUSES.map((s) => (
          <option key={s} value={s}>
            {(t.codeStatus as Record<string, string>)[s]}
          </option>
        ))}
      </select>
    </div>
  );
}

export function LedgerFilters() {
  const t = useDict("master");
  const searchParams = useSearchParams();
  const write = useParamWriter();
  const get = (k: string) => searchParams.get(k) ?? "";
  const f = t.operations.filters;

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className="mb-1 block text-xs text-zinc-400">{f.from}</label>
        <input type="date" defaultValue={get("lfrom")} onChange={(e) => write({ lfrom: e.target.value || null }, "lpage")} className={inputCls} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-400">{f.to}</label>
        <input type="date" defaultValue={get("lto")} onChange={(e) => write({ lto: e.target.value || null }, "lpage")} className={inputCls} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-400">{f.kind}</label>
        <select value={get("lkind")} onChange={(e) => write({ lkind: e.target.value || null }, "lpage")} className={inputCls}>
          <option value="">{f.all}</option>
          {LEDGER_KINDS.map((k) => (
            <option key={k} value={k}>
              {(t.kinds as Record<string, string>)[k]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-400">{f.sign}</label>
        <select value={get("lsign")} onChange={(e) => write({ lsign: e.target.value || null }, "lpage")} className={inputCls}>
          <option value="">{f.all}</option>
          <option value="credit">{f.credit}</option>
          <option value="debit">{f.debit}</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs text-zinc-400">{f.member}</label>
        <input
          type="text"
          defaultValue={get("lmember")}
          onChange={(e) => write({ lmember: e.target.value.trim() || null }, "lpage")}
          className={`${inputCls} w-48 font-mono text-xs`}
        />
      </div>
      <button
        type="button"
        onClick={() => write({ lfrom: null, lto: null, lkind: null, lsign: null, lmember: null }, "lpage")}
        className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-emerald-500/50"
      >
        {f.reset}
      </button>
    </div>
  );
}

export function Pager({ page, totalPages, param }: { page: number; totalPages: number; param: string }) {
  const t = useDict("master");
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
        {t.pager.prev}
      </button>
      <span className="text-zinc-500">{t.pager.page.replace("{p}", String(page)).replace("{t}", String(totalPages))}</span>
      <button
        type="button"
        onClick={() => write({ [param]: String(Math.min(totalPages, page + 1)) })}
        disabled={page >= totalPages}
        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-300 transition-colors hover:border-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t.pager.next}
      </button>
    </div>
  );
}
