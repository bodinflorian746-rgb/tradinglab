// Landing de l'espace Master : liste des groupes que l'utilisateur administre.
// Réservé aux VRAIS admins actifs de groupe (pas de bypass Super Admin) : si
// l'utilisateur n'administre aucun groupe → 404 (fail-closed).

import { notFound } from "next/navigation";
import Link from "next/link";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";
import { getMyAdminGroups } from "@/lib/loyalty/master";
import { formatDate } from "@/lib/loyalty/admin-format";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400",
  suspended: "bg-red-500/15 text-red-400",
};

export default async function MasterLanding({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = await getDictionary(locale, "master");

  const groups = await getMyAdminGroups();
  if (groups.length === 0) notFound();

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
          {t.brand}
        </p>
        <h1 className="text-3xl font-bold">{t.landing.title}</h1>
        <p className="mt-1 mb-8 text-sm text-zinc-400">{t.landing.subtitle}</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {groups.map((g) => (
            <Link
              key={g.id}
              href={localizedHref(`/master/${g.id}`, locale)}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-emerald-500/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">{g.name}</h2>
                  <p className="font-mono text-xs text-zinc-500">{g.slug}</p>
                </div>
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    STATUS_STYLES[g.status] ?? "bg-zinc-700/40 text-zinc-400"
                  }`}
                >
                  {(t.status as Record<string, string>)[g.status] ?? g.status}
                </span>
              </div>
              <p className="mt-4 text-xs text-zinc-500">{formatDate(g.created_at)}</p>
              <p className="mt-2 text-sm font-medium text-emerald-400">{t.landing.manage} →</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
