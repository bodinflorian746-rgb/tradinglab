// Crédit d'une contribution affilié (Master). Un membre poste sa contribution
// sur Telegram avec son pseudo du site ; l'affilié le cherche ici (pseudo OU
// email, partiel) et clique un bouton de type de contribution — le montant
// est toujours lu du barème, jamais saisi. Rien n'est envoyé ni stocké depuis
// le site côté membre (pas d'upload, pas de formulaire, pas de boîte de
// réception). Guard strict (admin actif du groupe OU Super Admin) → 404.
//
// Écran MEMBRE et écran d'ÉDITION DU BARÈME : Sprint 2, hors périmètre ici.

import { notFound } from "next/navigation";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getGroupAdminUser, listMembersWithPoints } from "@/lib/loyalty/master";
import { resolveUserEmails } from "@/lib/loyalty/orders";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate, formatSignedPoints } from "@/lib/loyalty/admin-format";
import { MasterNav } from "../../_components/MasterNav";
import { TableShell, Tile, TierBadge } from "../../_components/ui";
import { CreditButtons } from "./_components/CreditButtons";
import type { GroupPointRule, PointsLedgerEntry } from "@/lib/loyalty/types";

export const dynamic = "force-dynamic";
// Plafond TECHNIQUE (pas une limite métier) pour la recherche, même principe
// que membres/page.tsx (SEARCH_FETCH_CAP) : filtrage en mémoire après un
// fetch élargi, pas une jointure au niveau base (hors périmètre ici).
const SEARCH_FETCH_CAP = 500;
const HISTORY_LIMIT = 10;

function pick(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

// Même helper que membres/page.tsx (jointure directe sur public.profiles,
// service_role — PAS resolveUserEmails, qui résout des e-mails, pas des
// pseudos).
async function resolveUsernames(userIds: readonly string[]): Promise<Map<string, string>> {
  const unique = [...new Set(userIds)];
  if (unique.length === 0) return new Map();
  const admin = createAdminClient();
  const { data, error } = await admin.from("profiles").select("id, username").in("id", unique);
  if (error || !data) return new Map();
  return new Map(data.map((p) => [p.id as string, p.username as string]));
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

export default async function MasterCrediterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; groupId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: raw, groupId } = await params;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const sp = await searchParams;

  if (!(await getGroupAdminUser(groupId))) notFound();

  const q = (pick(sp.q) ?? "").trim().toLowerCase();
  const selectedUserId = pick(sp.userId) ?? null;

  // Roster complet (plafonné) du groupe, une seule fois : sert à la fois à
  // chercher (q) et à valider/afficher le membre sélectionné (userId) — ce
  // qui garantit que userId appartient bien à CE groupe (il vient
  // exclusivement de listMembersWithPoints, déjà scopée par groupId).
  const members = await listMembersWithPoints(groupId, { page: 1, pageSize: SEARCH_FETCH_CAP });
  const usernames = await resolveUsernames(members.rows.map((m) => m.user_id));
  const emails = await resolveUserEmails(members.rows.map((m) => m.user_id));

  const matches = q
    ? members.rows.filter((m) => {
        const uname = (usernames.get(m.user_id) ?? "").toLowerCase();
        const email = (emails.get(m.user_id) ?? "").toLowerCase();
        return uname.includes(q) || email.includes(q);
      })
    : [];

  const selected = selectedUserId
    ? (members.rows.find((m) => m.user_id === selectedUserId) ?? null)
    : null;

  const [rules, history] = selected
    ? await Promise.all([listActiveRules(groupId), listRecentCredits(groupId, selected.user_id)])
    : [[] as GroupPointRule[], [] as Awaited<ReturnType<typeof listRecentCredits>>];

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
          TradeScaleX
        </p>
        <h1 className="mb-6 text-3xl font-bold">Créditer une contribution</h1>

        <MasterNav groupId={groupId} />

        <form method="get" className="mb-6 flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="q" className="mb-1 block text-xs text-zinc-400">
              Chercher un membre (pseudo ou e-mail, partiel)
            </label>
            <input
              id="q"
              type="text"
              name="q"
              defaultValue={q}
              placeholder="pseudo ou email..."
              className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-emerald-500/50"
          >
            Rechercher
          </button>
          {(q || selected) && (
            <a
              href="?"
              className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-emerald-500/50"
            >
              Réinitialiser
            </a>
          )}
        </form>

        {q && !selected && (
          <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-400">
              Résultats ({matches.length})
            </h2>
            {matches.length === 0 ? (
              <p className="text-sm text-zinc-500">Aucun membre ne correspond à cette recherche.</p>
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
                      <span className="text-xs text-emerald-400">Sélectionner →</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {selected && (
          <>
            <section className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-white">{usernames.get(selected.user_id) ?? "—"}</p>
                  <p className="text-xs text-zinc-500">{emails.get(selected.user_id) ?? "—"}</p>
                </div>
                <TierBadge
                  tier={selected.tier}
                  label={selected.tier === "gold" ? "Or" : selected.tier === "silver" ? "Argent" : "Bronze"}
                />
              </div>
              <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Tile label="Solde" value={selected.balance} tone="emerald" />
              </div>

              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-400">
                Créditer une contribution
              </h3>
              <CreditButtons locale={locale} groupId={groupId} userId={selected.user_id} rules={rules} />
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold">
                Derniers crédits <span className="text-sm font-normal text-zinc-500">({history.length})</span>
              </h2>
              <TableShell
                head={["Date", "Type", "Montant"]}
                isEmpty={history.length === 0}
                empty="Aucun crédit pour ce membre."
                emptyColspan={3}
              >
                {history.map((h) => (
                  <tr key={h.id} className="border-b border-zinc-800/60 last:border-0">
                    <td className="px-4 py-3 text-zinc-400">{formatDate(h.created_at)}</td>
                    <td className="px-4 py-3 text-zinc-200">{h.rule_label ?? h.kind}</td>
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
        )}

        {!q && !selected && (
          <p className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-6 text-center text-sm text-zinc-500">
            Cherche un pseudo ou un e-mail pour créditer une contribution.
          </p>
        )}
      </div>
    </main>
  );
}
