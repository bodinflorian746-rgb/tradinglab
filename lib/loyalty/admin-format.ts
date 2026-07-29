// Helpers PURS de la console Super Admin fidélité (aucun accès DB, aucune
// dépendance serveur → testables unitairement). Contient :
//   • le masquage des codes (confidentialité) ;
//   • la sanitisation des paramètres de liste/filtre (fail-safe) ;
//   • les agrégations sur les lignes récupérées (KPIs globaux + par groupe).
//
// L'agrégation se fait ici en TS sur des colonnes minimales : l'API d'agrégats
// PostgREST est désactivée sur le projet et aucun DDL n'est déployable dans cet
// environnement. Limite de scaling connue (cf. lib/loyalty/admin.ts) : à
// remplacer par des RPC SQL si le volume du ledger devient important.

import { summarizeLedger } from "@/lib/loyalty/points";
import type {
  LedgerKind,
  PartnerGroup,
  PointsCodeStatus,
} from "@/lib/loyalty/types";

// ─── Lignes minimales récupérées (colonnes utiles seulement) ─────────────────
export type MembershipStatRow = {
  group_id: string;
  role: "admin" | "member";
  status: "active" | "suspended";
};
export type CodeStatRow = {
  group_id: string;
  status: PointsCodeStatus;
  points_value: number;
};
export type LedgerStatRow = {
  group_id: string;
  amount: number;
  kind: LedgerKind;
};

// ─── KPIs ────────────────────────────────────────────────────────────────────
export type LoyaltyOverview = {
  groupsTotal: number;
  groupsActive: number;
  adminsTotal: number;
  membersTotal: number;
  codesTotal: number;
  codesAvailable: number;
  codesUsed: number;
  codesRevoked: number;
  codesExpired: number;
  codeValueTotal: number;
  pointsCredited: number;
  pointsDebited: number; // ≤ 0 (somme des montants négatifs)
  netBalance: number;
};

export type GroupStats = {
  admins: number;
  members: number;
  codesTotal: number;
  codeValueTotal: number;
  pointsCredited: number;
  pointsDebited: number;
  netBalance: number;
};

export type PartnerGroupWithStats = PartnerGroup & { stats: GroupStats };

const emptyGroupStats = (): GroupStats => ({
  admins: 0,
  members: 0,
  codesTotal: 0,
  codeValueTotal: 0,
  pointsCredited: 0,
  pointsDebited: 0,
  netBalance: 0,
});

/** Agrégats globaux à partir des lignes minimales des 4 tables. */
export function buildOverview(
  groups: readonly Pick<PartnerGroup, "status">[],
  memberships: readonly MembershipStatRow[],
  codes: readonly CodeStatRow[],
  ledger: readonly LedgerStatRow[],
): LoyaltyOverview {
  const { credited, debited, net } = summarizeLedger(ledger);
  return {
    groupsTotal: groups.length,
    groupsActive: groups.filter((g) => g.status === "active").length,
    adminsTotal: memberships.filter((m) => m.role === "admin").length,
    membersTotal: memberships.filter((m) => m.role === "member").length,
    codesTotal: codes.length,
    codesAvailable: codes.filter((c) => c.status === "available").length,
    codesUsed: codes.filter((c) => c.status === "used").length,
    codesRevoked: codes.filter((c) => c.status === "revoked").length,
    codesExpired: codes.filter((c) => c.status === "expired").length,
    codeValueTotal: codes.reduce((s, c) => s + (c.points_value ?? 0), 0),
    pointsCredited: credited,
    pointsDebited: debited,
    netBalance: net,
  };
}

/**
 * Agrège les stats par groupe et renvoie chaque groupe enrichi. Chaque ligne
 * source est ventilée sur SON group_id uniquement → aucune fuite inter-groupe.
 */
export function buildGroupsWithStats(
  groups: readonly PartnerGroup[],
  memberships: readonly MembershipStatRow[],
  codes: readonly CodeStatRow[],
  ledger: readonly LedgerStatRow[],
): PartnerGroupWithStats[] {
  const stats = new Map<string, GroupStats>();
  for (const g of groups) stats.set(g.id, emptyGroupStats());

  for (const m of memberships) {
    const s = stats.get(m.group_id);
    if (!s) continue; // groupe inconnu → ignoré (pas de création implicite)
    if (m.role === "admin") s.admins += 1;
    else s.members += 1;
  }
  for (const c of codes) {
    const s = stats.get(c.group_id);
    if (!s) continue;
    s.codesTotal += 1;
    s.codeValueTotal += c.points_value ?? 0;
  }
  for (const l of ledger) {
    const s = stats.get(l.group_id);
    if (!s) continue;
    if (l.amount > 0) s.pointsCredited += l.amount;
    else if (l.amount < 0) s.pointsDebited += l.amount;
    s.netBalance += l.amount;
  }

  return groups.map((g) => ({ ...g, stats: stats.get(g.id) ?? emptyGroupStats() }));
}

// ─── Confidentialité : masquage des codes ────────────────────────────────────
/**
 * Masque partiellement un code selon son statut. Un code 'available' est affiché
 * en clair (cohérent avec l'admin des codes d'accès existant). Tout code
 * used / revoked / expired est masqué : on ne conserve que le dernier segment.
 *   PTS-AB27-9KMN (used) → PTS-••••-9KMN
 */
export function maskCode(code: string, status: PointsCodeStatus): string {
  if (status === "available") return code;
  const parts = code.split("-");
  if (parts.length >= 2) {
    const last = parts[parts.length - 1];
    return `${parts[0]}-••••-${last}`;
  }
  // Format inattendu : ne garder que les 4 derniers caractères.
  return code.length <= 4 ? "••••" : `••••${code.slice(-4)}`;
}

/** Identifiant utilisateur tronqué pour l'audit (jamais l'UUID complet en UI). */
export function shortId(id: string | null | undefined): string {
  if (!id) return "—";
  return `${id.slice(0, 8)}…`;
}

// ─── Sanitisation des paramètres (fail-safe) ─────────────────────────────────
export function sanitizePage(raw: unknown, fallback = 1): number {
  const n = typeof raw === "string" ? parseInt(raw, 10) : Number(raw);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : fallback;
}

export function sanitizePageSize(raw: unknown, fallback = 25, max = 100): number {
  const n = typeof raw === "string" ? parseInt(raw, 10) : Number(raw);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(Math.floor(n), max);
}

export const LEDGER_KINDS: readonly LedgerKind[] = [
  "code_reward",
  "tier_bonus",
  "purchase",
  "manual_credit",
  "manual_debit",
  "cancellation",
  "correction",
];

export const CODE_STATUSES: readonly PointsCodeStatus[] = [
  "available",
  "used",
  "revoked",
  "expired",
];

export function parseKindFilter(raw: unknown): LedgerKind | null {
  return typeof raw === "string" && (LEDGER_KINDS as readonly string[]).includes(raw)
    ? (raw as LedgerKind)
    : null;
}

export function parseCodeStatusFilter(raw: unknown): PointsCodeStatus | null {
  return typeof raw === "string" && (CODE_STATUSES as readonly string[]).includes(raw)
    ? (raw as PointsCodeStatus)
    : null;
}

export type SignFilter = "credit" | "debit";
export function parseSignFilter(raw: unknown): SignFilter | null {
  return raw === "credit" || raw === "debit" ? raw : null;
}

export function parseGroupStatusFilter(
  raw: unknown,
): "active" | "suspended" | null {
  return raw === "active" || raw === "suspended" ? raw : null;
}

/** Convertit une entrée date (YYYY-MM-DD ou ISO) en ISO valide, sinon null. */
export function parseDateBoundary(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

// ─── Libellés (FR) ───────────────────────────────────────────────────────────
export const GROUP_STATUS_LABELS: Record<string, string> = {
  active: "Actif",
  suspended: "Suspendu",
};
export const MEMBERSHIP_ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  member: "Membre",
};
export const CODE_STATUS_LABELS: Record<string, string> = {
  available: "Disponible",
  used: "Utilisé",
  revoked: "Révoqué",
  expired: "Expiré",
};
export const KIND_LABELS: Record<string, string> = {
  code_reward: "Récompense code",
  tier_bonus: "Bonus niveau",
  purchase: "Achat",
  manual_credit: "Crédit manuel",
  manual_debit: "Débit manuel",
  cancellation: "Annulation",
  correction: "Correction",
};

/** Formatage FR d'une date ISO (jour/mois/année), — si absente/invalide. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Points signés lisibles : +50 / -30 / 0. */
export function formatSignedPoints(n: number): string {
  if (n > 0) return `+${n}`;
  return String(n);
}
