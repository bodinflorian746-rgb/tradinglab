"use client";

// Tableau des groupes partenaires (LECTURE SEULE) : recherche, filtre de statut,
// tri et pagination — entièrement côté client sur le tableau des groupes déjà
// agrégé côté serveur (le NOMBRE de groupes reste modeste, contrairement au
// ledger). Aucun bouton d'action (création/modif/suspension/suppression).

import { useMemo, useState } from "react";
import Link from "next/link";
import { localizedHref } from "@/lib/i18n/href";
import type { Locale } from "@/i18n/config";
import type { PartnerGroupWithStats } from "@/lib/loyalty/admin-format";
import { GROUP_STATUS_LABELS, formatDate } from "@/lib/loyalty/admin-format";

type SortKey = "created_at" | "name" | "members" | "credited" | "codes";
type StatusFilter = "all" | "active" | "suspended";
const PAGE_SIZE = 20;

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400",
  suspended: "bg-red-500/15 text-red-400",
};

export function GroupsTable({
  groups,
  locale,
}: {
  groups: PartnerGroupWithStats[];
  locale: Locale;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("created_at");
  const [asc, setAsc] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = groups.filter((g) => {
      if (status !== "all" && g.status !== status) return false;
      if (!q) return true;
      return (
        g.name.toLowerCase().includes(q) || g.slug.toLowerCase().includes(q)
      );
    });
    const val = (g: PartnerGroupWithStats): number | string => {
      switch (sort) {
        case "name":
          return g.name.toLowerCase();
        case "members":
          return g.stats.members;
        case "credited":
          return g.stats.pointsCredited;
        case "codes":
          return g.stats.codesTotal;
        default:
          return g.created_at;
      }
    };
    return [...rows].sort((a, b) => {
      const va = val(a);
      const vb = val(b);
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return asc ? cmp : -cmp;
    });
  }, [groups, search, status, sort, asc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageRows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sort === key) setAsc((v) => !v);
    else {
      setSort(key);
      setAsc(false);
    }
    setPage(1);
  }

  const sortArrow = (key: SortKey) => (sort === key ? (asc ? " ↑" : " ↓") : "");

  return (
    <div className="space-y-4">
      {/* Contrôles */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[180px]">
          <label htmlFor="grp-search" className="mb-1.5 block text-xs font-medium text-zinc-400">
            Rechercher (nom ou slug)
          </label>
          <input
            id="grp-search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="ex. crypto-vip"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="grp-status" className="mb-1.5 block text-xs font-medium text-zinc-400">
            Statut
          </label>
          <select
            id="grp-status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as StatusFilter);
              setPage(1);
            }}
            className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">Tous</option>
            <option value="active">Actifs</option>
            <option value="suspended">Suspendus</option>
          </select>
        </div>
        <p className="ml-auto text-sm text-zinc-500">
          {filtered.length} groupe{filtered.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Tableau */}
      <section className="overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/60 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="cursor-pointer px-4 py-3 font-semibold" onClick={() => toggleSort("name")}>
                Nom{sortArrow("name")}
              </th>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold">Telegram</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="cursor-pointer px-4 py-3 font-semibold" onClick={() => toggleSort("created_at")}>
                Créé le{sortArrow("created_at")}
              </th>
              <th className="cursor-pointer px-4 py-3 text-right font-semibold" onClick={() => toggleSort("members")}>
                Membres{sortArrow("members")}
              </th>
              <th className="px-4 py-3 text-right font-semibold">Admins</th>
              <th className="cursor-pointer px-4 py-3 text-right font-semibold" onClick={() => toggleSort("codes")}>
                Codes{sortArrow("codes")}
              </th>
              <th className="px-4 py-3 text-right font-semibold">Valeur codes</th>
              <th className="cursor-pointer px-4 py-3 text-right font-semibold" onClick={() => toggleSort("credited")}>
                Crédités{sortArrow("credited")}
              </th>
              <th className="px-4 py-3 text-right font-semibold">Débités</th>
              <th className="px-4 py-3 text-right font-semibold">Solde net</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-10 text-center text-zinc-500">
                  {groups.length === 0
                    ? "Aucun groupe partenaire pour l'instant."
                    : "Aucun groupe ne correspond à ces filtres."}
                </td>
              </tr>
            ) : (
              pageRows.map((g) => (
                <tr key={g.id} className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-900/40">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={localizedHref(`/admin/loyalty/groups/${g.id}`, locale)}
                      className="text-emerald-400 hover:underline"
                    >
                      {g.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-400">{g.slug}</td>
                  <td className="px-4 py-3 text-zinc-400">{g.telegram_reference ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        STATUS_STYLES[g.status] ?? "bg-zinc-700/40 text-zinc-400"
                      }`}
                    >
                      {GROUP_STATUS_LABELS[g.status] ?? g.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{formatDate(g.created_at)}</td>
                  <td className="px-4 py-3 text-right text-zinc-200">{g.stats.members}</td>
                  <td className="px-4 py-3 text-right text-zinc-400">{g.stats.admins}</td>
                  <td className="px-4 py-3 text-right text-zinc-200">{g.stats.codesTotal}</td>
                  <td className="px-4 py-3 text-right text-amber-400">{g.stats.codeValueTotal}</td>
                  <td className="px-4 py-3 text-right text-emerald-400">+{g.stats.pointsCredited}</td>
                  <td className="px-4 py-3 text-right text-red-400">{g.stats.pointsDebited}</td>
                  <td className="px-4 py-3 text-right font-semibold text-zinc-100">{g.stats.netBalance}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-3 text-sm">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={current <= 1}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-300 transition-colors hover:border-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Précédent
          </button>
          <span className="text-zinc-500">
            Page {current} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={current >= totalPages}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-300 transition-colors hover:border-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
