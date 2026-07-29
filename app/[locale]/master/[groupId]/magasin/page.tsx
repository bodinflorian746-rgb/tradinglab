// Magasin d'un groupe (Master) : code de référence, gestion des articles,
// historique des achats des membres. Guard strict (admin actif) → 404.
// Écritures désactivées si le groupe est suspendu.

import { notFound } from "next/navigation";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getGroupAdminUser, getGroupDashboard } from "@/lib/loyalty/master";
import { listShopItemsForManager, listGroupPurchases } from "@/lib/loyalty/shop";
import { formatDate, sanitizePage, shortId } from "@/lib/loyalty/admin-format";
import { MasterNav } from "../../_components/MasterNav";
import { TableShell, SuspendedNotice } from "../../_components/ui";
import { CopyButton } from "../../_components/CopyButton";
import { Pager } from "../../_components/MasterControls";
import { ShopManager } from "./_components/ShopManager";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 25;

function pick(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function MasterShopPage({
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

  const { rows: items, error: itemsError } = await listShopItemsForManager(groupId);

  const pPage = sanitizePage(pick(sp.ppage));
  const purchases = await listGroupPurchases(groupId, { page: pPage, pageSize: PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(purchases.total / PAGE_SIZE));

  const purchasesHead = [t.shop.th.item, t.shop.th.buyer, t.shop.th.pricePaid, t.shop.th.date];

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
          {t.brand} · {dashboard.group.name}
        </p>
        <h1 className="mb-6 text-3xl font-bold">{t.shop.title}</h1>

        <MasterNav groupId={groupId} />

        {!canWrite && <SuspendedNotice text={t.suspendedNotice} />}

        <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-zinc-500">{t.referenceCode.label}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-zinc-200">{dashboard.group.reference_code}</span>
              <CopyButton
                value={dashboard.group.reference_code}
                label={t.referenceCode.copy}
                copiedLabel={t.referenceCode.copied}
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-zinc-500">{t.referenceCode.hint}</p>
        </div>

        <h2 className="mb-3 text-lg font-semibold">{t.shop.itemsTitle}</h2>
        <div className="mb-8">
          <ShopManager groupId={groupId} canWrite={canWrite} items={items} loadError={itemsError} />
        </div>

        <h2 className="mb-3 text-lg font-semibold">{t.shop.purchasesTitle}</h2>
        <TableShell
          head={purchasesHead}
          isEmpty={purchases.rows.length === 0}
          empty={purchases.error ?? t.shop.purchasesEmpty}
          emptyColspan={purchasesHead.length}
        >
          {purchases.rows.map((p) => (
            <tr key={p.id} className="border-b border-zinc-800/60 last:border-0">
              <td className="px-4 py-3 text-zinc-200">{p.item_name ?? "—"}</td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-500">{shortId(p.user_id)}</td>
              <td className="px-4 py-3 text-amber-400">{p.price_paid}</td>
              <td className="px-4 py-3 text-zinc-400">{formatDate(p.created_at)}</td>
            </tr>
          ))}
        </TableShell>
        <div className="mt-3">
          <Pager page={pPage} totalPages={totalPages} param="ppage" />
        </div>
      </div>
    </main>
  );
}
