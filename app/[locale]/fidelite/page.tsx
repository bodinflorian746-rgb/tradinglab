// Landing de l'espace Membre (« Fidélité ») : formulaire d'activation de code
// + un portefeuille par groupe où l'utilisateur est membre actif. Connexion
// requise (redirect /login) — page non privilégiée, pas de 404 fail-closed.

import { redirect } from "next/navigation";
import Link from "next/link";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";
import { getCurrentMember, getMyWallets } from "@/lib/loyalty/member";
import { ActivateForm } from "./_components/ActivateForm";
import { JoinGroupForm } from "./_components/JoinGroupForm";
import { Tile, TierBadge } from "./_components/ui";

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

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
          {t.brand}
        </p>
        <h1 className="text-3xl font-bold">{t.landing.title}</h1>
        <p className="mt-1 mb-8 text-sm text-zinc-400">{t.landing.subtitle}</p>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <ActivateForm />
          <JoinGroupForm />
        </div>

        {wallets.length === 0 ? (
          <p className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-5 py-8 text-center text-sm text-zinc-500">
            {t.landing.none}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {wallets.map((w) =>
              w.group.status !== "active" ? (
                // Groupe suspendu : aucun point/lien exposé, carte non cliquable —
                // le membre n'a plus aucun accès aux données de ce groupe.
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
                <Link
                  key={w.group.id}
                  href={localizedHref(`/fidelite/${w.group.id}`, locale)}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-emerald-500/40"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <h2 className="text-lg font-bold">{w.group.name}</h2>
                    <TierBadge tier={w.tier} label={(t.tiers as Record<string, string>)[w.tier]} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Tile label={t.wallet.balance} value={w.balance} tone="emerald" />
                    <Tile label={t.wallet.earned} value={w.earnedTotal} tone="amber" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-emerald-400">{t.landing.viewHistory} →</p>
                </Link>
              ),
            )}
          </div>
        )}
      </div>
    </main>
  );
}
