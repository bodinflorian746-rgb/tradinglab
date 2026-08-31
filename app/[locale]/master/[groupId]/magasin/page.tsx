// Magasin d'un groupe (Master) : code de référence, gestion des articles,
// historique des achats des membres. Guard strict (admin actif) → 404.
// Écritures désactivées si le groupe est suspendu.

import { notFound } from "next/navigation";
import Link from "next/link";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getGroupAdminUser, getGroupDashboard } from "@/lib/loyalty/master";
import { listShopItemsForManager } from "@/lib/loyalty/shop";
import { localizedHref } from "@/lib/i18n/href";
import { MasterNav } from "../../_components/MasterNav";
import { SuspendedNotice } from "../../_components/ui";
import { CopyButton } from "../../_components/CopyButton";
import { ShopManager } from "./_components/ShopManager";

export const dynamic = "force-dynamic";

export default async function MasterShopPage({
  params,
}: {
  params: Promise<{ locale: string; groupId: string }>;
}) {
  const { locale: raw, groupId } = await params;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
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

        <p className="mb-2 text-sm text-zinc-500">{t.shop.purchasesTitle}</p>
        <Link
          href={localizedHref(`/master/${groupId}/commandes`, locale)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:underline"
        >
          {t.nav.orders} →
        </Link>
      </div>
    </main>
  );
}
