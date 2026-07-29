// Registre d'un groupe (Master, lecture seule) : opérations + filtres. Guard
// strict → 404. Le ledger est append-only : aucune édition possible.

import { notFound } from "next/navigation";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getGroupAdminUser, listLedger } from "@/lib/loyalty/master";
import {
  formatDate,
  formatSignedPoints,
  parseDateBoundary,
  parseKindFilter,
  parseSignFilter,
  sanitizePage,
  shortId,
} from "@/lib/loyalty/admin-format";
import { MasterNav } from "../../_components/MasterNav";
import { TableShell } from "../../_components/ui";
import { LedgerFilters, Pager } from "../../_components/MasterControls";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 25;

function pick(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function MasterOperationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; groupId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: raw, groupId } = await params;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const sp = await searchParams;
  const t = await getDictionary(locale, "master");

  if (!(await getGroupAdminUser(groupId))) notFound();

  const page = sanitizePage(pick(sp.lpage));
  const ledger = await listLedger(groupId, {
    kind: parseKindFilter(pick(sp.lkind)),
    sign: parseSignFilter(pick(sp.lsign)),
    from: parseDateBoundary(pick(sp.lfrom)),
    to: parseDateBoundary(pick(sp.lto)),
    member: (pick(sp.lmember) ?? "").trim() || null,
    page,
    pageSize: PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(ledger.total / PAGE_SIZE));
  const th = t.operations.th;

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
          {t.brand}
        </p>
        <h1 className="mb-6 text-3xl font-bold">
          {t.operations.title}{" "}
          <span className="text-lg font-normal text-zinc-500">({ledger.total})</span>
        </h1>

        <MasterNav groupId={groupId} />

        <div className="mb-4">
          <LedgerFilters />
        </div>

        <TableShell
          head={[th.date, th.user, th.kind, th.amount, th.code, th.reason, th.author]}
          isEmpty={ledger.rows.length === 0}
          empty={ledger.error ?? t.operations.empty}
          emptyColspan={7}
        >
          {ledger.rows.map((l) => (
            <tr key={l.id} className="border-b border-zinc-800/60 last:border-0">
              <td className="px-4 py-3 text-zinc-400">{formatDate(l.created_at)}</td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-300">{shortId(l.user_id)}</td>
              <td className="px-4 py-3">{(t.kinds as Record<string, string>)[l.kind] ?? l.kind}</td>
              <td
                className={`px-4 py-3 text-right font-semibold ${
                  l.amount >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {formatSignedPoints(l.amount)}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-500">{l.points_code ?? "—"}</td>
              <td className="px-4 py-3 text-zinc-400">{l.reason ?? "—"}</td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-500">{shortId(l.created_by)}</td>
            </tr>
          ))}
        </TableShell>

        <div className="mt-3">
          <Pager page={page} totalPages={totalPages} param="lpage" />
        </div>
      </div>
    </main>
  );
}
