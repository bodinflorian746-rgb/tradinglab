// Gating par liste blanche d'emails pour l'accès au Journal — SERVER-ONLY.
//
// Le Journal est fonctionnel mais pas encore ouvert à tous les premium : seuls
// les emails listés dans JOURNAL_EMAILS peuvent accéder à /journal. Même
// mécanisme que ADMIN_EMAILS (cf. lib/auth/admin.ts) : liste séparée par
// virgules, comparaison case-insensitive après trim, fail-closed si la
// variable est absente/vide (personne n'est autorisé par défaut).
//
// N'expose JAMAIS la liste côté client : pas de préfixe NEXT_PUBLIC_, import
// server-only.

import "server-only";
import type { User } from "@supabase/supabase-js";
import { parseEmailList } from "@/lib/auth/admin";
import { requirePremium } from "@/lib/auth/require-premium";
import { isDevAuthBypass } from "@/lib/dev-auth";

/** Liste blanche d'emails autorisés à accéder au Journal (lowercased, trimmed). */
export function getJournalEmails(): string[] {
  return parseEmailList(process.env.JOURNAL_EMAILS);
}

/**
 * Renvoie true si `userEmail` figure dans JOURNAL_EMAILS.
 * Fail-closed : email vide/absent ou liste vide → false.
 */
export function isJournalAllowed(userEmail: string | null | undefined): boolean {
  // Dev local uniquement (double verrou NODE_ENV + DEV_AUTH_BYPASS, cf. lib/dev-auth.ts).
  if (isDevAuthBypass()) return true;
  if (typeof userEmail !== "string" || userEmail.length === 0) return false;
  const normalized = userEmail.trim().toLowerCase();
  if (normalized.length === 0) return false;
  return getJournalEmails().includes(normalized);
}

export type JournalAccess =
  | { ok: true; user: User }
  | { ok: false; reason: "notLoggedIn" | "forbidden" };

/**
 * Contrôle d'accès serveur à appeler en tête de CHAQUE Server Action du
 * Journal — mêmes règles que app/[locale]/(premium)/journal/layout.tsx :
 * utilisateur connecté (supabase.auth.getUser via requirePremium), accès
 * premium, puis liste blanche JOURNAL_EMAILS. Le layout ne protège que le
 * rendu des pages : une action peut être appelée directement sans lui.
 */
export async function requireJournalAccess(): Promise<JournalAccess> {
  const { user, isPremium } = await requirePremium();
  if (!user) return { ok: false, reason: "notLoggedIn" };
  if (!isPremium || !isJournalAllowed(user.email)) return { ok: false, reason: "forbidden" };
  return { ok: true, user };
}
