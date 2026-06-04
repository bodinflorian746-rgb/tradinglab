// Helper de gating admin côté serveur.
//
// Source de la liste blanche d'emails admin :
//   1. process.env.ADMIN_EMAILS (pluriel, prioritaire) — séparateur virgule
//   2. process.env.ADMIN_EMAIL  (singulier, fallback compat) — 1 seul email
//
// Migration douce : on ne supprime PAS la lecture de ADMIN_EMAIL pour ne pas
// casser la prod tant que la nouvelle variable n'est pas vérifiée. Le PO
// retirera ADMIN_EMAIL côté Vercel après validation.
//
// Comparaison case-insensitive sur l'email entrant ET sur la liste. Trim sur
// chaque entrée pour tolérer un espace après la virgule (au cas où).
//
// Server-only : n'expose JAMAIS la liste côté client.

import "server-only";

function parseEmailList(raw: string | undefined | null): string[] {
  if (typeof raw !== "string" || raw.length === 0) return [];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);
}

/**
 * Renvoie la liste blanche d'emails admin (lowercased, trimmed, sans vides).
 * Lit ADMIN_EMAILS en priorité, puis ADMIN_EMAIL en fallback. Si les deux
 * sont absents/vides → liste vide → personne n'est admin (fail-closed).
 */
export function getAdminEmails(): string[] {
  const plural = parseEmailList(process.env.ADMIN_EMAILS);
  if (plural.length > 0) return plural;
  return parseEmailList(process.env.ADMIN_EMAIL);
}

/**
 * Renvoie true si `userEmail` figure dans la liste blanche admin.
 * Comparaison case-insensitive après trim. Si userEmail est vide/null
 * → false (fail-closed).
 */
export function isAdmin(userEmail: string | null | undefined): boolean {
  if (typeof userEmail !== "string" || userEmail.length === 0) return false;
  const normalized = userEmail.trim().toLowerCase();
  if (normalized.length === 0) return false;
  return getAdminEmails().includes(normalized);
}
