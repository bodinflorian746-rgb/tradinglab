// Tableau de bord d'un groupe (Master, lecture). Guard strict (admin actif) →
// 404 sinon. Un groupe suspendu reste consultable (bandeau lecture seule).

import { notFound } from "next/navigation";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createClient } from "@/lib/supabase/server";
import { isDevAuthBypass } from "@/lib/dev-auth";
import { canManageGroup } from "@/lib/loyalty/access";
import { getGroupAdminEmails, getGroupAdminUser, getGroupDashboard } from "@/lib/loyalty/master";
import { formatDate, shortId } from "@/lib/loyalty/admin-format";
import { MasterNav } from "../_components/MasterNav";
import { Tile, SuspendedNotice } from "../_components/ui";
import { CopyButton } from "../_components/CopyButton";
import { TelegramEditForm } from "../_components/TelegramEditForm";

export const dynamic = "force-dynamic";

export default async function MasterDashboard({
  params,
}: {
  params: Promise<{ locale: string; groupId: string }>;
}) {
  const { locale: raw, groupId } = await params;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = await getDictionary(locale, "master");

  if (!(await getGroupAdminUser(groupId))) notFound();
  const { dashboard, error } = await getGroupDashboard(groupId);
  if (error && !dashboard) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {t.common.loadError} {error}
          </p>
        </div>
      </main>
    );
  }
  if (!dashboard) notFound();
  const { group, stats } = dashboard;
  const suspended = group.status !== "active";

  // Visibilité de l'e-mail des admins DU GROUPE (attribués via "Attribuer le
  // rôle admin", jamais partner_groups.created_by — un concept distinct,
  // volontairement non touché ici) : re-vérifiée INDÉPENDAMMENT du guard de
  // page ci-dessus (getGroupAdminUser) — jamais un simple flag hérité — pour
  // qu'une éventuelle faille future du guard ne rende pas cette donnée
  // accessible par ricochet. Super Admin, OU l'admin réellement actif de CE
  // groupe précis (jamais un autre groupe, jamais un simple membre).
  let canSeeAdminEmail = isDevAuthBypass();
  if (!canSeeAdminEmail) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    canSeeAdminEmail = !!user && (await canManageGroup(user.id, user.email, groupId));
  }
  const adminEmails = canSeeAdminEmail ? await getGroupAdminEmails(groupId) : [];

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
          {t.brand}
        </p>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <span
            className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              suspended ? "bg-red-500/15 text-red-400" : "bg-emerald-500/15 text-emerald-400"
            }`}
          >
            {(t.status as Record<string, string>)[group.status] ?? group.status}
          </span>
        </div>
        <p className="mb-6 font-mono text-sm text-zinc-500">{group.slug}</p>

        <MasterNav groupId={groupId} />

        {suspended && <SuspendedNotice text={t.suspendedNotice} />}

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Tile label={t.tiles.members} value={stats.members} />
          <Tile label={t.tiles.admins} value={stats.admins} />
          <Tile label={t.tiles.codes} value={stats.codesTotal} />
          <Tile label={t.tiles.codeValue} value={stats.codeValueTotal} tone="amber" />
          <Tile label={t.tiles.credited} value={`+${stats.pointsCredited}`} tone="emerald" />
          <Tile label={t.tiles.debited} value={stats.pointsDebited} tone="red" />
          <Tile
            label={t.tiles.net}
            value={stats.netBalance}
            tone={stats.netBalance >= 0 ? "emerald" : "red"}
          />
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/60 py-3">
            <span className="text-sm text-zinc-500">{t.referenceCode.label}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-zinc-200">{group.reference_code}</span>
              <CopyButton
                value={group.reference_code}
                label={t.referenceCode.copy}
                copiedLabel={t.referenceCode.copied}
              />
            </div>
          </div>
          <p className="border-b border-zinc-800/60 py-3 text-xs text-zinc-500">
            {t.referenceCode.hint}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/60 py-3">
            <span className="text-sm text-zinc-500">Telegram</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-200">{group.telegram_reference ?? "—"}</span>
              <TelegramEditForm locale={locale} groupId={groupId} currentValue={group.telegram_reference} />
            </div>
          </div>
          {canSeeAdminEmail && (
            <div className="flex justify-between border-b border-zinc-800/60 py-3 last:border-0">
              <span className="text-sm text-zinc-500">Administrateur(s)</span>
              <span className="text-sm text-zinc-200">
                {adminEmails.length > 0 ? adminEmails.join(", ") : "—"}
              </span>
            </div>
          )}
          {[
            ["Slug", group.slug],
            [t.codes.th.createdBy, shortId(group.created_by)],
            [t.codes.th.created, formatDate(group.created_at)],
          ].map(([label, value], i) => (
            <div
              key={i}
              className="flex justify-between border-b border-zinc-800/60 py-3 last:border-0"
            >
              <span className="text-sm text-zinc-500">{label}</span>
              <span className="text-sm text-zinc-200">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
