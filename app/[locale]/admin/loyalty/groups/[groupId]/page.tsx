// Fiche détail d'un groupe partenaire : infos générales, membres, codes,
// registre — avec filtres (période, type, sens, membre, statut de code) et
// pagination via query params. Guard Super Admin (notFound sinon). Écritures
// limitées et ciblées (renommage du groupe, attribution/retrait du rôle
// admin) — le reste de la page reste en lecture seule.

import { notFound } from "next/navigation";
import Link from "next/link";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n/href";
import {
  getCurrentSuperAdmin,
  getGroupDetail,
  listGroupCodes,
  listGroupLedger,
  listGroupMembers,
} from "@/lib/loyalty/admin";
import { resolveUserEmails } from "@/lib/loyalty/orders";
import {
  CODE_STATUS_LABELS,
  GROUP_STATUS_LABELS,
  KIND_LABELS,
  MEMBERSHIP_ROLE_LABELS,
  formatDate,
  formatSignedPoints,
  maskCode,
  parseCodeStatusFilter,
  parseDateBoundary,
  parseKindFilter,
  parseSignFilter,
  sanitizePage,
  shortId,
} from "@/lib/loyalty/admin-format";
import {
  CodeStatusFilter,
  LedgerFilters,
  Pager,
} from "./_components/DetailControls";
import { AssignAdminForm, RenameGroupForm, RoleToggleButton } from "./_components/MemberRoleControls";
import { TelegramEditForm } from "@/app/[locale]/master/_components/TelegramEditForm";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 25;

function pick(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-zinc-800/60 py-3 last:border-0 sm:flex-row sm:justify-between">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="text-sm text-zinc-200">{value}</span>
    </div>
  );
}

const CODE_STATUS_STYLES: Record<string, string> = {
  available: "bg-emerald-500/15 text-emerald-400",
  used: "bg-zinc-700/40 text-zinc-400",
  revoked: "bg-red-500/15 text-red-400",
  expired: "bg-amber-500/15 text-amber-400",
};

export default async function GroupDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; groupId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: rawLocale, groupId } = await params;
  const locale: Locale = hasLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const sp = await searchParams;

  const admin = await getCurrentSuperAdmin();
  if (!admin) notFound();

  const { detail, error } = await getGroupDetail(groupId);
  if (error) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl">
          <BackLink locale={locale} />
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            Erreur de lecture : {error}
          </p>
        </div>
      </main>
    );
  }
  if (!detail) notFound();

  const { group, stats } = detail;

  // ── Paramètres de liste (sanitisés) ──
  const mPage = sanitizePage(pick(sp.mpage));
  const cPage = sanitizePage(pick(sp.cpage));
  const lPage = sanitizePage(pick(sp.lpage));
  const cStatus = parseCodeStatusFilter(pick(sp.cstatus));
  const lKind = parseKindFilter(pick(sp.lkind));
  const lSign = parseSignFilter(pick(sp.lsign));
  const lFrom = parseDateBoundary(pick(sp.lfrom));
  const lTo = parseDateBoundary(pick(sp.lto));
  const lMember = (pick(sp.lmember) ?? "").trim() || null;

  const [members, codes, ledger] = await Promise.all([
    listGroupMembers(groupId, { page: mPage, pageSize: PAGE_SIZE }),
    listGroupCodes(groupId, { status: cStatus, page: cPage, pageSize: PAGE_SIZE }),
    listGroupLedger(groupId, {
      kind: lKind,
      sign: lSign,
      from: lFrom,
      to: lTo,
      member: lMember,
      page: lPage,
      pageSize: PAGE_SIZE,
    }),
  ]);

  // Page réservée au Super Admin (guard ci-dessus) : e-mail réel des membres
  // affiché sans restriction supplémentaire, même mécanisme de résolution
  // que le reste de la console (cf. lib/loyalty/orders.ts).
  const memberEmails = await resolveUserEmails(members.rows.map((m) => m.user_id));

  const pages = (total: number) => Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white md:py-16">
      <div className="mx-auto max-w-5xl space-y-10">
        <div>
          <BackLink locale={locale} />
          <h1 className="mt-3 text-3xl font-bold">{group.name}</h1>
          <p className="mt-1 font-mono text-sm text-zinc-500">{group.slug}</p>
        </div>

        {/* Administration opérationnelle : réutilise telles quelles les pages
            /master/[groupId]/* (mêmes composants, mêmes Server Actions) —
            authorizeGroupWrite/getGroupAdminUser acceptent désormais aussi le
            Super Admin, donc aucune logique n'est dupliquée ici. */}
        <section>
          <h2 className="mb-3 text-lg font-bold">Administration opérationnelle</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={localizedHref(`/master/${groupId}/codes`, locale)}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-emerald-500/40"
            >
              Codes de points →
            </Link>
            <Link
              href={localizedHref(`/master/${groupId}/deblocage`, locale)}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-emerald-500/40"
            >
              Codes de déblocage →
            </Link>
            <Link
              href={localizedHref(`/master/${groupId}/magasin`, locale)}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-emerald-500/40"
            >
              Boutique →
            </Link>
          </div>
        </section>

        {/* Tuiles de synthèse du groupe */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <MiniTile label="Membres" value={stats.members} />
          <MiniTile label="Admins" value={stats.admins} />
          <MiniTile label="Codes" value={stats.codesTotal} />
          <MiniTile label="Valeur codes" value={stats.codeValueTotal} tone="amber" />
          <MiniTile label="Crédités" value={`+${stats.pointsCredited}`} tone="emerald" />
          <MiniTile label="Débités" value={stats.pointsDebited} tone="red" />
          <MiniTile
            label="Solde net"
            value={stats.netBalance}
            tone={stats.netBalance >= 0 ? "emerald" : "red"}
          />
        </div>

        {/* Informations générales */}
        <section>
          <h2 className="mb-3 text-lg font-bold">Informations générales</h2>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-5">
            <div className="flex flex-col gap-2 border-b border-zinc-800/60 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-zinc-500">Nom</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-200">{group.name}</span>
                <RenameGroupForm locale={locale} groupId={groupId} currentName={group.name} />
              </div>
            </div>
            <InfoRow label="Slug" value={<span className="font-mono">{group.slug}</span>} />
            <div className="flex flex-col gap-2 border-b border-zinc-800/60 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-zinc-500">Référence Telegram</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-200">{group.telegram_reference ?? "—"}</span>
                <TelegramEditForm locale={locale} groupId={groupId} currentValue={group.telegram_reference} />
              </div>
            </div>
            <InfoRow
              label="Statut"
              value={GROUP_STATUS_LABELS[group.status] ?? group.status}
            />
            <InfoRow label="Créé par" value={<span className="font-mono">{shortId(group.created_by)}</span>} />
            <InfoRow label="Créé le" value={formatDate(group.created_at)} />
            <InfoRow label="Mis à jour le" value={formatDate(group.updated_at)} />
          </div>
        </section>

        {/* Rôle administrateur — seule écriture de cette console */}
        <section>
          <h2 className="mb-3 text-lg font-bold">Rôle administrateur</h2>
          <AssignAdminForm locale={locale} groupId={groupId} />
        </section>

        {/* Membres */}
        <section>
          <h2 className="mb-3 text-lg font-bold">
            Membres <span className="text-sm font-normal text-zinc-500">({members.total})</span>
          </h2>
          <TableShell
            head={["Utilisateur", "Rôle", "Statut", "Arrivé le", ""]}
            empty={members.error ?? (members.total === 0 ? "Aucun membre." : null)}
            isEmpty={members.rows.length === 0}
            emptyColspan={5}
          >
            {members.rows.map((m) => (
              <tr key={m.id} className="border-b border-zinc-800/60 last:border-0">
                <td className="px-4 py-3 text-xs text-zinc-300">{memberEmails.get(m.user_id) ?? shortId(m.user_id)}</td>
                <td className="px-4 py-3">{MEMBERSHIP_ROLE_LABELS[m.role] ?? m.role}</td>
                <td className="px-4 py-3">{GROUP_STATUS_LABELS[m.status] ?? m.status}</td>
                <td className="px-4 py-3 text-zinc-400">{formatDate(m.joined_at)}</td>
                <td className="px-4 py-3 text-right">
                  <RoleToggleButton locale={locale} groupId={groupId} userId={m.user_id} role={m.role} />
                </td>
              </tr>
            ))}
          </TableShell>
          <div className="mt-3">
            <Pager page={mPage} totalPages={pages(members.total)} param="mpage" />
          </div>
        </section>

        {/* Codes */}
        <section>
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-lg font-bold">
              Codes <span className="text-sm font-normal text-zinc-500">({codes.total})</span>
            </h2>
            <CodeStatusFilter />
          </div>
          <TableShell
            head={["Code", "Valeur", "Statut", "Créé par", "Activé par", "Créé le", "Expire le", "Utilisé le"]}
            empty={codes.error ?? (codes.total === 0 ? "Aucun code." : null)}
            isEmpty={codes.rows.length === 0}
            emptyColspan={8}
          >
            {codes.rows.map((c) => (
              <tr key={c.code} className="border-b border-zinc-800/60 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-zinc-200">
                  {maskCode(c.code, c.status)}
                </td>
                <td className="px-4 py-3 text-amber-400">{c.points_value}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      CODE_STATUS_STYLES[c.status] ?? "bg-zinc-700/40 text-zinc-400"
                    }`}
                  >
                    {CODE_STATUS_LABELS[c.status] ?? c.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-500">{shortId(c.created_by)}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-500">{shortId(c.used_by_user_id)}</td>
                <td className="px-4 py-3 text-zinc-400">{formatDate(c.created_at)}</td>
                <td className="px-4 py-3 text-zinc-400">{formatDate(c.expires_at)}</td>
                <td className="px-4 py-3 text-zinc-400">{formatDate(c.used_at)}</td>
              </tr>
            ))}
          </TableShell>
          <div className="mt-3">
            <Pager page={cPage} totalPages={pages(codes.total)} param="cpage" />
          </div>
        </section>

        {/* Ledger */}
        <section>
          <h2 className="mb-3 text-lg font-bold">
            Registre de points <span className="text-sm font-normal text-zinc-500">({ledger.total})</span>
          </h2>
          <div className="mb-4">
            <LedgerFilters />
          </div>
          <TableShell
            head={["Date", "Utilisateur", "Opération", "Montant", "Code", "Motif", "Auteur"]}
            empty={ledger.error ?? (ledger.total === 0 ? "Aucune opération." : null)}
            isEmpty={ledger.rows.length === 0}
            emptyColspan={7}
          >
            {ledger.rows.map((l) => (
              <tr key={l.id} className="border-b border-zinc-800/60 last:border-0">
                <td className="px-4 py-3 text-zinc-400">{formatDate(l.created_at)}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-300">{shortId(l.user_id)}</td>
                <td className="px-4 py-3">{KIND_LABELS[l.kind] ?? l.kind}</td>
                <td
                  className={`px-4 py-3 text-right font-semibold ${
                    l.amount >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {formatSignedPoints(l.amount)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-500">{l.points_code ?? "—"}</td>
                <td className="px-4 py-3 text-zinc-400">{l.reason ?? "—"}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-500">{shortId(l.created_by)}</td>
              </tr>
            ))}
          </TableShell>
          <div className="mt-3">
            <Pager page={lPage} totalPages={pages(ledger.total)} param="lpage" />
          </div>
        </section>
      </div>
    </main>
  );
}

function BackLink({ locale }: { locale: Locale }) {
  return (
    <Link
      href={localizedHref("/admin/loyalty", locale)}
      className="text-sm text-emerald-400 hover:underline"
    >
      ← Retour à la synthèse
    </Link>
  );
}

function MiniTile({
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
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}

function TableShell({
  head,
  children,
  isEmpty,
  empty,
  emptyColspan,
}: {
  head: string[];
  children: React.ReactNode;
  isEmpty: boolean;
  empty: string | null;
  emptyColspan: number;
}) {
  return (
    <section className="overflow-x-auto rounded-2xl border border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-800 bg-zinc-900/60 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={emptyColspan} className="px-4 py-8 text-center text-zinc-500">
                {empty ?? "Aucun résultat."}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </section>
  );
}
