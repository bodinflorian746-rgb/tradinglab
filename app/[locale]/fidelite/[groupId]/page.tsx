// Historique d'un groupe pour le membre courant (« Fidélité »). Connexion
// requise ; si l'utilisateur n'est pas membre actif de ce groupe → 404 (pas
// de fuite d'existence du groupe à un non-membre).

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";
import { getCurrentMember, getWalletDetail, listMyLedger } from "@/lib/loyalty/member";
import { listActiveShopItemsForMember } from "@/lib/loyalty/shop";
import { formatDate, formatSignedPoints, sanitizePage } from "@/lib/loyalty/admin-format";
import { Tile, TierBadge, TableShell } from "../_components/ui";
import { Pager } from "../_components/Pager";
import { MemberShop } from "../_components/MemberShop";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 25;

function pick(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function FideliteGroupHistory({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; groupId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: raw, groupId } = await params;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const sp = await searchParams;
  const t = await getDictionary(locale, "fidelite");

  const member = await getCurrentMember();
  if (!member) redirect(`/${locale}/login`);

  const { wallet, error } = await getWalletDetail(member.id, groupId);
  if (error) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl">
          <BackLink locale={locale} label={t.nav.back} />
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {t.common.loadError} {error}
          </p>
        </div>
      </main>
    );
  }
  if (!wallet) notFound();

  // Groupe suspendu : aucun accès aux points/historique, y compris pour un
  // membre déjà présent — pas de requête d'historique, écran de verrouillage.
  if (wallet.group.status !== "active") {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white md:py-16">
        <div className="mx-auto max-w-5xl">
          <BackLink locale={locale} label={t.nav.back} />
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <span className="mb-3 inline-block rounded-full bg-red-500/15 px-3 py-1 text-[11px] font-semibold text-red-400">
              {t.suspended.badge}
            </span>
            <h1 className="mb-2 text-xl font-bold">{wallet.group.name}</h1>
            <p className="mb-1 text-lg font-semibold text-red-300">{t.suspended.title}</p>
            <p className="mx-auto max-w-md text-sm text-zinc-400">{t.suspended.message}</p>
          </div>
        </div>
      </main>
    );
  }

  const page = sanitizePage(pick(sp.hpage));
  const history = await listMyLedger(member.id, groupId, { page, pageSize: PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(history.total / PAGE_SIZE));
  const th = t.history.th;

  const { rows: shopItems, error: shopError } = await listActiveShopItemsForMember(groupId);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-5xl">
        <BackLink locale={locale} label={t.nav.back} />

        <div className="mt-3 mb-6 flex items-center gap-3">
          <h1 className="text-3xl font-bold">{wallet.group.name}</h1>
          <TierBadge tier={wallet.tier} label={(t.tiers as Record<string, string>)[wallet.tier]} />
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          <Tile label={t.wallet.balance} value={wallet.balance} tone="emerald" />
          <Tile label={t.wallet.earned} value={wallet.earnedTotal} tone="amber" />
          <Tile label={t.wallet.tier} value={(t.tiers as Record<string, string>)[wallet.tier]} />
        </div>

        <h2 className="mb-3 text-lg font-bold">{t.shop.title}</h2>
        <div className="mb-8">
          <MemberShop groupId={groupId} items={shopItems} balance={wallet.balance} loadError={shopError} />
        </div>

        <h2 className="mb-3 text-lg font-bold">
          {t.history.title} <span className="text-sm font-normal text-zinc-500">({history.total})</span>
        </h2>
        <TableShell
          head={[th.date, th.kind, th.amount, th.code, th.reason]}
          isEmpty={history.rows.length === 0}
          empty={history.error ?? t.history.empty}
          emptyColspan={5}
        >
          {history.rows.map((row) => (
            <tr key={row.id} className="border-b border-zinc-800/60 last:border-0">
              <td className="px-4 py-3 text-zinc-400">{formatDate(row.created_at)}</td>
              <td className="px-4 py-3">{(t.kinds as Record<string, string>)[row.kind] ?? row.kind}</td>
              <td
                className={`px-4 py-3 text-right font-semibold ${
                  row.amount >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {formatSignedPoints(row.amount)}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-500">{row.points_code ?? "—"}</td>
              <td className="px-4 py-3 text-zinc-400">{row.reason ?? "—"}</td>
            </tr>
          ))}
        </TableShell>

        <div className="mt-3">
          <Pager page={page} totalPages={totalPages} />
        </div>
      </div>
    </main>
  );
}

function BackLink({ locale, label }: { locale: Locale; label: string }) {
  return (
    <Link href={localizedHref("/fidelite", locale)} className="text-sm text-emerald-400 hover:underline">
      {label}
    </Link>
  );
}
