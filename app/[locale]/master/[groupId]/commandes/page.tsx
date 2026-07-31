// Commandes d'un groupe (Master) : liste simple des achats de la boutique
// avec un bouton pour marquer la remise du produit. Guard strict (admin
// actif du groupe OU Super Admin) → 404, même pattern que les autres pages
// Master (magasin, membres, codes). Pas de pagination, pas de filtre, pas de
// badge — liste complète, la plus récente en premier.

import { notFound } from "next/navigation";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getGroupAdminUser, getGroupDashboard } from "@/lib/loyalty/master";
import { listGroupOrders } from "@/lib/loyalty/orders";
import { formatDate, shortId } from "@/lib/loyalty/admin-format";
import { MasterNav } from "../../_components/MasterNav";
import { TableShell, SuspendedNotice } from "../../_components/ui";
import { MarkDeliveredButton } from "./_components/MarkDeliveredButton";

export const dynamic = "force-dynamic";

export default async function MasterOrdersPage({
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

  const orders = await listGroupOrders(groupId);

  const head = [t.orders.th.date, t.orders.th.client, t.orders.th.product, t.orders.th.price, t.orders.th.status, ""];

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
          {t.brand} · {dashboard.group.name}
        </p>
        <h1 className="mb-6 text-3xl font-bold">{t.orders.title}</h1>

        <MasterNav groupId={groupId} />

        {!canWrite && <SuspendedNotice text={t.suspendedNotice} />}

        <TableShell
          head={head}
          isEmpty={orders.rows.length === 0}
          empty={orders.error ?? t.orders.empty}
          emptyColspan={head.length}
        >
          {orders.rows.map((o) => (
            <tr key={o.id} className="border-b border-zinc-800/60 last:border-0">
              <td className="px-4 py-3 text-zinc-400">{formatDate(o.created_at)}</td>
              <td className="px-4 py-3 text-xs text-zinc-300">{o.buyer_email ?? shortId(o.user_id)}</td>
              <td className="px-4 py-3 text-zinc-200">{o.item_name ?? "—"}</td>
              <td className="px-4 py-3 text-amber-400">{o.price_paid === 0 ? t.orders.free : o.price_paid}</td>
              <td className="px-4 py-3 text-zinc-300">
                {o.status === "delivered" ? t.orders.status.delivered : t.orders.status.pending}
              </td>
              <td className="px-4 py-3 text-right">
                {o.status === "pending" && (
                  <MarkDeliveredButton locale={locale} groupId={groupId} orderId={o.id} disabled={!canWrite} />
                )}
              </td>
            </tr>
          ))}
        </TableShell>
      </div>
    </main>
  );
}
