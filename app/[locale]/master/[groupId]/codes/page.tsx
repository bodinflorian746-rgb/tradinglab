// Codes d'un groupe (Master) : génération + révocation + liste filtrable.
// Guard strict (admin actif) → 404. Écritures désactivées si groupe suspendu.

import { notFound } from "next/navigation";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getGroupAdminUser, getGroupDashboard, listCodes } from "@/lib/loyalty/master";
import {
  formatDate,
  maskCode,
  parseCodeStatusFilter,
  sanitizePage,
  shortId,
} from "@/lib/loyalty/admin-format";
import { MasterNav } from "../../_components/MasterNav";
import { TableShell, SuspendedNotice } from "../../_components/ui";
import { GenerateForm } from "../../_components/GenerateForm";
import { RevokeButton } from "../../_components/RevokeButton";
import { CodeStatusFilter, Pager } from "../../_components/MasterControls";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 25;

const CODE_STATUS_STYLES: Record<string, string> = {
  available: "bg-emerald-500/15 text-emerald-400",
  used: "bg-zinc-700/40 text-zinc-400",
  revoked: "bg-red-500/15 text-red-400",
  expired: "bg-amber-500/15 text-amber-400",
};

function pick(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function MasterCodesPage({
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
  const { dashboard, error: dashboardError } = await getGroupDashboard(groupId);
  if (dashboardError && !dashboard) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {t.common.loadError} {dashboardError}
          </p>
        </div>
      </main>
    );
  }
  if (!dashboard) notFound();
  const canWrite = dashboard.group.status === "active";

  const cStatus = parseCodeStatusFilter(pick(sp.cstatus));
  const cPage = sanitizePage(pick(sp.cpage));
  const codes = await listCodes(groupId, { status: cStatus, page: cPage, pageSize: PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(codes.total / PAGE_SIZE));

  const th = t.codes.th;
  const head = [th.code, th.value, th.status, th.createdBy, th.usedBy, th.created, th.expires, th.used, ""];

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
          {t.brand} · {dashboard.group.name}
        </p>
        <h1 className="mb-6 text-3xl font-bold">{t.codes.title}</h1>

        <MasterNav groupId={groupId} />

        {!canWrite && <SuspendedNotice text={t.suspendedNotice} />}

        <div className="mb-8">
          <GenerateForm groupId={groupId} canWrite={canWrite} />
        </div>

        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <p className="text-sm text-zinc-500">{codes.total}</p>
          <CodeStatusFilter />
        </div>

        <TableShell head={head} isEmpty={codes.rows.length === 0} empty={codes.error ?? t.codes.empty} emptyColspan={head.length}>
          {codes.rows.map((c) => (
            <tr key={c.code} className="border-b border-zinc-800/60 last:border-0">
              <td className="px-4 py-3 font-mono text-xs text-zinc-200">{maskCode(c.code, c.status)}</td>
              <td className="px-4 py-3 text-amber-400">{c.points_value}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    CODE_STATUS_STYLES[c.status] ?? "bg-zinc-700/40 text-zinc-400"
                  }`}
                >
                  {(t.codeStatus as Record<string, string>)[c.status] ?? c.status}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-500">{shortId(c.created_by)}</td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-500">{shortId(c.used_by_user_id)}</td>
              <td className="px-4 py-3 text-zinc-400">{formatDate(c.created_at)}</td>
              <td className="px-4 py-3 text-zinc-400">{formatDate(c.expires_at)}</td>
              <td className="px-4 py-3 text-zinc-400">{formatDate(c.used_at)}</td>
              <td className="px-4 py-3 text-right">
                {canWrite && c.status === "available" ? (
                  <RevokeButton groupId={groupId} code={c.code} />
                ) : null}
              </td>
            </tr>
          ))}
        </TableShell>

        <div className="mt-3">
          <Pager page={cPage} totalPages={totalPages} param="cpage" />
        </div>
      </div>
    </main>
  );
}
