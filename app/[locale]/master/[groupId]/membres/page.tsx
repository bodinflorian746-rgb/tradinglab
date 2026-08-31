// Membres d'un groupe (Master) — fusion de l'ancien écran "Membres" (liste
// paginée en lecture seule) et de l'écran "Créditer" du Sprint 1 (recherche +
// crédit) : les deux montraient la même recherche pseudo/email, deux écrans
// séparés faisaient doublon. Sans recherche ni sélection : liste paginée
// classique. Avec recherche (?q=) : résultats filtrés, chaque ligne mène à la
// sélection. Avec un membre sélectionné (?userId=) : fiche + boutons de
// crédit (un par règle ACTIVE du barème) + historique des 10 derniers
// crédits. Guard strict (admin actif du groupe OU Super Admin) → 404.

import { notFound } from "next/navigation";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getGroupAdminUser, listMembersWithPoints, resolveUsernames } from "@/lib/loyalty/master";
import { resolveUserEmails } from "@/lib/loyalty/orders";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizePage, formatDate, formatSignedPoints } from "@/lib/loyalty/admin-format";
import { MasterNav } from "../../_components/MasterNav";
import { TableShell, Tile, TierBadge } from "../../_components/ui";
import { Pager } from "../../_components/MasterControls";
import { CreditButtons } from "./_components/CreditButtons";
import type { GroupPointRule, PointsLedgerEntry } from "@/lib/loyalty/types";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 25;
// Plafond TECHNIQUE (pas une limite métier) : dès qu'une recherche ou une
// sélection est active, on élargit le lot récupéré puis on filtre/valide en
// mémoire — un vrai filtre au niveau base (jointure group_memberships/
// profiles) appartiendrait à lib/loyalty/master.ts, hors périmètre ici.
const SEARCH_FETCH_CAP = 500;
const HISTORY_LIMIT = 10;

function pick(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

async function listActiveRules(groupId: string): Promise<GroupPointRule[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("group_point_rules")
    .select("id, group_id, slug, label, points, is_active, is_system, sort_order, created_at, updated_at")
    .eq("group_id", groupId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data as GroupPointRule[];
}

async function listRecentCredits(
  groupId: string,
  userId: string,
): Promise<Pick<PointsLedgerEntry, "id" | "kind" | "amount" | "rule_label" | "created_at">[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("points_ledger")
    .select("id, kind, amount, rule_label, created_at")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(HISTORY_LIMIT);
  if (error || !data) return [];
  return data as Pick<PointsLedgerEntry, "id" | "kind" | "amount" | "rule_label" | "created_at">[];
}

export default async function MasterMembersPage({
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

  const page = sanitizePage(pick(sp.mpage));
  const q = (pick(sp.q) ?? "").trim().toLowerCase();
  const selectedUserId = pick(sp.userId) ?? null;
  // Recherche OU sélection active : on élargit le lot pour pouvoir filtrer et
  // valider le membre ciblé depuis le MÊME roster (garantit que userId
  // appartient bien à ce groupe — il vient exclusivement de ce roster).
  const wide = Boolean(q) || Boolean(selectedUserId);

  const members = await listMembersWithPoints(groupId, {
    page: wide ? 1 : page,
    pageSize: wide ? SEARCH_FETCH_CAP : PAGE_SIZE,
  });
  const usernames = await resolveUsernames(members.rows.map((m) => m.user_id));
  const emails = wide ? await resolveUserEmails(members.rows.map((m) => m.user_id)) : new Map<string, string | null>();

  const matches = q
    ? members.rows.filter((m) => {
        const uname = (usernames.get(m.user_id) ?? "").toLowerCase();
        const email = (emails.get(m.user_id) ?? "").toLowerCase();
        return uname.includes(q) || email.includes(q);
      })
    : [];

  const selected = selectedUserId ? (members.rows.find((m) => m.user_id === selectedUserId) ?? null) : null;

  const [rules, history] = selected
    ? await Promise.all([listActiveRules(groupId), listRecentCredits(groupId, selected.user_id)])
    : [[] as GroupPointRule[], [] as Awaited<ReturnType<typeof listRecentCredits>>];

  const tierLabels = t.tiers as Record<string, string>;

  // Pagination du mode "browse" (ni recherche, ni sélection) uniquement.
  const totalPages = Math.max(1, Math.ceil(members.total / PAGE_SIZE));

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
          {t.brand}
        </p>
        <h1 className="mb-6 text-3xl font-bold">
          {t.members.title} {!wide && <span className="text-lg font-normal text-zinc-500">({members.total})</span>}
        </h1>

        <MasterNav groupId={groupId} />

        <form method="get" className="mb-6 flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="q" className="mb-1 block text-xs text-zinc-400">
              {t.members.searchLabel}
            </label>
            <input
              id="q"
              type="text"
              name="q"
              defaultValue={q}
              placeholder={t.members.searchPlaceholder}
              className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-emerald-500/50"
          >
            {t.members.search}
          </button>
          {(q || selected) && (
            <a
              href="?"
              className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-emerald-500/50"
            >
              {t.members.reset}
            </a>
          )}
        </form>

        {selected ? (
          <>
            <section className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-white">{usernames.get(selected.user_id) ?? "—"}</p>
                  <p className="text-xs text-zinc-500">{emails.get(selected.user_id) ?? "—"}</p>
                </div>
                <TierBadge tier={selected.tier} label={tierLabels[selected.tier] ?? selected.tier} />
              </div>
              <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Tile
                  label={t.members.th.balance}
                  value={selected.balance}
                  tone={selected.balance >= 0 ? "emerald" : "red"}
                />
              </div>

              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-400">
                {t.members.credit.title}
              </h3>
              <CreditButtons locale={locale} groupId={groupId} userId={selected.user_id} rules={rules} />
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold">
                {t.members.credit.recentTitle} <span className="text-sm font-normal text-zinc-500">({history.length})</span>
              </h2>
              <TableShell
                head={[t.operations.th.date, t.operations.th.kind, t.operations.th.amount]}
                isEmpty={history.length === 0}
                empty={t.members.credit.recentEmpty}
                emptyColspan={3}
              >
                {history.map((h) => (
                  <tr key={h.id} className="border-b border-zinc-800/60 last:border-0">
                    <td className="px-4 py-3 text-zinc-400">{formatDate(h.created_at)}</td>
                    <td className="px-4 py-3 text-zinc-200">
                      {h.rule_label ?? (t.kinds as Record<string, string>)[h.kind] ?? h.kind}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-semibold ${
                        h.amount >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {formatSignedPoints(h.amount)}
                    </td>
                  </tr>
                ))}
              </TableShell>
            </section>
          </>
        ) : q ? (
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-400">
              {t.members.results} ({matches.length})
            </h2>
            {matches.length === 0 ? (
              <p className="text-sm text-zinc-500">{t.members.noResults}</p>
            ) : (
              <ul className="space-y-2">
                {matches.map((m) => (
                  <li key={m.id}>
                    <a
                      href={`?userId=${m.user_id}`}
                      className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3 transition-colors hover:border-emerald-500/40"
                    >
                      <span className="text-sm text-zinc-200">
                        {usernames.get(m.user_id) ?? "—"}{" "}
                        <span className="text-zinc-500">({emails.get(m.user_id) ?? "—"})</span>
                      </span>
                      <span className="text-xs text-emerald-400">{t.members.select}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <>
            <p className="mb-3 text-sm text-zinc-500">{t.members.browseHint}</p>
            <TableShell
              head={[t.members.th.pseudo, t.members.th.balance, t.members.th.tier, ""]}
              isEmpty={members.rows.length === 0}
              empty={members.error ?? t.members.empty}
              emptyColspan={4}
            >
              {members.rows.map((m) => (
                <tr key={m.id} className="border-b border-zinc-800/60 last:border-0">
                  <td className="px-4 py-3 text-xs text-zinc-300">{usernames.get(m.user_id) ?? "—"}</td>
                  <td className={`px-4 py-3 font-semibold ${m.balance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {m.balance}
                  </td>
                  <td className="px-4 py-3">
                    <TierBadge tier={m.tier} label={tierLabels[m.tier] ?? m.tier} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a href={`?userId=${m.user_id}`} className="text-xs font-medium text-emerald-400 hover:underline">
                      {t.members.select}
                    </a>
                  </td>
                </tr>
              ))}
            </TableShell>

            <div className="mt-3">
              <Pager page={page} totalPages={totalPages} param="mpage" />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
