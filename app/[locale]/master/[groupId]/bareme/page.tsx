// Barème de points d'un groupe (Master) : liste des actions qui rapportent des
// points (label + valeur), créées/renommées/repointées/désactivées librement
// par l'admin — les actions système (semées à la création du groupe) ne sont
// jamais supprimables. Guard strict (admin actif) → 404. Écritures désactivées
// si le groupe est suspendu.

import { notFound } from "next/navigation";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getGroupAdminUser, getGroupCompletionBonus, getGroupDashboard, listGroupPointRules } from "@/lib/loyalty/master";
import { MasterNav } from "../../_components/MasterNav";
import { SuspendedNotice } from "../../_components/ui";
import { BaremeManager } from "./_components/BaremeManager";

export const dynamic = "force-dynamic";

export default async function MasterBaremePage({
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

  const [{ rows: rules, error: rulesError }, { bonus, error: bonusError }] = await Promise.all([
    listGroupPointRules(groupId),
    getGroupCompletionBonus(groupId),
  ]);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
          {t.brand} · {dashboard.group.name}
        </p>
        <h1 className="mb-2 text-3xl font-bold">{t.bareme.title}</h1>
        <p className="mb-6 max-w-2xl text-sm text-zinc-400">{t.bareme.hint}</p>

        <MasterNav groupId={groupId} />

        {!canWrite && <SuspendedNotice text={t.suspendedNotice} />}

        <BaremeManager
          groupId={groupId}
          canWrite={canWrite}
          rules={rules}
          loadError={rulesError}
          bonus={bonus}
          bonusLoadError={bonusError}
        />
      </div>
    </main>
  );
}
