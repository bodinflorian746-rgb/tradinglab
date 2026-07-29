// Membres d'un groupe (Master, lecture seule). Guard strict → 404.

import { notFound } from "next/navigation";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getGroupAdminUser, listMembers } from "@/lib/loyalty/master";
import { formatDate, sanitizePage, shortId } from "@/lib/loyalty/admin-format";
import { MasterNav } from "../../_components/MasterNav";
import { TableShell } from "../../_components/ui";
import { Pager } from "../../_components/MasterControls";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 25;

function pick(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function MasterMembersPage({
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

  const page = sanitizePage(pick(sp.mpage));
  const members = await listMembers(groupId, { page, pageSize: PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(members.total / PAGE_SIZE));
  const th = t.members.th;

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
          {t.brand}
        </p>
        <h1 className="mb-6 text-3xl font-bold">
          {t.members.title} <span className="text-lg font-normal text-zinc-500">({members.total})</span>
        </h1>

        <MasterNav groupId={groupId} />

        <TableShell
          head={[th.user, th.role, th.status, th.joined]}
          isEmpty={members.rows.length === 0}
          empty={members.error ?? t.members.empty}
          emptyColspan={4}
        >
          {members.rows.map((m) => (
            <tr key={m.id} className="border-b border-zinc-800/60 last:border-0">
              <td className="px-4 py-3 font-mono text-xs text-zinc-300">{shortId(m.user_id)}</td>
              <td className="px-4 py-3">{(t.roles as Record<string, string>)[m.role] ?? m.role}</td>
              <td className="px-4 py-3">{(t.status as Record<string, string>)[m.status] ?? m.status}</td>
              <td className="px-4 py-3 text-zinc-400">{formatDate(m.joined_at)}</td>
            </tr>
          ))}
        </TableShell>

        <div className="mt-3">
          <Pager page={page} totalPages={totalPages} param="mpage" />
        </div>
      </div>
    </main>
  );
}
