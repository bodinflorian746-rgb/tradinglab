// Console Super Admin — Programme de fidélité (LECTURE SEULE).
// Synthèse globale + liste des groupes partenaires avec stats agrégées.
//
// Guard : ADMIN_EMAILS / isAdmin côté serveur → notFound() (404 fail-closed)
// pour tout non-admin, même en appel direct. Aucune écriture ici.

import { notFound } from "next/navigation";
import Link from "next/link";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n/href";
import { getCurrentSuperAdmin, getOverviewAndGroups } from "@/lib/loyalty/admin";
import { GroupsTable } from "./_components/GroupsTable";
import { CreateGroupForm } from "./_components/CreateGroupForm";

export const dynamic = "force-dynamic";

function StatTile({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string | number;
  tone?: "default" | "emerald" | "red" | "amber";
}) {
  const toneClass =
    tone === "emerald"
      ? "text-emerald-400"
      : tone === "red"
        ? "text-red-400"
        : tone === "amber"
          ? "text-amber-400"
          : "text-white";
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}

export default async function AdminLoyaltyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;

  const admin = await getCurrentSuperAdmin();
  if (!admin) notFound();

  const { overview, groups, truncated, error } = await getOverviewAndGroups();

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
            Admin · Programme de fidélité
          </p>
          <h1 className="text-3xl font-bold">Synthèse</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Console d’audit en lecture seule. Connecté en tant que {admin.email}.
          </p>
          <Link
            href={localizedHref("/admin/codes", locale)}
            className="mt-3 inline-block text-sm font-medium text-emerald-400 hover:text-emerald-300"
          >
            Codes d’accès globaux →
          </Link>
        </div>

        {error && (
          <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            Erreur de lecture des données : {error}
            <br />
            <span className="text-red-400/70">
              La migration loyalty est peut-être absente de la base liée.
            </span>
          </p>
        )}
        {truncated && !error && (
          <p className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
            Volume élevé : les agrégats sont plafonnés et peuvent être partiels.
          </p>
        )}

        {/* Groupes */}
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Groupes
        </h2>
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatTile label="Groupes partenaires" value={overview.groupsTotal} />
          <StatTile label="Groupes actifs" value={overview.groupsActive} tone="emerald" />
          <StatTile label="Administrateurs" value={overview.adminsTotal} />
          <StatTile label="Membres" value={overview.membersTotal} />
        </div>

        {/* Codes */}
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Codes de points
        </h2>
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <StatTile label="Codes générés" value={overview.codesTotal} />
          <StatTile label="Disponibles" value={overview.codesAvailable} tone="emerald" />
          <StatTile label="Utilisés" value={overview.codesUsed} />
          <StatTile label="Révoqués" value={overview.codesRevoked} tone="red" />
          <StatTile label="Valeur totale (pts)" value={overview.codeValueTotal} tone="amber" />
        </div>

        {/* Ledger */}
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Registre de points
        </h2>
        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatTile label="Points crédités" value={`+${overview.pointsCredited}`} tone="emerald" />
          <StatTile label="Points débités" value={overview.pointsDebited} tone="red" />
          <StatTile
            label="Solde net global"
            value={overview.netBalance}
            tone={overview.netBalance >= 0 ? "emerald" : "red"}
          />
        </div>

        <div className="mb-8">
          <CreateGroupForm locale={locale} />
        </div>

        {/* Liste des groupes */}
        <h2 className="mb-4 text-xl font-bold">Groupes partenaires</h2>
        <GroupsTable groups={groups} locale={locale} />
      </div>
    </main>
  );
}
