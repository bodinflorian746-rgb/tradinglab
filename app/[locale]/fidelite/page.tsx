// Landing de l'espace Membre (« Fidélité ») : deux onglets — « Mes points »
// (actif par défaut : code de points + solde/boutique de chaque groupe
// rejoint) et « Rejoindre un groupe » (code de référence, seul endroit où ce
// formulaire apparaît désormais). Connexion requise (redirect /login) — page
// non privilégiée, pas de 404 fail-closed.

import { redirect } from "next/navigation";
import Link from "next/link";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionaries } from "@/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";
import { getCurrentMember, getMyWallets, type MemberWallet } from "@/lib/loyalty/member";
import { listActiveShopItemsForMember } from "@/lib/loyalty/shop";
import type { GroupShopItem } from "@/lib/loyalty/types";
import { ActivateForm } from "./_components/ActivateForm";
import { JoinGroupForm } from "./_components/JoinGroupForm";
import { FideliteTabs } from "./_components/FideliteTabs";
import { Tile, TierBadge } from "./_components/ui";
import { MemberShop } from "./_components/MemberShop";

export const dynamic = "force-dynamic";

export default async function FideliteLanding({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = await getDictionary(locale, "fidelite");

  const member = await getCurrentMember();
  if (!member) redirect(`/${locale}/login`);

  const wallets = await getMyWallets(member.id);
  const activeWallets = wallets.filter((w) => w.group.status === "active");

  // Boutique de chaque groupe actif chargée en parallèle, réutilise
  // exactement listActiveShopItemsForMember + MemberShop déjà utilisés par
  // app/[locale]/fidelite/[groupId]/page.tsx — aucun second système de
  // boutique.
  const shops = await Promise.all(
    activeWallets.map(async (w) => ({
      groupId: w.group.id,
      ...(await listActiveShopItemsForMember(w.group.id)),
    })),
  );
  const shopByGroup = new Map<string, { rows: GroupShopItem[]; error: string | null }>(
    shops.map((s) => [s.groupId, { rows: s.rows, error: s.error }]),
  );

  const pointsPanel = (
    <div>
      <div className="mb-8">
        <ActivateForm />
      </div>

      {wallets.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-5 py-10 text-center">
          <p className="text-sm font-medium text-zinc-300">{t.landing.none}</p>
          <p className="mt-1 text-sm text-zinc-500">{t.landing.noneHint}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {wallets.map((w) =>
            w.group.status !== "active" ? (
              // Groupe suspendu : aucun point/boutique exposé — le membre n'a
              // plus aucun accès aux données de ce groupe.
              <div
                key={w.group.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 opacity-60"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h2 className="text-lg font-bold text-zinc-400">{w.group.name}</h2>
                  <span className="inline-block rounded-full bg-red-500/15 px-2.5 py-1 text-[11px] font-semibold text-red-400">
                    {t.suspended.badge}
                  </span>
                </div>
                <p className="text-sm text-zinc-500">{t.suspended.landingNotice}</p>
              </div>
            ) : (
              <GroupPointsCard key={w.group.id} wallet={w} shop={shopByGroup.get(w.group.id)} t={t} locale={locale} />
            ),
          )}
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
          {t.brand}
        </p>
        <p className="mb-8 text-sm text-zinc-400">{t.landing.subtitle}</p>

        <FideliteTabs pointsPanel={pointsPanel} joinPanel={<JoinGroupForm />} />
      </div>
    </main>
  );
}

function GroupPointsCard({
  wallet,
  shop,
  t,
  locale,
}: {
  wallet: MemberWallet;
  shop: { rows: GroupShopItem[]; error: string | null } | undefined;
  t: Dictionaries["fidelite"];
  locale: Locale;
}) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold">{wallet.group.name}</h2>
          <TierBadge tier={wallet.tier} label={(t.tiers as Record<string, string>)[wallet.tier]} />
        </div>
        <Link
          href={localizedHref(`/fidelite/${wallet.group.id}`, locale)}
          className="text-sm font-medium text-emerald-400 hover:underline"
        >
          {t.landing.viewHistory} →
        </Link>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Tile label={t.wallet.balance} value={wallet.balance} tone="emerald" />
        <Tile label={t.wallet.earned} value={wallet.earnedTotal} tone="amber" />
        <Tile label={t.wallet.tier} value={(t.tiers as Record<string, string>)[wallet.tier]} />
      </div>

      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-400">{t.shop.title}</h3>
      <MemberShop
        groupId={wallet.group.id}
        items={shop?.rows ?? []}
        balance={wallet.balance}
        loadError={shop?.error}
      />
    </section>
  );
}
