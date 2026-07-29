// Validation PURE des entrées Super Admin pour la création de groupe et
// l'attribution d'admin par e-mail (aucun accès DB/serveur → testable
// unitairement). Réutilisée par app/[locale]/admin/loyalty/actions.ts.

export const GROUP_NAME_MAX_LENGTH = 120;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateGroupName(raw: unknown): { ok: true; value: string } | { ok: false } {
  const name = typeof raw === "string" ? raw.trim() : "";
  if (!name || name.length > GROUP_NAME_MAX_LENGTH) return { ok: false };
  return { ok: true, value: name };
}

export function isValidEmail(raw: unknown): raw is string {
  return typeof raw === "string" && EMAIL_RE.test(raw.trim());
}

/**
 * Valide une liste d'adresses e-mail administrateur :
 *   • au moins 1 adresse non vide après nettoyage ;
 *   • chaque adresse doit avoir un format d'e-mail plausible ;
 *   • dédoublonnage insensible à la casse (trim + lowercase).
 * Refuse (ok:false) si la liste est vide/invalide ou si UNE SEULE entrée non
 * vide a un format invalide — mieux vaut échouer tôt que créer un groupe
 * avec un administrateur manquant par faute de frappe silencieusement ignorée.
 */
export function validateAdminEmails(raw: unknown): { ok: true; value: string[] } | { ok: false } {
  if (!Array.isArray(raw)) return { ok: false };
  const seen = new Set<string>();
  const emails: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") return { ok: false };
    const email = item.trim().toLowerCase();
    if (!email) continue; // ligne de formulaire vide, tolérée (pas d'erreur)
    if (!EMAIL_RE.test(email)) return { ok: false };
    if (seen.has(email)) continue;
    seen.add(email);
    emails.push(email);
  }
  if (emails.length === 0) return { ok: false };
  return { ok: true, value: emails };
}

const SLUG_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

function randomSlugSuffix(len: number): string {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += SLUG_ALPHABET[Math.floor(Math.random() * SLUG_ALPHABET.length)];
  }
  return out;
}

/**
 * Dérive un slug lisible à partir du nom du groupe + suffixe aléatoire
 * (garantit l'unicité en pratique — la contrainte unique en base reste le
 * dernier rempart). partner_groups.slug est NOT NULL UNIQUE sans DEFAULT :
 * un slug doit toujours être fourni explicitement à la création.
 */
export function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // retire les accents (é → e, etc.)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "groupe"}-${randomSlugSuffix(6)}`;
}
