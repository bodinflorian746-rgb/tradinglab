// Membres d'un groupe (Master, lecture seule). Guard strict → 404.

import { notFound } from "next/navigation";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getGroupAdminUser, listMembersWithPoints } from "@/lib/loyalty/master";
import { sanitizePage } from "@/lib/loyalty/admin-format";
import { createAdminClient } from "@/lib/supabase/admin";
import { MasterNav } from "../../_components/MasterNav";
import { TableShell, TierBadge } from "../../_components/ui";
import { Pager } from "../../_components/MasterControls";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 25;
// Plafond TECHNIQUE (pas une limite métier) pour la recherche par pseudo :
// cf. commentaire dans le composant de page, section recherche.
const SEARCH_FETCH_CAP = 500;

function pick(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

// Résolution des pseudos par jointure directe sur public.profiles
// (service_role), PAS par resolveUserEmails() (lib/loyalty/orders.ts, qui
// résout des e-mails via l'API admin GoTrue — hors sujet ici, cf.
// AUDIT_PSEUDO.md). listMembersWithPoints (lib/loyalty/master.ts, hors
// périmètre de cette modification) continue en interne de résoudre un
// e-mail par membre que cet écran n'affiche plus — coût accepté pour rester
// dans le périmètre des fichiers autorisés, non corrigé ici.
async function resolveUsernames(userIds: readonly string[]): Promise<Map<string, string>> {
  const unique = [...new Set(userIds)];
  if (unique.length === 0) return new Map();
  const admin = createAdminClient();
  const { data, error } = await admin.from("profiles").select("id, username").in("id", unique);
  if (error || !data) return new Map();
  return new Map(data.map((p) => [p.id as string, p.username as string]));
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

  // Recherche par pseudo : filtrage HORS de listMembersWithPoints
  // (lib/loyalty/master.ts, hors périmètre des fichiers autorisés pour
  // cette modification) — cette fonction ne connaît pas public.profiles, où
  // vit le pseudo. Sans recherche : comportement inchangé (pagination
  // normale déléguée à listMembersWithPoints). Avec recherche : on récupère
  // un lot large (SEARCH_FETCH_CAP, plafond technique) puis on filtre et on
  // pagine EN MÉMOIRE ici — un vrai filtre au niveau base (jointure
  // group_memberships/profiles) appartiendrait à lib/loyalty/master.ts,
  // hors périmètre ici.
  const members = await listMembersWithPoints(groupId, {
    page: q ? 1 : page,
    pageSize: q ? SEARCH_FETCH_CAP : PAGE_SIZE,
  });
  const usernames = await resolveUsernames(members.rows.map((m) => m.user_id));

  let rows = members.rows;
  let total = members.total;
  if (q) {
    const filtered = rows.filter((m) => (usernames.get(m.user_id) ?? "").toLowerCase().includes(q));
    total = filtered.length;
    const from = (page - 1) * PAGE_SIZE;
    rows = filtered.slice(from, from + PAGE_SIZE);
  }
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const th = t.members.th;
  const tierLabels = t.tiers as Record<string, string>;

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
          {t.brand}
        </p>
        <h1 className="mb-6 text-3xl font-bold">
          {t.members.title} <span className="text-lg font-normal text-zinc-500">({total})</span>
        </h1>

        <MasterNav groupId={groupId} />

        {/* Recherche par pseudo — formulaire GET natif (pas de client
            component : ajouter un filtre à _components/MasterControls.tsx
            aurait constitué un 4e fichier, hors budget de cette
            modification). Soumission = navigation vers ?q=..., cohérent
            avec le principe "filtrage via l'URL" des filtres existants,
            sans mise à jour instantanée à la frappe. */}
        <form method="get" className="mb-4 flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="q" className="mb-1 block text-xs text-zinc-400">
              Rechercher un pseudo
            </label>
            <input
              id="q"
              type="text"
              name="q"
              defaultValue={q}
              placeholder="pseudo..."
              className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-emerald-500/50"
          >
            Rechercher
          </button>
          {q && (
            <a
              href="?"
              className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-emerald-500/50"
            >
              Réinitialiser
            </a>
          )}
        </form>

        <TableShell
          head={["Pseudo" /* remplace th.email : dictionnaire hors périmètre de cette modification */, th.balance, th.tier]}
          isEmpty={rows.length === 0}
          empty={members.error ?? t.members.empty}
          emptyColspan={3}
        >
          {rows.map((m) => (
            <tr key={m.id} className="border-b border-zinc-800/60 last:border-0">
              <td className="px-4 py-3 text-xs text-zinc-300">{usernames.get(m.user_id) ?? "—"}</td>
              <td className="px-4 py-3 font-semibold text-emerald-400">{m.balance}</td>
              <td className="px-4 py-3">
                <TierBadge tier={m.tier} label={tierLabels[m.tier] ?? m.tier} />
              </td>
            </tr>
          ))}
        </TableShell>

        <div className="mt-3">
          <Pager page={page} totalPages={totalPages} param="mpage" />
        </div>
      </div>
    </main>
  );
}
